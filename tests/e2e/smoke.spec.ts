import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/',                       title: /Verbara/, h1: /.+/ },
  { path: '/pricing/',               title: /Pricing|Precios|Preços|Verbara/, h1: /.+/ },
  { path: '/developer-license/',     title: /Verbara/, h1: /.+/ },
  { path: '/legal/eula/',            title: /Verbara/, h1: /.+/ },
  { path: '/legal/privacy/',         title: /Verbara/, h1: /.+/ },
  { path: '/legal/terms/',           title: /Verbara/, h1: /.+/ },
];

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  for (const page of PAGES) {
    const url = `${prefix}${page.path}`;
    test(`smoke: ${url} renders`, async ({ page: pw }) => {
      const errors: string[] = [];
      pw.on('pageerror', (e) => errors.push(e.message));
      pw.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

      const response = await pw.goto(url, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      await expect(pw).toHaveTitle(page.title);
      await expect(pw.locator('h1').first()).toBeVisible();
      // Use first() to disambiguate between desktop and mobile-panel <nav> elements.
      await expect(pw.locator('header nav').first()).toBeVisible();
      await expect(pw.locator('footer')).toBeVisible();

      expect(errors, `console errors on ${url}: ${errors.join(' | ')}`).toEqual([]);
    });
  }
}
