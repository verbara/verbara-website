/**
 * Authorized image-digest registry — Phase 2.2 of Pro v2.3.x image-binding.
 *
 * Reads the bundled `data/authorized-digests.json` (esbuild inlines it into the
 * Worker bundle at deploy time — no runtime fetch, no I/O on the request hot
 * path) and returns the **last 6 entries from `current`** sorted by
 * `released_at` DESC. The license-issuance handler embeds those digests into
 * the issued `.lic` file as the `AuthorizedImageDigests` claim, which Pro
 * v2.3.x consumers verify against `/etc/verbara-image-digest` at startup.
 *
 * Empty registry → empty array → handler omits the field entirely from the
 * canonical JSON (preserves byte-for-byte signature parity with v2.2.0-pro
 * licenses; same back-compat path Pro consumers respect).
 *
 * Wire-format contract: see Pro ADR-0011, ADR-0010, and
 * `LicenseValidator.CanonicalJson` in Verbara.Sdk.Pro.Licensing v2.3.x.
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

/**
 * Cap on how many digests get embedded into a single license, per Pro
 * research §6 rotation cadence — last 6 published digests (~6 weeks of patch
 * headroom at typical Verbara Platform release cadence).
 */
export const MAX_EMBEDDED_DIGESTS = 6;

/**
 * Returns the last {@link MAX_EMBEDDED_DIGESTS} `manifest_list_digest` values
 * from the registry's `current` array, sorted by `released_at` DESCENDING
 * (most recent first). When the registry has fewer than the cap, returns all
 * of them. When the registry is empty, returns an empty array.
 *
 * Callers should treat an empty return as the back-compat permissive path —
 * omit `AuthorizedImageDigests` from the canonical license payload entirely.
 */
export function selectAuthorizedDigests(
  registry: AuthorizedDigestsRegistry = digestsRegistry as AuthorizedDigestsRegistry,
): string[] {
  const current = Array.isArray(registry.current) ? registry.current : [];
  if (current.length === 0) return [];

  const sorted = [...current].sort((a, b) =>
    b.released_at.localeCompare(a.released_at),
  );
  return sorted
    .slice(0, MAX_EMBEDDED_DIGESTS)
    .map((entry) => entry.manifest_list_digest);
}

/** Re-export the bundled registry so the drift-detection cron can reach it. */
export function loadRegistry(): AuthorizedDigestsRegistry {
  return digestsRegistry as AuthorizedDigestsRegistry;
}

// TODO(test-infra): when a test framework (Vitest) lands, add unit tests for
// `selectAuthorizedDigests`:
//   - returns [] when registry.current is empty
//   - returns all entries (mapped to manifest_list_digest) when current.length <= 6
//   - returns the 6 most-recent entries when current.length > 6
//   - sorts by released_at DESC (older entry returned later than newer)
//   - tolerates a registry where `current` is missing or malformed (returns [])
