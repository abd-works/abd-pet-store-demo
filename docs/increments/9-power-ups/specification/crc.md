# Crc


---

## power-ups-pet-inventory-crc

<!-- migrated from: increments/9-power-ups/specification/crc.md -->

---
state: crc
sprint_scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
stories:
  - Create Customer Pet
  - Update Customer Pet
  - View Inventory Dashboard
  - Display Low Stock Badge
  - Allow Backorder Purchase
---

# Module: [Power-ups]

Scope: Sprint 3 — logged-in *customer pet profile* CRUD under "My Pets", and the admin *inventory dashboard* replacing the Increment 1 stock form with search, sort, filter, inline *stock level* editing, *low stock alert* badges, *inventory export*, and customer-facing *backorder purchase*. Product search, my store tailoring, and marketing campaigns are out of scope for this artifact.

**Core terms**:
- customer pet profile
- inventory dashboard
- low stock alert
- low stock threshold
- stock level
- inventory export
- backorder purchase

**Key Abstractions (term grouping)**:
- **Customer Pet Profile**: customer pet profile
- **Inventory Dashboard**: inventory dashboard, low stock alert, low stock threshold, stock level, inventory export, backorder purchase

---

# Core Domain

## **Customer Pet Profile**

*Customer Pet Profile* records the customer's own pet — name, species, breed, age or date of birth, and photo — owned by a logged-in *customer account*, listed under "My Pets", and feeding downstream personalized recommendation algorithms.

### **Customer Pet Profile**
pet name                              | (text)
species                               | (dog, cat, reptile, etc.)
breed                                 | (optional text)
age or date of birth                  | (optional)
photo                                 | (optional image)
owning customer account               | Customer Account
require logged-in customer account    | Customer Account, Account Settings
prompt guest to log in or register    | Customer Account, Account Settings
                                      |   invariant: guest sessions cannot create or persist a customer pet profile
                                      |   invariant: guest prompt must not navigate away from the current page
create with optional fields           | Customer Pet Profiles, Customer Account
update editable fields                | Customer Pet Profiles, Customer Account
persist changes immediately           | Customer Account, Customer Pet Profiles
confirm before delete                 | Customer Pet Profiles, Customer Account
feed personalization data             | (species, breed, age for downstream recommendation algorithms)
                                      |   invariant: species and breed data saved on profile feeds downstream personalized recommendation algorithms
lifecycle: (stateful)
invariants:
  - guest sessions cannot create or persist a customer pet profile
  - species and breed data feeds downstream recommendation algorithms

### **Customer Pet Profiles**
listed under my pets                  | Customer Pet Profile, Account Settings
show empty state when none            | Account Settings
support multiple profiles per account | Customer Pet Profile, Customer Account
add new profile entry                 | Customer Pet Profile, Customer Account
remove deleted profile from list      | Customer Pet Profile, Customer Account
                                      |   invariant: each pet has its own customer pet profile entry
                                      |   invariant: all profiles for the account are listed under my pets
lifecycle: (stateless)
invariants:
  - each pet has its own customer pet profile entry
  - all profiles for the account are listed under my pets

### references

**Ref — Pet profile requirements**
Source: context/requirements-chat-with-product-owner.md
Locator: line 15
Extract: partial

```source
pet profiles for their own pets
basic pet profile — name, species, breed, age
```

**Ref — Pet profile stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Create Customer Pet, Update Customer Pet (story-graph)
Extract: acceptance criteria

```source
WHEN a logged-in customer opens "My Pets" from account settings
THEN a list of their customer pet profiles is displayed (or an empty state with "add your first pet")

WHEN the customer creates a new customer pet profile
THEN the form collects: name, species, breed (optional), age or date of birth (optional), and photo (optional)
AND the profile is saved to the customer account

WHEN the customer opens a customer pet profile for editing
THEN all fields are editable: name, species, breed, age, and photo

WHEN the customer deletes a customer pet profile
THEN the profile is removed from "My Pets"
AND the deletion is confirmed with a "are you sure" prompt
```

