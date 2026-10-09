# Learnings

- Stabilize provider identity in hook tests. An inline provider object restarts effects on every state update and can erase the error state under CI timing. Assert that the subscription is created once and cleaned up on disable.
- An empty position array does not prove a flat account while the feed is loading or failed. Gate only the metrics that depend on positions, and omit their raw automation values until ready.
- Hyperliquid userCrossRate can include staking discounts. Determine the numeric volume tier from venue cutoffs and dated volume, using the previous 14 completed UTC days. The API includes today, so selecting the last 14 entries uses the wrong window.
- The controller total rate is authoritative even when fee components differ or totalRate is zero.
- The gateway was unavailable. The configured harness command passed directly. Terminal video recording is unsupported; recipe screenshots were produced with a visible HUD.
