import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  test(`nav solutions: desktop dropdown opens and lists 4 spokes + 'all' link at ${prefix}/`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${prefix}/`, { waitUntil: 'domcontentloaded' });

    const toggle = page.locator('#nav-solutions-toggle');
    const panel = page.locator('#nav-solutions-panel');

    await expect(panel).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();

    await expect(panel).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const menuItems = panel.locator('[role="menuitem"]');
    await expect(menuItems).toHaveCount(5); // 4 spokes + "all" link

    // "All solutions" item is the last one and links to /use-cases/.
    const allLink = menuItems.last();
    await expect(allLink).toHaveAttribute('href', `${prefix}/use-cases/`);
  });

  test(`nav solutions: dropdown closes on Escape at ${prefix}/`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${prefix}/`, { waitUntil: 'domcontentloaded' });

    const toggle = page.locator('#nav-solutions-toggle');
    const panel = page.locator('#nav-solutions-panel');

    await toggle.click();
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test(`nav solutions: mobile <details> accordion expands at ${prefix}/`, async ({ page }) => {
    await page.setViewportSize({ width: 380, height: 700 });
    await page.goto(`${prefix}/`, { waitUntil: 'domcontentloaded' });

    // Open the hamburger menu first.
    await page.locator('#nav-mobile-toggle').click();
    await expect(page.locator('#nav-mobile-panel')).toBeVisible();

    const details = page.locator('details[data-mobile-solutions]');
    await expect(details).toBeVisible();

    const summary = details.locator('summary');
    await summary.click();

    // After expanding, the spoke links should be visible inside the details.
    const spokeLinks = details.locator('a').filter({ hasText: /Center|AI|Omnichannel|CPaaS/ });
    expect(await spokeLinks.count()).toBeGreaterThanOrEqual(4);
  });
}
