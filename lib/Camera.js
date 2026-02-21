const playwright = require('playwright-core');
const path = require('path');
const fs = require('fs');
const Config = require('./Config');

class Camera {
    constructor() {
        this.browser = null;
        this.screenshotsDir = path.join(__dirname, '../frontend/dashboard/screenshots');
        this.ensureDir(this.screenshotsDir);
    }

    ensureDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    async init() {
        if (this.browser) return;

        // Find system chrome/chromium or use downloaded one
        // For now, assuming playwright-core usage requires a browser path or we use 'chromium' if installed
        // Since we are in a dev environment, we attempt to launch. 
        // If executablePath is needed, Config should provide it.
        try {
            this.browser = await playwright.chromium.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            console.log('[Camera] 📸 Ready to snap.');
        } catch (e) {
            console.error('[Camera] ❌ Failed to launch browser:', e.message);
        }
    }

    /**
     * Captures a screenshot of a URL
     * @param {string} taskId - ID of the task (for grouping)
     * @param {string} url - URL to visit
     * @param {string} stepName - Name of the step (e.g. 'homepage')
     * @param {string} [relatedFile] - Optional: path to the file this screenshot verifies (e.g. 'frontend/src/App.js')
     */
    async snap(taskId, url, stepName = 'snap', relatedFile = null) {
        if (!this.browser) await this.init();
        if (!this.browser) return null;

        let taskDir = path.join(this.screenshotsDir, taskId);

        let relativeDir = '';
        // If relatedFile is provided, mirror its directory structure
        if (relatedFile) {
            // Sanitize relatedFile to prevent path traversal
            // Normalize path first to resolve .. sequences
            let safePath = path.normalize(relatedFile);

            // Remove leading .. or / or \ to ensure it stays within root
            // This handles cases like 'subdir/../../etc/passwd' -> '../etc/passwd' -> 'etc/passwd'
            safePath = safePath.replace(/^(\.\.(\/|\\|$))+/, '');
            safePath = safePath.replace(/^(\/|\\)+/, '');

            if (safePath.includes('..')) {
                 console.warn(`[Camera] Warning: suspicious relatedFile path "${relatedFile}". Using basename only.`);
                 safePath = path.basename(relatedFile);
            }

            relativeDir = safePath;
            taskDir = path.join(taskDir, safePath);
        }

        this.ensureDir(taskDir);

        const filename = `${stepName}-${Date.now()}.png`;
        const filepath = path.join(taskDir, filename);

        // Construct relative path for the frontend
        // We need to know what part of taskDir is relative to the dashboard root?
        // taskDir is .../dashboard/screenshots/[taskId]/[safePath]
        // We want /screenshots/[taskId]/[safePath]/[filename]

        let relativeUrl = `/screenshots/${taskId}/`;
        if (relativeDir) {
            // Ensure forward slashes for URL
            const urlPath = relativeDir.split(path.sep).join('/');
            relativeUrl += `${urlPath}/`;
        }
        relativeUrl += filename;

        let page = null;
        try {
            const context = await this.browser.newContext({ viewport: { width: 1280, height: 720 } });
            page = await context.newPage();

            console.log(`[Camera] Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

            await page.screenshot({ path: filepath });
            console.log(`[Camera] 🖼️ Saved to ${filepath}`);

            await page.close();
            await context.close();

            return relativeUrl;
        } catch (e) {
            console.error(`[Camera] ❌ Failed to snap ${url}:`, e.message);
            if (page) await page.close().catch(() => { });
            return null;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = new Camera();
