import { test, expect } from '@playwright/test';
import path from 'path';

test('Verify Empty State in TaskBoard', async ({ page }) => {
    // 1. Visit the new dashboard
    await page.goto('http://localhost:5173');

    // 2. Wait for network idle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 3. Take a screenshot
    // Using absolute path or relative to project root properly
    await page.screenshot({ path: path.join(process.cwd(), 'tests/e2e/verification/dashboard-empty-state.png'), fullPage: true });
});
