import { test, expect } from '@playwright/test';

test.describe('Mobile functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('boot and lock screen visible on mobile viewport', async ({ page }) => {
    await expect(page.getByText('BOOT_LOADER')).toBeVisible();
    await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('TOUCH TO INITIALIZE')).toBeVisible();
  });

  test('unlock to desktop and see mobile nav', async ({ page }) => {
    await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
    await page.click('body');
    await expect(page.getByText('Terminal')).toBeVisible();
    await expect(page.getByText('Lock')).toBeVisible();
  });

  test('open app from desktop on mobile', async ({ page }) => {
    await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
    await page.click('body');
    await page.click('text=Terminal');
    await expect(page.getByText('GUEST@CHERRY-OS:~$')).toBeVisible({ timeout: 5000 });
  });
});
