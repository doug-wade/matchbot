import sqlite3 from 'sqlite3';

class DatabaseClient {
    constructor(config, logger) {
        this.cache = config.cache;
        this.previewThreadInterval = config.previewThreadInterval;
        this.logger = logger;
        this.logger.debug('Creating database client');
        this.db = new sqlite3.Database(config.databaseFilename);
    }

    async init() {
        await this.#createTable('threads', {
            id: 'TEXT PRIMARY KEY',
            date: 'DATE',
            name: 'TEXT',
            args: 'JSON',
            matchThreadUrl: 'TEXT',
            previewed: 'BOOLEAN',
            previewThreadUrl: 'TEXT',
            completed: 'BOOLEAN',
            pluginName: 'TEXT',
        });

        if (this.cache) {
            await this.#createTable('cache', {
                url: 'TEXT PRIMARY KEY',
                response: 'TEXT',
                expiryDate: 'DATE',
            });
        }
    }

    async putThread(thread, pluginName) {
        if (!thread.id) {
            throw new Error('Thread must have an id');
        }

        if (!thread.name) {
            throw new Error('Thread must have a name');
        }

        this.logger.log(`Putting thread id ${thread.id} to database with name ${thread.name}`);

        // Check if thread already exists
        const existingThread = await this.#getThreadById(thread.id);
        if (existingThread) {
            this.logger.debug(`Thread id ${existingThread.id} already exists in database, updating thread`);
            return new Promise((res, rej) => {
                this.db.run('UPDATE threads SET name = $name, args = $args, completed = $completed, pluginName = $pluginName WHERE id=$id', {
                    $id: existingThread.id,
                    $name: thread.name,
                    $args: thread.args,
                    $completed: thread.completed,
                    $pluginName: pluginName,
                }, (err) => {
                    if (err) {
                        this.logger.error('Error updating thread', err);
                        return rej(err);
                    }

                    res(existingThread.id);
                });
            });
        }

        // Save thread to database
        this.logger.log('Creating new thread', thread);
        return new Promise((res, rej) => {
            this.db.run(
                'INSERT INTO threads(id, date, name, args, previewed, completed, pluginName) VALUES($id, $date, $name, $args, $previewed, $completed, $pluginName)',
                {
                    $id: thread.id,
                    $date: thread.date,
                    $name: thread.name,
                    $args: JSON.stringify(thread.args),
                    $previewed: false,
                    $completed: thread.completed,
                    $pluginName: pluginName,
                },
                (err) => {
                    if (err) {
                        this.logger.error('Error creating new thread', err);
                        return rej(err);
                    }

                    this.logger.debug('New thread added with id ', thread.id);
                    res(thread.id);
                }
            );
        });
    }

    async addPreviewUrlToThread(id, previewThreadUrl) {
        return new Promise((res, rej) => {
            db.run('UPDATE threads SET previewThreadUrl = $previewThreadUrl WHERE id = $id', {
                $id: id,
                $previewThreadUrl: previewThreadUrl
            }, (err, thread) => {
                if (err) {
                    this.logger.error('Error adding previewThreadUrl to thread', err);
                    return rej(err);
                }

                this.logger.debug(`Added previewThreadUrl ${previewThreadUrl}to thread ${id}`);
                res(thread);
            });
        });
    }

    async addMatchThreadUrlToThread(id, matchThreadUrl) {
        return new Promise((res, rej) => {
            db.run('UPDATE threads SET matchThreadUrl = $matchThreadUrl WHERE id = $id', {
                $id: id,
                $matchThreadUrl: matchThreadUrl
            }, (err, thread) => {
                if (err) {
                    this.logger.error('Error adding matchThreadUrl to thread', err);
                    return rej(err);
                }

                this.logger.debug(`Added previewThreadUrl ${previewThreadUrl}to thread ${id}`);
                res(thread);
            });
        });
    }

    async getThreadsNeedingPreview() {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - this.previewThreadInterval);
        this.logger.debug('Getting threads needing preview after date', cutoff);

        return new Promise((res, rej) => {
            this.db.get('threads', { previewed: false, date: { $gt: cutoff } }, (err, threads) => {
                if (err) {
                    this.logger.error('Error getting threads needing preview', err);
                    return rej(err);
                }
                
                res(threads);
            });
        });
    }

    async getLiveMatches() {
        const now = Date.now();
        return new Promise((res, rej) => {
            this.db.all('SELECT * FROM threads WHERE date < $now AND completed = false;',
            { $now: now },
            (err, threads) => {
                if (err) {
                    this.logger.error('Error getting threads needing preview', err);
                    return rej(err);
                }
                
                res(threads);
            });
        });
    }

    async getMatchesByTimestamp(cutoff) {
        const cutoffTimestamp = Math.floor(cutoff.valueOf() / 1000); 
        const nowTimestamp = Math.floor(Date.now() / 1000);

        return new Promise((res, rej) => {
            this.db.all(
                'SELECT * FROM threads WHERE date < $date AND date > $now;', 
                { $date: cutoffTimestamp, $now: nowTimestamp }, 
                (err, threads) => {
                    if (err) {
                        this.logger.error('Error getting threads needing preview', err);
                        return rej(err);
                    }
                    
                    res(threads);
                }
            );
        });
    }

    async getCacheEntry(url) {
        this.logger.debug('Getting cache entry', url);

        return new Promise((res, rej) => {
            this.db.get('SELECT * FROM cache WHERE url=$url', { $url: url }, (err, result) => {
                if (err) {
                    this.logger.error('Error getting cache entry', err);
                    return rej(err);
                }
                
                res(result);
            });
        });
    }

    async putCacheEntry(url, response) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + (this.cache / 3600000));

        return new Promise((res, rej) => {
            this.db.run(
                'INSERT INTO cache (url, response, expiryDate) VALUES ($url, $response, $expiryDate)', { 
                    $url: url, 
                    $response: response,
                    $expiryDate: expiryDate
                }, (err, result) => {
                    if (err) {
                        this.logger.error('Error putting cache entry', err);
                        return rej(err);
                    }

                    this.logger.debug('Put cache entry for url', url, 'with result', result);
                    res(result);
                }
            );
        });
    }

    async expireCacheEntries() {
        const cutoff = new Date();

        return new Promise((res, rej) => {
            this.db.delete('cache', { expires: { $lt: cutoff } }, (err, results) => {
                if (err) {
                    this.logger.error('Error expiring cache entries', err);
                    return rej(err);
                }

                this.logger.debug(`Expired ${results.length} cache entries expired before cutoff`, cutoff);
                res(results);
            });
        });
    }

    async updateThreadPreviewed(id) {
        return new Promise((res, rej) => {
            this.db.run('UPDATE threads SET previewed = true WHERE id = $id', 
                { $id: id },
                (err, thread) => {
                    if (err) {
                        this.logger.error('Error updating thread', err);
                        return rej(err);
                    }

                    res(thread);
                }
            );
        });
    }

    async #createTable(tableName, schema) {
        const columns = Object.entries(schema).map(([name, type]) => `${name} ${type}`).join(', ');

        this.logger.debug('Creating table', tableName, columns);

        return new Promise((res, rej) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`, (err) => {
                if (err) {
                    this.logger.error('Error creating table', err);
                    return rej(err);
                }

                this.logger.debug('Table created', tableName);
                res();
            });
        });
    }

    async #getThreadById(id) {
        return new Promise((res, rej) => {
            this.db.get('SELECT * FROM threads WHERE id = $id', 
                { $id: id },
                (err, thread) => {
                    if (err) {
                        this.logger.error('Error getting thread', err);
                        return rej(err);
                    }

                    res(thread);
                }
            );
        });
    }
}

let dbClient;
export default async (config, logger) => {
    if (dbClient) {
        return dbClient;
    }

    const localDbClient = new DatabaseClient(config, logger);
    await localDbClient.init();
    dbClient = localDbClient;

    return dbClient;
}