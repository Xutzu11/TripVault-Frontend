import { test, expect } from '@playwright/test';

test('Navbar contains key pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Map')).toBeVisible();
  await expect(page.locator('text=Attractions')).toBeVisible();
  await expect(page.locator('text=Events')).toBeVisible();
});