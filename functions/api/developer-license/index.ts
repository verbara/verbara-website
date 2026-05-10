/**
 * POST /api/developer-license
 *
 * Tier 0.5 Pro Developer license self-issuance endpoint.
 *
 * Pipeline:
 *   1. Parse + validate request body
 *   2. Verify Cloudflare Turnstile token against siteverify
 *   3. Per-IP rate limit (KV)         — 5 issuances per IP per 24 h
 *   4. Per-email dedup (D1)           — 1 license per email per 30 days
 *   5. Select last-6 authorized image digests from data/authorized-digests.json
 *   6. Sign LicenseKey (incl. AuthorizedImageDigests when non-empty) with
 *      ECDSA P-256 SHA-256 (Web Crypto API)
 *   7. INSERT audit row in D1 (incl. embedded digest list as JSON)
 *   8. Send email via Resend with the .lic file attached
 *   9. Return 202 Accepted
 *
 * Implements the contract documented in:
 *   Verbara.Sdk.Pro/docs/specs/2026-05-09-developer-license-issuer-contract.md
 *
 * Image-binding contract (Pro v2.3.x ADR-0011):
 *   When `data/authorized-digests.json` `current` array is non-empty, the
 *   last 6 entries (sorted by `released_at` DESC) are embedded into the
 *   issued license under `AuthorizedImageDigests`. Pro consumers verify the
 *   running container's digest matches one of them. Empty registry → field
 *   omitted entirely (back-compat permissive path; Pro's `LicenseValidator`
 *   skips the check). See `data/README.md`.
 *
 * Drift considerations: this issuer signs ONLY Tier 0.5 (Developer) licenses
 * with fixed parameters (Tier=1, Features=511, MaxAgents=5, MaxNodes=1, 30-day
 * expiry). The byte-for-byte canonical JSON must match the .NET LicenseGenerator
 * output exactly so that Verbara.Sdk.Pro.Licensing.LicenseValidator accepts it.
 * Field order in the signed payload mirrors Pro's `LicensePayload` record:
 * LicenseId, Licensee, Tier, ExpiresAt, Features, MaxAgents, MaxNodes,
 * (AuthorizedImageDigests when non-empty). The Phase 5 smoke test verifies
 * parity.
 */

import { selectAuthorizedDigests } from './authorized-digests';

interface Env {
  LICENSE_AUDIT_DB: D1Database;
  RATE_LIMIT_KV: KVNamespace;
  VERBARA_LICENSE_SIGNING_KEY: string; // PEM-encoded ECDSA P-256 private key
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
}

// ---------------------------------------------------------------------------
// Constants — Tier 0.5 Developer is fixed
// ---------------------------------------------------------------------------

const TIER_DEVELOPER = 1; // matches LicenseTier.Developer in Verbara.Sdk.Pro.Licensing
const FEATURES_ALL = 511; // bitwise OR of all 9 LicenseFeature values
const MAX_AGENTS = 5;
const MAX_NODES = 1;
const LICENSE_DAYS = 30;

const RATE_LIMIT_PER_IP_PER_DAY = 5;
const EMAIL_DEDUP_WINDOW_DAYS = 30;

