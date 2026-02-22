const assert = require('assert');

// Set environment variable BEFORE requiring auth module
process.env.DASHBOARD_PASS = 'secret';

// Suppress console.log from auth module if any (though authMiddleware itself doesn't log much)
// const originalLog = console.log;
// console.log = () => {};

const authMiddleware = require('../lib/middleware/auth');

// Restore console.log
// console.log = originalLog;

console.log('Running Verification Test: Rate Limit on Auth Failure');

function createMock(ip, authHeader) {
  const req = {
    method: 'GET',
    headers: { authorization: authHeader },
    ip: ip,
    socket: { remoteAddress: ip }
  };
  const res = {
    statusCode: 200,
    headers: {},
    setHeader: (k, v) => { res.headers[k.toLowerCase()] = v; },
    status: (code) => { res.statusCode = code; return res; },
    send: (body) => { res.body = body; return res; }
  };
  const next = () => { res.calledNext = true; };
  return { req, res, next };
}

// 1. Invalid Attempt 1
let { req, res, next } = createMock('127.0.0.1', 'Basic invalid');
authMiddleware(req, res, next);
assert.strictEqual(res.statusCode, 401, 'Attempt 1: Should be 401');

// 2. Invalid Attempt 2
({ req, res, next } = createMock('127.0.0.1', 'Basic invalid'));
authMiddleware(req, res, next);
assert.strictEqual(res.statusCode, 401, 'Attempt 2: Should be 401');

// 3. Invalid Attempt 3
({ req, res, next } = createMock('127.0.0.1', 'Basic invalid'));
authMiddleware(req, res, next);
assert.strictEqual(res.statusCode, 401, 'Attempt 3: Should be 401');

// 4. Invalid Attempt 4
({ req, res, next } = createMock('127.0.0.1', 'Basic invalid'));
authMiddleware(req, res, next);
assert.strictEqual(res.statusCode, 401, 'Attempt 4: Should be 401');

// 5. Invalid Attempt 5
({ req, res, next } = createMock('127.0.0.1', 'Basic invalid'));
authMiddleware(req, res, next);
assert.strictEqual(res.statusCode, 401, 'Attempt 5: Should be 401');

// 6. Invalid Attempt 6 (Should be blocked)
({ req, res, next } = createMock('127.0.0.1', 'Basic invalid'));
authMiddleware(req, res, next);

if (res.statusCode === 429) {
    console.log('✅ Success: Rate limit applied (429)');
} else {
    console.error(`❌ Fail: Expected 429, got ${res.statusCode}`);
    process.exit(1);
}
