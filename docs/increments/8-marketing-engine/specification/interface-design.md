# Interface Design


---

## increment-8-sprint-1-reviews-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 1 (Customer reviews)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screen: *product detail page — reviews and ratings*). Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 1 product detail page under `packages/product-catalog/` — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 1 — Customer reviews (1 screen, 3 stories) |
| Ticket | `inc-8-sprint-1-reviews` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ product detail page — reviews and ratings) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 1 review stories only) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanism: Customer Review) |
| Prior interface specs | `docs/increments/7-returns-refunds/specification/interface-design.md`; Increment 1 product detail (`ProductDetailView`) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/product-catalog/client/` — extend `ProductDetailContent.tsx`, new `ReviewForm.tsx`, `ReviewList.tsx`, `ReviewPhotoLightbox.tsx`, `AggregateStarRating.tsx`; `packages/product-catalog/server/` — review API per architecture reference |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-30 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 1 extends the Increment 1 *Product Details Page* with a *Customer Reviews* section below product description. Verified purchasers submit *Customer Reviews* with mandatory *Star Rating* (1–5) and optional written text and *Review Photos*; non-purchasers see a purchase prompt; guests see a login/register prompt without leaving the page. All visitors read *Product Reviews* with *Aggregate Star Rating* (hidden when zero reviews), sort controls (newest, oldest, highest rating, lowest rating), pagination/lazy-load, inline photo thumbnails, and a lightbox for full-size images. Labels use ubiquitous-language terms verbatim. Buy flow and existing product detail regions (breadcrumb, image gallery, description) are preserved unchanged.

---

## Host project conventions

Same baseline as Increments 1–7; review UI lives in the product-catalog client package.

- **Folder layout:** extend `packages/product-catalog/client/` with review components; server review module under `packages/product-catalog/server/` per architecture reference (`review.service.ts`, `review.controller.ts`, etc.)
- **State management:** React component state for form draft (star rating, written text, photo upload errors); server state for review list, aggregate, pagination, sort; `CustomerSessionContext` for auth and purchase-eligibility gate
- **Styling:** component-scoped inline styles matching `productCatalogUiStyles.ts`; star rating uses accessible radio group; sort controls as tablist pattern consistent with Increment 4–7 nav-tabs
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists; accent for primary *Submit Review* button matches existing primary action colour
- **Test framework:** Vitest + React Testing Library (unit/component) from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`
- **Accessibility check:** axe-core in component tests; manual keyboard pass on review form and lightbox
- **Performance budget:** no explicit bundle cap — do not regress Increment 7 baseline; lazy-load review list page 2+; lightbox dynamically imported

---

## Product detail extension

Increment 1 `ProductDetailView` / `ProductDetailContent` remain the host. Reviews section mounts below `ProductDescription`.

| Actor | Entry | Review form | Read path |
| --- | --- | --- | --- |
| **Guest** | `/product-catalog/:sku` | Login/register prompt; form hidden | Full read access to existing reviews |
| **Logged in — non-purchaser** | same | "Purchase this product to leave a review" | Full read access |
| **Logged in — verified purchaser** | same | Full review form (star rating, text, photos) | Full read access |

**API routes (from architecture reference):**

- `GET /api/products/:sku/reviews` — list with sort, pagination, aggregate
- `POST /api/products/:sku/reviews` — submit review (verified purchaser only)
- `POST /api/products/:sku/reviews/:reviewId/photos` — attach review photo

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| product detail page — reviews and ratings | stack | `/product-catalog/:sku` (existing) | Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews | **Updated** — reviews section added below description |

---

## Screen spec (from lo-fi — regions verbatim)

### product detail page — reviews and ratings

