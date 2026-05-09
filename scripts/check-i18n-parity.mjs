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
