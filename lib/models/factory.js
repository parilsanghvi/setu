const ProfileManager = require('../auth/profile-mgr');
const ModelConfig = require('./config');

// Provider Implementations
const OpenAIProvider = require('./providers/openai');
const AnthropicProvider = require('./providers/anthropic');
const GoogleProvider = require('./providers/google');
const OllamaProvider = require('./providers/ollama');

class ProviderFactory {
    constructor() {
        this.providers = {
            'openai': OpenAIProvider,
            'anthropic': AnthropicProvider,
            'google': GoogleProvider,
            'ollama': OllamaProvider,
            'vllm': OpenAIProvider, // vLLM is OpenAI compatible
            'deepseek': OpenAIProvider,
            'mistral': OpenAIProvider,
            'groq': OpenAIProvider,
            'minimax': OpenAIProvider,
            'moonshot': OpenAIProvider,
            'together': OpenAIProvider,
            'openrouter': OpenAIProvider,
            'minimax-portal': OpenAIProvider, // Adjust if needed
            'xiaomi': OpenAIProvider
        };
    }

    create(providerId, modelName, overrideConfig = {}) {
        const ProviderClass = this.providers[providerId];
        if (!ProviderClass) {
            throw new Error(`Unknown provider: ${providerId}`);
        }

        // 1. Resolve Auth
        const auth = ProfileManager.resolveApiKey(providerId, overrideConfig);
        if (!auth && providerId !== 'ollama') { // Ollama might not need auth
            // console.warn(`[ProviderFactory] No auth found for ${providerId}. Some providers may fail.`);
        }

        // 2. Resolve Config (Base URL, etc)
        const config = ModelConfig.resolveProviderConfig(providerId);

        // 3. Merge Env overrides for Base URL
        const envBaseUrlKey = `${providerId.toUpperCase()}_BASE_URL`;
        if (process.env[envBaseUrlKey]) {
            config.baseUrl = process.env[envBaseUrlKey];
        }

        // 4. Instantiate
        return new ProviderClass({
            ...config,
            ...overrideConfig,
            auth,
            model: modelName
        });
    }
}

module.exports = new ProviderFactory();
