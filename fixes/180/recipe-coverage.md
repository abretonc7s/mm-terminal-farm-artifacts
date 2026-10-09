# Recipe coverage

Root recipe.json is the focused follow-up cap recipe, matching the passing package at artifacts/recipe-run/. The full-feature recipe remains in the inherited package. The inherited package is preserved at artifacts/recipe-runs/inherited-42678c0a-ab45-4539-acd4-8fa1af0dbc59/. Its report records the passing 226-node feature run, venue reads and final cleanup. This follow-up also preserves the named cap-runtime.recipe.json and a passing 10/10-node run with valid provenance at cap-runtime-run-2/.

| AC | Mode | Evidence |
| --- | --- | --- |
| AC1 selectable real order types | mixed | Inherited report and coverage list the order-type venue assertions; inherited screenshots are indexed in evidence-manifest.json. No order-type routing changed here. |
| AC2 estimate and max enforcement | mixed | Current effective-cap and estimate waits, inspected effective-slippage-cap.png, and long/short depth boundary tests in affected-tests.log. Three new assertions fail before the fix in regression-before.log. |
| AC3 order-book click-to-fill | state | Inherited ac3 bid/ask value assertions documented in the inherited report and coverage. Click handling is unchanged. |
| AC4 validation tests | state | Current affected-tests.log passes 122 tests across six files, including form, submission, mapper and persistence checks. |

Current recipe places no orders and does not connect a wallet. Video returned RECORDING_UNSUPPORTED; screenshot and trace are retained. Mainnet and extension confirmation remain outside this proof, as documented by inherited evidence. The first cap run's exact-input assertion rejected intentional normalization; the successful run uses a keystroke and explicit effective-value wait.
