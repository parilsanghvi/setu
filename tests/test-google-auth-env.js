const assert = require('assert');

const MODE = process.argv[2] || 'deprecated'; // 'active' or 'deprecated'

// 1. Set environment variables BEFORE requiring the modules
process.env.GOOGLE_CLIENT_ID = 'TEST_CLIENT_ID_123';
process.env.GOOGLE_CLIENT_SECRET = 'TEST_CLIENT_SECRET_456';

console.log(`Testing mode: ${MODE}`);
console.log('Environment variables set.');

async function runTest() {
    let authModule;
    if (MODE === 'active') {
        authModule = require('../lib/auth/google');
    } else {
        authModule = require('../lib/extensions/google-auth.deprecated');
    }

    console.log('Module required.');

    // Mock console.log to capture URL
    const originalLog = console.log;
    let capturedLog = '';
    console.log = (msg) => {
        capturedLog += msg + '\n';
    };

    try {
        // Calling login() starts the server and logs the URL.
        // We don't await it because it hangs waiting for callback.
        const loginPromise = authModule.login();

        // Restore console.log immediately
        console.log = originalLog;

        // Assert
        if (capturedLog.includes('client_id=TEST_CLIENT_ID_123')) {
            console.log(`[PASS] ${MODE} module uses GOOGLE_CLIENT_ID`);
            process.exit(0);
        } else {
            console.error(`[FAIL] ${MODE} module did not use GOOGLE_CLIENT_ID`);
            console.error('Captured Log:', capturedLog);
            process.exit(1);
        }

    } catch (e) {
        console.log = originalLog;
        console.error('Error testing GoogleAuth:', e);
        process.exit(1);
    }
}

runTest();
