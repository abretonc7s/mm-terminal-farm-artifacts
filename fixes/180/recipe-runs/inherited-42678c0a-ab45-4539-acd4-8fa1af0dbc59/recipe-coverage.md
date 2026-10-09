# Recipe coverage

Final run: artifacts/recipe-run/, PASS. All executed nodes pass; Chase resting/fill paths are mutually exclusive.

| AC | Mode | Nodes | Evidence |
| --- | --- | --- | --- |
| AC1 | mixed | ac1-*-select/fields/picture, ac1-*-venue/venue-assert, ac1-market-position, ac1-reduce-only-place, ac1-twap-venue | Native trigger types/prices, Scale children, Chase order/fill, isolated Market/TWAP positions and reduce-only venue flags; inspected evidence-ac1-*.png |
| AC2 | mixed | ac1-market-enabled, ac2-ready, ac2-estimate/picture, ac2-exceeds-cap, ac2-rejection, ac2-no-position-assert | Numeric average estimate/max control screenshot; estimate above zero cap; exact rejection message and no resulting position |
| AC3 | state | ac3-click-bid/ask, ac3-bid/ask-read, ac3-bid/ask-match, setup-restore-bid/ask | Input previousValue matches the clicked side's row data-price, then the exact value is restored |
| AC4 | unit | Targeted OrderForm, submission, validation and mapper tests | Final targeted tests pass; reverted submission code causes behavioral failures |

Video BLOCKED: --record-video is not implemented for the terminal adapter. Screenshot and trace evidence are the authorized fallback. Native TWAP is proven by its real position after the five-minute schedule; cleanup independently reads zero orders and positions.

## Self-review fix rerun

`artifacts/self-review-fix-recipe-run-2/`: PASS, 226/226 nodes, authentic testnet reads, zero final orders and positions. All eight screenshots inspected. The routing regression is also covered by the concurrent fine/coarse provider test. AC2 uses a valid $500 quote and requires the live over-cap state at submit to avoid a best-price timing race.
