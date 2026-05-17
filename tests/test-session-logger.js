const SessionLogger = require('../lib/SessionLogger');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Redirect console.error to capture output during tests
let consoleErrorOutput = [];
const originalConsoleError = console.error;
console.error = (...args) => {
    consoleErrorOutput.push(args.join(' '));
};

async function runTests() {
    console.log('Testing SessionLogger...');
    const AGENT_NAME = 'TestAgentAsync';
    const LOG_DIR = path.join(process.cwd(), 'logs', 'sessions');

    // Cleanup
    if (fs.existsSync(LOG_DIR)) {
        const files = fs.readdirSync(LOG_DIR);
        for (const file of files) {
            if (file.startsWith(AGENT_NAME)) {
                fs.unlinkSync(path.join(LOG_DIR, file));
            }
        }
    }

    const logger = new SessionLogger(AGENT_NAME);
    const logFile = logger.filePath;

    // Test 1: Basic Async Logging
    logger.log({ message: 'Async Hello' });

    await new Promise(resolve => logger.end(resolve));

    if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.trim().split('\n');
        assert.strictEqual(lines.length, 1, 'Should have 1 log entry');
        const entry = JSON.parse(lines[0]);
        assert.strictEqual(entry.message, 'Async Hello');
        console.log('✅ Single log test passed.');
    } else {
        throw new Error('Log file not found!');
    }

    // Test 2: Multiple Logs
    const logger2 = new SessionLogger(AGENT_NAME + '_2');
    const logFile2 = logger2.filePath;
    const count = 100;
    for (let i = 0; i < count; i++) {
        logger2.log({ index: i });
    }

    await new Promise(resolve => logger2.end(resolve));

    const content2 = fs.readFileSync(logFile2, 'utf8');
    const lines2 = content2.trim().split('\n');
    assert.strictEqual(lines2.length, count, `Should have ${count} log entries`);
    assert.strictEqual(JSON.parse(lines2[0]).index, 0);
    assert.strictEqual(JSON.parse(lines2[count-1]).index, count-1);
    console.log('✅ Multiple logs test passed.');

    // Test 3: Circular reference handling
    consoleErrorOutput = []; // Reset output
    const logger3 = new SessionLogger(AGENT_NAME + '_3');
    const circularObj = {};
    circularObj.self = circularObj;

    // This should not throw, but it should log to console.error
    logger3.log(circularObj);

    // Allow stream to flush, though we expect no valid JSON was written for the circular object
    await new Promise(resolve => logger3.end(resolve));

    const content3 = fs.readFileSync(logger3.filePath, 'utf8');
    assert.strictEqual(content3.trim(), '', 'Log file should be empty since write failed');

    // Verify console.error was called with the right error message
    const hasCircularError = consoleErrorOutput.some(msg => msg.includes('[SessionLogger] Failed to write log'));
    assert.ok(hasCircularError, 'Should have logged an error about writing the log');
    console.log('✅ Circular reference test passed.');

    // Test 4: Stream error handling
    consoleErrorOutput = []; // Reset output
    const logger4 = new SessionLogger(AGENT_NAME + '_4');

    // Trigger an error event on the stream manually
    const testError = new Error('Simulated stream error');
    logger4.stream.emit('error', testError);

    const hasStreamError = consoleErrorOutput.some(msg =>
        msg.includes('[SessionLogger] Stream error') && msg.includes('Simulated stream error')
    );
    assert.ok(hasStreamError, 'Should have logged stream error');

    await new Promise(resolve => logger4.end(resolve));
    console.log('✅ Stream error handling test passed.');

    // Test 5: end() without stream
    const logger5 = new SessionLogger(AGENT_NAME + '_5');
    // Manually remove stream
    const tempStream = logger5.stream;
    logger5.stream = null;

    // Should call the callback immediately without crashing
    let callbackCalled = false;
    logger5.end(() => {
        callbackCalled = true;
    });

    assert.ok(callbackCalled, 'Callback should be called when stream is missing');
    console.log('✅ Missing stream end test passed.');

    // Cleanup resources to be nice
    if (tempStream) tempStream.end();

    console.log('All SessionLogger tests passed!');
}

runTests().catch(err => {
    console.error = originalConsoleError;
    console.error('Test failed:', err);
    process.exit(1);
}).finally(() => {
    // Restore console.error
    console.error = originalConsoleError;
});
