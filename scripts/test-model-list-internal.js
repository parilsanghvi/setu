const GoogleAuth = require('../lib/auth/google');
const AuthStore = require('../lib/auth/auth-store');

async function main() {
    try {
        const profiles = AuthStore.listProfiles();
        const googleProfileId = profiles.find(p => p.startsWith('google-'));
        if (!googleProfileId) {
            console.log('No Google profile found.');
            return;
        }

        const token = await GoogleAuth.getValidToken(googleProfileId);
        const projectId = await GoogleAuth._fetchProjectId(token);
        console.log('Got token and project:', projectId);

        console.log('Attempting to list models via v1internal:fetchAvailableModels...');
        const res = await fetch('https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Goog-Api-Client': 'google-cloud-sdk vscode_cloudshelleditor/0.1'
            },
            body: JSON.stringify({ project: projectId })
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Success!');
            console.log(JSON.stringify(data, null, 2));
            if (data.models) {
                console.log('\nAvailable Models:');
                Object.keys(data.models).forEach(id => console.log(`- ${id}`));
            }
        } else {
            console.log('Failed:', res.status, await res.text());
        }

    } catch (e) {
        console.error(e);
    }
}

main();
