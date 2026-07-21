# Architecture — verbara-website

> **Role:** the public Verbara marketing **+ trust** site (`verbara.io`) — a standalone spoke in
> the Verbara chain, not a link in `Sdk → Sdk.Pro → Platform ← Platform.Web`. Public, MIT-licensed
> source. It ships no product IP; its one load-bearing asset is the published list of authentic
> Platform image digests customers verify releases against.

This is the repo Charter's companion spec: it captures how the site is actually built and the
Gate Contract (§5 + [`gates.yaml`](../../gates.yaml)) that turns those principles into build
failures. It closes the ADR-0014 §1 (charter prose) + §2 (gate manifest) documentation gap for
this repo.

## 1. Role & boundaries

verbara-website owns the **outward face** of the ecosystem — marketing pages, pricing, use-case
narratives, legal docs — and the **trust surface**: the developer-license issuer and the
authorized-image-digest registry that every Platform release must update.

- **It owns:** the Astro site (`src/`), the "Signal" dark design system, the three locales
  (`src/i18n/`), the Cloudflare edge backend (`src/worker.ts` + `functions/api/`), the D1 schema
  (`migrations/`), and `data/authorized-digests.json` — the published source of truth for authentic
  Verbara Platform image digests.
- **It must NOT reach into** the code repos: it consumes no Verbara NuGet packages, imports no
  Platform/SDK types, and holds no product IP. Its only cross-repo contract is *data*, one-directional:
  a Platform release publishes its manifest-list digests **here** (via `/xr:release`), and Pro's
  license image-binding (`Verbara.Sdk.Pro` ADR-0011) validates customer pulls against the list this
  site serves. The coupling is `http-contract` / `data`, never `nuget` (see verbara-meta
  `config/build-chain.yaml`).
- **Chain placement:** `standalone`. Nothing builds on top of it; it builds on top of nothing. It
  is decoupled from the .NET build order and releases on its own cadence.

## 2. Architecture style

**Astro static site + a Cloudflare edge backend** — deliberately *not* a plain static site, and
deliberately *not* a Pages project.

- **Static front end:** Astro 6 emits a fully static `dist/` (`npm run build`). Pages are
  `.astro` templates under `src/pages/`, composed from a two-tier component library —
  `src/components/primitives/` (Button, Card, Section, Heading, Badge, Container, CodeBlock) and
  `src/components/composites/` (Hero, NavBar, Footer, pricing/use-case blocks). Styling is
  TailwindCSS 4, CSS-first via `@tailwindcss/vite` and an `@theme` block (there is **no**
  `tailwind.config.js`). Islands only where interactivity is real (the developer-license form).
- **Edge backend — Workers + Static Assets (not Pages Functions auto-routing):** Cloudflare
  deployed the site as a **Worker** (`name = "verbara-website"`), because the account has no Pages
  project. `src/worker.ts` is the `main` entry: it serves `dist/` via the `ASSETS` binding and
  **manually routes** `/api/developer-license` to the handler in
  `functions/api/developer-license/`. That bridge lets the existing Pages-style function code run
  unchanged inside the Workers runtime. See `wrangler.toml` and `docs/decisions/0001-*`.
- **Stateful edge:** **D1** (SQLite) via `migrations/` — `license_audit` (append-only issuance
  log) + `authorized_image_digests` (mirror of the JSON registry). **KV** for per-IP rate-limit
  counters. Outbound email via Resend. A daily **cron** (`[triggers] crons` in `wrangler.toml`,
  `src/drift-detection.ts`) re-resolves each authorized digest against ghcr.io.
- **Hub-and-spoke content model** (ADR-0002): a marketing hub plus use-case spokes, each spoke
  self-contained and cross-linked, so pages compose from shared composites rather than duplicating
  layout.

## 3. Design principles (as actually practised here)

Not a SOLID lecture — the shapes this repo genuinely enforces:

