const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

class Config {
    constructor() {
        this.envPath = path.join(process.cwd(), '.env');
        this.validProviders = ['openai', 'anthropic', 'ollama', 'vllm', 'deepseek', 'custom', 'google'];
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
        this.googleProjectId = process.env.GOOGLE_PROJECT_ID;
        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
        this.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

        // Google Auth Configuration
        this.googleRedirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:51121/oauth-callback";
        this.googleAuthUrl = process.env.GOOGLE_AUTH_URL || "https://accounts.google.com/o/oauth2/v2/auth";
        this.googleTokenUrl = process.env.GOOGLE_TOKEN_URL || "https://oauth2.googleapis.com/token";
        this.googleScopes = [
            "https://www.googleapis.com/auth/cloud-platform",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/cclog",
            "https://www.googleapis.com/auth/experimentsandconfigs"
        ];
        if (process.env.GOOGLE_SCOPES) {
            this.googleScopes = process.env.GOOGLE_SCOPES.split(',');
        }
        this.googleCodeAssistEndpoints = [
            "https://cloudcode-pa.googleapis.com",
            "https://daily-cloudcode-pa.sandbox.googleapis.com"
        ];
        this.googleDefaultProjectId = process.env.GOOGLE_DEFAULT_PROJECT_ID || "rising-fact-p41fc";

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

        if (this.provider === 'openai' && !this.openaiApiKey && this.expensiveModelProvider === 'openai') {
            console.warn('[Config] ⚠️ LLM_PROVIDER is openai but OPENAI_API_KEY is missing.');
        }
        if (this.provider === 'anthropic' && !this.anthropicApiKey && this.expensiveModelProvider === 'anthropic') {
            console.warn('[Config] ⚠️ LLM_PROVIDER is anthropic but ANTHROPIC_API_KEY is missing.');
        }

        if (this.provider === 'google' && (!this.googleClientId || !this.googleClientSecret)) {
            console.warn('[Config] ⚠️ LLM_PROVIDER is google but GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing.');
        }

        this.contextCompactionThreshold = parseInt(process.env.CONTEXT_COMPACTION_THRESHOLD) || 200000;
    }

    get(key) {
        return process.env[key];
    }
}

module.exports = new Config();
