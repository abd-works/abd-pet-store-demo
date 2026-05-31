# Acceptance Criteria


---

## Increment 1

<!-- migrated from: end-to-end/exploration/stories/acceptance-criteria.md -->

# Acceptance Criteria — Increment 1: Walk-in driver — find the store, see what's in stock  

Scope: A customer can find their nearest store, browse the product catalog by category, see real-time stock availability for a product at that store, and walk in to ask for it. Payment-free, account-free. No cart, no checkout, no notifications.  

---  

## Story: View Store Map  

**Story type:** user  

### Domain terms  

- *store* — physical retail location with address, coordinates, and operating hours  
- *store locator* — first-class feature for discovering stores  
- *map view* — geographic display of store locations on a map  
- *geo-coordinates* — latitude/longitude positioning a store on the map  
- *operating hours* — times when the store is open to the public  
- *contact details* — phone, email, or other ways to reach the store  

### Acceptance criteria  

1. **WHEN** the customer opens the *store locator*  
   **THEN** the system displays all stores as selectable points on a *map view*  
   **AND** each point is positioned at the store's *geo-coordinates*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "store locator needs to be a first-class feature. Map view"; line 9, "each store is geo-tagged with its actual address, map coordinates"  

2. **WHEN** the customer selects a store point on the *map view*  
   **THEN** the system displays the store's full address, *operating hours*, and *contact details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "operating hours, and contact details"  

3. **WHEN** multiple stores exist  
   **THEN** the *map view* shows all store locations simultaneously without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *store locator* and *map view* are fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: View Store List  

**Story type:** user  

### Domain terms  

- *store* — physical retail location  
- *store locator* — feature for discovering stores  
- *list view* — sequential display of stores as a readable list  
- *address* — street address of the store  
- *operating hours* — when the store is open  
- *contact details* — phone, email, or other contact info  

### Acceptance criteria  

1. **WHEN** the customer opens the *store locator*  
   **THEN** the system offers a *list view* of all stores as an alternative to the *map view*  
   **AND** each entry shows the store name and *address*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Map view, list view"; domain-sketch.md — Store > store locator, "provides map view and list view of all stores"  

2. **WHEN** the customer selects a store from the *list view*  
   **THEN** the system displays the store's full *address*, *operating hours*, and *contact details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "address, map coordinates, operating hours, and contact details"  

3. **WHEN** the *list view* loads  
   **THEN** all stores appear without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *list view* is fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: Calculate Distance to Store  

**Story type:** user  

### Domain terms  

- *store* — physical retail location  
- *distance* — calculated proximity from customer to a store  
- *postcode* — customer-entered text representing their location  
- *shared location* — device-based geolocation provided by the customer  
- *nearest-first* — sort order ranking closest stores at the top  
- *map view* / *list view* — the two store locator display surfaces  

### Acceptance criteria  

1. **WHEN** the customer provides their location (via *shared location* or entering a *postcode*)  
   **THEN** the system calculates *distance* from the customer to each *store*  
   **AND** stores are sorted *nearest-first*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them (assuming they share location or enter a postcode)"; domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode, producing a sorted nearest-first result list"  

2. **WHEN** the customer has not provided any location  
   **THEN** the *store locator* displays all stores without *distance* information  
   **AND** all stores remain browsable in their default order  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, conditional phrasing "assuming they share location or enter a postcode" implies location provision is optional  

3. **WHEN** *distance* has been calculated  
   **THEN** the distance value appears next to each *store* in both *map view* and *list view*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them"; line 11, "Map view, list view"  

4. **WHEN** the customer changes their location input (new *postcode* or re-shared location)  
   **THEN** the system recalculates *distance* for all stores  
   **AND** the *nearest-first* ordering updates accordingly  
   **Evidence:** domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode" (implies recalculation on input change)  

---  

## Story: View Product Details  

**Story type:** user  

### Domain terms  

- *product* — item available for sale in the pet supplies catalog  
- *product catalog* — the browsable collection of products  
- *category* — grouping of products by type, pet type, or brand  
- *product page* — the detail surface for a single product  
- *product images* — multiple-angle product photographs  
- *description* — textual detail about the product  
- *weight and dimensions* — physical measurements where relevant  

