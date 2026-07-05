# ADR-0003: No CHANGELOG.md / no git tags — releases tracked via authorized-digests + PR titles

- **Status:** Accepted
- **Date:** 2026-07-05
- **Deciders:** Verbara maintainer (Harol A. Reina H.)
- **Related:**
  - ADR-0001 (Marketing Site Stack) — Cloudflare Workers + Static Assets hosting, unchanged
  - `data/authorized-digests.json` — the authorized-image ledger this ADR designates as release-relevant state
  - `chore(digests)` PR convention (e.g. PR #48 authorize Platform v2.15.0, PR #49 authorize Platform v2.16.0)

## Context

This repo deploys continuously: Cloudflare Workers Builds redeploys on every push to `main`
(confirmed working 2026-07-05). There is no versioned artifact analogous to the sibling `.NET`
repos' NuGet packages or container images — the deployed unit is "whatever `main` currently is."

The sibling repos (`Verbara.Sdk`, `Verbara.Sdk.Pro`, `Verbara.Platform`, `Verbara.Platform.Web`)
each maintain a `CHANGELOG.md` and git tags, because each ships discrete versioned
artifacts (NuGet packages, cosign-signed container images) that downstream consumers pin to a
specific version. Those consumers need a changelog to decide whether to upgrade, and a tag to know
exactly what they're running.

This repo has no such consumer. Nothing depends on "verbara-website v3.8.0"; there is no v3.8.0 —
there is only "what's live on verbara.io right now," which is always `main`. The two facts a
maintainer might want a changelog/tag for are already captured elsewhere:

- **What Platform/Web images does the site currently authorize?** → `data/authorized-digests.json`,
  updated via the `chore(digests): authorize <repo> vX.Y.Z (...)` PR convention (see PR #48, #49).
- **What changed and why?** → PR history (titles + descriptions) on `main`.

Adding a `CHANGELOG.md` + tag ceremony here would duplicate `authorized-digests.json` and PR
history with no additional consumer to serve — pure ceremony, not signal.

## Decision

`verbara-website` does **not** maintain a `CHANGELOG.md` and does **not** cut git tags.
Release-relevant state lives in two places instead:

- **`data/authorized-digests.json`** — the source of truth for which Platform/Web image digests
  this site currently authorizes/references, kept current via the existing `chore(digests)` PR
  convention.
- **PR history on `main`** — the record of what changed, when, and why; continuous deploy means
  every merged PR to `main` is already "released" the moment Cloudflare Workers Builds picks it up.

This is a deliberate deviation from the sibling-repo convention (`Verbara.Sdk`, `Verbara.Sdk.Pro`,
`Verbara.Platform`, `Verbara.Platform.Web` all keep `CHANGELOG.md` + tags), not an oversight.

## Consequences

**Positive:**

- No ceremony maintained for a consumer that doesn't exist — one less file to keep in sync, one
  less "did you bump the changelog?" review comment.
- The two facts that matter (authorized digests, what/why) already have a canonical, current home;
  this ADR just declines to build a third, redundant one.

**Negative:**

- A future maintainer skimming this repo after working in the sibling `.NET` repos may look for a
  `CHANGELOG.md` out of habit and not find one. Mitigated by this ADR being discoverable in
  `docs/decisions/`.
- No single tag names "what was live on verbara.io on date X" — reconstructing that requires
  correlating `main`'s commit history with Cloudflare's deployment log, which is coarser than a tag.
  Acceptable because nothing currently depends on reproducing a historical site state.

**Neutral / trade-off:**

- Trades sibling-repo consistency for not paying versioning overhead where there's no versioned
  artifact to version. Acceptable because the repo's own `openspec/config.yaml` context already
  documents this repo as standalone in the ecosystem (does not consume the SDK/Pro/Platform
  packages, not part of the dependency chain).

## Alternatives considered

- **Adopt the sibling convention verbatim** (CHANGELOG.md + tag per notable change). Rejected: no
  consumer pins to a verbara-website version; the ceremony would track nothing anyone reads.
- **Tag only on `authorized-digests.json` updates** (treat digest-authorization PRs as "releases").
  Rejected for now: the PR itself (title + diff) already carries that information at the same
  granularity a tag would; a tag would be a pointer to information already at the tip of `main`.
- **CHANGELOG without tags** (prose log, no version ceremony). Rejected: still duplicates PR
  history with no consumer, and drifts the moment someone forgets to update it — worse than not
  having one.

## Revisit trigger

Revisit this decision if the site ever ships a versioned artifact of its own (e.g., a publishable
package, a downloadable SDK/snippet bundle, or any output that a third party would pin to a
specific version rather than always consuming `main`'s current state). At that point, adopt the
sibling-repo `CHANGELOG.md` + git-tag convention for that artifact.
