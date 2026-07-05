# ADR-0001: Marketing Site Stack — Astro + Cloudflare + Resend ($0 baseline)

- **Status:** Accepted (with 2026-05-09 + 2026-05-10 status updates — see below)
- **Date:** 2026-05-09
- **Deciders:** Verbara maintainer (Harol A. Reina H.)
- **Related:**
  - Pro plan: [`Verbara.Sdk.Pro/docs/plans/active/2026-05-09-marketing-site-bootstrap.md`](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/plans/active/2026-05-09-marketing-site-bootstrap.md)
  - Pro research: [`Verbara.Sdk.Pro/docs/research/2026-05-09-marketing-site-stack-options.md`](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/research/2026-05-09-marketing-site-stack-options.md)
  - Pro spec: [`Verbara.Sdk.Pro/docs/specs/2026-05-09-developer-license-issuer-contract.md`](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/specs/2026-05-09-developer-license-issuer-contract.md)
  - Pro ADR-0010: tier model (canonical 6 tiers)

## Status updates

**2026-05-09 — Hosting model changed from Cloudflare Pages to Cloudflare Workers + Static Assets.** During initial bootstrap, this account didn't have an active Pages project (only Worker scripts). Commit `bd3f2f6 feat(api): bridge Pages-style Function into Workers + Static Assets entry` migrated to the Worker entry pattern: `wrangler.toml` declares `name = "verbara-website"`, `main = "src/worker.ts"`, and `[assets]` binding for the built `dist/`. The Pages-style function under `functions/api/developer-license/` is bridged into the Worker via `src/worker.ts` rather than running as a Pages Function. The trade-offs analysis below is unchanged because Workers + Static Assets has the same cost model and runtime as Pages Functions — only the deployment topology differs.

**2026-05-10 — Tier 0.5 license duration normalized to 60 days.** The original ADR text below describes Tier 0.5 as "fixed expiry (30 days)". During the website redesign (Phase D, PR #6), the developer-license + pricing copy across all three locales was normalized to 60 days for consistency with the home + final-CTA marketing claim. The Worker signing logic (`functions/api/developer-license/index.ts`) and downstream `LicenseValidator` in `Verbara.Sdk.Pro.Licensing` are independent of this duration change — the duration is encoded per-license at issuance time, not hardcoded in the validator.

**2026-05-10 — Tailwind CSS adoption confirmed.** The original ADR ranked Tailwind as "deferred" pending a Phase 1 decision. The "Signal" design system (Phases A–E of the redesign, PRs #2–#7) is built on Tailwind v4.3 via `@tailwindcss/vite` with token-driven `@theme` blocks in `src/styles/global.css`. No subsequent ADR was authored because the choice didn't surface trade-offs that warranted standalone documentation; it lives in the redesign spec at `docs/specs/2026-05-09-website-redesign.md` §4.

**2026-05-10 — Public Turnstile site key moved to repo.** The plan originally implied the Turnstile site key would be injected from `~/.verbara/secrets.env` at deploy time. PR #4 (`fix(deploy): hardcode public Turnstile site key + drop reliance on Cloudflare dashboard`) moved the public key into `astro.config.mjs` via `vite.define`, eliminating the deploy-path race that was wiping the dev-license form on Cloudflare auto-builds. The key is public information by definition (embedded in client HTML); committing it is safe. `process.env` override remains for future per-tenant scenarios.

---

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

- **2026-05-10 — Phase F (hub-and-spoke architecture) shipped.** See ADR-0002 for the architectural decision. The marketing site stack itself (Astro 6 + Cloudflare Workers Sites + D1 + Resend + Cloudflare Web Analytics + Turnstile) is **unchanged** by Phase F — only the content and component graph grew. New surface area: 5 use-case pages (1 index + 4 spokes) × 3 locales = 15 new page renders, 6 new composites, 4 new E2E specs, ~210 new i18n keys. No new vendor relationships, no infra cost delta.

- **2026-05-10 — `html-validate` config: `no-raw-characters` rule disabled** (PR #11). Phase F's spoke code samples include C# lambda arrow operators (`=>`) and generic types (`List<T>`) which Shiki syntax-highlights into HTML with literal `>` characters in text content. Per [HTML5 spec](https://html.spec.whatwg.org/multipage/syntax.html#syntax-text-content), raw `>` is valid in text content — only `<` and `&` require escape, and those are caught by html-validate's `parser-error` rules. The `relaxed` option for `no-raw-characters` was removed in html-validate v9, so disabling the rule entirely is the cleanest fix.

- **2026-05-10 — `tests/e2e/smoke.spec.ts` Turnstile filter extended to `pageerror` handler** (PR #12). PR #8 (commit `564b607`) added the noise filter for `console.error` events; Phase F surfaced an additional code path where Turnstile emits an uncaught exception (`[Cloudflare Turnstile] Error: 400020.`) caught by `pageerror`. The same `isThirdPartyTurnstileNoise()` predicate is now applied to both event handlers.

- **2026-05-10 — Lighthouse a11y threshold (≥ 0.95) requires `text-bone-2` (≥ 65% opacity) for small body text** (PR #13). The first-pass Phase F TierCard `bestFor` line used `text-bone-3` (40% opacity, ~3.3:1 contrast on `--color-ink`) at `text-xs` (12px) — failed WCAG AA 4.5:1 small-text rule. `text-bone-3` remains valid for dividers and `aria-hidden` decorative use only.

- **2026-07-05 — Correction: Tier 0.5 license duration is 30 days, not 60.** The 2026-05-10 status
  update above (duration "normalized to 60 days") was itself superseded by PR #25 (commit
  `7c4da0c`, `fix(marketing): correct free Pro Developer license duration 60->30 days (matches
  issuer)`), which reverted the marketing copy back to 30 days to match the issuer's
  `LICENSE_DAYS = 30` constant (`functions/api/developer-license/index.ts`). All three locales in
  `src/i18n/messages.ts` currently read "30 días" / "30-day" / "30 dias" throughout. The 60-day
  figure is stale wherever it still appears in docs (e.g. `docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md`) and should read 30 days.

## References

- Pro plan: `2026-05-09-marketing-site-bootstrap.md`
- Pro research: `2026-05-09-marketing-site-stack-options.md`
- Pro spec: `2026-05-09-developer-license-issuer-contract.md`
- Pro ADR-0010: canonical 6-tier model
- SDK auto-memory `project_2026_05_09_marketing_site_plan.md` (cross-session persistence)
