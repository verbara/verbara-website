# Website Redesign — Phase C: Pricing page redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat 7-tier pricing grid with the Layout A from spec §7.2: 3 visual groups (Free, Self-host, Managed SaaS) reflecting the home PricingTeaser, plus a comparison matrix below for power-user evaluators, plus 3 pricing-specific FAQ questions.

**Architecture:** 3 new composites under `src/components/composites/`: `TierCard.astro` (single tier card, extracted from the existing inline pricing.astro markup), `TierGroup.astro` (group label + 2-3 TierCards), `ComparisonMatrix.astro` (8-column × 10-row table). The existing `Faq.astro` composite is refactored to accept `items` and `idPrefix` props so it can be reused on pricing — also requires a one-line update at the home call sites. New i18n keys cluster under `pricing.*` (group labels, matrix feature labels, support tokens, pricing-faq Q&A, hero rewrite).

**Tech Stack:** Astro 6.3, Tailwind v4 Signal tokens (Phase A), Phase A primitives (Section, Container, Heading, Button, Card, Badge), Phase B's Faq composite (refactored). No new dependencies.

**Spec:** `docs/specs/2026-05-09-website-redesign.md` §7.2 (the pricing page sections 7.2.1–7.2.x).

**Phase B baseline:** branch `redesign/phase-c-pricing` started from `main` at commit `69729e3 Merge pull request #4 from verbara/fix/turnstile-build-time-key`. Worktree at `.worktrees/redesign-phase-c`. Tests green: 81/81 e2e, Lighthouse 6/6 thresholds passing, html-validate 0 errors / 10 long-title warnings (Phase D copy work).

**What Phase C explicitly does NOT do:**
- Touch the home page (Phase B is shipped).
- Touch the developer-license form or Legal pages (Phase D).
- Author logos, favicons, OG images, or sitemap (Phase E).
- Change tier IDs, tier prices, or the canonical 7-tier model (per ADR-0010 in Verbara.Sdk.Pro).

End state: `verbara.io/pricing/` (and `/en-US/pricing/`, `/pt-BR/pricing/`) renders with a hero, three labeled tier groups, a 8-column comparison matrix, and a 3-question pricing FAQ. The home PricingTeaser deep-links `#group-free`, `#group-self`, `#group-managed` continue to work (they were added in Phase B).

---

## File Structure

### Created

```
src/components/composites/
  TierCard.astro                — single tier card (extracted from inline pricing markup)
  TierGroup.astro               — group label + cards wrapper
  ComparisonMatrix.astro        — 8-column matrix (feature label + 7 tier columns)
tests/e2e/
  pricing-narrative.spec.ts     — group anchors, tier counts, matrix presence, pricing FAQ accordion
```

### Modified

```
src/i18n/messages.ts            — add ~30 pricing keys × 3 locales (group labels, matrix labels, support tokens, pricing FAQ, hero rewrite)
src/components/composites/Faq.astro — refactor to accept `items` + `idPrefix` props
src/pages/index.astro           — update Faq call site to pass items prop
src/pages/[lang]/index.astro    — update Faq call site to pass items prop
src/pages/pricing.astro         — full rewrite: Hero + 3 TierGroups + ComparisonMatrix + Faq
src/pages/[lang]/pricing.astro  — mirror
```

### Deleted

None.

---

## Conventions

- **Copy strategy:** EN-US canonical, ES-419 + PT-BR human translations (drafted in this plan; user can revise during spec review). Voice/tone per spec §8 (2nd person, direct, technical, no buzzwords). Numbers localized in copy text (e.g. `2.893`/`2,893`). Matrix cells stay terse — universal symbols (`✓`/`✗`/`—`) need no translation; short technical strings ("partial", "full", "warn") stay English; longer support qualifiers get i18n keys.
- **Tier metadata stays where it is.** The `TIERS` array, `tier_X_name/price/tagline/f1-f4` keys, and CTA logic in pricing.astro are reused — TierCard just consumes them.
- **Faq refactor breaks the existing home call site.** That's expected; Task 2 updates the home consumers in the same commit.
- **i18n parity gate:** `npm run test:i18n` must pass after Task 1.
- **Commit cadence:** commit at every passing test or coherent visual checkpoint. Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`, `i18n:`). No `Co-Authored-By` (per global CLAUDE.md).

---

## Task 0: Verify clean starting state

**Files:** none (verification only).

- [ ] **Step 0.1: Confirm branch + working tree**

```bash
git status
git log --oneline -3
```

Expected: on branch `redesign/phase-c-pricing`, working tree clean, HEAD at `69729e3 Merge pull request #4`.

- [ ] **Step 0.2: Confirm baseline tests pass**

```bash
npm run test:all
```

Expected: all gates green (81 e2e, lhci 6/6, etc).

If any gate fails, STOP and report BLOCKED.

---

## Task 1: Add Phase C i18n keys

**Files:** `src/i18n/messages.ts`.

This task adds ~30 keys to support the redesigned pricing page. EN canonical authored below, ES-419 and PT-BR translations drafted by the implementer following the rules.

### Step 1.1: Add new keys to the `Messages` interface `pricing` block

