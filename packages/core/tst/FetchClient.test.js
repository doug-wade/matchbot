import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import fetchClient from '../src/FetchClient.js';

describe('FetchClient', async () => {
    it('should be a function', async () => {
        assert.strictEqual(typeof fetchClient, 'function');
    });

    it('should call fetch if there is a cache miss', async () => {
        const response = { corge: 'qux' };
        const json = { response: JSON.stringify(response) };
        const logger = { debug: mock.fn() };
        const db = { 
            getCacheEntry: mock.fn(() => null), 
            putCacheEntry: mock.fn(() => null) 
        };
        const fetchMock = mock.method(global, 'fetch', () => {
            return { json: mock.fn(() => json), status: 200 };
        });

        const underTest = fetchClient({ cache: true }, db, logger);
        const result = await underTest('https://example.com');

        assert.strictEqual(result, json);
        assert.strictEqual(fetchMock.mock.calls.length, 1);
        assert.strictEqual(db.putCacheEntry.mock.calls.length, 1);
    });

    it('should not call fetch if there is a cache hit', async () => {
        const response = { foo: 'bar' };
        const json = { response: JSON.stringify(response) };
        const logger = { debug: mock.fn() };
        const db = { getCacheEntry: mock.fn(() => json) };
        const fetchMock = mock.method(global, 'fetch', () => {
            return { status: 500 };
        });

        const underTest = fetchClient({ cache: true }, db, logger);
        const result = await underTest('https://example.com');

        assert.deepStrictEqual(result, response);
        assert.strictEqual(fetchMock.mock.calls.length, 0);
    });
});