**Ref — Customer pet profile ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: customer pet profile boundary stub
Extract: partial

```source
customer pet profile — records the customer's own pet: name, species, breed (optional), age or date of birth (optional), and photo (optional)
is owned by a logged-in customer account — guest sessions are prompted to log in before creating a profile
supports multiple profiles per customer account, each listed under "My Pets"
feeds downstream personalized recommendation algorithms with species, breed, and age data
```

### decisions made

- *Customer pet profile* is the KA class listed first — field ownership, login gate, guest prompt without navigation, and personalization feed are owned here (independence test from UL).
- *Customer pet profiles* introduced as collection class — listing under "My Pets", empty state, and multi-pet support are collection-level behaviors, not entity-level (collection-class pattern from CRC skill).
- Delete confirmation modeled on *customer pet profile* with *customer pet profiles* collaboration — destructive action stays on the entity; list removal on the collection (explicit chain of responsibility).
- Personalization feed modeled as responsibility on *customer pet profile* without naming downstream recommendation engine — boundary to Marketing Engine increment (scope-fit test).

---

## **Inventory Dashboard**

*Inventory Dashboard* is the admin stock oversight interface listing all *products* at the *store staff* member's *store* with current *stock levels*, search, sort, and filter. It replaces the bare-bones Increment 1 stock form, surfaces *low stock alert* badges driven by *low stock threshold*, supports *inventory export*, and introduces *backorder purchase* relaxing the out-of-stock checkout gate.

### **Inventory Dashboard**
replacing increment one stock form     |
list products at staff store          | Store Staff, Store, Product
current stock level per product row   | Stock Level, Product
search product list                   | Product
sort by name stock level category     | Product, Category, Stock Level
filter product list                   | Product, Category, Stock Level
low stock only filter                 | Low Stock Alert, Stock Level, Product
inline stock level editing            | Stock Level, Stock Availability, Product
preserve existing stock data          | Stock Level
                                      |   invariant: transition from the prior form must not lose data
                                      |   invariant: stock edits must persist immediately and reflect in customer-facing stock availability
inventory export action               | Inventory Export, Store Staff, Store
lifecycle: (stateless)
invariants:
  - transition from the prior form must not lose data
  - stock edits must persist immediately and reflect in customer-facing stock availability

### **Low Stock Alert**
visual badge on product row           | Inventory Dashboard, Product, Stock Level
trigger below low stock threshold     | Low Stock Threshold, Stock Level
drive low stock only filter           | Inventory Dashboard, Stock Level
disappear above threshold             | Stock Level, Low Stock Threshold
supersede at zero stock level         | Stock Level, Stock Availability
                                      |   invariant: must appear on every product whose stock level is below the low stock threshold
                                      |   invariant: must disappear when the stock level is raised above the threshold
                                      |   invariant: at zero stock level the out-of-stock indicator supersedes the low stock alert badge
lifecycle: (stateless)
invariants:
  - must appear on every product whose stock level is below the low stock threshold
  - must disappear when the stock level is raised above the threshold

### **Low Stock Threshold**
configurable stock level boundary     | (non-negative integer)
determine low stock alert trigger     | Low Stock Alert, Stock Level
per product configuration             | Product
lifecycle: (stateless)
invariants:
  - determines the boundary between adequately stocked and needs attention

### **Stock Level**
numeric quantity at store             | Product, Store
determine stock availability state    | Stock Availability
trigger low stock alert               | Low Stock Alert, Low Stock Threshold
show out of stock at zero             | Stock Availability, Low Stock Alert
edit inline on inventory dashboard    | Inventory Dashboard, Stock Availability
reject negative or non-numeric input  | Inventory Dashboard
                                      |   invariant: must always be a non-negative value
                                      |   invariant: edits must propagate to customer-facing stock availability in real time
                                      |   invariant: invalid stock level updates are rejected and previous stock level remains unchanged
lifecycle: (stateful)
invariants:
  - must always be a non-negative value
  - edits must propagate to customer-facing stock availability in real time

