import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runDriftDetection, type DriftEnv } from '../../src/drift-detection';
import type {
  AuthorizedDigestEntry,
  AuthorizedDigestsRegistry,
} from '../../functions/api/developer-license/authorized-digests';

// runDriftDetection calls loadRegistry() from the authorized-digests module to
// obtain the entries to verify. Mock it so each test drives a controlled set.
vi.mock('../../functions/api/developer-license/authorized-digests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../functions/api/developer-license/authorized-digests')>();
  return { ...actual, loadRegistry: vi.fn() };
});

import { loadRegistry } from '../../functions/api/developer-license/authorized-digests';

const mockedLoadRegistry = vi.mocked(loadRegistry);

const HEX = (c: string) => c.repeat(64);

function entry(overrides: Partial<AuthorizedDigestEntry> = {}): AuthorizedDigestEntry {
  return {
    platform_version: 'v2.20.0',
    image_ref: 'ghcr.io/verbara/platform/api:v2.20.0',
    manifest_list_digest: `sha256:${HEX('a')}`,
    released_at: '2026-07-20T13:10:38Z',
    ...overrides,
  };
}

function setRegistry(current: AuthorizedDigestEntry[]): void {
  mockedLoadRegistry.mockReturnValue({ current, deprecated: [] } as AuthorizedDigestsRegistry);
}

const env: DriftEnv = { RESEND_API_KEY: 'test-resend-key' };

/**
 * Build a fetch stub that answers the ghcr.io token endpoint and then the
 * manifest HEAD. `manifestDigest` is the value returned in the
 * Docker-Content-Digest response header (null header => omitted).
 */
function fetchStub(opts: {
  token?: string;
  tokenOk?: boolean;
  manifestOk?: boolean;
  manifestStatus?: number;
  manifestDigest?: string | null;
}) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/token')) {
      const ok = opts.tokenOk ?? true;
      return new Response(JSON.stringify({ token: opts.token ?? 'ghs_token' }), {
        status: ok ? 200 : 401,
      });
    }
    // manifest HEAD
    const ok = opts.manifestOk ?? true;
    const headers = new Headers();
    const digest = opts.manifestDigest === undefined ? `sha256:${HEX('a')}` : opts.manifestDigest;
    if (digest !== null) headers.set('docker-content-digest', digest);
    void init;
    return new Response(null, { status: opts.manifestStatus ?? (ok ? 200 : 500), headers });
  });
}

