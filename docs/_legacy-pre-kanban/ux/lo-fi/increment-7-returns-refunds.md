# Lo-fi — Increment 7: Returns and refunds — close the loop

> **Companion to** `docs/ux/lo-fi/increment-7-returns-refunds.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 7 — Returns and refunds (7 screens, 6 stories) |
| Initial IA | `docs/end-to-end/discovery/information-architecture.md` (Increment 1 base; extends Increment 4 order history and account patterns) |
| AC source | `docs/story/acceptance-criteria/increment-7-acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 171/172) |
| State file | `docs/ux/lo-fi/increment-7-returns-refunds-state.json` |
| Wireframe | `docs/ux/lo-fi/increment-7-returns-refunds.drawio` |
| Last updated | 2026-05-27 |

## Description

Lo-fi wireframes extending the customer account *order history* with a full *return* flow: selecting eligible items, specifying *return reason* and *item condition*, submitting a *return request*, receiving a *return label* (PDF) and *return QR code*, and tracking *return status* and *refund status* through completion. Staff screens provide *in-store return* processing with order lookup, *return eligibility* gating, and *manager override* for edge cases. Notification previews cover *return received notification*, *refund completed notification*, and *refund under review notification*. The vendor-routing invariant on *refund* — always through the original *payment vendor* — is the design rule that drives the refund path. **Increment 1–6 paths are preserved** — *order history* and account navigation extend; staff dashboard gains a "Returns" tab.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow Increment 4–6 lo-fi patterns and standard return/refund UX conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| Inc 4 | order history list | list | Order rows with actions — Return button added on eligible orders |
| Inc 4 | account nav tabs | nav-tabs | Profile · Orders (active) · Appointments · Wishlist · Saved Payments |
| AC | eligible items selector | list | Checkbox per item, quantity to return, eligibility indicator |
| AC | return reason + item condition | form (dropdown) | Dropdown selectors; damaged triggers additional fields |
| AC | return label + QR code | form | PDF download button + QR display placeholder |
| AC | return status timeline | listbox | Lifecycle states: initiated → label generated → shipped → received → inspected → refund processing → completed |
| AC | refund status states | form | Processing / completed / requires review with conditional feedback |
| AC | staff order lookup | form | Order number or customer email search |
| AC | in-store return | form + list | Items selector with manager override for ineligible items |
| AC | notification previews | nav-tabs + form | Tabs for 3 notification types with email resilience note |

**Design principles applied:** Extend Increment 4 order history with return initiation; return flow follows checkout-like linear progression (select → confirm → track); staff screens mirror Increment 6 staff dashboard tab pattern; refund tracking surfaces vendor-agnostic status visible to customer; conditional states for ineligibility, damaged items, partial returns, and refund escalation.

---

## Screens

### customer account — order history with return

**Layout:** stack
**AC stories:** Initiate Return from Order History

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Logged-in chrome from Increment 4 |
| account nav | header | nav-tabs | Profile · Orders (active) · Appointments · Wishlist · Saved Payments | Orders tab active |
| order list | body | list | order number · date · items (condensed) · total · order status · actions: Return · Reorder · View Detail | Return button on eligible orders only |
| return eligible indicator | body | form | Return button visible on eligible orders within return window | Visual cue for returnable orders |
| return ineligible state | body | form | Return action hidden or disabled · Reason: return window expired / items not eligible | AC 3 — clear reason shown |
| partial return in progress | body | form | return in progress badge on orders with active returns | AC 5 — previously returned items flagged |

### initiate return — select items

**Layout:** form
**AC stories:** Initiate Return from Order History

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| breadcrumb | header | toolbar | Account · Orders · Order #[number] · Return (current) | Breadcrumb trail for navigation |
| order context | body | form | order number · order date · payment method (masked) | Order reference for return |
| eligible items selector | body | list | select · product name · quantity ordered · quantity to return · return eligible | Checkbox per item; customer selects items and quantities |
| items already in return | body | form | return in progress — cannot be returned again | AC 5 — items with active return shown as non-selectable |
| return reason | body | form | return reason (dropdown) | AC 1 — customer selects reason |
| item condition | body | form | item condition (dropdown: unopened / opened / damaged) | AC 1 — condition selection |
| damaged item detail | body | form | damage description (textarea) · upload photo of damage (optional) | AC 4 — additional fields for damaged condition |
| submit return request | body | button-bar | Submit Return Request (primary) · Back to Order Detail | Submits return request; creates return record |

### return confirmation — label and QR code

