import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/`;

  test(`home narrative: all sections render at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Hero — eyebrow badge text is locale-independent
    await expect(page.locator('text=MIT SDK · Apache Platform · 0 vulns')).toBeVisible();

    // Hero — single H1 visible
    await expect(page.locator('h1').first()).toBeVisible();

    // Solutions overview (Phase F replaces CC anti-pos)
    const solutionsSection = page.locator('[data-section="solutions-overview"]');
    await expect(solutionsSection).toBeVisible();
    const spokeCards = solutionsSection.locator('[data-spoke]');
    await expect(spokeCards).toHaveCount(4);
    for (const slug of ['cc', 'voiceai', 'omnichannel', 'cpaas']) {
      await expect(solutionsSection.locator(`[data-spoke="${slug}"]`)).toBeVisible();
    }

    // ArchitectureDiagram — accessible SVG with title
    await expect(page.locator('svg[role="img"][aria-labelledby*="archdiag"]')).toBeVisible();

    // CodeProof — code block with filename Program.cs
    await expect(page.locator('text=Program.cs').first()).toBeVisible();

    // PricingTeaser — 3 deep-link anchors
    const teaserLinks = await page.locator('a[href*="#group-"]').count();
    expect(teaserLinks).toBeGreaterThanOrEqual(3);

    // Faq — 6 toggle buttons
    const faqButtons = await page.locator('[data-faq-toggle]').count();
    expect(faqButtons).toBe(6);

    // FinalCta — closing CTA links to developer-license
    const finalCta = page.locator('section').last().locator('a[href*="developer-license"]');
    await expect(finalCta).toBeVisible();
  });

  test(`home narrative: solutions cards link to spokes at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const expectedHrefs: Record<string, string> = {
      cc:           `${prefix}/use-cases/contact-center/`,
      voiceai:      `${prefix}/use-cases/voice-ai/`,
      omnichannel:  `${prefix}/use-cases/omnichannel/`,
      cpaas:        `${prefix}/use-cases/cpaas/`,
    };

    for (const [slug, expectedHref] of Object.entries(expectedHrefs)) {
      const cta = page.locator(`[data-spoke-cta="${slug}"]`);
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', expectedHref);
    }
  });

  test(`home narrative: FAQ accordion toggles at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const firstToggle = page.locator('[data-faq-toggle="faq-1"]');
    const firstPanel = page.locator('#faq-1-panel');

    await expect(firstPanel).toBeHidden();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');

    await firstToggle.click();

    await expect(firstPanel).toBeVisible();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');

    await firstToggle.click();

    await expect(firstPanel).toBeHidden();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
  });
}
