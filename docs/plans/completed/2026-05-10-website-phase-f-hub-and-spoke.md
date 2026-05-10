# Website Phase F — Hub-and-Spoke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe `verbara.io` from CC-only narrative into hub-and-spoke architecture: home becomes runtime-first hub; 4 use-case spokes (CC, Voice AI, Omnichannel, CPaaS) surface broader product surface without diluting Option I (operator-first + open-core + LATAM).

**Architecture:** Astro 6 static-rendered pages with locale-prefixed routes (`/` = es-419, `/en-US/`, `/pt-BR/`). New routes under `/use-cases/{,contact-center,voice-ai,omnichannel,cpaas}/`. Existing composites reused (Hero, AntiPositioningTable, ArchitectureDiagram, CodeProof, Faq, FinalCta, ComparisonMatrix, TierCard, NavBar, Footer); minor extensions where needed. i18n keys grow from 232 → ~421 with parity enforced across 3 locales.

**Tech Stack:** Astro 6 · TypeScript 5 · Tailwind v4.3 · Cloudflare Workers Sites · Playwright (E2E) · Lighthouse CI · Node 22.

**Spec:** [`docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md`](../../specs/2026-05-10-website-phase-f-hub-and-spoke.md)
**ADR:** [`docs/decisions/0002-hub-and-spoke-architecture.md`](../../decisions/0002-hub-and-spoke-architecture.md)
**Branch:** `redesign/phase-f-hub-and-spoke` (already created, spec + ADR already committed at `313443d`).

---

## Pre-flight context (read this first)

### Codebase shape

| Concern | Location |
|---|---|
| Default-locale pages (es-419) | `src/pages/{index,pricing,developer-license}.astro`, `src/pages/legal/*.astro` |
| Localized pages (en-US, pt-BR) | `src/pages/[lang]/...` mirror — `getStaticPaths` returns `[{lang:'en-US'},{lang:'pt-BR'}]` |
| Composites (reusable sections) | `src/components/composites/*.astro` |
| Primitives (small UI) | `src/components/primitives/*.astro` |
| Layout | `src/layouts/Layout.astro` |
| i18n strings | `src/i18n/messages.ts` (TS interface `Messages` + 3 locale objects + `MESSAGES` export) |
| i18n helpers | `src/i18n/utils.ts` (`getLocaleFromPath`, `getRouteFromPath`, `localiseHref`) |
| Global styles | `src/styles/global.css` (Tailwind v4 `@theme` tokens + fonts) |
| E2E tests | `tests/e2e/*.spec.ts` — Playwright, iterates `LOCALE_PREFIXES = ['', '/en-US', '/pt-BR']` |
| Smoke E2E | `tests/e2e/smoke.spec.ts` — page-types × locales matrix |
| i18n parity check | `scripts/check-i18n-parity.mjs` — runs in CI; fails on missing/extra/empty keys |
| Lighthouse config | `lighthouse.config.json` — URL list + thresholds |
| CI | `.github/workflows/ci.yml` — quality + e2e + lighthouse jobs |

### How a composite reads i18n

Most composites self-resolve locale + messages (do **not** take strings as props):

```astro
---
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---
<h2>{t.home.hero_h1_pre}</h2>
```

Some composites take props (e.g. `Faq` accepts `eyebrow`, `heading`, `items`); use props when the same composite renders different content per page. New use-case spokes will need at least one prop-driven composite (`SpokeAntiPositioning`) because each spoke uses a different competitor set with different row/column shape.

### How a localized page is wired

Default-locale `src/pages/foo.astro` is plain. Localized `src/pages/[lang]/foo.astro` adds:

```astro
export function getStaticPaths() {
  return [{ params: { lang: 'en-US' } }, { params: { lang: 'pt-BR' } }];
}
```

Page composes composites; composites self-resolve locale via `Astro.url.pathname`.

### How i18n keys are added

1. Add the field to the `Messages` interface in `src/i18n/messages.ts` (lines ~17–290).
2. Add the value to **all three** locale objects (`es_419`, `en_US`, `pt_BR`) in the same file.
3. Run `node scripts/check-i18n-parity.mjs` — must print `i18n parity OK across 3 locales`.

The parity script fails on missing keys, extra keys, **or empty strings** (`''`/`null`). Don't commit placeholders.

### Translation guidance (en-US + pt-BR from es-419 source)

