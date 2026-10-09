# PR 176 feedback

| Source | Author | ID | File:line | Summary | Planned action |
| --- | --- | --- | --- | --- | --- |
| review_comment | cursor[bot] | 4225420170 | live-orderbook-query.ts:227 | Dummy fetch stamps cached levels as fresh | Stamp actual WebSocket writes; test aggregation fallback |
| review_comment | aganglada | 4228583202 | live-orderbook-query.ts:227 | Timestamp must remain unset before a frame | Track receipt time for the subscription key |
| review_comment | aganglada | 4228583209 | live-trades-query.ts:208 | Dummy trades fetch marks feed updated | Track receipt time for the subscription key |

Skipped one status-only issue comment, Vercel preview deployment permission failure 6071484671. Review summaries repeat the inline timestamp findings. The provider aggregation issue is explicitly identified as follow-up work in the PR scope.

CI unit tests failed on the previous head. Inspect failure details during triage.

## Triage

All three inline comments are REAL. The hooks use dummy query functions, so React Query dataUpdatedAt is not a feed-receipt timestamp. The shared cache also supplies suspense hooks and SSR snapshots; preserve its domain payload shape. Track receipt time explicitly in each subscription callback, scoped to its symbol and aggregation.

The provider aggregation filter remains OUT OF SCOPE as documented by the reviewer and existing PR. Sentry, analytics, access gating and kill-switch provisioning remain unaddressed parts of the original family scope.

## Implementation and validation

Changed only live-orderbook-query.ts, live-trades-query.ts and their tests. Receipt time is local state stamped in onData beside setQueryData, reset when subscribing, and matched to the active symbol/aggregation during render. Shared SSR/suspense cache payloads stay domain objects. Repeated identical frames still advance the timestamp. Errors preserve it.

- Node 22 changed-file lint: PASS, whole-project typecheck and all 16 PR files.
- Affected panels/hooks plus all three formerly failing CI files: PASS, 19 files / 269 tests. The old live-orders failure did not reproduce; main merge includes the two other CI test fixes.
- Original-source control: six timestamp assertions fail, including completed dummy queries, seeded snapshots, and key switches. Restored source: 37/37 hook tests pass.
- Runtime recipe: PASS, 19/19 nodes, no application warnings/errors. Four screenshots inspected; cached levels, Connecting without fabricated time, and both Live timestamps are visible. Proof plan is proof-plan.json; runtime recipe and outputs are runtime-recipe.json and runtime-recipe-run/.
- The inherited AC4 runtime check relied on the erroneous SSR/dummy timestamp. Updated runtime AC4 proves the requested null timestamp until the first frame. Existing status/panel behavioral tests cover stale/disconnected state after receipt. The existing PR description and old default-aggregation screenshot describe the former behavior and are superseded by this report's receipt-time proof.
- Next.js runtime: compilation issues empty, runtime/config errors empty; browser and React FeedStatus props confirm Connecting with lastUpdatedAt null.
- Video: BLOCKED, `--record-video is not implemented for the terminal adapter.` Exact adapter response is recipe-video.log. Screenshots supply visual proof.
- No config, routing, dependencies, or build wiring changed; build not required.

## Publication and replies

Merged origin/main without rebase, merge commit 8185a5d. Committed the four intentional files and pushed once to TAT-4036-feat-tat-4036. Fix commit: 211478eda2bd0df789cba6ffd0467e730077884b.

- 4225420170: reply 4228791484, https://github.com/consensys-vertical-apps/va-mmcx-terminal/pull/176#discussion_r4228791484
- 4228583202: reply 4228791677, https://github.com/consensys-vertical-apps/va-mmcx-terminal/pull/176#discussion_r4228791677
- 4228583209: reply 4228791877, https://github.com/consensys-vertical-apps/va-mmcx-terminal/pull/176#discussion_r4228791877

All three actionable inline comments received one reply. There were no actionable issue-comment findings requiring a consolidated reply. The Vercel permissions status comment was skipped. No new post-push review round was fetched, per the single-pass checklist.

Original family scope remains partial, see family-scope.json. External review approval and Vercel permissions are not resolved by this code fix.

Completion contract requires the inherited recipe package to have current coverage and media indexing. Updated canonical recipe.json and recipe-run/ to the successful follow-up run, added recipe-coverage.md, evidence-manifest.json and a WARN quality assessment documenting video and runtime-fault-injection limits.
