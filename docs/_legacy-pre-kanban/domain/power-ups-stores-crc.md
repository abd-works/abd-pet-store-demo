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
Source: docs/story/acceptance-criteria/increment-9-acceptance-criteria.md
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
Source: docs/domain/power-ups-ubiquitous-language.md
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
Source: docs/domain/power-ups-ubiquitous-language.md
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
