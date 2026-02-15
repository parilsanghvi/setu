const GoogleProvider = require('../lib/models/providers/google');
const Config = require('../lib/Config');
const GoogleAuth = require('../lib/auth/google');
const AuthStore = require('../lib/auth/auth-store');

(async () => {
    console.log('📋 Fetching available models for argon-stock-s9hpx...');
    try {
        console.log('1. Finding Google Profiles...');
        const googleProfiles = AuthStore.findProfilesByProvider('google');
        console.log(`2. Found ${googleProfiles.length} profiles.`);

        // Filter for the new project if possible, or just log all
        googleProfiles.forEach(p => console.log(`   - ${p.id} (${p.projectId})`));

        // Prefer argon-stock-s9hpx if available
        let profile = googleProfiles.find(p => p.projectId === 'argon-stock-s9hpx') || googleProfiles[0];

        if (!profile) {
            console.error('❌ No Google profile found in AuthStore.');
            process.exit(1);
        }

        console.log(`3. Using Profile ID: ${profile.id} (Project: ${profile.projectId})`);

        console.log('4. Getting Valid Token...');
        const token = await GoogleAuth.getValidToken(profile.id);
        console.log('5. Token acquired (prefix):', token.substring(0, 10) + '...');

        console.log('6. Calling fetchModels...');
        const models = await GoogleProvider.fetchModels(token);
        console.log('✅ Available Models:', models);

    } catch (e) {
        console.error('❌ Failed to list models:', e);
    }
})();
