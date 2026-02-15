const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

class ModelConfig {
    constructor() {
        this.modelsPath = path.join(process.cwd(), 'models.json');
        this.envPath = path.join(process.cwd(), '.env');
        this.config = {};
        this.load();
    }

    load() {
        // Load Env
        if (fs.existsSync(this.envPath)) {
            dotenv.config({ path: this.envPath });
        }

        // Load models.json if verification needed, but for now we rely on universal defaults + env
        // OpenClaw loads models.json to allow user overrides.
        if (fs.existsSync(this.modelsPath)) {
            try {
                this.config = JSON.parse(fs.readFileSync(this.modelsPath, 'utf8'));
            } catch (e) {
                console.warn('[ModelConfig] Failed to parse models.json', e.message);
            }
        }
    }

    // Resolves the provider ID (e.g., 'openai', 'anthropic') for a model
    // Uses OpenClaw's pattern of implicit discovery or explicit config
    resolveProviderConfig(providerId) {
        // 1. Check models.json for provider config
        if (this.config.providers && this.config.providers[providerId]) {
            return this.config.providers[providerId];
        }

        // 2. Return defaults
        return {
            id: providerId
        };
    }
}

module.exports = new ModelConfig();
