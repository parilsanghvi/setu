const test = require('node:test');
const assert = require('node:assert');
const express = require('express');
const http = require('http');
const Module = require('module');
const fs = require('fs');
const path = require('path');

// --- Mock Initializer ---
let gateStatus = { ok: true };
let lastTaskEmitted = null;
let lastMessageEmitted = null;

const originalRequire = Module.prototype.require;
const mocks = {
    './middleware/auth': (req, res, next) => next(), // bypass auth for routing logic
    './onboarding/status': { getOnboardingStatus: () => gateStatus },
    './onboarding/governance-profiles': {
        getActiveProfile: () => ({ name: 'strict', config: { strict_diff: true } })
    },
    './onboarding/paths': {
        getSetuPath: (p) => path.join(__dirname, 'mock_paths', p) // fake path
    },
    './utils': {
        readLastLines: async () => ['{"ok": true, "drift_percent": 5, "missing_docs": ["foo.md"]}']
    },
    './Logger': class MockLogger { info() { } error() { } warn() { } },
    './db': {
        db: {
            prepare: (sql) => {
                if (sql.includes('agents')) return { all: () => [{ name: 'Agent1' }], get: () => ({ count: 1 }) };
                if (sql.includes('tasks')) return { all: () => [{ id: 'TASK-1' }], get: () => ({ count: 1 }) };
                return { all: () => [], get: () => ({}) }
            }
        },
        getAgents: () => [{ name: 'Agent1' }],
        getTasks: () => [{ id: 'TASK-1' }],
        updateTask: (id, status, meta) => { lastTaskEmitted = { id, status, meta }; },
        send: (sender, recipient, message, type) => { lastMessageEmitted = { sender, recipient, message, type }; }
    }
};

Module.prototype.require = function (id) {
    if (mocks[id]) return mocks[id];
    return originalRequire.apply(this, arguments);
};

const setupRoutes = require('../lib/routes');

test('Server Routes: Setup & API Checks', async (t) => {
    const app = express();
    const logger = new (mocks['./Logger'])();
    setupRoutes(app, logger);
    const server = http.createServer(app);

    // Spin up server on random port
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    const fetchAPI = async (method, route, body = null) => {
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(`http://localhost:${port}${route}`, opts);
        const data = await res.json().catch(() => null);
        return { status: res.status, data };
    };

    // 1. GET /api/stats
    let res = await fetchAPI('GET', '/api/stats');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.activeAgents, 1);
    assert.strictEqual(res.data.pendingTasks, 1);

    // 2. GET /api/tasks
    res = await fetchAPI('GET', '/api/tasks');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data[0].id, 'TASK-1');

    // 3. POST /api/tasks (Hard Gate Bypass - OK)
    gateStatus = { ok: true };
    res = await fetchAPI('POST', '/api/tasks', { title: 'New Valid Task', type: 'code' });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.id.startsWith('TASK-'));
    assert.strictEqual(lastTaskEmitted.meta.title, 'New Valid Task');

    // 4. POST /api/tasks (Hard Gate Failure - 403)
    gateStatus = { ok: false, missing: ['mock.md'], errors: ['fail'] };
    res = await fetchAPI('POST', '/api/tasks', { title: 'Should Fail' });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.error, 'Hard Gate Failure: Onboarding Incomplete');
    assert.strictEqual(res.data.missing[0], 'mock.md');

    // 5. POST /api/chat
    res = await fetchAPI('POST', '/api/chat', { agent: 'Rakshak', message: 'Hello' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'sent');
    assert.strictEqual(lastMessageEmitted.recipient, 'Rakshak');
    assert.strictEqual(lastMessageEmitted.message, 'Hello');

    // 6. POST /api/chat (Long Payload > 10KB filters)
    const longMessage = 'A'.repeat(10001);
    res = await fetchAPI('POST', '/api/chat', { agent: 'Rakshak', message: longMessage });
    assert.strictEqual(res.status, 400);
    assert.match(res.data.error, /Message too long/);

    // 7. GET /api/tasks/:id/screenshots (Path Traversal attempt)
    res = await fetchAPI('GET', '/api/tasks/..%2F..%2Fetc%2Fpasswd/screenshots');
    assert.strictEqual(res.status, 400); // Fails regex validation: [a-zA-Z0-9-_]+

    server.close();
});
