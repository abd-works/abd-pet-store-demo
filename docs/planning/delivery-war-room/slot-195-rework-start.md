# Slot 195-rework — Start (Run 8 — Increment 7: Returns and refunds — Clean code rework)

```yaml
team-role: engineer
slot_type: executor
workspace: C:\dev\abd-pet-store-demo
run: "Run 8 — Increment 7: Returns and refunds"
ticket_run: 8
stage: engineering
depends_on:
  - "196"
run_scope: Increment 7 — returns and refunds
skills:
  - abd-clean-code
rework_of: 195
reviewer_slot: 196
```

## Rework instructions

The reviewer found 6 rule violations. Fix all of them:

### 1. Function size (8 functions exceed 20 lines)
- Worst: `InStoreReturnController.initiateInStoreReturn` (~66 lines)
- Extract helper functions; each function should do one thing in ≤20 lines

### 2. Control flow nesting (3-4 levels deep)
- `RefundService.initiateRefund` and `RefundRetryJob.run` nest too deep
- Use guard clauses, early returns, and extract methods to flatten

### 3. Systematic duplication (3 copy-paste patterns)
- existingReturnData mapping (appears in multiple places)
- transient-retry-escalate handling (duplicated logic)
- controller enrichedItems (repeated in controllers)
- Extract shared helpers or domain methods

### 4. Swallowed exceptions (4 bare `catch {}` blocks)
- In `return.service.ts` and `return-refund-notification.service.ts`
- Replace with domain exceptions, logging, or proper error propagation

### 5. Hidden dependencies (module-level Maps, default-constructed collaborators)
- `ReturnLabelService` and `RefundRetryService` have module-level `Map` instances
- `RefundService` and `ReturnEligibility` have default-constructed collaborators
- Use explicit constructor injection for all dependencies

### 6. Broken encapsulation (5 public mutable fields)
- `Return.returnStatus`, `returnLabel`, `returnQrCode`, `managerOverride`
- `Refund.refundStatus`
- Make private with getters; mutations through domain methods only

Write `slot-195-rework-finished.md` when done.