### Acceptance criteria  

1. **WHEN** the customer selects a *product* from the *product catalog*  
   **THEN** the system displays the *product page* with the product name, *description*, and *product images*  
   **AND** *weight and dimensions* are shown where relevant to the product  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant"  

2. **WHEN** the *product* belongs to one or more categories  
   **THEN** the *product page* shows which *category* or categories the product belongs to  
   **Evidence:** domain-sketch.md — Product Catalog > product, "belongs to at least one category and may belong to several simultaneously"  

3. **WHEN** the *product* has multiple *product images*  
   **THEN** the system displays all available images  
   **AND** navigation controls (arrows, thumbnails) are provided to browse between images  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "images (multiple angles ideally)"  

4. **WHEN** the customer navigates the *product catalog*  
   **THEN** products are organized by *category* for browsing  
   **BUT** no keyword search is available in this increment  
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

5. **WHEN** the customer views a *product page*  
   **THEN** no purchase, cart, or review actions are available  
   **Evidence:** thin-slicing.md — Increment 1, "No cart, no checkout, no notifications"; Increment 8 includes reviews  

---  

## Story: Display Real-Time Stock Availability  

**Story type:** system  

### Domain terms  

- *stock availability* — real-time indicator of whether a product can be obtained  
- *product* — item in the catalog  
- *product page* — the detail surface where stock is shown  
- *store* — physical location where stock is held  
- *stock level* — the quantity of a product at a given store  
- *real-time* — always current, never stale  

### Acceptance criteria  

1. **WHEN** the customer views a *product page*  
   **THEN** the system displays current *stock availability* for that *product*  
   **AND** the availability reflects the most recent *stock level* (*real-time*)  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Products should show stock availability in real time"; domain-sketch.md — Product Catalog > stock availability, "reflects in real time whether a product can be purchased"  

2. **WHEN** the *product* is in stock at one or more stores  
   **THEN** the system indicates which *store* or stores have it available  
   **Evidence:** thin-slicing.md — Increment 1, "see real-time stock availability for a product at that store"; requirements-chat-with-product-owner.md — line 9, "they should see which store that animal is at" (same per-store pattern applied to products)  

3. **WHEN** the *product* is out of stock at all stores  
   **THEN** the system clearly indicates the product is currently unavailable  
   **BUT** no backorder, pre-order, or purchase option is offered  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "nobody wants to go through checkout and find out the item's backordered"; thin-slicing.md — Increment 1, "No cart, no checkout"  

4. **WHEN** *stock level* are updated by staff  
   **THEN** subsequent customer views of the *product page* reflect the updated *stock availability*  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "must be current — stale availability that allows checkout of unavailable items is a domain failure"  

---  

## Story: Update Product Stock Levels  

**Story type:** user  

### Domain terms  

- *store employee* — admin role performing stock updates  
- *stock level* — numeric quantity of a product at a store  
- *product* — item in the catalog  
- *store* — physical location where stock is held  
- *stock availability* — the customer-visible status derived from stock levels  
- *admin dashboard* — bare-bones interface for manual stock entry  

### Acceptance criteria  

1. **WHEN** *store employee* opens the *admin dashboard* for a *product*  
   **THEN** the system displays the current *stock level* for that product at the selected *store*  
   **AND** an editable stock quantity field is displayed  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; thin-slicing.md — Increment 1, "Manual stock updates by staff via a bare-bones admin form"  

2. **WHEN** *store employee* submits an updated stock quantity  
   **THEN** the system saves the new *stock level*  
   **AND** the *stock availability* shown to customers reflects the change  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "reflects in real time"; thin-slicing.md — Increment 1, "Manual stock updates by staff"  

3. **WHEN** *store employee* enters an invalid stock value (negative number or non-numeric input)  
   **THEN** the system rejects the update with a clear error message  
   **BUT** the previous *stock level* remain unchanged  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability invariant, "must be current" (invalid state must not corrupt stock truth); inferred from standard input validation — flagged as assumption  

4. **WHEN** *store employee* updates stock for a *product* at one *store*  
   **THEN** only that store's *stock level* for that product are changed  
   **BUT** other stores' stock for the same product remains unaffected  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "multiple physical stores"; thin-slicing.md — Increment 1, "stock availability for a product at that store" (per-store granularity)  


