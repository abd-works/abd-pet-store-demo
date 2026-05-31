# Interface Design


---

## increment-9-sprint-1-search-interface-design

<!-- migrated from: increments/9-power-ups/specification/interface-design.md -->

# Interface design — Increment 9 Sprint 1 (Product search and filter)

> **Companion to** lo-fi `docs/increments/9-power-ups/exploration/ux/mockups.md` / `product-search-results.drawio` (screen: *product search results*). Specification-stage spec; implementation and tests land in Engineering. Extends global site header with always-visible *Search Bar* and adds sidebar filter + results layout — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 1 — Product search and filter (1 screen + global header search bar, 2 stories) |
| Ticket | `inc-9-sprint-1-search` |
| Lo-fi reference | `docs/increments/9-power-ups/exploration/ux/mockups.md` (§ Screen 1: Product Search Results) · `docs/increments/9-power-ups/exploration/ux/product-search-results.drawio` |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Search Products by Keyword · Filter Products) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md` |
| Architecture reference | `docs/end-to-end/specification/architecture-reference.md` (extend `packages/product-catalog/` search module — assign in engineering arch-reference pass) |
| Prior interface specs | Increment 1 product catalog browse (`ProductCatalogView`); Increment 8 primary nav patterns |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/app-client/src/components/GlobalSearchBar.tsx`; `packages/app-client/src/pages/catalog/ProductSearchResultsPage.tsx`; `packages/product-catalog/client/` — `FilterFacetsPanel.tsx`, `ActiveFilterChips.tsx`, `SearchResultsList.tsx`; `packages/product-catalog/server/search.service.ts`, `search.controller.ts` |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 1 adds global *Product Search* via a header *Search Bar* on every page and a dedicated *Search Results* page with sidebar *Filter Facet* panel, removable *Active Filter* chips, relevance-ranked product list, and guided empty states. *Filter Facet* dimensions are *category*, pet type, brand, price range (min–max), and *Stock Availability*; counts recalculate on every filter change and combine conjunctively. Keyword search supports partial/fuzzy matching; zero-match keyword searches show *no results found* with suggestions; zero-match filter combinations show *no products match your filters* with *clear all filters*. Submitting search from any page navigates to `/catalog/search?q=…`. Labels use power-ups ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–8; search UI extends product-catalog package and global header.

- **Folder layout:** search page under `packages/app-client/src/pages/catalog/`; reusable facets/results under `packages/product-catalog/client/`; API under `packages/product-catalog/server/`
- **State management:** URL query params for `q` and filter state (`category`, `petType`, `brand`, `priceMin`, `priceMax`, `inStock`); server returns ranked results + facet counts for current combined state
- **Styling:** sidebar layout (filter panel left, results right) per lo-fi; active filter chips as removable pills in toolbar row above results
- **Token system:** `packages/shared/layout-tokens.ts`
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Lint / format / type gates:** `npm test` from repo root
- **Accessibility check:** axe-core; keyboard navigation for facets, chips, and search submit
- **Performance budget:** debounce facet count refetch optional; no regression over Increment 7 catalog browse baseline

---

## Global header extension

| Region | Route | Stories | Change |
| --- | --- | --- | --- |
| Site header with search bar | all pages | Search Products by Keyword | **Updated** — persistent search input + submit in primary header |

**Controls (verbatim from lo-fi):** Search products… (text input) · submit (implicit Enter or search button)

Submit navigates to `/catalog/search?q={keyword}` preserving current filters only when already on search page (engineering detail).

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| product search results | sidebar | `/catalog/search` | Search Products by Keyword · Filter Products | **New** |

Product catalog browse (`/product-catalog`) reuses the same *Filter Facet* panel and *Active Filter* chip components per Filter Products AC 1 (browse OR search results).

---

## Screen spec (from lo-fi — regions verbatim)

### product search results

