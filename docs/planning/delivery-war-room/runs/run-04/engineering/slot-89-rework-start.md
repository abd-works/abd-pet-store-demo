# Slot 89 — Rework Start (Increment 3 ATDD — mock isolation fix)

```yaml
team-role: engineer
slot_type: executor
workspace: c:\dev\abd-pet-store-demo
stage: engineering
depends_on:
  - "88"
run_scope: Increment 3 — Ship to home ATDD harness fix (mock isolation)
skills:
  - abd-acceptance-test-driven-development
prior_executor_slot: 89
checkpoint: none
entry_conditions_met:
  - slot-89-finished.md exists
  - tests/ship-to-home/ artifacts present
  - isolated failing test passes; full suite fails
rework_reason: Lead verification — full suite 145/146; click-and-collect AC 3 fails after ship-to-home files run (mock pollution)
failing_test: tests/click-and-collect/fulfillment/fulfill-click-and-collect-order_client.test.tsx — AC 3 queue empty state
error: fetchClickAndCollectQueue returns undefined (.then on undefined) after ship-to-home vi.mock/cleanup
```

Fix `tests/ship-to-home/helpers/ship-to-home.client.tsx` (and related) so `vi.mock('@pawplace/order-client/order.api')` does not leak into Increment 2 click-and-collect tests. Pattern: restore `fetchClickAndCollectQueue` default in `afterEach`/`cleanup`, or scope mocks per-file without global side effects. Slot 89 finished doc claimed cleanup fix — make it reliable across full vitest run order.

Run `npm test` from `conf/` — require **146/146 PASS** with no regressions.

Update `slot-89-finished.md` with rework notes OR write `slot-89-rework-finished.md`. Prefer **slot-89-rework-finished.md** + brief note in slot-89-finished.

Do NOT run scanners. Do NOT open slot 90.
