import { test, expect } from '@playwright/test';

test('verify routing and watchlist overhaul', async ({ page }) => {
  await page.goto('http://localhost:5173/CherryOS/');
  
  // Wait for lock screen and unlock
  await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
  await page.click('body');
  
  // Verify Desktop icons
  await expect(page.getByText('Watch Log')).toBeVisible();
  
  // Navigate to Watch Log via route
  await page.click('text=Watch Log');
  await expect(page).toHaveURL(/.*\/watch/);
  
  // Verify Watchlist Header
  await expect(page.getByText('Watch List', { exact: true })).toBeVisible();
  
  // Verify redsign: check for one of the titles from ANIME_DATA
  await expect(page.getByText('Berserk')).toBeVisible();
  
  // Verify "Back to Desktop"
  await page.click('aria-label=Back to Desktop');
  await expect(page).toHaveURL(/.*\/CherryOS\//);
});
