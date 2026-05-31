# Interface design — Increment 5 (Pay your way)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-5-pay-your-way.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–4 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 5 — Pay your way (13 screens, 3 stories) |
| Lo-fi reference | `docs/ux/lo-fi/increment-5-pay-your-way.md` |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-5-acceptance-criteria.md` |
| Specification by example | `docs/story/specification-by-example/increment-5-specification-by-example.md` |
| Scenario walkthrough | `docs/domain/increment-5-walkthrough.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 119) |
| Initial IA | `docs/end-to-end/discovery/information-architecture.md` (Increment 1 base; Increment 2–4 checkout patterns; Increment 5 payment screens AC-derived) |
| Prior interface specs | `docs/ux/increment-2-interface-design.md`, `docs/ux/increment-3-interface-design.md`, `docs/ux/increment-4-interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/payment/` (extend), `packages/order/` (extend), `packages/notification/` (extend), `packages/app-client/src/pages/` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-25 (Specification slot 133) |

## Description

Multi-vendor checkout payment on PawPlace: *payment method selector* presents *StripeWave*, *PayNova* (*digital wallet*), and *VaultPay* (*buy-now-pay-later*) alongside multi-vendor *saved payment method* tokens for logged-in customers. Covers PayNova wallet authentication, VaultPay *eligibility check* and *instalment plan*, *hard decline* alternative-vendor paths, automatic *payment retry* for *transient error*, retry exhaustion, and save-as-*saved payment method* offers. Labels use ubiquitous-language terms verbatim. **Guest checkout and Increment 1–4 paths are preserved** — *StripeWave* card behaviour unchanged; selector adds vendors without altering card UX. Increment 4 sole-vendor deferral is **superseded** — all three vendors active at *payment method selector*.

---

## Host project conventions

Same baseline as Increments 2–4; additions for multi-vendor payment orchestration and retry UI states.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; checkout payment extensions in `packages/app-client/src/pages/PaymentPage.tsx` and vendor sub-components; vendor adapters in `packages/payment/server/vendors/`
- **State management:** React component state + `CartContext` + `CustomerSessionContext`; checkout wizard step state with vendor-branch sub-flows; payment retry polling via server-driven status or websocket (Engineering choice — UI shows server truth)
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions; extend Increment 2–4 checkout split-screen pattern
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests where host adds it; manual keyboard pass per new/changed screen
- **Performance budget:** no explicit bundle cap — do not regress Increment 4 baseline; lazy-load PayNova/VaultPay redirect/embed widgets on vendor selection only; StripeWave widget lazy-load unchanged

---

## Payment flow extension (multi-vendor selector)

Increment 4 payment step showed *StripeWave* as sole active *payment vendor* with optional *saved payment method* listbox for logged-in customers. Increment 5 **extends** the payment step without replacing prior delivery-path branching (Increment 3) or saved-entity patterns (Increment 4).

| Actor | Payment step entry | Vendor selection | Sub-flow |
| --- | --- | --- | --- |
| **Guest** | `/checkout/payment` | *payment method selector* listbox: StripeWave — card (default) · PayNova — digital wallet · VaultPay — buy-now-pay-later | Vendor-specific sub-screens (wallet auth, BNPL redirect, card entry) |
| **Logged in (verified)** | `/checkout/payment` | *saved payment method* listbox first: StripeWave · PayNova · VaultPay tokens; *use a different payment method* reveals full selector | Same sub-flows; save modals after successful PayNova/VaultPay *payment* |
| **Retry / decline recovery** | `/checkout/payment` (return state) | Full *payment method selector* with all vendors + manual card entry | Hard decline and retry exhaustion restore selector |

**Checkout progress tabs (labels — verbatim UL):** unchanged from Increment 3/4 — dynamic spine per fulfillment path; *payment* tab active on all payment sub-screens.

**StripeWave card entry:** behaviour unchanged from Increments 2–4 — card number · expiry · CVV · validation feedback · processing indicator. Transient failure on StripeWave triggers automatic *payment retry* (Increment 5).

