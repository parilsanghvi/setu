const assert = require('assert');
const Module = require('module');

// Mock Dependencies
const originalRequire = Module.prototype.require;

// Mock Express
const expressMock = () => {
    const app = {
        use: () => { },
        get: function (path, handler) {
            this.routes = this.routes || {};
            this.routes[path] = handler;
        },
        post: function (path, handler) {
            this.routes = this.routes || {};
            this.routes[path] = handler;
        },
        listen: () => { },
    };
    return app;
};
expressMock.static = () => { };
expressMock.json = () => { };

const logs = [];

const mocks = {
    'express': expressMock,
    'http': {
        createServer: () => ({ listen: (port, cb) => { if (cb) cb(); } })
    },
    'socket.io': {
        Server: class {
            constructor() {
                this.on = () => { };
                this.emit = () => { };
                this.use = () => { };
            }
        }
    },
    'helmet': () => () => { },
    './db': {
        db: { prepare: () => ({ get: () => ({}), all: () => [] }) },
        on: () => { },
        send: () => { }
    },
    './middleware/auth': () => { },
    './utils': { readLastLines: async () => [] },
    './Logger': class {
        constructor() { }
        info() { }
        error(msg) {
            logs.push(msg);
        }
    },
    './onboarding/paths': { getSetuPath: () => '' },
    // Mocking the module that throws an error
    './onboarding/status': {
        getOnboardingStatus: () => {
            throw new Error('Secret Database Connection String Leaked!');
        }
    }
};

Module.prototype.require = function (id) {
    if (mocks[id]) return mocks[id];
    // Handle relative paths resolution for mocks
    if (id.endsWith('/db')) return mocks['./db'];
    if (id.endsWith('/middleware/auth')) return mocks['./middleware/auth'];
    if (id.endsWith('/utils')) return mocks['./utils'];
    if (id.endsWith('/Logger')) return mocks['./Logger'];
    if (id.endsWith('/onboarding/paths')) return mocks['./onboarding/paths'];
    if (id.endsWith('/onboarding/status')) return mocks['./onboarding/status'];

    return originalRequire.apply(this, arguments);
};

console.log('🧪 Verifying Server Error Handling...');

(async () => {
    try {
        const DashboardServer = require('../lib/server');
        const server = new DashboardServer(4000);

        // Mock Request and Response
        const req = {};
        const res = {
            statusCode: 200,
            body: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.body = data;
                return this;
            }
        };

        // Trigger the vulnerable endpoint
        const handler = server.app.routes['/api/onboarding'];
        if (!handler) {
            throw new Error('Route /api/onboarding not found');
        }

        handler(req, res);

        // Check results
        if (res.statusCode !== 500) {
            throw new Error(`Expected status 500, got ${res.statusCode}`);
        }

        if (res.body && res.body.error === 'Internal Server Error') {
            console.log('✅ Secure: Generic error message returned.');
        } else {
            console.error(`❌ Insecure: Error message leaked: ${res.body ? res.body.error : 'undefined'}`);
            process.exit(1);
        }

        // Verify that the error was logged internally
        const loggedError = logs.find(l => l.includes('Secret Database Connection String Leaked!'));
        if (loggedError) {
            console.log('✅ Secure: Detailed error logged internally.');
        } else {
            console.error('❌ Insecure: Detailed error NOT logged.');
            process.exit(1);
        }

        process.exit(0);

    } catch (e) {
        console.error('❌ Test Failed:', e);
        process.exit(1);
    }
})();
