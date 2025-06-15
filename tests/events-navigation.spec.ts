import { test, expect } from '@playwright/test';

test('user can navigate to events page and see list', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', 'user');
  await page.fill('input[name="password"]', 'user123');
  await page.click('button[type="submit"]');

  await page.getByRole('button', { name: /Events/i }).click();
  await expect(page).toHaveURL(/.*\/events/);
  await expect(page.locator('text=Events')).toBeVisible();
});