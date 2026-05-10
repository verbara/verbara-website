import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];
const LEGAL_PAGES = ['eula', 'privacy', 'terms'];

for (const prefix of LOCALE_PREFIXES) {
  for (const page of LEGAL_PAGES) {
    const url = `${prefix}/legal/${page}/`;

    test(`legal narrative: ${url} renders LegalDoc structure`, async ({ page: pw }) => {
      await pw.goto(url, { waitUntil: 'domcontentloaded' });

      // h1 is the LegalDoc title
      await expect(pw.locator('article h1').first()).toBeVisible();

      // legal-doc class is applied to the slot wrapper
      await expect(pw.locator('.legal-doc').first()).toBeAttached();

      // At least one h2 section exists
      const h2Count = await pw.locator('article h2').count();
      expect(h2Count).toBeGreaterThanOrEqual(1);

      // Last-updated metadata is present
      await expect(pw.locator('article header p').first()).toContainText('2026-05-09');
    });
  }
}
