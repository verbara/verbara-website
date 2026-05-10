# Website Redesign — Phase D: Developer-license + Legal pages + cross-Phase cleanup

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the design system to the developer-license form (single-column layout per spec §7.3) and Legal pages (LegalDoc layout per spec §7.4), plus close the cross-Phase follow-ups flagged by Phase B and Phase C reviewers (60-day vs 30-day mismatch, pricing-types duplication, Card primitive id forwarding, 'unlock' buzzword).

**Architecture:** One new composite (`LegalDoc.astro`) + one new shared TypeScript module (`pricing-types.ts`) + targeted edits to existing files. The dev-license form's JavaScript and Worker logic are untouched — only the visual layout (move "what you get" panel above form, single column, max-w-2xl). Legal pages get a typographic upgrade with `LegalDoc` wrapper + `.legal-doc` global CSS for cascading prose styles. Cross-Phase fixes are 4 small commits each addressing one tracked item.

**Tech Stack:** Astro 6.3, Tailwind v4 Signal tokens, Phase A primitives (Section, Container, Heading, Button, Badge, Card), Phase B Faq composite. No new dependencies.

**Spec:** `docs/specs/2026-05-09-website-redesign.md` §7.3 (Developer-license form) and §7.4 (Legal pages).

**Phase C baseline:** branch `redesign/phase-d-dev-legal` started from `main` at commit `58e4b9a Merge pull request #5 from verbara/redesign/phase-c-pricing`. Worktree at `.worktrees/redesign-phase-d`. Tests green: 108/108 e2e, Lighthouse 6/6 thresholds passing.

**What Phase D explicitly does NOT do:**
- Touch home page (Phase B is shipped) or pricing page (Phase C is shipped) beyond the i18n cleanup.
- Author actual legal copy — placeholder content stays; LegalDoc is the layout chassis for whenever real legal text arrives.
- Generate logo SVGs, favicons, OG images, sitemap (Phase E).
- Add a sticky table-of-contents to legal pages (deferred — auto-generation requires markdown-frontmatter parsing infrastructure not in place).
- Modify the developer-license Worker, Turnstile validation, ECDSA signing, D1 audit log, or Resend email — all server-side logic stays as-is.

End state: `verbara.io/developer-license/` renders single-column with "what you get" above the form; the 3 legal pages render with LegalDoc layout; pricing types live in a shared module; Card primitive accepts `id`; 30-day and "unlock"-as-verb usages are normalized.

---

## File Structure

### Created

```
src/components/composites/
  LegalDoc.astro                — title + last-updated metadata + slot for legal copy
  pricing-types.ts              — shared TierId / CtaKind / BadgeKind types
tests/e2e/
  legal-narrative.spec.ts       — h1 visible + reading-width container + legal sections in 3 locales
  dev-license-narrative.spec.ts — what-you-get above form + form fields present + Turnstile widget
```

### Modified

```
src/i18n/messages.ts                                  — 30-day → 60-day in 9 strings; 'unlock' verb → 'activates'/'enables' in 3 strings
src/components/primitives/Card.astro                  — add `id?: string` prop
src/components/composites/TierCard.astro              — import types from pricing-types.ts
src/components/composites/TierGroup.astro             — import types from pricing-types.ts
src/components/composites/ComparisonMatrix.astro      — import TierId from pricing-types.ts
src/components/DeveloperLicenseForm.astro             — single-column layout + what-you-get above form + Turnstile data-theme="dark"
src/pages/developer-license.astro                     — Container size adjust + insert what-you-get section block
src/pages/[lang]/developer-license.astro              — same
src/pages/legal/eula.astro                            — wrap in LegalDoc
src/pages/legal/privacy.astro                         — wrap in LegalDoc
src/pages/legal/terms.astro                           — wrap in LegalDoc
src/pages/[lang]/legal/eula.astro                     — wrap in LegalDoc
src/pages/[lang]/legal/privacy.astro                  — wrap in LegalDoc
src/pages/[lang]/legal/terms.astro                    — wrap in LegalDoc
src/styles/global.css                                 — add `.legal-doc` cascading prose styles
```

### Deleted

None.

---

## Conventions

- **Cross-Phase fixes ship FIRST** (Tasks 1–4) so all subsequent work builds on the cleaned foundation.
- **Form/legal visual work is non-functional.** No JS, no Worker, no API change. Verify by running e2e + form smoke after every visual edit.
- **i18n parity gate:** `npm run test:i18n` after every `messages.ts` edit.
- **Commit cadence:** commit at every coherent task or sub-task. Conventional Commits (`fix:`, `refactor:`, `feat:`, `i18n:`, `test:`, `docs:`). No `Co-Authored-By`.

---

## Task 0: Verify clean starting state

**Files:** none (verification only).

- [ ] **Step 0.1: Confirm branch + working tree**

```bash
git status
git log --oneline -3
```

Expected: on branch `redesign/phase-d-dev-legal`, working tree clean, HEAD at `58e4b9a Merge pull request #5`.

- [ ] **Step 0.2: Confirm baseline tests pass**

```bash
npm run test:all
```

Expected: all gates green (108 e2e, lhci 6/6, etc).

If any gate fails, STOP and report BLOCKED.

---

## Task 1: 60-day i18n normalization (cross-Phase fix)

**Files:** `src/i18n/messages.ts`.

Phase B + C copy uses 60-day per spec; Phase A's `developer_license` and `pricing.tier_05` keys still say 30-day. This task normalizes all references.

### Step 1.1: Read the affected lines

```bash
grep -n "30-day\|30 d\|30 días\|30 dias\|30-day rolling\|30-day license" src/i18n/messages.ts
```

Expected matches:
- es-419 `pricing.tier_05_f3`: `'30 días renovables gratis'`
- es-419 `developer_license.subtitle`: contains `'cada 30 días'`
- es-419 `developer_license.what_you_get_duration`: `'Licencia de 30 días, renovación gratuita'`
- en-US `pricing.tier_05_f3`: `'30-day rolling, free renewal'`
- en-US `developer_license.subtitle`: contains `'30-day rolling renewal'`
- en-US `developer_license.what_you_get_duration`: `'30-day license, free renewal'`
- pt-BR `pricing.tier_05_f3`: `'30 dias renováveis grátis'`
- pt-BR `developer_license.subtitle`: contains `'a cada 30 dias'`
- pt-BR `developer_license.what_you_get_duration`: `'Licença de 30 dias, renovação gratuita'`

