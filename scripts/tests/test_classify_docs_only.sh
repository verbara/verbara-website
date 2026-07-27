#!/usr/bin/env bash
# test_classify_docs_only.sh — unit tests for scripts/ci/classify-docs-only.sh
# (verbara-meta/ADR-0016 §3.4). Each case builds a throwaway git repo and asserts the verdict over
# the WHOLE $SEED..HEAD range — which is what CI diffs (pull_request.base.sha .. github.sha).
# Wave-1's harness diffed HEAD~1..HEAD, so its multi-file cases only ever tested the LAST commit
# and passed for the wrong reason; commit_many() + the seed range fix that. Pure bash + git, ~2s.
# Runs in the ALWAYS-RUN, REQUIRED `quality` job.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLASSIFY="$SCRIPT_DIR/../ci/classify-docs-only.sh"
fails=0; pass=0
ok()   { pass=$((pass + 1)); }
bad()  { echo "FAIL: $1"; fails=$((fails + 1)); }

new_repo() { # new_repo [seed-file ...]
  WORK="$(mktemp -d)"
  git -C "$WORK" init -q
  git -C "$WORK" config user.email t@t.t
  git -C "$WORK" config user.name t
  local f
  for f in "$@"; do mkdir -p "$WORK/$(dirname "$f")"; printf 'seed %s\n' "$f" > "$WORK/$f"; done
  git -C "$WORK" add -A
  git -C "$WORK" commit -q --allow-empty -m seed
  SEED="$(git -C "$WORK" rev-parse HEAD)"
}
commit_many() { # commit_many <file> [file...] — ONE commit, N paths (the real PR shape)
  local p
  for p in "$@"; do mkdir -p "$WORK/$(dirname "$p")"; printf 'x\n' > "$WORK/$p"; done
  git -C "$WORK" add -A; git -C "$WORK" commit -q -m "change $*"
}
run_case() { # run_case <expected> <description>
  local expected="$1" desc="$2" out
  out="$(cd "$WORK" && bash "$CLASSIFY" "$SEED" "$(git -C "$WORK" rev-parse HEAD)")"
  [ "$out" = "docs_only=$expected" ] && ok || bad "$desc — expected docs_only=$expected, got '$out'"
}

# --- contract ---
[ -x "$CLASSIFY" ] && ok || bad "classifier must be committed executable (mode 100755)"

# --- true cases (allowlisted) ---
new_repo; commit_many docs/guide.md;                         run_case true  "docs/ top level"
new_repo; commit_many docs/decisions/0004-x.md;              run_case true  "docs/ nested"
new_repo; commit_many openspec/changes/x/proposal.md;        run_case true  "openspec/ nested"
new_repo; commit_many openspec/config.yaml;                  run_case true  "openspec/ non-md (OpenSpec Validate is always-run)"
new_repo; commit_many README.md;                             run_case true  "top-level README.md"
new_repo; commit_many CONTRIBUTING.md;                       run_case true  "top-level *.md"
new_repo; commit_many data/README.md;                        run_case true  "data/README.md is prose documenting the ledger format"
new_repo; commit_many data/authorized-digests.json;          run_case true  "the ledger — the chore(digests) PR class"
new_repo; commit_many data/authorized-digests.json docs/operations/issuer-setup.md
run_case true "MULTI-PATH data + docs in one commit"
new_repo; commit_many README.md data/README.md docs/specs/x.md
run_case true "MULTI-PATH prose sweep (PR #52 shape)"
new_repo; commit_many "docs/café.md";                        run_case true  "non-ASCII path (core.quotePath=false)"

# --- false cases: Astro / data hardening (deny arms placed BEFORE the allowlist) ---
new_repo; commit_many src/pages/README.md;                   run_case false "src/pages/ markdown is a PUBLISHED ROUTE, not docs"
new_repo; commit_many src/pages/notes.md;                    run_case false "any src/pages/ markdown is a route"
new_repo; commit_many public/README.md;                      run_case false "public/ ships verbatim into dist/"
new_repo; commit_many data/nested/plans.json;                run_case false "bash case globs cross / — only TOP-LEVEL data/*.json is the ledger"
new_repo; commit_many data/schema.yaml;                      run_case false "data/ non-json is not the ledger"

# --- false cases (fail-closed) ---
new_repo; commit_many src/worker.ts;                         run_case false "nested code file"
new_repo; commit_many src/pages/index.astro;                 run_case false "an Astro page"
new_repo; commit_many functions/api/developer-license/index.ts
run_case false "Cloudflare Pages Function (the licensing edge backend)"
new_repo; commit_many package.json;                          run_case false "top-level non-md"
new_repo; commit_many wrangler.toml;                         run_case false "deploy config"
new_repo; commit_many astro.config.mjs;                      run_case false "build config"
new_repo; commit_many coverage-floor.json;                   run_case false "top-level *.json is NOT allowlisted (only data/*.json)"
new_repo; commit_many gates.yaml;                            run_case false "top-level yaml is deliberately fail-closed (PR #69 shape)"
new_repo; commit_many src/notes.md;                          run_case false "nested non-README .md (blanket **/*.md is BANNED)"
new_repo; commit_many .github/workflows/ci.yml;              run_case false "workflow change (self-validation: the rollout PR is NOT docs-only)"
new_repo; commit_many scripts/ci/classify-docs-only.sh;      run_case false "the classifier itself"
new_repo; commit_many scripts/tests/test_classify_docs_only.sh
run_case false "the classifier's own tests"
new_repo; commit_many data/authorized-digests.json src/worker.ts
run_case false "MULTI-PATH data + code"
new_repo; commit_many docs/a.md src/worker.ts
run_case false "MULTI-PATH docs + code (docs first)"
new_repo; commit_many src/worker.ts docs/a.md
run_case false "MULTI-PATH code + docs (docs last — order must not matter)"

# rename CODE -> DOCS: without --no-renames git prints ONLY the destination (docs/...) and this
# would read TRUE. This is the real --no-renames pin; the docs->code direction is false either way.
new_repo src/old.ts
mkdir -p "$WORK/docs"
git -C "$WORK" mv src/old.ts docs/new.md
git -C "$WORK" commit -q -m "rename src/old.ts -> docs/new.md"
run_case false "rename CODE->DOCS classifies both paths (--no-renames pin)"
new_repo docs/old.md
mkdir -p "$WORK/src"
git -C "$WORK" mv docs/old.md src/new.ts
git -C "$WORK" commit -q -m "rename docs/old.md -> src/new.ts"
run_case false "rename DOCS->CODE classifies both paths"

# --- exit-code contract (fail-closed at the gate) ---
new_repo; commit_many docs/a.md
(cd "$WORK" && bash "$CLASSIFY" "$SEED" "$SEED") | grep -qx 'docs_only=false' && ok || bad "empty diff => docs_only=false"
if (cd "$WORK" && bash "$CLASSIFY" "" >/dev/null 2>&1); then bad "empty BASE must exit non-zero"; else ok; fi
if (cd "$WORK" && bash "$CLASSIFY" deadbeefdeadbeef HEAD >/dev/null 2>&1); then bad "unreachable base must exit non-zero"; else ok; fi

echo "---"; echo "passed=$pass failed=$fails"
[ "$fails" -eq 0 ] || exit 1
echo "OK"
