import DatabaseClient from './DatabaseClient.js';
import fetchFactory from './FetchClient.js';
import LemmyClient from './LemmyClient.js';
import Logger from './Logger.js';

export default (userConfig) => {
    const config = {
        dryRun: userConfig.dryRun || false,
        previewThreadInterval: userConfig.previewThreadInterval || 28800000,
        cache: userConfig.cache || 0,
        instance: userConfig.instance || 'lemmy.world',
        verbose: userConfig.verbose || false,
        matchPollInterval: userConfig.matchPollInterval || 300000,
        fixturePollInterval: userConfig.fixturePollInterval || 86400000,
        userAgent: userConfig.userAgent || 'Mozilla/5.0 (compatible; @matchbot/1.0; +https://github.com/doug-wade/matchbot)',
        databaseFilename: userConfig.databaseFilename || 'matchbot.db',
        plugins: userConfig.plugins || [],
    };

    const logger = new Logger(config);

    logger.debug('creating bot with config', config);

    const db = new DatabaseClient(config, logger);
    const fetch = fetchFactory(config, db, logger);

    const plugins = config.plugins.map(plugin => {
        const lemmy = new LemmyClient(config);

        return new plugin.plugin({
            ...config,
            db,
            fetch,
            lemmy,
            logger,
            config: plugin.config
        });
    });

    // Fetch future threads from all plugins to seed the database
    plugins.forEach(async plugin => {
        const matchThreads = await plugin.fixtures();

        matchThreads.forEach(futureThread => {
            db.putThread(futureThread);
        });
    });

    // Start a timer to schedule threads when we find fixtures
    setInterval(() => {
        plugins.forEach(plugin => {
            const matchThreads = plugin.fixtures();

            matchThreads.forEach(thread => {
                db.putThread(thread);
            });
        });
    }, config.fixturePollInterval);

    // Start a timer to check for match previews every 5 minutes
    setInterval(() => {
        const matchesToPreview = db.getMatchesByTimestamp(new Date());

        if (matchesToPreview.length === 0) {
            logger.debug('No matches to preview');
        } else {
            logger.debug(`Found ${matchesToPreview.length} matches to preview`);

            matchesToPreview.forEach(async (match) => {
                const plugin = plugins.find(plugin => plugin.name === matchesToPreview.name)[0];
                const preview = await plugin.preview(match);

                logger.log(`Creating match preview for fixture with id ${match.id}`);

                plugin.lemmy.createPost(preview);
                db.updateThreadPreviewed(match.id);
            });
        }

        const matchThreadsToUpdate = db.getLiveMatchesByTimestamp(new Date());

        if (matchThreadsToUpdate.length === 0) {
            logger.debug('No match threads to update');
        } else {
            logger.debug(`Found ${matchThreadsToUpdate.length} match threads to update`);

            matchThreadsToUpdate.forEach(async (match) => {
                const plugin = plugins.find(plugin => plugin.name === matchesToPreview.name)[0];
                const matchThread = await plugin.postMatchThread(match);

                logger.log(`Updating match thread for fixture with id ${match.id}`);

                plugin.lemmy.updatePost(match.matchThreadUrl, matchThread);
            });
        }
    }, config.matchPollInterval);
};
