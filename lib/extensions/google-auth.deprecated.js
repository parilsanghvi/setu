const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Constants from OpenClaw (Antigravity extension)
const DEFAULT_CLIENT_ID = "1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com";
const DEFAULT_CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:51121/oauth-callback";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CODE_ASSIST_ENDPOINT = "https://cloudcode-pa.googleapis.com";

// Constants from Gemini CLI
const GEMINI_CLI_REDIRECT_URI = "http://localhost:8085/oauth2callback";

function generatePkce() {
    const verifier = crypto.randomBytes(32).toString("hex");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    return { verifier, challenge };
}

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

class GoogleAuthExtension {
    constructor() {
        this.port = 51121;
    }

    async login(mode = 'antigravity') {
        let clientId = DEFAULT_CLIENT_ID;
        let clientSecret = DEFAULT_CLIENT_SECRET;
        let redirectUri = REDIRECT_URI;
        let port = 51121;
        let endpoint = '/oauth-callback';

        if (mode === 'gemini-cli') {
            // Attempt to find gemini-cli credentials if needed, but for now fallback to Antigravity as default
            // OpenClaw's gemini-cli logic is complex (scraping node_modules).
            // We'll stick to Antigravity logic first as it's self-contained.
            console.log('[GoogleAuth] Using Antigravity credentials for best compatibility.');
        }

        const { verifier, challenge } = generatePkce();
        const state = crypto.randomBytes(16).toString("hex");

        const params = new URLSearchParams({
            client_id: clientId,
            response_type: "code",
            redirect_uri: redirectUri,
            scope: [
                "https://www.googleapis.com/auth/cloud-platform",
                "https://www.googleapis.com/auth/userinfo.email"
            ].join(" "),
            code_challenge: challenge,
            code_challenge_method: "S256",
            state: state,
            access_type: "offline",
            prompt: "consent"
        });

        const authUrl = `${AUTH_URL}?${params.toString()}`;

        console.log(`\n[GoogleAuth] Opening browser for authentication...`);
        console.log(`URL: ${authUrl}\n`);
        openUrl(authUrl);

        return new Promise((resolve, reject) => {
            const server = http.createServer(async (req, res) => {
                const url = new URL(req.url, `http://localhost:${port}`);
                if (url.pathname !== endpoint) {
                    res.writeHead(404);
                    res.end();
                    return;
                }

                const code = url.searchParams.get("code");
                const returnedState = url.searchParams.get("state");

                if (!code || returnedState !== state) {
                    res.writeHead(400);
                    res.end("Invalid request or state mismatch.");
                    server.close();
                    reject(new Error("OAuth failed: Invalid state or missing code."));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`<h1>Authentication successful</h1><p>You can close this window and return to the terminal.</p>`);

                server.close();

                try {
                    const tokens = await this.exchangeCode(code, verifier, clientId, clientSecret, redirectUri);
                    const email = await this.fetchUserEmail(tokens.access_token);
                    const projectId = await this.fetchProjectId(tokens.access_token);

                    resolve({
                        ...tokens,
                        email,
                        projectId
                    });
                } catch (e) {
                    reject(e);
                }
            });

            server.listen(port, () => {
                console.log(`[GoogleAuth] Listening on port ${port}...`);
            });
        });
    }

    async exchangeCode(code, verifier, clientId, clientSecret, redirectUri) {
        const body = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
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

    async fetchUserEmail(accessToken) {
        const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
            const data = await res.json();
            return data.email;
        }
        return null;
    }

    async fetchProjectId(accessToken) {
        // Discovery logic similar to OpenClaw
        // Try to load Cloud Code Assist project
        try {
            const res = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:loadCodeAssist`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    metadata: {
                        pluginType: 'GEMINI'
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.cloudaicompanionProject?.id) {
                    return data.cloudaicompanionProject.id;
                }
            }
        } catch (e) {
            console.warn('[GoogleAuth] Project discovery failed:', e.message);
        }
        return "rising-fact-p41fc"; // Fallback from OpenClaw source
    }
}

module.exports = new GoogleAuthExtension();
