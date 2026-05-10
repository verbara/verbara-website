import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/developer-license/`;

  test(`dev-license narrative: ${url} renders single-column with what-you-get above form`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // The "what you get" aside panel is present
    const aside = page.locator('aside.rounded-lg.border-line-strong');
    await expect(aside).toBeVisible();

    // The form is present
    const form = page.locator('form#devlic-form');
    await expect(form).toBeVisible();

    // Aside must come before form in DOM order
    const asideBox = await aside.boundingBox();
    const formBox = await form.boundingBox();
    expect(asideBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(asideBox!.y).toBeLessThan(formBox!.y);

    // Turnstile widget has dark theme
    const turnstile = page.locator('.cf-turnstile');
    await expect(turnstile).toHaveAttribute('data-theme', 'dark');

    // Required form fields are present
    await expect(page.locator('#devlic-email')).toBeVisible();
    await expect(page.locator('#devlic-fullName')).toBeVisible();
    await expect(page.locator('#devlic-eula')).toBeAttached();
    await expect(page.locator('#devlic-submit')).toBeVisible();
  });
}
