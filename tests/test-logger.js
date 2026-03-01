const assert = require('assert');
const Logger = require('../lib/Logger');

async function runTests() {
    let passed = 0;
    let failed = 0;

    // We can't use console.log to print to stdout because we mock it!
    // So we use process.stdout.write directly
    function run(name, fn) {
        try {
            fn();
            process.stdout.write(`  ✅ ${name}\n`);
            passed++;
        } catch (e) {
            process.stderr.write(`  ❌ ${name}\n`);
            process.stderr.write(`     ${e.stack || e.message}\n`);
            failed++;
        }
    }

    process.stdout.write('🧪 Testing Logger\n');

    // Mocks for console methods
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    let logOutput = [];
    let errorOutput = [];

    function setupMocks() {
        logOutput = [];
        errorOutput = [];
        console.log = (msg) => logOutput.push(msg);
        console.error = (msg) => errorOutput.push(msg);
    }

    function teardownMocks() {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    }

    setupMocks();

    run('Logger logs info correctly', () => {
        setupMocks();
        const logger = new Logger('TestLogger');
        logger.info('Test info message');

        assert.strictEqual(logOutput.length, 1);
        assert.strictEqual(errorOutput.length, 0);

        const parsed = JSON.parse(logOutput[0]);
        assert.strictEqual(parsed.level, 'info');
        assert.strictEqual(parsed.name, 'TestLogger');
        assert.strictEqual(parsed.message, 'Test info message');
        assert.ok(parsed.timestamp);
    });

    run('Logger logs warn correctly', () => {
        setupMocks();
        const logger = new Logger('TestLogger');
        logger.warn('Test warn message');

        assert.strictEqual(logOutput.length, 1);
        assert.strictEqual(errorOutput.length, 0);

        const parsed = JSON.parse(logOutput[0]);
        assert.strictEqual(parsed.level, 'warn');
        assert.strictEqual(parsed.message, 'Test warn message');
    });

    run('Logger logs error correctly to console.error', () => {
        setupMocks();
        const logger = new Logger('TestLogger');
        logger.error('Test error message');

        assert.strictEqual(logOutput.length, 0);
        assert.strictEqual(errorOutput.length, 1);

        const parsed = JSON.parse(errorOutput[0]);
        assert.strictEqual(parsed.level, 'error');
        assert.strictEqual(parsed.message, 'Test error message');
    });

    run('Logger logs debug correctly', () => {
        setupMocks();
        const logger = new Logger('TestLogger');
        logger.debug('Test debug message');

        assert.strictEqual(logOutput.length, 1);
        assert.strictEqual(errorOutput.length, 0);

        const parsed = JSON.parse(logOutput[0]);
        assert.strictEqual(parsed.level, 'debug');
        assert.strictEqual(parsed.message, 'Test debug message');
    });

    run('Logger serializes Error objects properly', () => {
        setupMocks();
        const logger = new Logger('TestLogger');
        const err = new Error('Something went wrong');
        err.code = 'E_TEST';
        logger.error('Caught an error', err);

        assert.strictEqual(errorOutput.length, 1);

        const parsed = JSON.parse(errorOutput[0]);
        assert.strictEqual(parsed.level, 'error');
        assert.strictEqual(parsed.message, 'Caught an error');
        assert.ok(parsed.error);
        assert.strictEqual(parsed.error.message, 'Something went wrong');
        assert.strictEqual(parsed.error.code, 'E_TEST');
        assert.ok(parsed.error.stack);
    });

    run('Logger merges single object extra argument', () => {
        setupMocks();
        const logger = new Logger('TestLogger');
        logger.info('User login', { userId: 123, ip: '127.0.0.1' });

        assert.strictEqual(logOutput.length, 1);
        const parsed = JSON.parse(logOutput[0]);
        assert.strictEqual(parsed.level, 'info');
        assert.strictEqual(parsed.message, 'User login');
        assert.strictEqual(parsed.userId, 123);
        assert.strictEqual(parsed.ip, '127.0.0.1');
    });

    run('Logger adds multiple extra arguments to args array', () => {
        setupMocks();
        const logger = new Logger('TestLogger');
        logger.info('Processing items', 'item1', 'item2', 42);

        assert.strictEqual(logOutput.length, 1);
        const parsed = JSON.parse(logOutput[0]);
        assert.strictEqual(parsed.level, 'info');
        assert.strictEqual(parsed.message, 'Processing items');
        assert.ok(Array.isArray(parsed.args));
        assert.strictEqual(parsed.args.length, 3);
        assert.strictEqual(parsed.args[0], 'item1');
        assert.strictEqual(parsed.args[1], 'item2');
        assert.strictEqual(parsed.args[2], 42);
    });

    teardownMocks();

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(e => {
    process.stderr.write(e.stack + '\n');
});
