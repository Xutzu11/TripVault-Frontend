import { test, expect } from '@playwright/test';

test('Add Attraction form renders properly', async ({ page }) => {
  await page.goto('/attractions/add');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Theme')).toBeVisible();
});