### **Inventory Export**
csv download scoped to staff store    | Store Staff, Store
include product name category stock   | Product, Category, Stock Level
include last updated timestamp        | Stock Level
                                      |   invariant: export covers the store staff member's store only
                                      |   invariant: multi-store export is not supported in this increment
lifecycle: (stateless)
invariants:
  - export covers the store staff member's store only

### **Backorder Purchase**
relax out-of-stock purchase gate      | Stock Availability, Product
show backorder indicator on product page | Product, Stock Availability
enable add to cart when enabled       | Product, Stock Availability
show backorder label in cart          | Product
show backorder status at checkout     | Product
signal ship when restocked            | Product, Stock Availability
disable when backorder not enabled    | Stock Availability, Product
                                      |   invariant: when enabled and product is out of stock, add to cart remains available with backorder messaging
                                      |   invariant: when not enabled, out-of-stock products retain prior increment behavior — add to cart disabled
                                      |   invariant: when stock level rises above zero, normal in-stock purchase flow resumes
lifecycle: (stateless)
invariants:
  - when not enabled, existing out-of-stock gate remains
  - restocking restores normal purchase flow

### references

**Ref — Inventory management requirements**
Source: context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
store staff need a dashboard to manage inventory
```

**Ref — Inventory dashboard stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: View Inventory Dashboard, Display Low Stock Badge, Allow Backorder Purchase
Extract: acceptance criteria

```source
WHEN store staff opens the inventory dashboard
THEN all products at their store are listed with current stock levels
AND the dashboard supports search, sort (by name, stock level, category), and filter

WHEN a product's stock level falls below the configured low stock threshold
THEN a low stock alert badge is shown on that product's row
AND a "low stock only" filter is available on the inventory dashboard

WHEN store staff exports inventory data
THEN the inventory export produces a CSV with product name, category, current stock level, and last updated timestamp
AND the export covers the store staff member's store only

WHEN a product is currently out of stock and backorder purchase is enabled for that product
THEN the product page shows a "Backorder" indicator instead of "Out of Stock"
AND the "Add to Cart" action is available
```

**Ref — Inventory dashboard ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: Inventory Dashboard KA
Extract: partial

```source
Inventory Dashboard is the admin-facing stock oversight interface that replaces the bare-bones stock editing form from Increment 1, giving store staff a consolidated view of all products at their store with current stock levels, search, sort, and filter capabilities. It surfaces low stock alerts when a product's stock level falls below a configurable low stock threshold, supports inline stock level editing with immediate persist, and provides inventory export for offline analysis. The increment also introduces backorder purchase, relaxing the out-of-stock purchase gate.
```

### decisions made

- *Inventory dashboard* is the KA class listed first — list/search/sort/filter, form replacement, and data preservation invariants are owned here (independence test from UL).
- *Low stock alert*, *low stock threshold*, *stock level*, *inventory export*, and *backorder purchase* earn separate classes — each has independent invariants or cross-concept interactions per UL decisions (independence test).
- Out-of-stock indicator at zero modeled on *stock level* collaborating with *low stock alert* — Display Low Stock Badge AC #5: badge superseded by out-of-stock state (explicit chain).
- Invalid stock level rejection modeled on *stock level* — View Inventory Dashboard AC #6; previous value preserved on validation failure.
- *Backorder purchase* modeled as behavioral gate relaxation on *stock availability* via collaboration — does not redefine catalog ownership of availability state (scope-fit test).

---

# Boundary Domain

### **Customer Account**
own customer pet profiles             | Customer Pet Profile, Customer Pet Profiles
provide login identity                | Customer Pet Profile, Account Settings
persist pet profile data              | Customer Pet Profile
lifecycle: (stateless)
invariants:
  - guest sessions cannot persist customer pet profiles

### **Account Settings**
present my pets entry point           | Customer Pet Profiles, Customer Account
host pet profile create and edit      | Customer Pet Profile, Customer Pet Profiles
prompt guest to log in or register    | Customer Account, Customer Pet Profile
                                      |   invariant: guest prompt must not navigate away from the current page
lifecycle: (stateless)
invariants: (none)

### **Store Staff**
open inventory dashboard              | Inventory Dashboard, Store
edit stock levels at assigned store   | Stock Level, Inventory Dashboard
export inventory for assigned store   | Inventory Export, Store
lifecycle: (stateless)
invariants: (none)

### **Product**
stock level subject on dashboard      | Stock Level, Inventory Dashboard
backorder purchase target             | Backorder Purchase, Stock Availability
low stock threshold configuration     | Low Stock Threshold
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
real-time availability state          | Stock Level, Product
updated by stock level edits          | Stock Level, Inventory Dashboard
purchase gate relaxed by backorder    | Backorder Purchase, Product
lifecycle: (stateless)
invariants: (none)

### **Store**
scope inventory dashboard to location | Inventory Dashboard, Store Staff
scope inventory export to location    | Inventory Export, Store Staff
lifecycle: (stateless)
invariants: (none)

### **Category**
sort dimension on inventory dashboard | Inventory Dashboard, Product
filter dimension on inventory dashboard | Inventory Dashboard, Product
column in inventory export            | Inventory Export, Product
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Boundary concepts**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: customer account, store staff, product, stock availability, store, category boundary stubs
Extract: partial

```source
customer account (boundary) — stores the my store preference, owns customer pet profiles, and provides the login identity that gates preference-setting and pet profile creation.

