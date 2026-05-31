# Object Model

---

## power-ups-search-object-model

<!-- sprint: inc-9-sprint-1-search -->

---
state: domain-model
sprint_scope: Increment 9 Sprint 1 — Product search and filter
---

# Module: [Power-ups]

Scope: Sprint 1 — keyword *Product Search* with relevance-ranked *Search Results*, conjunctive *Filter Facet* narrowing (category, pet type, brand, price range, stock availability), and removable *Active Filter* chips on the product catalog and search results page.

---

# Core Domain

## **Product Search**

*Product Search* is the keyword-based discovery mechanism that matches products by name, description, category, or brand and produces relevance-ranked results alongside conjunctive filter facets.

### **ProductSearch** << Service >>

Initialisation: stateless service — constructed with *ProductCatalog* query access at application bootstrap.
------
+ enteredKeyword: String | null
	Invariant: must always be accessible from every page
----
+ matchProductsByKeyword(keyword: String, catalog: ProductCatalog): List<Product>
	Invariant: must never return results outside the product catalog published set
	Interaction:
		publishedProducts: List<Product> = catalog.publishedProductSet()
		return publishedProducts filter where matchesKeyword(product: product, keyword: keyword)
+ rankMatchesByRelevance(products: List<Product>, keyword: String): List<Product>
	Invariant: ordered by relevance — closest match first
	Interaction:
		return sortByRelevanceScore(products: products, keyword: keyword)
+ supportPartialKeywordMatch(keyword: String, product: Product): Boolean
+ supportFuzzyKeywordMatch(keyword: String, product: Product): Boolean
+ produceSearchResults(keyword: String, catalog: ProductCatalog): SearchResults
	Interaction:
		matchedProducts: List<Product> = matchProductsByKeyword(keyword: keyword, catalog: catalog)
		rankedProducts: List<Product> = rankMatchesByRelevance(products: matchedProducts, keyword: keyword)
		return SearchResults.fromProducts(products: rankedProducts, keyword: keyword)
+ showEmptyGuidanceWhenNoMatch(keyword: String, results: SearchResults, categories: List<Category>): SearchResults
	Invariant: includes suggestions — popular categories and alternative keywords when keyword matches no products
	Interaction:
		if results.isEmpty(): return results.withSuggestions(categories: categories, keyword: keyword)
		return results

### **SearchResults** << Entity >>

Initialisation: factory method `SearchResults.fromProducts(products, keyword)` — constructed per query or filter state.
------
+ keyword: String | null
+ << aggregation >> rankedProducts: List<Product>
	Invariant: ordered by relevance — closest match first
+ << aggregation >> activeFilters: List<ActiveFilter>
----
+ narrowToActiveFilterIntersection(filters: List<ActiveFilter>): SearchResults
	Interaction:
		narrowedProducts: List<Product> = rankedProducts filter where satisfiesAllFilters(product: product, filters: filters)
		return SearchResults with rankedProducts = narrowedProducts, activeFilters = filters
+ showNoResultsMessage(categories: List<Category>): NoResultsGuidance
	Invariant: includes suggestions — popular categories and alternative keywords when keyword matches no products
+ updateOnFilterChange(filters: List<ActiveFilter>, facets: List<FilterFacet>): SearchResults
	Invariant: updates immediately when customer applies or removes an active filter
	Interaction:
		narrowed: SearchResults = narrowToActiveFilterIntersection(filters: filters)
		updatedFacets: List<FilterFacet> = facets map to updateMatchCounts(activeFilters: filters, products: narrowed.rankedProducts)
		return narrowed with facetSnapshot = updatedFacets

### **FilterFacet** << Entity >>

Initialisation: factory method `FilterFacet.forDimension(dimension)` — one facet per dimension (category, petType, brand, priceRange, stockAvailability).
------
+ dimension: FacetDimension
+ << aggregation >> valueCounts: Dictionary<String, Integer>
	Invariant: facet counts must always reflect the current combined filter state
	Invariant: must never show stale counts after a filter change
----
+ narrowProductList(products: List<Product>, selection: ActiveFilter): List<Product>
+ applyFacetValueAsActiveFilter(value: String): ActiveFilter
	Interaction:
		return ActiveFilter.fromSelection(dimension: this.dimension, value: value)
+ combineConjunctively(filters: List<ActiveFilter>): List<Product>
	Interaction:
		return products filter where satisfiesAllFilters(product: product, filters: filters)
