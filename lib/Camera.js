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

        // If relatedFile is provided, mirror its directory structure
        if (relatedFile) {
            // Remove leading slashes/dots for safety
            const safePath = relatedFile.replace(/^(\.\.(\/|\\|$))+/, '');
            const fileDir = path.dirname(safePath);
            // We use the file name as a folder too, to keep multiple snaps for one file together? 
            // Or just the dir? Let's do: [taskId]/[path_to_file_dir]/[filename_of_code_file]/[stepName].png
            // Actually, usually we want: [taskId]/frontend/src/components/Header/[stepName].png

            // Let's just append the relatedFile path (including extension) as a folder
            // So if relatedFile is 'frontend/App.js', checks go into '.../frontend/App.js/snap.png'
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
        if (relatedFile) {
            const safePath = relatedFile.replace(/^(\.\.(\/|\\|$))+/, '');
            relativeUrl += `${safePath}/`;
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
