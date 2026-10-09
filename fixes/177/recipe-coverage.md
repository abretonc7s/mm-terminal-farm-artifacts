# Recipe coverage

The original feature recipe and evidence remain archived in recipe-runs/inherited-b9774071-c7ff-4ca0-8dfe-fa1003167648. The root recipe.json now contains this follow-up smoke, identical to recipe-run/recipe.json and ../runtime-smoke.json. recipe-run/summary.json is PASS 47/47 on Trading/SOL testnet. runtime/ is the original output directory, copied unchanged into recipe-run/ for the completion contract. Proof modes were mapped in proof-plan.md before execution. The smoke performs no trade mutations and leaves existing positions untouched.

| AC | Proof mode | Current nodes | Evidence | Coverage |
| --- | --- | --- | --- | --- |
| AC1 live account health | mixed | ac1-panel-visible, ac1-equity, ac1-upnl, ac1-maintenance, ac1-margin-usage, ac1-margin-ratio, ac1-screenshot | runtime/screenshots/evidence-ac1-account-summary.png, tests.log | All rows visibly populated with non-zero account values. Unit tests prove position loading/failure/recovery and confirmed-flat zero values. Original lifecycle evidence is inherited, not rerun. |
| AC2 fee tier and discounted rate | mixed | ac2-fee-tier, ac2-fee-rate, ac2-screenshot | runtime/screenshots/evidence-ac2-fee-tier.png, tests.log | Tier 0 and 0.1432% visible. Unit tests prove discounted VIP/date windows and authoritative totalRate, including zero. No live VIP account is available. |
| AC3 account menu and Settings | mixed | ac3-settings-link, ac3-open-account-menu, ac3-menu-active-account, ac3-menu-add-account, ac3-menu-disconnect, ac3-disconnected, ac3-connect, ac3-approve-connect, ac3-reconnected, ac3-screenshot | runtime/screenshots/evidence-ac3-top-nav-account-menu.png | Inherited header regression actions pass on current branch. Switching to another account is not performed by this smoke; original feature scope remains covered by existing account menu support. |

No fresh before-run was performed for this follow-up. Before/after pairs in evidence-manifest.json are clearly labeled inherited family evidence. Video is unsupported by Terminal. Current screenshots include the HUD. Hook execution failed because the gateway was unavailable; the configured harness command passed directly.
