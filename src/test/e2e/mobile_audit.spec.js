import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13 Pro'] });

test('capture mobile dashboard screenshot', async ({ page }) => {
  await page.goto('http://localhost:5173/CherryOS/');
  // Wait for lock screen and unlock
  await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
  await page.click('body');
  // Wait for desktop icons
  await expect(page.getByText('Terminal')).toBeVisible();
  // Wait for animations
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'mobile-dashboard-audit.png' });
  console.log('Mobile screenshot saved to mobile-dashboard-audit.png');
});
