# Interface design — Increment 9 Sprint 2 (Store preference and tailoring)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-9-lo-fi.md` / companion `.drawio` (screens: *store locator with filters*, *my store preferences*; tailoring touchpoints on product detail and click-and-collect checkout). Specification-stage spec; implementation and tests land in Engineering. Extends Increment 1 store locator and account settings — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 2 — Store preference and tailoring (2 primary screens + 3 tailoring touchpoints, 3 stories) |
| Ticket | `inc-9-sprint-2-stores` |
| Lo-fi reference | `docs/ux/lo-fi/increment-9-lo-fi.md` (§ Screen 2 · Screen 3) |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-9-acceptance-criteria.md` (Filter Stores · Set My Store Preference · Tailor Experience to Preferred Store) |
| Specification by example | `docs/story/specification-by-example/increment-9-sprint-2-stores-specification-by-example.md` |
| Domain / CRC | `docs/domain/power-ups-stores-crc.md`, `docs/domain/power-ups-ubiquitous-language.md` |
| Prior interface specs | `docs/ux/increment-1-interface-design.md` (store locator, store detail); `docs/ux/increment-2-interface-design.md` (click-and-collect store selection); `docs/ux/increment-4-interface-design.md` (account settings) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/store/` — extend `StoreLocatorPage.tsx`, `StoreDetailPage.tsx`, `StoreFilterPanel.tsx`; `packages/customer-account/` — `MyStorePreferencePage.tsx`, preference API; `packages/product-catalog/client/` — default stock to preferred store; checkout C&C step pre-select |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 2 adds *Store Specialization Filter* and *Product Availability Filter* dimensions to the *Store Locator*, conjunctive narrowing with a *clear filters* empty state, and *Set as My Store* on store detail plus account settings to persist *My Store* on the customer account. When *My Store* is set, the *Tailored Experience* highlights the preferred store in the locator, defaults *Stock Availability* on product pages to that store, and pre-selects the store in click-and-collect checkout while keeping the full list available for override. Guests see a login/register prompt without leaving the page when attempting to set preference. Labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–8; store preference spans store and customer-account packages.

- **Folder layout:** filter UI in `packages/store/client/`; preference pages in `packages/app-client/src/pages/account/` and store detail extension
- **State management:** server-backed `myStore` on customer account; locator filters via URL or local state with immediate list refresh; tailoring reads preference from session/context
- **Styling:** sidebar layout for locator filters (matches search facet pattern); preferred store row highlight via border/badge — not colour-only
- **Token system:** `packages/shared/layout-tokens.ts`
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Accessibility check:** axe-core; filter panel keyboard navigable; guest modal `role="dialog"`
- **Performance budget:** no regression over Increment 8 baseline

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| store locator with filters | sidebar | `/stores` (existing) | Filter Stores by Availability and Specialization · Tailor Experience (highlight) | **Updated** |
| store detail — set my store | stack | `/stores/:storeId` (existing) | Set My Store Preference · Tailor Experience | **Updated** — Set as My Store action |
| my store preferences (account) | form | `/account/my-store` | Set My Store Preference | **New** |
| product detail — stock default | stack | `/product-catalog/:sku` | Tailor Experience to Preferred Store | **Updated** — default stock to my store |
| checkout click-and-collect store step | form | existing C&C route | Tailor Experience to Preferred Store | **Updated** — pre-select my store |

---

## Screen spec (from lo-fi — regions verbatim)

### store locator with filters

**Layout:** sidebar  
**Route:** `/stores`  
**AC stories:** Filter Stores by Availability and Specialization · Tailor Experience to Preferred Store (highlight)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Store filter panel | panel | form | store specialization filter · product availability filter | Two filter dimensions per lo-fi |
| Store results list | body | list | store name · address · distance · specialization badges | Only matching stores when filters active |
| My store highlight | body | chrome | preferred store badge / highlight | When customer has *My Store*, matching row visually highlighted (text + icon, not colour-only) |
| No stores message | body | chrome + button-bar | no stores match your filters · clear filters | Zero-match combined filters |

---

### store detail — set my store

