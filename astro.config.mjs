// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
//
// Phase 0 is intentionally a minimal static-only landing scaffold.
// Deferred and to be added in later phases:
//   - @astrojs/cloudflare adapter (Phase 3 — Pages Functions for the Tier 0.5 issuer)
//   - Tailwind CSS (Phase 1 — once compatible @tailwindcss/vite + Astro 6 versions land,
//     OR via @astrojs/tailwind integration if we pin Tailwind to v3)
export default defineConfig({
  site: 'https://verbara.io',
  output: 'static',
  i18n: {
    defaultLocale: 'es-419',
    locales: ['es-419', 'en-US', 'pt-BR'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
