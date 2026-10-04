/**
 * Authorized image-digest registry — the release ledger in
 * `data/authorized-digests.json`.
 *
 * Reads the bundled `data/authorized-digests.json` (esbuild inlines it into the
 * Worker bundle at deploy time — no runtime fetch) for the daily
 * drift-detection cron (`src/drift-detection.ts`), which re-resolves each
 * `current` digest against ghcr.io.
 *
 * The licence issuer no longer reads it: no licence carries
 * `AuthorizedImageDigests` (verbara-meta PDR-0003, 2026-10-03 amendment C6),
 * so the former last-6 selection that fed the `.lic` was removed. The
 * ledger's structural guard is `npm run validate:digests`.
 */

// Bundler note: Wrangler/esbuild inlines this JSON at build time. The path is
// relative to this .ts file. tsconfig has `resolveJsonModule: true`. The file
// lives at `<repo-root>/data/authorized-digests.json` — three `..` segments up
// from `functions/api/developer-license/`.
import digestsRegistry from '../../../data/authorized-digests.json';

/** Schema of one entry in `data/authorized-digests.json` `current`/`deprecated` arrays. */
export interface AuthorizedDigestEntry {
  platform_version: string;
  image_ref: string;
  manifest_list_digest: string;
  released_at: string; // ISO 8601 UTC
}

/** Schema of the whole `data/authorized-digests.json` file. */
export interface AuthorizedDigestsRegistry {
  $schema?: string;
  current: AuthorizedDigestEntry[];
  deprecated: AuthorizedDigestEntry[];
}

/** Re-export the bundled registry so the drift-detection cron can reach it. */
export function loadRegistry(): AuthorizedDigestsRegistry {
  return digestsRegistry as AuthorizedDigestsRegistry;
}
