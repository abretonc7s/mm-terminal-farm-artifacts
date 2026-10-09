# Recipe coverage — TAT-4035

Recipe: `artifacts/recipe.json` · proof run: `artifacts/recipe-run/` (PASS, 118/118 trace entries including the composed library steps; earlier read-only run `artifacts/recipe-run-readonly/`) ·
baseline: `artifacts/recipe-baseline-run/` (fails at `ac1-panel-visible`, as expected).

| AC | Claim | Proof mode | Nodes | Evidence | Verdict |
| --- | --- | --- | --- | --- | --- |
| AC1 | Equity, uPnL, maintenance margin, and margin usage/ratio are all visible and update live off the WS-driven data already flowing through live-positions-query.ts/live-user-info-query.ts. | mixed | `ac1-panel-visible`, `ac1-equity`, `ac1-upnl`, `ac1-maintenance`, `ac1-margin-usage`, `ac1-margin-ratio`, `ac1-flat-maintenance`, `ac1-flat-upnl`, `ac1-screenshot`, `ac1-open-position`, `ac1-live-maintenance`, `ac1-live-upnl`, `ac1-live-upnl-tone`, `ac1-live-margin-usage`, `ac1-live-screenshot`, `ac1-close-position`, `ac1-closed-maintenance`, `ac1-closed-upnl` | before `artifacts/before-ac1-order-form-no-account-panel.png`; after `artifacts/after-ac1-account-summary-panel.png` (flat) and `artifacts/after-ac1-account-summary-open-position.png` (open testnet position: maintenance $0.50, usage 1.55%, equity $538.45 → $538.42); no reload between order and assertions | pass |
| AC2 | Fee tier and post-discount fee display correctly in the order form. | mixed | `ac2-fee-tier`, `ac2-fee-rate`, `ac2-wait-claimed`, `ac2-screenshot` | before `artifacts/before-ac2-order-summary-no-fee-tier.png`; after `artifacts/after-ac2-order-summary-fee-tier.png` (Tier 0 · 0.1432% = 0.045% × (1 − 4% referral) + 0.1% MetaMask fee) | pass |
| AC3 | Top nav supports connect/switch/disconnect and links to settings. | mixed | `ac3-settings-link`, `ac3-open-account-menu`, `ac3-menu-active-account`, `ac3-menu-add-account`, `ac3-screenshot`, `ac3-menu-disconnect`, `ac3-disconnected`, `ac3-connect`, `ac3-approve-connect`, `ac3-reconnected` | before `artifacts/before-ac3-top-nav-account-menu.png`; after `artifacts/after-ac3-top-nav-account-menu.png` (regression guard: passes in baseline and proof runs) | pass |

Video: BLOCKED: --record-video is not implemented for the terminal adapter.

Before captures: `artifacts/recipe-before.json` on main 79374ac (`artifacts/recipe-before-run/`, PASS 39/39). All runs `--hud show`; the adapter hides the HUD during `ui.screenshot`.
