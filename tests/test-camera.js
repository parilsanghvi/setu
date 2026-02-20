const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');
const path = require('path');

// --- Mock Setup ---
const originalRequire = Module.prototype.require;

// Mock Objects
const mockPage = {
    goto: async (url, options) => {
        mocks.calls.push({ method: 'page.goto', args: [url, options] });
    },
    screenshot: async (options) => {
        mocks.calls.push({ method: 'page.screenshot', args: [options] });
    },
    close: async () => {
        mocks.calls.push({ method: 'page.close', args: [] });
    }
};

const mockContext = {
    newPage: async () => {
        mocks.calls.push({ method: 'context.newPage', args: [] });
        return mockPage;
    },
    close: async () => {
        mocks.calls.push({ method: 'context.close', args: [] });
    }
};

const mockBrowser = {
    newContext: async (options) => {
        mocks.calls.push({ method: 'browser.newContext', args: [options] });
        return mockContext;
    },
    close: async () => {
        mocks.calls.push({ method: 'browser.close', args: [] });
    }
};

const mocks = {
    'playwright-core': {
        chromium: {
            launch: async (options) => {
                mocks.calls.push({ method: 'launch', args: [options] });
                return mockBrowser;
            }
        }
    },
    'fs': {
        existsSync: (dir) => {
            mocks.calls.push({ method: 'existsSync', args: [dir] });
            // Return false to force mkdirSync to be called during constructor
            return false;
        },
        mkdirSync: (dir, options) => {
            mocks.calls.push({ method: 'mkdirSync', args: [dir, options] });
        }
    },
    './Config': {},
    calls: []
};

// Patch require
Module.prototype.require = function(id) {
    if (id === 'playwright-core') {
        return mocks['playwright-core'];
    }
    if (id === 'fs') {
        return mocks['fs'];
    }
    if (id === './Config' || id.endsWith('/Config')) {
        return mocks['./Config'];
    }
    return originalRequire.apply(this, arguments);
};

// Load Camera (this will trigger constructor and fs mocks)
let Camera;
try {
    Camera = require('../lib/Camera');
} catch (e) {
    console.error("Failed to require Camera:", e);
}

// --- Tests ---

test('Camera: Constructor ensures screenshots directory', (t) => {
    const expectedSuffix = path.join('frontend', 'dashboard', 'screenshots');
    const mkdirCalls = mocks.calls.filter(c => c.method === 'mkdirSync');
    const initCall = mkdirCalls.find(c => c.args[0].endsWith(expectedSuffix));
    assert.ok(initCall, 'Constructor should create screenshots directory');
});

test('Camera: init() launches browser', async (t) => {
    mocks.calls = []; // Clear calls

    // Ensure browser starts as null
    if (Camera.browser) {
        await Camera.close();
        Camera.browser = null;
    }

    await Camera.init();

    assert.ok(Camera.browser, 'Browser instance should be set');
    const launchCall = mocks.calls.find(c => c.method === 'launch');
    assert.ok(launchCall, 'playwright.chromium.launch should be called');
    assert.deepStrictEqual(launchCall.args[0], { headless: true, args: ['--no-sandbox'] });
});

test('Camera: snap() takes a screenshot', async (t) => {
    mocks.calls = [];

    // Ensure browser is initialized
    if (!Camera.browser) await Camera.init();

    const taskId = 'test-task';
    const url = 'http://example.com';
    const stepName = 'test-step';

    const result = await Camera.snap(taskId, url, stepName);

    assert.ok(result, 'snap() should return a path');
    // Regex matches /screenshots/test-task/test-step-<digits>.png
    assert.match(result, new RegExp(`/screenshots/${taskId}/${stepName}-\\d+\\.png`));

    // Verify calls
    assert.ok(mocks.calls.find(c => c.method === 'browser.newContext'), 'Should create new context');
    assert.ok(mocks.calls.find(c => c.method === 'context.newPage'), 'Should create new page');

    const gotoCall = mocks.calls.find(c => c.method === 'page.goto');
    assert.strictEqual(gotoCall.args[0], url);

    const screenshotCall = mocks.calls.find(c => c.method === 'page.screenshot');
    assert.ok(screenshotCall.args[0].path.includes(taskId), 'Screenshot path should include taskId');

    assert.ok(mocks.calls.find(c => c.method === 'page.close'), 'Should close page');
    assert.ok(mocks.calls.find(c => c.method === 'context.close'), 'Should close context');
});