**System-only paths (no dedicated customer screen):** *webhook callback* reconciliation (PayNova AC 4, VaultPay AC 4) — customer sees outcome via order confirmation redirect or *payment method selector* return / account notification on failure; documented in AC mapping as system behaviour with customer notification affordance.

---

## Screens (carried from lo-fi)

| Screen | Layout | Route (planned) | Stories | Change |
| --- | --- | --- | --- | --- |
| guest checkout — payment method selector | split-screen | `/checkout/payment` | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | **Extend** — multi-vendor selector replaces StripeWave-only |
| guest checkout — StripeWave card entry | split-screen | `/checkout/payment/stripewave` | Retry Failed Payment | **Extend** — retry indicator on transient error |
| guest checkout — PayNova wallet flow | split-screen | `/checkout/payment/paynova` | Process Digital Wallet Payment via PayNova | **New** |
| guest checkout — PayNova hard decline | split-screen | `/checkout/payment/paynova/declined` | Process Digital Wallet Payment via PayNova · Retry Failed Payment | **New** |
| guest checkout — VaultPay BNPL flow | split-screen | `/checkout/payment/vaultpay` | Process Buy-Now-Pay-Later via VaultPay | **New** |
| guest checkout — VaultPay hard decline | split-screen | `/checkout/payment/vaultpay/declined` | Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | **New** |
| guest checkout — payment retry in progress | split-screen | `/checkout/payment/retrying` | Retry Failed Payment | **New** |
| guest checkout — payment retry exhausted | split-screen | `/checkout/payment/retry-exhausted` | Retry Failed Payment | **New** |
| order confirmation — multi-vendor payment | stack | `/order-confirmation/:orderNumber` | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | **Extend** — vendor-specific masked detail |
| logged-in checkout — payment method selector | split-screen | `/checkout/payment` (logged-in branch) | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay | **Extend** — multi-vendor saved tokens |
| logged-in checkout — save PayNova saved payment method | modal | (overlay post-confirmation) | Process Digital Wallet Payment via PayNova | **New** |
| logged-in checkout — save VaultPay saved payment method | modal | (overlay post-confirmation) | Process Buy-Now-Pay-Later via VaultPay | **New** |
| account notification — background payment retry outcome | stack | `/account/notifications/:id` or email deep link | Retry Failed Payment | **New** |

Affordances, control types, conditional states, and scope guard: see lo-fi § Screens, § Affordance trace, and § Scope guard.

---

## Screen specs (from lo-fi — regions verbatim)

### guest checkout — payment method selector

**Layout:** split-screen  
**Route:** `/checkout/payment` (guest branch)  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — guest | header | toolbar | find stores · shop supplies · shopping cart · log in · register | Guest chrome preserved from Increments 2–4 |
| checkout progress | header | nav-tabs | shopping cart · billing address · shipping address · delivery option · payment (active) | Dynamic spine per fulfillment path |
| payment method selector | left | listbox | StripeWave — card (selected) · PayNova — digital wallet · VaultPay — buy-now-pay-later | All three vendors visible; StripeWave default selection |
| payment method hint | left | form | StripeWave and PayNova and VaultPay remain selectable after cancel | Vendor-switch affordance per PayNova AC 1 |
| order review summary | right | form | order line item list · shipping address · delivery option · order total · back · continue with selected payment method (primary) | Advances to vendor-specific sub-flow |

---

### guest checkout — StripeWave card entry

**Layout:** split-screen  
**Route:** `/checkout/payment/stripewave`  
**AC stories:** Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| payment method selector summary | StripeWave — card (selected) · change payment method | Selected vendor shown; link back to selector |
| StripeWave card details | card number · expiry · CVV | Card validation before confirm — behaviour unchanged from Increment 2–4 |
| payment validation feedback | validation error on card details · payment decline message · processing indicator · retrying payment | Transient failure triggers automatic *payment retry* |
| order review summary | order line item list · order total · confirm order (primary) | Initiates StripeWave *payment* |

