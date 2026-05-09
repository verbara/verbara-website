# Website Redesign — Phase B: Home page narrative

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder home content with the 7-section narrative defined in spec §7.1 (Hero · Anti-positioning · How it works · Code proof · Pricing teaser · FAQ · Final CTA), backed by 7 new composite components and authored copy in EN canonical + ES-419 + PT-BR translations.

**Architecture:** Each spec section becomes a single-responsibility composite under `src/components/composites/`. The composites consume the existing Phase A primitives (Button, Badge, Card, Section, Container, Heading, CodeBlock) — no primitive changes. The home pages (`src/pages/index.astro` and `src/pages/[lang]/index.astro`) are rewritten to wire composites in narrative order, sharing a single body markup that differs only in locale derivation. All copy lives in `src/i18n/messages.ts` keyed under a new `home: { ... }` section; the parity check enforces 3-locale coverage. The architecture diagram is hand-authored inline SVG. The FAQ accordion uses vanilla JS (no client framework) following the Phase A NavBar pattern.

**Tech Stack:** Astro 6.3, Tailwind v4 Signal tokens (Phase A), TypeScript strict, Astro `<Code />` from `astro:components` for syntax highlighting, vanilla JS for accordion + copy-button. No new dependencies.

**Spec:** `docs/specs/2026-05-09-website-redesign.md` §7.1 (the 8 home sections; section 7.1.8 Footer is already shipped in Phase A and remains untouched).