### Step 1.2: Apply the substitutions

Use `Edit` tool (not sed) — the strings are explicit; no risk of false positives.

**es-419:**
- `'30 días renovables gratis'` → `'60 días renovables gratis'`
- In subtitle: `'Renovación gratuita cada 30 días.'` → `'Renovación gratuita cada 60 días.'`
- `'Licencia de 30 días, renovación gratuita'` → `'Licencia de 60 días, renovación gratuita'`

**en-US:**
- `'30-day rolling, free renewal'` → `'60-day rolling, free renewal'`
- In subtitle: `'30-day rolling renewal.'` → `'60-day rolling renewal.'`
- `'30-day license, free renewal'` → `'60-day license, free renewal'`

**pt-BR:**
- `'30 dias renováveis grátis'` → `'60 dias renováveis grátis'`
- In subtitle: `'Renovação gratuita a cada 30 dias.'` → `'Renovação gratuita a cada 60 dias.'`
- `'Licença de 30 dias, renovação gratuita'` → `'Licença de 60 dias, renovação gratuita'`

### Step 1.3: Verify no remaining 30-day usages

```bash
grep -n "30-day\|30 d\|30 días\|30 dias" src/i18n/messages.ts
```

Expected: zero matches. (If a match remains, find and fix.)

### Step 1.4: Run i18n parity + check + build

```bash
npm run test:i18n
npm run check
npm run build
```

Expected: parity OK (key count unchanged at 232 × 3); astro check clean; build clean.

### Step 1.5: Commit

```bash
git add src/i18n/messages.ts
git commit -m "i18n(developer_license,pricing): normalize 30-day → 60-day duration across 3 locales"
```

---

## Task 2: Pricing types shared module

**Files:** `src/components/composites/pricing-types.ts` (new), `src/components/composites/TierCard.astro`, `src/components/composites/TierGroup.astro`, `src/components/composites/ComparisonMatrix.astro`.

### Step 2.1: Create `src/components/composites/pricing-types.ts`

```typescript
// Shared types for the pricing composites (TierCard, TierGroup, ComparisonMatrix).
// Centralized so adding a new tier requires one edit, not three.

export type TierId =
  | 'tier_0'
  | 'tier_05'
  | 'tier_1'
  | 'tier_2'
  | 'tier_3'
  | 'tier_4'
  | 'tier_5';

export type CtaKind = 'community' | 'developer' | 'buy' | 'sales';

export type BadgeKind = 'popular' | 'evaluators' | null;
```

### Step 2.2: Update `src/components/composites/TierCard.astro`

Read the current frontmatter:
```bash
head -15 src/components/composites/TierCard.astro
```

Find the local type declarations (TierId, CtaKind, BadgeKind near the top). Replace them with an import:

```astro
---
import Card from '../primitives/Card.astro';
import Button from '../primitives/Button.astro';
import Badge from '../primitives/Badge.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';
import type { TierId, CtaKind, BadgeKind } from './pricing-types';

interface Props {
  tierId: TierId;
  cta: CtaKind;
  badge?: BadgeKind;
}
---
```

The rest of the file stays identical. Specifically: `const { tierId, cta, badge = null } = Astro.props;` and everything below.

### Step 2.3: Update `src/components/composites/TierGroup.astro`

Replace the local type declarations with an import:

```astro
---
import TierCard from './TierCard.astro';
import type { TierId, CtaKind, BadgeKind } from './pricing-types';

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
---
```

The rest of the file (markup) stays identical.

### Step 2.4: Update `src/components/composites/ComparisonMatrix.astro`

Replace the local TierId declaration with an import:

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';
import type { TierId } from './pricing-types';

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
---
```

(Drop the local `type TierId = ...;` declaration. Keep `FeatureKey` local — it's matrix-specific.)

The rest of the file (the `rows`, `tierIds`, and markup) stays identical.

### Step 2.5: Verify type-check + build

```bash
npm run check
npm run build
```

Expected: clean.

### Step 2.6: Commit

```bash
git add src/components/composites/pricing-types.ts src/components/composites/TierCard.astro src/components/composites/TierGroup.astro src/components/composites/ComparisonMatrix.astro
git commit -m "refactor(pricing): extract TierId/CtaKind/BadgeKind to shared module"
```

---

## Task 3: Card primitive `id` prop

**Files:** `src/components/primitives/Card.astro`.

The Card primitive doesn't forward arbitrary attributes; Phase C's `data-tier={tierId}` was silently dropped. This task adds `id?: string` as an explicit prop so future uses (deep-link anchors per card, e2e selector targets) work cleanly. Additive, non-breaking.

### Step 3.1: Read the current Card primitive

```bash
cat src/components/primitives/Card.astro
```

### Step 3.2: Replace with EXACTLY:

```astro
---
interface Props {
  variant?: 'default' | 'highlighted';
  class?: string;
  as?: 'article' | 'div' | 'section';
  id?: string;
}
const { variant = 'default', class: extra = '', as: Tag = 'div', id } = Astro.props;

const variants: Record<NonNullable<Props['variant']>, string> = {
  default: 'border border-line-strong bg-ink-3/40',
  highlighted: 'border border-signal bg-signal/5 ring-1 ring-signal/30',
};

const cls = [
  'rounded-lg p-6',
  variants[variant],
  extra,
].filter(Boolean).join(' ');
---

