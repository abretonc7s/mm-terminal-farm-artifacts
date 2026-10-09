# Recipe coverage

Current recipe.json and canonical recipe-run/ are the executed 19/19 passing follow-up proof. The older inherited package remains under recipe-runs/ for history.

| AC | Claim | Proof mode | Nodes | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| AC1 | Cached book price levels remain visible. | mixed | ac1-screenshot and preceding waits | recipe-run/screenshots/recipe/evidence-ac1-orderbook-levels.png | PASS |
| AC2 | Order book shows Live with a timestamp after a WebSocket frame. | mixed | ac2-screenshot and preceding waits | recipe-run/screenshots/recipe/evidence-ac2-orderbook-feed-status.png | PASS |
| AC3 | Trades shows Live with a timestamp after a WebSocket frame. | mixed | ac3-screenshot and preceding waits | recipe-run/screenshots/recipe/evidence-ac3-trades-feed-status.png | PASS |
| AC4 | Before the first frame, the cached book shows Connecting without a fabricated timestamp. | mixed | ac4-screenshot and preceding waits | recipe-run/screenshots/recipe/evidence-ac4-orderbook-awaiting-frame.png | PASS |

The follow-up AC4 claim tests the requested null timestamp until a real frame arrives. It supersedes the inherited default-book Stale check, which depended on the dummy-fetch timestamp defect. The original received-feed stale/disconnected claim remains covered by FeedStatus, OrderBook and Trades behavioral tests; no runtime fault injection was performed.

Six timestamp assertions fail with original source restored, then all 37 hook tests pass with the fix. All 269 affected tests pass. Video is BLOCKED: --record-video is not implemented for the terminal adapter. All four screenshots were inspected and show their target. The 100 aggregation avoids the separately documented default-book provider filter issue.
