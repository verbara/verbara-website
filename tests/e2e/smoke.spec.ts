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

// Cloudflare Turnstile fails domain validation on localhost (the dev/CI host
// doesn't match the production Turnstile site-key allowlist), emitting a
// 400020 error + "Failed to load resource" log on the developer-license page.
// These are not application bugs — the widget still functions on verbara.io.
// Filter them out of the smoke-test "no console errors" assertion.
function isThirdPartyTurnstileNoise(text: string, locationUrl: string | undefined): boolean {
  if (text.includes('Turnstile') || text.includes('400020')) return true;
  if (locationUrl && locationUrl.includes('challenges.cloudflare.com')) return true;
  // The "Failed to load resource" log preceding the Turnstile error has no
  // useful location attribution; tie it to the Turnstile context by keyword.
  if (text.includes('Failed to load resource') && text.includes('400 (Bad Request)')) return true;
  return false;
}

for (const prefix of LOCALE_PREFIXES) {
  for (const page of PAGES) {
    const url = `${prefix}${page.path}`;
    test(`smoke: ${url} renders`, async ({ page: pw }) => {
      const errors: string[] = [];
      pw.on('pageerror', (e) => errors.push(e.message));
      pw.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const text = msg.text();
        const locationUrl = msg.location()?.url;
        if (isThirdPartyTurnstileNoise(text, locationUrl)) return;
        errors.push(text);
      });

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
