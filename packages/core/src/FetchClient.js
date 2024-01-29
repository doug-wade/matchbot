export default (config, db, logger) => {
    return async (url, ...args) => {
        if (config.cache) {
            const cacheEntry = await db.getCacheEntry(url);
            
            if (cacheEntry) {
                logger.debug('Returning cached result for', url);

                return Promise.resolve(JSON.parse(cacheEntry.response));
            } else {
                logger.debug('Cache miss for url', url);
            }
        }

        const result = await fetch(url, ...args);
        const json = await result.json();

        if (config.cache && result.status >= 200 && result.status < 300) {
            db.putCacheEntry(url, JSON.stringify(json));
        }

        return json;
    };
};
