# TAT-4036 report: live-feed status and last-updated time on the order book and trades panels

## Summary

Jira TAT-4036 ("Add Sentry, product analytics, and reliability guardrails") covers five workstreams. This PR delivers the one that can be built and proven on the slot without outside decisions: **a visible feed status with a last-updated timestamp on the WebSocket-driven order book and trades panels**. A panel that has lost its feed or stopped updating now says so (`Connecting`, `Live`, `Stale`, `Disconnected`) instead of showing frozen data as if it were live. Cached data stays on screen during an error.

Deferred (needs decisions or credentials this run does not have; see approach.md):
- Sentry (`@sentry/nextjs`): needs a DSN, a Sentry project, a source-map auth token and a new dependency.
- Analytics taxonomy: vendor decision (Segment is already loaded) and the shared taxonomy doc.
- Allowlist gating: the mechanism is an open GTM decision.
- LaunchDarkly kill switch: needs a flag provisioned in LD.
- Already in place, not changed here: Suspense skeletons on every panel, and the order form keeping input and showing the rejection reason (`OrderFormInner` `submissionError`).

### Finding: pre-existing order book freeze on testnet
At the default (finest) aggregation, `ControllerPerpsProvider.subscribeToOrderBook` drops l2Book updates when `matchesAggregation` fails. `adaptL2BookResponse` estimates `aggregation.active` from the gap between the top two bids, and on sparse testnet books that estimate often isn't the finest level. Every update is then discarded and the panel stays on its SSR snapshot. This was already happening, but nothing showed it. The new badge now reads `Connecting` there, with the snapshot time. Recommend a follow-up ticket to replace the gap estimate, for example by stamping the requested aggregation on each subscription's messages. It is not fixed here because it changes provider behaviour around aggregation switches.

## Changed files

- `src/features/perpetuals/order/components/FeedStatus/feed-status.ts` (new): pure `deriveFeedStatus` and labels.
- `src/features/perpetuals/order/components/FeedStatus/FeedStatus.tsx` + `FeedStatus.css.ts` (new): the badge. A 1s clock runs inside the badge only, and the time renders after mount so it can't cause a hydration mismatch.
- `src/features/perpetuals/order/components/FeedStatus/{feed-status,FeedStatus}.test.ts(x)` (new).
- `src/features/perpetuals/queries/live-orderbook-query.ts`, `live-trades-query.ts`: return `lastUpdatedAt` (React Query `dataUpdatedAt`).
- `src/features/perpetuals/order/components/OrderBook/OrderBook.tsx`, `OrderBookFilters.tsx`: the badge goes in the existing 40px filters row (status slot), with a stale threshold of 15s.
- `src/features/perpetuals/order/components/Trades/Trades.tsx`, `Trades.css.ts`: a status row above the trades list. There is no time-based staleness here, because a quiet market is not a stale feed.
- Tests updated: `OrderBook.test.tsx`, `Trades.test.tsx`, `OrderPage.streaming.test.tsx`, `live-orderbook-query.test.tsx`, `live-trades-query.test.tsx`.

## Validation (Node 22 via `bash temp/farmslot/n22`)

| Command | Result |
| --- | --- |
| `npm test -- src/features/perpetuals/order/components/FeedStatus src/features/perpetuals/order/components/OrderBook src/features/perpetuals/order/components/Trades src/features/perpetuals/queries/live-orderbook-query.test.tsx src/features/perpetuals/queries/live-trades-query.test.tsx src/features/perpetuals/order/components/OrderPage src/features/perpetuals/order/components/MarketDataTabs` | 16 files, 224 tests passed |
| Same panel/hook tests with the source changes stashed | 7 new tests fail (as expected) |
| `npm run typecheck` | pass |
| `npx biome check` on every changed/new file | clean |
| `npm run lint` (`biome check .` + typecheck) | **fails, but not because of this change**: `biome check .` also scans the slot-local `temp/` tree (excluded only via `.git/info/exclude`, which biome ignores), and `biome check src` has 63 errors on the unchanged base `79374ac`. None of those are in the changed files. |
| `npm run build` | skipped: no routing, `next.config.ts`, env or build wiring changes |

## Recipe proof

Recipe: `artifacts/recipe.json` (AC proof), `artifacts/recipe-before.json` (before-capture variant: same node ids and screenshot paths; badge waits swapped for pre-existing panel content).

