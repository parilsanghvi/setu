const assert = require('assert');
const Module = require('module');

// 1. Mock Dependencies
const originalRequire = Module.prototype.require;
const mocks = {
    '../auth/profile-mgr': {
        resolveApiKey: (providerId, options) => {
            if (providerId === 'openai') return { key: 'sk-test-123', type: 'api_key' };
            if (providerId === 'anthropic') return { key: 'sk-ant-123', type: 'api_key' };
            return null;
        }
    },
    './config': {
        resolveProviderConfig: (providerId) => {
            return { baseUrl: 'https://default-api.com', model: 'default-model' };
        }
    },
    './providers/openai': class MockOpenAIProvider {
        constructor(config) { this.config = config; this.name = 'OpenAIProvider'; }
    },
    './providers/anthropic': class MockAnthropicProvider {
        constructor(config) { this.config = config; this.name = 'AnthropicProvider'; }
    },
    './providers/google': class MockGoogleProvider {
        constructor(config) { this.config = config; this.name = 'GoogleProvider'; }
    },
    './providers/ollama': class MockOllamaProvider {
        constructor(config) { this.config = config; this.name = 'OllamaProvider'; }
    }
};

Module.prototype.require = function(id) {
    if (mocks[id]) {
        return mocks[id];
    }
    return originalRequire.apply(this, arguments);
};

console.log('🧪 Testing lib/models/factory.js...');

async function runTests() {
    try {
        // 2. Load the Factory (it will use the mocks)
        // We require it inside the try block so if it fails, we still clean up
        const ProviderFactory = require('../lib/models/factory');

        // --- Test 1: Create Valid Provider (OpenAI) ---
        console.log('Test 1: Create Valid Provider (OpenAI)');
        const p1 = ProviderFactory.create('openai', 'gpt-4-test');
        assert.strictEqual(p1.name, 'OpenAIProvider');
        assert.strictEqual(p1.config.auth.key, 'sk-test-123');
        assert.strictEqual(p1.config.model, 'gpt-4-test');
        assert.strictEqual(p1.config.baseUrl, 'https://default-api.com');
        console.log('✅ OpenAI Provider created correctly');

        // --- Test 2: Unknown Provider ---
        console.log('Test 2: Unknown Provider');
        try {
            ProviderFactory.create('unknown-provider');
            assert.fail('Should have thrown error');
        } catch (e) {
            assert(e.message.includes('Unknown provider'), 'Error message should match');
        }
        console.log('✅ Unknown provider handled correctly');

        // --- Test 3: Environment Variable Override ---
        console.log('Test 3: Environment Variable Override');
        process.env.OPENAI_BASE_URL = 'https://custom-api.com/v1';
        try {
            const p3 = ProviderFactory.create('openai', 'gpt-4-test');
            assert.strictEqual(p3.config.baseUrl, 'https://custom-api.com/v1');
        } finally {
            delete process.env.OPENAI_BASE_URL; // Clean up
        }
        console.log('✅ Env Override worked');

        // --- Test 4: Configuration Merging ---
        console.log('Test 4: Configuration Merging');
        const p4 = ProviderFactory.create('openai', 'gpt-4-test', { temperature: 0.7, maxTokens: 100 });
        assert.strictEqual(p4.config.temperature, 0.7);
        assert.strictEqual(p4.config.maxTokens, 100);
        console.log('✅ Config merged correctly');

        // --- Test 5: Ollama (No Auth) ---
        console.log('Test 5: Ollama (No Auth)');
        // Mock profile-mgr returns null for ollama, but factory should proceed
        const p5 = ProviderFactory.create('ollama', 'llama2');
        assert.strictEqual(p5.name, 'OllamaProvider');
        assert.strictEqual(p5.config.auth, null);
        console.log('✅ Ollama created without auth');

        console.log('\n🎉 All tests passed!');

    } catch (e) {
        console.error('❌ Test Failed:', e);
        throw e; // Re-throw to signal failure to runner
    } finally {
        // Restore original require
        Module.prototype.require = originalRequire;
    }
}

runTests();
