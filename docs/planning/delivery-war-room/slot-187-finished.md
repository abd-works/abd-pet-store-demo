# Slot 187 — Finished (Run 8 — Increment 7: Returns and refunds — Arch reference executor)

```yaml
team-role: engineer
slot_type: executor
skill: abd-architecture-reference
status: done
```

## Summary

Produced runnable reference implementation code for **all four Increment 7 architecture mechanisms** from `docs/architecture/architecture-reference.md` (slot 177), following the existing MERN project structure and domain conventions.

### Mechanism 1: Return Lifecycle

Eligibility-gated return request with side-effect label generation and status-lifecycle tracking.

**Shared domain (`packages/return/shared/`):**
- `Return.ts` — Entity: lifecycle state machine, returned items, label/QR attachment, manager override, channel (online/in_store)
- `ReturnRequest.ts` — Value object: item selection, quantities, reason, condition
- `ReturnEligibility.ts` — Domain rule: return window check, duplicate-return guard, partial return support
- `ReturnStatus.ts` — Enum lifecycle with valid-transition enforcement (initiated → label_generated → shipped_back → received → inspected → refund_processing → completed)
- `ReturnWindow.ts` — Configurable time-period (default 30 days) anchored on delivery date
- `ManagerOverride.ts` — Value object: approving manager, override reason, audit timestamp
- `return.schema.ts` — Zod DTOs for create/get return, eligibility result
- `index.ts` — Barrel exports

**Server (`packages/return/server/`):**
- `return.service.ts` — Application service: eligibility check, return initiation, label generation orchestration
- `return.repository.ts` — IReturnRepository interface + InMemoryReturnRepository
- `return-label.service.ts` — Label/QR generation with retry queue
- `return-label.provider.ts` — ILabelProvider interface + StubLabelProvider
- `return.controller.ts` — POST /api/account/orders/:orderNumber/returns, GET eligibility, GET returns
- `return.routes.ts` — Express router

### Mechanism 2: Refund Routing

Vendor-routing invariant — every refund routes through the original payment vendor with retry-and-escalation.

**Shared domain (`packages/payment/shared/`):**
- `Refund.ts` — Entity: refund lifecycle, vendor-routing invariant, amount validation
- `RefundStatus.ts` — Enum (processing → completed | requires_review) with timing expectation note and support guidance
- `refund.schema.ts` — Zod DTOs for refund status display

**Server (`packages/payment/server/`):**
- `refund.service.ts` — Application service: resolve original vendor, invoke vendor refund, manage retry/escalation
- `refund-retry.service.ts` — Classify vendor errors, schedule retry, escalate on exhaustion
- `refund.repository.ts` — IRefundRepository interface + InMemoryRefundRepository
- `refund.controller.ts` — GET /api/account/orders/:orderNumber/refund-status

**Vendor adapter extensions:**
- `vendors/vendor.types.ts` — Added `refund()` to IPaymentVendorAdapter + VendorRefundResult type
- `stripewave.adapter.ts` — Added `refund()` for card refund
- `vendors/paynova.adapter.ts` — Added `refund()` for wallet credit
- `vendors/vaultpay.adapter.ts` — Added `refund()` for instalment plan adjustment

### Mechanism 3: In-Store Return

Staff-initiated return with eligibility override and shared refund path.

**Server (`packages/return/server/`):**
- `in-store-return.service.ts` — Order lookup by number/email, eligibility check or manager override, return creation, refund trigger
- `in-store-return.controller.ts` — GET /api/staff/orders/lookup, POST /api/staff/returns/:orderNumber
- `in-store-return.routes.ts` — Express router for staff endpoints

### Mechanism 4: Return & Refund Notification

Event-triggered transactional notification with fire-and-queue pattern.

**Shared templates (`packages/notification/shared/`):**
- `ReturnReceivedNotification.ts` — Template: order number, returned items summary, "inspection underway"
- `RefundCompletedNotification.ts` — Template: refunded amount, payment method, "credit issued"
- `RefundUnderReviewNotification.ts` — Template: order/return reference, "contact support" guidance

**Server (`packages/notification/server/`):**
- `return-refund-notification.service.ts` — Application service: send/queue return received, refund completed, and refund under review notifications; recipient resolution (account email or guest email); email failure queues without blocking status transitions

## Output artifacts

- `packages/return/shared/` (8 files)
- `packages/return/server/` (9 files)
- `packages/payment/shared/` (3 new files: Refund.ts, RefundStatus.ts, refund.schema.ts)
- `packages/payment/server/` (3 new files: refund.service.ts, refund-retry.service.ts, refund.repository.ts, refund.controller.ts)
- `packages/payment/server/vendors/` (3 modified files: vendor.types.ts, paynova.adapter.ts, vaultpay.adapter.ts)
- `packages/payment/server/stripewave.adapter.ts` (modified)
- `packages/notification/shared/` (3 new files)
- `packages/notification/server/` (1 new file)
