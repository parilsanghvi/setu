class AnthropicProvider {
    constructor(config) {
        this.auth = config.auth;
        this.model = config.model;
        this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
    }

    async generate(systemPrompt, userPrompt) {
        const url = `${this.baseUrl}/messages`;

        if (!this.auth || !this.auth.key) {
            throw new Error('[AnthropicProvider] Missing API Key');
        }

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': this.auth.key,
            'anthropic-version': '2023-06-01'
        };

        const body = {
            model: this.model,
            max_tokens: 4096, // Default max
            system: systemPrompt,
            messages: [
                { role: 'user', content: userPrompt }
            ]
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Anthropic API Error: ${res.status} ${txt}`);
            }

            const json = await res.json();
            return json.content[0].text;
        } catch (e) {
            console.error(`[AnthropicProvider] Request failed: ${e.message}`);
            throw e;
        }
    }
}

module.exports = AnthropicProvider;
