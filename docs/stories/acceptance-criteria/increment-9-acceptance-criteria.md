# Acceptance criteria — Increment 9: Power-ups — search, personalization, admin polish  

**Increment outcome:** Smart search lifts conversion on a deep catalog; store personalization and customer pet profiles tighten loyalty; the store-owner inventory dashboard replaces the bare-bones stock form from Increment 1. Polish layer over a fully-functional product.  

**Builds on:** Increments 1-8 (complete product live: e-commerce, accounts, payments, pets, returns, marketing, content).  

---  

## Story: `Search Products by Keyword`  

**Story type:** user  

### Domain terms  

- *Product Search* — a keyword-based search across the *Product Catalog*  
- *Search Results* — the list of products matching the keyword  
- *Search Bar* — the UI input for entering search terms  
- *Product Catalog* — the complete collection of products  

### Acceptance criteria  

1. **WHEN** the customer enters a keyword in the *Search Bar* and submits  
   **THEN** the *Search Results* show products whose name, description, category, or brand match the keyword  
   **AND** results are ranked by relevance (closest match first)  
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "We want good filtering and search"  

2. **WHEN** the keyword matches no products  
   **THEN** the *Search Results* show a "no results found" message with suggestions (e.g. "try a different keyword" or popular categories)  
   **Evidence:** inferred — standard search empty state  

3. **WHEN** the customer enters a partial keyword (e.g. "kitt" for "kitten food")  
   **THEN** the search returns relevant matches (prefix matching or fuzzy matching)  
   **Evidence:** inferred — search should be forgiving of partial input  

4. **WHEN** the customer searches from any page (product detail, pet gallery, blog)  
   **THEN** the *Search Bar* is accessible globally (e.g. in the header)  
   **AND** results navigate to the search results page  
   **Evidence:** inferred — search is a global capability, not scoped to one page  

---  

## Story: `Filter Products`  

**Story type:** user  

### Domain terms  

- *Product Filter* — a faceted refinement of the product catalog or search results  
- *Filter Facets* — the available filter dimensions: category, pet type, brand, price range, stock availability  
- *Active Filters* — the currently applied filters, visible and removable  

### Acceptance criteria  

1. **WHEN** the customer is browsing the *Product Catalog* or viewing *Search Results*  
   **THEN** *Filter Facets* are available: category, pet type, brand, price range, and *Stock Availability*  
   **AND** each facet shows the count of matching products  
   **Evidence:** requirements-chat-with-product-owner.md — line 3, "browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search"  

2. **WHEN** the customer selects a filter  
   **THEN** the product list updates immediately to show only matching products  
   **AND** the *Active Filters* are shown as removable chips or tags  
   **Evidence:** inferred — standard faceted filter behavior  

3. **WHEN** the customer combines multiple filters (e.g. pet type = "dog" AND category = "food")  
   **THEN** the results narrow to the intersection of all active filters  
   **AND** facets update their counts to reflect the combined filter state  
   **Evidence:** inferred — conjunctive filtering  

4. **WHEN** the customer removes an *Active Filter*  
   **THEN** the product list expands to include products that were previously hidden by that filter  
   **Evidence:** inferred — filter removal restores results  

5. **WHEN** all active filters produce zero results  
   **THEN** the product list shows a "no products match your filters" message with a "clear all filters" action  
   **Evidence:** inferred — zero-results state for over-filtered catalog  

---  

## Story: `Filter Stores by Availability and Specialization`  

**Story type:** user  

### Domain terms  

- *Store Filter* — a refinement of the store list or map  
- *Store Specialization* — a store's area of expertise (e.g. reptile section, premium dog food)  
- *Product Availability* — whether a specific product is in stock at a store  

### Acceptance criteria  

1. **WHEN** the customer is browsing the *Store List* or *Store Map*  
   **THEN** filters are available for: *Store Specialization* and *Product Availability* (e.g. "stores that have product X in stock")  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location. Some stores might specialise"  

2. **WHEN** the customer filters by *Store Specialization* (e.g. "reptile section")  
   **THEN** only stores with that specialization are shown  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "one might have a great reptile section"  

3. **WHEN** the customer filters by *Product Availability* for a specific product  
   **THEN** only stores where that product is *In Stock* are shown  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "filtering by what's available at each location"  

