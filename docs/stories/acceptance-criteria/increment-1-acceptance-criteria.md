# Acceptance Criteria — Increment 1: Walk-in driver — find the store, see what's in stock  

Scope: A customer can find their nearest store, browse the product catalog by category, see real-time stock availability for a product at that store, and walk in to ask for it. Payment-free, account-free. No cart, no checkout, no notifications.  

---  

## Story: View Store Map  

**Story type:** user  

### Domain terms  

- *Store* — physical retail location with address, coordinates, and operating hours  
- *Store Locator* — first-class feature for discovering stores  
- *Map View* — geographic display of store locations on a map  
- *Geo-Coordinates* — latitude/longitude positioning a store on the map  
- *Operating Hours* — times when the store is open to the public  
- *Contact Details* — phone, email, or other ways to reach the store  

### Acceptance criteria  

1. **WHEN** the customer opens the *Store Locator*  
   **THEN** the system displays all stores as selectable points on a *Map View*  
   **AND** each point is positioned at the store's *Geo-Coordinates*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "store locator needs to be a first-class feature. Map view"; line 9, "each store is geo-tagged with its actual address, map coordinates"  

2. **WHEN** the customer selects a store point on the *Map View*  
   **THEN** the system displays the store's full address, *Operating Hours*, and *Contact Details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "operating hours, and contact details"  

3. **WHEN** multiple stores exist  
   **THEN** the *Map View* shows all store locations simultaneously without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *Store Locator* and *Map View* are fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: View Store List  

**Story type:** user  

### Domain terms  

- *Store* — physical retail location  
- *Store Locator* — feature for discovering stores  
- *List View* — sequential display of stores as a readable list  
- *Address* — street address of the store  
- *Operating Hours* — when the store is open  
- *Contact Details* — phone, email, or other contact info  

### Acceptance criteria  

1. **WHEN** the customer opens the *Store Locator*  
   **THEN** the system offers a *List View* of all stores as an alternative to the *Map View*  
   **AND** each entry shows the store name and *Address*  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Map view, list view"; domain-sketch.md — Store > store locator, "provides map view and list view of all stores"  

2. **WHEN** the customer selects a store from the *List View*  
   **THEN** the system displays the store's full *Address*, *Operating Hours*, and *Contact Details*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "address, map coordinates, operating hours, and contact details"  

3. **WHEN** the *List View* loads  
   **THEN** all stores appear without requiring search or filtering  
   **Evidence:** domain-sketch.md — Store > store locator, "provides map view and list view of all stores"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

4. **WHEN** a visitor is not logged in  
   **THEN** the *List View* is fully accessible without requiring an account  
   **Evidence:** thin-slicing.md — Increment 1, "Single payment-free, account-free vertical slice"  

---  

## Story: Calculate Distance to Store  

**Story type:** user  

### Domain terms  

- *Store* — physical retail location  
- *Distance* — calculated proximity from customer to a store  
- *Postcode* — customer-entered text representing their location  
- *Shared Location* — device-based geolocation provided by the customer  
- *Nearest-First* — sort order ranking closest stores at the top  
- *Map View* / *List View* — the two store locator display surfaces  

### Acceptance criteria  

1. **WHEN** the customer provides their location (via *Shared Location* or entering a *Postcode*)  
   **THEN** the system calculates *Distance* from the customer to each *Store*  
   **AND** stores are sorted *Nearest-First*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them (assuming they share location or enter a postcode)"; domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode, producing a sorted nearest-first result list"  

2. **WHEN** the customer has not provided any location  
   **THEN** the *Store Locator* displays all stores without *Distance* information  
   **AND** all stores remain browsable in their default order  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, conditional phrasing "assuming they share location or enter a postcode" implies location provision is optional  

3. **WHEN** *Distance* has been calculated  
   **THEN** the distance value appears next to each *Store* in both *Map View* and *List View*  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "how far away it is from them"; line 11, "Map view, list view"  

4. **WHEN** the customer changes their location input (new *Postcode* or re-shared location)  
   **THEN** the system recalculates *Distance* for all stores  
   **AND** the *Nearest-First* ordering updates accordingly  
   **Evidence:** domain-sketch.md — Store > store locator, "calculates distance from the customer's shared location or entered postcode" (implies recalculation on input change)  

---  

## Story: View Product Details  

**Story type:** user  

### Domain terms  

- *Product* — item available for sale in the pet supplies catalog  
- *Product Catalog* — the browsable collection of products  
- *Category* — grouping of products by type, pet type, or brand  
- *Product Page* — the detail surface for a single product  
- *Images* — multiple-angle product photographs  
- *Description* — textual detail about the product  
- *Weight and Dimensions* — physical measurements where relevant  

### Acceptance criteria  

