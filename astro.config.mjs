// @ts-check
import process from 'node:process';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Cloudflare Turnstile site key — PUBLIC, safe to commit. Embedded in
// client-side HTML on /developer-license/, anyone can read it via view-source.
// Hardcoded here as the source of truth so every build path (local
// `npm run deploy`, Cloudflare Workers Builds auto-build, fresh `npm run dev`
// without secrets.env) gets the same value. Override via `process.env` below
// only if a future environment needs a different tenant key (e.g. staging).
const TURNSTILE_SITE_KEY_DEFAULT = '0x4AAAAAAADMEJaEtXMri3zFa';

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

  integrations: [sitemap()],

  vite: {
    define: {
      'import.meta.env.PUBLIC_TURNSTILE_SITE_KEY': JSON.stringify(
        process.env.PUBLIC_TURNSTILE_SITE_KEY ?? TURNSTILE_SITE_KEY_DEFAULT,
      ),
    },
    plugins: [tailwindcss()],
  },
});
