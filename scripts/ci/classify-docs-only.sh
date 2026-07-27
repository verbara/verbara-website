#!/usr/bin/env bash
# classify-docs-only.sh — prints "docs_only=true" | "docs_only=false" (verbara-meta/ADR-0016 §3.4).
# Fail-closed: empty diff or ANY non-allowlisted path => false. Rename/copy => BOTH paths
# classified (--no-renames); a git-diff failure EXITS NON-ZERO so the gate goes red and every
# heavy job runs (§3.2 fail-closed).
#
# website (data-aware) variant:
#  * adds `data/*.json` — the authorized-digests ledger, this repo's highest-frequency PR class
#    (`chore(digests)`; 23 of the last 60 merged PRs). A data change is NOT inert, so the checks
#    that actually validate the ledger stay ALWAYS-RUN in the required `quality` job:
#    `npm run validate:digests` (gates.yaml G5) and `npm test` (vitest loads the real ledger
#    through functions/api/developer-license/authorized-digests.ts).
#  * DENIES src/pages/* and public/* ahead of the allowlist: this is an Astro repo, so a markdown
#    file under src/pages/ is a PUBLISHED ROUTE and anything in public/ ships verbatim into dist/.
#    `**/README.md` alone would fast-path both.
#  * DENIES data/*/* : bash `case` globs cross `/`, so `data/*.json` would otherwise match
#    `data/anything/nested.json`. Only the top-level ledger is inert-by-guard.
# CHANGELOG.md is kept for cross-repo parity only; this repo has no CHANGELOG (website/ADR-0003)
# and the arm is redundant with the top-level *.md arm below.
set -euo pipefail
BASE="${1:?usage: classify-docs-only.sh <base-sha> [head]}"
HEAD="${2:-HEAD}"
if ! raw="$(git -c core.quotePath=false diff --name-only --no-renames "$BASE" "$HEAD")"; then
  echo "classify-docs-only: git diff failed against base '$BASE'" >&2
  exit 1
fi
[ -n "$raw" ] || { echo "docs_only=false"; exit 0; }   # empty diff => fail-closed
mapfile -t files <<< "$raw"
for f in "${files[@]}"; do
  case "$f" in
    src/pages/*|public/*) echo "docs_only=false"; exit 0 ;;  # Astro routes / verbatim assets
    data/*/*)             echo "docs_only=false"; exit 0 ;;  # only TOP-LEVEL data/*.json is the ledger
  esac
  case "$f" in
    docs/*|openspec/*|CHANGELOG.md) continue ;;   # docs + specs (+ changelog: parity only)
    data/*.json) continue ;;                      # the authorized-digests ledger — §4 website row
    */README.md) continue ;;                      # README at any depth (data/README.md is prose)
  esac
  case "$f" in
    */*)  echo "docs_only=false"; exit 0 ;;       # nested non-doc path
    *.md) continue ;;                             # top-level *.md only (NOT **/*.md)
    *)    echo "docs_only=false"; exit 0 ;;       # top-level non-md (gates.yaml, wrangler.toml, ...)
  esac
done
echo "docs_only=true"
