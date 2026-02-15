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


    async generate(systemPrompt, userPrompt) {
        let token = null;

        // 1. Check for API Key first (Simple Gemini API)
        if (this.auth && this.auth.type === 'api_key') {
            return this.generateViaApiKey(this.auth.key, systemPrompt, userPrompt);
        }

        // 2. Check for OAuth Token
        if (this.auth && this.auth.type === 'oauth') {
            token = this.auth.access;
        }

        if (!token) {
            throw new Error('[GoogleProvider] No valid authentication found (ApiKey or OAuth).');
        }

        // 3. Use OAuth (Internal Cloud Code API)
        // This mirrors OpenClaw's "Antigravity" / "Gemini CLI" implementation
        return this.generateViaOAuth(token, systemPrompt, userPrompt);
    }

    async generateViaApiKey(key, systemPrompt, userPrompt) {
        // Consumer Gemini API Endpoint
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${key}`;

        const contents = [
            {
                role: 'user',
                parts: [{ text: userPrompt }]
            }
        ];

        const body = {
            contents,
            system_instruction: {
                parts: [{ text: systemPrompt }]
            }
        };

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
            return json.candidates[0].content.parts[0].text;
        }
        return '';
    }

    async generateViaOAuth(token, systemPrompt, userPrompt) {
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
            // Mapping to the experimental model seen in CLI logs for current "thinking" capabilities
            // or "Gemini 3" placeholder if users use that name for 2.0 Flash Thinking
            modelId = 'models/gemini-2.0-flash-thinking-exp-1219';
        } else if (!modelId.startsWith('models/')) {
            // Experimental/New models like gemini-2.5-* seem to require NO prefix on internal API
            if (modelId.startsWith('gemini-2.5')) {
                // Do not add prefix
            } else if (modelId.startsWith('gemini-')) {
                modelId = `models/${modelId}`;
            } else {
                modelId = `models/${modelId}`;
            }
        }

        const payload = {
            model: modelId,
            project: this.auth.projectId,
            user_prompt_id: crypto.randomUUID(),
            request: {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: userPrompt }]
                    }
                ],
                // Identify system instruction handling? 
                // The CLI payload didn't show system instruction in the simple "hello" case, 
                // but converter.js shows `systemInstruction` support in `toVertexGenerateContentRequest`.
                systemInstruction: systemPrompt ? {
                    parts: [{ text: systemPrompt }]
                } : undefined,
                generationConfig: {
                    candidateCount: 1,
                    thinkingConfig: modelId.includes('thinking') ? { thinkingBudget: 512 } : undefined
                },
                session_id: crypto.randomUUID()
            }
        };

        console.log('[GoogleProvider] Generating via OAuth...');
        console.log('[GoogleProvider] URL:', url);
        console.log('[GoogleProvider] Payload:', JSON.stringify(payload, null, 2));

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Google-Gemini-CLI'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`[GoogleProvider] Internal API Error: ${res.status} ${txt}`);
        }

        const json = await res.json();

        // Response format: { response: { candidates: [...] } }
        if (json.response && json.response.candidates && json.response.candidates.length > 0) {
            const parts = json.response.candidates[0].content.parts;
            if (parts && parts.length > 0) {
                return parts.map(p => p.text).join('');
            }
        }

        return '';
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
