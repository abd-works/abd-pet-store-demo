# Slot 138 — Re-review Finished

**Timestamp:** 2026-05-25T23:30:00Z
**Stage reviewed:** engineering
**Role:** reviewer (`slot_type: reviewer`; team-role: ux-designer)
**Prior executor slot:** slot-137-rework-finished.md
**Practice skill reviewed:** abd-interface-design (Increment 5 — Pay your way, rework pass)

## Artifacts reviewed

| Artifact | Path | Present |
|----------|------|---------|
| Slot 137 rework executor finish | docs/planning/delivery-war-room/slot-137-rework-finished.md | yes |
| Interface design spec (authority) | docs/ux/increment-5-interface-design.md | yes |
| Multi-vendor payment selector | packages/app-client/src/pages/PaymentPage.tsx | yes |
| Order confirmation + save modals | packages/app-client/src/pages/OrderConfirmationPage.tsx | yes |
| Save modal components | packages/app-client/src/components/SavePayNovaPrompt.tsx, SaveVaultPayPrompt.tsx | yes |
| Saved payment schema + API | packages/customer-account/shared/saved-payment-method.schema.ts, client/account.api.ts, server/saved-payment.service.ts | yes |
| Vendor-aware charge path | packages/payment/server/payment.service.ts | yes |

## Scanner results (reviewer scanned)

Per slot-138-re-review-start: **manual abd-interface-design rule pass** — mechanical scanners N/A (rules-only skill; no `scanners/` directory).

| Practice skill | Scanner command | Result | Violations |
|----------------|-----------------|--------|------------|
| abd-interface-design | manual AI rule pass (5 rules) | **PASS** | none blocking |

**All scanners:** **PASS (N/A — manual pass per slot start)**

**Scanner infrastructure:** **PASS (N/A)** — same as slot 138 initial review.

## Scanner exception (only if obviously not relevant)

| Field | Content |
| --- | --- |
| **Applies?** | yes |
| **Scanner / rule** | ucd-production-grade-and-functional — Increment 5 AC-named tests absent |
| **Why not relevant here** | War room plan defers Increment 5 ATDD to a later Engineering slot. Rework pass validates blocker fixes and spec sync before ATDD — precedent slots 86-re-review, 138 initial. |
| **Exit gate without this rule** | Guest multi-vendor flows, retry states, logged-in saved-payment branch, and save-modal persistence are inspectable in code; host baseline tests green (252/252). |

## Blocker verification (slot 138 FAIL → slot 137 rework)

| # | Original blocker | Rework claim | Re-review result | Evidence |
|---|------------------|--------------|------------------|----------|
| 1 | Logged-in multi-vendor saved payment always charged hardcoded StripeWave card | Vendor discriminator + `savedPaymentMethodId` charge path | **PASS — fixed** | `SavedPaymentMethodDto.vendor` in `saved-payment-method.schema.ts`. `PaymentPage.tsx` renders UL labels (*PayNova wallet — saved payment method*, *VaultPay — saved payment method*, StripeWave default suffix) and calls `payOrder({ savedPaymentMethodId })`. `PaymentService.chargeWithSavedToken` resolves vendor token and routes PayNova → `completeWalletAuth`, VaultPay → eligibility + `acceptInstalmentPlan`, StripeWave → `authorizeCaptureSettle`. Expired methods blocked with user-visible error. |
| 2 | Save PayNova / VaultPay modals dismissed without persisting | `POST /api/account/payment-methods` + client `saveVendorPaymentMethod` | **PASS — fixed** | `OrderConfirmationPage.tsx` `onSave` handlers call `saveVendorPaymentMethod({ vendor, vendorToken })` then dismiss; errors surface via `role="alert"`. `account.api.ts` POSTs to `/api/account/payment-methods`. `customer-account.controller.ts` → `SavedPaymentService.addVendorSavedMethod`. Route wired in `customer-account.routes.ts`. |
| 3 | Spec sync (`markdown-spec-stays-in-sync`) | AC / accessibility / performance tables + change log | **PASS — fixed** | `increment-5-interface-design.md`: all 15 AC mapping rows → `implemented (UI) — ATDD pending`; accessibility checklist rows → `implemented` (axe row remains `planned` for ATDD); performance `Current` column documents StripeWave lazy-load, retry polling, eager PayNova/VaultPay imports; change log includes `2026-05-25 | code → md | Engineering slot 137 rework …` row. |

