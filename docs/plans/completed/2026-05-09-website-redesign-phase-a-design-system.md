# Website Redesign — Phase A: Design System Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder visual identity with the Signal design system (tokens, fonts, primitives, NavBar, Footer, new Layout) and stand up testing primitives (ESLint, html-validate, Playwright, Lighthouse CI, i18n parity check). Existing copy and page structure are preserved — only the visual layer changes — so the site keeps shipping while Phases B–E redesign each page.

**Architecture:** Astro 6 + Tailwind v4 (CSS-based `@theme` tokens, no JS config). Self-hosted Geist Sans + Geist Mono via `@font-face`. Dark-mode only — `prefers-color-scheme` conditionals removed. Components organized as `primitives/` (Button, Badge, Card, CodeBlock, Section, Container, Heading) and `composites/` (NavBar, Footer). Vanilla JS for interactivity; no client-side framework.

**Tech Stack:** Astro 6.3, Tailwind 4.3 (`@tailwindcss/vite`), TypeScript 5.9, Geist Sans/Mono (SIL OFL 1.1), Cloudflare Pages, Cloudflare Workers, Wrangler. New: ESLint 9 + `eslint-plugin-astro`, `html-validate` 9, Playwright 1.49, `@lhci/cli`.

**Spec:** `docs/specs/2026-05-09-website-redesign.md` — Phase A scope corresponds to spec sections §4 (Visual identity), §6 (Component inventory — primitives + cross-page composites), §9 (Testing strategy), and the parts of §3 (IA — NavBar, Footer) that survive across pages.

**What Phase A explicitly does NOT do** (Phases B–E):
- Redesign home (Hero, AntiPositioningTable, ArchitectureDiagram, etc.)
- Redesign pricing (TierCard, ComparisonMatrix)
- Visually rebuild the developer-license form
- Apply LegalDoc to legal pages
- Author logo SVGs, favicons, OG images
- Author or translate any copy

End state of Phase A: production site is **visually rebranded** (paleta, tipografía, NavBar, Footer) but page bodies still render their current placeholder content.

---

## File Structure

### Created

```
public/fonts/
  GeistSans-Regular.woff2
  GeistSans-Medium.woff2
  GeistSans-SemiBold.woff2
  GeistSans-Bold.woff2
  GeistMono-Regular.woff2
  GeistMono-Medium.woff2
src/components/primitives/
  Button.astro
  Badge.astro
  Card.astro
  CodeBlock.astro
  Section.astro
  Container.astro
  Heading.astro
src/components/composites/
  NavBar.astro
  Footer.astro
scripts/
  check-i18n-parity.mjs
tests/e2e/
  smoke.spec.ts
  locale-switcher.spec.ts
playwright.config.ts
lighthouserc.json
eslint.config.mjs
.htmlvalidate.json
.github/workflows/
  ci.yml
```

### Modified

```
src/styles/global.css       — full rewrite (tokens, font-face, reset, dark-only)
src/layouts/Layout.astro    — extract NavBar/Footer to composites
src/pages/index.astro       — minor: drop hardcoded button styles, use <Button>
src/pages/pricing.astro     — same; use <Section>, <Container>, <Button>
src/pages/developer-license.astro — same
src/pages/[lang]/*.astro    — same minor refactors
src/pages/legal/*.astro     — same
src/components/DeveloperLicenseForm.astro — apply token classes (no functional change)
package.json                — devDeps + scripts
astro.config.mjs            — no functional change; comment refresh
.gitignore                  — add test-results/
```

### Deleted

None.

---

## Conventions

- **TDD where it pays:** logic (i18n parity script, accordion JS, copy-button JS, locale-switcher behavior) gets tests first. Pure-presentational `.astro` components are verified via the Playwright page-level smoke test (their absence breaks page rendering, which the smoke catches). This is a deliberate pragmatic call for static marketing-site work; reviewer should not flag missing component-unit tests as a gap.
- **Commit cadence:** commit after every passing test or every coherent visual checkpoint. Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`). No `Co-Authored-By` (per global CLAUDE.md).
- **Dev server:** keep `npm run dev` running in a separate terminal during the entire plan to spot visual regressions live.
- **Fonts:** Geist is licensed under SIL OFL 1.1 and shipped via the official `vercel/geist-font` GitHub repo. Self-host the `.woff2` files (no Google Fonts/CDN dependency).

---

## Task 0: Verify clean starting state

**Files:** none (verification only).

- [ ] **Step 0.1: Verify on `main`, working tree clean, last commit is the spec**

Run:
```bash
git status
git log --oneline -2
```

Expected:
```
On branch main
nothing to commit, working tree clean
3aefc51 docs(specs): add website-redesign spec — operator-first + Signal identity
4640b02 docs(readme): update Status section — verbara.io is LIVE + Tier 0.5 loop operational
```

If anything else is staged/modified, stop and ask the user before proceeding.

- [ ] **Step 0.2: Verify build works as-is**

Run:
```bash
npm install
npm run build
```

Expected: build completes with no errors. `dist/` exists. This is the baseline — every later task must keep this command green.

---

## Task 1: Add new devDependencies

**Files:** `package.json`.

- [ ] **Step 1.1: Add ESLint + Astro plugin + html-validate + Playwright + LHCI**

Run:
```bash
npm install --save-dev \
  eslint@^9 \
  @eslint/js@^9 \
  eslint-plugin-astro@^1 \
  typescript-eslint@^8 \
  html-validate@^9 \
  @playwright/test@^1.49 \
  @lhci/cli@^0.14
```

- [ ] **Step 1.2: Install Playwright browsers**

Run:
```bash
npx playwright install --with-deps chromium firefox webkit
```

Expected: 3 browsers + dependencies installed (Linux: may prompt for sudo apt-get on missing libs — answer yes if local, document in CI step otherwise).

- [ ] **Step 1.3: Add test scripts to `package.json`**

Edit `package.json`, replace the `scripts` block:

```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "deploy": "rm -rf dist && PUBLIC_TURNSTILE_SITE_KEY=$(grep '^TURNSTILE_SITE_KEY=' ~/.verbara/secrets.env | cut -d= -f2-) astro build && npx wrangler deploy",
    "check": "astro check",
    "lint": "eslint .",
    "validate:html": "html-validate 'dist/**/*.html'",
    "test:i18n": "node scripts/check-i18n-parity.mjs",
    "test:e2e": "playwright test",
    "test:lhci": "lhci autorun",
    "test:all": "npm run check && npm run lint && npm run test:i18n && npm run build && npm run validate:html && npm run test:e2e && npm run test:lhci"
  },
```

- [ ] **Step 1.4: Verify `npm install` is clean and lockfile is updated**

Run:
```bash
git status
```

Expected: `package.json` and `package-lock.json` modified, no other files.

- [ ] **Step 1.5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add eslint, html-validate, playwright, lhci for redesign quality gates"
```

---

## Task 2: ESLint config

**Files:** `eslint.config.mjs` (new).

