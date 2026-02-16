const http = require('http');
const DashboardServer = require('../lib/server');
const assert = require('assert');

async function runTest() {
    const port = 4567;
    const server = new DashboardServer(port);

    // Start server
    await new Promise(resolve => server.server.listen(port, resolve));
    console.log(`Server started on port ${port}`);

    try {
        // Test Case 1: Path Traversal
        // We use ..%2F to avoid client-side normalization
        const options = {
            hostname: 'localhost',
            port: port,
            path: '/api/tasks/..%2F..%2F..%2F/screenshots',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Status Code: ${res.statusCode}`);
                console.log(`Response Body: ${data}`);

                // Before fix: likely 200 and maybe some file list or empty list if directory is empty
                // After fix: should be 400 Bad Request

                if (res.statusCode === 400) {
                    console.log('✅ Path Traversal Blocked (400 Bad Request)');
                    process.exit(0);
                } else {
                    console.log('❌ Path Traversal NOT Blocked properly');
                    // Check if it actually leaked something or just didn't fail with 400
                    // If it returns empty array [], it means it tried to read but found nothing or error was swallowed
                    // But we want it to be REJECTED explicitly.
                    process.exit(1);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            process.exit(1);
        });

        req.end();

    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        // server.server.close(); // We exit process anyway
    }
}

runTest();
