import { test, expect } from '@playwright/test';

test.describe('CherryOS Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display boot screen and then lock screen', async ({ page }) => {
    // Check for boot screen text (BOOT_LOADER)
    await expect(page.getByText('BOOT_LOADER')).toBeVisible();
    
    // Wait for the boot progress to complete and show lock screen
    // The boot progress takes about 1-2 seconds based on App.jsx random logic
    await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('TOUCH TO INITIALIZE')).toBeVisible();
  });

  test('should unlock to desktop after clicking lock screen', async ({ page }) => {
    // Wait for lock screen
    await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
    
    // Click anywhere to unlock
    await page.click('body');
    
    // Check for desktop elements (e.g., Terminal icon)
    await expect(page.getByText('Terminal')).toBeVisible();
    await expect(page.getByText('My Songs')).toBeVisible();
  });

  test('should open terminal when clicking terminal icon', async ({ page }) => {
    await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });
    await page.click('body');
    
    // Open terminal
    await page.click('text=Terminal');
    
    // Check if terminal window is visible
    await expect(page.getByText('GUEST@CHERRY-OS:~$')).toBeVisible();
  });
});
