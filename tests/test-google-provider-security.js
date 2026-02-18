const assert = require('assert');
const Module = require('module');

// Mock dependencies
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === '../../auth/google') {
        return {
            getValidToken: async () => 'mock-token'
        };
    }
    if (id === '../../Config') {
        return {
            googleProjectId: null
        };
    }
    return originalRequire.apply(this, arguments);
};

const GoogleProvider = require('../lib/models/providers/google');

console.log('🧪 Testing lib/models/providers/google.js for security...');

// Mock fetch
global.fetch = async (url, options) => {
    if (url.includes('loadCodeAssist')) {
        return {
            ok: true,
            json: async () => ({
                cloudaicompanionProject: {
                    id: 'sensitive-project-id',
                    other: 'sensitive-data'
                }
            })
        };
    }
    return { ok: false };
};

// Spy on console.log
const originalLog = console.log;
let loggedMessages = [];
console.log = (...args) => {
    loggedMessages.push(args.join(' '));
    originalLog(...args);
};

(async () => {
    try {
        const provider = new GoogleProvider({
            auth: { type: 'oauth' },
            model: 'test-model'
        });

        const projectId = await provider.fetchProject('dummy-token');

        // Check 1: Project ID is returned correctly
        assert.strictEqual(projectId, 'sensitive-project-id', 'Should return correct project ID');

        // Check 2: No sensitive data logged
        const sensitiveLog = loggedMessages.find(msg => msg.includes('[GoogleProvider] fetchProject response:'));
        if (sensitiveLog) {
             assert.fail('Sensitive data logged!');
        }

        console.log('✅ GoogleProvider Security Test Passed!');

    } catch (e) {
        console.error('❌ GoogleProvider Security Test Failed:', e);
        process.exit(1);
    } finally {
        console.log = originalLog;
        Module.prototype.require = originalRequire;
    }
})();