**Layout:** sidebar (filter panel left, results body right)  
**Route:** `/catalog/search?q={keyword}`  
**AC stories:** Search Products by Keyword · Filter Products

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| site header with search bar | header | toolbar | Search products… (prefilled with current keyword) | Global access; submit re-runs search |
| filter facets panel | panel | form | category · pet type · brand · price range (min–max) · stock availability | Each dimension lists values with match counts |
| facet match counts | panel | listbox | count per facet value | Counts reflect combined active filter state — never stale |
| active filters | body | toolbar (chips) | removable chips per active filter · clear all filters | Chip remove expands results; zero-result shows clear-all CTA |
| search results list | body | list | product name · price · category · relevance order | Closest keyword match first |
| no results message — keyword | body | chrome | no results found · popular categories · alternative keywords | Conditional: keyword match empty |
| no results message — filters | body | chrome | no products match your filters · clear all filters | Conditional: filters intersect to zero |

**Price range facet:** min and max numeric inputs (not discrete buckets) per UL decision.

**Partial/fuzzy matching:** server-side; UI displays same results list component.

---

## AC → behaviour → test mapping

### Story: Search Products by Keyword

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — keyword match ranked by relevance | Submit keyword → API returns matches on name, description, category, brand; closest first | `GlobalSearchBar`, `SearchResultsList`, `search.service` | Search Products by Keyword — AC 1 | pass |
| AC 2 — no match shows guidance | Empty keyword results show *no results found* + suggestions | `SearchResultsList` | Search Products by Keyword — AC 2 | pass |
| AC 3 — partial keyword fuzzy match | Partial *kitt* returns kitten food product | `search.service`, `SearchResultsList` | Search Products by Keyword — AC 3 | pass (server) |
| AC 4 — global search from any page | Header search on product detail → navigate to search results | `GlobalSearchBar`, routing | Search Products by Keyword — AC 4 | pass |
| AC 5 — filters narrow keyword results | Active filter intersects with keyword results immediately | `FilterFacetsPanel`, `ActiveFilterChips`, `SearchResultsList` | Search Products by Keyword — AC 5 | pass |

### Story: Filter Products

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — facets with counts on browse/search | Five dimensions visible; counts per value | `FilterFacetsPanel` | Filter Products — AC 1 | pass |
| AC 2 — select facet → chip + immediate narrow | Selection adds chip; list updates | `FilterFacetsPanel`, `ActiveFilterChips` | Filter Products — AC 2 | pass |
| AC 3 — conjunctive filters + count refresh | Multiple filters intersect; counts recalculate | `FilterFacetsPanel`, `search.service` | Filter Products — AC 3 | pass |
| AC 4 — remove chip expands + recalculates | Chip remove restores excluded products | `ActiveFilterChips` | Filter Products — AC 4 | pass |
| AC 5 — zero results clear-all | *no products match your filters* + clear all; no stale counts | `SearchResultsList`, `ActiveFilterChips` | Filter Products — AC 5 | pass |
| AC 6 — price range min-max | Min/max inputs behave like other facets | `FilterFacetsPanel` (price range) | Filter Products — AC 6 | pass |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Search input labelled | planned | `aria-label="Search products"` or visible label |
| Facet controls keyboard reachable | planned | Checkbox/radio pattern per facet value |
| Active filter chips removable via keyboard | planned | Chip button with accessible name |
| Focus order | planned | Header search → facets → chips → results |
| Empty states announced | planned | `role="status"` on no-results regions |
| Axe passes | pending | Engineering pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Search results page | No regression vs catalog browse | pending | Server-side ranking |
| Facet count refetch | Immediate on filter change | pending | May batch API calls in engineering |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | initial | Specification pass: global header search bar + product search results sidebar layout; 2 stories, 11 AC clauses mapped. |


---

## increment-9-sprint-2-stores-interface-design

<!-- migrated from: increments/9-power-ups/specification/interface-design.md -->

# Interface design — Increment 9 Sprint 2 (Store preference and tailoring)

