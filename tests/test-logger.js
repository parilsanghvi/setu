const assert = require('assert');
const Logger = require('../lib/Logger');

console.log('Testing Logger...');

let logs = [];
let errors = [];

// Mock console.log and console.error
const originalLog = console.log;
const originalError = console.error;

console.log = (msg) => {
    // Only capture JSON stringified logs
    if (typeof msg === 'string' && msg.startsWith('{')) {
        try {
            logs.push(JSON.parse(msg));
        } catch (e) {
            // Ignore non-JSON logs from test runner
        }
    } else {
        originalLog(msg);
    }
};

console.error = (msg) => {
    if (typeof msg === 'string' && msg.startsWith('{')) {
        try {
            errors.push(JSON.parse(msg));
        } catch (e) {
            // Ignore
        }
    } else {
        originalError(msg);
    }
};

// Helper to reset mocks
const resetMocks = () => {
    logs = [];
    errors = [];
};

try {
    const logger = new Logger('TestService');

    // Test info
    logger.info('User logged in');
    assert.strictEqual(logs.length, 1, 'Should log info message');
    assert.strictEqual(logs[0].level, 'info');
    assert.strictEqual(logs[0].name, 'TestService');
    assert.strictEqual(logs[0].message, 'User logged in');
    assert(logs[0].timestamp, 'Should have timestamp');
    resetMocks();

    // Test warn
    logger.warn('Rate limit approaching');
    assert.strictEqual(logs.length, 1, 'Should log warn message');
    assert.strictEqual(logs[0].level, 'warn');
    assert.strictEqual(logs[0].message, 'Rate limit approaching');
    resetMocks();

    // Test debug
    logger.debug('Processing request', { reqId: 123 });
    assert.strictEqual(logs.length, 1, 'Should log debug message');
    assert.strictEqual(logs[0].level, 'debug');
    assert.strictEqual(logs[0].message, 'Processing request');
    assert.strictEqual(logs[0].reqId, 123, 'Should merge object args');
    resetMocks();

    // Test error
    const testError = new Error('Database connection failed');
    logger.error('Failed to connect', testError);
    assert.strictEqual(errors.length, 1, 'Should log error to console.error');
    assert.strictEqual(errors[0].level, 'error');
    assert.strictEqual(errors[0].message, 'Failed to connect');
    assert.strictEqual(errors[0].error.message, 'Database connection failed');
    assert(errors[0].error.stack, 'Should include error stack');
    resetMocks();

    // Test object argument merging
    logger.info('User created', { userId: 456, role: 'admin' });
    assert.strictEqual(logs[0].userId, 456);
    assert.strictEqual(logs[0].role, 'admin');
    resetMocks();

    // Test multiple arguments
    logger.info('Multiple args', 'arg1', 2, ['array']);
    assert(Array.isArray(logs[0].args));
    assert.deepStrictEqual(logs[0].args, ['arg1', 2, ['array']]);
    resetMocks();

    // Test Error object with additional args
    const anotherError = new TypeError('Invalid type');
    logger.error('Type check failed', anotherError, { context: 'user_input' });
    assert.strictEqual(errors[0].error.message, 'Invalid type');
    assert.strictEqual(errors[0].context, 'user_input');
    resetMocks();

    console.log = originalLog;
    console.error = originalError;
    console.log('✅ Logger tests passed!');
} catch (e) {
    console.log = originalLog;
    console.error = originalError;
    console.error('❌ Logger tests failed:', e);
    process.exit(1);
}
