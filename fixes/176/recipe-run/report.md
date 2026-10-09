# MetaMask Recipe Run

Status: pass
Duration: 11s
Nodes: 19/19 passed

## Steps
- PASS setup-launch (metamask.app.launch, 4.2s): network=testnet, proof=terminal-browser-launch
- PASS setup-open-order (ui.navigate, 494ms): page=order
- PASS gate-orderbook-tab (ui.wait_for, 986ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac1-orderbook-levels (ui.wait_for, 537ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac1-screenshot (ui.screenshot, 113ms): path=screenshots/recipe/evidence-ac1-orderbook-levels.png
- PASS ac4-default-aggregation-stale (ui.wait_for, 528ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac4-default-aggregation-time (ui.wait_for, 340ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac4-default-aggregation-levels (ui.wait_for, 348ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac4-screenshot (ui.screenshot, 81ms): path=screenshots/recipe/evidence-ac4-orderbook-awaiting-frame.png
- PASS ac2-open-aggregation (ui.press, 542ms): clicked=true, selector=button[aria-haspopup="true"], tagName=BUTTON, partiallyCovered=false, surface=app
- PASS ac2-pick-aggregation (ui.press, 483ms): clicked=true, selector=[role="menu"][aria-label="Price aggregation"] [role="menuitem"][data-key="100"], tagName=DIV, partiallyCovered=false, surface=app
- PASS ac2-orderbook-feed-live (ui.wait_for, 519ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac2-orderbook-feed-time (ui.wait_for, 345ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac2-screenshot (ui.screenshot, 99ms): path=screenshots/recipe/evidence-ac2-orderbook-feed-status.png
- PASS ac3-open-trades (ui.press, 536ms): clicked=true, selector=[role="tablist"][aria-label="Order panel"] [role="tab"]:nth-child(2), tagName=DIV, partiallyCovered=false, surface=app
- PASS ac3-trades-feed-status (ui.wait_for, 543ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac3-trades-feed-time (ui.wait_for, 442ms): matched=true, surface=app, cdpPort=9543, targetUrl=http://localhost:9343/order/BTC
- PASS ac3-screenshot (ui.screenshot, 101ms): path=screenshots/recipe/evidence-ac3-trades-feed-status.png
- PASS done (end, 0ms)