> **Companion to** lo-fi `docs/increments/9-power-ups/exploration/ux/mockups.md` / companion `.drawio` (screens: *store locator with filters*, *my store preferences*; tailoring touchpoints on product detail and click-and-collect checkout). Specification-stage spec; implementation and tests land in Engineering. Extends Increment 1 store locator and account settings — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 2 — Store preference and tailoring (2 primary screens + 3 tailoring touchpoints, 3 stories) |
| Ticket | `inc-9-sprint-2-stores` |
| Lo-fi reference | `docs/increments/9-power-ups/exploration/ux/mockups.md` (§ Screen 2 · Screen 3) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Filter Stores · Set My Store Preference · Tailor Experience to Preferred Store) |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md` |
| Prior interface specs | `docs/increments/1-walk-in-driver/specification/interface-design.md` (store locator, store detail); `docs/increments/2-click-and-collect/specification/interface-design.md` (click-and-collect store selection); `docs/increments/4-returning-customers/specification/interface-design.md` (account settings) |
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


---

## increment-9-sprint-3-inventory-interface-design

<!-- migrated from: increments/9-power-ups/specification/interface-design.md -->

# Interface design — Increment 9 Sprint 3 (Pet profiles and inventory power-ups)

> **Companion to** lo-fi `docs/increments/9-power-ups/exploration/ux/mockups.md` / companion `.drawio` (screens: *customer pet profiles*, *inventory dashboard*, *backorder product page*). Specification-stage spec; implementation and tests land in Engineering. Extends Increment 4 account area and Increment 1 staff stock editing — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 3 — Pet profiles and inventory power-ups (3 primary screens + cart touchpoint, 5 stories) |
| Ticket | `inc-9-sprint-3-inventory` |
| Lo-fi reference | `docs/increments/9-power-ups/exploration/ux/mockups.md` (§ Screen 4 · Screen 5 · Screen 6) |
| Acceptance criteria | `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Create Customer Pet · View Inventory Dashboard · Display Low Stock Badge · Allow Backorder Purchase); Update Customer Pet from CRC/spec |
| Specification by example | `docs/end-to-end/specification/specification-by-example.md` |
| Domain / CRC | `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md` |
| Prior interface specs | `docs/increments/4-returning-customers/specification/interface-design.md` (account settings); `docs/increments/1-walk-in-driver/specification/interface-design.md` (product detail, staff stock form — replaced by dashboard) |
| Target framework | React 18 + TypeScript (Vite), Express 4 |
| Host project root | `C:\dev\abd-pet-store-demo` |
| Implementation paths | `packages/customer-account/` — `MyPetsPage.tsx`, `PetProfileForm.tsx`; `packages/inventory/` (new) — `InventoryDashboardPage.tsx`, inline stock edit, export CSV; `packages/product-catalog/client/` — backorder indicator on product detail + cart line label |
| Test path | `tests/` (Vitest + React Testing Library per `conf/`) |
| Last updated | 2026-05-31 (Specification — `abd-interface-design` spec pass) |

## Description

Sprint 3 adds *My Pets* under account settings for logged-in customers to create, edit, and delete *Customer Pet Profiles* (name, species, breed optional, age/DOB optional, photo optional) with guest auth gate. Staff receive an *Inventory Dashboard* replacing the Increment 1 bare-bones stock form — searchable/sortable product table with inline *Stock Level* edit, *Low Stock Alert* badges, *low stock only* filter, configurable threshold modal, CSV *Inventory Export*, and validation errors for invalid stock. Customers see *Backorder* on product pages when enabled for out-of-stock products, with backorder-labelled cart lines and normal checkout acceptance. Labels use ubiquitous-language terms verbatim.

---

## Host project conventions

Same baseline as Increments 1–8; pet profiles in customer-account; inventory dashboard new staff module.

- **Folder layout:** pet UI under `packages/customer-account/client/` and `app-client/pages/account/`; inventory under `packages/inventory/` per domain-first pattern; backorder UI extends product-catalog client
- **State management:** pet CRUD server-backed; dashboard polls or refreshes on inline edit; stock edits propagate to customer-facing availability in real time (Increment 1 invariant)
- **Styling:** account list + form pattern from Increment 4; dashboard full-width table with toolbar; backorder badge distinct from low-stock customer messaging
- **Token system:** `packages/shared/layout-tokens.ts`
- **Test framework:** Vitest + React Testing Library from repo `conf/`
- **Accessibility check:** axe-core; inline edit fields labelled; low stock badge includes text
- **Performance budget:** dashboard handles full store catalog with pagination if needed; export is async download

