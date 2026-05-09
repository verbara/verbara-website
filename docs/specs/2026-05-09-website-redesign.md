# Verbara.io — Website Redesign Spec

**Status:** Draft for review
**Date:** 2026-05-09
**Owner:** Harol A. Reina H.
**Scope:** Complete redesign of `verbara.io` (4 page types × 3 locales) with new brand identity and design system.
**Supersedes:** No previous design spec. Visual baseline today is the Phase 1 default Astro + Tailwind output.

---

## 1. Goals & non-goals

### Goals

1. Establish **positioning** that maps to a real, defensible market segment for an open-core Asterisk-native CCaaS — not generic CCaaS.
2. Replace the placeholder visual identity with a **distinctive brand system** (paleta, tipografía, logo, voice/tone) that reads as serious infrastructure software.
3. Convert the home from a generic landing into a **narrative-led page** that tells "who you are → what you replace → how it works → proof → price → close".
4. Convert the pricing page from a uniform 7-card grid into a **3-pathway grouped layout + comparison matrix** that guides decision and supports power-user comparison.
5. Apply the design system to the **developer-license form** and **legal pages** so the entire site reads as one coherent product.
6. Set up **testing primitives** (astro check, Playwright e2e per locale, Lighthouse CI thresholds) that protect quality going forward.

### Non-goals

- Adding a blog, changelog, or docs hub. Reserved for Phase 2 once content exists.
- Building a customer logos / "who runs Verbara" section. Anti-signal while empty; reserved until real customers can be cited.
- Embedding screenshots of `Verbara.Platform.Web` in the home. Reserved for Phase 2 once stylized captures are produced.
- Embedding a live product sandbox or "make a call now" interactive demo. Reserved for Phase 3+ — high cost, requires real backend coupling.
- Any analytics beyond the Cloudflare Web Analytics already wired in Phase 0.
- Any auth, accounts, or identity flows beyond the existing developer-license self-issuance.

---

## 2. Positioning

The site sits in a single positioning frame derived from cross-category analysis:

**Operator-first, open-core as the proof mechanism, anti-positioning as a tactical hook.**

| Layer | Decision |
|---|---|
| Primary audience | Contact-center **operators**: BPO ops leads, telco product owners, MSP/integrator tech leads, infrastructure-savvy ops engineers running real call traffic. |
| Mechanism of trust | Open-core (MIT SDK, Apache Platform) as proof that the stack is real, auditable, free of vendor lock-in. |
| Tactical hook | Single anti-positioning line in the hero, framed as: *"Open-core, Asterisk-native CCaaS. The contact center you can audit, self-host, own."* |
| Primary geographic subtext | LATAM. Default locale `es-419`, examples and case material lean toward Spanish/Portuguese-speaking operators. |
| Secondary audience | Developers and integrators — the entry vector. Their org adopts via them, not the other way around. |

**Discarded alternatives** (recorded for posterity, full reasoning in section 12):

- Pure developer-first (Stripe/Vercel aesthetic): wins GitHub stars, doesn't convert ops-heavy infrastructure.
- Pure buyer-first enterprise (Genesys/Five9 aesthetic): loses against incumbents on ecosystem and references.
- Two-door hybrid: dilutes focus; the current site already accidentally lives here.
- Vertical-first (BPO-only or healthcare-only): too restrictive for a 7-tier product spanning dev to multi-tenant cluster.
- Job-to-be-done framing: too narrow.
- Product-led demo as foundation: too expensive for Phase 1.

---

## 3. Information architecture

### Pages

The site has the same URL structure as today; no route changes:

| Path | Locale-prefixed variants | Purpose |
|---|---|---|
| `/` | `/en-US/`, `/pt-BR/` | Home — primary entry point |
| `/pricing/` | `/en-US/pricing/`, `/pt-BR/pricing/` | Pricing — 7 tiers grouped + comparison matrix |
| `/developer-license/` | `/en-US/developer-license/`, `/pt-BR/developer-license/` | Self-issuance form for Tier 0.5 license |
| `/legal/eula/` | localized | EULA |
| `/legal/privacy/` | localized | Privacy policy |
| `/legal/terms/` | localized | Terms of service |

### Global navigation