- **One-responsibility, reused components — no ad-hoc markup.** Primitives are the only place raw
  Tailwind utility soup lives; pages and composites consume primitives. A new page assembles
  existing composites; it does not re-hand-roll a card or a section. This is what keeps Lighthouse
  accessibility ≥ 0.95 achievable across 11 audited routes (`lighthouserc.json`).
- **Reuse the shape, don't redefine it.** `AuthorizedDigestEntry` + `loadRegistry` are defined once
  in `functions/api/developer-license/authorized-digests.ts`; the drift cron (`src/drift-detection.ts`)
  and the license handler both import that type. The digest schema has exactly one source of truth.
- **Locale parity is structural, not aspirational.** Every user-facing string is a key in
  `src/i18n/messages.ts` present in **all three** locales (EN-US, ES-419, PT-BR). No inline copy in
  templates; `src/i18n/utils.ts` resolves locale + path. Adding a string means adding it to all
  three — enforced (G5).
- **Locale-proof tests.** E2E assertions target `data-*` attributes, never localized/dynamic text —
  a test must pass identically in three languages.
- **Security-critical data is code, reviewed and guarded — never hand-waved.**
  `data/authorized-digests.json` has an exact 4-key shape (`platform_version`, `image_ref`,
  `manifest_list_digest`, `released_at`), a `current`/`deprecated` split, no cross-group duplicates,
  and digests that must be real published manifest-list hashes. It is validated at edit time (G5)
  and re-verified at runtime by the cron. A forged digest is a customer trusting an image they never
  agreed to — so it is treated as the highest-stakes artifact in the repo.
- **Hermetic build, secrets out of the tree.** The public Turnstile key is baked at build; real
  secrets live in `~/.verbara/secrets.env` / CF bindings, never in the repo. Workers Builds deploys
  `main` hermetically.

## 4. Constraints & banned deps

- **No product IP, no Verbara package references.** This is a public MIT marketing repo; it must
  never import from the SDK/Pro/Platform. It is outside the Native-AOT / no-Dapper regime that binds
  the .NET repos (verbara-meta ADR-0022) precisely *because* it ships no .NET and no closed IP — the
  ban is N/A here by role, not by exemption.
- **No Pages-Functions assumption.** Do not add `functions/`-based auto-routing expecting Cloudflare
  to wire it; this account deploys a Worker. New endpoints route through `src/worker.ts`.
- **No hand-edited digests.** `manifest_list_digest` values come from real published releases (the
  `/xr:release` train), never invented. New release → `current`; prior minor → `deprecated`.
- **No shipped-migration edits.** D1 schema changes are new numbered files in `migrations/`.
- **Strict HTML.** `html-validate` runs on the built `dist/`; bare `>` in text content fails —
  escape (`&gt;`) or restructure. Always `build` before `validate:html`.
- **Lint is zero-tolerance in CI.** `eslint .` (js + typescript-eslint + eslint-plugin-astro) must
  pass; the ecosystem's warnings-as-errors posture (verbara-meta ADR-0003) is instantiated here as a
  green ESLint + `astro check` gate.

## 5. The Gate Contract

Each principle above is backed by a gate that **fails the build** when it is violated. The
machine-checkable manifest is [`gates.yaml`](../../gates.yaml) (ADR-0014 §2, classes G1–G8);
this table is its human-readable index. CI lives in `.github/workflows/ci.yml` (jobs `quality`,
`test`, `coverage`, `e2e`, `lighthouse`, `openspec`) + `.github/workflows/codeql.yml`.

