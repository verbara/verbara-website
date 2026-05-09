# Issuer Setup — One-Time Operator Runbook

**Audience:** Verbara maintainer, setting up the Tier 0.5 license-issuer for the first time.
**Prerequisites:** Cloudflare Pages project `verbara-website` already exists and serves https://verbara.io. Resend account verified for verbara.io. Turnstile site + secret keys generated.
**Estimated time:** ~30 min total (one sitting).
**Cost:** $0 — all on free tiers.

This runbook turns the Phase 3 code (already shipped in `functions/api/developer-license.ts`) into a working endpoint that a real customer can hit.

## What this gives you when complete

- `POST https://verbara.io/api/developer-license` accepts form submissions from `/developer-license/`
- Each successful POST: signs a `.lic` file with ECDSA P-256, persists an audit row in D1, sends the `.lic` by email via Resend, returns 202 in <5 seconds
- Rate limits enforce: 5 issuances per IP per 24 h, 1 issuance per email per 30 days
- Turnstile verifies every submission server-side

---

## Step 1 — Generate the ECDSA signing keypair (~2 min)

The Worker signs with the **private** key; the consumer-side `Verbara.Sdk.Pro.Licensing.LicenseValidator` validates with the **public** key. They must be a matching pair.

Use the existing `LicenseGenerator` CLI in the Pro repo:

```sh
cd /path/to/Verbara.Sdk.Pro
mkdir -p ~/.verbara/keys
chmod 700 ~/.verbara/keys

dotnet run --project tools/Verbara.Sdk.Pro.LicenseGenerator -- \
  --generate-keys --output ~/.verbara/keys
```

Output:

```
~/.verbara/keys/private.pem   # SEC1 EC private key — NEVER share
~/.verbara/keys/public.pem    # SubjectPublicKeyInfo — share with Pro consumers
```

Lock the private key:

```sh
chmod 600 ~/.verbara/keys/private.pem
```

⚠️ **NEVER commit either key to git** — `.gitignore` in this repo and Pro both block `private.pem` and `*.lic`. Verify after copying anywhere.

## Step 2 — Convert private key from SEC1 → PKCS8 (~30 s)

The `LicenseGenerator` exports SEC1-formatted PEM (`-----BEGIN EC PRIVATE KEY-----`). The Web Crypto API used by Cloudflare Workers requires **PKCS8** format (`-----BEGIN PRIVATE KEY-----`). Convert with `openssl`:

```sh
openssl pkcs8 -topk8 -nocrypt \
  -in  ~/.verbara/keys/private.pem \
  -out ~/.verbara/keys/private.pkcs8.pem
```

Verify it starts with `-----BEGIN PRIVATE KEY-----` (not `EC PRIVATE KEY`):

```sh
head -1 ~/.verbara/keys/private.pkcs8.pem
# expected: -----BEGIN PRIVATE KEY-----
```

## Step 3 — Create the D1 database (~1 min)

```sh
cd /path/to/verbara-website
npx wrangler login          # one-time browser auth if not already logged in
npx wrangler d1 create verbara-license-audit
```

Output ends with something like:

```
[[d1_databases]]
binding = "LICENSE_AUDIT_DB"
database_name = "verbara-license-audit"
database_id = "abcdef12-3456-7890-abcd-ef1234567890"
```

Copy the `database_id` value into `wrangler.toml` (replace `REPLACE_WITH_database_id_FROM_d1_create_OUTPUT`).

## Step 4 — Create the KV namespace for IP rate limit (~1 min)

```sh
npx wrangler kv namespace create RATE_LIMIT_KV
```

Output:

```
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "1234567890abcdef1234567890abcdef"
```

Copy the `id` value into `wrangler.toml` (replace `REPLACE_WITH_id_FROM_kv_namespace_create_OUTPUT`). Commit the updated `wrangler.toml` — these IDs are NOT secrets.

## Step 5 — Apply the D1 schema migration (~30 s)

```sh
npx wrangler d1 migrations apply verbara-license-audit --remote
```

Confirms creation of the `license_audit` table. Re-running is safe (idempotent IF NOT EXISTS).

## Step 6 — Upload secrets to Cloudflare Pages (~3 min)

Three secrets, one command each. Each command prompts for the value — paste once, Cloudflare stores it encrypted; never appears in logs or git.

```sh
# 1. ECDSA private key (the entire PKCS8 PEM contents, multi-line)
cat ~/.verbara/keys/private.pkcs8.pem | npx wrangler pages secret put VERBARA_LICENSE_SIGNING_KEY --project-name verbara-website

# 2. Resend API key (from ~/.verbara/secrets.env or your password manager)
npx wrangler pages secret put RESEND_API_KEY --project-name verbara-website
# When prompted, paste the re_... key

# 3. Turnstile secret key (the 0x4AAA... PRIVATE one, NOT the site key)
npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name verbara-website
# When prompted, paste the secret key
```

## Step 7 — Add the PUBLIC env var for the form (~1 min)

The form needs `PUBLIC_TURNSTILE_SITE_KEY` to render. Public env vars are NOT secrets — they go in the Cloudflare Pages dashboard's Environment Variables section (Production environment), or via wrangler:

```sh
# Via dashboard (recommended for public env vars):
#   Cloudflare → verbara-website → Settings → Environment variables → Production
#   Add: PUBLIC_TURNSTILE_SITE_KEY = 0x4AAA... (the SITE key, public)
#   Save → Cloudflare prompts for redeploy → Save and Deploy
```

