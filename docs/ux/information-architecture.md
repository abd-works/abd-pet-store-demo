# Information architecture — Increment 1: Walk-in driver

> **Companion to** `docs/ux/information-architecture.drawio`. Author or update **this file first**, then drive the canvas from it. After the canvas is updated, sync any change back into this file so the two never diverge.

## Metadata

| Field | Value |
| --- | --- |
| Scope | Increment 1 — Walk-in driver (find the store, see what's in stock) |
| Story map | [docs/story/story-map.md](../story/story-map.md) |
| Thin slicing | [docs/story/thin-slicing.md](../story/thin-slicing.md) |
| Ubiquitous language | [docs/domain/ubiquitous-language.md](../domain/ubiquitous-language.md) |
| Canvas | `docs/ux/information-architecture.drawio` |
| Last canvas update | 2026-05-24 |

## Description

First-pass IA for PawPlace Increment 1 — a payment-free, account-free walk-in driver. Customers discover stores via the [store locator](../domain/ubiquitous-language.md), browse the [product catalog](../domain/ubiquitous-language.md) by [category](../domain/ubiquitous-language.md), open a product detail page, and see per-store [stock availability](../domain/ubiquitous-language.md). Store employees update stock through a bare-bones [admin dashboard](../domain/ubiquitous-language.md) form. No cart, checkout, login, pets, or search screens appear in this increment.

---

## Story trace table

| Story | Screen | Region | Key action or transition trigger |
| --- | --- | --- | --- |
| [View Store Map](../story/thin-slicing.md) | store locator — map view | map view | opens store locator |
| [View Store List](../story/thin-slicing.md) | store locator — list view | list view | selects list view tab |
| [Calculate Distance to Store](../story/thin-slicing.md) | store locator — map view · store locator — list view | location entry | enters postcode · shares location |
| [View Product Details](../story/thin-slicing.md) | product detail page | product header · image gallery · description | selects product |
| [Display Real-Time Stock Availability](../story/thin-slicing.md) | product detail page | stock availability by store | grouped — system renders on product detail page load |
| [Update Product Stock Levels](../story/thin-slicing.md) | admin dashboard — stock levels | stock levels form | submits stock update |

---

## Domain term trace table

| Domain term | Appears as | On screen | In region |
| --- | --- | --- | --- |
| [store locator](../domain/ubiquitous-language.md) | screen name prefix | store locator — map view · store locator — list view | — |
| [store](../domain/ubiquitous-language.md) | row field · map point | store locator screens | map view · list view · store detail panel |
| [product catalog](../domain/ubiquitous-language.md) | screen name | product catalog | — |
| [category](../domain/ubiquitous-language.md) | filter label · row tag | product catalog | category filter · product row |
| [product](../domain/ubiquitous-language.md) | row field · header | product catalog · product detail page | product grid · product header |
| [product image](../domain/ubiquitous-language.md) | row field | product detail page | image gallery |
| [stock availability](../domain/ubiquitous-language.md) | region name · status label | product detail page | stock availability by store |
| [admin dashboard](../domain/ubiquitous-language.md) | screen name prefix | admin dashboard — stock levels | — |

---

## Navigation

### Site map — screens

#### store locator — map view

- **Description:** Geographic discovery of all stores; default entry for the walk-in driver increment.
- **Source:** [store locator](../domain/ubiquitous-language.md)
- **Layout:** `holy-grail` — header + primary nav + map body + store detail aside + footer

```
[ store locator — map view ]
┌─────────────────────────────────────────────┐
│ header · primary navigation                 │
├─────────────────────────────────────────────┤
│ tab bar: [ map view ] · list view           │
├──────────────────────────┬──────────────────┤
│ location entry           │ store detail     │
│ map view                 │ panel            │
│ (store points)           │ (address · hours │
│                          │  · contact)      │
├──────────────────────────┴──────────────────┤
│ footer                                      │
└─────────────────────────────────────────────┘
```

- **Inactive tabs (greyed):** list view
- **Chrome (shared regions — named only):**
  - header, primary navigation, footer, tab bar
- **From (incoming transitions):**
  - from product catalog — trigger: selects find stores
- **To (outgoing transitions):**
  - to store locator — list view — trigger: selects list view tab
  - to product catalog — trigger: selects shop supplies
  - to product detail page — trigger: selects product (via product catalog path)
- **Content regions:**
  - **location entry**
    - Row fields: `postcode · share location · distance`
    - Actions: `enter postcode · share location · clear location`
  - **map view**
    - Row fields: `store name · geo-coordinates · distance`
    - Row fields: `store name · geo-coordinates · distance`
    - Actions: `select store point`
  - **store detail panel**
    - Row fields: `address · operating hours · contact details · distance`
    - Actions: `close panel`
- **In-scope user stories (~2):**
  - View Store Map — maps to: map view / opens store locator
  - Calculate Distance to Store — maps to: location entry / enters postcode · shares location
- **Groups system stories:** *(none)*
- **Domain terms (visible only):** store · store locator · distance

#### store locator — list view

- **Description:** List alternative to map view for discovering stores and distance-sorted results.
- **Source:** [store locator](../domain/ubiquitous-language.md)
- **Layout:** `holy-grail` — chrome: same as store locator — map view

```
[ store locator — list view ]
┌─────────────────────────────────────────────┐
│ header · primary navigation ················│
├─────────────────────────────────────────────┤
│ tab bar: map view · [ list view ]           │
├──────────────────────────┬──────────────────┤
│ location entry           │ store detail     │
│ list view                │ panel            │
│ (store rows)             │                  │
├──────────────────────────┴──────────────────┤
│ footer ···································· │
└─────────────────────────────────────────────┘
```

- **Inactive tabs (greyed):** map view
- **Chrome:** same as store locator — map view
- **From (incoming transitions):**
  - from store locator — map view — trigger: selects list view tab
- **To (outgoing transitions):**
  - to store locator — map view — trigger: selects map view tab
  - to product catalog — trigger: selects shop supplies
- **Content regions:**
  - **location entry**
    - Row fields: `postcode · share location · distance`
    - Actions: `enter postcode · share location · clear location`
  - **list view**
    - Row fields: `store name · address · distance`
    - Row fields: `store name · address · distance`
    - Actions: `select store row`
  - **store detail panel**
    - Row fields: `address · operating hours · contact details · distance`
    - Actions: `close panel`
- **In-scope user stories (~2):**
  - View Store List — maps to: list view / selects list view tab
  - Calculate Distance to Store — maps to: location entry / enters postcode · shares location
- **Groups system stories:** *(none)*
- **Domain terms (visible only):** store · address · distance

#### product catalog

- **Description:** Category-only browse surface; prerequisite for opening a product detail page. Serves as customer landing with navigation to store locator.
- **Source:** [product catalog](../domain/ubiquitous-language.md)
- **Layout:** `sidebar` — category panel + product grid body

```
[ product catalog ]
┌────────────┬────────────────────────────────┐
│ header · primary navigation (full width)     │
├────────────┼────────────────────────────────┤
│ category   │ product grid                   │
│ filter     │ (product rows)                 │
├────────────┴────────────────────────────────┤
│ footer                                      │
└─────────────────────────────────────────────┘
```

- **Chrome (shared regions — named only):**
  - header, primary navigation, footer
- **From (incoming transitions):**
  - from store locator — map view — trigger: selects shop supplies
  - from store locator — list view — trigger: selects shop supplies
  - from product detail page — trigger: selects back to catalog
- **To (outgoing transitions):**
  - to product detail page — trigger: selects product
  - to store locator — map view — trigger: selects find stores
- **Content regions:**
  - **category filter**
    - Row fields: `category name · product count`
    - Row fields: `category name · product count`
    - Actions: `select category`
  - **product grid**
    - Row fields: `product name · category · thumbnail`
    - Row fields: `product name · category · thumbnail`
    - Actions: `select product`
- **In-scope user stories:** *(none directly — browse enables View Product Details transition)*
- **Groups system stories:** *(none)*
- **Domain terms (visible only):** product catalog · category · product

#### product detail page

- **Description:** Single-product detail with images, description, and per-store stock availability.
- **Source:** [product](../domain/ubiquitous-language.md) · [stock availability](../domain/ubiquitous-language.md)
- **Layout:** `stack` — single-column product detail

```
[ product detail page ]
┌─────────────────────────────────────────────┐
│ header · primary navigation · breadcrumb    │
├─────────────────────────────────────────────┤
│ product header (name · category)            │
│ image gallery (product image thumbnails)    │
│ description · weight · dimensions           │
│ stock availability by store                 │
├─────────────────────────────────────────────┤
│ footer                                      │
└─────────────────────────────────────────────┘
```

- **Chrome (shared regions — named only):**
  - header, primary navigation, footer, breadcrumb
- **From (incoming transitions):**
  - from product catalog — trigger: selects product
- **To (outgoing transitions):**
  - to product catalog — trigger: selects back to catalog
  - to store locator — map view — trigger: selects store link from stock row
- **Content regions:**
  - **product header**
    - Row fields: `product name · category`
    - Actions: *(read-only in Increment 1)*
  - **image gallery**
    - Row fields: `product image · alt text · display order`
    - Row fields: `product image · alt text · display order`
    - Actions: `previous image · next image · select thumbnail`
  - **description**
    - Row fields: `description · weight · dimensions`
    - Actions: *(read-only)*
  - **stock availability by store**
    - Row fields: `store name · stock availability · distance`
    - Row fields: `store name · stock availability · distance`
    - Actions: `select store link`
- **In-scope user stories (~1):**
  - View Product Details — maps to: product header · image gallery · description / selects product
- **Groups system stories:**
  - Display Real-Time Stock Availability — surfaces in stock availability by store on page load
- **Domain terms (visible only):** product · product image · category · stock availability · store

#### admin dashboard — stock levels

- **Description:** Bare-bones staff form for manual per-store stock updates (Increment 1 scope only).
- **Source:** [admin dashboard](../domain/ubiquitous-language.md)
- **Layout:** `form` — stacked inputs

```
[ admin dashboard — stock levels ]
┌─────────────────────────────────────────────┐
│ staff header                                │
├─────────────────────────────────────────────┤
│ store selector · product selector           │
│ stock quantity · validation feedback        │
│ save · cancel                               │
└─────────────────────────────────────────────┘
```

- **Chrome (shared regions — named only):**
  - staff header
- **From (incoming transitions):**
  - *(direct staff URL / bookmark — no customer path in Increment 1)*
- **To (outgoing transitions):**
  - *(remains on form after save — confirmation state on same screen)*
- **Content regions:**
  - **stock levels form**
    - Row fields: `store · product · stock quantity · validation feedback`
    - Actions: `save · cancel`
- **In-scope user stories (~1):**
  - Update Product Stock Levels — maps to: stock levels form / submits stock update
- **Groups system stories:** *(none)*
- **Domain terms (visible only):** store · product · stock availability

---

### Navigational components

#### Primary header navigation (header)

- **Appears on:** store locator — map view · store locator — list view · product catalog · product detail page
- **Links to:** find stores (store locator — map view) · shop supplies (product catalog)
- **Notes:** Persistent top-level paths for the two Increment 1 customer journeys; no cart, account, or login links.

#### Store locator tab bar (tab bar)

- **Appears on:** store locator — map view · store locator — list view
- **Links to:** map view · list view
- **Notes:** Tab siblings are separate screens; inactive tab greyed on each sibling.

#### Category filter (sidebar)

- **Appears on:** product catalog
- **Links to:** product grid (filtered by category)
- **Notes:** Category-only browse — no keyword search in Increment 1.

#### Breadcrumb (breadcrumb)

- **Appears on:** product detail page
- **Links to:** product catalog · product name (current)
- **Notes:** Back navigation to catalog without relying on browser back.

#### Staff header (header)

- **Appears on:** admin dashboard — stock levels
- **Links to:** stock levels form (current)
- **Notes:** Minimal staff chrome; full admin dashboard deferred to later increments.

---

## Content types (shared across screens)

#### store

- **Source:** [store](../domain/ubiquitous-language.md)
- **Used on:** store locator — map view · store locator — list view · product detail page · admin dashboard — stock levels
- **Hierarchy / collections:** store locator collection of all stores
- **Key actions:** select store point · select store row · view operating hours · view contact details

#### product

- **Source:** [product](../domain/ubiquitous-language.md)
- **Used on:** product catalog · product detail page · admin dashboard — stock levels
- **Hierarchy / collections:** product catalog · category groupings
- **Key actions:** select product · browse images · view description

#### stock availability

- **Source:** [stock availability](../domain/ubiquitous-language.md)
- **Used on:** product detail page · admin dashboard — stock levels
- **Hierarchy / collections:** per product per store
- **Key actions:** view availability · update stock quantity (staff)

#### category

- **Source:** [category](../domain/ubiquitous-language.md)
- **Used on:** product catalog · product detail page
- **Hierarchy / collections:** product catalog filter facets
- **Key actions:** select category · view on product detail page

---

## Change log

| Date | Direction | Summary |
| --- | --- | --- |
| 2026-05-24 | initial | First draft for Increment 1 walk-in driver. |
