const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

// Setup mock environment
const originalHomedir = os.homedir;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auth-store-test-'));
console.log(`Using temp dir: ${tempDir}`);

// Mock os.homedir
os.homedir = () => tempDir;

// Verify mock works
assert.strictEqual(os.homedir(), tempDir);

// Now require the AuthStore
// Since it is a singleton that initializes in constructor, it will use the mocked homedir
const authStore = require('../lib/auth/auth-store');

const authDir = path.join(tempDir, '.setu');
const authFile = path.join(authDir, 'auth.json');

try {
    console.log('Testing AuthStore...');

    // 1. Initialization
    console.log('Test: Initialization');
    assert.ok(fs.existsSync(authDir), 'Auth directory should exist');
    assert.ok(fs.existsSync(authFile), 'Auth file should exist');
    const initialContent = fs.readFileSync(authFile, 'utf8');
    assert.deepStrictEqual(JSON.parse(initialContent), {}, 'Auth file should be empty object initially');

    // 2. Add Profile
    console.log('Test: Add Profile');
    const profileId = 'user1';
    const credential = { provider: 'google', token: 'abc' };
    authStore.addProfile(profileId, credential);

    let stored = JSON.parse(fs.readFileSync(authFile, 'utf8'));
    assert.ok(stored.profiles[profileId], 'Profile should be saved');
    assert.strictEqual(stored.profiles[profileId].provider, 'google');
    assert.ok(stored.profiles[profileId].updatedAt, 'updatedAt should be set');

    // 3. Get Profile
    console.log('Test: Get Profile');
    const profile = authStore.getProfile(profileId);
    assert.ok(profile, 'Should return profile');
    assert.strictEqual(profile.provider, 'google');

    // 4. List Profiles
    console.log('Test: List Profiles');
    const profiles = authStore.listProfiles();
    assert.deepStrictEqual(profiles, [profileId], 'Should list profile IDs');

    // 5. Find Profiles by Provider
    console.log('Test: Find Profiles by Provider');
    authStore.addProfile('user2', { provider: 'github', token: 'xyz' });
    authStore.addProfile('user3', { provider: 'google', token: 'def' });

    const googleProfiles = authStore.findProfilesByProvider('google');
    assert.strictEqual(googleProfiles.length, 2, 'Should find 2 google profiles');
    assert.ok(googleProfiles.find(p => p.id === 'user1'));
    assert.ok(googleProfiles.find(p => p.id === 'user3'));

    const githubProfiles = authStore.findProfilesByProvider('github');
    assert.strictEqual(githubProfiles.length, 1, 'Should find 1 github profile');
    assert.strictEqual(githubProfiles[0].id, 'user2');

    // 6. Remove Profile
    console.log('Test: Remove Profile');
    const removed = authStore.removeProfile('user1');
    assert.ok(removed, 'Should return true on removal');
    assert.strictEqual(authStore.getProfile('user1'), undefined, 'Profile should be gone');
    assert.strictEqual(authStore.listProfiles().length, 2, 'Should have 2 profiles left');

    // 7. Error Handling (Corrupt file)
    console.log('Test: Error Handling (Corrupt JSON)');
    fs.writeFileSync(authFile, '{ invalid json');

    // We expect load() to catch error and return {}
    // getProfile calls load()
    // Suppress console.error for expected error
    const originalConsoleError = console.error;
    let errorLogged = false;
    console.error = (msg) => {
        if (msg.includes('Failed to load auth store')) errorLogged = true;
        // else originalConsoleError(msg);
    };

    const p = authStore.getProfile('user2');
    assert.strictEqual(p, null, 'Should return null/undefined on corrupt file');

    // listProfiles calls load()
    const l = authStore.listProfiles();
    assert.deepStrictEqual(l, [], 'Should return empty list on corrupt file');

    assert.ok(errorLogged, 'Should log error on corrupt file');
    console.error = originalConsoleError;

    console.log('✅ All AuthStore tests passed!');

} catch (err) {
    console.error('❌ Test Failed:', err);
    process.exitCode = 1;
} finally {
    // Cleanup
    os.homedir = originalHomedir;
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}