| Invariant (principle) | Gate that enforces it | CI job / script |
|---|---|---|
| Types + templates compile clean; site actually builds | `astro check` + `astro build` + full e2e/Lighthouse render | `quality` (`check`, `build`), `e2e`, `lighthouse`, `test` |
| Lint clean (warnings-as-errors posture) | ESLint (js + ts-eslint + astro) | `quality` (`lint`) |
| Testable logic stays covered (patch + two-sided band + no denominator gaming) | coverage-gate-v2 triplet (ADR-0013) over the vitest v8 report | `coverage` (`check-patch-coverage.py`, `check-coverage-floor.py`, `check-exclusion-baseline.py`) |
| **Authorized image digests are well-formed & non-forged** | structural digest guard | `quality` (`validate:digests` → `scripts/validate-authorized-digests.mjs`) |
| Every string exists in all 3 locales | i18n parity gate | `quality` (`test:i18n` → `scripts/check-i18n-parity.mjs`) |
| Built HTML is valid | `html-validate` on `dist/` | `quality` (`validate:html`) |
| Perf / a11y / best-practices / SEO don't regress | Lighthouse CI minScore budgets | `lighthouse` (`test:lhci`, `lighthouserc.json`) |
| Living OpenSpec docs parse | `openspec validate --all --strict` | `openspec` |
| Source has no known vuln patterns | CodeQL SAST (`security-extended`) | `codeql.yml` |
| Dependencies stay patched | Dependabot (npm + actions, weekly, grouped) | `.github/dependabot.yml` |
| Registry-side digest mutation is caught post-deploy | daily drift cron (runtime, not CI) | `src/drift-detection.ts` (`[triggers] crons`, 03:17 UTC) |

## 6. Testing conventions

- **Unit tier (vitest 4, `node` env):** `tests/unit/**` — the framework-free logic only: the digest
  validator, i18n path helpers + parity, the Cloudflare license handler, and the drift cron. Astro
  templates are *not* unit-tested (they're covered by e2e + Lighthouse); `vitest.config.ts` scopes
  coverage to `scripts/**`, `functions/**`, `src/drift-detection.ts`, `src/i18n/utils.ts`.
- **Coverage (ADR-0013 triplet):** authoritative floors in `coverage-floor.json` (line band
  `[96, 99]`, branch ≥ 90, patch ≥ 85, `lines_valid_min` 300). `coverage-exclusion-baseline.json`
  fails the build on any net-new `c8 ignore` marker. `vitest.config.ts` `thresholds` (86/90/84/86)
  are a redundant fast-fail liveness backstop, deliberately kept under the achieved numbers.
- **E2E (Playwright):** `tests/e2e/**` across chromium + firefox + webkit. Selectors are `data-*`
  (locale-proof); never `toContainText` on dynamic/localized copy. An expected Turnstile `pageerror`
  is filtered on purpose — do not "fix" that filter.
- **Lighthouse CI:** 11 routes audited (`lighthouserc.json`), asserting performance ≥ 0.90,
  accessibility ≥ 0.95, best-practices ≥ 0.95, SEO = 1.0.
- **HTML validation:** `html-validate` on built `dist/` (`.htmlvalidate.json`).

## 7. Where decisions live

- **ADRs** — `docs/decisions/`: `0001` marketing-site stack (Astro + Cloudflare + Resend),
  `0002` hub-and-spoke architecture, `0003` no-CHANGELOG/no-tags (releases tracked via
  authorized-digests + PR titles). Related: `Verbara.Sdk.Pro` ADR-0011 (image-digest license
  binding — the consumer of this site's registry).
- **Specs** — `docs/specs/`: this file, plus the redesign + Phase-F hub-and-spoke design docs.
- **Cross-repo standards** — the private **verbara-meta** repo: ADR-0003 (CI-gating baseline),
  ADR-0013 (coverage-gate-v2), ADR-0014 (repo-admission + the G1–G8 Gate Contract this manifest
  instantiates), ADR-0022 (Native-AOT/no-Dapper — N/A here by role).
- **Contributor guidance** — `CLAUDE.md` (local-only, gitignored in this public repo) +
  `.claude/agents/astro-cloudflare-expert.md` (the repo's expert agent: Astro/Tailwind/Cloudflare,
  i18n parity, the digest security model). `CONTRIBUTING.md` for the human contributor flow.
