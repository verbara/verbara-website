import { test, expect } from '@playwright/test';

test('locale switcher: ES → EN preserves route', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-419');

  await page.locator('header a[aria-current="page"]').first().waitFor();
  await page.locator('header a:has-text("EN")').click();
  await page.waitForURL(/\/en-US\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
});

test('locale switcher: EN → PT on pricing preserves route', async ({ page }) => {
  await page.goto('/en-US/pricing/');
  await page.locator('header a:has-text("PT")').click();
  await page.waitForURL(/\/pt-BR\/pricing\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('mobile menu opens on small viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const toggle = page.locator('#nav-mobile-toggle');
  const panel = page.locator('#nav-mobile-panel');

  await expect(toggle).toBeVisible();
  await expect(panel).toBeHidden();

  await toggle.click();
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