store staff (boundary) — is the admin actor who uses the inventory dashboard to manage stock levels at their store.

product (boundary) — is the entity whose stock levels are viewed, edited, and alerted on in the inventory dashboard.

stock availability (boundary) — is the real-time availability state of a product that the inventory dashboard reflects and that backorder purchase relaxes the purchase gate for.

store (boundary) — scopes the inventory dashboard and inventory export to a single physical location.

category (boundary) — is a sort and filter dimension on the inventory dashboard and a column in the inventory export.
```

### decisions made

- *Customer account* and *account settings* are boundary — owned by Customer Account module; this sprint depends on them for pet profile ownership and My Pets presentation (scope-fit test from UL).
- *Store staff*, *product*, *stock availability*, *store*, and *category* are boundary — owned by Product Catalog and Store Operations; dashboard behaviors depend on them without redefining ownership (scope-fit test).
- *Account settings* introduced as presentation boundary for My Pets — mirrors Sprint 2 account settings pattern for guest-login prompt without navigation.

---


---

## power-ups-search-crc

<!-- migrated from: increments/9-power-ups/specification/crc.md -->

---
state: crc
sprint_scope: Increment 9 Sprint 1 — Product search and filter
stories:
  - Search Products by Keyword
  - Filter Products
---

# Module: [Power-ups]

Scope: Sprint 1 — keyword *product search* with relevance-ranked *search results*, conjunctive *filter facets* (category, pet type, brand, price range, *stock availability*), and removable *active filters* on the *product catalog* and search results page. Store preference, inventory dashboard, and pet profiles are out of scope for this artifact.

**Core terms**:
- product search
- search results
- filter facet
- active filter

**Key Abstractions (term grouping)**:
- **Product Search**: product search, search results, filter facet, active filter

---

# Core Domain

## **Product Search**

*Product Search* is the keyword-based discovery mechanism that matches *products* by name, description, *category*, or brand and produces *search results* ranked by relevance. It works alongside *filter facets* that narrow the result set on the *product catalog* or search results page.

### **Product Search**
entered keyword                     | (text entered by customer)
globally accessible entry point     |
match products by keyword           | Product Catalog, Product, Category
rank matches by relevance           | Search Results, Product
support partial keyword match       | Product, Search Results
support fuzzy keyword match         | Product, Search Results
produce search results              | Search Results, Product Catalog
show empty guidance when no match   | Search Results, Category
                                    |   invariant: must always be accessible from every page
                                    |   invariant: must never return results outside the product catalog published set
lifecycle: (stateless)
invariants:
  - must always be accessible from every page
  - must never return results outside the product catalog published set

### **Search Results**
ranked product ordering             | Product
                                    |   invariant: ordered by relevance — closest match first
narrow to active filter intersection | Active Filter, Product
show no results message             | Category
                                    |   invariant: includes suggestions — popular categories and alternative keywords when keyword matches no products
update on filter change             | Active Filter, Filter Facet, Product
                                    |   invariant: updates immediately when customer applies or removes an active filter
lifecycle: (stateless)
invariants:
  - ordered by relevance — closest match first
  - updates immediately when customer applies or removes an active filter

### **Filter Facet**
facet dimension name                | (category, pet type, brand, price range, or stock availability)
matching product count per value    | Product, Active Filter
narrow product list                 | Product Catalog, Product, Search Results, Active Filter
apply facet value as active filter  | Active Filter, Search Results, Product
combine conjunctively               | Active Filter, Filter Facet
update match counts                 | Active Filter, Product
clear all applied selections        | Active Filter, Search Results, Product
show zero matches guidance          | Active Filter, Search Results
                                    |   invariant: facet counts must always reflect the current combined filter state
                                    |   invariant: must never show stale counts after a filter change
                                    |   invariant: displays no products match your filters message with clear all filters action when combined active filters produce zero results
lifecycle: (stateless)
invariants:
  - facet counts must always reflect the current combined filter state
  - must never show stale counts after a filter change

### **Price Range Filter Facet : Filter Facet**
min-max range selection             | Product
                                    |   invariant: uses continuous min-max range rather than discrete value selections
lifecycle: (stateless)
invariants:
  - uses continuous min-max range rather than discrete value selections

### **Active Filter**
applied facet selection             | Filter Facet
removable chip display              |
remove and expand results           | Search Results, Filter Facet, Product
request clear all on zero results   | Filter Facet, Search Results
lifecycle: (stateless)
invariants:
  - removal expands the product list and recalculates remaining facet counts

### references

**Ref — Product search and filtering**
Source: context/requirements-chat-with-product-owner.md
Locator: line 3
Extract: partial

```source
We want good filtering and search — browse by category, by pet type, by brand, whatever makes sense.
```

**Ref — Search stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Search Products by Keyword, Filter Products
Extract: acceptance criteria

```source
WHEN the customer enters a keyword in the Search Bar and submits
THEN the Search Results show products whose name, description, category, or brand match the keyword
AND results are ranked by relevance (closest match first)