**Phase A baseline:** branch `redesign/phase-b-home` started from `main` at commit `31afb12 Merge pull request #2`. Worktree at `.worktrees/redesign-phase-b`. Tests green: 63/63 e2e, Lighthouse 6/6 thresholds passing, html-validate 0 errors / 10 long-title warnings (long titles will be addressed by this phase's copy work).

**What Phase B explicitly does NOT do:**
- Touch pricing (Phase C — rebuilds tier cards + comparison matrix; only adds anchors `#group-free|self|managed` so the PricingTeaser can deep-link into existing pricing.astro).
- Touch developer-license form or legal pages (Phase D).
- Author logos, favicons, or OG images (Phase E).
- Add `<main>` aria-label, blog, customer logos, product screenshots, sitemap, or any deferred feature.

End state: the home renders the narrative defined in spec §7.1 in all 3 locales; no pricing teaser orphan links; tests cover the 8 new section landmarks plus the FAQ accordion behavior.

---

## File Structure

### Created

```
src/components/composites/
  Hero.astro                         — section 1: hero with eyebrow, headline, sub, dual CTA, trust strip
  AntiPositioningTable.astro         — section 2: 4-column "what you replace" table
  ArchitectureDiagram.astro          — section 3: inline SVG, 5-box left-to-right flow
  CodeProof.astro                    — section 4: code block + 4 numeric proof cards
  PricingTeaser.astro                — section 5: 3-card group teaser with deep-link CTAs
  Faq.astro                          — section 6: vanilla-JS accordion, 6 Q&A
  FinalCta.astro                     — section 7: inset closing claim + single CTA
tests/e2e/
  home-narrative.spec.ts             — section presence + FAQ accordion behavior
```

### Modified

```
src/i18n/messages.ts                 — add `home` block with ~80 keys × 3 locales
src/pages/index.astro                — full rewrite to compose the 7 sections
src/pages/[lang]/index.astro         — mirror of the above (locale derivation only differs)
src/pages/pricing.astro              — add anchor IDs `group-free`, `group-self`, `group-managed`
src/pages/[lang]/pricing.astro       — same
tests/e2e/smoke.spec.ts              — adjust title regex if pricing/locale titles need tightening
```

### Deleted

None.

---

## Conventions

- **Copy strategy:** EN-US is the canonical source. ES-419 and PT-BR are human translations (you produce drafts in this plan; user revises during spec review). Voice/tone per spec §8: second person, direct, technical, no buzzwords, sentence length avg 12 words. Numbers are localized (e.g. `2.893` in ES/PT vs `2,893` in EN); all other technical strings (e.g. `MIT`, `Asterisk`, `Apache 2.0`, package names, function names) stay English regardless of locale.
- **i18n parity gate:** `npm run test:i18n` must pass after every commit that touches `messages.ts`. The script enforces every key present + non-empty in all 3 locales.
- **Component shape:** every composite has TypeScript `Props` interface (even if empty), pulls i18n via `getMessages(getLocaleFromPath(Astro.url.pathname))`, and uses Phase A primitives wherever a primitive fits. No bespoke buttons or cards.
- **Commit cadence:** commit at every passing test or coherent visual checkpoint. Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`, `i18n:`). No `Co-Authored-By` (per global CLAUDE.md).
- **Dev server in another terminal:** keep `npm run dev` running during the entire plan to spot visual regressions live.

---

## Task 0: Verify clean starting state

**Files:** none (verification only).

- [ ] **Step 0.1: Confirm branch + working tree**

```bash
git status
git log --oneline -3
```

Expected: on branch `redesign/phase-b-home`, working tree clean, HEAD at `31afb12 Merge pull request #2 from verbara/redesign/phase-a-design-system`.

If anything else, stop and ask the controller.

- [ ] **Step 0.2: Confirm baseline tests pass**

```bash
npm run check
npm run lint
npm run test:i18n
npm run build
npm run validate:html
npm run test:e2e
```

Expected: all green. e2e shows 63 tests passed.

If a check fails, this is a Phase A regression — STOP, report BLOCKED to the controller. Do not paper over.

---

## Task 1: Add `home` i18n key shape (interface + 3 locales)

**Files:** `src/i18n/messages.ts`.

This task adds ~80 keys to support all 7 home sections. EN copy is canonical (paste verbatim from below). ES-419 and PT-BR translations are drafts the implementer authors following the rules in the Conventions section.

- [ ] **Step 1.1: Read the current `messages.ts` to locate insertion points**

```bash
grep -n "^  landing:\|^  pricing:\|^  footer:" src/i18n/messages.ts | head -10
```

You'll see 4 locations per locale-block (interface + 3 locales).

- [ ] **Step 1.2: Add the `home` block to the `Messages` interface**

Find the interface section (line ~18-50). Insert a new `home` block AFTER `landing` and BEFORE `pricing`:

```typescript
  home: {
    // Hero (§7.1.1)
    hero_eyebrow: string;          // "MIT SDK · Apache Platform · 0 vulns"
    hero_h1_pre: string;            // "The AI-ready contact center you can"
    hero_h1_accent: string;         // "audit, self-host, own."
    hero_sub: string;
    hero_cta_primary: string;       // "Run the stack →"
    hero_cta_secondary: string;     // "Talk to sales"
    hero_cta_dev_license: string;   // small text under CTAs
    hero_trust_packages: string;    // "27 SDK packages"
    hero_trust_tests: string;       // "2,893 unit tests"
    hero_trust_vulns: string;       // "0 vulnerable packages"
    hero_trust_oss: string;         // "Open source on GitHub"

    // Anti-positioning (§7.1.2)
    ap_eyebrow: string;             // "What you replace"
    ap_h2_pre: string;              // "Stop renting your contact center."
    ap_h2_accent: string;           // "Start running it."
    ap_sub: string;
    ap_col_verbara: string;
    ap_col_genesys: string;
    ap_col_asterisk: string;
    ap_col_vicidial: string;
    ap_row_source: string;          // "Source available"
    ap_row_selfhost: string;
    ap_row_modern_ui: string;
    ap_row_ai: string;
    ap_row_multitenant: string;
    ap_row_latam: string;

    // How it works (§7.1.3)
    hiw_eyebrow: string;            // "How it works"
    hiw_h2: string;                 // "Five components, one stack, every layer auditable."
    hiw_caption: string;            // diagram caption
    hiw_box_asterisk: string;       // "Asterisk PBX"
    hiw_box_asterisk_label: string; // "upstream"
    hiw_box_sdk: string;            // "Verbara.Sdk"
    hiw_box_pro: string;            // "Verbara.Sdk.Pro"
    hiw_box_platform: string;       // "Verbara.Platform"
    hiw_box_web: string;            // "Verbara.Platform.Web"

    // Code proof (§7.1.4)
    cp_eyebrow: string;             // "Read the source"
    cp_h2_pre: string;              // "Real code. Real tests."
    cp_h2_accent: string;           // "No vaporware."
    cp_filename: string;            // "Program.cs"
    cp_caption: string;             // "Uses Verbara.Sdk 2.1.0 — dotnet add package Verbara.Sdk →"
    cp_card_packages_value: string; // "27"
    cp_card_packages_label: string; // "SDK packages"
    cp_card_tests_value: string;    // "2,893"
    cp_card_tests_label: string;
    cp_card_vulns_value: string;    // "0"
    cp_card_vulns_label: string;
    cp_card_aot_value: string;      // ".NET 10 AOT"
    cp_card_aot_label: string;

    // Pricing teaser (§7.1.5)
    pt_eyebrow: string;             // "Pricing"
    pt_h2: string;
    pt_card_free_title: string;     // "Free / Dev"
    pt_card_free_tagline: string;   // "Tier 0 + Tier 0.5"
    pt_card_free_price: string;
    pt_card_free_cta: string;       // "See OSS license →"
    pt_card_self_title: string;     // "Self-Serve"
    pt_card_self_tagline: string;
    pt_card_self_price: string;
    pt_card_self_cta: string;
    pt_card_self_badge: string;     // "Recommended"
    pt_card_ent_title: string;      // "Enterprise"
    pt_card_ent_tagline: string;
    pt_card_ent_price: string;
    pt_card_ent_cta: string;        // "Talk to sales →"

    // FAQ (§7.1.6)
    faq_eyebrow: string;            // "FAQ"
    faq_h2: string;                 // "Direct answers."
    faq_q1: string;
    faq_a1: string;
    faq_q2: string;
    faq_a2: string;
    faq_q3: string;
    faq_a3: string;
    faq_q4: string;
    faq_a4: string;
    faq_q5: string;
    faq_a5: string;
    faq_q6: string;
    faq_a6: string;

    // Final CTA (§7.1.7)
    final_h2_pre: string;           // "Stop renting your contact center."
    final_h2_accent: string;        // "Start running it."
    final_sub: string;              // "60-day developer license, signed, free. No credit card."
    final_cta: string;              // "Get a developer license →"
  };
```

- [ ] **Step 1.3: Add the `home` block to the **es-419** locale**

Find the es-419 block (search for `'es-419':` or the first occurrence of `nav: {` in MESSAGES — line ~174). Add the `home` block AFTER `landing` and BEFORE `pricing`:

```typescript
  home: {
    // Hero
    hero_eyebrow: 'MIT SDK · Apache Platform · 0 vulns',
    hero_h1_pre: 'El contact center listo para IA que puedes',
    hero_h1_accent: 'auditar, ejecutar, poseer.',
    hero_sub: 'Open-core, CCaaS Asterisk-native para operadores cansados del vendor lock-in. Córrelo en tu data center, tu nube, o nuestro plano gestionado — tú decides.',
    hero_cta_primary: 'Corre el stack →',
    hero_cta_secondary: 'Hablar con ventas',
    hero_cta_dev_license: 'o consigue una licencia developer — gratis, firmada, válida 60 días →',
    hero_trust_packages: '27 paquetes SDK',
    hero_trust_tests: '2.893 tests unitarios',
    hero_trust_vulns: '0 paquetes vulnerables',
    hero_trust_oss: 'Open source en GitHub',

    // Anti-positioning
    ap_eyebrow: 'Lo que reemplazas',
    ap_h2_pre: 'Deja de rentar tu contact center.',
    ap_h2_accent: 'Empieza a correrlo.',
    ap_sub: 'Verbara está construido donde los trade-offs de los incumbentes se vuelven inaceptables: código, soberanía, costo total.',
    ap_col_verbara: 'Verbara',
    ap_col_genesys: 'Genesys / Five9',
    ap_col_asterisk: 'Asterisk + scripts',
    ap_col_vicidial: 'VICIdial / FreePBX',
    ap_row_source: 'Código disponible',
    ap_row_selfhost: 'Self-host',
    ap_row_modern_ui: 'UI de operación moderna',
    ap_row_ai: 'Pipeline AI nativo',
    ap_row_multitenant: 'Multi-tenant + clustering',
    ap_row_latam: 'LATAM por defecto (ES/PT)',

    // How it works
    hiw_eyebrow: 'Cómo funciona',
    hiw_h2: 'Cinco componentes, un stack, cada capa auditable.',
    hiw_caption: 'SDK y Platform son open-source. Pro añade overlays empresariales licenciados. Web es la UI de tus operadores.',
    hiw_box_asterisk: 'Asterisk PBX',
    hiw_box_asterisk_label: 'upstream',
    hiw_box_sdk: 'Verbara.Sdk',
    hiw_box_pro: 'Verbara.Sdk.Pro',
    hiw_box_platform: 'Verbara.Platform',
    hiw_box_web: 'Verbara.Platform.Web',

    // Code proof
    cp_eyebrow: 'Lee el código',
    cp_h2_pre: 'Código real. Tests reales.',
    cp_h2_accent: 'Cero vaporware.',
    cp_filename: 'Program.cs',
    cp_caption: 'Usa Verbara.Sdk 2.1.0 — dotnet add package Verbara.Sdk →',
    cp_card_packages_value: '27',
    cp_card_packages_label: 'paquetes SDK',
    cp_card_tests_value: '2.893',
    cp_card_tests_label: 'tests unitarios pasando',
    cp_card_vulns_value: '0',
    cp_card_vulns_label: 'paquetes vulnerables',
    cp_card_aot_value: '.NET 10 AOT',
    cp_card_aot_label: 'compilación nativa anticipada',

    // Pricing teaser
    pt_eyebrow: 'Precios',
    pt_h2: 'Gratis para evaluar. Self-host o gestionado cuando escales.',
    pt_card_free_title: 'Gratis / Dev',
    pt_card_free_tagline: 'Tier 0 + Tier 0.5',
    pt_card_free_price: '$0',
    pt_card_free_cta: 'Ver licencia OSS →',
    pt_card_self_title: 'Self-Serve',
    pt_card_self_tagline: 'Tier 1 + Tier 2',
    pt_card_self_price: 'desde $5k/año',
    pt_card_self_cta: 'Ver planes self-host →',
    pt_card_self_badge: 'Recomendado',
    pt_card_ent_title: 'Enterprise',
    pt_card_ent_tagline: 'Tier 3 + Tier 4 + Tier 5',
    pt_card_ent_price: 'desde $99/agente/mes',
    pt_card_ent_cta: 'Hablar con ventas →',

    // FAQ
    faq_eyebrow: 'FAQ',
    faq_h2: 'Respuestas directas.',
    faq_q1: '¿Necesito Asterisk instalado antes de adoptar Verbara?',
    faq_a1: 'Sí. Verbara está construido sobre Asterisk PBX como su substrato de telefonía — no lo reemplazamos, modernizamos la UX del operador, el pipeline de AI y los overlays Pro alrededor de él. Si no tienes Asterisk, lo despliegas junto con Verbara (setup único, bien documentado). Si ya corres Asterisk, Verbara se conecta a tu dialplan y configuración existentes.',
    faq_q2: '¿Corre en Kubernetes?',
    faq_a2: 'Sí. La Platform es K8s-native — multi-tenant y multi-clúster desde Tier 2. Los Helm charts vienen en Verbara.Sdk.Pro. También puedes correrlo en una sola VM con Docker Compose si tu escala no justifica K8s todavía — el stack es portable, sin dependencias ocultas de cloud.',
    faq_q3: '¿Qué pasa con mi deployment si dejo de pagar Pro?',
    faq_a3: 'El motor OSS (SDK MIT + Platform Apache) sigue corriendo indefinidamente — sin kill switch, sin verificación cloud. Pierdes acceso a las features Pro (multi-tenant, dialer predictivo, agent assist, clustering, overlays de analytics) cuando expira tu licencia. Datos y audit logs siguen siendo tuyos. No podemos ni vamos a desactivar una instalación que dejaste de pagar; simplemente dejamos de enviar releases nuevos de Pro.',
    faq_q4: '¿Hay SLA en la edición OSS?',
    faq_a4: 'No. La edición OSS (Tier 0) tiene soporte community vía GitHub issues y Discord público. Tiempo de respuesta best-effort. Los SLA arrancan en Tier 3 (SaaS gestionado, 99.5% uptime) y Tier 4 (99.9% con soporte 24/7 + CSM dedicado). Para tiers comerciales self-host (1, 2), soporte es email o email+Slack — rápido pero no respaldado por SLA.',
    faq_q5: '¿LATAM (ES, PT) es ciudadano de primera o traducción tardía?',
    faq_a5: 'Primera clase. El locale por defecto es es-419 (español LATAM neutro) — verbara.io/ sirve español, la versión inglesa vive en /en-US/. Documentación, soporte y UI del producto se autoran en tres locales (es-419, en-US, pt-BR) con paridad enforced en CI. Ejemplos en pricing, casos y nombres de tier se inclinan a contextos LATAM (BPO, telcos). Verbara está construido por gente que piensa en español.',
    faq_q6: '¿Cómo evalúo features Pro sin comprometerme?',
    faq_a6: 'Saca una licencia Pro Developer (Tier 0.5, gratis, auto-emitida en /developer-license/). Desbloquea cada feature Pro en modo WarnOnly por 60 días — puedes correr multi-tenant, clustering, dialer predictivo, todo, con un warning "license expired" en logs. Después de 60 días decides: comprar un tier pago, volver a OSS, o renovar la licencia developer para otro ciclo de evaluación.',

    // Final CTA
    final_h2_pre: 'Deja de rentar tu contact center.',
    final_h2_accent: 'Empieza a correrlo.',
    final_sub: 'Licencia developer 60 días, firmada, gratis. Sin tarjeta de crédito.',
    final_cta: 'Obtén una licencia developer →',
  },
```

- [ ] **Step 1.4: Add the `home` block to the **en-US** locale**

Find the en-US block (search for `'en-US':`). Add `home` AFTER `landing` and BEFORE `pricing`:

```typescript
  home: {
    // Hero
    hero_eyebrow: 'MIT SDK · Apache Platform · 0 vulns',
    hero_h1_pre: 'The AI-ready contact center you can',
    hero_h1_accent: 'audit, self-host, own.',
    hero_sub: 'Open-core, Asterisk-native CCaaS for operators tired of vendor lock-in. Run it in your data center, your cloud, or our managed plane — your call.',
    hero_cta_primary: 'Run the stack →',
    hero_cta_secondary: 'Talk to sales',
    hero_cta_dev_license: 'or get a developer license — free, signed, valid 60 days →',
    hero_trust_packages: '27 SDK packages',
    hero_trust_tests: '2,893 unit tests',
    hero_trust_vulns: '0 vulnerable packages',
    hero_trust_oss: 'Open source on GitHub',

    // Anti-positioning
    ap_eyebrow: 'What you replace',
    ap_h2_pre: 'Stop renting your contact center.',
    ap_h2_accent: 'Start running it.',
    ap_sub: 'Verbara is built where the trade-offs of incumbents become non-negotiable: code, sovereignty, total cost.',
    ap_col_verbara: 'Verbara',
    ap_col_genesys: 'Genesys / Five9',
    ap_col_asterisk: 'Asterisk + scripts',
    ap_col_vicidial: 'VICIdial / FreePBX',
    ap_row_source: 'Source available',
    ap_row_selfhost: 'Self-host option',
    ap_row_modern_ui: 'Modern operator UI',
    ap_row_ai: 'AI agent pipeline',
    ap_row_multitenant: 'Multi-tenant + clustering',
    ap_row_latam: 'LATAM-default (ES/PT)',

    // How it works
    hiw_eyebrow: 'How it works',
    hiw_h2: 'Five components, one stack, every layer auditable.',
    hiw_caption: 'SDK and Platform are open. Pro adds licensed enterprise overlays. Web is your operators’ UI.',
    hiw_box_asterisk: 'Asterisk PBX',
    hiw_box_asterisk_label: 'upstream',
    hiw_box_sdk: 'Verbara.Sdk',
    hiw_box_pro: 'Verbara.Sdk.Pro',
    hiw_box_platform: 'Verbara.Platform',
    hiw_box_web: 'Verbara.Platform.Web',

    // Code proof
    cp_eyebrow: 'Read the source',
    cp_h2_pre: 'Real code. Real tests.',
    cp_h2_accent: 'No vaporware.',
    cp_filename: 'Program.cs',
    cp_caption: 'Uses Verbara.Sdk 2.1.0 — dotnet add package Verbara.Sdk →',
    cp_card_packages_value: '27',
    cp_card_packages_label: 'SDK packages',
    cp_card_tests_value: '2,893',
    cp_card_tests_label: 'unit tests passing',
    cp_card_vulns_value: '0',
    cp_card_vulns_label: 'vulnerable packages',
    cp_card_aot_value: '.NET 10 AOT',
    cp_card_aot_label: 'native ahead-of-time',

    // Pricing teaser
    pt_eyebrow: 'Pricing',
    pt_h2: 'Free to evaluate. Self-host or managed when you scale.',
    pt_card_free_title: 'Free / Dev',
    pt_card_free_tagline: 'Tier 0 + Tier 0.5',
    pt_card_free_price: '$0',
    pt_card_free_cta: 'See OSS license →',
    pt_card_self_title: 'Self-Serve',
    pt_card_self_tagline: 'Tier 1 + Tier 2',
    pt_card_self_price: 'from $5k/year',
    pt_card_self_cta: 'See self-host plans →',
    pt_card_self_badge: 'Recommended',
    pt_card_ent_title: 'Enterprise',
    pt_card_ent_tagline: 'Tier 3 + Tier 4 + Tier 5',
    pt_card_ent_price: 'from $99/agent/mo',
    pt_card_ent_cta: 'Talk to sales →',

    // FAQ
    faq_eyebrow: 'FAQ',
    faq_h2: 'Direct answers.',
    faq_q1: 'Do I need an Asterisk install before adopting Verbara?',
    faq_a1: 'Yes. Verbara is built on Asterisk PBX as its telephony substrate — we don’t replace it, we modernize the operator UX, AI pipeline, and Pro overlays around it. If you don’t have Asterisk yet, you deploy it alongside Verbara’s stack (one-time setup, well-documented). If you already run Asterisk, Verbara plugs into your existing dialplan and config.',
    faq_q2: 'Does this run on Kubernetes?',
    faq_a2: 'Yes. The Platform is K8s-native — multi-tenant, multi-cluster ready in Tier 2 and up. Helm charts ship in Verbara.Sdk.Pro. You can also run it on a single VM with Docker Compose if your scale doesn’t justify K8s yet — the stack is portable, no hidden cloud-only dependencies.',
    faq_q3: 'What happens to my deployment if I stop paying for Pro?',
    faq_a3: 'The OSS engine (SDK MIT + Platform Apache) keeps running indefinitely — no kill switch, no cloud check. You lose access to Pro features (multi-tenant, predictive dialer, agent assist, clustering, analytics overlays) when your license expires. Data and audit logs stay yours. We can’t and won’t disable an installation you stopped paying for; we just stop shipping new Pro releases to it.',
    faq_q4: 'Is there an SLA on the OSS edition?',
    faq_a4: 'No. The OSS edition (Tier 0) is community-supported via GitHub issues and the public Discord. Response time is best-effort. SLAs start at Tier 3 (Managed SaaS, 99.5% uptime) and Tier 4 (99.9% with 24/7 support + dedicated CSM). For self-hosted commercial tiers (1, 2), support is email or email+Slack — fast but not SLA-backed.',
    faq_q5: 'Is LATAM (ES, PT) a first-class citizen or a translated afterthought?',
    faq_a5: 'First-class. The default locale is es-419 (Spanish for LATAM) — verbara.io/ serves Spanish, the English version lives at /en-US/. Documentation, support, and product UI are authored in three locales (es-419, en-US, pt-BR) with parity enforced in CI. Examples in pricing, case material, and tier names lean toward LATAM contexts (BPOs, telcos). Verbara is built by people who think in Spanish.',
    faq_q6: 'How do I evaluate Pro features without committing?',
    faq_a6: 'Get a Pro Developer license (Tier 0.5, free, self-issued at /developer-license/). It unlocks every Pro feature in WarnOnly mode for 60 days — you can run multi-tenant, clustering, predictive dialer, the works, with a "license expired" warning in logs. After 60 days you decide: buy a paid tier, drop back to OSS, or extend the dev license for another evaluation cycle.',

    // Final CTA
    final_h2_pre: 'Stop renting your contact center.',
    final_h2_accent: 'Start running it.',
    final_sub: '60-day developer license, signed, free. No credit card.',
    final_cta: 'Get a developer license →',
  },
```

- [ ] **Step 1.5: Add the `home` block to the **pt-BR** locale**

Find the pt-BR block. Add `home` AFTER `landing` and BEFORE `pricing`:

```typescript
  home: {
    // Hero
    hero_eyebrow: 'MIT SDK · Apache Platform · 0 vulns',
    hero_h1_pre: 'O contact center pronto para IA que você pode',
    hero_h1_accent: 'auditar, executar, possuir.',
    hero_sub: 'Open-core, CCaaS Asterisk-native para operadores cansados de vendor lock-in. Rode no seu data center, sua nuvem, ou no nosso plano gerenciado — você decide.',
    hero_cta_primary: 'Rode o stack →',
    hero_cta_secondary: 'Falar com vendas',
    hero_cta_dev_license: 'ou pegue uma licença developer — grátis, assinada, válida 60 dias →',
    hero_trust_packages: '27 pacotes SDK',
    hero_trust_tests: '2.893 testes unitários',
    hero_trust_vulns: '0 pacotes vulneráveis',
    hero_trust_oss: 'Open source no GitHub',

    // Anti-positioning
    ap_eyebrow: 'O que você substitui',
    ap_h2_pre: 'Pare de alugar seu contact center.',
    ap_h2_accent: 'Comece a rodá-lo.',
    ap_sub: 'Verbara é construído onde os trade-offs dos incumbentes ficam inaceitáveis: código, soberania, custo total.',
    ap_col_verbara: 'Verbara',
    ap_col_genesys: 'Genesys / Five9',
    ap_col_asterisk: 'Asterisk + scripts',
    ap_col_vicidial: 'VICIdial / FreePBX',
    ap_row_source: 'Código disponível',
    ap_row_selfhost: 'Self-host',
    ap_row_modern_ui: 'UI de operação moderna',
    ap_row_ai: 'Pipeline IA nativo',
    ap_row_multitenant: 'Multi-tenant + clustering',
    ap_row_latam: 'LATAM padrão (ES/PT)',

    // How it works
    hiw_eyebrow: 'Como funciona',
    hiw_h2: 'Cinco componentes, um stack, cada camada auditável.',
    hiw_caption: 'SDK e Platform são open-source. Pro adiciona overlays empresariais licenciados. Web é a UI dos seus operadores.',
    hiw_box_asterisk: 'Asterisk PBX',
    hiw_box_asterisk_label: 'upstream',
    hiw_box_sdk: 'Verbara.Sdk',
    hiw_box_pro: 'Verbara.Sdk.Pro',
    hiw_box_platform: 'Verbara.Platform',
    hiw_box_web: 'Verbara.Platform.Web',

    // Code proof
    cp_eyebrow: 'Leia o código',
    cp_h2_pre: 'Código real. Testes reais.',
    cp_h2_accent: 'Zero vaporware.',
    cp_filename: 'Program.cs',
    cp_caption: 'Usa Verbara.Sdk 2.1.0 — dotnet add package Verbara.Sdk →',
    cp_card_packages_value: '27',
    cp_card_packages_label: 'pacotes SDK',
    cp_card_tests_value: '2.893',
    cp_card_tests_label: 'testes unitários passando',
    cp_card_vulns_value: '0',
    cp_card_vulns_label: 'pacotes vulneráveis',
    cp_card_aot_value: '.NET 10 AOT',
    cp_card_aot_label: 'compilação nativa antecipada',

    // Pricing teaser
    pt_eyebrow: 'Preços',
    pt_h2: 'Grátis para avaliar. Self-host ou gerenciado quando escalar.',
    pt_card_free_title: 'Grátis / Dev',
    pt_card_free_tagline: 'Tier 0 + Tier 0.5',
    pt_card_free_price: '$0',
    pt_card_free_cta: 'Ver licença OSS →',
    pt_card_self_title: 'Self-Serve',
    pt_card_self_tagline: 'Tier 1 + Tier 2',
    pt_card_self_price: 'a partir de $5k/ano',
    pt_card_self_cta: 'Ver planos self-host →',
    pt_card_self_badge: 'Recomendado',
    pt_card_ent_title: 'Enterprise',
    pt_card_ent_tagline: 'Tier 3 + Tier 4 + Tier 5',
    pt_card_ent_price: 'a partir de $99/agente/mês',
    pt_card_ent_cta: 'Falar com vendas →',

    // FAQ
    faq_eyebrow: 'FAQ',
    faq_h2: 'Respostas diretas.',
    faq_q1: 'Preciso ter Asterisk instalado antes de adotar Verbara?',
    faq_a1: 'Sim. Verbara é construído sobre Asterisk PBX como seu substrato de telefonia — não o substituímos, modernizamos a UX do operador, o pipeline de IA e os overlays Pro ao redor dele. Se você não tem Asterisk ainda, vai implantá-lo junto com Verbara (setup único, bem documentado). Se já roda Asterisk, Verbara se conecta ao seu dialplan e configuração existentes.',
    faq_q2: 'Roda em Kubernetes?',
    faq_a2: 'Sim. A Platform é K8s-native — multi-tenant e multi-cluster a partir do Tier 2. Os Helm charts vêm no Verbara.Sdk.Pro. Também dá pra rodar em uma única VM com Docker Compose se sua escala ainda não justifica K8s — o stack é portátil, sem dependências ocultas de cloud.',
    faq_q3: 'O que acontece com meu deployment se eu parar de pagar Pro?',
    faq_a3: 'O motor OSS (SDK MIT + Platform Apache) continua rodando indefinidamente — sem kill switch, sem verificação cloud. Você perde acesso às features Pro (multi-tenant, dialer preditivo, agent assist, clustering, overlays de analytics) quando sua licença expira. Dados e audit logs continuam seus. Não podemos nem vamos desativar uma instalação que você parou de pagar; simplesmente paramos de enviar releases novos de Pro.',
    faq_q4: 'Tem SLA na edição OSS?',
    faq_a4: 'Não. A edição OSS (Tier 0) tem suporte community via GitHub issues e Discord público. Tempo de resposta best-effort. SLAs começam no Tier 3 (SaaS gerenciado, 99.5% uptime) e Tier 4 (99.9% com suporte 24/7 + CSM dedicado). Para tiers comerciais self-host (1, 2), suporte é e-mail ou e-mail+Slack — rápido mas sem SLA.',
    faq_q5: 'LATAM (ES, PT) é cidadão de primeira ou tradução tardia?',
    faq_a5: 'Primeira classe. O locale padrão é es-419 (espanhol LATAM neutro) — verbara.io/ serve espanhol, a versão inglesa vive em /en-US/. Documentação, suporte e UI do produto são autorados em três locales (es-419, en-US, pt-BR) com paridade enforced em CI. Exemplos em preços, casos e nomes de tier se inclinam a contextos LATAM (BPOs, telcos). Verbara é construído por gente que pensa em espanhol.',
    faq_q6: 'Como avalio features Pro sem me comprometer?',
    faq_a6: 'Pegue uma licença Pro Developer (Tier 0.5, grátis, auto-emitida em /developer-license/). Desbloqueia cada feature Pro em modo WarnOnly por 60 dias — você roda multi-tenant, clustering, dialer preditivo, tudo, com um warning "license expired" nos logs. Depois de 60 dias você decide: comprar um tier pago, voltar pra OSS, ou renovar a licença developer pra outro ciclo de avaliação.',

    // Final CTA
    final_h2_pre: 'Pare de alugar seu contact center.',
    final_h2_accent: 'Comece a rodá-lo.',
    final_sub: 'Licença developer 60 dias, assinada, grátis. Sem cartão de crédito.',
    final_cta: 'Pegue uma licença developer →',
  },
```

- [ ] **Step 1.6: Run i18n parity + check + build**

```bash
npm run test:i18n
npm run check
npm run build
```

Expected: parity reports `i18n parity OK across 3 locales (~210 keys each)` (was 127, now ~210). `astro check` clean. Build clean.

- [ ] **Step 1.7: Commit**

```bash
git add src/i18n/messages.ts
git commit -m "i18n(home): add ~80 keys per locale for the redesigned home narrative"
```

---

## Task 2: Add anchor IDs to existing pricing groups

**Files:** `src/pages/pricing.astro`, `src/pages/[lang]/pricing.astro`.

The PricingTeaser will deep-link into pricing with `#group-free`, `#group-self`, `#group-managed`. Pricing is being fully redesigned in Phase C, but Phase B can ship without orphan links by adding anchor IDs to the appropriate tier-rendering blocks now.

- [ ] **Step 2.1: Read current pricing markup**

```bash
cat src/pages/pricing.astro | head -80
```

Note where Tier 0/0.5 are rendered, where Tier 1/2 are rendered, and where Tier 3/4/5 are rendered.

- [ ] **Step 2.2: Add `id` attribute to one tier card per group, in `src/pages/pricing.astro`**

In the `TIERS.map((tier) => (...))` loop, the `<article>` element receives `data-tier={tier.id}`. We need to also add an HTML `id` attribute on the FIRST tier of each pricing group. The simplest is a runtime conditional inside the article:

Find the `<article` opening tag inside the map. Modify it to:

```astro
        <article
          id={
            tier.id === 'tier_0' ? 'group-free' :
            tier.id === 'tier_1' ? 'group-self' :
            tier.id === 'tier_3' ? 'group-managed' :
            undefined
          }
          class={[
            'flex flex-col rounded-lg border p-6',
            tier.badge === 'popular'
              ? 'border-[var(--color-fg)] ring-1 ring-[var(--color-fg)]'
              : 'border-black/10 dark:border-white/10',
          ].join(' ')}
          data-tier={tier.id}
        >
```

Note: the existing `border-[var(--color-fg)]` style references the now-removed `--color-fg` alias, but Phase A's pricing migration converted these. **Read the actual current file content** — Phase A's commit `2979d87 refactor(ui): migrate all pages to design-system primitives + Signal tokens` did pricing too. The class attribute may already be `border-signal ring-1 ring-signal` or similar. Preserve whatever Phase A left in place; only ADD the conditional `id` attribute.

- [ ] **Step 2.3: Same edit in `src/pages/[lang]/pricing.astro`**

Apply the same `id` conditional to the article in the [lang] variant.

- [ ] **Step 2.4: Build + verify anchors are emitted**

```bash
npm run build
grep -E 'id="group-(free|self|managed)"' dist/pricing/index.html
```

Expected: 3 matches — one per anchor.

- [ ] **Step 2.5: Commit**

```bash
git add src/pages/pricing.astro 'src/pages/[lang]/pricing.astro'
git commit -m "feat(pricing): add anchor IDs group-free/self/managed for home teaser deep-links"
```

---

## Task 3: Hero composite

**Files:** `src/components/composites/Hero.astro` (new).

- [ ] **Step 3.1: Create the file**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import Heading from '../primitives/Heading.astro';
import Button from '../primitives/Button.astro';
import Badge from '../primitives/Badge.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Section>
  <Container size="sm">
    <div class="space-y-6 text-center">
      <Badge variant="mono">{t.home.hero_eyebrow}</Badge>

      <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-balance text-center">
        {t.home.hero_h1_pre} <span class="text-amber">{t.home.hero_h1_accent}</span>
      </h1>

      <p class="text-xl text-bone-2 text-balance max-w-2xl mx-auto">
        {t.home.hero_sub}
      </p>

      <div class="flex flex-wrap justify-center gap-3 pt-2">
        <Button variant="primary" size="lg" href="https://github.com/verbara/Verbara.Sdk">
          {t.home.hero_cta_primary}
        </Button>
        <Button variant="secondary" size="lg" href="mailto:licensing@verbara.io">
          {t.home.hero_cta_secondary}
        </Button>
      </div>

      <p class="text-sm text-bone-3">
        <a href={localiseHref('developer-license', locale)} class="hover:text-signal">
          {t.home.hero_cta_dev_license}
        </a>
      </p>

      <ul class="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-6 text-xs font-mono text-bone-3">
        <li>{t.home.hero_trust_packages}</li>
        <li class="opacity-50">·</li>
        <li>{t.home.hero_trust_tests}</li>
        <li class="opacity-50">·</li>
        <li>{t.home.hero_trust_vulns}</li>
        <li class="opacity-50">·</li>
        <li>{t.home.hero_trust_oss}</li>
        <li class="opacity-50">·</li>
        <li>ES · EN · PT</li>
      </ul>
    </div>
  </Container>
</Section>
```

- [ ] **Step 3.2: Build to verify the component compiles**

```bash
npm run build
```

Expected: clean. Hero isn't yet imported in any page; this just confirms the component compiles.

- [ ] **Step 3.3: Commit**

```bash
git add src/components/composites/Hero.astro
git commit -m "feat(home): add Hero composite (eyebrow + headline + sub + dual CTA + trust strip)"
```

---

## Task 4: AntiPositioningTable composite

**Files:** `src/components/composites/AntiPositioningTable.astro` (new).

- [ ] **Step 4.1: Create the file**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import Heading from '../primitives/Heading.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

// Each row is [labelKey, verbara, genesys, asterisk, vicidial]
// Cell values: '✓', '—', or a short string like 'partial' / 'native'
const rows: Array<[keyof typeof t.home, string, string, string, string]> = [
  ['ap_row_source',       '✓ MIT + Apache',  '—',                '✓',                       '✓'],
  ['ap_row_selfhost',     '✓',               '—',                '✓',                       '✓'],
  ['ap_row_modern_ui',    '✓',               '✓',                '—',                       '—'],
  ['ap_row_ai',           '✓',               '✓',                '—',                       '—'],
  ['ap_row_multitenant',  '✓ Pro',           '✓',                '—',                       'partial'],
  ['ap_row_latam',        '✓',               '—',                'n/a',                     '—'],
];
---

<Section tone="inset" id="what-you-replace">
  <Container size="lg">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">
          {t.home.ap_eyebrow}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.home.ap_h2_pre} <span class="text-amber">{t.home.ap_h2_accent}</span>
        </h2>
        <p class="text-lg text-bone-2 text-balance">{t.home.ap_sub}</p>
      </div>

      <div class="overflow-x-auto rounded-lg border border-line-strong">
        <table class="w-full text-sm">
          <thead class="bg-ink-3">
            <tr>
              <th class="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-bone-3">&nbsp;</th>
              <th class="text-left px-4 py-3 font-medium text-signal">{t.home.ap_col_verbara}</th>
              <th class="text-left px-4 py-3 font-medium text-bone-2">{t.home.ap_col_genesys}</th>
              <th class="text-left px-4 py-3 font-medium text-bone-2">{t.home.ap_col_asterisk}</th>
              <th class="text-left px-4 py-3 font-medium text-bone-2">{t.home.ap_col_vicidial}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            {rows.map(([labelKey, v, g, a, vd]) => (
              <tr>
                <td class="px-4 py-3 font-medium">{t.home[labelKey]}</td>
                <td class="px-4 py-3 text-signal font-mono text-xs">{v}</td>
                <td class="px-4 py-3 text-bone-2 font-mono text-xs">{g}</td>
                <td class="px-4 py-3 text-bone-2 font-mono text-xs">{a}</td>
                <td class="px-4 py-3 text-bone-2 font-mono text-xs">{vd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Container>
</Section>
```

- [ ] **Step 4.2: Build**

```bash
npm run build
```

- [ ] **Step 4.3: Commit**

```bash
git add src/components/composites/AntiPositioningTable.astro
git commit -m "feat(home): add AntiPositioningTable composite (4-col Verbara vs incumbents)"
```

---

## Task 5: ArchitectureDiagram composite

**Files:** `src/components/composites/ArchitectureDiagram.astro` (new).

A hand-authored inline SVG showing the 5-block dependency chain. The implementer is encouraged to keep the SVG geometry as below — it’s sized to fit a `max-w-5xl` container at desktop and shrink-to-fit on mobile via CSS scaling.

- [ ] **Step 5.1: Create the file**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Section id="how-it-works">
  <Container size="md">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">
          {t.home.hiw_eyebrow}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.home.hiw_h2}
        </h2>
      </div>

      <figure class="space-y-4">
        <svg
          viewBox="0 0 800 220"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="archdiag-title archdiag-desc"
          class="w-full h-auto max-w-3xl mx-auto"
        >
          <title id="archdiag-title">{t.home.hiw_h2}</title>
          <desc id="archdiag-desc">{t.home.hiw_caption}</desc>

          <!-- Defs: arrowhead -->
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#40D9FF"/>
            </marker>
          </defs>

          <!-- Box 1: Asterisk PBX (upstream, dotted) -->
          <a href="https://www.asterisk.org/" target="_blank" rel="noopener">
            <rect x="20"  y="80" width="130" height="60" rx="8" fill="rgba(232,238,245,0.04)" stroke="rgba(232,238,245,0.4)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <text x="85" y="105" text-anchor="middle" fill="#E8EEF5" font-size="13" font-family="Geist Sans, sans-serif">{t.home.hiw_box_asterisk}</text>
            <text x="85" y="125" text-anchor="middle" fill="rgba(232,238,245,0.6)" font-size="10" font-family="Geist Mono, monospace">{t.home.hiw_box_asterisk_label}</text>
          </a>

          <!-- Arrow 1 → 2 -->
          <line x1="150" y1="110" x2="178" y2="110" stroke="#40D9FF" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- Box 2: Verbara.Sdk -->
          <a href="https://github.com/verbara/Verbara.Sdk" target="_blank" rel="noopener">
            <rect x="180" y="80" width="130" height="60" rx="8" fill="rgba(64,217,255,0.05)" stroke="#40D9FF" stroke-width="1.5"/>
            <text x="245" y="105" text-anchor="middle" fill="#E8EEF5" font-size="13" font-weight="600" font-family="Geist Sans, sans-serif">{t.home.hiw_box_sdk}</text>
            <text x="245" y="125" text-anchor="middle" fill="#34D399" font-size="10" font-family="Geist Mono, monospace">MIT</text>
          </a>

          <!-- Arrow 2 → 3 -->
          <line x1="310" y1="110" x2="338" y2="110" stroke="#40D9FF" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- Box 3: Verbara.Sdk.Pro -->
          <a href="https://github.com/verbara/Verbara.Sdk.Pro" target="_blank" rel="noopener">
            <rect x="340" y="80" width="130" height="60" rx="8" fill="rgba(255,181,71,0.05)" stroke="#FFB547" stroke-width="1.5"/>
            <text x="405" y="105" text-anchor="middle" fill="#E8EEF5" font-size="13" font-weight="600" font-family="Geist Sans, sans-serif">{t.home.hiw_box_pro}</text>
            <text x="405" y="125" text-anchor="middle" fill="#FFB547" font-size="10" font-family="Geist Mono, monospace">Commercial</text>
          </a>

          <!-- Arrow 3 → 4 -->
          <line x1="470" y1="110" x2="498" y2="110" stroke="#40D9FF" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- Box 4: Verbara.Platform -->
          <a href="https://github.com/verbara/Verbara.Platform" target="_blank" rel="noopener">
            <rect x="500" y="80" width="130" height="60" rx="8" fill="rgba(64,217,255,0.05)" stroke="#40D9FF" stroke-width="1.5"/>
            <text x="565" y="105" text-anchor="middle" fill="#E8EEF5" font-size="13" font-weight="600" font-family="Geist Sans, sans-serif">{t.home.hiw_box_platform}</text>
            <text x="565" y="125" text-anchor="middle" fill="#34D399" font-size="10" font-family="Geist Mono, monospace">Apache 2.0</text>
          </a>

          <!-- Bidirectional 4 ↔ 5 -->
          <line x1="630" y1="103" x2="658" y2="103" stroke="#40D9FF" stroke-width="1.5" marker-end="url(#arrow)"/>
          <line x1="660" y1="117" x2="632" y2="117" stroke="#40D9FF" stroke-width="1.5" marker-end="url(#arrow)"/>

          <!-- Box 5: Verbara.Platform.Web -->
          <a href="https://github.com/verbara/Verbara.Platform.Web" target="_blank" rel="noopener">
            <rect x="660" y="80" width="130" height="60" rx="8" fill="rgba(64,217,255,0.05)" stroke="#40D9FF" stroke-width="1.5"/>
            <text x="725" y="105" text-anchor="middle" fill="#E8EEF5" font-size="13" font-weight="600" font-family="Geist Sans, sans-serif">{t.home.hiw_box_web}</text>
            <text x="725" y="125" text-anchor="middle" fill="#34D399" font-size="10" font-family="Geist Mono, monospace">Apache 2.0</text>
          </a>
        </svg>

        <figcaption class="text-center text-sm text-bone-2 max-w-2xl mx-auto">
          {t.home.hiw_caption}
        </figcaption>
      </figure>
    </div>
  </Container>
