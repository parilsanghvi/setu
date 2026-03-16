const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

// --- Mock Setup ---

// Mock db state that can be configured per test
let mockGet = () => undefined;
let mockRun = () => ({ changes: 0 });
let lastQuery = '';
let lastParams = [];

const mockDb = {
    getTaskMetaById: (...args) => {
        lastQuery = 'SELECT meta FROM tasks WHERE id = ?';
        return mockGet(...args);
    },
    updateTaskMeta: (...args) => {
        lastQuery = 'UPDATE tasks SET meta = ? WHERE id = ?';
        return mockRun(...args);
    }
};

// Intercept require to return our mock for lib/db.js
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    // Check for both relative and absolute path resolution attempts
    if (id === './db' || id.endsWith('/lib/db.js') || id.endsWith('\\lib\\db.js')) {
        return mockDb;
    }
    return originalRequire.apply(this, arguments);
};

// Load the module under test
const BudgetManager = require('../lib/Budget');

// Helper to reset mocks
function resetMock() {
    mockGet = () => undefined;
    mockRun = () => ({ changes: 0 });
    lastQuery = '';
    lastParams = [];
}

// --- Tests ---

test('BudgetManager: check() - Task not found (Infinite Budget)', (t) => {
    resetMock();
    mockGet = () => undefined; // No task found

    const result = BudgetManager.check('TASK-123');
    assert.strictEqual(result, true, 'Should return true if task not found');
    assert.match(lastQuery, /SELECT meta FROM tasks/, 'Should query tasks table');
});

test('BudgetManager: check() - Task found but no meta', (t) => {
    resetMock();
    mockGet = () => ({ meta: null });

    const result = BudgetManager.check('TASK-123');
    assert.strictEqual(result, true, 'Should return true if meta is null');
});

test('BudgetManager: check() - Task found, cost < budget', (t) => {
    resetMock();
    mockGet = () => ({
        meta: JSON.stringify({ cost: 0.5, budget: 1.0 })
    });

    const result = BudgetManager.check('TASK-123');
    assert.strictEqual(result, true, 'Should return true if cost < budget');
});

test('BudgetManager: check() - Task found, cost >= budget', (t) => {
    resetMock();
    mockGet = () => ({
        meta: JSON.stringify({ cost: 1.0, budget: 1.0 })
    });

    // We need to capture console.warn to keep test output clean?
    // Not strictly necessary but good practice.
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = () => { warnCalled = true; };

    try {
        const result = BudgetManager.check('TASK-123');
        assert.strictEqual(result, false, 'Should return false if cost >= budget');
        assert.strictEqual(warnCalled, true, 'Should log a warning');
    } finally {
        console.warn = originalWarn; // Restore
    }
});

test('BudgetManager: check() - Task found, no explicit budget, uses default limit', (t) => {
    resetMock();
    // Default limit is 2.00
    mockGet = () => ({
        meta: JSON.stringify({ cost: 2.1 }) // No budget field
    });

    const originalWarn = console.warn;
    console.warn = () => {};

    try {
        const result = BudgetManager.check('TASK-123');
        assert.strictEqual(result, false, 'Should use default limit (2.00) and return false');
    } finally {
        console.warn = originalWarn;
    }
});

test('BudgetManager: record() - No taskId', (t) => {
    resetMock();
    BudgetManager.record(null, 100);
    assert.strictEqual(lastQuery, '', 'Should not query DB if no taskId');
});

test('BudgetManager: record() - Task found, updates cost', (t) => {
    resetMock();
    const initialMeta = { cost: 0.5 };
    mockGet = () => ({ meta: JSON.stringify(initialMeta) });

    let capturedMetaString = '';
    let capturedTaskId = '';

    mockRun = (id, metaStr) => {
        capturedMetaString = metaStr;
        capturedTaskId = id;
        return { changes: 1 };
    };

    const originalLog = console.log;
    console.log = () => {}; // Suppress log

    try {
        const tokens = 1000;
        BudgetManager.record('TASK-123', tokens);
    } finally {
        console.log = originalLog;
    }

    // Check if SELECT was called
    assert.match(lastQuery, /UPDATE tasks SET meta/, 'Should update tasks table');

    // Check calculation
    // Cost per token is 0.000015
    // 1000 tokens * 0.000015 = 0.015
    // New cost = 0.5 + 0.015 = 0.515

    const updatedMeta = JSON.parse(capturedMetaString);
    assert.strictEqual(capturedTaskId, 'TASK-123');
    assert.ok(Math.abs(updatedMeta.cost - 0.515) < 0.000001, `Cost should be updated correctly. Got ${updatedMeta.cost}`);
});

test('BudgetManager: record() - Task not found, does nothing', (t) => {
    resetMock();
    mockGet = () => undefined; // Task not found

    let runCalled = false;
    mockRun = () => { runCalled = true; return {}; };

    BudgetManager.record('TASK-123', 100);

    // Should query to find task, but not update if not found
    assert.strictEqual(runCalled, false, 'Should not call update if task not found');
});

// Restore require just in case (though process ends after test)
test('Cleanup', (t) => {
    Module.prototype.require = originalRequire;
});
