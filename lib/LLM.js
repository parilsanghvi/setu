const Config = require('./Config');
const OpenAICompatible = require('./llm/OpenAICompatible');

class LLM {
    constructor() {
        this.expensiveProvider = this.createProvider('expensive');
        this.cheapProvider = this.createProvider('cheap');

        console.log(`[LLM] Initialized. Expensive: ${Config.expensiveModelName} (${Config.expensiveModelProvider}), Cheap: ${Config.cheapModelName} (${Config.cheapModelProvider})`);
    }

    createProvider(type) {
        // Universal Provider Wrapper
        // In the future we can add specialized ones back if needed, but OpenAICompatible
        // covers 99% of cases (OpenAI, DeepSeek, Ollama, vLLM, etc.)
        return new OpenAICompatible(Config, type);
    }

    async generate(systemPrompt, userPrompt, type = 'expensive') {
        const provider = type === 'cheap' ? this.cheapProvider : this.expensiveProvider;

        try {
            return await provider.generate(systemPrompt, userPrompt);
        } catch (e) {
            console.error(`[LLM] ❌ Error generating response (${type}): ${e.message}`);
            throw e;
        }
    }
}

module.exports = new LLM();
