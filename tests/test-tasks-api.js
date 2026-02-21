const http = require('http');
const assert = require('assert');
const DashboardServer = require('../lib/server');

console.log('🧪 Testing /api/tasks endpoint...');
process.env.DASHBOARD_PASS = 'secret';

const PORT = 4002;
const server = new DashboardServer(PORT);

// Capture stderr to detect "headers already sent"
const originalStderrWrite = process.stderr.write;
let stderrOutput = '';
process.stderr.write = (chunk, encoding, callback) => {
    stderrOutput += chunk.toString();
    return originalStderrWrite.call(process.stderr, chunk, encoding, callback);
};

server.start();

const postData = JSON.stringify({
    title: 'Test Task',
    type: 'test'
});

const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/tasks',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Basic YWRtaW46c2VjcmV0',
        'Connection': 'close'
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            assert.strictEqual(res.statusCode, 200);
            assert.ok(json.id.startsWith('TASK-'));
            assert.strictEqual(json.status, 'TODO');

            // Wait a bit to ensure server-side errors are logged
            setTimeout(() => {
                server.server.close();
                process.stderr.write = originalStderrWrite; // Restore stderr

                if (stderrOutput.includes('ERR_HTTP_HEADERS_SENT')) {
                    console.error('❌ FAILED: Detected "ERR_HTTP_HEADERS_SENT" error in stderr.');
                    process.exit(1);
                } else {
                    console.log('✅ /api/tasks Tests Passed!');
                    process.exit(0);
                }
            }, 500);

        } catch (e) {
            console.error('❌ Failed to parse response or assertion failed:', e);
            server.server.close();
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Request failed: ${e.message}`);
    server.server.close();
    process.exit(1);
});

req.write(postData);
req.end();