- [ ] **Step 2.1: Write failing lint check**

Create a file with a deliberately broken Astro snippet to prove ESLint actually runs:

```bash
mkdir -p tmp
cat > tmp/lint-check.astro <<'EOF'
---
const unused = "this should fail no-unused-vars"
---
<div>broken</div>
EOF
```

- [ ] **Step 2.2: Create `eslint.config.mjs`**

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '.wrangler/**', '.superpowers/**', 'tmp/**', 'tests/e2e/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
```

- [ ] **Step 2.3: Run lint and verify it catches the broken file**

First, *un-ignore* `tmp/` temporarily by removing it from the ignores array, then run:

```bash
npx eslint tmp/lint-check.astro
```

Expected: ERROR about `unused` variable.

- [ ] **Step 2.4: Re-add `tmp/` to ignores and remove the test file**

Restore the `tmp/**` ignore in `eslint.config.mjs`, then:

```bash
rm -rf tmp/
```

- [ ] **Step 2.5: Run lint on real codebase**

```bash
npm run lint
```

Expected: no errors (or only pre-existing issues — fix if minor).

- [ ] **Step 2.6: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore(lint): add eslint flat config with astro + ts plugins"
```

---

## Task 3: html-validate config

**Files:** `.htmlvalidate.json` (new).

- [ ] **Step 3.1: Create `.htmlvalidate.json`**

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "no-inline-style": "off",
    "void-style": ["error", { "style": "selfclose" }],
    "wcag/h30": "warn",
    "wcag/h32": "warn"
  }
}
```

Notes: `no-inline-style` is disabled because Astro components legitimately use `style=` for one-off positioning. WCAG rules at `warn` (not `error`) so they don't block CI but surface for review.

- [ ] **Step 3.2: Build and validate**

```bash
npm run build
npm run validate:html
```

Expected: builds clean and validator reports 0 errors (warnings are allowed). If errors surface from existing pages, fix the source HTML — do **not** loosen the config.

- [ ] **Step 3.3: Commit**

```bash
git add .htmlvalidate.json
git commit -m "chore(test): add html-validate config for built output"
```

---

## Task 4: Playwright config

**Files:** `playwright.config.ts` (new), `.gitignore` (modify).

- [ ] **Step 4.1: Create `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

Note: `npm run preview` serves the built static site on port 4321 by default in Astro. We test against the *built* site, not the dev server, to catch SSG bugs.

- [ ] **Step 4.2: Add Playwright artifacts to `.gitignore`**

Edit `.gitignore`, add at the bottom:

```
# Playwright
test-results/
playwright-report/
playwright/.cache/
```

- [ ] **Step 4.3: Commit**

```bash
git add playwright.config.ts .gitignore
git commit -m "chore(test): add playwright config with chromium/firefox/webkit projects"
```

---

## Task 5: Lighthouse CI config

**Files:** `lighthouserc.json` (new).

- [ ] **Step 5.1: Create `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost/index.html",
        "http://localhost/en-US/index.html",
        "http://localhost/pt-BR/index.html",
        "http://localhost/pricing/index.html",
        "http://localhost/en-US/pricing/index.html",
        "http://localhost/developer-license/index.html"
      ],
      "settings": {
        "preset": "desktop",
        "throttlingMethod": "simulate"
      },
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1.0 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

- [ ] **Step 5.2: Try a local run**

```bash
npm run build
npx lhci autorun --collect.staticDistDir=./dist
```

Expected: scores reported for each URL. If the current placeholder pages fail thresholds (likely SEO since OG/meta isn't fully set), record the failures — Phase A cleanup includes fixing them. If they pass, great. The thresholds in the assertion block are aspirational; **do not lower them to make it pass**. We'll fix the source instead in later tasks.

- [ ] **Step 5.3: Commit**

```bash
git add lighthouserc.json
git commit -m "chore(test): add lighthouse-ci with perf/a11y/seo thresholds"
```

---

## Task 6: Self-host Geist fonts

**Files:** `public/fonts/*.woff2` (6 new files).

- [ ] **Step 6.1: Create the directory**

```bash
mkdir -p public/fonts
```

- [ ] **Step 6.2: Download Geist Sans + Mono woff2 from the official repo**

The Vercel `vercel/geist-font` repo distributes pre-built woff2 files. Use `curl` to fetch the specific weights we need:

```bash
GEIST_BASE="https://raw.githubusercontent.com/vercel/geist-font/main/fonts"

curl -fLo public/fonts/GeistSans-Regular.woff2  "$GEIST_BASE/geist-sans/Geist-Regular.woff2"
curl -fLo public/fonts/GeistSans-Medium.woff2   "$GEIST_BASE/geist-sans/Geist-Medium.woff2"
curl -fLo public/fonts/GeistSans-SemiBold.woff2 "$GEIST_BASE/geist-sans/Geist-SemiBold.woff2"
curl -fLo public/fonts/GeistSans-Bold.woff2     "$GEIST_BASE/geist-sans/Geist-Bold.woff2"
curl -fLo public/fonts/GeistMono-Regular.woff2  "$GEIST_BASE/geist-mono/GeistMono-Regular.woff2"
curl -fLo public/fonts/GeistMono-Medium.woff2   "$GEIST_BASE/geist-mono/GeistMono-Medium.woff2"
```

Expected: 6 woff2 files in `public/fonts/`. Verify with:
```bash
ls -lh public/fonts/
```

If a URL 404s (the upstream repo restructured), fallback: clone `vercel/geist-font` shallow and copy the files manually.

- [ ] **Step 6.3: Verify files are valid woff2**

```bash
file public/fonts/*.woff2
```

Expected: each line reports "Web Open Font Format (Version 2)".

- [ ] **Step 6.4: Commit**

```bash
git add public/fonts/
git commit -m "feat(brand): self-host geist sans + mono woff2 (SIL OFL 1.1)"
```

---

## Task 7: Design tokens + global CSS rewrite

**Files:** `src/styles/global.css` (full rewrite).

- [ ] **Step 7.1: Read the current `global.css`**

```bash
cat src/styles/global.css
```

Note the current contents to compare; we are doing a full replacement.

- [ ] **Step 7.2: Replace `src/styles/global.css` with the Signal token system**

```css
@import "tailwindcss";

/* ===== Self-hosted Geist Sans + Mono ===== */
@font-face {
  font-family: "Geist Sans";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/fonts/GeistSans-Regular.woff2") format("woff2");
}
@font-face {
  font-family: "Geist Sans";
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/fonts/GeistSans-Medium.woff2") format("woff2");
}
@font-face {
  font-family: "Geist Sans";
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  src: url("/fonts/GeistSans-SemiBold.woff2") format("woff2");
}
@font-face {
  font-family: "Geist Sans";
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url("/fonts/GeistSans-Bold.woff2") format("woff2");
}
@font-face {
  font-family: "Geist Mono";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("/fonts/GeistMono-Regular.woff2") format("woff2");
}
@font-face {
  font-family: "Geist Mono";
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url("/fonts/GeistMono-Medium.woff2") format("woff2");
}

