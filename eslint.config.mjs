import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

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
  // Node.js build/generator scripts: expose Node globals and relax console rule
  {
    files: ['scripts/**/*.mjs', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
    },
  },
];