</Section>
```

- [ ] **Step 5.2: Build**

```bash
npm run build
```

- [ ] **Step 5.3: Commit**

```bash
git add src/components/composites/ArchitectureDiagram.astro
git commit -m "feat(home): add ArchitectureDiagram composite (inline SVG, 5 boxes, clickable repos)"
```

---

## Task 6: CodeProof composite

**Files:** `src/components/composites/CodeProof.astro` (new).

- [ ] **Step 6.1: Create the file**

The C# snippet shown below is illustrative and uses the `Verbara.Sdk.Ami` package surface (AMI client) — concrete enough that a developer reading it understands the SDK shape without copying it verbatim.

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import CodeBlock from '../primitives/CodeBlock.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const sampleCode = `using Verbara.Sdk.Ami;

await using var client = new AmiClient(
    host: "pbx.example.com",
    user: "admin",
    secret: Environment.GetEnvironmentVariable("AMI_SECRET")!);

await client.ConnectAsync();

await foreach (var ev in client.Events.WithCancellation(cts.Token))
{
    Console.WriteLine($"[{ev.EventName}] {ev.Channel}");
}
`;
---

<Section>
  <Container size="md">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">
          {t.home.cp_eyebrow}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.home.cp_h2_pre} <span class="text-amber">{t.home.cp_h2_accent}</span>
        </h2>
      </div>

      <div class="grid gap-6 md:grid-cols-[1fr_18rem] items-start">
        <div class="space-y-3">
          <CodeBlock lang="csharp" code={sampleCode} filename={t.home.cp_filename} />
          <p class="text-xs text-bone-3">
            <a href="https://www.nuget.org/packages/Verbara.Sdk" class="hover:text-signal">
              {t.home.cp_caption}
            </a>
          </p>
        </div>

        <ul class="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4 self-stretch">
          <li class="rounded-lg border border-line-strong bg-ink-3/40 p-4">
            <div class="text-2xl font-bold text-signal font-mono">{t.home.cp_card_packages_value}</div>
            <div class="text-xs text-bone-2 mt-1">{t.home.cp_card_packages_label}</div>
          </li>
          <li class="rounded-lg border border-line-strong bg-ink-3/40 p-4">
            <div class="text-2xl font-bold text-signal font-mono">{t.home.cp_card_tests_value}</div>
            <div class="text-xs text-bone-2 mt-1">{t.home.cp_card_tests_label}</div>
          </li>
          <li class="rounded-lg border border-line-strong bg-ink-3/40 p-4">
            <div class="text-2xl font-bold text-signal font-mono">{t.home.cp_card_vulns_value}</div>
            <div class="text-xs text-bone-2 mt-1">{t.home.cp_card_vulns_label}</div>
          </li>
          <li class="rounded-lg border border-line-strong bg-ink-3/40 p-4">
            <div class="text-sm font-bold text-signal font-mono">{t.home.cp_card_aot_value}</div>
            <div class="text-xs text-bone-2 mt-1">{t.home.cp_card_aot_label}</div>
          </li>
        </ul>
      </div>
    </div>
  </Container>
</Section>
```

