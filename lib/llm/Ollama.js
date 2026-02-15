const http = require('http');
const BaseProvider = require('./BaseProvider');
const { URL } = require('url');

class Ollama extends BaseProvider {
    constructor(config) {
        super(config);
        this.baseUrl = config.ollamaBaseUrl;
        this.model = 'llama3'; // Default to llama3, user might need to change
    }

    async generate(systemPrompt, userPrompt) {
        const url = new URL(`${this.baseUrl}/api/generate`);

        // Ollama raw generation supports system prompt
        const data = JSON.stringify({
            model: this.model,
            system: systemPrompt,
            prompt: userPrompt,
            stream: false
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = http.request(url, options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 400) {
                        reject(new Error(`Ollama API Error: ${res.statusCode} ${body}`));
                        return;
                    }
                    try {
                        const json = JSON.parse(body);
                        resolve(json.response);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', (e) => {
                // Fallback to mock if connection refused (e.g., Ollama not running)
                console.warn(`[Ollama] ⚠️ Connection failed: ${e.message}. Returning mock.`);
                resolve(this.getMockResponse(userPrompt));
            });
            req.write(data);
            req.end();
        });
    }
}

module.exports = Ollama;
