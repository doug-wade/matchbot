export default (config, db, logger) => {
    if (config.dryRun) {
        logger.debug('Dry run, returning logging fetch client');

        return async (...args) => {
            logger.debug('Dry run, not fetching', ...args);
            return Promise.resolve({ 
                async json() { 
                    // We can be everything to everyone I swear!
                    const strangeArr = [];
                    strangeArr.response = [];

                    return strangeArr; 
                }
            });
        }
    }

    return async (url, ...args) => {
        if (config.cache) {
            const cacheEntry = await db.getCacheEntry(url);
            
            if (cacheEntry) {
                logger.debug('Returning cached result for', url);

                return { 
                    async json() {
                        return Promise.resolve(JSON.parse(cacheEntry.response));
                    }
                };
            } else {
                logger.debug('Cache miss for url', url);
            }
        }

        const result = await fetch(url, ...args);

        if (config.cache) {
            db.putCacheEntry(url, await result.text());
        }

        return result;
    }
}