- [ ] **Step 6.2: Build**

```bash
npm run build
```

If Shiki errors on `csharp`, check that `csharp` is in Astro's default Shiki language list. If it isn't (it should be in Astro 6+), fall back to `cs` or `c#`. Adjust the `lang="..."` accordingly.

- [ ] **Step 6.3: Commit**

```bash
git add src/components/composites/CodeProof.astro
git commit -m "feat(home): add CodeProof composite (C# AMI snippet + 4 numeric proof cards)"
```

---

## Task 7: PricingTeaser composite

**Files:** `src/components/composites/PricingTeaser.astro` (new).

- [ ] **Step 7.1: Create the file**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import Card from '../primitives/Card.astro';
import Button from '../primitives/Button.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const pricingHref = localiseHref('pricing', locale);
---

<Section tone="inset">
  <Container size="md">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">
          {t.home.pt_eyebrow}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.home.pt_h2}
        </h2>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <Card as="article">
          <h3 class="text-lg font-semibold">{t.home.pt_card_free_title}</h3>
          <p class="text-xs font-mono text-bone-3 mt-1">{t.home.pt_card_free_tagline}</p>
          <p class="text-2xl font-bold mt-3">{t.home.pt_card_free_price}</p>
          <div class="mt-5">
            <Button variant="secondary" href={`${pricingHref}#group-free`}>
              {t.home.pt_card_free_cta}
            </Button>
          </div>
        </Card>

        <Card as="article" variant="highlighted">
          <div class="flex items-baseline justify-between">
            <h3 class="text-lg font-semibold">{t.home.pt_card_self_title}</h3>
            <span class="rounded bg-signal text-ink px-2 py-0.5 text-xs font-mono">
              {t.home.pt_card_self_badge}
            </span>
          </div>
          <p class="text-xs font-mono text-bone-3 mt-1">{t.home.pt_card_self_tagline}</p>
          <p class="text-2xl font-bold mt-3">{t.home.pt_card_self_price}</p>
          <div class="mt-5">
            <Button variant="primary" href={`${pricingHref}#group-self`}>
              {t.home.pt_card_self_cta}
            </Button>
          </div>
        </Card>

        <Card as="article">
          <h3 class="text-lg font-semibold">{t.home.pt_card_ent_title}</h3>
          <p class="text-xs font-mono text-bone-3 mt-1">{t.home.pt_card_ent_tagline}</p>
          <p class="text-2xl font-bold mt-3">{t.home.pt_card_ent_price}</p>
          <div class="mt-5">
            <Button variant="secondary" href={`${pricingHref}#group-managed`}>
              {t.home.pt_card_ent_cta}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </Container>