const FROM_ADDRESS = 'Verbara <licensing@verbara.io>';

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export const onRequestPost: (ctx: PagesContext) => Promise<Response> = async (ctx) => {
  const { request, env } = ctx;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'invalid_request', { body: 'must be valid JSON' });
  }

  const validation = validateBody(body);
  if (!validation.ok) return jsonError(400, 'invalid_request', validation.fields);
  const input = validation.value;

  if (!input.eulaAccepted) return jsonError(400, 'eula_not_accepted');

  const captchaOk = await verifyTurnstile(input.captchaToken, env.TURNSTILE_SECRET_KEY, request);
  if (!captchaOk) return jsonError(403, 'captcha_failed');

  const sourceIp =
    request.headers.get('cf-connecting-ip') ?? request.headers.get('x-real-ip') ?? 'unknown';

  const ipLimit = await checkAndIncrementIpRateLimit(env.RATE_LIMIT_KV, sourceIp);
  if (!ipLimit.allowed) {
    return jsonError(429, 'rate_limited', undefined, ipLimit.retryAfterSeconds);
  }

  const emailNormalised = input.email.trim().toLowerCase();
  const recent = await findRecentLicenseByEmail(env.LICENSE_AUDIT_DB, emailNormalised);
  if (recent !== null) {
    const ageMs = Date.now() - new Date(recent.issued_at).getTime();
    const remainingMs = EMAIL_DEDUP_WINDOW_DAYS * 24 * 3600 * 1000 - ageMs;
    return jsonError(429, 'rate_limited', undefined, Math.max(60, Math.floor(remainingMs / 1000)));
  }

  const licenseId = crypto.randomUUID();
  const requestId = `req_${randomB32(26)}`;
  const issuedAt = new Date();
  const expiresAt = addDays(issuedAt, LICENSE_DAYS);
  // 23:59:59 UTC on the expiry day (matches the .NET LicenseGenerator convention)
  expiresAt.setUTCHours(23, 59, 59, 0);

  const licensee = input.company !== null ? `${input.email} (${input.company})` : input.email;

  // Phase 2.2 (Pro v2.3.x ADR-0011): embed the last-6 authorized Verbara
  // Platform image digests so Pro consumers reject images outside the allow-
  // list. Empty array → field omitted from canonical JSON entirely → back-
  // compat permissive path on the consumer side. See `data/README.md`.
  const authorizedImageDigests = selectAuthorizedDigests();

  let lic: SignedLicense;
  try {
    lic = await signLicense(
      {
        licenseId,
        licensee,
        tier: TIER_DEVELOPER,
        expiresAt,
        features: FEATURES_ALL,
        maxAgents: MAX_AGENTS,
        maxNodes: MAX_NODES,
        authorizedImageDigests,
      },
      env.VERBARA_LICENSE_SIGNING_KEY,
    );
  } catch (e) {
    console.error('signLicense failed', e);
    return jsonError(503, 'issuer_unavailable');
  }

  try {
    // Audit-log the embedded digest list as a JSON-array string. Empty
    // registry → '[]' so the column is unambiguous across rows pre/post the
    // registry having entries (Phase 2.2 / migration 0002). Forensics queries
    // can `SELECT json_extract(authorized_image_digests, '$[0]')` etc.
    const authorizedImageDigestsJson = JSON.stringify(authorizedImageDigests);
    await env.LICENSE_AUDIT_DB.prepare(
      `INSERT INTO license_audit (
         request_id, issued_at, license_id, email, full_name, company, use_case,
         tier, features, max_agents, max_nodes, expires_at, source_ip, user_agent,
         authorized_image_digests
       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
      .bind(
        requestId,
        issuedAt.toISOString(),
        licenseId,
        emailNormalised,
        input.fullName,
        input.company,
        input.useCase,
        TIER_DEVELOPER,
        FEATURES_ALL,
        MAX_AGENTS,
        MAX_NODES,
        expiresAt.toISOString(),
        sourceIp,
        request.headers.get('user-agent') ?? null,
        authorizedImageDigestsJson,
      )
      .run();
  } catch (e) {
    console.error('audit-log INSERT failed', e);
    return jsonError(503, 'issuer_unavailable');
  }

  const emailSent = await sendLicenseEmail(env.RESEND_API_KEY, {
    to: input.email,
    licJson: lic.json,
    fullName: input.fullName,
    licenseId,
    expiresAt,
  });
  if (!emailSent) {
    console.error('Resend email failed for license', licenseId);
    return jsonError(503, 'issuer_unavailable');
  }

  return new Response(
    JSON.stringify({
      requestId,
      message: 'Your developer license is being prepared. Check your email within 5 minutes.',
      estimatedDeliverySeconds: 60,
    }),
    {
      status: 202,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    },
  );
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

interface DeveloperLicenseRequest {
  email: string;
  fullName: string;
  company: string | null;
  useCase: string | null;
  eulaAccepted: boolean;
  captchaToken: string;
}

type ValidationResult =
  | { ok: true; value: DeveloperLicenseRequest }
  | { ok: false; fields: Record<string, string> };

function validateBody(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, fields: { body: 'must be a JSON object' } };
  }
  const b = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const email = typeof b.email === 'string' ? b.email.trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.email = 'must be a valid email address';
  }

  const fullName = typeof b.fullName === 'string' ? b.fullName.trim() : '';
  if (fullName.length === 0 || fullName.length > 100) {
    errors.fullName = 'required, 1-100 characters';
  }

  const company =
    typeof b.company === 'string' && b.company.trim().length > 0
      ? b.company.trim().slice(0, 200)
      : null;
  const useCase =
    typeof b.useCase === 'string' && b.useCase.trim().length > 0
      ? b.useCase.trim().slice(0, 500)
      : null;

  if (b.eulaAccepted !== true) {
    errors.eulaAccepted = 'must be exactly true';
  }

  const captchaToken = typeof b.captchaToken === 'string' ? b.captchaToken : '';
  if (captchaToken.length === 0 || captchaToken.length > 2048) {
    errors.captchaToken = 'required';
  }

  if (Object.keys(errors).length > 0) return { ok: false, fields: errors };
  return {
    ok: true,
    value: { email, fullName, company, useCase, eulaAccepted: true, captchaToken },
  };
}

// ---------------------------------------------------------------------------
// Turnstile verification
// ---------------------------------------------------------------------------

async function verifyTurnstile(
  token: string,
  secret: string,
  request: Request,
): Promise<boolean> {
  const remoteIp = request.headers.get('cf-connecting-ip') ?? '';
  try {
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token, remoteip: remoteIp }).toString(),
      },
    );
    const result = (await verifyResponse.json()) as { success?: boolean };
    return result.success === true;
  } catch (e) {
    console.error('Turnstile siteverify failed', e);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

async function checkAndIncrementIpRateLimit(
  kv: KVNamespace,
  ip: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const key = `rl:ip:${ip}`;
  const raw = await kv.get(key);
  const count = raw ? Number.parseInt(raw, 10) : 0;
  if (count >= RATE_LIMIT_PER_IP_PER_DAY) {
    return { allowed: false, retryAfterSeconds: 24 * 3600 };
  }
  await kv.put(key, String(count + 1), { expirationTtl: 24 * 3600 });
  return { allowed: true };
}

interface RecentLicenseRow {
  issued_at: string;
}

async function findRecentLicenseByEmail(
  db: D1Database,
  email: string,
): Promise<RecentLicenseRow | null> {
  const cutoff = new Date(Date.now() - EMAIL_DEDUP_WINDOW_DAYS * 24 * 3600 * 1000).toISOString();
  const row = await db
    .prepare(
      `SELECT issued_at FROM license_audit WHERE email = ? AND issued_at >= ? ORDER BY issued_at DESC LIMIT 1`,
    )
    .bind(email, cutoff)
    .first<RecentLicenseRow>();
  return row ?? null;
}

// ---------------------------------------------------------------------------
// ECDSA P-256 SHA-256 license signing (Web Crypto API)
//
// Output format MUST match .NET ECDsa.SignData default (IEEE P-1363 / raw
// r||s, 64 bytes for P-256). Web Crypto subtle.sign for ECDSA returns this
// format natively — no DER conversion needed.
//
// Canonical JSON byte order MUST match the .NET LicensePayload record
// declaration order: LicenseId, Licensee, Tier, ExpiresAt, Features,
// MaxAgents, MaxNodes, [AuthorizedImageDigests]. JSON.stringify preserves
// insertion order.
//
// AuthorizedImageDigests handling (Pro v2.3.x ADR-0011):
//   - When non-empty (length > 0) → appended after MaxNodes in BOTH the
//     signed payload AND the .lic file's LicenseKey shape. The ECDSA
//     signature MUST cover this field — mutating it post-signing is
//     detected by VerifySignature and returns Invalid.
//   - When empty (length === 0) → field is OMITTED from the canonical
//     JSON entirely. This preserves byte-for-byte parity with v2.2.0-pro
//     licenses (which had no such field) AND matches the .NET source-gen
//     `[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]`
//     behaviour on `LicensePayload.AuthorizedImageDigests`. Pro consumers
//     treat the absent / empty list as the back-compat permissive path
//     (no image-binding enforcement).
// ---------------------------------------------------------------------------

interface LicenseInput {
  licenseId: string;
  licensee: string;
  tier: number;
  expiresAt: Date;
  features: number;
  maxAgents: number;
  maxNodes: number;
  /**
   * Image-binding allow-list (Pro v2.3.x). Empty array = field is omitted
   * from the canonical signed JSON; non-empty = appended after MaxNodes.
   */
  authorizedImageDigests: string[];
}

interface SignedLicense {
  json: string;       // pretty-printed for the .lic file
  signature: string;  // base64
}

// TODO(test-infra): when a test framework (Vitest) lands, add unit tests for
// signLicense covering AuthorizedImageDigests:
//   - IssueLicense_ShouldEmbedLastSixDigests_WhenJsonHasMore: pass 8 digests via
//     LicenseInput.authorizedImageDigests; assert payload + .lic both contain
//     exactly 6 (the first 6 — already capped by selectAuthorizedDigests).
//   - IssueLicense_ShouldEmbedAllDigests_WhenJsonHasFewer: pass 3 digests; assert
//     payload + .lic both contain all 3 in the same order.
//   - IssueLicense_ShouldOmitField_WhenAuthorizedImageDigestsEmpty: pass []; assert
//     canonical JSON does NOT contain the substring "AuthorizedImageDigests".
//   - IssueLicense_ShouldPlaceFieldAfterMaxNodes_WhenNonEmpty: regex-match field
//     order in the canonical JSON to lock down wire-format ordering.
//   - IssueLicense_ShouldFail_WhenAuthorizedDigestsRegistryMissingOrMalformed:
//     simulate a malformed registry (current = null / current = "string"); selectAuthorizedDigests
//     should return [] and the issuer must succeed (graceful degradation).
//   - VerifySignature_ShouldRejectMutation_WhenAuthorizedImageDigestsModifiedPostSign:
//     parity test against Pro's LicenseValidator (round-trip through the .NET side).
async function signLicense(input: LicenseInput, privateKeyPem: string): Promise<SignedLicense> {
  const key = await importPrivateKey(privateKeyPem);

  const expiresAtIso = formatDotNetDateTimeOffset(input.expiresAt);
  // Build the payload in EXACTLY the .NET LicensePayload record-declaration
  // order. JSON.stringify preserves insertion order, so adding
  // AuthorizedImageDigests after MaxNodes (only when present) matches the
  // STJ source-gen output byte-for-byte.
  const payload: Record<string, unknown> = {
    LicenseId: input.licenseId,
    Licensee: input.licensee,
    Tier: input.tier,
    ExpiresAt: expiresAtIso,
    Features: input.features,
    MaxAgents: input.maxAgents,
    MaxNodes: input.maxNodes,
  };
  if (input.authorizedImageDigests.length > 0) {
    payload.AuthorizedImageDigests = input.authorizedImageDigests;
  }
  const canonical = JSON.stringify(payload);

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(canonical),
  );
  const signatureB64 = bytesToBase64(new Uint8Array(signature));

  // The .lic file is the LicenseKey record. Pro's `LicenseKey` declares
  // fields as: LicenseId..MaxNodes, Signature, AuthorizedImageDigests
  // (with the same WhenWritingNull omit on the digest list). To match that
  // shape on disk we append AuthorizedImageDigests AFTER Signature when
  // non-empty.
  const licenseKey: Record<string, unknown> = {
    LicenseId: input.licenseId,
    Licensee: input.licensee,
    Tier: input.tier,
    ExpiresAt: expiresAtIso,
    Features: input.features,
    MaxAgents: input.maxAgents,
    MaxNodes: input.maxNodes,
    Signature: signatureB64,
  };
  if (input.authorizedImageDigests.length > 0) {
    licenseKey.AuthorizedImageDigests = input.authorizedImageDigests;
  }
  return {
    json: JSON.stringify(licenseKey, null, 2),
    signature: signatureB64,
  };
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  // Strip PEM headers / whitespace; supports both "EC PRIVATE KEY" (SEC1) and
  // "PRIVATE KEY" (PKCS8) formats. .NET ExportECPrivateKeyPem produces SEC1,
  // which Web Crypto cannot import directly — must convert SEC1 -> PKCS8 OR
  // export as PKCS8 from .NET. We assume PKCS8 here; the operator runbook
  // (wrangler.toml) tells the user to export as PKCS8.
  const cleaned = pem
    .replaceAll(/-----(BEGIN|END)[\w\s]+-----/g, '')
    .replaceAll(/\s+/g, '');
  const der = base64ToBytes(cleaned);
  return crypto.subtle.importKey(
    'pkcs8',
    der.buffer as ArrayBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
}

/** .NET DateTimeOffset format: "yyyy-MM-ddTHH:mm:ss±HH:mm" — no milliseconds. */
function formatDotNetDateTimeOffset(d: Date): string {
  const Y = d.getUTCFullYear();
  const M = String(d.getUTCMonth() + 1).padStart(2, '0');
  const D = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  const s = String(d.getUTCSeconds()).padStart(2, '0');
  return `${Y}-${M}-${D}T${h}:${m}:${s}+00:00`;
}

// ---------------------------------------------------------------------------
// Email send via Resend
// ---------------------------------------------------------------------------

interface SendArgs {
  to: string;
  licJson: string;
  fullName: string;
  licenseId: string;
  expiresAt: Date;
}

async function sendLicenseEmail(apiKey: string, args: SendArgs): Promise<boolean> {
  const expiryDate = `${args.expiresAt.getUTCFullYear()}-${String(args.expiresAt.getUTCMonth() + 1).padStart(2, '0')}-${String(args.expiresAt.getUTCDate()).padStart(2, '0')}`;
  const filename = `verbara-developer-${args.licenseId}.lic`;
  const licBase64 = bytesToBase64(new TextEncoder().encode(args.licJson));

  const html = `
<!doctype html>
<html lang="en"><body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1a1a1a;">
  <p>Hi ${escapeHtml(args.fullName)},</p>
  <p>Your <strong>Verbara Pro Developer license</strong> is attached. To install:</p>
  <ol>
    <li>Save the attached <code>${escapeHtml(filename)}</code> to a path your application can read.</li>
    <li>In <code>appsettings.json</code>:
      <pre style="background:#f5f5f5;padding:1em;border-radius:6px;">{
  "VerbaraSdkPro": {
    "LicensePath": "/path/to/${escapeHtml(filename)}"
  }
}</pre>
    </li>
    <li>Register: <code>builder.Services.AddVerbaraProLicense(...)</code></li>
  </ol>
  <p><strong>This license:</strong></p>
  <ul>
    <li>Tier: Developer (Tier 0.5)</li>
    <li>Max agents: 5</li>
    <li>Max nodes: 1</li>
    <li>Expires: ${expiryDate} (30 days from issuance)</li>
    <li>Mode: WarnOnly (logs warnings; does not block)</li>
  </ul>
  <p>To renew (free), submit the form again at
    <a href="https://verbara.io/developer-license/">verbara.io/developer-license</a>
    using the same email address.</p>
  <p>Need more agents or production semantics?
    <a href="https://verbara.io/pricing/">See pricing</a>.</p>
  <p style="color:#666;font-size:12px;">— Verbara · licensing@verbara.io</p>
</body></html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: args.to,
        subject: 'Your Verbara Pro Developer License',
        html,
        attachments: [
          { filename, content: licBase64, content_type: 'application/json' },
        ],
      }),
    });
    return r.ok;
  } catch (e) {
    console.error('Resend fetch failed', e);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonError(
  status: number,
  code: string,
  fields?: Record<string, string>,
  retryAfterSeconds?: number,
): Response {
  const body: Record<string, unknown> = { error: code };
  if (fields !== undefined) body.fields = fields;
  if (retryAfterSeconds !== undefined) body.retryAfterSeconds = retryAfterSeconds;
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (retryAfterSeconds !== undefined) headers['retry-after'] = String(retryAfterSeconds);
  return new Response(JSON.stringify(body), { status, headers });
}

function bytesToBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function randomB32(length: number): string {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32 (no I L O U)
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[bytes[i]! % alphabet.length];
  return out;
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// ---------------------------------------------------------------------------
// Cloudflare types (ambient declarations to avoid pulling @cloudflare/workers-types)
// ---------------------------------------------------------------------------

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
}
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}
