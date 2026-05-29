# Slot 195 — Increment 7 Clean Code Rework

- **team-role:** engineer
- **slot_type:** executor
- **skill:** abd-clean-code
- **status:** done

## Fixes Applied

### 1. Long method — `InStoreReturnController.initiateInStoreReturn` (violation #1)

Extracted `_buildReturnPayload` (assembles ReturnRequest, override payload, and staffId from parsed input) and `_formatResponse` (maps Return entity to the JSON DTO). The public method now delegates validation → lookup → build → call service → format, each step clearly separated.

### 2. Bare catch blocks — `ReturnService` (violation #4)

The catch in `initiateReturn` that silently swallowed `LabelGenerationError` now logs a warning with the return ID before continuing. Non-label errors still rethrow.

### 3. Bare catch blocks — `ReturnRefundNotificationService` (violation #5)

**Already resolved.** The three bare `catch` blocks were replaced with a single `_sendOrQueue` helper that captures the error, wraps it in a `NotificationDeliveryError` domain exception, and rethrows after enqueueing.

### 4. Bare catch block — `ReturnController.getBatchReturnStatuses`

Found an additional bare `catch` in the batch eligibility loop. Fixed to capture and log the error before defaulting to ineligible.

### 5. Duplication — `enrichSchemaItems` (violation #10, pattern 1: controller enrichedItems)

Both `ReturnController` and `InStoreReturnController` had identical `items.map(i => ({ sku, name: sku, quantity, unitPrice: 0 }))`. A shared `enrichSchemaItems` function was already extracted into `ReturnRequest.ts`. Updated `InStoreReturnController` to use it via `_buildReturnPayload`.

### 6. Duplication — `existingReturnData` mapping (violation #10, pattern 2)

`InStoreReturnService` had an inline `.map()` duplicating `Return.toEligibilityData`. Replaced with the static method that `ReturnService` already uses.

### 7. Duplication — transient-retry-escalate (violation #10, pattern 3)

Both `RefundService._applyRefundOutcome` and `RefundRetryJob._processEntry` follow success → complete, transient → retry, else → escalate. Both are already well-factored into private helpers with clear names. The structural similarity is intentional — each operates on different parameter shapes and side effects (first-attempt notifications vs. retry-queue bookkeeping). No extraction needed; the pattern is readable in both places.

### Already clean (no changes required)

| Violation | File | Status |
|-----------|------|--------|
| #2 — nesting / constructor injection | `refund.service.ts` | Guard clauses, early returns, and explicit constructor injection already in place |
| #3 — nesting / module-level Map | `refund-retry.job.ts` | `_processEntry` extracted; all deps constructor-injected via interfaces |
| #6 — module-level Map | `return-label.service.ts` | `ILabelRetryQueue` injected via constructor |
| #7 — module-level Map | `refund-retry.service.ts` | `IRefundRetryStateStore` injected via constructor |
| #8 — encapsulation | `Return.ts` | `_returnStatus`, `_returnLabel`, `_returnQrCode`, `_managerOverride` all private with getters; mutation via `transitionStatus`, `attachLabel`, `applyOverride` |
| #9 — encapsulation | `Refund.ts` | `_refundStatus` private with `currentStatus` getter; mutation via `transitionStatus` |
