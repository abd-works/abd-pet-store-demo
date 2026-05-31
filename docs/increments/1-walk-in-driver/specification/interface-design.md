# Interface Design


---

## Increment 1

<!-- migrated from: increments/1-walk-in-driver/specification/interface-design.md -->

# Interface design — Increment 1 (Walk-in driver)

> **Companion to** lo-fi `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (prototype → ATDD → clean code). Code may exist as brownfield spike under `packages/` — this spec is authoritative for the slice refresh.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 1 — 5 screens, 6 stories |
| Lo-fi reference | `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client`, `packages/store/client`, `packages/product-catalog/client` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-24 |

## Description

Payment-free, account-free browse: *store locator* (*map view* / *list view*), *product catalog*, *product page* with per-store *stock availability*, and *admin dashboard* stock form for *store employee*. Labels use ubiquitous-language terms verbatim. No cart, checkout, login, or keyword search.

---

## Host project conventions

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; app shell in `packages/app-client`
- **State management:** React component state + fetch via module `*.api.ts` clients
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions (no separate hi-fi token file yet)
- **Test framework:** Vitest (unit), Playwright (e2e) from repo `conf/`
- **Gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`

---

## Screens (carried from lo-fi)

| Screen | Layout | Stories |
| --- | --- | --- |
| store locator — map view | split-screen | View Store Map, Calculate Distance to Store |
| store locator — list view | split-screen | View Store List, Calculate Distance to Store |
| product catalog | sidebar | View Product Details (browse) |
| product page | stack | View Product Details, Display Real-Time Stock Availability |
| admin dashboard — stock levels | form | Update Product Stock Levels |

Affordances, control types, and conditional states: see lo-fi § Screens (unchanged).

---

## AC → behaviour → test mapping (summary)

| Story | Clauses | Implementation target | Test name pattern | Status |
| --- | --- | --- | --- | --- |
| View Store Map | 1–4 | `StoreMap.tsx` / `StoreLocatorPage` | `View Store Map — AC n` | pending (Engineering) |
| View Store List | 1–4 | `StoreList.tsx` | `View Store List — AC n` | pending |
| Calculate Distance to Store | 1–4 | locator API + sort | `Calculate Distance to Store — AC n` | pending |
| View Product Details | 1–5 | `ProductDetailView.tsx` | `View Product Details — AC n` | pending |
| Display Real-Time Stock Availability | 1–3 | `StockAvailabilityDisplay.tsx` | `Display Real-Time Stock Availability — AC n` | pending |
| Update Product Stock Levels | 1–4 | `StockAdminForm.tsx` | `Update Product Stock Levels — AC n` | pending |

---

## Accessibility implementation (planned)

| Check | Status |
| --- | --- |
| Programmatic labels on inputs (postcode, stock level, selects) | planned |
| Tab order: location → list/map → detail panel | planned |
| Visible focus | planned |
| Stock validation errors associated with field | planned |
| Keyboard-only path through all five screens | planned |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Specification slot 31 — spec from lo-fi + AC; code sync in Engineering |


---

## Increment 1

<!-- migrated from: increments/1-walk-in-driver/specification/interface-design.md -->

# Interface design — Increment 1 (Walk-in driver)

> **Companion to** lo-fi `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` / `.drawio`. Specification-stage spec; implementation and tests land in Engineering (prototype → ATDD → clean code). Code may exist as brownfield spike under `packages/` — this spec is authoritative for the slice refresh.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 1 — 5 screens, 6 stories |
| Lo-fi reference | `docs/increments/1-walk-in-driver/exploration/ux/mockups.md` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` |
| Domain terms | `docs/end-to-end/exploration/domain/ubiquitous-language.md` |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client`, `packages/store/client`, `packages/product-catalog/client` |
| Test path | `tests/` (Vitest + Playwright per `conf/`) |
| Last updated | 2026-05-24 |

## Description

Payment-free, account-free browse: *store locator* (*map view* / *list view*), *product catalog*, *product page* with per-store *stock availability*, and *admin dashboard* stock form for *store employee*. Labels use ubiquitous-language terms verbatim. No cart, checkout, login, or keyword search.

---

## Host project conventions

- **Folder layout:** domain modules under `packages/<module>/{shared,server,client}`; app shell in `packages/app-client`
- **State management:** React component state + fetch via module `*.api.ts` clients
- **Styling:** component-scoped CSS / inline layout matching lo-fi regions (no separate hi-fi token file yet)
- **Test framework:** Vitest (unit), Playwright (e2e) from repo `conf/`
- **Gates:** `npm test` from repo root; TypeScript project references in `conf/tsconfig`

---

## Screens (carried from lo-fi)

| Screen | Layout | Stories |
| --- | --- | --- |
| store locator — map view | split-screen | View Store Map, Calculate Distance to Store |
| store locator — list view | split-screen | View Store List, Calculate Distance to Store |
| product catalog | sidebar | View Product Details (browse) |
| product page | stack | View Product Details, Display Real-Time Stock Availability |
| admin dashboard — stock levels | form | Update Product Stock Levels |

Affordances, control types, and conditional states: see lo-fi § Screens (unchanged).

---

## AC → behaviour → test mapping (summary)

| Story | Clauses | Implementation target | Test name pattern | Status |
| --- | --- | --- | --- | --- |
| View Store Map | 1–4 | `StoreMap.tsx` / `StoreLocatorPage` | `View Store Map — AC n` | pending (Engineering) |
| View Store List | 1–4 | `StoreList.tsx` | `View Store List — AC n` | pending |
| Calculate Distance to Store | 1–4 | locator API + sort | `Calculate Distance to Store — AC n` | pending |
| View Product Details | 1–5 | `ProductDetailView.tsx` | `View Product Details — AC n` | pending |
| Display Real-Time Stock Availability | 1–3 | `StockAvailabilityDisplay.tsx` | `Display Real-Time Stock Availability — AC n` | pending |
| Update Product Stock Levels | 1–4 | `StockAdminForm.tsx` | `Update Product Stock Levels — AC n` | pending |

---

## Accessibility implementation (planned)

| Check | Status |
| --- | --- |
| Programmatic labels on inputs (postcode, stock level, selects) | planned |
| Tab order: location → list/map → detail panel | planned |
| Visible focus | planned |
| Stock validation errors associated with field | planned |
| Keyboard-only path through all five screens | planned |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Specification slot 31 — spec from lo-fi + AC; code sync in Engineering |