---

### guest checkout — PayNova wallet flow

**Layout:** split-screen  
**Route:** `/checkout/payment/paynova`  
**AC stories:** Process Digital Wallet Payment via PayNova

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| PayNova wallet authentication | PayNova — digital wallet · redirecting to PayNova wallet authentication · authorise payment with mobile wallet credentials | Redirect or embed PayNova flow |
| PayNova cancel affordance | cancel PayNova wallet flow · return to payment method selector | *StripeWave* and *VaultPay* remain selectable on cancel |
| order review summary | order line item list · order total · awaiting PayNova authorisation | Order not confirmed until *payment confirmation* |

---

### guest checkout — PayNova hard decline

**Layout:** split-screen  
**Route:** `/checkout/payment/paynova/declined`  
**AC stories:** Process Digital Wallet Payment via PayNova · Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| PayNova decline feedback | hard decline reason from PayNova · insufficient wallet balance example · wallet locked example | Decline reason as much as PayNova provides |
| alternative payment vendors | retry with PayNova · switch to StripeWave (primary) · switch to VaultPay | No *order* confirmed; no *confirmation email*; no automatic *payment retry* |
| order review summary | order total · order remains unpaid | *Hard decline* invariant |

---

### guest checkout — VaultPay BNPL flow

**Layout:** split-screen  
**Route:** `/checkout/payment/vaultpay`  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| VaultPay BNPL redirect | VaultPay — buy-now-pay-later · redirecting to VaultPay BNPL flow | Redirect or embed VaultPay |
| eligibility check status | VaultPay eligibility check in progress | Per-transaction *eligibility check* |
| instalment plan summary | instalment plan schedule · accept instalment plan (primary) · decline instalment plan | Customer must accept *instalment plan* before capture |
| order review summary | order line item list · order total · awaiting VaultPay approval | |

---

### guest checkout — VaultPay hard decline

**Layout:** split-screen  
**Route:** `/checkout/payment/vaultpay/declined`  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| VaultPay decline feedback | buy-now-pay-later not available for this transaction · eligibility failed · credit check failed | VaultPay decision — not PawPlace's |
| alternative payment vendors | switch to StripeWave (primary) · switch to PayNova | No *order* confirmed; no automatic *payment retry* |
| order review summary | order total · order remains unpaid | |

---

### guest checkout — payment retry in progress

**Layout:** split-screen  
**Route:** `/checkout/payment/retrying`  
**AC stories:** Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| payment retry indicator | retrying payment · automatic payment retry in progress · attempt count within retry window | Shown on *transient error* — no manual action during auto-retries |
| same vendor note | retrying through same payment vendor | Same-vendor *payment retry* invariant |
| order review summary | order total · payment not yet confirmed | Customer may navigate away — retry continues in background |

---

### guest checkout — payment retry exhausted

**Layout:** split-screen  
**Route:** `/checkout/payment/retry-exhausted`  
**AC stories:** Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| retry exhaustion feedback | payment could not be processed · retry window exhausted | After final failed attempt within *retry window* |
| payment method selector | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later · manual card entry | Full selector restored with all vendor options |
| order review summary | order total · order remains unpaid | |

---

### order confirmation — multi-vendor payment

**Layout:** stack  
**Route:** `/order-confirmation/:orderNumber`  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| order confirmation | order number · order line item list · total paid · masked payment method · payment vendor label · confirmation email sent | Shown after successful *payment confirmation* from any vendor |
| vendor-specific payment detail | PayNova vendor transaction reference · VaultPay instalment reference · StripeWave last four digits | Vendor-appropriate masked detail |

---

### logged-in checkout — payment method selector

**Layout:** split-screen  
**Route:** `/checkout/payment` (logged-in branch)  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay

