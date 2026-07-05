# `authorized-digests.json` — registry of authorized Verbara Platform image digests

This file is the **single source of truth** for which OCI manifest-list digests of
`ghcr.io/verbara/platform` are eligible to host Verbara Pro features. The license-
issuance Worker (`functions/api/developer-license/index.ts`) reads it at request
time and embeds the **last 6 entries from `current`** (sorted by `released_at`
descending) into every newly-issued `.lic` file as the
`AuthorizedImageDigests` claim — covered by the same ECDSA signature as the
rest of the license payload.

The matching consumer-side check lives in **Verbara.Sdk.Pro.Licensing** v2.3.x:
`LicenseValidator.Validate(...)` reads the running container's digest from
`/etc/verbara-image-digest` (preferred) or the `IMAGE_DIGEST` env var
(fallback) and returns `LicenseValidationResult.UnauthorizedImage` when the
running digest is not in the license's `AuthorizedImageDigests` list. Empty
list = back-compat permissive path (no enforcement) for licenses issued before
the registry has any entries, and for `dotnet run` dev-mode where neither file
nor env var is set.

For background, see:
- Pro ADR-0011 — `Verbara.Sdk.Pro/docs/decisions/0011-image-digest-binding-in-license-keys.md`
- Research — `Verbara.Sdk.Pro/docs/research/2026-05-09-pro-image-binding-research.md`
- Execution plan — Sdk.Pro internal plan — private repo

## Schema

```jsonc
{
  "$schema": "https://verbara.io/schemas/authorized-digests-v1.json",
  "current": [
    {
      "platform_version": "v3.0.0",                              // semver tag
      "image_ref":        "ghcr.io/verbara/platform/api:v3.0.0", // canonical pull ref (api|realtime)
      "manifest_list_digest": "sha256:abc...",                   // value cosign signs; covers all archs
      "released_at":      "2026-05-15T00:00:00Z"                 // ISO 8601 UTC
    }
  ],
  "deprecated": [
    // Same shape as `current`. Entries move here when no longer issued in new
    // licenses; kept for reproducibility (auditability of old `.lic` files
    // that referenced them).
  ]
}
```

`$schema` is a forward-declaration. The published JSON Schema document at
`verbara.io/schemas/authorized-digests-v1.json` will be added in a later phase
once the schema stabilises.

## Why **manifest-list** digests, not per-arch digests

`linux/amd64` and `linux/arm64` images produce different per-platform digests.
Customers pull by **manifest-list digest**, which references both. That is
also the value `cosign sign` operates on. Storing the manifest-list digest
means a single entry covers both architectures simultaneously.

The Pro v2.3.x parse-time validator (`LicenseReader.Load`) rejects digests that
do not start with `sha256:` or `sha512:`. It cannot distinguish per-arch from
manifest-list digests by regex — operational discipline at this registry
prevents per-arch entries from being added.

## Rotation cadence — last 6 entries

Each Platform patch release produces a new image digest. The Worker embeds
**only the last 6 entries from `current`** (sorted by `released_at` DESC) into
newly-issued licenses. This avoids unbounded license-payload growth while
giving customers ~6 weeks of patch headroom before they need a license refresh
(at the typical Verbara Platform patch cadence).

When more than 6 entries exist in `current`, the older entries are still
served to consumers running those older Platform versions until the customer
requests a license refresh — but newly-issued licenses no longer authorise
those older digests. After a few rotations, deprecated entries should be
moved from `current` to `deprecated`.

## How to add a new entry

After a new Platform release ships a cosign-signed image:

1. Run `cosign verify` on the published image to confirm the signature is
   valid; capture the manifest-list digest from the verified output.
2. Append a new object to the `current` array with:
   - `platform_version` — the semver tag (e.g. `v3.0.1`)
   - `image_ref` — the canonical pull reference
   - `manifest_list_digest` — the SHA-256 manifest-list digest (`sha256:...`)
   - `released_at` — ISO 8601 UTC timestamp of the release
3. Open a PR titled `chore(digests): authorize Platform vX.Y.Z (api + realtime), deprecate vX.Y.Z`
   (actual convention in use — see merged PR history). Merging the PR triggers a Worker re-deploy
   via Cloudflare Workers Builds auto-deploy on push to `main`.
4. If `current.length` exceeds 6, optionally move the oldest non-current entry
   to `deprecated` in the same PR for housekeeping.

The daily drift-detection cron in `src/worker.ts` re-fetches each entry's
manifest-list digest from `ghcr.io` and emails `security@verbara.io` if a
recorded digest no longer matches the live registry response (catches
accidental tag-mutation).

## Current state

`current` is no longer empty: the image-binding execution plan shipped, and the registry now
holds the last-6-entries rotation described above (currently 2 entries — the api and realtime
manifest-list digests for the latest released Platform version, v2.16.0). Every issued `.lic`
carries a non-empty `AuthorizedImageDigests` claim, activating Layer C of the F+B+C defense
stack for Pro v2.3.x+ consumers. Older `.lic` files issued before the registry had entries (or
issued when `dotnet run` dev-mode has neither `/etc/verbara-image-digest` nor `IMAGE_DIGEST` set)
still fall back to the back-compat permissive path (no enforcement).
