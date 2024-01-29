import assert from 'node:assert';
import { describe, it } from 'node:test';
import Post from '../src/Post.js';

describe('Post', async () => {
    it('should be a function', async () => {
        assert.strictEqual(typeof Post, 'function');
    });

    it('should have the correct properties', async () => {
        const name = 'name';
        const body = '<p>body</p>';

        const thread = new Post({
            name,
            body,
        });

        assert.strictEqual(thread.name, name);
        assert.strictEqual(thread.body, body);
    });
});