| Region | Controls | Interaction decisions |
| --- | --- | --- |
| primary navigation — logged in | find stores · shop supplies · shopping cart · wishlist · account | Logged-in chrome from Increment 4 |
| saved payment method selection | Visa •••• 4242 — StripeWave default (selected) · PayNova wallet — saved payment method · VaultPay — saved payment method · use a different payment method | Multi-vendor *saved payment method* tokens |
| payment method selector | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later | Shown when *use a different payment method* selected |
| expired saved payment method | expired saved payment method (dimmed) | Expired tokens not silently charged |
| order review summary | order total · confirm order (primary) | |

---

### logged-in checkout — save PayNova / VaultPay saved payment method

**Layout:** modal  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay

| Modal | Controls | Interaction decisions |
| --- | --- | --- |
| save PayNova | save PayNova as saved payment method for future orders · save PayNova wallet (primary) · not now · only PayNova vendor token stored — not wallet secrets | Offered after successful PayNova *payment* |
| save VaultPay | save VaultPay as saved payment method for future orders · save VaultPay identity (primary) · not now · future VaultPay checkout pre-fills identity but requires eligibility check per transaction | Per-transaction *eligibility check* invariant |

---

### account notification — background payment retry outcome

**Layout:** stack  
**Route:** `/account/notifications/:id` (or guest email deep link)  
**AC stories:** Retry Failed Payment

| State | Controls | Interaction decisions |
| --- | --- | --- |
| background retry success | payment retry succeeded — order confirmed · view order confirmation | *Payment retry* continued after navigate-away |
| background retry failure | payment could not be processed — retry window exhausted · return to payment method selector (primary) | Guest email or account notification on exhaustion |

---

## Implementation targets (planned — Engineering)

| Screen / concern | Primary component(s) | Server module |
| --- | --- | --- |
| Multi-vendor payment selector | `PaymentMethodSelector.tsx`, extend `PaymentPage.tsx` | `packages/payment/server/payment-method-selector/` |
| StripeWave card entry (unchanged behaviour) | `StripeWavePaymentForm.tsx` (extract from PaymentPage) | `packages/payment/server/vendors/stripewave/` |
| PayNova wallet flow + hard decline | `PayNovaWalletFlow.tsx`, `PayNovaHardDecline.tsx` | `packages/payment/server/vendors/paynova/` |
| VaultPay BNPL flow + hard decline | `VaultPayBnplFlow.tsx`, `VaultPayHardDecline.tsx` | `packages/payment/server/vendors/vaultpay/` |
| Payment retry UI states | `PaymentRetryIndicator.tsx`, `PaymentRetryExhausted.tsx` | `packages/payment/server/payment-retry/` |
| Multi-vendor order confirmation | extend `OrderConfirmationPage.tsx` | `packages/order/server/` |
| Save PayNova/VaultPay modals | `SavePayNovaPrompt.tsx`, `SaveVaultPayPrompt.tsx` | `packages/customer-account/server/saved-payment-methods/` |
| Background retry notification | `PaymentRetryNotificationPage.tsx` | `packages/notification/server/` |
| Webhook reconciliation (system) | (no customer UI beyond outcome surfaces) | `packages/payment/server/webhook-callback/` |

---

## AC → behaviour → test mapping

One row per Increment 5 AC clause. Test names trace to story title and clause number. Status **pending (Engineering)** until implementation pass.

### Process Digital Wallet Payment via PayNova

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Process Digital Wallet Payment via PayNova | 1 | Selecting PayNova at *payment method selector* redirects/embeds wallet auth; cancel returns to selector with StripeWave and VaultPay still selectable | `Process Digital Wallet Payment via PayNova — AC 1: wallet auth launch and cancel preserves alternatives` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 2 | Successful *payment confirmation* confirms *order*, records PayNova *vendor transaction reference*, shows order confirmation, sends *confirmation email* | `Process Digital Wallet Payment via PayNova — AC 2: confirmation page and email on success` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 3 | *Hard decline* shows decline reason and retry PayNova / switch StripeWave / switch VaultPay; no order confirmed | `Process Digital Wallet Payment via PayNova — AC 3: hard decline alternatives no confirmation` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 4 | *Webhook callback* reconciles in-flight *payment*; success confirms order; failure returns customer to *payment method selector* or notifies retry (system — UI shows outcome) | `Process Digital Wallet Payment via PayNova — AC 4: webhook reconciliation customer outcome` | implemented (UI) — ATDD pending |
| Process Digital Wallet Payment via PayNova | 5 | Logged-in post-payment modal offers save PayNova as *saved payment method*; stores vendor token only | `Process Digital Wallet Payment via PayNova — AC 5: save PayNova wallet token opt-in` | implemented (UI) — ATDD pending |

