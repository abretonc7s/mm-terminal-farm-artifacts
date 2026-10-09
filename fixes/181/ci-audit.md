# Existing unit CI failure audit

The failing `live-orders-query.test.tsx` suite is untouched by this PR and fails on unchanged `origin/main` under Node 22. Checklist step 8 therefore classifies this file's failure as pre-existing. No source edits or GitHub writes were made during this audit.

## Evidence

- PR CI log `ci-failed.log` reports two failures: connection reset test line 685 and error reset test line 716, both waiting for `false` to become `true` before disabling the hook.
- Current main SHA: `a0c70d313b0b14786b9738dec5a9ccba8653d1bf`. `git diff origin/main -- src/features/perpetuals/queries/live-orders-query.ts src/features/perpetuals/queries/live-orders-query.test.tsx` is empty. SHA-256 hashes also match the isolated main archive.
- Isolated unmodified main source at `/tmp/terminal-181-ci-baseline` reproduced the line 716 failure in attempts 1, 5, 8, 10, 17, 18, 20, 25, 26, 27, 29, 30, 31 and 32. Logs are `ci-baseline-N.log`. Attempt 22 separately timed out in the existing filtering test; the remaining 17 attempts passed all 23 tests. These were three concurrent batches (8, 8 and 16 processes) to exercise timing under load.
- Independent historical **main CI**, with main's own dependencies, failed the identical line 716 assertion at SHA `a75930a11972e2310f74768e1303c93054cd1cca`: [run 37910780096, unit job 113755167558](https://github.com/consensys-vertical-apps/va-mmcx-terminal/actions/runs/37910780096/job/113755167558). Saved as `ci-main-prior-unit.log` (failure begins line 1254). Those hook/test files differ from current main only by hook formatting.
- Current main run 37913592023's unit job succeeded. The historical failure and varying local results establish intermittency, rather than a deterministic main failure.
- A single PR-branch run passed all 23 tests (`ci-live-orders-local.log`).

## Likely cause and limits

The provider mock returns a fresh object on every render. The hook's subscription effect depends on that object and resets connection/error state whenever its identity changes. Async timer callbacks, React Query notifications and polling assertions consequently race repeated resets. This mechanism is already present on main; the failures happen before the tests reach their disable assertions.

The connection-reset assertion at line 685 was **not independently reproduced** in the baseline runs. Its shared timing mechanism is a plausible explanation, not a separately proven baseline reproduction. The isolated main archive reused the installed slot `node_modules` (including controller 20), although this suite mocks the provider and REST snapshots. Historical main CI proves the error-reset failure independently with main's own install.

## Commands

All npm commands used the slot's Node 22 wrapper; output from the initial CLI probe confirmed Node `v22.22.1`.

```bash
git diff origin/main -- src/features/perpetuals/queries/live-orders-query.ts src/features/perpetuals/queries/live-orders-query.test.tsx
unset GH_TOKEN
gh run view 37910780096 --repo consensys-vertical-apps/va-mmcx-terminal --job 113755167558 --log
mkdir -p /tmp/terminal-181-ci-baseline
git archive origin/main | tar -x -C /tmp/terminal-181-ci-baseline
ln -s /Users/deeeed/dev/metamask/va-mmcx-terminal-2/node_modules /tmp/terminal-181-ci-baseline/node_modules
mkdir -p /tmp/terminal-181-ci-baseline/temp/farmslot
cp temp/farmslot/n22 /tmp/terminal-181-ci-baseline/temp/farmslot/n22
# From isolated archive, run each process with its own captured log:
bash temp/farmslot/n22 npm test -- src/features/perpetuals/queries/live-orders-query.test.tsx
```

An unsupported Vitest `--repeat` probe was rejected before tests ran; repetitions instead used separate normal test processes. No repo-wide lint was run.
