const { chromium } = require('playwright-core');
const path = require('path');

async function capture(url, outputPath) {
    console.log(`[Drishti-Vision] 📸 Capturing ${url}...`);
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.screenshot({ path: outputPath, fullPage: true });
        console.log(`[Drishti-Vision] ✅ Screenshot saved to ${outputPath}`);
    } catch (e) {
        console.error(`[Drishti-Vision] ❌ Capture failed:`, e.message);
    } finally {
        await browser.close();
    }
}

const args = process.argv.slice(2);
const url = args[0] || 'http://localhost:3000';
const output = args[1] || 'screenshot.png';

capture(url, output);
