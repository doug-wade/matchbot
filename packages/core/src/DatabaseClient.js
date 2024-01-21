import sqlite3 from 'sqlite3';

class DatabaseClient {
    constructor(config, logger) {
        this.cache = config.cache;
        this.previewThreadInterval = config.previewThreadInterval;
        this.logger = logger;
        this.logger.debug('Creating database client');
        this.db = new sqlite3.Database(config.databaseFilename);

        this.#createTable('threads', {
            id: 'TEXT PRIMARY KEY',
            date: 'DATE',
            name: 'TEXT',
            args: 'JSON',
            matchThreadUrl: 'TEXT',
            previewed: 'BOOLEAN',
            previewThreadUrl: 'TEXT',
        });

        if (config.cache) {
            this.#createTable('cache', {
                url: 'TEXT PRIMARY KEY',
                response: 'TEXT',
                expiryDate: 'DATE',
            });
        }
    }

    async putThread(thread) {
        this.logger.log('Putting thread to database', thread);

        // Check if thread already exists
        const existingThread = this.db.get('threads', { name: thread.name, id: thread.id });
        if (existingThread) {
            this.logger.debug('Thread already exists in database, updating thread');
            this.db.update('threads', existingThread.id, thread);

            return;
        }

        // Save thread to database
        this.logger.log('Creating new thread', thread);
        return new Promise((res, rej) => {
            db.run(
                `INSERT INTO threads(Name) VALUES(?)`, 
                thread,
                (err) => {
                    if (err) {
                        this.logger.error('Error creating new thread', err);
                        rej(err);
                    }

                    this.logger.debug('New thread added with id ', this.lastID);
                    res(this.lastID);
                }
            );
        });
    }

    async addPreviewUrlToThread(threadId, previewThreadUrl) {
        return new Promise((res, rej) => {
            db.run("UPDATE threads SET previewThreadUrl = $previewThreadUrl WHERE id = $id", {
                $id: id,
                $previewThreadUrl: previewThreadUrl
            }, (err, thread) => {
                if (err) {
                    this.logger.error('Error adding previewThreadUrl to thread', err);
                    rej(err);
                }

                this.logger.debug(`Added previewThreadUrl ${previewThreadUrl}to thread ${id}`);
                res(thread);
            });
        });
    }

    async addMatchThreadUrlToThread(id, matchThreadUrl) {
        return new Promise((res, rej) => {
            db.run("UPDATE threads SET matchThreadUrl = $matchThreadUrl WHERE id = $id", {
                $id: id,
                $matchThreadUrl: matchThreadUrl
            }, (err, thread) => {
                if (err) {
                    this.logger.error('Error adding matchThreadUrl to thread', err);
                    rej(err);
                }

                this.logger.debug(`Added previewThreadUrl ${previewThreadUrl}to thread ${id}`);
                res(thread);
            });
        });
    }

    async getThreadsNeedingPreview() {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - this.config.previewThreadInterval);
        this.logger.debug('Getting threads needing preview after date', cutoff);

        return new Promise((res, rej) => {
            this.db.get('threads', { previewed: false, date: { $gt: cutoff } }, (err, threads) => {
                if (err) {
                    rej(err);
                }
                
                res(threads);
            });
        });
    }

    async getCacheEntry(url) {
        this.logger.debug('Getting cache entry', url);

        return new Promise((res, rej) => {
            this.db.get('SELECT * FROM cache WHERE url=$url', { $url: url }, (err, result) => {
                if (err) {
                    this.logger.error('Error getting cache entry', err);
                    rej(err);
                }

                if (result) {
                    this.logger.debug('Got cache entry', result);
                }
                
                res(result);
            });
        });
    }

    async putCacheEntry(url, response) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + this.config.cacheExpiryHours);

        return new Promise((res, rej) => {
            this.db.run(
                'INSERT INTO cache (url, response) VALUES ($url, $response)', { 
                    $url: url, 
                    $response: response,
                    $expiryDate: expiryDate
                }, (err, result) => {
                    if (err) {
                        rej(err);
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
                    rej(err);
                }

                this.logger.debug(`Expired ${results.length} cache entries expired before cutoff`, cutoff);
                res(results);
            });
        });
    }

    #createTable(tableName, schema) {
        const columns = Object.entries(schema).map(([name, type]) => `${name} ${type}`).join(', ');

        this.logger.debug('Creating table', tableName, columns);
        this.db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
    }
}

export default DatabaseClient;