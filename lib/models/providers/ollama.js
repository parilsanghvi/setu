class OllamaProvider {
    constructor(config) {
        this.baseUrl = config.baseUrl || 'http://localhost:11434';
        this.model = config.model;
    }

    async generate(systemPrompt, userPrompt, tools = null, options = {}) {
        // Ollama native API: /api/generate or /api/chat
        // Let's use /api/chat which is more standard
        const url = `${this.baseUrl}/api/chat`;

        let messages;
        if (Array.isArray(userPrompt)) {
            messages = [
                { role: 'system', content: systemPrompt },
                ...userPrompt
            ];
        } else {
            messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];
        }

        const body = {
            model: this.model,
            messages,
            stream: false
        };

        // Add Tools (Ollama supports OpenAI-compatible 'tools')
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

        // Thinking? Ollama supports some reasoning models via DeepSeek R1, but param is likely model-specific
        // or just part of the output content (<think>...</think>).
        // No explicit API param for "thinking budget" yet in standard Ollama.

        // 1. Create an AbortController for timeouts (e.g. 5 minutes)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 300s timeout

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal // 2. Attach the signal
            });

            clearTimeout(timeoutId); // 3. Clear timeout on success

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Ollama API Error: ${res.status} ${txt}`);
            }

            const json = await res.json();

            // Handle Tool Calls
            if (json.message.tool_calls) {
                return {
                    content: json.message.content || "",
                    toolCalls: json.message.tool_calls.map(tc => ({
                        id: 'call_' + Math.random().toString(36).substr(2, 9), // Ollama might not return ID?
                        name: tc.function.name,
                        args: tc.function.arguments
                    }))
                };
            }

            return json.message.content;
        } catch (e) {
            clearTimeout(timeoutId); // Ensure timeout is cleared on failure
            console.error(`[OllamaProvider] Request failed: ${e.message}`);

            // Handle timeout specifically
            if (e.name === 'AbortError') {
                throw new Error('Ollama generation timed out after 5 minutes.');
            }
            // Check if Ollama is running
            if (e.message.includes('ECONNREFUSED')) {
                throw new Error('Ollama is not running on localhost:11434');
            }
            throw e;
        }
    }

    // Discovery capability (used by CLI list)
    static async listModels(baseUrl = 'http://localhost:11434') {
        try {
            const res = await fetch(`${baseUrl}/api/tags`);
            if (!res.ok) return [];
            const json = await res.json();
            return json.models.map(m => m.name);
        } catch {
            return [];
        }
    }
}

module.exports = OllamaProvider;
