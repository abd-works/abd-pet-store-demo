# Interface design — Increment 8 Sprint 3 (Marketing campaigns and alerts)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-8-marketing-engine.md` / `.drawio` (screen: *notification preview — marketing communications*; product detail *Stock Availability* read path for restock best-effort). Specification-stage spec; implementation and tests land in Engineering. Campaign **dispatch** is system/back-end; this spec defines staff email preview UI, email template affordances (including *Unsubscribe* link), and customer read-path fidelity for restock alerts.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 3 — Marketing campaigns and alerts (1 staff preview screen + product detail stock read path, 4 system stories) |
| Ticket | `inc-8-sprint-3-campaigns` |
| Lo-fi reference | `docs/ux/lo-fi/increment-8-marketing-engine.md` (§ notification preview — marketing communications) |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Sprint 3 campaign stories only) |
| Specification by example | `docs/story/specification-by-example/increment-8-sprint-3-campaigns-specification-by-example.md` |
| Domain / CRC | `docs/domain/marketing-engine-campaigns-crc.md`, `docs/domain/marketing-engine-ubiquitous-language.md` |
| Architecture reference | `docs/architecture/increment-8-marketing-engine-reference.md` (Mechanism: Marketing Email Dispatch · Marketing Unsubscribe link target) |
| Prior interface specs | `docs/ux/increment-7-interface-design.md` (`ReturnNotificationPreviewPage` pattern); `docs/ux/increment-8-sprint-2-preferences-interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client/src/pages/staff/MarketingNotificationPreviewPage.tsx`; email templates in `packages/marketing/` + `packages/notification/`; extend `packages/product-catalog/client/` product detail stock display |
| Test path | `tests/` (Vitest + RTL for preview UI; server tests for dispatch/consent gate) |
| Last updated | 2026-05-31 (Engineering — `abd-interface-design` implementation + review pass) |

## Description

Sprint 3 stories are **system** stories — admin batch creation and consent-gated delivery run server-side. Customer-facing UI for this sprint is:

1. **Staff notification preview** — tabbed email mockups for *Promotional Email*, *Personalized Recommendation*, *Restock Alert*, and *In-Store Event Notification*, mirroring Increment 7 return notification previews.
2. **Email template contract** — each marketing email includes an *Unsubscribe* link (routes to unsubscribe flow; confirmation page specified in Sprint 4).
3. **Product Details Page** — *Stock Availability* reflects current inventory on read (restock alert is best-effort, not a guarantee).

No admin marketing compose UI per lo-fi explicit non-goal ("batch creation and delivery are back-end operations").

---

## Host project conventions

- **Staff preview pattern:** copy `ReturnNotificationPreviewPage.tsx` — `StaffPage`, `role="tablist"` selector, per-type preview sections, resilience note footer
- **Folder layout:** `packages/app-client/src/pages/staff/MarketingNotificationPreviewPage.tsx`; route in `App.tsx`
- **State management:** local tab state only (preview is static mockup)
- **Styling:** inline styles consistent with `ReturnNotificationPreviewPage`
- **Test framework:** Vitest + RTL
- **Marketing dispatch tests:** server/integration in `packages/marketing/` — not preview component alone

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| notification preview — marketing communications | stack | `/staff/notifications/marketing` | Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification | **New** |
| product detail page (stock read path) | stack | `/product-catalog/:sku` | Send Restock Alert | **Updated** — live stock availability display (extends Sprint 1 product detail) |

---

## Screen spec (from lo-fi — regions verbatim)

### notification preview — marketing communications

**Layout:** stack  
**Route:** `/staff/notifications/marketing`  
**AC stories:** Send Promotional Email · Send Personalized Recommendation · Send Restock Alert · Send In-Store Event Notification

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| notification type selector | header | nav-tabs | Promotional Email (active) · Personalized Recommendation · Restock Alert · In-Store Event | `role="tablist"`; arrow-key navigation; `aria-selected` |
| promotional email preview | body | form | Subject line · promotional content · unsubscribe link | Mock shows *Unsubscribe* link; documents delivery-time consent check |
| real-time opt-out note | body | form | "communication preferences checked at delivery time, not batch creation time" | Visible on Promotional tab |
| personalized recommendation preview | body | form | Subject line · recommendation basis · in-stock only · not sent without data · unsubscribe | Tab: Personalized Recommendation |
| restock alert preview | body | form | Subject line · wishlist match · best-effort signal · opt-in + wishlist required · unsubscribe | Tab: Restock Alert |
| in-store event preview | body | form | Subject line · event details · store match · preferred store required · walk-in discoverable · unsubscribe | Tab: In-Store Event |
| delivery resilience note | body | form | "Email queued for retry — not silently discarded" | Footer note all tabs |

