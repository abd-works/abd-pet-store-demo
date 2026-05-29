# Slot 188 — Finished (Run 8 — Increment 7: Returns and refunds — Arch reference reviewer)

```yaml
team-role: engineer
slot_type: reviewer
skill: abd-architecture-reference
gate_result: FAIL
```

## Review scope

Reviewed all code files produced in slot 187 against the four Increment 7 mechanism specifications in `docs/architecture/architecture-reference.md`, the `abd-architecture-reference` SKILL.md validation criteria, and the MERN project conventions.

No `rules/*.md` or `scanners/` directory exists under `abd-architecture-reference`, so this review is an AI pass against the SKILL.md validation criteria and the architecture reference's File Structure, Participants, Flow, and Walkthrough specifications.

---

## Gate result: FAIL

One critical compilation-breaking defect and several missing files from the reference specification.

---

## Critical violations (require rework)

### 1. Broken import — `createReturnRequestSchema` does not exist

**Files affected:**
- `packages/return/server/return.controller.ts` (line 2)
- `packages/return/server/in-store-return.controller.ts` (line 2)

Both controllers import `createReturnRequestSchema` from `../shared/return.schema`, but `return.schema.ts` exports `returnRequestSchema` — no symbol named `createReturnRequestSchema` exists anywhere in the codebase. This breaks compilation/startup for both controllers.

**Fix:** Rename the import to `returnRequestSchema` or add an alias export in `return.schema.ts`.

### 2. Missing files from reference File Structure — Refund Routing mechanism

The architecture reference specifies these files under `packages/payment/server/`:

| Missing file | Reference purpose |
|---|---|
| `refund-retry.job.ts` | Background worker for refund retries |
| `refund-retry.repository.ts` | Pending refund retry queue (Mongo) |
| `payment-gateway.ts` | `IPaymentGateway` interface gains `refund()` |

The retry service uses an in-memory Map instead of a repository, which means retry state is lost on restart. The SKILL.md validation criterion says: *"In project mode every file listed in the reference's File Structure block is generated."* These three files are listed and were not generated.

**Mitigation note:** The `IPaymentGateway` role is served by `IPaymentVendorAdapter` in `vendors/vendor.types.ts` (which does include `refund?()`). This is a naming divergence rather than a missing capability, but the file name does not match the reference.

### 3. Missing file from reference File Structure — In-Store Return mechanism

The reference lists `packages/return/shared/InStoreReturn.ts` ("extends Return with: initiatedBy (staff), storeCode, managerOverride"). No such file was created. The implementation puts all in-store concerns as optional fields on the `Return` entity, which aligns with the chosen pattern ("in-store return as a flag on the existing Return entity"), but the explicit file in the File Structure was not produced.

### 4. Missing extension — `notification.schema.ts`

The reference's Notification File Structure lists `notification.schema.ts` — "extended with return/refund notification types". No `notification.schema.ts` file exists or was extended in the notification package.

---

## Mechanism-by-mechanism assessment

### Mechanism 1: Return Lifecycle — PASS with issues above

**Correct:**
- `Return.ts` entity with lifecycle state machine, `initiate()` factory, `transitionStatus()`, `attachLabel()`, `applyOverride()`, `returnedItemsValue()` — matches Participants table
- `ReturnRequest.ts` value object with items, reason, condition — matches reference
- `ReturnEligibility.ts` domain rule: return window, duplicate guard, partial returns — matches reference
- `ReturnStatus.ts` enum with valid-transition enforcement for the full lifecycle (initiated → label_generated → shipped_back → received → inspected → refund_processing → completed) — matches reference
- `ReturnWindow.ts` configurable 30-day default anchored on delivery date — matches reference
- `return.schema.ts` Zod DTOs for create/get return and eligibility result — matches reference
- `index.ts` barrel exports — present
- `return.service.ts` orchestrates eligibility → initiate → label generation with try/catch retry queue — matches walkthrough code
- `return.repository.ts` IReturnRepository interface + InMemoryReturnRepository — matches reference
- `return-label.service.ts` generates label + QR, queues retry on failure — matches reference
- `return-label.provider.ts` ILabelProvider + StubLabelProvider — matches reference
- `return.controller.ts` routes POST/GET with Zod validation, domain error mapping — matches reference (except broken import)
- `return.routes.ts` Express router with correct endpoints — matches reference

