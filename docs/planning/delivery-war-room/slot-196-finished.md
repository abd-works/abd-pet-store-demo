# Slot 196 — Finished (Run 8 — Increment 7: Returns and refunds — Clean code reviewer)

```yaml
team-role: engineer
slot_type: reviewer
skill: abd-clean-code
status: done
workspace: C:\dev\abd-pet-store-demo
run: "Run 8 — Increment 7: Returns and refunds"
ticket_run: 8
stage: engineering
gate_result: FAIL
prior_executor_slot: 195
```

## Gate Result: FAIL

Six of seventeen clean-code rules have violations requiring rework. Two additional rules have minor observations that should be addressed opportunistically. The code demonstrates strong domain language, good class-level single responsibility, and proper naming conventions — but systematic issues with function size, duplication, swallowed exceptions, encapsulation, and hidden dependencies must be resolved before this gate can pass.

---

## Rule-by-Rule Findings

### 1. Keep Functions Single Responsibility — PASS

Services orchestrate; domain entities own behavior. Pure calculations (`ReturnEligibility.isEligible`, `ReturnWindow.isWithinWindow`, `mapReturnToDto`, `resolveRecipient`) are separated from side-effecting orchestration.

### 2. Keep Functions Small and Focused (< 20 lines) — FAIL

**Multiple functions far exceed the 20-line limit:**

| File | Function | Approx. lines |
|------|----------|---------------|
| `refund.service.ts` | `initiateRefund` | ~56 |
| `in-store-return.controller.ts` | `initiateInStoreReturn` | ~66 |
| `in-store-return.service.ts` | `initiateInStoreReturn` | ~60 |
| `refund-retry.job.ts` | `run` | ~46 |
| `return/shared/ReturnEligibility.ts` | `isEligible` | ~47 |
| `return.service.ts` | `initiateReturn` | ~38 |
| `return.controller.ts` | `initiateReturn` | ~30 |
| `return.controller.ts` | `getBatchReturnStatuses` | ~24 |

**Rework required:** Extract named helpers. For example, `RefundService.initiateRefund` should extract `handleTransientFailure()` and `escalateToReview()`. `ReturnEligibility.isEligible` should extract `buildEligibleItems()` and `validateRequestedSkus()`.

### 3. Use Clear Function Parameters — PASS (minor observation)

Most functions use 0–2 parameters or parameter objects (`Return.initiate(params)`, `Refund.create(params)`). `InStoreReturnService.initiateInStoreReturn(order, request, staffId, managerOverride?)` has 4 parameters — consider a parameter object. `ReturnEligibility.isEligible(order, requestedSkus, existingReturns, currentDate)` also has 4 — consider an `EligibilityQuery` parameter object.

### 4. Simplify Control Flow — FAIL

**Deep nesting (3+ levels) in two key files:**

- `refund.service.ts` `initiateRefund`: `try { if (result.success) { ... } else if (result.transient) { if (retryState.exhausted) { ... } } else { ... } } catch { if (errorClass === 'transient') { if (retryState.exhausted) { ... } } else { ... } }` — 3–4 levels deep.
- `refund-retry.job.ts` `run`: `for { try { if { ... } else { if { ... } } } catch { if { if { ... } } else { ... } } }` — 4 levels deep.

**Rework required:** Extract `handleVendorResult()` and `handleVendorError()` helpers; use guard clauses (`if (result.success) { ...; return; }`) to flatten the branches.

### 5. Use Intention-Revealing Names — PASS

Names are strong throughout: `ReturnEligibility`, `ReturnWindow`, `ManagerOverride`, `classifyRefundError`, `scheduleRefundRetry`, `returnedItemsValue`. Named constants (`DEFAULT_RETURN_WINDOW_DAYS`, `MS_PER_DAY`, `MAX_REFUND_RETRY_ATTEMPTS`, `UNAVAILABLE_CARD_SUFFIX`) are used well. Short lambda variables (`r`, `i`) are acceptable in map/filter callbacks.

