# MetaMask Recipe Run

Status: pass
Duration: 18s
Nodes: 47/47 passed

## Steps
- PASS setup-connect/session/launch (metamask.app.launch, 5.4s): network=testnet, proof=terminal-browser-launch
- PASS setup-connect/session/open_window (metamask.wallet.read_signatures, 71ms): proof=terminal-wallet-request-log
- PASS setup-connect/session/open_market (ui.navigate, 463ms): page=order
- PASS setup-connect/session/choose_connect (switch, 7ms): matched=true, value=connect-true, expected=connect-true
- PASS setup-connect/session/connect_visible (ui.wait_for, 862ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS setup-connect/session/connect (ui.press, 969ms): clicked=true, selector=[data-testid="header-connect-wallet"], [data-test-id="header-connect-wallet"], [data-test="header-connect-wallet"], tagName=BUTTON, partiallyCovered=false, surface=app
- PASS setup-connect/session/approve_connect/choose (switch, 6ms): matched=false, value=injected, expected=extension
- PASS setup-connect/session/approve_connect/injected_done (end, 0ms)
- PASS setup-connect/session/approve_connect (call, 18ms): ref=terminal.perps.confirm-wallet-request, status=pass
- PASS setup-connect/session/connected (ui.wait_for, 672ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS setup-connect/session/capture_connected (ui.screenshot, 109ms): path=setup-connect/session/capture_connected.png
- PASS setup-connect/session/session_signatures (metamask.wallet.assert_signatures, 85ms): count=2, proof=terminal-wallet-request-log
- PASS setup-connect/session/done (end, 0ms)
- PASS setup-connect/session (call, 8.7s): ref=terminal.perps.ensure-session, status=pass
- PASS setup-connect/assert_connected (metamask.wallet.assert_connected, 138ms): account=0x316B...01fA, proof=dapp-connected-account
- PASS setup-connect/capture (ui.screenshot, 120ms): path=setup-connect/capture.png
- PASS setup-connect/done (end, 0ms)
- PASS setup-connect (call, 9.0s): ref=terminal.perps.ensure-connected, status=pass
- PASS gate-order-form (ui.wait_for, 335ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac3-settings-link (ui.wait_for, 339ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac3-open-account-menu (ui.press, 582ms): clicked=true, selector=[data-testid="header-account-button"], [data-test-id="header-account-button"], [data-test="header-account-button"], tagName=BUTTON, partiallyCovered=false, surface=app
- PASS ac3-menu-active-account (ui.wait_for, 352ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac3-menu-add-account (ui.wait_for, 646ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac3-screenshot (ui.screenshot, 116ms): path=screenshots/evidence-ac3-top-nav-account-menu.png
- PASS ac3-menu-disconnect (ui.press, 452ms): clicked=true, selector=[role="menu"][aria-label="Connected accounts"] [role="menuitem"][data-key="disconnect"], tagName=DIV, partiallyCovered=false, surface=app
- PASS ac3-disconnected (ui.wait_for, 417ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac3-connect (ui.press, 650ms): clicked=true, selector=[data-testid="header-connect-wallet"], [data-test-id="header-connect-wallet"], [data-test="header-connect-wallet"], tagName=BUTTON, partiallyCovered=false, surface=app
- PASS ac3-approve-connect/choose (switch, 4ms): matched=false, value=injected, expected=extension
- PASS ac3-approve-connect/injected_done (end, 0ms)
- PASS ac3-approve-connect (call, 9ms): ref=terminal.perps.confirm-wallet-request, status=pass
- PASS ac3-reconnected (ui.wait_for, 336ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-panel-visible (ui.wait_for, 345ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-equity (ui.wait_for, 331ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-upnl (ui.wait_for, 346ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-maintenance (ui.wait_for, 347ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-margin-usage (ui.wait_for, 615ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-margin-ratio (ui.wait_for, 342ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-wait-claimed (ui.wait_for, 647ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac1-screenshot (ui.screenshot, 119ms): path=screenshots/evidence-ac1-account-summary.png
- PASS ac2-fee-tier (ui.wait_for, 346ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac2-fee-rate (ui.wait_for, 523ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac2-wait-claimed (ui.wait_for, 348ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS ac2-screenshot (ui.screenshot, 101ms): path=screenshots/evidence-ac2-fee-tier.png
- PASS teardown-console/console (metamask.app.assert_no_console_errors, 157ms): proof=terminal-console-capture
- PASS teardown-console/done (end, 0ms)
- PASS teardown-console (call, 164ms): ref=terminal.perps.assert-clean-console, status=pass
- PASS done (end, 0ms)
