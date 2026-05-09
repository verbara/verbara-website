import { LOCALES, DEFAULT_LOCALE, type Locale } from './messages';

function pathSegments(pathname: string): string[] {
  const trimmed = pathname.replaceAll(/^\/+|\/+$/g, '');
  return trimmed === '' ? [] : trimmed.split('/');
}

/**
 * Detect the locale from an Astro URL pathname.
 *
 * Astro's i18n routing puts non-default locales under /<locale>/<path>.
 * The default locale is served at the root (no prefix), so:
 *   /                  -> es-419 (default)
 *   /pricing/          -> es-419
 *   /en-US/            -> en-US
 *   /en-US/pricing/    -> en-US
 *   /pt-BR/pricing/    -> pt-BR
 */
export function getLocaleFromPath(pathname: string): Locale {
  const first = pathSegments(pathname)[0];
  if (first && (LOCALES as readonly string[]).includes(first)) {
    return first as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Strip the locale prefix from a path so it can be used as a route key.
 *
 *   /                  -> ''
 *   /pricing/          -> 'pricing'
 *   /en-US/            -> ''
 *   /en-US/pricing/    -> 'pricing'
 */
export function getRouteFromPath(pathname: string): string {
  const segments = pathSegments(pathname);
  const first = segments[0];
  if (first && (LOCALES as readonly string[]).includes(first)) {
    return segments.slice(1).join('/');
  }
  return segments.join('/');
}

/**
 * Build a localised URL for a given route. Always emits a trailing slash so
 * Cloudflare Pages does not 307-redirect on every navigation (saves one
 * request per click).
 *
 *   localiseHref('pricing', 'es-419') -> '/pricing/'
 *   localiseHref('pricing', 'en-US')  -> '/en-US/pricing/'
 *   localiseHref('', 'pt-BR')         -> '/pt-BR/'
 */
export function localiseHref(route: string, locale: Locale): string {
  const cleanRoute = route.replace(/^\/+/, '').replace(/\/+$/, '');
  if (locale === DEFAULT_LOCALE) {
    return cleanRoute === '' ? '/' : `/${cleanRoute}/`;
  }
  return cleanRoute === '' ? `/${locale}/` : `/${locale}/${cleanRoute}/`;
}