### 6. Use Consistent Naming — PASS

Retrieval uses `find` consistently (`findById`, `findByOrderNumber`, `findByReturnId`). Public service methods use `get` consistently (`getReturn`, `getRefundStatus`, `getReturnsByOrder`). `lookupOrder` in `InStoreReturnService` is a different semantic (customer-facing lookup by order number + optional email) — acceptable distinction.

### 7. Provide Meaningful Context — FAIL (minor)

**Magic numbers without named constants:**

| File | Line | Value | Should be |
|------|------|-------|-----------|
| `return.module.ts` | 21 | `7 * 24 * 60 * 60 * 1000` | `STUB_DELIVERY_DAYS_AGO` or similar |
| `refund-retry.repository.ts` | 32 | `60_000` | `RETRY_BACKOFF_BASE_MS` |

**Rework required:** Declare named constants for both values.

### 8. Eliminate Duplication — FAIL

**Three systematic duplication patterns:**

1. **`existingReturnData` mapping** — identical 4-line mapping appears in `ReturnService.checkEligibility` (lines 42–45), `ReturnService.initiateReturn` (lines 54–57), and `InStoreReturnService.initiateInStoreReturn` (lines 51–54). Extract a shared `buildExistingReturnData(returns)` helper.

2. **Transient-retry-escalate pattern** — the sequence "classify error → schedule retry → if exhausted → transition to requires_review → save → notify" is duplicated verbatim in:
   - `RefundService.initiateRefund`: both the `else if (result.transient)` branch and the `catch` block (lines 67–93)
   - `RefundRetryJob.run`: both the `else` branch and the `catch` block (lines 34–59)
   Extract a `handleRefundFailure(refund, vendor, error?)` helper.

3. **Controller `enrichedItems` mapping** — identical `items.map(i => ({ sku: i.sku, name: i.sku, quantity: i.quantity, unitPrice: 0 }))` in both `ReturnController.initiateReturn` (lines 57–61) and `InStoreReturnController.initiateInStoreReturn` (lines 43–47). Extract a shared mapper or move enrichment to the service layer.

**Rework required:** Extract the three duplicated patterns into shared helpers.

### 9. Separate Concerns — PASS

Domain entities are pure (no I/O). Services separate orchestration from domain logic. Controllers handle HTTP concerns and delegate to services. Notification templates generate content without side effects.

### 10. Maintain Abstraction Levels — PASS

Services call domain objects and repositories at consistent levels. Controllers delegate to services. Minor observation: `ReturnController.getBatchReturnStatuses` inlines a business logic loop (checking eligibility + active returns per order) that could be a service method.

### 11. Use Exceptions Properly — FAIL (minor)

**Generic `Error` used where domain exceptions belong:**

| File | Line | Throws | Should be |
|------|------|--------|-----------|
| `return.service.ts` | 40, 51 | `Error('order not found: ...')` | `OrderNotFoundError` |
| `return.service.ts` | 97 | `Error('return not found: ...')` | `ReturnNotFoundError` |
| `refund.service.ts` | 42 | `Error('order has no processing vendor')` | `RefundRoutingError` |
| `refund.service.ts` | 45 | `Error('vendor does not support refund')` | `RefundRoutingError` |

`ReturnIneligibleError` and `ReturnErrors.ts` show the correct pattern is already in use elsewhere.

**Rework required:** Define and use domain-specific exceptions for order-not-found and refund-routing errors.

### 12. Never Swallow Exceptions — FAIL

**Bare `catch {}` blocks with no logging or error capture:**

| File | Line | Context |
|------|------|---------|
| `return.service.ts` | 84 | Label generation failure — queues retry but silently drops the error |
| `return-refund-notification.service.ts` | 71 | Email send failure — queues retry, error is lost |
| `return-refund-notification.service.ts` | 98 | Email send failure — queues retry, error is lost |
| `return-refund-notification.service.ts` | 128 | Email send failure — queues retry, error is lost |

