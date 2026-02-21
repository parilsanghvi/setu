const assert = require('assert');
const Module = require('module');
const path = require('path');

// Mock dependencies
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
    if (id === './auth-store') {
        return {
            getProfile: (pid) => {
                if (pid === 'test-profile') {
                    return {
                        provider: 'google',
                        access: 'old-access-token',
                        refresh: 'valid-refresh-token',
                        expiry: Date.now() - 10000 // Expired
                    };
                }
                return null;
            },
            addProfile: () => { }
        };
    }
    if (id === '../Config') {
        return {
            googleClientId: 'dummy-client-id',
            googleClientSecret: 'dummy-client-secret',
            googleTokenUrl: 'https://oauth2.googleapis.com/token',
            googleAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            googleRedirectUri: 'http://localhost:51121/oauth-callback'
        };
    }
    if (id === 'child_process') {
        return {
            spawn: () => ({ unref: () => { } })
        };
    }
    return originalRequire.apply(this, arguments);
};

// Mock fetch
global.fetch = async (url, options) => {
    if (url.includes('token')) {
        return {
            ok: true,
            json: async () => ({
                access_token: 'new-access-token',
                refresh_token: 'new-refresh-token',
                expires_in: 3600
            }),
            text: async () => ''
        };
    }
    return { ok: false, text: async () => 'Not found' };
};

console.log('Loading google auth module...');
const googleAuth = require('../lib/auth/google');

// Mock Logger
const logs = [];
googleAuth.logger = {
    info: (msg, ...args) => logs.push({ level: 'info', msg, args }),
    warn: (msg, ...args) => logs.push({ level: 'warn', msg, args }),
    error: (msg, ...args) => logs.push({ level: 'error', msg, args }),
    debug: (msg, ...args) => logs.push({ level: 'debug', msg, args })
};

(async () => {
    try {
        console.log('🧪 Testing Google Auth Logger replacement...');

        const token = await googleAuth.getValidToken('test-profile');

        assert.strictEqual(token, 'new-access-token', 'Should return new access token');

        // Check logs
        const expiredLog = logs.find(l => l.msg.includes('expired (or close), refreshing'));
        assert.ok(expiredLog, 'Should log token expiration');
        assert.strictEqual(expiredLog.level, 'info', 'Expiration log should be info');

        const successLog = logs.find(l => l.msg.includes('Token refreshed successfully'));
        assert.ok(successLog, 'Should log success');
        assert.strictEqual(successLog.level, 'info', 'Success log should be info');

        console.log('✅ Logger verification passed!');

    } catch (e) {
        console.error('❌ Verification failed:', e);
        process.exit(1);
    } finally {
        Module.prototype.require = originalRequire;
    }
})();
