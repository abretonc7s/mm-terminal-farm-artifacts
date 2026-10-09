# PR 176 review follow-up

Recovery attempt authorized by the lead: recreate both commits using the configured work identity and signing key, rerun the same checks and make one regular push. Recreated merge ab8ed60 and fix 4cbae0b both have Good GPG signatures from A41FEC143503D502 and author/committer arthur.breton@consensys.net. Their final tree matches f477ed3 exactly. Both commits are published, and GitHub reports verified=true with reason=valid for each. Recovery checks passed 397 tests, changed-file Biome on all 16 files, full application typecheck and the 15-node runtime recipe. Only the Bugbot reply was edited in place.

Fetched review comments, issue comments and review/check status before edits. Four actionable root review comments; three already have fixing replies from the preceding run. Two status-only issue comments skipped: Vercel preview permissions and Sonar quality gate success. Three existing inline replies are context, not new findings.

| Source | Author | ID | File:line | Summary | Planned action |
| --- | --- | --- | --- | --- | --- |
| review_comment | cursor[bot] | 4225420170 | live-orderbook-query.ts:227 | Dummy fetch creates an update timestamp | Verify existing 211478e fix; do not double-reply |
| review_comment | aganglada | 4228583202 | live-orderbook-query.ts:227 | Stamp only received book frames | Verify existing 211478e fix; do not double-reply |
| review_comment | aganglada | 4228583209 | live-trades-query.ts:208 | Trades dummy fetch creates an update timestamp | Verify existing 211478e fix; do not double-reply |
| review_comment | cursor[bot] | 4228830920 | live-orderbook-query.ts:235 | Cached book never becomes stale before first frame | Read status derivation and add minimal missing-feed aging fix |

The build-image CI failure will be inspected separately. The PR remains CHANGES_REQUESTED from the previous timestamp review.

## Triage

All four root findings are REAL. The first three are already fixed in 211478e: both hooks stamp lastUpdatedAt only inside onData, reset it for resubscription, and scope it to the active key. Existing inline replies cover them.

4228830920 is still reproducible in the pure derivation: null lastUpdatedAt returns Connecting before the stale threshold is checked. Fix the badge's wait deadline separately from its receipt timestamp, so an unresponsive feed becomes Stale without inventing an Updated time. Reset that wait on symbol/aggregation changes and cover the boundary, recovery, error priority and quiet trades.

Runtime proof plan: cached levels remaining visible, first-frame wait aging to Stale without an Updated time, and Live with receipt times after changing to a working aggregation are mixed state/visual claims. Error priority and subscription-reset timing use behavioral unit checks. Sentry, analytics, allowlist and kill switch remain deferred in the inherited family scope.

## Validation

- Node 22.22.1 used through the repaired local wrapper for all Node commands.
- Self-review found no unrelated code changes, manual memoization, render-time clock reads or style changes. Badge key uses the normalized symbol and selected aggregation. The clock remains in the badge.
- Affected Vitest suite: 21 files, 397 tests passed. New tests cover missing-first-frame timeout at the 15s boundary, no fabricated timestamp, frame recovery, error priority, quiet trades and symbol/aggregation reset.
- Changed-file Biome: all 16 branch files pass in full.
- Requested lint script was absent from the active farm setup; used its frozen support copy at support/0d2f103c86dd899f84a59dc58eae98348102087d0edce7ed5054dab0681bf478/projects/va-mmcx-terminal-farm/setup/lint-changed.sh. It reports 231 TypeScript errors solely in ignored local plugin templates under temp/farmslot. Clean origin/main reproduces all 231 errors exactly. Full application typecheck passes with task-local tsconfig.project-only.json excluding temp. See typecheck-scope-proof.json and validation logs.
- Next.js 16.3.8 MCP reports no compilation issues and no runtime errors. Agent-browser 0.38.2 inspected the actual FeedStatus props and subscription key. The skill's browser dependency was installed task-locally; no project dependencies changed.
- Docker CI fails during npm ci on unchanged origin/main too, with the identical Tailwind 4 versus design-system preset Tailwind 3 peer conflict. Dockerfile, .npmrc and package manifests match main. See build-ci.log and main-build-ci.log. Vercel preview lacks deployment permission. Neither failure is introduced by this PR.
- No build run: this follow-up touches no routing, config or bundler wiring.
- Initial runtime recipe failed at the Connecting gate because the current BTC book was already Live. The inherited stalled-default-book assumption is market-dependent. The adapter offers no frame suppression, clock advance, offline or injection action. Final recipe proves retained levels and Live timestamps; the missing-first-frame timeout has deterministic behavioral test evidence only.
- Video attempt refused with RECORDING_UNSUPPORTED: --record-video is not implemented for the terminal adapter. Screenshots carry the supported runtime evidence.
- Final recipe-live-run passed 15/15 with clean application diagnostics. All three screenshots were inspected: visible price levels and Live receipt timestamps for order book and trades. The HUD is visible in these captures. Recipe quality and coverage record the unit-only timeout limitation.

## Original attempt: publication blocked

Local fix commit: f477ed316f6c6e772697743cdc5ec9140d0d744b. Main merge commit: 8e29b19903c49aeb5840147ba839a2a2a15bbe48. One regular push was attempted to TAT-4036-feat-tat-4036. GitHub rejected it with GH013, Commits must have verified signatures, identifying merge commit 8e29b19903c49aeb5840147ba839a2a2a15bbe48. No remote commit was published. The checklist permits a single push; no retry, rebase or force-push was performed.

Step 9 was mistakenly marked before the push result was inspected. This report and the blocked terminal signal record the actual result; there is no pushed SHA. The local working tree is clean.

Review reply for 4228830920: 4230095140, https://github.com/consensys-vertical-apps/va-mmcx-terminal/pull/176#discussion_r4230095140. Its original text was corrected in place to say implemented locally and publication blocked. Existing replies on the three preceding findings were retained without duplicate replies. No actionable issue-comment findings required a consolidated reply.

Intentional changed files: FeedStatus.tsx, FeedStatus.test.tsx, feed-status.ts, feed-status.test.ts, OrderBook.tsx and OrderBook.test.tsx under src/features/perpetuals/order/components. No task artifacts or local helpers were committed.

The signature and publication blocker below was resolved by the authorized recovery attempt. Reviewer approval and existing Docker/Vercel issues remain outside this follow-up.

## Recovery completed

Lead authorized resetting to remote 211478e, merging main with -S and cherry-picking the fix with -S. Signed merge ab8ed605d7280324c379471b40713c30eb7cb692 and signed fix 4cbae0b4cf30c90b40e1a6e89c0aabfbee47f7d9 use arthur.breton@consensys.net and key A41FEC143503D502. Good signatures are recorded in recovery-signatures.log; GitHub verified both as valid. One recovery push succeeded. No rebase or force-push was performed.

Revalidation: recovery-tests.log records 21 files / 397 passing tests; recovery-lint.log records clean Biome on all 16 changed files and the same 231 temp-only TypeScript diagnostics; recovery-typecheck.log records the successful full application typecheck. recipe-recovery-run passes 15/15 with clean application diagnostics. All three new screenshots were inspected and show visible levels and Live receipt timestamps. Next.js reports no compilation or runtime errors. No code differences exist versus the previously validated f477ed3 tree.

Only Bugbot thread 4228830920 was updated, by editing existing reply 4230095140 to name published commit 4cbae0b. The prior human-review replies were unchanged. The working tree is clean.

The canonical recipe-run directory contains a copy of the passing recovery run. The earlier failed first-frame attempt is preserved in recipe-first-frame-attempt.
