const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = 3001;
const SESSION_DIR = path.join(__dirname, '../logs/sessions');
const AUTH_HEADER = 'Basic ' + Buffer.from('admin:secret').toString('base64');

describe('API Sessions Verification Test', () => {
    it('should list session files asynchronously and sort by modified time', async () => {
        // Ensure session directory exists
        if (!fs.existsSync(SESSION_DIR)) {
            fs.mkdirSync(SESSION_DIR, { recursive: true });
        }

        // Create mock session files with distinct modified times
        const file1 = path.join(SESSION_DIR, 'test_session_1.jsonl');
        const file2 = path.join(SESSION_DIR, 'test_session_2.jsonl');
        const file3 = path.join(SESSION_DIR, 'test_session_not_jsonl.txt');

        fs.writeFileSync(file1, '{}');
        fs.writeFileSync(file2, '{}');
        fs.writeFileSync(file3, '{}');

        // Set modification times: file2 is newer than file1
        const now = Date.now();
        fs.utimesSync(file1, new Date(now - 10000), new Date(now - 10000));
        fs.utimesSync(file2, new Date(now), new Date(now));

        // Start the server
        const server = spawn('node', ['index.js'], {
            cwd: path.join(__dirname, '..'),
            stdio: 'ignore',
            env: { ...process.env, PORT, DASHBOARD_PASS: 'secret' }
        });

        // Wait for server to be ready
        let ready = false;
        for (let i = 0; i < 20; i++) {
            try {
                const res = await fetch(`http://localhost:${PORT}/api/stats`, {
                    headers: { 'Authorization': AUTH_HEADER }
                });
                if (res.status === 200) {
                    ready = true;
                    break;
                }
            } catch (e) {
                // Ignore connection errors and retry
            }
            await new Promise(r => setTimeout(r, 250));
        }

        try {
            assert.ok(ready, "Server should start successfully");

            // Query /api/sessions
            const res = await fetch(`http://localhost:${PORT}/api/sessions`, {
                headers: { 'Authorization': AUTH_HEADER }
            });
            assert.strictEqual(res.status, 200);

            const sessions = await res.json();
            assert.ok(Array.isArray(sessions), "Response should be an array");

            // Verify our test files are listed and sorted correctly (newest first)
            const testSessions = sessions.filter(s => s.name.startsWith('test_session_'));
            
            // test_session_not_jsonl.txt should not be present
            const txtPresent = testSessions.some(s => s.name.endsWith('.txt'));
            assert.strictEqual(txtPresent, false, "Non-jsonl files should not be listed");

            assert.strictEqual(testSessions.length, 2, "Both test jsonl files should be listed");
            assert.strictEqual(testSessions[0].name, 'test_session_2.jsonl', "Newest file should be first");
            assert.strictEqual(testSessions[1].name, 'test_session_1.jsonl', "Older file should be second");

        } finally {
            // Clean up files
            if (fs.existsSync(file1)) fs.unlinkSync(file1);
            if (fs.existsSync(file2)) fs.unlinkSync(file2);
            if (fs.existsSync(file3)) fs.unlinkSync(file3);
            server.kill();
        }
    });
});
