const { test, after } = require('node:test');
const assert = require('node:assert');
const Module = require('module');
const path = require('path');

// Mocks
const originalRequire = Module.prototype.require;
const mocks = {
    fs: {
        existsSync: () => false,
        readFileSync: () => '{}',
    },
    dotenv: {
        config: () => {},
    }
};

Module.prototype.require = function(id) {
    if (id === 'fs') return mocks.fs;
    if (id === 'dotenv') return mocks.dotenv;
    return originalRequire.apply(this, arguments);
};

// Mock console.warn
const originalWarn = console.warn;
let warnings = [];
console.warn = (...args) => {
    warnings.push(args.join(' '));
};

// Ensure cleanup runs after all tests, even if failures occur
after(() => {
    Module.prototype.require = originalRequire;
    console.warn = originalWarn;
});

// Require the module AFTER mocking
// Note: verify-log-watch.js or other tests might run in same process if using runner.js
// but node:test usually isolates unless explicitly running together.
const modelConfig = require('../lib/models/config');

test('ModelConfig: Initialization', (t) => {
    assert.ok(modelConfig.modelsPath.endsWith('models.json'));
    assert.ok(modelConfig.envPath.endsWith('.env'));
    assert.deepStrictEqual(modelConfig.config, {});
});

test('ModelConfig: load() with valid models.json', (t) => {
    // Setup mocks
    mocks.fs.existsSync = (filepath) => filepath.endsWith('models.json');
    mocks.fs.readFileSync = () => JSON.stringify({
        providers: {
            openai: { apiKey: 'sk-test' }
        }
    });

    modelConfig.load();

    assert.deepStrictEqual(modelConfig.config, {
        providers: {
            openai: { apiKey: 'sk-test' }
        }
    });
});

test('ModelConfig: load() with invalid JSON', (t) => {
    // Setup mocks
    warnings = [];
    mocks.fs.existsSync = (filepath) => filepath.endsWith('models.json');
    mocks.fs.readFileSync = () => '{ invalid json }';

    modelConfig.load();

    assert.ok(warnings.some(w => w.includes('[ModelConfig] Failed to parse models.json')));
});

test('ModelConfig: load() with missing models.json', (t) => {
    // Setup mocks
    mocks.fs.existsSync = () => false;

    // Set config manually to something non-empty to verify it's not cleared
    modelConfig.config = { existing: true };

    modelConfig.load();

    // Verify it retains existing config if file is missing (based on implementation logic)
    assert.deepStrictEqual(modelConfig.config, { existing: true });
});

test('ModelConfig: resolveProviderConfig', (t) => {
    modelConfig.config = {
        providers: {
            openai: { apiKey: 'sk-custom' }
        }
    };

    const config = modelConfig.resolveProviderConfig('openai');
    assert.deepStrictEqual(config, { apiKey: 'sk-custom' });

    const defaultConfig = modelConfig.resolveProviderConfig('anthropic');
    assert.deepStrictEqual(defaultConfig, { id: 'anthropic' });
});

test('ModelConfig: load() with .env', (t) => {
    let dotenvCalled = false;
    mocks.fs.existsSync = (filepath) => filepath.endsWith('.env');
    mocks.dotenv.config = (options) => {
        dotenvCalled = true;
        assert.ok(options.path.endsWith('.env'));
    };

    modelConfig.load();
    assert.ok(dotenvCalled);
});
