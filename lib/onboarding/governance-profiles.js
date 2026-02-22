const fs = require('fs');
const path = require('path');
const { getSetuPath } = require('./paths');

const PROFILE_PATH = getSetuPath('governance-profile.json');
const OWNERSHIP_POLICY_PATH = getSetuPath('ownership-policy.json');

const PRESETS = {
    'strict': {
        strict_diff: true,
        telemetry_days: 90,
        telemetry_max: 2000,
        ownership_mode: 'enforce',
        ownership_scope: ['src/**', 'lib/**', 'bin/**', 'api/**']
    },
    'balanced': {
        strict_diff: true,
        telemetry_days: 30,
        telemetry_max: 500,
        ownership_mode: 'warn',
        ownership_scope: ['src/**', 'lib/**']
    },
    'legacy': {
        strict_diff: false,
        telemetry_days: 7,
        telemetry_max: 100,
        ownership_mode: 'off',
        ownership_scope: []
    }
};

function getActiveProfile() {
    let profile = 'balanced';
    if (fs.existsSync(PROFILE_PATH)) {
        try {
            const data = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'));
            if (PRESETS[data.profile]) profile = data.profile;
        } catch (e) { }
    }
    return { name: profile, config: PRESETS[profile] };
}

function setProfile(name) {
    if (!PRESETS[name]) {
        throw new Error(`Unknown profile. Choose: ${Object.keys(PRESETS).join(', ')}`);
    }

    if (!fs.existsSync(path.dirname(PROFILE_PATH))) {
        fs.mkdirSync(path.dirname(PROFILE_PATH), { recursive: true });
    }

    fs.writeFileSync(PROFILE_PATH, JSON.stringify({ profile: name }, null, 2));

    // Auto-sync ownership policy to reflect the profile
    const ownershipPolicy = {
        mode: PRESETS[name].ownership_mode,
        require_owner_for_paths: PRESETS[name].ownership_scope
    };
    fs.writeFileSync(OWNERSHIP_POLICY_PATH, JSON.stringify(ownershipPolicy, null, 2));

    return getActiveProfile();
}

module.exports = {
    PRESETS,
    getActiveProfile,
    setProfile
};