</Section>
```

- [ ] **Step 7.2: Build + verify anchors don't 404**

```bash
npm run build
grep -E 'href="(/[a-z-]+/)?pricing/#group-(free|self|managed)"' dist/index.html | head -3
```

Expected: 3 href matches in the home output.

- [ ] **Step 7.3: Commit**

```bash
git add src/components/composites/PricingTeaser.astro
git commit -m "feat(home): add PricingTeaser composite (3-card teaser with deep-link CTAs)"
```

---

## Task 8: Faq composite (with vanilla JS accordion)

**Files:** `src/components/composites/Faq.astro` (new).

- [ ] **Step 8.1: Create the file**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const items = [
  { q: t.home.faq_q1, a: t.home.faq_a1 },
  { q: t.home.faq_q2, a: t.home.faq_a2 },
  { q: t.home.faq_q3, a: t.home.faq_a3 },
  { q: t.home.faq_q4, a: t.home.faq_a4 },
  { q: t.home.faq_q5, a: t.home.faq_a5 },
  { q: t.home.faq_q6, a: t.home.faq_a6 },
];
---

<Section id="faq">
  <Container size="sm">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">
          {t.home.faq_eyebrow}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.home.faq_h2}
        </h2>
      </div>

      <ul class="space-y-3">
        {items.map((item, idx) => {
          const id = `faq-${idx + 1}`;
          return (
            <li class="rounded-lg border border-line-strong bg-ink-3/40">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded="false"
                aria-controls={`${id}-panel`}
                data-faq-toggle={id}
              >
                <span class="font-medium">{item.q}</span>
                <svg
                  class="shrink-0 h-4 w-4 text-bone-2 transition-transform"
                  data-faq-icon={id}
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M4 6 L8 10 L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div
                id={`${id}-panel`}
                class="hidden px-5 pb-4 text-sm text-bone-2 leading-relaxed"
                role="region"
                aria-labelledby={`${id}-q`}
              >
                {item.a}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </Container>
</Section>

<script>
  document.querySelectorAll<HTMLButtonElement>('[data-faq-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.faqToggle!;
      const panel = document.getElementById(`${id}-panel`);
      const icon = document.querySelector<SVGElement>(`[data-faq-icon="${id}"]`);
      if (!panel) return;
      const isOpen = !panel.classList.contains('hidden');
      panel.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (icon) icon.style.transform = isOpen ? '' : 'rotate(180deg)';
    });
  });
</script>
```

