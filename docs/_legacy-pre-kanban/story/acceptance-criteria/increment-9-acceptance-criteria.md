# Acceptance criteria — Increment 9: Power-ups — search, personalization, admin polish

**Increment outcome:** Keyword *product search* with *filter facets* lifts conversion on a deep catalog; *my store* personalization and *customer pet profiles* tighten loyalty; the *inventory dashboard* replaces the bare-bones stock form from Increment 1 and surfaces *low stock alerts* for proactive replenishment. *Backorder purchase* relaxes the out-of-stock gate. Polish layer over a fully-functional product.

**Builds on:** Increments 1–8 (complete product live: e-commerce, accounts, payments, pets, returns, marketing, content).

---

## Story: `Search Products by Keyword`

**Story type:** user

### Domain terms

- *Product Search* — keyword-based discovery mechanism that matches products by name, description, category, or brand and ranks results by relevance
- *Search Results* — the ranked list of products produced by a *product search*, with empty-state guidance when no products match
- *Search Bar* — the globally accessible UI input for entering search keywords (appears in the site header on every page)
- *Product Catalog* — the searchable corpus that *product search* queries (boundary — Product Catalog)
- *Product* — the entity matched and ranked by *product search* (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the customer enters a keyword in the *Search Bar* and submits
   **THEN** the *Search Results* show *products* whose name, description, *category*, or brand match the keyword
   **AND** results are ranked by relevance (closest match first)
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "We want good filtering and search"; power-ups-ubiquitous-language.md — *product search*: "matches products by name, description, category, or brand"

2. **WHEN** the keyword matches no *products*
   **THEN** the *Search Results* show a "no results found" message with suggestions (popular *categories*, alternative keywords)
   **BUT** no empty, unlabelled result set is shown
   **Evidence:** power-ups-ubiquitous-language.md — *search results*: "displays a 'no results found' message with suggestions when no products match"

3. **WHEN** the customer enters a partial keyword (e.g. "kitt" for "kitten food")
   **THEN** the *Search Results* return relevant matches via partial or fuzzy matching
   **Evidence:** power-ups-ubiquitous-language.md — *product search*: "supports partial and fuzzy matching so that incomplete keywords still return relevant products"

4. **WHEN** the customer initiates a *product search* from any page (product detail, store locator, blog)
   **THEN** the *Search Bar* is accessible globally in the site header
   **AND** submitting navigates to the *search results* page
   **Evidence:** power-ups-ubiquitous-language.md — *product search* invariant: "must always be accessible from every page"

5. **WHEN** the customer applies *filter facets* to the *search results* (see *Filter Products*)
   **THEN** the *search results* narrow to the intersection of keyword match and all *active filters*
   **AND** results update immediately
   **Evidence:** power-ups-ubiquitous-language.md — *search results*: "respects active filters … narrows to the intersection of the keyword match and all active filter selections"

---

## Story: `Filter Products`

**Story type:** user

### Domain terms

- *Filter Facet* — a named dimension (category, pet type, brand, price range, *stock availability*) that narrows the *product* list and shows match counts per value
- *Active Filter* — a currently applied *filter facet* selection displayed as a removable tag whose removal expands the result set
- *Product Catalog* — the browsable corpus that *filter facets* operate over (boundary — Product Catalog)
- *Search Results* — the keyword-match list that *filter facets* also narrow (see *Search Products by Keyword*)
- *Stock Availability* — a *filter facet* dimension showing only *products* currently in stock (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the customer is browsing the *Product Catalog* or viewing *Search Results*
   **THEN** *filter facets* are available: *category*, pet type, brand, price range, and *stock availability*
   **AND** each *filter facet* shows the count of matching *products* per value
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search"; power-ups-ubiquitous-language.md — *filter facet*: "shows the count of matching products per value"

2. **WHEN** the customer selects a *filter facet* value
   **THEN** the *product* list updates immediately to show only matching *products*
   **AND** the selection appears as a removable *active filter* chip
   **Evidence:** power-ups-ubiquitous-language.md — *active filter*: "a currently applied filter facet selection displayed as a removable chip or tag"

3. **WHEN** the customer combines multiple *filter facets* (e.g. pet type = "dog" AND *category* = "food")
   **THEN** the results narrow to the intersection of all *active filters*
   **AND** *filter facet* counts update to reflect the combined state of all *active filters*
   **Evidence:** power-ups-ubiquitous-language.md — *filter facet*: "combines conjunctively with other filter facets"; *filter facet* invariant: "facet counts must always reflect the current combined filter state"

4. **WHEN** the customer removes an *active filter*
   **THEN** the *product* list expands to include *products* that were previously excluded by that filter
   **AND** remaining *filter facet* counts recalculate
   **Evidence:** power-ups-ubiquitous-language.md — *active filter*: "expands the product list when removed"

5. **WHEN** all *active filters* together produce zero results
   **THEN** the *product* list shows a "no products match your filters" message with a "clear all filters" action
   **BUT** no stale counts from the previous filter state are shown
   **Evidence:** power-ups-ubiquitous-language.md — *filter facet*: "displays a 'no products match your filters' message with a 'clear all filters' action when the combined active filters produce zero results"; invariant: "must never show stale counts after a filter change"

6. **WHEN** the customer selects a price range *filter facet*
   **THEN** the filter uses a min-max range (not discrete selections)
   **AND** the same narrowing and count-update behavior as other *filter facets* applies
   **Evidence:** power-ups-ubiquitous-language.md — Decisions: "Price range is a filter facet dimension that uses a min-max range rather than discrete selections"

---

## Story: `Filter Stores by Availability and Specialization`

**Story type:** user

### Domain terms

- *Store Specialization Filter* — a filter dimension on the *store locator* that narrows the *store* list to only stores with a declared *store specialization*
- *Product Availability Filter* — a filter dimension on the *store locator* that narrows the *store* list to only stores where a specific *product* is in stock
- *Store Locator* — the discovery surface where both filter dimensions operate (boundary — Store)
- *Store* — the physical location filtered by specialization and availability (boundary — Store)
- *Store Specialization* — a store's declared area of expertise, e.g. reptile section, premium dog food (boundary — Store)
- *Stock Availability* — the per-product, per-store availability state used by *product availability filter* (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** the customer is browsing the *Store Locator*
   **THEN** filter dimensions are available for *store specialization filter* and *product availability filter*
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location. Some stores might specialise"

2. **WHEN** the customer filters by *store specialization* (e.g. "reptile section")
   **THEN** only *stores* with that declared *store specialization* are shown
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "one might have a great reptile section"; power-ups-ubiquitous-language.md — *store specialization filter*: "shows only stores whose store specialization matches the customer's selection"

3. **WHEN** the customer filters by *product availability filter* for a specific *product*
   **THEN** only *stores* where that *product* is in stock are shown
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location"; power-ups-ubiquitous-language.md — *product availability filter*: "shows only stores whose stock availability for the selected product indicates the item is available"

4. **WHEN** both *store specialization filter* and *product availability filter* are active
   **THEN** only *stores* matching both criteria are shown (conjunctive narrowing)
   **Evidence:** power-ups-ubiquitous-language.md — *store specialization filter*: "combines with product availability filter — when both are active, only stores matching both criteria are shown"

5. **WHEN** no *stores* match the combined filters
   **THEN** a "no stores match your filters" message is shown with a "clear filters" action
   **Evidence:** power-ups-ubiquitous-language.md — *store specialization filter*: "displays a 'no stores match your filters' message with a 'clear filters' action when the combined filters produce zero results"

---

## Story: `Set My Store Preference`

**Story type:** user

### Domain terms

- *My Store* — the customer's declared preferred *store*, saved to their *customer account* and persisted across sessions and devices
- *Customer Account* — stores the *my store* preference and provides the login identity that gates preference-setting (boundary — Customer Account)
- *Store* — the physical location that can be set as *my store* (boundary — Store)
- *Tailored Experience* — the set of behaviors activated when *my store* is set (see *Tailor Experience to Preferred Store*)

### Acceptance criteria

1. **WHEN** a logged-in customer selects "Set as My Store" on a store detail page or from account settings
   **THEN** the selected *store* is saved as the customer's *my store*
   **AND** the preference persists across sessions and devices
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Maybe even the ability to set 'my store' as a preference and tailor the experience"; power-ups-ubiquitous-language.md — *my store*: "persisting across sessions and devices"

2. **WHEN** the customer changes their *my store* to a different *store*
   **THEN** the previous preference is replaced immediately
   **AND** the *tailored experience* reflects the new *store* without delay
   **Evidence:** power-ups-ubiquitous-language.md — *my store* invariant: "only one my store per customer account at any time; setting a new one replaces the old one immediately"

3. **WHEN** no *my store* is currently set
   **THEN** the customer can set one from a store detail page or account settings
   **BUT** no store-specific tailoring is applied — default behavior from previous increments persists
   **Evidence:** power-ups-ubiquitous-language.md — *my store* invariant: "when no my store is set, no store-specific tailoring is applied"

4. **WHEN** a guest customer (not logged in) tries to set *my store*
   **THEN** a prompt to log in or register is shown
   **BUT** the current page is not navigated away from
   **Evidence:** power-ups-ubiquitous-language.md — *my store*: "requires a logged-in customer account — guest sessions cannot set my store and are prompted to log in or register without navigating away"

---

## Story: `Tailor Experience to Preferred Store`

**Story type:** system

### Domain terms

- *Tailored Experience* — the set of behaviors activated when a *customer account* has a *my store* set
- *My Store* — the customer's preferred *store* (see *Set My Store Preference*)
- *Stock Availability* — defaults to the preferred *store* on product pages when *my store* is set (boundary — Product Catalog)
- *Store Locator* — highlights the preferred *store* when *my store* is set (boundary — Store)
- *Click-and-Collect* — checkout store-selection step that the *tailored experience* pre-selects (boundary — Store)

### Acceptance criteria

1. **WHEN** the customer has a *my store* set and views a product page
   **THEN** *stock availability* on the product page defaults to the preferred *store*
   **AND** the customer sees availability at their local *store* without manual selection
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "tailor the experience"; power-ups-ubiquitous-language.md — *tailored experience*: "defaults stock availability on product pages to the preferred store"

2. **WHEN** the customer has a *my store* set and opens the *store locator*
   **THEN** the preferred *store* is visually highlighted
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "highlights the preferred store in the store locator"

3. **WHEN** the customer has a *my store* set and enters checkout with *click-and-collect*
   **THEN** the preferred *store* is pre-selected in the *click-and-collect* store-selection step
   **AND** the full *store* list remains available for override
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "pre-selects the preferred store in the click-and-collect checkout flow, while keeping the full store list available for override"

4. **WHEN** the customer has no *my store* set
   **THEN** no store-specific tailoring is applied
   **AND** previous-increment default behavior is preserved
   **Evidence:** power-ups-ubiquitous-language.md — *tailored experience*: "applies no tailoring when no my store is set — previous-increment default behavior is preserved"

---

## Story: `Create Customer Pet`

**Story type:** user

### Domain terms

- *Customer Pet Profile* — a record of the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)
- *Customer Account* — the owner of the *customer pet profile*; login identity gates profile creation (boundary — Customer Account)

### Acceptance criteria

1. **WHEN** a logged-in customer opens "My Pets" from account settings
   **THEN** a list of their *customer pet profiles* is displayed (or an empty state with "add your first pet")
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "pet profiles for their own pets"

2. **WHEN** the customer creates a new *customer pet profile*
   **THEN** the form collects: name, species, breed (optional), age or date of birth (optional), and photo (optional)
   **AND** the profile is saved to the *customer account*
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "basic pet profile — name, species, breed, age"; power-ups-ubiquitous-language.md — *customer pet profile*: "records the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)"

3. **WHEN** the customer has multiple pets
   **THEN** each pet has its own *customer pet profile* entry
   **AND** all are listed under "My Pets"
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "supports multiple profiles per customer account, each listed under 'My Pets'"

4. **WHEN** species and breed data is saved on a *customer pet profile*
   **THEN** the data feeds downstream personalised recommendation algorithms
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "feeds downstream personalized recommendation algorithms with species, breed, and age data"

5. **WHEN** a guest customer (not logged in) tries to create a *customer pet profile*
   **THEN** a prompt to log in or register is shown
   **BUT** the current page is not navigated away from
   **Evidence:** power-ups-ubiquitous-language.md — *customer pet profile*: "guest sessions are prompted to log in before creating a profile"

---

## Story: `View Inventory Dashboard`

**Story type:** store owner

### Domain terms

- *Inventory Dashboard* — the admin interface listing all *products* at a *store* with current *stock levels*, supporting search, sort, filter, and inline editing; replaces the bare-bones stock editing form from Increment 1
- *Store Staff* — the admin actor who uses the *inventory dashboard* to manage *stock levels* at their *store* (boundary — Store Operations)
- *Stock Level* — the numeric quantity of a *product* at a *store*, viewed and edited on the *inventory dashboard*
- *Low Stock Alert* — a visual badge shown on a product row when its *stock level* falls below the *low stock threshold*
- *Low Stock Threshold* — the configurable *stock level* below which a *low stock alert* is triggered
- *Inventory Export* — a CSV download of stock data scoped to the *store staff* member's *store*
- *Stock Availability* — the real-time availability state of a *product* that the *inventory dashboard* reflects (boundary — Product Catalog)
- *Product* — the entity whose *stock levels* are viewed, edited, and alerted on (boundary — Product Catalog)
- *Category* — a sort and filter dimension on the *inventory dashboard* (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** *store staff* opens the *inventory dashboard*
   **THEN** all *products* at their *store* are listed with current *stock levels*
   **AND** the dashboard supports search, sort (by name, *stock level*, *category*), and filter
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; power-ups-ubiquitous-language.md — *inventory dashboard*: "lists all products at a store with current stock levels … supporting search, sort, filter"

2. **WHEN** a *product's* *stock level* falls below the configured *low stock threshold*
   **THEN** a *low stock alert* badge is shown on that *product's* row
   **AND** a "low stock only" filter is available on the *inventory dashboard*
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "drives the 'low stock only' filter on the inventory dashboard"; invariant: "must appear on every product whose stock level is below the low stock threshold"

3. **WHEN** *store staff* edits a *stock level* from the *inventory dashboard*
   **THEN** the same behavior as Update Product Stock Levels (Increment 1) applies: immediate persist, real-time customer-facing *stock availability* update, validation
   **Evidence:** established in Increment 1 — Update Product Stock Levels AC; power-ups-ubiquitous-language.md — *stock level* invariant: "edits must propagate to customer-facing stock availability in real time"

4. **WHEN** *store staff* views the *inventory dashboard* for the first time after Increment 9 deployment
   **THEN** the *inventory dashboard* replaces the bare-bones stock editing form from Increment 1
   **AND** all existing stock data is intact — no data migration loss
   **Evidence:** power-ups-ubiquitous-language.md — *inventory dashboard*: "replaces the bare-bones stock editing form from Increment 1"; invariant: "transition from the prior form must not lose data"

5. **WHEN** *store staff* exports inventory data
   **THEN** the *inventory export* produces a CSV with *product* name, *category*, current *stock level*, and last updated timestamp
   **AND** the export covers the *store staff* member's *store* only
   **Evidence:** power-ups-ubiquitous-language.md — *inventory export*: "produces a CSV download … includes product name, category, current stock level, and last updated timestamp per row"; "is scoped to the single store"

6. **WHEN** *store staff* enters an invalid *stock level* (negative or non-numeric)
   **THEN** the *inventory dashboard* rejects the update with a clear error message
   **BUT** the previous *stock level* remains unchanged
   **Evidence:** power-ups-ubiquitous-language.md — *stock level* invariant: "must always be a non-negative value"

---

## Story: `Display Low Stock Badge`

**Story type:** system

### Domain terms

- *Low Stock Alert* — a visual badge shown on a *product* row when its *stock level* falls below the *low stock threshold*
- *Low Stock Threshold* — the configurable *stock level* below which a *low stock alert* is triggered for a *product*
- *Stock Level* — the numeric quantity of a *product* at a *store*; determines whether the alert fires
- *Stock Availability* — the real-time availability state that the badge reflects (boundary — Product Catalog)
- *Inventory Dashboard* — the admin surface where *low stock alert* badges appear and drive the "low stock only" filter

### Acceptance criteria

1. **WHEN** a *product's* *stock level* falls below its configured *low stock threshold* but remains greater than zero
   **THEN** a *low stock alert* badge is shown on the *product* row in the *inventory dashboard*
   **AND** the badge communicates urgency (e.g. "Low stock" or the current quantity)
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "a visual badge shown on a product row in the inventory dashboard when the product's stock level falls below the low stock threshold"

2. **WHEN** a *product's* *stock level* is at or above its *low stock threshold*
   **THEN** no *low stock alert* badge is shown on that *product's* row
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert* invariant: "must disappear when the stock level is raised above the threshold"

3. **WHEN** *store staff* raises a *product's* *stock level* above the *low stock threshold*
   **THEN** the *low stock alert* badge disappears on the next view
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert* invariant: "must appear on every product whose stock level is below the low stock threshold; must disappear when the stock level is raised above the threshold"

4. **WHEN** *store staff* activates the "low stock only" filter on the *inventory dashboard*
   **THEN** only *products* with *stock levels* below their *low stock threshold* are shown
   **AND** staff can quickly identify *products* needing replenishment
   **Evidence:** power-ups-ubiquitous-language.md — *low stock alert*: "drives the 'low stock only' filter on the inventory dashboard so store staff can quickly find products needing replenishment"

5. **WHEN** a *product's* *stock level* reaches zero
   **THEN** the *product* row shows an "out of stock" indicator
   **AND** the *low stock alert* badge is superseded by the out-of-stock state
   **Evidence:** power-ups-ubiquitous-language.md — *stock level*: "a zero stock level means the product is out of stock for customers"

---

## Story: `Allow Backorder Purchase`

**Story type:** system

### Domain terms

- *Backorder Purchase* — the ability for a customer to purchase a *product* that is currently out of stock, with a backorder expectation
- *Stock Availability* — the real-time availability state whose purchase-blocking gate is relaxed by *backorder purchase* (boundary — Product Catalog)
- *Product* — the entity purchased on backorder (boundary — Product Catalog)

### Acceptance criteria

1. **WHEN** a *product* is currently out of stock and *backorder purchase* is enabled for that *product*
   **THEN** the product page shows a "Backorder" indicator instead of "Out of Stock"
   **AND** the "Add to Cart" action is available
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase*: "allows a customer to purchase a product that is currently out of stock, relaxing the previous gate"

2. **WHEN** the customer adds a backordered *product* to the cart
   **THEN** the cart line item shows a backorder label
   **AND** the customer is informed that the *product* is backordered and will ship when restocked
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase*: "signals to the customer that the product is backordered and will ship when restocked"

3. **WHEN** the customer proceeds to checkout with a backordered *product*
   **THEN** the order summary shows the backorder status per affected line item
   **AND** the order is accepted and payment is processed normally
   **Evidence:** inferred — backorder relaxes the stock gate at checkout; order flow otherwise unchanged

4. **WHEN** a *product* is out of stock and *backorder purchase* is not enabled
   **THEN** the product shows "Out of Stock"
   **AND** the "Add to Cart" action is disabled (existing behavior from prior increments)
   **BUT** no backorder option is presented
   **Evidence:** power-ups-ubiquitous-language.md — *backorder purchase* relaxes "the previous gate where stock availability prevented checkout of unavailable items" — gate remains for non-backorder products

5. **WHEN** a previously backordered *product* is restocked (its *stock level* rises above zero)
   **THEN** the backorder indicator is replaced by normal *stock availability* ("In Stock")
   **AND** standard purchase flow resumes
   **Evidence:** inferred — backorder is a temporary state; restocking restores normal behavior
