import { defineConfig } from 'vitest/config';

// Vitest unit-test tier for verbara-website (ADR-0014 §2 G3 / verbara-meta
// ADR-0013 coverage-gate-v2). This repo is an Astro marketing site — the vast
// majority of the tree is .astro templates and pages that are covered by the
// e2e / i18n / Lighthouse tiers. This unit tier targets ONLY the testable,
// framework-free TypeScript/ESM logic: the security-critical validators, the
// Cloudflare Worker license/drift logic, and the i18n path helpers.
//
// The coverage triplet (verbara-meta/ADR-0013) reads the v8 report emitted
// here: check-coverage-floor.py reads coverage/coverage-summary.json (json-
// summary reporter) and check-patch-coverage.py reads coverage/lcov.info (lcov
// reporter). The numeric `thresholds` below are a redundant fast-fail liveness
// backstop, kept slightly under the achieved coverage (mirrors Web).
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Only the unit tests under tests/unit/**. tests/e2e/** holds Playwright
    // specs that call test.describe() and would crash the vitest collector.
    include: ['tests/unit/**/*.test.{ts,mts}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      // json-summary -> coverage/coverage-summary.json (band gate),
      // lcov         -> coverage/lcov.info            (patch gate),
      // text         -> console readout.
      reporter: ['text', 'json', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      // Scope coverage to the testable non-Astro logic ONLY: the validator +
      // parity scripts, the Cloudflare Pages Functions, and the real-logic
      // src/**/*.ts (drift detection, i18n path helpers). Everything Astro
      // (pages/components/layouts/*.astro) is excluded — it is UI covered by
      // the e2e / Lighthouse tiers, not this unit tier.
      include: [
        'scripts/**/*.mjs',
        'functions/**/*.{ts,js,mjs}',
        'src/drift-detection.ts',
        'src/i18n/utils.ts',
      ],
      exclude: [
        '**/*.astro',
        'src/pages/**',
        'src/components/**',
        'src/layouts/**',
        'src/styles/**',
        'src/i18n/messages.ts',
        'src/worker.ts',
        '**/*.d.ts',
        'dist/**',
        '**/node_modules/**',
        'tests/**',
        'playwright.config.ts',
        'astro.config.mjs',
        'eslint.config.mjs',
        'scripts/generate-icons.mjs',
        'scripts/generate-og.mjs',
      ],
      // Redundant fast-fail liveness backstop (mirrors Web). Kept slightly
      // below the achieved numbers (lines 89.61 / branches 87.93 / functions 95
      // / statements 89.07 at the 2026-07-21 baseline) so it trips only on a
      // real regression; the authoritative gate is coverage-floor.json via the
      // ADR-0013 triplet.
      thresholds: {
        lines: 86,
        functions: 90,
        branches: 84,
        statements: 86,
      },
    },
  },
});