---

## Increment 1

<!-- migrated from: end-to-end/exploration/stories/acceptance-criteria.md -->

# Acceptance Criteria — Increment 1: Walk-in driver — find the store, see what's in stock  

Scope: A customer can find their nearest store, browse the product catalog by category, see real-time stock availability for a product at that store, and walk in to ask for it. Payment-free, account-free. No cart, no checkout, no notifications.  

---  

## Story: View Store Map  

**Story type:** user  

### Domain terms  

- *store* — physical retail location with address, coordinates, and operating hours  
- *store locator* — first-class feature for discovering stores  
- *map view* — geographic display of store locations on a map  
- *geo-coordinates* — latitude/longitude positioning a store on the map  
- *operating hours* — times when the store is open to the public  
- *contact details* — phone, email, or other ways to reach the store  

### Acceptance criteria  

1. **WHEN** the customer opens the *store locator*  
   **THEN** the system displays all stores as selectable points on a *map view*  
   **AND** each point is positioned at the store's *geo-coordinates*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "store locator needs to be a first-class feature. Map view"; line 9, "each store is geo-tagged with its actual address, map coordinates"  

2. **WHEN** the customer selects a store point on the *map view*  
   **THEN** the system displays the store's full address, *operating hours*, and *contact details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "operating hours, and contact details"  

3. **WHEN** multiple stores exist  
   **THEN** the *map view* shows all store locations simultaneously without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *store locator* and *map view* are fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: View Store List  

**Story type:** user  

### Domain terms  

- *store* — physical retail location  
- *store locator* — feature for discovering stores  
- *list view* — sequential display of stores as a readable list  
- *address* — street address of the store  
- *operating hours* — when the store is open  
- *contact details* — phone, email, or other contact info  

### Acceptance criteria  

1. **WHEN** the customer opens the *store locator*  
   **THEN** the system offers a *list view* of all stores as an alternative to the *map view*  
   **AND** each entry shows the store name and *address*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Map view, list view"; domain-sketch.md — Store > store locator, "provides map view and list view of all stores"  

2. **WHEN** the customer selects a store from the *list view*  
   **THEN** the system displays the store's full *address*, *operating hours*, and *contact details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "address, map coordinates, operating hours, and contact details"  

3. **WHEN** the *list view* loads  
   **THEN** all stores appear without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *list view* is fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: Calculate Distance to Store  

**Story type:** user  

### Domain terms  

- *store* — physical retail location  
- *distance* — calculated proximity from customer to a store  
- *postcode* — customer-entered text representing their location  
- *shared location* — device-based geolocation provided by the customer  
- *nearest-first* — sort order ranking closest stores at the top  
- *map view* / *list view* — the two store locator display surfaces  

### Acceptance criteria  

1. **WHEN** the customer provides their location (via *shared location* or entering a *postcode*)  
   **THEN** the system calculates *distance* from the customer to each *store*  
   **AND** stores are sorted *nearest-first*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them (assuming they share location or enter a postcode)"; domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode, producing a sorted nearest-first result list"  

2. **WHEN** the customer has not provided any location  
   **THEN** the *store locator* displays all stores without *distance* information  
   **AND** all stores remain browsable in their default order  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, conditional phrasing "assuming they share location or enter a postcode" implies location provision is optional  

3. **WHEN** *distance* has been calculated  
   **THEN** the distance value appears next to each *store* in both *map view* and *list view*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them"; line 11, "Map view, list view"  

4. **WHEN** the customer changes their location input (new *postcode* or re-shared location)  
   **THEN** the system recalculates *distance* for all stores  
   **AND** the *nearest-first* ordering updates accordingly  
   **Evidence:** domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode" (implies recalculation on input change)  

---  

## Story: View Product Details  

**Story type:** user  

### Domain terms  

- *product* — item available for sale in the pet supplies catalog  
- *product catalog* — the browsable collection of products  
- *category* — grouping of products by type, pet type, or brand  
- *product page* — the detail surface for a single product  
- *product images* — multiple-angle product photographs  
- *description* — textual detail about the product  
- *weight and dimensions* — physical measurements where relevant  

### Acceptance criteria  