Without this var, `/developer-license/` falls back to the coming-soon callout. With it, the form renders.

## Step 8 — Deploy + verify (~3 min)

Push any change to `main` (or trigger a manual redeploy in the dashboard). Once the deploy completes:

```sh
# Smoke test 1 — endpoint exists
curl -i https://verbara.io/api/developer-license -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@example.com","fullName":"Smoke","eulaAccepted":true,"captchaToken":"INVALID"}'
# Expected: HTTP 403 with {"error":"captcha_failed"} — proves endpoint reachable + Turnstile path executed

# Smoke test 2 — visit the form
open https://verbara.io/developer-license/
# Should now show the form (not coming-soon) since PUBLIC_TURNSTILE_SITE_KEY is set
```

Submit the real form with your own email. Verify:
- Form displays "Request received" success state
- Email arrives within 5 minutes with `verbara-developer-{uuid}.lic` attachment
- The `.lic` file's JSON has `Tier: 1`, `Features: 511`, `MaxAgents: 5`, `MaxNodes: 1`
- D1 has a row: `npx wrangler d1 execute verbara-license-audit --remote --command "SELECT email, tier, expires_at FROM license_audit ORDER BY issued_at DESC LIMIT 5"`

## Step 9 — Distribute the public key to Pro consumers

The customer's deployed `Verbara.Sdk.Pro` runtime needs the **public** key to validate `.lic` files. There are two distribution paths:

1. **Embed in Pro NuGet package** — bake `~/.verbara/keys/public.pem` into a constant in `Verbara.Sdk.Pro.Licensing`. Ship a new Pro version (e.g., `2.2.0-pro`) with the embedded key. All Pro consumers automatically pick up the key on next NuGet update.
2. **Configurable via Pro options** — customers configure `LicenseOptions.PublicKeyPem` themselves from a copy of `public.pem` we provide. More flexible but adds a step to customer setup.

Option 1 is recommended for the launch. Tracked separately from this runbook in the Pro plan as a follow-up task.

⚠️ **Critical:** Once the public key is shipped to consumers, you can NEVER rotate the private key without breaking every previously-issued `.lic`. Treat the keypair as permanent for the life of the v1 product. Plan key-rotation strategy (e.g., dual-signing during a rollover window) before scale.

## Step 10 — Smoke test parity with the .NET LicenseGenerator (Phase 5 of the bootstrap plan)

To rule out drift between the TS Worker signer and the .NET CLI signer, run BOTH against the same parameters and compare:

```sh
# Reference license from .NET tool (uses the SAME private.pem — SEC1 OK for the .NET side)
dotnet run --project /path/to/Verbara.Sdk.Pro/tools/Verbara.Sdk.Pro.LicenseGenerator -- --create \
  --licensee "smoke@example.com" \
  --tier Developer \
  --expires 2026-06-08 \
  --max-agents 5 \
  --max-nodes 1 \
  --private-key ~/.verbara/keys/private.pem \
  --output /tmp/dotnet-issued.lic

# Real license from the Worker (substitute a valid Turnstile token)
curl -s -o /tmp/worker-issued.lic https://verbara.io/api/developer-license \
  -X POST -H "Content-Type: application/json" \
  -d '{"email":"smoke@example.com","fullName":"Smoke","eulaAccepted":true,"captchaToken":"<valid>"}'

# Compare structure (LicenseId / Signature differ; Tier/Features/MaxAgents/MaxNodes/expiry-format must match)
jq 'del(.LicenseId, .Signature)' /tmp/dotnet-issued.lic | tee /tmp/dotnet-canonical
jq 'del(.LicenseId, .Signature)' /tmp/worker-issued.lic | tee /tmp/worker-canonical
diff /tmp/dotnet-canonical /tmp/worker-canonical
# Expected: no diff (apart from licensee value — Worker uses email, .NET tool uses --licensee verbatim)
```

Then verify both `.lic` files validate against the same public key inside a Pro consumer (see Pro test suite for the validator harness).

## Recovery scenarios

| Scenario | Recovery |
|---|---|
| ECDSA private key lost | Generate new keypair, update Cloudflare Secret + ship Pro update with new public key. **All previously-issued .lic files become invalid.** Email all known customers with new license. |
| ECDSA private key compromised | Rotate immediately. Same recovery path as above + revoke compromised key + audit recent issuances in D1 for fraud. |
| Resend API key compromised | Rotate in Resend dashboard, update `RESEND_API_KEY` Cloudflare Secret. No customer impact (Resend keys only enable sending). |
| Turnstile secret key compromised | Rotate in Cloudflare Turnstile dashboard, update `TURNSTILE_SECRET_KEY` Cloudflare Secret + `PUBLIC_TURNSTILE_SITE_KEY` env var. |
| D1 corruption | `npx wrangler d1 backup` is taken automatically; restore via `wrangler d1 restore`. |
| Worker emits 5xx errors | Check `npx wrangler tail --format pretty` for live logs. |

## Cost monitoring

Expected free-tier usage at low launch volume (~50 issuances/month):

| Resource | Free tier | Expected use |
|---|---|---|
| Workers (function invocations) | 100k/day | ~50/day = 0.05% |
| D1 (writes) | 100k/day | ~50/day = 0.05% |
| KV (writes) | 1k/day | ~50/day = 5% |
| Resend (emails) | 3k/month | ~50/month = 1.7% |

You won't hit any free-tier limit at launch volume. First scaling cost would be Resend Pro ($20/mo for 50k emails) at ~3000 issuances/month, which means product-market fit was reached.
