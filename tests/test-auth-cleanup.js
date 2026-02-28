const test = require('node:test');
const assert = require('node:assert');
const authMiddleware = require('../lib/middleware/auth');

// Note: This test assumes that `authMiddleware` exports `_getMapSize`, `_resetMap`, and `_runCleanup`
// when NODE_ENV is 'test'. If not exported, these tests will fail (as expected for TDD).

test('Auth Middleware - Rate Limit Cleanup', async (t) => {
  if (typeof authMiddleware._getMapSize !== 'function' || typeof authMiddleware._runCleanup !== 'function') {
    console.warn('⚠️ Skipping cleanup test: _getMapSize or _runCleanup not exported (Run with NODE_ENV=test)');
    assert.fail('_getMapSize or _runCleanup not exported by authMiddleware');
    return;
  }

  // Ensure clean state
  if (authMiddleware._resetMap) authMiddleware._resetMap();

  // Helper to simulate a request from an IP
  const createMock = (ip) => {
    return {
      req: {
        method: 'GET',
        headers: { authorization: 'Basic invalid' }, // Fail auth
        ip: ip,
        socket: { remoteAddress: ip }
      },
      res: {
        statusCode: 200,
        headers: {},
        setHeader: (k, v) => { },
        status: (code) => { return { send: () => { } }; },
        send: () => { }
      },
      next: () => { }
    };
  };

  await t.test('Should clean up expired entries', () => {
    // 1. Populate the map with entries
    const ip1 = '192.168.1.1';
    const ip2 = '192.168.1.2';

    // IP1 fails 5 times (gets blocked)
    for (let i = 0; i < 5; i++) {
        const { req, res, next } = createMock(ip1);
        authMiddleware(req, res, next);
    }

    // IP2 fails 1 time (not blocked yet)
    const { req, res, next } = createMock(ip2);
    authMiddleware(req, res, next);

    // Verify map size (2 entries)
    assert.strictEqual(authMiddleware._getMapSize(), 2, 'Map should have 2 entries');

    // 2. Advance time using cleanup helper
    // Simulate time passing: current time + 16 minutes
    const futureTime = Date.now() + (16 * 60 * 1000);

    // Run cleanup with future time
    authMiddleware._runCleanup(futureTime);

    // Verify map size (should be 0 as both entries effectively expired relative to futureTime)
    assert.strictEqual(authMiddleware._getMapSize(), 0, 'Map should be empty after cleanup with future time');
  });
});
