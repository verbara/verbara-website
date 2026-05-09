# Verbara Website

> Marketing site for the **Verbara** open-core contact-center platform — `verbara.io`.

Public-facing static site built with [Astro 6](https://astro.build), deployed on [Cloudflare Pages](https://pages.cloudflare.com), with form submissions handled by [Cloudflare Workers](https://workers.cloudflare.com) + [D1 SQLite](https://developers.cloudflare.com/d1/) and outbound transactional email via [Resend](https://resend.com).

This repository is **not** the contact-center product itself — it is the marketing site that prospects and evaluators visit. The product lives in:

| Repository | License | Role |
|---|---|---|
| **Verbara Sdk** | MIT | Telephony primitives (AMI / AGI / ARI / Live API / Sessions / Voice AI) — community attractor |
| **Verbara Web** (`Verbara.Platform.Web`) | Apache 2.0 (when public) | Frontend UI (admin / agent / analytics / operations) — the product's operator UI |
| **Verbara Platform** | Apache 2.0 (when public) | Backend application — full contact-center engine |
| **Verbara Sdk Pro** | Commercial | Enterprise overlays (multi-tenant, analytics, cluster, licensing) |
| **Verbara Website** (this repository) | **MIT** | Marketing site at verbara.io |

For licensing, tier model, and how Pro features are gated, see [Verbara.Sdk.Pro/docs/decisions/0010-tier-model-canonical-6-tiers.md](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/decisions/0010-tier-model-canonical-6-tiers.md).

## Status (2026-05-09)

**Phase 0 of the bootstrap plan.** The repo and Astro scaffold exist; landing page is a "site under construction" placeholder. Subsequent phases (skeleton pages, Tier 0.5 Developer license portal, license-issuer Worker backend, deploy + DNS) are tracked in [Verbara.Sdk.Pro/docs/plans/active/2026-05-09-marketing-site-bootstrap.md](https://github.com/verbara/Verbara.Sdk.Pro/blob/main/docs/plans/active/2026-05-09-marketing-site-bootstrap.md).

## Stack

| Concern | Choice | Cost | Phase |
|---|---|---|---|
| Site generator | Astro 6.x | $0 | ✅ Phase 0 |
| Hosting + CDN | Cloudflare Pages | $0 (unlimited bandwidth) | ⏳ Phase 4 |
| Backend (license issuer) | Cloudflare Pages Functions on Workers | $0 (100k req/day free) | ⏳ Phase 3 |
| Database (audit log) | Cloudflare D1 SQLite | $0 (5 GB / 100k writes/day free) | ⏳ Phase 3 |
| Outbound email | Resend | $0 (3000 emails/mo free) | ⏳ Phase 3 |
| Analytics | Cloudflare Web Analytics | $0 (unlimited, privacy-respecting) | ⏳ Phase 4 |
| Captcha | Cloudflare Turnstile | $0 (unlimited) | ⏳ Phase 2 |
| Styling | Tailwind CSS (deferred — see ADR-0001 status update) | $0 | ⏳ Phase 1 |
| Domain | verbara.io (NameCheap) | $13/yr | ✅ already held |

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
│   ├── pages/          # Astro pages (.astro / .md / .mdx)
│   ├── components/     # Shared UI components (when added)
│   └── styles/         # Tailwind entry + brand tokens
├── functions/          # Cloudflare Pages Functions (license-issuer Worker, etc.)
├── public/             # Static assets (favicons, OG images, etc.)
├── docs/               # Project docs (Option K layout)
│   ├── decisions/      # ADRs
│   ├── plans/          # active / completed / archived
│   ├── specs/          # Technical designs
│   └── research/       # Exploratory findings
├── astro.config.mjs    # Astro + Tailwind + Cloudflare adapter config
├── tsconfig.json       # TypeScript strict
└── package.json
```

## i18n

Three locales, baseline `es-419`:

- `es-419` (default, Spanish — LATAM)
- `en-US` (English)
- `pt-BR` (Portuguese — Brazil)

Astro's native i18n routing is used (no separate library). All locales must remain in parity (a future CI gate will enforce, mirroring the i18n parity check used in `Verbara.Platform.Web`).

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
