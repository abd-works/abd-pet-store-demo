# Ubiquitous Language


---

## power-ups-ubiquitous-language

<!-- migrated from: increments/9-power-ups/exploration/domain/ubiquitous-language.md -->

---
state: ubiquitous-language
---

# Module: [Power-ups]

_Concept sketch for the discovery, personalization, and admin polish layer — keyword search and faceted filtering for products, preferred-store personalization for browsing and checkout, customer pet profiles, and a polished inventory dashboard with stock alerts and export for store staff._

Scope: How customers discover products through keyword search and faceted filtering, how a preferred-store preference personalizes browsing and checkout, how customers register their own pets, and how store staff manage inventory through a dashboard with stock alerts and backorder support. Increment 9 of PawPlace.

**Terms**:
- **Product Search**
  - **product search** — a keyword-based discovery mechanism that matches products by name, description, category, or brand and ranks results by relevance
  - **search results** — the ranked list of products produced by a product search, with empty-state guidance when no products match
  - **filter facet** — a named dimension (category, pet type, brand, price range, stock availability) that narrows the product list and shows match counts per value
  - **active filter** — a currently applied filter selection displayed as a removable tag whose removal expands the result set
- **My Store**
  - **my store** — the customer's declared preferred store, saved to their customer account and persisted across sessions and devices
  - **tailored experience** — the set of behaviors that adapt browsing and checkout when a preferred store is set
  - **store specialization filter** — filtering stores on the store locator by their declared area of expertise
  - **product availability filter** — filtering stores on the store locator to show only those with a specific product in stock
- **Inventory Dashboard**
  - **inventory dashboard** — the admin interface listing all products at a store with current stock levels, supporting search, sort, filter, and inline editing
  - **low stock alert** — a visual badge shown on a product row when its stock level falls below the configurable threshold
  - **low stock threshold** — the configurable stock level below which a low stock alert is triggered for a product
  - **stock level** — the numeric quantity of a product at a store, viewed and edited on the inventory dashboard
  - **inventory export** — a CSV download of stock data scoped to the staff member's store
  - **backorder purchase** — the ability for a customer to purchase a product that is currently out of stock, with a backorder expectation

---

_A customer discovers *products* through *product search* by entering a keyword, receiving *search results* ranked by relevance; *filter facets* narrow those results by *category*, pet type, brand, price range, and *stock availability*, each facet displaying match counts that update as *active filters* are combined. The *store locator* gains *store specialization filter* and *product availability filter* dimensions so customers can find the right *store*. A *customer account* can declare a *store* as *my store*, activating the *tailored experience* — *stock availability* defaults to the preferred *store*, the *store locator* highlights it, and *click-and-collect* checkout pre-selects it. Logged-in customers manage *customer pet profiles* for their own pets, providing data that feeds downstream personalization. On the admin side, *store staff* use the *inventory dashboard* to view, search, sort, filter, and edit *stock levels* at their *store*, with *low stock alerts* flagging *products* below the configurable *low stock threshold* and *inventory export* producing a per-store CSV. *Backorder purchase* relaxes the out-of-stock gate so customers can buy *products* that are temporarily unavailable._

---

# Core Domain

## Product Search

*Product Search* is the keyword-based discovery mechanism that lets customers find *products* by name, description, *category*, or brand, producing *search results* ranked by relevance. It works alongside *filter facets* that narrow the result set by *category*, pet type, brand, price range, and *stock availability*, each facet showing match counts that update as filters are combined. *Product Search* depends on *product catalog* for the searchable corpus, on *product* for the entities being matched, and on *category* and *stock availability* as filter dimensions.

### product search

- accepts a keyword and matches it against *product* name, description, *category*, and brand, producing *search results* ranked by relevance
- supports partial and fuzzy matching so that incomplete keywords (e.g. "kitt" for "kitten food") still return relevant *products*
- is accessible globally from any page — the search bar appears in the site header regardless of the customer's current context
- returns a "no results found" message with suggestions (popular *categories*, alternative keywords) when the keyword matches no *products*
- **Invariant:** must always be accessible from every page; must never return results outside the *product catalog*'s published set

### search results

- is the ranked list of *products* produced by a *product search*, ordered by relevance (closest match first)
- respects *active filters* — when *filter facets* are applied, *search results* narrow to the intersection of the keyword match and all active filter selections
- displays a "no results found" message with suggestions when no *products* match the keyword
- updates immediately when the customer applies or removes an *active filter*