- **Header (sticky):** Logo · Product · Pricing · Docs (external, GitHub for now) · GitHub · Locale switcher (ES / EN / PT, current highlighted).
  - "Product" label scrolls to `#how-it-works` on home, on other pages links to `/#how-it-works`.
  - Locale switcher preserves current route.
- **Footer:** tagline · 3 columns (Product | Resources | Legal) · `hello@verbara.io` · trademark line.

### Home structure (8 sections)

Order is the narrative descent — each section answers a specific question the visitor brings:

| # | Section | Question it answers | Status |
|---|---|---|---|
| 1 | Hero | "What is this and why should I care?" | Core |
| 2 | Anti-positioning table | "What does this replace?" | Core |
| 3 | How it works (architecture diagram) | "Is this real, modular, auditable?" | Core |
| 4 | Code + dev proof | "Does the code actually exist? How serious is it?" | Core |
| 5 | Pricing teaser (3 pathways) | "What's the path for someone like me?" | Core |
| 6 | FAQ | "What about my specific concern?" | Core |
| 7 | Final CTA | "What do I do next?" | Core |
| 8 | Footer | "Where do I find X?" | Core |

Phase-2 sections (intentionally excluded now): customer logos, product screenshots.

---

## 4. Visual identity

Direction selected: **Signal**. Telco-grade infrastructure feel with technical energy. Differentiates from cold corporate-blue CCaaS (Genesys/Five9) and from generic OSS green/orange.

### Palette

| Token | Value | Role |
|---|---|---|
| `--color-ink` | `#0A1628` | Primary background, dark surfaces |
| `--color-ink-2` | `#050D1A` | Deeper background (footer, code blocks) |
| `--color-ink-3` | `#0F2138` | Elevated surface |
| `--color-bone` | `#E8EEF5` | Primary text on ink |
| `--color-bone-2` | `rgba(232,238,245,0.65)` | Secondary text |
| `--color-bone-3` | `rgba(232,238,245,0.4)` | Tertiary text, dividers |
| `--color-signal` | `#40D9FF` | Primary accent — CTAs, links, focus rings |
| `--color-signal-deep` | `#1FA8CC` | Hover states |
| `--color-amber` | `#FFB547` | Secondary accent — highlights in headings, "popular" badges |
| `--color-success` | `#34D399` | Success states (form confirmation) |
| `--color-error` | `#F87171` | Error states (form validation) |
| `--color-line` | `rgba(232,238,245,0.10)` | Default borders, dividers |
| `--color-line-strong` | `rgba(232,238,245,0.20)` | Stronger borders (cards) |

Light-mode is **out of scope** in Phase 1 across all pages (home, pricing, dev-license, legal). The site is dark-mode by default and exclusively. The current `prefers-color-scheme` conditionals in `global.css` are removed; tokens are unconditional. Adding light mode later is a non-breaking additive change to tokens.

### Typography

| Token | Family | Weights | Use |
|---|---|---|---|
| `--font-display` | `Geist Sans` (self-hosted via woff2) | 500, 600, 700 | Hero headline, section titles |
| `--font-body` | `Geist Sans` | 400, 500 | Body copy, navigation |
| `--font-mono` | `Geist Mono` | 400, 500 | Code blocks, badges, stack metrics |

Fallback stacks:
- `--font-display`, `--font-body`: `'Geist Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- `--font-mono`: `'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

Self-host fonts under `public/fonts/` to avoid Google/CDN dependency and keep CSP simple. Font subsetting: Latin + Latin-Ext (covers ES + PT diacritics).

### Type scale (rem, base 16px)

| Step | Size | Line-height | Use |
|---|---|---|---|
| `text-xs` | 0.75 | 1.4 | Eyebrow, badges, footnotes |
| `text-sm` | 0.875 | 1.5 | Secondary body, captions |
| `text-base` | 1 | 1.6 | Body |
| `text-lg` | 1.125 | 1.5 | Lead paragraph |
| `text-xl` | 1.25 | 1.4 | Section subtitles |
| `text-2xl` | 1.5 | 1.3 | Card titles |
| `text-3xl` | 1.875 | 1.2 | Section headings (h2) |
| `text-4xl` | 2.25 | 1.15 | Page headings (h1 secondary pages) |
| `text-5xl` | 3 | 1.1 | Hero headline (mobile) |
| `text-6xl` | 3.75 | 1.05 | Hero headline (desktop) |