**Layout:** stack
**AC stories:** Generate Return Label or QR Code

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| return submitted header | body | form | Return request submitted! · return reference · order number | Confirmation with return reference |
| returned items summary | body | list | product name · quantity · return reason · item condition | Summary of what was returned |
| return label download | body | form | return label (PDF) — includes return address, order number, return reference, carrier barcode | AC 2 — printable label with full details |
| return QR code display | body | form | [QR code placeholder — displayable on mobile at carrier drop-off point] · same return reference as label | AC 3 — mobile QR at drop-off; same reference as label |
| email confirmation note | body | form | Return label and QR code emailed to your registered email | AC 1 — both emailed to customer |
| label unavailable fallback | body | form | return recorded — label generation temporarily unavailable · check back shortly or contact support for your return label | AC 4 — return not cancelled; label available later |
| post-submission actions | body | button-bar | View Return Status (primary) · Back to Order History | Navigate to tracking or back to orders |

### order detail — return and refund tracking

**Layout:** stack
**AC stories:** Track Refund Status · Route Refund through Original Payment Vendor · Initiate Return from Order History

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | |
| breadcrumb | header | toolbar | Account · Orders · Order #[number] (current) | |
| order summary | body | form | order number · order date · order status · payment method (masked) | Order context for tracking |
| return status timeline | body | listbox | Initiated · Label Generated · Shipped Back · Received (selected) · Inspected · Refund Processing · Completed | Lifecycle progress indicator; selected = current state |
| refund status — processing | body | form | refund status: processing · refund amount · refunds typically take X business days depending on your payment provider | AC 1 + AC 3 — status with timing expectation |
| refund status — completed | body | form | refund status: completed · refunded amount · credit returned to [masked payment method] · refund completed notification sent | AC 2 — vendor confirmation; notification sent |
| refund status — requires review | body | form | refund status: requires review · Please contact support for assistance with your refund | AC 4 — escalation with support guidance |
| returned items detail | body | list | product name · quantity returned · return reason · item condition | Items in this return |
| remaining eligible items | body | form | remaining eligible items can still be returned separately · Return More Items | AC 5 — partial return affordance |

### staff — order lookup for return

**Layout:** stack
**AC stories:** Process In-Store Return

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome band |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments · Pet Profiles · Returns (active) | Returns tab extends staff dashboard |
| order lookup | body | form | order number (text) · or customer email (text) · Look Up Order (primary) | AC 1 — lookup by order number or customer email |
| matched order result | body | list | order number · date · customer name · email · items (condensed) · total · order status · Start Return | AC 1 — matched order with Start Return action |
| no match found | body | form | No order found — verify the order number or customer email | Empty state for failed lookup |
| guest order note | body | form | Guest orders: lookup by order number and guest email — refund routes through original vendor | AC 3 — guest returns supported |

### staff — process in-store return

**Layout:** form
**AC stories:** Process In-Store Return

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | |
| order context | body | form | order number · customer name or guest email · order date | In-store return context |
| return items selector | body | list | select · product name · quantity ordered · quantity to return · return eligible | Same item selection as customer flow |
| return reason | body | form | return reason (dropdown) · item condition (dropdown) | Staff records reason and condition |
| ineligible item — reason and override | body | form | ineligibility reason: return window expired / wrong condition · Manager Override (primary) | AC 4 — ineligibility with override affordance |
| manager override confirmation | body | form | manager approval required before return proceeds · approving manager · override reason (textarea) | AC 4 — manager approval gate |
| submit in-store return | body | button-bar | Record In-Store Return (primary) · Cancel | |
| return recorded confirmation | body | form | In-store return recorded — linked to original order · Refund triggered through original payment vendor · Return visible in customer order history | AC 2 — confirmation with refund routing + customer visibility |

### notification preview — return and refund updates

