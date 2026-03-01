const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

test('socketAuth middleware', async (t) => {
  // Mock socket and next function
  const createMockSocket = (authHeader) => ({
    handshake: {
      headers: authHeader ? { authorization: authHeader } : {}
    }
  });

  const originalRequire = Module.prototype.require;

  t.afterEach(() => {
    Module.prototype.require = originalRequire;
    delete require.cache[require.resolve('../lib/middleware/socketAuth')];
  });

  await t.test('calls next with error if authorization header is missing', (t, done) => {
    const socketAuth = require('../lib/middleware/socketAuth');
    const socket = createMockSocket(undefined);
    socketAuth(socket, (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Authentication required');
      done();
    });
  });

  await t.test('calls next with error if authorization header does not start with Basic', (t, done) => {
    const socketAuth = require('../lib/middleware/socketAuth');
    const socket = createMockSocket('Bearer token123');
    socketAuth(socket, (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Authentication required');
      done();
    });
  });

  await t.test('calls next with error if authorization header parts length is not 2', (t, done) => {
    const socketAuth = require('../lib/middleware/socketAuth');
    const socket = createMockSocket('Basic');
    socketAuth(socket, (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Authentication required');
      done();
    });
  });

  await t.test('calls next with error if decoded credentials do not contain a colon', (t, done) => {
    const socketAuth = require('../lib/middleware/socketAuth');
    const encoded = Buffer.from('invalidcredentials').toString('base64');
    const socket = createMockSocket(`Basic ${encoded}`);
    socketAuth(socket, (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Authentication required');
      done();
    });
  });

  await t.test('calls next with error if credentials are invalid', (t, done) => {
    Module.prototype.require = function(id) {
      if (id === '../auth/basic') {
        return {
          validate: (user, pass) => false
        };
      }
      return originalRequire.apply(this, arguments);
    };

    const socketAuth = require('../lib/middleware/socketAuth');
    const encoded = Buffer.from('wronguser:wrongpass').toString('base64');
    const socket = createMockSocket(`Basic ${encoded}`);

    socketAuth(socket, (err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Invalid credentials');
      done();
    });
  });

  await t.test('calls next without error if credentials are valid', (t, done) => {
    let validatedUser, validatedPass;
    Module.prototype.require = function(id) {
      if (id === '../auth/basic') {
        return {
          validate: (user, pass) => {
            validatedUser = user;
            validatedPass = pass;
            return true;
          }
        };
      }
      return originalRequire.apply(this, arguments);
    };

    const socketAuth = require('../lib/middleware/socketAuth');
    const encoded = Buffer.from('admin:secret').toString('base64');
    const socket = createMockSocket(`Basic ${encoded}`);

    socketAuth(socket, (err) => {
      assert.strictEqual(err, undefined);
      assert.strictEqual(validatedUser, 'admin');
      assert.strictEqual(validatedPass, 'secret');
      done();
    });
  });
});
