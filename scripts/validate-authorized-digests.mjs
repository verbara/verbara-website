#!/usr/bin/env node
/**
 * Guard for data/authorized-digests.json — the published authoritative list of authentic
 * Verbara Platform image digests (security-critical: customers verify pulls against it).
 *
 * This is an EDIT-TIME structural guard (runs in CI on every PR). It is complementary to
 * src/drift-detection.ts, which is a RUNTIME Cloudflare cron that re-resolves the live
 * registry digests post-deploy. Here we only check that a hand-edit is well-formed:
 * no malformed/forged-looking digest, no version/tag mismatch, no duplicates, clean shape.
 *
 * Exits non-zero (and prints every problem) if the file is invalid.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const REQUIRED_KEYS = ['platform_version', 'image_ref', 'manifest_list_digest', 'released_at'];
export const VERSION_RE = /^v\d+\.\d+\.\d+$/;
export const DIGEST_RE = /^sha256:[0-9a-f]{64}$/;
export const IMAGE_REF_RE = /^ghcr\.io\/verbara\/platform\/(api|realtime):(.+)$/;

/**
 * Pure structural validator for a parsed authorized-digests document.
 *
 * Returns the list of problems (empty === valid) plus the derived summary
 * counts, so it can be unit-tested without touching the filesystem or the
 * process. The CLI wrapper below reads the file, calls this, and translates
 * the result into console output + an exit code.
 *
 * @param {unknown} doc  the parsed JSON document.
 * @returns {{ errors: string[], current: number, deprecated: number, uniqueImageRefs: number }}
 */
export function validateDigests(doc) {
  const errors = [];
  const err = (msg) => errors.push(msg);

  for (const group of ['current', 'deprecated']) {
    if (!Array.isArray(doc?.[group])) err(`top-level "${group}" must be an array`);
  }

  const seenImageRefs = new Map(); // image_ref -> "group[i]"
  const versionsByGroup = { current: new Set(), deprecated: new Set() };

  for (const group of ['current', 'deprecated']) {
    const entries = Array.isArray(doc?.[group]) ? doc[group] : [];
    entries.forEach((e, i) => {
      const at = `${group}[${i}]`;
      if (typeof e !== 'object' || e === null) {
        err(`${at}: entry must be an object`);
        return;
      }
      const keys = Object.keys(e);
      for (const k of REQUIRED_KEYS) if (!(k in e)) err(`${at}: missing key "${k}"`);
      for (const k of keys) if (!REQUIRED_KEYS.includes(k)) err(`${at}: unexpected key "${k}"`);

      if (typeof e.platform_version === 'string' && !VERSION_RE.test(e.platform_version))
        err(`${at}: platform_version "${e.platform_version}" must match vX.Y.Z`);

      if (typeof e.manifest_list_digest === 'string' && !DIGEST_RE.test(e.manifest_list_digest))
        err(`${at}: manifest_list_digest "${e.manifest_list_digest}" must be sha256:<64 hex>`);

      if (typeof e.image_ref === 'string') {
        const m = IMAGE_REF_RE.exec(e.image_ref);
        if (!m) {
          err(`${at}: image_ref "${e.image_ref}" must be ghcr.io/verbara/platform/(api|realtime):<version>`);
        } else if (m[2] !== e.platform_version) {
          err(`${at}: image_ref tag "${m[2]}" must equal platform_version "${e.platform_version}"`);
        }
        const prev = seenImageRefs.get(e.image_ref);
        if (prev) err(`${at}: duplicate image_ref "${e.image_ref}" (also at ${prev})`);
        else seenImageRefs.set(e.image_ref, at);
      }

      if (typeof e.released_at === 'string') {
        const d = new Date(e.released_at);
        if (!e.released_at.endsWith('Z') || Number.isNaN(d.getTime()))
          err(`${at}: released_at "${e.released_at}" must be an ISO-8601 UTC timestamp (…Z)`);
      }

      if (typeof e.platform_version === 'string') versionsByGroup[group].add(e.platform_version);
    });
  }

  for (const v of versionsByGroup.current)
    if (versionsByGroup.deprecated.has(v))
      err(`version "${v}" appears in BOTH current and deprecated`);

  const n = (g) => (Array.isArray(doc?.[g]) ? doc[g].length : 0);
  return {
    errors,
    current: n('current'),
    deprecated: n('deprecated'),
    uniqueImageRefs: seenImageRefs.size,
  };
}

/* c8 ignore start -- CLI entry point; the pure validateDigests() above is unit-tested */
/** CLI entry: read data/authorized-digests.json, validate, print, exit. */
function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const file = join(root, 'data', 'authorized-digests.json');

  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch (e) {
    console.error(`::error::cannot read ${file}: ${e.message}`);
    process.exit(1);
  }

  let doc;
  try {
    doc = JSON.parse(raw);
  } catch (e) {
    console.error(`::error::data/authorized-digests.json is not valid JSON: ${e.message}`);
    process.exit(1);
  }

  const result = validateDigests(doc);
  if (result.errors.length) {
    console.error(`authorized-digests.json: ${result.errors.length} problem(s):`);
    for (const e of result.errors) console.error(`::error::${e}`);
    process.exit(1);
  }

  console.log(
    `authorized-digests.json OK — ${result.current} current, ${result.deprecated} deprecated, ${result.uniqueImageRefs} unique image refs.`,
  );
}

// Run the CLI only when invoked directly (not when imported by a test).
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
/* c8 ignore stop */
