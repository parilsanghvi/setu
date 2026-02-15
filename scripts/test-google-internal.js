const fs = require('fs');
const path = require('path');
const GoogleProvider = require('../lib/models/providers/google');
const os = require('os');

async function main() {
    const authPath = path.join(os.homedir(), '.setu', 'auth.json');
    if (!fs.existsSync(authPath)) {
        console.error('Auth file not found!');
        return;
    }

    const authData = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    // Find a google oauth profile
    const profileKey = Object.keys(authData.profiles).find(k =>
        authData.profiles[k].provider === 'google' &&
        authData.profiles[k].type === 'oauth'
    );

    if (!profileKey) {
        console.error('No Google OAuth profile found in auth.json');
        return;
    }

    const profile = authData.profiles[profileKey];

    const credsPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
    if (fs.existsSync(credsPath)) {
        console.log('Found oauth_creds.json, using fresh token...');
        const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        profile.access = creds.access_token;
    } else {
        console.warn('oauth_creds.json not found, using cached token from auth.json');
    }

    delete profile.projectId; // Start fresh to force discovery
    console.log(`Using profile: ${profileKey} (forced discovery)`);

    const crypto = require('crypto');
    const { execSync } = require('child_process');

    // Only test the exact match from CLI logs now
    const variations = [
        { model: 'models/gemini-2.0-flash-thinking-exp-1219', project: 'argon-stock-s9hpx' }
    ];

    for (const v of variations) {
        console.log(`Testing model: ${v.model}, project: ${v.project}`);
        const payload = {
            model: v.model,
            project: v.project,
            user_prompt_id: crypto.randomUUID(),
            request: {
                contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
                generationConfig: {
                    candidateCount: 1,
                    thinkingConfig: { thinkingBudget: 512 },
                    responseMimeType: "application/json"
                },
                session_id: crypto.randomUUID()
            }
        };

        // Use exact headers from CLI
        const ua = 'GeminiCLI/0.27.3/gemini-2.5-pro (linux; x64)';

        console.log(`Testing with UA: ${ua}`);

        const curlCmd = `curl -s -X POST "https://cloudcode-pa.googleapis.com/v1internal:generateContent" \\
        -H "Authorization: Bearer ${profile.access}" \\
        -H "Content-Type: application/json" \\
        -H "User-Agent: ${ua}" \\
        -d '${JSON.stringify(payload)}'`;

        try {
            const output = execSync(curlCmd, { encoding: 'utf8', stdio: 'pipe' });
            console.log(`[Project: ${v.project}] Result:`, output.substring(0, 150));
        } catch (e) {
            console.error('Curl failed:', e.message);
        }
    }

    /*
    const provider = new GoogleProvider({
        auth: profile,
        model: 'gemini 3' // Testing the alias
    });

    try {
        console.log('Generating content with "gemini 3"...');
        const result = await provider.generate('You are a helpful assistant.', 'Explain quantum computing in one sentence.');
        console.log('--- RESULT ---');
        console.log(result);
        console.log('--------------');
    } catch (e) {
        console.error('Generation failed:', e);
    }
    */
}

main();