**Layout:** stack  
**Route:** `/product-catalog/:sku` (extends existing `ProductDetailView`)  
**AC stories:** Submit Written Review with Star Rating · Submit Photo Review · Read Customer Reviews

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Unchanged Increment 4 chrome |
| breadcrumb | header | toolbar | Product Catalog · Category · Product Name (current) | Unchanged Increment 1 pattern |
| product header with aggregate star rating | body | form | product name · aggregate star rating (e.g. ★★★★☆ 4.2 · 47 reviews) | *Aggregate Star Rating* in `ProductDetailHeader` when review count > 0; `aria-label="Aggregate star rating 4.2 out of 5, 47 reviews"` |
| product image gallery | body | list | (unchanged Increment 1) | Preserved above description |
| product description | body | form | (unchanged Increment 1) | Preserved |
| no reviews state | body | form | aggregate star rating not shown · "Be the first to review this product!" | When `reviewCount === 0`; no zero-star display |
| review sort controls | body | nav-tabs | Newest (active) · Oldest · Highest Rating · Lowest Rating | `role="tablist"`; default newest; changing sort refetches/reorders list; keyboard arrow navigation between tabs |
| customer reviews list | body | list | star rating · review text · review photo thumbnail · author · date · Load More Reviews | Each review `role="listitem"`; photos as `<button>` thumbnails opening lightbox; pagination via Load More or infinite scroll |
| review photo lightbox | body | dialog | full-size review photo · close lightbox | `role="dialog"` `aria-modal="true"`; Escape closes; focus trap; returns focus to thumbnail |
| review submission form — verified purchaser | body | form | star rating (1–5, radio group) · written review (optional, textarea) · upload review photos (optional, file input) · Submit Review (primary) | Star rating required (`aria-required="true"`); text optional; accept JPEG/PNG/WebP; max 5 MB per SBE |
| photo upload validation error | body | form | validation error (format or size) · star rating and written review preserved | `role="alert"` `aria-live="assertive"`; form draft not cleared on upload failure |
| non-purchaser state | body | form | "Purchase this product to leave a review" | Replaces form when logged in but not verified purchaser; reviews list still visible |
| guest prompt state | body | form | "Log in or register to leave a review" · Log In · Register | Replaces form for guest; page does not navigate away; Log In/Register link with `returnTo` current SKU |

**Conditional states:**

- `reviewCount === 0`: hide aggregate; show "Be the first to review this product!"
- Guest: guest prompt instead of form
- Non-purchaser: purchase prompt instead of form
- Verified purchaser: full form
- Photo upload error: alert region; draft preserved
- Lightbox open: overlay; body scroll locked; focus trapped

---

## AC → behaviour → test mapping

### Story: Submit Written Review with Star Rating

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — verified purchaser sees form | Form shows star rating radio group (1–5) and optional written review textarea; only when customer verified as purchaser | `ReviewForm` | Submit Written Review with Star Rating — AC 1 | pending |
| AC 2 — submit publishes review and recomputes aggregate | Submit Review POST succeeds; new review appears newest-first; aggregate updates in header | `ReviewForm`, `ReviewList`, `AggregateStarRating` | Submit Written Review with Star Rating — AC 2 | pending |
| AC 3 — non-purchaser sees purchase prompt | Form hidden; "Purchase this product to leave a review" shown; existing reviews visible | `ReviewForm` (purchase gate) | Submit Written Review with Star Rating — AC 3 | pending |
| AC 4 — guest login prompt without navigation | Guest sees "Log in or register to leave a review" with Log In and Register links; URL unchanged | `ReviewForm` (guest gate) | Submit Written Review with Star Rating — AC 4 | pending |
| AC 5 — star-rating-only accepted | Submit with star rating only (no text) succeeds; list shows stars without text body | `ReviewForm` | Submit Written Review with Star Rating — AC 5 | pending |

### Story: Submit Photo Review

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — optional photo upload on form | File input labelled "upload review photos"; optional; accepts image files | `ReviewForm` | Submit Photo Review — AC 1 | pending |
| AC 2 — photos displayed inline with lightbox | Thumbnails inline in review list; click opens full-size lightbox | `ReviewList`, `ReviewPhotoLightbox` | Submit Photo Review — AC 2 | pending |
| AC 3 — invalid format/size error preserves draft | Validation error "Supported formats: JPEG, PNG, WebP" or "Image must be under 5 MB"; star rating and text remain | `ReviewForm` | Submit Photo Review — AC 3 | pending |
| AC 4 — review accepted without photos | Submit without photos succeeds as standard written review | `ReviewForm` | Submit Photo Review — AC 4 | pending |

