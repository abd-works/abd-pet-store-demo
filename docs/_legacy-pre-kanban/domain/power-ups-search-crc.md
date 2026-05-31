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
Source: docs/story/acceptance-criteria/increment-9-acceptance-criteria.md
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
Source: docs/domain/power-ups-ubiquitous-language.md
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
Source: docs/domain/power-ups-ubiquitous-language.md
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
