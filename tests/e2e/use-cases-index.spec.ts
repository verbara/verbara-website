import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/use-cases/`;

  test(`use-cases index: renders + 4 cards link to spokes at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1').first()).toBeVisible();

    const grid = page.locator('[data-usecases-grid]');
    await expect(grid).toBeVisible();

    const cards = grid.locator('[data-spoke-card]');
    await expect(cards).toHaveCount(4);

    const expectedHrefs: Record<string, string> = {
      cc:           `${prefix}/use-cases/contact-center/`,
      voiceai:      `${prefix}/use-cases/voice-ai/`,
      omnichannel:  `${prefix}/use-cases/omnichannel/`,
      cpaas:        `${prefix}/use-cases/cpaas/`,
    };

    for (const [slug, expectedHref] of Object.entries(expectedHrefs)) {
      const card = grid.locator(`[data-spoke-card="${slug}"]`);
      await expect(card).toBeVisible();
      const cta = card.locator(`[data-spoke-cta="${slug}"]`);
      await expect(cta).toHaveAttribute('href', expectedHref);
    }
  });
}
