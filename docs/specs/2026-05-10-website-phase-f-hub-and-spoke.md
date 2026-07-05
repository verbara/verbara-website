# Verbara.io — Phase F: Hub-and-Spoke Architecture

**Status:** Shipped (2026-05-10)
**Date:** 2026-05-10
**Owner:** Harol A. Reina H.
**Scope:** Reframe `verbara.io` from single-narrative ("contact center") into a hub-and-spoke architecture that surfaces the broader product surface (Voice AI, omnichannel, programmable telephony) without diluting the operator-first audience.
**Supersedes:** No previous spec. Extends `docs/specs/2026-05-09-website-redesign.md` (Phases A–E shipped) and ADR-0001.
**Companion ADR:** `docs/decisions/0002-hub-and-spoke-architecture.md`

---

## 1. Why Phase F exists

Phases A–E (shipped 2026-05-09 → 2026-05-10) delivered a tightly-scoped single-narrative site: *"Verbara is an open-core contact center."* That positioning came from the Option I analysis (operator-first + open-core proof + LATAM subtext), which remains correct **for the audience and trust mechanism** but is incomplete **for the product surface**.

The 4-repo capability inventory shows Verbara is not "a contact center" — it is the runtime + turnkey product behind multiple distinct use-cases:

| Use-case | Existing capability |
|---|---|
| Contact Center (current narrative) | Platform + Web + Pro overlays |
| Voice AI agents (inbound voicebots) | SDK VoiceAI: 6 STT, 6 TTS, Smart Turn, OpenAI Realtime bridge |
| Omnichannel messaging | Platform: 11 connectors (WhatsApp, SMS, WebChat, Messenger, IG, Telegram, Email, Video, Twitter, RCS) |
| Programmable telephony (CPaaS) | SDK: AMI/AGI/ARI/Live API/Sessions, Activities, multi-server federation |
| White-label / OEM | Pro: multi-tenant isolation, per-tenant licensing, theming |
| Speech analytics | Pro.CallAnalytics: post-call sentiment, intent, compliance |
| Agent assist | Pro.AgentAssist + Platform.KnowledgeBase |
| Outbound dialer | Pro.Dialer: campaigns, DNC, caller ID pools |

The current site only narrates the first row. The remaining 7 rows are **invisible TAM** — capabilities that already ship but no visitor learns about.

Phase F surfaces this surface area through a hub-and-spoke architecture: the home (hub) reframes Verbara as the **runtime behind the operator's product**, and a small number of use-case pages (spokes) explain each shape with use-case-specific proof.

---

## 2. Goals & non-goals

### Goals

1. **Preserve Option I.** Operator audience, open-core proof, LATAM subtext, anti-positioning hook — all unchanged. Phase F does not re-open the audience debate.
2. **Reframe the home hero** from "the contact center you can audit/run/own" to "the open-core comms runtime you can audit/run/own — for your contact center, voice AI, omnichannel, and beyond." Subject becomes the runtime; CC becomes the lead use-case, not the totality.
3. **Add 4 spoke pages** under `/use-cases/` covering Contact Center, Voice AI, Omnichannel, and Programmable Telephony (CPaaS). Each spoke is self-contained with its own anti-positioning, code/proof, and pricing-coherent CTA.
4. **Update the navigation** to expose spokes via a `Soluciones` (ES) / `Solutions` (EN) / `Soluções` (PT) dropdown. Pricing and Developer License nav items unchanged.
5. **Update the pricing comparison matrix** with a new column ("Mejor para") that maps each tier to which use-case(s) it serves, so a visitor arriving via a spoke does not feel pricing was written for a different product.
6. **Maintain quality gates:** i18n parity (3 locales), Lighthouse thresholds, smoke + narrative E2E coverage, 0 html-validate errors.
7. **Document the architecture** in ADR-0002 with explicit success/failure criteria so future contributors know when to add or archive a spoke.

### Non-goals