### Story: Read Customer Reviews

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — aggregate and listing | Aggregate near product name; individual reviews below product details | `AggregateStarRating`, `ReviewList` | Read Customer Reviews — AC 1 | pending |
| AC 2 — zero reviews suppresses aggregate | No aggregate display; "Be the first to review this product!" prompt | `AggregateStarRating`, `ReviewList` | Read Customer Reviews — AC 2 | pending |
| AC 3 — pagination and sort controls | Load More or lazy-load; sort tabs newest/oldest/highest/lowest | `ReviewList`, sort tablist | Read Customer Reviews — AC 3 | pending |
| AC 4 — photo thumbnails inline on read path | Thumbnails in list; select opens lightbox at full size | `ReviewList`, `ReviewPhotoLightbox` | Read Customer Reviews — AC 4 | pending |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | planned | Star rating: `fieldset` + `legend="Star rating"` + labelled radios; textarea: `<label htmlFor>`; file input: visible label |
| Focus order matches reading order | planned | Header → gallery → description → aggregate → sort tabs → review list → form/gate → Load More |
| Focus is visible | planned | Browser default focus ring preserved; lightbox close button focusable |
| Errors programmatically associated | planned | Upload errors: `aria-describedby` on file input + `role="alert"` |
| State cues not colour-only | planned | Star rating: numeric label + filled/empty star icons; validation uses text message |
| Keyboard reachable | planned | Sort tabs: arrow keys; lightbox: Escape to close; form fully tabbable |
| Axe passes | pending | Run in Engineering implementation pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Bundle size regression | No increase over Increment 7 baseline | pending | Measure in Engineering pass |
| Review list initial load | First page only (e.g. 10 reviews) | pending | Lazy-load / Load More for remainder |
| Lightbox | Dynamic import on first open | pending | Avoid blocking product detail first paint |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | code → md | Engineering pass: ProductReviewsSection wired; eligibility API; aggregate in ProductDetailHeader. Tests pending vitest install. |


---

## increment-8-sprint-2-preferences-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 2 (Notification and communication preferences)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screens: *customer account — communication preferences*, *customer account — notification preferences*; opt-in touchpoints on registration and checkout). Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 4 account settings under `packages/app-client/` — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 2 — Notification and communication preferences (2 account screens + 2 opt-in touchpoints, 3 stories) |
| Ticket | `inc-8-sprint-2-preferences` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ customer account — communication preferences · notification preferences) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 2 preference stories only) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanisms: Communication Preferences & Marketing Consent Gate · Notification Preferences (Transactional)) |
| Prior interface specs | `docs/increments/4-returning-customers/specification/interface-design.md`; `docs/increments/8-marketing-engine/specification/interface-design.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client/src/pages/account/CommunicationPreferencesPage.tsx`, `NotificationPreferencesPage.tsx`; extend `AccountSettingsNav.tsx`, `RegisterPage.tsx`, checkout payment step; `packages/customer-account/client/`, `packages/marketing/` server per architecture reference |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Engineering — `abd-interface-design` implementation + review pass) |

## Description

Sprint 2 adds customer-facing preference management for marketing *Communication Preferences* and transactional *Notification Preferences*, plus affirmative *Opt In* paths on registration and checkout. Logged-in customers toggle four *Marketing Category* checkboxes (Promotions, Recommendations, Restock Alerts, Events) and four transactional categories (Order Updates, Shipping Notifications, Appointment Reminders, Return Updates) with immediate persist on toggle — no save button. Guests see login/register prompts without leaving the current route. Registration and checkout expose a promotional email checkbox that is **unchecked by default**. Opting in to Promotions via communication preferences adds the customer to the *Marketing Email List* with a recorded timestamp. All labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–7; preference UI lives in `app-client` account area.

- **Folder layout:** new pages under `packages/app-client/src/pages/account/`; API client in `packages/customer-account/client/` and `packages/marketing/client/` as needed
- **State management:** server-backed preference DTOs; optimistic UI on toggle with PATCH; rollback + `role="alert"` on API failure
- **Styling:** component-scoped inline styles matching existing account pages (`WishlistPage`, `AddressBookPage`); `AccountSettingsLayout` grid
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root
- **Accessibility check:** axe-core in component tests; keyboard pass on toggle lists and guest gates
- **Performance budget:** no regression over Increment 7 baseline; preference pages are lightweight forms

---

## Account navigation extension

Extend `AccountSettingsNav` to match lo-fi account nav (verbatim labels):

| Nav item | Route | Sprint |
| --- | --- | --- |
| overview | `/account` | existing |
| order history | `/account/orders` | existing |
| appointments | `/account/appointments` | existing |
| wishlist | `/account/wishlist` (or existing wishlist route) | existing |
| saved payment methods | `/account/payment-methods` | existing |
| communication | `/account/communication` | **new** |
| notifications | `/account/notifications` | **new** (preference page — distinct from `/account/notifications/:id` payment-retry route; resolve naming: use `/account/notification-preferences` if collision, lo-fi label remains *Notifications*) |