/* ===== Signal design tokens (Tailwind v4 @theme) ===== */
@theme {
  /* Surfaces */
  --color-ink: #0a1628;
  --color-ink-2: #050d1a;
  --color-ink-3: #0f2138;

  /* Text */
  --color-bone: #e8eef5;
  --color-bone-2: rgba(232, 238, 245, 0.65);
  --color-bone-3: rgba(232, 238, 245, 0.4);

  /* Accents */
  --color-signal: #40d9ff;
  --color-signal-deep: #1fa8cc;
  --color-amber: #ffb547;

  /* States */
  --color-success: #34d399;
  --color-error: #f87171;

  /* Lines */
  --color-line: rgba(232, 238, 245, 0.1);
  --color-line-strong: rgba(232, 238, 245, 0.2);

  /* Type families */
  --font-display: "Geist Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-body: "Geist Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Type scale (rem) */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
}

/* ===== Transitional aliases =====
 * Keep the old --color-bg / --color-fg names mapped to the new tokens
 * so existing pages render in the new palette between Task 7 and Task 17
 * (when individual pages are migrated to the new primitives). REMOVE
 * these aliases at the end of Task 17 once no page references them.
 */
:root {
  --color-bg: var(--color-ink);
  --color-fg: var(--color-bone);
}

/* ===== Base reset + dark-only application ===== */
:root {
  color-scheme: dark;
}

html {
  background: var(--color-ink);
  color: var(--color-bone);
  font-family: var(--font-body);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100vh;
  background: var(--color-ink);
  color: var(--color-bone);
}

/* Display headings use display family + tighter tracking */
h1, h2, h3 {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}

/* Mono primitives */
code, kbd, samp, pre {
  font-family: var(--font-mono);
}