Letter-spacing: `-0.02em` on `text-3xl` and above. Default elsewhere.

### Spacing scale

Tailwind default scale (4px base) is sufficient. Document the section rhythm separately:

- Section vertical padding: `py-20` (5rem) on mobile, `py-28` (7rem) on desktop.
- Container max-width: `max-w-7xl` (80rem) for content-heavy sections, `max-w-3xl` (48rem) for hero copy.
- Horizontal page padding: `px-6` mobile, `px-8` tablet, `px-0` desktop (container handles).

### Radii & elevation

- Buttons, badges: `rounded-md` (6px)
- Cards: `rounded-lg` (8px)
- Mockup containers, code blocks: `rounded-lg` with 1px border `--color-line-strong`
- No box-shadows in Phase 1. Elevation is conveyed via background tone shift (`--color-ink` → `--color-ink-3`).

---

## 5. Logo & brand assets

### Wordmark

`Verbara` set in Geist Sans 700, letter-spacing `-0.02em`. The `V` is custom-modified — the right diagonal carries a subtle inset notch that reads as a signal-wave node. At small sizes (favicon, app icon) the notch becomes a horizontal line bisecting the V.

### Mark

Standalone V-mark for favicons, OG images, app icons. Three lockups produced:

1. **Full lockup** — mark + wordmark, horizontal. Default for header.
2. **Mark only** — square. For favicon (16/32/180/512), OG og-image overlay, social avatars.
3. **Wordmark only** — for footer signature, watermark contexts.

### Color variants

- Cyan-on-ink (primary, default surface)
- Bone-on-ink (when cyan would compete with adjacent UI)
- Ink-on-bone (rare, light surfaces in print)
- Monochrome bone (universal fallback)

### Asset deliverables

| Asset | Format | Location |
|---|---|---|
| Logo full | SVG | `public/brand/verbara-lockup.svg` |
| Logo mark | SVG | `public/brand/verbara-mark.svg` |
| Logo wordmark | SVG | `public/brand/verbara-wordmark.svg` |
| Favicon | SVG + ICO (16, 32) + PNG (180, 192, 512) | `public/favicon.svg`, `public/favicon.ico`, `public/icon-*.png` |
| OG image | PNG 1200×630, one per locale | `public/og/og-{locale}.png` |
| Apple touch icon | PNG 180×180 | `public/apple-touch-icon.png` |

OG image template: ink background, mark top-left, headline in display font centered, locale chip bottom-left, `verbara.io` bottom-right in mono.

---

## 6. Component inventory

All components are Astro `.astro` files. Zero client-side framework JS. Interactive bits (FAQ accordion, code block copy button, mobile nav toggle) use vanilla JS in inline `<script>` blocks scoped to the component.

### Primitives (`src/components/primitives/`)

| Component | Props | Notes |
|---|---|---|
| `Button.astro` | `variant: 'primary' \| 'secondary' \| 'ghost'`, `size: 'md' \| 'lg'`, `href?`, `as?: 'a' \| 'button'` | Renders `<a>` if `href`, else `<button>`. Primary = signal cyan on ink. |
| `Badge.astro` | `variant: 'default' \| 'success' \| 'warning' \| 'info' \| 'mono'`, `slot` | Mono variant uses `--font-mono`, used for "MIT SDK" tags. |
| `Card.astro` | `variant?: 'default' \| 'highlighted'`, `padding?` | Highlighted = signal-cyan border + faint signal-tinted background. |
| `CodeBlock.astro` | `lang: string`, `code: string`, `filename?: string` | Server-side syntax highlighting (Astro ships Shiki by default; concrete API choice — `<Code />` from `astro:components` vs. custom — left to plan). Vanilla JS copy button. |
| `Section.astro` | `id?`, `tone?: 'default' \| 'inset'`, `slot` | Standard section wrapper with vertical rhythm. Inset = `--color-ink-3` background. |
| `Container.astro` | `size?: 'sm' \| 'md' \| 'lg'` | Centered max-width wrapper. sm=3xl, md=5xl, lg=7xl. |
| `Heading.astro` | `level: 1\|2\|3\|4`, `eyebrow?: string`, `accent?: string` | Renders eyebrow label + heading. `accent` slot allows highlighting a fragment in amber. |