1. **WHEN** the customer selects a *Product* from the *Product Catalog*  
   **THEN** the system displays the *Product Page* with the product name, *Description*, and *Images*  
   **AND** *Weight and Dimensions* are shown where relevant to the product  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant"  

2. **WHEN** the *Product* belongs to one or more categories  
   **THEN** the *Product Page* shows which *Category* or categories the product belongs to  
   **Evidence:** domain-sketch.md — Product Catalog > product, "belongs to at least one category and may belong to several simultaneously"  

3. **WHEN** the *Product* has multiple *Images*  
   **THEN** the system displays all available images  
   **AND** navigation controls (arrows, thumbnails) are provided to browse between images  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "images (multiple angles ideally)"  

4. **WHEN** the customer navigates the *Product Catalog*  
   **THEN** products are organized by *Category* for browsing  
   **BUT** no keyword search is available in this increment  
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand"; thin-slicing.md — Increment 1, "Categories only — no keyword search yet"  

5. **WHEN** the customer views a *Product Page*  
   **THEN** no purchase, cart, or review actions are available  
   **Evidence:** thin-slicing.md — Increment 1, "No cart, no checkout, no notifications"; Increment 8 includes reviews  

---  

## Story: Display Real-Time Stock Availability  

**Story type:** system  

### Domain terms  

- *Stock Availability* — real-time indicator of whether a product can be obtained  
- *Product* — item in the catalog  
- *Product Page* — the detail surface where stock is shown  
- *Store* — physical location where stock is held  
- *Stock Levels* — the quantity of a product at a given store  
- *Real-Time* — always current, never stale  

### Acceptance criteria  

1. **WHEN** the customer views a *Product Page*  
   **THEN** the system displays current *Stock Availability* for that *Product*  
   **AND** the availability reflects the most recent *Stock Levels* (*Real-Time*)  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "Products should show stock availability in real time"; domain-sketch.md — Product Catalog > stock availability, "reflects in real time whether a product can be purchased"  

2. **WHEN** the *Product* is in stock at one or more stores  
   **THEN** the system indicates which *Store* or stores have it available  
   **Evidence:** thin-slicing.md — Increment 1, "see real-time stock availability for a product at that store"; requirements-chat-with-product-owner.md — line 9, "they should see which store that animal is at" (same per-store pattern applied to products)  

3. **WHEN** the *Product* is out of stock at all stores  
   **THEN** the system clearly indicates the product is currently unavailable  
   **BUT** no backorder, pre-order, or purchase option is offered  
   **Evidence:** requirements-chat-with-product-owner.md — line 5, "nobody wants to go through checkout and find out the item's backordered"; thin-slicing.md — Increment 1, "No cart, no checkout"  

4. **WHEN** *Stock Levels* are updated by staff  
   **THEN** subsequent customer views of the *Product Page* reflect the updated *Stock Availability*  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "must be current — stale availability that allows checkout of unavailable items is a domain failure"  

---  

## Story: Update Product Stock Levels  

**Story type:** user  

### Domain terms  

- *Store Employee* — admin role performing stock updates  
- *Stock Levels* — numeric quantity of a product at a store  
- *Product* — item in the catalog  
- *Store* — physical location where stock is held  
- *Stock Availability* — the customer-visible status derived from stock levels  
- *Admin Form* — bare-bones interface for manual stock entry  

### Acceptance criteria  

1. **WHEN** *Store Employee* opens the *Admin Form* for a *Product*  
   **THEN** the system displays the current *Stock Levels* for that product at the selected *Store*  
   **AND** an editable stock quantity field is displayed  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; thin-slicing.md — Increment 1, "Manual stock updates by staff via a bare-bones admin form"  

2. **WHEN** *Store Employee* submits an updated stock quantity  
   **THEN** the system saves the new *Stock Levels*  
   **AND** the *Stock Availability* shown to customers reflects the change  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability, "reflects in real time"; thin-slicing.md — Increment 1, "Manual stock updates by staff"  

3. **WHEN** *Store Employee* enters an invalid stock value (negative number or non-numeric input)  
   **THEN** the system rejects the update with a clear error message  
   **BUT** the previous *Stock Levels* remain unchanged  
   **Evidence:** domain-sketch.md — Product Catalog > stock availability invariant, "must be current" (invalid state must not corrupt stock truth); inferred from standard input validation — flagged as assumption  

4. **WHEN** *Store Employee* updates stock for a *Product* at one *Store*  
   **THEN** only that store's *Stock Levels* for that product are changed  
   **BUT** other stores' stock for the same product remains unaffected  
   **Evidence:** requirements-chat-with-product-owner.md — line 9, "multiple physical stores"; thin-slicing.md — Increment 1, "stock availability for a product at that store" (per-store granularity)  
