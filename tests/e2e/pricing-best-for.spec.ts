import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/pricing/`;

  test(`pricing best-for: tier cards show Mejor para line at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Each TierCard has data-tier="..."; expect 7 cards each rendering best-for line.
    const tierCards = page.locator('[data-tier]');
    const count = await tierCards.count();
    expect(count).toBeGreaterThanOrEqual(7);

    // At least one tier card contains the localized 'Mejor para' / 'Best for' / 'Melhor para' label.
    const label = prefix === '/en-US' ? 'Best for' : prefix === '/pt-BR' ? 'Melhor para' : 'Mejor para';
    await expect(page.locator(`text=${label}`).first()).toBeVisible();
  });

  test(`pricing best-for: comparison matrix has Mejor para row at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const label = prefix === '/en-US' ? 'Best for' : prefix === '/pt-BR' ? 'Melhor para' : 'Mejor para';
    const matrixSection = page.locator('section').filter({ hasText: label }).last();
    await expect(matrixSection).toBeVisible();

    // The 'Mejor para' row appears as a <th scope="row"> in the matrix.
    const matrixRowHeader = page.locator(`th[scope="row"]`).filter({ hasText: label });
    await expect(matrixRowHeader).toBeVisible();
  });
}
