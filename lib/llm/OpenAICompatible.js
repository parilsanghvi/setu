const BaseProvider = require('./BaseProvider');
const https = require('https');
const http = require('http');

class OpenAICompatible extends BaseProvider {
    constructor(config, type = 'expensive') {
        super(config);
        this.type = type; // 'expensive' or 'cheap'

        // Select config based on type
        if (type === 'expensive') {
            this.providerName = config.expensiveModelProvider;
            this.apiKey = config.expensiveModelApiKey;
            this.model = config.expensiveModelName;
            this.baseUrl = config.expensiveModelBaseUrl || this.getDefaultBaseUrl(this.providerName);
        } else {
            this.providerName = config.cheapModelProvider;
            this.apiKey = config.cheapModelApiKey;
            this.model = config.cheapModelName;
            this.baseUrl = config.cheapModelBaseUrl || this.getDefaultBaseUrl(this.providerName);
        }

        // Ensure baseUrl has no trailing slash and includes /v1 if needed (but user usually provides base)
        // Heuristic: if user provides 'http://localhost:11434', assume they mean 'http://localhost:11434/v1' for openai-compat
        // unless they specify the full path.
        if (this.baseUrl && !this.baseUrl.includes('/v1') && (this.providerName === 'ollama' || this.providerName === 'vllm')) {
            this.baseUrl = `${this.baseUrl.replace(/\/$/, '')}/v1`;
        } else if (this.baseUrl) {
            this.baseUrl = this.baseUrl.replace(/\/$/, '');
        }
    }

    getDefaultBaseUrl(provider) {
        switch (provider) {
            case 'ollama': return 'http://localhost:11434/v1';
            case 'vllm': return 'http://localhost:8000/v1';
            case 'openai': return 'https://api.openai.com/v1';
            case 'deepseek': return 'https://api.deepseek.com/v1';
            default: return null;
        }
    }

    // Static method for Discovery (used by setup script)
    static async fetchModels(baseUrl, apiKey) {
        if (!baseUrl) return [];
        // Normalize URL
        let url = baseUrl.replace(/\/$/, '');
        if (!url.includes('/v1') && !url.includes('api.openai.com')) {
            url = `${url}/v1`;
        }

        return new Promise((resolve) => {
            const lib = url.startsWith('https') ? https : http;
            const headers = {};
            if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

            const req = lib.request(`${url}/models`, { method: 'GET', headers }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.data && Array.isArray(json.data)) {
                            resolve(json.data.map(m => m.id));
                        } else {
                            resolve([]);
                        }
                    } catch (e) {
                        resolve([]);
                    }
                });
            });

            req.on('error', () => resolve([]));
            req.end();
        });
    }

    async generate(systemPrompt, userPrompt) {
        if (!this.baseUrl) {
            console.warn(`[${this.type}] ⚠️ No Base URL configured. Returning mock.`);
            return this.getMockResponse(userPrompt);
        }

        return new Promise((resolve, reject) => {
            const lib = this.baseUrl.startsWith('https') ? https : http;
            const url = new URL(`${this.baseUrl}/chat/completions`);

            const body = JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            });

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body)
                }
            };

            if (this.apiKey) {
                options.headers['Authorization'] = `Bearer ${this.apiKey}`;
            }

            const req = lib.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 400) {
                        return reject(new Error(`API Request Failed: ${res.statusCode} ${data}`));
                    }
                    try {
                        const json = JSON.parse(data);
                        resolve(json.choices[0].message.content);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(body);
            req.end();
        });
    }
}

module.exports = OpenAICompatible;