1. **WHEN** the customer selects a *product* from the *product catalog*  
   **THEN** the system displays the *product page* with the product name, *description*, and *product images*  
   **AND** *weight and dimensions* are shown where relevant to the product  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant"  

2. **WHEN** the *product* belongs to one or more categories  
   **THEN** the *product page* shows which *category* or categories the product belongs to  
   **Evidence:** domain-sketch.md — Product Catalog > product, "belongs to at least one category and may belong to several simultaneously"  

3. **WHEN** the *product* has multiple *product images*  
   **THEN** the system displays all available images  
   **AND** navigation controls (arrows, thumbnails) are provided to browse between images  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "images (multiple angles ideally)"  

4. **WHEN** the customer navigates the *product catalog*  
   **THEN** products are organized by *category* for browsing  
   **BUT** no keyword search is available in this increment  
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

5. **WHEN** the customer views a *product page*  
   **THEN** no purchase, cart, or review actions are available  
   **Evidence:** thin-slicing.md — Increment 1, "No cart, no checkout, no notifications"; Increment 8 includes reviews  

---  

## Story: Display Real-Time Stock Availability  

**Story type:** system  

### Domain terms  

- *stock availability* — real-time indicator of whether a product can be obtained  
- *product* — item in the catalog  
- *product page* — the detail surface where stock is shown  
- *store* — physical location where stock is held  
- *stock level* — the quantity of a product at a given store  
- *real-time* — always current, never stale  

### Acceptance criteria  

1. **WHEN** the customer views a *product page*  
   **THEN** the system displays current *stock availability* for that *product*  
   **AND** the availability reflects the most recent *stock level* (*real-time*)  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Products should show stock availability in real time"; domain-sketch.md — Product Catalog > stock availability, "reflects in real time whether a product can be purchased"  

2. **WHEN** the *product* is in stock at one or more stores  
   **THEN** the system indicates which *store* or stores have it available  
   **Evidence:** thin-slicing.md — Increment 1, "see real-time stock availability for a product at that store"; requirements-chat-with-product-owner.md — line 9, "they should see which store that animal is at" (same per-store pattern applied to products)  

3. **WHEN** the *product* is out of stock at all stores  
   **THEN** the system clearly indicates the product is currently unavailable  
   **BUT** no backorder, pre-order, or purchase option is offered  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "nobody wants to go through checkout and find out the item's backordered"; thin-slicing.md — Increment 1, "No cart, no checkout"  

4. **WHEN** *stock level* are updated by staff  
   **THEN** subsequent customer views of the *product page* reflect the updated *stock availability*  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "must be current — stale availability that allows checkout of unavailable items is a domain failure"  

---  

## Story: Update Product Stock Levels  

**Story type:** user  

### Domain terms  

- *store employee* — admin role performing stock updates  
- *stock level* — numeric quantity of a product at a store  
- *product* — item in the catalog  
- *store* — physical location where stock is held  
- *stock availability* — the customer-visible status derived from stock levels  
- *admin dashboard* — bare-bones interface for manual stock entry  

### Acceptance criteria  

1. **WHEN** *store employee* opens the *admin dashboard* for a *product*  
   **THEN** the system displays the current *stock level* for that product at the selected *store*  
   **AND** an editable stock quantity field is displayed  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; thin-slicing.md — Increment 1, "Manual stock updates by staff via a bare-bones admin form"  

2. **WHEN** *store employee* submits an updated stock quantity  
   **THEN** the system saves the new *stock level*  
   **AND** the *stock availability* shown to customers reflects the change  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "reflects in real time"; thin-slicing.md — Increment 1, "Manual stock updates by staff"  

3. **WHEN** *store employee* enters an invalid stock value (negative number or non-numeric input)  
   **THEN** the system rejects the update with a clear error message  
   **BUT** the previous *stock level* remain unchanged  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability invariant, "must be current" (invalid state must not corrupt stock truth); inferred from standard input validation — flagged as assumption  

4. **WHEN** *store employee* updates stock for a *product* at one *store*  
   **THEN** only that store's *stock level* for that product are changed  
   **BUT** other stores' stock for the same product remains unaffected  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "multiple physical stores"; thin-slicing.md — Increment 1, "stock availability for a product at that store" (per-store granularity)  
