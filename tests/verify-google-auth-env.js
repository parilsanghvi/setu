const { spawn } = require('child_process');
const path = require('path');

const googleAuthPath = path.resolve(__dirname, '../lib/auth/google.js');

async function runTest(env, expectedClientId) {
    return new Promise((resolve, reject) => {
        console.log(`\nTesting with expected client_id: ${expectedClientId}`);

        const proc = spawn('node', ['-e', `require(${JSON.stringify(googleAuthPath)}).login()`], {
            env: { ...process.env, ...env },
            cwd: process.cwd() // Run from root
        });

        let output = '';
        let passed = false;
        let killed = false;

        const cleanup = () => {
            if (!killed) {
                killed = true;
                proc.kill();
            }
        };

        proc.stdout.on('data', (data) => {
            const str = data.toString();
            output += str;
            // Look for URL: https://accounts.google.com...
            if (output.includes('URL:')) {
                // Extract URL
                const match = output.match(/URL: (https:\/\/[^\s]+)/);
                if (match) {
                    const urlStr = match[1];
                    try {
                        const url = new URL(urlStr);
                        const clientId = url.searchParams.get('client_id');

                        if (clientId === expectedClientId) {
                            console.log(`✅ Success: Found correct client_id: ${clientId}`);
                            passed = true;
                        } else {
                            console.error(`❌ Failure: Expected ${expectedClientId}, got ${clientId}`);
                            passed = false;
                        }
                    } catch (e) {
                        console.error('Error parsing URL:', e);
                        passed = false;
                    }
                    cleanup();
                }
            }
        });

        proc.stderr.on('data', (data) => {
            // Ignore stderr as openUrl might fail
            // console.error(`stderr: ${data}`);
        });

        proc.on('exit', (code) => {
            if (passed) {
                resolve();
            } else {
                reject(new Error(`Test failed for expected client_id: ${expectedClientId}`));
            }
        });

        // Timeout
        setTimeout(() => {
            if (!passed) {
                console.error("Timeout waiting for URL");
                cleanup();
                // We rely on exit handler to reject
            }
        }, 5000);
    });
}

(async () => {
    try {
        // 1. Default (Hardcoded)
        // Original: 1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com
        await runTest({}, "1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com");

        // 2. Custom Env
        await runTest({ GOOGLE_CLIENT_ID: "custom-test-id" }, "custom-test-id");

        console.log("\nAll verify tests passed!");
    } catch (e) {
        console.error("\nTest suite failed:", e);
        process.exit(1);
    }
})();