- [ ] **Step 8.2: Build**

```bash
npm run build
```

- [ ] **Step 8.3: Commit**

```bash
git add src/components/composites/Faq.astro
git commit -m "feat(home): add Faq composite (6 Q&A vanilla-JS accordion)"
```

---

## Task 9: FinalCta composite

**Files:** `src/components/composites/FinalCta.astro` (new).

- [ ] **Step 9.1: Create the file**

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import Button from '../primitives/Button.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Section tone="inset">
  <Container size="sm">
    <div class="text-center space-y-5">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
        {t.home.final_h2_pre} <span class="text-signal">{t.home.final_h2_accent}</span>
      </h2>
      <p class="text-lg text-bone-2 text-balance">{t.home.final_sub}</p>
      <div class="pt-2">
        <Button variant="primary" size="lg" href={localiseHref('developer-license', locale)}>
          {t.home.final_cta}
        </Button>
      </div>
    </div>
  </Container>
</Section>
```

- [ ] **Step 9.2: Build**

```bash
npm run build
```

- [ ] **Step 9.3: Commit**

```bash
git add src/components/composites/FinalCta.astro
git commit -m "feat(home): add FinalCta composite (closing claim + dev-license CTA)"
```

---

## Task 10: Wire composites into `src/pages/index.astro`

**Files:** `src/pages/index.astro` (full rewrite).

- [ ] **Step 10.1: Replace `src/pages/index.astro` with EXACTLY:**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/composites/Hero.astro';
import AntiPositioningTable from '../components/composites/AntiPositioningTable.astro';
import ArchitectureDiagram from '../components/composites/ArchitectureDiagram.astro';
import CodeProof from '../components/composites/CodeProof.astro';
import PricingTeaser from '../components/composites/PricingTeaser.astro';
import Faq from '../components/composites/Faq.astro';
import FinalCta from '../components/composites/FinalCta.astro';
---

<Layout>
  <Hero />
  <AntiPositioningTable />
  <ArchitectureDiagram />
  <CodeProof />
  <PricingTeaser />
  <Faq />
  <FinalCta />
</Layout>
```