test('Camera: snap() with relatedFile', async (t) => {
    mocks.calls = [];
    if (!Camera.browser) await Camera.init();

    const taskId = 'test-task';
    const url = 'http://example.com';
    const stepName = 'test-step';
    const relatedFile = 'src/components/Button.js';

    const result = await Camera.snap(taskId, url, stepName, relatedFile);

    assert.ok(result);
    // Path should include relatedFile path: /screenshots/test-task/src/components/Button.js/test-step-...
    assert.match(result, new RegExp(`/screenshots/${taskId}/${relatedFile}/${stepName}-\\d+\\.png`));

    // Verify mkdir was called for the deep path
    const mkdirCalls = mocks.calls.filter(c => c.method === 'mkdirSync');
    const expectedDirPart = path.join(taskId, relatedFile);
    assert.ok(mkdirCalls.some(c => c.args[0].includes(expectedDirPart)), 'Should create directory for related file');
});

test('Camera: snap() handles errors', async (t) => {
    mocks.calls = [];
    if (!Camera.browser) await Camera.init();

    // Mock goto to fail
    const originalGoto = mockPage.goto;
    mockPage.goto = async () => { throw new Error('Navigation failed'); };

    const result = await Camera.snap('fail-task', 'http://fail.com');

    assert.strictEqual(result, null, 'Should return null on failure');

    // Verify page close is attempted
    assert.ok(mocks.calls.find(c => c.method === 'page.close'), 'Should attempt to close page on error');

    // Restore mock
    mockPage.goto = originalGoto;
});

test('Camera: close() cleans up', async (t) => {
    mocks.calls = [];
    if (!Camera.browser) await Camera.init();

    await Camera.close();

    assert.strictEqual(Camera.browser, null, 'Browser property should be null');
    assert.ok(mocks.calls.find(c => c.method === 'browser.close'), 'Should call browser.close()');
});

test('Camera: snap() prevents path traversal', async (t) => {
    mocks.calls = [];
    if (!Camera.browser) await Camera.init();

    const taskId = 'test-task';
    const url = 'http://example.com';
    const stepName = 'test-step';
    const maliciousFile = 'subdir/../../etc/passwd';

    const result = await Camera.snap(taskId, url, stepName, maliciousFile);

    assert.ok(result);
    // Path should NOT contain ".."
    // It should be /screenshots/test-task/etc/passwd/test-step-...
    // The traversal attempts to go up two levels from 'subdir', so it lands at 'etc/passwd' relative to task root.

    // Check mkdir calls
    const mkdirCalls = mocks.calls.filter(c => c.method === 'mkdirSync');

    const expectedDirPart = path.join(taskId, 'etc', 'passwd');
    const unsafePart = path.join('..', 'etc', 'passwd');

    // Assert that NO mkdir call contains traversal
    const hasTraversal = mkdirCalls.some(c => c.args[0].includes(unsafePart));
    assert.strictEqual(hasTraversal, false, 'Should not attempt to create directory outside of task dir');

    // Assert that the created directory is safe
    const safeCall = mkdirCalls.find(c => c.args[0].includes(expectedDirPart));
    assert.ok(safeCall, 'Should create safe directory path');

    // Assert result path is safe
    assert.strictEqual(result.includes('..'), false, 'Result path should not contain ..');
});

// Cleanup
test('Cleanup Mocks', () => {
    Module.prototype.require = originalRequire;
});
