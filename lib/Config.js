const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

class Config {
    constructor() {
        this.envPath = path.join(process.cwd(), '.env');
        this.validProviders = ['openai', 'anthropic', 'ollama', 'vllm', 'deepseek', 'custom'];
        this.load();
    }

    load() {
        if (fs.existsSync(this.envPath)) {
            const result = dotenv.config({ path: this.envPath });
            if (result.error) {
                console.warn('[Config] ⚠️ Error loading .env file:', result.error.message);
            }
        } else {
            console.warn('[Config] ⚠️ No .env file found. using defaults or environment variables.');
        }

        this.validate();
    }

    validate() {
        this.provider = process.env.LLM_PROVIDER || 'openai';
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        this.dockerPath = process.env.DOCKER_PATH;
        this.logLevel = process.env.LOG_LEVEL || 'info';

        // Validation logic
        if (!this.validProviders.includes(this.provider)) {
            console.warn(`[Config] ⚠️ Unknown LLM_PROVIDER '${this.provider}'. Defaulting to 'openai'.`);
            this.provider = 'openai';
        }

        // Dual Model Config
        this.expensiveModelProvider = process.env.MODEL_EXPENSIVE_PROVIDER || this.provider;
        this.expensiveModelName = process.env.MODEL_EXPENSIVE_NAME;
        this.expensiveModelApiKey = process.env.MODEL_EXPENSIVE_API_KEY || process.env[`${this.expensiveModelProvider.toUpperCase()}_API_KEY`];
        this.expensiveModelBaseUrl = process.env.MODEL_EXPENSIVE_BASE_URL;

        this.cheapModelProvider = process.env.MODEL_CHEAP_PROVIDER || this.expensiveModelProvider;
        this.cheapModelName = process.env.MODEL_CHEAP_NAME;
        this.cheapModelApiKey = process.env.MODEL_CHEAP_API_KEY || process.env[`${this.cheapModelProvider.toUpperCase()}_API_KEY`] || this.expensiveModelApiKey;
        this.cheapModelBaseUrl = process.env.MODEL_CHEAP_BASE_URL || this.expensiveModelBaseUrl;

        if (this.provider === 'openai' && !this.openaiApiKey) {
            console.warn('[Config] ⚠️ LLM_PROVIDER is openai but OPENAI_API_KEY is missing.');
        }
        if (this.provider === 'anthropic' && !this.anthropicApiKey) {
            console.warn('[Config] ⚠️ LLM_PROVIDER is anthropic but ANTHROPIC_API_KEY is missing.');
        }
    }

    get(key) {
        return process.env[key];
    }
}

module.exports = new Config();
