const fs = require('fs');
const path = require('path');
const { Input, Select, Confirm, Password } = require('enquirer');
const OpenAICompatible = require('../lib/llm/OpenAICompatible');
const { execSync } = require('child_process');

async function setup() {
    console.log('\n🚀  Setu Modernization Wizard  🚀\n');
    console.log('This wizard will configure your Dual-Model Environment.\n');

    const envData = {};

    // --- Helper: Model Setup ---
    async function configureModel(type, defaults = {}) {
        console.log(`\n--- Set Up ${type.toUpperCase()} Model ---`);

        const provider = await new Select({
            name: 'provider',
            message: `Select Provider for ${type} model:`,
            choices: ['openai', 'anthropic', 'ollama', 'vllm', 'deepseek', 'custom'],
            initial: defaults.provider || 'openai'
        }).run();

        let baseUrl = '';
        if (['ollama', 'vllm', 'custom', 'deepseek'].includes(provider)) {
            const defaultUrl =
                provider === 'ollama' ? 'http://localhost:11434' :
                    provider === 'vllm' ? 'http://localhost:8000' :
                        provider === 'deepseek' ? 'https://api.deepseek.com' : '';

            baseUrl = await new Input({
                name: 'baseUrl',
                message: 'Enter Base URL:',
                initial: defaultUrl
            }).run();
        }

        const apiKey = await new Password({
            name: 'apiKey',
            message: 'Enter API Key (leave empty for local if not needed):',
            initial: defaults.apiKey || ''
        }).run();

        // Auto-Discovery
        let models = [];
        console.log('🔍 Attempting to fetch models...');
        try {
            models = await OpenAICompatible.fetchModels(baseUrl || (provider === 'openai' ? 'https://api.openai.com' : null), apiKey);
        } catch (e) {
            console.log('⚠️ Could not fetch models automatically.');
        }

        let modelName = '';
        if (models.length > 0) {
            modelName = await new Select({
                name: 'model',
                message: 'Select Model:',
                choices: [...models, 'Type Manually'],
            }).run();
        }

        if (!modelName || modelName === 'Type Manually') {
            modelName = await new Input({
                name: 'model',
                message: 'Enter Model Name (e.g., gpt-4o, llama3):',
                initial: defaults.modelName || 'gpt-4o'
            }).run();
        }

        return { provider, apiKey, modelName, baseUrl };
    }

    // 1. Expensive Model
    const expensive = await configureModel('expensive');
    envData['MODEL_EXPENSIVE_PROVIDER'] = expensive.provider;
    envData['MODEL_EXPENSIVE_NAME'] = expensive.modelName;
    envData['MODEL_EXPENSIVE_API_KEY'] = expensive.apiKey;
    if (expensive.baseUrl) envData['MODEL_EXPENSIVE_BASE_URL'] = expensive.baseUrl;

    // 2. Cheap Model
    const useSame = await new Confirm({
        name: 'useSame',
        message: 'Use the same configuration for the CHEAP model?',
        initial: true
    }).run();

    if (useSame) {
        envData['MODEL_CHEAP_PROVIDER'] = expensive.provider;
        envData['MODEL_CHEAP_NAME'] = expensive.modelName;
        // Maybe user wants same provider but different model?
        // For simplicity in "Same Config", we copy everything. 
        // If they strictly want different model, they should say 'No'.
        // Actually, let's offer to just change the model name if same provider.
        // User feedback: "if different we give them interface to choose"
        // so "Use same config" implies EXACT same.
    } else {
        const cheap = await configureModel('cheap');
        envData['MODEL_CHEAP_PROVIDER'] = cheap.provider;
        envData['MODEL_CHEAP_NAME'] = cheap.modelName;
        envData['MODEL_CHEAP_API_KEY'] = cheap.apiKey;
        if (cheap.baseUrl) envData['MODEL_CHEAP_BASE_URL'] = cheap.baseUrl;
    }

    // 3. Docker (Optional)
    console.log('\n--- Docker Setup ---');
    let dockerPath = '';
    try {
        dockerPath = execSync('which docker').toString().trim();
        console.log(`✅ Docker detected at: ${dockerPath}`);
    } catch (e) {
        console.warn('⚠️ Docker not found in PATH.');
    }

    const confirmDocker = await new Input({
        name: 'dockerPath',
        message: 'Enter Docker executable path (leave empty to skip/auto-detect):',
        initial: dockerPath
    }).run();

    if (confirmDocker) {
        envData['DOCKER_PATH'] = confirmDocker;
    }

    // Write .env
    const envContent = Object.entries(envData)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');

    fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
    console.log('\n✅ Configuration saved to .env\n');
}

setup().catch(console.error);
