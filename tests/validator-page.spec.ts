import { test, expect } from '@playwright/test';

test('Validator page loads and shows scanner', async ({ page }) => {
  await page.goto('/validate');
  await expect(page.locator('#qr-reader')).toBeVisible();
  await expect(page.locator('text=No ticket identified')).toBeVisible();
});