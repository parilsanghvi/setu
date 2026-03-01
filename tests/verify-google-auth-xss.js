const http = require('http');
const assert = require('assert');
const { spawn } = require('child_process');

// 0. Mock dotenv (as it's missing in some test envs but required by Config)
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'dotenv') {
        return { config: () => ({ parsed: {} }) };
    }
    return originalRequire.apply(this, arguments);
};

// 1. Mock child_process to prevent browser launch
require('child_process').spawn = function (command, args, options) {
    console.log(`[Mock] child_process.spawn called: ${command} ${args.join(' ')}`);
    return {
        unref: () => { },
        on: () => { }
    };
};

// 2. Set environment variables
process.env.GOOGLE_CLIENT_ID = 'dummy_client_id';
process.env.GOOGLE_CLIENT_SECRET = 'dummy_client_secret';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:51121/oauth-callback';

// 3. Load GoogleAuth
const GoogleAuth = require('../lib/auth/google');

async function testXSS() {
    console.log('🚀 Starting XSS Verification Test...');

    // Start login flow (this starts the server)
    // We expect the promise to hang or eventually reject because we won't complete the flow,
    // but the server will start.
    const loginPromise = GoogleAuth.login().catch(e => {
        // We expect it to fail or be cancelled, but we care about the server response first
        // console.log('Login flow ended (expected).');
    });

    // Give server a moment to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Send malicious request
    const payload = '<script>alert("XSS")</script>';
    const encodedPayload = encodeURIComponent(payload);
    // Note: The query param name in lib/auth/google.js is 'error', which is reflected
    const url = `http://127.0.0.1:51121/oauth-callback?error=${encodedPayload}`;

    console.log(`📡 Sending request to: ${url}`);

    const req = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`✅ Response Status: ${res.statusCode}`);
            const contentType = res.headers['content-type'] || '';
            console.log(`✅ Content-Type: ${contentType}`);
            console.log(`✅ Body: ${data}`);

            // 5. Verify Vulnerability
            // Vulnerable if: Content-Type is HTML AND Body contains the raw script
            const isHtml = contentType.toLowerCase().includes('text/html');
            const hasScript = data.includes(payload);

            if (isHtml && hasScript) {
                console.error('\n🚨 VULNERABILITY DETECTED: Reflected XSS!');
                console.error('   Server returned text/html with unescaped script.');
                process.exit(1);
            } else if (!isHtml && !hasScript) { // Ideally both should be false/safe, but mainly content-type shouldn't trigger HTML
                console.log('\n✅ SAFE: Response is not HTML or does not contain script.');
                process.exit(0);
            } else {
                // If it's text/plain but has script, it's safe from execution but we want to confirm structure.
                if (!isHtml && hasScript) {
                     console.log('\n✅ SAFE: Script returned but as plain text (not executable).');
                     process.exit(0);
                }
                console.log('\n⚠️  Unexpected response state.');
                console.log(`   isHtml: ${isHtml}`);
                console.log(`   hasScript: ${hasScript}`);
                process.exit(1); // Fail on unexpected state
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Request failed: ${e.message}`);
        process.exit(1);
    });
}

testXSS();
