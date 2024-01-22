import databaseClient from './DatabaseClient.js';
import fetchFactory from './FetchClient.js';
import lemmyClient from './LemmyClient.js';
import Logger from './Logger.js';

export default async (userConfig) => {
    const config = {
        dryRun: userConfig.dryRun || false,
        cache: userConfig.cache || 0,
        instance: userConfig.instance || 'lemmy.world',
        verbose: userConfig.verbose || false,
        previewPollInterval: userConfig.previewPollInterval || 28800000,
        threadPollInterval: userConfig.threadPollInterval || 300000,
        fixturePollInterval: userConfig.fixturePollInterval || 86400000,
        userAgent: userConfig.userAgent || 'Mozilla/5.0 (compatible; @matchbot/1.0; +https://github.com/doug-wade/matchbot)',
        databaseFilename: userConfig.databaseFilename || 'matchbot.db',
        plugins: userConfig.plugins || [],
    };

    const logger = new Logger(config);

    logger.log('creating bot with config', config);

    logger.log('creating database', config.databaseFilename, 'with cache', config.cache, 'ms');
    const db = await databaseClient(config, logger);
    const fetch = fetchFactory(config, db, logger);

    logger.log('logging bot into lemmy instance', config.instance, 'as', process.env.LEMMY_USERNAME);
    const lemmy = await lemmyClient(config, logger);

    const plugins = config.plugins.map(plugin => {
        return new plugin.plugin({
            ...config,
            db,
            fetch,
            lemmy,
            logger,
            config: plugin.config,
            community_id: plugin.community_id,
        });
    });

    // Fetch future threads from all plugins to seed the database
    const updateFixtures = async () => {
        return Promise.all(plugins.map(async plugin => {
            logger.log(`Fetching fixtures for plugin ${plugin.name}`);
            const matchThreads = await plugin.fixtures();

            matchThreads.forEach(futureThread => {
                db.putThread(futureThread, plugin.name);
            });
        }));
    };

    const updatePreviews = async () => {
        const cutoff = new Date();
        cutoff.setMilliseconds(cutoff.getMilliseconds() + config.previewPollInterval);
        const matchesToPreview = await db.getMatchesByTimestamp(cutoff);

        if (matchesToPreview.length === 0) {
            logger.debug('No matches to preview');
        } else {
            logger.debug(`Found ${matchesToPreview.length} matches to preview`);

            matchesToPreview.forEach(async (match) => {
                const plugin = plugins.find(plugin => plugin.name === match.pluginName);

                const preview = await plugin.preview(match);

                logger.log(`Creating match preview for fixture with id ${match.id}`);

                plugin.lemmy.createPost(preview, plugin.community_id);
                db.updateThreadPreviewed(match.id);
            });
        }
    };

    const updateThreads = async () => {
        const matchThreadsToUpdate = db.getLiveMatches();

        if (!matchThreadsToUpdate.length || matchThreadsToUpdate.length === 0) {
            logger.debug('No match threads to update');
        } else {
            logger.debug(`Found ${matchThreadsToUpdate.length} match threads to update`);

            matchThreadsToUpdate.forEach(async (match) => {
                const plugin = plugins.find(plugin => plugin.name === match.pluginName)[0];
                const matchThread = await plugin.postMatchThread(match);

                logger.log(`Updating match thread for fixture with id ${match.id}`);

                plugin.lemmy.updatePost(match.matchThreadUrl, matchThread);
            });
        }
    };

    logger.log('Scheduling polling intervals');
    setInterval(() => {
        updateFixtures();
    }, config.fixturePollInterval);

    setInterval(() => {
        updatePreviews();
    }, config.threadPollInterval);

    setInterval(() => {
        updateThreads();
    }, config.previewPollInterval);

    logger.log('Doing initial fetch to seed database');
    await updateFixtures();
    await updatePreviews();
    await updateThreads();

    logger.log('Bot created');
};