/* Focus ring — accessible, signal-cyan */
:focus-visible {
  outline: 2px solid var(--color-signal);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Selection */
::selection {
  background: var(--color-signal);
  color: var(--color-ink);
}
```

- [ ] **Step 7.3: Verify build still works**

```bash
npm run build
```

Expected: clean build. If Tailwind v4 complains about an unknown `@theme` directive, verify `@tailwindcss/vite` is at v4.x — older versions don't support `@theme`.

- [ ] **Step 7.4: Run dev server and visually check**

```bash
npm run dev
```

Open `http://localhost:4321/` in a browser. Expected:
- Page background is dark navy (`#0a1628`).
- Text is bone-cream (`#e8eef5`).
- Body text uses Geist Sans (verify in DevTools → Computed → font-family).
- No FOUT/FOIT visible (font-display: swap).

Stop the dev server (`Ctrl+C`) before continuing.

- [ ] **Step 7.5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(brand): add Signal design tokens + self-host font-faces"
```

---

## Task 8: Primitive — Button

**Files:** `src/components/primitives/Button.astro` (new).

- [ ] **Step 8.1: Create `src/components/primitives/Button.astro`**

```bash
mkdir -p src/components/primitives
```

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  ariaLabel?: string;
}

const {
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  class: extra = '',
  ariaLabel,
} = Astro.props;

const base = 'inline-flex items-center justify-center font-medium rounded-md transition-opacity transition-colors';
const sizes: Record<NonNullable<Props['size']>, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};
const variants: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-signal text-ink hover:bg-signal-deep',
  secondary: 'border border-line-strong text-bone hover:bg-ink-3',
  ghost: 'text-bone hover:text-signal',
};

const cls = [base, sizes[size], variants[variant], extra].filter(Boolean).join(' ');
const Tag = href ? 'a' : 'button';
---

{href ? (
  <a href={href} class={cls} aria-label={ariaLabel}>
    <slot />
  </a>
) : (
  <button type={type} class={cls} aria-label={ariaLabel}>
    <slot />
  </button>
)}
```

- [ ] **Step 8.2: Wire Button into the existing landing temporarily for smoke check**

Edit `src/pages/index.astro`. Find the line:

```astro
import Layout from '../layouts/Layout.astro';
```

Replace with:

```astro
import Layout from '../layouts/Layout.astro';
import Button from '../components/primitives/Button.astro';
```

Then find the existing `<a>` CTA blocks (lines ~20–32 in the original file) and replace **just one** for the smoke test:

Old:
```astro
        <a
          href={localiseHref('developer-license', locale)}
          class="inline-flex items-center justify-center rounded-md bg-[var(--color-fg)] text-[var(--color-bg)] px-5 py-2.5 text-sm font-medium hover:opacity-90"
        >
          {t.landing.cta_developer}
        </a>
```

New:
```astro
        <Button variant="primary" size="lg" href={localiseHref('developer-license', locale)}>
          {t.landing.cta_developer}
        </Button>
```

- [ ] **Step 8.3: Build and visually verify**

```bash
npm run build && npm run preview
```

Open `http://localhost:4321/`. Expected:
- The first CTA renders as a cyan-on-ink button with rounded corners, matching the Signal palette.
- Hover: opacity / hover bg shift visible.
- Focus (Tab key): cyan focus ring visible.
- The second CTA (still using old code) still renders with old styles — we will migrate the rest in a later task.

Stop preview server.

- [ ] **Step 8.4: Commit**

```bash
git add src/components/primitives/Button.astro src/pages/index.astro
git commit -m "feat(ui): add Button primitive (primary/secondary/ghost × md/lg)"
```

---

## Task 9: Primitive — Badge

**Files:** `src/components/primitives/Badge.astro` (new).

- [ ] **Step 9.1: Create `src/components/primitives/Badge.astro`**

```astro
---
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'mono';
  class?: string;
}
const { variant = 'default', class: extra = '' } = Astro.props;

const variants: Record<NonNullable<Props['variant']>, string> = {
  default: 'border border-line-strong text-bone-2 bg-ink-3',
  success: 'bg-success/10 text-success border border-success/25',
  warning: 'bg-amber/10 text-amber border border-amber/30',
  info: 'bg-signal/10 text-signal border border-signal/25',
  mono: 'border border-line-strong text-bone-2 font-mono',
};

const cls = [
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs',
  variants[variant],
  extra,
].filter(Boolean).join(' ');
---

<span class={cls}><slot /></span>
```

- [ ] **Step 9.2: Smoke check on landing**

Add to `src/pages/index.astro`, just above the H1 in the hero:

```astro
      <Badge variant="mono">MIT SDK · Apache Platform · 0 vulns</Badge>
```

And add the import:

```astro
import Badge from '../components/primitives/Badge.astro';
```

Build + preview, verify the badge renders as a pill with mono font, faint cyan tint on the border.

- [ ] **Step 9.3: Commit**

```bash
git add src/components/primitives/Badge.astro src/pages/index.astro
git commit -m "feat(ui): add Badge primitive (default/success/warning/info/mono)"
```

---

## Task 10: Primitive — Card

**Files:** `src/components/primitives/Card.astro` (new).

- [ ] **Step 10.1: Create `src/components/primitives/Card.astro`**

```astro
---
interface Props {
  variant?: 'default' | 'highlighted';
  class?: string;
  as?: 'article' | 'div' | 'section';
}
const { variant = 'default', class: extra = '', as: Tag = 'div' } = Astro.props;

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

<Tag class={cls}><slot /></Tag>
```

- [ ] **Step 10.2: Verify by adding a quick demo to the home "why" cards**

In `src/pages/index.astro`, find the three `<article class="rounded-lg border ...">` blocks and replace **one** of them with:

```astro
        <Card as="article">
          <h3 class="text-lg font-semibold">{t.landing.why_b1_title}</h3>
          <p class="text-sm opacity-80 leading-relaxed">{t.landing.why_b1_body}</p>
        </Card>
```

Add the import:
```astro
import Card from '../components/primitives/Card.astro';
```

Build + preview, verify the migrated card matches the others visually but uses the Signal tokens (slightly different border tone — that's expected).

- [ ] **Step 10.3: Commit**

```bash
git add src/components/primitives/Card.astro src/pages/index.astro
git commit -m "feat(ui): add Card primitive (default/highlighted)"
```

---

## Task 11: Primitive — Section + Container

**Files:** `src/components/primitives/Section.astro`, `src/components/primitives/Container.astro` (new).

- [ ] **Step 11.1: Create `src/components/primitives/Container.astro`**

```astro
---
interface Props {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}
const { size = 'lg', class: extra = '' } = Astro.props;
const sizes: Record<NonNullable<Props['size']>, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
};
const cls = ['mx-auto px-6', sizes[size], extra].filter(Boolean).join(' ');
---

<div class={cls}><slot /></div>
```

- [ ] **Step 11.2: Create `src/components/primitives/Section.astro`**

```astro
---
interface Props {
  id?: string;
  tone?: 'default' | 'inset';
  class?: string;
}
const { id, tone = 'default', class: extra = '' } = Astro.props;
const tones: Record<NonNullable<Props['tone']>, string> = {
  default: '',
  inset: 'bg-ink-3',
};
const cls = ['py-20 md:py-28', tones[tone], extra].filter(Boolean).join(' ');
---

<section id={id} class={cls}><slot /></section>
```

- [ ] **Step 11.3: Smoke check — the existing landing should still build**

```bash
npm run build
```

We don't migrate index.astro to use Section/Container yet; the components just need to compile.

- [ ] **Step 11.4: Commit**

```bash
git add src/components/primitives/Section.astro src/components/primitives/Container.astro
git commit -m "feat(ui): add Section + Container layout primitives"
```

---

## Task 12: Primitive — Heading

**Files:** `src/components/primitives/Heading.astro` (new).

- [ ] **Step 12.1: Create `src/components/primitives/Heading.astro`**

```astro
---
interface Props {
  level: 1 | 2 | 3 | 4;
  eyebrow?: string;
  class?: string;
  align?: 'left' | 'center';
}
const { level, eyebrow, class: extra = '', align = 'left' } = Astro.props;

const sizes: Record<Props['level'], string> = {
  1: 'text-5xl md:text-6xl',
  2: 'text-3xl md:text-4xl',
  3: 'text-2xl md:text-3xl',
  4: 'text-xl md:text-2xl',
};

const Tag = `h${level}` as `h${1 | 2 | 3 | 4}`;
const cls = [
  sizes[level],
  'font-bold tracking-tight text-balance',
  align === 'center' ? 'text-center' : '',
  extra,
].filter(Boolean).join(' ');

const wrapCls = align === 'center' ? 'text-center space-y-2' : 'space-y-2';
const eyebrowCls = 'text-xs uppercase tracking-wider font-mono text-signal';
---

<div class={wrapCls}>
  {eyebrow && <p class={eyebrowCls}>{eyebrow}</p>}
  <Tag class={cls}><slot /></Tag>
</div>
```

- [ ] **Step 12.2: Smoke check**

```bash
npm run build
```

Expected: clean build. Heading is not yet used; first use comes in NavBar/Footer/page rewrites.

- [ ] **Step 12.3: Commit**

```bash
git add src/components/primitives/Heading.astro
git commit -m "feat(ui): add Heading primitive with eyebrow + level-driven scale"
```

---

## Task 13: Primitive — CodeBlock

**Files:** `src/components/primitives/CodeBlock.astro` (new).

- [ ] **Step 13.1: Create `src/components/primitives/CodeBlock.astro`**

We use Astro's built-in `<Code />` from `astro:components` for syntax highlighting (Shiki under the hood, server-rendered). Wrap with our chrome.

```astro
---
import { Code } from 'astro:components';

interface Props {
  lang: string;
  code: string;
  filename?: string;
  class?: string;
}
const { lang, code, filename, class: extra = '' } = Astro.props;

// Stable id for clipboard handler scoping
const id = `code-${Math.random().toString(36).slice(2, 9)}`;

const cls = [
  'relative rounded-lg border border-line-strong bg-ink-2 overflow-hidden',
  extra,
].filter(Boolean).join(' ');
---

<div class={cls} data-codeblock={id}>
  {filename && (
    <div class="flex items-center justify-between border-b border-line-strong px-4 py-2 text-xs font-mono text-bone-2">
      <span>{filename}</span>
      <button
        type="button"
        data-copy={id}
        class="text-bone-2 hover:text-signal text-xs"
        aria-label="Copy code to clipboard"
      >Copy</button>
    </div>
  )}
  {!filename && (
    <button
      type="button"
      data-copy={id}
      class="absolute top-3 right-3 text-xs text-bone-2 hover:text-signal"
      aria-label="Copy code to clipboard"
    >Copy</button>
  )}
  <div class="p-4 text-sm overflow-x-auto" data-code={id}>
    <Code code={code} lang={lang} theme="github-dark-default" />
  </div>
</div>

<script>
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.copy;
      const codeEl = document.querySelector<HTMLElement>(`[data-code="${id}"]`);
      if (!codeEl) return;
      try {
        await navigator.clipboard.writeText(codeEl.innerText);
        const original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = original; }, 1400);
      } catch {
        btn.textContent = 'Failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
      }
    });
  });
</script>
```

- [ ] **Step 13.2: Smoke check**

```bash
npm run build
```

Expected: clean build. The component compiles even without a usage site yet.

- [ ] **Step 13.3: Commit**

```bash
git add src/components/primitives/CodeBlock.astro
git commit -m "feat(ui): add CodeBlock primitive with Shiki highlighting + copy button"
```

---

## Task 14: Composite — NavBar

**Files:** `src/components/composites/NavBar.astro` (new).

- [ ] **Step 14.1: Create directory + component**

```bash
mkdir -p src/components/composites
```

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
---

<header class="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
    <a
      href={localiseHref('', locale)}
      class="flex items-center gap-2 font-bold text-lg tracking-tight text-bone hover:text-signal"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M3 6 L11 18 L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 11 H15" stroke="var(--color-signal)" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Verbara<sup class="text-xs opacity-60 ml-0.5">™</sup></span>
    </a>

    <nav class="hidden md:flex items-center gap-7 text-sm text-bone-2">
      <a href={`${localiseHref('', locale)}#how-it-works`} class="hover:text-bone">{t.nav.product ?? 'Product'}</a>
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
            l === locale ? 'text-signal font-semibold' : 'text-bone-3 hover:text-bone',
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
    <nav class="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3 text-sm">
      <a href={`${localiseHref('', locale)}#how-it-works`} class="text-bone-2 hover:text-bone">{t.nav.product ?? 'Product'}</a>
      <a href={localiseHref('pricing', locale)} class="text-bone-2 hover:text-bone">{t.nav.pricing}</a>
      <a href={localiseHref('developer-license', locale)} class="text-bone-2 hover:text-bone">{t.nav.developer_license}</a>
      <a href="https://github.com/verbara" class="text-bone-2 hover:text-bone">{t.nav.github}</a>
    </nav>
  </div>
</header>

<script>
  const toggle = document.getElementById('nav-mobile-toggle');
  const panel = document.getElementById('nav-mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
</script>
```

- [ ] **Step 14.2: Add the missing `nav.product` i18n key (placeholder OK in Phase A)**

Edit `src/i18n/messages.ts`. Add `product: string;` to the `nav` interface and add `product: 'Product'` (EN), `product: 'Producto'` (ES-419), `product: 'Produto'` (PT-BR) entries. If the file structure differs, add the key to *all three locales* — i18n parity is enforced in Task 19 below.

- [ ] **Step 14.3: Build to verify**

```bash
npm run build
```

Expected: clean build. The NavBar isn't wired into Layout yet; just the component compiling.

- [ ] **Step 14.4: Commit**

```bash
git add src/components/composites/NavBar.astro src/i18n/messages.ts
git commit -m "feat(ui): add NavBar composite with locale switcher + mobile menu"
```

---

## Task 15: Composite — Footer

**Files:** `src/components/composites/Footer.astro` (new).

- [ ] **Step 15.1: Create `src/components/composites/Footer.astro`**

```astro
---
import { getMessages } from '../../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<footer class="border-t border-line mt-12 bg-ink-2">
  <div class="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
    <div class="space-y-3 md:col-span-1">
      <a href={localiseHref('', locale)} class="font-bold text-lg text-bone hover:text-signal">
        Verbara<sup class="text-xs opacity-60 ml-0.5">™</sup>
      </a>
      <p class="text-sm text-bone-2 leading-relaxed">{t.footer.tagline}</p>
    </div>

    <div class="space-y-3">
      <h4 class="text-xs font-mono uppercase tracking-wider text-bone-3">Product</h4>
      <ul class="space-y-2 text-sm text-bone-2">
        <li><a href={localiseHref('pricing', locale)} class="hover:text-bone">{t.nav.pricing}</a></li>
        <li><a href={localiseHref('developer-license', locale)} class="hover:text-bone">{t.nav.developer_license}</a></li>
        <li><a href="https://github.com/verbara/Verbara.Sdk" class="hover:text-bone">SDK (MIT)</a></li>
      </ul>
    </div>

    <div class="space-y-3">
      <h4 class="text-xs font-mono uppercase tracking-wider text-bone-3">Resources</h4>
      <ul class="space-y-2 text-sm text-bone-2">
        <li><a href="https://github.com/verbara" class="hover:text-bone">GitHub</a></li>
        <li><a href="mailto:hello@verbara.io" class="hover:text-bone">hello@verbara.io</a></li>
        <li><a href="mailto:licensing@verbara.io" class="hover:text-bone">licensing@verbara.io</a></li>
        <li><a href="mailto:security@verbara.io" class="hover:text-bone">security@verbara.io</a></li>
      </ul>
    </div>

    <div class="space-y-3">
      <h4 class="text-xs font-mono uppercase tracking-wider text-bone-3">Legal</h4>
      <ul class="space-y-2 text-sm text-bone-2">
        <li><a href={localiseHref('legal/eula', locale)} class="hover:text-bone">{t.footer.legal_eula}</a></li>
        <li><a href={localiseHref('legal/privacy', locale)} class="hover:text-bone">{t.footer.legal_privacy}</a></li>
        <li><a href={localiseHref('legal/terms', locale)} class="hover:text-bone">{t.footer.legal_terms}</a></li>
      </ul>
    </div>
  </div>

  <div class="border-t border-line">
    <div class="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row gap-2 md:gap-6 text-xs text-bone-3">
      <p>{t.footer.copyright}</p>
      <p>{t.footer.trademark}</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 15.2: Build**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 15.3: Commit**

```bash
git add src/components/composites/Footer.astro
git commit -m "feat(ui): add Footer composite with 4-column layout"
```

---

## Task 16: Layout rewrite

**Files:** `src/layouts/Layout.astro` (full rewrite).

- [ ] **Step 16.1: Read current Layout to confirm what we replace**

```bash
cat src/layouts/Layout.astro
```

We are replacing it with a thinner version that delegates to NavBar and Footer composites.

- [ ] **Step 16.2: Replace `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';
import NavBar from '../components/composites/NavBar.astro';
import Footer from '../components/composites/Footer.astro';
import { getMessages, LOCALES } from '../i18n/messages';
import { getLocaleFromPath, getRouteFromPath, localiseHref } from '../i18n/utils';

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;

const locale = getLocaleFromPath(Astro.url.pathname);
const route = getRouteFromPath(Astro.url.pathname);
const t = getMessages(locale);

const pageTitle = title ?? t.meta.site_title;
const pageDescription = description ?? t.meta.site_description;
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={pageDescription} />
    <meta name="theme-color" content="#0a1628" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{pageTitle}</title>
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDescription} />
    <meta property="og:url" content={`https://verbara.io${Astro.url.pathname}`} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content={locale} />
    {LOCALES.filter((l) => l !== locale).map((l) => (
      <link rel="alternate" hreflang={l} href={`https://verbara.io${localiseHref(route, l)}`} />
    ))}
    <link rel="alternate" hreflang="x-default" href={`https://verbara.io${localiseHref(route, 'es-419')}`} />
  </head>
  <body class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 16.3: Build and visually inspect every page**

```bash
npm run build && npm run preview
```

Open in a browser:
- `http://localhost:4321/`
- `http://localhost:4321/pricing/`
- `http://localhost:4321/developer-license/`
- `http://localhost:4321/legal/eula/`
- `http://localhost:4321/en-US/`
- `http://localhost:4321/pt-BR/`

Expected on each:
- Sticky NavBar at the top with the V logo, nav links, ES/EN/PT switcher (current highlighted in cyan), mobile hamburger on small screens.
- Page body renders existing content (unchanged copy) but on the dark Signal background with Geist Sans typography.
- Footer renders with the 4-column layout and color tokens.

Stop the preview server.

- [ ] **Step 16.4: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "refactor(ui): rewrite Layout to use NavBar + Footer composites"
```

---

## Task 17: Migrate page content to use new primitives

**Files:** `src/pages/index.astro`, `src/pages/pricing.astro`, `src/pages/developer-license.astro`, `src/pages/[lang]/index.astro`, `src/pages/[lang]/pricing.astro`, `src/pages/[lang]/developer-license.astro`, `src/pages/legal/*.astro`, `src/pages/[lang]/legal/*.astro`, `src/components/DeveloperLicenseForm.astro`.

This task swaps hardcoded button/border classes for `<Button>`, `<Card>`, `<Section>`, `<Container>`, `<Heading>`, and `<Badge>` across **every** page. No copy changes; only structural refactor + token classes.

- [ ] **Step 17.1: Migrate `src/pages/index.astro`**

Full replacement (preserves all copy keys, only changes markup):

```astro
---
import Layout from '../layouts/Layout.astro';
import Section from '../components/primitives/Section.astro';
import Container from '../components/primitives/Container.astro';
import Heading from '../components/primitives/Heading.astro';
import Button from '../components/primitives/Button.astro';
import Badge from '../components/primitives/Badge.astro';
import Card from '../components/primitives/Card.astro';
import { getMessages } from '../i18n/messages';
import { getLocaleFromPath, localiseHref } from '../i18n/utils';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getMessages(locale);
---

<Layout>
  <Section>
    <Container size="sm">
      <div class="space-y-6 text-center">
        <Badge variant="mono">MIT SDK · Apache Platform · 0 vulns</Badge>
        <Heading level={1} align="center">{t.landing.hero_title}</Heading>
        <p class="text-xl text-bone-2 text-balance">{t.landing.hero_subtitle}</p>
        <div class="flex flex-wrap justify-center gap-3 pt-4">
          <Button variant="primary" size="lg" href={localiseHref('developer-license', locale)}>
            {t.landing.cta_developer}
          </Button>
          <Button variant="secondary" size="lg" href={localiseHref('pricing', locale)}>
            {t.landing.cta_pricing}
          </Button>
        </div>
      </div>
    </Container>
  </Section>

  <Section tone="inset">
    <Container size="md">
      <div class="space-y-10">
        <Heading level={2} align="center" eyebrow={t.landing.why_title}>
          {t.landing.why_subtitle}
        </Heading>
        <div class="grid gap-6 md:grid-cols-3">
          <Card as="article">
            <h3 class="text-lg font-semibold mb-2">{t.landing.why_b1_title}</h3>
            <p class="text-sm text-bone-2 leading-relaxed">{t.landing.why_b1_body}</p>
          </Card>
          <Card as="article">
            <h3 class="text-lg font-semibold mb-2">{t.landing.why_b2_title}</h3>
            <p class="text-sm text-bone-2 leading-relaxed">{t.landing.why_b2_body}</p>
          </Card>
          <Card as="article">
            <h3 class="text-lg font-semibold mb-2">{t.landing.why_b3_title}</h3>
            <p class="text-sm text-bone-2 leading-relaxed">{t.landing.why_b3_body}</p>
          </Card>
        </div>
      </div>
    </Container>
  </Section>

  <Section>
    <Container size="md">
      <div class="space-y-8">
        <Heading level={2} align="center" eyebrow={t.landing.stack_title}>
          {t.landing.stack_subtitle}
        </Heading>
        <div class="overflow-x-auto rounded-lg border border-line-strong">
          <table class="w-full text-sm">
            <thead class="bg-ink-3">
              <tr>
                <th class="text-left px-4 py-3 font-medium">Repository</th>
                <th class="text-left px-4 py-3 font-medium">License</th>
                <th class="text-left px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line">
              <tr>
                <td class="px-4 py-3 font-medium"><a href="https://github.com/verbara/Verbara.Sdk" class="hover:text-signal">Verbara Sdk</a></td>
                <td class="px-4 py-3"><Badge variant="success">MIT</Badge></td>
                <td class="px-4 py-3 text-bone-2">{t.landing.stack_role_sdk}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Verbara Web</td>
                <td class="px-4 py-3"><Badge variant="info">Apache 2.0</Badge></td>
                <td class="px-4 py-3 text-bone-2">{t.landing.stack_role_web}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Verbara Platform</td>
                <td class="px-4 py-3"><Badge variant="info">Apache 2.0</Badge></td>
                <td class="px-4 py-3 text-bone-2">{t.landing.stack_role_platform}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Verbara Sdk Pro</td>
                <td class="px-4 py-3"><Badge variant="warning">Commercial</Badge></td>
                <td class="px-4 py-3 text-bone-2">{t.landing.stack_role_pro}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  </Section>
</Layout>
```

- [ ] **Step 17.2: Migrate `src/pages/[lang]/index.astro`**

Read the existing file:
```bash
cat 'src/pages/[lang]/index.astro'
```

Note its frontmatter — it may use `Astro.params.lang` rather than parsing the URL. Preserve whatever locale-derivation pattern is already there. Then replace the body markup with the **same JSX** as Step 17.1's index (from `<Layout>` through `</Layout>`), keeping only that file's existing `locale` and `t` derivation in the frontmatter.

After replacement, diff to confirm structural parity:

```bash
diff <(sed -n '/^---$/,/^---$/!p' src/pages/index.astro) \
     <(sed -n '/^---$/,/^---$/!p' 'src/pages/[lang]/index.astro')
```

Expected: empty diff (the two files share identical body markup; only frontmatter differs).

- [ ] **Step 17.3: Migrate `src/pages/pricing.astro` and `src/pages/[lang]/pricing.astro`**

Replace the outer `<section>` with `<Section><Container size="lg">`, replace the heading block with `<Heading level={1} align="center" eyebrow={t.pricing.title}>...{t.pricing.subtitle}</Heading>`, swap CTA `<a>` for `<Button>`, swap card borders for the token classes (`border-line-strong`, `bg-ink-3/40`, etc.). Tier card structure is unchanged in Phase A — Phase C rebuilds it.

- [ ] **Step 17.4: Migrate `src/pages/developer-license.astro` and `src/pages/[lang]/developer-license.astro`**

Wrap their content in `<Section><Container size="sm">` (same pattern as Step 17.1 hero section). Add the imports for `Section` and `Container` to each file's frontmatter.

Then update `src/components/DeveloperLicenseForm.astro` to use the new tokens. **First read the current file** to know what you're modifying:

```bash
cat src/components/DeveloperLicenseForm.astro
```

Apply these substitutions consistently:

| Old class pattern | Replacement |
|---|---|
| `border-black/5`, `border-black/10` | `border-line-strong` |
| `border-white/10`, `border-white/20` | `border-line-strong` |
| `dark:border-white/...` | (drop the `dark:` modifier; keep no fallback) |
| `bg-white`, `bg-white/...` | `bg-ink-3` |
| `dark:bg-...` | (drop the `dark:` modifier) |
| `text-black/...` | `text-bone` |
| `dark:text-...` | (drop) |
| Submit button (any `<button type="submit">` with hardcoded styles) | replace with `<Button variant="primary" type="submit" size="lg">…</Button>` and add the import |
| Error message containers | `text-sm text-error` |
| Success message containers | `text-sm text-success` |

Do **not** touch the form's logic, IDs, names, or its `action`/`method`/`fetch` calls. Functional behavior must be byte-identical.

After editing, build and submit a test request locally:

```bash
npm run build && npm run preview
```

Open `http://localhost:4321/developer-license/`, submit the form with a junk email, and confirm:
- The form posts to `/api/developer-license/` (check network tab).
- The visual styling now uses Signal tokens.
- Turnstile widget renders (it may show a dev-mode warning — that's fine).

- [ ] **Step 17.5: Migrate `src/pages/legal/*.astro` (3 files) and `src/pages/[lang]/legal/*.astro` (3 files)**

Wrap each in `<Section><Container size="sm">`. The body remains placeholder until Phase D applies `LegalDoc` — Phase A only ensures they render on the new tokens.

- [ ] **Step 17.6: Remove the transitional aliases from `global.css`**

In `src/styles/global.css`, **delete** the bridge block added in Task 7:

```css
:root {
  --color-bg: var(--color-ink);
  --color-fg: var(--color-bone);
}
```

(Plus its preceding "Transitional aliases" comment.) These are no longer needed because every page now uses Signal tokens directly.

- [ ] **Step 17.7: Build and visually inspect every page**

```bash
npm run build && npm run preview
```

Walk every page in every locale (18 URLs total — 6 page types × 3 locale prefixes) and verify:
- No hardcoded `border-black/`, `bg-white/`, `dark:` classes remain (grep below).
- No references to `--color-bg` or `--color-fg` remain (the bridge aliases are gone).
- All buttons render via the Button primitive.
- Pages still scroll correctly, tables still wrap on mobile.

```bash
grep -rn "border-black\|bg-white\|dark:\|--color-bg\|--color-fg" src/ public/ 2>/dev/null
```

Expected: zero matches in `src/pages/`, `src/components/`, `src/layouts/`, `src/styles/`. (Ignore matches inside `node_modules/` if any leak through.)

- [ ] **Step 17.8: Commit**

```bash
git add src/pages/ src/components/ src/layouts/ src/styles/global.css
git commit -m "refactor(ui): migrate all pages to design-system primitives + Signal tokens"
```

---

## Task 18: i18n parity check script

**Files:** `scripts/check-i18n-parity.mjs` (new).

- [ ] **Step 18.1: Write the failing test first**

Create a temporary test fixture: edit `src/i18n/messages.ts` and **delete one key** from the `en-US` block (e.g., remove `nav.product` from English only). Save the file. Don't commit.

- [ ] **Step 18.2: Create the parity check**

Create `scripts/`:

```bash
mkdir -p scripts
```

Then write `scripts/check-i18n-parity.mjs`:

```javascript
#!/usr/bin/env node
import { LOCALES, MESSAGES } from '../src/i18n/messages.ts';

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

const reference = LOCALES[0];
const refKeys = new Set(Object.keys(flatten(MESSAGES[reference])));

let failed = false;
for (const locale of LOCALES) {
  const flat = flatten(MESSAGES[locale]);
  const keys = new Set(Object.keys(flat));

  const missing = [...refKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !refKeys.has(k));
  const empty = Object.entries(flat).filter(([, v]) => v === '' || v == null).map(([k]) => k);

  if (missing.length || extra.length || empty.length) {
    failed = true;
    console.error(`\n[i18n parity] ${locale}:`);
    if (missing.length) console.error('  missing:', missing);
    if (extra.length)   console.error('  extra:  ', extra);
    if (empty.length)   console.error('  empty:  ', empty);
  }
}

if (failed) {
  console.error('\ni18n parity check FAILED.');
  process.exit(1);
}
console.log(`i18n parity OK across ${LOCALES.length} locales (${refKeys.size} keys each).`);
```

- [ ] **Step 18.3: Determine how to import a `.ts` file from a node script**

The script imports `../src/i18n/messages.ts`. Plain Node 22 does not support `.ts` imports. Use `tsx` to run it:

```bash
npm install --save-dev tsx
```

Update `package.json` script to use tsx:

```json
    "test:i18n": "tsx scripts/check-i18n-parity.mjs",
```

- [ ] **Step 18.4: Verify the script catches the broken state**

We still have the deleted `en-US` `nav.product` key from Step 18.1.

Run:
```bash
npm run test:i18n
```

Expected: exits 1, prints `[i18n parity] en-US:` with `missing: ['nav.product']`.

- [ ] **Step 18.5: Restore the missing key in `messages.ts`**

```bash
git checkout src/i18n/messages.ts
```

- [ ] **Step 18.6: Verify the parity check passes**

```bash
npm run test:i18n
```

Expected: `i18n parity OK across 3 locales (N keys each).`

- [ ] **Step 18.7: Commit**

```bash
git add scripts/check-i18n-parity.mjs package.json package-lock.json
git commit -m "test(i18n): add parity script enforcing key coverage across 3 locales"
```

---

## Task 19: Playwright smoke tests

**Files:** `tests/e2e/smoke.spec.ts` (new), `tests/e2e/locale-switcher.spec.ts` (new).

- [ ] **Step 19.1: Create test directory**

```bash
mkdir -p tests/e2e
```

- [ ] **Step 19.2: Write `tests/e2e/smoke.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/',                       title: /Verbara/, h1: /.+/ },
  { path: '/pricing/',               title: /Pricing|Precios|Preços|Verbara/, h1: /.+/ },
  { path: '/developer-license/',     title: /Verbara/, h1: /.+/ },
  { path: '/legal/eula/',            title: /Verbara/, h1: /.+/ },
  { path: '/legal/privacy/',         title: /Verbara/, h1: /.+/ },
  { path: '/legal/terms/',           title: /Verbara/, h1: /.+/ },
];

const LOCALE_PREFIXES = ['', '/en-US', '/pt-BR'];

for (const prefix of LOCALE_PREFIXES) {
  for (const page of PAGES) {
    const url = `${prefix}${page.path}`;
    test(`smoke: ${url} renders`, async ({ page: pw }) => {
      const errors: string[] = [];
      pw.on('pageerror', (e) => errors.push(e.message));
      pw.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

      const response = await pw.goto(url, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      await expect(pw).toHaveTitle(page.title);
      await expect(pw.locator('h1').first()).toBeVisible();
      await expect(pw.locator('header nav')).toBeVisible();
      await expect(pw.locator('footer')).toBeVisible();

      expect(errors, `console errors on ${url}: ${errors.join(' | ')}`).toEqual([]);
    });
  }
}
```

- [ ] **Step 19.3: Write `tests/e2e/locale-switcher.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test('locale switcher: ES → EN preserves route', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-419');

  await page.locator('header a[aria-current="page"]').first().waitFor();
  await page.locator('header a:has-text("EN")').click();
  await page.waitForURL(/\/en-US\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
});

test('locale switcher: EN → PT on pricing preserves route', async ({ page }) => {
  await page.goto('/en-US/pricing/');
  await page.locator('header a:has-text("PT")').click();
  await page.waitForURL(/\/pt-BR\/pricing\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('mobile menu opens on small viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const toggle = page.locator('#nav-mobile-toggle');
  const panel = page.locator('#nav-mobile-panel');

  await expect(toggle).toBeVisible();
  await expect(panel).toBeHidden();

  await toggle.click();
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
```

- [ ] **Step 19.4: Run all e2e tests**

```bash
npm run build
npm run test:e2e
```

Expected count: 6 pages × 3 locale prefixes = **18 smoke tests** + **3 locale-switcher/menu tests** = **21 tests** × 3 browsers = **63 test cases**, all green. If any locale's pricing title doesn't match the regex, tighten the regex — don't loosen the assertion.

- [ ] **Step 19.5: Commit**

```bash
git add tests/e2e/
git commit -m "test(e2e): add playwright smoke + locale-switcher + mobile-menu tests"
```

---

## Task 20: Lighthouse audit and threshold tuning

**Files:** `lighthouserc.json` (modify if needed).

- [ ] **Step 20.1: Run Lighthouse against the built site**

```bash
npm run build
npx lhci autorun --collect.staticDistDir=./dist
```

Expected: scores reported for the 6 URLs in `lighthouserc.json`. Read each result.

- [ ] **Step 20.2: For any failing assertion, fix the source**

Common failures and remedies in Phase A:
- **SEO < 100:** missing `meta description` (already in Layout) or invalid `hreflang` — verify the alternate links in Layout produce real URLs.
- **A11y < 95:** missing `aria-label` on icon-only buttons (NavBar mobile toggle has it). Missing landmark roles — verify `<header>`, `<main>`, `<footer>` are present.
- **Performance < 90:** check that fonts have `font-display: swap` (they do). Verify `<link rel="preload">` is *not* needed at this scale (it isn't for 6 woff2 files served from the same origin).

Make the smallest targeted fix. **Do not lower the thresholds**.

- [ ] **Step 20.3: Re-run until all thresholds pass**

```bash
npx lhci autorun --collect.staticDistDir=./dist
```

Expected: all 6 URLs pass all 4 categories.

- [ ] **Step 20.4: Commit any remediation changes**

```bash
git add -A
git commit -m "fix(a11y/seo): satisfy lighthouse thresholds across 6 URLs"
```

If no source fix was required, skip the commit.

---

## Task 21: GitHub Actions CI workflow

**Files:** `.github/workflows/ci.yml` (new).

- [ ] **Step 21.1: Create the workflow**

```bash
mkdir -p .github/workflows
```

`.github/workflows/ci.yml`:

```yaml
name: ci

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm

      - run: npm ci

      - run: npm run check
      - run: npm run lint
      - run: npm run test:i18n
      - run: npm run build
      - run: npm run validate:html

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium firefox webkit
      - run: npm run build
      - run: npm run test:e2e
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  lighthouse:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run test:lhci
```

- [ ] **Step 21.2: Verify the workflow file is valid YAML**

```bash
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/ci.yml','utf8')))" 2>/dev/null || python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"
```

Expected: prints the parsed object without errors. If `js-yaml` and `python3 yaml` are both unavailable, eyeball-check the indentation.

- [ ] **Step 21.3: Run the equivalent locally**

```bash
npm run test:all
```

Expected: every step in `test:all` passes (the script defined in Task 1.3 chains: check + lint + i18n + build + html + e2e + lhci).

- [ ] **Step 21.4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add github-actions workflow for check/lint/i18n/build/e2e/lhci"
```

---

## Task 22: Final verification and Phase A close

- [ ] **Step 22.1: Confirm all tests pass on a clean shell**

```bash
git status
npm run test:all
```

Expected: working tree clean (or only build artifacts ignored). All checks pass.

- [ ] **Step 22.2: Build production bundle and inspect size**

```bash
npm run build
du -sh dist/
ls -lh dist/_astro/*.css | head -5
```

Expected: home HTML + CSS + fonts ≤ ~250 KB total over the wire (compressed). Record actual numbers — Phase B+ will keep this in mind.

- [ ] **Step 22.3: Move the plan from `active/` to `completed/`**

```bash
git mv docs/plans/active/2026-05-09-website-redesign-phase-a-design-system.md docs/plans/completed/
git commit -m "docs(plans): mark phase-a-design-system complete"
```

- [ ] **Step 22.4: Push to origin and open the PR (if PR-driven flow)**

```bash
git push origin main
```

Or, if the workflow is branch-per-phase:

```bash
git checkout -b redesign/phase-a-design-system
git push -u origin redesign/phase-a-design-system
gh pr create --title "redesign(phase-a): design system foundation" --body "Implements Phase A of docs/specs/2026-05-09-website-redesign.md"
```

(The user will choose at execution time whether to push to main or via branch+PR — both are acceptable; the plan does not prescribe.)

---

## Spec coverage check

Each spec section that falls under Phase A scope, mapped to the task that implements it:

| Spec § | Requirement | Task |
|---|---|---|
| §4 | Signal palette as CSS vars | Task 7 |
| §4 | Typography (Geist Sans + Mono self-hosted) | Tasks 6, 7 |
| §4 | Type scale tokens | Task 7 |
| §4 | Light-mode out of scope; remove `prefers-color-scheme` | Task 7 |
| §6 — primitives | Button | Task 8 |
| §6 — primitives | Badge | Task 9 |
| §6 — primitives | Card | Task 10 |
| §6 — primitives | Section | Task 11 |
| §6 — primitives | Container | Task 11 |
| §6 — primitives | Heading | Task 12 |
| §6 — primitives | CodeBlock | Task 13 |
| §6 — composites | NavBar (with locale switcher, mobile hamburger) | Task 14 |
| §6 — composites | Footer (4-column) | Task 15 |
| §3 — layout | Layout uses NavBar + Footer | Task 16 |
| §8 — i18n parity gate | Script + CI | Tasks 18, 21 |
| §9.1 | astro check, ESLint, html-validate | Tasks 1, 2, 3, 21 |
| §9.2 | Playwright e2e (smoke + locale switcher) | Task 19 |
| §9.3 | Lighthouse CI thresholds (Perf 90 / A11y 95 / BP 95 / SEO 100) | Tasks 5, 20, 21 |

**Out of Phase A by design** (deferred to B–E): Hero, AntiPositioningTable, ArchitectureDiagram, CodeProof composite, PricingTeaser, Faq, FinalCta, TierCard, TierGroup, ComparisonMatrix, LegalDoc, logo SVGs, favicons, OG images, and all copy authoring.

---

## Plan complete

Plan saved to `docs/plans/active/2026-05-09-website-redesign-phase-a-design-system.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks. Fast iteration, isolated context per task.
2. **Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints for review.

**Which approach do you want?**