### Process Buy-Now-Pay-Later via VaultPay

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Process Buy-Now-Pay-Later via VaultPay | 1 | Selecting VaultPay redirects/embeds BNPL flow; *eligibility check* runs; *instalment plan* presented | `Process Buy-Now-Pay-Later via VaultPay — AC 1: BNPL redirect eligibility and instalment plan` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 2 | Accepting *instalment plan* and successful *payment confirmation* confirms *order* with instalment reference; confirmation page and *confirmation email* | `Process Buy-Now-Pay-Later via VaultPay — AC 2: instalment acceptance confirms order` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 3 | *Hard decline* shows BNPL unavailable message and StripeWave / PayNova alternatives; no order confirmed | `Process Buy-Now-Pay-Later via VaultPay — AC 3: hard decline BNPL unavailable alternatives` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 4 | *Webhook callback* reconciles in-flight VaultPay *payment*; success confirms order; failure notifies retry (system — UI shows outcome) | `Process Buy-Now-Pay-Later via VaultPay — AC 4: webhook reconciliation customer outcome` | implemented (UI) — ATDD pending |
| Process Buy-Now-Pay-Later via VaultPay | 5 | Logged-in post-payment modal offers save VaultPay identity; future checkout pre-fills but requires per-transaction *eligibility check* | `Process Buy-Now-Pay-Later via VaultPay — AC 5: save VaultPay identity with per-transaction eligibility` | implemented (UI) — ATDD pending |

### Retry Failed Payment

| Story | Clause | Behaviour | Test name | Status |
| --- | --- | --- | --- | --- |
| Retry Failed Payment | 1 | *Transient error* triggers automatic *payment retry* through same *payment vendor*; *retrying payment* indicator shown; no manual action during retries | `Retry Failed Payment — AC 1: transient auto-retry with indicator` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 2 | Successful *payment retry* confirms *order* as if first attempt succeeded; order confirmation and *confirmation email* | `Retry Failed Payment — AC 2: retry success confirms order` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 3 | Retries up to maximum within *retry window*; exhaustion shows *payment could not be processed* and full *payment method selector* | `Retry Failed Payment — AC 3: retry exhaustion restores selector` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 4 | *Hard decline* does not auto-retry; immediate decline reason and alternative *payment vendor* options at selector | `Retry Failed Payment — AC 4: hard decline no auto-retry immediate alternatives` | implemented (UI) — ATDD pending |
| Retry Failed Payment | 5 | *Payment retry* continues in background on navigate-away; success confirms order; exhaustion notifies via guest email or account notification | `Retry Failed Payment — AC 5: background retry notification outcomes` | implemented (UI) — ATDD pending |

---