That is the entire file. Notice that `getMessages`, `locale`, and `getLocaleFromPath` are no longer needed in this page — each composite resolves its own locale via the URL path. The Layout still handles `<title>` from defaults if no `title` prop is passed.

- [ ] **Step 10.2: Build + verify each section landmark is present**

```bash
npm run build
for marker in 'data-faq-toggle' 'archdiag-title' 'group-free' 'cp_card_packages' 'ap_eyebrow' 'hero_eyebrow' 'final_cta'; do
  echo -n "$marker: "
  grep -c "$marker" dist/index.html || echo 0
done
```

`hero_eyebrow`, `ap_eyebrow`, etc. won't appear literally (those are i18n keys, not in the output) — instead grep for the rendered text:

```bash
grep -c 'MIT SDK · Apache Platform' dist/index.html       # Hero eyebrow → expect 1
grep -c 'archdiag-title' dist/index.html                  # ArchitectureDiagram → expect 1
grep -c 'data-faq-toggle' dist/index.html                 # Faq buttons → expect 6
grep -c 'group-free\|group-self\|group-managed' dist/index.html  # PricingTeaser hrefs → expect ≥3
```

All values should be ≥ expected.

- [ ] **Step 10.3: Commit**

```bash
git add src/pages/index.astro
git commit -m "refactor(home): wire 7 composites into es-419 home (canonical) page"
```