Find the existing `pricing: { ... }` block in the interface (the existing keys: title, subtitle, cta_*, popular_badge, evaluators_badge, tier_*_name/price/tagline/f1-f4). Add these new keys at the END of the `pricing:` interface block:

```typescript
    // Phase C — pricing redesign
    hero_h1: string;
    hero_sub: string;

    group_free_label: string;
    group_self_label: string;
    group_managed_label: string;

    matrix_eyebrow: string;
    matrix_h2: string;

    matrix_feat_oss_source: string;
    matrix_feat_pro_features: string;
    matrix_feat_multitenant: string;
    matrix_feat_clustering: string;
    matrix_feat_hosted: string;
    matrix_feat_sla: string;
    matrix_feat_support: string;
    matrix_feat_max_agents: string;
    matrix_feat_audit_retention: string;
    matrix_feat_whitelabel: string;

    matrix_support_community: string;
    matrix_support_dedicated: string;

    faq_q1: string;
    faq_a1: string;
    faq_q2: string;
    faq_a2: string;
    faq_q3: string;
    faq_a3: string;
```

(Note: `pricing.faq_q1`/`a1` etc. are NEW keys distinct from `home.faq_q1`/`a1`. The pricing FAQ has only 3 questions.)

### Step 1.2: Add the new keys to the **es-419** locale's `pricing` block

Find the es-419 `pricing: { ... }` and append:

```typescript
    // Phase C — pricing redesign
    hero_h1: 'Elige el tier que coincide con cómo operas.',
    hero_sub: 'Gratis para evaluar. Self-host con licencia cuando shipees. Gestionado cuando prefieras no operarlo tú.',

    group_free_label: 'Gratis · evaluadores · usuarios OSS',
    group_self_label: 'Self-host · pago anual',
    group_managed_label: 'SaaS gestionado · contact sales',

    matrix_eyebrow: 'Comparar features',
    matrix_h2: 'Cada feature, cada tier — sin asteriscos.',

    matrix_feat_oss_source: 'SDK + Platform open-source',
    matrix_feat_pro_features: 'Features Pro',
    matrix_feat_multitenant: 'Multi-tenant',
    matrix_feat_clustering: 'Clustering / multi-clúster',
    matrix_feat_hosted: 'Hospedado por Verbara',
    matrix_feat_sla: 'SLA',
    matrix_feat_support: 'Soporte',
    matrix_feat_max_agents: 'Agentes máximos',
    matrix_feat_audit_retention: 'Retención de audit log',
    matrix_feat_whitelabel: 'White-label / OEM',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicado',

    faq_q1: '¿Puedo subir o bajar de tier?',
    faq_a1: 'Sí, en cualquier momento. Las features se ajustan al cambio del tier; los datos y configuración persisten. Para tiers self-host, el upgrade desbloquea features Pro adicionales en tu instalación; para SaaS gestionado, ajustamos el plan en la próxima factura prorrateada.',
    faq_q2: '¿Hay descuento anual?',
    faq_a2: 'Tiers self-host (1, 2) ya están facturados anualmente — no hay versión mensual. Tiers SaaS (3, 4) facturan mensual por defecto; commit anual con prepago da 15% de descuento. Tier 5 (white-label/OEM) negocia caso a caso.',
    faq_q3: '¿Ofrecen descuento académico o non-profit?',
    faq_a3: 'Sí. Organizaciones non-profit registradas y universidades acreditadas obtienen 50% de descuento en cualquier tier comercial. Manda licencia + comprobante a licensing@verbara.io.',
```

### Step 1.3: Add the new keys to the **en-US** locale's `pricing` block

```typescript
    // Phase C — pricing redesign
    hero_h1: 'Pick the tier that matches how you operate.',
    hero_sub: 'Free to evaluate. Self-host with a license when you ship. Managed when you’d rather not run it.',

    group_free_label: 'Free · evaluators · OSS users',
    group_self_label: 'Self-host · pay-once-per-year',
    group_managed_label: 'Managed SaaS · contact sales',

    matrix_eyebrow: 'Compare features',
    matrix_h2: 'Every feature, every tier — no asterisks.',

    matrix_feat_oss_source: 'SDK + Platform open-source',
    matrix_feat_pro_features: 'Pro feature set',
    matrix_feat_multitenant: 'Multi-tenant',
    matrix_feat_clustering: 'Clustering / multi-cluster',
    matrix_feat_hosted: 'Hosted by Verbara',
    matrix_feat_sla: 'SLA',
    matrix_feat_support: 'Support',
    matrix_feat_max_agents: 'Maximum agents',
    matrix_feat_audit_retention: 'Audit log retention',
    matrix_feat_whitelabel: 'White-label / OEM rights',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicated',

    faq_q1: 'Can I upgrade or downgrade tiers?',
    faq_a1: 'Yes, anytime. Features adjust to match the tier change; data and config persist. For self-host tiers, an upgrade unlocks additional Pro features in your installation; for managed SaaS, we prorate the next invoice.',
    faq_q2: 'Is there an annual discount?',
    faq_a2: 'Self-host tiers (1, 2) are already billed annually — there is no monthly version. Managed SaaS tiers (3, 4) bill monthly by default; an annual commit with prepayment gets 15% off. Tier 5 (white-label/OEM) is case-by-case.',
    faq_q3: 'Do you offer a non-profit or academic discount?',
    faq_a3: 'Yes. Registered non-profits and accredited universities get 50% off any commercial tier. Send your license proof + organization paperwork to licensing@verbara.io.',
```

