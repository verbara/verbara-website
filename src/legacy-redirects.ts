/**
 * Permanent redirects for retired site paths, applied by the Worker entry
 * (src/worker.ts) before it hands a request to the static-assets binding.
 *
 * The Worker only sees requests that matched no built asset, which is exactly
 * the case for a retired path: its page is no longer emitted to dist/.
 *
 * 2026-10-26: the "CPaaS" solution was renamed "Programmable telephony"
 * (owner ruling — the site no longer uses the term), so
 * /use-cases/cpaas/ and its locale variants move to
 * /use-cases/programmable-telephony/.
 */

const RETIRED_CPAAS = /^(\/(?:en-US|pt-BR))?\/use-cases\/cpaas(?:\/(?:index\.html)?)?$/;

/**
 * Returns the absolute URL a retired path now lives at, or null when the
 * path is not retired. The query string is kept.
 */
export function legacyRedirectTarget(url: URL): string | null {
  const match = RETIRED_CPAAS.exec(url.pathname);
  if (!match) {
    return null;
  }
  const localePrefix = match[1] ?? '';
  return `${url.origin}${localePrefix}/use-cases/programmable-telephony/${url.search}`;
}
