const SessionLogger = require('../lib/SessionLogger');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

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

console.log('Testing SessionLogger (Async Check)...');

const logger = new SessionLogger(AGENT_NAME);
const logFile = logger.filePath;

// Wait for file creation (stream open happens async)
// Actually fs.createWriteStream creates the file almost immediately if it doesn't exist?
// It might be async on some systems but usually synchronous enough for the handle.

logger.log({ message: 'Async Hello' });

// We use end() to ensure flush
logger.end(() => {
    if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.trim().split('\n');
        assert.strictEqual(lines.length, 1, 'Should have 1 log entry');
        const entry = JSON.parse(lines[0]);
        assert.strictEqual(entry.message, 'Async Hello');
        console.log('Single log test passed.');

        // Test multiple logs
        // Create new logger since the previous stream ended
        const logger2 = new SessionLogger(AGENT_NAME + '_2');
        const logFile2 = logger2.filePath;

        const count = 100;
        for (let i = 0; i < count; i++) {
            logger2.log({ index: i });
        }

        logger2.end(() => {
            const content2 = fs.readFileSync(logFile2, 'utf8');
            const lines2 = content2.trim().split('\n');
            assert.strictEqual(lines2.length, count, `Should have ${count} log entries`);
            assert.strictEqual(JSON.parse(lines2[0]).index, 0);
            assert.strictEqual(JSON.parse(lines2[count-1]).index, count-1);
            console.log('Multiple logs test passed.');
            console.log('SessionLogger Async tests passed!');
        });

    } else {
        console.error('Log file not found!');
        process.exit(1);
    }
});