- **No pivot of audience or pricing model.** Operators remain the buyer; pricing remains per-agent / per-tier. Phase F is additive surface, not category-pivot.
- **No interactive sandbox or live demo.** Reserved for Phase G.
- **No TCO calculator.** Reserved for Phase G.
- **No docs portal or `docs.verbara.io` subdomain.** Reserved for Phase G.
- **No customer logos or case studies.** Anti-signal while empty (per Phase A–E spec §1).
- **No new connectors, no SDK changes, no Platform features.** Phase F is marketing-site only; capability inventory is fixed at what ships today.
- **No vertical sub-products** (Verbara for Cobranzas, Verbara for Salud, etc.). Premature without product-market fit; reserved indefinitely.
- **No marketplace or app store.** Cementeries without users.
- **No Verbara Cloud managed Tier 0 free tier.** That is a product change, not a site change.
- **No light mode.** Stays dark-only per Phases A–E.

---

## 3. Positioning (Phase F refinement)

Option I extended, not replaced:

| Layer | Phases A–E | Phase F |
|---|---|---|
| Primary audience | Contact-center operators (BPO ops, telco product, MSP/integrators) | **Unchanged** |
| Mechanism of trust | Open-core (MIT SDK + Apache Platform) | **Unchanged** |
| Tactical hook | "Open-core, Asterisk-native CCaaS" | "Open-core, Asterisk-native **comms runtime**" |
| Geographic subtext | LATAM (es-419 default) | **Unchanged** |
| Subject of hero | "The contact center..." | **"The comms runtime that runs your contact center, voice AI, omnichannel, and more..."** |
| Use-case surface | One (CC) | Four (CC + Voice AI + Omnichannel + CPaaS) |

The hero subject change is **the only positioning-level change**. The audience, proof mechanism, geographic frame, and tactical hook are preserved verbatim.

---

## 4. Information architecture

### 4.1 New routes

| Path | Locale variants | Purpose |
|---|---|---|
| `/use-cases/` | `/en-US/use-cases/`, `/pt-BR/use-cases/` | Index page — 4 spoke cards + brief framing |
| `/use-cases/contact-center/` | localized | Spoke 1 — primary use-case (current home narrative migrated) |
| `/use-cases/voice-ai/` | localized | Spoke 2 — voicebots, IVR with AI, inbound agents |
| `/use-cases/omnichannel/` | localized | Spoke 3 — WhatsApp/SMS/email/WebChat unified |
| `/use-cases/cpaas/` | localized | Spoke 4 — programmable telephony, embed Verbara in your product |

Existing routes (`/`, `/pricing/`, `/developer-license/`, `/legal/*`) keep their paths. The home structure is preserved (hero, anti-positioning, how-it-works, code-proof, pricing-teaser, FAQ, final-CTA, footer) but the hero copy and final-CTA copy change to reflect the runtime framing.

### 4.2 Navigation

**Current header:** Logo · Producto · Precios · Licencia gratuita · GitHub · Locale switcher

**Phase F header:** Logo · **Soluciones ▾** · Precios · Licencia gratuita · GitHub · Locale switcher

The `Soluciones` item is a dropdown with 4 entries (one per spoke) plus a "Ver todas las soluciones →" link to `/use-cases/`. On mobile the dropdown collapses into a nested accordion in the existing mobile menu.

The previous `Producto` item (which scrolled to `#how-it-works` on the home) is removed. Visitors looking for "what is the product" land on a use-case spoke from `Soluciones`, not a home anchor.

### 4.3 Footer

Add a fifth column `Soluciones` listing the 4 spokes. Existing 4 columns (Producto, Recursos, Legal, …) keep their content. The `Producto` footer column is renamed to `Stack` and lists the 4 repos (SDK, Pro, Platform, Web), which already exist as `landing.stack_*` keys.

### 4.4 Internal linking

