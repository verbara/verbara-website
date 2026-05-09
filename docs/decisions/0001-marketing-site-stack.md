# ADR-0001: Marketing Site Stack — Astro + Cloudflare + Resend ($0 baseline)

- **Status:** Accepted
- **Date:** 2026-05-09
- **Deciders:** Verbara maintainer (Harol A. Reina H.)
- **Related:**
  - Pro plan: [`Verbara.Sdk.Pro/docs/plans/active/2026-05-09-marketing-site-bootstrap.md`](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/plans/active/2026-05-09-marketing-site-bootstrap.md)
  - Pro research: [`Verbara.Sdk.Pro/docs/research/2026-05-09-marketing-site-stack-options.md`](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/research/2026-05-09-marketing-site-stack-options.md)
  - Pro spec: [`Verbara.Sdk.Pro/docs/specs/2026-05-09-developer-license-issuer-contract.md`](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/specs/2026-05-09-developer-license-issuer-contract.md)
  - Pro ADR-0010: tier model (canonical 6 tiers)

## Context

The Verbara stack needs a public marketing site at `verbara.io` to (a) explain the product to prospects, (b) display the canonical 6-tier pricing per Pro ADR-0010, (c) self-issue free Tier 0.5 Pro Developer licenses to evaluators, and (d) host EULA / Privacy / Terms placeholder pages until the formal documents are drafted.

Constraints:

- **$0 initial monthly cost** (the maintainer is pre-revenue and operating without a budget for legal/trademark/hosting)
- **No new vendor relationships** if avoidable (already on Cloudflare for verbara.io DNS + Email Routing)
- **No JS-heavy SPA bundle** for marketing — fast first paint matters for SEO and conversion
- **Reasonable path to scale** without rewriting (free tier should cover ~50 paying customers + ~3000 evaluators/month)
- **TypeScript-friendly** (consistent with the rest of the stack: Verbara.Platform.Web is React/TS, Pro tooling is .NET; team comfort with TS for the Worker backend)

A 5-layer comparison was performed (see Pro research doc): site generator, hosting, backend, email, analytics. The chosen stack is below.

## Decision

```
Stack
├── Domain ─────────── verbara.io (NameCheap)                    $13/yr
├── DNS + CDN ──────── Cloudflare                                $0
├── Email Routing ──── Cloudflare (inbound)                      $0
├── Site Generator ─── Astro 6.x                                 $0
├── Hosting ────────── Cloudflare Pages                          $0
├── Backend ────────── Cloudflare Pages Functions (Workers)      $0
├── Database ───────── Cloudflare D1 (SQLite)                    $0
├── Outbound Email ─── Resend                                    $0 up to 3k/mo
├── Analytics ──────── Cloudflare Web Analytics                  $0
├── Captcha ────────── Cloudflare Turnstile                      $0
└── Repo + CI ──────── GitHub + GitHub Actions                   $0 (public repo)
```

**Total monthly cost: $0** for the first ~50 paying customers / ~3,000 evaluators per month. First scaling cost would be Resend Pro ($20/mo for 50k emails) when evaluator volume grows.

### Repo + visibility

- **Public from day 1** (no benefit to private; marketing exists to be seen)
- **MIT licensed** (consistent with the SDK; signals open-core; allows community contributions to copy/translation/blog content)
- **Repo name `verbara-website`** — deliberately NOT `verbara-web` (collision risk with `Verbara.Platform.Web`)

### License-issuer architecture (consequential design choice)

The Tier 0.5 Pro Developer self-issuance flow needs ECDSA P-256 signing of `.lic` files. There is an existing .NET implementation (`Verbara.Sdk.Pro/tools/Verbara.Sdk.Pro.LicenseGenerator`) that signs `.lic` files for paid tiers. To run signing on Cloudflare Workers (free tier, integrated with the marketing-site Pages Functions), the signing logic is **reimplemented in TypeScript using Web Crypto API** (~30 lines of code).

This creates two implementations of the same signing operation. Mitigation:

1. The TS path is **restricted to Tier 0.5 only** — single tier, fixed feature set (`LicenseFeature.All`), fixed caps (5 agents / 1 node), fixed expiry (30 days), `WarnOnly` enforcement. No path-specific logic differs.
2. Paid tiers (Tier 1-5) **stay manual** via the .NET `LicenseGenerator` triggered by Stripe payment notification (per Pro plan Phase 3.2).
3. A daily Wrangler scheduled trigger compares the public-key fingerprint between the Worker's signing key and a static expected fingerprint stored in this repo — drift detection.
4. Phase 5.3 of the Pro bootstrap plan includes a smoke test that issues a Tier 0.5 license via both paths (TS Worker and .NET CLI) and asserts byte-equivalent JSON modulo random `LicenseId` and signature.

The single canonical `LicenseValidator` in `Verbara.Sdk.Pro.Licensing` validates `.lic` files from either path identically (the validator does not care which signer produced the bytes; it only verifies the ECDSA signature and Tier↔Features cross-check).

## Consequences