## Manual rule pass (abd-interface-design — rework pass)

| Rule | Pass / Fail | Finding |
|------|-------------|---------|
| ucd-production-grade-and-functional | **PASS (deferred AC tests)** | Logged-in saved-token checkout and save-modal persistence wired to real APIs — no dismiss-only stubs on primary affordances. Increment 5 AC-named tests deferred to ATDD slot (scanner exception). Host `npm test`: **252/252 PASS**. |
| ucd-accessibility-implementation | **PASS (with notes)** | Fieldset legends, radio labels, `aria-live` on retry, programmatic StripeWave labels preserved. Non-blocking gaps unchanged: save modals lack focus trap; `aria-describedby` self-reference on some decline regions; axe not run (spec checklist `planned`). |
| ucd-memorable-differentiation | **PASS** | Split-screen checkout layout and inline styles consistent with Increments 2–4 baseline. |
| ucd-performance-constraints | **PASS (with notes)** | StripeWave lazy-loaded via `React.lazy`. PayNova/VaultPay routes eagerly imported — spec notes deferral; no measured regression. Retry polling non-blocking with `aria-live`. |
| markdown-spec-stays-in-sync | **PASS** | Post-rework tables and change log row present; no AC rows remain `pending (Engineering)`. |

## Focused verification (re-review scope)

| Check | Pass / Fail | Finding |
|-------|-------------|---------|
| Logged-in — multi-vendor saved payment method selection | **PASS** | Vendor-aware labels, radio selection, expired-token handling, and vendor-appropriate charge path verified in `PaymentPage.tsx` + `payment.service.ts`. |
| Logged-in — save PayNova / VaultPay modals | **PASS** | Modals persist vendor token via API before dismiss; error path present. |
| Guest — multi-vendor payment selector | **PASS** | Unchanged from slot 138 initial pass — fieldset, vendor sub-flows, retry states intact. |
| Order confirmation — multi-vendor detail | **PASS** | Vendor label and transaction/instalment/last-four detail unchanged. |
| Guest checkout + Increments 1–4 preserved | **PASS** | Increment 2 C&C helper routes to StripeWave sub-route; baseline suite green. |
| npm test baseline | **PASS** | `npm test` from `conf/`: **Test Files 64 passed · Tests 252 passed (252)** — 2026-05-25 re-review run. |

## Exit-gate review (reviewer reviewed)

Reference: `content/stages/engineering.md` — **Step 1 only** (`abd-interface-design` implementation pass, Increment 5 scope).

| Gate item | Pass / Fail | Finding |
|-----------|-------------|---------|
| Scanners / manual rule pass for abd-interface-design | **PASS** | All five manual rules pass; prior `markdown-spec-stays-in-sync` and production-grade logged-in gaps resolved. |
| Runnable UI from interface spec | **PASS** | All 13 screens/routes exist; guest and logged-in multi-vendor branches runnable. |
| Implementation honors interface spec | **PASS** | Three slot 138 blockers verified fixed; logged-in saved payment and save modals align with `increment-5-interface-design.md`. |
| Host test baseline preserved | **PASS** | 252/252 green; prior 251/252 flake resolved. |
| Increment 5 AC tests (Step 3 ATDD) | **N/A** | Deferred to later Engineering slot — not in scope for step 1 gate. |
| Ripple check (engineering) | **PASS** | Increments 2–4 checkout paths and tests preserved. |

**Overall gate:** **PASS**

## Findings for delivery lead

- **Blockers:** None — all three slot 138 blockers verified fixed in slot 137 rework.

- **Suggested fixes:** None for gate. Optional non-blocking polish (deferred from slot 138): lazy-load PayNova/VaultPay route components; add modal focus trap; fix `aria-describedby` self-reference on error regions.

- **Corrections to log:** None — prior corrections incorporated in rework.

## For delivery lead

- Tick checklist: **Reviewer — manual rule pass complete** · **Reviewer — exit-gate review complete** · **Rework verified — slot 138 re-review PASS**
- **Review complete — pass** — advance to slot 139 per plan.
- Increment 5 AC-named tests remain planned for ATDD slot.
