import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost } from '../../functions/api/developer-license/index';

// ---------------------------------------------------------------------------
// Test doubles for the Cloudflare bindings (D1 + KV) and a PKCS8 signing key.
// ---------------------------------------------------------------------------

interface AuditRow {
  [column: string]: unknown;
}

/** Minimal in-memory D1 stub. Records INSERTs; answers the dedup SELECT. */
class FakeD1 {
  rows: AuditRow[] = [];
  recentByEmail: { issued_at: string } | null = null;
  failInsert = false;

  prepare = (query: string) => {
    const bound: unknown[] = [];
    const stmt = {
      bind: (...values: unknown[]) => {
        bound.push(...values);
        return stmt;
      },
      first: async <T>() =>
        // The dedup query is the only SELECT the handler issues.
        (this.recentByEmail as unknown as T) ?? null,
      run: async () => {
        if (this.failInsert) throw new Error('D1 insert failed');
        this.rows.push({ query, bound: [...bound] });
        return {};
      },
    };
    return stmt;
  };
}

/** Minimal in-memory KV stub. */
class FakeKV {
  store = new Map<string, string>();
  async get(key: string) {
    return this.store.get(key) ?? null;
  }
  async put(key: string, value: string) {
    this.store.set(key, value);
  }
}

async function generatePkcs8Pem(): Promise<string> {
  const kp = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  );
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', kp.privateKey);
  const b64 = Buffer.from(pkcs8).toString('base64');
  const wrapped = b64.match(/.{1,64}/g)!.join('\n');
  return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----`;
}

function makeEnv(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    LICENSE_AUDIT_DB: new FakeD1(),
    RATE_LIMIT_KV: new FakeKV(),
    VERBARA_LICENSE_SIGNING_KEY: '',
    RESEND_API_KEY: 'resend-key',
    TURNSTILE_SECRET_KEY: 'turnstile-secret',
    ...overrides,
  } as never;
}

function makeCtx(body: unknown, env: unknown, headers: Record<string, string> = {}) {
  const request = new Request('https://verbara.io/api/developer-license', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return { request, env, waitUntil: () => {} } as never;
}

const validBody = {
  email: 'dev@example.com',
  fullName: 'Ada Lovelace',
  company: 'Analytical Engines',
  useCase: 'Testing the issuer',
  eulaAccepted: true,
  captchaToken: 'cf-turnstile-token',
};

/**
 * Stub fetch for the two outbound calls the handler makes:
 *  - Turnstile siteverify (success controlled by `captcha`)
 *  - Resend send (ok controlled by `resendOk`)
 */
function stubFetch(opts: { captcha?: boolean; resendOk?: boolean } = {}) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('challenges.cloudflare.com')) {
      return new Response(JSON.stringify({ success: opts.captcha ?? true }), { status: 200 });
    }
    if (url.includes('api.resend.com')) {
      return new Response('{}', { status: opts.resendOk ?? true ? 200 : 500 });
    }
    return new Response('unexpected', { status: 500 });
  });
}

describe('onRequestPost — request validation', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('onRequestPost_ShouldReturn400_WhenBodyNotJson', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const res = await onRequestPost(makeCtx('not json', makeEnv()));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_request');
  });

  it('onRequestPost_ShouldReturn400_WhenEmailInvalid', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const res = await onRequestPost(makeCtx({ ...validBody, email: 'bad-email' }, makeEnv()));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.fields.email).toBeDefined();
  });

  it('onRequestPost_ShouldReturn400_WhenFullNameEmpty', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const res = await onRequestPost(makeCtx({ ...validBody, fullName: '   ' }, makeEnv()));
    expect(res.status).toBe(400);
    expect((await res.json()).fields.fullName).toBeDefined();
  });

  it('onRequestPost_ShouldReturn400_WhenEulaNotAccepted', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const res = await onRequestPost(makeCtx({ ...validBody, eulaAccepted: false }, makeEnv()));
    expect(res.status).toBe(400);
    expect((await res.json()).fields.eulaAccepted).toBeDefined();
  });

  it('onRequestPost_ShouldReturn400_WhenCaptchaTokenMissing', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const res = await onRequestPost(makeCtx({ ...validBody, captchaToken: '' }, makeEnv()));
    expect(res.status).toBe(400);
    expect((await res.json()).fields.captchaToken).toBeDefined();
  });
});

describe('onRequestPost — captcha + rate limits', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('onRequestPost_ShouldReturn403_WhenCaptchaFails', async () => {
    vi.stubGlobal('fetch', stubFetch({ captcha: false }));
    const res = await onRequestPost(makeCtx(validBody, makeEnv()));
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('captcha_failed');
  });

  it('onRequestPost_ShouldReturn429_WhenIpRateLimited', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const kv = new FakeKV();
    kv.store.set('rl:ip:203.0.113.7', '5'); // at the per-IP daily cap
    const res = await onRequestPost(makeCtx(validBody, makeEnv({ RATE_LIMIT_KV: kv })));
    expect(res.status).toBe(429);
    expect((await res.json()).error).toBe('rate_limited');
    expect(res.headers.get('retry-after')).toBeTruthy();
  });

  it('onRequestPost_ShouldReturn429_WhenEmailAlreadyIssuedRecently', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const db = new FakeD1();
    db.recentByEmail = { issued_at: new Date().toISOString() };
    const res = await onRequestPost(makeCtx(validBody, makeEnv({ LICENSE_AUDIT_DB: db })));
    expect(res.status).toBe(429);
    expect((await res.json()).error).toBe('rate_limited');
  });
});

describe('onRequestPost — issuance pipeline', () => {
  let signingKey: string;

  beforeEach(async () => {
    signingKey = await generatePkcs8Pem();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('onRequestPost_ShouldReturn202AndAuditLog_WhenAllChecksPass', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const db = new FakeD1();
    const env = makeEnv({ LICENSE_AUDIT_DB: db, VERBARA_LICENSE_SIGNING_KEY: signingKey });
    const res = await onRequestPost(makeCtx(validBody, env));

    expect(res.status).toBe(202);
    const json = await res.json();
    expect(json.requestId).toMatch(/^req_/);
    expect(db.rows).toHaveLength(1); // audit INSERT recorded
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('onRequestPost_ShouldReturn503_WhenSigningKeyInvalid', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const env = makeEnv({ VERBARA_LICENSE_SIGNING_KEY: 'not-a-valid-pkcs8-key' });
    const res = await onRequestPost(makeCtx(validBody, env));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe('issuer_unavailable');
  });

  it('onRequestPost_ShouldReturn503_WhenAuditInsertFails', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const db = new FakeD1();
    db.failInsert = true;
    const env = makeEnv({ LICENSE_AUDIT_DB: db, VERBARA_LICENSE_SIGNING_KEY: signingKey });
    const res = await onRequestPost(makeCtx(validBody, env));
    expect(res.status).toBe(503);
  });

  it('onRequestPost_ShouldReturn503_WhenResendEmailFails', async () => {
    vi.stubGlobal('fetch', stubFetch({ resendOk: false }));
    const env = makeEnv({ VERBARA_LICENSE_SIGNING_KEY: signingKey });
    const res = await onRequestPost(makeCtx(validBody, env));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe('issuer_unavailable');
  });

  it('onRequestPost_ShouldAcceptNullCompanyAndUseCase', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const env = makeEnv({ VERBARA_LICENSE_SIGNING_KEY: signingKey });
    const body = { ...validBody, company: '', useCase: '' };
    const res = await onRequestPost(makeCtx(body, env));
    expect(res.status).toBe(202);
  });

  it('onRequestPost_ShouldIncrementIpCounter_WhenIssued', async () => {
    vi.stubGlobal('fetch', stubFetch());
    const kv = new FakeKV();
    const env = makeEnv({ RATE_LIMIT_KV: kv, VERBARA_LICENSE_SIGNING_KEY: signingKey });
    await onRequestPost(makeCtx(validBody, env));
    expect(kv.store.get('rl:ip:203.0.113.7')).toBe('1');
  });
});
