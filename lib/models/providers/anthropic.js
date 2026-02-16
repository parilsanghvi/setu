class AnthropicProvider {
    constructor(config) {
        this.auth = config.auth;
        this.model = config.model;
        this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
    }

    async generate(systemPrompt, userPrompt, tools, options = {}) {
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
            max_tokens: options.maxTokens || 4096,
            system: systemPrompt,
            messages: Array.isArray(userPrompt) ? userPrompt : [{ role: 'user', content: userPrompt }]
        };

        // Add Tools
        if (tools && tools.length > 0) {
            body.tools = tools.map(t => ({
                name: t.name,
                description: t.description,
                input_schema: t.parameters
            }));
        }

        // Add Thinking (Claude 3.7+ / Sonnet 3.5 new feature?)
        // pi-mono uses: thinking: { type: "enabled", budget_tokens: N }
        if (options.thinking) {
            // If options.thinking is boolean true, set default budget
            if (options.thinking === true) {
                body.thinking = { type: 'enabled', budget_tokens: 16000 };
            } else if (typeof options.thinking === 'object') {
                body.thinking = options.thinking;
            }
            // When thinking is enabled, max_tokens must be higher (usually > budget)
            if (!options.maxTokens) body.max_tokens = 20000;
        }

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

            // Handle Tool Calls in Response
            if (json.content.some(c => c.type === 'tool_use')) {
                return {
                    content: json.content.find(c => c.type === 'text')?.text || "",
                    toolCalls: json.content.filter(c => c.type === 'tool_use').map(tc => ({
                        id: tc.id,
                        name: tc.name,
                        args: tc.input
                    }))
                };
            }

            return json.content[0].text;
        } catch (e) {
            console.error(`[AnthropicProvider] Request failed: ${e.message}`);
            throw e;
        }
    }
}

module.exports = AnthropicProvider;
