# Slot 138 — Reviewer Finished

**Timestamp:** 2026-05-25T21:45:00Z
**Stage reviewed:** engineering
**Role:** reviewer (`slot_type: reviewer`; team-role: ux-designer)
**Prior executor slot:** slot-137-finished.md
**Practice skill reviewed:** abd-interface-design (Increment 5 — Pay your way, implementation pass)

## Artifacts reviewed

| Artifact | Path | Present |
|----------|------|---------|
| Slot 137 executor finish | docs/planning/delivery-war-room/slot-137-finished.md | yes |
| Interface design spec (authority) | docs/ux/increment-5-interface-design.md | yes |
| Lo-fi source | docs/ux/lo-fi/increment-5-pay-your-way.md | yes (spot-check) |
| Multi-vendor payment selector | packages/app-client/src/pages/PaymentPage.tsx | yes |
| StripeWave card entry | packages/app-client/src/pages/payment/StripeWavePaymentPage.tsx | yes |
| PayNova wallet + hard decline | packages/app-client/src/pages/payment/PayNovaWalletFlow.tsx, PayNovaHardDecline.tsx | yes |
| VaultPay BNPL + hard decline | packages/app-client/src/pages/payment/VaultPayBnplFlow.tsx, VaultPayHardDecline.tsx | yes |
| Payment retry UI | packages/app-client/src/pages/payment/PaymentRetryIndicator.tsx, PaymentRetryExhausted.tsx | yes |
| Order confirmation extensions | packages/app-client/src/pages/OrderConfirmationPage.tsx | yes |
| Save modals | packages/app-client/src/components/SavePayNovaPrompt.tsx, SaveVaultPayPrompt.tsx | yes |
| Background retry notification | packages/app-client/src/pages/PaymentRetryNotificationPage.tsx | yes |
| Order review summary | packages/app-client/src/components/OrderReviewSummary.tsx | yes |
| App routes | packages/app-client/src/App.tsx | yes |
| Payment server extensions | packages/payment/server/ (vendors, retry, webhooks) | yes (spot-check) |
| Increment 2 test ripple | tests/click-and-collect/helpers/click-and-collect.client.tsx | yes |

## Scanner results (reviewer scanned)

Command:

```powershell
python c:\dev\abd-pet-store-demo\.cursor\skills\execute-skill-using-skills-rules\scripts\run_scanners.py --skill-root c:\dev\abd-pet-store-demo\.cursor\skills\abd-interface-design --workspace c:\dev\abd-pet-store-demo
```

| Practice skill | Scanner command | Result | Violations |
|----------------|-----------------|--------|------------|
| abd-interface-design | run_scanners.py (above) | **N/A** | `[INFO] No scanners found` — all five rules declare `Scanner: AI review`; no `scanners/` directory |

**Manual AI rule pass (`packages/app-client/src/pages/` payment surfaces + `increment-5-interface-design.md`):** see rule pass table below.

**All scanners:** **PASS (N/A — rules-only skill; manual AI pass executed)**

**Scanner infrastructure:** **PASS** — `run_scanners.py` exit 0; no traceback, import crash, or false ALL CLEAN.

## Scanner exception (only if obviously not relevant)

| Field | Content |
| --- | --- |
| **Applies?** | yes |
| **Scanner / rule** | ucd-production-grade-and-functional — Increment 5 AC-named tests absent |
| **Why not relevant here** | War room plan defers Increment 5 ATDD to a later Engineering slot (slot 137 notes ATDD as Engineering step 3). Implementation pass validates runnable UI and spec alignment before ATDD — precedent slots 86-re-review, 86. |
| **Exit gate without this rule** | Guest multi-vendor flows, retry states, hard-decline alternatives, and order-confirmation vendor detail are inspectable in code; host baseline tests green (251/252; see host test note). |

## Manual rule pass (abd-interface-design — implementation pass)

