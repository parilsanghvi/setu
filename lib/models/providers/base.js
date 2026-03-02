class BaseProvider {
    constructor(config) {
        this.config = config;
        this.auth = config.auth;
        this.model = config.model;
        this.baseUrl = config.baseUrl;
    }

    async generate(systemPrompt, userPrompt, tools, options = {}) {
        throw new Error('generate() must be implemented by subclass');
    }
}

module.exports = BaseProvider;
