# TAT-4034 implementation report

Added Stop Market/Limit, Take Profit Market/Limit, Scale, Chase and native TWAP controls through the existing shared controller. Reduce only remains a modifier. Market entry shows a live-depth average slippage estimate and enforces the maximum before signing. Both book sides fill the Limit price. Entry intent is isolated-only; existing cross-position reductions and legacy management calls remain supported.

## Validation

All Node commands use Node 22 through `bash temp/farmslot/n22`.

- Lead's step 9 gate: `bash ~/dev/farmslot/projects/va-mmcx-terminal-farm/setup/lint-changed.sh main`. PASS, whole-project typecheck and Biome on all 27 changed/new files. Log: `farm-lint-changed.log`.
- Targeted tests: `bash temp/farmslot/n22 npm test -- src/features/perpetuals/domain/Order/validation.test.ts src/features/perpetuals/domain/Order/slippage.test.ts src/features/perpetuals/domain/Order/helpers/OrderBuilder.test.ts src/features/perpetuals/queries/submit-order-mutation.test.tsx src/features/perpetuals/infra/perps-controller/mappers.test.ts src/features/perpetuals/order/components/OrderForm/OrderFormTabs/OrderFormTabs.test.tsx src/features/perpetuals/order/components/OrderForm/OrderFormManualPanel/OrderFormManualPanel.test.tsx src/features/perpetuals/order/components/OrderForm/OrderFormInner/OrderFormInner.test.tsx src/features/perpetuals/order/components/OrderForm/OrderFormWrapper/OrderFormWrapper.test.tsx src/features/perpetuals/order/components/OrderForm/OrderFormSubmitButton/OrderFormSubmitButton.test.tsx src/features/perpetuals/order/components/OrderPage/OrderPage.test.tsx src/features/perpetuals/order/components/OrderBook/OrderBookRow.test.tsx src/features/perpetuals/order/utils/persist-order-draft.test.ts src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.test.ts`. PASS, 297 tests across 14 files. Log: `targeted-tests-final.log`.
- Reverted submission implementation failed eight new behavioral assertions, then source was restored. Log: `reverted-tests.log`.
- Recipe plan passed. Unchanged-source baseline passed setup and the existing Limit guard, then failed at `ac1-stop-select`, the first new-behavior node.
- Final recipe PASS, 226/226 executed nodes, no failures, valid execution provenance. Package: `artifacts/recipe-feature-run/`. Final independent source review approved. Next MCP reported no config/session errors.
- Build skipped because no routing, Next configuration, environment configuration or build wiring changed.

Inherited lint debt, accepted by the lead: unchanged source had 91 errors and 18 warnings; final source has 79 errors and 18 warnings. The source scans used `lint-source.py` with temporary source-root includes, restored afterward. Logs: `baseline-lint.log`, `lint.log`. Untouched files and `biome.json` are unchanged. Repo-wide lint does not block this task.

Exact final recipe command, from the repo root:

```bash
eval "$(bash /Users/deeeed/dev/farmslot/projects/va-mmcx-terminal-farm/setup/recipe-env.sh macwork-mmt-1)"
NODE_OPTIONS=--dns-result-order=ipv4first TERMINAL_HEADLESS=1 \
  ~/xreview/bin/slot-lock mmt-1 bash temp/farmslot/n22 "$MM_HARNESS_BIN" run \
  temp/tasks/feat/tat-4034-1009-100705/artifacts/recipe.json \
  --adapter terminal --artifacts-dir temp/tasks/feat/tat-4034-1009-100705/artifacts/recipe-run \
  --target /Users/deeeed/dev/metamask/va-mmcx-terminal-1 \
  --slot macwork-mmt-1 --cdp-port 9541 --watcher-port 9341 --json
```

Video: BLOCKED: --record-video is not implemented for the terminal adapter. The recording attempt returned `RECORDING_UNSUPPORTED` before any node. The checklist authorizes screenshots as fallback; all eight final screenshots were inspected. Earlier runs are retained for diagnostics, including one with all nodes passing but invalid source provenance. Only the final canonical run is acceptance evidence.

## Acceptance evidence

