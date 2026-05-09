// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
//
// Phase 1 stack:
//   - Astro 6.3 static output
//   - Tailwind v4.3 via @tailwindcss/vite (v4.2 had a tsconfigPaths incompat)
//   - i18n routing for es-419 (default, no prefix) + en-US + pt-BR
//   - trailingSlash: 'always' to match Cloudflare Pages convention and avoid
//     a 307 redirect hop on every navigation
//
// @astrojs/cloudflare adapter is added in Phase 3 (Pages Functions for the
// Tier 0.5 license-issuer endpoint).
export default defineConfig({
  site: 'https://verbara.io',
  output: 'static',
  trailingSlash: 'always',

  i18n: {
    defaultLocale: 'es-419',
    locales: ['es-419', 'en-US', 'pt-BR'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
