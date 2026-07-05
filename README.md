# Verbara Website

> Marketing site for the **Verbara** open-core contact-center platform — `verbara.io`.

Public-facing static site built with [Astro 6](https://astro.build) on the [Tailwind v4](https://tailwindcss.com) "Signal" design system, deployed as a [Cloudflare Worker](https://workers.cloudflare.com) with the Static Assets pattern, with form submissions handled by a bridged Pages-Function endpoint backed by [D1 SQLite](https://developers.cloudflare.com/d1/) (audit log) + [KV](https://developers.cloudflare.com/kv/) (rate-limit) and outbound transactional email via [Resend](https://resend.com).

This repository is **not** the contact-center product itself — it is the marketing site that prospects and evaluators visit. The product lives in:

| Repository | License | Role |
|---|---|---|
| **Verbara Sdk** | MIT | Telephony primitives (AMI / AGI / ARI / Live API / Sessions / Voice AI) — community attractor |
| **Verbara Web** (`Verbara.Platform.Web`) | Apache 2.0 (when public) | Frontend UI (admin / agent / analytics / operations) — the product's operator UI |
| **Verbara Platform** | Apache 2.0 (when public) | Backend application — full contact-center engine |
| **Verbara Sdk Pro** | Commercial | Enterprise overlays (multi-tenant, analytics, cluster, licensing) |
| **Verbara Website** (this repository) | **MIT** | Marketing site at verbara.io |

For licensing, tier model, and how Pro features are gated, see [Verbara.Sdk.Pro/docs/decisions/0010-tier-model-canonical-6-tiers.md](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/decisions/0010-tier-model-canonical-6-tiers.md).

## Status (2026-05-10 — LIVE, redesign complete)

✅ **`https://verbara.io/`** is publicly serving 12 route templates × 3 locales (es-419 / en-US / pt-BR) = 36 routes.
✅ **Signal redesign shipped end-to-end** (5 phases + 2 hotfixes, PRs #2-#8 merged 2026-05-09 → 2026-05-10):
  - Phase A — Design system foundation (tokens, fonts, 7 primitives, NavBar/Footer, testing CI)
  - Phase B — Home narrative (7 sections × 3 locales: Hero, AntiPositioningTable, ArchitectureDiagram, CodeProof, PricingTeaser, FAQ, FinalCta)
  - Phase C — Pricing Layout A (3 tier groups + 8×10 comparison matrix + 3 pricing-FAQ)
  - Phase D — Developer-license polish + Legal pages with `LegalDoc` layout + cross-Phase cleanup
  - Phase E — Brand assets (V-mark + 3 lockup SVGs + favicon set + OG image), sitemap, robots.txt, full meta tags
  - Plans archived in [`docs/plans/completed/`](docs/plans/completed/). Spec at [`docs/specs/2026-05-09-website-redesign.md`](docs/specs/2026-05-09-website-redesign.md).
✅ **Tier 0.5 Pro Developer self-issuance loop end-to-end operational**:
  - Form at `/developer-license/` with Cloudflare Turnstile (single-column layout, what-you-get panel above)
  - Worker backend at `/api/developer-license/` (ECDSA P-256 signing, D1 audit log, Resend email)
  - Validating consumer ships in [Verbara.Sdk.Pro v2.2.0-pro](https://github.com/verbara/Verbara.Sdk.Pro/releases/tag/v2.2.0-pro) (`LicenseTrustAnchor`)

✅ **Quality gates in CI** (`.github/workflows/ci.yml`): `astro check`, ESLint, html-validate, i18n parity (476 keys × 3 locales), Playwright e2e (107 cases × chromium + firefox + webkit = 321 tests), OpenSpec validate, Lighthouse CI thresholds (Perf ≥ 0.9, A11y ≥ 0.95, BP ≥ 0.95, SEO = 1.0).

The original bootstrap plan that brought the site online lives at [Verbara.Sdk.Pro/docs/plans/completed/2026-05-09-marketing-site-bootstrap.md](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/plans/completed/2026-05-09-marketing-site-bootstrap.md). Operator setup runbook for the issuer Worker is at [`docs/operations/issuer-setup.md`](docs/operations/issuer-setup.md).

### Deploy

Cloudflare Workers Builds auto-deploys on every push to `main`. The build is hermetic — `astro.config.mjs` hardcodes the public Turnstile site key via `vite.define`, so no env-var injection is required at the CF auto-build pipeline.

For a manual deploy from a developer machine (e.g. preview a branch before opening a PR):

```sh
npm run deploy
# = rm -rf dist + astro build + npx wrangler deploy
# Reads CLOUDFLARE_API_TOKEN from ~/.verbara/secrets.env.
# Optionally injects PUBLIC_TURNSTILE_SITE_KEY from ~/.verbara/secrets.env to
# override the hardcoded default (only needed for staging / non-prod tenants).
```

## Stack

| Concern | Choice | Cost |
|---|---|---|
| Site generator | Astro 6.3 (static output) | $0 |
| Hosting + CDN | Cloudflare Workers + Static Assets | $0 (unlimited bandwidth) |
| Backend (license issuer) | Cloudflare Pages-style Function bridged into the Worker | $0 (100k req/day free) |
| Database (audit log) | Cloudflare D1 SQLite | $0 (5 GB / 100k writes/day free) |
| Rate-limit store | Cloudflare KV | $0 |
| Outbound email | Resend | $0 (3000 emails/mo free) |
| Analytics | Cloudflare Web Analytics | $0 (unlimited, privacy-respecting) |
| Captcha | Cloudflare Turnstile | $0 (unlimited) |
| Styling | Tailwind v4.3 via `@tailwindcss/vite` (Signal design tokens via `@theme`) | $0 |
| Fonts | Geist Sans + Geist Mono self-hosted (SIL OFL 1.1) | $0 |
| Sitemap | `@astrojs/sitemap` (auto-generated at build) | $0 |
| Domain | verbara.io (NameCheap) | $13/yr |

**Total monthly cost: $0** until ~3,000 emails/month or ~100k Worker requests/day. See full analysis in [Verbara.Sdk.Pro/docs/research/2026-05-09-marketing-site-stack-options.md](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/research/2026-05-09-marketing-site-stack-options.md).

## Quick start

```sh
# Install (Node ≥22.12)
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Project structure

```
verbara-website/
├── src/
│   ├── pages/                    # Astro pages (root es-419 + [lang]/ for en-US, pt-BR)
│   ├── components/
│   │   ├── primitives/           # 7 design-system primitives (Button, Badge, Card, CodeBlock, Section, Container, Heading)
│   │   ├── composites/           # 19 page-level composites (NavBar, Footer, Hero, AntiPositioningTable, ArchitectureDiagram, CodeProof, PricingTeaser, Faq, FinalCta, TierCard, TierGroup, ComparisonMatrix, LegalDoc, SolutionsOverview, SpokeAntiPositioning, SpokeCodeProof, SpokePricingPointer, UseCaseHero, UseCaseIndexCard) + pricing-types.ts
│   │   └── DeveloperLicenseForm.astro
│   ├── i18n/                     # messages.ts (476 keys × 3 locales) + utils.ts
│   ├── layouts/                  # Layout.astro (composes NavBar + Footer; full meta-tag set)
│   ├── styles/                   # global.css (Tailwind v4 @theme tokens, @font-face, .legal-doc prose)
│   └── worker.ts                 # Cloudflare Worker entry (bridges Pages-style functions/)
├── functions/api/developer-license/index.ts   # License issuer (ECDSA + D1 + KV + Resend)
├── public/
│   ├── brand/                    # verbara-{mark,wordmark,lockup}.svg
│   ├── fonts/                    # Geist Sans + Mono woff2 (self-hosted)
│   ├── og/                       # _template.svg → og-default.png (1200×630)
│   ├── {favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, robots.txt}
│   └── ...
├── scripts/
│   ├── generate-icons.mjs        # sharp + png-to-ico → ICO + PNG favicons
│   ├── generate-og.mjs           # sharp → og-default.png
│   └── check-i18n-parity.mjs     # CI gate
├── tests/e2e/                    # 11 Playwright spec files, 107 cases × 3 browsers
├── docs/                         # Option K layout
│   ├── decisions/                # ADRs
│   ├── plans/                    # active / completed / archived
│   ├── specs/                    # Technical designs (incl. 2026-05-09-website-redesign.md)
│   └── research/                 # Exploratory findings
├── .github/workflows/ci.yml      # 4 jobs: quality, e2e, lighthouse, openspec
├── astro.config.mjs              # Astro + Tailwind + sitemap integration + Turnstile vite.define
├── wrangler.toml                 # Cloudflare Worker config (D1 + KV + ASSETS bindings)
├── lighthouserc.json             # LHCI thresholds
├── eslint.config.mjs             # ESLint flat config (with scripts/ Node globals override)
├── playwright.config.ts          # 3-browser e2e config
├── tsconfig.json                 # TypeScript strict
└── package.json                  # npm scripts: dev, build, preview, deploy, check, lint, test:i18n, test:e2e, test:lhci, test:all, brand:icons, brand:og
```

## i18n

Three locales, baseline `es-419`:

- `es-419` (default, Spanish — LATAM)
- `en-US` (English)
- `pt-BR` (Portuguese — Brazil)

Astro's native i18n routing is used (no separate library). All locales must remain in parity — `scripts/check-i18n-parity.mjs` flattens every key across the three locale objects and exits non-zero on any missing/extra/empty key. The check runs in CI on every PR. Current footprint: **476 keys × 3 locales**.

EN-US is the canonical authoring locale; ES-419 and PT-BR are human translations preserving voice/tone (see [`docs/specs/2026-05-09-website-redesign.md`](docs/specs/2026-05-09-website-redesign.md) §8 for the voice-and-tone rules + buzzword blacklist).

## Contributing

This is a public open-source repository. PRs welcome for:

- Copy improvements (typo fixes, clarity, translations)
- New blog posts (when blog launches)
- Accessibility improvements
- Performance optimizations

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the contribution model (DCO sign-off required).

For licensing inquiries: `licensing@verbara.io`.
For security disclosures: `security@verbara.io`.
For general contact: `hello@verbara.io`.

## Trademark

"Verbara" is a trademark of Harol A. Reina H. and Verbara Contributors. "Asterisk" is a registered trademark of Sangoma Technologies / Digium and refers to the Asterisk PBX product (a runtime dependency of the Verbara stack, not affiliated).

## License

MIT — see [`LICENSE`](LICENSE).