---

## Account navigation extension

| Nav item | Route | Sprint |
| --- | --- | --- |
| My Pets | `/account/pets` | **new** |

---

## Staff navigation extension

| Nav item | Route | Sprint |
| --- | --- | --- |
| Inventory Dashboard | `/staff/inventory` | **new** (replaces Increment 1 stock form route — redirect legacy URL) |

---

## Screens

| Screen | Layout | Route | Stories | Change |
| --- | --- | --- | --- | --- |
| customer pet profiles — list | form | `/account/pets` | Create Customer Pet · Update Customer Pet | **New** |
| customer pet profile — create/edit | form | `/account/pets/new`, `/account/pets/:petId/edit` | Create Customer Pet · Update Customer Pet | **New** |
| inventory dashboard | stack | `/staff/inventory` | View Inventory Dashboard · Display Low Stock Badge | **New** — replaces Inc 1 stock form |
| backorder product page | stack | `/product-catalog/:sku` | Allow Backorder Purchase | **Updated** — backorder state |
| cart with backorder label | stack | `/cart` | Allow Backorder Purchase | **Updated** — line item label |

---

## Screen spec (from lo-fi — regions verbatim)

### customer pet profiles — My Pets

**Layout:** form (list)  
**Route:** `/account/pets`  
**AC stories:** Create Customer Pet · Update Customer Pet

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| My Pets header | body | chrome | My Pets | Account area heading |
| Pet profiles list | body | list | pet name · species · breed · Edit · Delete | Multiple pets listed; Edit → edit form |
| Empty state | body | chrome | add your first pet · Add Pet (primary) | When no profiles |
| Guest login prompt | body (modal) | chrome + button-bar | log in or register · Log In · Register | Guest on create route; no navigation away |

**Pet profile form** (`/account/pets/new`, `/account/pets/:petId/edit`):

| Region | Controls | Interaction |
| --- | --- | --- |
| Pet profile form | name (required) · species (required) · breed (optional) · age or date of birth (optional) · photo upload (optional) | Save persists to customer account; species/breed feed recommendation algorithms |
| Delete confirmation | are you sure · Confirm Delete · Cancel | Update Customer Pet delete scenario |

---

### inventory dashboard

**Layout:** stack  
**Route:** `/staff/inventory`  
**AC stories:** View Inventory Dashboard · Display Low Stock Badge

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Dashboard header with export | body | toolbar | Inventory Dashboard · Export CSV | Export scoped to staff member's store |
| Search and filter bar | body | filter-bar | search products | Filters table rows |
| Sort and filter controls | body | toolbar | sort by name · stock level · category · low stock only | Low stock filter shows only below-threshold products |
| Product stock table | body | list | product name · category · stock level · last updated · low stock alert badge | Inline edit on stock level cell |
| Inline stock edit | body | form | stock level input · Save | Immediate persist; propagates to customer stock availability |
| Validation error state | body | alert | clear error — invalid stock level | Negative/non-numeric rejected; prior value unchanged |
| Low stock threshold config | body | form (modal) | threshold value · Save | Configurable per store/product policy |
| Out of stock indicator | body | chrome | Out of stock | When stock level zero — supersedes low stock badge (Display Low Stock Badge AC 5) |

---

### backorder product page

**Layout:** stack (extends product detail)  
**Route:** `/product-catalog/:sku`  
**AC stories:** Allow Backorder Purchase

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| Stock status — backorder | body | chrome | Backorder | When out of stock AND backorder enabled |
| Add to Cart (Backorder) | body | button-bar | Add to Cart (primary) | Available when backorder enabled |
| Stock status — out of stock (no backorder) | body | chrome | Out of Stock | Add to Cart disabled — prior increment behaviour |
| Cart backorder label | body | list | backorder label on line item | Cart shows backorder status + ship-when-restocked message |

---

## AC → behaviour → test mapping

