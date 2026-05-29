# Slot 137 — Rework Finished

**Timestamp:** 2026-05-25T22:00:00Z
**Stage:** engineering
**Role:** ux-designer (executor rework)
**Prior slot:** slot-138-finished.md (reviewer FAIL — 3 blockers)
**Practice skill:** abd-interface-design
**Run scope:** Increment 5 — Pay your way logged-in payment + spec sync fixes

## Rework reason (from slot 138)

1. Logged-in multi-vendor saved payment selection always charged hardcoded StripeWave card
2. Save PayNova / VaultPay modals dismissed without persisting vendor tokens
3. `increment-5-interface-design.md` AC / accessibility / performance tables out of sync

## Fixes applied

### 1. Logged-in multi-vendor saved payment selection

| Change | Path |
| --- | --- |
| `vendor` discriminator on `SavedPaymentMethodDto` | `packages/customer-account/shared/saved-payment-method.schema.ts` |
| Vendor-aware storage + `getMethod` / `addVendorSavedMethod` | `packages/customer-account/server/saved-payment.service.ts`, `saved-payment.repository.ts` |
| `chargeWithSavedToken` — StripeWave / PayNova / VaultPay paths via `savedPaymentMethodId` | `packages/payment/server/payment.service.ts` |
| Wire `SavedPaymentService` + `SessionService` into payment module | `packages/payment/server/index.ts`, `packages/app-server/index.ts` |
| UL labels: *PayNova wallet — saved payment method*, *VaultPay — saved payment method*, StripeWave default suffix | `packages/app-client/src/pages/PaymentPage.tsx` |
| Checkout calls `payOrder({ savedPaymentMethodId })` instead of hardcoded StripeWave card | `packages/app-client/src/pages/PaymentPage.tsx` |

### 2. Save PayNova / VaultPay modal persistence

| Change | Path |
| --- | --- |
| `POST /api/account/payment-methods` — vendor token only | `packages/customer-account/server/customer-account.controller.ts`, `customer-account.routes.ts` |
| `saveVendorPaymentMethod` client API | `packages/customer-account/client/account.api.ts` |
| Modal `onSave` persists token then dismisses | `packages/app-client/src/pages/OrderConfirmationPage.tsx` |

### 3. Spec sync (`markdown-spec-stays-in-sync`)

| Change | Path |
| --- | --- |
| All 15 AC mapping rows → `implemented (UI) — ATDD pending` | `docs/ux/increment-5-interface-design.md` |
| Accessibility checklist → `implemented` (axe row remains `planned` for ATDD) | same |
| Performance `Current` column — StripeWave lazy-load, retry polling, route import notes | same |
| Change log row for rework pass | same |

## Artifacts produced

| Artifact | Path | Status |
| --- | --- | --- |
| Multi-vendor saved payment checkout | `PaymentPage.tsx`, `payment.service.ts` | fixed |
| Save modal persistence | `OrderConfirmationPage.tsx`, `account.api.ts` | fixed |
| Interface spec sync | `docs/ux/increment-5-interface-design.md` | synced |

## Test status

```
npm test (from conf/)
Test Files  64 passed (64)
     Tests  252 passed (252)
```

Guest multi-vendor flows, StripeWave lazy-load, and Increments 1–4 baseline preserved.

## Self-review (abd-interface-design rework)

| Check | Result |
| --- | --- |
| Slot 138 blockers addressed | PASS — all 3 |
| Guest checkout + Increments 1–4 preserved | PASS — 252/252 |
| Increment 5 AC-named tests | pending ATDD (unchanged scope) |
| Scanners | not run (per executor slot instructions) |

## For delivery lead

- **Status:** **COMPLETE** (rework executor) — re-submit to reviewer slot 138 or dedicated re-review slot
- **Do NOT** open slot 139 until reviewer re-pass
- Non-blocking polish from slot 138 (PayNova/VaultPay lazy-load, modal focus trap, `aria-describedby` self-reference) deferred