<Tag id={id} class={cls}><slot /></Tag>
```

When `id` is undefined, Astro omits the `id=""` attribute entirely (verified Phase A pattern).

### Step 3.3: Verify check + build + e2e (existing tests must still pass)

```bash
npm run check
npm run build
npm run test:e2e
```

Expected: 108/108 pass. The existing Card consumers (Hero badge area, AntiPositioningTable cells, PricingTeaser cards, TierCard) don't pass `id` and continue to render identically.

### Step 3.4: Commit

```bash
git add src/components/primitives/Card.astro
git commit -m "feat(ui): add id?: string prop to Card primitive (additive, non-breaking)"
```

---

## Task 4: 'unlock' buzzword polish (cross-Phase fix)

**Files:** `src/i18n/messages.ts`.

Spec §8 banned 'unlock' as a verb. Phase B and Phase C used it in 2 keys (`home.faq_a6`, `pricing.faq_a1`). Replace with 'activate' / 'enable' / locale equivalents.

### Step 4.1: Find current usages

```bash
grep -n "unlock\|desbloquea\|desbloqueia" src/i18n/messages.ts
```

You should find these in `home.faq_a6` and `pricing.faq_a1` (and possibly `tier_05_f1` "unlocked" — leave the past-participle form alone, only verb form is banned per spec).

### Step 4.2: Apply the substitutions

**en-US:**
- In `home.faq_a6`: `'It unlocks every Pro feature in WarnOnly mode for 60 days'` → `'It activates every Pro feature in WarnOnly mode for 60 days'`
- In `pricing.faq_a1`: `'an upgrade unlocks additional Pro features'` → `'an upgrade enables additional Pro features'`

**es-419:**
- In `home.faq_a6`: `'Desbloquea cada feature Pro'` → `'Activa cada feature Pro'`
- In `pricing.faq_a1`: `'el upgrade desbloquea features Pro adicionales'` → `'el upgrade activa features Pro adicionales'`

**pt-BR:**
- In `home.faq_a6`: `'Desbloqueia cada feature Pro'` → `'Ativa cada feature Pro'`
- In `pricing.faq_a1`: `'o upgrade desbloqueia features Pro adicionais'` → `'o upgrade ativa features Pro adicionais'`

Leave `tier_05_f1` (`'All Pro features unlocked'` / `'Todas las funciones Pro desbloqueadas'` / `'Todas as funcionalidades Pro desbloqueadas'`) — past-participle adjective is fine per spec.

### Step 4.3: Verify only the targeted strings changed

```bash
grep -n "unlock\|desbloquea\|desbloqueia" src/i18n/messages.ts
```

Expected: only the past-participle forms in `tier_05_f1` (3 matches).

### Step 4.4: Run i18n parity + check + build

```bash
npm run test:i18n
npm run check
npm run build
```

Expected: parity OK (key count unchanged); astro check clean.

### Step 4.5: Commit

```bash
git add src/i18n/messages.ts
git commit -m "i18n: replace 'unlock' verb with 'activate'/'enable' per spec §8 buzzword list"
```

---

## Task 5: LegalDoc composite + global `.legal-doc` styles

**Files:** `src/components/composites/LegalDoc.astro` (new), `src/styles/global.css` (modify).

### Step 5.1: Add `.legal-doc` cascading prose styles to `src/styles/global.css`

Read the current file:
```bash
cat src/styles/global.css
```

Find the end of the file (after the last `::selection` block or similar). Append:

```css
/* ===== Legal document prose ===== */
/* Cascading typography for the LegalDoc composite slot content. */
.legal-doc h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-bone);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}
.legal-doc h3 {
  font-size: var(--text-xl);
  font-weight: 500;
  color: var(--color-bone);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.legal-doc p {
  line-height: 1.7;
  margin-bottom: 1rem;
}
.legal-doc ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.legal-doc ul li {
  margin-bottom: 0.25rem;
}
.legal-doc ol {
  list-style: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.legal-doc ol li {
  margin-bottom: 0.25rem;
}
.legal-doc a {
  color: var(--color-signal);
  text-decoration: underline;
  text-decoration-color: rgba(64, 217, 255, 0.4);
  text-underline-offset: 2px;
}
.legal-doc a:hover {
  color: var(--color-signal);
  text-decoration-color: var(--color-signal);
}
.legal-doc strong {
  color: var(--color-bone);
  font-weight: 600;
}
.legal-doc code {
  background: var(--color-ink-2);
  border: 1px solid var(--color-line);
  border-radius: 4px;
  padding: 0 0.3em;
  font-size: 0.9em;
}
```

### Step 5.2: Create `src/components/composites/LegalDoc.astro`

```astro
---
import Section from '../primitives/Section.astro';
import Container from '../primitives/Container.astro';

interface Props {
  title: string;
  lastUpdated: string;
  version?: string;
}

const { title, lastUpdated, version } = Astro.props;
---

<Section>
  <Container size="sm">
    <article class="space-y-8">
      <header class="space-y-3 border-b border-line-strong pb-6">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-balance text-bone">
          {title}
        </h1>
        <p class="text-xs font-mono text-bone-3">
          {lastUpdated}{version ? ` · ${version}` : ''}
        </p>
      </header>

      <div class="legal-doc text-bone-2">
        <slot />
      </div>
    </article>
  </Container>
</Section>
```

### Step 5.3: Build to verify

```bash
npm run build
```

Expected: 18 pages clean.

### Step 5.4: Commit

```bash
git add src/components/composites/LegalDoc.astro src/styles/global.css
git commit -m "feat(legal): add LegalDoc composite + .legal-doc prose styles"
```

---

## Task 6: Apply LegalDoc to EULA pages

**Files:** `src/pages/legal/eula.astro`, `src/pages/[lang]/legal/eula.astro`.

### Step 6.1: Read the current `src/pages/legal/eula.astro`

```bash
cat src/pages/legal/eula.astro
```

Note the Phase A migration: it likely wraps placeholder content in `<Section><Container size="sm">` already. We're replacing that with `<LegalDoc title=... lastUpdated=...>`.

### Step 6.2: Replace `src/pages/legal/eula.astro` with EXACTLY:

```astro
---
import Layout from '../../layouts/Layout.astro';
import LegalDoc from '../../components/composites/LegalDoc.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout title={`${t.footer.legal_eula} — ${t.meta.site_title}`}>
  <LegalDoc title={t.footer.legal_eula} lastUpdated="2026-05-09">
    <p>
      <strong>Verbara EULA — placeholder.</strong>
      The end-user license agreement for the commercial Verbara.Sdk.Pro modules
      and the SaaS-hosted product tiers will be published here. The open-source
      components (Verbara.Sdk under MIT and Verbara.Platform under Apache 2.0)
      are governed by their respective repository LICENSE files, not this EULA.
    </p>
    <p>
      Until the formal text lands, contact <a href="mailto:licensing@verbara.io">licensing@verbara.io</a>
      for license inquiries.
    </p>

    <h2>1. Scope</h2>
    <p>
      [Placeholder — covers Tier 0.5 evaluator licenses, Tier 1–2 self-host
      commercial licenses, and Tier 3–5 managed SaaS subscriptions.]
    </p>

    <h2>2. Permitted use</h2>
    <p>
      [Placeholder — Pro features may be activated under a valid license; the
      OSS engine continues to operate without restriction regardless of license
      status.]
    </p>

    <h2>3. Termination</h2>
    <p>
      [Placeholder — termination of a Pro license disables Pro feature
      activation but does not affect the running OSS engine, your data, or
      audit logs.]
    </p>
  </LegalDoc>
</Layout>
```

### Step 6.3: Replace `src/pages/[lang]/legal/eula.astro` with EXACTLY:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import LegalDoc from '../../../components/composites/LegalDoc.astro';
import { getMessages } from '../../../i18n/messages';
import { getLocaleFromPath } from '../../../i18n/utils';

export function getStaticPaths() {
  return [
    { params: { lang: 'en-US' } },
    { params: { lang: 'pt-BR' } },
  ];
}

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const placeholderEn = {
  intro: '<strong>Verbara EULA — placeholder.</strong> The end-user license agreement for the commercial Verbara.Sdk.Pro modules and the SaaS-hosted product tiers will be published here. The open-source components (Verbara.Sdk under MIT and Verbara.Platform under Apache 2.0) are governed by their respective repository LICENSE files, not this EULA.',
  contact: 'Until the formal text lands, contact <a href="mailto:licensing@verbara.io">licensing@verbara.io</a> for license inquiries.',
  s1_title: '1. Scope',
  s1_body: '[Placeholder — covers Tier 0.5 evaluator licenses, Tier 1–2 self-host commercial licenses, and Tier 3–5 managed SaaS subscriptions.]',
  s2_title: '2. Permitted use',
  s2_body: '[Placeholder — Pro features may be activated under a valid license; the OSS engine continues to operate without restriction regardless of license status.]',
  s3_title: '3. Termination',
  s3_body: '[Placeholder — termination of a Pro license disables Pro feature activation but does not affect the running OSS engine, your data, or audit logs.]',
};

const placeholderPt = {
  intro: '<strong>EULA da Verbara — placeholder.</strong> O contrato de licença de usuário final para os módulos comerciais Verbara.Sdk.Pro e para os tiers SaaS hospedados será publicado aqui. Os componentes open-source (Verbara.Sdk sob MIT e Verbara.Platform sob Apache 2.0) são regidos pelos respectivos arquivos LICENSE de cada repositório, não por este EULA.',
  contact: 'Até o texto formal sair, entre em contato com <a href="mailto:licensing@verbara.io">licensing@verbara.io</a> para consultas de licenciamento.',
  s1_title: '1. Escopo',
  s1_body: '[Placeholder — cobre licenças avaliadoras Tier 0.5, licenças self-host comerciais Tier 1–2 e assinaturas SaaS gerenciadas Tier 3–5.]',
  s2_title: '2. Uso permitido',
  s2_body: '[Placeholder — features Pro podem ser ativadas com uma licença válida; o motor OSS continua operando sem restrição independentemente do status da licença.]',
  s3_title: '3. Encerramento',
  s3_body: '[Placeholder — o encerramento de uma licença Pro desativa as features Pro mas não afeta o motor OSS em execução, seus dados ou audit logs.]',
};

const copy = locale === 'en-US' ? placeholderEn : placeholderPt;
---

<Layout title={`${t.footer.legal_eula} — ${t.meta.site_title}`}>
  <LegalDoc title={t.footer.legal_eula} lastUpdated="2026-05-09">
    <p set:html={copy.intro} />
    <p set:html={copy.contact} />

    <h2>{copy.s1_title}</h2>
    <p>{copy.s1_body}</p>

    <h2>{copy.s2_title}</h2>
    <p>{copy.s2_body}</p>

    <h2>{copy.s3_title}</h2>
    <p>{copy.s3_body}</p>
  </LegalDoc>
</Layout>
```

(Note: `set:html` is used only on the intro + contact paragraphs because they contain inline `<strong>` and `<a>` tags. The other sections are plain text.)

### Step 6.4: Build + verify

```bash
npm run build

for path in 'legal/eula' 'en-US/legal/eula' 'pt-BR/legal/eula'; do
  printf "%s: " "$path"
  if [ -f "dist/${path}/index.html" ]; then
    printf "h1=%d  h2=%d  legal-doc=%d\n" \
      $(grep -o '<h1' "dist/${path}/index.html" | /usr/bin/wc -l) \
      $(grep -o '<h2' "dist/${path}/index.html" | /usr/bin/wc -l) \
      $(grep -o 'class="legal-doc' "dist/${path}/index.html" | /usr/bin/wc -l)
  else
    echo "MISSING"
  fi
done
```

Expected per locale:
- h1: 1 (LegalDoc title)
- h2: 3 (Scope / Permitted use / Termination)
- legal-doc: 1 (the wrapping div)

### Step 6.5: Commit

```bash
git add src/pages/legal/eula.astro 'src/pages/[lang]/legal/eula.astro'
git commit -m "feat(legal): apply LegalDoc layout to EULA pages with placeholder copy"
```

---

## Task 7: Apply LegalDoc to Privacy pages

**Files:** `src/pages/legal/privacy.astro`, `src/pages/[lang]/legal/privacy.astro`.

### Step 7.1: Read the current files

```bash
cat src/pages/legal/privacy.astro
cat 'src/pages/[lang]/legal/privacy.astro'
```

### Step 7.2: Replace `src/pages/legal/privacy.astro` with EXACTLY:

```astro
---
import Layout from '../../layouts/Layout.astro';
import LegalDoc from '../../components/composites/LegalDoc.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout title={`${t.footer.legal_privacy} — ${t.meta.site_title}`}>
  <LegalDoc title={t.footer.legal_privacy} lastUpdated="2026-05-09">
    <p>
      <strong>Política de privacidad — borrador.</strong>
      Esta página describirá cómo Verbara recopila, usa y conserva los datos
      generados a través del sitio <a href="https://verbara.io">verbara.io</a>
      (incluyendo el formulario de licencia de developer y las analíticas
      web). Los datos del producto auto-hospedado no aplican aquí; consulta
      la documentación de cada deployment para esa política específica.
    </p>
    <p>
      Mientras finaliza el texto formal, escribe a
      <a href="mailto:security@verbara.io">security@verbara.io</a>
      para preguntas sobre privacidad o solicitudes de borrado.
    </p>

    <h2>1. Datos recopilados en verbara.io</h2>
    <ul>
      <li>Email + nombre + organización + caso de uso vía el formulario de licencia developer.</li>
      <li>Métricas anónimas vía Cloudflare Web Analytics (sin cookies, sin fingerprinting).</li>
      <li>Logs de IP del Worker emisor de licencias (rate-limit, audit log en D1).</li>
    </ul>

    <h2>2. Retención</h2>
    <p>
      [Placeholder — emails de licencia se retienen mientras la cuenta esté activa
      o conforme a la ley aplicable, lo que sea más corto.]
    </p>

    <h2>3. Tus derechos</h2>
    <p>
      [Placeholder — derecho de acceso, rectificación, borrado y portabilidad
      bajo GDPR / LGPD aplican; envía solicitud a security@verbara.io.]
    </p>
  </LegalDoc>
</Layout>
```

### Step 7.3: Replace `src/pages/[lang]/legal/privacy.astro` with EXACTLY:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import LegalDoc from '../../../components/composites/LegalDoc.astro';
import { getMessages } from '../../../i18n/messages';
import { getLocaleFromPath } from '../../../i18n/utils';

export function getStaticPaths() {
  return [
    { params: { lang: 'en-US' } },
    { params: { lang: 'pt-BR' } },
  ];
}

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const placeholderEn = {
  intro: '<strong>Privacy policy — draft.</strong> This page will describe how Verbara collects, uses, and retains data generated through the <a href="https://verbara.io">verbara.io</a> site (including the developer-license form and web analytics). Data on self-hosted product deployments is out of scope; consult each deployment\'s documentation for its specific policy.',
  contact: 'While the formal text is in review, contact <a href="mailto:security@verbara.io">security@verbara.io</a> for privacy questions or deletion requests.',
  s1_title: '1. Data collected on verbara.io',
  s1_items: [
    'Email + name + organization + use case via the developer-license form.',
    'Anonymous metrics via Cloudflare Web Analytics (no cookies, no fingerprinting).',
    'IP logs from the license-issuer Worker (rate-limit + D1 audit log).',
  ],
  s2_title: '2. Retention',
  s2_body: '[Placeholder — license emails retained for as long as the account is active or as required by applicable law, whichever is shorter.]',
  s3_title: '3. Your rights',
  s3_body: '[Placeholder — right of access, rectification, deletion, and portability under GDPR / LGPD apply; submit requests to security@verbara.io.]',
};

const placeholderPt = {
  intro: '<strong>Política de privacidade — rascunho.</strong> Esta página descreverá como a Verbara coleta, usa e retém os dados gerados através do site <a href="https://verbara.io">verbara.io</a> (incluindo o formulário de licença de developer e analytics web). Dados sobre deployments do produto self-hosted estão fora do escopo; consulte a documentação de cada deployment para sua política específica.',
  contact: 'Enquanto o texto formal está em revisão, entre em contato com <a href="mailto:security@verbara.io">security@verbara.io</a> para perguntas de privacidade ou solicitações de exclusão.',
  s1_title: '1. Dados coletados em verbara.io',
  s1_items: [
    'Email + nome + organização + caso de uso via formulário de licença developer.',
    'Métricas anônimas via Cloudflare Web Analytics (sem cookies, sem fingerprinting).',
    'Logs de IP do Worker emissor de licenças (rate-limit + audit log em D1).',
  ],
  s2_title: '2. Retenção',
  s2_body: '[Placeholder — e-mails de licença são retidos enquanto a conta estiver ativa ou conforme a lei aplicável, o que for mais curto.]',
  s3_title: '3. Seus direitos',
  s3_body: '[Placeholder — direito de acesso, retificação, exclusão e portabilidade sob GDPR / LGPD aplicam-se; envie solicitações para security@verbara.io.]',
};

const copy = locale === 'en-US' ? placeholderEn : placeholderPt;
---

<Layout title={`${t.footer.legal_privacy} — ${t.meta.site_title}`}>
  <LegalDoc title={t.footer.legal_privacy} lastUpdated="2026-05-09">
    <p set:html={copy.intro} />
    <p set:html={copy.contact} />

    <h2>{copy.s1_title}</h2>
    <ul>
      {copy.s1_items.map((item) => <li>{item}</li>)}
    </ul>

    <h2>{copy.s2_title}</h2>
    <p>{copy.s2_body}</p>

    <h2>{copy.s3_title}</h2>
    <p>{copy.s3_body}</p>
  </LegalDoc>
</Layout>
```

### Step 7.4: Build + verify

```bash
npm run build

for path in 'legal/privacy' 'en-US/legal/privacy' 'pt-BR/legal/privacy'; do
  printf "%s: h1=%d h2=%d ul=%d\n" "$path" \
    $(grep -o '<h1' "dist/${path}/index.html" | /usr/bin/wc -l) \
    $(grep -o '<h2' "dist/${path}/index.html" | /usr/bin/wc -l) \
    $(grep -o '<ul' "dist/${path}/index.html" | /usr/bin/wc -l)
done
```

Expected per locale: h1=1, h2=3, ul=1.

### Step 7.5: Commit

```bash
git add src/pages/legal/privacy.astro 'src/pages/[lang]/legal/privacy.astro'
git commit -m "feat(legal): apply LegalDoc layout to Privacy pages with placeholder copy"
```

---

## Task 8: Apply LegalDoc to Terms pages

**Files:** `src/pages/legal/terms.astro`, `src/pages/[lang]/legal/terms.astro`.

### Step 8.1: Replace `src/pages/legal/terms.astro` with EXACTLY:

```astro
---
import Layout from '../../layouts/Layout.astro';
import LegalDoc from '../../components/composites/LegalDoc.astro';
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout title={`${t.footer.legal_terms} — ${t.meta.site_title}`}>
  <LegalDoc title={t.footer.legal_terms} lastUpdated="2026-05-09">
    <p>
      <strong>Términos de servicio — borrador.</strong>
      Esta página formalizará los términos de uso de la marca Verbara,
      el sitio <a href="https://verbara.io">verbara.io</a> y los servicios
      managed (Tier 3–5). El uso del SDK MIT y la Platform Apache 2.0 está
      gobernado por sus archivos LICENSE en GitHub, no por estos términos.
    </p>
    <p>
      Para preguntas comerciales o legales generales:
      <a href="mailto:hello@verbara.io">hello@verbara.io</a>.
    </p>

    <h2>1. Marca y uso del sitio</h2>
    <p>
      [Placeholder — "Verbara" es marca registrada de Harol A. Reina H. y
      Verbara Contributors. El logo, naming y materiales de marca tienen
      uso restringido; consulta la guía de marca cuando esté publicada.]
    </p>

    <h2>2. SaaS gestionado</h2>
    <p>
      [Placeholder — disponibilidad, SLA, soporte y obligaciones del cliente
      para Tier 3–5. Detalles específicos por tier viven en el contrato
      de servicio firmado.]
    </p>

    <h2>3. Limitación de responsabilidad</h2>
    <p>
      [Placeholder — los componentes OSS se proveen "as is"; los servicios
      managed cumplen los SLA contractuales sin garantías implícitas
      adicionales.]
    </p>
  </LegalDoc>
</Layout>
```

### Step 8.2: Replace `src/pages/[lang]/legal/terms.astro` with EXACTLY:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import LegalDoc from '../../../components/composites/LegalDoc.astro';
import { getMessages } from '../../../i18n/messages';
import { getLocaleFromPath } from '../../../i18n/utils';

export function getStaticPaths() {
  return [
    { params: { lang: 'en-US' } },
    { params: { lang: 'pt-BR' } },
  ];
}

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);

const placeholderEn = {
  intro: '<strong>Terms of service — draft.</strong> This page will formalize the terms of use of the Verbara brand, the <a href="https://verbara.io">verbara.io</a> site, and the managed services (Tier 3–5). Use of the MIT SDK and Apache 2.0 Platform is governed by their LICENSE files on GitHub, not by these terms.',
  contact: 'For general business or legal questions: <a href="mailto:hello@verbara.io">hello@verbara.io</a>.',
  s1_title: '1. Brand and site use',
  s1_body: '[Placeholder — "Verbara" is a trademark of Harol A. Reina H. and Verbara Contributors. The logo, naming, and brand materials are restricted in use; refer to the brand guide when published.]',
  s2_title: '2. Managed SaaS',
  s2_body: '[Placeholder — availability, SLA, support, and customer obligations for Tier 3–5. Tier-specific details live in the signed service contract.]',
  s3_title: '3. Limitation of liability',
  s3_body: '[Placeholder — OSS components are provided "as is"; managed services meet contractual SLAs without additional implied warranties.]',
};

const placeholderPt = {
  intro: '<strong>Termos de serviço — rascunho.</strong> Esta página formalizará os termos de uso da marca Verbara, do site <a href="https://verbara.io">verbara.io</a> e dos serviços gerenciados (Tier 3–5). O uso do SDK MIT e da Platform Apache 2.0 é regido pelos arquivos LICENSE no GitHub, não por estes termos.',
  contact: 'Para perguntas comerciais ou legais gerais: <a href="mailto:hello@verbara.io">hello@verbara.io</a>.',
  s1_title: '1. Marca e uso do site',
  s1_body: '[Placeholder — "Verbara" é marca registrada de Harol A. Reina H. e Verbara Contributors. O logo, naming e materiais de marca têm uso restrito; consulte o guia de marca quando publicado.]',
  s2_title: '2. SaaS gerenciado',
  s2_body: '[Placeholder — disponibilidade, SLA, suporte e obrigações do cliente para Tier 3–5. Detalhes específicos por tier vivem no contrato de serviço assinado.]',
  s3_title: '3. Limitação de responsabilidade',
  s3_body: '[Placeholder — componentes OSS são fornecidos "as is"; serviços gerenciados cumprem os SLAs contratuais sem garantias implícitas adicionais.]',
};

const copy = locale === 'en-US' ? placeholderEn : placeholderPt;
---

<Layout title={`${t.footer.legal_terms} — ${t.meta.site_title}`}>
  <LegalDoc title={t.footer.legal_terms} lastUpdated="2026-05-09">
    <p set:html={copy.intro} />
    <p set:html={copy.contact} />

    <h2>{copy.s1_title}</h2>
    <p>{copy.s1_body}</p>

    <h2>{copy.s2_title}</h2>
    <p>{copy.s2_body}</p>

    <h2>{copy.s3_title}</h2>
    <p>{copy.s3_body}</p>
  </LegalDoc>
</Layout>
```

### Step 8.3: Build + verify

```bash
npm run build

for path in 'legal/terms' 'en-US/legal/terms' 'pt-BR/legal/terms'; do
  printf "%s: h1=%d h2=%d\n" "$path" \
    $(grep -o '<h1' "dist/${path}/index.html" | /usr/bin/wc -l) \
    $(grep -o '<h2' "dist/${path}/index.html" | /usr/bin/wc -l)
done
```

Expected per locale: h1=1, h2=3.

### Step 8.4: Commit

```bash
git add src/pages/legal/terms.astro 'src/pages/[lang]/legal/terms.astro'
git commit -m "feat(legal): apply LegalDoc layout to Terms pages with placeholder copy"
```

---

## Task 9: DeveloperLicenseForm visual polish

**Files:** `src/components/DeveloperLicenseForm.astro`, `src/pages/developer-license.astro`, `src/pages/[lang]/developer-license.astro`.

Spec §7.3 wants single-column layout (form below "what you get" panel), max-width ~32rem, Turnstile dark theme. Phase A migrated tokens; Phase B fixed the `<output>` HTML5 violation. Phase D restructures the layout: move the "what you get" sidebar above the form, single column.

### Step 9.1: Read the current `DeveloperLicenseForm.astro`

```bash
cat src/components/DeveloperLicenseForm.astro
```

Note the current structure: 2-col grid (`grid gap-8 md:grid-cols-[1fr_18rem]`) with form on the left, "what you get" sidebar on the right. We're collapsing this to single-column, with "what you get" rendered ABOVE the form.

### Step 9.2: Modify `DeveloperLicenseForm.astro`

**Two specific changes** to the existing file (do NOT rewrite the whole component — preserve all JS, IDs, validation logic):

**Change 1: Layout grid → single column.** Find the line `<div class="grid gap-8 md:grid-cols-[1fr_18rem]">` and replace with `<div class="space-y-8">`.

**Change 2: Move `<aside>` block to before the `<form>`.** The current structure inside the grid is:

```astro
      <form id="devlic-form" ...>
        ... form fields ...
      </form>

      <aside class="space-y-3 text-sm">
        <h2>{t.developer_license.what_you_get_title}</h2>
        <ul> ... 5 bullets ... </ul>
      </aside>
```

Move the `<aside>` block ABOVE the `<form>`. Also restyle the aside as a top-of-form info panel rather than a sidebar:

Replace the existing `<aside>` block with:

```astro
      <aside class="rounded-lg border border-line-strong bg-ink-3/40 p-5 space-y-3 text-sm">
        <h2 class="text-base font-semibold text-bone">
          {t.developer_license.what_you_get_title}
        </h2>
        <ul class="space-y-2 text-bone-2">
          <li class="flex gap-2">
            <span class="text-signal" aria-hidden="true">·</span>
            <span>{t.developer_license.what_you_get_agents}</span>
          </li>
          <li class="flex gap-2">
            <span class="text-signal" aria-hidden="true">·</span>
            <span>{t.developer_license.what_you_get_node}</span>
          </li>
          <li class="flex gap-2">
            <span class="text-signal" aria-hidden="true">·</span>
            <span>{t.developer_license.what_you_get_duration}</span>
          </li>
          <li class="flex gap-2">
            <span class="text-signal" aria-hidden="true">·</span>
            <span>{t.developer_license.what_you_get_features}</span>
          </li>
          <li class="flex gap-2">
            <span class="text-signal" aria-hidden="true">·</span>
            <span>{t.developer_license.what_you_get_mode}</span>
          </li>
        </ul>
      </aside>
```

Then make sure the `<form>` follows. The full body of the conditional `formEnabled` branch should look like:

```astro
    <div class="space-y-8">
      <aside class="rounded-lg border border-line-strong bg-ink-3/40 p-5 space-y-3 text-sm">
        ... bullets as above ...
      </aside>

      <form id="devlic-form" novalidate ...>
        ... unchanged form fields ...
      </form>
    </div>
```

**Change 3: Turnstile data-theme="dark".** Find the line:
```astro
        <div class="cf-turnstile" data-sitekey={turnstileSiteKey} data-size="flexible"></div>
```
Replace with:
```astro
        <div class="cf-turnstile" data-sitekey={turnstileSiteKey} data-size="flexible" data-theme="dark"></div>
```

**Do NOT modify:**
- The `formEnabled` ternary structure
- The `<output>` (already fixed in Phase B to `<div role="status">`) success panel
- The `<script>` block at the bottom
- Any field IDs (`devlic-email`, `devlic-fullName`, etc.)
- The `data-error-strings` / `data-state-strings` JSON attributes
- The submit button id `devlic-submit`

### Step 9.3: Adjust the page wrapper Container size for max-w-2xl form

Read the current page:
```bash
cat src/pages/developer-license.astro
```

Note it uses `<Container size="sm">` (max-w-3xl = 48rem). The form looks fine at sm; spec said 32rem but that's too narrow for the 5-field form. Keep `size="sm"` as-is — no change needed.

If you want to verify the page looks good: build + open the dev server briefly (skip in headless) and visually inspect, OR just trust the e2e tests.

Skip changing `developer-license.astro` and `[lang]/developer-license.astro` for this task — the layout changes are inside the DeveloperLicenseForm component.

### Step 9.4: Build + verify form structure

```bash
npm run build

for path in 'developer-license' 'en-US/developer-license' 'pt-BR/developer-license'; do
  printf "%s: " "$path"
  printf "form=%d  what-you-get=%d  turnstile-dark=%d\n" \
    $(grep -o '<form' "dist/${path}/index.html" | /usr/bin/wc -l) \
    $(grep -o 'what_you_get\|Lo que obtienes\|What you get\|O que você ganha' "dist/${path}/index.html" | /usr/bin/wc -l) \
    $(grep -o 'data-theme="dark"' "dist/${path}/index.html" | /usr/bin/wc -l)
done
```

Expected per locale: form=1, what-you-get ≥ 1 (the title text appears in the bullets section), turnstile-dark=1.

Also verify the order: "what you get" section appears BEFORE the form in the HTML:
```bash
node -e "
const html = require('fs').readFileSync('dist/developer-license/index.html', 'utf8');
const formIdx = html.indexOf('<form id=\"devlic-form');
const asideIdx = html.indexOf('<aside class=\"rounded-lg border border-line-strong');
console.log({asideIdx, formIdx, asideBeforeForm: asideIdx > 0 && asideIdx < formIdx});
"
```
Expected: `asideBeforeForm: true`.

### Step 9.5: Run e2e (existing tests must still pass — form fields are unchanged)

```bash
npm run test:e2e
```

Expected: 108/108 pass.

### Step 9.6: Commit

```bash
git add src/components/DeveloperLicenseForm.astro
git commit -m "refactor(devlic): single-column layout with what-you-get above form + Turnstile dark"
```

---

## Task 10: e2e tests for legal + dev-license polish

**Files:** `tests/e2e/legal-narrative.spec.ts` (new), `tests/e2e/dev-license-narrative.spec.ts` (new).

### Step 10.1: Create `tests/e2e/legal-narrative.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];
const LEGAL_PAGES = ['eula', 'privacy', 'terms'];

for (const prefix of LOCALE_PREFIXES) {
  for (const page of LEGAL_PAGES) {
    const url = `${prefix}/legal/${page}/`;

    test(`legal narrative: ${url} renders LegalDoc structure`, async ({ page: pw }) => {
      await pw.goto(url, { waitUntil: 'domcontentloaded' });

      // h1 is the LegalDoc title
      await expect(pw.locator('article h1').first()).toBeVisible();

      // legal-doc class is applied to the slot wrapper
      await expect(pw.locator('.legal-doc').first()).toBeAttached();

      // At least one h2 section exists
      const h2Count = await pw.locator('article h2').count();
      expect(h2Count).toBeGreaterThanOrEqual(1);

      // Last-updated metadata is present
      await expect(pw.locator('article header p').first()).toContainText('2026-05-09');
    });
  }
}
```

### Step 10.2: Create `tests/e2e/dev-license-narrative.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  const url = `${prefix}/developer-license/`;

  test(`dev-license narrative: ${url} renders single-column with what-you-get above form`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // The "what you get" aside panel is present
    const aside = page.locator('aside.rounded-lg.border-line-strong');
    await expect(aside).toBeVisible();

    // The form is present
    const form = page.locator('form#devlic-form');
    await expect(form).toBeVisible();

    // Aside must come before form in DOM order
    const asideBox = await aside.boundingBox();
    const formBox = await form.boundingBox();
    expect(asideBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(asideBox!.y).toBeLessThan(formBox!.y);

    // Turnstile widget has dark theme
    const turnstile = page.locator('.cf-turnstile');
    await expect(turnstile).toHaveAttribute('data-theme', 'dark');

    // Required form fields are present
    await expect(page.locator('#devlic-email')).toBeVisible();
    await expect(page.locator('#devlic-fullName')).toBeVisible();
    await expect(page.locator('#devlic-eula')).toBeAttached();
    await expect(page.locator('#devlic-submit')).toBeVisible();
  });
}
```

### Step 10.3: Run all e2e tests

```bash
npm run build
npm run test:e2e
```

Expected count:
- Phase C baseline: 108 cases
- Phase D legal-narrative: 9 unique × 3 browsers = 27 new cases
- Phase D dev-license-narrative: 3 unique × 3 browsers = 9 new cases
- TOTAL: 108 + 36 = **144 cases**, all green.

If a test fails:
- DO NOT modify primitives or composites — those are stable
- Adjust test selectors to match actual rendered HTML if needed
- Report DONE_WITH_CONCERNS if a real bug surfaces

### Step 10.4: Commit

```bash
git add tests/e2e/legal-narrative.spec.ts tests/e2e/dev-license-narrative.spec.ts
git commit -m "test(e2e): add legal LegalDoc + dev-license layout tests across 3 locales"
```

---

## Task 11: Lighthouse audit + targeted fixes

**Files:** depends on what surfaces.

### Step 11.1: Run Lighthouse against the rebuilt site

```bash
npm run build
npx lhci autorun --collect.staticDistDir=./dist
```

Expected: assertions report results for 6 URLs. Thresholds:
- Performance ≥ 0.9
- Accessibility ≥ 0.95
- Best Practices ≥ 0.95
- SEO = 1.0

### Step 11.2: For each failing assertion, make minimal targeted fixes

**Important rules:**
- DO NOT lower the thresholds in `lighthouserc.json`
- DO NOT modify Phase A primitives or design tokens
- DO NOT touch Layout, NavBar, Footer
- Allowed targets: LegalDoc, DeveloperLicenseForm, dev-license pages, legal pages, .legal-doc CSS

**Likely categories:**
- **Color contrast** in `.legal-doc a` underline color — `rgba(64,217,255,0.4)` may fail. If so, bump to `rgba(64,217,255,0.6)` or solid `text-decoration-color: var(--color-signal)`.
- **Long titles** — legal page titles are short (`EULA — Verbara`); shouldn't trigger long-title warning. Pre-existing warnings on legal pages should resolve.
- **Heading hierarchy** — legal pages: h1 (LegalDoc title) → h2 (sections). Clean.

### Step 11.3: Run full test:all

```bash
npm run test:all
```

Expected: every gate passes — check, lint, test:i18n (232 × 3), build, validate:html, test:e2e (144 cases), test:lhci (6 URLs).

### Step 11.4: Commit any remediation

```bash
git add -A
git commit -m "fix(a11y): satisfy lighthouse thresholds on legal + dev-license pages"
```

If no fixes were needed, skip.

---

## Task 12: Phase D close

**Files:** `docs/plans/active/2026-05-09-website-redesign-phase-d-dev-legal.md` → `docs/plans/completed/`.

### Step 12.1: Confirm clean shell + tests pass

```bash
git status
npm run test:all
```

Expected: working tree clean, all gates green: check / lint / test:i18n (232 × 3) / build / validate:html / test:e2e (144 cases) / test:lhci (6 URLs).

### Step 12.2: Inspect bundle baseline

```bash
npm run build
du -sh dist/
```

Phase C baseline ~732 KB. Phase D delta: legal placeholder copy (~5 KB × 6 pages = 30 KB) + LegalDoc CSS (~1 KB) + dev-license layout (~0 KB net). Expected: ≤ ~770 KB.

### Step 12.3: Move plan from `active/` to `completed/`

```bash
git mv docs/plans/active/2026-05-09-website-redesign-phase-d-dev-legal.md docs/plans/completed/
git status
git commit -m "docs(plans): mark phase-d-dev-legal complete"
```

### Step 12.4: STOP

Do NOT push, merge, or open a PR. Report final state to controller.

## Constraints

- DO NOT push, merge, or rebase
- DO NOT modify Phase A primitives or design tokens beyond Card's `id` prop addition
- DO NOT change worker logic, JS, or Turnstile API integration
- Single commit per task
- No `Co-Authored-By`

## Self-review

- All 12 tasks produced commits?
- Working tree clean after the plan move?
- Plan file in `completed/`?
- test:all 144 cases green?

## Report

- Status: DONE | DONE_WITH_CONCERNS | BLOCKED
- Total Phase D commits on the branch
- Branch name + branch HEAD
- test:all summary
- Bundle size
- Concerns

---

## Spec coverage check

Each spec section / cross-Phase item mapped to a task:

| Source | Item | Task |
|---|---|---|
| Spec §7.3 | Single-column layout, what-you-get above form | Task 9 |
| Spec §7.3 | Turnstile data-theme="dark" | Task 9 |
| Spec §7.3 | Form fields use new tokens | (Phase A) — verified intact |
| Spec §7.4 | LegalDoc layout | Task 5 |
| Spec §7.4 | Apply to 3 legal pages | Tasks 6, 7, 8 |
| Spec §7.4 | Sticky ToC on desktop | DEFERRED (auto-generation infra not in place; future polish) |
| Phase B reviewer | 60-day vs 30-day mismatch | Task 1 |
| Phase C reviewer | Type duplication in pricing composites | Task 2 |
| Phase C reviewer | Card primitive id forwarding | Task 3 |
| Phase C reviewer | 'unlock' buzzword | Task 4 |
| Spec §9.2 | e2e tests | Task 10 |
| Spec §9.3 | Lighthouse thresholds | Task 11 |

**Out of Phase D by design** (deferred to E):
- Logo SVGs, favicons, OG images per locale
- Sitemap, meta polish
- Real legal copy (separate non-engineering task)
- Sticky ToC infra for legal pages

---

## Plan complete

Plan saved to `docs/plans/active/2026-05-09-website-redesign-phase-d-dev-legal.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task + two-stage review. Validated pattern from A/B/C.
2. **Inline Execution** — `superpowers:executing-plans`, batch execution with checkpoints.

**Which approach?**