**Issue:** Broken `createReturnRequestSchema` import in controller (critical, see above).

### Mechanism 2: Refund Routing — PASS with missing files

**Correct:**
- `Refund.ts` entity: refundId, orderNumber, returnId, vendor, amount, refundStatus, vendor-routing invariant, amount validation (positive guard) — matches reference
- `RefundStatus.ts` enum (processing → completed | requires_review) with timing expectation note and support guidance — matches reference
- `refund.schema.ts` Zod DTOs — matches reference
- `refund.service.ts` resolves original vendor, invokes vendor refund, manages retry/escalation via RefundRetryService — matches walkthrough
- `refund-retry.service.ts` classifies vendor errors (transient/hard), schedules retry, escalation on exhaustion — matches reference
- `refund.repository.ts` IRefundRepository + InMemoryRefundRepository — matches reference
- `refund.controller.ts` GET refund-status endpoint — matches reference
- All three vendor adapters (`stripewave.adapter.ts`, `paynova.adapter.ts`, `vaultpay.adapter.ts`) gained `refund()` method — matches reference
- `vendor.types.ts` extended with `VendorRefundResult` type and `refund?()` on `IPaymentVendorAdapter` — matches reference intent

**Issues:** Missing `refund-retry.job.ts`, `refund-retry.repository.ts`, `payment-gateway.ts` (see above).

### Mechanism 3: In-Store Return — PASS with missing file

**Correct:**
- `in-store-return.service.ts` handles order lookup by number/email, eligibility check or manager override, return creation with `channel: in_store`, refund trigger — matches walkthrough code
- `in-store-return.controller.ts` staff endpoints with Zod validation, manager override schema, ineligibility response with `managerOverrideAvailable: true` — matches reference
- `in-store-return.routes.ts` GET /api/staff/orders/lookup, POST /api/staff/returns/:orderNumber — matches reference
- `ManagerOverride.ts` value object with approvingManager, overrideReason, approvedAt, audit record — matches reference
- Reuses `ReturnEligibility` without modification — matches reference principle
- Shared refund path via `RefundService` — matches reference principle

**Issues:** Missing `InStoreReturn.ts` file; broken `createReturnRequestSchema` import in controller (see above).

### Mechanism 4: Return & Refund Notification — PASS with missing schema

**Correct:**
- `ReturnReceivedNotification.ts` template: order number, returned items summary, "inspection underway" message, `renderHtml()` — matches reference
- `RefundCompletedNotification.ts` template: refunded amount, payment method, "credit issued" message — matches reference
- `RefundUnderReviewNotification.ts` template: order/return reference, "contact support" guidance — matches reference
- `return-refund-notification.service.ts` sends all three notification types; resolves recipient (account email or guest email); email failure queues without blocking status transitions — matches walkthrough code and reference flow
- Fire-and-queue pattern correctly implemented with try/catch → enqueue

**Issues:** Missing `notification.schema.ts` extension (see above).

---

## Code quality observations (non-blocking)

- Domain entities use private constructors with static factory methods — good encapsulation
- ReturnStatus and RefundStatus use valid-transition maps — prevents invalid lifecycle jumps
- Type-safe interfaces at repository and service boundaries — clean dependency inversion
- Guard clauses used consistently (empty items, positive amounts, required manager identity)
- No bare `catch` that swallows errors silently — label/notification failures queue retries explicitly
- `ManagerOverride` value object validates non-empty fields on construction — good domain invariant

---

## Rework required

1. **Fix broken import** in `return.controller.ts` and `in-store-return.controller.ts` — replace `createReturnRequestSchema` with `returnRequestSchema`
2. **Generate missing files**: `refund-retry.job.ts`, `refund-retry.repository.ts`, `payment-gateway.ts` (or document the naming divergence), `InStoreReturn.ts` (or remove from reference), `notification.schema.ts` extension
