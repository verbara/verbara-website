import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost } from '../../functions/api/developer-license/index';
import { fromUnits, payloadVector } from './stj-vectors';

// Licensees with characters System.Text.Json escapes. The licence validator
// re-serializes the .lic minus Signature with STJ's default encoder and checks
// the signature over those bytes, so the issuer must sign exactly them.
//
// The clock and licence id are pinned, so the issued payload equals a golden
// payload vector field for field and its `stj` value IS the canonical bytes.

const FIXED_ID = '00000000-0000-4000-8000-000000000001';
const ISSUED_AT = new Date('2026-10-28T12:00:00Z'); // expires 2026-11-27T23:59:59+00:00

interface Statement {
  op: 'first' | 'run';
  query: string;
  bound: unknown[];
}

/** In-memory D1 that records every statement and its bindings, SELECTs included. */
class RecordingD1 {
  statements: Statement[] = [];

  prepare = (query: string) => {
    const bound: unknown[] = [];
    const stmt = {
      bind: (...values: unknown[]) => {
        bound.push(...values);
        return stmt;
      },
      first: async <T>(): Promise<T | null> => {
        this.statements.push({ op: 'first', query, bound: [...bound] });
        return null;
      },
      run: async () => {
        this.statements.push({ op: 'run', query, bound: [...bound] });
        return {};
      },
    };
    return stmt;
  };

  get insert(): unknown[] {
    return this.statements.find((s) => s.op === 'run' && s.query.includes('INSERT'))!.bound;
  }

  get dedupLookup(): unknown[] {
    return this.statements.find((s) => s.op === 'first')!.bound;
  }
}

class FakeKV {
  store = new Map<string, string>();
  async get(key: string) {
    return this.store.get(key) ?? null;
  }
  async put(key: string, value: string) {
    this.store.set(key, value);
  }
}

/** Issues one licence through the real handler and captures the .lic from the Resend attachment. */
async function issue(email: string, company: string) {
  const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'sign',
    'verify',
  ]);
  const pkcs8 = Buffer.from(await crypto.subtle.exportKey('pkcs8', kp.privateKey)).toString('base64');
  const pem = `-----BEGIN PRIVATE KEY-----\n${pkcs8.match(/.{1,64}/g)!.join('\n')}\n-----END PRIVATE KEY-----`;

  let licText = '';
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (new URL(String(input)).hostname === 'challenges.cloudflare.com') {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      const sent = JSON.parse(String(init!.body)) as { attachments: { content: string }[] };
      licText = Buffer.from(sent.attachments[0]!.content, 'base64').toString('utf8');
      return new Response('{}', { status: 200 });
    }),
  );

  const db = new RecordingD1();
  const env = {
    LICENSE_AUDIT_DB: db,
    RATE_LIMIT_KV: new FakeKV(),
    VERBARA_LICENSE_SIGNING_KEY: pem,
    RESEND_API_KEY: 'resend-key',
    TURNSTILE_SECRET_KEY: 'turnstile-secret',
  };
  // JSON.stringify writes a lone surrogate as a \uXXXX escape, so it reaches
  // the handler intact through request.json().
  const request = new Request('https://verbara.io/api/developer-license', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7' },
    body: JSON.stringify({
      email,
      fullName: 'Ada Lovelace',
      company,
      useCase: 'Testing the issuer',
      eulaAccepted: true,
      captchaToken: 'cf-turnstile-token',
    }),
  });
  const res = await onRequestPost({ request, env, waitUntil: () => {} } as never);
  expect(res.status).toBe(202);
  const lic = JSON.parse(licText) as Record<string, unknown>;
  return { lic, licText, db, publicKey: kp.publicKey };
}

async function verifiesOver(
  publicKey: CryptoKey,
  signatureB64: unknown,
  canonical: string,
): Promise<boolean> {
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    Buffer.from(String(signatureB64), 'base64'),
    new TextEncoder().encode(canonical),
  );
}

/** True when the string holds an unpaired surrogate code unit. */
const hasLoneSurrogate = (s: string) => /\p{Cs}/u.test(s);
/** A \uD800-\uDFFF escape written into JSON text. */
const SURROGATE_ESCAPE = /\\u[dD][89a-fA-F][0-9a-fA-F]{2}/;

describe('onRequestPost - licensees STJ escapes (signature over STJ canonical bytes)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(ISSUED_AT);
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(FIXED_ID);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([
    ['plus tag', 'dev+trial@example.com', ''],
    ['plus tag with company', 'dev+trial@example.com', 'Caf\u00E9 & S\u00F8n\'s <Ltd>'],
    ['quotes and backslash', "o'neil@example.com", 'A&B "Quotes" \\ back'],
  ])(
    'onRequestPost_ShouldSignStjCanonicalBytes_WhenLicenseeIs %s (A3)',
    async (label, email, company) => {
      const vector = payloadVector(label);
      const { lic, publicKey } = await issue(email, company);
      const { Signature, ...payload } = lic;

      // The .lic minus Signature is the vector's payload, field for field ...
      expect(payload).toEqual({ ...vector.fields, Licensee: fromUnits(vector.fields.Licensee) });
      // ... so STJ's serialization of it is vector.stj, and the signature must verify over it.
      expect(await verifiesOver(publicKey, Signature, vector.stj)).toBe(true);
    },
  );

  it('onRequestPost_ShouldCutCompanyBeforeTheSurrogatePair_WhenUnit200IsAHighSurrogate (A4)', async () => {
    const company = 'A'.repeat(199) + '\u{1F680}' + 'tail';
    expect(company.charCodeAt(199)).toBeGreaterThanOrEqual(0xd800);
    expect(company.charCodeAt(199)).toBeLessThanOrEqual(0xdbff);

    const { lic, db, publicKey } = await issue('dev@example.com', company);
    const vector = payloadVector('company truncated before a surrogate pair');

    expect(db.insert[5]).toBe('A'.repeat(199)); // stored company
    expect(lic.Licensee).toBe(fromUnits(vector.fields.Licensee)); // signed company
    expect(await verifiesOver(publicKey, lic.Signature, vector.stj)).toBe(true);
  });

  it('onRequestPost_ShouldReplaceLoneSurrogatesWithFFFD_InLicSignatureAuditAndDedup (A4b)', async () => {
    // The email regex (/^[^\s@]+@[^\s@]+\.[^\s@]+$/) accepts a lone low surrogate.
    const email = 'Dev\uDC00@Example.com';
    const company = 'Acme \uD800 Ltd';
    const { lic, licText, db, publicKey } = await issue(email, company);
    const vector = payloadVector('lone surrogates sanitized to U+FFFD');

    // The .lic carries U+FFFD and no surrogate escape.
    expect(licText).not.toMatch(SURROGATE_ESCAPE);
    expect(lic.Licensee).toBe('Dev\uFFFD@Example.com (Acme \uFFFD Ltd)');
    // The signed payload carries U+FFFD (STJ writes it as \uFFFD).
    expect(await verifiesOver(publicKey, lic.Signature, vector.stj)).toBe(true);

    // The audit INSERT's email (normalised) and company bindings.
    const insert = db.insert;
    expect(insert[3]).toBe('dev\uFFFD@example.com');
    expect(insert[5]).toBe('Acme \uFFFD Ltd');
    for (const value of insert) {
      if (typeof value === 'string') expect(hasLoneSurrogate(value)).toBe(false);
    }

    // Sanitizing happens before the email is normalised: the dedup lookup binds the same email.
    expect(db.dedupLookup[0]).toBe('dev\uFFFD@example.com');
    expect(db.dedupLookup[0]).toBe(insert[3]);
  });
});
