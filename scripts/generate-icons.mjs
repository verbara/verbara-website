#!/usr/bin/env node
/**
 * Generates favicon + apple-touch-icon + PWA icons from
 * `public/favicon.svg` (the source-of-truth ink-background V-mark).
 *
 * Run: npm run brand:icons
 *
 * Outputs (overwrites if present):
 *   public/favicon.ico          16x16 + 32x32 multi-size
 *   public/apple-touch-icon.png 180x180 (iOS home screen)
 *   public/icon-192.png         192x192 (PWA standard)
 *   public/icon-512.png         512x512 (PWA standard, splash)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const sourceSvg = resolve(root, 'public/favicon.svg');
const outICO = resolve(root, 'public/favicon.ico');
const outApple = resolve(root, 'public/apple-touch-icon.png');
const out192 = resolve(root, 'public/icon-192.png');
const out512 = resolve(root, 'public/icon-512.png');

async function main() {
  const svg = await readFile(sourceSvg);

  // 16x16 + 32x32 PNGs as ICO inputs (kept in memory only)
  const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
  const ico = await pngToIco([png16, png32]);
  await writeFile(outICO, ico);
  console.log(`✓ ${outICO}`);

  // 180x180 apple-touch-icon
  await sharp(svg).resize(180, 180).png().toFile(outApple);
  console.log(`✓ ${outApple}`);

  // 192x192 + 512x512 PWA icons
  await sharp(svg).resize(192, 192).png().toFile(out192);
  console.log(`✓ ${out192}`);

  await sharp(svg).resize(512, 512).png().toFile(out512);
  console.log(`✓ ${out512}`);
}

main().catch((err) => {
  console.error('generate-icons failed:', err);
  process.exit(1);
});
