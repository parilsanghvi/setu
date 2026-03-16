const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const Module = require('module');
const path = require('path');

// Set Env Var before requiring server (to avoid auth errors during load)
process.env.DASHBOARD_PASS = 'secret';

// --- Mock Setup ---
const originalRequire = Module.prototype.require;
const mocks = {};

// Mock Data
const MOCK_AGENTS = [
    { name: 'Agent1', status: 'IDLE', role: 'Tester' },
    { name: 'Agent2', status: 'BUSY', role: 'Developer' }
];
const MOCK_TASKS = [
    { id: 'TASK-1', title: 'Test Task', status: 'TODO', updated_at: 1000 },
    { id: 'TASK-2', title: 'Done Task', status: 'DONE', updated_at: 2000 }
];

// Mock Implementation for lib/db
const mockDb = {
    db: {
        prepare: (sql) => {
            // Simple SQL parsing for mock behavior
            if (sql.includes("count(*) as count FROM agents")) {
                return { get: () => ({ count: MOCK_AGENTS.filter(a => a.status !== 'OFFLINE').length }) };
            }
            if (sql.includes("count(*) as count FROM tasks")) {
                return { get: () => ({ count: MOCK_TASKS.filter(t => t.status !== 'DONE').length }) };
            }
            if (sql.includes('FROM tasks')) {
                return { all: () => MOCK_TASKS };
            }
            if (sql.includes('FROM agents')) {
                return { all: () => MOCK_AGENTS };
            }
            // Default fallback
            return {
                get: () => ({}),
                all: () => [],
                run: () => { }
            };
        }
    },
    getActiveAgentsCount: () => ({ count: MOCK_AGENTS.filter(a => a.status !== 'OFFLINE').length }),
    getPendingTasksCount: () => ({ count: MOCK_TASKS.filter(t => t.status !== 'DONE').length }),
    getAgents: () => MOCK_AGENTS,
    getTasks: () => MOCK_TASKS,
    getTasksOrdered: () => MOCK_TASKS,
    updateTask: (id, status, meta) => {
        // console.log('Mock updateTask called:', id, status, meta);
    },
    send: (sender, recipient, content, type, meta) => {
        // console.log('Mock send called:', sender, recipient, content);
    },
    on: (event, cb) => { } // No-op for bus events
};

// Mock Implementation for lib/utils
const mockUtils = {
    readLastLines: async () => []
};

// Intercept require
Module.prototype.require = function (id) {
    const caller = this.filename;
    // Only mock calls originating from our project source or test
    // We specifically want to intercept calls FROM lib/server.js or lib/routes.js
    if (caller && (caller.endsWith('lib/server.js') || caller.endsWith('lib/routes.js') || caller.endsWith('test-dashboard-api.js'))) {
        if (id === './db' || id.endsWith('/db')) return mockDb;
        if (id === './utils' || id.endsWith('/utils')) return mockUtils;
    }

    return originalRequire.apply(this, arguments);
};

// --- Test Implementation ---

const DashboardServer = require('../lib/server');

// Helper for making HTTP requests
function makeRequest(port, method, path, body = null, auth = true) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (auth) {
            options.headers['Authorization'] = 'Basic YWRtaW46c2VjcmV0'; // admin:secret
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    resolve({ statusCode: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

test('Dashboard API Integration Tests', async (t) => {
    // Setup Environment
    const PORT = 0; // Random port
    const server = new DashboardServer(PORT);

    // Start server
    await new Promise(resolve => {
        server.server.listen(0, () => {
            server.port = server.server.address().port;
            resolve();
        });
    });

    const port = server.port;

    // 1. Auth Check
    await t.test('GET /api/stats without auth returns 401', async () => {
        const res = await makeRequest(port, 'GET', '/api/stats', null, false);
        assert.strictEqual(res.statusCode, 401);
    });

    // 2. Stats Endpoint
    await t.test('GET /api/stats returns correct stats', async () => {
        const res = await makeRequest(port, 'GET', '/api/stats');
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.activeAgents, 2);
        assert.strictEqual(res.body.pendingTasks, 1); // 1 TODO
        assert.ok(typeof res.body.uptime === 'number');
    });

    // 3. Agents Endpoint
    await t.test('GET /api/agents returns agent list', async () => {
        const res = await makeRequest(port, 'GET', '/api/agents');
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.length, 2);
        assert.strictEqual(res.body[0].name, 'Agent1');
    });

    // 4. Tasks Endpoint
    await t.test('GET /api/tasks returns task list', async () => {
        const res = await makeRequest(port, 'GET', '/api/tasks');
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.length, 2);
        assert.strictEqual(res.body[0].id, 'TASK-1');
    });

    // 5. Chat Endpoint
    await t.test('POST /api/chat sends message via bus', async () => {
        // We can spy on db.send if we want, but verifying 200 OK is a good start for integration
        const payload = { agent: 'Agent1', message: 'Hello' };

        // Enhance mock to spy
        let sendCalled = false;
        const originalSend = mockDb.send;
        mockDb.send = (sender, recipient, content, type, meta) => {
            sendCalled = true;
            assert.strictEqual(recipient, 'Agent1');
            assert.strictEqual(content, 'Hello');
            return originalSend(sender, recipient, content, type, meta);
        };

        const res = await makeRequest(port, 'POST', '/api/chat', payload);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.body.status, 'sent');
        assert.strictEqual(sendCalled, true);
    });

    // Cleanup
    server.stop();

    // Restore require (good practice, though process will exit)
    Module.prototype.require = originalRequire;
});