### Step 1.4: Add the new keys to the **pt-BR** locale's `pricing` block

```typescript
    // Phase C — pricing redesign
    hero_h1: 'Escolha o tier que combina com como você opera.',
    hero_sub: 'Grátis para avaliar. Self-host com licença quando shipar. Gerenciado quando preferir não rodar você.',

    group_free_label: 'Grátis · avaliadores · usuários OSS',
    group_self_label: 'Self-host · pagamento anual',
    group_managed_label: 'SaaS gerenciado · contact sales',

    matrix_eyebrow: 'Comparar features',
    matrix_h2: 'Cada feature, cada tier — sem asteriscos.',

    matrix_feat_oss_source: 'SDK + Platform open-source',
    matrix_feat_pro_features: 'Features Pro',
    matrix_feat_multitenant: 'Multi-tenant',
    matrix_feat_clustering: 'Clustering / multi-cluster',
    matrix_feat_hosted: 'Hospedado pela Verbara',
    matrix_feat_sla: 'SLA',
    matrix_feat_support: 'Suporte',
    matrix_feat_max_agents: 'Agentes máximos',
    matrix_feat_audit_retention: 'Retenção de audit log',
    matrix_feat_whitelabel: 'White-label / OEM',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicado',

    faq_q1: 'Posso subir ou descer de tier?',
    faq_a1: 'Sim, a qualquer momento. As features se ajustam à mudança de tier; dados e configuração persistem. Para tiers self-host, o upgrade desbloqueia features Pro adicionais na sua instalação; para SaaS gerenciado, ajustamos o plano no próximo faturamento prorrateado.',
    faq_q2: 'Tem desconto anual?',
    faq_a2: 'Tiers self-host (1, 2) já são faturados anualmente — não tem versão mensal. Tiers SaaS (3, 4) faturam mensal por padrão; commit anual com pré-pagamento ganha 15% de desconto. Tier 5 (white-label/OEM) é negociado caso a caso.',
    faq_q3: 'Oferecem desconto acadêmico ou non-profit?',
    faq_a3: 'Sim. Organizações non-profit registradas e universidades credenciadas têm 50% de desconto em qualquer tier comercial. Envie comprovante da licença + documentação da organização para licensing@verbara.io.',
```

### Step 1.5: Run i18n parity + check + build

```bash
npm run test:i18n
npm run check
npm run build
```

Expected: parity reports `i18n parity OK across 3 locales (~234 keys each)` (was 207 in Phase B end-state, +27 new pricing keys = ~234). `astro check` clean. Build clean.

### Step 1.6: Commit

```bash
git add src/i18n/messages.ts
git commit -m "i18n(pricing): add ~27 keys per locale for the redesigned pricing page"
```

---

## Task 2: Refactor Faq composite to accept items + idPrefix props

**Files:** `src/components/composites/Faq.astro` (modify), `src/pages/index.astro` (modify), `src/pages/[lang]/index.astro` (modify).

The existing Faq composite hardcodes `t.home.faq_*` reads, which prevents reuse on the pricing page. This task makes it generic.

### Step 2.1: Replace `src/components/composites/Faq.astro` with EXACTLY:

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';

interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  items: FaqItem[];
  idPrefix?: string;
  eyebrow?: string;
  heading?: string;
  sectionId?: string;
}

const {
  items,
  idPrefix = 'faq',
  eyebrow,
  heading,
  sectionId = 'faq',
} = Astro.props;
---

