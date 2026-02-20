const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');
const http = require('http');
const child_process = require('child_process');

// Mock dependencies
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === '../Config') {
        return {
            googleClientId: 'mock-client-id',
            googleClientSecret: 'mock-client-secret'
        };
    }
    return originalRequire.apply(this, arguments);
};

const originalSpawn = child_process.spawn;
child_process.spawn = () => ({ unref: () => {} });

// Mock http.Server.prototype.listen
const originalListen = http.Server.prototype.listen;
let listenArgs = null;

// We need to patch it before requiring GoogleAuth just in case (though GoogleAuth doesn't create server at top level)
http.Server.prototype.listen = function(...args) {
    listenArgs = args;
    const cb = args[args.length - 1];
    if (typeof cb === 'function') cb();
    return this;
};

// Load the module
const googleAuth = require('../lib/auth/google');

test('GoogleAuth binds to localhost', async (t) => {
    // Calling login() should trigger server.listen
    // We don't await it because it returns a promise that never resolves in this mock setup
    googleAuth.login().catch(() => {});

    assert.ok(listenArgs, 'server.listen should have been called');

    const port = listenArgs[0];
    const hostOrCb = listenArgs[1];

    console.log('Listen args:', listenArgs);

    assert.strictEqual(port, 51121);

    // This assertion expects the fix. It will fail currently.
    assert.strictEqual(hostOrCb, '127.0.0.1', 'Should bind to 127.0.0.1');
});

// Restore mocks
test.after(() => {
    http.Server.prototype.listen = originalListen;
    child_process.spawn = originalSpawn;
    Module.prototype.require = originalRequire;
});
