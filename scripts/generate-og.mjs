#!/usr/bin/env node
/**
 * Generates the universal OG image PNG from public/og/_template.svg.
 * Run: npm run brand:og
 *
 * Output: public/og/og-default.png (1200×630)
 *
 * Note: SVG <text> rendering quality depends on whether the named fonts
 * are installed on the build machine. Geist Sans falls back to system
 * sans-serif if not present. For consistent output across environments,
 * install Geist Sans system-wide OR commit the rendered PNG (this script's
 * approach: commit the PNG, regenerate when source changes).
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const sourceSvg = resolve(root, 'public/og/_template.svg');
const outPng = resolve(root, 'public/og/og-default.png');

async function main() {
  await sharp(sourceSvg, { density: 300 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(outPng);
  console.log(`✓ ${outPng}`);
}

main().catch((err) => {
  console.error('generate-og failed:', err);
  process.exit(1);
});