**Email template requirements (all four types):**

- Visible *Unsubscribe* link in preview and production template
- Subject + body placeholders use UL terms verbatim
- Server enforces consent at send time (not UI)

---

### product detail page — stock availability (read path)

**Layout:** stack (existing product detail)  
**Route:** `/product-catalog/:sku`  
**AC story:** Send Restock Alert — AC 3

| Region | Behaviour |
| --- | --- |
| stock availability display | Shows current *Stock Availability* from API on each page load — if product went out-of-stock after *Restock Alert*, customer sees *out-of-stock* |
| best-effort copy (optional) | No guarantee messaging required in MVP unless AC demands; alert email preview documents best-effort invariant |

---

## AC → behaviour → test mapping

### Story: Send Promotional Email

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — delivered only to opted-in list members | Server: dispatch filters by Marketing Email List + promotions category | `marketing-dispatch.service` (integration) | Send Promotional Email — AC 1 | pending |
| AC 2 — realtime opt-out at delivery | Server: re-check Communication Preferences at send | `marketing-consent.guard` (integration) | Send Promotional Email — AC 2 | pending |
| AC 3 — unsubscribe link opts out + confirmation | Email template includes Unsubscribe link; click → opt-out + confirmation page (Sprint 4 page) | `MarketingNotificationPreviewPage`, `unsubscribe.service` | Send Promotional Email — AC 3 | pass (preview) |
| AC 4 — delivery failure queued | Server: queue retry; preview shows resilience note | `MarketingNotificationPreviewPage`, dispatch queue | Send Promotional Email — AC 4 | pass (preview) |

### Story: Send Personalized Recommendation

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — personalized from history/profile; recommendations opt-in | Server: generate from purchase/browsing/pet profile; gate on recommendations category | dispatch + preview tab | Send Personalized Recommendation — AC 1 | pass (preview) |
| AC 2 — no send without personalization data | Server: skip when no data | dispatch service | Send Personalized Recommendation — AC 2 | pass (preview) |
| AC 3 — out-of-stock excluded | Server: filter recommendations by Stock Availability | dispatch service | Send Personalized Recommendation — AC 3 | pending |
| AC 4 — recommendations opt-out blocks send | Server: consent gate | `marketing-consent.guard` | Send Personalized Recommendation — AC 4 | pending |

### Story: Send Restock Alert

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — alert on stock transition for wishlisted opted-in | Server: hook on stock transition → wishlist + restock alerts opt-in | `marketing-dispatch.service` | Send Restock Alert — AC 1 | pending (server) |
| AC 2 — suppressed when category opted out | Server: consent gate | `marketing-consent.guard` | Send Restock Alert — AC 2 | pending (server) |
| AC 3 — PDP shows current stock after alert | Product detail fetches live Stock Availability | `StockAvailabilityDisplay`, product detail | Send Restock Alert — AC 3 | pass |
| AC 4 — no alert without wishlist | Server: no recipients | dispatch service | Send Restock Alert — AC 4 | pending |

### Story: Send In-Store Event Notification

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — notify when preferred store matches | Server: preferred store match + events opt-in | dispatch service | Send In-Store Event Notification — AC 1 | pass (preview) |
| AC 2 — no notify without preferred store; event on store page | Server: skip send; Store Details Page lists event (store module) | dispatch + store UI | Send In-Store Event Notification — AC 2 | pass (preview) |
| AC 3 — events opt-out suppresses | Server: consent gate | `marketing-consent.guard` | Send In-Store Event Notification — AC 3 | pending |
| AC 4 — wrong store location no notify | Server: store id mismatch | dispatch service | Send In-Store Event Notification — AC 4 | pending |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Tab selector keyboard reachable | pass | Same pattern as ReturnNotificationPreviewPage |
| Preview sections labelled | pass | `aria-label` per preview section |
| Unsubscribe link in template preview | pass | Descriptive Unsubscribe link in each preview |
| Axe passes (staff page) | pass | Tablist + labelled sections in client tests |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Preview page bundle | Minimal static content | pending | No heavy deps |
| Batch dispatch | Out of UI scope | n/a | Server/async |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | MarketingNotificationPreviewPage at `/staff/notifications/marketing`; StockAvailabilityDisplay on product detail; client tests in `tests/marketing-engine/campaigns/`. |
| 2026-05-30 | initial | Specification pass: staff marketing notification preview (4 tabs); email template/unsubscribe contract; product detail stock read path for restock best-effort; 4 system stories, 16 AC clauses mapped. |
