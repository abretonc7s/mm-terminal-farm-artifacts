# MetaMask Recipe Run

Status: pass
Duration: 18s
Nodes: 15/15 passed

## Steps
- PASS setup-launch (metamask.app.launch, 11s): network=testnet, proof=terminal-browser-launch
- PASS setup-open-order (ui.navigate, 1.9s): page=order
- PASS gate-orderbook-tab (ui.wait_for, 478ms): matched=true, surface=app, cdpPort=9541, targetUrl=http://localhost:9341/order/BTC
- PASS ac1-orderbook-levels (ui.wait_for, 604ms): matched=true, surface=app, cdpPort=9541, targetUrl=http://localhost:9341/order/BTC
- PASS ac1-screenshot (ui.screenshot, 248ms): path=screenshots/recipe/evidence-ac1-orderbook-levels.png
- PASS ac2-open-aggregation (ui.press, 733ms): clicked=true, selector=button[aria-haspopup="true"], tagName=BUTTON, partiallyCovered=false, surface=app
- PASS ac2-pick-aggregation (ui.press, 478ms): clicked=true, selector=[role="menu"][aria-label="Price aggregation"] [role="menuitem"][data-key="100"], tagName=DIV, partiallyCovered=false, surface=app
- PASS ac2-orderbook-feed-live (ui.wait_for, 517ms): matched=true, surface=app, cdpPort=9541, targetUrl=http://localhost:9341/order/BTC
- PASS ac2-orderbook-feed-time (ui.wait_for, 347ms): matched=true, surface=app, cdpPort=9541, targetUrl=http://localhost:9341/order/BTC
- PASS ac2-screenshot (ui.screenshot, 91ms): path=screenshots/recipe/evidence-ac2-orderbook-feed-status.png
- PASS ac3-open-trades (ui.press, 541ms): clicked=true, selector=[role="tablist"][aria-label="Order panel"] [role="tab"]:nth-child(2), tagName=DIV, partiallyCovered=false, surface=app
- PASS ac3-trades-feed-status (ui.wait_for, 354ms): matched=true, surface=app, cdpPort=9541, targetUrl=http://localhost:9341/order/BTC
- PASS ac3-trades-feed-time (ui.wait_for, 648ms): matched=true, surface=app, cdpPort=9541, targetUrl=http://localhost:9341/order/BTC
- PASS ac3-screenshot (ui.screenshot, 176ms): path=screenshots/recipe/evidence-ac3-trades-feed-status.png
- PASS done (end, 0ms)
