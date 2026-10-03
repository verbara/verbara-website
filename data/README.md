# `authorized-digests.json` — registry of authorized Verbara Platform image digests

This file is the **single source of truth** for which OCI manifest-list digests of
`ghcr.io/verbara/platform` are authorized releases. It is a release ledger: the
daily drift-detection cron re-verifies every `current` entry against the
registry, and `npm run validate:digests` guards its structure.

**It is not embedded in licences.** No licence carries `AuthorizedImageDigests`,
the free Developer licence (Tier 0.5) included (verbara-meta PDR-0003,
2026-10-03 amendment C6). The issuer
(`functions/api/developer-license/index.ts`) used to embed the last 6 `current`
entries into every `.lic`; it no longer reads this file, and issued licences
omit the field entirely — absent, which Pro's `LicenseValidator` reads as "no
image binding".

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
    // Same shape as `current`. Entries move here when superseded; kept for
    // reproducibility (auditability of old `.lic` files that embedded them
    // before licences stopped carrying digests).
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

## Rotation

Licences no longer embed digests, so there is no licence-side window. Keep the
recent releases in `current` and move superseded entries to `deprecated` as
housekeeping, in the same PR that authorizes a new release.

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
4. Optionally move superseded entries to `deprecated` in the same PR for housekeeping.

The daily drift-detection cron in `src/worker.ts` re-fetches each entry's
manifest-list digest from `ghcr.io` and emails `security@verbara.io` if a
recorded digest no longer matches the live registry response (catches
accidental tag-mutation).

## Current state

`current` holds the api and realtime manifest-list digests of the released
Platform versions, re-verified daily by the drift-detection cron. Licences
issued once this change is deployed carry no `AuthorizedImageDigests` claim.
Licences issued earlier may still carry one; they expire on their own (Tier 0.5
lasts 30 days).
