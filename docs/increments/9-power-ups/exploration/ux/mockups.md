# Mockups

# Lo-Fi Wireframes — Increment 9: Power-ups

**Scope:** Product search with filter facets, store locator filtering, my store preference, customer pet profiles, inventory dashboard with low stock alerts and export, backorder purchase.

**Source IA:** N/A (no initial-ia.md for this increment — screens derived from UL and AC directly)
**UL:** `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md`
**AC:** `docs/end-to-end/exploration/stories/acceptance-criteria.md`

---

## Screen 1: Product Search Results

**Layout:** sidebar (filter panel left, results body right)
**State file:** `product-search-results-state.json`
**Drawio:** `product-search-results.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Site header with search bar | header | toolbar | AC Search-1: search bar accessible globally; AC Search-4: accessible from any page |
| Filter facets panel | panel | form | AC Filter-1: filter facets available (category, pet type, brand, price range, stock availability) |
| Facet match counts | panel | listbox | AC Filter-1: each facet shows the count of matching products |
| Active filters | body | toolbar (chips) | AC Filter-2: active filters shown as removable chips; AC Filter-4: removal expands list |
| Search results list | body | list | AC Search-1: results ranked by relevance; AC Filter-3: intersection of active filters |
| No results message (empty state) | body | chrome | AC Search-2: "no results found" with suggestions |

### In-scope stories

- Search Products by Keyword
- Filter Products

### Domain terms (verbatim)

- **product search** — a keyword-based discovery mechanism that matches products by name, description, category, or brand and ranks results by relevance
- **search results** — the ranked list of products produced by a product search, with empty-state guidance when no products match
- **filter facet** — a named dimension (category, pet type, brand, price range, stock availability) that narrows the product list and shows match counts per value
- **active filter** — a currently applied filter selection displayed as a removable tag whose removal expands the result set

### Acceptance criteria (verbatim)

**Search Products by Keyword:**

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

**Filter Products:**

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

## Screen 2: Store Locator with Filters

**Layout:** sidebar (filter panel left, store list body right)
**State file:** `store-locator-filters-state.json`
**Drawio:** `store-locator-filters.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Store filter panel | panel | form | AC StoreFilter-1: filter dimensions available for specialization and product availability |
| Store results list | body | list | AC StoreFilter-2,3: only matching stores shown |
| My store highlight | body | chrome | AC Tailor-2: preferred store visually highlighted |
| No stores message (empty state) | body | chrome + button-bar | AC StoreFilter-5: "no stores match" with clear action |

### In-scope stories

- Filter Stores by Availability and Specialization
- Set My Store Preference (partial — the "Set as My Store" button in results)
- Tailor Experience to Preferred Store (partial — highlight in locator)

### Domain terms (verbatim)

- **store specialization filter** — a filter dimension on the *store locator* that narrows the *store* list to only stores with a declared *store specialization*
- **product availability filter** — a filter dimension on the *store locator* that narrows the *store* list to only stores where a specific *product* is in stock
- **my store** — the customer's declared preferred store, saved to their customer account and persisted across sessions and devices
- **tailored experience** — the set of behaviors that adapt browsing and checkout when a preferred store is set

### Acceptance criteria (verbatim)

**Filter Stores by Availability and Specialization:**

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

## Screen 3: My Store Preferences