### Composites (`src/components/composites/`)

| Component | Used on | Notes |
|---|---|---|
| `NavBar.astro` | All pages (in Layout) | Sticky, with mobile hamburger. Includes locale switcher. |
| `Footer.astro` | All pages (in Layout) | 3-column on desktop, stacked on mobile. |
| `Hero.astro` | Home only | Variant of Section with badge + heading + sub + dual CTA + trust strip. |
| `AntiPositioningTable.astro` | Home | 4-col table: Verbara · Genesys/Five9 · raw Asterisk · VICIdial/FreePBX. ✓/✗/partial cells. |
| `ArchitectureDiagram.astro` | Home | Inline SVG, hand-authored. 5 boxes: Asterisk · SDK · SDK Pro · Platform · Platform.Web. Each linkable. |
| `CodeProof.astro` | Home | 2-col layout: code block (real Verbara.Sdk snippet) + numeric proof cards (tests, packages, vulns, AOT). |
| `PricingTeaser.astro` | Home | 3-card layout matching pricing groups. CTAs deep-link to `/pricing#group-id`. |
| `Faq.astro` | Home | Vanilla JS accordion. ARIA-correct (button + region). |
| `TierCard.astro` | Pricing | Single tier rendering. Variants: standard, popular, evaluator-badge. |
| `TierGroup.astro` | Pricing | Wraps 2-3 TierCards under a group label. |
| `ComparisonMatrix.astro` | Pricing | 8-column table (feature + 7 tiers). Sticky first column on mobile horizontal scroll. |
| `DeveloperLicenseForm.astro` | /developer-license/ | Existing; rebuilt to match new design. Validation states use new tokens. |
| `LegalDoc.astro` | /legal/* | Layout for long-form legal copy. Reading-width container, large body text, sticky table-of-contents on desktop. |

---

## 7. Page specs

### 7.1 Home

#### 7.1.1 Hero

- **Eyebrow:** badge `MIT SDK · Apache Platform · 0 vulns` (mono variant).
- **H1:** *"The AI-ready contact center you can <span amber>audit, self-host, own.</span>"* Text-balance enabled. `text-5xl` mobile, `text-6xl` desktop.
- **Sub:** *"Open-core, Asterisk-native CCaaS for operators tired of vendor lock-in. Run it in your data center, your cloud, or our managed plane — your call."*
- **CTAs (asymmetric):**
  - Primary: `Run the stack →` → `https://github.com/verbara/Verbara.Sdk` (opens external).
  - Secondary: `Talk to sales` → `mailto:licensing@verbara.io`.
  - Below CTAs, smaller text link: "*or get a developer license — free, signed, valid 60 days* →" → `/developer-license/`.
- **Trust strip (mono, dimmed):** `27 SDK packages` · `2,893 unit tests` · `0 vulnerable packages` · `Open source on GitHub` · `ES · EN · PT`. Star count intentionally **not** shown — premature for the project's age and would read as anti-signal.
- No image. The visual weight is typography + trust strip.

#### 7.1.2 Anti-positioning table

- **Eyebrow:** "What you replace"
- **H2:** *"Stop renting your contact center. <span amber>Start running it.</span>"*
- **Sub:** "*Verbara is built where the trade-offs of incumbents become non-negotiable: code, sovereignty, total cost.*"
- **Table (4 columns × 6 rows):**

| Dimension | Verbara | Genesys / Five9 | raw Asterisk + scripts | VICIdial / FreePBX |
|---|---|---|---|---|
| Source available | ✓ MIT + Apache | ✗ closed cloud | ✓ but you wire it | ✓ but UI legacy |
| Self-host option | ✓ | ✗ or restricted | ✓ entirely DIY | ✓ |
| Modern operator UI | ✓ | ✓ | ✗ | ✗ |
| AI agent pipeline | ✓ native | ✓ proprietary | ✗ | ✗ |
| Multi-tenant + clustering | ✓ Pro | ✓ enterprise | ✗ | partial |
| LATAM-default (ES/PT) | ✓ | translated | n/a | community-translated |

#### 7.1.3 How it works

- **Eyebrow:** "How it works"
- **H2:** *"Five components, one stack, every layer auditable."*
- **Architecture diagram (inline SVG):** horizontal flow, left-to-right:
  1. **Asterisk PBX** (foundation block, dotted border = upstream dependency)
  2. **Verbara.Sdk** (MIT badge inside)
  3. **Verbara.Sdk.Pro** (commercial badge)
  4. **Verbara.Platform** (Apache badge)
  5. **Verbara.Platform.Web** (Apache badge)
- Arrows: 1→2→3, 1→2→4, 4↔5. Caption: "*SDK and Platform are open. Pro adds licensed enterprise overlays. Web is your operators' UI.*"
- Each box clickable → corresponding GitHub repo.

#### 7.1.4 Code + dev proof

- **Eyebrow:** "Read the source"
- **H2:** *"Real code. Real tests. <span amber>No vaporware.</span>"*
- **2-column layout:**
  - **Left — `CodeBlock`:** ~10 lines C# showing minimal AMI subscription using `Verbara.Sdk`. Filename caption: `Program.cs`. Below the block, a small line: "*Uses Verbara.Sdk 2.1.0 — `dotnet add package Verbara.Sdk` →*" link to NuGet.
  - **Right — proof cards (4 mono numeric blocks):**
    - `27` SDK packages
    - `2,893` unit tests passing
    - `0` vulnerable dependencies
    - `.NET 10 AOT` Native ahead-of-time

The exact code snippet is implementation detail (left to plan). Constraint: must compile against the published SDK.

#### 7.1.5 Pricing teaser

- **Eyebrow:** "Pricing"
- **H2:** *"Free to evaluate. Self-host or managed when you scale."*
- **3 cards (PricingTeaser):**
  - **Free / Dev** — tagline "*Tier 0 + Tier 0.5*", price "Gratis", CTA "See OSS license →" → `/pricing#group-free`.
  - **Self-Serve** ★ — tagline "*Tier 1 + Tier 2*", price "from $5k/year", CTA "See self-host plans →" → `/pricing#group-self`.
  - **Enterprise** — tagline "*Tier 3 + Tier 4 + Tier 5*", price "from $99/agent/mo", CTA "Talk to sales →" → `/pricing#group-managed`.

#### 7.1.6 FAQ

- **Eyebrow:** "FAQ"
- **H2:** *"Direct answers."*
- **6 questions (vanilla accordion):**
  1. "Do I need an Asterisk install before adopting Verbara?"
  2. "Does this run on Kubernetes?"
  3. "What happens to my deployment if I stop paying for Pro?"
  4. "Is there an SLA on the OSS edition?"
  5. "Is LATAM (ES, PT) a first-class citizen or translated afterthought?"
  6. "How do I evaluate Pro features without committing?"

Copy is implementation detail, but answers must be ≤120 words each, technical, no marketing fluff.

#### 7.1.7 Final CTA

- **Inset Section** (`--color-ink-3` background).
- **Centered headline:** *"Stop renting your contact center. <span signal>Start running it.</span>"*
- **Sub:** "*60-day developer license, signed, free. No credit card.*"
- **Single CTA:** `Get a developer license →` → `/developer-license/`.

#### 7.1.8 Footer

3-column on desktop, stacked on mobile.

| Column 1 (Product) | Column 2 (Resources) | Column 3 (Legal) |
|---|---|---|
| Pricing | GitHub | EULA |
| Developer license | hello@verbara.io | Privacy |
| Sdk (MIT) | licensing@verbara.io | Terms |
| Platform (Apache) | security@verbara.io | |

Bottom line: tagline · trademark · copyright. Locale switcher (small) at the right end.

### 7.2 Pricing

#### Hero

- **Eyebrow:** "Pricing"
- **H1:** *"Pick the tier that matches how you operate."*
- **Sub:** "*Free for evaluation. Self-host with a license when you ship. Managed when you'd rather not run it.*"

#### Group 1 — Free

- **Group label:** "Free · evaluators · OSS users"
- **TierCards (2):** Tier 0 (Community), Tier 0.5 (Pro Developer, evaluator badge).
- **Group anchor:** `#group-free`.

#### Group 2 — Self-host

- **Group label:** "Self-host · pay-once-per-year"
- **TierCards (2):** Tier 1 (Startup), Tier 2 (Business, popular badge).
- **Group anchor:** `#group-self`.

#### Group 3 — Managed SaaS

- **Group label:** "Managed SaaS · contact sales"
- **TierCards (3):** Tier 3 (SaaS Business), Tier 4 (SaaS Enterprise), Tier 5 (White-label / OEM).
- **Group anchor:** `#group-managed`.

#### Comparison matrix

8-column table. Header row: Feature · T0 · T0.5 · T1 · T2 · T3 · T4 · T5.
Feature rows (10):
1. Open SDK + Platform source
2. Pro feature set (✗/warn/partial/full)
3. Multi-tenant
4. Clustering / multi-cluster
5. Hosted by Verbara
6. SLA
7. Support level
8. Maximum agents
9. Audit log retention
10. White-label / OEM rights

Mobile: first column sticky; rest horizontal scroll.

#### Below matrix — FAQ-pricing-specific (3 questions)

- "Can I upgrade or downgrade tiers?"
- "Is there an annual discount?"
- "Do you offer a non-profit / academic discount?"

### 7.3 Developer license form

Existing functional behavior preserved: form posts to `/api/developer-license/` Worker, ECDSA P-256 signing, D1 audit log, Resend email, Cloudflare Turnstile.

Visual changes only:

- Single-column layout, max-width 32rem, centered.
- Form fields use new tokens: signal-cyan focus ring, bone text, ink background, line-strong borders.
- Inline validation: error messages in `--color-error`, success state (post-submit) in `--color-success`.
- Loading state on submit: button disabled, spinner inside, label changes to "Issuing license…".
- Success screen: replaces form with confirmation — "*Check your inbox for your signed Verbara Pro license.*" + retry link.
- Turnstile widget themed to dark mode (`data-theme="dark"`).
- Above the form: 3-bullet "*What you get*": all Pro features in WarnOnly mode · 60-day expiration · ECDSA-signed, verifiable offline.

### 7.4 Legal pages

`LegalDoc` layout:

- Container `max-w-3xl` for reading width.
- Body text `text-base`, line-height 1.7.
- Sticky table-of-contents on the right (desktop only, `lg:` and up). Auto-generated from `<h2>` and `<h3>` IDs.
- Last-updated date and version pinned at the top in mono.
- Copy currently has placeholder content ("[placeholder]"); copy revision is **non-goal** for Phase 1 — visual application of the design system only.

---

## 8. Copy strategy & i18n

### Source of truth

EN-US is the **canonical locale**. All copy is authored and refined in English first. ES-419 and PT-BR are produced via human translation (not machine), preserving voice/tone. The site continues to serve `es-419` at the unprefixed root URL — locale default is unchanged.

### Voice & tone

| Attribute | Direction |
|---|---|
| Person | Second person ("you"). Never "we" except in legal. |
| Register | Direct, technical, no marketing fluff. Confident without being smug. |
| Sentence length | Short. Average 12 words. Hero sentences ≤ 14 words. |
| Buzzwords blacklist | "synergy", "leverage" (as verb), "unlock", "empower", "best-in-class", "next-generation", "AI-powered" (use "AI-ready" when factual), "seamless", "world-class". |
| Specifics whitelist | Numbers, function names, file paths, CLI commands. Specificity beats hyperbole. |

### i18n parity

The site has no parity check today. **Phase A adds** a CI parity script mirroring the one in `Verbara.Platform.Web`: it walks `src/i18n/messages.ts` and verifies that every locale exports the same key set with non-empty values. Failure blocks merge. Without this gate, the redesign will silently break locales as new sections are authored.

### Locale-specific notes

- **es-419** is regional Spanish (LATAM neutral). No Spain-specific vocabulary ("ordenador", "vosotros"). Currency in pricing remains USD across all locales (no currency localization in Phase 1).
- **pt-BR** is Brazilian Portuguese specifically. No Portugal-specific vocabulary.
- Numeric formatting (e.g., "$30.000" vs "$30,000") follows the locale's conventions in copy. Code/CLI examples remain English regardless of locale.

---

## 9. Testing strategy

Three layers, all wired into CI before merging the redesign:

### 9.1 Static checks

- `astro check` — TypeScript strict, runs on every PR.
- ESLint **introduced in Phase A** (no current config) with `eslint-plugin-astro` recommended ruleset. No legacy rules to migrate.
- HTML validator on built output (`html-validate` against `dist/**/*.html`).

### 9.2 End-to-end (Playwright)

Lightweight smoke per page × locale (12 tests minimum):

For each of `/`, `/pricing/`, `/developer-license/`, `/legal/eula/` × `[default es-419, en-US, pt-BR]`:

- Page returns 200.
- `<title>` matches expected pattern.
- `<h1>` is present and visible.
- Primary CTA is present and points to expected URL.
- No console errors on load.

Plus a separate flow test:
- Locale switcher: from `/` (es-419), click EN → land on `/en-US/`. Verify language attribute `<html lang>` matches.
- FAQ accordion: click first question → answer panel becomes visible → ARIA attributes update correctly.
- CodeBlock copy button: click → clipboard contains expected snippet. (Use Playwright's clipboard API.)

### 9.3 Quality thresholds

Lighthouse CI on `/` (English locale, mobile profile) with thresholds enforced as PR check:

| Category | Threshold |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | = 100 |

If any threshold drops, the PR is blocked. Tuning is allowed via `lighthouserc.json`.

### 9.4 Out of scope (Phase 1)

- Visual regression testing (Percy/Chromatic). Reserved until Phase 2; cost-of-maintenance > value at 4 pages.
- Cross-browser matrix beyond Chrome/Firefox/WebKit (Playwright defaults). No IE, no legacy Safari.
- A/B tests. No infra, no traffic for it.

---

## 10. Implementation phases

The plan-skill will produce the detailed step-by-step plan. The phasing intent is recorded here so the plan respects scope:

| Phase | Scope | Ship gate |
|---|---|---|
| **A — Design system foundation** | Tokens (CSS vars + Tailwind config), font self-host, primitives (Button, Badge, Card, CodeBlock, Section, Container, Heading), NavBar, Footer, Layout rewrite. | Existing pages render unchanged in copy but reflect new visual identity end-to-end. Tests pass. Lighthouse thresholds met. |
| **B — Home redesign** | All 8 home sections (Hero, AntiPositioningTable, ArchitectureDiagram, CodeProof, PricingTeaser, Faq, FinalCta) plus the composites they depend on. EN copy authored, ES + PT translated. | Home matches spec. e2e tests for home pass on all 3 locales. |
| **C — Pricing redesign** | Pricing layout A (3 groups + matrix). TierCard, TierGroup, ComparisonMatrix composites. EN + ES + PT copy. | Pricing matches spec. Anchors `#group-free`, `#group-self`, `#group-managed` work from home teaser. |
| **D — Developer-license + Legal polish** | Form rebuilt with new tokens (no functional change). LegalDoc layout applied to 3 legal pages. | All 4 page types in the new system. CI green. |
| **E — Asset + meta polish** | Logo SVGs finalized, favicons, OG images per locale, meta tags audited, sitemap regenerated, hreflang verified. | Production deploy. Real-world Lighthouse audit on `verbara.io` matches CI thresholds. |

