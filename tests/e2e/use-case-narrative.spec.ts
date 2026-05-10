import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

const SPOKES = [
  { slug: 'contact-center', expectedFilename: 'CallCenterHost.cs',       faqCount: 3 },
  { slug: 'voice-ai',       expectedFilename: 'VoiceAgent.cs',           faqCount: 3 },
  { slug: 'omnichannel',    expectedFilename: 'OmnichannelRouter.cs',     faqCount: 3 },
];

for (const prefix of LOCALE_PREFIXES) {
  for (const spoke of SPOKES) {
    const url = `${prefix}/use-cases/${spoke.slug}/`;

    test(`spoke narrative: ${spoke.slug} renders at ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Hero h1 visible
      await expect(page.locator('h1').first()).toBeVisible();

      // Anti-positioning table — 7 rows
      const apRows = page.locator('section table tbody tr');
      const apCount = await apRows.count();
      expect(apCount).toBeGreaterThanOrEqual(7);

      // Code proof — filename
      await expect(page.locator(`text=${spoke.expectedFilename}`).first()).toBeVisible();

      // FAQ — 3 toggles
      const faqButtons = page.locator('[data-faq-toggle]');
      await expect(faqButtons).toHaveCount(spoke.faqCount);

      // Pricing pointer — link to /pricing/
      const pricingLink = page.locator(`a[href$="${prefix}/pricing/"]`).first();
      await expect(pricingLink).toBeVisible();

      // Final CTA — link to developer-license
      await expect(page.locator(`a[href*="developer-license"]`).last()).toBeVisible();
    });
  }
}
