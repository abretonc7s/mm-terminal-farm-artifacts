# Learnings

- Fee quote requests need exact USD notional, but a changing market price should not erase a resolved preview while the next request is pending. TanStack Query placeholder data can retain it without adding mirrored state.
- Restrict placeholder reuse to the same explicit order inputs, account, network, symbol and order type. A waiver can depend on notional, so re-request every updated amount and clear the prior quote for explicit edits.
- Assert consecutive price ticks with deferred quote requests, then assert both continuity and context isolation. The original hook fails both continuity regressions.
- This slot stores downloaded plugin templates inside temp/, and the tracked TypeScript include glob scans them. Compare errors on unchanged main and use an ignored config inheriting the tracked config to exclude slot files for application validation.
- The farm install skips Electron's binary. Restore it locally before Electron-dependent unit tests. The live-orders mock has an existing provider-identity timing race; unchanged-main reproduction and historical CI evidence belong in the report rather than an unrelated fee PR fix.
