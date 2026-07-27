# CI: docs/data-only fast-path (ADR-0016)

Docs-only PRs — markdown, OpenSpec-archive `git mv` moves, and data-only changes to
`data/authorized-digests.json` — skip the heavy required CI jobs. A `gate` job in `ci.yml`
classifies the diff (strict fail-closed allowlist, event-specific base) and the heavy jobs
are guarded to skip when the diff is docs-only. A job skipped via `if:` reports `skipped`,
which GitHub treats as satisfying a required check, so the PR still merges in both the
`pull_request` and `merge_group` phases. The diff-relevant required checks still run
unconditionally: `quality` carries the full ledger guard set (`validate:digests` + vitest +
the production build) and `OpenSpec Validate` validates the specs.

**Do not** replace this with a workflow-level `paths-ignore` on a required-context
workflow — that strands the required contexts `Expected` forever and blocks the PR.

Standard, rationale, and the exact guard/classifier: verbara-meta **ADR-0016** (extends
verbara-meta ADR-0003).
