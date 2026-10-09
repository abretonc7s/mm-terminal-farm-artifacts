# PR comment report

Fetched all review and issue comments and review/check status before fixes.

- review_comment, aganglada, 4228583446, src/lib/hyperliquid/fee-tier.ts:41. Confirm `userCrossRate` is the schedule rate, not the rate after referral or staking. An exact match against `feeSchedule` is the tier. Anything else falls through to how many VIP cutoffs these last 14 array entries clear. Planned action: Verify the fee-rate semantics, use dated 14-day volume, and cover discounted VIP rates.
- review_comment, aganglada, 4228583449, src/features/perpetuals/order/utils/deriveOrderMetrics.ts:79. This adds `protocolRate + metamaskRate` and never reads `feeQuote.totalRate`. If the parts do not sum to the controller's `feeRate`, the Fee tier percentage and the fee amount diverge. Planned action: Use the controller total rate for both the displayed percentage and fee amount.
- review_comment, cursor[bot], 4228650220, src/features/perpetuals/order/components/OrderForm/AccountSummaryPanel/AccountSummaryPanel.tsx:71. ### Margin metrics ignore loading positions Planned action: Keep position-dependent margin rows pending on loading or error and add regression tests.

Skipped 1 status-only issue comment from vercel[bot], 6071617998, reporting missing Preview Deployment permission. Review summaries repeat the inline findings.

User scope override: fix the live-orders disable-error unit test; reply only to review_comment 4228650220 on the Bugbot thread. No replies to human review comments or top-level issue comments.

Triage: all three inline findings are REAL. Fee rate matching is unsafe for staking-adjusted rates, volume selection ignores UTC dates, totalRate is ignored, and the account panel treats missing positions as empty. The CI failure is a test-fixture subscription instability, included by user instruction.

Self-review completed: minimal conflict resolution preserves AccountSummaryPanel; no manual memoization or new effects. Loading/error gating applies only to position-derived rows. Total rate retains nullish fallback and zero rates. Tier lookup uses dated completed UTC days, independent of rate discounts. Fee references: https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees.md and https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint.md#query-a-users-fees . The controller dependency documents pre-discount user rates differently from the venue example; changing controller fee math is outside this review scope. Subaccount tier aggregation and spot-volume weighting are not independently proven.

Validation so far: Node v22.22.1; lint-changed PASS, whole-project typecheck and Biome on 25 changed files. Affected Vitest PASS, 18 files and 282 tests, including all 23 live-orders tests. Next.js MCP compilation issues empty and config/session errors empty. Browser React inspection confirms the account panel and fee summary render under OrderFormInner. Runtime hook unavailable because the gateway connection failed; executing the configured harness command directly. Video reports RECORDING_UNSUPPORTED for Terminal, rerun uses screenshots.

Final runtime validation: harness smoke PASS 47/47 on macwork-mmt-2, Trading account, SOL, Hyperliquid testnet. No trade mutations. Account summary screenshot shows equity $301.62, uPnL -$5.47, maintenance $3.06, margin usage 23.09%, cross ratio 0.00%; fee row Tier 0, 0.1432%. Existing BTC position was left untouched. Screenshot HUD is visible in this runner version. Evidence: runtime/summary.json, runtime/report.md and runtime/screenshots/. Loading/failure/recovery behavior and discounted VIP tiers are covered by unit tests, not this live account. No routing/config/build changes, so build is not required.

## Completion

Merged origin/main at a0c70d31 in 8b88c272, preserving the AccountSummaryPanel import. Committed fixes at cbf83035d3274748d76aadd5e782289a04fd9083. Pushed once, regularly, to TAT-4035-feat-tat-4035-task-setup. No rebase, force push, or default-branch mutation.

- REAL 4228583446 by aganglada: Derive VIP tier from venue cutoffs and the previous 14 completed UTC days. Ignore discounted-rate schedule matches. Added unsorted/gapped/date-boundary and discounted-tier regressions. No GitHub reply per user instruction.
- REAL 4228583449 by aganglada: Use feeQuote.totalRate for fee amount and percentage, preserving zero and fallback. Added divergent-component and zero-total regressions. No GitHub reply per user instruction.
- REAL 4228650220 by cursor[bot]: Keep maintenance margin and cross margin ratio pending on position loading/error. Added loading, failure, recovery and confirmed-flat regressions. Replied inline: https://github.com/consensys-vertical-apps/va-mmcx-terminal/pull/177#discussion_r4229226198

CI test fixed: live-orders-query.test.tsx now uses a stable provider mock and deterministically triggers WebSocket failure; it asserts unsubscribe and cleared error/connection/orders after disable. All 23 tests pass.

Exactly one GitHub comment was posted, reply 4229226198 on Bugbot thread 4228650220. Human review comments were addressed in code and received no reply, as the user directed. No top-level comment was posted.

Files changed by fix commit:

- src/features/perpetuals/order/components/OrderForm/AccountSummaryPanel/AccountSummaryPanel.test.tsx
- src/features/perpetuals/order/components/OrderForm/AccountSummaryPanel/AccountSummaryPanel.tsx
- src/features/perpetuals/order/utils/deriveOrderMetrics.test.ts
- src/features/perpetuals/order/utils/deriveOrderMetrics.ts
- src/features/perpetuals/queries/live-orders-query.test.tsx
- src/lib/hyperliquid/fee-tier.test.ts
- src/lib/hyperliquid/fee-tier.ts

Validation: lint-changed PASS, affected tests PASS 18 files/282 tests, runtime smoke PASS 47/47 with clean console and no trade mutations, MCP compilation/runtime errors empty. Local gates are green; new post-push CI was not awaited in this single-pass flow. Existing Vercel permission failure requires project access and is unrelated to code.

Completion marker initially rejected missing root metadata for the inherited recipe. Added recipe-coverage.md, evidence-manifest.json with archived inherited paths and current screenshots, and recipe-quality.json with explicit limitations. No source or GitHub changes after push.

The artifact contract also requires recipe-run/ matching the root recipe. Copied the executed smoke package unchanged from runtime/ to recipe-run/, and set the root recipe.json to that executed follow-up recipe. Original feature evidence remains archived separately.