**Note:** If `/account/notifications` conflicts with `PaymentRetryNotificationPage` route, implement preferences at `/account/notification-preferences` and register alias redirect from `/account/notifications` when no `:id` segment — document in engineering pass.

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| customer account — communication preferences | stack | `/account/communication` | Set Communication Preferences · Opt In to Marketing Email List | **New** |
| customer account — notification preferences | stack | `/account/notifications` or `/account/notification-preferences` | Set Notification Preferences | **New** |
| register account (opt-in touchpoint) | form | `/register` | Opt In to Marketing Email List | **Updated** — promotional checkbox |
| checkout payment (opt-in touchpoint) | form | `/checkout/payment` | Opt In to Marketing Email List | **Updated** — promotional checkbox |

---

## Screen spec (from lo-fi — regions verbatim)

### customer account — communication preferences

**Layout:** stack  
**Route:** `/account/communication`  
**AC stories:** Set Communication Preferences · Opt In to Marketing Email List

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Unchanged Increment 4 chrome |
| account nav | header | nav-tabs | Profile · Orders · Appointments · Wishlist · Saved Payments · Communication (active) · Notifications | Communication tab active |
| communication preferences header | body | form | Marketing Communication Preferences · "Changes take effect immediately" | `h1` + supporting text; no Submit/Save button |
| marketing category toggles | body | list | marketing category · description · opt-in status | Four rows: Promotions, Recommendations, Restock Alerts, Events |
| promotions toggle | body | form | Promotions — sales, new products, seasonal offers (checkbox) | `aria-checked`; PATCH on change; opt-in adds to Marketing Email List |
| recommendations toggle | body | form | Recommendations — personalized product suggestions (checkbox) | |
| restock alerts toggle | body | form | Restock Alerts — wishlisted products back in stock (checkbox) | |
| events toggle | body | form | Events — in-store event notifications at preferred store (checkbox) | |
| transactional note | body | form | Transactional notifications not affected by these settings | Static note separating marketing from transactional |
| guest access state | body | form | "Log in or register to manage communication preferences" · Log In · Register | Replaces toggles; `returnTo=/account/communication`; URL unchanged |

**Conditional states:**

- Guest: guest gate replaces toggles
- New marketing category (API returns 5th category): render with `opted-out` / unchecked default
- All categories opted out: transactional note still visible
- Toggle error: `role="alert"`; revert checkbox to prior state

**API routes (architecture reference):**

- `GET /api/account/communication-preferences`
- `PATCH /api/account/communication-preferences` (per-category toggle, immediate)

---

### customer account — notification preferences

**Layout:** stack  
**Route:** `/account/notification-preferences` (preferred) with nav label *Notifications*  
**AC stories:** Set Notification Preferences

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation — logged in | header | toolbar | find stores · shop supplies · shopping cart · pets · wishlist · account | Unchanged |
| account nav | header | nav-tabs | … · Communication · Notifications (active) | Notifications tab active |
| notification preferences header | body | form | Notification Preferences · "Changes take effect immediately" | Same immediate-toggle pattern |
| order updates toggle | body | form | Order Updates (checkbox) | Maps to category *order updates* |
| shipping notifications toggle | body | form | Shipping Notifications (checkbox) | |
| appointment reminders toggle | body | form | Appointment Reminders (checkbox) | |
| return updates toggle | body | form | Return Updates (checkbox) | |
| critical notifications note | body | form | "Some notifications cannot be disabled (e.g. order confirmation, refund completion)" | Always visible; non-suppressible categories documented |
| guest access state | body | form | "Log in or create an account" · guest order notifications continue via checkout email · Log In · Create Account | Guest gate; note about guest checkout email delivery |

**Conditional states:**

- Guest: login prompt with guest-checkout note
- All optional categories off: critical note remains; order confirmation and refund completion still sent server-side

**API routes:**

- `GET /api/account/notification-preferences`
- `PATCH /api/account/notification-preferences`

---

### Opt-in touchpoints (registration and checkout)

**Stories:** Opt In to Marketing Email List (AC 2–3)

| Touchpoint | Control | Behaviour |
| --- | --- | --- |
| `RegisterPage` | promotional email checkbox (unchecked default) | Label verbatim from UL; `defaultChecked={false}`; only sent to API when checked on submit |
| `PaymentPage` (or final checkout step before pay) | promotional email checkbox (unchecked default) | Same; checked + complete checkout → Marketing Email List + timestamp |

---

## AC → behaviour → test mapping

