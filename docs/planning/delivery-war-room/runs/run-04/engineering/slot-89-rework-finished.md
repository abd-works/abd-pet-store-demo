# Slot 89 — Rework Finished (mock isolation fix)

**Timestamp:** 2026-05-25T03:00:00Z  
**Stage:** engineering  
**Role:** engineer (executor rework)  
**Prior slot:** 89  
**Rework reason:** Full suite intermittently 145/146 — `fetchClickAndCollectQueue` returned undefined after ship-to-home client tests (parallel `vi.resetAllMocks` pollution)

## Fix summary

1. **`tests/ship-to-home/helpers/ship-to-home.client.tsx`**
   - Removed duplicate `vi.mock('@pawplace/order-client/order.api')` (inherits mock via `click-and-collect.client`).
   - **`cleanup()`** no longer calls `super.cleanup()` — parent `vi.resetAllMocks()` cleared queue mock implementations globally and raced with Increment 2 fulfillment client tests.
   - Uses `vi.clearAllMocks()` + `restoreSharedOrderApiMocks()` (`mockImplementation(async () => [])` on `fetchClickAndCollectQueue` / `fetchOrderQueue`).
   - **`seed()`** ends with `restoreSharedOrderApiMocks()` so queue stubs stay Promise-returning after ship-to-home mock setup.

2. **`tests/ship-to-home/helpers/order-api.mock.ts`** (new)
   - Global `afterEach` restores queue mock implementations (loaded from `conf/vitest.setup.ts` so it runs after per-file cleanup hooks).

3. **`conf/vitest.setup.ts`**
   - Imports `order-api.mock` before other setup.

4. **`conf/vitest.config.ts`**
   - `fileParallelism: false` — Increment 3 client tests increased parallel `afterEach`/`resetAllMocks` interleaving; serial file execution gives stable **146/146** (verified 10/10 consecutive runs).

## npm test (`C:\dev\abd-pet-store-demo\conf`)

- Command: `npm test`
- Result: **PASS — 35 files, 146/146 tests**

## Regression check

- All Increment 3 ship-to-home tests pass.
- Increment 2 click-and-collect fulfillment AC 3 (queue empty state) passes in full suite.
- No production code changes.
