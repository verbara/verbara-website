#!/usr/bin/env node
import { LOCALES, MESSAGES } from '../src/i18n/messages.ts';

/** Flatten a nested message object into dot-path -> leaf-value pairs. */
export function flatten(obj, prefix = '') {
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

/**
 * Pure locale-parity check. Compares every locale's flattened key set against
 * the reference (first) locale and reports missing / extra / empty keys.
 *
 * @param {readonly string[]} locales  ordered locale codes; locales[0] is the reference.
 * @param {Record<string, object>} messages  locale -> nested message object.
 * @returns {{ ok: boolean, refKeyCount: number, problems: Record<string, {missing: string[], extra: string[], empty: string[]}> }}
 */
export function checkParity(locales, messages) {
  const reference = locales[0];
  const refKeys = new Set(Object.keys(flatten(messages[reference])));

  const problems = {};
  let ok = true;
  for (const locale of locales) {
    const flat = flatten(messages[locale]);
    const keys = new Set(Object.keys(flat));

    const missing = [...refKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !refKeys.has(k));
    const empty = Object.entries(flat)
      .filter(([, v]) => v === '' || v == null)
      .map(([k]) => k);

    if (missing.length || extra.length || empty.length) {
      ok = false;
      problems[locale] = { missing, extra, empty };
    }
  }
  return { ok, refKeyCount: refKeys.size, problems };
}

/* c8 ignore start -- CLI entry point; the pure checkParity() above is unit-tested */
/** CLI entry: run parity over the bundled MESSAGES and exit non-zero on drift. */
function main() {
  const { ok, refKeyCount, problems } = checkParity(LOCALES, MESSAGES);
  if (!ok) {
    for (const [locale, { missing, extra, empty }] of Object.entries(problems)) {
      console.error(`\n[i18n parity] ${locale}:`);
      if (missing.length) console.error('  missing:', missing);
      if (extra.length) console.error('  extra:  ', extra);
      if (empty.length) console.error('  empty:  ', empty);
    }
    console.error('\ni18n parity check FAILED.');
    process.exit(1);
  }
  console.error(`i18n parity OK across ${LOCALES.length} locales (${refKeyCount} keys each).`);
}

// Run the CLI only when invoked directly (not when imported by a test).
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
/* c8 ignore stop */