### Story: Set Notification Preferences

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — categories listed with on/off | Page lists Order Updates, Shipping Notifications, Appointment Reminders, Return Updates with current state | `NotificationPreferencesPage` | Set Notification Preferences — AC 1 | pass |
| AC 2 — toggle persists immediately | PATCH on checkbox change; no save button | `NotificationPreferencesPage` | Set Notification Preferences — AC 2 | pass |
| AC 3 — critical notifications note | Note visible when all optional off; server still sends order confirmation / refund completion | `NotificationPreferencesPage` | Set Notification Preferences — AC 3 | pass |
| AC 4 — guest login prompt | Guest gate with login/create account; guest checkout emails unaffected (server test) | `NotificationPreferencesPage` (guest gate) | Set Notification Preferences — AC 4 | pass |

### Story: Set Communication Preferences

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — marketing categories listed | Four categories with opt-in/opt-out status | `CommunicationPreferencesPage` | Set Communication Preferences — AC 1 | pass |
| AC 2 — immediate persist on toggle | PATCH on change; marketing send blocked after opt-out (integration) | `CommunicationPreferencesPage` | Set Communication Preferences — AC 2 | pass |
| AC 3 — new category defaults opt-out | Unknown category from API renders unchecked | `CommunicationPreferencesPage` | Set Communication Preferences — AC 3 | pass |
| AC 4 — transactional unaffected | Transactional note visible; notification preferences independent (integration) | `CommunicationPreferencesPage` | Set Communication Preferences — AC 4 | pass |
| AC 5 — guest prompt without navigation | Guest on `/account/communication` sees gate; URL unchanged | `CommunicationPreferencesPage` (guest gate) | Set Communication Preferences — AC 5 | pass |

### Story: Opt In to Marketing Email List

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — promotions opt-in adds to list | Toggle Promotions on → Marketing Email List membership + timestamp (API) | `CommunicationPreferencesPage` | Opt In to Marketing Email List — AC 1 | pass |
| AC 2 — registration/checkout checkbox default unchecked | Checkbox `defaultChecked={false}` on register and checkout | `RegisterPage`, `PaymentPage` | Opt In to Marketing Email List — AC 2 | pass |
| AC 3 — no marketing without opt-in | All categories off → no sends (server/integration) | `CommunicationPreferencesPage` | Opt In to Marketing Email List — AC 3 | pass (server) |
| AC 4 — promotions shows opted-in; toggle off unsubscribes | Promotions reflects list state; off removes from list when no categories remain | `CommunicationPreferencesPage` | Opt In to Marketing Email List — AC 4 | pass |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | pass | Each checkbox: `<label htmlFor>` with category name + description |
| Focus order matches reading order | pass | Nav → header → toggles → notes → guest links |
| Focus is visible | pass | Browser default focus ring preserved |
| Errors programmatically associated | pass | Failed PATCH: `role="alert"` `aria-live="assertive"` |
| State cues not colour-only | pass | Checkbox + text label for on/off |
| Keyboard reachable | pass | All toggles and guest links tabbable |
| Axe passes | pass | Component tests cover labels and guest gates |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Bundle size regression | No increase over Increment 7 baseline | pending | Two lightweight account pages |
| Toggle latency | PATCH completes &lt; 500ms p95 in dev | pending | Optimistic UI acceptable with rollback |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | Implemented CommunicationPreferencesPage, NotificationPreferencesPage, PreferenceGuestGate, PromotionalEmailOptInCheckbox on RegisterPage and PaymentPage; client tests in `tests/marketing-engine/preferences/`. |
| 2026-05-30 | initial | Specification pass: communication + notification preference pages, account nav extension, registration/checkout opt-in checkboxes; 3 stories, 13 AC clauses mapped. |


---

## increment-8-sprint-3-campaigns-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 3 (Marketing campaigns and alerts)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screen: *notification preview — marketing communications*; product detail *Stock Availability* read path for restock best-effort). Specification-stage spec; implementation and tests land in Engineering. Campaign **dispatch** is system/back-end; this spec defines staff email preview UI, email template affordances (including *Unsubscribe* link), and customer read-path fidelity for restock alerts.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 3 — Marketing campaigns and alerts (1 staff preview screen + product detail stock read path, 4 system stories) |
| Ticket | `inc-8-sprint-3-campaigns` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ notification preview — marketing communications) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 3 campaign stories only) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanism: Marketing Email Dispatch · Marketing Unsubscribe link target) |
| Prior interface specs | `docs/increments/7-returns-refunds/specification/interface-design.md` (`ReturnNotificationPreviewPage` pattern); `docs/end-to-end/specification/interface-design.md` |
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


---

## increment-8-sprint-4-content-interface-design

<!-- migrated from: increments/8-marketing-engine/specification/interface-design.md -->

# Interface design — Increment 8 Sprint 4 (Content publishing and unsubscribe)

