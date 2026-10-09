# PR #180 feedback report

Pushed `19b75633` once with a regular push. `origin/main` merged cleanly in `ac13a96e`. Working tree is clean.

| Source | Author | ID | Location | Triage and action |
| --- | --- | --- | --- | --- |
| review_comment | aganglada | 4228582815 | mappers.ts:185 | REAL. Form field and warning use the submitted whole-bps cap. |
| review_comment | aganglada | 4228582827 | submit-order-mutation.ts:158 | REAL. Submit gate uses the same floored cap; long/short regressions added. |
| review_comment | aganglada | 4228582839 | persist-order-draft.test.ts:70 | REAL. Renamed the test as the reviewer offered. Advanced drafts remain excluded regardless of completeness. |

Skipped two status-only issue comments: Vercel deployment permissions and a Wiz summary without a source finding. Review summary repeats the cap finding; merge-only instructions govern branch updates.

No GitHub comments or review-thread replies posted. Step 10 is delegated to the lead per explicit instruction. Full paths and actions are in `comments-triage.json`.

## Validation

- Node v22.22.1 through `bash temp/farmslot/n22`.
- Whole-project typecheck and Biome on all 28 PR files pass. `lint-changed.log`.
- Six affected files pass, 122 tests, including both CI failures fixed by the main merge. `affected-tests.log`.
- Before the fix, three new assertions fail. `regression-before.log`.
- Focused AC2 runtime recipe passes 10/10 nodes with valid provenance. Inspected screenshot shows a 0.01% cap and red live estimate. `cap-runtime-run-2/`. No wallet connection or orders.
- Next MCP reports no compilation/configuration/session errors; browser and React checks succeeded.
- Video unsupported by Terminal; screenshot retained. Build skipped because no routing/configuration/bundler settings changed.

## Changed files

- `src/features/perpetuals/infra/perps-controller/mappers.test.ts`
- `src/features/perpetuals/order/components/OrderForm/OrderFormManualPanel/OrderFormManualPanel.test.tsx`
- `src/features/perpetuals/order/components/OrderForm/OrderFormManualPanel/OrderFormManualPanel.tsx`
- `src/features/perpetuals/order/utils/persist-order-draft.test.ts`
- `src/features/perpetuals/queries/submit-order-mutation.test.tsx`
- `src/features/perpetuals/queries/submit-order-mutation.ts`
