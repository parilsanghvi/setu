const test = require('node:test');
const assert = require('node:assert');
const socketAuth = require('./socketAuth');
const { validate } = require('../auth/basic');

test('Socket Auth Middleware', async (t) => {
  const TEST_USER = 'admin';
  const TEST_PASS = 'secret123';

  // Setup env
  process.env.DASHBOARD_PASS = TEST_PASS;

  // Helper to create mock socket and next
  const createMocks = (authHeader) => {
    const socket = {
      handshake: {
        headers: {}
      }
    };

    if (authHeader !== undefined) {
      socket.handshake.headers.authorization = authHeader;
    }

    let nextError = null;
    let calledNext = false;

    const next = (err) => {
      calledNext = true;
      if (err) {
        nextError = err;
      }
    };

    return { socket, next, getNextError: () => nextError, wasNextCalled: () => calledNext };
  };

  await t.test('Missing authorization header', () => {
    const { socket, next, getNextError, wasNextCalled } = createMocks();
    socketAuth(socket, next);

    assert.strictEqual(wasNextCalled(), true);
    assert.ok(getNextError() instanceof Error);
    assert.strictEqual(getNextError().message, 'Authentication required');
  });

  await t.test('Malformed header - Missing "Basic"', () => {
    const { socket, next, getNextError, wasNextCalled } = createMocks('Bearer something');
    socketAuth(socket, next);

    assert.strictEqual(wasNextCalled(), true);
    assert.ok(getNextError() instanceof Error);
    assert.strictEqual(getNextError().message, 'Authentication required');
  });

  await t.test('Malformed header - Extra parts', () => {
    const credentials = Buffer.from('user:pass').toString('base64');
    const { socket, next, getNextError, wasNextCalled } = createMocks(`Basic ${credentials} extra`);
    socketAuth(socket, next);

    assert.strictEqual(wasNextCalled(), true);
    assert.ok(getNextError() instanceof Error);
    assert.strictEqual(getNextError().message, 'Authentication required');
  });

  await t.test('Malformed credentials - Not Base64 / no colon', () => {
    const credentials = Buffer.from('userpass').toString('base64');
    const { socket, next, getNextError, wasNextCalled } = createMocks(`Basic ${credentials}`);
    socketAuth(socket, next);

    assert.strictEqual(wasNextCalled(), true);
    assert.ok(getNextError() instanceof Error);
    assert.strictEqual(getNextError().message, 'Authentication required');
  });

  await t.test('Invalid credentials', () => {
    const credentials = Buffer.from(`${TEST_USER}:wrongpass`).toString('base64');
    const { socket, next, getNextError, wasNextCalled } = createMocks(`Basic ${credentials}`);
    socketAuth(socket, next);

    assert.strictEqual(wasNextCalled(), true);
    assert.ok(getNextError() instanceof Error);
    assert.strictEqual(getNextError().message, 'Invalid credentials');
  });

  await t.test('Valid credentials', () => {
    const credentials = Buffer.from(`${TEST_USER}:${TEST_PASS}`).toString('base64');
    const { socket, next, getNextError, wasNextCalled } = createMocks(`Basic ${credentials}`);
    socketAuth(socket, next);

    assert.strictEqual(wasNextCalled(), true);
    assert.strictEqual(getNextError(), null, 'Should not pass an error to next()');
  });
});