Translations follow Phases A–E patterns:
- **en-US:** professional/technical tone, no marketing fluff. Use existing translations as style reference.
- **pt-BR:** Brazilian Portuguese (BR not PT-PT), match length/cadence of es-419 source.
- Preserve mono/code spans verbatim (don't translate package names, `dotnet add`, etc.).
- Preserve `→` arrow glyphs in CTAs.
- Match the `text-balance` constraint: keep h1/h2 short enough to not wrap awkwardly.

When translating, scan the existing 232 keys for analogous strings to keep voice consistent.

### Convention reminders

- **Conventional Commits** — `feat(spokes):`, `fix(nav):`, `docs(spec):`, etc. **No `Co-Authored-By`**.
- **Test naming** for E2E: descriptive, locale-aware. Match existing `home narrative: all 7 sections render at /en-US/`.
- **No light-mode.** Dark-only per Phases A–E. Tailwind tokens are unconditional.
- **Trailing slashes** on internal hrefs (per `localiseHref`).
- Run `npm run build` periodically to catch type errors early. Astro's check is part of `build`.
- Never use `git commit --no-verify` or `--amend`; pre-commit hooks must pass on a fresh commit.

### Commands cheat-sheet

```bash
# Dev server (localhost:4321)
npm run dev

# Typecheck + build
npm run build

# Unit/parity (no dedicated unit tests for marketing site — only parity)
node scripts/check-i18n-parity.mjs

# E2E (single browser, fast)
npx playwright test --project=chromium

# E2E (full matrix — chromium + firefox + webkit)
npx playwright test

# Single E2E spec
npx playwright test tests/e2e/home-narrative.spec.ts --project=chromium

# Lighthouse (after build)
npx lhci autorun --config=lighthouse.config.json
```

---

## File structure (decomposition map)

### New files

| File | Responsibility |
|---|---|
| `src/pages/use-cases/index.astro` | Hub-spoke index (es-419) — 4-card overview |
| `src/pages/use-cases/contact-center.astro` | Spoke 1 — CC narrative (es-419) |
| `src/pages/use-cases/voice-ai.astro` | Spoke 2 — Voice AI narrative (es-419) |
| `src/pages/use-cases/omnichannel.astro` | Spoke 3 — Omnichannel narrative (es-419) |
| `src/pages/use-cases/cpaas.astro` | Spoke 4 — CPaaS narrative (es-419) |
| `src/pages/[lang]/use-cases/index.astro` | Index — en-US, pt-BR variants |
| `src/pages/[lang]/use-cases/contact-center.astro` | Spoke 1 — localized |
| `src/pages/[lang]/use-cases/voice-ai.astro` | Spoke 2 — localized |
| `src/pages/[lang]/use-cases/omnichannel.astro` | Spoke 3 — localized |
| `src/pages/[lang]/use-cases/cpaas.astro` | Spoke 4 — localized |
| `src/components/composites/SolutionsOverview.astro` | Home §6.5 — 4-card grid replacing relocated CC anti-pos |
| `src/components/composites/UseCaseHero.astro` | Per-spoke hero (props-driven, reads `t.usecases.<spoke>_*`) |
| `src/components/composites/SpokeAntiPositioning.astro` | Per-spoke anti-pos table (props for competitor set + rows) |
| `src/components/composites/SpokeCodeProof.astro` | Per-spoke code sample (props for filename + caption + snippet) |
| `src/components/composites/SpokeFaq.astro` | Wraps `Faq` with per-spoke 3 Q&A |
| `src/components/composites/SpokePricingPointer.astro` | Per-spoke pricing pointer (single card, links to `/pricing/`) |
| `src/components/composites/UseCaseIndexCard.astro` | One card on the `/use-cases/` index |
| `tests/e2e/use-cases-index.spec.ts` | E2E for index page |
| `tests/e2e/use-case-narrative.spec.ts` | E2E for 4 spoke pages × 3 locales |
| `tests/e2e/nav-solutions-dropdown.spec.ts` | E2E for nav dropdown (desktop + mobile) |
| `tests/e2e/pricing-best-for.spec.ts` | E2E for pricing best-for surfaces |

### Modified files

| File | Change |
|---|---|
| `src/i18n/messages.ts` | +189 keys × 3 locales; new `usecases` namespace; replace `home.hero_h1_pre`, `home.hero_sub`, `home.hero_cta_secondary`, `home.faq_q1`, `home.faq_a6`, `home.final_h2_pre`; add `home.solutions_*`, `nav.solutions`, `footer.column_solutions`, `pricing.best_for_*`, etc. |
| `src/pages/index.astro` | Replace `<AntiPositioningTable />` with `<SolutionsOverview />`; FAQ items list updated for replaced Q1/Q6 |
| `src/pages/[lang]/index.astro` | Same as above |
| `src/components/composites/NavBar.astro` | Replace `Producto` anchor with `Soluciones ▾` dropdown (desktop + mobile) |
| `src/components/composites/Footer.astro` | Rename `column_product` → `column_stack`; add new `column_solutions` |
| `src/components/composites/TierCard.astro` | Add `bestFor: string[]` prop; render line below tagline; each item is a link to spoke |
| `src/components/composites/ComparisonMatrix.astro` | Add new column `Mejor para` |
| `src/pages/pricing.astro` | Pass `bestFor` per `<TierCard>`; add subtitle line |
| `src/pages/[lang]/pricing.astro` | Same |
| `tests/e2e/home-narrative.spec.ts` | Update hero h1 + final-CTA assertions; replace anti-pos assertion with Solutions overview assertion; FAQ Q1/Q6 assertions updated |
| `tests/e2e/pricing-narrative.spec.ts` | Add best-for assertions |
| `tests/e2e/smoke.spec.ts` | Extend page-types list 6 → 11 (add 5 new routes) |
| `tests/e2e/locale-switcher.spec.ts` | Add 1 case for `/use-cases/contact-center/` canary |
| `lighthouse.config.json` | Add 5 new URLs |

### Removed code paths

The home `<AntiPositioningTable />` composite is **not deleted** (Spoke 1 still uses it). Only its placement on the home page changes. Same for the Faq composite (still used; just different items list).

---

# PHASE F.1 — i18n foundation (replace + add core keys)

This phase touches `src/i18n/messages.ts` only. After this phase, all 189 new keys exist in all 3 locales with es-419 source values + en-US/pt-BR translations. Parity check stays green.

**Strategy:** group keys by "namespace section" (e.g. nav, footer, home replacements, home solutions, pricing best-for, usecases.index, usecases.cc, usecases.voiceai, usecases.omnichannel, usecases.cpaas). Each task adds one section to the `Messages` interface AND populates all 3 locales for that section AND runs parity.

### Task F.1.1: Add `nav.solutions` + dropdown labels

**Files:**
- Modify: `src/i18n/messages.ts` — `Messages.nav` interface block + 3 locale objects' `nav` blocks

- [ ] **Step 1: Extend the `Messages.nav` interface**

In `src/i18n/messages.ts`, locate the `nav` interface block (~line 23):

```typescript
nav: {
  product: string;       // KEEP for transitional period; remove in F.3 after NavBar updated
  pricing: string;
  developer_license: string;
  github: string;
};
```

Replace with:

```typescript
nav: {
  product: string;       // deprecated; remove after F.3 NavBar refactor lands
  pricing: string;
  developer_license: string;
  github: string;
  solutions: string;
  solutions_cc: string;
  solutions_voiceai: string;
  solutions_omnichannel: string;
  solutions_cpaas: string;
  solutions_all: string;
};
```

- [ ] **Step 2: Populate es-419**

In the `es_419` object's `nav` block (~line 302), add the 6 new keys after the existing 4:

```typescript
nav: {
  product: 'Producto',
  pricing: 'Precios',
  developer_license: 'Licencia gratuita',
  github: 'GitHub',
  solutions: 'Soluciones',
  solutions_cc: 'Contact Center',
  solutions_voiceai: 'Voice AI',
  solutions_omnichannel: 'Omnichannel',
  solutions_cpaas: 'CPaaS',
  solutions_all: 'Ver todas las soluciones →',
},
```

- [ ] **Step 3: Populate en-US**

Locate `en_US.nav` and add:

```typescript
solutions: 'Solutions',
solutions_cc: 'Contact Center',
solutions_voiceai: 'Voice AI',
solutions_omnichannel: 'Omnichannel',
solutions_cpaas: 'CPaaS',
solutions_all: 'See all solutions →',
```

- [ ] **Step 4: Populate pt-BR**

Locate `pt_BR.nav` and add:

```typescript
solutions: 'Soluções',
solutions_cc: 'Contact Center',
solutions_voiceai: 'Voice AI',
solutions_omnichannel: 'Omnichannel',
solutions_cpaas: 'CPaaS',
solutions_all: 'Ver todas as soluções →',
```

- [ ] **Step 5: Run parity check**

Run: `node scripts/check-i18n-parity.mjs`
Expected: `i18n parity OK across 3 locales (238 keys each).`

### Task F.1.2: Add `footer.column_solutions` + spoke names

**Files:**
- Modify: `src/i18n/messages.ts`

- [ ] **Step 1: Extend `Messages.footer` interface**

Add after `column_legal`:

```typescript
column_solutions: string;
column_stack: string;        // replaces column_product semantically (renamed in F.3)
solutions_cc: string;
solutions_voiceai: string;
solutions_omnichannel: string;
solutions_cpaas: string;
```

- [ ] **Step 2: Populate es-419**

```typescript
column_solutions: 'Soluciones',
column_stack: 'Stack',
solutions_cc: 'Contact Center',
solutions_voiceai: 'Voice AI',
solutions_omnichannel: 'Omnichannel',
solutions_cpaas: 'CPaaS',
```

- [ ] **Step 3: Populate en-US**

```typescript
column_solutions: 'Solutions',
column_stack: 'Stack',
solutions_cc: 'Contact Center',
solutions_voiceai: 'Voice AI',
solutions_omnichannel: 'Omnichannel',
solutions_cpaas: 'CPaaS',
```

- [ ] **Step 4: Populate pt-BR**

```typescript
column_solutions: 'Soluções',
column_stack: 'Stack',
solutions_cc: 'Contact Center',
solutions_voiceai: 'Voice AI',
solutions_omnichannel: 'Omnichannel',
solutions_cpaas: 'CPaaS',
```

- [ ] **Step 5: Run parity** — expected count 244.

### Task F.1.3: Replace `home.hero_*` for runtime reframe + add `home.solutions_*`

**Files:**
- Modify: `src/i18n/messages.ts`

- [ ] **Step 1: Extend `Messages.home` interface**

Add new keys (placement: in the hero block, after `hero_trust_oss`):

```typescript
solutions_eyebrow: string;
solutions_h2: string;
solutions_card_cc_eyebrow: string;
solutions_card_cc_title: string;
solutions_card_cc_sub: string;
solutions_card_cc_cta: string;
solutions_card_voiceai_eyebrow: string;
solutions_card_voiceai_title: string;
solutions_card_voiceai_sub: string;
solutions_card_voiceai_cta: string;
solutions_card_omnichannel_eyebrow: string;
solutions_card_omnichannel_title: string;
solutions_card_omnichannel_sub: string;
solutions_card_omnichannel_cta: string;
solutions_card_cpaas_eyebrow: string;
solutions_card_cpaas_title: string;
solutions_card_cpaas_sub: string;
solutions_card_cpaas_cta: string;
```

- [ ] **Step 2: Replace es-419 hero values + add solutions block**

In `es_419.home`:

Replace:
```typescript
hero_h1_pre: 'El contact center listo para IA que puedes',
hero_sub: 'Open-core, CCaaS Asterisk-native para operadores cansados del vendor lock-in. Córrelo en tu data center, tu nube, o nuestro plano gestionado — tú decides.',
hero_cta_secondary: 'Hablar con ventas',
```

With:
```typescript
hero_h1_pre: 'El runtime open-core de comunicaciones que puedes',
hero_sub: 'Open-core, Asterisk-native. Corre tu contact center, voice AI, omnichannel y más sobre un solo stack auditable. En tu data center, tu nube, o nuestro plano gestionado.',
hero_cta_secondary: 'Ver soluciones →',
```

Replace `final_h2_pre`:
```typescript
final_h2_pre: 'Deja de rentar tu stack de comunicaciones.',
```

Replace `faq_q1` answer + `faq_q6` Q&A:
```typescript
faq_q1: '¿Necesito Asterisk instalado antes de adoptar Verbara?',
faq_a1: 'Sí. Verbara está construido sobre Asterisk PBX como su substrato de telefonía — no lo reemplazamos, modernizamos la UX del operador, el pipeline de AI y los overlays Pro alrededor de él. Si no tienes Asterisk, lo despliegas junto con Verbara (setup único, bien documentado). Si ya corres Asterisk, Verbara se conecta a tu dialplan y configuración existentes. Esto aplica para cualquier use-case: contact center, voice AI, omnichannel o CPaaS.',
```

(Q1 keeps the same question; only the answer gets the use-case-aware closing sentence.)

```typescript
faq_q6: '¿Por dónde empiezo según mi use-case?',
faq_a6: 'Cada solución tiene su propia página con código, anti-positioning y FAQ específicos: contact-center para BPO/telco, voice-ai para voicebots inbound, omnichannel para WhatsApp/SMS/email, cpaas para telefonía programable embebida. Saca una licencia Pro Developer (Tier 0.5, gratis, 60 días) que desbloquea todas las features Pro en modo WarnOnly — evalúa el use-case que más te encaje sin compromiso.',
```

Add the new `solutions_*` block after `hero_trust_oss`:

```typescript
solutions_eyebrow: 'Soluciones',
solutions_h2: 'Cuatro formas del mismo runtime.',
solutions_card_cc_eyebrow: 'Voz humana',
solutions_card_cc_title: 'Contact Center',
solutions_card_cc_sub: 'Operación omnichannel completa con AI nativa, dialer y agent assist.',
solutions_card_cc_cta: 'Ver solución →',
solutions_card_voiceai_eyebrow: 'Voz IA',
solutions_card_voiceai_title: 'Voice AI',
solutions_card_voiceai_sub: 'Voicebots y agentes IA inbound sobre tu Asterisk PBX.',
solutions_card_voiceai_cta: 'Ver solución →',
solutions_card_omnichannel_eyebrow: 'Mensajería',
solutions_card_omnichannel_title: 'Omnichannel',
solutions_card_omnichannel_sub: 'WhatsApp, SMS, email, web — once canales en un inbox.',
solutions_card_omnichannel_cta: 'Ver solución →',
solutions_card_cpaas_eyebrow: 'Telefonía',
solutions_card_cpaas_title: 'CPaaS',
solutions_card_cpaas_sub: 'API programable sobre Asterisk. Sin tarifas por minuto.',
solutions_card_cpaas_cta: 'Ver solución →',
```

- [ ] **Step 3: Populate en-US (translations)**

Hero replacements:
```typescript
hero_h1_pre: 'The open-core comms runtime you can',
hero_sub: 'Open-core, Asterisk-native. Run your contact center, voice AI, omnichannel, and more on one auditable stack. In your data center, your cloud, or our managed plane.',
hero_cta_secondary: 'See solutions →',
```

Final CTA:
```typescript
final_h2_pre: 'Stop renting your comms stack.',
```

FAQ:
```typescript
faq_a1: 'Yes. Verbara is built on top of Asterisk PBX as its telephony substrate — we don\'t replace it, we modernize the operator UX, the AI pipeline, and the Pro overlays around it. If you don\'t have Asterisk, you deploy it alongside Verbara (one-time, well-documented setup). If you already run Asterisk, Verbara connects to your existing dialplan and config. This applies for any use-case: contact center, voice AI, omnichannel, or CPaaS.',
faq_q6: 'Where do I start based on my use-case?',
faq_a6: 'Each solution has its own page with code, anti-positioning, and use-case-specific FAQ: contact-center for BPO/telco, voice-ai for inbound voicebots, omnichannel for WhatsApp/SMS/email, cpaas for embedded programmable telephony. Grab a Pro Developer license (Tier 0.5, free, 60 days) that unlocks every Pro feature in WarnOnly mode — evaluate the use-case that fits without commitment.',
```

Solutions block:
```typescript
solutions_eyebrow: 'Solutions',
solutions_h2: 'Four shapes of the same runtime.',
solutions_card_cc_eyebrow: 'Human voice',
solutions_card_cc_title: 'Contact Center',
solutions_card_cc_sub: 'Full omnichannel operation with native AI, dialer, and agent assist.',
solutions_card_cc_cta: 'See solution →',
solutions_card_voiceai_eyebrow: 'AI voice',
solutions_card_voiceai_title: 'Voice AI',
solutions_card_voiceai_sub: 'Voicebots and inbound AI agents on top of your Asterisk PBX.',
solutions_card_voiceai_cta: 'See solution →',
solutions_card_omnichannel_eyebrow: 'Messaging',
solutions_card_omnichannel_title: 'Omnichannel',
solutions_card_omnichannel_sub: 'WhatsApp, SMS, email, web — eleven channels in one inbox.',
solutions_card_omnichannel_cta: 'See solution →',
solutions_card_cpaas_eyebrow: 'Telephony',
solutions_card_cpaas_title: 'CPaaS',
solutions_card_cpaas_sub: 'Programmable API on top of Asterisk. No per-minute fees.',
solutions_card_cpaas_cta: 'See solution →',
```

- [ ] **Step 4: Populate pt-BR (translations)**

Hero:
```typescript
hero_h1_pre: 'O runtime open-core de comunicações que você pode',
hero_sub: 'Open-core, nativo no Asterisk. Rode seu contact center, voice AI, omnichannel e mais sobre um único stack auditável. No seu data center, na sua nuvem, ou no nosso plano gerenciado.',
hero_cta_secondary: 'Ver soluções →',
```

Final CTA:
```typescript
final_h2_pre: 'Pare de alugar seu stack de comunicações.',
```

FAQ:
```typescript
faq_a1: 'Sim. O Verbara é construído sobre o Asterisk PBX como seu substrato de telefonia — não o substituímos, modernizamos a UX do operador, o pipeline de IA e os overlays Pro ao redor dele. Se você não tem Asterisk, ele é implantado junto com o Verbara (setup único, bem documentado). Se você já roda Asterisk, o Verbara conecta ao seu dialplan e configuração existentes. Isso vale para qualquer use-case: contact center, voice AI, omnichannel ou CPaaS.',
faq_q6: 'Por onde começo de acordo com meu use-case?',
faq_a6: 'Cada solução tem sua própria página com código, anti-positioning e FAQ específicos: contact-center para BPO/telco, voice-ai para voicebots inbound, omnichannel para WhatsApp/SMS/email, cpaas para telefonia programável embarcada. Gere uma licença Pro Developer (Tier 0.5, gratuita, 60 dias) que desbloqueia toda feature Pro em modo WarnOnly — avalie o use-case que se encaixa sem compromisso.',
```

Solutions block:
```typescript
solutions_eyebrow: 'Soluções',
solutions_h2: 'Quatro formas do mesmo runtime.',
solutions_card_cc_eyebrow: 'Voz humana',
solutions_card_cc_title: 'Contact Center',
solutions_card_cc_sub: 'Operação omnichannel completa com IA nativa, dialer e agent assist.',
solutions_card_cc_cta: 'Ver solução →',
solutions_card_voiceai_eyebrow: 'Voz IA',
solutions_card_voiceai_title: 'Voice AI',
solutions_card_voiceai_sub: 'Voicebots e agentes IA inbound sobre seu Asterisk PBX.',
solutions_card_voiceai_cta: 'Ver solução →',
solutions_card_omnichannel_eyebrow: 'Mensageria',
solutions_card_omnichannel_title: 'Omnichannel',
solutions_card_omnichannel_sub: 'WhatsApp, SMS, email, web — onze canais em um inbox.',
solutions_card_omnichannel_cta: 'Ver solução →',
solutions_card_cpaas_eyebrow: 'Telefonia',
solutions_card_cpaas_title: 'CPaaS',
solutions_card_cpaas_sub: 'API programável sobre Asterisk. Sem tarifas por minuto.',
solutions_card_cpaas_cta: 'Ver solução →',
```

- [ ] **Step 5: Run parity** — expected count 262.

### Task F.1.4: Add `pricing.best_for_*` keys

**Files:**
- Modify: `src/i18n/messages.ts`

- [ ] **Step 1: Extend `Messages.pricing` interface**

Add after `tier_5_f4`:

```typescript
best_for_label: string;             // column header / line label
best_for_t0: string;                // Tier 0 → use-cases
best_for_t0_5: string;
best_for_t1: string;
best_for_t2: string;
best_for_t3: string;
best_for_t4: string;
best_for_t5: string;
subtitle_2: string;                 // new line under hero subtitle
```

- [ ] **Step 2: Populate es-419** (in `es_419.pricing`):

```typescript
best_for_label: 'Mejor para',
best_for_t0: 'Voice AI · CPaaS · CC (≤5 agentes evaluación)',
best_for_t0_5: 'Cualquier use-case en evaluación de 60 días',
best_for_t1: 'CC · CPaaS pequeño',
best_for_t2: 'CC multi-tenant · Omnichannel · Voice AI productivo',
best_for_t3: 'CC hospedado · Voice AI hospedado',
best_for_t4: 'CC enterprise · Compliance-grade voice',
best_for_t5: 'CPaaS white-label · Vertical resellers',
subtitle_2: 'Cualquier tier sirve cualquier use-case — la diferencia es escala, multi-tenant y SLA.',
```

- [ ] **Step 3: Populate en-US**:

```typescript
best_for_label: 'Best for',
best_for_t0: 'Voice AI · CPaaS · CC (≤5 agents eval)',
best_for_t0_5: 'Any use-case under 60-day evaluation',
best_for_t1: 'CC · small CPaaS',
best_for_t2: 'Multi-tenant CC · Omnichannel · Production Voice AI',
best_for_t3: 'Hosted CC · Hosted Voice AI',
best_for_t4: 'Enterprise CC · Compliance-grade voice',
best_for_t5: 'White-label CPaaS · Vertical resellers',
subtitle_2: 'Any tier serves any use-case — the difference is scale, multi-tenant, and SLA.',
```

- [ ] **Step 4: Populate pt-BR**:

```typescript
best_for_label: 'Melhor para',
best_for_t0: 'Voice AI · CPaaS · CC (≤5 agentes avaliação)',
best_for_t0_5: 'Qualquer use-case em avaliação de 60 dias',
best_for_t1: 'CC · CPaaS pequeno',
best_for_t2: 'CC multi-tenant · Omnichannel · Voice AI produtivo',
best_for_t3: 'CC hospedado · Voice AI hospedado',
best_for_t4: 'CC enterprise · Compliance-grade voice',
best_for_t5: 'CPaaS white-label · Revendedores verticais',
subtitle_2: 'Qualquer tier serve qualquer use-case — a diferença é escala, multi-tenant e SLA.',
```

- [ ] **Step 5: Run parity** — expected 270.

### Task F.1.5: Add `usecases.index` namespace

The `usecases` namespace is **new** — add it to `Messages` interface as a sibling of `home`/`pricing`/etc.

**Files:** `src/i18n/messages.ts`

- [ ] **Step 1: Extend `Messages` interface — add `usecases` namespace**

Add after the closing `}` of the `pricing` block in the interface (and before `legal_eula` if present):

```typescript
usecases: {
  // Index page
  index_eyebrow: string;
  index_h1_pre: string;
  index_h1_accent: string;
  index_sub: string;

  // Per-spoke metadata used on the index AND on each spoke's hero
  cc_index_eyebrow: string;
  cc_index_title: string;
  cc_index_sub: string;
  cc_index_cap1: string;
  cc_index_cap2: string;
  cc_index_cap3: string;
  cc_index_cta: string;

  voiceai_index_eyebrow: string;
  voiceai_index_title: string;
  voiceai_index_sub: string;
  voiceai_index_cap1: string;
  voiceai_index_cap2: string;
  voiceai_index_cap3: string;
  voiceai_index_cta: string;

  omnichannel_index_eyebrow: string;
  omnichannel_index_title: string;
  omnichannel_index_sub: string;
  omnichannel_index_cap1: string;
  omnichannel_index_cap2: string;
  omnichannel_index_cap3: string;
  omnichannel_index_cta: string;

  cpaas_index_eyebrow: string;
  cpaas_index_title: string;
  cpaas_index_sub: string;
  cpaas_index_cap1: string;
  cpaas_index_cap2: string;
  cpaas_index_cap3: string;
  cpaas_index_cta: string;

  // (per-spoke detail blocks — added in F.1.6 through F.1.9)
};
```

- [ ] **Step 2: Populate es-419** — add `usecases` block to `es_419`:

```typescript
usecases: {
  index_eyebrow: 'Soluciones',
  index_h1_pre: 'Un runtime,',
  index_h1_accent: 'cuatro shapes.',
  index_sub: 'El mismo motor open-core sirve cuatro use-cases distintos. Elige el que coincide con cómo operas.',

  cc_index_eyebrow: 'Voz humana',
  cc_index_title: 'Contact Center',
  cc_index_sub: 'Operación omnichannel completa con AI nativa, dialer predictivo y agent assist en tiempo real.',
  cc_index_cap1: 'Multi-tenant + clustering',
  cc_index_cap2: 'Speech analytics post-llamada',
  cc_index_cap3: 'Wallboard + SLA tracking',
  cc_index_cta: 'Ver solución →',

  voiceai_index_eyebrow: 'Voz IA',
  voiceai_index_title: 'Voice AI',
  voiceai_index_sub: 'Voicebots y agentes IA inbound sobre tu Asterisk PBX. Sin SIP gymnastics.',
  voiceai_index_cap1: '6 STT · 6 TTS · OpenAI Realtime bridge',
  voiceai_index_cap2: 'Smart Turn detection + barge-in',
  voiceai_index_cap3: 'Self-host o hospedado',
  voiceai_index_cta: 'Ver solución →',

  omnichannel_index_eyebrow: 'Mensajería',
  omnichannel_index_title: 'Omnichannel',
  omnichannel_index_sub: 'Once canales en un solo inbox. WhatsApp Meta directo, sin intermediarios.',
  omnichannel_index_cap1: '11 conectores · WhatsApp 24h window',
  omnichannel_index_cap2: 'Flows DAG con nodos LLM',
  omnichannel_index_cap3: 'Multi-tenant white-label',
  omnichannel_index_cta: 'Ver solución →',

  cpaas_index_eyebrow: 'Telefonía',
  cpaas_index_title: 'CPaaS',
  cpaas_index_sub: 'AMI · AGI · ARI · Live API. La telefonía como librería, no como servicio rentado.',
  cpaas_index_cap1: 'Sin tarifas por minuto',
  cpaas_index_cap2: 'Federación multi-servidor',
  cpaas_index_cap3: 'Activities state-machines',
  cpaas_index_cta: 'Ver solución →',
},
```

- [ ] **Step 3: Populate en-US**:

```typescript
usecases: {
  index_eyebrow: 'Solutions',
  index_h1_pre: 'One runtime,',
  index_h1_accent: 'four shapes.',
  index_sub: 'The same open-core engine serves four distinct use-cases. Pick the one that matches how you operate.',

  cc_index_eyebrow: 'Human voice',
  cc_index_title: 'Contact Center',
  cc_index_sub: 'Full omnichannel operation with native AI, predictive dialer, and real-time agent assist.',
  cc_index_cap1: 'Multi-tenant + clustering',
  cc_index_cap2: 'Post-call speech analytics',
  cc_index_cap3: 'Wallboard + SLA tracking',
  cc_index_cta: 'See solution →',

  voiceai_index_eyebrow: 'AI voice',
  voiceai_index_title: 'Voice AI',
  voiceai_index_sub: 'Voicebots and inbound AI agents on your Asterisk PBX. No SIP gymnastics.',
  voiceai_index_cap1: '6 STT · 6 TTS · OpenAI Realtime bridge',
  voiceai_index_cap2: 'Smart Turn detection + barge-in',
  voiceai_index_cap3: 'Self-host or hosted',
  voiceai_index_cta: 'See solution →',

  omnichannel_index_eyebrow: 'Messaging',
  omnichannel_index_title: 'Omnichannel',
  omnichannel_index_sub: 'Eleven channels in one inbox. WhatsApp Meta direct, no middlemen.',
  omnichannel_index_cap1: '11 connectors · WhatsApp 24h window',
  omnichannel_index_cap2: 'Flows DAG with LLM nodes',
  omnichannel_index_cap3: 'Multi-tenant white-label',
  omnichannel_index_cta: 'See solution →',

  cpaas_index_eyebrow: 'Telephony',
  cpaas_index_title: 'CPaaS',
  cpaas_index_sub: 'AMI · AGI · ARI · Live API. Telephony as a library, not a rented service.',
  cpaas_index_cap1: 'No per-minute fees',
  cpaas_index_cap2: 'Multi-server federation',
  cpaas_index_cap3: 'Activities state-machines',
  cpaas_index_cta: 'See solution →',
},
```

- [ ] **Step 4: Populate pt-BR**:

```typescript
usecases: {
  index_eyebrow: 'Soluções',
  index_h1_pre: 'Um runtime,',
  index_h1_accent: 'quatro formas.',
  index_sub: 'O mesmo motor open-core serve quatro use-cases distintos. Escolha o que combina com como você opera.',

  cc_index_eyebrow: 'Voz humana',
  cc_index_title: 'Contact Center',
  cc_index_sub: 'Operação omnichannel completa com IA nativa, dialer preditivo e agent assist em tempo real.',
  cc_index_cap1: 'Multi-tenant + clustering',
  cc_index_cap2: 'Speech analytics pós-chamada',
  cc_index_cap3: 'Wallboard + SLA tracking',
  cc_index_cta: 'Ver solução →',

  voiceai_index_eyebrow: 'Voz IA',
  voiceai_index_title: 'Voice AI',
  voiceai_index_sub: 'Voicebots e agentes IA inbound sobre seu Asterisk PBX. Sem SIP gymnastics.',
  voiceai_index_cap1: '6 STT · 6 TTS · OpenAI Realtime bridge',
  voiceai_index_cap2: 'Smart Turn detection + barge-in',
  voiceai_index_cap3: 'Self-host ou hospedado',
  voiceai_index_cta: 'Ver solução →',

  omnichannel_index_eyebrow: 'Mensageria',
  omnichannel_index_title: 'Omnichannel',
  omnichannel_index_sub: 'Onze canais em um único inbox. WhatsApp Meta direto, sem intermediários.',
  omnichannel_index_cap1: '11 conectores · WhatsApp 24h window',
  omnichannel_index_cap2: 'Flows DAG com nós LLM',
  omnichannel_index_cap3: 'Multi-tenant white-label',
  omnichannel_index_cta: 'Ver solução →',

  cpaas_index_eyebrow: 'Telefonia',
  cpaas_index_title: 'CPaaS',
  cpaas_index_sub: 'AMI · AGI · ARI · Live API. Telefonia como biblioteca, não como serviço alugado.',
  cpaas_index_cap1: 'Sem tarifas por minuto',
  cpaas_index_cap2: 'Federação multi-servidor',
  cpaas_index_cap3: 'Activities state-machines',
  cpaas_index_cta: 'Ver solução →',
},
```

- [ ] **Step 5: Run parity** — expected 298.

### Task F.1.6: Add `usecases.cc_*` (Spoke 1 detail keys)

Each spoke needs ~30 detail keys: hero, anti-pos table (1 sub + 4 col headers + 7 row labels = 12), code-proof (filename + caption), faq (3 Q+A = 6), pricing-pointer (1 title + 1 body), final-CTA (3).

**Pattern shared across spokes (will repeat in F.1.7, F.1.8, F.1.9 per spoke):**

```typescript
<spoke>_hero_eyebrow: string;
<spoke>_hero_h1_pre: string;
<spoke>_hero_h1_accent: string;
<spoke>_hero_sub: string;
<spoke>_hero_cta_primary: string;
<spoke>_hero_cta_secondary: string;

<spoke>_ap_eyebrow: string;
<spoke>_ap_h2: string;
<spoke>_ap_sub: string;
<spoke>_ap_col_verbara: string;
<spoke>_ap_col_a: string;       // competitor A
<spoke>_ap_col_b: string;
<spoke>_ap_col_c: string;
<spoke>_ap_row_1: string;       // 7 row labels
<spoke>_ap_row_2: string;
<spoke>_ap_row_3: string;
<spoke>_ap_row_4: string;
<spoke>_ap_row_5: string;
<spoke>_ap_row_6: string;
<spoke>_ap_row_7: string;

<spoke>_cp_eyebrow: string;
<spoke>_cp_h2: string;
<spoke>_cp_filename: string;
<spoke>_cp_caption: string;

<spoke>_faq_eyebrow: string;
<spoke>_faq_h2: string;
<spoke>_faq_q1: string;
<spoke>_faq_a1: string;
<spoke>_faq_q2: string;
<spoke>_faq_a2: string;
<spoke>_faq_q3: string;
<spoke>_faq_a3: string;

<spoke>_pp_eyebrow: string;     // pricing pointer
<spoke>_pp_h2: string;
<spoke>_pp_body: string;
<spoke>_pp_cta: string;

<spoke>_final_h2_pre: string;
<spoke>_final_h2_accent: string;
<spoke>_final_sub: string;
```

That's 36 keys × 4 spokes = 144 keys. The skeleton structure is identical per spoke; only the content differs.

- [ ] **Step 1: Extend `Messages.usecases` with `cc_*` keys** — add the 36 fields per the pattern above (substitute `cc` for `<spoke>`).

- [ ] **Step 2: Populate es-419 (`cc_*` block in `es_419.usecases`)**

```typescript
cc_hero_eyebrow: 'Solución · Contact Center',
cc_hero_h1_pre: 'El contact center que tu equipo de seguridad',
cc_hero_h1_accent: 'puede leer.',
cc_hero_sub: 'Para BPO ops leads, telco product owners y MSP/integradores que operan tráfico real. Open-core de extremo a extremo, sin tarifas por minuto, multi-tenant nativo.',
cc_hero_cta_primary: 'Licencia developer →',
cc_hero_cta_secondary: 'Ver pricing CC',

cc_ap_eyebrow: 'Lo que reemplazas',
cc_ap_h2: 'Deja de rentar tu contact center.',
cc_ap_sub: 'Cuatro categorías de incumbentes — y dónde Verbara cierra cada brecha.',
cc_ap_col_verbara: 'Verbara',
cc_ap_col_a: 'Genesys / Five9',
cc_ap_col_b: 'Asterisk + scripts',
cc_ap_col_c: 'VICIdial / FreePBX',
cc_ap_row_1: 'Código disponible',
cc_ap_row_2: 'Self-host',
cc_ap_row_3: 'UI moderna',
cc_ap_row_4: 'Pipeline AI nativo',
cc_ap_row_5: 'Multi-tenant + clustering',
cc_ap_row_6: 'Speech analytics',
cc_ap_row_7: 'LATAM por defecto (ES/PT)',

cc_cp_eyebrow: 'Lee el código',
cc_cp_h2: 'Operación CC en código real.',
cc_cp_filename: 'CallCenterHost.cs',
cc_cp_caption: 'Verbara.Platform — bootstrap del API CC con multi-tenant + Pro features →',

cc_faq_eyebrow: 'FAQ · Contact Center',
cc_faq_h2: 'Preguntas de operadores.',
cc_faq_q1: '¿Cuántos agentes simultáneos soporta?',
cc_faq_a1: 'Tier 1 self-host está limitado a 25 agentes; Tier 2 sube a 500 con multi-clúster; SaaS Business (Tier 3) y Enterprise (Tier 4) escalan según contrato. La cuota es por licencia, no técnica — el motor escala horizontalmente con clustering Pro.',
cc_faq_q2: '¿Multi-tenant para BPOs?',
cc_faq_a2: 'Sí, desde Tier 2 self-host. Aislamiento estricto por tenant, routing por skill por tenant, impersonation cross-tenant para administración. Cada cliente del BPO ve solo su data y sus agentes.',
cc_faq_q3: '¿Compatibilidad con mi PBX existente?',
cc_faq_a3: 'Si tu PBX es Asterisk (cualquier versión 16+), Verbara conecta a tu dialplan vía AMI/ARI. Si tu PBX es Cisco/Avaya, necesitas un gateway SIP a Asterisk; soportamos los más comunes en docs.',

cc_pp_eyebrow: 'Precios CC',
cc_pp_h2: '¿Qué tier necesitas?',
cc_pp_body: 'Tier 1 ($5k/año) para arrancar single-tenant ≤25 agentes. Tier 2 ($30-50k/año) para multi-tenant + multi-clúster. Tier 3 ($99/agente/mes) si prefieres hospedado. Tier 4 ($249/agente/mes) para SOC2/HIPAA + 24/7.',
cc_pp_cta: 'Ver pricing completo →',

cc_final_h2_pre: 'El CC que',
cc_final_h2_accent: 'puedes auditar.',
cc_final_sub: 'Licencia developer 60 días, firmada, gratis. Evalúa todo Pro sin compromiso.',
```

- [ ] **Step 3: Populate en-US**:

```typescript
cc_hero_eyebrow: 'Solution · Contact Center',
cc_hero_h1_pre: 'The contact center your security team',
cc_hero_h1_accent: 'can actually read.',
cc_hero_sub: 'For BPO ops leads, telco product owners, and MSP/integrators running real traffic. Open-core end-to-end, no per-minute fees, multi-tenant from day one.',
cc_hero_cta_primary: 'Developer license →',
cc_hero_cta_secondary: 'See CC pricing',

cc_ap_eyebrow: 'What you replace',
cc_ap_h2: 'Stop renting your contact center.',
cc_ap_sub: 'Four incumbent categories — where Verbara closes each gap.',
cc_ap_col_verbara: 'Verbara',
cc_ap_col_a: 'Genesys / Five9',
cc_ap_col_b: 'Asterisk + scripts',
cc_ap_col_c: 'VICIdial / FreePBX',
cc_ap_row_1: 'Source available',
cc_ap_row_2: 'Self-host',
cc_ap_row_3: 'Modern UI',
cc_ap_row_4: 'Native AI pipeline',
cc_ap_row_5: 'Multi-tenant + clustering',
cc_ap_row_6: 'Speech analytics',
cc_ap_row_7: 'LATAM-default (ES/PT)',

cc_cp_eyebrow: 'Read the code',
cc_cp_h2: 'CC operation as real code.',
cc_cp_filename: 'CallCenterHost.cs',
cc_cp_caption: 'Verbara.Platform — CC API bootstrap with multi-tenant + Pro features →',

cc_faq_eyebrow: 'FAQ · Contact Center',
cc_faq_h2: 'Operator questions.',
cc_faq_q1: 'How many concurrent agents does it support?',
cc_faq_a1: 'Tier 1 self-host caps at 25 agents; Tier 2 goes to 500 with multi-cluster; SaaS Business (Tier 3) and Enterprise (Tier 4) scale per contract. The cap is licensing, not technical — the engine scales horizontally with Pro clustering.',
cc_faq_q2: 'Multi-tenant for BPOs?',
cc_faq_a2: 'Yes, from Tier 2 self-host. Strict per-tenant isolation, per-tenant skill routing, cross-tenant admin impersonation. Each BPO client sees only their data and their agents.',
cc_faq_q3: 'Compatibility with my existing PBX?',
cc_faq_a3: 'If your PBX is Asterisk (any version 16+), Verbara connects to your dialplan via AMI/ARI. If your PBX is Cisco/Avaya, you need a SIP gateway to Asterisk; the most common ones are documented.',

cc_pp_eyebrow: 'CC pricing',
cc_pp_h2: 'Which tier do you need?',
cc_pp_body: 'Tier 1 ($5k/yr) to start single-tenant ≤25 agents. Tier 2 ($30-50k/yr) for multi-tenant + multi-cluster. Tier 3 ($99/agent/mo) if you prefer hosted. Tier 4 ($249/agent/mo) for SOC2/HIPAA + 24/7.',
cc_pp_cta: 'See full pricing →',

cc_final_h2_pre: 'The CC',
cc_final_h2_accent: 'you can audit.',
cc_final_sub: '60-day signed developer license, free. Evaluate every Pro feature with no commitment.',
```

- [ ] **Step 4: Populate pt-BR**:

```typescript
cc_hero_eyebrow: 'Solução · Contact Center',
cc_hero_h1_pre: 'O contact center que sua equipe de segurança',
cc_hero_h1_accent: 'consegue ler.',
cc_hero_sub: 'Para BPO ops leads, telco product owners e MSP/integradores rodando tráfego real. Open-core ponta-a-ponta, sem tarifas por minuto, multi-tenant nativo.',
cc_hero_cta_primary: 'Licença developer →',
cc_hero_cta_secondary: 'Ver pricing CC',

cc_ap_eyebrow: 'O que você substitui',
cc_ap_h2: 'Pare de alugar seu contact center.',
cc_ap_sub: 'Quatro categorias de incumbentes — onde o Verbara fecha cada gap.',
cc_ap_col_verbara: 'Verbara',
cc_ap_col_a: 'Genesys / Five9',
cc_ap_col_b: 'Asterisk + scripts',
cc_ap_col_c: 'VICIdial / FreePBX',
cc_ap_row_1: 'Código disponível',
cc_ap_row_2: 'Self-host',
cc_ap_row_3: 'UI moderna',
cc_ap_row_4: 'Pipeline AI nativo',
cc_ap_row_5: 'Multi-tenant + clustering',
cc_ap_row_6: 'Speech analytics',
cc_ap_row_7: 'LATAM por padrão (ES/PT)',

cc_cp_eyebrow: 'Leia o código',
cc_cp_h2: 'Operação CC em código real.',
cc_cp_filename: 'CallCenterHost.cs',
cc_cp_caption: 'Verbara.Platform — bootstrap do API CC com multi-tenant + features Pro →',

cc_faq_eyebrow: 'FAQ · Contact Center',
cc_faq_h2: 'Perguntas de operadores.',
cc_faq_q1: 'Quantos agentes simultâneos suporta?',
cc_faq_a1: 'Tier 1 self-host limita a 25 agentes; Tier 2 chega a 500 com multi-cluster; SaaS Business (Tier 3) e Enterprise (Tier 4) escalam por contrato. O limite é de licença, não técnico — o motor escala horizontalmente com clustering Pro.',
cc_faq_q2: 'Multi-tenant para BPOs?',
cc_faq_a2: 'Sim, a partir do Tier 2 self-host. Isolamento estrito por tenant, roteamento por skill por tenant, impersonation cross-tenant para administração. Cada cliente do BPO vê apenas seus dados e seus agentes.',
cc_faq_q3: 'Compatibilidade com meu PBX existente?',
cc_faq_a3: 'Se seu PBX é Asterisk (qualquer versão 16+), o Verbara conecta no seu dialplan via AMI/ARI. Se seu PBX é Cisco/Avaya, você precisa de um gateway SIP para o Asterisk; os mais comuns estão documentados.',

cc_pp_eyebrow: 'Pricing CC',
cc_pp_h2: 'Qual tier você precisa?',
cc_pp_body: 'Tier 1 ($5k/ano) para começar single-tenant ≤25 agentes. Tier 2 ($30-50k/ano) para multi-tenant + multi-cluster. Tier 3 ($99/agente/mês) se preferir hospedado. Tier 4 ($249/agente/mês) para SOC2/HIPAA + 24/7.',
cc_pp_cta: 'Ver pricing completo →',

cc_final_h2_pre: 'O CC',
cc_final_h2_accent: 'que você pode auditar.',
cc_final_sub: 'Licença developer 60 dias, assinada, gratuita. Avalie todo Pro sem compromisso.',
```

- [ ] **Step 5: Run parity** — expected 334.

### Task F.1.7: Add `usecases.voiceai_*` (Spoke 2 detail keys)

Pattern identical to F.1.6 (substitute `voiceai`). Competitor set: Vapi · Bland.ai / Retell · Pipecat (OSS). Code sample filename: `VoiceAgent.cs`.

- [ ] **Step 1: Extend `Messages.usecases` with `voiceai_*` keys** (36 fields).

- [ ] **Step 2: es-419 content**:

```typescript
voiceai_hero_eyebrow: 'Solución · Voice AI',
voiceai_hero_h1_pre: 'Voicebots inbound',
voiceai_hero_h1_accent: 'sobre tu PBX.',
voiceai_hero_sub: 'STT, TTS y turn-taking nativos sobre Asterisk. Sin SIP gymnastics, sin per-minute, sin lock-in al proveedor de voz.',
voiceai_hero_cta_primary: 'Licencia developer →',
voiceai_hero_cta_secondary: 'Ver código',

voiceai_ap_eyebrow: 'Lo que reemplazas',
voiceai_ap_h2: 'Voicebots sin alquilar la voz.',
voiceai_ap_sub: 'Las plataformas SaaS de voicebot te cobran por minuto y te lockean al stack de un proveedor. Verbara hace lo opuesto.',
voiceai_ap_col_verbara: 'Verbara',
voiceai_ap_col_a: 'Vapi',
voiceai_ap_col_b: 'Bland.ai · Retell',
voiceai_ap_col_c: 'Pipecat (OSS)',
voiceai_ap_row_1: 'Open-core',
voiceai_ap_row_2: 'Self-host completo',
voiceai_ap_row_3: 'Asterisk-native (sin SIP gymnastics)',
voiceai_ap_row_4: 'Multi-tenant',
voiceai_ap_row_5: '6 STT + 6 TTS swappables',
voiceai_ap_row_6: 'OpenAI Realtime bridge',
voiceai_ap_row_7: 'Smart Turn + barge-in',

voiceai_cp_eyebrow: 'Lee el código',
voiceai_cp_h2: 'Un voicebot en 30 líneas.',
voiceai_cp_filename: 'VoiceAgent.cs',
voiceai_cp_caption: 'Verbara.Sdk.VoiceAI — agente Deepgram + ElevenLabs respondiendo a llamada Asterisk →',

voiceai_faq_eyebrow: 'FAQ · Voice AI',
voiceai_faq_h2: 'Preguntas de builders.',
voiceai_faq_q1: '¿Qué proveedores de STT/TTS soporta?',
voiceai_faq_a1: 'STT: Deepgram, Google, Whisper, Azure, Cartesia, AssemblyAI, Speechmatics. TTS: ElevenLabs Flash 2.5, Deepgram Aura 2, LMNT, Azure, Cartesia, Speechmatics. Plus bridge directo al OpenAI Realtime API. Swappables vía configuración, no recompilación.',
voiceai_faq_q2: '¿Cuál es la latencia end-to-end?',
voiceai_faq_a2: 'Con Smart Turn detection + Deepgram Nova + ElevenLabs Flash 2.5 + barge-in: ~600ms p95 desde fin-de-frase del humano hasta primer phoneme TTS, midiendo en infra propia con VU 100. Latencia exacta depende de tu infra y el LLM upstream.',
voiceai_faq_q3: '¿Self-host sin telefonía propia?',
voiceai_faq_a3: 'Necesitas un PBX Asterisk para que el SDK reciba audio (puede ser tuyo, de un cliente, o desplegado junto con Verbara). Si quieres voicebots sin operar telefonía, Tier 3+ SaaS hospedado incluye PBX gestionado.',

voiceai_pp_eyebrow: 'Precios Voice AI',
voiceai_pp_h2: '¿Por dónde empiezas?',
voiceai_pp_body: 'Tier 0 community gratis para evaluación con SDK MIT directo. Tier 0.5 (Pro Developer, gratis 60 días) para todas las features Pro. Tier 1+ cuando shipees a producción single-tenant.',
voiceai_pp_cta: 'Ver pricing completo →',

voiceai_final_h2_pre: 'Voicebots',
voiceai_final_h2_accent: 'sin renta.',
voiceai_final_sub: 'Licencia developer 60 días, firmada, gratis. SDK MIT — léelo entero antes de adoptar.',
```

- [ ] **Step 3: en-US content**:

```typescript
voiceai_hero_eyebrow: 'Solution · Voice AI',
voiceai_hero_h1_pre: 'Inbound voicebots',
voiceai_hero_h1_accent: 'on your PBX.',
voiceai_hero_sub: 'Native STT, TTS, and turn-taking on top of Asterisk. No SIP gymnastics, no per-minute, no voice-vendor lock-in.',
voiceai_hero_cta_primary: 'Developer license →',
voiceai_hero_cta_secondary: 'See the code',

voiceai_ap_eyebrow: 'What you replace',
voiceai_ap_h2: 'Voicebots without renting the voice.',
voiceai_ap_sub: 'Voicebot SaaS charges per minute and locks you into one vendor stack. Verbara does the opposite.',
voiceai_ap_col_verbara: 'Verbara',
voiceai_ap_col_a: 'Vapi',
voiceai_ap_col_b: 'Bland.ai · Retell',
voiceai_ap_col_c: 'Pipecat (OSS)',
voiceai_ap_row_1: 'Open-core',
voiceai_ap_row_2: 'Full self-host',
voiceai_ap_row_3: 'Asterisk-native (no SIP gymnastics)',
voiceai_ap_row_4: 'Multi-tenant',
voiceai_ap_row_5: '6 STT + 6 TTS swappable',
voiceai_ap_row_6: 'OpenAI Realtime bridge',
voiceai_ap_row_7: 'Smart Turn + barge-in',

voiceai_cp_eyebrow: 'Read the code',
voiceai_cp_h2: 'A voicebot in 30 lines.',
voiceai_cp_filename: 'VoiceAgent.cs',
voiceai_cp_caption: 'Verbara.Sdk.VoiceAI — Deepgram + ElevenLabs agent answering an Asterisk call →',

voiceai_faq_eyebrow: 'FAQ · Voice AI',
voiceai_faq_h2: 'Builder questions.',
voiceai_faq_q1: 'Which STT/TTS providers does it support?',
voiceai_faq_a1: 'STT: Deepgram, Google, Whisper, Azure, Cartesia, AssemblyAI, Speechmatics. TTS: ElevenLabs Flash 2.5, Deepgram Aura 2, LMNT, Azure, Cartesia, Speechmatics. Plus a direct bridge to the OpenAI Realtime API. Swappable via configuration, no recompile.',
voiceai_faq_q2: 'What is the end-to-end latency?',
voiceai_faq_a2: 'With Smart Turn detection + Deepgram Nova + ElevenLabs Flash 2.5 + barge-in: ~600ms p95 from human end-of-utterance to first TTS phoneme, measured on dedicated infra at VU 100. Exact latency depends on your infra and upstream LLM.',
voiceai_faq_q3: 'Self-host without my own telephony?',
voiceai_faq_a3: 'You need an Asterisk PBX so the SDK can receive audio (yours, a customer\'s, or deployed alongside Verbara). If you want voicebots without operating telephony, Tier 3+ SaaS hosted includes managed PBX.',

voiceai_pp_eyebrow: 'Voice AI pricing',
voiceai_pp_h2: 'Where do you start?',
voiceai_pp_body: 'Tier 0 community is free for evaluation with the MIT SDK directly. Tier 0.5 (Pro Developer, free 60 days) for every Pro feature. Tier 1+ when you ship to single-tenant production.',
voiceai_pp_cta: 'See full pricing →',

voiceai_final_h2_pre: 'Voicebots',
voiceai_final_h2_accent: 'without rent.',
voiceai_final_sub: '60-day signed developer license, free. MIT SDK — read it end-to-end before adopting.',
```

- [ ] **Step 4: pt-BR content**:

```typescript
voiceai_hero_eyebrow: 'Solução · Voice AI',
voiceai_hero_h1_pre: 'Voicebots inbound',
voiceai_hero_h1_accent: 'no seu PBX.',
voiceai_hero_sub: 'STT, TTS e turn-taking nativos sobre Asterisk. Sem SIP gymnastics, sem per-minute, sem lock-in no provedor de voz.',
voiceai_hero_cta_primary: 'Licença developer →',
voiceai_hero_cta_secondary: 'Ver código',

voiceai_ap_eyebrow: 'O que você substitui',
voiceai_ap_h2: 'Voicebots sem alugar a voz.',
voiceai_ap_sub: 'As plataformas SaaS de voicebot cobram por minuto e te lockam num único stack de provedor. Verbara faz o oposto.',
voiceai_ap_col_verbara: 'Verbara',
voiceai_ap_col_a: 'Vapi',
voiceai_ap_col_b: 'Bland.ai · Retell',
voiceai_ap_col_c: 'Pipecat (OSS)',
voiceai_ap_row_1: 'Open-core',
voiceai_ap_row_2: 'Self-host completo',
voiceai_ap_row_3: 'Asterisk-native (sem SIP gymnastics)',
voiceai_ap_row_4: 'Multi-tenant',
voiceai_ap_row_5: '6 STT + 6 TTS swappables',
voiceai_ap_row_6: 'OpenAI Realtime bridge',
voiceai_ap_row_7: 'Smart Turn + barge-in',

voiceai_cp_eyebrow: 'Leia o código',
voiceai_cp_h2: 'Um voicebot em 30 linhas.',
voiceai_cp_filename: 'VoiceAgent.cs',
voiceai_cp_caption: 'Verbara.Sdk.VoiceAI — agente Deepgram + ElevenLabs respondendo chamada Asterisk →',

voiceai_faq_eyebrow: 'FAQ · Voice AI',
voiceai_faq_h2: 'Perguntas de builders.',
voiceai_faq_q1: 'Quais provedores de STT/TTS suporta?',
voiceai_faq_a1: 'STT: Deepgram, Google, Whisper, Azure, Cartesia, AssemblyAI, Speechmatics. TTS: ElevenLabs Flash 2.5, Deepgram Aura 2, LMNT, Azure, Cartesia, Speechmatics. Mais bridge direto para a OpenAI Realtime API. Swappables via configuração, sem recompilação.',
voiceai_faq_q2: 'Qual a latência end-to-end?',
voiceai_faq_a2: 'Com Smart Turn detection + Deepgram Nova + ElevenLabs Flash 2.5 + barge-in: ~600ms p95 do fim-de-frase humano até o primeiro phoneme TTS, medido em infra própria com VU 100. Latência exata depende da sua infra e do LLM upstream.',
voiceai_faq_q3: 'Self-host sem telefonia própria?',
voiceai_faq_a3: 'Você precisa de um PBX Asterisk para o SDK receber áudio (seu, do cliente, ou implantado junto com Verbara). Se quer voicebots sem operar telefonia, Tier 3+ SaaS hospedado inclui PBX gerenciado.',

voiceai_pp_eyebrow: 'Pricing Voice AI',
voiceai_pp_h2: 'Por onde você começa?',
voiceai_pp_body: 'Tier 0 community gratuito para avaliação com SDK MIT direto. Tier 0.5 (Pro Developer, grátis 60 dias) para toda feature Pro. Tier 1+ quando shippa para produção single-tenant.',
voiceai_pp_cta: 'Ver pricing completo →',

voiceai_final_h2_pre: 'Voicebots',
voiceai_final_h2_accent: 'sem aluguel.',
voiceai_final_sub: 'Licença developer 60 dias, assinada, gratuita. SDK MIT — leia inteiro antes de adotar.',
```

- [ ] **Step 5: Run parity** — expected 370.

### Task F.1.8: Add `usecases.omnichannel_*` (Spoke 3 detail keys)

Pattern identical. Competitors: Twilio Conversations · Sinch / MessageBird · Chatwoot (OSS). Code filename: `OmnichannelRouter.cs`.

- [ ] **Step 1: Extend interface with 36 `omnichannel_*` keys.**

- [ ] **Step 2: es-419**:

```typescript
omnichannel_hero_eyebrow: 'Solución · Omnichannel',
omnichannel_hero_h1_pre: 'Once canales,',
omnichannel_hero_h1_accent: 'un inbox.',
omnichannel_hero_sub: 'WhatsApp Meta directo (sin BSP intermedio), SMS, email, WebChat, Telegram, IG, Messenger y más. Multi-tenant, con Flows DAG y nodos LLM.',
omnichannel_hero_cta_primary: 'Licencia developer →',
omnichannel_hero_cta_secondary: 'Ver código',

omnichannel_ap_eyebrow: 'Lo que reemplazas',
omnichannel_ap_h2: 'Once canales sin per-message.',
omnichannel_ap_sub: 'Los CPaaS de mensajería cobran por mensaje + por proveedor + por canal. Verbara los unifica.',
omnichannel_ap_col_verbara: 'Verbara',
omnichannel_ap_col_a: 'Twilio Conv.',
omnichannel_ap_col_b: 'Sinch · MessageBird',
omnichannel_ap_col_c: 'Chatwoot (OSS)',
omnichannel_ap_row_1: 'Open-core',
omnichannel_ap_row_2: 'Self-host',
omnichannel_ap_row_3: '11 conectores out-of-box',
omnichannel_ap_row_4: 'WhatsApp Meta directo',
omnichannel_ap_row_5: 'Flows DAG con nodos LLM',
omnichannel_ap_row_6: 'Multi-tenant white-label',
omnichannel_ap_row_7: 'Voz nativa integrada',

omnichannel_cp_eyebrow: 'Lee el código',
omnichannel_cp_h2: 'Una sola cola para todo.',
omnichannel_cp_filename: 'OmnichannelRouter.cs',
omnichannel_cp_caption: 'Verbara.Platform — WhatsApp + SMS + WebChat en un Flow DAG con 1 nodo LLM →',

omnichannel_faq_eyebrow: 'FAQ · Omnichannel',
omnichannel_faq_h2: 'Preguntas de mensajería.',
omnichannel_faq_q1: '¿WhatsApp Business API directo o vía BSP?',
omnichannel_faq_a1: 'Directo a Meta. Verbara implementa el WhatsApp Business Cloud API con HMAC verification y manejo de la ventana de 24h. Tú obtienes tu propio Business Account, sin BSP entre tú y Meta. Templates approved se gestionan vía Flows.',
omnichannel_faq_q2: '¿Soporta SMS bulk con providers regionales?',
omnichannel_faq_a2: 'Sí. El conector SMS es provider-agnostic con un provider Twilio incluido por defecto, plus segment calculation. Para LATAM, providers regionales (Infobip, Movile, etc.) se conectan implementando un IProvider — un par de horas de trabajo.',
omnichannel_faq_q3: '¿Cómo se enrutan conversaciones cross-canal?',
omnichannel_faq_a3: 'El módulo Conversations correlaciona por contacto: si un cliente escribe por WhatsApp y luego por email, ambos hits aterrizan en la misma conversación con timeline unificada. Routing es por skill/queue/team, no por canal — el operador ve toda la historia.',

omnichannel_pp_eyebrow: 'Precios Omnichannel',
omnichannel_pp_h2: '¿Qué tier necesitas?',
omnichannel_pp_body: 'Tier 0 community para evaluación self-host. Tier 2 ($30-50k/año) para multi-tenant en SaaS propio. Tier 3+ ($99/agente/mes) si prefieres hospedado con SLA.',
omnichannel_pp_cta: 'Ver pricing completo →',

omnichannel_final_h2_pre: 'Once canales,',
omnichannel_final_h2_accent: 'sin per-message.',
omnichannel_final_sub: 'Licencia developer 60 días, firmada, gratis. WhatsApp Meta directo, sin intermediarios.',
```

- [ ] **Step 3: en-US** (translate the above to English following Phases A-E patterns; preserve product names and `→` glyphs).

- [ ] **Step 4: pt-BR** (translate to Brazilian Portuguese; same constraints).

- [ ] **Step 5: Run parity** — expected 406.

### Task F.1.9: Add `usecases.cpaas_*` (Spoke 4 detail keys)

Pattern identical. Competitors: Twilio · Vonage / Plivo · Jambonz (OSS). Code filename: `OutboundCallExample.cs`.

- [ ] **Step 1: Extend interface with 36 `cpaas_*` keys.**

- [ ] **Step 2: es-419**:

```typescript
cpaas_hero_eyebrow: 'Solución · CPaaS',
cpaas_hero_h1_pre: 'Telefonía como librería,',
cpaas_hero_h1_accent: 'no como renta.',
cpaas_hero_sub: 'AMI · AGI · ARI · Live API · Activities. SDK MIT con federación multi-servidor, sin tarifas por minuto. Tu Asterisk, tu telco, tu código.',
cpaas_hero_cta_primary: 'dotnet add package Verbara.Sdk',
cpaas_hero_cta_secondary: 'Ver código',

cpaas_ap_eyebrow: 'Lo que reemplazas',
cpaas_ap_h2: 'CPaaS sin per-minute.',
cpaas_ap_sub: 'Los CPaaS cobran $0.014–0.045 por minuto y te encierran en su SIP. Verbara conecta directo a tu telco.',
cpaas_ap_col_verbara: 'Verbara',
cpaas_ap_col_a: 'Twilio',
cpaas_ap_col_b: 'Vonage · Plivo',
cpaas_ap_col_c: 'Jambonz (OSS)',
cpaas_ap_row_1: 'Open-core MIT',
cpaas_ap_row_2: 'Sin tarifas por minuto',
cpaas_ap_row_3: 'Asterisk-native',
cpaas_ap_row_4: 'Federación multi-servidor',
cpaas_ap_row_5: 'Activities state-machines',
cpaas_ap_row_6: 'Barge-in + turn-taking',
cpaas_ap_row_7: 'Multi-tenant licensing',

cpaas_cp_eyebrow: 'Lee el código',
cpaas_cp_h2: 'Outbound call + bridge + record.',
cpaas_cp_filename: 'OutboundCallExample.cs',
cpaas_cp_caption: 'Verbara.Sdk.Ari — coloca llamada outbound, hace bridge entre dos canales, graba el resultado →',

cpaas_faq_eyebrow: 'FAQ · CPaaS',
cpaas_faq_h2: 'Preguntas de telefonía.',
cpaas_faq_q1: '¿Necesito operar mi propio Asterisk?',
cpaas_faq_a1: 'Sí. Verbara es una librería sobre Asterisk; opera el PBX (tuyo, on-prem o en cloud) y conecta el SDK vía AMI/ARI. Si quieres CPaaS sin operar telefonía, mira Tier 3+ SaaS hospedado donde el PBX viene gestionado.',
cpaas_faq_q2: '¿Qué codecs soporta?',
cpaas_faq_a2: 'El SDK pasa el audio que Asterisk te entrega — soporta los codecs que tu Asterisk soporte (G.711, G.722, Opus, PCM, etc.). El pipeline VoiceAI hace resampling interno entre formatos cuando el LLM/TTS necesita 16kHz PCM.',
cpaas_faq_q3: '¿Federación multi-servidor de qué escala?',
cpaas_faq_a3: 'VerbaraServerPool soporta arbitrarios servidores Asterisk con failover y routing por canal/tenant. Hemos validado pools de hasta 8 nodos en R5.5 production validation; más allá depende de tu infra de PBX.',

cpaas_pp_eyebrow: 'Precios CPaaS',
cpaas_pp_h2: '¿Qué necesitas licenciar?',
cpaas_pp_body: 'Tier 0 community gratis con SDK MIT directo (community + community telephony primitives). Tier 1+ desbloquea features Pro: clustering, multi-tenant, dialer, agent assist. Tier 5 white-label para resellers.',
cpaas_pp_cta: 'Ver pricing completo →',

cpaas_final_h2_pre: 'Telefonía',
cpaas_final_h2_accent: 'que sí posees.',
cpaas_final_sub: 'Licencia developer 60 días, firmada, gratis. SDK MIT — la base es tuya para siempre.',
```

- [ ] **Step 3: en-US** (translate to English).
- [ ] **Step 4: pt-BR** (translate to Brazilian Portuguese).
- [ ] **Step 5: Run parity** — expected 442.

### Task F.1.10: Final i18n parity + commit Phase F.1

- [ ] **Step 1: Final parity sweep**

Run: `node scripts/check-i18n-parity.mjs`
Expected: `i18n parity OK across 3 locales (442 keys each).`

- [ ] **Step 2: Run typecheck**

Run: `npm run build`
Expected: build succeeds with 0 type errors. Treat any TS error in `messages.ts` as a missed interface field.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/messages.ts
git commit -m "feat(i18n): add Phase F keys (~210 new) for hub-and-spoke

- nav: solutions dropdown labels (6 keys)
- footer: column_solutions + column_stack + 4 spoke names (6 keys)
- home: replace hero/final-CTA copy for runtime reframe; add solutions
  overview block (18 keys); replace faq_q6
- pricing: best_for_label + 7 tier mappings + subtitle_2 (9 keys)
- usecases: new namespace with index + 4 spokes × 36 keys = 178 keys

Translations: es-419 source + en-US + pt-BR translations with parity
green at 442 keys × 3 locales = 1,326 strings."
```

---

# PHASE F.2 — Home reframe

The home now reads from the new `solutions_*` keys + replaced `hero_*` / `final_*` / `faq_*`. The CC anti-positioning is removed and replaced by the Solutions overview composite.

### Task F.2.1: Build the `SolutionsOverview` composite

**Files:**
- Create: `src/components/composites/SolutionsOverview.astro`

- [ ] **Step 1: Write the composite**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import Card from '../primitives/Card.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const cards = [
  {
    eyebrow: t.home.solutions_card_cc_eyebrow,
    title: t.home.solutions_card_cc_title,
    sub: t.home.solutions_card_cc_sub,
    cta: t.home.solutions_card_cc_cta,
    href: localiseHref('use-cases/contact-center', locale),
    slug: 'cc',
  },
  {
    eyebrow: t.home.solutions_card_voiceai_eyebrow,
    title: t.home.solutions_card_voiceai_title,
    sub: t.home.solutions_card_voiceai_sub,
    cta: t.home.solutions_card_voiceai_cta,
    href: localiseHref('use-cases/voice-ai', locale),
    slug: 'voiceai',
  },
  {
    eyebrow: t.home.solutions_card_omnichannel_eyebrow,
    title: t.home.solutions_card_omnichannel_title,
    sub: t.home.solutions_card_omnichannel_sub,
    cta: t.home.solutions_card_omnichannel_cta,
    href: localiseHref('use-cases/omnichannel', locale),
    slug: 'omnichannel',
  },
  {
    eyebrow: t.home.solutions_card_cpaas_eyebrow,
    title: t.home.solutions_card_cpaas_title,
    sub: t.home.solutions_card_cpaas_sub,
    cta: t.home.solutions_card_cpaas_cta,
    href: localiseHref('use-cases/cpaas', locale),
    slug: 'cpaas',
  },
];
---

<Section id="solutions" data-section="solutions-overview">
  <Container size="lg">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">
          {t.home.solutions_eyebrow}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.home.solutions_h2}
        </h2>
      </div>

      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-solutions-grid>
        {cards.map((card) => (
          <li>
            <Card as="article" class="h-full" data-spoke={card.slug}>
              <p class="text-xs uppercase tracking-wider font-mono text-signal mb-2">
                {card.eyebrow}
              </p>
              <h3 class="text-xl font-semibold mb-2">{card.title}</h3>
              <p class="text-sm text-bone-2 mb-4">{card.sub}</p>
              <a
                href={card.href}
                class="text-sm font-medium text-signal hover:text-signal-deep"
                data-spoke-cta={card.slug}
              >
                {card.cta}
              </a>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  </Container>
</Section>
```

- [ ] **Step 2: Verify it imports cleanly**

Run: `npm run build`
Expected: build succeeds. If TS errors fire from `localiseHref('use-cases/contact-center', ...)` — that helper accepts arbitrary route strings, so it should pass.

- [ ] **Step 3: Stage (don't commit yet — paired with home wire-up)**

```bash
git add src/components/composites/SolutionsOverview.astro
```

### Task F.2.2: Wire `SolutionsOverview` into both home pages + replace anti-pos + update FAQ items

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[lang]/index.astro`

- [ ] **Step 1: Update default-locale home**

Replace `src/pages/index.astro` content with:

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/composites/Hero.astro';
import SolutionsOverview from '../components/composites/SolutionsOverview.astro';
import ArchitectureDiagram from '../components/composites/ArchitectureDiagram.astro';
import CodeProof from '../components/composites/CodeProof.astro';
import PricingTeaser from '../components/composites/PricingTeaser.astro';
import Faq from '../components/composites/Faq.astro';
import FinalCta from '../components/composites/FinalCta.astro';
import { getMessages } from '../i18n/messages';
import { getLocaleFromPath } from '../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout>
  <Hero />
  <SolutionsOverview />
  <ArchitectureDiagram />
  <CodeProof />
  <PricingTeaser />
  <Faq
    eyebrow={t.home.faq_eyebrow}
    heading={t.home.faq_h2}
    items={[
      { q: t.home.faq_q1, a: t.home.faq_a1 },
      { q: t.home.faq_q2, a: t.home.faq_a2 },
      { q: t.home.faq_q3, a: t.home.faq_a3 },
      { q: t.home.faq_q4, a: t.home.faq_a4 },
      { q: t.home.faq_q5, a: t.home.faq_a5 },
      { q: t.home.faq_q6, a: t.home.faq_a6 },
    ]}
  />
  <FinalCta />
</Layout>
```

(The diff: removed `AntiPositioningTable` import + usage; added `SolutionsOverview` import + usage. FAQ list unchanged because the q/a *values* changed in F.1.3, not the keys.)

- [ ] **Step 2: Update localized home**

Apply the identical change to `src/pages/[lang]/index.astro` (paths are `'../../...'` instead of `'../...'`).

- [ ] **Step 3: Visual smoke**

Run: `npm run dev`, open `http://localhost:4321/`, `http://localhost:4321/en-US/`, `http://localhost:4321/pt-BR/`.

Expected:
- Hero shows new h1 "El runtime open-core de comunicaciones que puedes auditar, ejecutar, poseer." (and en-US, pt-BR equivalents).
- Hero secondary CTA reads "Ver soluciones →" / "See solutions →" / "Ver soluções →".
- Section 2 is a 4-card grid (Contact Center / Voice AI / Omnichannel / CPaaS), NOT the previous CC anti-pos table.
- Cards link to `/use-cases/contact-center/`, etc. (these will 404 until F.4-F.8 ship; that's expected at this checkpoint).
- FAQ Q6 is now "¿Por dónde empiezo según mi use-case?" with new answer.
- Final CTA opener is "Deja de rentar tu stack de comunicaciones."

- [ ] **Step 4: Commit**

```bash
git add src/components/composites/SolutionsOverview.astro src/pages/index.astro src/pages/[lang]/index.astro
git commit -m "feat(home): replace CC anti-pos with SolutionsOverview composite

- New composite SolutionsOverview renders 4-card grid linking to
  /use-cases/{contact-center,voice-ai,omnichannel,cpaas}/
- Home pages (default + [lang]) drop AntiPositioningTable from section 2
  and import SolutionsOverview in its place
- Hero h1, hero subtitle, hero secondary CTA, final-CTA opener, and FAQ
  Q1/Q6 read updated copy from F.1 (no template changes needed —
  composites self-resolve i18n)

Spoke pages (/use-cases/*) ship in F.4-F.8; cards link will 404 until
those land. Acceptable at this checkpoint per Phase F single-PR plan."
```

---

# PHASE F.3 — Nav dropdown + Footer

The header replaces the `Producto` anchor with a `Soluciones ▾` dropdown that lists the 4 spokes plus an "all solutions" link. Mobile collapses into a nested accordion. Footer renames `Producto` column to `Stack` and adds a new `Soluciones` column.

### Task F.3.1: Refactor `NavBar.astro` for desktop dropdown + mobile nested

**Files:**
- Modify: `src/components/composites/NavBar.astro`

- [ ] **Step 1: Replace the file with the dropdown-aware version**

```astro
---
import { LOCALES } from '../../i18n/messages';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, getRouteFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const route = getRouteFromPath(Astro.url.pathname);
const t = getMessages(locale);

const localeLabel = (l: typeof LOCALES[number]) =>
  l === 'es-419' ? 'ES' : l === 'en-US' ? 'EN' : 'PT';

const spokes = [
  { label: t.nav.solutions_cc,           href: localiseHref('use-cases/contact-center', locale) },
  { label: t.nav.solutions_voiceai,      href: localiseHref('use-cases/voice-ai', locale) },
  { label: t.nav.solutions_omnichannel,  href: localiseHref('use-cases/omnichannel', locale) },
  { label: t.nav.solutions_cpaas,        href: localiseHref('use-cases/cpaas', locale) },
];
const allSolutionsHref = localiseHref('use-cases', locale);
---

<header class="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
    <a
      href={localiseHref('', locale)}
      class="flex items-center gap-2 font-bold text-lg tracking-tight text-bone hover:text-signal"
    >
      <svg width="24" height="24" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M10 18 L32 50 L54 18" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 32 H42" stroke="#40D9FF" stroke-width="6" stroke-linecap="round"/>
      </svg>
      <span>Verbara<sup class="text-xs opacity-60 ml-0.5">™</sup></span>
    </a>

    <nav aria-label="Primary" class="hidden md:flex items-center gap-7 text-sm text-bone-2">
      <div class="relative" data-nav-dropdown="solutions">
        <button
          type="button"
          id="nav-solutions-toggle"
          class="flex items-center gap-1 hover:text-bone"
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="nav-solutions-panel"
        >
          {t.nav.solutions}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div
          id="nav-solutions-panel"
          class="hidden absolute left-0 top-full mt-2 min-w-56 rounded-lg border border-line-strong bg-ink-3 py-2 shadow-lg"
          role="menu"
        >
          {spokes.map((s) => (
            <a
              href={s.href}
              role="menuitem"
              class="block px-4 py-2 text-sm text-bone-2 hover:bg-ink-2 hover:text-bone"
            >{s.label}</a>
          ))}
          <div class="my-1 border-t border-line"></div>
          <a
            href={allSolutionsHref}
            role="menuitem"
            class="block px-4 py-2 text-sm font-medium text-signal hover:bg-ink-2"
          >{t.nav.solutions_all}</a>
        </div>
      </div>
      <a href={localiseHref('pricing', locale)} class="hover:text-bone">{t.nav.pricing}</a>
      <a href={localiseHref('developer-license', locale)} class="hover:text-bone">{t.nav.developer_license}</a>
      <a href="https://github.com/verbara" class="hover:text-bone">{t.nav.github}</a>
    </nav>

    <div class="flex items-center gap-1.5 text-xs">
      {LOCALES.map((l) => (
        <a
          href={localiseHref(route, l)}
          class:list={[
            'rounded px-1.5 py-1 font-mono',
            l === locale ? 'text-signal font-semibold' : 'text-bone-2 hover:text-bone',
          ]}
          aria-current={l === locale ? 'page' : undefined}
        >{localeLabel(l)}</a>
      ))}

      <button
        type="button"
        id="nav-mobile-toggle"
        class="md:hidden ml-2 text-bone p-1"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="nav-mobile-panel"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M3 6 H19 M3 11 H19 M3 16 H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>

  <div
    id="nav-mobile-panel"
    class="md:hidden hidden border-t border-line bg-ink"
  >
    <nav aria-label="Mobile" class="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3 text-sm">
      <details data-mobile-solutions>
        <summary class="text-bone-2 hover:text-bone cursor-pointer flex items-center justify-between py-1">
          {t.nav.solutions}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </summary>
        <div class="mt-2 ml-2 flex flex-col gap-2 border-l border-line pl-3">
          {spokes.map((s) => (
            <a href={s.href} class="text-bone-2 hover:text-bone text-sm">{s.label}</a>
          ))}
          <a href={allSolutionsHref} class="text-signal hover:text-signal-deep text-sm font-medium">{t.nav.solutions_all}</a>
        </div>
      </details>
      <a href={localiseHref('pricing', locale)} class="text-bone-2 hover:text-bone">{t.nav.pricing}</a>
      <a href={localiseHref('developer-license', locale)} class="text-bone-2 hover:text-bone">{t.nav.developer_license}</a>
      <a href="https://github.com/verbara" class="text-bone-2 hover:text-bone">{t.nav.github}</a>
    </nav>
  </div>
</header>

<script>
  // Mobile menu toggle (unchanged)
  const toggle = document.getElementById('nav-mobile-toggle');
  const panel = document.getElementById('nav-mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  // Desktop solutions dropdown
  const dropdownToggle = document.getElementById('nav-solutions-toggle');
  const dropdownPanel = document.getElementById('nav-solutions-panel');
  if (dropdownToggle && dropdownPanel) {
    const setOpen = (open: boolean) => {
      dropdownPanel.classList.toggle('hidden', !open);
      dropdownToggle.setAttribute('aria-expanded', String(open));
    };
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdownPanel.classList.contains('hidden');
      setOpen(!isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!dropdownPanel.contains(e.target as Node) && e.target !== dropdownToggle) {
        setOpen(false);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }
</script>
```

- [ ] **Step 2: Build & visual smoke**

Run: `npm run build` (must succeed); `npm run dev`; open `http://localhost:4321/`.

Expected:
- Desktop: hover/click on `Soluciones ▾` opens dropdown with 4 spokes + "Ver todas las soluciones →" separator link.
- Esc + outside-click both close the dropdown.
- Mobile (resize <768px): hamburger reveals stacked nav; `Soluciones` is a `<details>` element that expands to show 4 spokes + "see all" link.
- Locale switcher unchanged.

- [ ] **Step 3: Stage (commit at end of F.3 with footer)**

```bash
git add src/components/composites/NavBar.astro
```

### Task F.3.2: Update `Footer.astro` (rename Producto → Stack column, add Soluciones column)

**Files:**
- Read first: `src/components/composites/Footer.astro` (to know current structure)
- Modify: `src/components/composites/Footer.astro`

- [ ] **Step 1: Read current footer**

Run: `cat src/components/composites/Footer.astro`

Note current column structure. The plan below assumes the footer has 3 columns currently (Product, Resources, Legal) wired through `t.footer.column_product`, `t.footer.column_resources`, `t.footer.column_legal`.

- [ ] **Step 2: Update column references**

Inside Footer.astro, rename references:
- `t.footer.column_product` → `t.footer.column_stack` (the column heading text key)
- The list items under that column: replace the existing `landing.stack_*` or product links with the 4 stack links (SDK, Pro, Platform, Web). These already exist as `t.landing.stack_*` keys — keep that wiring; only the heading key changes.

Add a NEW column **before Resources** (so order becomes: Stack · Solutions · Resources · Legal):

```astro
<div>
  <h3 class="text-xs uppercase tracking-wider font-mono text-signal mb-3">
    {t.footer.column_solutions}
  </h3>
  <ul class="space-y-2 text-sm text-bone-2">
    <li><a href={localiseHref('use-cases/contact-center', locale)} class="hover:text-bone">{t.footer.solutions_cc}</a></li>
    <li><a href={localiseHref('use-cases/voice-ai', locale)} class="hover:text-bone">{t.footer.solutions_voiceai}</a></li>
    <li><a href={localiseHref('use-cases/omnichannel', locale)} class="hover:text-bone">{t.footer.solutions_omnichannel}</a></li>
    <li><a href={localiseHref('use-cases/cpaas', locale)} class="hover:text-bone">{t.footer.solutions_cpaas}</a></li>
  </ul>
</div>
```

(If `localiseHref` is not already imported in Footer.astro, add `import { localiseHref } from '../../i18n/utils';` at the top.)

Adjust the parent grid to accommodate 4 columns instead of 3:
- Replace `md:grid-cols-3` with `md:grid-cols-4` (or `md:grid-cols-2 lg:grid-cols-4` if responsive desired).

- [ ] **Step 3: Verify the deprecated `column_product` key is no longer referenced**

Run: `grep -n "column_product" src/components/composites/Footer.astro`
Expected: no matches.

Run: `grep -rn "column_product" src/`
Expected: no matches in components or pages. (Note: the i18n key `column_product` still exists in `messages.ts` from before the rename. We will remove it in F.11 after the build is fully green; leaving it in for now keeps the type stable. To skip TS unused warnings, mark the key with a comment: `column_product: string; // deprecated — Phase F.11 removes`. Update messages.ts accordingly if a strict-unused lint catches it.)

- [ ] **Step 4: Visual smoke**

Run: `npm run dev`, scroll footer.

Expected:
- 4 columns: Stack · Soluciones · Recursos · Legal (es-419) / Stack · Solutions · Resources · Legal (en-US) / Stack · Soluções · Recursos · Legal (pt-BR).
- Stack column lists SDK, Pro, Platform, Web (existing content kept).
- Soluciones column lists 4 spoke names linking to `/use-cases/*`.

- [ ] **Step 5: Commit F.3**

```bash
git add src/components/composites/NavBar.astro src/components/composites/Footer.astro
git commit -m "feat(nav,footer): Soluciones dropdown + Soluciones footer column

NavBar:
- Desktop: replace 'Producto' anchor with 'Soluciones ▾' dropdown
  containing 4 spoke links + 'see all solutions' separator
- Mobile: nested <details> accordion under primary nav
- Esc + outside-click close the dropdown
- Locale switcher unchanged

Footer:
- Rename 'Producto' column to 'Stack' (heading key change only;
  links to SDK/Pro/Platform/Web kept)
- Add new 'Soluciones' column before Resources with 4 spoke links
- Grid now 4 columns on md+

Cards link to /use-cases/* which still 404 until F.4-F.8 ship.
i18n keys come from F.1 (nav.solutions_*, footer.column_solutions,
footer.solutions_*)."
```

---

# PHASE F.4 — `/use-cases/` index page + per-spoke composites

This phase ships the index page AND the reusable composites that all 4 spokes share. After this phase, the index is live in 3 locales and the composite primitives needed by F.5–F.8 exist.

### Task F.4.1: Build `UseCaseIndexCard` composite

**Files:**
- Create: `src/components/composites/UseCaseIndexCard.astro`

- [ ] **Step 1: Write the composite**

```astro
---
import Card from '../primitives/Card.astro';

interface Props {
  eyebrow: string;
  title: string;
  sub: string;
  caps: [string, string, string];
  cta: string;
  href: string;
  slug: string;
}
const { eyebrow, title, sub, caps, cta, href, slug } = Astro.props;
---

<Card as="article" class="h-full flex flex-col" data-spoke-card={slug}>
  <p class="text-xs uppercase tracking-wider font-mono text-signal mb-2">{eyebrow}</p>
  <h2 class="text-2xl font-semibold mb-3">{title}</h2>
  <p class="text-sm text-bone-2 mb-4">{sub}</p>
  <ul class="text-xs font-mono text-bone-3 space-y-1 mb-6 flex-1">
    {caps.map((c) => (
      <li class="flex items-start gap-2">
        <span aria-hidden="true">·</span>
        <span>{c}</span>
      </li>
    ))}
  </ul>
  <a href={href} class="text-sm font-medium text-signal hover:text-signal-deep" data-spoke-cta={slug}>
    {cta}
  </a>
</Card>
```

- [ ] **Step 2: Build & stage**

Run: `npm run build`. Stage the file: `git add src/components/composites/UseCaseIndexCard.astro`.

### Task F.4.2: Build `UseCaseHero` composite (props-driven; reused by all 4 spokes)

**Files:**
- Create: `src/components/composites/UseCaseHero.astro`

- [ ] **Step 1: Write the composite**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import Button from '../primitives/Button.astro';
import Badge from '../primitives/Badge.astro';

interface Props {
  eyebrow: string;
  h1Pre: string;
  h1Accent: string;
  sub: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
}
const { eyebrow, h1Pre, h1Accent, sub, ctaPrimary, ctaPrimaryHref, ctaSecondary, ctaSecondaryHref } = Astro.props;
---

<Section>
  <Container size="sm">
    <div class="space-y-6 text-center">
      <Badge variant="mono">{eyebrow}</Badge>
      <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-balance text-center">
        {h1Pre} <span class="text-amber">{h1Accent}</span>
      </h1>
      <p class="text-xl text-bone-2 text-balance max-w-2xl mx-auto">{sub}</p>
      <div class="flex flex-wrap justify-center gap-3 pt-2">
        <Button variant="primary" size="lg" href={ctaPrimaryHref}>{ctaPrimary}</Button>
        <Button variant="secondary" size="lg" href={ctaSecondaryHref}>{ctaSecondary}</Button>
      </div>
    </div>
  </Container>
</Section>
```

- [ ] **Step 2: Build & stage**

`npm run build`. `git add src/components/composites/UseCaseHero.astro`.

### Task F.4.3: Build `SpokeAntiPositioning` composite

**Files:**
- Create: `src/components/composites/SpokeAntiPositioning.astro`

- [ ] **Step 1: Write the composite**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';

interface Props {
  eyebrow: string;
  heading: string;
  sub: string;
  colVerbara: string;
  colA: string;
  colB: string;
  colC: string;
  rows: Array<{ label: string; verbara: string; a: string; b: string; c: string }>;
}
const { eyebrow, heading, sub, colVerbara, colA, colB, colC, rows } = Astro.props;
---

<Section tone="inset">
  <Container size="lg">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">{eyebrow}</p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">{heading}</h2>
        <p class="text-lg text-bone-2 text-balance">{sub}</p>
      </div>
      <div class="overflow-x-auto rounded-lg border border-line-strong">
        <table class="w-full text-sm">
          <thead class="bg-ink-3">
            <tr>
              <th class="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-bone-3">&nbsp;</th>
              <th class="text-left px-4 py-3 font-medium text-signal">{colVerbara}</th>
              <th class="text-left px-4 py-3 font-medium text-bone-2">{colA}</th>
              <th class="text-left px-4 py-3 font-medium text-bone-2">{colB}</th>
              <th class="text-left px-4 py-3 font-medium text-bone-2">{colC}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            {rows.map((r) => (
              <tr>
                <td class="px-4 py-3 font-medium">{r.label}</td>
                <td class="px-4 py-3 text-signal font-mono text-xs">{r.verbara}</td>
                <td class="px-4 py-3 text-bone-2 font-mono text-xs">{r.a}</td>
                <td class="px-4 py-3 text-bone-2 font-mono text-xs">{r.b}</td>
                <td class="px-4 py-3 text-bone-2 font-mono text-xs">{r.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Container>
</Section>
```

- [ ] **Step 2: Build & stage**

### Task F.4.4: Build `SpokeCodeProof` composite

**Files:**
- Create: `src/components/composites/SpokeCodeProof.astro`

- [ ] **Step 1: Write the composite**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import CodeBlock from '../primitives/CodeBlock.astro';

interface Props {
  eyebrow: string;
  heading: string;
  filename: string;
  caption: string;
  code: string;
  language?: string;
}
const { eyebrow, heading, filename, caption, code, language = 'csharp' } = Astro.props;
---

<Section>
  <Container size="md">
    <div class="space-y-8">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">{eyebrow}</p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">{heading}</h2>
      </div>
      <CodeBlock filename={filename} language={language}>{code}</CodeBlock>
      <p class="text-center text-sm text-bone-3">{caption}</p>
    </div>
  </Container>
</Section>
```

(If `CodeBlock` doesn't accept a `filename` prop, check its existing API: `cat src/components/primitives/CodeBlock.astro` and adapt. The `home.cp_filename` key in F.1 source already exists, so the primitive almost certainly handles it.)

- [ ] **Step 2: Build & stage**

### Task F.4.5: Build `SpokePricingPointer` composite

**Files:**
- Create: `src/components/composites/SpokePricingPointer.astro`

- [ ] **Step 1: Write the composite**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import Card from '../primitives/Card.astro';
import Button from '../primitives/Button.astro';

interface Props {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  ctaHref: string;
}
const { eyebrow, heading, body, cta, ctaHref } = Astro.props;
---

<Section>
  <Container size="md">
    <Card as="div" variant="default">
      <p class="text-xs uppercase tracking-wider font-mono text-signal mb-2">{eyebrow}</p>
      <h2 class="text-2xl font-semibold mb-3">{heading}</h2>
      <p class="text-bone-2 mb-5">{body}</p>
      <Button variant="secondary" href={ctaHref}>{cta}</Button>
    </Card>
  </Container>
</Section>
```

- [ ] **Step 2: Build & stage**

### Task F.4.6: Build `/use-cases/` index page (default + localized)

**Files:**
- Create: `src/pages/use-cases/index.astro`
- Create: `src/pages/[lang]/use-cases/index.astro`

- [ ] **Step 1: Default-locale index**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Section from '../../components/primitives/Section.astro';
import Container from '../../components/primitives/Container.astro';
import UseCaseIndexCard from '../../components/composites/UseCaseIndexCard.astro';
import FinalCta from '../../components/composites/FinalCta.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const cards = [
  { slug: 'cc',           route: 'use-cases/contact-center', prefix: 'cc' as const },
  { slug: 'voiceai',      route: 'use-cases/voice-ai',       prefix: 'voiceai' as const },
  { slug: 'omnichannel',  route: 'use-cases/omnichannel',    prefix: 'omnichannel' as const },
  { slug: 'cpaas',        route: 'use-cases/cpaas',          prefix: 'cpaas' as const },
];
---

<Layout>
  <Section>
    <Container size="md">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">{t.usecases.index_eyebrow}</p>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-balance">
          {t.usecases.index_h1_pre} <span class="text-amber">{t.usecases.index_h1_accent}</span>
        </h1>
        <p class="text-lg text-bone-2 text-balance max-w-2xl mx-auto">{t.usecases.index_sub}</p>
      </div>
    </Container>
  </Section>

  <Section>
    <Container size="lg">
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4" data-usecases-grid>
        {cards.map(({ slug, route, prefix }) => (
          <li>
            <UseCaseIndexCard
              slug={slug}
              eyebrow={t.usecases[`${prefix}_index_eyebrow` as const]}
              title={t.usecases[`${prefix}_index_title` as const]}
              sub={t.usecases[`${prefix}_index_sub` as const]}
              caps={[
                t.usecases[`${prefix}_index_cap1` as const],
                t.usecases[`${prefix}_index_cap2` as const],
                t.usecases[`${prefix}_index_cap3` as const],
              ]}
              cta={t.usecases[`${prefix}_index_cta` as const]}
              href={localiseHref(route, locale)}
            />
          </li>
        ))}
      </ul>
    </Container>
  </Section>

  <FinalCta />
</Layout>
```

- [ ] **Step 2: Localized variant**

Create `src/pages/[lang]/use-cases/index.astro`:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Section from '../../../components/primitives/Section.astro';
import Container from '../../../components/primitives/Container.astro';
import UseCaseIndexCard from '../../../components/composites/UseCaseIndexCard.astro';
import FinalCta from '../../../components/composites/FinalCta.astro';
import { getMessages } from '../../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../../i18n/utils';

export function getStaticPaths() {
  return [{ params: { lang: 'en-US' } }, { params: { lang: 'pt-BR' } }];
}

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const cards = [
  { slug: 'cc',           route: 'use-cases/contact-center', prefix: 'cc' as const },
  { slug: 'voiceai',      route: 'use-cases/voice-ai',       prefix: 'voiceai' as const },
  { slug: 'omnichannel',  route: 'use-cases/omnichannel',    prefix: 'omnichannel' as const },
  { slug: 'cpaas',        route: 'use-cases/cpaas',          prefix: 'cpaas' as const },
];
---

<Layout>
  <Section>
    <Container size="md">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">{t.usecases.index_eyebrow}</p>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-balance">
          {t.usecases.index_h1_pre} <span class="text-amber">{t.usecases.index_h1_accent}</span>
        </h1>
        <p class="text-lg text-bone-2 text-balance max-w-2xl mx-auto">{t.usecases.index_sub}</p>
      </div>
    </Container>
  </Section>

  <Section>
    <Container size="lg">
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4" data-usecases-grid>
        {cards.map(({ slug, route, prefix }) => (
          <li>
            <UseCaseIndexCard
              slug={slug}
              eyebrow={t.usecases[`${prefix}_index_eyebrow` as const]}
              title={t.usecases[`${prefix}_index_title` as const]}
              sub={t.usecases[`${prefix}_index_sub` as const]}
              caps={[
                t.usecases[`${prefix}_index_cap1` as const],
                t.usecases[`${prefix}_index_cap2` as const],
                t.usecases[`${prefix}_index_cap3` as const],
              ]}
              cta={t.usecases[`${prefix}_index_cta` as const]}
              href={localiseHref(route, locale)}
            />
          </li>
        ))}
      </ul>
    </Container>
  </Section>

  <FinalCta />
</Layout>
```

- [ ] **Step 3: Build + visual smoke**

`npm run build`. `npm run dev`. Visit:
- `http://localhost:4321/use-cases/`
- `http://localhost:4321/en-US/use-cases/`
- `http://localhost:4321/pt-BR/use-cases/`

Expected: each renders an h1 with eyebrow + 4 cards in a responsive grid + FinalCta. Card links go to `/use-cases/contact-center/` etc. (404 until F.5–F.8).

- [ ] **Step 4: Commit Phase F.4**

```bash
git add src/components/composites/UseCaseIndexCard.astro \
        src/components/composites/UseCaseHero.astro \
        src/components/composites/SpokeAntiPositioning.astro \
        src/components/composites/SpokeCodeProof.astro \
        src/components/composites/SpokePricingPointer.astro \
        src/pages/use-cases/index.astro \
        src/pages/[lang]/use-cases/index.astro
git commit -m "feat(use-cases): index page + reusable spoke composites

- /use-cases/ index page (default + [lang] variants) renders 4
  UseCaseIndexCard tiles linking to spoke pages.
- New composites for use by 4 spokes:
  - UseCaseHero (props-driven, mirrors home Hero shape)
  - SpokeAntiPositioning (props for competitor set + 7 rows)
  - SpokeCodeProof (props for filename + caption + code)
  - SpokePricingPointer (single-card price pointer)

Spoke pages themselves ship in F.5-F.8."
```

---

# PHASE F.5 — Spoke 1: Contact Center

The CC spoke is the canonical contact-center narrative; it absorbs the CC-specific anti-positioning that previously lived on the home (now relocated here), plus its own hero, code-proof, FAQ, pricing-pointer, and final-CTA — all reading from `t.usecases.cc_*` keys defined in F.1.6.

### Task F.5.1: Build the CC spoke page

**Files:**
- Create: `src/pages/use-cases/contact-center.astro`

- [ ] **Step 1: Write the page**

```astro
---
import Layout from '../../layouts/Layout.astro';
import UseCaseHero from '../../components/composites/UseCaseHero.astro';
import SpokeAntiPositioning from '../../components/composites/SpokeAntiPositioning.astro';
import ArchitectureDiagram from '../../components/composites/ArchitectureDiagram.astro';
import SpokeCodeProof from '../../components/composites/SpokeCodeProof.astro';
import Faq from '../../components/composites/Faq.astro';
import SpokePricingPointer from '../../components/composites/SpokePricingPointer.astro';
import FinalCta from '../../components/composites/FinalCta.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const apRows = [
  { label: t.usecases.cc_ap_row_1, verbara: '✓ MIT + Apache',  a: '✗ closed cloud',     b: '✓',                  c: '✓' },
  { label: t.usecases.cc_ap_row_2, verbara: '✓',                a: '✗ or restricted',    b: '✓ entirely DIY',     c: '✓' },
  { label: t.usecases.cc_ap_row_3, verbara: '✓',                a: '✓',                  b: '✗',                  c: '✗' },
  { label: t.usecases.cc_ap_row_4, verbara: '✓ native',         a: '✓ proprietary',      b: '✗',                  c: '✗' },
  { label: t.usecases.cc_ap_row_5, verbara: '✓ Pro',            a: '✓ enterprise',       b: '✗',                  c: 'partial' },
  { label: t.usecases.cc_ap_row_6, verbara: '✓ Pro',            a: '✓ enterprise',       b: '✗',                  c: '✗' },
  { label: t.usecases.cc_ap_row_7, verbara: '✓',                a: 'translated',         b: 'n/a',                c: 'community-translated' },
];

const codeSample = `using Verbara.Platform.Api;
using Verbara.Sdk.Pro.Licensing;
using Verbara.Sdk.Pro.MultiTenant;

var builder = WebApplication.CreateBuilder(args);
builder.Services
  .AddVerbaraPlatform()
  .AddPro(opts => {
    opts.LicenseFile = "/etc/verbara/license.lic";
    opts.EnableMultiTenant();
    opts.EnableCallAnalytics();
    opts.EnableAgentAssist();
  });

var app = builder.Build();
app.MapVerbaraPlatform();
await app.RunAsync();`;
---

<Layout>
  <UseCaseHero
    eyebrow={t.usecases.cc_hero_eyebrow}
    h1Pre={t.usecases.cc_hero_h1_pre}
    h1Accent={t.usecases.cc_hero_h1_accent}
    sub={t.usecases.cc_hero_sub}
    ctaPrimary={t.usecases.cc_hero_cta_primary}
    ctaPrimaryHref={localiseHref('developer-license', locale)}
    ctaSecondary={t.usecases.cc_hero_cta_secondary}
    ctaSecondaryHref={`${localiseHref('pricing', locale)}#group-self`}
  />

  <SpokeAntiPositioning
    eyebrow={t.usecases.cc_ap_eyebrow}
    heading={t.usecases.cc_ap_h2}
    sub={t.usecases.cc_ap_sub}
    colVerbara={t.usecases.cc_ap_col_verbara}
    colA={t.usecases.cc_ap_col_a}
    colB={t.usecases.cc_ap_col_b}
    colC={t.usecases.cc_ap_col_c}
    rows={apRows}
  />

  <ArchitectureDiagram />

  <SpokeCodeProof
    eyebrow={t.usecases.cc_cp_eyebrow}
    heading={t.usecases.cc_cp_h2}
    filename={t.usecases.cc_cp_filename}
    caption={t.usecases.cc_cp_caption}
    code={codeSample}
  />

  <Faq
    eyebrow={t.usecases.cc_faq_eyebrow}
    heading={t.usecases.cc_faq_h2}
    items={[
      { q: t.usecases.cc_faq_q1, a: t.usecases.cc_faq_a1 },
      { q: t.usecases.cc_faq_q2, a: t.usecases.cc_faq_a2 },
      { q: t.usecases.cc_faq_q3, a: t.usecases.cc_faq_a3 },
    ]}
  />

  <SpokePricingPointer
    eyebrow={t.usecases.cc_pp_eyebrow}
    heading={t.usecases.cc_pp_h2}
    body={t.usecases.cc_pp_body}
    cta={t.usecases.cc_pp_cta}
    ctaHref={localiseHref('pricing', locale)}
  />

  <FinalCta />
</Layout>
```

Note: `FinalCta` reads `home.final_h2_pre/accent/sub/cta` from i18n. For per-spoke final CTAs we use the spoke's own `cc_final_*` keys via a small inline rewrite. To keep the existing FinalCta composite generic, we instead override at the spoke level by composing a **local** final-CTA section. Replace the `<FinalCta />` line with the inline block below:

```astro
  <section class="py-20 md:py-28">
    <div class="mx-auto max-w-3xl px-6 text-center space-y-4">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        {t.usecases.cc_final_h2_pre} <span class="text-amber">{t.usecases.cc_final_h2_accent}</span>
      </h2>
      <p class="text-lg text-bone-2 text-balance">{t.usecases.cc_final_sub}</p>
      <a
        href={localiseHref('developer-license', locale)}
        class="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-signal-deep"
      >{t.home.final_cta}</a>
    </div>
  </section>
```

(Re-uses `t.home.final_cta` for the button label since that string is identical across all spokes; the heading/sub differ per spoke.)

- [ ] **Step 2: Build & smoke**

`npm run build`. `npm run dev`. Visit `http://localhost:4321/use-cases/contact-center/`. Verify hero, anti-pos table (7 rows × 5 cols), architecture diagram, code-proof block, FAQ (3 toggles), pricing pointer card, final CTA.

- [ ] **Step 3: Stage** (commit at end of Phase F.5 with localized variant)

### Task F.5.2: Build localized CC spoke variant

**Files:**
- Create: `src/pages/[lang]/use-cases/contact-center.astro`

- [ ] **Step 1: Write the localized variant**

Identical to F.5.1 with these adjustments:
- Path prefix `'../../../'` instead of `'../../'`.
- Add `getStaticPaths` returning `[{ params: { lang: 'en-US' } }, { params: { lang: 'pt-BR' } }]`.

```astro
---
import Layout from '../../../layouts/Layout.astro';
import UseCaseHero from '../../../components/composites/UseCaseHero.astro';
import SpokeAntiPositioning from '../../../components/composites/SpokeAntiPositioning.astro';
import ArchitectureDiagram from '../../../components/composites/ArchitectureDiagram.astro';
import SpokeCodeProof from '../../../components/composites/SpokeCodeProof.astro';
import Faq from '../../../components/composites/Faq.astro';
import SpokePricingPointer from '../../../components/composites/SpokePricingPointer.astro';
import { getMessages } from '../../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../../i18n/utils';

export function getStaticPaths() {
  return [{ params: { lang: 'en-US' } }, { params: { lang: 'pt-BR' } }];
}

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

// Same apRows + codeSample as F.5.1 (literal copy — these don't change per locale).
const apRows = [
  { label: t.usecases.cc_ap_row_1, verbara: '✓ MIT + Apache',  a: '✗ closed cloud',     b: '✓',                  c: '✓' },
  { label: t.usecases.cc_ap_row_2, verbara: '✓',                a: '✗ or restricted',    b: '✓ entirely DIY',     c: '✓' },
  { label: t.usecases.cc_ap_row_3, verbara: '✓',                a: '✓',                  b: '✗',                  c: '✗' },
  { label: t.usecases.cc_ap_row_4, verbara: '✓ native',         a: '✓ proprietary',      b: '✗',                  c: '✗' },
  { label: t.usecases.cc_ap_row_5, verbara: '✓ Pro',            a: '✓ enterprise',       b: '✗',                  c: 'partial' },
  { label: t.usecases.cc_ap_row_6, verbara: '✓ Pro',            a: '✓ enterprise',       b: '✗',                  c: '✗' },
  { label: t.usecases.cc_ap_row_7, verbara: '✓',                a: 'translated',         b: 'n/a',                c: 'community-translated' },
];

const codeSample = `using Verbara.Platform.Api;
using Verbara.Sdk.Pro.Licensing;
using Verbara.Sdk.Pro.MultiTenant;

var builder = WebApplication.CreateBuilder(args);
builder.Services
  .AddVerbaraPlatform()
  .AddPro(opts => {
    opts.LicenseFile = "/etc/verbara/license.lic";
    opts.EnableMultiTenant();
    opts.EnableCallAnalytics();
    opts.EnableAgentAssist();
  });

var app = builder.Build();
app.MapVerbaraPlatform();
await app.RunAsync();`;
---

<Layout>
  <UseCaseHero
    eyebrow={t.usecases.cc_hero_eyebrow}
    h1Pre={t.usecases.cc_hero_h1_pre}
    h1Accent={t.usecases.cc_hero_h1_accent}
    sub={t.usecases.cc_hero_sub}
    ctaPrimary={t.usecases.cc_hero_cta_primary}
    ctaPrimaryHref={localiseHref('developer-license', locale)}
    ctaSecondary={t.usecases.cc_hero_cta_secondary}
    ctaSecondaryHref={`${localiseHref('pricing', locale)}#group-self`}
  />

  <SpokeAntiPositioning
    eyebrow={t.usecases.cc_ap_eyebrow}
    heading={t.usecases.cc_ap_h2}
    sub={t.usecases.cc_ap_sub}
    colVerbara={t.usecases.cc_ap_col_verbara}
    colA={t.usecases.cc_ap_col_a}
    colB={t.usecases.cc_ap_col_b}
    colC={t.usecases.cc_ap_col_c}
    rows={apRows}
  />

  <ArchitectureDiagram />

  <SpokeCodeProof
    eyebrow={t.usecases.cc_cp_eyebrow}
    heading={t.usecases.cc_cp_h2}
    filename={t.usecases.cc_cp_filename}
    caption={t.usecases.cc_cp_caption}
    code={codeSample}
  />

  <Faq
    eyebrow={t.usecases.cc_faq_eyebrow}
    heading={t.usecases.cc_faq_h2}
    items={[
      { q: t.usecases.cc_faq_q1, a: t.usecases.cc_faq_a1 },
      { q: t.usecases.cc_faq_q2, a: t.usecases.cc_faq_a2 },
      { q: t.usecases.cc_faq_q3, a: t.usecases.cc_faq_a3 },
    ]}
  />

  <SpokePricingPointer
    eyebrow={t.usecases.cc_pp_eyebrow}
    heading={t.usecases.cc_pp_h2}
    body={t.usecases.cc_pp_body}
    cta={t.usecases.cc_pp_cta}
    ctaHref={localiseHref('pricing', locale)}
  />

  <section class="py-20 md:py-28">
    <div class="mx-auto max-w-3xl px-6 text-center space-y-4">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        {t.usecases.cc_final_h2_pre} <span class="text-amber">{t.usecases.cc_final_h2_accent}</span>
      </h2>
      <p class="text-lg text-bone-2 text-balance">{t.usecases.cc_final_sub}</p>
      <a
        href={localiseHref('developer-license', locale)}
        class="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-signal-deep"
      >{t.home.final_cta}</a>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Build + visit all 3 locales**

`/use-cases/contact-center/`, `/en-US/use-cases/contact-center/`, `/pt-BR/use-cases/contact-center/` — verify each renders.

- [ ] **Step 3: Commit Phase F.5**

```bash
git add src/pages/use-cases/contact-center.astro src/pages/[lang]/use-cases/contact-center.astro
git commit -m "feat(spokes): /use-cases/contact-center/ in 3 locales

Spoke 1 ships the canonical CC narrative absorbed from the home:
- UseCaseHero with operator-deep eyebrow + h1
- SpokeAntiPositioning with 7 rows × 4 cols (Verbara · Genesys/Five9 ·
  Asterisk+scripts · VICIdial/FreePBX) — relocated from home page
- Shared ArchitectureDiagram (full 5-component stack)
- SpokeCodeProof with CallCenterHost.cs sample showing AddPro overlays
- Faq with 3 CC-specific Q&A (concurrent agents · multi-tenant BPO ·
  PBX compatibility)
- SpokePricingPointer routing to /pricing/
- Inline final-CTA using cc_final_* keys"
```

---

# PHASE F.6 — Spoke 2: Voice AI

Identical task shape to F.5. Use `voiceai_*` i18n keys, Vapi/Bland.ai+Retell/Pipecat as competitor columns, and a Voice-AI-specific code sample.

### Task F.6.1: Build the Voice AI spoke page (default locale)

**Files:**
- Create: `src/pages/use-cases/voice-ai.astro`

- [ ] **Step 1: Write the page**

```astro
---
import Layout from '../../layouts/Layout.astro';
import UseCaseHero from '../../components/composites/UseCaseHero.astro';
import SpokeAntiPositioning from '../../components/composites/SpokeAntiPositioning.astro';
import SpokeCodeProof from '../../components/composites/SpokeCodeProof.astro';
import Faq from '../../components/composites/Faq.astro';
import SpokePricingPointer from '../../components/composites/SpokePricingPointer.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const apRows = [
  { label: t.usecases.voiceai_ap_row_1, verbara: '✓ MIT + Apache',     a: '✗ closed SaaS',     b: '✗ closed SaaS',    c: '✓ Apache' },
  { label: t.usecases.voiceai_ap_row_2, verbara: '✓',                   a: '✗',                  b: '✗',                 c: '✓' },
  { label: t.usecases.voiceai_ap_row_3, verbara: '✓ AMI/ARI',           a: 'SIP gateway',        b: 'SIP gateway',       c: '✗ WebRTC only' },
  { label: t.usecases.voiceai_ap_row_4, verbara: '✓ Pro',               a: '✓ enterprise',       b: '✓ enterprise',      c: '✗' },
  { label: t.usecases.voiceai_ap_row_5, verbara: '✓ 6 STT + 6 TTS',     a: 'curated',            b: 'curated',           c: '✓ pluggable' },
  { label: t.usecases.voiceai_ap_row_6, verbara: '✓ direct',            a: '✗',                  b: '✗',                 c: '✓ direct' },
  { label: t.usecases.voiceai_ap_row_7, verbara: '✓ native',            a: '✓',                  b: '✓',                 c: '✓' },
];

const codeSample = `using Verbara.Sdk.Ari;
using Verbara.Sdk.VoiceAI;
using Verbara.Sdk.VoiceAI.Stt.Deepgram;
using Verbara.Sdk.VoiceAI.Tts.ElevenLabs;

var ari = new AriClient("http://pbx:8088", "verbara", "secret");
var agent = new VoiceAgent(
  stt: new DeepgramStt(apiKey: Env("DEEPGRAM_KEY"), model: "nova-2"),
  tts: new ElevenLabsTts(apiKey: Env("ELEVENLABS_KEY"), voice: "Rachel"),
  llm: new OpenAiLlm(apiKey: Env("OPENAI_KEY"), model: "gpt-4o-mini"),
  options: VoiceAgentOptions.Default with {
    SmartTurnDetection = true,
    BargeIn = true,
  });

await ari.OnStasisStart(async (channel) => {
  await channel.AnswerAsync();
  await agent.RunAsync(channel);
});

await ari.SubscribeAsync("voicebot");`;
---

<Layout>
  <UseCaseHero
    eyebrow={t.usecases.voiceai_hero_eyebrow}
    h1Pre={t.usecases.voiceai_hero_h1_pre}
    h1Accent={t.usecases.voiceai_hero_h1_accent}
    sub={t.usecases.voiceai_hero_sub}
    ctaPrimary={t.usecases.voiceai_hero_cta_primary}
    ctaPrimaryHref={localiseHref('developer-license', locale)}
    ctaSecondary={t.usecases.voiceai_hero_cta_secondary}
    ctaSecondaryHref="#code-proof"
  />

  <SpokeAntiPositioning
    eyebrow={t.usecases.voiceai_ap_eyebrow}
    heading={t.usecases.voiceai_ap_h2}
    sub={t.usecases.voiceai_ap_sub}
    colVerbara={t.usecases.voiceai_ap_col_verbara}
    colA={t.usecases.voiceai_ap_col_a}
    colB={t.usecases.voiceai_ap_col_b}
    colC={t.usecases.voiceai_ap_col_c}
    rows={apRows}
  />

  <div id="code-proof">
    <SpokeCodeProof
      eyebrow={t.usecases.voiceai_cp_eyebrow}
      heading={t.usecases.voiceai_cp_h2}
      filename={t.usecases.voiceai_cp_filename}
      caption={t.usecases.voiceai_cp_caption}
      code={codeSample}
    />
  </div>

  <Faq
    eyebrow={t.usecases.voiceai_faq_eyebrow}
    heading={t.usecases.voiceai_faq_h2}
    items={[
      { q: t.usecases.voiceai_faq_q1, a: t.usecases.voiceai_faq_a1 },
      { q: t.usecases.voiceai_faq_q2, a: t.usecases.voiceai_faq_a2 },
      { q: t.usecases.voiceai_faq_q3, a: t.usecases.voiceai_faq_a3 },
    ]}
  />

  <SpokePricingPointer
    eyebrow={t.usecases.voiceai_pp_eyebrow}
    heading={t.usecases.voiceai_pp_h2}
    body={t.usecases.voiceai_pp_body}
    cta={t.usecases.voiceai_pp_cta}
    ctaHref={localiseHref('pricing', locale)}
  />

  <section class="py-20 md:py-28">
    <div class="mx-auto max-w-3xl px-6 text-center space-y-4">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        {t.usecases.voiceai_final_h2_pre} <span class="text-amber">{t.usecases.voiceai_final_h2_accent}</span>
      </h2>
      <p class="text-lg text-bone-2 text-balance">{t.usecases.voiceai_final_sub}</p>
      <a
        href={localiseHref('developer-license', locale)}
        class="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-signal-deep"
      >{t.home.final_cta}</a>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Build + smoke** at `http://localhost:4321/use-cases/voice-ai/`.

### Task F.6.2: Build localized Voice AI spoke variant

**Files:**
- Create: `src/pages/[lang]/use-cases/voice-ai.astro`

- [ ] **Step 1: Write the localized variant**

Same content as F.6.1 with `'../../../'` import paths AND `getStaticPaths` for `en-US` + `pt-BR`. The `apRows` and `codeSample` constants are literal — copy verbatim (do not translate; these are literal mark/value strings).

(Engineer: copy the Voice-AI default-locale page from F.6.1 verbatim into `src/pages/[lang]/use-cases/voice-ai.astro`, replace each `'../..'` import path with `'../../..'`, and add the `getStaticPaths` block at top of frontmatter as in F.5.2 step 1.)

- [ ] **Step 2: Build + smoke** at `/en-US/use-cases/voice-ai/` and `/pt-BR/use-cases/voice-ai/`.

- [ ] **Step 3: Commit Phase F.6**

```bash
git add src/pages/use-cases/voice-ai.astro src/pages/[lang]/use-cases/voice-ai.astro
git commit -m "feat(spokes): /use-cases/voice-ai/ in 3 locales

Spoke 2 — Voice AI:
- UseCaseHero with builder-shaped eyebrow + h1
- SpokeAntiPositioning vs Vapi · Bland.ai+Retell · Pipecat OSS
  (7 rows: open-core, self-host, Asterisk-native, multi-tenant,
   STT+TTS swappability, OpenAI Realtime bridge, Smart Turn+barge-in)
- SpokeCodeProof with VoiceAgent.cs (Deepgram + ElevenLabs + GPT-4o-mini)
- Faq with 3 builder Q&A (provider list · latency · self-host w/o telephony)
- SpokePricingPointer + inline final-CTA using voiceai_final_* keys"
```

---

# PHASE F.7 — Spoke 3: Omnichannel

Same task shape. Competitors: Twilio Conversations · Sinch+MessageBird · Chatwoot OSS. Code sample uses `Verbara.Platform.Routing` to wire WhatsApp+SMS+WebChat through one Flow node.

### Task F.7.1: Build the Omnichannel spoke page (default locale)

**Files:**
- Create: `src/pages/use-cases/omnichannel.astro`

- [ ] **Step 1: Write the page**

Use the same scaffold as F.6.1 with these substitutions:

`apRows`:

```typescript
const apRows = [
  { label: t.usecases.omnichannel_ap_row_1, verbara: '✓ MIT + Apache',  a: '✗ closed cloud',  b: '✗ closed cloud',  c: '✓ MIT' },
  { label: t.usecases.omnichannel_ap_row_2, verbara: '✓',                a: '✗',                b: '✗',                c: '✓' },
  { label: t.usecases.omnichannel_ap_row_3, verbara: '✓ 11 channels',    a: '~5',               b: '~7',               c: '~5' },
  { label: t.usecases.omnichannel_ap_row_4, verbara: '✓ direct',         a: 'via BSP',          b: 'via BSP',          c: 'via BSP' },
  { label: t.usecases.omnichannel_ap_row_5, verbara: '✓ DAG',            a: '✗',                b: '~ flows',          c: 'basic flows' },
  { label: t.usecases.omnichannel_ap_row_6, verbara: '✓ Pro',            a: '✓ enterprise',     b: '✓ enterprise',     c: '✗' },
  { label: t.usecases.omnichannel_ap_row_7, verbara: '✓ native',         a: '✓ separate API',   b: '✓ separate API',   c: '✗' },
];
```

`codeSample`:

```typescript
const codeSample = `using Verbara.Platform.Routing;
using Verbara.Platform.Channels.WhatsApp;
using Verbara.Platform.Channels.Sms;
using Verbara.Platform.Channels.WebChat;
using Verbara.Platform.Flows;

routing.UseChannel<WhatsAppChannel>("whatsapp", opts => {
  opts.WhatsAppBusinessAccountId = Env("WABA_ID");
  opts.AccessToken = Env("WA_TOKEN");
});
routing.UseChannel<SmsChannel>("sms");
routing.UseChannel<WebChatChannel>("web");

routing.MapInbound("support", flow => flow
  .Llm("classify", opts => {
    opts.Model = "gpt-4o-mini";
    opts.SystemPrompt = "Route to billing, technical, or general queue.";
  })
  .Switch("classify.label", route => route
    .Case("billing",   q => q.ToQueue("billing"))
    .Case("technical", q => q.ToQueue("technical"))
    .Default(q => q.ToQueue("general"))));`;
```

Hero CTAs and final-CTA section follow the F.6.1 template, swapping `voiceai_*` keys for `omnichannel_*`.

(Full file written by engineer following F.6.1 as a template — same composite call sequence, just different i18n key prefix and the `apRows` + `codeSample` from above.)

- [ ] **Step 2: Build + smoke** at `http://localhost:4321/use-cases/omnichannel/`.

### Task F.7.2: Build localized Omnichannel spoke variant

**Files:**
- Create: `src/pages/[lang]/use-cases/omnichannel.astro`

- [ ] **Step 1: Write the localized variant** — copy F.7.1 verbatim into the `[lang]/use-cases/` path, swap import paths to `'../../../'`, add `getStaticPaths`.

- [ ] **Step 2: Build + smoke** at `/en-US/use-cases/omnichannel/` and `/pt-BR/use-cases/omnichannel/`.

- [ ] **Step 3: Commit Phase F.7**

```bash
git add src/pages/use-cases/omnichannel.astro src/pages/[lang]/use-cases/omnichannel.astro
git commit -m "feat(spokes): /use-cases/omnichannel/ in 3 locales

Spoke 3 — Omnichannel:
- UseCaseHero with messaging-shaped eyebrow + h1
- SpokeAntiPositioning vs Twilio Conversations · Sinch+MessageBird ·
  Chatwoot OSS (7 rows: open-core, self-host, channel count, WhatsApp
  Meta direct vs BSP, Flows DAG, multi-tenant, native voice)
- SpokeCodeProof with OmnichannelRouter.cs (WhatsApp+SMS+WebChat into
  Flow with LLM classifier node)
- Faq with 3 messaging Q&A (WhatsApp direct vs BSP · regional SMS
  providers · cross-channel conversation correlation)
- SpokePricingPointer + inline final-CTA using omnichannel_final_* keys"
```

---

# PHASE F.8 — Spoke 4: CPaaS

Same task shape. Competitors: Twilio · Vonage+Plivo · Jambonz OSS. Code sample uses `Verbara.Sdk.Ari` for outbound + bridge + record.

### Task F.8.1: Build the CPaaS spoke page (default locale)

**Files:**
- Create: `src/pages/use-cases/cpaas.astro`

- [ ] **Step 1: Write the page**

Use the F.6.1 scaffold with these substitutions:

`apRows`:

```typescript
const apRows = [
  { label: t.usecases.cpaas_ap_row_1, verbara: '✓ MIT',              a: '✗ closed',         b: '✗ closed',         c: '✓ MIT' },
  { label: t.usecases.cpaas_ap_row_2, verbara: '✓ telco-direct',     a: '$0.014–0.045/min', b: '$0.012–0.040/min', c: 'telco-direct' },
  { label: t.usecases.cpaas_ap_row_3, verbara: '✓ AMI/AGI/ARI',      a: 'proprietary',       b: 'proprietary',       c: 'WebRTC' },
  { label: t.usecases.cpaas_ap_row_4, verbara: '✓ ServerPool',       a: 'opaque',            b: 'opaque',            c: '✗' },
  { label: t.usecases.cpaas_ap_row_5, verbara: '✓ Activities',       a: '~ TwiML verbs',     b: '~ NCCO',            c: '~ verbs' },
  { label: t.usecases.cpaas_ap_row_6, verbara: '✓ Smart Turn',       a: '✗',                  b: '✗',                  c: 'basic' },
  { label: t.usecases.cpaas_ap_row_7, verbara: '✓ Pro',              a: 'enterprise',        b: 'enterprise',        c: '✗' },
];
```

`codeSample`:

```typescript
const codeSample = `using Verbara.Sdk.Ari;
using Verbara.Sdk.Activities;

var ari = new AriClient("http://pbx:8088", "verbara", "secret");

// Place outbound call to a customer.
var outbound = await ari.Channels.OriginateAsync(
  endpoint: "PJSIP/+15551234567@telco-trunk",
  extension: "outbound",
  context: "default");

// Connect them to an agent on a separate channel + record.
var agent = await ari.Channels.OriginateAsync(
  endpoint: "PJSIP/agent101@internal",
  extension: "agent",
  context: "internal");

var bridge = await ari.Bridges.CreateAsync(type: "mixing");
await ari.Bridges.AddChannelAsync(bridge.Id, outbound.Id);
await ari.Bridges.AddChannelAsync(bridge.Id, agent.Id);

var recording = await ari.Channels.RecordAsync(
  outbound.Id,
  name: $"call-{outbound.Id}",
  format: "wav");`;
```

Hero CTAs:
- Primary: `t.usecases.cpaas_hero_cta_primary` (= `dotnet add package Verbara.Sdk`); `ctaPrimaryHref` = `https://github.com/verbara/Verbara.Sdk`
- Secondary: `t.usecases.cpaas_hero_cta_secondary`; `ctaSecondaryHref` = `'#code-proof'`

Wrap `SpokeCodeProof` in `<div id="code-proof">` so the secondary CTA anchor works.

Hero/Anti-pos/Code-proof/FAQ/Pricing-pointer/Final-CTA wired with `cpaas_*` keys, mirroring F.6.1.

- [ ] **Step 2: Build + smoke** at `http://localhost:4321/use-cases/cpaas/`.

### Task F.8.2: Build localized CPaaS spoke variant

**Files:**
- Create: `src/pages/[lang]/use-cases/cpaas.astro`

- [ ] **Step 1: Write the localized variant** — same recipe as F.6.2/F.7.2.

- [ ] **Step 2: Build + smoke** at `/en-US/use-cases/cpaas/` and `/pt-BR/use-cases/cpaas/`.

- [ ] **Step 3: Commit Phase F.8**

```bash
git add src/pages/use-cases/cpaas.astro src/pages/[lang]/use-cases/cpaas.astro
git commit -m "feat(spokes): /use-cases/cpaas/ in 3 locales

Spoke 4 — CPaaS:
- UseCaseHero with telephony-as-library eyebrow + 'dotnet add package'
  primary CTA pointing to GitHub
- SpokeAntiPositioning vs Twilio · Vonage+Plivo · Jambonz OSS (7 rows:
  open-core, no per-minute, Asterisk-native, multi-server federation,
  Activities state-machines, Smart Turn+barge-in, multi-tenant licensing)
- SpokeCodeProof with OutboundCallExample.cs (originate + bridge + record)
- Faq with 3 telephony Q&A (need own Asterisk · codec support ·
  federation scale)
- SpokePricingPointer + inline final-CTA using cpaas_final_* keys"
```

---

# PHASE F.9 — Pricing surface (best-for tier line + matrix column)

The `Mejor para` mapping appears on **two surfaces** of `/pricing/`: each `TierCard` gets a one-line annotation; the `ComparisonMatrix` gets a new column. Both read from the same `pricing.best_for_*` keys defined in F.1.4.

### Task F.9.1: Extend `TierCard` with `bestFor` prop

**Files:**
- Modify: `src/components/composites/TierCard.astro`

- [ ] **Step 1: Add `bestFor` prop**

In the `Props` interface (around line 9), add:

```typescript
interface Props {
  tierId: TierId;
  cta: CtaKind;
  badge?: BadgeKind;
  bestFor?: string;          // text rendered as 'Mejor para: <list>'
}
```

In the destructure (around line 15), add:
```typescript
const { tierId, cta, badge = null, bestFor } = Astro.props;
```

In the JSX, **after** the `<p class="text-sm text-bone-2 min-h-10">{tierTagline}</p>` line (around line 59), add:

```astro
{bestFor && (
  <p class="text-xs font-mono text-bone-3 mt-1">
    <span class="text-signal">{t.pricing.best_for_label}:</span>{' '}{bestFor}
  </p>
)}
```

- [ ] **Step 2: Build**

`npm run build` — must succeed.

- [ ] **Step 3: Stage** (commit at end of F.9 with pricing pages + matrix)

```bash
git add src/components/composites/TierCard.astro
```

### Task F.9.2: Pass `bestFor` from pricing pages

**Files:**
- Modify: `src/pages/pricing.astro`
- Modify: `src/pages/[lang]/pricing.astro`

- [ ] **Step 1: Update default-locale pricing**

Locate each `<TierCard tierId="..." cta="..." />` in `src/pages/pricing.astro` and add the matching `bestFor` prop. Mapping:

| `tierId` | `bestFor` value |
|---|---|
| `tier_0` | `t.pricing.best_for_t0` |
| `tier_05` | `t.pricing.best_for_t0_5` |
| `tier_1` | `t.pricing.best_for_t1` |
| `tier_2` | `t.pricing.best_for_t2` |
| `tier_3` | `t.pricing.best_for_t3` |
| `tier_4` | `t.pricing.best_for_t4` |
| `tier_5` | `t.pricing.best_for_t5` |

Example for `<TierCard tierId="tier_0" cta="community" />`:
```astro
<TierCard tierId="tier_0" cta="community" bestFor={t.pricing.best_for_t0} />
```

Apply the same change to all 7 tier cards.

Also: locate the pricing hero subtitle (`<p>{t.pricing.hero_sub}</p>` or similar) and add a follow-up paragraph immediately after:

```astro
<p class="text-base text-bone-3 max-w-2xl mx-auto">{t.pricing.subtitle_2}</p>
```

(Match the existing typography classes; the exact wrapper depends on current layout — consult the file before editing.)

- [ ] **Step 2: Update localized pricing**

Apply the same diff to `src/pages/[lang]/pricing.astro`.

- [ ] **Step 3: Build + smoke**

`npm run build`. `npm run dev`. Visit `/pricing/`, `/en-US/pricing/`, `/pt-BR/pricing/`.

Expected: each tier card now shows a `Mejor para: ...` line in mono small text below the tagline. Hero has the new subtitle paragraph.

- [ ] **Step 4: Stage**

```bash
git add src/pages/pricing.astro src/pages/[lang]/pricing.astro
```

### Task F.9.3: Add `Mejor para` column to `ComparisonMatrix`

**Files:**
- Read: `src/components/composites/ComparisonMatrix.astro` (to know its current shape)
- Modify: `src/components/composites/ComparisonMatrix.astro`

- [ ] **Step 1: Read current matrix**

Run: `cat src/components/composites/ComparisonMatrix.astro`

Note the current row/column structure. The matrix likely has tiers as columns and feature attributes as rows. The plan below assumes that layout — adjust if reversed.

- [ ] **Step 2: Add a new "Mejor para" row at the top of the table body (NOT a new column)**

The matrix already has tiers as columns; adding a new column is structurally awkward. Instead, add a **new row** at the top of `<tbody>` that surfaces the `best_for_*` mapping per tier column. Insert directly after `<tbody>`:

```astro
<tr class="bg-ink-3/50">
  <th scope="row" class="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-signal">
    {t.pricing.best_for_label}
  </th>
  <td class="px-4 py-3 text-bone-2 font-mono text-xs">{t.pricing.best_for_t0}</td>
  <td class="px-4 py-3 text-bone-2 font-mono text-xs">{t.pricing.best_for_t0_5}</td>
  <td class="px-4 py-3 text-bone-2 font-mono text-xs">{t.pricing.best_for_t1}</td>
  <td class="px-4 py-3 text-bone-2 font-mono text-xs">{t.pricing.best_for_t2}</td>
  <td class="px-4 py-3 text-bone-2 font-mono text-xs">{t.pricing.best_for_t3}</td>
  <td class="px-4 py-3 text-bone-2 font-mono text-xs">{t.pricing.best_for_t4}</td>
  <td class="px-4 py-3 text-bone-2 font-mono text-xs">{t.pricing.best_for_t5}</td>
</tr>
```

(If the matrix has fewer than 7 tier columns visible — e.g. it omits `tier_05` — drop the corresponding `<td>`. Verify column count matches the existing thead.)

- [ ] **Step 3: Build + smoke** at `/pricing/` — verify the new "Mejor para" row appears at the top of the matrix.

- [ ] **Step 4: Commit Phase F.9**

```bash
git add src/components/composites/TierCard.astro src/components/composites/ComparisonMatrix.astro src/pages/pricing.astro src/pages/[lang]/pricing.astro
git commit -m "feat(pricing): add 'Mejor para' use-case mapping to tier cards + matrix

- TierCard accepts new optional bestFor prop, renders mono line below
  tagline with t.pricing.best_for_label prefix.
- pricing.astro (default + [lang]) passes per-tier best_for_* values.
- ComparisonMatrix gains a top-of-tbody 'Mejor para' row mapping each
  tier column to its served use-cases.
- Pricing hero gets a second subtitle paragraph: 'Cualquier tier sirve
  cualquier use-case — la diferencia es escala, multi-tenant y SLA.'

i18n keys come from F.1.4 (best_for_label, best_for_t0..t5, subtitle_2)."
```

---

# PHASE F.10 — E2E + smoke + Lighthouse

Cross-cutting test additions and updates so CI stays green and Lighthouse covers the new URLs.

### Task F.10.1: Update `home-narrative.spec.ts` for reframed home

**Files:**
- Modify: `tests/e2e/home-narrative.spec.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/`;

  test(`home narrative: all sections render at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Hero — eyebrow badge text is locale-independent
    await expect(page.locator('text=MIT SDK · Apache Platform · 0 vulns')).toBeVisible();

    // Hero — single H1 visible
    await expect(page.locator('h1').first()).toBeVisible();

    // Solutions overview (Phase F replaces CC anti-pos)
    const solutionsSection = page.locator('[data-section="solutions-overview"]');
    await expect(solutionsSection).toBeVisible();
    const spokeCards = solutionsSection.locator('[data-spoke]');
    await expect(spokeCards).toHaveCount(4);
    for (const slug of ['cc', 'voiceai', 'omnichannel', 'cpaas']) {
      await expect(solutionsSection.locator(`[data-spoke="${slug}"]`)).toBeVisible();
    }

    // ArchitectureDiagram — accessible SVG with title
    await expect(page.locator('svg[role="img"][aria-labelledby*="archdiag"]')).toBeVisible();

    // CodeProof — code block with filename Program.cs
    await expect(page.locator('text=Program.cs').first()).toBeVisible();

    // PricingTeaser — 3 deep-link anchors
    const teaserLinks = await page.locator('a[href*="#group-"]').count();
    expect(teaserLinks).toBeGreaterThanOrEqual(3);

    // Faq — 6 toggle buttons
    const faqButtons = await page.locator('[data-faq-toggle]').count();
    expect(faqButtons).toBe(6);

    // FinalCta — closing CTA links to developer-license
    const finalCta = page.locator('section').last().locator('a[href*="developer-license"]');
    await expect(finalCta).toBeVisible();
  });

  test(`home narrative: solutions cards link to spokes at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const expectedHrefs: Record<string, string> = {
      cc:           `${prefix}/use-cases/contact-center/`,
      voiceai:      `${prefix}/use-cases/voice-ai/`,
      omnichannel:  `${prefix}/use-cases/omnichannel/`,
      cpaas:        `${prefix}/use-cases/cpaas/`,
    };

    for (const [slug, expectedHref] of Object.entries(expectedHrefs)) {
      const cta = page.locator(`[data-spoke-cta="${slug}"]`);
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', expectedHref);
    }
  });

  test(`home narrative: FAQ accordion toggles at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const firstToggle = page.locator('[data-faq-toggle="faq-1"]');
    const firstPanel = page.locator('#faq-1-panel');

    await expect(firstPanel).toBeHidden();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');

    await firstToggle.click();

    await expect(firstPanel).toBeVisible();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');

    await firstToggle.click();

    await expect(firstPanel).toBeHidden();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
  });
}
```

- [ ] **Step 2: Run + verify**

Run: `npx playwright test tests/e2e/home-narrative.spec.ts --project=chromium`
Expected: all tests PASS across 3 locales × 3 cases = 9 cases.

### Task F.10.2: Add `nav-solutions-dropdown.spec.ts`

**Files:**
- Create: `tests/e2e/nav-solutions-dropdown.spec.ts`

- [ ] **Step 1: Write the spec**

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  test(`nav solutions: desktop dropdown opens and lists 4 spokes + 'all' link at ${prefix}/`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${prefix}/`, { waitUntil: 'domcontentloaded' });

    const toggle = page.locator('#nav-solutions-toggle');
    const panel = page.locator('#nav-solutions-panel');

    await expect(panel).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();

    await expect(panel).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const menuItems = panel.locator('[role="menuitem"]');
    await expect(menuItems).toHaveCount(5); // 4 spokes + "all" link

    // "All solutions" item is the last one and links to /use-cases/.
    const allLink = menuItems.last();
    await expect(allLink).toHaveAttribute('href', `${prefix}/use-cases/`);
  });

  test(`nav solutions: dropdown closes on Escape at ${prefix}/`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${prefix}/`, { waitUntil: 'domcontentloaded' });

    const toggle = page.locator('#nav-solutions-toggle');
    const panel = page.locator('#nav-solutions-panel');

    await toggle.click();
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test(`nav solutions: mobile <details> accordion expands at ${prefix}/`, async ({ page }) => {
    await page.setViewportSize({ width: 380, height: 700 });
    await page.goto(`${prefix}/`, { waitUntil: 'domcontentloaded' });

    // Open the hamburger menu first.
    await page.locator('#nav-mobile-toggle').click();
    await expect(page.locator('#nav-mobile-panel')).toBeVisible();

    const details = page.locator('details[data-mobile-solutions]');
    await expect(details).toBeVisible();

    const summary = details.locator('summary');
    await summary.click();

    // After expanding, the spoke links should be visible inside the details.
    const spokeLinks = details.locator('a').filter({ hasText: /Center|AI|Omnichannel|CPaaS/ });
    expect(await spokeLinks.count()).toBeGreaterThanOrEqual(4);
  });
}
```

- [ ] **Step 2: Run + verify**

Run: `npx playwright test tests/e2e/nav-solutions-dropdown.spec.ts --project=chromium`
Expected: 9 cases PASS (3 cases × 3 locales).

### Task F.10.3: Add `use-cases-index.spec.ts`

**Files:**
- Create: `tests/e2e/use-cases-index.spec.ts`

- [ ] **Step 1: Write the spec**

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/use-cases/`;

  test(`use-cases index: renders + 4 cards link to spokes at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1').first()).toBeVisible();

    const grid = page.locator('[data-usecases-grid]');
    await expect(grid).toBeVisible();

    const cards = grid.locator('[data-spoke-card]');
    await expect(cards).toHaveCount(4);

    const expectedHrefs: Record<string, string> = {
      cc:           `${prefix}/use-cases/contact-center/`,
      voiceai:      `${prefix}/use-cases/voice-ai/`,
      omnichannel:  `${prefix}/use-cases/omnichannel/`,
      cpaas:        `${prefix}/use-cases/cpaas/`,
    };

    for (const [slug, expectedHref] of Object.entries(expectedHrefs)) {
      const card = grid.locator(`[data-spoke-card="${slug}"]`);
      await expect(card).toBeVisible();
      const cta = card.locator(`[data-spoke-cta="${slug}"]`);
      await expect(cta).toHaveAttribute('href', expectedHref);
    }
  });
}
```

- [ ] **Step 2: Run + verify**

Run: `npx playwright test tests/e2e/use-cases-index.spec.ts --project=chromium`
Expected: 3 cases PASS.

### Task F.10.4: Add `use-case-narrative.spec.ts` (4 spokes × 3 locales)

**Files:**
- Create: `tests/e2e/use-case-narrative.spec.ts`

- [ ] **Step 1: Write the spec**

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

const SPOKES = [
  { slug: 'contact-center', expectedFilename: 'CallCenterHost.cs',       faqCount: 3 },
  { slug: 'voice-ai',       expectedFilename: 'VoiceAgent.cs',           faqCount: 3 },
  { slug: 'omnichannel',    expectedFilename: 'OmnichannelRouter.cs',    faqCount: 3 },
  { slug: 'cpaas',          expectedFilename: 'OutboundCallExample.cs',  faqCount: 3 },
];

for (const prefix of LOCALE_PREFIXES) {
  for (const spoke of SPOKES) {
    const url = `${prefix}/use-cases/${spoke.slug}/`;

    test(`spoke narrative: ${spoke.slug} renders at ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Hero h1 visible
      await expect(page.locator('h1').first()).toBeVisible();

      // Anti-positioning table — 7 rows
      const apRows = page.locator('section table tbody tr');
      const apCount = await apRows.count();
      expect(apCount).toBeGreaterThanOrEqual(7);

      // Code proof — filename
      await expect(page.locator(`text=${spoke.expectedFilename}`).first()).toBeVisible();

      // FAQ — 3 toggles
      const faqButtons = page.locator('[data-faq-toggle]');
      await expect(faqButtons).toHaveCount(spoke.faqCount);

      // Pricing pointer — link to /pricing/
      const pricingLink = page.locator(`a[href$="${prefix}/pricing/"]`).first();
      await expect(pricingLink).toBeVisible();

      // Final CTA — link to developer-license
      await expect(page.locator(`a[href*="developer-license"]`).last()).toBeVisible();
    });
  }
}
```

- [ ] **Step 2: Run + verify**

Run: `npx playwright test tests/e2e/use-case-narrative.spec.ts --project=chromium`
Expected: 12 cases PASS (3 locales × 4 spokes).

### Task F.10.5: Add `pricing-best-for.spec.ts`

**Files:**
- Create: `tests/e2e/pricing-best-for.spec.ts`

- [ ] **Step 1: Write the spec**

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/pricing/`;

  test(`pricing best-for: tier cards show Mejor para line at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Each TierCard has data-tier="..."; expect 7 cards each rendering best-for line.
    const tierCards = page.locator('[data-tier]');
    const count = await tierCards.count();
    expect(count).toBeGreaterThanOrEqual(7);

    // At least one tier card contains the localized 'Mejor para' / 'Best for' / 'Melhor para' label.
    const label = prefix === '/en-US' ? 'Best for' : prefix === '/pt-BR' ? 'Melhor para' : 'Mejor para';
    await expect(page.locator(`text=${label}`).first()).toBeVisible();
  });

  test(`pricing best-for: comparison matrix has Mejor para row at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const label = prefix === '/en-US' ? 'Best for' : prefix === '/pt-BR' ? 'Melhor para' : 'Mejor para';
    const matrixSection = page.locator('section').filter({ hasText: label }).last();
    await expect(matrixSection).toBeVisible();

    // The 'Mejor para' row appears as a <th scope="row"> in the matrix.
    const matrixRowHeader = page.locator(`th[scope="row"]`).filter({ hasText: label });
    await expect(matrixRowHeader).toBeVisible();
  });
}
```

- [ ] **Step 2: Run + verify**

Run: `npx playwright test tests/e2e/pricing-best-for.spec.ts --project=chromium`
Expected: 6 cases PASS (3 locales × 2 cases).

### Task F.10.6: Update smoke + locale-switcher specs

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`
- Modify: `tests/e2e/locale-switcher.spec.ts`

- [ ] **Step 1: Read current smoke spec**

Run: `cat tests/e2e/smoke.spec.ts`

Locate the `PAGE_TYPES` (or equivalent) array. Add the 5 new routes:

```typescript
'use-cases/',
'use-cases/contact-center/',
'use-cases/voice-ai/',
'use-cases/omnichannel/',
'use-cases/cpaas/',
```

(Exact array name + format depends on the existing structure; preserve trailing slashes.)

- [ ] **Step 2: Update locale-switcher**

In `tests/e2e/locale-switcher.spec.ts`, add a canary case for `/use-cases/contact-center/` that verifies the locale switcher round-trips correctly. Mirror the structure of the existing home + pricing canaries.

```typescript
test('locale switch from spoke (use-cases/contact-center) preserves route', async ({ page }) => {
  await page.goto('/use-cases/contact-center/', { waitUntil: 'domcontentloaded' });
  await page.locator('a:has-text("EN")').click();
  await expect(page).toHaveURL(/\/en-US\/use-cases\/contact-center\/?$/);

  await page.locator('a:has-text("PT")').click();
  await expect(page).toHaveURL(/\/pt-BR\/use-cases\/contact-center\/?$/);

  await page.locator('a:has-text("ES")').click();
  await expect(page).toHaveURL(/\/use-cases\/contact-center\/?$/);
});
```

- [ ] **Step 3: Run full E2E sweep**

Run: `npx playwright test --project=chromium`
Expected: all specs pass — total cases = 165 (existing) + 57 (new) = 222 on chromium.

- [ ] **Step 4: Run full matrix (3 browsers)**

Run: `npx playwright test`
Expected: 222 × 3 = 666 test executions, all green.

### Task F.10.7: Add 5 new URLs to `lighthouse.config.json`

**Files:**
- Modify: `lighthouse.config.json`

- [ ] **Step 1: Read current config**

Run: `cat lighthouse.config.json`

- [ ] **Step 2: Append the 5 new URLs**

Add to the `url:` array (or equivalent property):

```json
"http://localhost:4321/use-cases/",
"http://localhost:4321/use-cases/contact-center/",
"http://localhost:4321/use-cases/voice-ai/",
"http://localhost:4321/use-cases/omnichannel/",
"http://localhost:4321/use-cases/cpaas/"
```

(Preserve existing thresholds: Perf ≥ 0.9, A11y ≥ 0.95, BP ≥ 0.95, SEO = 1.0.)

- [ ] **Step 3: Run Lighthouse locally**

Run: `npm run build && npx lhci autorun --config=lighthouse.config.json`
Expected: 11 URLs evaluated; all 4 categories meet thresholds on each.

If any URL fails Perf threshold:
- Check the SpokeCodeProof block — large code samples can blow inline JS budgets.
- Verify all images use `loading="lazy"` (the spoke pages don't have images, so this should not apply).

- [ ] **Step 4: Commit Phase F.10**

```bash
git add tests/e2e/home-narrative.spec.ts \
        tests/e2e/nav-solutions-dropdown.spec.ts \
        tests/e2e/use-cases-index.spec.ts \
        tests/e2e/use-case-narrative.spec.ts \
        tests/e2e/pricing-best-for.spec.ts \
        tests/e2e/smoke.spec.ts \
        tests/e2e/locale-switcher.spec.ts \
        lighthouse.config.json
git commit -m "test(e2e): Phase F coverage (+57 cases) + smoke/Lighthouse extension

- home-narrative.spec.ts: replace CC anti-pos assertion with
  Solutions overview + spoke-card link verification (per locale)
- New nav-solutions-dropdown.spec.ts: desktop dropdown open/close +
  Escape key + mobile <details> nested accordion (9 cases)
- New use-cases-index.spec.ts: index page renders + 4 cards link
  to spokes (3 cases)
- New use-case-narrative.spec.ts: 4 spokes × 3 locales render hero
  + 7-row anti-pos + filename code-proof + 3 FAQ + pricing/dev
  CTAs (12 cases)
- New pricing-best-for.spec.ts: tier cards show Mejor para line +
  matrix has Mejor para row (6 cases)
- smoke.spec.ts: page-types extended 6 -> 11
- locale-switcher.spec.ts: spoke-route canary added
- lighthouse.config.json: 5 new spoke URLs added with same thresholds

Local: 222 cases × 3 browsers = 666 executions. CI runs unchanged."
```

---

# PHASE F.11 — Ship (status updates + final commit)

Final phase: clean up the deprecated `column_product` i18n key, mark spec status as Shipped, and tag/push.

### Task F.11.1: Remove deprecated `nav.product` + `footer.column_product` keys

**Files:**
- Modify: `src/i18n/messages.ts`

- [ ] **Step 1: Verify no live references**

Run: `grep -rn "t.nav.product\b" src/`
Expected: no matches (NavBar was rewritten in F.3.1; no other references should exist).

Run: `grep -rn "t.footer.column_product\b" src/`
Expected: no matches.

If either grep returns hits, fix those references to use the new keys (`t.nav.solutions` for the dropdown trigger, `t.footer.column_stack` for the renamed column) before proceeding.

- [ ] **Step 2: Remove from `Messages` interface**

In `src/i18n/messages.ts`, delete:

- The `nav.product` field
- The `footer.column_product` field
- The deprecated comment markers added in F.1.1 / F.3.2

- [ ] **Step 3: Remove from all 3 locale objects**

Delete `product: '...'` from `es_419.nav`, `en_US.nav`, `pt_BR.nav`.
Delete `column_product: '...'` from `es_419.footer`, `en_US.footer`, `pt_BR.footer`.

- [ ] **Step 4: Run parity + build**

Run: `node scripts/check-i18n-parity.mjs`
Expected: `i18n parity OK across 3 locales (440 keys each).` (442 minus 2 deprecated keys.)

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit cleanup**

```bash
git add src/i18n/messages.ts
git commit -m "chore(i18n): remove deprecated nav.product + footer.column_product

These were placeholders kept stable through F.3 to avoid simultaneous
type-shape and content changes. NavBar (F.3.1) replaced 'Producto'
anchor with 'Soluciones' dropdown; Footer (F.3.2) renamed 'Producto'
column to 'Stack'. The old keys have no live references — safe to
remove. Parity now 440 keys × 3 locales."
```

### Task F.11.2: Mark spec + ADR as Shipped

**Files:**
- Modify: `docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md`
- Modify: `docs/decisions/0002-hub-and-spoke-architecture.md`

- [ ] **Step 1: Update spec status**

In `docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md`, change the header line:

```markdown
**Status:** Draft for review
```

to:

```markdown
**Status:** Shipped (2026-MM-DD)
```

(Replace `MM-DD` with the actual ship date.)

- [ ] **Step 2: Append a status update to ADR-0002**

Append to the bottom of `docs/decisions/0002-hub-and-spoke-architecture.md`, under the existing `## Status update` block:

```markdown
- **2026-MM-DD**: Phase F shipped. Home reframed (CC anti-pos
  relocated to Spoke 1, Solutions overview added). 4 use-case spokes
  + index live in 3 locales. Pricing surface gained Mejor para
  mapping. ~210 i18n keys added (parity at 440 × 3 locales). 57 new
  E2E cases (666 executions/run on full browser matrix). Lighthouse
  thresholds preserved on 11 URLs.
```

- [ ] **Step 3: Move plan from active/ to completed/**

```bash
git mv docs/plans/active/2026-05-10-website-phase-f-hub-and-spoke.md docs/plans/completed/2026-05-10-website-phase-f-hub-and-spoke.md
```

- [ ] **Step 4: Final commit**

```bash
git add docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md \
        docs/decisions/0002-hub-and-spoke-architecture.md \
        docs/plans/active/2026-05-10-website-phase-f-hub-and-spoke.md \
        docs/plans/completed/2026-05-10-website-phase-f-hub-and-spoke.md
git commit -m "docs(phase-f): mark spec Shipped + plan moved to completed/

ADR-0002 status update appended with final delivery numbers:
- 210 i18n keys added (440 × 3 locales)
- 4 use-case spokes + index live in es-419/en-US/pt-BR
- Pricing surface: TierCard bestFor + matrix Mejor para row
- 57 new E2E cases (666 executions/run on chromium+firefox+webkit)
- Lighthouse thresholds preserved on 11 URLs (was 6)"
```

### Task F.11.3: Open the PR

- [ ] **Step 1: Push the branch**

Run:

```bash
git push -u origin redesign/phase-f-hub-and-spoke
```

- [ ] **Step 2: Open PR via gh**

```bash
gh pr create --title "redesign(phase-f): hub-and-spoke architecture" --body "$(cat <<'EOF'
## Summary

- Home reframed from CC-only narrative to runtime-first hub: hero
  subject changes from "the contact center" to "the comms runtime";
  CC anti-pos relocated to Spoke 1; new Solutions overview replaces
  it on the home.
- 4 use-case spoke pages live under \`/use-cases/{contact-center,voice-ai,omnichannel,cpaas}/\`
  in 3 locales (es-419 default + en-US + pt-BR). Plus a 4-card
  \`/use-cases/\` index.
- Nav: \`Producto\` anchor replaced with \`Soluciones ▾\` dropdown
  (desktop) + nested \`<details>\` accordion (mobile).
- Footer: \`Producto\` column renamed \`Stack\`; new \`Soluciones\`
  column added.
- Pricing: each TierCard gets a \`Mejor para\` line; \`ComparisonMatrix\`
  gets a \`Mejor para\` row mapping tiers to use-cases.
- Option I (operator-first + open-core + LATAM) **preserved verbatim**.
  Only the hero subject changes.

## Test plan
- [ ] \`node scripts/check-i18n-parity.mjs\` passes at 440 keys × 3 locales
- [ ] \`npm run build\` succeeds with 0 type errors
- [ ] \`npx playwright test\` passes 666 executions (222 cases × 3 browsers)
- [ ] \`npx lhci autorun\` meets thresholds on 11 URLs
- [ ] Manual visual check: home, /use-cases/, all 4 spokes × 3 locales

## References
- Spec: \`docs/specs/2026-05-10-website-phase-f-hub-and-spoke.md\`
- ADR: \`docs/decisions/0002-hub-and-spoke-architecture.md\`
- Plan: \`docs/plans/completed/2026-05-10-website-phase-f-hub-and-spoke.md\`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Verify CI passes**

Wait for CI checks (`quality`, `e2e`, `lighthouse`, Cloudflare Workers Builds) to land. Address any failures inline.

- [ ] **Step 4: Merge** (after review + green CI)

```bash
gh pr merge --squash --delete-branch
```

---

## Self-review

### 1. Spec coverage

| Spec § | Plan task |
|---|---|
| §1 (gap analysis) | Background — captured in plan header |
| §2 Goals | Implicit in F.2 (home reframe), F.4–F.8 (spokes), F.9 (pricing) |
| §3 Positioning | Captured in F.1.3 (hero/final-CTA copy) |
| §4.1 New routes | F.4 (index) + F.5–F.8 (4 spokes) |
| §4.2 Navigation | F.3.1 |
| §4.3 Footer | F.3.2 |
| §4.4 Internal linking | F.5–F.8 (spoke-to-pricing links) + F.9 (tier cards link to spokes) |
| §5 Spoke template | F.4.2–F.4.5 (5 reusable composites) |
| §5.1 Spoke 1 CC | F.5 |
| §5.2 Spoke 2 Voice AI | F.6 |
| §5.3 Spoke 3 Omnichannel | F.7 |
| §5.4 Spoke 4 CPaaS | F.8 |
| §5.5 /use-cases/ index | F.4.6 |
| §6.1 Hero copy | F.1.3 (i18n) + F.2.2 (wired implicitly) |
| §6.2 Anti-pos removed from home | F.2.2 (replaces import) |
| §6.3 Final-CTA opener | F.1.3 (i18n) |
| §6.4 Sections preserved | F.2.2 (no diff to those imports) |
| §6.5 Solutions overview | F.2.1 (composite) + F.2.2 (wire) |
| §6.6 Home FAQ replacements | F.1.3 (Q1+Q6 copy) — items list unchanged |
| §6.7 Final layout | F.2.2 |
| §7 Pricing surface | F.9.1–F.9.3 |
| §8 i18n scope | F.1 (entire phase) |
| §9.1 New E2E | F.10.2–F.10.5 |
| §9.2 E2E updates | F.10.1 + F.10.6 |
| §9.3 Lighthouse | F.10.7 |
| §9.4 i18n parity | F.1.10 + F.11.1 |
| §10 Dependencies | Captured implicitly (no SDK/Pro/Platform changes) |
| §11 Milestones | All 14 mapped to plan tasks |
| §12 Out of scope | Honored — no Phase G items in plan |
| §13 Success criteria | F.10 (CI green) + F.11 (status update with numbers) |
| §14 Alternatives | N/A for plan (lives in spec/ADR) |

**Gap check:** §6.7 final layout shows 8 sections including footer — verified all 7 content sections accounted for. No gaps found.

### 2. Placeholder scan

- "TBD" / "TODO" — none found.
- "Add appropriate" / "handle edge cases" — none found.
- "Similar to Task N" — Spokes 7 and 8 reference F.6.1 as a template for the localized variant; the engineer is given the full F.6.1 page above as the recipe to replicate, with explicit substitution rules. Each spoke's `apRows` and `codeSample` are written in full.
- References to undefined types: `localiseHref`, `getMessages`, `getLocaleFromPath` — all defined in `src/i18n/utils.ts` (read in pre-flight).

### 3. Type consistency

- Composite prop names match across F.4 (definition) and F.5–F.8 (usage): `eyebrow`, `h1Pre`, `h1Accent`, `sub`, `ctaPrimary`, `ctaPrimaryHref`, `ctaSecondary`, `ctaSecondaryHref` (UseCaseHero); `eyebrow`, `heading`, `sub`, `colVerbara`, `colA`, `colB`, `colC`, `rows` (SpokeAntiPositioning); `eyebrow`, `heading`, `filename`, `caption`, `code` (SpokeCodeProof); `eyebrow`, `heading`, `body`, `cta`, `ctaHref` (SpokePricingPointer); `slug`, `eyebrow`, `title`, `sub`, `caps`, `cta`, `href` (UseCaseIndexCard).
- i18n key naming: `<spoke>_<section>_<field>` pattern consistent across F.1.6–F.1.9.
- Test data attributes: `data-spoke="..."`, `data-spoke-card="..."`, `data-spoke-cta="..."`, `data-section="solutions-overview"`, `data-tier="..."`, `data-usecases-grid`, `data-mobile-solutions` — consistent between composites and E2E specs.

No inconsistencies found.

---

## Execution handoff

Plan complete and saved to `docs/plans/active/2026-05-10-website-phase-f-hub-and-spoke.md`. Two execution options:

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

**Which approach?**


