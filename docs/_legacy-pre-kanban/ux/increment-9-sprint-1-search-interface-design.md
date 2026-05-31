# Interface design — Increment 9 Sprint 1 (Product search and filter)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-9-lo-fi.md` / `product-search-results.drawio` (screen: *product search results*). Specification-stage spec; implementation and tests land in Engineering. Extends global site header with always-visible *Search Bar* and adds sidebar filter + results layout — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 1 — Product search and filter (1 screen + global header search bar, 2 stories) |
| Ticket | `inc-9-sprint-1-search` |
| Lo-fi reference | `docs/ux/lo-fi/increment-9-lo-fi.md` (§ Screen 1: Product Search Results) · `docs/ux/lo-fi/product-search-results.drawio` |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-9-acceptance-criteria.md` (Search Products by Keyword · Filter Products) |
| Specification by example | `docs/story/specification-by-example/increment-9-sprint-1-search-specification-by-example.md` |
| Domain / CRC | `docs/domain/power-ups-search-crc.md`, `docs/domain/power-ups-ubiquitous-language.md` |
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