+ updateMatchCounts(activeFilters: List<ActiveFilter>, products: List<Product>): FilterFacet
	Invariant: facet counts must always reflect the current combined filter state
	Interaction:
		remainingProducts: List<Product> = applyOtherFiltersExcludingDimension(activeFilters: activeFilters, dimension: this.dimension, products: products)
		return FilterFacet with valueCounts = countPerValue(products: remainingProducts)
+ clearAllAppliedSelections(): List<ActiveFilter>
+ showZeroMatchesGuidance(results: SearchResults): ZeroMatchesGuidance
	Invariant: displays no products match your filters message with clear all filters action when combined active filters produce zero results

### **PriceRangeFilterFacet : FilterFacet** << Entity >>

Initialisation: factory method `PriceRangeFilterFacet.create(min, max)` — subtype for continuous range dimension.
------
+ minPrice: Money
+ maxPrice: Money
	Invariant: uses continuous min-max range rather than discrete value selections
----
+ applyRangeSelection(min: Money, max: Money): ActiveFilter
	Interaction:
		return ActiveFilter.fromPriceRange(min: min, max: max)

### **ActiveFilter** << ValueObject >>

Initialisation: factory method `ActiveFilter.fromSelection(dimension, value)` or `ActiveFilter.fromPriceRange(min, max)`.
------
+ dimension: FacetDimension
+ selectedValue: String | null
+ minPrice: Money | null
+ maxPrice: Money | null
----
+ removeAndExpandResults(results: SearchResults, remainingFilters: List<ActiveFilter>): SearchResults
	Invariant: removal expands the product list and recalculates remaining facet counts
	Interaction:
		return results.updateOnFilterChange(filters: remainingFilters, facets: results.facetSnapshot)
+ requestClearAllOnZeroResults(facets: List<FilterFacet>): ClearAllFiltersAction
	Interaction:
		return ClearAllFiltersAction.forZeroResults(facets: facets)

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

WHEN the customer combines multiple filter facets (e.g. pet type = "dog" AND category = "food")
THEN the results narrow to the intersection of all active filters
AND filter facet counts update to reflect the combined state of all active filters
```

### decisions made

- *ProductSearch* modeled as Service — keyword matching, partial/fuzzy support, and empty guidance are stateless query operations (receiver-not-responsible-for-receiving).
- *SearchResults* is an Entity scoped to a query/filter snapshot — ranking, intersection narrowing, and immediate filter updates are collection-level behavior (collection-class rule).
- *FilterFacet* owns conjunctive combination and count-accuracy invariants — group clear-all stays on facet, not a separate collection (CRC decisions carried forward).
- *PriceRangeFilterFacet* subtype carries only min-max range delta — narrowing contract identical to parent (Liskov substitution).
- *ActiveFilter* is a ValueObject — applied selection is an immutable fact; chip display deferred to interface-design boundary.
- Search bar omitted — global accessibility modeled as invariant on *ProductSearch*, not a domain class (scope-fit test from CRC).

---

# Boundary Domain

### **ProductCatalog** << Entity >>

Initialisation: boundary — owned by Product Catalog module.
------
+ publishedProductSet(): List<Product>
	Invariant: product search queries only the published product set

### **Product** << Entity >>

Initialisation: boundary — owned by Product Catalog module.
------
+ name: String
+ description: String
+ brand: String
+ category: Category
+ stockAvailability: StockAvailability
----
+ matchedByKeywordSearch(keyword: String): Boolean
+ filteredByFacetDimension(filter: ActiveFilter): Boolean

### **Category** << Entity >>

Initialisation: boundary — owned by Product Catalog module.
------
+ categoryName: String
----
+ suggestPopularCategoriesOnEmptySearch(): List<Category>

### **StockAvailability** << ValueObject >>

Initialisation: boundary — inventory state on product.
------
+ inStock: Boolean
+ asFacetValue(): String

### references

**Ref — Product Search boundary concepts**
Source: docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md
Locator: product, category, stock availability, product catalog boundary stubs
Extract: partial

```source
product (boundary) — is the entity matched, ranked, and filtered by product search and filter facets.
category (boundary) — is one of the filter facet dimensions used to narrow products by product type or pet type.
product catalog (boundary) — is the searchable and browsable corpus; product search queries only the published product set.
```

### decisions made

- *Product*, *Category*, *StockAvailability*, and *ProductCatalog* remain boundary — owned by Product Catalog module; Power-ups sprint consumes them for matching and narrowing (scope-fit test).
- Pet type and brand facet dimensions use *FilterFacet.forDimension* instances — no separate classes per UL typing call in CRC decisions.

---
