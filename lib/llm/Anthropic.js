const https = require('https');
const BaseProvider = require('./BaseProvider');

class Anthropic extends BaseProvider {
    constructor(config) {
        super(config);
        this.apiKey = config.anthropicApiKey;
        this.endpoint = 'https://api.anthropic.com/v1/messages';
        this.model = 'claude-3-opus-20240229';
    }

    async generate(systemPrompt, userPrompt) {
        if (!this.apiKey) {
            console.warn('[Anthropic] ⚠️ No API Key found. Returning mock.');
            return this.getMockResponse(userPrompt);
        }

        const data = JSON.stringify({
            model: this.model,
            max_tokens: 4096,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userPrompt }
            ]
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Length': data.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(this.endpoint, options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 400) {
                        reject(new Error(`Anthropic API Error: ${res.statusCode} ${body}`));
                        return;
                    }
                    try {
                        const json = JSON.parse(body);
                        resolve(json.content[0].text);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(data);
            req.end();
        });
    }
}

module.exports = Anthropic;