> **Companion to** lo-fi `docs/increments/8-marketing-engine/exploration/ux/mockups.md` / `.drawio` (screens: *blog index*, *blog post detail*, *pet care guide index*, *pet care guide detail*, *admin — content editor*, *unsubscribe confirmation*; cross-link touchpoints on pet/product browsing). Specification-stage spec; implementation and tests land in Engineering. Extends primary nav with *blog* and *pet care guides*; staff dashboard gains *Content* tab per Increments 6–7 pattern — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 4 — Content publishing and unsubscribe (6 screens + 2 cross-link touchpoints, 3 stories) |
| Ticket | `inc-8-sprint-4-content` |
| Lo-fi reference | `docs/increments/8-marketing-engine/exploration/ux/mockups.md` (§ blog index · blog post detail · pet care guide index · pet care guide detail · admin — content editor · unsubscribe confirmation) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Publish Blog Post · Publish Pet Care Guide · Unsubscribe from Marketing Emails) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/increments/8-marketing-engine/specification/architecture-reference.md` (Mechanisms: Content Publishing · Marketing Unsubscribe) |
| Prior interface specs | `docs/end-to-end/specification/interface-design.md` (Communication Preferences unsubscribe path); `docs/end-to-end/specification/interface-design.md` (email *Unsubscribe* link target → this sprint confirmation page) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/content/` (new domain package); `packages/app-client/src/pages/content/` — `BlogIndexPage.tsx`, `BlogPostPage.tsx`, `GuideIndexPage.tsx`, `GuideDetailPage.tsx`, `StaffContentEditorPage.tsx`; `packages/app-client/src/pages/marketing/UnsubscribeConfirmationPage.tsx`; extend `PrimaryNav.tsx`, `StaffNav.tsx`; pet/product browsing cross-links in `packages/pet-gallery/client/`, `packages/product-catalog/client/` |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Engineering — `abd-interface-design` implementation + review pass) |

## Description

Sprint 4 delivers public *Blog Index* and *Blog Post* detail surfaces, *Guide Index* and *Pet Care Guide* detail surfaces with species-tag filtering and cross-linking from pet and product browsing areas, a staff *Admin Content Area* with draft-to-published lifecycle for *Blog Post* and *Pet Care Guide* (including tag-required validation before publish), and the customer *Unsubscribe Confirmation Page* reached from signed *Unsubscribe Token* links in marketing emails. *Communication Preferences* unsubscribe toggles from Sprint 2 remain the preferences-page path; this sprint adds the one-click email link execution and idempotent confirmation UI. Draft *Content* is never visible to customers; published *Content* is always reachable via its own URL. All labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–7; content UI spans new `packages/content/` and `app-client` routes.

- **Folder layout:** new `packages/content/` per architecture reference (`Content.ts`, `BlogPost.ts`, `PetCareGuide.ts`, server module); customer pages under `packages/app-client/src/pages/content/`; staff editor under `packages/app-client/src/pages/staff/` or `pages/content/StaffContentEditorPage.tsx`; unsubscribe page under `packages/app-client/src/pages/marketing/`
- **State management:** server-backed content DTOs; staff editor local draft state with explicit Save as Draft / Publish actions; customer index/detail pages fetch published content only; unsubscribe page stateless after token processing
- **Styling:** component-scoped inline styles matching existing marketing/account pages; species tag as badge on guide detail; pet type filter as `nav-tabs` on guide index
- **Token system:** `packages/shared/layout-tokens.ts` until hi-fi token file exists
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root
- **Accessibility check:** axe-core in component tests; keyboard pass on staff editor, filter tabs, and confirmation CTAs
- **Performance budget:** no regression over Increment 7 baseline; content indexes paginate or lazy-load if list grows

---

## Primary navigation extension

Extend global primary nav (verbatim labels from lo-fi):

| Nav item | Route | Sprint |
| --- | --- | --- |
| find stores | existing | existing |
| shop supplies | existing | existing |
| blog | `/blog` | **new** |
| pet care guides | `/guides` | **new** |
| account | existing | existing |

Logged-in chrome (cart · pets · wishlist) unchanged from Increment 4.

---

## Staff navigation extension

Extend staff nav tabs (verbatim labels):

