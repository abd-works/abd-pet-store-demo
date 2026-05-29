# Lo-fi — Increment 1: Walk-in driver

> **Companion to** `docs/ux/lo-fi/increment-1-walk-in-driver.drawio`. Author or update **this file first**, then regenerate the wireframe from the state file.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 1 — Walk-in driver (5 screens, 6 stories) |
| Initial IA | `docs/ux/information-architecture.md` |
| AC source | `docs/story/acceptance-criteria/increment-1-acceptance-criteria.md` |
| Domain terms | `docs/domain/ubiquitous-language.md` |
| State file | `docs/ux/lo-fi/increment-1-walk-in-driver-state.json` |
| Wireframe | `docs/ux/lo-fi/increment-1-walk-in-driver.drawio` |
| Last updated | 2026-05-24 |

## Description

Lo-fi wireframes for the payment-free, account-free Increment 1 customer path (store locator, product catalog, product detail page) and the bare-bones staff *admin dashboard* stock form. Interaction decisions lock control types, primary actions, and conditional states (location optional, distance when provided, per-store stock rows). No cart, checkout, login, or search UI.

---

## Design reference

No `Design/` image folder exists for PawPlace. Layout and control types follow `information-architecture.md` and production e-commerce conventions.

| Source | Panel/Region | UX element type | Key observations |
| --- | --- | --- | --- |
| IA | store locator | split-screen + nav-tabs | map/list tabs; location entry left; store detail right |
| IA | product catalog | sidebar listbox + list grid | category filter; product rows |
| IA | product detail page | stack | breadcrumb; image listbox; stock list |
| IA | admin dashboard | form | store/product dropdowns; stock level text; validation feedback |

**Design principles applied:** listbox for category filter; list for tabular store/product/stock rows; form for location entry and staff stock update; no cart or account chrome.

---

## Screens

### store locator — map view

**Layout:** split-screen  
**AC stories:** View Store Map · Calculate Distance to Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores (primary) · shop supplies | Persistent Increment 1 paths only |
| store locator tab bar | header | nav-tabs | map view (active) · list view | Inactive list view tab greyed |
| location entry | left | form | postcode (text) · distance (read-only when set) · share location · clear location | Distance blank until postcode or shared location |
| map view | left | list | store name · distance columns · select store point | All stores shown without search filter |
| store detail panel | right | form | address · operating hours · contact details · distance · close panel | Populated when store point selected |

**Conditional states:**
- No location: distance column empty; stores in default order
- Location provided: distance populated; nearest-first sort

### store locator — list view

**Layout:** split-screen  
**AC stories:** View Store List · Calculate Distance to Store

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies | Same as map view |
| store locator tab bar | header | nav-tabs | map view · list view (active) | Sibling screen |
| location entry | left | form | postcode · share location · clear location | Same as map view |
| list view | left | list | store name · address · distance · select store row | All stores without search |
| store detail panel | right | form | address · operating hours · contact details · distance | Same panel as map view |

### product catalog

**Layout:** sidebar  
**AC stories:** View Product Details (browse prerequisite)

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies (primary) | Landing path from store locator |
| category filter | panel | listbox | category names | Category-only browse — no keyword search |
| product grid | body | list | product name · category · thumbnail · select product | Opens product detail page |

### product detail page

**Layout:** stack  
**AC stories:** View Product Details · Display Real-Time Stock Availability

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| primary navigation | header | toolbar | find stores · shop supplies | No purchase/cart/review actions |
| breadcrumb | header | toolbar | product catalog · product name (current) | Back to catalog |
| product header | body | form | product name · category (read-only) | |
| image gallery | body | listbox | product image thumbnails | previous image · next image on description row |
| description | body | form | description · weight · dimensions | Read-only product facts |
| stock availability by store | body | list | store name · stock availability · distance · select store link | Real-time on load; links to store locator |

### admin dashboard — stock levels

**Layout:** form  
**AC stories:** Update Product Stock Levels

| Region | Slot | Type | Controls | Interaction decisions |
| --- | --- | --- | --- | --- |
| staff header | header | chrome | staff header band | Minimal staff chrome |
| stock levels form | body | form | store (dropdown) · product (dropdown) · stock level (text) · validation feedback · save (primary) · cancel | Per-store update only; invalid input shows feedback without corrupting prior stock level |

---

## Affordance trace

| Affordance | AC story | AC clause |
| --- | --- | --- |
| map view store points | View Store Map | AC 1 — all stores on map at geo-coordinates |
| store detail panel fields | View Store Map | AC 2 — address, operating hours, contact details on select |
| list view tab | View Store List | AC 1 — list alternative to map |
| list view rows | View Store List | AC 1–2 — name, address; detail on select |
| postcode / share location | Calculate Distance to Store | AC 1 — distance calculated and nearest-first |
| clear location | Calculate Distance to Store | AC 2 — browse without distance |
| category filter | View Product Details | AC 4 — browse by category, no keyword search |
| select product | View Product Details | AC 1 — product page with images, description, weight/dimensions |
| image gallery controls | View Product Details | AC 3 — navigate multiple product images |
| stock availability by store | Display Real-Time Stock Availability | AC 1–3 — per-store availability on product page load |
| store / product / stock level | Update Product Stock Levels | AC 1–4 — staff form, validation, per-store granularity |

---

## Per-screen annotations (drawio companion)

Story and domain term lists for each screen match `information-architecture.md`:

| Screen | Stories | Domain terms |
| --- | --- | --- |
| store locator — map view | View Store Map · Calculate Distance to Store | store · store locator · distance |
| store locator — list view | View Store List · Calculate Distance to Store | store · address · distance |
| product catalog | *(browse enables View Product Details)* | product catalog · category · product |
| product detail page | View Product Details · Display Real-Time Stock Availability | product · product image · category · stock availability · store |
| admin dashboard — stock levels | Update Product Stock Levels | store · product · stock availability |

---

## CLI

```powershell
node "C:\dev\abd-pet-store-demo\.cursor\skills\abd-ux-mockup\scripts\drawio-mockup.mjs" save --state "docs/ux/lo-fi/increment-1-walk-in-driver-state.json" --out "docs/ux/lo-fi/increment-1-walk-in-driver.drawio"
```

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | Five Increment 1 screens from IA; state JSON + drawio generated. |
