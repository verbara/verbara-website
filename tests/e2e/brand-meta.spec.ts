import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/`;

  test(`brand meta on ${url}: favicons + og:image + twitter card + canonical`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Favicon set
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg');
    await expect(page.locator('link[rel="alternate icon"][type="image/x-icon"]')).toHaveAttribute('href', '/favicon.ico');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
    await expect(page.locator('link[rel="icon"][sizes="192x192"]')).toHaveAttribute('href', '/icon-192.png');
    await expect(page.locator('link[rel="icon"][sizes="512x512"]')).toHaveAttribute('href', '/icon-512.png');

    // OG image
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://verbara.io/og/og-default.png');
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Verbara');

    // Twitter card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://verbara.io/og/og-default.png');

    // Sitemap link in head
    await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute('href', '/sitemap-index.xml');

    // Canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toBeAttached();
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toMatch(/^https:\/\/verbara\.io/);
  });
}

test('brand assets: favicon.ico is served', async ({ request }) => {
  const r = await request.get('/favicon.ico');
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toMatch(/icon|x-icon|octet-stream/);
});

test('brand assets: og-default.png is served', async ({ request }) => {
  const r = await request.get('/og/og-default.png');
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toMatch(/png/);
});

test('brand assets: sitemap-index.xml is served', async ({ request }) => {
  const r = await request.get('/sitemap-index.xml');
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toMatch(/xml/);
});

test('brand assets: robots.txt is served and references sitemap', async ({ request }) => {
  const r = await request.get('/robots.txt');
  expect(r.status()).toBe(200);
  const text = await r.text();
  expect(text).toMatch(/Sitemap:\s*https:\/\/verbara\.io\/sitemap-index\.xml/);
});
