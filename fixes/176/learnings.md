# Learnings

React Query dataUpdatedAt describes all successful query resolutions. A dummy query function can stamp null or empty data as fresh, so it cannot describe a WebSocket frame's receipt time.

SSR prefetch and suspense hooks share domain cache payloads. Preserve those shapes and record subscription receipt time beside the WebSocket write. Key the stamp to the symbol and aggregation, clear it when subscribing, and advance it even for structurally identical frames.

Tests must wait for the dummy query to resolve. Immediate post-render null assertions miss this defect. Six new assertions fail against the original source; all pass after restoring the fix.

The inherited default-aggregation stale screenshot depended on an invented snapshot timestamp. The corrected initial state is Connecting with no feed timestamp. The provider dropping those frames remains a separate issue.

Terminal video recording is still unsupported. The 19-node recipe passed with four inspected screenshots; Next.js compile/runtime checks were clean.
