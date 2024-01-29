import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import esmock from 'esmock';

describe('Logger', async () => {
    it('should be a function', async () => {
        const Logger = await esmock('../src/Logger.js');

        assert.strictEqual(typeof Logger, 'function');
    });

    it('should not emit debug logs when verbose is false', async () => {
        const debugMock = mock.fn();
        const Logger = await esmock('../src/Logger.js', {
            import: {
                console: { debug: debugMock },
            },
        });
        const logger = new Logger();

        logger.debug('test');
        
        assert.strictEqual(debugMock.mock.calls.length, 0);
    });

    it('should have a debug method with a prefix', async () => {
        const greenMock = mock.fn(i => i);
        const debugMock = mock.fn();
        const Logger = await esmock('../src/Logger.js', {
            chalk: { green: greenMock },
            import: {
                console: { debug: debugMock },
            },
        });
        const logger = new Logger({ verbose: true });

        logger.debug('test');
        
        assert.strictEqual(typeof logger.error, 'function');
        assert.strictEqual(greenMock.mock.calls.length, 1);
        assert.strictEqual(greenMock.mock.calls[0].arguments[0], '[DEBUG]');
        assert.strictEqual(debugMock.mock.calls.length, 1);
        assert.strictEqual(debugMock.mock.calls[0].arguments[0], '[DEBUG]');
        assert.strictEqual(debugMock.mock.calls[0].arguments[1], 'test');
    });

    it('should have a log method with a prefix', async () => {
        const blueMock = mock.fn(i => i);
        const logMock = mock.fn();
        const Logger = await esmock('../src/Logger.js', {
            chalk: { blue: blueMock },
            import: {
                console: { log: logMock },
            },
        });
        const logger = new Logger();

        logger.log('test');
        
        assert.strictEqual(typeof logger.error, 'function');
        assert.strictEqual(blueMock.mock.calls.length, 1);
        assert.strictEqual(blueMock.mock.calls[0].arguments[0], '[INFO]');
        assert.strictEqual(logMock.mock.calls.length, 1);
        assert.strictEqual(logMock.mock.calls[0].arguments[0], '[INFO]');
        assert.strictEqual(logMock.mock.calls[0].arguments[1], 'test');
    });

    it('should have a warn method with a prefix', async () => {
        const yellowMock = mock.fn(i => i);
        const warnMock = mock.fn();
        const Logger = await esmock('../src/Logger.js', {
            chalk: { yellow: yellowMock },
            import: {
                console: { warn: warnMock },
            },
        });
        const logger = new Logger();

        logger.warn('test');
        
        assert.strictEqual(typeof logger.warn, 'function');
        assert.strictEqual(yellowMock.mock.calls.length, 1);
        assert.strictEqual(yellowMock.mock.calls[0].arguments[0], '[WARN]');
        assert.strictEqual(warnMock.mock.calls.length, 1);
        assert.strictEqual(warnMock.mock.calls[0].arguments[0], '[WARN]');
        assert.strictEqual(warnMock.mock.calls[0].arguments[1], 'test');
    });

    it('should have an error method with a prefix', async () => {
        const redMock = mock.fn(i => i);
        const errorMock = mock.fn();
        const Logger = await esmock('../src/Logger.js', {
            chalk: { red: redMock },
            import: {
                console: { error: errorMock },
            },
        });
        const logger = new Logger();

        logger.error('test');
        
        assert.strictEqual(typeof logger.error, 'function');
        assert.strictEqual(redMock.mock.calls.length, 1);
        assert.strictEqual(redMock.mock.calls[0].arguments[0], '[ERROR]');
        assert.strictEqual(errorMock.mock.calls.length, 1);
        assert.strictEqual(errorMock.mock.calls[0].arguments[0], '[ERROR]');
        assert.strictEqual(errorMock.mock.calls[0].arguments[1], 'test');
    });
});
