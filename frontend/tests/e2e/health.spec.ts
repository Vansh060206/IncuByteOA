import { test, expect } from '@playwright/test';

test.describe('E2E Landing & Auth redirect checks', () => {
  test('should redirect unauthenticated users visiting root to login screen', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h2')).toContainText('Sign in to your account');
  });
});