| AC | Result and recipe nodes | Evidence |
| --- | --- | --- |
| AC1, selectable real orders | PASS. Existing Limit guard; `ac1-stop-venue-assert`, `ac1-stop_limit-venue-assert`, `ac1-take_profit_market-venue-assert`, `ac1-take_profit_limit-venue-assert`, `ac1-scale-venue-assert`, `ac1-chase-venue-assert`, `ac1-market-position-assert`, `ac1-reduce-only-place`, `ac1-twap-venue-assert` | Native trigger types/prices, Scale children, Chase resting order, reduce-only venue flag and isolated Market/TWAP positions in `recipe-feature-run/trace.json`; seven `evidence-ac1-*.png` screenshots. Video BLOCKED: --record-video is not implemented for the terminal adapter. |
| AC2, estimate and cap | PASS. `ac2-ready`, `ac2-estimate`, `ac2-estimate-picture`, `ac2-exceeds-cap`, `ac2-rejection`, `ac2-no-position-assert` | `recipe-feature-run/evidence-ac2-estimate-picture.png`; estimate exceeds zero cap, exact refusal, and no resulting position in trace. Video BLOCKED: --record-video is not implemented for the terminal adapter. |
| AC3, book price fill | PASS. `ac3-click-bid`, `ac3-click-ask`, `ac3-bid-match`, `ac3-ask-match` | Both input values equal clicked row `data-price` in trace; `proof-summary.json` preserves values. State proof, video BLOCKED: --record-video is not implemented for the terminal adapter. |
| AC4, validation tests | PASS. Targeted form, validation, mapper, provider and submission tests | 297 tests pass; invalid fields and each type's mapping are covered. Unit-only, video N/A. |

Venue order IDs from the final trace:

```json
{
  "ac1-stop-venue": [
    "62234624024"
  ],
  "ac1-take_profit_market-venue": [
    "62234631380"
  ],
  "ac1-stop_limit-venue": [
    "62234638490"
  ],
  "ac1-take_profit_limit-venue": [
    "62234645698"
  ],
  "ac1-scale-venue": [
    "62234653423",
    "62234653422"
  ],
  "ac1-chase-venue": [
    "62234661586"
  ],
  "ac1-reduce-only-place/resting": [
    "62234680562"
  ]
}
```

`proof-summary.json` preserves venue reads and click values. Final teardown independently confirms zero ETH orders and zero positions. TWAP is proven by its real filled position after the five-minute schedule, then allowed to expire before final cleanup.

## Changed files

27 intentional source/test files:

- `src/features/perpetuals/domain/Order/constants.ts`
- `src/features/perpetuals/domain/Order/helpers/OrderBuilder.test.ts`
- `src/features/perpetuals/domain/Order/helpers/OrderBuilder.ts`
- `src/features/perpetuals/domain/Order/slippage.test.ts`
- `src/features/perpetuals/domain/Order/slippage.ts`
- `src/features/perpetuals/domain/Order/types.ts`
- `src/features/perpetuals/domain/Order/validation.test.ts`
- `src/features/perpetuals/domain/Order/validation.ts`
- `src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.test.ts`
- `src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.ts`
- `src/features/perpetuals/infra/perps-controller/mappers.test.ts`
- `src/features/perpetuals/infra/perps-controller/mappers.ts`
- `src/features/perpetuals/order/components/OrderBook/OrderBookRow.tsx`
- `src/features/perpetuals/order/components/OrderForm/OrderForm.css.ts`
- `src/features/perpetuals/order/components/OrderForm/OrderFormInner/OrderFormInner.tsx`
- `src/features/perpetuals/order/components/OrderForm/OrderFormManualPanel/OrderFormManualPanel.test.tsx`
- `src/features/perpetuals/order/components/OrderForm/OrderFormManualPanel/OrderFormManualPanel.tsx`
- `src/features/perpetuals/order/components/OrderForm/OrderFormSubmitButton/OrderFormSubmitButton.tsx`
- `src/features/perpetuals/order/components/OrderForm/OrderFormTabs/OrderFormTabs.test.tsx`
- `src/features/perpetuals/order/components/OrderForm/OrderFormTabs/OrderFormTabs.tsx`
- `src/features/perpetuals/order/components/OrderForm/constants.ts`
- `src/features/perpetuals/order/components/OrderForm/types.ts`
- `src/features/perpetuals/order/hooks/useTradeExecution.ts`
- `src/features/perpetuals/order/utils/persist-order-draft.test.ts`
- `src/features/perpetuals/order/utils/persist-order-draft.ts`
- `src/features/perpetuals/queries/submit-order-mutation.test.tsx`
- `src/features/perpetuals/queries/submit-order-mutation.ts`

