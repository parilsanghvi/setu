const fs = require('fs');
const path = require('path');
const os = require('os');

class AuthStore {
    constructor() {
        this.storePath = path.join(os.homedir(), '.setu', 'auth.json');
        this.ensureStore();
    }

    ensureStore() {
        const dir = path.dirname(this.storePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.storePath)) {
            this.save({});
        }
    }

    load() {
        try {
            const data = fs.readFileSync(this.storePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('[AuthStore] Failed to load auth store:', error.message);
            return {};
        }
    }

    save(data) {
        try {
            fs.writeFileSync(this.storePath, JSON.stringify(data, null, 2), { mode: 0o600 });
        } catch (error) {
            console.error('[AuthStore] Failed to save auth store:', error.message);
        }
    }

    getProfile(profileId) {
        const data = this.load();
        return data.profiles ? data.profiles[profileId] : null;
    }

    listProfiles() {
        const data = this.load();
        return data.profiles ? Object.keys(data.profiles) : [];
    }

    addProfile(profileId, credential) {
        const data = this.load();
        if (!data.profiles) data.profiles = {};

        data.profiles[profileId] = {
            ...credential,
            updatedAt: Date.now()
        };

        this.save(data);
        return profileId;
    }

    removeProfile(profileId) {
        const data = this.load();
        if (data.profiles && data.profiles[profileId]) {
            delete data.profiles[profileId];
            this.save(data);
            return true;
        }
        return false;
    }

    // Helper to find profiles by provider
    findProfilesByProvider(provider) {
        const data = this.load();
        if (!data.profiles) return [];

        return Object.entries(data.profiles)
            .filter(([_, cred]) => cred.provider === provider)
            .map(([id, cred]) => ({ id, ...cred }));
    }
}

module.exports = new AuthStore();
