const AuthStore = require('./auth-store');

class ProfileManager {
    constructor() {
        this.envMap = {
            openai: 'OPENAI_API_KEY',
            anthropic: 'ANTHROPIC_API_KEY',
            google: 'GEMINI_API_KEY',
            ollama: 'OLLAMA_API_KEY',
            vllm: 'VLLM_API_KEY',
            deepseek: 'DEEPSEEK_API_KEY',
            mistral: 'MISTRAL_API_KEY',
            groq: 'GROQ_API_KEY',
            minimax: 'MINIMAX_API_KEY',
            moonshot: 'MOONSHOT_API_KEY',
            together: 'TOGETHER_API_KEY',
            openrouter: 'OPENROUTER_API_KEY',
            'minimax-portal': 'MINIMAX_APIT_KEY', // Check OpenClaw spec
            'xiaomi': 'XIAOMI_API_KEY',
            'dashboard': 'DASHBOARD_AUTH_TOKEN'
        };
    }

    // Resolves API key with precedence:
    // 1. Env Var (Explicit override)
    // 2. Auth Store Profile (Persistent)
    resolveApiKey(provider, options = {}) {
        const opts = options || {};

        // 1. Check Env
        const envVar = this.envMap[provider];
        if (envVar && process.env[envVar]) {
            return {
                key: process.env[envVar],
                source: `env:${envVar}`,
                type: 'api_key'
            };
        }

        // 2. Check Auth Store
        // Get profiles and ensure we have a copy to sort/filter safely
        let profiles = [...AuthStore.findProfilesByProvider(provider)];

        if (opts.profileId) {
            profiles = profiles.filter(p => p.id === opts.profileId);
        }

        if (profiles.length > 0) {
            // Prefer the most recently updated
            profiles.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
            const profile = profiles[0];

            if (profile.type === 'oauth' && profile.access) {
                return {
                    key: profile.access,
                    source: `profile:${profile.id}`,
                    type: 'oauth',
                    ...profile
                };
            }

            if (profile.key) {
                return {
                    key: profile.key,
                    source: `profile:${profile.id}`,
                    type: 'api_key'
                };
            }
        }

        return null;
    }

    // Explicitly get a specific profile
    getProfile(profileId) {
        return AuthStore.getProfile(profileId);
    }

    listProfiles() {
        return AuthStore.listProfiles();
    }
}

module.exports = new ProfileManager();
