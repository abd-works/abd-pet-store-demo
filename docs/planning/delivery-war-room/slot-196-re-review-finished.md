# Slot 196 — Re-review finished (Run 8 — Increment 7: Returns and refunds — Clean code re-review)

```yaml
team-role: engineer
slot_type: reviewer
skill: abd-clean-code
workspace: C:\dev\abd-pet-store-demo
run: "Run 8 — Increment 7: Returns and refunds"
ticket_run: 8
stage: engineering
rework_slot: 195
gate_result: PASS
```

## Verification per violation category

### 1. Function size — PASS

All previously-oversized functions have been decomposed into well-named private helpers.

| File | Longest function | Lines |
|------|-----------------|-------|
| `refund.service.ts` | `_applyRefundOutcome` | 16 |
| `refund-retry.job.ts` | `_processEntry` | 18 |
| `return.service.ts` | `initiateReturn` | 21 |
| `notification.service.ts` | `_sendOrQueue` | 17 |
| `in-store-return.controller.ts` | `initiateInStoreReturn` | 35 (physical) |

**Note on `initiateInStoreReturn`:** 35 physical lines, down from ~66. The count is inflated by multi-line function calls (6 lines for one service delegation, 5 lines for one error response object). Logical statements are ~15. Remaining content is inherent controller HTTP responsibility (parse → validate → lookup → delegate → respond → error-translate). Domain logic is fully extracted into `_buildReturnPayload` and `_formatResponse`. Acceptable for a controller method.

### 2. Control flow nesting — PASS

Both previously-nested files now use guard-clause chains with max 1 level of nesting:

- **`refund.service.ts` `_applyRefundOutcome`:** success → return; transient → return; else escalate. Flat chain.
- **`refund-retry.job.ts` `_processEntry`:** null-guard returns, then success → return; transient → return; else escalate. Flat chain.

No 3–4 level nesting found in any spot-checked file.

### 3. Systematic duplication — PASS

All three identified duplication patterns have been extracted:

- **existingReturnData mapping:** `Return.toEligibilityData(returns)` static method on the entity (Return.ts lines 78–83), replacing inline `.map()` chains.
- **transient-retry-escalate:** `_handleTransientFailure` / `_escalateToReview` private helpers in both `RefundService` and `RefundRetryJob`. Each is small (~5–7 lines) and operates on different parameter types — structurally parallel but not copy-paste.
- **enrichSchemaItems:** Shared function imported from `../shared/enrich-schema-items` into the controller (line 4, used at line 73).

### 4. Swallowed exceptions — PASS

All 4 bare `catch {}` blocks have been replaced with typed error handling:

| File | Fix verified |
|------|-------------|
| `return.service.ts` `_tryGenerateLabel` | Catches error, queues retry, throws `LabelGenerationError` with cause chain. Caller catches `LabelGenerationError` specifically and logs via `console.warn` — intentional non-critical semantics, not a bare swallow. |
| `notification.service.ts` `_sendOrQueue` (×3 callers) | Catches error, queues retry via `_queue.enqueue`, throws `NotificationDeliveryError` with `referenceId`, `notificationType`, and cause chain. |

No bare `catch {}` blocks remain.

### 5. Hidden dependencies — PASS

All module-level mutable state and default-constructed dependencies have been converted to explicit constructor injection:

| File | Verified |
|------|----------|
| `refund.service.ts` | Constructor requires `IRefundRepository`, `adapters`, `RetryService`, optional `IRefundNotifier`. No defaults, no module-level Maps. |
| `refund-retry.job.ts` | Constructor requires `RetryService`, `IRefundRetryRepository`, `IRefundRepository`, `gateways`. All explicit. |

No module-level `Map` instances found. No `?? new Foo()` default construction found.

### 6. Broken encapsulation — PASS

All 5 previously-public mutable fields are now private with read-only getters:

**Return.ts:**
- `_returnStatus` (private) → `currentStatus` getter
- `_returnLabel` (private) → `returnLabel` getter
- `_returnQrCode` (private) → `returnQrCode` getter
- `_managerOverride` (private) → `managerOverride` getter
- Mutation only via `transitionStatus()`, `attachLabel()`, `applyOverride()`
- Private constructor; creation via `static initiate()`

**Refund.ts:**
- `_refundStatus` (private) → `currentStatus`, `timingExpectationNote`, `supportGuidance` getters
- Mutation only via `transitionStatus()`
- Private constructor; creation via `static create()` with amount validation

No public mutable fields remain on either entity.

## Conclusion

All 6 violation categories are resolved. Gate result: **PASS**. Run 8 is complete.
