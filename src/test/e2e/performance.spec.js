import { test, expect } from '@playwright/test';

// Industry-standard targets: LCP < 2.5s, DOM Content Loaded < 2s (Core Web Vitals–aligned)
const DOM_CONTENT_LOADED_MS = 2000;
const LCP_MS = 2500;

test('performance benchmark', async ({ page }) => {
  const navigateStart = Date.now();
  await page.goto('/');
  const navigateEnd = Date.now();

  await expect(page.getByText('CHERRY OS')).toBeVisible({ timeout: 10000 });

  const performanceTiming = await page.evaluate(() => JSON.stringify(window.performance.timing));
  const timing = JSON.parse(performanceTiming);
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  const domContentLoad = timing.domContentLoadedEventEnd - timing.navigationStart;

  console.log('--- Performance Metrics ---');
  console.log(`Navigation to Render: ${navigateEnd - navigateStart}ms`);
  console.log(`DOM Content Loaded: ${domContentLoad}ms`);
  console.log(`Full Page Load: ${loadTime}ms`);

  expect(domContentLoad).toBeLessThan(DOM_CONTENT_LOADED_MS);

  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry?.startTime ?? 0);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(0), 3500);
    });
  });
  console.log(`LCP (Approx): ${lcp}ms`);
  expect(lcp).toBeLessThan(LCP_MS);
});
