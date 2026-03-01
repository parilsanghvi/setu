import { test, expect } from '@playwright/test';

test('Focus Management: Modal trap and restore', async ({ page }) => {
    // Authenticate (DASHBOARD_PASS=test)
    await page.context().setHTTPCredentials({
        username: 'admin',
        password: 'test'
    });

    // 1. Visit the dashboard
    await page.goto('http://localhost:5173');

    // 2. Create a new task to ensure one exists
    const input = page.getByPlaceholder('New Task...');
    await input.fill('Test Focus Trap');

    // Press Enter or click Add
    const addButton = page.getByRole('button', { name: 'Add new task' });
    await addButton.click();

    // 3. Wait for the task to appear (socket update)
    // The task button has aria-label="View details for task: Test Focus Trap"
    const taskButton = page.getByRole('button', { name: 'View details for task: Test Focus Trap' });
    await expect(taskButton).toBeVisible({ timeout: 10000 });

    // Focus the button first (simulating keyboard navigation)
    await taskButton.focus();
    await expect(taskButton).toBeFocused();

    // 4. Open Modal
    await taskButton.click();

    // Verify Modal is open
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Verify focus is inside modal
    // Modal.jsx focuses the dialog div itself
    await expect(modal).toBeFocused();

    // 5. Close the modal via Escape
    await page.keyboard.press('Escape');

    // Verify Modal is closed
    await expect(modal).not.toBeVisible();

    // 6. Verify focus is restored to the task button
    await expect(taskButton).toBeFocused();
});
