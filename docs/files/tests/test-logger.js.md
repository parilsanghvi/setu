---
source_hash: 9cddbb814c78aa91
facts_hash: 316f221d922061dc
generated_at: 2026-03-04T06:04:45.354Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/test-logger.js

## Purpose
This file contains unit tests for the `Logger` class, ensuring its functionality and accuracy in logging different types of messages with various levels of severity.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `resetMocks` | arrow | `` | Resets logs and errors arrays for reuse. |

## Internal Logic
The main execution flow involves setting up mock console.log and console.error functions to capture logs and errors sent by the Logger class, then running test cases that cover various logging scenarios using the Logger instance.

javascript
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

} catch (e) {
    console.log = originalLog;
    console.error = originalError;
    console.error('❌ Logger tests failed:', e);
    process.exit(1);
}

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Logger` | Yes | Provides the Logger class for testing. |

## Side Effects
- console_output: The file captures logs sent to console.log and console.error, storing them in arrays for later inspection.
- process_control: The file uses process.exit() to terminate the process if the tests fail.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](../lib/Logger.js.md)
