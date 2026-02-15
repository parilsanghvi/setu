class OpenAIProvider {
    constructor(config) {
        this.config = config;
        this.auth = config.auth;
        this.model = config.model;
        this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';

        // Normalize Base URL (remove trailing slash)
        this.baseUrl = this.baseUrl.replace(/\/$/, '');
        if (!this.baseUrl.endsWith('/v1') && this.baseUrl.includes('api.openai.com')) {
            // Only append /v1 if it's the official endpoint and missing.
            // For custom endpoints, user might point to /v1 or root.
            // Heuristic: if it looks like a root, append /v1? Setu legacy did this.
            // OpenClaw is more explicit. Let's start clean.
        }
    }

    async generate(systemPrompt, userPrompt) {
        const url = `${this.baseUrl}/chat/completions`;
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.auth && this.auth.key) {
            headers['Authorization'] = `Bearer ${this.auth.key}`;
        }

        const body = JSON.stringify({
            model: this.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        });

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`OpenAI API Error: ${res.status} ${txt}`);
            }

            const json = await res.json();
            return json.choices[0].message.content;
        } catch (e) {
            console.error(`[OpenAIProvider] Request failed: ${e.message}`);
            throw e;
        }
    }
}

module.exports = OpenAIProvider;
