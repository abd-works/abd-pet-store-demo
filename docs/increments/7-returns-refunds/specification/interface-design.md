# Interface Design


---

## Increment 7

<!-- migrated from: increments/7-returns-refunds/specification/interface-design.md -->

# Interface design — Increment 7 (Returns and refunds)

> **Companion to** lo-fi `docs/increments/7-returns-refunds/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increments 1–6 prototype under `packages/` — this spec is authoritative for the slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 7 — Returns and refunds (7 screens, 6 stories) |
| Lo-fi reference | `docs/increments/7-returns-refunds/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Increment 7 section) |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Prior interface specs | `docs/increments/5-pay-your-way/specification/interface-design.md`, `docs/increments/6-pet-visits/exploration/ux/mockups.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/return/` (domain + API), `packages/app-client/src/pages/account/` (customer), `packages/app-client/src/pages/staff/` (staff) |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-28 (Specification slot 185) |

## Description

Full customer return flow on PawPlace: *order history* extends with Return button on eligible orders, return initiation with item/quantity/*return reason*/*item condition* selection, *return label* PDF + *return QR code* confirmation, *return status* timeline and *refund status* tracking on *order detail*. Staff screens: *order lookup* by number or email, *in-store return* processing with *manager override* for ineligible items. Notification previews: *return received notification*, *refund completed notification*, *refund under review notification* with email resilience. Labels use ubiquitous-language terms verbatim. **Increments 1–6 paths are preserved** — account navigation, order history, staff dashboard patterns extended; multi-vendor payment refund routing is vendor-agnostic to the customer.

---

## Host project conventions

Same baseline as Increments 2–6.

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; return domain in `packages/return/`; customer pages in `packages/app-client/src/pages/account/`; staff pages in `packages/app-client/src/pages/staff/`
- **State management:** React component state + context; API calls from `packages/return/client/return.api.ts`
- **Styling:** component-scoped inline styles matching Increment 4–6 patterns; colour tokens via inline hex; consistent radius (6px controls, 8px cards), spacing (12–16px padding)
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library (unit/component), Playwright (e2e) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests; manual keyboard pass per screen; ARIA labels on sections, forms, controls
- **Performance budget:** no explicit bundle cap — do not regress Increment 6 baseline

---

## Screens

| Screen | Layout | Route | Stories | Status |
| --- | --- | --- | --- | --- |
| customer account — order history with return | stack | `/account/orders` | Initiate Return from Order History | **Updated** |
| initiate return — select items | form | `/account/orders/:orderNumber/return` | Initiate Return from Order History | **Existing** |
| return confirmation — label and QR code | stack | `/account/returns/:returnId/confirmation` | Generate Return Label or QR Code | **Existing** |
| order detail — return and refund tracking | stack | `/account/orders/:orderNumber` | Track Refund Status · Route Refund through Original Payment Vendor · Initiate Return from Order History | **Updated** |
| staff — order lookup for return | stack | `/staff/returns` | Process In-Store Return | **Existing** |
| staff — process in-store return | form | `/staff/returns/:orderNumber/process` | Process In-Store Return | **New** |
| notification preview — return and refund updates | stack | `/staff/notifications/returns` | Send Return and Refund Status Update | **New** |

---

## AC → Behaviour → Test mapping

### Story: Initiate Return from Order History

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — customer selects Return on eligible order | Return button visible on eligible orders in order history; navigates to initiate return page with eligible items, quantity selector, return reason dropdown, item condition dropdown | OrderHistoryPage, InitiateReturnPage | Initiate Return from Order History — AC 1 |
| AC 2 — system creates return record and shows next steps | Submit return request → API creates return record → navigate to return confirmation page with return reference, order number, next steps (label generation) | InitiateReturnPage | Initiate Return from Order History — AC 2 |
| AC 3 — outside return window or items not eligible | Return action hidden/disabled with reason text (e.g. "return window expired") on ineligible orders; order detail still viewable | OrderHistoryPage, OrderHistoryDetailPage | Initiate Return from Order History — AC 3 |
| AC 4 — partial return; items already returned shown as "return in progress" | Items with active return shown as disabled "return in progress"; remaining eligible items selectable; partial return badge on order history row | OrderHistoryPage, InitiateReturnPage | Initiate Return from Order History — AC 4 |

### Story: Generate Return Label or QR Code

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — label and QR shown + emailed | Return confirmation page shows PDF download link, QR code placeholder, email confirmation note | ReturnConfirmationPage | Generate Return Label or QR Code — AC 1 |
| AC 2 — label includes required details | Label download section states: return address, order number, return reference, carrier barcode | ReturnConfirmationPage | Generate Return Label or QR Code — AC 2 |
| AC 3 — QR code displayable on mobile | QR code display area with return reference; text explains mobile carrier drop-off usage; same reference as label | ReturnConfirmationPage | Generate Return Label or QR Code — AC 3 |
| AC 4 — label unavailable fallback | When labelUnavailable flag set, show warning: "return recorded — label generation temporarily unavailable; check back shortly or contact support" | ReturnConfirmationPage | Generate Return Label or QR Code — AC 4 |

