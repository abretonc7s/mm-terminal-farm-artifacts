# PR 181 comment report

Fetched review comments, issue comments, review threads and CI state before edits. One unresolved actionable review comment.

| Source | Author | ID | File:line | Summary | Planned action |
| --- | --- | --- | --- | --- | --- |
| review_comment | cursor[bot] | 4230133698 | src/features/perpetuals/order/queries/fee-quote.ts:35 | Exact live notional keys reset the displayed quote on each price tick. | Preserve the last successful quote across live repricing within the same order and account context; keep clearing it for explicit edits. Add deferred-request regression tests. |

Skipped three status-only issue comments: Vercel permission/deployment status 6079065246, Socket dependency report 6079077121, Sonar passed quality gate 6079272537. Resolved review 4229155854 already fixed and replied to in af81d282; no duplicate reply. Reply 4230097036 is not a new finding. Review bodies contain no additional actionable findings.

CI unit failure is in untouched live-orders-query.test.tsx, two reset-on-disable tests. Investigating against origin/main. Vercel failure reports an account permission problem, not a code failure.

## Proof plan

AC1 state: dependency version, typecheck, changed-file lint and unit tests. AC2 mixed: existing inherited testnet recipe plus regression tests for quote continuity and context isolation. AC3 state: shared notional helper and hook tests. AC4 mixed: inherited HUD-on order recipe and notional/rate/discount unit assertions. AC5 state: inherited changelog review and minimal follow-up diff. Current live-price fix: state tests with pending quotes, exact requested notionals, rendering checks; inherited testnet evidence remains at inputs/inherited/evidence-manifest.json.

## Triage

4230133698: REAL. getFeeNotional correctly follows submitted sizing, but its market-dependent exact value is part of the query key and the hook has no placeholder data. Keep exact notional requests; retain prior successful quote only when all non-market inputs and trading context match. Explicit edits and disabled input must still clear the preview.

4229155854: REAL, already handled. Current order and close callers pass isLoading rather than isPending. Existing regression tests cover idle disabled queries. Resolved thread and previous reply confirmed through GraphQL.

## Self-review

Only fee-quote.ts and fee-quote.test.tsx changed in this pass. Quote keys keep the exact shared-helper notional and add explicit order inputs so placeholder reuse cannot cross order edits, account/network, symbol or order type. No notional rounding, new timer, mirrored state, manual memoization or fee-field recomputation. Deferred-request tests cover consecutive ticks, resolution to the latest quote, and clearing a retained quote on context changes. git diff --check passed.

## Validation in progress

Node v22.22.1. Dependency install hook passed with matching lockfile stamp. Eight affected suites passed 128 tests. New quote suite passed 18 tests again after correcting test fixture types. Changed-file Biome passed all 21 checked PR files. Whole-project typecheck passes with temp/farmslot/tsconfig.typecheck.json, which inherits tracked tsconfig.json and adds only temp/ to its exclusions. Standard lint-changed was run twice; its tsc stage fails solely on downloaded plugin template sources under temp/farmslot/codex-home. Same template errors reproduced in an isolated unmodified origin/main archive; see typecheck-origin-main.log and lint-changed-final.log. No tracked config change.

Restored the missing farm lint-changed.sh from the farm's frozen support bundle and corrected quoted ~ in the ignored slot Node wrapper. Marker calls explicitly invoke the Node 22 wrapper through FARMSLOT_MARK_CMD.

Runtime evidence is inherited from the full testnet recipe in inputs/inherited/report.md and inputs/inherited/evidence-manifest.json. This comment's overlapping-price scenario is proven by deterministic deferred-query tests. No new venue actions or recipe were needed by this PR-complete checklist. Supplemental next-dev-loop browser verification was unavailable: the package offered by npm reports agent-browser 0.27.0, below the skill's 0.31.1 floor. No weaker browser check is claimed as proof.

## Validation results

- Affected unit tests: 8 files, 128 passed. Final quote suite after fixture type fix: 18 passed.
- Negative control: the original hook failed both new consecutive live-price tests. Fixed hook restored afterward.
- Full `test:unit -- --maxWorkers=4 --coverage.include=src/** --coverage.include=electron/**`: 256 files passed, 1,842 tests passed, 7 skipped. Two untouched suites failed: live-orders error-reset at line 716, confirmed pre-existing on unchanged origin/main and historical main CI; wallet-signer failed to import because the install hook skipped the Electron binary. Restored installed Electron binary with `env -u ELECTRON_SKIP_BINARY_DOWNLOAD node node_modules/electron/install.js`; wallet-signer then passed all 5 tests. Source/config unchanged. The full command is recorded as FAILED, not passed; coverage did not finish because of the pre-existing unit flake.
- Full application typecheck passed using the inherited-config override excluding temp/. Standard lint-changed's 231 template diagnostics are identical to unchanged origin/main after normalizing checkout paths. Biome passed all 21 checked files. These are pre-existing slot artifacts, not tracked application failures.
- Build not required: no routing, Next configuration or build wiring changed.
- CI audit: artifacts/ci-audit.md. Vercel still reports unavailable preview-deployment permission; source changes cannot grant access.

The retained quote can briefly show the last resolved fee amount while the updated exact-notional quote is pending. It never crosses explicit edits or trading contexts. Submission and fee resolution remain controller-owned.

## Publication and completion

Pushed 62e17c5e794f99a3327d28ea95604515e3e3a8bb once with a regular push to TAT-4094-feat-terminal-update-metamaskperps. Default-branch merge was a no-op. Working tree clean.

Current actionable finding 4230133698 is REAL and fixed in this commit. Inline reply 4230509384: https://github.com/consensys-vertical-apps/va-mmcx-terminal/pull/181#discussion_r4230509384. Previously resolved finding 4229155854 already has reply 4230097036; no duplicate. Three status-only issue comments skipped; no actionable issue-comment finding requiring a consolidated reply.

Changed files in this pass:

- src/features/perpetuals/order/queries/fee-quote.ts
- src/features/perpetuals/order/queries/fee-quote.test.tsx

Final positive control: both consecutive-price tests pass after restoring the fixed hook. No tracked changes occurred after validation. comments-triage.json records all fetched comments, including skipped automation and the prior reply. family-scope.json carries the inherited-family assessment. No post-push bot findings were fetched or handled, per the single-pass rule.

## Inherited proof packaging

The completion contract also applies to the dispatch-prepopulated artifacts/recipe.json. Added top-level recipe-coverage.md, an unchanged copy of the inherited quality assessment, and an evidence manifest referencing existing inherited media paths. Coverage distinguishes the previous testnet run from this pass's regression tests; no fresh runtime result is claimed.

The initial completion attempt required the canonical recipe-run execution package as well as metadata. Dispatch had materialized only recipe media and the original report. Recovered the complete unchanged original package from macwork.local:/Users/deeeed/dev/metamask/va-mmcx-terminal-1/temp/tasks/feat/tat-4094-1009-173607/artifacts/recipe-run/ into artifacts/recipe-run/. Confirmed its recipe is identical to the dispatch-seeded recipe. It remains evidence of the original run, not a new run on 62e17c5e.