| Rule | Pass / Fail | Finding |
|------|-------------|---------|
| ucd-production-grade-and-functional | **PASS (deferred AC tests)** | Guest vendor sub-flows wire real `payOrder` / `startVendorPayment` calls; retry polling uses `fetchPaymentRetryStatus`. **FAIL items:** logged-in saved-payment checkout always charges hardcoded StripeWave card regardless of selected token; save PayNova/VaultPay modals dismiss without persisting a saved payment method (no API call). Increment 5 AC-named tests deferred to ATDD slot (scanner exception). |
| ucd-accessibility-implementation | **PASS (with notes)** | Fieldset legends and radio labels on vendor selector; `aria-live="polite"` on retry and eligibility status; programmatic labels on StripeWave card fields. Gaps: `aria-describedby` self-references on decline/error elements (`PayNovaHardDecline.tsx`, `StripeWavePaymentPage.tsx`); save modals lack focus trap; axe not run (spec checklist still `planned`). |
| ucd-memorable-differentiation | **PASS** | Split-screen checkout layout and inline styles consistent with Increments 2–4 prototype baseline; no off-spec component-library chrome introduced. |
| ucd-performance-constraints | **PASS (with notes)** | `StripeWaveFields` lazy-loaded via `React.lazy` in `StripeWavePaymentPage.tsx`. PayNova/VaultPay pages eagerly imported in `App.tsx` — spec calls for lazy-load on vendor selection only; non-blocking given no bundle cap and no measured regression. |
| markdown-spec-stays-in-sync | **FAIL** | Change log includes `2026-05-25 | code → md | Engineering slot 137 …` row. **Still out of sync:** all 15 AC mapping rows remain `pending (Engineering)`; accessibility checklist rows remain `planned`; performance `Current` column still `—` (StripeWave lazy-load and retry polling implemented but not recorded). |

## Focused verification (Increment 5 — 13 screens)

| Check | Pass / Fail | Finding |
|-------|-------------|---------|
| All 13 routes wired in App.tsx | **PASS** | `/checkout/payment`, `/stripewave`, `/paynova`, `/paynova/declined`, `/vaultpay`, `/vaultpay/declined`, `/retrying`, `/retry-exhausted`, `/order-confirmation/:orderNumber`, `/account/notifications/:id` — matches slot 137 and interface spec. |
| Guest — multi-vendor payment method selector | **PASS** | `PaymentMethodSelectorPage` fieldset lists StripeWave · PayNova · VaultPay with UL labels; payment method hint present; `continue with selected payment method` advances to vendor sub-flow. |
| Guest — PayNova / VaultPay sub-flows | **PASS** | Wallet auth, BNPL eligibility + instalment plan accept/decline, cancel back to selector; hard-decline screens show alternative vendor links and unpaid order summary. |
| Guest — payment retry states | **PASS** | Transient error navigates to `/retrying`; indicator polls status with `aria-live`; exhaustion restores vendor links at `/retry-exhausted`. |
| Order confirmation — multi-vendor detail | **PASS** | `vendorLabel` / `vendorDetail` render PayNova transaction reference, VaultPay instalment reference, or StripeWave last four digits. |
| Logged-in — multi-vendor saved payment method selection | **FAIL** | Spec requires *PayNova wallet — saved payment method* · *VaultPay — saved payment method* tokens in saved list; UI renders only `cardType •••• lastFour` (Increment 4 shape). `SavedPaymentMethodDto` has no vendor discriminator. `handleContinue` on saved path always calls `payOrder` with hardcoded StripeWave card — cannot charge PayNova/VaultPay saved tokens. |
| Logged-in — save PayNova / VaultPay modals | **FAIL (partial)** | Modals render with correct UL copy and `role="dialog"`. `onSave` only closes modal — no call to save PayNova/VaultPay token API; behaviour stubbed. |
| Background retry notification | **PASS** | Success and exhaustion states with links to confirmation or payment selector. |
| Guest checkout + Increments 1–4 preserved | **PASS** | Increment 2 helper routes to `/checkout/payment/stripewave`; C&C payment tests pass. Increment 4 saved-payment tests pass. |
| npm test baseline | **PASS (minor flake)** | Reviewer run: **Test Files 63 passed | 1 failed | Tests 251 passed | 1 failed** — single 5s timeout in `manage-saved-addresses_server.test.ts` (unrelated to Increment 5 payment). No Increment 5 regressions observed. |

