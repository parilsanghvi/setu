const GoogleAuth = require('../lib/auth/google');
const AuthStore = require('../lib/auth/auth-store');
const crypto = require('crypto');

(async () => {
    // 1. Get Token
    const profiles = AuthStore.findProfilesByProvider('google');
    const profile = profiles.find(p => p.projectId === 'argon-stock-s9hpx') || profiles[0];
    if (!profile) { console.error('No profile'); process.exit(1); }

    console.log(`Using Profile: ${profile.id}`);
    const token = await GoogleAuth.getValidToken(profile.id);

    // 2. Define Variations
    const variations = [
        { name: 'With models/ prefix', model: 'models/gemini-2.5-flash-thinking', project: 'argon-stock-s9hpx' },
        { name: 'Without models/ prefix', model: 'gemini-2.5-flash-thinking', project: 'argon-stock-s9hpx' },
        { name: 'With projects/ prefix', model: 'models/gemini-2.5-flash-thinking', project: 'projects/argon-stock-s9hpx' },
        { name: 'No prefix + projects/', model: 'gemini-2.5-flash-thinking', project: 'projects/argon-stock-s9hpx' }
    ];

    const url = `https://cloudcode-pa.googleapis.com/v1internal:generateContent`;

    for (const v of variations) {
        console.log(`\n--- Testing: ${v.name} ---`);
        console.log(`Model: ${v.model}, Project: ${v.project}`);

        const payload = {
            model: v.model,
            project: v.project,
            user_prompt_id: crypto.randomUUID(),
            request: {
                contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
                generationConfig: { candidateCount: 1 },
                session_id: crypto.randomUUID()
            }
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'antigravity'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log('✅ SUCCESS!');
                const json = await res.json();
                console.log(JSON.stringify(json, null, 2));
                break; // Found it!
            } else {
                console.log(`❌ Failed: ${res.status} ${res.statusText}`);
                const txt = await res.text();
                // console.log(txt); // Only print if needed, it's usually just 404 message
            }
        } catch (e) {
            console.error('❌ Exception:', e.message);
        }
    }
})();