Each phase is a separately mergeable change. Phases are **sequential** — B depends on the design system from A, C reuses composites authored in B, D applies the system to remaining pages, E finalizes assets. Work in branches per phase, ship in order.

---

## 11. Acceptance criteria

The redesign is "done" when **all** of the following hold:

- [ ] `verbara.io/` (es-419) renders the new home with all 8 sections, copy in ES-419.
- [ ] `verbara.io/en-US/`, `verbara.io/pt-BR/` render the same with localized copy.
- [ ] `verbara.io/pricing/` renders the 3-group layout + matrix with all 7 tiers.
- [ ] `verbara.io/developer-license/` renders with the new design system; form still issues licenses end-to-end (signed JWT → email delivered → audit log entry written).
- [ ] All 3 legal pages render with `LegalDoc` layout.
- [ ] CI runs: `astro check`, ESLint, HTML validator, Playwright smoke (12 tests min), Lighthouse CI thresholds — all green on PR.
- [ ] i18n parity check enforced and green.
- [ ] No Cloudflare Pages build regression. Bundle size for home ≤ 100 KB compressed (excluding self-hosted fonts).
- [ ] No console errors on any page in any locale.
- [ ] Logo + favicon + OG assets present and correctly referenced. Social preview (Twitter/Facebook/LinkedIn validators) renders correctly.
- [ ] Existing Tier 0.5 self-issuance loop continues to function unchanged.

