const assert = require('assert');
const path = require('path');
const Module = require('module');

// Mock Dependencies
const originalRequire = Module.prototype.require;
const mocks = {
    'express': Object.assign(
        () => {
            const app = {
                use: () => { },
                get: () => { },
                post: () => { },
                listen: () => { },
            };
            app.static = () => { };
            app.json = () => { };
            return app;
        },
        { static: () => { }, json: () => { } }
    ),
    'http': {
        createServer: () => ({ listen: (port, cb) => { if (cb) cb(); } })
    },
    'socket.io': {
        Server: class {
            constructor() {
                this.handlers = {};
            }
            use() { }
            on(event, handler) {
                this.handlers[event] = handler;
            }
            emit() { }
            // Helper to trigger event
            trigger(event, ...args) {
                if (this.handlers[event]) {
                    this.handlers[event](...args);
                }
            }
        }
    },
    'helmet': () => () => { },
    './db': {
        db: {
            prepare: () => ({
                get: () => ({ count: 0 }),
                all: () => [],
                run: () => { }
            })
        },
        on: () => { },
        send: () => { }
    },
    './middleware/auth': () => { },
    './utils': {
        readLastLines: async () => []
    }
};

Module.prototype.require = function (id) {
    if (mocks[id]) {
        return mocks[id];
    }
    // Handle relative paths
    if (id.endsWith('/db')) return mocks['./db'];
    if (id.endsWith('/middleware/auth')) return mocks['./middleware/auth'];
    if (id.endsWith('/utils')) return mocks['./utils'];

    return originalRequire.apply(this, arguments);
};

// Start Test
console.log('🧪 Verifying Server Logging...');

// Capture Console
const logs = [];
const originalLog = console.log;
const originalError = console.error;
console.log = (...args) => logs.push({ level: 'info', args });
console.error = (...args) => logs.push({ level: 'error', args });

(async () => {
    try {
        const DashboardServer = require('../lib/server');

        // 1. Verify Instantiation
        const server = new DashboardServer(3999);
        assert(server.app, 'Express app should be initialized');
        assert(server.io, 'Socket.io should be initialized');
        assert.strictEqual(server.port, 3999, 'Port should be 3999');
        assert(typeof server.setupRoutes === 'function');
        assert(typeof server.start === 'function');

        // 2. Verify Logging
        // Trigger connection
        const socketMock = {
            emit: () => { },
            on: () => { }
        };

        const connectionHandler = server.io.handlers['connection'];
        if (connectionHandler) {
            await connectionHandler(socketMock);
        } else {
            throw new Error('No connection handler registered');
        }

        // Check logs
        const connectionLog = logs.find(l => l.args.some(a => typeof a === 'string' && a.includes('User connected to Dashboard')));

        if (!connectionLog) {
            throw new Error('Connection log not found');
        }

        // Check format
        const logMessage = connectionLog.args[0];

        // We expect JSON if fixed, or plain text if not.
        let isJson = false;
        try {
            const parsed = JSON.parse(logMessage);
            if (parsed.name === 'GUI' || parsed.name === 'DashboardServer') {
                isJson = true;
            }
        } catch (e) {
            // Not JSON
        }

        // Restore Console
        console.log = originalLog;
        console.error = originalError;

        if (isJson) {
            console.log('✅ Log is structured JSON.');
            process.exit(0);
        } else {
            console.error('❌ Log is plain text (Expected structured JSON).');
            process.exit(1);
        }

    } catch (e) {
        console.log = originalLog;
        console.error = originalError;
        console.error('❌ Test Failed:', e);
        process.exit(1);
    }
})();
