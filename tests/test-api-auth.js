const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const express = require('express');

// Require the middleware
const authMiddleware = require('../lib/middleware/auth');

const PORT = 3456;

test('Authentication Middleware', async (t) => {
  const app = express();

  // Set test credentials
  const TEST_USER = 'tester';
  const TEST_PASS = 'secret123';

  process.env.DASHBOARD_USER = TEST_USER;
  process.env.DASHBOARD_PASS = TEST_PASS;

  // Apply middleware
  app.use(authMiddleware);

  // Protected route
  app.get('/', (req, res) => {
    res.send('Protected Content');
  });

  const server = http.createServer(app);

  await new Promise(resolve => server.listen(PORT, resolve));

  // Helper function for requests
  const request = (path, options = {}) => {
    return new Promise((resolve, reject) => {
      const req = http.request({
        port: PORT,
        path,
        method: options.method || 'GET',
        headers: options.headers || {}
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
      });
      req.on('error', reject);
      req.end();
    });
  };

  await t.test('Without credentials: Returns 401', async () => {
    const res = await request('/');
    assert.strictEqual(res.statusCode, 401);
    assert.match(res.headers['www-authenticate'], /Basic realm="Setu Dashboard"/);
  });

  await t.test('With incorrect credentials: Returns 401', async () => {
    const credentials = Buffer.from(`${TEST_USER}:wrongpass`).toString('base64');
    const res = await request('/', {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    assert.strictEqual(res.statusCode, 401);
  });

  await t.test('With correct credentials: Returns 200', async () => {
    const credentials = Buffer.from(`${TEST_USER}:${TEST_PASS}`).toString('base64');
    const res = await request('/', {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data, 'Protected Content');
  });

  await t.test('Password with colon: Returns 200', async () => {
    const complexPass = 'pass:word';
    process.env.DASHBOARD_PASS = complexPass;
    const credentials = Buffer.from(`${TEST_USER}:${complexPass}`).toString('base64');
    const res = await request('/', {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    assert.strictEqual(res.statusCode, 200);
    delete process.env.DASHBOARD_PASS;
  });

  await t.test('OPTIONS request: Allowed without credentials', async () => {
    const res = await request('/', { method: 'OPTIONS' });
    // Should pass through middleware and hit 404 (since no OPTIONS handler) or 200 (if express handles it)
    // Key is it is NOT 401
    assert.notStrictEqual(res.statusCode, 401);
  });

  await t.test('Disable Auth: Returns 200 without credentials', async () => {
    process.env.DISABLE_DASHBOARD_AUTH = 'true';
    const res = await request('/');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data, 'Protected Content');
    // Cleanup
    delete process.env.DISABLE_DASHBOARD_AUTH;
  });

  // Cleanup server
  await new Promise(resolve => server.close(resolve));

  // Cleanup env
  delete process.env.DASHBOARD_USER;
  delete process.env.DASHBOARD_PASS;
});
