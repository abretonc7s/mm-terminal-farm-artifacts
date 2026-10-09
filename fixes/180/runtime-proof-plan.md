# Follow-up proof plan

| Criterion | Proof | Follow-up check |
| --- | --- | --- |
| AC1 advanced orders | mixed | Inherited recipe and screenshots remain the implementation evidence; this cap fix does not change order-type routing. |
| AC2 estimate and enforced cap | mixed | Real-depth form/submission regressions for fractional-bps caps, followed by a focused farm recipe showing the effective cap and live estimate. No trade is needed. |
| AC3 click-to-fill | state | Inherited bid/ask recipe assertions; unchanged by feedback fixes. |
| AC4 validation coverage | state | Affected Vitest tests plus the two tests updated by the main merge. |

Prepared slot macwork-mmt-2 is the authorized runtime. No capability providers are configured. Use the farm recipe runner for browser evidence. Next MCP checks are runtime diagnostics.