**Layout:** stack
**AC stories:** Send Return and Refund Status Update

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Return Received (active) · Refund Completed · Refund Under Review | Three lifecycle notification types |
| return received preview | body | form | Subject: We've received your return for order #[number] · order number · returned items summary · Inspection and refund processing are underway | AC 1 — return received notification |
| refund completed preview | body | form | Subject: Your refund for order #[number] is complete · refunded amount · credit returned to [masked payment method] | AC 2 — refund completed with amount and payment method |
| refund under review preview | body | form | Subject: Update on your refund for order #[number] · Your refund requires additional review · Please contact support if you need assistance · return and order reference included | AC 3 — escalation notification with support guidance |
| resilience note | body | form | Email queued for retry when delivery system unavailable — return/refund status still updated | AC 4 — notification failure does not block processing |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| Return button on eligible order in order history | Initiate Return from Order History | AC 1 — customer selects Return on eligible order |
| eligible items selector with quantities, return reason, item condition | Initiate Return from Order History | AC 1 — select items, quantities, return reason, item condition |
| return request submission → return record + next steps | Initiate Return from Order History | AC 2 — system creates return record, shows next steps |
| Return action hidden/disabled with reason | Initiate Return from Order History | AC 3 — outside return window or items not eligible |
| damaged item detail: description + photo upload | Initiate Return from Order History | AC 4 — additional fields for damaged condition |
| items "return in progress" non-selectable; remaining items returnable | Initiate Return from Order History | AC 5 — partial returns; no double-return |
| return label PDF download | Generate Return Label or QR Code | AC 1 — label PDF shown on confirmation page + emailed |
| return label contents: return address, order number, return reference, carrier barcode | Generate Return Label or QR Code | AC 2 — label includes required details |
| return QR code displayable on mobile, same reference as label | Generate Return Label or QR Code | AC 3 — QR code at carrier drop-off |
| label unavailable fallback: return recorded, check back later | Generate Return Label or QR Code | AC 4 — label failure does not cancel return |
| refund status: processing / completed / requires review | Track Refund Status | AC 1 — refund status visible on order detail |
| refund completed state with notification | Track Refund Status | AC 2 — status transitions to completed |
| timing expectation note while processing | Track Refund Status | AC 3 — refunds typically take X business days |
| requires review with contact support | Track Refund Status | AC 4 — customer guided to support |
| staff order lookup by order number or customer email | Process In-Store Return | AC 1 — order lookup on staff dashboard |
| Start Return action on matched order | Process In-Store Return | AC 1 — Start Return displayed |
| in-store return creates record + triggers refund + appears in customer account | Process In-Store Return | AC 2 — return recorded, refund routed, visible in account |
| guest order lookup by order number and guest email | Process In-Store Return | AC 3 — guest returns supported |
| ineligibility reason + Manager Override action | Process In-Store Return | AC 4 — ineligibility with manager approval |
| return received notification | Send Return and Refund Status Update | AC 1 — notification when return received |
| refund completed notification with amount and payment method | Send Return and Refund Status Update | AC 2 — notification with refund details |
| refund under review notification with support guidance | Send Return and Refund Status Update | AC 3 — escalation notification |
| email resilience — queued for retry, processing not blocked | Send Return and Refund Status Update | AC 4 — notification failure does not block return/refund |
| return status timeline (initiated through completed) | Track Refund Status + Route Refund | Return lifecycle progress visible to customer |
| vendor-agnostic refund display (StripeWave / PayNova / VaultPay) | Route Refund through Original Payment Vendor | AC 2–4 — customer sees refund status, not vendor mechanics |
| refund retry resilience ("processing" not "failed") | Route Refund through Original Payment Vendor | AC 5 — refund retry queued; customer never sees "refund failed" |

---

## Per-screen annotations (drawio companion)

| Screen | Stories | Domain terms |
| --- | --- | --- |
| customer account — order history with return | Initiate Return from Order History | order history · order · order status · return · return eligibility · return window |
| initiate return — select items | Initiate Return from Order History | return · return request · returned items · return reason · item condition · return eligibility · order line item · return status |
| return confirmation — label and QR code | Generate Return Label or QR Code | return label · return QR code · return request · return status |
| order detail — return and refund tracking | Track Refund Status · Route Refund through Original Payment Vendor · Initiate Return from Order History | return status · refund status · refund · refund retry · order history · order status page |
| staff — order lookup for return | Process In-Store Return | in-store return · store employee · order · order history · guest email |
| staff — process in-store return | Process In-Store Return | in-store return · store employee · return · refund · return eligibility · manager override |
| notification preview — return and refund updates | Send Return and Refund Status Update | return received notification · refund completed notification · refund under review notification · return status · refund status |

---

## Scope guard

| Excluded | Rationale |
| --- | --- |
| Admin refund reconciliation UI | System/back-office — webhook-level operations not customer-facing |
| Automatic vs manual inspection workflow | Back-office; AC says "received and inspected" without specifying inspection UI |
| Carrier integration configuration | Infrastructure concern — label generation is a system story |
| Restocking UI after return inspection | Product Catalog inventory update is asynchronous and back-office |

| Preserved from prior increments | Rationale |
| --- | --- |
| Order history (Increment 4) | Extended with Return action — existing order list patterns preserved |
| Account navigation tabs (Increment 4) | Orders tab now shows return-eligible orders |
| Staff dashboard tabs (Increment 6) | Returns tab added alongside Stock Levels, Appointments, Pet Profiles |
| Multi-vendor payment patterns (Increment 5) | Refund routes through original vendor; customer sees masked payment method |
| Notification resilience (Increment 6) | Same email queue-for-retry pattern applied to return/refund notifications |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/ux/lo-fi/increment-7-returns-refunds-state.json" --out "docs/ux/lo-fi/increment-7-returns-refunds.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-27 | initial | 7 Increment 7 screens (order history return, item selection, label/QR confirmation, return/refund tracking, staff order lookup, staff in-store return, notification previews); state JSON + drawio generated. |
