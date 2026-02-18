const Config = require('./Config');
const ProviderFactory = require('./models/factory');

class LLM {
    constructor() {
        this.providers = new Map();
        this._activeCalls = 0;
        this._maxConcurrent = 2;
        this._queue = [];
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
     * Implements cascading fallback: expensive -> cheap -> cooldown wait -> retry cheap.
     * Concurrency limited to _maxConcurrent simultaneous calls.
     * @param {string} modelId - 'expensive', 'cheap', 'gpt-4', 'claude-3', etc.
     */
    async generate(systemPrompt, userPrompt, modelId = 'expensive', tools = null, options = {}) {
        // Concurrency gate
        await this._acquireSlot();

        try {
            return await this._generateInternal(systemPrompt, userPrompt, modelId, tools, options);
        } finally {
            this._releaseSlot();
        }
    }

    async _acquireSlot() {
        if (this._activeCalls < this._maxConcurrent) {
            this._activeCalls++;
            return;
        }
        return new Promise(resolve => {
            this._queue.push(resolve);
        });
    }

    _releaseSlot() {
        this._activeCalls--;
        if (this._queue.length > 0) {
            this._activeCalls++;
            const next = this._queue.shift();
            next();
        }
    }

    async _generateInternal(systemPrompt, userPrompt, modelId = 'expensive', tools = null, options = {}) {
        let provider = this.getProvider(modelId);

        if (!provider) {
            throw new Error(`[LLM] No provider found for model ID: ${modelId}`);
        }

        // Check if we're in cooldown from previous total rate limit exhaustion
        if (this._cooldownUntil && Date.now() < this._cooldownUntil) {
            const waitMs = this._cooldownUntil - Date.now();
            console.warn(`[LLM] 💤 All models rate-limited. Cooling down for ${Math.round(waitMs / 1000)}s...`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
            this._cooldownUntil = null;
        }

        try {
            return await provider.generate(systemPrompt, userPrompt, tools, options);
        } catch (e) {
            const isRateLimit = e.message.includes('429') || e.message.includes('Quota') || e.message.includes('Rate Limit');
            
            if (isRateLimit) {
                // Try fallback model if we were on expensive
                if (modelId === 'expensive') {
                    console.warn(`[LLM] ⚠️ Primary model '${modelId}' hit rate limit. Falling back to 'cheap'...`);
                    
                    const fallbackProvider = this.getProvider('cheap');
                    if (fallbackProvider && fallbackProvider !== provider) {
                        try {
                            return await fallbackProvider.generate(systemPrompt, userPrompt, tools, options);
                        } catch (fallbackError) {
                            const fallbackIsRateLimit = fallbackError.message.includes('429') || fallbackError.message.includes('Quota') || fallbackError.message.includes('Rate Limit');
                            if (fallbackIsRateLimit) {
                                // BOTH models exhausted — enter cooldown instead of crashing
                                const cooldownMs = 120000; // 2 minutes
                                this._cooldownUntil = Date.now() + cooldownMs;
                                console.warn(`[LLM] 🧊 BOTH models rate-limited. Entering ${cooldownMs / 1000}s cooldown to prevent crash loop.`);
                                // Return a graceful degradation message instead of throwing
                                return '[System: All AI models are temporarily rate-limited. Waiting for quota to refresh. Will retry automatically.]';
                            }
                            console.error(`[LLM] ❌ Fallback model failed (non-rate-limit): ${fallbackError.message}`);
                            throw fallbackError;
                        }
                    }
                }
                
                // If cheap model itself is rate-limited, cooldown
                if (modelId === 'cheap') {
                    const cooldownMs = 120000; // 2 minutes
                    this._cooldownUntil = Date.now() + cooldownMs;
                    console.warn(`[LLM] 🧊 Cheap model rate-limited. Entering ${cooldownMs / 1000}s cooldown.`);
                    return '[System: AI model temporarily rate-limited. Waiting for quota to refresh.]';
                }
            }
            
            console.error(`[LLM] ❌ Error generating response (${modelId}): ${e.message}`);
            throw e;
        }
    }
}

module.exports = new LLM();
