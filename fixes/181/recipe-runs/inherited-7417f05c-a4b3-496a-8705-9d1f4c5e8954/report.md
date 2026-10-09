# TAT-4094 report

Controller 20.0.0 is installed with ^20.0.0 in both manifests. Order and close previews use one notional helper and quote hook; total rate, amount, base rate and discount attribution come from the controller. Hardcoded fee calculations and false Rewards savings were removed.

AC4 follows the ticket owner's revision in inputs/lead-ac4.md. Charged-fill comparison is outside scope.

## Changed files

- package-lock.json
- package.json
- src/features/charting/tradingview/providers/HyperliquidTradingDataProvider.test.ts
- src/features/perpetuals/domain/Order/types.ts
- src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.test.ts
- src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.ts
- src/features/perpetuals/order/components/OrderForm/OrderFormSummary/MMPointsTooltipContent.tsx
- src/features/perpetuals/order/components/OrderForm/OrderFormSummary/OrderFormSummary.test.tsx
- src/features/perpetuals/order/components/OrderForm/OrderFormSummary/OrderFormSummary.tsx
- src/features/perpetuals/order/components/TradeActivityPanel/TradeActivityPanel.tsx
- src/features/perpetuals/order/utils/deriveOrderMetrics.test.ts
- src/features/perpetuals/order/utils/deriveOrderMetrics.ts
- src/features/perpetuals/ports/IPerpsProvider.ts
- src/features/perpetuals/domain/Order/fees.ts
- src/features/perpetuals/order/components/OrderForm/OrderFormSummary/FeePreview.test.tsx
- src/features/perpetuals/order/components/OrderForm/OrderFormSummary/FeePreview.tsx
- src/features/perpetuals/order/components/TradeActivityPanel/CloseFeePreview.test.tsx
- src/features/perpetuals/order/components/TradeActivityPanel/CloseFeePreview.tsx
- src/features/perpetuals/order/queries/fee-quote.test.tsx
- src/features/perpetuals/order/queries/fee-quote.ts
- src/features/perpetuals/order/utils/fee-notional.test.ts
- src/features/perpetuals/order/utils/fee-notional.ts

## Validation commands and results

All commands used Node 22, v22.22.1.

- `bash temp/farmslot/n22 npm install '@metamask/perps-controller@^20.0.0' --package-lock-only --ignore-scripts`: PASS. Lockfile resolves 20.0.0.
- `bash temp/farmslot/n22 npm ci`: PASS.
- `bash temp/farmslot/n22 npm test -- src/features/perpetuals/order/utils/fee-notional.test.ts src/features/perpetuals/order/queries/fee-quote.test.tsx src/features/perpetuals/order/components/OrderForm/OrderFormSummary/FeePreview.test.tsx src/features/perpetuals/order/components/OrderForm/OrderFormSummary/OrderFormSummary.test.tsx src/features/perpetuals/order/components/TradeActivityPanel/CloseFeePreview.test.tsx src/features/perpetuals/order/utils/deriveOrderMetrics.test.ts src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.test.ts src/features/charting/tradingview/providers/HyperliquidTradingDataProvider.test.ts`: PASS, 113 tests in eight files. See targeted-tests-final.log.
- Negative control: restoring the two production entry points made three new assertions fail. Restored the implementation afterward. See negative-control-tests.log.
- `bash /Users/deeeed/dev/farmslot/projects/va-mmcx-terminal-farm/setup/lint-changed.sh main`: PASS, whole-project typecheck and changed-file Biome. See lint-changed-final.log. Repository-wide lint was not run, per the checklist.
- `bash temp/farmslot/n22 npm run test:unit -- --maxWorkers=4 '--coverage.include=src/**' '--coverage.include=electron/**'`: PASS, 256 files, 1,829 tests passed, seven skipped, coverage completed. See test-unit-pass.log.
- Build skipped: no routing, Next configuration, environment or build wiring changed.
- Next.js MCP: final compilation issues empty; runtime config/session errors empty. Named next-dev-loop browser session checked and closed. These checks supplement the recipe.

Coverage is limited to application source to avoid parsing generated slot/browser files. All unit tests still run. Four workers avoid an unrelated live-orders timing flake under load. The slot inherited ELECTRON_SKIP_BINARY_DOWNLOAD; restored the installed Electron binary with `bash temp/farmslot/n22 env -u ELECTRON_SKIP_BINARY_DOWNLOAD node node_modules/electron/install.js`. No configuration changed.

## Recipe

Planning passed without findings. The unchanged baseline passed setup and ac4-regression-fees-label, then failed at ac2-order-quote.

Final run command:

```bash
eval "$(bash /Users/deeeed/dev/farmslot/projects/va-mmcx-terminal-farm/setup/recipe-env.sh macwork-mmt-1)"
unset TERMINAL_HEADLESS
~/xreview/bin/slot-lock mmt-1 "$MM_HARNESS_BIN" run temp/tasks/feat/tat-4094-1009-173607/artifacts/recipe.json --adapter terminal --artifacts-dir temp/tasks/feat/tat-4094-1009-173607/artifacts/recipe-run-final --target /Users/deeeed/dev/metamask/va-mmcx-terminal-1 --slot macwork-mmt-1 --cdp-port 9541 --watcher-port 9341 --json
```

PASS, 117/117 nodes, visible browser, testnet, HUD on. Raw artifacts remain in recipe-run-final; an unchanged copy is packaged in recipe-run. Inspected screenshots show $25 order input and 0.143% / $0.04 previews in both order and close forms. Signature guard passed; console guard found no errors; teardown independently confirmed no ETH position or open order. Other markets were preserved.

Video BLOCKED: `--record-video is not implemented for the terminal adapter.` The invocation with `--record-video=full-run` returned RECORDING_UNSUPPORTED before any nodes. Exact refusal preserved in recipe-run-video.log. Screenshots carry visual proof, following the checklist fallback.

| AC | Proof mode | Nodes/tests | Evidence |
| --- | --- | --- | --- |
| AC1 | unit | npm ci, typecheck, changed-file lint, test:unit | validation logs and manifest/lock version 20.0.0 |
| AC2 | mixed | ac2-order-quote, ac2-close-quote; quote hook, helper, renderer and form tests | recipe-run/evidence-ac2-order-quote.png, recipe-run/evidence-ac2-close-quote.png; notional and quote-field assertions |
| AC3 | unit | fee-notional and fee-quote tests | shared helper covers market, limit, trigger and partial-close sizing |
| AC4, revised | mixed | ac4-regression-fees-label, ac4-sized-order-preview; quote hook and renderer tests | recipe-run/evidence-ac4-sized-order-preview.png, HUD on; requested notional and quoted discount/rate tests |
| AC5 | unit | full diff/changelog review | review.md and approach.md; minimal version lock diff |

## Changelog and limits

Lighter attached TP/SL, grouped signer, trigger validation and protection changes are not applicable to the active Hyperliquid provider. New Scale cancellation and unavailable-reason union members have no exhaustive consumers here. Optional controller OrderFill.pnl has no web consumer. Typecheck passed against 20.0.0.

Biome formatted the touched close-panel file as required by the full-file lint gate. The fee quote is a preview; submit can resolve a different fee after market or benefits changes. Discount cases use quote fixtures in unit tests; the runtime account had no subscription waiver. Charged-fill comparison remains outside revised AC4. No push or GitHub write occurred.

Local commit: 37352025, feat: use perps controller 20 fee quotes. Working tree clean; branch remains local.
