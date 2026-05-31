# Interface design — Increment 8 Sprint 2 (Notification and communication preferences)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-8-marketing-engine.md` / `.drawio` (screens: *customer account — communication preferences*, *customer account — notification preferences*; opt-in touchpoints on registration and checkout). Specification-stage spec; implementation and tests land in Engineering (interface-design implementation pass → ATDD → clean code). Extends Increment 4 account settings under `packages/app-client/` — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 8 Sprint 2 — Notification and communication preferences (2 account screens + 2 opt-in touchpoints, 3 stories) |
| Ticket | `inc-8-sprint-2-preferences` |
| Lo-fi reference | `docs/ux/lo-fi/increment-8-marketing-engine.md` (§ customer account — communication preferences · notification preferences) |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Sprint 2 preference stories only) |
| Specification by example | `docs/story/specification-by-example/increment-8-sprint-2-preferences-specification-by-example.md` |
| Domain / CRC | `docs/domain/marketing-engine-preferences-crc.md`, `docs/domain/marketing-engine-ubiquitous-language.md` |
| Architecture reference | `docs/architecture/increment-8-marketing-engine-reference.md` (Mechanisms: Communication Preferences & Marketing Consent Gate · Notification Preferences (Transactional)) |
| Prior interface specs | `docs/ux/increment-4-interface-design.md`; `docs/ux/increment-8-sprint-1-reviews-interface-design.md` |
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