## Limits

Proof uses real Hyperliquid testnet orders with the supported injected signer on the reserved ETH market. Mainnet and extension confirmation were not tested. Chase reprices while this trading session stays open and may leave its last limit order. Native TWAP continues on Hyperliquid after this tab closes; management remains on Hyperliquid. The displayed average estimate can differ from the venue's worst-fill cap. Whole-bps flooring is conservative.

## Self-Review Fixes

Fixed the P2 order-book routing issue. Default five-significant-figure subscriptions now use `FinestOrderBookStream` on an isolated public socket. Explicit display aggregation stays on the controller. Coarse display frames cannot reach the slippage feed; sparse fine frames remain valid. Normal depth is retained. The controller's built-in isolated helper forces five-level fast snapshots, so it was unsuitable here.

Changed only `ControllerPerpsProvider.ts`, its test, and the new stream. The concurrent-subscription regression exercises real SDK frames via MSW, checks the review's 0.01% cap example, preserves sparse frames, and verifies unsubscribe. It fails with the original provider restored.

- Node 22 affected tests: PASS, 125/125. Command: `bash temp/farmslot/n22 npm test -- src/features/perpetuals/infra/perps-controller/ControllerPerpsProvider.test.ts src/features/perpetuals/domain/Order/slippage.test.ts src/features/perpetuals/queries/submit-order-mutation.test.tsx`. Log: `self-review-fix-tests.log`.
- Typecheck and changed-file Biome: PASS, 28 files. Command: `bash /Users/deeeed/dev/farmslot/projects/va-mmcx-terminal-farm/setup/lint-changed.sh main`. Log: `self-review-fix-lint.log`.
- Next runtime: no compilation, configuration or session errors. Browser and React checks saved under `self-review-fix-*`.
- Independent read-only review: APPROVE, no blockers. Existing socket lifecycle conventions, consolidation and extra test suggestions are deferred beyond this routing fix. Reviewed `ae872efd` plus the three-file fix; findings in `fix-independent-review.md`.
- Recipe: PASS, 226/226, valid execution provenance, eight inspected screenshots and zero final ETH orders/positions. Latest evidence: `self-review-fix-recipe-run-2/`, `self-review-fix-proof-summary.json`, updated coverage and manifest.

The first rerun passed 209/210 nodes but raced a changing best-price quote at `ac2-rejection`; cleanup passed. The recipe now uses a valid $500 depth quote and an over-cap submit selector. The passing rerun preserves the exact refusal and no-position assertions. Video attempt returned `RECORDING_UNSUPPORTED`: `--record-video is not implemented for the terminal adapter.` Screenshots are the authorized fallback. Build skipped because no route, configuration or build wiring changed.

The named `review-feedback.md` was absent. Full feedback was read from `review-feedback.rev-codex.md`, which contains the same reported issue.

Exact passing recipe command:

```bash
eval "$(bash /Users/deeeed/dev/farmslot/projects/va-mmcx-terminal-farm/setup/recipe-env.sh macwork-mmt-1)"
NODE_OPTIONS=--dns-result-order=ipv4first TERMINAL_HEADLESS=1 \
  ~/xreview/bin/slot-lock mmt-1 bash temp/farmslot/n22 "$MM_HARNESS_BIN" run \
  temp/tasks/feat/tat-4034-1009-100705/artifacts/recipe.json \
  --adapter terminal --artifacts-dir temp/tasks/feat/tat-4034-1009-100705/artifacts/self-review-fix-recipe-run-2 \
  --target /Users/deeeed/dev/metamask/va-mmcx-terminal-1 \
  --slot macwork-mmt-1 --cdp-port 9541 --watcher-port 9341 --json
```

Local fix commit: `90502bb4`, `fix: address self-review feedback (TAT-4034)`. No push. Completion initially found steps 1–3 reset despite successful earlier mark outputs; their completed work was reconciled through the mark CLI.

The artifact contract requires the latest recorded recipe at `artifacts/recipe-run/`. It contains a copy of the passing `self-review-fix-recipe-run-2/` package; the original feature evidence is preserved in `recipe-feature-run/`.