WHEN the customer is browsing the Product Catalog or viewing Search Results
THEN filter facets are available: category, pet type, brand, price range, and stock availability
AND each filter facet shows the count of matching products per value

WHEN the customer combines multiple filter facets (e.g. pet type = "dog" AND category = "food")
THEN the results narrow to the intersection of all active filters
AND filter facet counts update to reflect the combined state of all active filters
```

**Ref — Product Search ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: Product Search KA
Extract: partial

```source
Product Search is the keyword-based discovery mechanism that lets customers find products by name, description, category, or brand, producing search results ranked by relevance. It works alongside filter facets that narrow the result set by category, pet type, brand, price range, and stock availability, each facet showing match counts that update as filters are combined.
```

### decisions made

- *Product Search* is the KA class listed first — keyword matching, partial and fuzzy matching, global accessibility, and empty-state guidance are owned here (independence test from UL).
- *Search results* earns its own class — relevance ranking, active-filter intersection, empty-state guidance, and immediate update on filter change are live artifact behavior, not mere output of search (independence test from UL).
- *Filter facet* earns its own class — conjunctive combination, per-value match counts, count-accuracy invariant, and zero-results clear-all action are collection-level narrowing behavior (independence test from UL).
- *Active filter* earns its own class — removable chip display, expansion on removal, and clear-all trigger on zero results are distinct from the facet dimension definition (independence test from UL).
- *Price range filter facet* is a subtype of *filter facet* — min-max range selection is the only delta; narrowing and count-update contract is identical (Liskov substitution holds).
- Pet type, brand, and category are facet dimension instances — they follow the same behavior as other filter facets and do not earn separate classes (typing call: instance from UL).
- Search bar is not modeled — it is the UI entry point for *product search* with no independent domain behavior; global accessibility is an invariant on *product search* (scope-fit test from UL).
- Conjunctive filter combination and clear-all behavior modeled on *filter facet* rather than introducing an *active filters* collection — the UL names *active filter* as individual selections; group behavior stays on the facet that applies them (collection-class rule assessed; no unique supersession or sequential processing beyond conjunctive intersection).

---

# Boundary Domain

### **Product Catalog**
searchable product corpus             | Product
browsable product corpus              | Product, Filter Facet
published product set                 | Product
                                    |   invariant: product search queries only the published product set
lifecycle: (stateless)
invariants:
  - product search queries only the published product set

### **Product**
product name                          |
description                           |
brand                                 |
category membership                   | Category
stock availability state              | Stock Availability
matched by keyword search             | Product Search
filtered by facet dimension           | Filter Facet
lifecycle: (stateless)
invariants: (none)

### **Category**
category name                         |
filter facet dimension                | Filter Facet
suggest popular categories on empty search | Product Search, Search Results
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
in-stock indicator                    | Product
filter facet dimension                | Filter Facet
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Product Search boundary concepts**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: product, category, stock availability, product catalog boundary stubs
Extract: partial

```source
product (boundary) — is the entity matched, ranked, and filtered by product search and filter facets.