### filter facet

- is a named dimension — *category*, pet type, brand, price range, and *stock availability* — that narrows the *product* list when browsing the *product catalog* or viewing *search results*
- shows the count of matching *products* per value within the facet, giving the customer visibility into how many results each selection would produce
- combines conjunctively with other *filter facets* — selecting multiple facets narrows the *product* list to the intersection of all *active filters*
- updates its match counts to reflect the combined state of all *active filters*, so counts remain accurate as the customer adds or removes selections
- displays a "no products match your filters" message with a "clear all filters" action when the combined *active filters* produce zero results
- **Invariant:** facet counts must always reflect the current combined filter state; must never show stale counts after a filter change

### active filter

- is a currently applied *filter facet* selection displayed as a removable chip or tag in the filter area
- expands the *product* list when removed, restoring *products* that were previously excluded by that filter
- triggers a "clear all filters" action when all *active filters* together produce zero *search results*

### product *(boundary)*

- is the entity matched, ranked, and filtered by *product search* and *filter facets*

### category *(boundary)*

- is one of the *filter facet* dimensions used to narrow *products* by product type or pet type

### stock availability *(boundary)*

- is one of the *filter facet* dimensions used to narrow *products* to only those currently in stock

### product catalog *(boundary)*

- is the searchable corpus that *product search* queries and that *filter facets* operate over

#### Decisions made

- *Product Search* is its own KA for this increment because keyword-based discovery with relevance ranking is new behavior distinct from browsing-by-category, which existed in prior increments (independence test).
- *Search results* earns its own heading because it has independent behavior (relevance ranking, empty-state guidance, real-time update on filter change) — it is not merely an output of *product search* but a live, interactive artifact.
- *Filter facet* earns its own heading because it has an invariant (count accuracy after filter change), independent behavior (conjunctive combination, zero-results action), and cross-concept interaction with both *search results* and *product*.
- *Active filter* earns its own heading because it has its own behavior (removal expands results, triggers "clear all") — it is not merely a flag on a *filter facet*.
- Price range is a *filter facet* dimension that uses a min-max range rather than discrete selections, but follows the same narrowing and count-update behavior as other facets — not its own concept (typing call: value type of *filter facet*).
- Pet type and brand are *filter facet* dimension instances — they follow the same behavior as *category* and do not earn separate headings (typing call: instance).
- Search bar is the UI entry point for *product search* — it has no independent domain behavior beyond accepting a keyword, so it is not modeled as a concept. Its global accessibility is described on *product search*.
- *Product*, *category*, *stock availability*, and *product catalog* are boundary — they are owned by Product Catalog; this scope depends on them for matching and filtering (scope-fit test).

#### References

**Ref — Product search and filtering**
Source: context/requirements-chat-with-product-owner.md
Locator: line 3
Extract: partial

**Ref — Search stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Search Products by Keyword, Filter Products
Extract: acceptance criteria

---

## My Store

*My Store* is the customer's declared preferred *store*, persisted on the *customer account* across sessions and devices, that activates a *tailored experience*: *stock availability* defaults to the preferred *store*, the *store locator* highlights it, and *click-and-collect* checkout pre-selects it. Alongside the preference, the *store locator* gains *store specialization filter* and *product availability filter* dimensions so customers can discover the right *store* before setting it. *My Store* depends on *customer account* for persistence, on *store* for the entity being preferred, on *store locator* for filtering and highlighting, and on *click-and-collect* for checkout pre-selection.

### my store

- is a single *store* saved as the customer's preference on their *customer account*, persisting across sessions and devices
- replaces the previous preference when the customer changes their selection — only one *my store* exists per *customer account* at any time, producing an immediate switch of the *tailored experience* to the new *store*
- requires a logged-in *customer account* — guest sessions cannot set *my store* and are prompted to log in or register without navigating away from the current page
- can be set from a store detail page or from account settings
- **Invariant:** only one *my store* per *customer account* at any time; setting a new one replaces the old one immediately
- **Invariant:** when no *my store* is set, no store-specific tailoring is applied — default behavior from previous increments persists

### tailored experience