---

## Task 11: Mirror to `src/pages/[lang]/index.astro`

**Files:** `src/pages/[lang]/index.astro`.

- [ ] **Step 11.1: Read the current file to identify the locale-derivation pattern**

```bash
cat 'src/pages/[lang]/index.astro'
```

Note its `getStaticPaths()` and how it reads `Astro.params.lang`. You will preserve that pattern.

- [ ] **Step 11.2: Replace the body markup**

The file should still export `getStaticPaths()` and derive the locale, then render the same composites. Only the frontmatter differs. Replace the whole file with:

```astro
---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/composites/Hero.astro';
import AntiPositioningTable from '../../components/composites/AntiPositioningTable.astro';
import ArchitectureDiagram from '../../components/composites/ArchitectureDiagram.astro';
import CodeProof from '../../components/composites/CodeProof.astro';
import PricingTeaser from '../../components/composites/PricingTeaser.astro';
import Faq from '../../components/composites/Faq.astro';
import FinalCta from '../../components/composites/FinalCta.astro';

export function getStaticPaths() {
  return [
    { params: { lang: 'en-US' } },
    { params: { lang: 'pt-BR' } },
  ];
}
---

<Layout>
  <Hero />
  <AntiPositioningTable />
  <ArchitectureDiagram />
  <CodeProof />
  <PricingTeaser />
  <Faq />
  <FinalCta />
</Layout>
```

- [ ] **Step 11.3: Build + cross-locale verification**

```bash
npm run build
for path in 'index' 'en-US/index' 'pt-BR/index'; do
  echo -n "${path}: hero MIT badge="
  grep -c 'MIT SDK · Apache Platform' "dist/${path}.html" || echo 0
done
```

Expected: 1 per locale (3 total).

- [ ] **Step 11.4: Commit**

```bash
git add 'src/pages/[lang]/index.astro'
git commit -m "refactor(home): mirror redesigned home to en-US + pt-BR locale routes"
```

---

## Task 12: e2e tests for the new home structure

**Files:** `tests/e2e/home-narrative.spec.ts` (new).

- [ ] **Step 12.1: Create `tests/e2e/home-narrative.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/`;

  test(`home narrative: all 7 sections render at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Hero — eyebrow badge text is locale-independent
    await expect(page.locator('text=MIT SDK · Apache Platform · 0 vulns')).toBeVisible();

    // Hero — single H1 visible
    await expect(page.locator('h1').first()).toBeVisible();

    // Anti-positioning — table with 4 columns + 6 rows + Verbara header
    await expect(page.locator('text=Verbara').first()).toBeVisible();
    const tableRows = await page.locator('section table tbody tr').count();
    expect(tableRows).toBeGreaterThanOrEqual(6);

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

- [ ] **Step 12.2: Run all e2e tests**

```bash
npm run build
npm run test:e2e
```

Expected count: previous 63 + 6 new (3 narrative tests × 3 locales × ... wait, 3 prefixes × 2 tests per prefix = 6 new tests × 3 browsers = 18 new cases). Total = 63 + 18 = **81 cases**, all green.

If a smoke test from Phase A starts failing because the home title regex is now too lax for the new long titles, tighten the regex in `tests/e2e/smoke.spec.ts` — don't loosen the assertion.

- [ ] **Step 12.3: Commit**

```bash
git add tests/e2e/home-narrative.spec.ts
git commit -m "test(e2e): add home narrative + FAQ accordion tests across 3 locales"
```

---

## Task 13: Lighthouse audit + targeted fixes

**Files:** depends on what surfaces.

- [ ] **Step 13.1: Run Lighthouse against the rebuilt home**

```bash
npm run build
npx lhci autorun --collect.staticDistDir=./dist
```

Expected: all 6 URLs pass thresholds (Perf ≥ 0.9 / A11y ≥ 0.95 / BP ≥ 0.95 / SEO = 1.0).

The new home is content-richer than the placeholder it replaced. Most likely categories of regression:
- **Color contrast on FAQ accordion buttons or AP table cells** — if a `text-bone-3` is used somewhere on a darker bg, contrast may fail. Fix: bump to `text-bone-2`.
- **Heading hierarchy** — verify there are no h2 → h4 jumps (the home has h1 in Hero; every other section uses h2 — should be fine).
- **CLS during font swap** — Geist already has font-display: swap; if CLS is reported, add `font-feature-settings` or pre-allocate hero space.
- **Long titles** — the home title is `t.meta.site_title` which we did NOT change in Phase B; should still pass.

For each failing assertion, make the minimal targeted fix and re-run. **Do NOT lower thresholds.**

- [ ] **Step 13.2: Run full test:all**

```bash
npm run test:all
```

Expected: every gate passes — check, lint, i18n parity (210+ keys × 3), build, html-validate (0 errors, ≤ existing warnings count), e2e (81 cases), lhci (6 URLs all green).

- [ ] **Step 13.3: Commit any remediation**

If you made source fixes:
```bash
git add -A
git commit -m "fix(a11y): satisfy lighthouse thresholds on redesigned home"
```

If no fixes were needed, skip.

---

## Task 14: Phase B close

**Files:** `docs/plans/active/2026-05-09-website-redesign-phase-b-home.md` → `docs/plans/completed/`.

- [ ] **Step 14.1: Confirm clean shell**

```bash
git status
npm run test:all
```

Expected: working tree clean (or only ignored artifacts), all tests green.

- [ ] **Step 14.2: Move plan from `active/` to `completed/`**

```bash
git mv docs/plans/active/2026-05-09-website-redesign-phase-b-home.md docs/plans/completed/
git commit -m "docs(plans): mark phase-b-home complete"
```

- [ ] **Step 14.3: Inspect bundle size baseline shift**

```bash
npm run build
du -sh dist/
ls -lh dist/_astro/*.css dist/_astro/*.js 2>/dev/null | head -10
```

Record the new totals — Phase A ended at ~600 KB total dist. Phase B will add inline-SVG (~2 KB) + new copy (~40 KB across 18 pages × 3 locales) + accordion JS (~1 KB). Expected: ≤ ~700 KB total.

- [ ] **Step 14.4: Stop**

Do NOT push, merge, or open a PR. Report final state to the controller; the controller decides merge strategy (parallel to Phase A).

---

## Spec coverage check

Each spec §7.1 subsection mapped to a task that implements it:

| Spec § | Section | Task |
|---|---|---|
| §7.1.1 | Hero | Task 3 (component) + Task 1.x (copy) + Task 10/11 (wiring) |
| §7.1.2 | Anti-positioning table | Task 4 + Task 1 + Task 10/11 |
| §7.1.3 | How it works (architecture diagram) | Task 5 + Task 1 + Task 10/11 |
| §7.1.4 | Code + dev proof | Task 6 + Task 1 + Task 10/11 |
| §7.1.5 | Pricing teaser | Task 7 + Task 2 (anchors) + Task 1 + Task 10/11 |
| §7.1.6 | FAQ | Task 8 + Task 1 + Task 10/11 |
| §7.1.7 | Final CTA | Task 9 + Task 1 + Task 10/11 |
| §7.1.8 | Footer | Already in Phase A (no Phase B work) |
| §8 | Copy strategy & i18n | Task 1 (EN canonical, ES + PT human translations following voice/tone rules) |
| §9.2 | e2e tests | Task 12 |
| §9.3 | Lighthouse thresholds | Task 13 |

**Out of Phase B by design** (deferred to C–E):
- Pricing rebuild (Layout A: 3 groups + matrix; TierCard, TierGroup, ComparisonMatrix composites)
- Developer-license form rebuild and Legal pages with LegalDoc
- Logo SVGs, favicons, OG images, sitemap, meta polish

---

## Plan complete

Plan saved to `docs/plans/active/2026-05-09-website-redesign-phase-b-home.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks. Fast iteration, isolated context per task. Validated pattern from Phase A.
2. **Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints for review.

**Which approach do you want?**