category (boundary) — is one of the filter facet dimensions used to narrow products by product type or pet type.

stock availability (boundary) — is one of the filter facet dimensions used to narrow products to only those currently in stock.

product catalog (boundary) — is the searchable corpus that product search queries and that filter facets operate over.
```

### decisions made

- *Product*, *category*, *stock availability*, and *product catalog* are boundary — owned by Product Catalog; this sprint depends on them for matching, filtering, and the searchable corpus (scope-fit test).
- Keyword matching fields (name, description, brand) modeled as boundary properties on *product* — search ranking and matching operations stay on *product search* (receiver-not-responsible rule).
- Popular category suggestions on empty search modeled as collaboration between *search results*, *product search*, and boundary *category* — category ownership stays in Product Catalog.

---


---

## power-ups-stores-crc

<!-- migrated from: increments/9-power-ups/specification/crc.md -->

---
state: crc
sprint_scope: Increment 9 Sprint 2 — Store preference and tailoring
stories:
  - Filter Stores by Availability and Specialization
  - Set My Store Preference
  - Tailor Experience to Preferred Store
---

# Module: [Power-ups]

Scope: Sprint 2 — *my store* preference on *customer account*, *tailored experience* behaviors (stock availability default, *store locator* highlight, *click-and-collect* pre-selection), and *store locator* filter dimensions (*store specialization filter*, *product availability filter*). Product search, inventory dashboard, and pet profiles are out of scope for this artifact.

**Core terms**:
- my store
- tailored experience
- store specialization filter
- product availability filter

**Key Abstractions (term grouping)**:
- **My Store**: my store, tailored experience, store specialization filter, product availability filter

---

# Core Domain

## **My Store**

*My Store* is the customer's declared preferred *store*, persisted on the *customer account* across sessions and devices, that activates a *tailored experience*. The *store locator* gains *store specialization filter* and *product availability filter* dimensions so customers can discover the right *store* before setting the preference.

### **My Store**
preferred store                       | Store
owning customer account               | Customer Account
persist across sessions and devices   | Customer Account
replace previous preference           | Tailored Experience, Store
                                      |   invariant: only one my store per customer account at any time
                                      |   invariant: setting a new store replaces the old one immediately and switches tailored experience without delay
set from store detail page            | Store, Customer Account
set from account settings             | Account Settings, Store, Customer Account
require logged-in customer account    | Customer Account, Account Settings
prompt guest to log in or register    | Customer Account, Account Settings
                                      |   invariant: guest sessions cannot set my store
                                      |   invariant: guest prompt must not navigate away from the current page
                                      |   invariant: when no my store is set, no store-specific tailoring is applied
lifecycle: (stateful)
invariants:
  - only one my store per customer account at any time
  - guest sessions cannot set my store

### **Tailored Experience**
triggering my store preference        | My Store, Customer Account
default stock availability to preferred store | Stock Availability, Product, My Store
highlight preferred store in locator  | Store Locator, My Store, Store
pre-select preferred store at checkout | Click-and-Collect, My Store, Store
keep full store list for override     | Click-and-Collect, Store
apply no tailoring when unset         | My Store
                                      |   invariant: when my store is set, stock availability on product pages defaults to the preferred store without manual selection
                                      |   invariant: when my store is set, preferred store is visually highlighted on store locator
                                      |   invariant: when my store is set, click-and-collect checkout pre-selects preferred store while full store list remains available
                                      |   invariant: when no my store is set, previous-increment default behavior is preserved
reflect preference change immediately | My Store, Stock Availability, Store Locator, Click-and-Collect
lifecycle: (stateless)
invariants:
  - no tailoring when no my store is set

### **Store Specialization Filter**
filter dimension on store locator     | Store Locator
matching store specialization value   | Store Specialization, Store
narrow store list by specialization   | Store Locator, Store
combine conjunctively with product availability filter | Product Availability Filter, Store Locator, Store
show zero matches guidance            | Store Locator
offer clear filters action            | Store Locator, Product Availability Filter
                                      |   invariant: shows only stores whose store specialization matches the customer selection
                                      |   invariant: when combined filters produce zero results, displays no stores match your filters message with clear filters action
lifecycle: (stateless)
invariants:
  - conjunctive narrowing when both filter dimensions are active

### **Product Availability Filter**
filter dimension on store locator     | Store Locator
selected product for availability     | Product
narrow store list by in-stock product  | Store, Stock Availability, Store Locator
combine conjunctively with store specialization filter | Store Specialization Filter, Store Locator, Store
                                      |   invariant: shows only stores whose stock availability for the selected product indicates the item is available
lifecycle: (stateless)
invariants:
  - conjunctive narrowing when both filter dimensions are active

### references

**Ref — Store personalization**
Source: context/requirements-chat-with-product-owner.md
Locator: line 11
Extract: partial

```source
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.
```

**Ref — Store experience stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Filter Stores by Availability and Specialization, Set My Store Preference, Tailor Experience to Preferred Store
Extract: acceptance criteria

```source
WHEN the customer filters by store specialization (e.g. "reptile section")
THEN only stores with that declared store specialization are shown