- is the set of behaviors activated when a *customer account* has a *my store* set
- defaults *stock availability* on *product* pages to the preferred *store*, so the customer sees availability at their local *store* without manual selection
- highlights the preferred *store* in the *store locator*
- pre-selects the preferred *store* in the *click-and-collect* checkout flow, while keeping the full *store* list available for override
- applies no tailoring when no *my store* is set — previous-increment default behavior is preserved

### store specialization filter

- is a filter dimension on the *store locator* that narrows the *store* list to only *stores* with a declared *store specialization* (e.g. reptile section, premium dog food)
- shows only *stores* whose *store specialization* matches the customer's selection
- combines with *product availability filter* — when both are active, only *stores* matching both criteria are shown
- displays a "no stores match your filters" message with a "clear filters" action when the combined filters produce zero results

### product availability filter

- is a filter dimension on the *store locator* that narrows the *store* list to only *stores* where a specific *product* is in stock
- shows only *stores* whose *stock availability* for the selected *product* indicates the item is available
- combines with *store specialization filter* for conjunctive narrowing

### store *(boundary)*

- is the physical location that can be set as *my store* and filtered by *store specialization filter* and *product availability filter*

### store locator *(boundary)*

- is the discovery surface where *store specialization filter* and *product availability filter* operate and where the *tailored experience* highlights the preferred *store*

### customer account *(boundary)*

- stores the *my store* preference and provides the login identity that gates preference-setting

### click-and-collect *(boundary)*

- provides the checkout store-selection step that the *tailored experience* pre-selects with the preferred *store*

### store specialization *(boundary)*

- is a property of *store* — the declared area of expertise (e.g. reptile section, premium dog food) used as a filter dimension by *store specialization filter*

#### Decisions made

- *My Store* is its own KA for this increment because the preference, the tailoring behaviors it activates, and the store filtering dimensions form a coherent cluster with independent invariants and behavior — distinct from the general Store KA which owns identity and operations (independence test).
- *Tailored experience* earns its own heading because it describes three distinct behaviors (stock defaults, locator highlighting, checkout pre-selection) activated by a single trigger (*my store* being set), and has its own no-store-set invariant — it is not merely a side effect of setting *my store*.
- *Store specialization filter* and *product availability filter* earn separate headings because each has independent filtering logic — one operates on a *store* attribute, the other on per-product stock state — though both combine conjunctively on the *store locator*.
- *Store specialization* is a property of *store* — it has no independent behavior outside the filtering dimension it provides to this scope; included as a boundary stub because *store specialization filter* references it (typing call: property).
- *Store*, *store locator*, *customer account*, and *click-and-collect* are boundary — each is owned by another module; this scope depends on them for filtering, persistence, highlighting, and checkout pre-selection (scope-fit test).

#### References

**Ref — Store personalization**
Source: context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: partial

**Ref — Store experience stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Filter Stores by Availability and Specialization, Set My Store Preference, Tailor Experience to Preferred Store
Extract: acceptance criteria

---

## Inventory Dashboard

*Inventory Dashboard* is the admin-facing stock oversight interface that replaces the bare-bones stock editing form from Increment 1, giving *store staff* a consolidated view of all *products* at their *store* with current *stock levels*, search, sort, and filter capabilities. It surfaces *low stock alerts* when a *product*'s *stock level* falls below a configurable *low stock threshold*, supports inline *stock level* editing with immediate persist, and provides *inventory export* for offline analysis. The increment also introduces *backorder purchase*, relaxing the out-of-stock purchase gate. *Inventory Dashboard* depends on *store staff* for the actor identity, on *product* and *stock availability* for the data being managed, and on *store* for location scoping.

### inventory dashboard

- lists all *products* at the *store staff* member's *store* with current *stock levels*, replacing the bare-bones stock editing form from Increment 1
- supports search, sort (by name, *stock level*, *category*), and filter for navigating the product list
- surfaces a *low stock alert* badge on any *product* row whose *stock level* falls below the configured *low stock threshold*
- provides a "low stock only" filter to isolate *products* that need replenishment
- allows inline editing of *stock levels* with immediate persist and real-time customer-facing *stock availability* update — same behavior as Update Product Stock Levels from Increment 1
- preserves all existing stock data during the transition from the prior stock editing form — no data migration loss
- **Invariant:** stock edits must persist immediately and reflect in customer-facing *stock availability*; transition from the prior form must not lose data

### low stock alert