| Nav item | Route | Sprint |
| --- | --- | --- |
| Stock Levels | existing | existing |
| Incoming Appointments | existing | existing |
| Pet Profiles | existing | existing |
| Returns | existing | existing |
| Content | `/staff/content` | **new** |

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| blog index | stack | `/blog` | Publish Blog Post | **New** |
| blog post detail | stack | `/blog/:slug` | Publish Blog Post | **New** |
| pet care guide index | stack | `/guides` | Publish Pet Care Guide | **New** |
| pet care guide detail | stack | `/guides/:slug` | Publish Pet Care Guide | **New** |
| admin — content editor | form | `/staff/content` | Publish Blog Post · Publish Pet Care Guide | **New** |
| unsubscribe confirmation | stack | `/marketing/unsubscribe/:token` | Unsubscribe from Marketing Emails | **New** |
| pet browsing area (cross-link) | stack | existing pet gallery routes | Publish Pet Care Guide | **Updated** — species-filtered guide links |
| product browsing area (cross-link) | stack | existing product catalog routes | Publish Pet Care Guide | **Updated** — species-matched guide links |

---

## Screen spec (from lo-fi — regions verbatim)

### blog index

**Layout:** stack  
**Route:** `/blog`  
**AC stories:** Publish Blog Post (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | Content nav items active/highlight on blog routes |
| blog index header | body | form | PawPlace Blog | Page heading (`h1`) |
| blog post listing | body | list | title · summary · date · author · Read Post | Published posts only — API filters `lifecycle status: published`; drafts never returned |

Each list row links to `/blog/:slug`. *Read Post* is primary row action.

---

### blog post detail

**Layout:** stack  
**Route:** `/blog/:slug` (e.g. `/blog/spring-pet-safety-tips`)  
**AC stories:** Publish Blog Post (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Blog · Post Title (current) | Blog links back to `/blog` |
| blog post content | body | article | title · author · date · body content | Full article; body rendered as readable prose (not editable on customer view) |

Direct URL navigation must render full article (AC 4). 404 for unknown slug or draft slug.

---

### pet care guide index

**Layout:** stack  
**Route:** `/guides`  
**AC stories:** Publish Pet Care Guide (customer browsing view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| guide index header | body | form | Pet Care Guides | Page heading |
| pet type filter | body | nav-tabs | All (active) · Dogs · Cats · Senior Pets · Small Animals | `role="tablist"`; filters listing client-side or via query param |
| pet care guide listing | body | list | title · summary · pet type/species tag · date · Read Guide | Published guides only; tag badge visible per row |

Each row links to `/guides/:slug`. Filter tabs use UL tag vocabulary.

---

### pet care guide detail

**Layout:** stack  
**Route:** `/guides/:slug` (e.g. `/guides/introduce-new-cat`)  
**AC stories:** Publish Pet Care Guide (customer reading view)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · blog · pet care guides · account | |
| breadcrumb | header | toolbar | Pet Care Guides · Guide Title (current) | Guides links back to `/guides` |
| pet care guide content | body | article | title · author · date · pet type/species tag (badge) · body content | Tag badge uses species from publish metadata |

---

### admin — content editor

**Layout:** form  
**Route:** `/staff/content`  
**AC stories:** Publish Blog Post · Publish Pet Care Guide

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header | Staff chrome band |
| staff nav | header | nav-tabs | Stock Levels · Incoming Appointments · Pet Profiles · Returns · Content (active) | Content tab active |
| content type selector | body | nav-tabs | Blog Posts (active) · Pet Care Guides | Toggle editor mode |
| content list | body | list | title · status (draft/published) · date · author · Edit · Publish · New Post (primary) | Staff sees drafts; customers never do |
| blog post editor | body | form | title (text) · summary (textarea) · body content (textarea) · author (text) · Save as Draft · Publish (primary) | Draft → published lifecycle |
| pet care guide editor | body | form | title · summary · body content · pet type/species tag (dropdown) · Save as Draft · Publish (primary) | Shown on Pet Care Guides tab |
| tag required validation | body | alert | At least one pet type or species tag is required before publishing | Conditional: publish blocked; draft preserved |
| publish date note | body | form | Publish date will not change unless you update it explicitly · update publish date (checkbox) | Conditional: editing published post |

**Conditional states:**

- Pet Care Guides tab: guide editor with tag dropdown
- Tag missing on publish: validation `role="alert"`, draft not discarded
- Editing published post: publish date preservation unless explicit checkbox checked

---

### unsubscribe confirmation

**Layout:** stack  
**Route:** `/marketing/unsubscribe/:token`  
**AC stories:** Unsubscribe from Marketing Emails (email link path — AC 1, AC 4)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies · account | Minimal nav |
| unsubscribe confirmation | body | form | You've been unsubscribed · category name · re-subscribe note · Manage Communication Preferences · Continue Shopping (primary) | Token processed server-side on GET; immediate category opt-out |
| already unsubscribed state | body | form | You've been unsubscribed · already unsubscribed note | Conditional: idempotent repeat click — same message, no error |

**Note:** Preferences-page unsubscribe (AC 2, AC 3) is implemented on Sprint 2 *Communication Preferences* screen — not duplicated here. Transactional *Notification Preferences* unaffected (AC 3 server invariant).

---

## Cross-link touchpoints (Publish Pet Care Guide — AC 2)

| Touchpoint | Behaviour | Component area |
| --- | --- | --- |
| Pet Browsing Area filtered by species | When species filter matches guide tag, show linked guide title | `packages/pet-gallery/client/` — species browse view |
| Product Browsing Area for species-matched products | Cat products surface cat-tagged guides (and vice versa) | `packages/product-catalog/client/` — category/species listing |

Links use guide title verbatim; route to `/guides/:slug`.

---

## AC → behaviour → test mapping

### Story: Publish Blog Post

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — published post on index with metadata + URL | Publish creates published Blog Post; index lists title, summary, date, author; detail at `/blog/:slug` | `StaffContentEditorPage`, `BlogIndexPage`, `BlogPostPage`, `content.service` | Publish Blog Post — AC 1 | passing |
| AC 2 — draft hidden from customers | Draft excluded from public API and index | `content.service`, `BlogIndexPage` | Publish Blog Post — AC 2 | passing |
| AC 3 — edit reflects live; publish date preserved | PATCH body updates live page; publish date unchanged unless explicit flag | `StaffContentEditorPage`, `content.service` | Publish Blog Post — AC 3 | passing |
| AC 4 — direct URL shows full article | GET `/blog/:slug` renders title, author, date, body | `BlogPostPage` | Publish Blog Post — AC 4 | passing |

### Story: Publish Pet Care Guide

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — published guide on index with tag + URL | Guide index shows title, summary, tag, date; detail at `/guides/:slug` | `GuideIndexPage`, `GuideDetailPage`, `StaffContentEditorPage` | Publish Pet Care Guide — AC 1 | passing |
| AC 2 — species tag cross-links from pet/product browsing | Matching species surfaces guide link | pet gallery + product catalog client | Publish Pet Care Guide — AC 2 | passing |
| AC 3 — draft hidden from customers | Draft excluded from public guide API | `content.service`, `GuideIndexPage` | Publish Pet Care Guide — AC 3 | passing |
| AC 4 — publish blocked without tag; draft preserved | Validation error; remains draft in admin | `StaffContentEditorPage`, `content.service` | Publish Pet Care Guide — AC 4 | passing |

### Story: Unsubscribe from Marketing Emails

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — email link opts out + confirmation | GET token → opt-out category → confirmation page with *you've been unsubscribed* | `UnsubscribeConfirmationPage`, `unsubscribe.service` | Unsubscribe from Marketing Emails — AC 1 | passing |
| AC 2 — preferences page unsubscribe | Toggle on Communication Preferences (Sprint 2) | `CommunicationPreferencesPage` | Unsubscribe from Marketing Emails — AC 2 | passing (Sprint 2) |
| AC 3 — transactional notifications unaffected | Server: marketing unsubscribe does not alter Notification Preferences | `unsubscribe.service`, notification dispatch | Unsubscribe from Marketing Emails — AC 3 | passing |
| AC 4 — repeat link idempotent | Same confirmation message; no error | `UnsubscribeConfirmationPage`, `unsubscribe.service` | Unsubscribe from Marketing Emails — AC 4 | passing |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Every input has a programmatic label | done | Staff editor fields use `<label>`; filter tabs use `aria-selected` |
| Focus order matches reading order | done | Editor: title → summary → body → actions |
| Focus is visible | done | Match existing staff/account focus ring |
| Errors programmatically associated | done | Tag validation uses `role="alert"` + `data-testid` |
| State cues not colour-only | done | Draft/published status includes text label |
| Keyboard reachable | done | Tab through content list, editor, confirmation CTAs |
| Axe passes | done | Engineering pass via RTL tests |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Content index pages | Lightweight list render | pending | Paginate if >20 items |
| Staff editor | No heavy WYSIWYG in MVP | pending | Plain textarea per lo-fi |
| Unsubscribe page | Minimal static confirmation | pending | Token verify server-side |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | Routes, customer pages, staff editor, unsubscribe confirmation, nav extensions, guide cross-links, client tests (`tests/marketing-engine/content/content_client.test.tsx`). |
