const Module = require('module');
const path = require('path');
const originalRequire = Module.prototype.require;

let appInstance;
const mockBus = {
  db: {
    prepare: () => ({
      get: () => ({ id: 0, count: 0, t: 0, c: 0 }),
      all: () => [],
      run: () => ({ lastInsertRowid: 1 })
    })
  },
  send: () => { },
  on: () => { },
  heartbeat: () => { },
  getDeadAgents: () => [],
  updateTask: () => { }
};

const mocks = {
  'express': Object.assign(() => {
    const app = function (req, res, next) { };
    app.use = () => { };
    app.get = (path, handler) => { app.routes['GET ' + path] = handler; };
    app.post = (path, handler) => { app.routes['POST ' + path] = handler; };
    app.routes = {};
    app.listen = (port, host, cb) => { if (cb) cb(); };
    app.static = () => { };
    return app;
  }, {
    json: () => (req, res, next) => next(),
    static: () => (req, res, next) => next()
  }),
  'http': {
    createServer: (app) => ({ listen: app.listen, close: (cb) => cb && cb() })
  },
  'socket.io': { Server: class { on() { } emit() { } use() { } } },
  'cors': () => (req, res, next) => next(),
  'helmet': () => (req, res, next) => next(),
  'better-sqlite3': function () {
    return mockBus.db;
  },
  'child_process': {
    fork: () => ({ stdout: { on: () => { } }, stderr: { on: () => { } }, on: () => { }, kill: () => { } })
  }
};

// Capture the app instance when created
const originalExpress = mocks['express'];
mocks['express'] = Object.assign(() => {
  const app = originalExpress();
  appInstance = app;
  return app;
}, originalExpress);


Module.prototype.require = function (id) {
  if (mocks[id]) return mocks[id];

  if (id === './lib/db' || id.endsWith('/lib/db')) {
    return mockBus;
  }

  return originalRequire.apply(this, arguments);
};

// Set env
process.env.DASHBOARD_PASS = 'secret';
process.env.LOG_LEVEL = 'silent';

console.log('🚀 Loading index.js with mocks...');
try {
  require('../index.js');
} catch (e) {
  console.error('Failed to load index.js:', e);
  process.exit(1);
}

console.log('✅ index.js loaded.');

if (!appInstance) {
  console.error('❌ Failed to capture app instance.');
  process.exit(1);
}

const handler = appInstance.routes['POST /api/chat'];
if (!handler) {
  console.error('❌ Handler for POST /api/chat not found.');
  process.exit(1);
}

console.log('🧪 Testing POST /api/chat payload size...');

// Test 1: Small payload (should pass 200)
{
  const req = { body: { agent: 'Tark', message: 'Small message' } };
  let status = 200;
  let response = {};
  const res = {
    status: (s) => { status = s; return res; },
    json: (j) => { response = j; }
  };

  try {
    handler(req, res);
    console.log(`   Small payload status: ${status}`);
    if (status !== 200 && status !== undefined) {
      console.error('   ❌ Expected 200 for small payload');
    }
  } catch (e) { console.error(e); }
}

// Test 2: Large payload (should fail 400 or 413)
{
  const largeMessage = 'A'.repeat(50 * 1024); // 50KB
  const req = { body: { agent: 'Tark', message: largeMessage } };
  let status = 200; // Default if not called
  let response = {};
  const res = {
    status: (s) => { status = s; return res; },
    json: (j) => { response = j; }
  };

  try {
    handler(req, res);
    console.log(`   Large payload status: ${status}`);

    if (status === 200) {
      console.log('⚠️  Vulnerability CONFIRMED: Large message accepted (Status 200).');
    } else if (status === 400 || status === 413) {
      console.log('✅  Fix CONFIRMED: Large message rejected.');
    } else {
      console.log(`❓  Unexpected status: ${status}`);
    }
  } catch (e) { console.error(e); }
}

console.log('🏁 Verification complete.');
process.exit(0);
