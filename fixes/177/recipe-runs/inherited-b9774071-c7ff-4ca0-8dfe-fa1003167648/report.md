# Report — TAT-4035: account equity panel, fee tier and top nav

The task input had no description. Title, technical details and ACs come from Jira TAT-4035,
"[Terminal] Build account equity, fee tiers, and top nav".

## Summary

- **Account panel (AC1):** a new "Account summary" section in the order form, under the
  "Trading as" card, shows Equity, Unrealized PnL, Maintenance margin, Margin usage and Cross margin
  ratio for the active trading account. Values come from the existing WS-driven hooks
  (`useLiveUserInfo` account stream + `useLivePositions`).
  - The controller's `AccountState` already streamed `totalBalance`, `unrealizedPnl` and
    `marginUsed`. `toDomainUserInfo` dropped them, and the provider de-duped updates on
    `withdrawable` only, which would also have swallowed equity/PnL ticks. Both are fixed.
  - Maintenance margin is derived per position as notional / (2 × maxLeverage), Hyperliquid's rule
    and the same formula as the controller's `calculateMaintenanceMargin`.
- **Fee tier and post-discount fee (AC2):** a new port method `IPerpsProvider.quoteFees` delegates
  to the controller's `calculateFees`, which applies the user's Hyperliquid rates (tier, referral,
  staking) and the MetaMask Rewards discount.
  - The order summary charges that rate (the Tier-0 constants are now only the loading or
    no-account fallback).
  - A new "Fee tier" line shows `Tier N` and the post-discount rate. The tier comes from Hyperliquid
    `userFees` (no hard-coded schedule).
- **Top nav (AC3):** connect, account list/switch, add account, disconnect and the Settings link
  already existed (`AccountMenu`, `HeaderNav`). No code change; a regression guard proves it.

## Changed files

- `src/features/perpetuals/domain/User/types.ts`: `AccountTotals`, `UserInfo` extends it, `FeeQuote`, `FeeTier`.
- `src/features/perpetuals/domain/Order/types.ts`: `OrderSummaryMetrics.feeRatePercentage`.
- `src/features/perpetuals/ports/IPerpsProvider.ts`: `quoteFees` + `QuoteFeesParams`.
- `src/features/perpetuals/infra/perps-controller/mappers.ts` (+test): full `toDomainUserInfo`, `isSameUserInfo`, `toFeeQuote`.
- `src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.ts` (+test): whole-object de-dupe, `quoteFees`.
- `src/features/perpetuals/queries/live-user-info-query.ts`: returns `accountTotals`.
- `src/features/perpetuals/queries/fee-queries.ts` (new): `useFeeQuote`, `useFeeTier`.
- `src/features/perpetuals/order/queries/order-query-keys.ts`: `feeQuote`, `feeTier` keys.
- `src/lib/hyperliquid/fee-tier.ts` (+test, new): `userFees` schema and tier resolution.
- `src/features/perpetuals/order/utils/deriveAccountSummary.ts` (+test, new).
- `src/features/perpetuals/order/utils/deriveOrderMetrics.ts` (+test): optional `feeQuote`.
- `src/features/perpetuals/order/components/OrderForm/AccountSummaryPanel/AccountSummaryPanel.tsx` (+test, new).
- `src/features/perpetuals/order/components/OrderForm/OrderFormInner/OrderFormInner.tsx`: renders the panel.
- `src/features/perpetuals/order/components/OrderForm/OrderFormSummary/OrderFormSummary.tsx` (+test): fee quote + Fee tier line.
- `src/features/charting/tradingview/providers/HyperliquidTradingDataProvider.test.ts`: mock gains `quoteFees`.

## Validation (Node 22 via `bash temp/farmslot/n22`)

- `npm test -- src/features/perpetuals/infra/perps-controller src/features/perpetuals/order/utils src/features/perpetuals/order/components/OrderForm src/features/perpetuals/queries src/lib/hyperliquid src/features/charting/tradingview/providers`
  - Result: 54 files, 541 passed, 2 failed.
  - Both failures are in `OrderFormLimitPriceEditor.test.tsx` and fail the same way on `main` with
    this change stashed.
- Revert check: with the source files restored to HEAD (tests kept), the new/changed tests fail
  (7 files, 9 failures). With the change, 14 files and 154 tests pass.
- `npm run typecheck`: passes.
- `npm run lint`: the repo-wide `biome check .` fails before reaching this change (about 183k errors
  from `temp/`, `electron/` and other paths). `biome check src` also fails on `main`.
  - `npx biome check <changed files>` (22 files): clean.
- `npm run build`: skipped. No routing, `next.config.ts`, env or build wiring changed.

## Recipe

- Recipe: `artifacts/recipe.json` (Recipe v1, proofTargets AC1–AC3). It composes
  `terminal.perps.ensure-connected`, `terminal.perps.confirm-wallet-request` and
  `terminal.perps.assert-clean-console`. Injected signer, account dev1, market ETH, testnet.
