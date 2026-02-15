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
        console.log('Got token.');

        console.log('Attempting to list models via generativelanguage API...');
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Success!');
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log('Failed:', res.status, await res.text());
        }

    } catch (e) {
        console.error(e);
    }
}

main();
