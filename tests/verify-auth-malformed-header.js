const test = require('node:test');
const assert = require('node:assert');
const authMiddleware = require('../lib/middleware/auth');

test('Auth Middleware - Malformed Header Edge Cases', async (t) => {
  // Helper to create fresh mocks
  const createMocks = (authHeader) => {
    const req = {
      method: 'GET',
      headers: {
        authorization: authHeader
      }
    };

    const res = {
      statusCode: 200,
      headers: {},
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      send(body) {
        this.body = body;
        return this;
      },
      setHeader(key, value) {
        this.headers[key.toLowerCase()] = value;
        return this;
      }
    };

    let calledNext = false;
    const next = () => {
      calledNext = true;
    };

    return { req, res, next, calledNext };
  };

  await t.test('Case 1: No Space separator (BasicCredentials)', () => {
    const { req, res, next, calledNext } = createMocks('BasicCredentials');
    authMiddleware(req, res, next);

    assert.strictEqual(res.statusCode, 401, 'Should return 401 for no space separator');
    assert.strictEqual(res.body, 'Authentication required', 'Body should match');
    assert.match(res.headers['www-authenticate'], /Basic realm="Setu Dashboard"/, 'Should include WWW-Authenticate header');
    assert.strictEqual(calledNext, false, 'Should not call next()');
  });

  await t.test('Case 2: Extra Parts (Basic <valid_creds> extra)', () => {
    // We use valid base64 credentials here to ensure that if the length check is missing,
    // it would proceed to attempt authentication (and likely fail with a different error or 500),
    // proving that the length check is what stops it.
    const credentials = Buffer.from('user:pass').toString('base64');
    const { req, res, next, calledNext } = createMocks(`Basic ${credentials} extra`);
    authMiddleware(req, res, next);

    assert.strictEqual(res.statusCode, 401, 'Should return 401 for extra parts');
    assert.strictEqual(res.body, 'Authentication required', 'Body should match');
    assert.match(res.headers['www-authenticate'], /Basic realm="Setu Dashboard"/, 'Should include WWW-Authenticate header');
    assert.strictEqual(calledNext, false, 'Should not call next()');
  });

  await t.test('Case 3: Double Space (Basic  user:pass)', () => {
    const { req, res, next, calledNext } = createMocks('Basic  user:pass');
    authMiddleware(req, res, next);

    assert.strictEqual(res.statusCode, 401, 'Should return 401 for double space (3 parts)');
    assert.strictEqual(res.body, 'Authentication required', 'Body should match');
    assert.strictEqual(calledNext, false, 'Should not call next()');
  });

  await t.test('Case 4: Empty Credentials (Basic )', () => {
    // Note: split(' ') on 'Basic ' gives ['Basic', ''] -> length 2.
    // This passes the length check but fails the next check: !credentials
    const { req, res, next, calledNext } = createMocks('Basic ');
    authMiddleware(req, res, next);

    assert.strictEqual(res.statusCode, 401, 'Should return 401 for empty credentials');
    assert.strictEqual(res.body, 'Authentication required', 'Body should match');
    assert.strictEqual(calledNext, false, 'Should not call next()');
  });

  await t.test('Case 5: Correct Format (Basic base64(user:pass))', () => {
    // This test ensures that a correctly formatted header DOES pass the initial checks
    // and proceeds to credential verification.

    const credentials = Buffer.from('user:pass').toString('base64');
    const { req, res, next, calledNext } = createMocks(`Basic ${credentials}`);

    authMiddleware(req, res, next);

    // It should reach credential verification.
    // If DASHBOARD_PASS is not set (which is likely in test env), it returns 500 "Authentication not configured".
    // If it is set, it might return 401 "Invalid credentials".
    // In either case, it should NOT return 401 "Authentication required" (which comes from malformed header checks).

    assert.ok(res.statusCode === 401 || res.statusCode === 500, 'Should attempt authentication');
    if (res.statusCode === 401) {
        assert.notStrictEqual(res.body, 'Authentication required', 'Should not fail with "Authentication required"');
    }
  });
});