| Run | Commit | Dir | Status |
| --- | --- | --- | --- |
| `--plan` | working tree | `recipe-plan` | pass |
| strict baseline | base `79374ac` | `recipe-baseline-run` | fail, 7/8 nodes: fails at the first new-behavior node `ac2-orderbook-feed-live` (setup, `ac1-*` and the aggregation-selection nodes pass) |
| before capture | base `79374ac` | `recipe-before-run` | pass 15/15 |
| **AC proof** | working tree | `recipe-run` | **pass 15/15**, side findings clean |

All runs used `TERMINAL_HEADLESS=1`, the slot lock and `--hud show`.

- **Video: BLOCKED**: `--record-video is not implemented for the terminal adapter.` (the run was refused before any node ran: `artifacts/recipe-video-attempt.json`). Reran without `--record-video`; the screenshots carry the visual ACs.
- **HUD: not visible in screenshots, even with `--hud show`**. The installed harness hides the HUD on purpose during every terminal `ui.screenshot` (`@deeeed/metamask-harness/library/actions/web-dapp/platform/page.mjs`: "Screenshots are evidence of the app, so the recipe HUD is hidden while one is captured"). Including it would need a harness change.
- Earlier runs `superseded/recipe-run-flake-{1,2}` failed at `ac2-orderbook-feed-live` at the default aggregation because of the freeze described above. They led to the aggregation-100 step and are kept for transparency.

## Acceptance criteria

| AC | Claim | Nodes | Before (base `79374ac`) | After |
| --- | --- | --- | --- | --- |
| AC1 | The order book keeps rendering live price levels on the BTC order page (regression guard). | `ac1-orderbook-levels`, `ac1-screenshot` | `recipe-before-run/screenshots/recipe/evidence-ac1-orderbook-levels.png` | `recipe-run/screenshots/recipe/evidence-ac1-orderbook-levels.png` |
| AC2 | The order book panel shows a live feed status with a last-updated timestamp. | `ac2-open-aggregation`, `ac2-pick-aggregation`, `ac2-orderbook-feed-live` (asserts `data-status="live"` + "Live"), `ac2-orderbook-feed-time` (asserts `time[datetime]` + "Updated"), `ac2-screenshot` | `recipe-before-run/screenshots/recipe/evidence-ac2-orderbook-feed-status.png` (no badge) | `recipe-run/screenshots/recipe/evidence-ac2-orderbook-feed-status.png` ("● Live · Updated 12:04:31 AM") |
| AC3 | The trades panel shows its feed status with a last-updated timestamp. | `ac3-open-trades`, `ac3-trades-feed-status`, `ac3-trades-feed-time`, `ac3-screenshot` | `recipe-before-run/screenshots/recipe/evidence-ac3-trades-feed-status.png` (no badge) | `recipe-run/screenshots/recipe/evidence-ac3-trades-feed-status.png` ("● Live · Updated 12:04:33 AM") |
| AC4 | When a feed errors or stops updating, the panel keeps showing its last data and labels it Disconnected or Stale with the last-updated time. | unit only: no recipe action can inject a WebSocket fault | n/a | `FeedStatus.test.tsx` (Stale after 16s, Disconnected with time), `feed-status.test.ts`, `OrderBook.test.tsx` "keeps the cached book and labels the feed Disconnected on error", `Trades.test.tsx` "labels the trades feed Disconnected on error while keeping trades", `live-trades-query.test.tsx` (`lastUpdatedAt` survives an error) |

## Risks

- On sparse testnet books at the default aggregation, the order book badge shows `Connecting` because of the freeze above. The badge is right, but QA may read it as a regression; it is the old freeze made visible.
- Trades on a quiet market show `Connecting` until the first WS trade arrives, with the time of the REST snapshot.
- The 15s order book stale threshold is a judgment call, tuned for l2Book's push-on-change cadence.

## Self-Review Fixes

Source: `artifacts/review-feedback.rev-pi.md`.

