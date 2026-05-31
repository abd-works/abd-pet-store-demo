# Lo-fi — Increment 5: Pay your way

> **Companion to** `docs/ux/lo-fi/increment-5-pay-your-way.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 5 — Pay your way (13 screens, 3 stories) |
| Initial IA | `docs/end-to-end/discovery/information-architecture.md` (Increment 1 base; Increment 2–4 checkout patterns; Increment 5 payment screens AC-derived) |
| AC source | `docs/story/acceptance-criteria/increment-5-acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 119) |
| State file | `docs/ux/lo-fi/increment-5-pay-your-way-state.json` |
| Wireframe | `docs/ux/lo-fi/increment-5-pay-your-way.drawio` |
| Last updated | 2026-05-25 |

## Description

Lo-fi wireframes extending checkout *payment method selector* to present *StripeWave*, *PayNova* (*digital wallet*), and *VaultPay* (*buy-now-pay-later*) alongside *saved payment method* tokens for logged-in customers. Covers PayNova wallet authentication, VaultPay *eligibility check* and *instalment plan*, *hard decline* alternative-vendor paths, automatic *payment retry* for *transient error*, retry exhaustion, and save-as-*saved payment method* offers. **Guest checkout and Increment 1–4 paths are preserved** — *StripeWave* card behaviour unchanged; selector now shows all three vendors.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 2–4 lo-fi patterns and standard multi-vendor checkout conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 2–4 | checkout progress | nav-tabs | Dynamic spine ending at payment (active) |
| Inc 2 | StripeWave payment | split-screen form | Card fields + validation feedback — behaviour preserved |
| Inc 4 | saved payment method selection | listbox | Default pre-selected; expired token dimmed |
| AC | payment method selector | listbox | Radio-style vendor tiles: StripeWave · PayNova · VaultPay · saved tokens |
| AC | PayNova flow | form + chrome | Redirect/embed wallet authentication; cancel returns to selector |
| AC | VaultPay flow | form | BNPL redirect; *instalment plan* summary before accept |
| AC | hard decline | form | Decline reason + switch-vendor actions — no auto-retry |
| AC | payment retry | form | "retrying payment" indicator; background continuation on navigate-away |
| AC | retry exhaustion | form | Failure message + full *payment method selector* with manual card entry |

**Design principles applied:** Extend Increment 4 payment step with multi-vendor *payment method selector* listbox; preserve split-screen order review; explicit feedback regions for decline, retry, and unavailable states; logged-in paths extend saved-method listbox with PayNova/VaultPay token rows.

---

## Screens

### guest checkout — payment method selector

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — guest | header | toolbar | find stores · shop supplies · shopping cart · log in · register | Guest chrome preserved from Increments 2–4 |
| checkout progress | header | nav-tabs | shopping cart · billing address · shipping address · delivery option · payment (active) | Dynamic spine per fulfillment path |
| payment method selector | left | listbox | StripeWave — card (selected) · PayNova — digital wallet · VaultPay — buy-now-pay-later | All three vendors visible; StripeWave default selection |
| payment method hint | left | form | StripeWave and PayNova and VaultPay remain selectable after cancel | Vendor-switch affordance per PayNova AC 1 |
| order review summary | right | form | order line item list · shipping address · delivery option · order total · back · continue with selected payment method (primary) | Advances to vendor-specific sub-flow |

### guest checkout — StripeWave card entry

**Layout:** split-screen  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| checkout progress | header | nav-tabs | … · payment (active) | |
| payment method selector summary | left | form | StripeWave — card (selected) · change payment method | Selected vendor shown; link back to selector |
| StripeWave card details | left | form | card number · expiry · CVV | Card validation before confirm — behaviour unchanged from Increment 2–4 |
| payment validation feedback | left | form | validation error on card details · payment decline message · processing indicator | Transient failure triggers automatic *payment retry* |
| order review summary | right | form | order line item list · order total · confirm order (primary) | Initiates StripeWave *payment* |

### guest checkout — PayNova wallet flow

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| checkout progress | header | nav-tabs | … · payment (active) | |
| PayNova wallet authentication | left | form | PayNova — digital wallet · redirecting to PayNova wallet authentication · authorise payment with mobile wallet credentials | Redirect or embed PayNova flow |
| PayNova cancel affordance | left | form | cancel PayNova wallet flow · return to payment method selector | *StripeWave* and *VaultPay* remain selectable on cancel |
| order review summary | right | form | order line item list · order total · awaiting PayNova authorisation | Order not confirmed until *payment confirmation* |

### guest checkout — PayNova hard decline

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| PayNova decline feedback | left | form | hard decline reason from PayNova · insufficient wallet balance example · wallet locked example | Decline reason as much as PayNova provides |
| alternative payment vendors | left | button-bar | retry with PayNova · switch to StripeWave (primary) · switch to VaultPay | No *order* confirmed; no *confirmation email* |
| order review summary | right | form | order total · order remains unpaid | *Hard decline* — no automatic *payment retry* |