- Each spoke links **down** to `/pricing/` and `/developer-license/`.
- Each spoke links **across** to 1–2 other spokes ("Si también necesitas X, mira nuestra solución de Y").
- The home hero's primary CTA stays "Corre el stack →" (links to `#how-it-works`); secondary CTA becomes "Ver soluciones →" (links to `/use-cases/`); tertiary stays the dev-license link.
- The pricing page's tier cards gain a "Mejor para" line listing the use-case(s) each tier serves; each named use-case links to the relevant spoke. The comparison matrix gets the same information as a new column (see §7).

---

## 5. Spoke page structure

Every spoke shares this 7-section template (mirrors the home for narrative consistency):

| # | Section | Content per spoke |
|---|---|---|
| 1 | Hero | Use-case-specific eyebrow + h1 + subtitle + primary/secondary CTAs |
| 2 | Anti-positioning table | Use-case-specific — see below |
| 3 | How it works | Use-case-specific architecture diagram (subset of the home's full 5-component diagram, highlighting which components participate) |
| 4 | Code proof | Use-case-specific code sample (different snippet per spoke; same `CodeBlock` primitive) |
| 5 | Pricing pointer | Single card pointing to relevant pricing tiers (no full pricing table; visitor goes to `/pricing/` for that) |
| 6 | FAQ | 3 use-case-specific Q&A using the existing `Faq` composite |
| 7 | Final CTA | Always the developer-license CTA |

### 5.1 Spoke 1 — Contact Center

Spoke 1 is the **canonical CC narrative** of the site — operator-deep, with the BPO/telco anti-positioning that the current home currently carries. Specifically, the **CC anti-positioning table moves out of the home and into Spoke 1** (see §6.2). The home then replaces that section with a generic "Solutions overview" (§6.5).

Spoke 1 sections:
- Hero — CC-specific operator pitch (BPO ops leads, telco product owners, MSP/integrators).
- Anti-positioning table (relocated from home) — Genesys/Five9 · Asterisk+scripts · VICIdial/FreePBX.
- How it works — the full architecture diagram (same composite as home), with annotation highlighting which components serve CC.
- Code proof — same SDK initialization snippet as home (the canonical "this is real code" proof remains shared).
- Pricing pointer — links to Tier 1 / Tier 2 / Tier 3 / Tier 4 sections of `/pricing/`.
- FAQ — 3 CC-specific Q&A (the home FAQ becomes generic about runtime + open-core, see §6.6).
- Final CTA — dev-license.

### 5.2 Spoke 2 — Voice AI

Anti-positioning competitors: **Vapi · Bland.ai · Retell · Pipecat (OSS)**. Rows: open-core / self-host / Asterisk-native (telephony out-of-box, no SIP gymnastics) / multi-tenant / pluggable STT+TTS (6+6) / OpenAI Realtime bridge / barge-in + turn-taking.

Code sample: 30-line `Verbara.Sdk.VoiceAI` agent with Deepgram STT + ElevenLabs TTS responding to inbound Asterisk call.

Pricing pointer: Tier 0 (community) free for ≤5 agents · Tier 1 ($5k/yr) for production single-tenant · Tier 2+ for multi-tenant SaaS.

### 5.3 Spoke 3 — Omnichannel

Anti-positioning competitors: **Twilio Conversations · Sinch · MessageBird · Chatwoot (OSS)**. Rows: open-core / self-host / number-of-channels (11 vs. 4-7) / WhatsApp Meta direct / unified inbox / Flows DAG / multi-tenant / LATAM-default.

Code sample: 20-line `Verbara.Platform` route declaration that ingests WhatsApp + SMS + WebChat into a single conversation queue with one Flows decision node.

Pricing pointer: Tier 0 community for self-host evaluation · Tier 2 (multi-tenant) for SaaS use · Tier 3+ for hosted SLA.

### 5.4 Spoke 4 — Programmable Telephony (CPaaS)

Anti-positioning competitors: **Twilio · Vonage · Plivo · Jambonz (OSS)**. Rows: open-core / per-minute pricing (none vs. $0.014–0.045/min) / Asterisk-native / federate-multi-server / activities state-machines / barge-in & turn-taking / multi-tenant licensing.

Code sample: 25-line `Verbara.Sdk.Ari` example that places an outbound call, bridges two channels, and records the result — with a runnable `dotnet add package Verbara.Sdk` line.

Pricing pointer: Tier 0 free for OSS use · Tier 1+ for licensed Pro features (clustering, multi-tenant, dialer overlays).

### 5.5 `/use-cases/` index

Hero: "Cuatro shapes del mismo runtime." Below: 4 cards (one per spoke), each with eyebrow + 1-line value prop + 3 capability bullets + "Ver →" CTA. No pricing on the index. Footer CTA: dev-license.

---

## 6. Home hero reframe

### 6.1 Hero copy change

| Field | Phases A–E (current) | Phase F |
|---|---|---|
| `home.hero_eyebrow` | "MIT SDK · Apache Platform · 0 vulns" | **Unchanged** |
| `home.hero_h1_pre` | "El contact center listo para IA que puedes" | "El runtime open-core de comunicaciones que puedes" |
| `home.hero_h1_accent` | "auditar, ejecutar, poseer." | "auditar, ejecutar, poseer." (unchanged) |
| `home.hero_sub` | "Open-core, CCaaS Asterisk-native para operadores cansados del vendor lock-in. Córrelo en tu data center, tu nube, o nuestro plano gestionado — tú decides." | "Open-core, Asterisk-native. Corre tu contact center, voice AI, omnichannel y más sobre un solo stack auditable. En tu data center, tu nube, o nuestro plano gestionado." |
| `home.hero_cta_primary` | "Corre el stack →" | **Unchanged** |
| `home.hero_cta_secondary` | "Hablar con ventas" | "Ver soluciones →" |
| `home.hero_cta_dev_license` | "o consigue una licencia developer..." | **Unchanged** |
| Trust signals (4) | unchanged | **Unchanged** |

### 6.2 Anti-positioning table on the home

**Removed.** The CC anti-positioning table (current home §2) is **CC-specific** — its rows compare Verbara to Genesys/Five9/Asterisk-scripts/VICIdial, which are CC competitors, not Voice AI or omnichannel competitors. Keeping it on the home would re-anchor the visitor on CC despite the runtime hero.

The CC anti-pos table moves to Spoke 1 (Contact Center) where it is competitively coherent. The home gains a new section 2 — a "Solutions overview" — see §6.5.

The Voice AI / Omnichannel / CPaaS anti-positioning tables live on their respective spokes (each with its own competitor set).

### 6.3 Final CTA on the home

| Field | Current | Phase F |
|---|---|---|
| `home.final_h2_pre` | "Deja de rentar tu contact center." | "Deja de rentar tu stack de comunicaciones." |
| `home.final_h2_accent` | "Empieza a correrlo." | **Unchanged** |
| `home.final_sub` | "Licencia developer 30 días, firmada, gratis. Sin tarjeta de crédito." | **Unchanged** |
| `home.final_cta` | "Obtén una licencia developer →" | **Unchanged** |

### 6.4 Sections preserved verbatim

How-it-works (architecture diagram), Code proof, Pricing teaser → **unchanged**. These three are generic enough to serve any of the 4 use-cases:

- **How-it-works** is the full 5-component stack diagram, true regardless of which use-case the visitor cares about.
- **Code proof** is the SDK initialization snippet — the canonical "this is real code" signal, runtime-level not CC-specific.
- **Pricing teaser** is the 3-pathway grouping (Free · Self-Serve · Enterprise) — applies to any use-case.

### 6.5 New section 2 — "Solutions overview"

Replaces the (relocated) CC anti-positioning table on the home. A 4-card grid:

| Card | Eyebrow | Title | Subtitle | CTA |
|---|---|---|---|---|
| 1 | Voz humana | Contact Center | Operación omnichannel completa con AI nativa | `Ver solución →` |
| 2 | Voz IA | Voice AI | Voicebots y agentes IA sobre tu PBX | `Ver solución →` |
| 3 | Mensajería | Omnichannel | WhatsApp, SMS, email, web — un solo inbox | `Ver solución →` |
| 4 | Telefonía | CPaaS | API programable sobre Asterisk | `Ver solución →` |

The cards reuse the existing `Card` primitive. No new composite required. The grid is responsive: 4-up on desktop, 2-up on tablet, 1-up on mobile.

This section sits between the hero and how-it-works, taking the visitor from "what is this" → "what can I do with this" → "how does it work" — a tighter narrative than the previous CC-anchored anti-pos table.

### 6.6 FAQ on the home — generic-runtime version

Current FAQ has 6 Q&A. Phase F changes 2 of them and keeps 4:

- **Replace** Q1 (`¿Necesito Asterisk instalado antes de adoptar Verbara?`) — keep, applies to all use-cases.
- **Keep** Q2 (`¿Corre en Kubernetes?`).
- **Keep** Q3 (`¿Qué pasa con mi deployment si dejo de pagar Pro?`).
- **Keep** Q4 (`¿Hay SLA en la edición OSS?`).
- **Keep** Q5 (`¿LATAM (ES, PT) es ciudadano de primera...?`).
- **Replace** Q6 (`¿Cómo evalúo features Pro sin comprometerme?`) with a use-case-shape question: `¿Qué use-case me conviene empezar a evaluar?` — answer points to the 4 spokes and their evaluation paths.

Spoke 1 (Contact Center) gets its own 3 CC-specific FAQ (operator-shaped: agent counts, multi-tenant for BPOs, queue routing).

### 6.7 Sections preserved on the home

Final layout:

| # | Section | Phase F state |
|---|---|---|
| 1 | Hero | **Reframed** (subject CC → runtime, see §6.1) |
| 2 | Solutions overview (4-card grid) | **New** (§6.5) — replaces relocated CC anti-pos |
| 3 | How it works | **Unchanged** |
| 4 | Code proof | **Unchanged** |
| 5 | Pricing teaser | **Unchanged** |
| 6 | FAQ | **2 of 6 entries replaced** (§6.6) |
| 7 | Final CTA | **Opener replaced** (§6.3) |
| 8 | Footer | **`Producto` column renamed `Stack`; new `Soluciones` column added** (§4.3) |

---

## 7. Pricing surface updates

The `Mejor para` mapping appears in **two surfaces** on `/pricing/` (deliberate redundancy — visitors scanning tier cards see it, visitors comparing in the matrix see it):

1. **Tier cards** (top of pricing page) — each `TierCard` gains a `bestFor: string[]` prop rendered as a "Mejor para: Voice AI · CC" line below the price tagline. Each named use-case is a link to its spoke.
2. **Comparison matrix** (below tier cards) — the existing `ComparisonMatrix` composite gets a new column labeled `Mejor para` / `Best for` / `Melhor para`.

The mapping for both surfaces:

| Tier | Mejor para |
|---|---|
| Community (0) | Voice AI · CPaaS · CC (≤5 agentes evaluación) |
| Pro Developer (0.5) | Cualquier use-case en evaluación de 30 días |
| Pro Self-Host Startup (1) | CC · CPaaS pequeño |
| Pro Self-Host Business (2) | CC multi-tenant · Omnichannel · Voice AI productivo |
| SaaS Business (3) | CC hospedado · Voice AI hospedado |
| SaaS Enterprise (4) | CC enterprise · Compliance-grade voice |
| White-label / OEM (5) | CPaaS white-label · Vertical resellers |

The pricing hero copy gets one new line below the subtitle: "Cualquier tier sirve cualquier use-case — la diferencia es escala, multi-tenant y SLA."

No tier prices change. No tier features change.

---

## 8. i18n scope

**Current:** 232 keys × 3 locales = 696 strings.

**Phase F estimate:**

| Source | New keys |
|---|---|
| `home.hero_*` reframe | 0 (replace existing) |
| `home.final_h2_pre` reframe | 0 (replace existing) |
| `home.faq_q1` + `home.faq_a6` replacements | 0 (replace existing) |
| `home.solutions_*` (§6.5: section eyebrow/h2 + 4 cards × {eyebrow, title, sub, cta}) | ~18 |
| `nav.solutions` + dropdown labels (5) | 5 |
| `footer.column_solutions` + 4 spoke names | 5 |
| `usecases.index_*` (eyebrow, h1, sub, 4 card eyebrows + 4 card titles + 4 card subs + 4 card CTAs + 12 capability bullets) | ~32 |
| `usecases.cc_*` (Spoke 1 — full canonical CC narrative now lives here) | ~30 |
| `usecases.voiceai_*` (hero, anti-pos 7 rows + 4 cols, code caption, FAQ 3, pricing pointer, final CTA) | ~30 |
| `usecases.omnichannel_*` (same shape) | ~30 |
| `usecases.cpaas_*` (same shape) | ~30 |
| `pricing.best_for_header` + `pricing.best_for_t{0,0_5,1,2,3,4,5}` (1 header + 7 row values, shared between tier cards and matrix) | 8 |
| `pricing.subtitle_2` (new line) | 1 |
| Total new keys | **~189** |

Final count: ~421 keys × 3 locales = ~1,263 strings. CI parity gate runs unchanged on the new total.

---

## 9. Testing surface

### 9.1 New E2E specs

| Spec file | Cases | Coverage |
|---|---|---|
| `tests/e2e/use-cases-index.spec.ts` | 6 (1 per locale × 2: render + 4 spoke-card links) | Index renders, all 4 spoke cards link out, locale switcher works |
| `tests/e2e/use-case-narrative.spec.ts` | 36 (3 locales × 4 spokes × 3 assertions) | Each spoke has h1, anti-pos table, code-proof, FAQ, final-CTA |
| `tests/e2e/nav-solutions-dropdown.spec.ts` | 9 (3 locales × 3 cases) | Dropdown opens, has 4 entries + "Ver todas", mobile nested menu |
| `tests/e2e/pricing-best-for.spec.ts` | 6 (3 locales × 2: header + 7 row values present) | Best-for column rendered |
| Total new cases | **57** | × 3 browsers = 171 new test executions |

Total Phase F test executions: 171 new + 495 current = **666 per CI run**.

### 9.2 Existing specs to update

- `tests/e2e/smoke.spec.ts`: extend "page types" list from 6 to 11 (add `/use-cases/` index + 4 spokes), keep 3 locales = +15 smoke checks.
- `tests/e2e/locale-switcher.spec.ts`: add 1 case for spoke pages (use-cases/contact-center/ as canary).
- `tests/e2e/home-narrative.spec.ts`: update hero h1 + final-CTA assertions to new copy; add new assertion for Solutions overview (4-card section, §6.5); update FAQ assertion (Q1+Q6 replaced, §6.6); remove old CC anti-pos table assertion (relocated to Spoke 1).
- `tests/e2e/pricing-narrative.spec.ts`: add assertions for tier cards' `bestFor` line + `ComparisonMatrix` `Mejor para` column.

### 9.3 Lighthouse

Add 5 new URLs (1 index + 4 spokes) to `lighthouse.config.json`. Same thresholds: Perf ≥ 0.9, A11y ≥ 0.95, BP ≥ 0.95, SEO = 1.0. Total Lighthouse runs: 6 → 11 URLs.

### 9.4 i18n parity

`scripts/check-i18n-parity.mjs` runs unchanged on the larger key set.

---

## 10. Dependencies & invariants

- **No SDK / Pro / Platform changes.** Phase F is marketing-site only. Capability claims must match what already ships.
- **No new third-party services.** No new MCP, no new analytics, no new auth, no new fonts.
- **Build invariants from ADR-0001 hold.** Astro static-first, Cloudflare Workers Sites, hardcoded Turnstile site key in `astro.config.mjs`.
- **Repo stays public + MIT licensed** (per Phases A–E decision).
- **Brand assets reused.** No new logos, no new OG images per spoke (the `og-default.png` remains canonical; per-spoke OG images are a Phase G optimization).
- **Composites reused.** Spoke pages compose existing primitives + composites (`Hero`, `AntiPositioningTable`, `ArchitectureDiagram`, `CodeProof`, `Faq`, `FinalCta`). Only **one new composite needed**: a `SpokePricingPointer` (1-card mini pricing card) — small enough to consider inlining instead of a new composite. Decision deferred to plan-writing.

---

## 11. Phasing & milestones

Phase F is a single PR. No sub-phases. Milestones below are for the implementation plan to consume:

| Milestone | Deliverable |
|---|---|
| F.1 | i18n keys added (3 locales, parity green) for all of: hero reframe, nav, footer, solutions overview, FAQ replacements, pricing best-for, 4 spokes, index |
| F.2 | Home hero + final-CTA copy updated; existing E2E updated to match new copy |
| F.3 | Home CC anti-pos table removed; new "Solutions overview" 4-card section shipped (§6.5) |
| F.4 | Home FAQ Q1 + Q6 replaced with runtime-generic versions (§6.6) |
| F.5 | `Soluciones` nav dropdown (desktop + mobile) shipped |
| F.6 | `/use-cases/` index page shipped (3 locales) |
| F.7 | Spoke 1 (Contact Center) shipped — relocated CC narrative + new operator-deep hero |
| F.8 | Spoke 2 (Voice AI) shipped |
| F.9 | Spoke 3 (Omnichannel) shipped |
| F.10 | Spoke 4 (CPaaS) shipped |
| F.11 | Pricing tier cards `bestFor` prop + `ComparisonMatrix` `Mejor para` column shipped |
| F.12 | Footer `Producto` → `Stack` rename + new `Soluciones` column shipped |
| F.13 | New E2E specs + smoke updates green; Lighthouse URLs added (6 → 11) |
| F.14 | ADR-0002 status: Accepted (already marked); spec marked Shipped; commit landed on main |

Milestones are independently mergeable in principle but Phase F as a whole is shipped as a single PR (per Phases A–E pattern) so the user sees a coherent change.

---

## 12. Out of scope (Phase G+ candidates)

Recorded here so they are not lost. Each is a candidate for a future phase **only if Phase F shows tracción** (sustained traffic to spokes, conversion to dev-license, or sales conversations citing a specific use-case).

| Candidate | Rough scope |
|---|---|
| G.1 — TCO calculator | Per-spoke calculator vs. incumbent (Genesys for CC, Vapi for Voice AI, Twilio for CPaaS, Sinch for omnichannel) — savings number drives the funnel |
| G.2 — Interactive sandbox | Embedded console for the highest-converting spoke (probably Voice AI: speak into mic, hear response) |
| G.3 — Docs portal | `docs.verbara.io` subdomain, Astro+Starlight or VitePress, fed from `Verbara.Sdk/docs` and `Verbara.Platform/docs` |
| G.4 — Customer stories | Long-form case studies in 3 locales, when 2+ citable customers exist |
| G.5 — Per-spoke OG images | One OG variant per spoke for richer social sharing |
| G.6 — JSON-LD / Schema.org | SoftwareApplication + Product + Organization structured data, per-spoke |
| G.7 — Engineering blog | `/blog/` with AI/telephony technical content (Smart Turn paper, benchmarks, post-mortems) |

Phase G items are **not committed** by Phase F. The hub-and-spoke architecture is the prerequisite that makes any of them coherent later.

---

## 13. Success / failure criteria

Recorded here so Phase F can be evaluated honestly post-ship.

### Success looks like:

- All 4 spokes + index page live, CI green, Lighthouse thresholds preserved.
- i18n parity green at ~378 keys × 3 locales.
- Home reframe does not break any existing E2E (assertions updated where copy changed).
- ADR-0002 catalogs the architecture and references this spec.

### 90-day post-ship signals (informative, not gating):

- Spoke pages receive non-trivial traffic (≥ 20% of home page views).
- At least one spoke ranks in Google for a meaningful query (e.g., "open source vapi alternative", "asterisk programmable telephony").
- Dev-license issuance attribution (referrer) shows spoke origins, not just home.

### Failure signal (would trigger archive of a spoke):

- A spoke gets < 5% of home traffic over 90 days **and** has zero attributed dev-license signups → archive that spoke (move route to `/use-cases/_archived/` or 410). Ship a follow-up phase only after archival is documented.

---

## 14. Alternatives considered

These are the alternatives evaluated in the brainstorming session that produced this spec. Recorded for posterity.

- **Status quo** (keep CC-only narrative). Rejected: leaves 7+ ship-ready capabilities invisible to visitors.
- **Generic "comms platform" hero** without spokes. Rejected: re-opens the two-door trap that Option I deliberately closed; abstract messaging loses operator identification.
- **Two parallel narratives** (CC + Voice AI co-headlining the home). Rejected: pricing models for CC and Voice AI differ (per-agent vs. per-call); home would be incoherent.
- **Pivot to pure Voice AI** ("OSS Vapi/Retell"). Rejected: tira la moat (Asterisk-native + multi-tenant + integrated stack); Vapi/Retell have 18–24 month framework-DX lead.
- **Pivot to pure CPaaS** ("OSS Twilio"). Rejected: Twilio's moat is global SIP infra Verbara doesn't operate; CPaaS-only without infra is just an SDK on your own Asterisk.
- **Vertical reframe** (BPO + Telco + Fintech). Rejected: locks audience too narrow; spec leaves vertical specialization for Phase G+ if PMF surfaces.
- **Three-persona reframe** (operator / builder / telco). Rejected: builder and telco are sub-segments of operator (per Option I); separate doors fragment the funnel.
- **Stack-as-product** (4 cards on home for SDK/Pro/Platform/Web). Rejected: tested in the pre-Phase-A site and didn't convert — buyers buy outcomes, not repos. The footer `Stack` column already preserves this surface for visitors who want it.
- **Marketplace / app store of templates**. Rejected: cementeries without users; revisit when ≥ 10 community-built templates exist organically.
- **Vertical sub-product spinoffs** (Verbara for Cobranzas, etc.). Rejected: premature without PMF; would require dedicated ops + sales motion.
- **Verbara Cloud free Tier 0 hosted**. Rejected as a Phase F item: that is a product change (multi-tenant hosted, billing, abuse, support), not a site change. Could be a Phase G+ product initiative, evaluated separately.
- **Docs-as-marketing primary**. Rejected: operators don't read docs to buy; devs do, and devs are top-of-funnel only per Option I. Docs portal is a Phase G complement, not the headline.
- **GitHub-as-marketing primary** (verbara.io is a thin wrapper). Rejected: operator buyers don't comparison-shop on GitHub; trust signals (legal, pricing, brand) need a real site.
- **Engineering blog / research lab as headline**. Rejected as headline for Phase F: builds tech credibility but doesn't convert operators; reserved as Phase G.7.

---

## 15. References

- Phases A–E spec: `docs/specs/2026-05-09-website-redesign.md`
- Phases A–E completed plans: `docs/plans/completed/2026-05-09-website-redesign-phase-{a,b,c,d,e}-*.md`
- ADR-0001 (Marketing Site Stack): `docs/decisions/0001-marketing-site-stack.md`
- ADR-0002 (Hub-and-Spoke Architecture): `docs/decisions/0002-hub-and-spoke-architecture.md`
- Pro ADR-0010 (Canonical 6-tier model): `Verbara.Sdk.Pro/docs/decisions/0010-tier-model-canonical-6-tiers.md`
- Capability inventory (cross-repo, internal): produced 2026-05-10 during this brainstorming session
