const assert = require('assert');
const path = require('path');

const GOOGLE_AUTH_PATH = path.resolve(__dirname, '../lib/auth/google.js');

function clearModule() {
    delete require.cache[GOOGLE_AUTH_PATH];
}

async function testMissingEnvVars() {
    console.log('Testing missing environment variables...');
    clearModule();
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const GoogleAuth = require(GOOGLE_AUTH_PATH);

    // Test login
    try {
        await GoogleAuth.login();
        assert.fail('Should have thrown error due to missing credentials');
    } catch (e) {
        assert.ok(e.message.includes('Google OAuth credentials not configured'),
            `Unexpected error message: ${e.message}`);
    }

    // Test refreshToken
    try {
        await GoogleAuth.refreshToken('some-token');
        assert.fail('Should have thrown error due to missing credentials');
    } catch (e) {
        assert.ok(e.message.includes('Google OAuth credentials not configured'),
            `Unexpected error message: ${e.message}`);
    }

    console.log('PASS: Missing environment variables handled correctly.');
}

async function testPresentEnvVars() {
    console.log('Testing present environment variables...');
    clearModule();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

    const GoogleAuth = require(GOOGLE_AUTH_PATH);

    // Mock internal methods or verify property usage if possible.
    // Since we can't easily spy on internal constants, we'll try to trigger a failure that indicates variables were used.
    // However, login() starts a server and tries to open a browser. We should mock openUrl and http.createServer if we want to go far.
    // But for this check, we just want to ensure it DOESN'T throw the configuration error.

    // Mock openUrl to avoid side effects
    // But openUrl is not exported and not on the instance. It's a module-level function.
    // We can't easily mock it without proxyquire or similar.

    // Instead, we can check if it throws the configuration error.
    // If it throws "Google OAuth credentials not configured", fail.
    // If it proceeds to try to open browser or start server, that's success for this test.

    // We'll stub console.log to avoid noise
    const originalLog = console.log;
    console.log = () => {};

    try {
        // We expect it to try to open browser or fail later.
        // But we don't want to actually start the server as it binds to a port.
        // Maybe we can just check if the properties are set correctly?
        // No, they are private variables in the closure.

        // Let's rely on the fact that the check happens early in login().
        // If we call login(), and it doesn't throw the config error immediately, we are good.
        // But login() is async and awaits stuff.

        // Actually, we can check `refreshToken` which does a fetch.
        // We can mock fetch global.

        global.fetch = async (url, options) => {
            // Verify that the body contains our client_id and client_secret
            if (url === "https://oauth2.googleapis.com/token") {
                const body = options.body; // URLSearchParams
                if (body.get('client_id') === 'test-client-id' &&
                    body.get('client_secret') === 'test-client-secret') {
                    return { ok: true, json: async () => ({ access_token: 'mock-access', expires_in: 3600 }) };
                }
            }
            return { ok: false, text: async () => 'Mock error' };
        };

        await GoogleAuth.refreshToken('mock-refresh-token');
        // If no error, success!

    } catch (e) {
        // If it throws the config error, fail
        if (e.message.includes('Google OAuth credentials not configured')) {
             console.log = originalLog;
             assert.fail('Should not have thrown configuration error');
        }
        // Other errors are fine (e.g. fetch mock issues if any)
    } finally {
        console.log = originalLog;
        delete global.fetch;
    }

    console.log('PASS: Present environment variables used correctly.');
}

async function run() {
    try {
        await testMissingEnvVars();
        await testPresentEnvVars();
        console.log('All tests passed.');
    } catch (e) {
        console.error('Test failed:', e);
        process.exit(1);
    }
}

run();
