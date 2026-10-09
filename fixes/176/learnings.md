# Review follow-up learnings

- A missing receipt timestamp is valid before the first WebSocket frame. Feed liveness needs a separate wait deadline so cached data can age out without creating an Updated time.
- Reset the badge's wait state when its normalized symbol or aggregation changes. Keep the wall clock inside the badge so its timer cannot trigger heavy parent renders.
- Sparse testnet books do not always stall at the default aggregation. Runtime recipes must not assume that live market behavior; this adapter has no controlled WebSocket fault or frame-suppression action.
- The slot wrapper quoted a literal tilde; $HOME resolves the farm helper correctly. The active farm setup lacked lint-changed.sh, while its frozen support copy contained it.
- Broad TypeScript globs scan temporary plugin templates. Compare failures with clean main and use a task-local temp exclusion to check the application without changing repository config.
- Docker npm ci omits the repository's legacy-peer-deps setting because .npmrc is not copied at install time. This failure already occurs on main and needs separate CI repair.

- Before creating any merge commit in a new slot, verify the work email and signing key. The signed recovery merge and cherry-pick both use arthur.breton@consensys.net and A41FEC143503D502, and GitHub verifies both as valid.