describe('runDriftDetection', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockedLoadRegistry.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('runDriftDetection_ShouldReturnEmptyReport_WhenRegistryEmpty', async () => {
    setRegistry([]);
    fetchSpy = fetchStub({});
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);

    expect(report.entries).toBe(0);
    expect(report.drifts).toEqual([]);
    expect(report.errors).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('runDriftDetection_ShouldReturnEmptyReport_WhenCurrentUndefined', async () => {
    mockedLoadRegistry.mockReturnValue({ deprecated: [] } as unknown as AuthorizedDigestsRegistry);
    fetchSpy = fetchStub({});
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);
    expect(report.entries).toBe(0);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('runDriftDetection_ShouldReportOkWithNoAlerts_WhenLiveDigestMatches', async () => {
    setRegistry([entry({ manifest_list_digest: `sha256:${HEX('a')}` })]);
    fetchSpy = fetchStub({ manifestDigest: `sha256:${HEX('a')}` });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);

    expect(report.entries).toBe(1);
    expect(report.drifts).toEqual([]);
    expect(report.errors).toEqual([]);
    // No security email should have been sent (only token + manifest fetches).
    const resendCalls = fetchSpy.mock.calls.filter((c) => String(c[0]).includes('api.resend.com'));
    expect(resendCalls).toHaveLength(0);
  });

  it('runDriftDetection_ShouldReportDrift_WhenLiveDigestDiffers', async () => {
    setRegistry([entry({ manifest_list_digest: `sha256:${HEX('a')}` })]);
    fetchSpy = fetchStub({ manifestDigest: `sha256:${HEX('b')}` });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);

    expect(report.drifts).toHaveLength(1);
    expect(report.drifts[0]).toMatchObject({
      platform_version: 'v2.20.0',
      expected_digest: `sha256:${HEX('a')}`,
      actual_digest: `sha256:${HEX('b')}`,
    });
    // Drift present => security alert email must be sent.
    const resendCalls = fetchSpy.mock.calls.filter((c) => String(c[0]).includes('api.resend.com'));
    expect(resendCalls).toHaveLength(1);
  });

  it('runDriftDetection_ShouldReportError_WhenManifestHasNoDigestHeader', async () => {
    setRegistry([entry()]);
    fetchSpy = fetchStub({ manifestDigest: null });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);

    expect(report.drifts).toEqual([]);
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].message).toContain('no Docker-Content-Digest');
  });

  it('runDriftDetection_ShouldReportError_WhenManifestFetchFails', async () => {
    setRegistry([entry()]);
    fetchSpy = fetchStub({ manifestOk: false, manifestStatus: 404 });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);

    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].message).toContain('404');
  });

  it('runDriftDetection_ShouldReportError_WhenTokenEndpointFails', async () => {
    setRegistry([entry()]);
    fetchSpy = fetchStub({ tokenOk: false });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);

    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].message).toContain('token endpoint returned 401');
  });

  it('runDriftDetection_ShouldReportError_WhenTokenEndpointReturnsNoToken', async () => {
    setRegistry([entry()]);
    fetchSpy = fetchStub({ token: '' });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].message).toContain('no token');
  });

  it('runDriftDetection_ShouldReportError_WhenRegistryAuthorityUnsupported', async () => {
    setRegistry([entry({ image_ref: 'docker.io/verbara/platform/api:v2.20.0' })]);
    fetchSpy = fetchStub({});
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);

    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].message).toContain('unsupported registry authority');
    // Never hit the registry (no token / manifest fetch) for an unsupported
    // authority — the only outbound call is the resulting security alert.
    const registryCalls = fetchSpy.mock.calls.filter(
      (c) => String(c[0]).includes('/token') || String(c[0]).includes('/manifests/'),
    );
    expect(registryCalls).toHaveLength(0);
  });

  it('runDriftDetection_ShouldReportError_WhenImageRefMalformed', async () => {
    setRegistry([entry({ image_ref: 'ghcr.io/verbara/platform/api' })]);
    fetchSpy = fetchStub({});
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].message).toContain('malformed image_ref');
  });

  it('runDriftDetection_ShouldHandleDigestPinnedRef_WhenAtFormUsed', async () => {
    // authority/repo@sha256:... form exercises the parseImageRef @-branch.
    setRegistry([
      entry({
        image_ref: `ghcr.io/verbara/platform/api@sha256:${HEX('c')}`,
        manifest_list_digest: `sha256:${HEX('a')}`,
      }),
    ]);
    fetchSpy = fetchStub({ manifestDigest: `sha256:${HEX('a')}` });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);
    expect(report.errors).toEqual([]);
    expect(report.drifts).toEqual([]);
    // The manifest URL should reference the digest, not a tag.
    const manifestCall = fetchSpy.mock.calls.find((c) => String(c[0]).includes('/manifests/'));
    expect(String(manifestCall?.[0])).toContain(`sha256:${HEX('c')}`);
  });

  it('runDriftDetection_ShouldStillSendAlert_WhenOnlyErrorsPresent', async () => {
    setRegistry([entry()]);
    fetchSpy = fetchStub({ manifestOk: false, manifestStatus: 500 });
    vi.stubGlobal('fetch', fetchSpy);

    const report = await runDriftDetection(env);
    expect(report.errors).toHaveLength(1);
    const resendCalls = fetchSpy.mock.calls.filter((c) => String(c[0]).includes('api.resend.com'));
    expect(resendCalls).toHaveLength(1);
    // The alert body carries the ERROR marker and error message.
    const body = JSON.parse(String(resendCalls[0][1]?.body));
    expect(body.subject).toContain('errors');
    expect(body.text).toContain('ERROR');
  });

  it('runDriftDetection_ShouldSurviveResendFailure_WhenSecurityEmailErrors', async () => {
    setRegistry([entry({ manifest_list_digest: `sha256:${HEX('a')}` })]);
    // Manifest drifts (=> alert attempted); Resend endpoint returns 500.
    fetchSpy = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/token')) return new Response(JSON.stringify({ token: 't' }), { status: 200 });
      if (url.includes('api.resend.com')) return new Response('nope', { status: 500 });
      const headers = new Headers({ 'docker-content-digest': `sha256:${HEX('b')}` });
      return new Response(null, { status: 200, headers });
    });
    vi.stubGlobal('fetch', fetchSpy);

    // Must not throw despite the failed alert send.
    const report = await runDriftDetection(env);
    expect(report.drifts).toHaveLength(1);
  });
});
