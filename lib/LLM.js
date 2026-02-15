const Config = require('./Config');
const ProviderFactory = require('./models/factory');

class LLM {
    constructor() {
        this.initializeProviders();
    }

    initializeProviders() {
        try {
            // Expensive Model (Default High Logic)
            this.expensiveProvider = ProviderFactory.create(
                Config.expensiveModelProvider,
                Config.expensiveModelName,
                { baseUrl: Config.expensiveModelBaseUrl }
            );

            // Cheap Model (Default Fast Logic)
            this.cheapProvider = ProviderFactory.create(
                Config.cheapModelProvider,
                Config.cheapModelName,
                { baseUrl: Config.cheapModelBaseUrl }
            );

            console.log(`[LLM] Initialized. Expensive: ${Config.expensiveModelName} (${Config.expensiveModelProvider}), Cheap: ${Config.cheapModelName} (${Config.cheapModelProvider})`);
        } catch (e) {
            console.error('[LLM] Failed to initialize providers:', e.message);
            // Fallback to null or stub if needed, but throwing is better for visibility
        }
    }

    async generate(systemPrompt, userPrompt, type = 'expensive') {
        const provider = type === 'cheap' ? this.cheapProvider : this.expensiveProvider;

        if (!provider) {
            throw new Error(`[LLM] Provider for ${type} is not initialized.`);
        }

        try {
            return await provider.generate(systemPrompt, userPrompt);
        } catch (e) {
            console.error(`[LLM] ❌ Error generating response (${type}): ${e.message}`);
            // Retry logic could go here
            throw e;
        }
    }
}

module.exports = new LLM();