<Section id={sectionId}>
  <Container size="sm">
    <div class="space-y-10">
      {(eyebrow || heading) && (
        <div class="text-center space-y-3 max-w-3xl mx-auto">
          {eyebrow && (
            <p class="text-xs uppercase tracking-wider font-mono text-signal">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              {heading}
            </h2>
          )}
        </div>
      )}

      <ul class="space-y-3">
        {items.map((item, idx) => {
          const id = `${idPrefix}-${idx + 1}`;
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
              <section
                id={`${id}-panel`}
                class="hidden px-5 pb-4 text-sm text-bone-2 leading-relaxed"
                aria-labelledby={`${id}-q`}
              >
                {item.a}
              </section>
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

### Step 2.2: Update `src/pages/index.astro` Faq call site

Find the line `<Faq />` and replace it with:

```astro
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
```

Add the import for `getMessages` and locale derivation if not already imported (check the file first — it might not have these since composites resolve their own locale). The home page after this should declare:

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
import { getMessages } from '../i18n/messages';
import { getLocaleFromPath } from '../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout>
  <Hero />
  <AntiPositioningTable />
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

### Step 2.3: Update `src/pages/[lang]/index.astro` Faq call site

Apply the same Faq update + ensure `getMessages` + `getLocaleFromPath` are imported. The full file should look like:

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
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

export function getStaticPaths() {
  return [
    { params: { lang: 'en-US' } },
    { params: { lang: 'pt-BR' } },
  ];
}

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout>
  <Hero />
  <AntiPositioningTable />
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

### Step 2.4: Build + verify home FAQ still renders 6 items × 3 locales

```bash
npm run build
for path in index en-US/index pt-BR/index; do
  printf "%s: faq buttons=" "$path"
  grep -o 'data-faq-toggle' dist/${path}.html | /usr/bin/wc -l
done
```

Expected: 7 per page (6 buttons + 1 in script selector — same as Phase B post-build).

### Step 2.5: Run e2e to confirm home FAQ tests still pass

```bash
npm run test:e2e
```

Expected: 81/81 pass (Phase B's `home narrative: FAQ accordion toggles` test still works because we preserved the `data-faq-toggle="faq-N"` ID format).

### Step 2.6: Commit

```bash
git add src/components/composites/Faq.astro src/pages/index.astro 'src/pages/[lang]/index.astro'
git commit -m "refactor(ui): make Faq composite generic via items + idPrefix props"
```

---

## Task 3: TierCard composite

**Files:** `src/components/composites/TierCard.astro` (new).

This extracts a single tier card from the existing inline pricing markup. The data shape is the existing `TierConfig` but TierCard takes the data as props.

### Step 3.1: Create the file

```astro
---
import Card from '../primitives/Card.astro';
import Button from '../primitives/Button.astro';
import Badge from '../primitives/Badge.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

type TierId = 'tier_0' | 'tier_05' | 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5';
type CtaKind = 'community' | 'developer' | 'buy' | 'sales';
type BadgeKind = 'popular' | 'evaluators' | null;

interface Props {
  tierId: TierId;
  cta: CtaKind;
  badge?: BadgeKind;
}

const { tierId, cta, badge = null } = Astro.props;

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const tierName = t.pricing[`${tierId}_name` as const];
const tierPrice = t.pricing[`${tierId}_price` as const];
const tierTagline = t.pricing[`${tierId}_tagline` as const];
const features = [
  t.pricing[`${tierId}_f1` as const],
  t.pricing[`${tierId}_f2` as const],
  t.pricing[`${tierId}_f3` as const],
  t.pricing[`${tierId}_f4` as const],
];

function ctaHref(kind: CtaKind): string {
  if (kind === 'community') return 'https://github.com/verbara/Verbara.Sdk';
  if (kind === 'developer') return localiseHref('developer-license', locale);
  return 'mailto:licensing@verbara.io';
}

function ctaLabel(kind: CtaKind): string {
  if (kind === 'community') return t.pricing.cta_community;
  if (kind === 'developer') return t.pricing.cta_developer;
  if (kind === 'buy') return t.pricing.cta_buy;
  return t.pricing.cta_sales;
}

const cardVariant = badge === 'popular' ? 'highlighted' : 'default';
const buttonVariant = cta === 'developer' || cta === 'buy' ? 'primary' : 'secondary';
---

<Card as="article" variant={cardVariant} class="flex flex-col" data-tier={tierId}>
  <header class="space-y-2">
    <div class="flex items-center justify-between gap-2 min-h-6">
      <h2 class="text-lg font-semibold">{tierName}</h2>
      {badge === 'popular' && (
        <Badge variant="info">{t.pricing.popular_badge}</Badge>
      )}
      {badge === 'evaluators' && (
        <Badge variant="default">{t.pricing.evaluators_badge}</Badge>
      )}
    </div>
    <p class="text-2xl font-bold">{tierPrice}</p>
    <p class="text-sm text-bone-2 min-h-10">{tierTagline}</p>
  </header>

  <ul class="my-6 flex-1 space-y-2 text-sm">
    {features.map((feat) => (
      <li class="flex items-start gap-2">
        <span aria-hidden="true" class="text-bone-3">·</span>
        <span>{feat}</span>
      </li>
    ))}
  </ul>

  <Button variant={buttonVariant} href={ctaHref(cta)}>
    {ctaLabel(cta)}
  </Button>
</Card>
```

### Step 3.2: Build to verify the component compiles

```bash
npm run build
```

Expected: 18 pages clean. TierCard isn't yet used; this just confirms it compiles.

### Step 3.3: Commit

```bash
git add src/components/composites/TierCard.astro
git commit -m "feat(pricing): add TierCard composite (single tier render with CTA + badge)"
```

---

## Task 4: TierGroup composite

**Files:** `src/components/composites/TierGroup.astro` (new).

A wrapper that renders a group label + 2-3 TierCards.

### Step 4.1: Create the file

```astro
---
import TierCard from './TierCard.astro';

type TierId = 'tier_0' | 'tier_05' | 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5';
type CtaKind = 'community' | 'developer' | 'buy' | 'sales';
type BadgeKind = 'popular' | 'evaluators' | null;

interface TierItem {
  tierId: TierId;
  cta: CtaKind;
  badge?: BadgeKind;
}

interface Props {
  label: string;
  anchorId: string;
  tiers: TierItem[];
}

const { label, anchorId, tiers } = Astro.props;
---

<div id={anchorId} class="space-y-5 scroll-mt-24">
  <h3 class="text-xs font-mono uppercase tracking-wider text-amber">
    {label}
  </h3>

  <div
    class:list={[
      'grid gap-5',
      tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
    ]}
  >
    {tiers.map((tier) => (
      <TierCard
        tierId={tier.tierId}
        cta={tier.cta}
        badge={tier.badge ?? null}
      />
    ))}
  </div>
</div>
```

### Step 4.2: Build

```bash
npm run build
```

### Step 4.3: Commit

```bash
git add src/components/composites/TierGroup.astro
git commit -m "feat(pricing): add TierGroup composite (label + 2-3 TierCards)"
```

---

## Task 5: ComparisonMatrix composite

**Files:** `src/components/composites/ComparisonMatrix.astro` (new).

The 8-column × 10-row feature matrix. Cell values are encoded structurally in code (not i18n) — feature labels are i18n; cell values mostly use universal symbols.

### Step 5.1: Create the file

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

type TierId = 'tier_0' | 'tier_05' | 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

type FeatureKey =
  | 'matrix_feat_oss_source'
  | 'matrix_feat_pro_features'
  | 'matrix_feat_multitenant'
  | 'matrix_feat_clustering'
  | 'matrix_feat_hosted'
  | 'matrix_feat_sla'
  | 'matrix_feat_support'
  | 'matrix_feat_max_agents'
  | 'matrix_feat_audit_retention'
  | 'matrix_feat_whitelabel';

interface Row {
  feature: FeatureKey;
  values: Record<TierId, string>;
}

const rows: Row[] = [
  {
    feature: 'matrix_feat_oss_source',
    values: { tier_0: '✓', tier_05: '✓', tier_1: '✓', tier_2: '✓', tier_3: '✓', tier_4: '✓', tier_5: '✓' },
  },
  {
    feature: 'matrix_feat_pro_features',
    values: { tier_0: '—', tier_05: 'warn', tier_1: 'partial', tier_2: 'full', tier_3: 'full', tier_4: 'full', tier_5: 'full' },
  },
  {
    feature: 'matrix_feat_multitenant',
    values: { tier_0: '—', tier_05: '—', tier_1: '—', tier_2: '✓', tier_3: '✓', tier_4: '✓', tier_5: '✓' },
  },
  {
    feature: 'matrix_feat_clustering',
    values: { tier_0: '—', tier_05: '—', tier_1: '—', tier_2: '✓', tier_3: '✓', tier_4: '✓', tier_5: '✓' },
  },
  {
    feature: 'matrix_feat_hosted',
    values: { tier_0: '—', tier_05: '—', tier_1: '—', tier_2: '—', tier_3: '✓', tier_4: '✓', tier_5: '✓' },
  },
  {
    feature: 'matrix_feat_sla',
    values: { tier_0: '—', tier_05: '—', tier_1: '—', tier_2: '—', tier_3: '99.5%', tier_4: '99.9%', tier_5: 'custom' },
  },
  {
    feature: 'matrix_feat_support',
    values: {
      tier_0: t.pricing.matrix_support_community,
      tier_05: t.pricing.matrix_support_community,
      tier_1: 'email',
      tier_2: 'email + Slack',
      tier_3: 'tier',
      tier_4: '24/7 + CSM',
      tier_5: t.pricing.matrix_support_dedicated,
    },
  },
  {
    feature: 'matrix_feat_max_agents',
    values: { tier_0: '∞', tier_05: '5', tier_1: '25', tier_2: '∞', tier_3: '∞', tier_4: '∞', tier_5: '∞' },
  },
  {
    feature: 'matrix_feat_audit_retention',
    values: { tier_0: 'self', tier_05: 'self', tier_1: '90 d', tier_2: '1 y', tier_3: '1 y', tier_4: '7 y', tier_5: 'custom' },
  },
  {
    feature: 'matrix_feat_whitelabel',
    values: { tier_0: '—', tier_05: '—', tier_1: '—', tier_2: '—', tier_3: '—', tier_4: '—', tier_5: '✓' },
  },
];

const tierIds: TierId[] = ['tier_0', 'tier_05', 'tier_1', 'tier_2', 'tier_3', 'tier_4', 'tier_5'];
---

<Section tone="inset" id="compare">
  <Container size="lg">
    <div class="space-y-10">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="text-xs uppercase tracking-wider font-mono text-signal">
          {t.pricing.matrix_eyebrow}
        </p>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-balance">
          {t.pricing.matrix_h2}
        </h2>
      </div>

      <div class="overflow-x-auto rounded-lg border border-line-strong">
        <table class="w-full text-sm">
          <thead class="bg-ink-3">
            <tr>
              <th class="text-left px-3 py-3 font-mono text-xs uppercase tracking-wider text-bone-3 sticky left-0 bg-ink-3 min-w-[10rem]">
                &nbsp;
              </th>
              {tierIds.map((id) => (
                <th class="text-left px-3 py-3 font-medium text-bone whitespace-nowrap">
                  <div class="flex flex-col gap-0.5">
                    <span class="text-sm">{t.pricing[`${id}_name` as const]}</span>
                    <span class="text-xs font-mono text-amber">{t.pricing[`${id}_price` as const]}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            {rows.map((row) => (
              <tr>
                <th
                  scope="row"
                  class="text-left px-3 py-3 font-medium sticky left-0 bg-ink-3/40 min-w-[10rem]"
                >
                  {t.pricing[row.feature]}
                </th>
                {tierIds.map((id) => (
                  <td class="px-3 py-3 font-mono text-xs text-bone-2 whitespace-nowrap">
                    {row.values[id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Container>
</Section>
```

### Step 5.2: Build

```bash
npm run build
```

### Step 5.3: Commit

```bash
git add src/components/composites/ComparisonMatrix.astro
git commit -m "feat(pricing): add ComparisonMatrix composite (8-col × 10-row feature matrix)"
```

---

## Task 6: Rewrite `src/pages/pricing.astro`

**Files:** `src/pages/pricing.astro` (full rewrite).

### Step 6.1: Read the current file to confirm what we replace

```bash
cat src/pages/pricing.astro
```

The current file (post-Phase A migration + Phase B anchor IDs) has the TIERS array, ctaHref, ctaLabel, and the inline tier-rendering markup. We're replacing the entire file.

### Step 6.2: Replace `src/pages/pricing.astro` with EXACTLY:

```astro
---
import Layout from '../layouts/Layout.astro';
import Section from '../components/primitives/Section.astro';
import Container from '../components/primitives/Container.astro';
import Heading from '../components/primitives/Heading.astro';
import TierGroup from '../components/composites/TierGroup.astro';
import ComparisonMatrix from '../components/composites/ComparisonMatrix.astro';
import Faq from '../components/composites/Faq.astro';
import { getMessages } from '../i18n/messages';
import { getLocaleFromPath } from '../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout title={`${t.pricing.title} — ${t.meta.site_title}`}>
  <Section>
    <Container size="lg">
      <div class="space-y-3 text-center max-w-3xl mx-auto">
        <Heading level={1} align="center">{t.pricing.hero_h1}</Heading>
        <p class="text-lg text-bone-2 text-balance">{t.pricing.hero_sub}</p>
      </div>
    </Container>
  </Section>

  <Section>
    <Container size="lg">
      <div class="space-y-12">
        <TierGroup
          label={t.pricing.group_free_label}
          anchorId="group-free"
          tiers={[
            { tierId: 'tier_0', cta: 'community' },
            { tierId: 'tier_05', cta: 'developer', badge: 'evaluators' },
          ]}
        />
        <TierGroup
          label={t.pricing.group_self_label}
          anchorId="group-self"
          tiers={[
            { tierId: 'tier_1', cta: 'buy' },
            { tierId: 'tier_2', cta: 'buy', badge: 'popular' },
          ]}
        />
        <TierGroup
          label={t.pricing.group_managed_label}
          anchorId="group-managed"
          tiers={[
            { tierId: 'tier_3', cta: 'sales' },
            { tierId: 'tier_4', cta: 'sales' },
            { tierId: 'tier_5', cta: 'sales' },
          ]}
        />
      </div>
    </Container>
  </Section>

  <ComparisonMatrix />

  <Faq
    sectionId="pricing-faq"
    idPrefix="pricing-faq"
    items={[
      { q: t.pricing.faq_q1, a: t.pricing.faq_a1 },
      { q: t.pricing.faq_q2, a: t.pricing.faq_a2 },
      { q: t.pricing.faq_q3, a: t.pricing.faq_a3 },
    ]}
  />
</Layout>
```

### Step 6.3: Build + verify

```bash
npm run build

# Verify pricing renders correctly
echo "Tier articles: $(grep -o 'data-tier=' dist/pricing/index.html | /usr/bin/wc -l)"
echo "Group anchors: $(grep -oE 'id="group-(free|self|managed)"' dist/pricing/index.html | /usr/bin/wc -l)"
echo "Matrix table:  $(grep -c 'matrix_feat\|compare' dist/pricing/index.html)"
echo "FAQ buttons:   $(grep -o 'data-faq-toggle="pricing-faq' dist/pricing/index.html | /usr/bin/wc -l)"
```

Expected:
- Tier articles: 7 (one per tier)
- Group anchors: 3 (free + self + managed)
- Matrix table: ≥ 1 (heading or row references)
- FAQ buttons: 3 (one per pricing-faq question)

### Step 6.4: Commit

```bash
git add src/pages/pricing.astro
git commit -m "refactor(pricing): rewrite es-419 pricing with 3 tier groups + matrix + faq"
```

---

## Task 7: Mirror to `src/pages/[lang]/pricing.astro`

**Files:** `src/pages/[lang]/pricing.astro` (full rewrite).

### Step 7.1: Read the current file

```bash
cat 'src/pages/[lang]/pricing.astro'
```

Note its `getStaticPaths()` and locale derivation pattern. Preserve that.

### Step 7.2: Replace with EXACTLY:

```astro
---
import Layout from '../../layouts/Layout.astro';
import Section from '../../components/primitives/Section.astro';
import Container from '../../components/primitives/Container.astro';
import Heading from '../../components/primitives/Heading.astro';
import TierGroup from '../../components/composites/TierGroup.astro';
import ComparisonMatrix from '../../components/composites/ComparisonMatrix.astro';
import Faq from '../../components/composites/Faq.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

export function getStaticPaths() {
  return [
    { params: { lang: 'en-US' } },
    { params: { lang: 'pt-BR' } },
  ];
}

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout title={`${t.pricing.title} — ${t.meta.site_title}`}>
  <Section>
    <Container size="lg">
      <div class="space-y-3 text-center max-w-3xl mx-auto">
        <Heading level={1} align="center">{t.pricing.hero_h1}</Heading>
        <p class="text-lg text-bone-2 text-balance">{t.pricing.hero_sub}</p>
      </div>
    </Container>
  </Section>

  <Section>
    <Container size="lg">
      <div class="space-y-12">
        <TierGroup
          label={t.pricing.group_free_label}
          anchorId="group-free"
          tiers={[
            { tierId: 'tier_0', cta: 'community' },
            { tierId: 'tier_05', cta: 'developer', badge: 'evaluators' },
          ]}
        />
        <TierGroup
          label={t.pricing.group_self_label}
          anchorId="group-self"
          tiers={[
            { tierId: 'tier_1', cta: 'buy' },
            { tierId: 'tier_2', cta: 'buy', badge: 'popular' },
          ]}
        />
        <TierGroup
          label={t.pricing.group_managed_label}
          anchorId="group-managed"
          tiers={[
            { tierId: 'tier_3', cta: 'sales' },
            { tierId: 'tier_4', cta: 'sales' },
            { tierId: 'tier_5', cta: 'sales' },
          ]}
        />
      </div>
    </Container>
  </Section>

  <ComparisonMatrix />

  <Faq
    sectionId="pricing-faq"
    idPrefix="pricing-faq"
    items={[
      { q: t.pricing.faq_q1, a: t.pricing.faq_a1 },
      { q: t.pricing.faq_q2, a: t.pricing.faq_a2 },
      { q: t.pricing.faq_q3, a: t.pricing.faq_a3 },
    ]}
  />
</Layout>
```

### Step 7.3: Build + cross-locale verification

```bash
npm run build
for path in 'pricing/index' 'en-US/pricing/index' 'pt-BR/pricing/index'; do
  printf "%s: tiers=" "$path"
  grep -o 'data-tier=' "dist/${path}.html" | /usr/bin/wc -l
  printf "%s: group anchors=" "$path"
  grep -oE 'id="group-(free|self|managed)"' "dist/${path}.html" | /usr/bin/wc -l
  printf "%s: faq buttons=" "$path"
  grep -o 'data-faq-toggle="pricing-faq' "dist/${path}.html" | /usr/bin/wc -l
done
```

Expected: 7 tiers, 3 anchors, 3 faq buttons per locale (× 3 locales).

### Step 7.4: Commit

```bash
git add 'src/pages/[lang]/pricing.astro'
git commit -m "refactor(pricing): mirror redesigned pricing to en-US + pt-BR locale routes"
```

---

## Task 8: Playwright tests for pricing structure

**Files:** `tests/e2e/pricing-narrative.spec.ts` (new).

### Step 8.1: Create the file

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/pricing/`;

  test(`pricing narrative: 7 tiers + 3 group anchors + matrix + 3 faq at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // 7 tier articles
    const tierArticles = await page.locator('article[data-tier]').count();
    expect(tierArticles).toBe(7);

    // 3 group anchors
    await expect(page.locator('#group-free')).toBeAttached();
    await expect(page.locator('#group-self')).toBeAttached();
    await expect(page.locator('#group-managed')).toBeAttached();

    // Comparison matrix table — 7 column headers in matrix thead (one per tier)
    const matrixHeaderTier = page.locator('section#compare thead th').filter({ hasText: /Tier|Community|Pro|Self|Business|Enterprise|White-?label/i });
    const matrixHeaderCount = await matrixHeaderTier.count();
    expect(matrixHeaderCount).toBeGreaterThanOrEqual(7);

    // Pricing FAQ — exactly 3 toggles
    const pricingFaqButtons = await page.locator('[data-faq-toggle^="pricing-faq"]').count();
    expect(pricingFaqButtons).toBe(3);
  });

  test(`pricing FAQ accordion toggles at ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const firstToggle = page.locator('[data-faq-toggle="pricing-faq-1"]');
    const firstPanel = page.locator('#pricing-faq-1-panel');

    await expect(firstPanel).toBeHidden();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');

    await firstToggle.click();

    await expect(firstPanel).toBeVisible();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
  });

  test(`home pricing teaser deep-links resolve on pricing at ${url}`, async ({ page }) => {
    // Visit pricing with a hash and verify the anchor exists
    await page.goto(`${prefix}/pricing/#group-self`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#group-self')).toBeAttached();
  });
}
```

### Step 8.2: Run all e2e tests

```bash
npm run build
npm run test:e2e
```

Expected count:
- Phase B baseline: 81 cases
- Phase C adds: 3 prefixes × 3 tests = 9 unique × 3 browsers = **27 new cases**
- TOTAL: 81 + 27 = **108 cases**, all green.

If a test fails:
- DO NOT loosen assertions to make tests pass
- Verify selectors against the rendered HTML
- Report DONE_WITH_CONCERNS if a real bug surfaces

### Step 8.3: Commit

```bash
git add tests/e2e/pricing-narrative.spec.ts
git commit -m "test(e2e): add pricing narrative + FAQ accordion + deep-link tests"
```

---

## Task 9: Lighthouse audit + targeted fixes

**Files:** depends on what surfaces.

### Step 9.1: Run Lighthouse against the rebuilt pricing

```bash
npm run build
npx lhci autorun --collect.staticDistDir=./dist
```

Expected: assertions report results for 6 URLs (home + en-US/home + pt-BR/home + pricing + en-US/pricing + developer-license). Thresholds:
- Performance ≥ 0.9
- Accessibility ≥ 0.95
- Best Practices ≥ 0.95
- SEO = 1.0

### Step 9.2: For each failing assertion, make minimal targeted fixes

**Important rules:**
- DO NOT lower the thresholds in `lighthouserc.json`
- DO NOT modify primitives (`src/components/primitives/*`)
- DO NOT modify the design tokens (`src/styles/global.css`)
- Allowed targets: TierCard, TierGroup, ComparisonMatrix, pricing.astro, [lang]/pricing.astro

**Likely categories:**
- **Color contrast** on matrix cells — `text-bone-2` on `bg-ink-3/40` should pass; if not, bump to `text-bone`.
- **Heading order** — TierCard uses `h2` for the tier name (within an `article`); the overall page H1 is the pricing hero. Should be correct (h1 → h2 within articles).
- **Long titles** — pricing title is `${t.pricing.title} — ${t.meta.site_title}` which may exceed 70 chars in some locales; this is an existing warning category, expected.
- **Sticky table column on mobile** — verify the matrix horizontal scroll works.

### Step 9.3: Run full test:all

```bash
npm run test:all
```

Expected: every gate passes.

### Step 9.4: Commit any remediation changes

```bash
git add -A
git status
git commit -m "fix(a11y): satisfy lighthouse thresholds on redesigned pricing"
```

If no fixes were needed, skip.

---

## Task 10: Phase C close

**Files:** `docs/plans/active/2026-05-09-website-redesign-phase-c-pricing.md` → `docs/plans/completed/`.

### Step 10.1: Confirm clean shell + tests pass

```bash
git status
npm run test:all
```

Expected: working tree clean, all gates green: check / lint / test:i18n (~234 keys × 3) / build / validate:html / test:e2e (108 cases) / test:lhci (6 URLs).

### Step 10.2: Inspect bundle baseline

```bash
npm run build
du -sh dist/
ls -lh dist/_astro/*.css 2>/dev/null | head -5
```

Phase B baseline ~660 KB. Phase C adds: pricing copy (~30 KB) + comparison matrix (~5 KB) + new composites (~3 KB compiled). Expected: ≤ ~720 KB total.

### Step 10.3: Move plan from `active/` to `completed/`

```bash
git mv docs/plans/active/2026-05-09-website-redesign-phase-c-pricing.md docs/plans/completed/
git status
git commit -m "docs(plans): mark phase-c-pricing complete"
```

### Step 10.4: STOP

Do NOT push, merge, or open a PR. Report final state to the controller; the controller decides merge strategy (mirroring Phases A and B).

---

## Spec coverage check

Each spec §7.2 subsection mapped to a task:

| Spec § | Section | Task |
|---|---|---|
| §7.2 Hero | Pricing hero with H1 + sub | Task 1 (copy) + Task 6/7 (wiring) |
| §7.2 Group 1 | Free · Tier 0 + 0.5 | Task 3 (TierCard) + Task 4 (TierGroup) + Task 6/7 |
| §7.2 Group 2 | Self-host · Tier 1 + 2 | Task 3 + Task 4 + Task 6/7 |
| §7.2 Group 3 | Managed SaaS · Tier 3 + 4 + 5 | Task 3 + Task 4 + Task 6/7 |
| §7.2 Comparison matrix | 8-col × 10-row | Task 5 (composite) + Task 1 (i18n) |
| §7.2 Pricing FAQ | 3 questions | Task 1 (i18n) + Task 2 (Faq refactor) + Task 6/7 (wiring) |
| §7.2 Anchors | `#group-free|self|managed` | Task 4 (TierGroup emits anchor) — replaces Phase B's stopgap conditional `id` in pricing |
| §9.2 e2e tests | Playwright coverage | Task 8 |
| §9.3 Lighthouse | Thresholds passing | Task 9 |

**Out of Phase C by design** (deferred to D + E):
- Developer-license form polish + Legal pages (Phase D)
- 60-day vs 30-day cross-Phase fix in `developer_license.*` keys (Phase D)
- Logos, favicons, OG images, sitemap (Phase E)

---

## Plan complete

Plan saved to `docs/plans/active/2026-05-09-website-redesign-phase-c-pricing.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks. Validated pattern from Phases A and B.
2. **Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

**Which approach?**
