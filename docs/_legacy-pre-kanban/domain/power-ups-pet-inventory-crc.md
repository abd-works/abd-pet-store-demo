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
Source: docs/story/acceptance-criteria/increment-9-acceptance-criteria.md
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
Source: docs/domain/power-ups-ubiquitous-language.md
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
Source: docs/story/acceptance-criteria/increment-9-acceptance-criteria.md
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
Source: docs/domain/power-ups-ubiquitous-language.md
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
Source: docs/domain/power-ups-ubiquitous-language.md
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
