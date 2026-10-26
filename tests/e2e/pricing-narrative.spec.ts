import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/pricing/`;

  test(`pricing narrative: 5 licence tiers + 2 support plans + 3 group anchors + matrix + 3 faq at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // 3 group anchors — verify structure exists
    await expect(page.locator('#group-free')).toBeAttached();
    await expect(page.locator('#group-self')).toBeAttached();
    await expect(page.locator('#group-support')).toBeAttached();
    await expect(page.locator('#group-managed')).toHaveCount(0);

    // 7 pricing articles: 2 in free, 3 in self, 2 support plans. Verbara is
    // self-hosted software only: the hosted SaaS tiers (Tier 3, Tier 4) are gone and
    // Tier 5 is a self-hosted white-label licence (PDR-0003 §A).
    const freeArticles = await page.locator('#group-free article').count();
    const selfArticles = await page.locator('#group-self article').count();
    const supportArticles = await page.locator('#group-support article').count();
    expect(freeArticles).toBe(2);
    expect(selfArticles).toBe(3);
    expect(supportArticles).toBe(2);
    await expect(page.locator('#group-support [data-tier="support_business"]')).toHaveCount(1);
    await expect(page.locator('#group-support [data-tier="support_enterprise"]')).toHaveCount(1);
    await expect(page.locator('[data-tier="tier_3"], [data-tier="tier_4"]')).toHaveCount(0);

    // Comparison matrix table — licence tiers only: 1 empty + 5 tier columns
    const matrixSection = page.locator('section#compare');
    await expect(matrixSection).toBeAttached();
    const matrixHeaderCount = await matrixSection.locator('thead th').count();
    expect(matrixHeaderCount).toBe(6);

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

  test(`home pricing teaser deep-link group-support resolves on pricing at ${url}`, async ({ page }) => {
    await page.goto(`${prefix}/pricing/#group-support`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#group-support')).toBeAttached();
  });
}
