const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

const originalRequire = Module.prototype.require;

if (!originalRequire._isMockedForGoogleRetry) {
    Module.prototype.require = function(id) {
        if (id === '../../auth/google' || id === '../auth/google') {
            return {
                getValidToken: async () => 'mock-token'
            };
        }
        if (id === '../../Config' || id === '../Config') {
            return {
                googleProjectId: null
            };
        }
        if (id === 'dotenv') {
            return { config: () => ({}) };
        }
        return originalRequire.apply(this, arguments);
    };
    Module.prototype.require._isMockedForGoogleRetry = true;
}

const GoogleProvider = require('../lib/models/providers/google');

const originalLog = console.log;

test('GoogleProvider fetchWithBackoff - Success on first try', async (t) => {
    let loggedMessages = [];
    console.log = (...args) => {
        loggedMessages.push(args.join(' '));
    };

    let fetchCallCount = 0;
    t.mock.method(global, 'fetch', async (url, options) => {
        fetchCallCount++;
        return {
            status: 200,
            ok: true,
            json: async () => ({
                response: {
                    candidates: [{ content: { parts: [{ text: 'success data' }] } }]
                }
            })
        };
    });

    const provider = new GoogleProvider({ auth: { type: 'oauth' }, model: 'test-model' });

    try {
        const result = await provider.fetchWithBackoff('http://dummy.url', 'dummy_token', { request: 'data' });

        assert.strictEqual(result, 'success data');
        assert.strictEqual(fetchCallCount, 1);
        assert.ok(!loggedMessages.some(m => m.includes('Quota exhausted')));
    } finally {
        console.log = originalLog;
    }
});

test('GoogleProvider fetchWithBackoff - Success after retries (429)', async (t) => {
    // Override setTimeout locally to capture the resolve callbacks
    const originalSetTimeout = global.setTimeout;
    const timeouts = [];
    t.mock.method(global, 'setTimeout', (cb, ms) => {
        timeouts.push({ cb, ms });
        // Don't actually call the real setTimeout
    });

    let loggedMessages = [];
    console.log = (...args) => {
        loggedMessages.push(args.join(' '));
    };

    let fetchCallCount = 0;
    let mockFetchResponses = [
        { status: 429 },
        { status: 429 },
        {
            status: 200,
            ok: true,
            json: async () => ({
                response: {
                    candidates: [{ content: { parts: [{ text: 'delayed success data' }] } }]
                }
            })
        }
    ];

    t.mock.method(global, 'fetch', async (url, options) => {
        fetchCallCount++;
        return mockFetchResponses.shift();
    });

    const provider = new GoogleProvider({ auth: { type: 'oauth' }, model: 'test-model' });

    const promise = provider.fetchWithBackoff('http://dummy.url', 'dummy_token', { request: 'data' }, 5);

    // Process microtasks so fetch is called, receives 429, and calls setTimeout
    await new Promise(setImmediate);

    assert.strictEqual(timeouts.length, 1);
    assert.ok(timeouts[0].ms >= 2000 && timeouts[0].ms <= 3000, `Expected delay to be between 2000 and 3000, got ${timeouts[0].ms}`);

    // Resolve the first timeout
    timeouts.shift().cb();
    await new Promise(setImmediate);

    assert.strictEqual(timeouts.length, 1);
    assert.ok(timeouts[0].ms >= 4000 && timeouts[0].ms <= 5000, `Expected delay to be between 4000 and 5000, got ${timeouts[0].ms}`);

    // Resolve the second timeout
    timeouts.shift().cb();
    await new Promise(setImmediate);

    const result = await promise;

    try {
        assert.strictEqual(result, 'delayed success data');
        assert.strictEqual(fetchCallCount, 3);
        assert.ok(loggedMessages.some(m => m.includes('Quota exhausted (429)')));
    } finally {
        console.log = originalLog;
    }
});

test('GoogleProvider fetchWithBackoff - Failure after max retries (429)', async (t) => {
    const timeouts = [];
    t.mock.method(global, 'setTimeout', (cb, ms) => {
        timeouts.push({ cb, ms });
    });

    let fetchCallCount = 0;
    t.mock.method(global, 'fetch', async (url, options) => {
        fetchCallCount++;
        return { status: 429 };
    });

    const provider = new GoogleProvider({ auth: { type: 'oauth' }, model: 'test-model' });

    const promise = provider.fetchWithBackoff('http://dummy.url', 'dummy_token', { request: 'data' }, 3);

    await new Promise(setImmediate); // After 1st fetch (fails)
    assert.strictEqual(timeouts.length, 1);
    timeouts.shift().cb();

    await new Promise(setImmediate); // After 2nd fetch (fails)
    assert.strictEqual(timeouts.length, 1);
    timeouts.shift().cb();

    await new Promise(setImmediate); // After 3rd fetch (fails)
    assert.strictEqual(timeouts.length, 1);
    timeouts.shift().cb();

    let errorThrown = false;
    try {
        await promise;
    } catch (e) {
        errorThrown = true;
        assert.ok(e.message.includes('Max retries'), `Expected error message to contain 'Max retries', got: ${e.message}`);
    }

    assert.ok(errorThrown, 'Should have thrown an error');
    assert.strictEqual(fetchCallCount, 3);
});

test.after(() => {
    Module.prototype.require = originalRequire;
    delete Module.prototype.require._isMockedForGoogleRetry;
});
