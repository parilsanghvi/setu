console.log('Start of script');
const AuthStore = require('../lib/auth/auth-store');
console.log('AuthStore required');
const GoogleAuth = require('../lib/auth/google');
console.log('GoogleAuth required');

(async () => {
    console.log('Testing AuthStore...');
    try {
        const profiles = AuthStore.findProfilesByProvider('google');
        console.log('Profiles:', profiles);

        if (profiles.length > 0) {
            console.log('Testing getValidToken for first profile...');
            const token = await GoogleAuth.getValidToken(profiles[0].id);
            console.log('Token acquired:', token.substring(0, 10) + '...');
        }
    } catch (e) {
        console.error('Error:', e);
    }
})();
