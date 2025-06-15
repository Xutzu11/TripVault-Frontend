import { test, expect } from '@playwright/test';

test('admin can add a new attraction', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.goto('http://localhost:3000/attractions/add');
  await page.fill('input[name="name"]', 'Test Attraction');
  await page.fill('input[name="theme"]', 'Adventure');
  await page.fill('input[name="revenue"]', '12345');
  await page.selectOption('select[name="state"]', '1');
  await page.selectOption('select[name="city_id"]', '1');

  await page.click('button:has-text("Add")');
  await expect(page).toHaveURL(/.*\/attractions/);
});