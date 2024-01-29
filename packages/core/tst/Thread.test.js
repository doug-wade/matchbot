import assert from 'node:assert';
import { describe, it } from 'node:test';
import Thread from '../src/Thread.js';

describe('Thread', async () => {
    it('should be a function', async () => {
        assert.strictEqual(typeof Thread, 'function');
    });

    it('should have the correct properties', async () => {
        const name = 'name';
        const args = { foo: 'bar', baz: 'qux' };
        const date = new Date();
        const id = 'id';
        const completed = true;

        const thread = new Thread({
            name,
            args,
            date,
            id,
            completed
        });

        assert.strictEqual(thread.name, name);
        assert.strictEqual(thread.args, args);
        assert.strictEqual(thread.date, date);
        assert.strictEqual(thread.id, id);
        assert.strictEqual(thread.completed, completed);
    });
});