### Story: Create Customer Pet

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — list or empty state | My Pets shows profiles or empty state | `MyPetsPage` | Create Customer Pet — AC 1 | pending |
| AC 2 — form fields saved | Create with required/optional fields | `PetProfileForm` | Create Customer Pet — AC 2 | pending |
| AC 3 — multiple pets listed | Each profile separate row | `MyPetsPage` | Create Customer Pet — AC 3 | pending |
| AC 4 — species feeds recommendations | Server stores species/breed for downstream | `customer-account` API | Create Customer Pet — AC 4 | pending |
| AC 5 — guest login prompt | Modal without navigation | `PetProfileForm` | Create Customer Pet — AC 5 | pending |

### Story: Update Customer Pet

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — edit all fields immediate persist | PATCH on save | `PetProfileForm` | Update Customer Pet — AC 1 | pending |
| AC 2 — delete after confirmation | Remove from list | `MyPetsPage` | Update Customer Pet — AC 2 | pending |

### Story: View Inventory Dashboard

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — list with search sort filter | Full product table at store | `InventoryDashboardPage` | View Inventory Dashboard — AC 1 | pending |
| AC 2 — low stock badge + filter | Badge when below threshold; filter available | `InventoryDashboardPage` | View Inventory Dashboard — AC 2 | pending |
| AC 3 — inline edit same as Inc 1 | Immediate persist + customer availability | inline edit + `inventory.service` | View Inventory Dashboard — AC 3 | pending |
| AC 4 — replaces Inc 1 form; data intact | Route migration; no data loss | routing + migration note | View Inventory Dashboard — AC 4 | pending |
| AC 5 — CSV export store-scoped | Export button produces CSV | export action | View Inventory Dashboard — AC 5 | pending |
| AC 6 — invalid stock rejected | Error message; value unchanged | inline validation | View Inventory Dashboard — AC 6 | pending |

### Story: Display Low Stock Badge

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — badge below threshold above zero | Low stock text/quantity badge | dashboard row | Display Low Stock Badge — AC 1 | pending |
| AC 2 — no badge at/above threshold | Badge hidden | dashboard row | Display Low Stock Badge — AC 2 | pending |
| AC 3 — badge disappears after restock | Next view reflects new level | dashboard | Display Low Stock Badge — AC 3 | pending |
| AC 4 — low stock only filter | Subset of below-threshold products | filter control | Display Low Stock Badge — AC 4 | pending |
| AC 5 — zero stock out of stock not low stock | Out of stock supersedes low stock badge | dashboard row | Display Low Stock Badge — AC 5 | pending |

### Story: Allow Backorder Purchase

| AC | Behaviour | Component | Test name | Status |
| --- | --- | --- | --- | --- |
| AC 1 — backorder indicator + add to cart | Backorder label; cart enabled | `ProductDetailContent` | Allow Backorder Purchase — AC 1 | pending |
| AC 2 — cart line backorder label | Line shows backorder + message | cart component | Allow Backorder Purchase — AC 2 | pending |
| AC 3 — checkout summary shows backorder | Order summary per line | checkout | Allow Backorder Purchase — AC 3 | pending |
| AC 4 — no backorder when disabled | Out of Stock; cart disabled | `ProductDetailContent` | Allow Backorder Purchase — AC 4 | pending |
| AC 5 — restock removes backorder | In Stock when level > 0 | `ProductDetailContent` | Allow Backorder Purchase — AC 5 | pending |

---

## Accessibility checklist

| Check | Status | Notes |
| --- | --- | --- |
| Pet form fields labelled | planned | Required fields marked; optional noted |
| Inline stock edit labelled | planned | `aria-label` on stock level input |
| Low stock badge text | planned | Not colour-only — includes "Low stock" or quantity |
| Validation errors | planned | `role="alert"` on invalid stock |
| Guest pet modal | planned | Same pattern as Sprint 2 store preference |
| Axe passes | pending | Engineering pass |

---

## Performance constraints

| Constraint | Budget | Current | Notes |
| --- | --- | --- | --- |
| Dashboard table | Paginate if >100 SKUs | pending | Search reduces visible set |
| Inline edit propagation | Real-time availability update | pending | Server push or poll |
| CSV export | Async download | pending | No blocking UI |

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-31 | engineering | My Pets list/form, inventory dashboard, backorder actions; routes /account/pets, /staff/inventory; 8 tests in tests/power-ups/inventory/ |
