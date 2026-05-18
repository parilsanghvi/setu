const assert = require('assert');
const Module = require('module');

// Intercept express to capture route registrations
const originalRequire = Module.prototype.require;
const mockExpress = () => {
    const mockApp = {
        routes: {},
        get: function(path, ...args) { this.routes[`GET ${path}`] = args; },
        post: function(path, ...args) { this.routes[`POST ${path}`] = args; },
        put: function(path, ...args) { this.routes[`PUT ${path}`] = args; },
        delete: function(path, ...args) { this.routes[`DELETE ${path}`] = args; },
        use: function() {}
    };
    return mockApp;
};
mockExpress.static = () => {};
mockExpress.json = () => {};

// Replace original require to supply mocks
Module.prototype.require = function(path) {
    if (path === 'express') {
        return mockExpress;
    }
    // We only care about mocking express for route interception, let other stuff load or mock if necessary.
    // To avoid errors from actual db connection, mock out db as well.
    if (path === './db') {
        return {
            db: { prepare: () => ({ get: () => ({ count: 0 }), all: () => [] }) },
            updateTask: () => {},
            deleteTask: () => {}
        };
    }
    if (path === './middleware/auth') {
        return function mockAuthMiddleware(req, res, next) { next(); };
    }
    return originalRequire.apply(this, arguments);
};

try {
    const setupRoutes = require('../lib/routes');

    // Create an app instance using our mock
    const expressModule = require('express');
    const app = expressModule();
    const mockLogger = { error: () => {}, warn: () => {}, info: () => {} };

    // Call setupRoutes to register routes on the mock app
    setupRoutes(app, mockLogger);

    const commitRouteArgs = app.routes['POST /api/git/commit'];
    assert.ok(commitRouteArgs, '/api/git/commit route should be registered');

    // We expect the arguments to be [authMiddleware, handler]
    assert.strictEqual(commitRouteArgs.length, 2, 'Route should have 2 handlers (middleware + final handler)');

    const middleware = commitRouteArgs[0];
    const isMockAuthMiddleware = middleware.name === 'mockAuthMiddleware';

    assert.ok(isMockAuthMiddleware, 'The first argument should be the authMiddleware');

    console.log('✅ Defense-in-depth: authMiddleware explicitly applied to /api/git/commit route.');
} catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
} finally {
    // Restore original require
    Module.prototype.require = originalRequire;
}