4. **WHEN** no stores match the combined filters  
   **THEN** a "no stores match your filters" message is shown with a "clear filters" action  
   **Evidence:** inferred — standard zero-results handling  

---  

## Story: `Set My Store Preference`  

**Story type:** user  

### Domain terms  

- *My Store* — the customer's preferred physical store  
- *Store Preference* — the saved selection, persisted to the *Customer Account*  
- *Store Selector* — the UI for choosing a preferred store  

### Acceptance criteria  

1. **WHEN** a logged-in customer selects "Set as My Store" on a *Store Detail* page or from account settings  
   **THEN** the selected store is saved as the customer's *My Store*  
   **AND** the preference persists across sessions and devices  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "Maybe even the ability to set 'my store' as a preference and tailor the experience"  

2. **WHEN** the customer changes their *My Store* preference  
   **THEN** the old preference is replaced with the new one  
   **AND** the tailored experience (see *Tailor Experience to Preferred Store*) reflects the change immediately  
   **Evidence:** inferred — single preferred store per account  

3. **WHEN** a guest customer tries to set *My Store*  
   **THEN** a prompt to log in or register is shown  
   **BUT** the store page is not navigated away from  
   **Evidence:** inferred — preference requires an account for persistence  

---  

## Story: `Tailor Experience to Preferred Store`  

**Story type:** system  

### Domain terms  

- *My Store* — the customer's preferred store (see *Set My Store Preference*)  
- *Tailored Experience* — adjustments to browsing based on the preferred store  
- *Stock Availability* — shown for the preferred store first  
- *In-Store Event Notifications* — targeted to the preferred store (established in Increment 8)  

### Acceptance criteria  

1. **WHEN** the customer has a *My Store* set  
   **THEN** *Stock Availability* on product pages defaults to the preferred store  
   **AND** the *Store Locator* highlights the preferred store  
   **Evidence:** requirements-chat-with-product-owner.md — line 11, "tailor the experience"  

2. **WHEN** the customer has a *My Store* and enters checkout with *Click-and-Collect*  
   **THEN** the preferred store is pre-selected in the *Store Selector*  
   **AND** the full store list remains available for selecting a different store  
   **Evidence:** domain-sketch.md — Store KA, `store` concept: "tailors the browsing experience when set as the customer's preferred store"  

3. **WHEN** the customer has no *My Store* set  
   **THEN** no store-specific tailoring is applied (default behavior from previous increments)  
   **Evidence:** inferred — feature is additive, not breaking  

---  

## Story: `Create Pet Profile`  

**Story type:** user  

### Domain terms  

- *Customer Pet Profile* — a profile for the customer's own pet (distinct from the store's adoption *Pet* concept)  
- *Customer Account* — pet profiles are tied to the logged-in customer  
- *Pet Name, Species, Breed, Age* — the basic info fields  
- *Known Allergies* — any food or environmental allergies the pet has  
- *Preferred Food Type* — the type of food the customer buys for this pet  
- *Special Dietary Requirements* — any dietary restrictions or special needs  

### Acceptance criteria  

1. **WHEN** a logged-in customer opens "My Pets" from account settings  
   **THEN** they see a list of their *Customer Pet Profiles* (or an empty state with "add your first pet")  
   **Evidence:** requirements-chat-with-product-owner.md — line 15, "pet profiles for their own pets"  

2. **WHEN** the customer creates a new *Customer Pet Profile*  
   **THEN** the form collects: name, species, breed (optional), age or date of birth (optional), photo (optional), *Known Allergies* (optional), *Preferred Food Type* (optional), and *Special Dietary Requirements* (optional)  
   **AND** the profile is saved to the account  
   **Evidence:** requirements-chat-with-product-owner.md — line 23, "their pets (name, breed, age, dietary needs — useful for recommendations)"; crc.md — Pet Profile, `known allergies`, `preferred food type`, `special dietary requirements`  

3. **WHEN** the customer has multiple pets  
   **THEN** each pet has its own profile entry  
   **AND** all are listed under "My Pets"  
   **Evidence:** inferred — multiple pet profiles supported  

4. **WHEN** a guest customer tries to create a pet profile  
   **THEN** a prompt to log in or register is shown  
   **Evidence:** inferred — pet profiles require an account  

---  

## Story: `Update Pet Profile`  

