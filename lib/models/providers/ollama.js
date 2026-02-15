class OllamaProvider {
    constructor(config) {
        this.baseUrl = config.baseUrl || 'http://localhost:11434';
        this.model = config.model;
    }

    async generate(systemPrompt, userPrompt) {
        // Ollama native API: /api/generate or /api/chat
        // Let's use /api/chat which is more standard
        const url = `${this.baseUrl}/api/chat`;

        const body = {
            model: this.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            stream: false
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Ollama API Error: ${res.status} ${txt}`);
            }

            const json = await res.json();
            return json.message.content;
        } catch (e) {
            console.error(`[OllamaProvider] Request failed: ${e.message}`);
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