**Layout:** form (store detail) + form (account settings) + modal (guest prompt)
**State file:** `my-store-preferences-state.json`
**Drawio:** `my-store-preferences.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Store detail header | body | chrome | Context for "Set as My Store" action |
| Set My Store action | body | button-bar | AC MyStore-1: "Set as My Store" on store detail page |
| Current preference indicator | body | chrome | AC MyStore-3: when set, shows current preference |
| Account settings — preference form | body | form | AC MyStore-1: also settable from account settings |
| Guest login prompt | body (modal) | chrome + button-bar | AC MyStore-4: prompt to log in without navigating away |

### In-scope stories

- Set My Store Preference
- Tailor Experience to Preferred Store

### Domain terms (verbatim)

- **my store** — the customer's declared preferred store, saved to their customer account and persisted across sessions and devices
- **tailored experience** — the set of behaviors that adapt browsing and checkout when a preferred store is set

### Acceptance criteria (verbatim)

**Set My Store Preference:**

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

**Tailor Experience to Preferred Store:**

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

## Screen 4: Customer Pet Profiles (My Pets)

**Layout:** form (list) → form (create/edit) + modal (guest prompt)
**State file:** `customer-pet-profiles-state.json`
**Drawio:** `customer-pet-profiles.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| My Pets header | body | chrome | Context header |
| Pet profiles list | body | list | AC Pet-1: list of customer pet profiles; AC Pet-3: multiple pets listed |
| Empty state | body | chrome | AC Pet-1: empty state "add your first pet" |
| Pet profile form | body | form | AC Pet-2: form collects name, species, breed, age/DOB, photo |
| Guest login prompt | body (modal) | chrome + button-bar | AC Pet-5: prompt to log in without navigating away |

### In-scope stories

- Create Customer Pet

### Domain terms (verbatim)

- **customer pet profile** — a record of the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)

### Acceptance criteria (verbatim)

**Create Customer Pet:**

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

## Screen 5: Inventory Dashboard (Admin)

**Layout:** stack (full-width table with header toolbar)
**State file:** `inventory-dashboard-state.json`
**Drawio:** `inventory-dashboard.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Dashboard header with export | body | toolbar | AC Inv-5: export CSV; context for store scoping |
| Search and filter bar | body | filter-bar | AC Inv-1: supports search |
| Sort and filter controls | body | toolbar | AC Inv-1: sort by name, stock level, category; AC Inv-2: "low stock only" filter |
| Product stock table | body | list | AC Inv-1: all products listed with stock levels; AC Inv-2: low stock alert badge |
| Inline stock edit | body | form | AC Inv-3: inline editing with immediate persist |
| Validation error state | body | chrome | AC Inv-6: rejects invalid stock level with clear error |
| Low stock threshold config (modal) | body | form (modal) | UL: low stock threshold is configurable |

### In-scope stories

- View Inventory Dashboard
- Display Low Stock Badge

### Domain terms (verbatim)

- **inventory dashboard** — the admin interface listing all products at a store with current stock levels, supporting search, sort, filter, and inline editing
- **low stock alert** — a visual badge shown on a product row when its stock level falls below the configurable threshold
- **low stock threshold** — the configurable stock level below which a low stock alert is triggered for a product
- **stock level** — the numeric quantity of a product at a store, viewed and edited on the inventory dashboard
- **inventory export** — a CSV download of stock data scoped to the staff member's store

### Acceptance criteria (verbatim)

**View Inventory Dashboard:**

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

**Display Low Stock Badge:**

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

## Screen 6: Backorder Product Page

**Layout:** form (product detail) + form (cart with backorder label)
**State file:** `backorder-product-page-state.json`
**Drawio:** `backorder-product-page.drawio`

### Regions

| Region | Slot | Type | Affordance Trace |
|--------|------|------|------------------|
| Product header | body | chrome | Product identification |
| Stock status — backorder | body | chrome | AC Backorder-1: "Backorder" indicator instead of "Out of Stock" |
| Add to Cart (Backorder) | body | button-bar | AC Backorder-1: "Add to Cart" action available |
| Stock status — out of stock (no backorder) | body | chrome | AC Backorder-4: shows "Out of Stock", cart disabled |
| Cart with backorder label | body | list | AC Backorder-2: cart line item shows backorder label |

### In-scope stories

- Allow Backorder Purchase

### Domain terms (verbatim)

- **backorder purchase** — the ability for a customer to purchase a product that is currently out of stock, with a backorder expectation

### Acceptance criteria (verbatim)

**Allow Backorder Purchase:**

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
