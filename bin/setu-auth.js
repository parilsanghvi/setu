#!/usr/bin/env node

const { Select, Input } = require('enquirer');
const AuthStore = require('../lib/auth/auth-store');
const GoogleAuth = require('../lib/auth/google');

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        await showMenu();
        return;
    }

    switch (command) {
        case 'login':
            await handleLogin(args[1]);
            break;
        case 'list':
            listProfiles();
            break;
        case 'logout':
            await handleLogout(args[1]);
            break;
        default:
            console.log(`Unknown command: ${command}`);
            console.log('Usage: setu-auth [login|list|logout]');
            break;
    }
}

async function showMenu() {
    const prompt = new Select({
        name: 'action',
        message: 'Setu Auth Manager',
        choices: [
            'Login to Provider',
            'List Active Profiles',
            'Logout / Remove Profile',
            'Exit'
        ]
    });

    const answer = await prompt.run();

    if (answer === 'Login to Provider') {
        await handleLogin();
    } else if (answer === 'List Active Profiles') {
        listProfiles();
    } else if (answer === 'Logout / Remove Profile') {
        await handleLogout();
    }
}

async function handleLogin(providerArg) {
    let provider = providerArg;

    if (!provider) {
        const prompt = new Select({
            name: 'provider',
            message: 'Select Provider',
            choices: ['google', 'openai', 'anthropic', 'ollama']
        });
        provider = await prompt.run();
    }

    if (provider === 'google') {
        console.log(`Starting Google OAuth flow (Antigravity)...`);
        try {
            const tokens = await GoogleAuth.login();
            // Save to AuthStore
            const profileId = `google-${tokens.projectId || 'default'}`;
            AuthStore.addProfile(profileId, {
                provider: 'google',
                type: 'oauth',
                access: tokens.accessToken,
                refresh: tokens.refreshToken,
                expiry: Date.now() + (tokens.expiresIn * 1000),
                email: tokens.email,
                projectId: tokens.projectId,
                mode: 'antigravity'
            });
            console.log(`✅ Successfully logged in as ${tokens.email} (Project: ${tokens.projectId})`);
        } catch (e) {
            console.error('❌ Login failed:', e.message);
        }
    } else {
        // Generic API Key input
        const prompt = new Input({
            message: `Enter your ${provider} API Key:`
        });
        const key = await prompt.run();

        if (key) {
            const profileId = `${provider}-default`; // Simple default profile for now
            AuthStore.addProfile(profileId, {
                provider: provider,
                type: 'api_key',
                key: key.trim()
            });
            console.log(`✅ Saved API Key for ${provider}`);
        }
    }
}

function listProfiles() {
    const profiles = AuthStore.listProfiles();
    if (profiles.length === 0) {
        console.log('No active profiles found.');
        return;
    }

    console.log('\nActive Profiles:');
    profiles.forEach(id => {
        const p = AuthStore.getProfile(id);
        if (p.type === 'oauth') {
            console.log(`- [${p.provider}] ${id} (${p.email})`);
        } else {
            console.log(`- [${p.provider}] ${id} (API Key)`);
        }
    });
    console.log('');
}

async function handleLogout(profileArg) {
    let profileId = profileArg;
    if (!profileId) {
        const profiles = AuthStore.listProfiles();
        if (profiles.length === 0) {
            console.log('No profiles to remove.');
            return;
        }

        const prompt = new Select({
            name: 'profile',
            message: 'Select Profile to Remove',
            choices: [...profiles, 'Cancel']
        });
        profileId = await prompt.run();
    }

    if (profileId && profileId !== 'Cancel') {
        AuthStore.removeProfile(profileId);
        console.log(`🗑️ Removed profile: ${profileId}`);
    }
}

main().catch(console.error);
