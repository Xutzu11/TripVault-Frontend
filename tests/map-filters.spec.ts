import { test, expect } from '@playwright/test';

test('user can interact with map filters', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', 'user');
  await page.fill('input[name="password"]', 'user123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*\/map/);

  await page.getByRole('slider', { name: /Minimum Rating/i }).press('ArrowRight');
  await page.getByRole('button', { name: /Search route/i }).click();
  await expect(page).toHaveURL(/.*\/map/);
});