- Plan: `--plan` PASS.
- Baseline (unchanged checkout), `artifacts/recipe-baseline-run/`: FAIL at **`ac1-panel-visible`**,
  the first new-behavior node. Setup and all AC3 regression nodes pass.
- Original read-only proof run, now `artifacts/recipe-run-readonly/`: **PASS, 47/47 nodes**, headless under the `mmt-3` slot lock.
  The console assertion is clean.
- Video: **BLOCKED**. The run with `--record-video=full-run` was refused before any node with
  `--record-video is not implemented for the terminal adapter.` (error code
  `RECORDING_UNSUPPORTED`, in `artifacts/recipe-run-video-refused.json`). It was rerun without
  video; the screenshots carry the visual ACs.

| AC | Nodes | Evidence |
| --- | --- | --- |
| AC1 Equity, uPnL, maintenance margin, margin usage/ratio visible and live | `ac1-panel-visible`, `ac1-equity`, `ac1-upnl`, `ac1-maintenance`, `ac1-margin-usage`, `ac1-margin-ratio`, `ac1-screenshot` | `artifacts/after-ac1-account-summary.png` (Equity $538.61, uPnL $0.00, maint. $0.00, usage 0.00%, ratio 0.00%). Live ticks are covered by Vitest (provider de-dupe test, panel rerender test). |
| AC2 Fee tier and post-discount fee in the order form | `ac2-fee-tier`, `ac2-fee-rate`, `ac2-screenshot` | `artifacts/after-ac2-fee-tier.png`: "Fee tier · Tier 0 · 0.1432%". That is 0.045% × (1 − 4% referral) + 0.100% MetaMask fee. |
| AC3 Top nav connect/switch/disconnect + Settings link (regression guard) | `ac3-settings-link`, `ac3-open-account-menu`, `ac3-menu-active-account`, `ac3-menu-add-account`, `ac3-menu-disconnect`, `ac3-disconnected`, `ac3-connect`, `ac3-approve-connect`, `ac3-reconnected`, `ac3-screenshot` | `artifacts/after-ac3-top-nav-account-menu.png`. Passes in both the baseline and proof runs. |

## Risks / follow-ups

- (Resolved in Self-Review Fixes: the recipe now opens and closes a testnet position.) Original note: non-zero
  values and live ticks are proven at unit level only; a run with an open position (e.g. compose
  `terminal.perps.place-market-order`) would prove them end to end.
- Maintenance margin ignores Hyperliquid's tiered margin for very large notionals. The cross margin
  ratio divides by total equity, not cross-only account value.
- The fee estimate assumes taker execution, as the summary did before.
- Not done from the ticket's technical details (no AC):
  - deposit/withdraw RPC entry points;
  - a placeholder nav slot for Portfolio/chatbot (pilot mode hides Portfolio by design);
  - the Web3Auth connect flow (a separate ticket).

## Self-Review Fixes

1. **"You're saving X%" showed the discounted rate, not the saving** (`deriveOrderMetrics.ts:99`,
   `MMPointsTooltipContent.tsx:32`). Fixed.
   - Added `OrderSummaryMetrics.mmSavingPercentage` = max(base MetaMask rate − post-discount rate,
     0) × 100. The tooltip's saving sentence uses it. The struck-through base and the discounted
     rate (`mmDiscountPercentage`) are unchanged.
   - Tests: `deriveOrderMetrics.test.ts` asserts 0.02 for a 0.08% rate and 0 with no quote. The new
     `MMPointsTooltipContent.test.tsx` renders "You're saving 0.020% with MetaMask Rewards." next to
     the 0.100% base and the 0.080% rate. It fails on the old code, which rendered 0.080% in the
     sentence.
2. **AC1 non-zero values and live updates not proven end to end** (`artifacts/recipe.json`). Fixed.
   - Finding while fixing: on the web adapter, `ui.wait_for` with `test_id` + `text` checks the
     text anywhere on the page, not inside the element, and ignores `text_match`. The old `$`/`%`
     checks were therefore weaker than they read.
   - So `AccountSummaryPanel` now puts each row's unformatted number in `data-value`, covered by a
     new unit test ("exposes each unformatted value as data-value"). The value checks now use
     row-scoped selectors (`[data-testid=…][data-value]`).
   - Recipe changes:
     - `setup-flat` composes `terminal.perps.ensure-flat-market`.
     - `ac1-flat-maintenance` and `ac1-flat-upnl` assert zero before the order.
     - `ac1-open-position` composes `terminal.perps.place-market-order` (testnet, $25 long,
       injected signer, approves the agent).
     - `ac1-live-maintenance`, `ac1-live-upnl`, `ac1-live-upnl-tone` and `ac1-live-margin-usage`
       assert non-zero with no reload after the submit.
     - `ac1-close-position` composes `terminal.perps.close-position`.
     - `ac1-closed-maintenance` and `ac1-closed-upnl` assert zero again.
     - The teardown (`require_flat_start` → `terminal.perps.clean-market-testnet`) restores the
       market to flat.
   - Equity changing is shown by the screenshots ($538.61 flat, then $538.58 open), not asserted.
     Templates resolve only `{{params.*}}` and the web `ui.wait_for` cannot compare against an
     earlier UI value, so the runner cannot assert "different from before".
   - The open position's uPnL is non-zero in the data, and `ac1-live-upnl` and
     `ac1-live-upnl-tone` pass, but it is under one cent so the screenshot shows "$0.00" in the
     gain color.
   - The cross margin ratio stays 0.00% because the position is isolated. Its math is covered by
     `deriveAccountSummary.test.ts`.

