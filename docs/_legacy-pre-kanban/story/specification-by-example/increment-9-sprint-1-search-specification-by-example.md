---
state: specification-by-example
sprint_scope: Increment 9 Sprint 1 — Product search and filter
stories:
  - Search Products by Keyword
  - Filter Products
---

# Specification by Example — Increment 9 Sprint 1: Product search and filter

**Sources / context:** `docs/domain/power-ups-search-crc.md`, `docs/domain/power-ups-search-domain.json`, `docs/domain/power-ups-ubiquitous-language.md`, `docs/story/acceptance-criteria/increment-9-acceptance-criteria.md` (Search Products by Keyword, Filter Products)

---

## Story: Search Products by Keyword

**Story type:** user

**Sources / context:** power-ups-search-crc.md (Product Search, Search Results), increment-9-acceptance-criteria.md (Search Products by Keyword AC 1–5)

---

## Background

Given **Product Catalog** contains published **Product** *Premium Kitten Food* with **sku** *PET-KIT-001*, description *High-protein kitten formula*, **Category** *food*, and brand *PawNutrition*
  And **Product Catalog** contains published **Product** *Adult Cat Treats* with **sku** *PET-CAT-042*, description *Crunchy salmon treats*, **Category** *treats*, and brand *PawPlace*
  And **Product Search** is accessible globally in the site header on every page

---

### Scenario 1: Keyword search returns relevance-ranked matches across name description category and brand

When the customer enters **Product Search** keyword *kitten food* and submits
Then **Search Results** show **Product** *Premium Kitten Food* whose name, description, **Category**, or brand match *kitten food*
  And **Search Results** rank **Product** *Premium Kitten Food* first — closest match before weaker matches

### Scenario 2: No-match search shows guidance instead of empty results

When the customer enters **Product Search** keyword *aquarium heater* and submits
  And no **Product** in **Product Catalog** matches *aquarium heater*
Then **Search Results** show *no results found* with suggestions — popular **Category** values and alternative keywords
  And **Search Results** are *not* an empty unlabelled list

### Scenario 3: Partial keyword returns fuzzy matches

When the customer enters **Product Search** keyword *kitt* and submits
Then **Search Results** include **Product** *Premium Kitten Food* via partial or fuzzy matching on name or description

### Scenario 4: Global search bar navigates to search results from any page

Given the customer is viewing a product detail page for **Product** *Adult Cat Treats*
When the customer enters **Product Search** keyword *salmon* in the site header and submits
Then the browser navigates to the **Search Results** page
  And **Search Results** list **Product** matches for *salmon*

### Scenario 5: Active filters narrow keyword search results immediately

Given **Search Results** for keyword *food* include **Product** *Premium Kitten Food* and **Product** *Senior Dog Food*
When the customer applies **Active Filter** **Filter Facet** pet type *cat* to **Search Results**
Then **Search Results** narrow to the intersection of keyword *food* and pet type *cat*
  And **Product** *Senior Dog Food* is excluded from **Search Results** immediately

---

## Story: Filter Products

**Story type:** user

**Sources / context:** power-ups-search-crc.md (Filter Facet, Active Filter, Price Range Filter Facet), increment-9-acceptance-criteria.md (Filter Products AC 1–6)

---

## Examples

### Product:

| scenario   | product_name          | product_sku | category | pet_type | brand         | price  | in_stock |
|------------|-----------------------|-------------|----------|----------|---------------|--------|----------|
| Scenario 1 | Premium Kitten Food   | PET-KIT-001 | food     | cat      | PawNutrition  | 24.99  | true     |
| Scenario 1 | Senior Dog Food       | PET-DOG-010 | food     | dog      | PawNutrition  | 29.99  | true     |
| Scenario 1 | Reptile Heat Lamp     | PET-REP-055 | habitat  | reptile  | TerraWarm     | 45.00  | false    |

---

## Background

Given **Product Catalog** contains the published **Product** rows from the **Product** example table above

---

### Scenario 1: Filter facets show match counts on catalog browse

When the customer browses **Product Catalog**
Then **Filter Facet** dimensions *category*, pet type, brand, price range, and **Stock Availability** are available
  And **Filter Facet** pet type *cat* shows count *1* and pet type *dog* shows count *1* matching **Product** entries for the current filter state

### Scenario 2: Selecting facet value applies removable active filter chip immediately

When the customer selects **Filter Facet** pet type *dog* on **Product Catalog**
Then the **Product** list updates immediately to **Product** *Senior Dog Food* only
  And **Active Filter** chip *pet type: dog* is displayed and removable

### Scenario 3: Conjunctive filters intersect results and recalculate facet counts

Given **Active Filter** pet type *dog* is applied on **Product Catalog**
When the customer also selects **Filter Facet** **Category** *food*
Then **Search Results** / **Product Catalog** list shows only **Product** *Senior Dog Food* — intersection of pet type *dog* AND **Category** *food*
  And remaining **Filter Facet** counts reflect the combined **Active Filter** state — not stale pre-filter counts

### Scenario 4: Removing active filter expands results and recalculates counts

Given **Active Filter** pet type *dog* and **Active Filter** **Category** *food* are applied
When the customer removes **Active Filter** **Category** *food*
Then **Product Catalog** expands to all pet type *dog* **Product** entries previously excluded by **Category** *food*
  And **Filter Facet** counts recalculate for the remaining **Active Filter** pet type *dog*

### Scenario 5: Zero-result filter combination shows clear-all guidance

Given **Active Filter** pet type *reptile* and **Active Filter** **Category** *food* are applied
  And no **Product** in **Product Catalog** matches both filters
When **Filter Facet** evaluates the combined **Active Filter** set
Then **Search Results** show *no products match your filters* with a *clear all filters* action
  And **Filter Facet** counts are *not stale* from the prior filter state

### Scenario 6: Price range facet uses min-max range with same narrowing contract

When the customer sets **Price Range Filter Facet** min *20.00* max *30.00* on **Product Catalog**
Then **Product Catalog** narrows to **Product** *Premium Kitten Food* at *24.99* and **Product** *Senior Dog Food* at *29.99*
  And **Filter Facet** counts update immediately — same behavior as other **Filter Facet** dimensions