All four follow the same pattern: catch the error, queue a retry, but completely discard the error without logging. The fallback strategy is valid, but the error must be logged before proceeding.

**Rework required:** Capture the error parameter (`catch (error)`) and log it (`logger.error(...)`) in all four locations. Inject a logger dependency where one does not exist.

### 13. Use Explicit Dependencies — FAIL

**Module-level hidden state:**

| File | Issue |
|------|-------|
| `return-label.service.ts` | Module-level `retryQueue` Map (line 18) — should be an instance-level private field or an injected repository |
| `refund-retry.service.ts` | Module-level `retryStates` Map (line 13) — should be an instance-level private field or an injected repository |

**Default-constructed collaborators:**

| File | Line | Issue |
|------|------|-------|
| `refund.service.ts` | 37 | `retryService ?? new RefundRetryService()` — constructs collaborator inside constructor |
| `return/shared/ReturnEligibility.ts` | 33 | `returnWindow: ReturnWindow = new ReturnWindow()` — constructs collaborator as default parameter |

**Rework required:** Move `retryQueue` and `retryStates` Maps to instance-level private fields. Remove default construction of collaborators — require callers to inject.

### 14. Enforce Encapsulation — FAIL

**Public mutable state that should be private:**

| File | Field | Issue |
|------|-------|-------|
| `Return.ts` | `returnStatus` | Public, but accessed via `currentStatus` getter — should be private |
| `Return.ts` | `returnLabel` | Public with `!` assertion — should be private with accessor |
| `Return.ts` | `returnQrCode` | Public with `!` assertion — should be private with accessor |
| `Return.ts` | `managerOverride` | Public optional — should be private with accessor |
| `Refund.ts` | `refundStatus` | Public, but accessed via `currentStatus` getter — should be private |

**Rework required:** Make these fields private; add getter properties where external read access is needed. `returnLabel` and `returnQrCode` should not use definite assignment assertions (`!`) — use `| undefined` and guard access.

### 15. Keep Classes Single Responsibility — PASS

Classes are well-focused. `ReturnService` orchestrates the return lifecycle. `RefundService` orchestrates refund routing. Domain entities own their own state transitions. Repositories are pure persistence. Notification templates own content rendering.

### 16. Use Domain Language — PASS

Class names are domain entities (`Return`, `Refund`, `ReturnEligibility`, `ReturnWindow`, `ReturnLabel`, `ReturnQRCode`, `ManagerOverride`). Method names are domain responsibilities (`checkEligibility`, `initiateReturn`, `transitionStatus`, `attachLabel`, `applyOverride`, `classifyRefundError`, `scheduleRefundRetry`). No `Manager`, `Handler`, `Processor`, or `Util` class names.

### 17. Stop Writing Useless Comments — PASS

JSDoc comments describe what classes and functions are responsible for, not what the code does. DDD stereotype annotations (`<< Entity >>`, `<< ValueObject >>`, `<< Domain Rule >>`) add useful context. No commented-out code. No noise comments.

---

## Scanner Pass

No scanners exist under `abd-clean-code/scanners/`. Scanner pass is N/A.

---

## Summary of Required Rework

The following violations must be fixed for the gate to pass:

1. **Function size** — 8 functions exceed 20 lines; extract named helpers
2. **Control flow** — 2 functions have 3–4 levels of nesting; flatten with guard clauses and extracted helpers
3. **Duplication** — 3 systematic copy-paste patterns across services and controllers; extract shared helpers
4. **Swallowed exceptions** — 4 bare `catch {}` blocks discard errors without logging
5. **Explicit dependencies** — 2 module-level Maps are hidden state; 2 collaborators are default-constructed
6. **Encapsulation** — 5 fields are public that should be private (with getters where needed)
7. **Domain exceptions** — 4 `throw new Error(...)` should be domain-specific exceptions
8. **Magic numbers** — 2 inline numeric literals need named constants
