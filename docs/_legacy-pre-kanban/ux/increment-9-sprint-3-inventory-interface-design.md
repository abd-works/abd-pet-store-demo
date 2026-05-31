# Interface design — Increment 9 Sprint 3 (Pet profiles and inventory power-ups)

> **Companion to** lo-fi `docs/ux/lo-fi/increment-9-lo-fi.md` / companion `.drawio` (screens: *customer pet profiles*, *inventory dashboard*, *backorder product page*). Specification-stage spec; implementation and tests land in Engineering. Extends Increment 4 account area and Increment 1 staff stock editing — this spec is authoritative for the sprint slice.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 9 Sprint 3 — Pet profiles and inventory power-ups (3 primary screens + cart touchpoint, 5 stories) |
| Ticket | `inc-9-sprint-3-inventory` |
| Lo-fi reference | `docs/ux/lo-fi/increment-9-lo-fi.md` (§ Screen 4 · Screen 5 · Screen 6) |
| Acceptance criteria | `docs/story/acceptance-criteria/increment-9-acceptance-criteria.md` (Create Customer Pet · View Inventory Dashboard · Display Low Stock Badge · Allow Backorder Purchase); Update Customer Pet from CRC/spec |
| Specification by example | `docs/story/specification-by-example/increment-9-sprint-3-inventory-specification-by-example.md` |
| Domain / CRC | `docs/domain/power-ups-pet-inventory-crc.md`, `docs/domain/power-ups-ubiquitous-language.md` |
| Prior interface specs | `docs/ux/increment-4-interface-design.md` (account settings); `docs/ux/increment-1-interface-design.md` (product detail, staff stock form — replaced by dashboard) |
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
