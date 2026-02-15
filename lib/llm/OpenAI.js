const https = require('https');
const BaseProvider = require('./BaseProvider');

class OpenAI extends BaseProvider {
    constructor(config) {
        super(config);
        this.apiKey = config.openaiApiKey;
        this.endpoint = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-4o';
    }

    async generate(systemPrompt, userPrompt) {
        if (!this.apiKey) {
            console.warn('[OpenAI] ⚠️ No API Key found. Returning mock.');
            return this.getMockResponse(userPrompt);
        }

        const data = JSON.stringify({
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
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Length': data.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(this.endpoint, options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 400) {
                        reject(new Error(`OpenAI API Error: ${res.statusCode} ${body}`));
                        return;
                    }
                    try {
                        const json = JSON.parse(body);
                        resolve(json.choices[0].message.content);
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

module.exports = OpenAI;
