import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/pricing/`;

  test(`pricing narrative: 7 tiers + 3 group anchors + matrix + 3 faq at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // 3 group anchors — verify structure exists
    await expect(page.locator('#group-free')).toBeAttached();
    await expect(page.locator('#group-self')).toBeAttached();
    await expect(page.locator('#group-managed')).toBeAttached();

    // 7 tier articles: 2 in free, 2 in self, 3 in managed
    const freeArticles = await page.locator('#group-free article').count();
    const selfArticles = await page.locator('#group-self article').count();
    const managedArticles = await page.locator('#group-managed article').count();
    expect(freeArticles).toBe(2);
    expect(selfArticles).toBe(2);
    expect(managedArticles).toBe(3);

    // Comparison matrix table — at minimum 8 column headers in the matrix thead
    const matrixSection = page.locator('section#compare');
    await expect(matrixSection).toBeAttached();
    const matrixHeaderCount = await matrixSection.locator('thead th').count();
    expect(matrixHeaderCount).toBeGreaterThanOrEqual(8); // 1 empty + 7 tier columns

    // Pricing FAQ — exactly 3 toggles
    const pricingFaqButtons = await page.locator('[data-faq-toggle^="pricing-faq"]').count();
    expect(pricingFaqButtons).toBe(3);
  });

  test(`pricing FAQ accordion toggles at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const firstToggle = page.locator('[data-faq-toggle="pricing-faq-1"]');
    const firstPanel = page.locator('#pricing-faq-1-panel');

    await expect(firstPanel).toBeHidden();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');

    await firstToggle.click();

    await expect(firstPanel).toBeVisible();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
  });

  test(`home pricing teaser deep-link group-self resolves on pricing at ${url}`, async ({ page }) => {
    await page.goto(`${prefix}/pricing/#group-self`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#group-self')).toBeAttached();
  });
}