**Positive:**
- Zero monthly cost up to ~3,000 emails/month and ~100k Worker requests/day — covers months/years of pre-revenue operation.
- Reuses sunk Cloudflare infrastructure (DNS, Email Routing) — no new vendor relationships.
- Astro's static-first rendering produces near-zero-JS marketing pages — fast Lighthouse scores out of the box, good SEO baseline.
- Pages Functions on the same Workers runtime as the issuer backend means single deployment artifact (Cloudflare Pages handles both static + functions).
- TypeScript end-to-end (frontend Astro + backend Workers).
- Public repo + MIT license aligns with the "open-core honest" narrative.

**Negative:**
- Two implementations of license signing logic (TS in Worker for Tier 0.5, .NET in `LicenseGenerator` for paid tiers) — drift risk.
- Cloudflare Web Analytics is less feature-rich than PostHog or Plausible (no funnel / cohort / session-replay) — adequate for v1, may need to revisit when the funnel matures.
- Resend free tier is 3,000 emails/month — Tier 0.5 self-issuance is the dominant email volume; at ~100 evaluators/month the free tier suffices, but a launch-day spike could hit the cap.
- All vendors except Resend are Cloudflare — single-vendor concentration risk (mitigated: the stack is portable; static site can be redeployed to Vercel / Netlify in <30 min if Cloudflare has a major incident).

**Trade-off:**
- Trades **architectural purity** (single canonical signer) for **$0 cost + sub-100ms latency** for the high-volume free-tier path. Acceptable given the mitigations and the constrained scope of the TS path.
- Trades **richer analytics** (PostHog, Plausible) for **$0 + privacy-respecting + no cookie banner**. Acceptable for v1.

## Alternatives considered

- **Next.js + Vercel** — best React DX, but Vercel Hobby ToS restricts commercial use ($20/mo Pro for safety) and the bundle size is larger than Astro's static output. Rejected for v1.
- **Eleventy + Cloudflare Pages** — simplest static generator, but no React island support means we'd hand-write the Tier 0.5 form in vanilla JS. Rejected for component reuse later.
- **Hugo + Cloudflare Pages** — fastest builds, but Go template syntax is unfamiliar and limits future flexibility. Rejected.
- **GitHub Actions as the issuer** (reuse .NET tool) — eliminates the TS signer drift risk but adds ~30s latency per issuance and feels architecturally weird (CI used as serving infrastructure). Rejected; smoke-test cron + restricted-tier scope are preferred mitigations.
- **$5/mo Hetzner CX11 VPS running ASP.NET Minimal API** — reuses .NET signer with no drift, but adds $5/mo (breaks the $0 constraint) plus ops overhead (TLS, monitoring, restarts). Rejected for v1; revisit if Workers free-tier proves insufficient.
- **Postmark instead of Resend** — better deliverability reputation, but $15/mo from day 1 (no free tier beyond a 100-email trial). Rejected for v1; pivot if Resend deliverability becomes a problem.
- **Self-hosted Plausible analytics** — privacy-first + featureful, but requires a $5/mo VPS or container hosting. Rejected for v1.
- **Mirror the marketing pages inside `Verbara.Platform.Web`** — initially considered, but rejected on the grounds documented in the SDK auto-memory `feedback_platform_web_is_operator_ui.md`: Platform.Web serves authenticated operators of deployed customers, not public prospects. Conflating audiences would bloat the bundle, confuse the operator UI, and entangle deploy concerns.

## Status update

(append-only; do not modify the original ADR text above)

- **2026-05-09**: ADR Accepted. Phase 0 of the Pro bootstrap plan executed: repo created (`verbara/verbara-website`), Astro scaffold pushed with placeholder landing, MIT LICENSE, README, CONTRIBUTING (DCO), and this ADR.
- **2026-05-09 — Phase 0 deferrals (compatibility):**
  - **`@astrojs/cloudflare` adapter** intentionally NOT installed. Astro 6.3 + adapter v13 has a runtime incompat (`require_dist is not a function`). The adapter is required only for Pages Functions in Phase 3 (Tier 0.5 issuer endpoint). Deferred to Phase 3 with a pinned-version verification step before re-adding.
  - **Tailwind CSS** intentionally NOT installed. `@tailwindcss/vite@4.x` + Astro 6.3 (Vite 7 internally) has a config mismatch (`Missing field 'tsconfigPaths' on BindingViteResolvePluginConfig.resolveOptions`). Phase 0 placeholder uses plain CSS in `src/styles/global.css`. Phase 1 will re-evaluate: either pin to compatible @tailwindcss/vite version OR adopt `@astrojs/tailwind` integration with Tailwind v3 (more conservative, more compatible).
  - The static-only Phase 0 build succeeds in <500ms with zero warnings — the deferrals do not block the milestone.

## References

- Pro plan: `2026-05-09-marketing-site-bootstrap.md`
- Pro research: `2026-05-09-marketing-site-stack-options.md`
- Pro spec: `2026-05-09-developer-license-issuer-contract.md`
- Pro ADR-0010: canonical 6-tier model
- SDK auto-memory `project_2026_05_09_marketing_site_plan.md` (cross-session persistence)