### Re-validation (Node 22)

- `bash temp/farmslot/n22 npm test -- src/features/perpetuals/order/components/OrderForm/AccountSummaryPanel src/features/perpetuals/order/components/OrderForm/OrderFormSummary src/features/perpetuals/order/utils`:
  12 files, 64 tests passed.
- `bash temp/farmslot/n22 npm run typecheck`: pass.
- `bash temp/farmslot/n22 npm run lint`: the repo-wide `biome check .` still fails on pre-existing
  `temp/` and other paths (183,223 errors), as before.
  - `npx biome check` on the 8 changed files: clean apart from 5 warnings.
- Recipe `--plan`: PASS (42 nodes).
- Recipe with `--record-video=full-run` (`recipe-run-fix-video-refused.json`): refused before any
  node with `--record-video is not implemented for the terminal adapter.`
  (`RECORDING_UNSUPPORTED`). Video: BLOCKED.
- Recipe proof run without video, headless under the `mmt-3` slot lock
  (`artifacts/recipe-run/`): **PASS, 118/118 trace entries**. The console is clean and the
  teardown left the market flat.
  - Evidence: `artifacts/after-ac1-account-summary-open-position.png`.
- Baseline not rerun: the first new-behavior node is still `ac1-panel-visible`, and it fails on
  `main` because the panel does not exist there (`artifacts/recipe-baseline-run/`).

## Evidence Rework (lead review)

1. **HUD.** I reran the AC recipe with `--hud show`. The HUD was drawn on the page during the run:
   `temp/recipe/runtime/terminal/hud.json` reached seq 204 with "Recipe passed". The screenshots
   still don't show it, because the terminal adapter's `ui.screenshot` hides the HUD while it
   captures. In harness 0.84.0, `library/actions/web-dapp/platform/page.mjs:85-98`
   (`AppPage.screenshot`) sets the `mm-harness-hud` host to `visibility: hidden`, captures, then
   restores it. No flag or env var changes that. I did not patch the shared harness or capture
   outside the recipe.
   - Status: **BLOCKED**. It needs a harness option to keep the HUD in `ui.screenshot`.
2. **Before/after pairs.** Each AC now has its own pair: the same window size and region, and the
   same screenshot node id in both runs.
   - Befores: base commit `main` 79374ac (checked out detached in this slot, then switched back to
     the branch). `artifacts/recipe-before.json` has the same setup-connect, gate and ac3-* nodes
     and the same `ac1-screenshot`/`ac2-screenshot` nodes. The new-behavior assertions are
     replaced by waits on the order form (`order-form-tab-market`) and the summary
     ("Liquidation price"). Run `artifacts/recipe-before-run/`: PASS, 39/39, `--hud show`.
   - Afters: `recipe.json` on the branch, `artifacts/recipe-run/`: PASS, 118/118, `--hud show`.
     - The first `--hud show` attempt passed every AC node, but the teardown's final open-orders
       check got `TypeError: fetch failed` from the venue API. That run is kept in
       `artifacts/recipe-run-hud-teardown-fetch-fail/`; the rerun passed cleanly.
     - The earlier run without HUD is now `artifacts/recipe-run-nohud/`.
   - Files:

     | AC | Before | After |
     | --- | --- | --- |
     | AC1 | `before-ac1-order-form-no-account-panel.png` | `after-ac1-account-summary-panel.png` |
     | AC2 | `before-ac2-order-summary-no-fee-tier.png` | `after-ac2-order-summary-fee-tier.png` |
     | AC3 | `before-ac3-top-nav-account-menu.png` | `after-ac3-top-nav-account-menu.png` |

     There is also one standalone `after-ac1-account-summary-open-position.png`. No file is used
     twice; the md5 check found no duplicates.
   - The superseded images are in `artifacts/evidence-old/`.
   - Caption confidence: checked with the gateway's own `captionConfidenceFor` and
     `collectLowCaptions` (`services/gateway/src/run-completion/evidence-manifest.ts`). All 4
     entries are HIGH and the LOW list is empty.
   - Not published.
