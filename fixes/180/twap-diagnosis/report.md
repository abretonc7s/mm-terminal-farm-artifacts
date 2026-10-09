# Provider diagnosis and visible testnet rerun

Source is unchanged pushed commit 2afee509639e92fa177b13b48099e3dc4aa07d4f. No additional GitHub comments, replies, source changes or pushes were made during this attempt.

## Rerun result

One full supplied-recipe rerun was invoked with TERMINAL_HEADLESS unset and no browser headless flag. It ran on testnet from 11:13:15.999 to 11:21:25.640 UTC on 2026-10-09. Canonical package: `artifacts/recipe-run/`. Result: FAIL, 110/112 executed nodes. Two failing trace entries represent one failure: `teardown-scale/clean_market` and its parent `teardown-scale`.

Scale submission and both venue assertions passed. Venue reported ETH limit orders 62253159016 and 62253159015. The next cleanup node failed at 11:15:52.635 UTC with `Hyperliquid testnet info extraAgents returned HTTP 429`. This is an explicit rate-limit error from a venue read in the recipe adapter, not a rejected Scale placement. The runner records cause_class unknown; the worker diagnosis is testnet rate limiting based on the actual HTTP response.

No `ac1-twap` node was executed, so no controller state immediately before TWAP could be observed in this rerun. The requested retry is inconclusive for TWAP. Do not describe this as a repeated TWAP failure or a full passing recipe. Chase, TWAP, Market, reduce-only and later slippage/book-fill checks were not reached in this attempt.

## Initialization and routing

The diagnostic observer enabled the existing perps.debug logger before trading. At 11:15:07.278 UTC it recorded Hyperliquid SDK client initialization, followed by lazy initialization and asset mapping. Successful main-DEX account-state queries precede each submitted trigger type and Scale. The last Scale state read answered at 11:15:49.474 UTC. This proves the Hyperliquid provider initialized for this browser session.

TWAP does not route to a separate uninitialized provider. `ControllerPerpsProvider.submitOrder` uses `#withAgentRetry`, which awaits `host.prepareForWrite`. In `controller-host.ts:255`, that binds the wallet, ensures the agent, awaits initialization, and prepares the trading wallet. Installed @metamask/perps-controller 19.0.0 routes TWAP through HyperliquidProvider.placeOrder at line 4031, #placeStrategyOrder at 4295 and #prepareStrategyPlacement at 4426, before native #placeTwapOrder at 4612.

The first attempt's stack proves its error occurred in #validateOrderBeforePlacement, called from #prepareStrategyPlacement. That validation calls validateOrder at 10073, #validateMarginMode at 3718, #readMarginModeLock at 3745, and #queryDexPositions at 8697. The last function initializes clients and performs an HTTP clearinghouseState read. A failed request becomes answered:false; #readMarginModeLock then throws PROVIDER_NOT_AVAILABLE. Account changes can also throw the same code. The wrapper retries signer refusals only, so this state-read error is returned without that retry.

The first attempt logged /info HTTP 429 responses at 10:41:57.445, .564 and .683 UTC, immediately before PROVIDER_NOT_AVAILABLE at .686. The code and stack establish a failure in strategy preflight, before native TWAP submission. Rate limiting is the leading explanation, supported by the rerun's explicit 429 cleanup failure. The original failing HTTP request type was not captured, so a clearinghouseState 429 remains a diagnosis rather than a directly observed request. There is no evidence of a missing TWAP provider or an initialization bypass. Preserve the original failed package at `artifacts/recipe-run-attempt-1/`.

## Cleanup

The recipe's final teardown succeeded at 11:21:24.761 UTC, canceling ETH orders 62253159016 and 62253159015. It had no ETH position to close. Independent venue reads at 11:21:25.200 and .631 UTC confirm zero ETH positions and zero ETH orders. Other pre-existing market exposure was not touched.

The diagnostic observer was stopped after teardown. Its shutdown removed the debug init script and perps.debug flag, closed its CDP connections, and logged stopped at 11:21:40.895 UTC. A read-only CDP check after shutdown also confirmed perps.debug was absent. It collected diagnostics only; all acceptance actions and venue mutations ran through the supplied recipe.

## Confirmed rerun failure path

Read-only follow-up inspection identifies the precise adapter behavior. In the terminal recipe library, `actions/terminal/perps/teardown_state.mjs:40` calls readVenueState before any cancellation or position closure. `_venue.mjs:101` reads clearinghouseState, frontendOpenOrders and extraAgents concurrently with Promise.all. The cleanup consumes orders and positions but does not consume agents. Nevertheless, an extraAgents failure rejects the entire snapshot and prevents the cleanup mutations from starting.

`_venue.mjs:42` throws immediately on any non-OK HTTP response, with no 429 backoff. Its pollUntil helper at line 212 also propagates read failures rather than retrying them. This explains why the rerun stopped on an agent-list rate limit despite successful Scale placement and venue order assertions. The final cleanup later used the same adapter successfully and canceled both orders. The account-state API recovered by then.

A concrete follow-up in the recipe-library repository would separate agent reads from order/position-only checks and add bounded retry for idempotent /info HTTP 429 responses. Venue mutations must retain their own handling; blindly retrying submissions is not implied. This is a follow-up recommendation, not a change made here. It would address the confirmed cleanup failure; it would not by itself prove TWAP works or confirm the precise first-attempt request that failed.

The unchanged task still limits this PR workflow to one source-fix/push pass. The lead's requested single rerun is exhausted, and its prohibition on further GitHub messages remains in effect. No extra recipe run, external-library edit or source push was performed after the continuation request.

## Outcome

Blocked on fresh full runtime proof. No completion signal will be sent with these failing nodes. An additional run would need a fresh lead instruction and should account for testnet rate limits; this attempt honors the requested single rerun.