## Accessibility implementation

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | implemented | Fieldset legends and radio labels on vendor selector and saved-payment list; modal save prompts with labelled actions; StripeWave card fields programmatically labelled |
| Focus order matches reading order | implemented | Selector: nav → progress → vendor listbox / saved methods → summary → primary action. Vendor sub-flows: progress → vendor content → cancel/alternatives → summary |
| Focus is visible | implemented | Increment 2–4 focus styles retained; vendor tile selected state uses border + aria-checked |
| Errors programmatically associated | implemented (with notes) | `aria-live="polite"` on retry and eligibility status; `role="alert"` on payment errors. Known gap: `aria-describedby` self-reference on some decline regions — non-blocking |
| State cues not colour-only | implemented | *retrying payment* uses text + aria-live; expired saved payment method uses explicit *expired* label; hard decline uses reason text |
| Keyboard reachable | implemented | Full vendor selection, wallet cancel, instalment accept/decline, alternative vendor buttons, retry exhaustion selector without mouse |
| Axe (or host equivalent) passes | planned | Run on all new/changed payment screens in Engineering ATDD pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Screen bundle size | No explicit cap | baseline preserved | Increment 4 baseline unchanged; PayNova/VaultPay routes eagerly imported in App.tsx |
| PayNova / VaultPay widgets | Lazy-load on vendor selection | eager route imports | Redirect/embed flows load on navigation; lazy-load deferred — no measured regression |
| StripeWave widget | Lazy-load on payment step | `React.lazy` in StripeWavePaymentPage | Increment 4 pattern retained on `/checkout/payment/stripewave` |
| Payment retry polling | Non-blocking UI | `fetchPaymentRetryStatus` polling in PaymentRetryIndicator | Retry indicator polls server status with `aria-live="polite"`; no full-page blocking spinner beyond vendor flows |
| Animation / motion | ≤16 ms/frame; respect `prefers-reduced-motion` | inline styles only | Retry indicator text status; modal overlay — no heavy animation |

---

## Scope guard (implementation)

| Excluded | Rationale |
| --- | --- |
| Full *return* customer flow | Deferred to Increment 7 — *refund* routing foundation only in UL |
| *Pet* · *appointment* UI | Deferred to Increment 6 |
| Express / same-day delivery | Deferred per Increment 3 scope guard |
| Social login | Increment 4 scope guard preserved |
| Admin payment reconciliation UI | System/back-office — webhook AC is system story |

| Preserved from prior increments | Rationale |
| --- | --- |
| Guest checkout paths (Increments 2–3) | Scope guard — guest paths remain valid |
| *StripeWave* card flow behaviour | Unchanged — selector adds vendors without altering card UX |
| Logged-in saved address / saved payment patterns | Increment 4 patterns extended with PayNova/VaultPay tokens |
| Increment 3 delivery-path branching | Standard delivery vs click-and-collect checkout spine unchanged |
| Email verification gate (Increment 4) | Account-only saved-entity checkout still requires verified *customer account* |

| Superseded from Increment 4 | Rationale |
| --- | --- |
| StripeWave sole active *payment vendor* | Increment 5 activates PayNova and VaultPay at *payment method selector* |

---

## Affordance trace (Increment 5)

See lo-fi § Affordance trace — all affordances mapped to AC story and clause. Spec implementation targets above cover each row.

---

## Walkthrough parity

| Walkthrough story group | Spec coverage |
| --- | --- |
| Process Digital Wallet Payment via PayNova (7 walks) | payment method selector · PayNova wallet flow · PayNova hard decline · order confirmation · save PayNova modal |
| Process Buy-Now-Pay-Later via VaultPay (6 walks) | payment method selector · VaultPay BNPL flow · VaultPay hard decline · order confirmation · save VaultPay modal |
| Retry Failed Payment (7 walks) | StripeWave card entry · payment retry in progress · payment retry exhausted · PayNova/VaultPay hard decline (no auto-retry) · order confirmation after retry · background notification |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-25 | initial | Specification slot 133 — Increment 5 interface spec from lo-fi + spec-by-example + walkthrough; 13 screens; 15 AC clauses mapped; multi-vendor selector; guest checkout preserved; Increment 4 StripeWave-only superseded |
| 2026-05-25 | code → md | Engineering slot 137 — Increment 5 UI implementation: multi-vendor payment selector, PayNova/VaultPay/retry sub-routes, server vendor adapters + retry status API, order confirmation vendor detail, save modals; AC tests pending ATDD slot |
| 2026-05-25 | code → md | Engineering slot 137 rework — logged-in multi-vendor saved payment (vendor discriminator + `savedPaymentMethodId` charge path), save PayNova/VaultPay modal persistence via `POST /api/account/payment-methods`, AC/a11y/performance tables synced |