**Story type:** user  

### Domain terms  

- *Customer Pet Profile* — the profile being edited (customer's own pet, not the store's adoption pet)  
- *Customer Account* — the owner of the profile  

### Acceptance criteria  

1. **WHEN** the customer opens a *Customer Pet Profile* for editing  
   **THEN** all fields are editable: name, species, breed, age, photo, *Known Allergies*, *Preferred Food Type*, and *Special Dietary Requirements*  
   **Evidence:** inferred — standard CRUD lifecycle; crc.md — Pet Profile dietary fields  

2. **WHEN** the customer saves changes  
   **THEN** the updated profile is persisted immediately  
   **AND** any personalised recommendations that reference pet data reflect the update on the next recommendation cycle  
   **Evidence:** inferred — pet profiles feed personalisation (from Increment 8)  

3a. **WHEN** the customer has filled in *Known Allergies* or *Special Dietary Requirements*  
   **THEN** product recommendations exclude products containing flagged allergens or incompatible ingredients  
   **Evidence:** crc.md — Pet Profile, `enable personalised recommendations | Notification, Product`; requirements-chat-with-product-owner.md — line 23, "dietary needs — useful for recommendations"  

3. **WHEN** the customer deletes a *Customer Pet Profile*  
   **THEN** the profile is removed from "My Pets"  
   **AND** the deletion is confirmed with a "are you sure" prompt  
   **Evidence:** inferred — destructive action confirmation  

---  

## Story: `View Inventory Dashboard`  

**Story type:** store owner  

### Domain terms  

- *Inventory Dashboard* — the full admin view replacing the bare-bones *Admin Stock Form* from Increment 1  
- *Store Owner* — the business-level actor overseeing inventory  
- *Stock Level* — the quantity of each product at each store  
- *Quantity on Hand* — total physical units in warehouse or store  
- *Reserved Quantity* — units allocated to confirmed orders or active carts but not yet shipped  
- *Available-to-Sell Quantity* — quantity on hand minus reserved  
- *Reorder Point* — threshold that triggers a restock order  
- *Reorder Quantity* — how many units to order when reorder point is hit  
- *Low Stock Threshold* — warning level that triggers the low-stock badge before reorder point  
- *Last Restocked Date* — when the most recent restock was received  
- *Expected Restock Date* — estimated date for the next restock if currently backordered  
- *Low Stock Alert* — a visual indicator when stock falls below a threshold  

### Acceptance criteria  

1. **WHEN** *Store Owner* opens the *Inventory Dashboard*  
   **THEN** all products at their store are listed with current *Stock Levels*  
   **AND** each row shows: product name, category, *Quantity on Hand*, *Reserved Quantity*, *Available-to-Sell Quantity*, *Reorder Point*, and *Last Restocked Date*  
   **AND** the dashboard supports search, sort (by name, stock level, category), and filter  
   **Evidence:** requirements-chat-with-product-owner.md — line 29, "store staff need a dashboard to manage inventory"; crc.md — Stock Availability, full inventory data properties  

2. **WHEN** a product's *Available-to-Sell Quantity* falls at or below its *Low Stock Threshold*  
   **THEN** a *Low Stock Alert* badge is shown on that product's row  
   **AND** a "Low stock only" filter is available on the dashboard  
   **Evidence:** crc.md — Stock Availability, `low stock threshold` property  

2a. **WHEN** a product's *Available-to-Sell Quantity* falls at or below its *Reorder Point*  
   **THEN** a "Reorder needed" indicator is shown with the *Reorder Quantity* to order  
   **AND** the *Expected Restock Date* is shown if a restock is already in progress  
   **Evidence:** crc.md — Stock Availability, `reorder point`, `reorder quantity`, `expected restock date` properties  

3. **WHEN** *Store Owner* edits a *Stock Level* from the dashboard  
   **THEN** the same behavior as *Update Product Stock Levels* (Increment 1) applies: immediate persist, real-time customer-facing update, validation  
   **Evidence:** established in Increment 1 — Update Product Stock Levels AC  

4. **WHEN** *Store Owner* views the dashboard for the first time after Increment 9 deployment  
   **THEN** the *Inventory Dashboard* replaces the bare-bones *Admin Stock Form* from Increment 1  
   **AND** all existing stock data is intact — no data migration loss  
   **Evidence:** inferred — upgrade path from simple form to full dashboard  

