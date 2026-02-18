const assert = require('assert');
const AuthStore = require('../lib/auth/auth-store');
const ProfileManager = require('../lib/auth/profile-mgr');

// Helper to create test profiles
const createProfile = (id, updatedAt) => ({
    id,
    updatedAt,
    key: `key-${id}`,
    provider: 'test-provider'
});

// Mock Data
// p1: oldest
// p2: newest
// p3: middle
const profiles = [
    createProfile('p1', 1000),
    createProfile('p2', 3000),
    createProfile('p3', 2000)
];

// Mock AuthStore.findProfilesByProvider
// Since ProfileManager requires AuthStore, and require is cached, modifying the export here
// affects the instance used by ProfileManager (both are the same singleton instance).
const originalFind = AuthStore.findProfilesByProvider;
AuthStore.findProfilesByProvider = (provider) => {
    if (provider === 'test-provider') {
        // Return a copy to avoid mutation issues if any
        return [...profiles];
    }
    return [];
};

console.log('Testing ProfileManager Selection Logic...');

try {
    // Test 1: Default Selection (Most Recent)
    // The goal is for it to pick p2 (updatedAt=3000)
    // Current implementation picks p1 (index 0)
    const resultDefault = ProfileManager.resolveApiKey('test-provider');
    console.log('Default selection result:', resultDefault ? resultDefault.source : 'null');

    assert.ok(resultDefault, 'Should return a profile');
    assert.strictEqual(resultDefault.source, 'profile:p2', 'Should select the most recently updated profile (p2) by default');

    // Test 2: Specific Selection
    // Request p3 specifically
    // Current implementation ignores options and returns p1
    const resultSpecific = ProfileManager.resolveApiKey('test-provider', { profileId: 'p3' });
    console.log('Specific selection result:', resultSpecific ? resultSpecific.source : 'null');

    assert.ok(resultSpecific, 'Should return a profile');
    assert.strictEqual(resultSpecific.source, 'profile:p3', 'Should select the specifically requested profile (p3)');

    // Test 3: Null Options Safety
    // Should not crash and behave like default
    console.log('Testing null options safety...');
    const resultNull = ProfileManager.resolveApiKey('test-provider', null);
    assert.ok(resultNull, 'Should return a profile even with null options');
    assert.strictEqual(resultNull.source, 'profile:p2', 'Should behave like default when options is null');

    console.log('ALL TESTS PASSED');
} catch (error) {
    console.error('TEST FAILED:', error.message);
    process.exit(1);
} finally {
    // Restore Mock
    AuthStore.findProfilesByProvider = originalFind;
}