WHEN the customer filters by product availability filter for a specific product
THEN only stores where that product is in stock are shown

WHEN a logged-in customer selects "Set as My Store" on a store detail page or from account settings
THEN the selected store is saved as the customer's my store
AND the preference persists across sessions and devices

WHEN the customer has a my store set and views a product page
THEN stock availability on the product page defaults to the preferred store

WHEN the customer has a my store set and opens the store locator
THEN the preferred store is visually highlighted

WHEN the customer has a my store set and enters checkout with click-and-collect
THEN the preferred store is pre-selected in the click-and-collect store-selection step
AND the full store list remains available for override
```

**Ref — My Store ubiquitous language**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: My Store KA
Extract: partial

```source
My Store is the customer's declared preferred store, persisted on the customer account across sessions and devices, that activates a tailored experience: stock availability defaults to the preferred store, the store locator highlights it, and click-and-collect checkout pre-selects it. Alongside the preference, the store locator gains store specialization filter and product availability filter dimensions so customers can discover the right store before setting it.
```

### decisions made

- *My store* is the KA class listed first — single preference per account, immediate replacement, login gate, and guest prompt without navigation are owned here (independence test from UL).
- *Tailored experience* earns its own class — stock default, locator highlight, and checkout pre-selection are three distinct behaviors activated by one trigger, with a no-store-set invariant separate from preference persistence (independence test from UL).
- *Store specialization filter* and *product availability filter* earn separate classes — one narrows by store attribute, the other by per-product stock state; conjunctive combination and shared zero-results guidance are modeled on both with collaboration (independence test from UL).
- *Store specialization* is not modeled as a core class — it is a property of boundary *store* referenced by *store specialization filter* (typing call from UL).
- Guest login prompt modeled on *my store* with *account settings* collaboration — matches UL requirement to avoid navigation away; *customer account* owns identity (receiver-not-responsible).
- Immediate tailored-experience switch on preference change modeled as collaboration from *my store* to *tailored experience* and downstream surfaces — supports Set My Store AC without duplicating persistence on tailoring class.

---

# Boundary Domain

### **Store**
physical location identity            |
declared store specialization         | Store Specialization
settable as my store                  | My Store
filtered by specialization dimension  | Store Specialization Filter
filtered by product availability      | Product Availability Filter
highlighted when preferred            | Tailored Experience, Store Locator
lifecycle: (stateless)
invariants: (none)

### **Store Locator**
discovery surface for stores          | Store
host store specialization filter      | Store Specialization Filter
host product availability filter      | Product Availability Filter
highlight preferred store             | Tailored Experience, My Store, Store
lifecycle: (stateless)
invariants: (none)

### **Customer Account**
store my store preference             | My Store
provide login identity                | My Store, Account Settings
persist preference across sessions    | My Store
                                      |   invariant: guest sessions cannot persist my store
lifecycle: (stateless)
invariants:
  - guest sessions cannot set my store

### **Click-and-Collect**
store selection step at checkout      | Store
accept pre-selected preferred store   | Tailored Experience, My Store, Store
expose full store list for override   | Store
lifecycle: (stateless)
invariants: (none)

### **Store Specialization**
declared area of expertise            | (reptile section, premium dog food)
filter dimension value                | Store Specialization Filter, Store
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
per-product per-store availability    | Product, Store
default to preferred store on product page | Tailored Experience, My Store, Product
filter stores by in-stock product     | Product Availability Filter, Product, Store
lifecycle: (stateless)
invariants: (none)

### **Product**
selected product for availability filter | Product Availability Filter
stock availability on product page    | Stock Availability, Tailored Experience
lifecycle: (stateless)
invariants: (none)

### **Account Settings**
present my store preference editor    | My Store, Customer Account
prompt guest to log in or register    | Customer Account, My Store
                                      |   invariant: guest prompt must not navigate away from the current page
lifecycle: (stateless)
invariants: (none)

### references

**Ref — My Store boundary concepts**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: store, store locator, customer account, click-and-collect, store specialization, stock availability boundary stubs
Extract: partial

```source
store (boundary) — is the physical location that can be set as my store and filtered by store specialization filter and product availability filter.

store locator (boundary) — is the discovery surface where store specialization filter and product availability filter operate and where the tailored experience highlights the preferred store.

customer account (boundary) — stores the my store preference and provides the login identity that gates preference-setting.

click-and-collect (boundary) — provides the checkout store-selection step that the tailored experience pre-selects with the preferred store.

store specialization (boundary) — is a property of store — the declared area of expertise used as a filter dimension by store specialization filter.

stock availability (boundary) — is the per-product, per-store availability state used by product availability filter and defaulted by tailored experience on product pages.
```

### decisions made

- *Store*, *store locator*, *customer account*, and *click-and-collect* are boundary — owned by Store and prior increments; this sprint depends on them for filtering, persistence, highlighting, and checkout pre-selection (scope-fit test from UL).
- *Stock availability* and *product* are boundary — owned by Product Catalog; tailoring defaults and product availability filter depend on per-store stock state without redefining catalog ownership.
- *Account settings* introduced as presentation boundary — hosts preference editor and guest-login prompt without owning preference persistence (mirrors Marketing Engine Sprint 2 pattern).
- *Store specialization* modeled as boundary property stub — no independent behavior outside filter dimension (typing call from UL).

---
