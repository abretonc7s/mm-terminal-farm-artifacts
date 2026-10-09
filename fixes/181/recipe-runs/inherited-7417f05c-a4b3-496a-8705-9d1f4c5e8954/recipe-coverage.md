# Recipe coverage

Final raw run: recipe-run-final. Unchanged evidence package: recipe-run. Status PASS, 117/117 nodes, visible slot browser, testnet, HUD on.

| AC | Mode | Nodes or tests | Evidence |
| --- | --- | --- | --- |
| AC1 | unit | npm ci, typecheck, changed-file lint, test:unit | package version 20.0.0 and validation logs |
| AC2 | mixed | ac2-order-quote, ac2-close-quote; fee-quote, fee-notional, FeePreview and form tests | recipe-run/evidence-ac2-order-quote.png and recipe-run/evidence-ac2-close-quote.png; quote parameters and discount assertions |
| AC3 | unit | fee-notional and fee-quote tests | one shared helper for USD, limits, triggers and partial closes |
| AC4 | mixed | ac4-regression-fees-label, ac4-sized-order-preview; quote hook and renderer tests | recipe-run/evidence-ac4-sized-order-preview.png, HUD and $25 order visible |
| AC5 | unit | full diff and changelog review | review.md and approach.md |

Baseline passed setup and the regression guard, then failed at ac2-order-quote. Final screenshots show the quoted 0.143% and $0.04. Unit tests prove current notional and quote field rendering, including reduced, unwaived and fully waived quotes. Charged-fill comparison is outside revised AC4 per inputs/lead-ac4.md.

Video BLOCKED: --record-video is not implemented for the terminal adapter. The attempted invocation is recorded in recipe-run-video.log. Screenshots carry the visual proof.
