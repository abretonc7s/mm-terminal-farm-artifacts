# Recipe coverage

Final recipe.json passes schema and proof planning. recipe-recovery-run passes 15/15 nodes, with clean application diagnostics and inspected screenshots. It is read-only, testnet, under the harness checkout lock, and uses the configured recipe_run hook with Node 22.

| Claim | Proof kind | Evidence |
| --- | --- | --- |
| Cached/received price levels stay visible | mixed | ac1-orderbook-levels, ac1-screenshot |
| Order book shows Live with a receipt timestamp | mixed | ac2-orderbook-feed-live, ac2-orderbook-feed-time, ac2-screenshot |
| Trades show Live with a receipt timestamp | mixed | ac3-trades-feed-status, ac3-trades-feed-time, ac3-screenshot |
| No first frame becomes Stale after the threshold without a fabricated Updated time | state, component test only | FeedStatus.test.tsx, feed-status.test.ts, OrderBook.test.tsx, tests.log |
| Error wins over timeout; a received frame restores Live; new subscription resets wait | state, component test only | FeedStatus.test.tsx, OrderBook.test.tsx, tests.log |

The initial recipe-first-frame-attempt failed at ac4-initial-connecting because live BTC frames arrived before the gate. No fault-injection or frame-suppression actions exist in the Terminal adapter, so those claims cannot be induced deterministically in this runtime. No failed screenshot is presented as proof. The final recipe is a regression guard and passes without a required failing baseline.

Video attempt: RECORDING_UNSUPPORTED, --record-video is not implemented for the terminal adapter. Screenshot evidence is supported and includes the recipe HUD.

The canonical recipe-run directory contains a copy of the passing recovery run. The earlier failed first-frame attempt is preserved in recipe-first-frame-attempt.
