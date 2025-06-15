import { test, expect } from '@playwright/test';

test('simulate QR ticket validation', async ({ page }) => {
  await page.goto('http://localhost:3000/validate');

  await page.evaluate(() => {
    const event = new CustomEvent('mock-qr-scan', { detail: 'ticket-abc123' });
    window.dispatchEvent(event);
  });

  await expect(page.locator('text=ticket-abc123')).toBeVisible();
  await page.getByRole('button', { name: /Validate/i }).click();
});