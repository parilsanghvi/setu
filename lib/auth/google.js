const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');
const AuthStore = require('./auth-store');
const Config = require('../Config');
const Logger = require('../Logger');
const { generatePkce } = require('../utils/pkce');

const REDIRECT_URI = Config.googleRedirectUri;
const AUTH_URL = Config.googleAuthUrl;
const TOKEN_URL = Config.googleTokenUrl;
const CODE_ASSIST_ENDPOINT = Config.googleCodeAssistUrl || "https://cloudcode-pa.googleapis.com";
const SCOPES = Config.googleScopes;

function openUrl(url) {
    let command;
    let args = [url];

    if (process.platform === 'darwin') {
        command = 'open';
    } else if (process.platform === 'win32') {
        command = 'explorer';
    } else {
        command = 'xdg-open';
    }

    const child = spawn(command, args, {
        detached: true,
        stdio: 'ignore'
    });

    child.unref();
}

class GoogleAuth {
    constructor() {
        this.port = parseInt(process.env.GOOGLE_AUTH_PORT, 10) || 51121;
        this.logger = new Logger('GoogleAuth');
    }

    /**
     * Starts the login flow:
     * 1. Generates PKCE verifier/challenge.
     * 2. Starts a local server to listen for the callback.
     * 3. Opens the browser to the Google OAuth URL.
     * 4. Exchanges the code for tokens.
     * 5. Returns the tokens and user info.
     */
    async login() {
        if (!Config.googleClientId || !Config.googleClientSecret) {
            throw new Error('Google OAuth credentials missing. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
        }

        const { verifier, challenge } = generatePkce();
        const state = crypto.randomBytes(16).toString("hex");

        const params = new URLSearchParams({
            client_id: Config.googleClientId,
            response_type: "code",
            redirect_uri: Config.googleRedirectUri,
            scope: Config.googleScopes.join(" "),
            code_challenge: challenge,
            code_challenge_method: "S256",
            state: state,
            access_type: "offline",
            prompt: "consent"
        });

        const authUrl = `${Config.googleAuthUrl}?${params.toString()}`;

        this.logger.info('Opening browser for authentication...');
        this.logger.info('Authentication URL', { url: authUrl });

        try {
            openUrl(authUrl);
        } catch (e) {
            this.logger.warn("Could not open browser automatically. Please copy and paste the URL manually.");
        }

        return this._waitForCallback(state, verifier);
    }

    _waitForCallback(state, verifier) {
        return new Promise((resolve, reject) => {
            const server = http.createServer(async (req, res) => {
                try {
                    const url = new URL(req.url, `http://localhost:${this.port}`);
                    // Only handle the callback path
                    if (url.pathname !== '/oauth-callback') {
                        res.writeHead(404);
                        res.end();
                        return;
                    }

                    const code = url.searchParams.get("code");
                    const returnedState = url.searchParams.get("state");
                    const error = url.searchParams.get("error");

                    if (error) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(`Authentication failed: ${error}`);
                        server.close();
                        reject(new Error(`OAuth failed: ${error}`));
                        return;
                    }

                    if (!code || returnedState !== state) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Invalid request or state mismatch.");
                        server.close();
                        reject(new Error("OAuth failed: Invalid state or missing code."));
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head><title>Authentication Successful</title></head>
                        <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                            <h1>Authentication successful</h1>
                            <p>You can close this window and return to the terminal.</p>
                        </body>
                        </html>
                    `);

                    server.close();

                    // Exchange code for tokens
                    const tokens = await this._exchangeCode(code, verifier);
                    const email = await this._fetchUserEmail(tokens.access_token);
                    const projectId = await this._fetchProjectId(tokens.access_token);

                    resolve({
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                        expiresIn: tokens.expires_in,
                        email,
                        projectId
                    });

                } catch (e) {
                    // Start server might throw if port is in use, but this is inside the request handler
                    // If exchange fails, we reject
                    reject(e);
                    if (server.listening) server.close();
                }
            });

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    reject(new Error(`Port ${this.port} is already in use. Please free it up and try again.`));
                } else {
                    reject(err);
                }
            });

            server.listen(this.port, '127.0.0.1', () => {
                this.logger.info(`Listening on port ${this.port}...`);
            });
        });
    }

    async _exchangeCode(code, verifier) {
        const body = new URLSearchParams({
            client_id: Config.googleClientId,
            client_secret: Config.googleClientSecret,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: Config.googleRedirectUri,
            code_verifier: verifier
        });

        const res = await fetch(Config.googleTokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Token exchange failed: ${txt}`);
        }

        return await res.json();
    }

    async _fetchUserEmail(accessToken) {
        try {
            const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                return data.email;
            }
        } catch (e) {
            this.logger.warn("Failed to fetch user email", e);
        }
        return null;
    }

    async _fetchProjectId(accessToken) {
        // 1. Explicit Config (Override)
        if (Config.googleProjectId) {
            return Config.googleProjectId;
        }

        // 2. Try discovery logic similar to OpenClaw
        const endpoints = Config.googleCodeAssistEndpoints;

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            // Mimic OpenClaw headers for best compatibility
            "User-Agent": "google-api-nodejs-client/9.15.1",
            "X-Goog-Api-Client": "google-cloud-sdk vscode_cloudshelleditor/0.1",
            "Client-Metadata": JSON.stringify({
                ideType: "IDE_UNSPECIFIED",
                platform: "PLATFORM_UNSPECIFIED",
                pluginType: "GEMINI",
            }),
        };

        for (const endpoint of endpoints) {
            try {
                const res = await fetch(`${endpoint}/v1internal:loadCodeAssist`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        metadata: {
                            ideType: 'IDE_UNSPECIFIED',
                            platform: 'PLATFORM_UNSPECIFIED',
                            pluginType: 'GEMINI'
                        }
                    })
                });

                if (!res.ok) continue;

                const data = await res.json();
                const project = data.cloudaicompanionProject;

                if (!project) continue;

                if (typeof project === 'string') {
                    return project;
                }

                if (project.id) {
                    return project.id;
                }
            } catch (e) {
                // Continue to next endpoint or fallback
            }
        }

        this.logger.warn(`Could not discover project ID, using default: ${Config.googleDefaultProjectId}`);
        return Config.googleDefaultProjectId;
    }

    async refreshToken(refreshToken) {
        if (!Config.googleClientId || !Config.googleClientSecret) {
            throw new Error('Google OAuth credentials missing. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
        }

        const body = new URLSearchParams({
            client_id: Config.googleClientId,
            client_secret: Config.googleClientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        });

        const res = await fetch(Config.googleTokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Token refresh failed: ${txt}`);
        }

        return await res.json();
    }

    /**
     * Gets a valid access token for the given profile ID.
     * Refreshes the token if it's expired or about to expire.
     */
    async getValidToken(profileId) {
        const profile = AuthStore.getProfile(profileId);
        if (!profile) {
            throw new Error(`Profile not found: ${profileId}`);
        }

        if (profile.provider !== 'google') {
            // For other providers (like OpenAI), just return the key/token as is, or handle differently
            // But this method is specific to Google auth usually.
            // If it's an API Key profile, we might just return the key.
            return profile.key || profile.access;
        }

        // Check expiry (buffer of 5 minutes)
        const now = Date.now();
        const buffer = 5 * 60 * 1000;

        if (profile.expiry > now + buffer) {
            return profile.access;
        }

        this.logger.info(`Token for ${profileId} expired (or close), refreshing...`);

        try {
            const data = await this.refreshToken(profile.refresh);

            // Update store
            const newExpiry = Date.now() + (data.expires_in * 1000);
            const updatedProfile = {
                ...profile,
                access: data.access_token,
                expiry: newExpiry,
                updatedAt: Date.now()
            };

            // If we got a new refresh token (sometimes happens), update it too
            if (data.refresh_token) {
                updatedProfile.refresh = data.refresh_token; // Should be 'refresh', matching store structure
            }

            AuthStore.addProfile(profileId, updatedProfile);
            this.logger.info(`Token refreshed successfully.`);

            return data.access_token;
        } catch (e) {
            this.logger.error(`Failed to refresh token for ${profileId}`, e);
            throw e; // Let caller handle re-login requirement
        }
    }
}

module.exports = new GoogleAuth();
