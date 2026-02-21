const { generatePkce } = require('../lib/utils/pkce');
const assert = require('assert');
const { test } = require('node:test');
const crypto = require('crypto');

test('generatePkce returns verifier and challenge', () => {
    const pkce = generatePkce();
    assert.ok(pkce.verifier);
    assert.ok(pkce.challenge);
    assert.strictEqual(typeof pkce.verifier, 'string');
    assert.strictEqual(typeof pkce.challenge, 'string');
});

test('generatePkce verifier length is correct', () => {
    const { verifier } = generatePkce();
    // 32 bytes hex encoded -> 64 characters
    assert.strictEqual(verifier.length, 64);
});

test('generatePkce challenge is correctly derived from verifier', () => {
    const { verifier, challenge } = generatePkce();
    const expectedChallenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    assert.strictEqual(challenge, expectedChallenge);
});
