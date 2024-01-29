import assert from 'node:assert';
import { describe, it } from 'node:test';
import Plugin from '../src/Plugin.js';

describe('Plugin', async () => {
    it('should be a function', async () => {
        assert.strictEqual(typeof Plugin, 'function');
    });

    it('should have the correct properties', async () => {
        const instance = 'lemmy.world';
        const community_id = 123456;
        const db = {};
        const fetch = () => {};
        const lemmy = {};
        const logger = {};

        const plugin = new Plugin({
            instance,
            community_id,
            db,
            fetch,
            lemmy,
            logger,
        });

        assert.strictEqual(plugin.instance, instance);
        assert.strictEqual(plugin.community_id, community_id);
        assert.strictEqual(plugin.db, db);
        assert.strictEqual(plugin.fetch, fetch);
        assert.strictEqual(plugin.lemmy, lemmy);
        assert.strictEqual(plugin.logger, logger);
    });
});
