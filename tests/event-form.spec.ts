import { test, expect } from '@playwright/test';

test('Add Event form validation', async ({ page }) => {
  await page.goto('/events/add');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('text=Please fill in all required fields')).toBeVisible();
});