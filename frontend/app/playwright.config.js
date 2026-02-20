/* global process */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: [
        {
            command: 'npm run dev',
            url: 'http://localhost:5173',
            timeout: 120 * 1000,
            reuseExistingServer: !process.env.CI,
        },
        {
            command: 'node ../../lib/server.js', // Legacy server runs on 3000
            url: 'http://localhost:3000',
            timeout: 120 * 1000,
            reuseExistingServer: true,
        }
    ],
});
