const GoogleAuth = require('../lib/auth/google');
const AuthStore = require('../lib/auth/auth-store');

async function main() {
    try {
        const googleProfileId = AuthStore.listProfiles().find(p => p.startsWith('google-'));
        if (!googleProfileId) return;

        const token = await GoogleAuth.getValidToken(googleProfileId);

        console.log('Attempting to list models with EMPTY body and Antigravity headers...');
        const res = await fetch('https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'antigravity',
                'X-Goog-Api-Client': 'google-cloud-sdk vscode_cloudshelleditor/0.1'
            },
            body: JSON.stringify({})
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Success (Empty Body)!');
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log('Failed (Empty Body):', res.status, await res.text());
        }

    } catch (e) {
        console.error(e);
    }
}

main();
