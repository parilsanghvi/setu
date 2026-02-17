const assert = require('assert');
const fs = require('fs');
const path = require('path');
const SessionLogger = require('../lib/SessionLogger');

console.log('🧪 Testing lib/SessionLogger.js...');

const agentName = 'TestSessionLoggerAgent';
let logger;
let createdFile;
const originalAppendFileSync = fs.appendFileSync;

try {
    // --- Test 1: Instantiation & Directory Creation ---
    console.log('  - Test 1: Instantiation & Directory Creation');
    logger = new SessionLogger(agentName);
    createdFile = logger.filePath;

    assert.ok(createdFile, 'Logger should have a file path');
    assert.ok(createdFile.includes(agentName), 'File path should include agent name');

    // Verify directory creation
    const logDir = path.dirname(createdFile);
    assert.ok(fs.existsSync(logDir), 'Log directory should exist');

    // --- Test 2: Logging & Content Verification ---
    console.log('  - Test 2: Logging & Content Verification');
    const event1 = { message: 'First event', data: { foo: 'bar' } };
    logger.log(event1);

    const event2 = { message: 'Second event', data: { baz: 'qux' } };
    logger.log(event2);

    assert.ok(fs.existsSync(createdFile), 'Log file should exist');

    const content = fs.readFileSync(createdFile, 'utf-8').trim();
    const lines = content.split('\n');

    assert.strictEqual(lines.length, 2, 'Should have 2 log entries');

    const entry1 = JSON.parse(lines[0]);
    const entry2 = JSON.parse(lines[1]);

    // Check entry 1
    assert.ok(entry1.id, 'Entry 1 should have an ID');
    assert.strictEqual(entry1.parentId, null, 'First entry should have null parentId');
    assert.strictEqual(entry1.message, event1.message, 'Message should match');
    assert.deepStrictEqual(entry1.data, event1.data, 'Data should match');
    assert.ok(entry1.timestamp, 'Timestamp should exist');

    // Check entry 2
    assert.ok(entry2.id, 'Entry 2 should have an ID');
    assert.strictEqual(entry2.parentId, entry1.id, 'Second entry parentId should match first entry ID');
    assert.strictEqual(entry2.message, event2.message, 'Message should match');
    assert.deepStrictEqual(entry2.data, event2.data, 'Data should match');

    // --- Test 3: Error Handling ---
    console.log('  - Test 3: Error Handling (fs.appendFileSync failure)');

    // Mock fs.appendFileSync to throw error
    let errorLogged = false;
    const originalConsoleError = console.error;
    console.error = (msg) => {
        if (msg.includes('[SessionLogger] Failed to write log')) {
            errorLogged = true;
        }
        // originalConsoleError(msg); // Uncomment to see actual error
    };

    fs.appendFileSync = () => {
        throw new Error('Simulated write error');
    };

    try {
        logger.log({ message: 'This should fail' });
        assert.ok(errorLogged, 'Should have logged an error to console');
    } finally {
        // Restore
        fs.appendFileSync = originalAppendFileSync;
        console.error = originalConsoleError;
    }

    console.log('✅ lib/SessionLogger.js Tests Passed!');

} catch (e) {
    console.error('❌ lib/SessionLogger.js Failed:', e);
    // Restore in case of failure
    if (fs.appendFileSync !== originalAppendFileSync) {
        fs.appendFileSync = originalAppendFileSync;
    }
    process.exit(1);
} finally {
    // Cleanup
    if (createdFile && fs.existsSync(createdFile)) {
        try {
            fs.unlinkSync(createdFile);
            console.log('🧹 Cleaned up test log file.');
        } catch (cleanupError) {
            console.error('⚠️ Failed to clean up test log file:', cleanupError);
        }
    }
}
