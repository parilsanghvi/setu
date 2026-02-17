const crypto = require('crypto');
const GoogleAuth = require('../../auth/google');

class GoogleProvider {
    constructor(config) {
        this.config = config;
        this.auth = config.auth;
        this.model = config.model;

        // API Key (Legacy/Consumer) vs OAuth (Antigravity/Internal)
    }

    static async fetchModels(token) {
        if (!token) return [];
        const url = 'https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels';
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'antigravity',
                    'X-Goog-Api-Client': 'google-cloud-sdk vscode_cloudshelleditor/0.1'
                },
                body: JSON.stringify({})
            });

            if (res.ok) {
                const data = await res.json();
                if (data.models) {
                    // Return sorted keys, filtered common ones
                    return Object.keys(data.models)
                        .filter(id => !id.startsWith('chat_') && !id.startsWith('tab_'))
                        .sort();
                }
            }
        } catch (e) {
            console.error('[GoogleProvider] Failed to fetch models:', e.message);
        }
        return [];
    }


    async generate(systemPrompt, userPrompt, tools = null, options = {}) {
        let token = null;

        // 1. Check for API Key first (Simple Gemini API)
        if (this.auth && this.auth.type === 'api_key') {
            return this.generateViaApiKey(this.auth.key, systemPrompt, userPrompt, tools, options);
        }

        // 2. Check for OAuth Token
        if (this.auth && this.auth.type === 'oauth') {
            token = this.auth.access;
        }

        if (!token) {
            throw new Error('[GoogleProvider] No valid authentication found (ApiKey or OAuth).');
        }

        // 3. Use OAuth (Internal Cloud Code API)
        return this.generateViaOAuth(token, systemPrompt, userPrompt, tools, options);
    }

    async generateViaApiKey(key, systemPrompt, userPrompt, tools = null, options = {}) {
        // Consumer Gemini API Endpoint
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${key}`;

        let contents = [];
        if (Array.isArray(userPrompt)) {
            contents = userPrompt.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }));
        } else {
            contents = [{ role: 'user', parts: [{ text: userPrompt }] }];
        }

        const body = {
            contents,
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            tools: tools ? [{ function_declarations: tools }] : undefined
        };

        // Add Thinking Config if enabled (only for supported models like gemini-2.0-flash-thinking)
        if (options.thinking) {
            const budget = options.thinking.budget_tokens || 1024;
            if (!body.generationConfig) body.generationConfig = {};
            body.generationConfig.thinkingConfig = { include_thoughts: true };
            // Note: 'thinkingConfig' API shape might vary by specific API version.
            // Public API usually doesn't expose budget control yet, just on/off for specific models.
            // We'll trust the model name is correct for thinking.
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Google API Error: ${res.status} ${txt}`);
        }

        const json = await res.json();
        if (json.candidates && json.candidates.length > 0) {
            const parts = json.candidates[0].content.parts;
            const toolCalls = parts.filter(p => p.functionCall);
            if (toolCalls.length > 0) {
                return {
                    toolCalls: toolCalls.map(p => ({
                        name: p.functionCall.name,
                        args: p.functionCall.args
                    }))
                };
            }
            return parts[0].text;
        }
        return '';
    }

    async generateViaOAuth(token, systemPrompt, userPrompt, tools = null, options = {}) {
        // Ensure token is fresh if we have a profile ID
        if (this.auth.id) {
            try {
                // This handles refresh logic automatically
                token = await GoogleAuth.getValidToken(this.auth.id);
            } catch (e) {
                console.warn('[GoogleProvider] Failed to refresh token, trying with current access token:', e.message);
            }
        }

        // Detect or Override Project ID
        const Config = require('../../Config');
        if (Config.googleProjectId) {
            this.auth.projectId = Config.googleProjectId;
        }

        if (!this.auth.projectId) {
            this.auth.projectId = await this.fetchProject(token);
            if (this.auth.projectId) {
                console.log(`[GoogleProvider] Discovered project ID: ${this.auth.projectId}`);
            } else {
                throw new Error('[GoogleProvider] No Google Cloud Project ID found. Set GOOGLE_PROJECT_ID in .env or check OAuth permissions.');
            }
        }

        const url = `https://cloudcode-pa.googleapis.com/v1internal:generateContent`;

        // Handle Model Alias
        let modelId = this.model;
        if (modelId === 'gemini 3' || modelId === 'gemini-3') {
            modelId = 'models/gemini-2.0-flash-thinking-exp-1219';
        } else if (!modelId.startsWith('models/')) {
            if (modelId.startsWith('gemini-2.5') || modelId.startsWith('gemini-3')) {
                // Do not add prefix
            } else if (modelId.startsWith('gemini-')) {
                modelId = `models/${modelId}`;
            } else {
                modelId = `models/${modelId}`;
            }
        }

        let contents = [];
        if (Array.isArray(userPrompt)) {
            contents = userPrompt.map((m, idx) => {
                let res = { role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user', parts: [] };

                if (m.toolCalls) {
                    res.role = 'model';
                    res.parts = m.toolCalls.map(tc => ({
                        functionCall: { name: tc.name, args: tc.args }
                    }));
                } else if (m.toolResults) {
                    res.role = 'user';
                    res.parts = m.toolResults.map(tr => ({
                        functionResponse: {
                            name: tr.name,
                            response: { content: tr.content }
                        }
                    }));
                } else if (m.toolResult) {
                    res.role = 'user';
                    res.parts = [{
                        functionResponse: {
                            name: m.toolResult.name,
                            response: { content: m.toolResult.content }
                        }
                    }];
                } else if (m.content) {
                    res.parts = [{ text: m.content }];
                } else {
                    // Placeholder for messages without content (e.g. system or failed turns)
                    res.parts = [{ text: "..." }];
                }
                return res;
            });
        } else {
            contents = [{ role: 'user', parts: [{ text: userPrompt }] }];
        }

        // Filter out empty parts if any survived
        contents = contents.filter(c => c.parts.length > 0);

        // Configure Thinking
        const generationConfig = {
            candidateCount: 1,
        };

        if (options.thinking || modelId.includes('thinking')) {
            const budget = options.thinking?.budget_tokens || 2048;
            // Internal API for thinking config
            generationConfig.thinkingConfig = { include_thoughts: true };
        }

        const payload = {
            model: modelId,
            project: this.auth.projectId,
            user_prompt_id: crypto.randomUUID(),
            request: {
                contents,
                tools: tools ? [{ functionDeclarations: tools }] : undefined,
                systemInstruction: systemPrompt ? {
                    parts: [{ text: systemPrompt }]
                } : undefined,
                generationConfig,
                session_id: crypto.randomUUID()
            }
        };

        return this.fetchWithBackoff(url, token, payload);
    }

    async fetchWithBackoff(url, token, payload, retries = 5) {
        for (let i = 0; i < retries; i++) {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Google-Gemini-CLI'
                },
                body: JSON.stringify(payload)
            });

            if (res.status === 429) {
                // Exponential Backoff + Jitter
                // Base: 2s, 4s, 8s, 16s...
                // Jitter: +/- 500ms to desynchronize agents
                const baseDelay = 2000 * Math.pow(2, i);
                const jitter = Math.random() * 1000; 
                const delay = baseDelay + jitter;
                
                console.log(`[GoogleProvider] ⏳ Quota exhausted (429). Retrying attempt ${i + 1}/${retries} in ${Math.round(delay)}ms...`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`[GoogleProvider] Internal API Error: ${res.status} ${txt}`);
            }

            const json = await res.json();

            // Response format: { response: { candidates: [...] } }
            if (json.response && json.response.candidates && json.response.candidates.length > 0) {
                const parts = json.response.candidates[0].content.parts;
                if (parts && parts.length > 0) {
                    const toolCalls = parts.filter(p => p.functionCall);
                    if (toolCalls.length > 0) {
                        return {
                            toolCalls: toolCalls.map(p => ({
                                name: p.functionCall.name,
                                args: p.functionCall.args
                            }))
                        };
                    }
                    return parts.map(p => p.text).join('');
                }
            }
            return '';
        }
        throw new Error(`[GoogleProvider] Max retries (${retries}) exceeded for 429 Rate Limit.`);
    }

    async fetchProject(token) {
        // Use loadCodeAssist to get project ID
        // Endpoint: https://cloudcode-pa.googleapis.com/v1internal:loadCodeAssist
        const url = `https://cloudcode-pa.googleapis.com/v1internal:loadCodeAssist`;
        const payload = {
            metadata: {
                ideType: "ANTIGRAVITY",
                pluginType: "GEMINI",
                platform: "PLATFORM_UNSPECIFIED"
            }
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Client': 'google-cloud-sdk vscode_cloudshelleditor/0.1'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const json = await res.json();
                console.log('[GoogleProvider] fetchProject response:', JSON.stringify(json, null, 2));
                const proj = json.cloudaicompanionProject;
                if (proj) {
                    if (typeof proj === 'string') return proj;
                    if (proj.id) return proj.id;
                }
            } else {
                const txt = await res.text();
                console.error(`[GoogleProvider] fetchProject failed: ${res.status} ${txt}`);
            }
        } catch (e) {
            console.error('[GoogleProvider] Failed to fetch project:', e);
        }
        return null;
    }
}

module.exports = GoogleProvider;
