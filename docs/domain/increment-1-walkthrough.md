---
state: walkthrough
increment_scope: Increment 1 — Walk-in driver
specification_refresh: Run 2 slot 29
prior_model: crc.md
---

# Module: PawPlace

Scope: Walk Increment 1 scenarios through `docs/domain/crc.md` (object model refresh deferred to Engineering). Traces six stories: *View Store Map*, *View Store List*, *Calculate Distance to Store*, *View Product Details*, *Display Real-Time Stock Availability*, *Update Product Stock Levels*.

---

# Core Domain

## **Store**

### **View Store Map — all stores visible without login**

**Purpose:** Validate *store locator* *map view* shows every active *store* at *geo-coordinates* without account.
**Concepts traced:** Store Locator, Store

#### Walk 1 — Covers: happy path (three stores)

```
locator: StoreLocator = StoreLocator.loadActiveStores()
stores: Store[] = locator.listView // collaborator load — all Store entries
map: MapView = locator.mapView
for each store in stores:
    point: MapPoint = map.positionStoreAt(store.latitude, store.longitude)
    point.makeSelectable(store)
return map
```

#### Walk 2 — Covers: visitor not logged in (no Customer Account collaborator)

```
visitor: AnonymousVisitor = session.currentVisitor()
assert visitor is not CustomerAccount
locator: StoreLocator = StoreLocator.openMapView()
// invariant: Increment 1 — no account required
return locator.mapView
```

### **Calculate Distance to Store — nearest-first when location provided**

**Purpose:** Validate *calculate distance from customer* and *sort nearest-first* on *store locator*.
**Concepts traced:** Store Locator, Store

#### Walk 1 — Covers: shared location provided

```
locator: StoreLocator = StoreLocator.loadActiveStores()
locator.sharedLocationInput = SharedLocation(lat: 51.5074, lon: -0.1278)
distances: Distance[] = []
for each store in locator.stores:
    d: Distance = locator.calculateDistanceFromCustomer(store)
    distances.add(d)
ordered: Store[] = locator.sortNearestFirst(distances)
return ordered
```

#### Walk 2 — Covers: no location — default order, no distance

```
locator: StoreLocator = StoreLocator.loadActiveStores()
// no sharedLocationInput, no postcodeInput
list: ListView = locator.listView
assert list.showsDistance == false
return list.storesInDefaultOrder()
```

### references

**Ref — Store locator**
Source: docs/story/specification-by-example/increment-1-specification-by-example.md
Locator: View Store Map / Calculate Distance stories
Extract: partial

### decisions made

- Walks use CRC responsibility names; typed signatures land in Engineering object-model slot.
- *Map view* and *list view* modeled as locator properties — walks call through Store Locator, not separate classes.

---

## **Product Catalog**

### **Display Real-Time Stock Availability — per store on product page**

**Purpose:** Validate *stock availability* reflects *stock level* per *stocking store* on *product page*.
**Concepts traced:** Product Catalog, Product, Stock Availability, Store

#### Walk 1 — Covers: in stock at one store

```
catalog: ProductCatalog = ProductCatalog.findProduct(sku: "PET-HAR-001")
product: Product = catalog.product
page: ProductPage = ProductPage.render(product)
for each availability in product.stockAvailability:
    store: Store = availability.stockingStore
    level: StockLevel = availability.stockLevel
    display: WalkInStatus = availability.perStoreWalkInAvailabilityDisplay()
    page.showAvailability(store, display)
return page
```

#### Walk 2 — Covers: out of stock everywhere — no purchase path

```
product: Product = ProductCatalog.findProduct(sku: "PET-FLT-099")
availabilities: StockAvailability[] = product.stockAvailability
assert all(a.availableToSellQuantity == 0 for a in availabilities)
page: ProductPage = ProductPage.render(product)
page.showUnavailable()
// invariant: no backorder, pre-order, or purchase option (Increment 1)
return page
```

### **Update Product Stock Levels — admin dashboard refresh**

**Purpose:** Validate *store employee* edit propagates via *refresh from store employee edit*.
**Concepts traced:** Stock Availability, Admin Dashboard (boundary), Store, Product

#### Walk 1 — Covers: accepted update at one store

```
dashboard: AdminDashboard = AdminDashboard.openStockLevelEditForm(
    store: Store.byCode("STR-001"),
    product: Product.bySku("PET-HAR-001")
)
current: StockAvailability = dashboard.loadStockAvailability()
dashboard.displayStockLevel(current.stockLevel)
dashboard.submitStockLevel(newLevel: 40)
current.refreshFromStoreEmployeeEdit(dashboard)
// available-to-sell recalculates: 40 - reserved 3 = 37
assert current.availableToSellQuantity == 37
return current
```

#### Walk 2 — Covers: cross-store isolation

```
camden: StockAvailability = StockAvailability.at(store: "STR-001", product: "PET-HAR-001")
bristol: StockAvailability = StockAvailability.at(store: "STR-002", product: "PET-HAR-001")
camden.refreshFromStoreEmployeeEdit(newLevel: 40)
assert bristol.stockLevel == 12  // unchanged
return bristol
```

### references

**Ref — Stock update**
Source: docs/story/specification-by-example/increment-1-specification-by-example.md
Locator: Update Product Stock Levels
Extract: partial

### decisions made

- *Product page* has no CRC block — walk treats it as presentation composing Product + Stock Availability (matches UL).
- *Admin dashboard* is boundary — walk enters through `openStockLevelEditForm` and delegates persist to Stock Availability.
- **Slot 50:** Walk notation keeps instance-style calls; implementation uses module functions (`walkInAvailabilityLabel`, `refreshStockFromEmployeeEdit`, `updateQuantityOnHand`) exported from `@pawplace/product-catalog-shared` — see `object-model.md` Stock Availability implementation packaging.