### guest checkout — VaultPay BNPL flow

**Layout:** split-screen  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| VaultPay BNPL redirect | left | form | VaultPay — buy-now-pay-later · redirecting to VaultPay BNPL flow | Redirect or embed VaultPay |
| eligibility check status | left | form | VaultPay eligibility check in progress | Per-transaction *eligibility check* |
| instalment plan summary | left | form | instalment plan schedule · accept instalment plan (primary) · decline instalment plan | Customer must accept *instalment plan* before capture |
| order review summary | right | form | order line item list · order total · awaiting VaultPay approval | |

### guest checkout — VaultPay hard decline

**Layout:** split-screen  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| VaultPay decline feedback | left | form | buy-now-pay-later not available for this transaction · eligibility failed · credit check failed | VaultPay decision — not PawPlace's |
| alternative payment vendors | left | button-bar | switch to StripeWave (primary) · switch to PayNova | No *order* confirmed |
| order review summary | right | form | order total · order remains unpaid | *Hard decline* — no automatic *payment retry* |

### guest checkout — payment retry in progress

**Layout:** split-screen  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| payment retry indicator | left | form | retrying payment · automatic payment retry in progress · attempt count within retry window | Shown on *transient error* — no manual action during auto-retries |
| same vendor note | left | form | retrying through same payment vendor | Same-vendor *payment retry* invariant |
| order review summary | right | form | order total · payment not yet confirmed | Customer may navigate away — retry continues in background |

### guest checkout — payment retry exhausted

**Layout:** split-screen  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| retry exhaustion feedback | left | form | payment could not be processed · retry window exhausted | After final failed attempt within *retry window* |
| payment method selector | left | listbox | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later · manual card entry | Full selector restored with all vendor options |
| order review summary | right | form | order total · order remains unpaid | |

### order confirmation — multi-vendor payment

**Layout:** stack  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| order confirmation | body | form | order number · order line item list · total paid · masked payment method · payment vendor label · confirmation email sent | Shown after successful *payment confirmation* from any vendor |
| vendor-specific payment detail | body | form | PayNova vendor transaction reference · VaultPay instalment reference · StripeWave last four digits | Vendor-appropriate masked detail |

### logged-in checkout — payment method selector

**Layout:** split-screen  
**AC stories:** Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · wishlist · account | Logged-in chrome from Increment 4 |
| checkout progress | header | nav-tabs | … · payment (active) | |
| saved payment method selection | left | listbox | Visa •••• 4242 — StripeWave default (selected) · PayNova wallet — saved payment method · VaultPay — saved payment method · use a different payment method | Multi-vendor *saved payment method* tokens |
| payment method selector | left | listbox | StripeWave — card · PayNova — digital wallet · VaultPay — buy-now-pay-later | Shown when use a different payment method selected |
| expired saved payment method | left | form | expired saved payment method (dimmed) | Expired tokens not silently charged |
| order review summary | right | form | order total · confirm order (primary) | |

### logged-in checkout — save PayNova saved payment method

**Layout:** modal  
**AC stories:** Process Digital Wallet Payment via PayNova

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| save PayNova prompt | body | form | save PayNova as saved payment method for future orders · save PayNova wallet (primary) · not now | Offered after successful PayNova *payment* for logged-in customer |
| token storage note | body | form | only PayNova vendor token stored — not wallet secrets | Token-only storage invariant |

### logged-in checkout — save VaultPay saved payment method

**Layout:** modal  
**AC stories:** Process Buy-Now-Pay-Later via VaultPay

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| save VaultPay prompt | body | form | save VaultPay as saved payment method for future orders · save VaultPay identity (primary) · not now | Offered after successful VaultPay *payment* |
| eligibility reminder | body | form | future VaultPay checkout pre-fills identity but requires eligibility check per transaction | Per-transaction *eligibility check* invariant |

### account notification — background payment retry outcome

