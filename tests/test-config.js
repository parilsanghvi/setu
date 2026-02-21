const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

// Mock dotenv before requiring Config
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'dotenv') {
        return {
            config: () => ({})
        };
    }
    return originalRequire.apply(this, arguments);
};

// Save original env
const originalEnv = { ...process.env };

// Mock console.warn
const originalWarn = console.warn;
let warnings = [];
console.warn = (...args) => {
    warnings.push(args.join(' '));
};

// Function to clear env and warnings for clean start
function clearEnv() {
    // List of variables to clear
    const varsToClear = [
        'LLM_PROVIDER', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'OLLAMA_BASE_URL',
        'GOOGLE_PROJECT_ID', 'DOCKER_PATH', 'LOG_LEVEL',
        'MODEL_EXPENSIVE_PROVIDER', 'MODEL_EXPENSIVE_NAME', 'MODEL_EXPENSIVE_API_KEY', 'MODEL_EXPENSIVE_BASE_URL',
        'MODEL_CHEAP_PROVIDER', 'MODEL_CHEAP_NAME', 'MODEL_CHEAP_API_KEY', 'MODEL_CHEAP_BASE_URL'
    ];

    varsToClear.forEach(key => delete process.env[key]);

    // Also clear dynamically generated API key envs if any
    for (const key in process.env) {
        if (key.endsWith('_API_KEY')) {
            delete process.env[key];
        }
    }

    warnings = [];
}

const Config = require('../lib/Config');

test('Config: Default values', (t) => {
    clearEnv();
    Config.validate();

    assert.strictEqual(Config.provider, 'openai');
    assert.strictEqual(Config.ollamaBaseUrl, 'http://localhost:11434');
    assert.strictEqual(Config.logLevel, 'info');
    assert.strictEqual(Config.expensiveModelProvider, 'openai');
    assert.strictEqual(Config.cheapModelProvider, 'openai');
});

test('Config: Environment variables', (t) => {
    clearEnv();
    process.env.LLM_PROVIDER = 'anthropic';
    process.env.ANTHROPIC_API_KEY = 'sk-ant-123';
    process.env.LOG_LEVEL = 'debug';
    process.env.DOCKER_PATH = '/usr/local/bin/docker';

    Config.validate();

    assert.strictEqual(Config.provider, 'anthropic');
    assert.strictEqual(Config.anthropicApiKey, 'sk-ant-123');
    assert.strictEqual(Config.logLevel, 'debug');
    assert.strictEqual(Config.dockerPath, '/usr/local/bin/docker');
});

test('Config: Unknown provider fallback', (t) => {
    clearEnv();
    process.env.LLM_PROVIDER = 'unknown-provider';

    Config.validate();

    assert.strictEqual(Config.provider, 'openai');
    assert.ok(warnings.some(w => w.includes("Unknown LLM_PROVIDER 'unknown-provider'")));
});

test('Config: Custom provider', (t) => {
    clearEnv();
    process.env.LLM_PROVIDER = 'custom';

    Config.validate();

    assert.strictEqual(Config.provider, 'custom');

    // Ensure no warning about unknown provider was logged
    const unknownProviderWarnings = warnings.filter(w => w.includes("Unknown LLM_PROVIDER"));
    assert.strictEqual(unknownProviderWarnings.length, 0, `Expected 0 unknown provider warnings, got ${unknownProviderWarnings.length}: ${JSON.stringify(unknownProviderWarnings)}`);
});

test('Config: Dual model configuration - explicitly set', (t) => {
    clearEnv();
    process.env.LLM_PROVIDER = 'openai';
    process.env.MODEL_EXPENSIVE_PROVIDER = 'anthropic';
    process.env.MODEL_EXPENSIVE_NAME = 'claude-3-opus';
    process.env.MODEL_EXPENSIVE_API_KEY = 'sk-ant-exp';

    process.env.MODEL_CHEAP_PROVIDER = 'ollama';
    process.env.MODEL_CHEAP_NAME = 'llama3';
    process.env.MODEL_CHEAP_API_KEY = 'ollama-key';

    Config.validate();

    assert.strictEqual(Config.expensiveModelProvider, 'anthropic');
    assert.strictEqual(Config.expensiveModelName, 'claude-3-opus');
    assert.strictEqual(Config.expensiveModelApiKey, 'sk-ant-exp');

    assert.strictEqual(Config.cheapModelProvider, 'ollama');
    assert.strictEqual(Config.cheapModelName, 'llama3');
    assert.strictEqual(Config.cheapModelApiKey, 'ollama-key');
});

test('Config: Dual model configuration - inherited values', (t) => {
    clearEnv();
    process.env.LLM_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'sk-openai';

    Config.validate();

    assert.strictEqual(Config.expensiveModelProvider, 'openai');
    assert.strictEqual(Config.expensiveModelApiKey, 'sk-openai');
    assert.strictEqual(Config.cheapModelProvider, 'openai');
    assert.strictEqual(Config.cheapModelApiKey, 'sk-openai');
});

test('Config: Google Auth Configuration', (t) => {
    clearEnv();

    // Test Defaults
    Config.validate();
    assert.strictEqual(Config.googleRedirectUri, "http://localhost:51121/oauth-callback");
    assert.strictEqual(Config.googleAuthUrl, "https://accounts.google.com/o/oauth2/v2/auth");
    assert.strictEqual(Config.googleDefaultProjectId, "rising-fact-p41fc");
    assert.ok(Array.isArray(Config.googleScopes));
    assert.ok(Config.googleScopes.includes("https://www.googleapis.com/auth/cloud-platform"));

    // Test Overrides
    process.env.GOOGLE_REDIRECT_URI = "http://example.com/callback";
    process.env.GOOGLE_AUTH_URL = "https://example.com/auth";
    process.env.GOOGLE_DEFAULT_PROJECT_ID = "custom-project";
    process.env.GOOGLE_SCOPES = "scope1,scope2";

    Config.validate();

    assert.strictEqual(Config.googleRedirectUri, "http://example.com/callback");
    assert.strictEqual(Config.googleAuthUrl, "https://example.com/auth");
    assert.strictEqual(Config.googleDefaultProjectId, "custom-project");
    assert.deepStrictEqual(Config.googleScopes, ["scope1", "scope2"]);
});

test('Config: API key missing warnings', (t) => {
    clearEnv();
    process.env.LLM_PROVIDER = 'openai';
    delete process.env.OPENAI_API_KEY;

    Config.validate();
    assert.ok(warnings.some(w => w.includes('LLM_PROVIDER is openai but OPENAI_API_KEY is missing')));

    warnings = [];
    process.env.LLM_PROVIDER = 'anthropic';
    delete process.env.ANTHROPIC_API_KEY;
    Config.validate();
    assert.ok(warnings.some(w => w.includes('LLM_PROVIDER is anthropic but ANTHROPIC_API_KEY is missing')));
});

test('Config: get(key) method', (t) => {
    clearEnv();
    process.env.CUSTOM_VAR = 'custom-value';
    assert.strictEqual(Config.get('CUSTOM_VAR'), 'custom-value');
    delete process.env.CUSTOM_VAR;
});

// Restore environment after all tests
test('Cleanup', () => {
    clearEnv();
    // Restore original env
    for (const key in process.env) {
        delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
    console.warn = originalWarn;
    Module.prototype.require = originalRequire;
});
