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
        error() { }
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

        if (res.body && res.body.error === 'Secret Database Connection String Leaked!') {
            console.log('❌ Vulnerability Reproduced: Error message leaked to client.');
            process.exit(1);
        } else if (res.body && res.body.error === 'Internal Server Error') {
            console.log('✅ Fix Verified: Generic error message returned.');
            process.exit(0);
        } else {
            console.log(`❓ Unexpected error message: ${res.body ? res.body.error : 'undefined'}`);
            process.exit(1);
        }

    } catch (e) {
        console.error('❌ Test Failed:', e);
        process.exit(1);
    }
})();
