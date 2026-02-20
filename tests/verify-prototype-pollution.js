
const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');
const path = require('path');

// Mocks
const mockApp = {
  use: () => {},
  get: () => {},
  post: (route, handler) => {
    // console.log('Mocked POST:', route);
    mockApp.routes.post[route] = handler;
  },
  routes: { post: {}, get: {} }
};

const mockRes = {
  status: (code) => {
    mockRes.statusCode = code;
    return mockRes;
  },
  json: (data) => {
    mockRes.data = data;
    return mockRes;
  }
};

const mockServer = {
  listen: (port, host, cb) => { if (cb) cb(); },
  close: (cb) => { if (cb) cb(); }
};

const mockIo = {
  emit: () => {},
  on: () => {}
};

// Mock timers to prevent hanging
global.setInterval = () => ({ unref: () => {} });
global.setTimeout = (cb) => cb();

// Intercept require
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  // console.log('Requiring:', id);
  if (id === 'express') {
    const express = () => mockApp;
    express.json = () => {};
    express.static = () => {};
    return express;
  }
  if (id === 'http') return { createServer: () => mockServer };
  if (id === 'socket.io') return { Server: function() { return mockIo; } };
  if (id === 'cors') return () => () => {};
  if (id === 'helmet') return () => () => {};
  if (id === './lib/db') return {
    db: { prepare: () => ({ get: () => ({}), all: () => [], run: () => {} }) },
    on: () => {},
    send: () => {},
    getDeadAgents: () => [],
    heartbeat: () => {}
  };
  if (id === 'fs') return {
    existsSync: () => false,
    appendFileSync: () => {},
    readdirSync: () => [],
    statSync: () => ({ size: 0, mtime: 0 }),
    watch: () => ({ on: () => {} }),
    createReadStream: () => ({ on: () => {} }),
    promises: { readFile: async () => '' }
  };
  if (id === 'readline') return { createInterface: () => ({ question: () => {} }) };
  if (id === './lib/middleware/auth') return (req, res, next) => next();
  if (id === 'child_process') return {
    fork: () => ({
      stdout: { on: () => {} },
      stderr: { on: () => {} },
      on: () => {},
      kill: () => {},
      send: () => {},
      pid: 123
    })
  };

  return originalRequire.call(this, id);
};

// Load index.js (this will register routes)
try {
  require('../index.js');
} catch (e) {
  console.error('Error loading index.js:', e);
}

// Restore require
Module.prototype.require = originalRequire;

test('Security: /api/agents/:name/interrupt Prototype Pollution', async (t) => {
  const handler = mockApp.routes.post['/api/agents/:name/interrupt'];

  if (!handler) {
      console.error('Handler not found. Routes:', Object.keys(mockApp.routes.post));
      assert.fail('Handler for interrupt route not found');
  }

  // Test 1: "constructor" payload
  mockRes.statusCode = 200;
  mockRes.data = null;

  try {
    handler({ params: { name: 'constructor' } }, mockRes);

    // If vulnerable, accessing RUNNING_PROCESSES['constructor'] returns Object.prototype.constructor
    // Then process.send calls Object.prototype.constructor.send which throws.

    // If fixed (using Object.create(null)), it returns undefined.
    // If fixed (using safe lookup), it returns undefined.

    // Since we mocked everything, RUNNING_PROCESSES starts empty (or mocked).
    // Wait, RUNNING_PROCESSES is local to index.js. We can't inspect it directly.
    // But we can infer state from response.

    // If vulnerable code runs: const process = RUNNING_PROCESSES['constructor'] -> function Object() { ... }
    // process.send(...) -> CRASH

    // If we catch the crash in test runner, fail.

    assert.strictEqual(mockRes.statusCode, 404);
    assert.ok(mockRes.data.error.includes('not running'));

  } catch (e) {
    // Current behavior: Crash because RUNNING_PROCESSES is {}
    // We expect this to fail initially.
    throw e;
  }
});

test('Security: /api/agents/:name/redirect Prototype Pollution', async (t) => {
  const handler = mockApp.routes.post['/api/agents/:name/redirect'];
  assert.ok(handler, 'Handler for redirect route should exist');

  // Test 1: "constructor" payload
  mockRes.statusCode = 200;
  mockRes.data = null;

  try {
    handler({ params: { name: 'constructor' }, body: { prompt: 'foo' } }, mockRes);

    assert.strictEqual(mockRes.statusCode, 404);
    assert.ok(mockRes.data.error.includes('not running'));

  } catch (e) {
    throw e;
  }
});