---

## 12. Decisions log

Recorded for traceability — these are the decisions that survived brainstorming and the alternatives discarded.

| Decision | Chosen | Discarded | Reason |
|---|---|---|---|
| Audience priority | Operator-first + open-core proof + LATAM subtext | Pure dev-first / pure buyer-first / two-door hybrid / vertical-only / JTBD-only / live demo / community-first | Pure dev wins stars, not revenue, in ops-heavy infra. Pure buyer loses against Genesys/Five9 ecosystem. Two-door is the failure mode the current site already exhibits. |
| Visual direction | Signal (navy + cyan + amber) | Saffron (warm-black + orange) / Coffee (cacao + saffron, serif display) | Signal reads as telco infra without being corporate-blue. Saffron risks PostHog adjacency. Coffee risks reading non-technical. |
| Home section count | 7 core + FAQ = 8 | Including customer logos / Including product screenshots in Phase 1 | Empty logo grid is anti-signal. Screenshots can wait until styled captures exist. |
| Pricing layout | A — 3 groups + matrix | B — slider/calculator / C — pure matrix | A honors the 7-tier canon, mirrors home teaser. B treats agent count as the only axis (it isn't — multi-tenant, SaaS, OEM break that). C loses enterprise buyer who wants cards. |
| Logo concept | Wordmark + signal-wave V mark, 4 color variants, 3 lockups | Wordmark only / abstract mark | Memorability ↑, narrative coherence with "Signal" direction. |
| Copy source-of-truth | EN-US | ES-419 first / both parallel | Technical ecosystem language is English. Translating EN→ES feels natural; ES→EN literal often doesn't. ES remains the user-facing default locale. |
| Design system fidelity | Primitives + composites | Composites only / fully tokenized headless system | Primitives now reduce Phase 2 cost (blog, docs). Headless tokens are over-engineering for a 4-page site. |
| Testing depth | astro check + Playwright smoke + Lighthouse thresholds | astro check only / + visual regression | Lighthouse covers most quality regressions cheaply. Visual regression is high-cost-low-value at this scale. |
| Spec location | `docs/specs/2026-05-09-website-redesign.md` | `docs/superpowers/specs/...` | Project follows Option K layout per global CLAUDE.md; Option K is canonical. |

---

## 13. Open questions deferred to plan or implementation

These are **not** open design questions — they are details the plan-skill or implementation can resolve without changing scope:

- Exact code snippet shown in `CodeProof`. Constraint: must compile against `Verbara.Sdk 2.1.0`.
- Final hand-authored SVG geometry of the architecture diagram boxes.
- Final FAQ answer copy (≤120 words each, technical voice).
- Exact comparison matrix feature labels (close to but not identical to ADR-0010 wording).
- Resend email template visual update to match new identity (separate from website but worth noting).
- Self-hosted font subsetting parameters (Latin + Latin-Ext minimum; verify all glyphs in ES + PT copy are covered).

---

## 14. References

- Brainstorm session artifacts: `.superpowers/brainstorm/` (gitignored).
- Existing site: `https://verbara.io/`.
- Existing pricing model canon: `Verbara.Sdk.Pro/docs/decisions/0010-tier-model-canonical-6-tiers.md`.
- Marketing site bootstrap plan (Phase 0–4 of the original site build): `Verbara.Sdk.Pro/docs/plans/completed/2026-05-09-marketing-site-bootstrap.md`.
- ADR setting current marketing-site stack: `docs/decisions/0001-marketing-site-stack.md`.