- is a visual badge shown on a *product* row in the *inventory dashboard* when the *product*'s *stock level* falls below the *low stock threshold*
- drives the "low stock only" filter on the *inventory dashboard* so *store staff* can quickly find *products* needing replenishment
- **Invariant:** must appear on every *product* whose *stock level* is below the *low stock threshold*; must disappear when the *stock level* is raised above the threshold

### low stock threshold

- is a configurable *stock level* value below which a *low stock alert* is triggered for a *product*
- determines the boundary between "adequately stocked" and "needs attention" for *store staff*

### stock level

- is the numeric quantity of a *product* at a *store*, viewed and edited on the *inventory dashboard*
- determines the *stock availability* state — a zero *stock level* means the *product* is out of stock for customers
- triggers a *low stock alert* when it falls below the *low stock threshold*
- is edited inline on the *inventory dashboard* with immediate persist
- **Invariant:** must always be a non-negative value; edits must propagate to customer-facing *stock availability* in real time

### inventory export

- produces a CSV download of stock data for the *store staff* member's *store* only
- includes *product* name, *category*, current *stock level*, and last updated timestamp per row
- is scoped to the single *store* — multi-store export is not supported in this increment

### backorder purchase

- allows a customer to purchase a *product* that is currently out of stock, relaxing the previous gate where *stock availability* prevented checkout of unavailable items
- signals to the customer that the *product* is backordered and will ship when restocked

### store staff *(boundary)*

- is the admin actor who uses the *inventory dashboard* to manage *stock levels* at their *store*

### product *(boundary)*

- is the entity whose *stock levels* are viewed, edited, and alerted on in the *inventory dashboard*

### stock availability *(boundary)*

- is the real-time availability state of a *product* that the *inventory dashboard* reflects and that *backorder purchase* relaxes the purchase gate for

### store *(boundary)*

- scopes the *inventory dashboard* and *inventory export* to a single physical location

### category *(boundary)*

- is a sort and filter dimension on the *inventory dashboard* and a column in the *inventory export*

#### Decisions made

- *Inventory Dashboard* is its own KA for this increment because it introduces a substantive admin interface with its own behavior (search, sort, filter, inline editing, export, alerting) and replaces the prior Increment 1 stock form — it is not merely a view of *product catalog* (independence test).
- *Low stock alert* earns its own heading because it has an invariant (must appear/disappear relative to threshold), drives a dedicated filter dimension on the dashboard, and has cross-concept interaction with *low stock threshold* and *stock level*.
- *Low stock threshold* earns its own heading because it is configurable and determines the boundary between "adequately stocked" and "needs attention" — it is not merely a number on a product (typing call: concept, not property).
- *Stock level* earns its own heading because it has its own invariant (non-negative, real-time propagation), is directly edited, and has cross-concept interactions with *low stock alert*, *low stock threshold*, and *stock availability* — it is not merely a field on *product*.
- *Inventory export* earns its own heading because it has scope constraints (single store, specific columns) and its own output format — it is not merely a button on the dashboard.
- *Backorder purchase* earns its own heading because it introduces a behavioral change to the checkout flow, relaxing the *stock availability* gate. Source evidence is limited — the story has no acceptance criteria in the story graph; the concept is modeled from the story name and existing domain knowledge that *stock availability* "gates the order flow, preventing checkout of backordered items."
- Display Low Stock Badge story has no acceptance criteria in the story graph but is functionally described in the View Inventory Dashboard AC #2 — the *low stock alert* badge behavior is sourced from there.
- *Store staff*, *product*, *stock availability*, *store*, and *category* are boundary — they are owned by their respective modules; this scope depends on them for actor identity, data, and location scoping (scope-fit test).

#### References

**Ref — Inventory management**
Source: context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

**Ref — Inventory stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: View Inventory Dashboard, Display Low Stock Badge, Allow Backorder Purchase
Extract: acceptance criteria (View Inventory Dashboard only; Display Low Stock Badge and Allow Backorder Purchase have empty AC in the story graph)

---

# Boundary Domain

## product

Owned by: Product Catalog

- is the entity that *product search* matches by keyword, *filter facets* narrow by dimension, the *inventory dashboard* displays with *stock levels*, and *backorder purchase* allows purchasing when out of stock

#### Decisions made