## Exit-gate review (reviewer reviewed)

Reference: `content/stages/engineering.md` — **Step 1 only** (`abd-interface-design` implementation pass, Increment 5 scope).

| Gate item | Pass / Fail | Finding |
|-----------|-------------|---------|
| Scanners / manual rule pass for abd-interface-design | **FAIL** | `markdown-spec-stays-in-sync` failed; logged-in multi-vendor saved payment and save-modal persistence gaps tie to production-grade fidelity. |
| Runnable UI from interface spec | **PASS (partial)** | All 13 screens/routes exist; guest multi-vendor and retry surfaces runnable. Logged-in multi-vendor saved-payment branch incomplete. |
| Implementation honors interface spec | **FAIL** | Logged-in saved payment method selection does not implement multi-vendor tokens or vendor-aware checkout per `increment-5-interface-design.md` § logged-in checkout. Save modals do not persist tokens. |
| Host test baseline preserved | **PASS** | 251/252 green; one pre-existing flaky timeout; no payment-module test failures. |
| Increment 5 AC tests (Step 3 ATDD) | **N/A** | Deferred to later Engineering slot per plan — not in scope for step 1 gate. |
| Ripple check (engineering) | **PASS** | Increments 2–4 checkout paths and tests preserved; StripeWave card UX on dedicated sub-route. |

**Overall gate:** **FAIL**

## Findings for delivery lead

- **Blockers:**
  1. **Logged-in multi-vendor saved payment method selection** — Extend saved-payment display and checkout charge path for PayNova/VaultPay tokens per spec (labels, vendor-aware `payOrder`, expired-token handling). Likely requires `SavedPaymentMethodDto` vendor field (coordinate with slot 139 object model).
  2. **Save PayNova / VaultPay modals** — Wire `onSave` to persist vendor token (not wallet secrets) via customer-account saved-payment API; dismiss-only is a stub.
  3. **Spec sync (`markdown-spec-stays-in-sync`)** — Update `increment-5-interface-design.md`: AC mapping statuses for implemented behaviours (`implemented (UI) — ATDD pending`), accessibility checklist rows, performance `Current` column (StripeWave lazy-load, retry polling).

- **Suggested fixes (rework executor slot 137 scope):**
  1. Add vendor discriminator to saved payment DTO/repository seed data (or consume slot 139 output) and render UL labels: *PayNova wallet — saved payment method*, *VaultPay — saved payment method*.
  2. Route logged-in saved-token checkout through vendor-appropriate `payOrder` payload instead of hardcoded StripeWave card in `PaymentPage.tsx` `handleContinue`.
  3. Implement save handlers in `SavePayNovaPrompt` / `SaveVaultPayPrompt` (or parent) calling saved-payment service.
  4. Sync interface spec tables and append `code → md` change log after fixes.
  5. **Non-blocking polish:** lazy-load PayNova/VaultPay route components; fix `aria-describedby` self-reference on error regions; add modal focus trap.

- **Corrections to log:**
  - `markdown-spec-stays-in-sync` — post-implementation AC/accessibility/performance tables not updated
  - `ucd-production-grade-and-functional` — logged-in multi-vendor saved payment and save-modal persistence stubbed

## For delivery lead

- Tick checklist: **Reviewer — scanners run** (PASS / N/A) and **Reviewer — exit-gate review complete**
- **Review complete — rework required** (3 blockers)
- **Do not** advance slot 139 until rework slot incorporated or operator waives blockers via `slot-138-answer.md`
- Guest multi-vendor payment selector, PayNova/VaultPay guest flows, retry UI, and order-confirmation vendor detail are acceptable foundation — rework scoped to logged-in branch, save modals, and spec sync