**Layout:** stack  
**AC stories:** Retry Failed Payment

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| background retry success | body | form | payment retry succeeded — order confirmed · view order confirmation | *Payment retry* continued after navigate-away |
| background retry failure | body | form | payment could not be processed — retry window exhausted · return to payment method selector (primary) | Guest email or account notification on exhaustion |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| payment method selector — StripeWave · PayNova · VaultPay | Process Digital Wallet Payment via PayNova | AC 1 — customer selects PayNova at selector |
| PayNova wallet authentication · authorise payment | Process Digital Wallet Payment via PayNova | AC 1 — redirect/embed wallet flow; mobile wallet credentials |
| cancel PayNova wallet flow · return to payment method selector | Process Digital Wallet Payment via PayNova | AC 1 — StripeWave and VaultPay remain selectable on cancel |
| order confirmation after PayNova payment confirmation | Process Digital Wallet Payment via PayNova | AC 2 — order confirmed; vendor transaction reference; confirmation email |
| hard decline reason · retry PayNova · switch StripeWave · switch VaultPay | Process Digital Wallet Payment via PayNova | AC 3 — hard decline surfaces reason and alternatives; no order confirmed |
| webhook callback reconciliation note | Process Digital Wallet Payment via PayNova | AC 4 — system reconciles in-flight payment (no customer screen — noted in spec) |
| save PayNova as saved payment method | Process Digital Wallet Payment via PayNova | AC 5 — token-only save for logged-in customer |
| VaultPay BNPL redirect · eligibility check | Process Buy-Now-Pay-Later via VaultPay | AC 1 — VaultPay performs eligibility check |
| instalment plan summary · accept instalment plan | Process Buy-Now-Pay-Later via VaultPay | AC 1–2 — plan presented and accepted before capture |
| order confirmation after VaultPay payment confirmation | Process Buy-Now-Pay-Later via VaultPay | AC 2 — order confirmed with instalment reference |
| buy-now-pay-later not available · switch StripeWave · switch PayNova | Process Buy-Now-Pay-Later via VaultPay | AC 3 — hard decline; VaultPay decision |
| save VaultPay as saved payment method · eligibility check per transaction | Process Buy-Now-Pay-Later via VaultPay | AC 5 — token save; pre-fill with per-transaction eligibility |
| retrying payment indicator | Retry Failed Payment | AC 1 — automatic retry on transient error; no manual action |
| payment retry through same payment vendor | Retry Failed Payment | AC 1 — same-vendor retry invariant |
| order confirmation after retry success | Retry Failed Payment | AC 2 — order confirmed as if first attempt succeeded |
| retry window exhausted · payment method selector restored | Retry Failed Payment | AC 3 — exhaustion returns full selector |
| hard decline — no automatic payment retry | Retry Failed Payment | AC 4 — immediate decline reason and alternative vendors |
| background payment retry · account notification | Retry Failed Payment | AC 5 — retry continues on navigate-away; notify on success or exhaustion |
| StripeWave card entry unchanged | Retry Failed Payment | Scope guard — StripeWave behaviour preserved |
| saved payment method listbox — multi-vendor tokens | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay | AC 5 both stories — logged-in save flows |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| guest checkout — payment method selector | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | payment method selector · StripeWave · PayNova · VaultPay · payment vendor · payment |
| guest checkout — StripeWave card entry | Retry Failed Payment | StripeWave · payment · transient error · payment retry |
| guest checkout — PayNova wallet flow | Process Digital Wallet Payment via PayNova | PayNova · digital wallet · payment method selector · payment confirmation |
| guest checkout — PayNova hard decline | Process Digital Wallet Payment via PayNova · Retry Failed Payment | hard decline · payment method selector · PayNova · StripeWave · VaultPay |
| guest checkout — VaultPay BNPL flow | Process Buy-Now-Pay-Later via VaultPay | VaultPay · buy-now-pay-later · eligibility check · instalment plan · payment confirmation |
| guest checkout — VaultPay hard decline | Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | hard decline · buy-now-pay-later · payment method selector |
| guest checkout — payment retry in progress | Retry Failed Payment | payment retry · transient error · retry window · payment vendor |
| guest checkout — payment retry exhausted | Retry Failed Payment | payment retry · retry window · payment method selector |
| order confirmation — multi-vendor payment | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay · Retry Failed Payment | order · payment confirmation · confirmation email · vendor transaction reference · instalment plan |
| logged-in checkout — payment method selector | Process Digital Wallet Payment via PayNova · Process Buy-Now-Pay-Later via VaultPay | saved payment method · default payment method · payment method selector · PayNova · VaultPay · StripeWave |
| logged-in checkout — save PayNova saved payment method | Process Digital Wallet Payment via PayNova | saved payment method · PayNova · digital wallet · customer account |
| logged-in checkout — save VaultPay saved payment method | Process Buy-Now-Pay-Later via VaultPay | saved payment method · VaultPay · eligibility check · customer account |
| account notification — background payment retry outcome | Retry Failed Payment | payment retry · order · confirmation email · payment method selector |

---

## Scope guard

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
| Increment 4 sole-vendor deferral superseded | All three vendors active at *payment method selector* |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/ux/lo-fi/increment-5-pay-your-way-state.json" --out "docs/ux/lo-fi/increment-5-pay-your-way.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-25 | initial | 13 Increment 5 screens (multi-vendor selector, PayNova wallet, VaultPay BNPL, retry states, logged-in save flows); state JSON + drawio generated. |
