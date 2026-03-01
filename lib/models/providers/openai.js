const Logger = require("../../Logger");

class OpenAIProvider {
    constructor(config) {
        this.config = config;
        this.auth = config.auth;
        this.model = config.model;
        this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
        this.logger = new Logger("OpenAIProvider");

        // Normalize Base URL (remove trailing slash)
        this.baseUrl = this.baseUrl.replace(/\/$/, '');
        if (!this.baseUrl.endsWith('/v1') && this.baseUrl.includes('api.openai.com')) {
            // Only append /v1 if it's the official endpoint and missing.
            // For custom endpoints, user might point to /v1 or root.
            // Heuristic: if it looks like a root, append /v1? Setu legacy did this.
            // OpenClaw is more explicit. Let's start clean.
        }
    }

    async generate(systemPrompt, userPrompt, tools, options = {}) {
        const url = `${this.baseUrl}/chat/completions`;
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.auth && this.auth.key) {
            headers['Authorization'] = `Bearer ${this.auth.key}`;
        }

        let messages;
        if (Array.isArray(userPrompt)) {
            // If history is passed, we still need to inject the system prompt
            messages = [
                { role: 'system', content: systemPrompt },
                ...userPrompt
            ];
        } else {
            messages = [
                // o1/o3 models do NOT support 'system' role in some versions, but 'developer' is coming.
                // For now, standard chat models use system.
                // If model starts with 'o1', we might need to merge system into user or use 'developer' if supported.
                // Let's stick to standard for now, but watch out.
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];
        }

        // o1-mini / o1-preview do not support system messages in early implementation? 
        // Checking docs: "o1-preview" supports system? No, it often requires "user".
        // But o3-mini supports 'developer'. 
        // Let's rely on standard 'system' for GPT-4o and handle O1 if it fails or rely on user knowing config.

        const body = {
            model: this.model,
            messages
        };

        // Add Tools
        if (tools && tools.length > 0) {
            body.tools = tools.map(t => ({
                type: 'function',
                function: {
                    name: t.name,
                    description: t.description,
                    parameters: t.parameters
                }
            }));
        }

        // Add Reasoning Effort (for o1/o3)
        if (options.reasoning_effort) {
            body.reasoning_effort = options.reasoning_effort; // low, medium, high
        }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`OpenAI API Error: ${res.status} ${txt}`);
            }

            const json = await res.json();
            const choice = json.choices[0];

            // Handle Tool Calls
            if (choice.finish_reason === 'tool_calls' || choice.message.tool_calls) {
                return {
                    content: choice.message.content || "",
                    toolCalls: choice.message.tool_calls.map(tc => ({
                        id: tc.id,
                        name: tc.function.name,
                        args: JSON.parse(tc.function.arguments)
                    }))
                };
            }

            return choice.message.content;
        } catch (e) {
            this.logger.error(`Request failed: ${e.message}`);
            throw e;
        }
    }
}

module.exports = OpenAIProvider;
