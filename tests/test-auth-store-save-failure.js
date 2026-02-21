const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

// Setup mock environment
const originalHomedir = os.homedir;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auth-store-save-fail-test-'));

// Mock os.homedir BEFORE requiring AuthStore
os.homedir = () => tempDir;

// Require AuthStore (initializes with real fs)
const authStore = require('../lib/auth/auth-store');

console.log('Testing AuthStore Save Failure...');

// Mock console.error to verify logging
const originalConsoleError = console.error;
let errorLogged = false;
let loggedMessage = '';

console.error = (msg, error) => {
    // Check for the specific error message format from AuthStore
    if (typeof msg === 'string' && msg.includes('[AuthStore] Failed to save auth store:')) {
        errorLogged = true;
        loggedMessage = error;
    } else {
        // Pass through other errors so we can see assertion failures
        originalConsoleError(msg, error);
    }
};

// Store original writeFileSync
const originalWriteFileSync = fs.writeFileSync;

try {
    // Mock writeFileSync to throw error
    fs.writeFileSync = (file, data, options) => {
        // Only fail for our auth file to be precise
        if (typeof file === 'string' && file.includes('auth.json')) {
            throw new Error('Mock Disk Write Error');
        }
        // Fallback to original for other files (if any)
        return originalWriteFileSync(file, data, options);
    };

    // Trigger save
    authStore.save({ test: 'data' });

    // Assert
    assert.ok(errorLogged, 'Should have logged an error');
    assert.strictEqual(loggedMessage, 'Mock Disk Write Error', 'Should log specific error message');

    console.log('✅ AuthStore Save Failure Test Passed!');

} catch (err) {
    // Use original console error for failure reporting if needed
    // Note: The mock passes through, but to be safe/clear:
    console.error = originalConsoleError;
    console.error('❌ Test Failed:', err);
    process.exitCode = 1;
} finally {
    // Restore everything
    fs.writeFileSync = originalWriteFileSync;
    console.error = originalConsoleError;
    os.homedir = originalHomedir;

    // Cleanup
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}
