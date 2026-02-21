const test = require('node:test');
const assert = require('node:assert');
const { validate, checkConfig } = require('../lib/auth/basic');

test('Auth Basic', async (t) => {
  const TEST_USER = 'admin';
  const TEST_PASS = 'secret123';

  // Setup env
  process.env.DASHBOARD_PASS = TEST_PASS;

  await t.test('validate returns true for correct credentials', () => {
    assert.strictEqual(validate(TEST_USER, TEST_PASS), true);
  });

  await t.test('validate returns false for incorrect password', () => {
    assert.strictEqual(validate(TEST_USER, 'wrong'), false);
  });

  await t.test('validate returns false for incorrect username', () => {
    assert.strictEqual(validate('wrong', TEST_PASS), false);
  });

  await t.test('checkConfig returns true when DASHBOARD_PASS is set', () => {
    assert.strictEqual(checkConfig(), true);
  });

  await t.test('checkConfig returns false when DASHBOARD_PASS is missing', () => {
    delete process.env.DASHBOARD_PASS;
    // Suppress console.error for clean output
    const originalError = console.error;
    console.error = () => {};
    const result = checkConfig();
    console.error = originalError;
    assert.strictEqual(result, false);

    // Restore for other tests if any
    process.env.DASHBOARD_PASS = TEST_PASS;
  });
});
