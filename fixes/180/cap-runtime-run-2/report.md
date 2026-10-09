# MetaMask Recipe Run

Status: pass
Duration: 9.3s
Nodes: 10/10 passed

## Steps
- PASS launch (metamask.app.launch, 4.6s): network=testnet, proof=terminal-browser-launch
- PASS open (ui.navigate, 497ms): page=order
- PASS ready (ui.wait_for, 1.7s): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS fractional-cap (ui.set_input, 435ms): set=true, selector=[data-testid="order-form-max-slippage"], [data-test-id="order-form-max-slippage"], [data-test="order-form-max-slippage"], tagName=INPUT, previousValue=1, value=0.01
- PASS fractional-digit (ui.key_press, 368ms): key=5, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS effective-cap (ui.wait_for, 545ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS amount (ui.set_input, 450ms): set=true, selector=[data-testid="order-form-amount"], [data-test-id="order-form-amount"], [data-test="order-form-amount"], tagName=INPUT, previousValue=$0, value=$25
- PASS estimate (ui.wait_for, 615ms): matched=true, surface=app, cdpPort=9542, targetUrl=http://localhost:9342/order/SOL
- PASS capture (ui.screenshot, 88ms): path=effective-slippage-cap.png
- PASS done (end, 0ms)