1. **`Connecting` never aged out** (`FeedStatus/feed-status.ts`). Fixed. `deriveFeedStatus` now checks `staleAfterMs` before it returns `connecting`. A feed that is still connecting, with data older than the threshold, reads `Stale`. `Connecting` with no data at all (`lastUpdatedAt === null`) is unchanged. Tests added: `feed-status.test.ts` "turns stale when a connecting feed's data is older than the threshold" (checks both sides of the boundary) and `FeedStatus.test.tsx` "turns Stale when a connecting feed never delivers within the threshold".
2. **AC2 proof skipped the default view** (`artifacts/recipe.json`). Fixed. AC4 is now a recipe proof target. New nodes `ac4-default-aggregation-stale`, `ac4-default-aggregation-time`, `ac4-default-aggregation-levels` and `ac4-screenshot` run at the default aggregation (`1`), before the switch to 100. They assert that the stalled testnet order book reads `Stale · Updated <time>` and that its price levels stay on screen. Evidence: `recipe-run/screenshots/recipe/evidence-ac4-orderbook-default-aggregation-stale.png`. AC4's error → `Disconnected` path is still covered by unit tests only, because no recipe action injects a WebSocket fault.
3. **Trades badge ticked with no threshold** (`FeedStatus/FeedStatus.tsx`). Fixed. `useNow(shouldTick)` reads the clock once after mount, which keeps the time display hydration-safe. It starts the 1s interval only when `staleAfterMs` is set. Test added: "does not run the clock when no stale threshold is set" (`vi.getTimerCount() === 0`).

### Re-validation (Node 22)

| Command | Result |
| --- | --- |
| `bash temp/farmslot/n22 npm test -- FeedStatus OrderBook Trades live-orderbook-query live-trades-query OrderPage MarketDataTabs` | 21 files, 390 tests passed |
| `bash temp/farmslot/n22 npm run typecheck` | pass |
| `bash temp/farmslot/n22 npx biome check <every changed src file>` | clean (16 files) |
| `bash temp/farmslot/n22 npm run lint` | fails for the pre-existing reason above: `biome check .` scans the slot-local `temp/` tree, and the base has `src` errors. No changed file is involved. |
| Recipe `--plan` → `recipe-plan-selfreview/` | PASS (19 nodes) |
| Recipe run → `recipe-run/` (headless, slot lock, hook argv) | **PASS 19/19**. Video BLOCKED: `--record-video is not implemented for the terminal adapter.` (the same refusal as the original run). Screenshots carry the visual evidence. |

| AC | Nodes | Evidence |
| --- | --- | --- |
| AC1 | `ac1-orderbook-levels`, `ac1-screenshot` | `recipe-run/screenshots/recipe/evidence-ac1-orderbook-levels.png` |
| AC4 | `ac4-default-aggregation-stale`, `-time`, `-levels`, `ac4-screenshot` | `evidence-ac4-orderbook-default-aggregation-stale.png` (aggregation 1, `● Stale · Updated …`, levels visible) |
| AC2 | `ac2-open-aggregation` … `ac2-screenshot` | `evidence-ac2-orderbook-feed-status.png` (aggregation 100, `● Live · Updated …`) |
| AC3 | `ac3-open-trades` … `ac3-screenshot` | `evidence-ac3-trades-feed-status.png` |

The pre-fix run moved to `superseded/recipe-run-pre-selfreview/`. The self-review run is now `recipe-run/`.

## Self-Review Fixes

Review: `review-feedback.rev-pi.md` (loop 2). `review-feedback.md` does not exist, so I worked from that file.

1. **PR description: stale counts (`pr-description.md:18,27`).** Fixed. The recipe count now reads 19/19, which matches `recipe-run/summary.json`. The unit test count now reads 21 files / 390 tests, which matches the re-validation above. I also added a before path to the AC4 bullet.
2. **Evidence manifest: after shots out of date, AC4 missing.** Fixed. I re-copied `after-ac{1,2,3}-*.png` from the current `recipe-run/screenshots/recipe/`, and the md5s now match that run, not `superseded/recipe-run-pre-selfreview`. I added an AC4 pair:
   - before: `before-ac4-orderbook-default-aggregation.png`, which is the base `79374ac` default-aggregation view from `recipe-before-run` (frozen book, no badge);
   - after: `after-ac4-orderbook-default-aggregation-stale.png`, showing "● Stale · Updated 12:18:44 AM" with the levels still on screen.

   The manifest summary now mentions Stale as well as Live.
3. **`FeedStatus.tsx:41` prop doc nit.** Fixed. The comment now matches `feed-status.ts:12`: "Mark the feed (connected or still connecting) stale…".

Re-validation (Node 22). The only code change is a doc comment, so I did not rerun the recipe.

| Command | Result |
| --- | --- |
| `bash temp/farmslot/n22 npm test -- src/features/perpetuals/order/components/FeedStatus` | 2 files, 13 tests passed |
| `bash temp/farmslot/n22 npx tsc --noEmit` | pass |
| `bash temp/farmslot/n22 npx biome check src/features/perpetuals/order/components/FeedStatus` | clean (5 files) |
| `bash temp/farmslot/n22 npm run lint` | fails because of existing repo-wide `biome check .` errors, the same as on base (see above). There are no errors in the changed files. |
