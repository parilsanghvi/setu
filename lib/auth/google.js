const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const AuthStore = require('./auth-store');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:51121/oauth-callback";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CODE_ASSIST_ENDPOINT = "https://cloudcode-pa.googleapis.com";
const DEFAULT_PROJECT_ID = "rising-fact-p41fc"; // Fallback project ID

const SCOPES = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/cclog",
    "https://www.googleapis.com/auth/experimentsandconfigs"
];

function generatePkce() {
    const verifier = crypto.randomBytes(32).toString("hex");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    return { verifier, challenge };
}

function openUrl(url) {
    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    exec(`${start} "${url}"`);
}

class GoogleAuth {
    constructor() {
        this.port = 51121;
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
        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
        }

        const { verifier, challenge } = generatePkce();
        const state = crypto.randomBytes(16).toString("hex");

        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            response_type: "code",
            redirect_uri: REDIRECT_URI,
            scope: SCOPES.join(" "),
            code_challenge: challenge,
            code_challenge_method: "S256",
            state: state,
            access_type: "offline",
            prompt: "consent"
        });

        const authUrl = `${AUTH_URL}?${params.toString()}`;

        console.log(`\n[GoogleAuth] Opening browser for authentication...`);
        console.log(`URL: ${authUrl}\n`);

        try {
            openUrl(authUrl);
        } catch (e) {
            console.log("Could not open browser automatically. Please copy and paste the URL above.");
        }

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
                        res.writeHead(400, { 'Content-Type': 'text/html' });
                        res.end(`<h1>Authentication failed</h1><p>${error}</p>`);
                        server.close();
                        reject(new Error(`OAuth failed: ${error}`));
                        return;
                    }

                    if (!code || returnedState !== state) {
                        res.writeHead(400, { 'Content-Type': 'text/html' });
                        res.end("<h1>Invalid request or state mismatch.</h1>");
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

            server.listen(this.port, () => {
                console.log(`[GoogleAuth] Listening on port ${this.port}...`);
            });
        });
    }

    async _exchangeCode(code, verifier) {
        const body = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: REDIRECT_URI,
            code_verifier: verifier
        });

        const res = await fetch(TOKEN_URL, {
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
            console.warn("[GoogleAuth] Failed to fetch user email:", e);
        }
        return null;
    }

    async _fetchProjectId(accessToken) {
        // Try discovery logic similar to OpenClaw
        const endpoints = [
            "https://cloudcode-pa.googleapis.com",
            "https://daily-cloudcode-pa.sandbox.googleapis.com"
        ];

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

                if (res.ok) {
                    const data = await res.json();
                    if (data.cloudaicompanionProject) {
                        if (typeof data.cloudaicompanionProject === 'string') {
                            return data.cloudaicompanionProject;
                        }
                        if (data.cloudaicompanionProject.id) {
                            return data.cloudaicompanionProject.id;
                        }
                    }
                }
            } catch (e) {
                // Continue to next endpoint or fallback
            }
        }

        console.warn(`[GoogleAuth] Could not discover project ID, using default: ${DEFAULT_PROJECT_ID}`);
        return DEFAULT_PROJECT_ID;
    }

    async refreshToken(refreshToken) {
        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
        }

        const body = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
        });

        const res = await fetch(TOKEN_URL, {
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

        console.log(`[GoogleAuth] Token for ${profileId} expired (or close), refreshing...`);

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
            console.log(`[GoogleAuth] Token refreshed successfully.`);

            return data.access_token;
        } catch (e) {
            console.error(`[GoogleAuth] Failed to refresh token for ${profileId}:`, e.message);
            throw e; // Let caller handle re-login requirement
        }
    }
}

module.exports = new GoogleAuth();
