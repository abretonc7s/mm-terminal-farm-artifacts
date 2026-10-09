# Recipe coverage: TAT-4036 feed status on order book and trades

Recipe: `artifacts/recipe.json`. AC run: `artifacts/recipe-run` (pass 15/15, `--hud show`). Strict baseline on base `79374ac`: `artifacts/recipe-baseline-run`, which fails at the first new-behavior node `ac2-orderbook-feed-live`. Before shots: `artifacts/recipe-before-run` (`recipe-before.json`, same node ids and screenshot paths). Video: BLOCKED (`--record-video is not implemented for the terminal adapter.`).

| AC | Claim | Proof mode | Recipe nodes | Evidence | Status |
|----|-------|-----------|--------------|----------|--------|
| AC1 | The order book keeps rendering live price levels on the BTC order page (regression guard). | visual | `gate-orderbook-tab`, `ac1-orderbook-levels`, `ac1-screenshot` | `before-ac1-orderbook-levels.png` / `after-ac1-orderbook-levels.png`; `button[aria-label^="Bid at"]` visible; passes on base and branch | PROVEN |
| AC2 | The order book panel shows a live feed status with a last-updated timestamp. | mixed | `ac2-open-aggregation`, `ac2-pick-aggregation`, `ac2-orderbook-feed-live`, `ac2-orderbook-feed-time`, `ac2-screenshot` | `[data-testid="order-book-feed-status"][data-status="live"]` "Live" visible + `time[datetime]` "Updated" visible; `before-ac2-orderbook-feed-status.png` (no badge) / `after-ac2-orderbook-feed-status.png` ("● Live · Updated 12:04:31 AM"); fails on base | PROVEN |
| AC3 | The trades panel shows its feed status with a last-updated timestamp. | mixed | `ac3-open-trades`, `ac3-trades-feed-status`, `ac3-trades-feed-time`, `ac3-screenshot` | `[data-testid="trades-feed-status"][data-status="live"]` + `time[datetime]` "Updated" visible; `before-ac3-trades-feed-status.png` (no badge) / `after-ac3-trades-feed-status.png` ("● Live · Updated 12:04:33 AM") | PROVEN |
| AC4 | When a feed errors or stops updating, the panel keeps showing its last data and labels it Disconnected or Stale with the last-updated time. | unit | _(none: no recipe action can inject a WebSocket fault or stall)_ | `FeedStatus.test.tsx`, `feed-status.test.ts`, `OrderBook.test.tsx`, `Trades.test.tsx`, `live-trades-query.test.tsx`; these tests fail with the source change reverted | PROVEN (unit) |

## Notes
- AC2 selects the 100 aggregation first. At the default aggregation, the provider drops testnet l2Book updates (a pre-existing `matchesAggregation` / top-two-bid estimate issue; see report.md), and the badge correctly shows `Connecting` there.
- The recipe HUD is drawn during the run (`--hud show`), but the terminal adapter hides it during `ui.screenshot` by design (`web-dapp/platform/page.mjs`).
- Each evidence row has its own before/after pair captured by the same recipe node.