- *Product* is owned by Product Catalog — this scope depends on it for search matching, filter narrowing, stock management, and backorder gating (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA
Extract: partial

---

## product catalog

Owned by: Product Catalog

- is the searchable, filterable collection that *product search* queries by keyword and that *filter facets* operate over to narrow the *product* list

#### Decisions made

- *Product catalog* is owned by Product Catalog — this scope depends on it as the corpus being searched and filtered (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA
Extract: partial

---

## category

Owned by: Product Catalog

- is one of the *filter facet* dimensions for narrowing *products* by product type or pet type, and a sort and filter dimension on the *inventory dashboard*

#### Decisions made

- *Category* is owned by Product Catalog — this scope depends on it as a filter dimension on both the customer-facing catalog and the admin *inventory dashboard* (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA, category concept
Extract: partial

---

## stock availability

Owned by: Product Catalog

- is the real-time availability state of a *product*, used as a *filter facet* dimension in *product search*, displayed in the *inventory dashboard*, defaulted to the preferred *store* by the *tailored experience*, and whose purchase-blocking gate is relaxed by *backorder purchase*

#### Decisions made

- *Stock availability* is owned by Product Catalog — this scope depends on it as a filter dimension, a dashboard display value, a tailoring default, and the gate that *backorder purchase* modifies (scope-fit test).

#### References

**Ref — Product Catalog**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Product Catalog KA, stock availability concept
Extract: partial

---

## store

Owned by: Store

- is the physical location that can be set as *my store*, filtered by *store specialization filter* and *product availability filter*, and scopes the *inventory dashboard* and *inventory export* to a single location

#### Decisions made

- *Store* is owned by the Store module — this scope depends on it for personalization targeting, store filtering, and inventory scoping (scope-fit test).

#### References

**Ref — Store**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Store KA
Extract: partial

---

## store locator

Owned by: Store

- is the discovery surface where *store specialization filter* and *product availability filter* operate and where the *tailored experience* highlights the preferred *store*

#### Decisions made

- *Store locator* is owned by the Store module — this scope depends on it as the surface for store filtering and my-store highlighting (scope-fit test).

#### References

**Ref — Store**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Store KA, store locator concept
Extract: partial

---

## store specialization

Owned by: Store

- is a property of *store* — the declared area of expertise (e.g. reptile section, premium dog food) used as a filter dimension by *store specialization filter*

#### Decisions made

- *Store specialization* is a property of *store* — it has no independent behavior outside the filtering dimension it provides; included as boundary because *store specialization filter* references it (scope-fit test; typing call: property).

#### References

**Ref — Store**
Source: context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: partial

---

## customer account

Owned by: Customer Account

- stores the *my store* preference, owns *customer pet profiles*, and provides the login identity that gates preference-setting and pet profile creation

#### Decisions made

- *Customer account* is owned by Customer Account module — this scope depends on it for preference storage, pet profile ownership, and login gating (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Customer Account KA
Extract: partial

---

## customer pet profile

Owned by: Customer Account

- records the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)
- is owned by a logged-in *customer account* — guest sessions are prompted to log in before creating a profile
- supports multiple profiles per *customer account*, each listed under "My Pets"
- feeds downstream personalized recommendation algorithms with species, breed, and age data

#### Decisions made

- *Customer pet profile* is owned by Customer Account — the Create Customer Pet story in this increment adds CRUD behavior to an existing Customer Account concept; this scope depends on it for pet data but does not own the concept (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Customer Account KA, pet profile concept
Extract: partial

**Ref — Pet profile stories**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: Create Customer Pet
Extract: acceptance criteria

---

## click-and-collect

Owned by: Store

- provides the checkout store-selection step that the *tailored experience* pre-selects with the preferred *store*

#### Decisions made

- *Click-and-collect* is owned by the Store module — this scope depends on it only for the checkout pre-selection behavior driven by *my store* (scope-fit test).

#### References

**Ref — Store**
Source: docs/end-to-end/shaping/domain-sketch.md
Locator: Store KA, click-and-collect concept
Extract: partial

---

## store staff

Owned by: Store Operations

- is the admin actor who uses the *inventory dashboard* to manage *stock levels* at their *store*

#### Decisions made

- *Store staff* is owned by Store Operations — this scope depends on the role for dashboard access but does not own staff permissions or admin workflow (scope-fit test).

#### References

**Ref — Admin dashboard**
Source: context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

---
