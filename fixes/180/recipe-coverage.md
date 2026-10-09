# Current recipe coverage

Current run: `artifacts/recipe-run/`, FAIL, 110/112 executed nodes, visible browser on testnet. Scale placement and venue assertions pass. Its cleanup fails with extraAgents HTTP 429; the parent call is the second failed trace entry. TWAP is not reached. `runtime-proof-summary.json` extracts assertions, venue IDs and cleanup.

| AC | Mode | Current result | Evidence |
| --- | --- | --- | --- |
| AC1 | mixed | Partial. Trigger types and Scale placement pass; Chase, TWAP, Market and reduce-only not reached | Current trace; inspected teardown screenshot shows successful Scale submission before final cleanup |
| AC2 | mixed | Runtime nodes not reached; unit checks pass | tests.log; prior-family evidence remains separate |
| AC3 | state | Runtime nodes not reached | Prior-family evidence remains separate |
| AC4 | state | PASS, 314 tests across 14 affected files | tests.log, lint.log |

Final cleanup PASS. Both Scale orders were canceled and independent reads confirm zero reserved ETH orders/positions. Other pre-existing market exposure was not touched.

First attempt: `artifacts/recipe-run-attempt-1/`, FAIL, 192/193 nodes at TWAP strategy validation with PROVIDER_NOT_AVAILABLE. /info 429s precede that error. Provider code maps failed authoritative state reads to this error. The current rerun confirms initialization and a separate explicit rate-limit failure, but cannot confirm a repeated TWAP failure. See `twap-diagnosis/report.md`.

Video was unavailable in the earlier recording attempt. Current screenshots and trace are partial evidence. Original family reports in `inputs/inherited/` recorded a full-feature pass and must not be labeled current proof.