5. **WHEN** *Store Owner* exports inventory data (e.g. CSV)  
   **THEN** the export includes: product name, category, *Quantity on Hand*, *Available-to-Sell Quantity*, *Reorder Point*, *Last Restocked Date*, and last updated timestamp  
   **AND** the export covers the owner's store only  
   **Evidence:** inferred — reporting and offline analysis capability  

---  

## Story: `Display Low Stock Badge`  

**Story type:** system  

### Domain terms  

- *Low Stock Badge* — a visual indicator on a product listing or product page when stock is running low  
- *Low Stock Threshold* — the quantity below which the badge appears (distinct from the reorder point)  
- *Available-to-Sell Quantity* — the customer-relevant stock number (on hand minus reserved)  
- *Product Listing* — a product card in catalog browsing, search results, or category views  

### Acceptance criteria  

1. **WHEN** a product's *Available-to-Sell Quantity* is at or below its *Low Stock Threshold* but greater than zero  
   **THEN** a *Low Stock Badge* is shown on the *Product Listing* and *Product Details Page*  
   **AND** the badge communicates urgency (e.g. "Only 3 left" or "Low stock")  
   **Evidence:** crc.md — Stock Availability, `low stock threshold` property; requirements-chat-with-product-owner.md — line 5, "Products should show stock availability in real time"  

2. **WHEN** a product's *Available-to-Sell Quantity* is above its *Low Stock Threshold*  
   **THEN** no *Low Stock Badge* is shown  
   **AND** the product shows a standard "In Stock" indicator  
   **Evidence:** inferred — badge only appears when stock is genuinely low  

3. **WHEN** a product's *Available-to-Sell Quantity* reaches zero  
   **THEN** the *Low Stock Badge* is replaced by an "Out of Stock" indicator  
   **AND** the "Add to Cart" action is disabled (unless backorder is enabled — see *Allow Backorder Purchase*)  
   **Evidence:** crc.md — Stock Availability invariant: "available-to-sell must never go negative; if it reaches zero, purchasability is false"  

4. **WHEN** *Stock Levels* are updated by staff and a product crosses the *Low Stock Threshold*  
   **THEN** the badge appears or disappears on subsequent page loads  
   **Evidence:** inferred — badge is derived from real-time stock data  

---  

## Story: `Allow Backorder Purchase`  

**Story type:** system  

### Domain terms  

- *Backorder* — the ability for a customer to purchase a product that is currently out of stock, with an expected restock date  
- *Backorder Enabled* — a per-product flag set by admin indicating the product accepts orders despite zero available-to-sell  
- *Expected Restock Date* — the estimated date when the backordered product will be available again  
- *Available-to-Sell Quantity* — the customer-relevant stock (zero for backordered products)  

### Acceptance criteria  

1. **WHEN** a product has *Available-to-Sell Quantity* of zero and *Backorder Enabled* is true  
   **THEN** the product page shows a "Backorder" indicator instead of "Out of Stock"  
   **AND** the "Add to Cart" action is available  
   **AND** the *Expected Restock Date* is displayed to the customer  
   **Evidence:** crc.md — Stock Availability, `backorder enabled` property and gate order flow invariant: "prevents checkout of items with zero available-to-sell unless backorder is enabled"  

2. **WHEN** the customer adds a backordered product to the cart  
   **THEN** the cart line item shows a "Backorder" label and the *Expected Restock Date*  
   **AND** the customer is informed that delivery will be delayed until restock  
   **Evidence:** inferred — transparency about delivery delay for backordered items  

3. **WHEN** the customer proceeds to checkout with a backordered product  
   **THEN** the order summary shows the backorder status and expected date per affected line item  
   **AND** the order is accepted and payment is processed normally  
   **Evidence:** crc.md — Stock Availability, gate order flow: backorder-enabled products pass the checkout gate  

4. **WHEN** a product has *Available-to-Sell Quantity* of zero and *Backorder Enabled* is false  
   **THEN** the product shows "Out of Stock"  
   **AND** the "Add to Cart" action is disabled (existing Increment 2 behavior)  
   **Evidence:** crc.md — Stock Availability invariant: "if available-to-sell reaches zero, purchasability is false" (default when backorder is not enabled)  
