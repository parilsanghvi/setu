const Config = require('./Config');
const ProviderFactory = require('./models/factory');

class LLM {
    constructor() {
        this.providers = new Map();
        this.initializeDefaults();
    }

    initializeDefaults() {
        // Cache the default "Expensive" and "Cheap" providers
        try {
            this.registerProvider('expensive', Config.expensiveModelProvider, Config.expensiveModelName, { baseUrl: Config.expensiveModelBaseUrl });
            this.registerProvider('cheap', Config.cheapModelProvider, Config.cheapModelName, { baseUrl: Config.cheapModelBaseUrl });
            
            console.log(`[LLM] Defaults Initialized. Expensive: ${Config.expensiveModelName}, Cheap: ${Config.cheapModelName}`);
        } catch (e) {
            console.error('[LLM] Failed to initialize default providers:', e.message);
        }
    }

    /**
     * Get or create a provider instance
     */
    getProvider(alias) {
        // 1. Return cached if exists
        if (this.providers.has(alias)) {
            return this.providers.get(alias);
        }

        // 2. If alias is a specific known provider type (e.g., 'openai'), try to create a default one for it
        if (['openai', 'anthropic', 'google', 'ollama'].includes(alias)) {
            return this.registerProvider(alias, alias, null, {}); // Use defaults
        }

        // 3. Fallback to expensive
        return this.providers.get('expensive');
    }

    registerProvider(alias, providerType, modelName, options = {}) {
        try {
            const provider = ProviderFactory.create(providerType, modelName, options);
            this.providers.set(alias, provider);
            return provider;
        } catch (e) {
            console.error(`[LLM] Failed to register provider '${alias}':`, e.message);
            return null;
        }
    }

    /**
     * Generate content using a specific model alias or provider type.
     * @param {string} modelId - 'expensive', 'cheap', 'gpt-4', 'claude-3', etc.
     */
    async generate(systemPrompt, userPrompt, modelId = 'expensive', tools = null, options = {}) {
        const provider = this.getProvider(modelId);

        if (!provider) {
            throw new Error(`[LLM] No provider found for model ID: ${modelId}`);
        }

        try {
            return await provider.generate(systemPrompt, userPrompt, tools, options);
        } catch (e) {
            console.error(`[LLM] ❌ Error generating response (${modelId}): ${e.message}`);
            throw e;
        }
    }
}

module.exports = new LLM();