### Story: Route Refund through Original Payment Vendor

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1–4 — refund routes through original vendor | Vendor-agnostic refund display on order detail; customer sees refund status, not vendor mechanics | OrderHistoryDetailPage (RefundStatusSection) | Route Refund through Original Payment Vendor — AC 1-4 |
| AC 5 — refund retry resilience | Customer sees "processing" not "refund failed"; on retry exhaustion shows "requires review" | OrderHistoryDetailPage (RefundStatusSection) | Route Refund through Original Payment Vendor — AC 5 |

### Story: Track Refund Status

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — refund status visible | Order detail shows refund status: processing, completed, or requires review | OrderHistoryDetailPage | Track Refund Status — AC 1 |
| AC 2 — completed with notification | Refund status "completed" with amount and masked payment method; "refund completed notification sent" note | OrderHistoryDetailPage | Track Refund Status — AC 2 |
| AC 3 — timing expectation | Processing state shows "refunds typically take 5–10 business days depending on your payment provider" | OrderHistoryDetailPage | Track Refund Status — AC 3 |
| AC 4 — requires review with contact support | Requires review state shows "Please contact support for assistance with your refund" | OrderHistoryDetailPage | Track Refund Status — AC 4 |

### Story: Process In-Store Return

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — order lookup and Start Return | Staff lookup by order number or customer email; matched order shows details + Start Return link | StaffReturnLookupPage | Process In-Store Return — AC 1 |
| AC 2 — return recorded + refund triggered + visible in account | Confirmation screen: return linked to order, refund triggered through original vendor, visible in customer order history | StaffProcessReturnPage | Process In-Store Return — AC 2 |
| AC 3 — guest order support | Guest order note on lookup page; lookup works identically by order number + guest email | StaffReturnLookupPage | Process In-Store Return — AC 3 |
| AC 4 — ineligibility + manager override | Ineligible items shown with reason; Manager Override button → manager approval gate (approving manager + override reason) | StaffProcessReturnPage | Process In-Store Return — AC 4 |

### Story: Send Return and Refund Status Update

| AC | Behaviour | Component | Test name |
| --- | --- | --- | --- |
| AC 1 — return received notification | Preview tab: subject, order number, returned items summary, "inspection and refund processing are underway" | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 1 |
| AC 2 — refund completed notification | Preview tab: subject, refunded amount, masked payment method | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 2 |
| AC 3 — refund under review notification | Preview tab: subject, "requires additional review", "contact support", return and order reference | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 3 |
| AC 4 — email resilience | Resilience note: "Email queued for retry when delivery system unavailable — return/refund status still updated" | ReturnNotificationPreviewPage | Send Return and Refund Status Update — AC 4 |

---

## Accessibility checklist

| Check | Status |
| --- | --- |
| Every input has a programmatic label (`<label htmlFor>` or `aria-label`) | Passing |
| Focus order matches reading order | Passing |
| Focus styles visible (browser default; not removed) | Passing |
| Errors associated with inputs (`aria-describedby` or `role="alert"`) | Passing |
| State changes announced (`aria-live`, `role="alert"`, `role="status"`) | Passing |
| Entire screen keyboard reachable | Passing |
| Colour-independent state cues (text labels + icon/border, not colour alone) | Passing |
| ARIA landmarks on sections | Passing |

---

## Performance budget

| Metric | Target | Status |
| --- | --- | --- |
| Bundle size regression | No increase over Increment 6 baseline | Met |
| Lazy-load return pages | Return pages are standard routes; no additional lazy-load required beyond existing code-splitting | N/A |
| API round-trips per page | 1–3 per page (eligibility, returns, refund status) | Met |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-28 | initial | 7 screens implemented for Increment 7 returns and refunds: OrderHistoryPage updated (Return button, eligibility, partial return badge), OrderHistoryDetailPage updated (return timeline, refund status, partial return affordance), InitiateReturnPage (existing), ReturnConfirmationPage (existing), ReturnTrackingPage (existing), StaffReturnLookupPage (existing), StaffProcessReturnPage (new — in-store return with manager override), ReturnNotificationPreviewPage (new — 3 notification tabs with resilience note). All routes registered in App.tsx. |
| 2026-05-28 | code → md | Engineering pass: fixed 6 API route mismatches between client and server — eligibility endpoint path, staff lookup POST method and path, staff initiate return path, mapReturnToDto field alignment (returnReference, labelUrl, qrCodeData, labelUnavailable), getReturnsByOrder response wrapping. Created return.module.ts to mount return and in-store-return routers in app-server. Added refund-status and batch return-statuses server endpoints. Enriched eligibility response with eligible/alreadyReturning fields for client schema. All AC behaviours wired to real API calls. |
