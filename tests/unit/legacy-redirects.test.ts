import { describe, expect, it, vi } from 'vitest';
import { legacyRedirectTarget } from '../../src/legacy-redirects';
import worker from '../../src/worker';

const ORIGIN = 'https://verbara.io';

describe('legacyRedirectTarget', () => {
  it.each([
    ['/use-cases/cpaas/', '/use-cases/programmable-telephony/'],
    ['/use-cases/cpaas', '/use-cases/programmable-telephony/'],
    ['/use-cases/cpaas/index.html', '/use-cases/programmable-telephony/'],
    ['/en-US/use-cases/cpaas/', '/en-US/use-cases/programmable-telephony/'],
    ['/en-US/use-cases/cpaas', '/en-US/use-cases/programmable-telephony/'],
    ['/pt-BR/use-cases/cpaas/', '/pt-BR/use-cases/programmable-telephony/'],
    ['/pt-BR/use-cases/cpaas/index.html', '/pt-BR/use-cases/programmable-telephony/'],
  ])('legacyRedirectTarget_ShouldPointToProgrammableTelephony_WhenPathIs %s', (path, target) => {
    expect(legacyRedirectTarget(new URL(path, ORIGIN))).toBe(`${ORIGIN}${target}`);
  });

  it('legacyRedirectTarget_ShouldKeepQueryString_WhenRetiredPathHasOne', () => {
    expect(legacyRedirectTarget(new URL('/en-US/use-cases/cpaas/?utm_source=x', ORIGIN))).toBe(
      `${ORIGIN}/en-US/use-cases/programmable-telephony/?utm_source=x`,
    );
  });

  it.each([
    '/use-cases/programmable-telephony/',
    '/use-cases/',
    '/use-cases/cpaas-extra/',
    '/use-cases/cpaas/other/',
    '/fr-FR/use-cases/cpaas/',
    '/',
  ])('legacyRedirectTarget_ShouldReturnNull_WhenPathIsNotRetired %s', (path) => {
    expect(legacyRedirectTarget(new URL(path, ORIGIN))).toBeNull();
  });
});

describe('worker fetch', () => {
  function env() {
    return {
      ASSETS: { fetch: vi.fn(async () => new Response('asset', { status: 200 })) },
      LICENSE_AUDIT_DB: null,
      RATE_LIMIT_KV: null,
      VERBARA_LICENSE_SIGNING_KEY: '',
      RESEND_API_KEY: '',
      TURNSTILE_SECRET_KEY: '',
    };
  }
  const ctx = { waitUntil: () => undefined, passThroughOnException: () => undefined };

  it('fetch_ShouldReturn301ToNewSlug_WhenOldCpaasPathRequested', async () => {
    const e = env();
    const res = await worker.fetch(new Request(`${ORIGIN}/pt-BR/use-cases/cpaas/`), e, ctx);
    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe(`${ORIGIN}/pt-BR/use-cases/programmable-telephony/`);
    expect(e.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it('fetch_ShouldServeAssets_WhenPathIsNotRetired', async () => {
    const e = env();
    const res = await worker.fetch(new Request(`${ORIGIN}/use-cases/programmable-telephony/`), e, ctx);
    expect(res.status).toBe(200);
    expect(e.ASSETS.fetch).toHaveBeenCalledOnce();
  });
});