**Layout:** stack (extends existing store detail)  
**Route:** `/stores/:storeId`  
**AC stories:** Set My Store Preference

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Store detail header | body | chrome | store name · address · hours | Existing Increment 1 regions preserved |
| Set My Store action | body | button-bar | Set as My Store (primary) | Logged-in: PATCH preference immediately; replaces prior *My Store* |
| Current preference indicator | body | chrome | Your preferred store | Shown when this store is current *My Store* |
| Guest login prompt | body (modal) | chrome + button-bar | log in or register to set my store · Log In · Register | Guest: modal; `returnTo` preserves store detail URL |

---

### my store preferences (account)

**Layout:** form  
**Route:** `/account/my-store`  
**AC stories:** Set My Store Preference

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| account nav | header | nav-tabs | … existing tabs … · My Store (active) | New account nav item |
| preference form | body | form | current my store name · Change store (link to locator) · Clear preference | Alternative path to set/change preference |
| no preference state | body | chrome | No preferred store set · Browse stores | When unset — no tailoring applied |

---

### tailoring touchpoints (no new routes)

| Touchpoint | Behaviour | AC |
| --- | --- | --- |
| Product page stock availability | Defaults to *My Store* stock when preference set | Tailor AC 1 |
| Store locator list | Preferred store row highlighted | Tailor AC 2 |
| Click-and-collect checkout | Preferred store pre-selected; full list still selectable | Tailor AC 3 |
| No my store | All tailoring off; prior increment defaults | Tailor AC 4 |

---

## AC → behaviour → test mapping

### Story: Filter Stores by Availability and Specialization

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — filter dimensions available | Specialization + product availability filters on locator | `StoreFilterPanel` | Filter Stores — AC 1 | done |
| AC 2 — specialization filter narrows list | Only matching stores shown | `StoreLocatorPage`, `store.service` | Filter Stores — AC 2 | done |
| AC 3 — product availability filter | In-stock stores for selected product | `StoreFilterPanel` | Filter Stores — AC 3 | done |
| AC 4 — conjunctive combined filters | AND narrowing | `store.service` | Filter Stores — AC 4 | done |
| AC 5 — zero match + clear filters | Empty state + clear action | `StoreLocatorPage` | Filter Stores — AC 5 | done |

### Story: Set My Store Preference

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — save from detail or account | PATCH my store; persists cross-session | `StoreDetailPage`, `MyStorePreferencePage` | Set My Store Preference — AC 1 | done |
| AC 2 — replace previous immediately | New selection replaces old | `customer-account` API | Set My Store Preference — AC 2 | done |
| AC 3 — unset allows set; no tailoring when unset | Default behaviour when null | `MyStorePreferencePage` | Set My Store Preference — AC 3 | done |
| AC 4 — guest prompt without navigation | Modal on guest Set as My Store | `StoreDetailPage` | Set My Store Preference — AC 4 | done |

### Story: Tailor Experience to Preferred Store

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — product stock defaults to my store | Stock widget uses preferred store id | `ProductDetailContent` | Tailor Experience — AC 1 | done |
| AC 2 — locator highlights preferred store | Visual highlight on matching row | `StoreLocatorPage` | Tailor Experience — AC 2 | done |
| AC 3 — C&C checkout pre-select | Preferred store selected; list overrideable | checkout store step | Tailor Experience — AC 3 | done |
| AC 4 — no tailoring when unset | Increment defaults preserved | all touchpoints | Tailor Experience — AC 4 | done |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Filter controls labelled | done | Each filter dimension has visible label |
| Preferred store highlight | done | Text badge + icon, not colour-only |
| Guest modal | done | `role="dialog"`, focus trap, `returnTo` |
| Set as My Store button | done | Descriptive name; disabled state when already preferred |
| Axe passes | pending | Engineering pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Locator filter refresh | Immediate list update | done | Client-side filter |
| Preference PATCH | Optimistic UI acceptable | done | Rollback on failure |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | Implemented StoreFilterPanel, Set as My Store, MyStorePreferencePage, tailoring touchpoints; 13 AC tests in tests/power-ups/stores/ |
