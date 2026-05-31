# Specification By Example


---

## Increment 9

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification by example (Scenario Outline) — Increment 9: Power-ups — search, personalization, admin polish  

---  

## Story: `Search Products by Keyword`  

**ProductCatalog:** with **Product**  
| sku | name | description | brand | category_name |  
| --- | --- | --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | High-protein grain-free kibble for adult dogs | NutriPaws | Dog Food |  
| SKU-FOOD-502 | Kitten Wet Food Variety Pack | Grain-free wet food for kittens aged 2-12 months | NutriPaws | Cat Food |  
| SKU-TOY-220 | Squeaky Bone Chew | Durable rubber chew toy for medium dogs | PlayPet | Dog Toys |  
| SKU-AQUA-101 | Tropical Fish Flakes | Daily nutrition flakes for freshwater tropical fish | AquaLife | Fish Food |  

### Scenario Outline: Search results ranked by keyword relevance  

Given the **ProductCatalog** contains **Product** entries with *name*, *description*, *brand*, and **Category** *categoryName*  
When the customer enters *{keyword}* in the *Search Bar* and submits  
Then the *Search Results* show *{expected_result_count}* matching **Product** entries  
And the results are ranked by relevance with *{expected_top_result}* in position *{expected_top_position}*  
And each result was matched via *{match_field}*  

**Search Results (Then):**  
| scenario | keyword | expected_result_count | expected_top_result | expected_top_position | match_field |  
| --- | --- | --- | --- | --- | --- |  
| 1 | kibble | 1 | Premium Dog Kibble 10kg | 1 | name |  
| 2 | grain-free | 2 | Premium Dog Kibble 10kg | 1 | description |  
| 3 | NutriPaws | 2 | Premium Dog Kibble 10kg | 1 | brand |  
| 4 | tropical | 1 | Tropical Fish Flakes | 1 | name and description |  

---  

### Scenario: No exact results shows suggestions and popular links  

Given the **ProductCatalog** contains the products listed above  
When the customer enters *"hamster wheel"* in the *Search Bar*  
Then the *Search Results* page displays a *"No results found for 'hamster wheel'"* message  
And a *"Try a different keyword"* suggestion is shown  
And popular **Category** links (e.g. *Dog Food*, *Cat Food*) are listed below the message  

---  

### Scenario: Partial keyword returns relevant matches via prefix matching  

Given the **ProductCatalog** contains **Product** *SKU-FOOD-502* *Kitten Wet Food Variety Pack*  
When the customer enters *"kitt"* in the *Search Bar*  
Then the *Search Results* include **Product** *SKU-FOOD-502* *Kitten Wet Food Variety Pack* via prefix matching  
And the result count shows at least *1* match  

---  

### Scenario: Search bar accessible globally  

Given the customer is viewing a *Product Details Page*, *Pet Gallery*, or *Blog Post*  
When the customer enters a keyword in the *Search Bar* (located in the site header)  
Then the results navigate to the *Search Results* page with the keyword pre-filled  

---  

## Story: `Filter Products`  

**ProductCatalog:** with **Product**, **Category**, and **StockAvailability**  
| sku | name | brand | category_name | pet_type | price | available_to_sell_quantity |  
| --- | --- | --- | --- | --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | NutriPaws | Dog Food | dog | 54.99 | 15 |  
| SKU-FOOD-502 | Kitten Wet Food Variety Pack | NutriPaws | Cat Food | cat | 18.99 | 8 |  
| SKU-TOY-220 | Squeaky Bone Chew | PlayPet | Dog Toys | dog | 12.99 | 22 |  
| SKU-AQUA-101 | Tropical Fish Flakes | AquaLife | Fish Food | fish | 7.99 | 0 |  

### Scenario Outline: Filter by facet narrows product list  

Given the **ProductCatalog** is displayed with all active **Product** entries  
When the customer selects *Filter Facet* *{facet_type}* with value *{facet_value}*  
Then the product list shows *{expected_matching_count}* **Product** entries: *{expected_products_shown}*  
And the *Active Filters* show *{facet_value}* as a removable chip  
And each remaining facet shows an updated count reflecting the filtered state  

**Filter Results (Then):**  
| scenario | facet_type | facet_value | expected_products_shown | expected_matching_count |  
| --- | --- | --- | --- | --- |  
| 1 | category | Dog Food | Premium Dog Kibble 10kg | 1 |  
| 2 | pet type | dog | Premium Dog Kibble 10kg, Squeaky Bone Chew | 2 |  
| 3 | brand | NutriPaws | Premium Dog Kibble 10kg, Kitten Wet Food Variety Pack | 2 |  
| 4 | stock availability | In Stock | Premium Dog Kibble 10kg, Kitten Wet Food Variety Pack, Squeaky Bone Chew | 3 |  

---  

### Scenario: Combined filters produce intersection  

Given the **ProductCatalog** is displayed  
When the customer selects *Filter Facet* *pet type* = *dog* AND *Filter Facet* *category* = *Dog Food*  
Then the product list shows *1* product: **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg*  
And the *Active Filters* show both *dog* and *Dog Food* as removable chips  
And facet counts update to reflect the combined filter state  

---  

### Scenario: Filter removal restores products  

Given the customer has *Active Filters* *pet type* = *dog* applied (showing *2* products)  
When the customer removes the *pet type* = *dog* filter  
Then the product list expands to show all *4* **Product** entries  
And the *Active Filters* area is empty  

---  

### Scenario: Zero results with clear-all action  

Given the customer selects *Filter Facet* *pet type* = *fish* AND *Filter Facet* *brand* = *PlayPet*  
When no **Product** entries match the combined filters  
Then a *"No products match your filters"* message is shown  
And a *"Clear all filters"* action is available  
And selecting *"Clear all filters"* restores the full product list  

---  

## Story: `Filter Stores by Availability and Specialization`  

**Store:** with **StockAvailability** and specialisation  
| store_code | store_name | product_specialisation |  
| --- | --- | --- |  
| STORE-CAM | PawPlace Camden | Reptiles, Premium Dog Food |  
| STORE-ISL | PawPlace Islington | Cat Supplies, Bird Supplies |  
| STORE-HAC | PawPlace Hackney | Aquarium Gear |  

**StockAvailability:** with **Store** and **Product**  
| store_code | sku | available_to_sell_quantity |  
| --- | --- | --- |  
| STORE-CAM | SKU-FOOD-501 | 8 |  
| STORE-ISL | SKU-FOOD-501 | 0 |  
| STORE-HAC | SKU-FOOD-501 | 3 |  

### Scenario Outline: Store list filtered by criteria  

Given the **StoreLocator** shows all active **Store** entries  
When the customer filters by *{filter_type}* with value *{filter_value}*  
Then the store list shows *{expected_store_count}* result(s): *{expected_stores_shown}*  
And the *Active Store Filters* show *{filter_value}* as a removable chip  

**Store filter results (Then):**  
| scenario | filter_type | filter_value | expected_stores_shown | expected_store_count |  
| --- | --- | --- | --- | --- |  
| 1 | productSpecialisation | Reptiles | PawPlace Camden (STORE-CAM) | 1 |  
| 2 | Product Availability for SKU-FOOD-501 | availableToSellQuantity > 0 | PawPlace Camden (STORE-CAM), PawPlace Hackney (STORE-HAC) | 2 |  

---  

### Scenario: No stores match combined filters  

Given the customer filters by *productSpecialisation* *Bird Supplies* AND *Product Availability* for **Product** *SKU-FOOD-501*  
When **Store** *PawPlace Islington* matches *Bird Supplies* but has **StockAvailability** *availableToSellQuantity* *0* for *SKU-FOOD-501*  
Then a *"No stores match your filters"* message is shown  
And a *"Clear filters"* action is available  
And selecting *"Clear filters"* restores the full store list  

---  

## Story: `Set My Store Preference`  

**CustomerAccount:**  
| customer_email | first_name | preferred_store_code |  
| --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | — |  

**Store:**  
| store_code | store_name |  
| --- | --- |  
| STORE-CAM | PawPlace Camden |  
| STORE-ISL | PawPlace Islington |  

### Scenario: Preferred store saved and persisted across sessions  

Given **CustomerAccount** *tom.nguyen@pawplace.example* is logged in with no *preferredStore* set  
When **CustomerAccount** *tom.nguyen@pawplace.example* selects *"Set as My Store"* on **Store** *PawPlace Camden* *STORE-CAM*  
Then **CustomerAccount** *preferredStore* is saved as **Store** *STORE-CAM*  
And the **Store** detail page shows a *"My Store"* badge on *PawPlace Camden*  
And the preference persists across sessions and devices  

---  

### Scenario: Preference change replaces previous selection  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has *preferredStore* **Store** *STORE-CAM* *PawPlace Camden*  
When **CustomerAccount** *tom.nguyen@pawplace.example* selects *"Set as My Store"* on **Store** *PawPlace Islington* *STORE-ISL*  
Then **CustomerAccount** *preferredStore* is updated to **Store** *STORE-ISL*  
And the *"My Store"* badge moves to *PawPlace Islington*  
And the tailored experience reflects **Store** *PawPlace Islington* immediately  

---  

### Scenario: Guest prompted to log in for store preference  

Given a guest visitor (no **CustomerAccount** session) is viewing **Store** *PawPlace Camden*  
When the guest selects *"Set as My Store"*  
Then a prompt to log in or register is shown  
And the **Store** detail page remains in view — no navigation away  

---  

## Story: `Tailor Experience to Preferred Store`  

**CustomerAccount:** with preferred **Store**  
| customer_email | preferred_store_code |  
| --- | --- |  
| tom.nguyen@pawplace.example | STORE-CAM |  
| new.user@pawplace.example | — |  

**StockAvailability:** with **Store** and **Product**  
| store_code | sku | available_to_sell_quantity |  
| --- | --- | --- |  
| STORE-CAM | SKU-FOOD-501 | 8 |  
| STORE-ISL | SKU-FOOD-501 | 0 |  

### Scenario Outline: Product page tailoring based on preferred store setting  

Given **CustomerAccount** *{customer_email}* has *preferredStore* *{preferred_store_code}*  
When **CustomerAccount** *{customer_email}* views the *Product Details Page* for **Product** *SKU-FOOD-501*  
Then *{expected_stock_display}*  
And *{expected_store_highlight}*  

**Store tailoring (Then):**  
| scenario | customer_email | preferred_store_code | expected_stock_display | expected_store_highlight |  
| --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | STORE-CAM | StockAvailability defaults to PawPlace Camden showing availableToSellQuantity 8 | StoreLocator highlights PawPlace Camden with "My Store" badge |  
| 2 | new.user@pawplace.example | — | StockAvailability shown without store-specific default (general catalog view) | StoreLocator displays all stores equally — no highlight |  

---  

### Scenario: Click-and-collect pre-selects preferred store  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has *preferredStore* **Store** *STORE-CAM* *PawPlace Camden*  
When **CustomerAccount** *tom.nguyen@pawplace.example* enters checkout with **ClickAndCollect** as *deliveryOption*  
Then **Store** *PawPlace Camden* is pre-selected as the *selectedPickupStore*  
And the full **Store** list remains available for selecting a different store  

---  

## Story: `Create Pet Profile`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario Outline: Pet profile created and listed in My Pets  

Given **CustomerAccount** *{customer_email}* is logged in  
When **CustomerAccount** *{customer_email}* creates a **PetProfile** with *petName* *{pet_name}*, *petSpecies* *{pet_species}*, *petBreed* *{pet_breed}*, *dateOfBirthOrApproximateAge* *{age}*, *knownAllergies* *{known_allergies}*, *preferredFoodType* *{preferred_food_type}*, and *specialDietaryRequirements* *{special_dietary_requirements}*  
Then the **PetProfile** is saved to the **CustomerAccount** with *{expected_stored_fields}*  
And **PetProfile** *{pet_name}* appears under *"My Pets"* displaying *{expected_card_summary}*  

**PetProfile creation (Then):**  
| scenario | customer_email | pet_name | pet_species | pet_breed | age | known_allergies | preferred_food_type | special_dietary_requirements | expected_stored_fields | expected_card_summary |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | Max | dog | Golden Retriever | 3 years | chicken | grain-free dry kibble | high-protein | all 7 fields populated | "Max · dog · Golden Retriever · 3 years" |  
| 2 | tom.nguyen@pawplace.example | Whiskers | cat | — | — | — | — | — | petName and petSpecies only; optional fields blank | "Whiskers · cat" |  

---  

### Scenario: Multiple pet profiles listed with details  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **PetProfile** *"Max"* (*dog*, *Golden Retriever*) and **PetProfile** *"Whiskers"* (*cat*)  
When **CustomerAccount** *tom.nguyen@pawplace.example* opens *"My Pets"*  
Then the page lists *2* **PetProfile** entries  
And **PetProfile** *"Max"* card shows *dog · Golden Retriever · 3 years*  
And **PetProfile** *"Whiskers"* card shows *cat*  

---  

### Scenario: Guest prompted to log in for pet profile  

Given a guest visitor (no **CustomerAccount** session)  
When the guest attempts to create a **PetProfile**  
Then a prompt to log in or register is shown  

---  

## Story: `Update Pet Profile`  

**PetProfile:** with **CustomerAccount**  
| customer_email | pet_name | pet_species | pet_breed | known_allergies | preferred_food_type | special_dietary_requirements |  
| --- | --- | --- | --- | --- | --- | --- |  
| tom.nguyen@pawplace.example | Max | dog | Golden Retriever | chicken | grain-free dry kibble | high-protein |  

### Scenario: Pet profile fields updated successfully  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **PetProfile** *"Max"* with *preferredFoodType* *"grain-free dry kibble"*  
When **CustomerAccount** *tom.nguyen@pawplace.example* updates **PetProfile** *"Max"* *preferredFoodType* to *"raw diet"*  
Then the updated **PetProfile** shows *preferredFoodType* as *"raw diet"* immediately  
And personalised recommendations reflect the update on the next recommendation cycle  

---  

### Scenario: Allergen exclusion applied to product recommendations  

Given **PetProfile** *"Max"* has *knownAllergies* *"chicken"* and *specialDietaryRequirements* *"high-protein"*  
And **PetProfile** *enablePersonalisedRecommendations* is *true*  
When the system generates recommendations via **PetProfile** *recommendProducts* using the **ProductCatalog**  
Then the recommendation list includes only **Product** entries compatible with *high-protein* *specialDietaryRequirements*  
And every recommended **Product** is free of *chicken* ingredients per *knownAllergies*  

---  

### Scenario: Pet profile deleted with confirmation  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **PetProfile** *"Max"*  
When **CustomerAccount** *tom.nguyen@pawplace.example* deletes **PetProfile** *"Max"*  
Then a *"Are you sure you want to remove Max?"* confirmation prompt is shown  
And upon confirmation, **PetProfile** *"Max"* is removed from *"My Pets"*  
And the *"My Pets"* page refreshes showing the remaining profiles  

---  

## Story: `View Inventory Dashboard`  

**Store:**  
| store_code | store_name |  
| --- | --- |  
| STORE-CAM | PawPlace Camden |  

**StockAvailability:** with **Product** at **Store** *STORE-CAM*  
| sku | name | category_name | quantity_on_hand | reserved_quantity | available_to_sell_quantity | reorder_point | reorder_quantity | low_stock_threshold | last_restocked_date | expected_restock_date |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | Dog Food | 20 | 5 | 15 | 10 | 50 | 12 | 2026-04-28 | — |  
| SKU-TOY-220 | Squeaky Bone Chew | Dog Toys | 6 | 2 | 4 | 5 | 30 | 8 | 2026-04-15 | — |  
| SKU-TREAT-400 | Dental Chew Sticks | Dog Treats | 3 | 1 | 2 | 5 | 25 | 5 | 2026-04-01 | 2026-05-15 |  

### Scenario: Full inventory dashboard displayed with stock data  

Given a *Store Owner* for **Store** *PawPlace Camden* *STORE-CAM*  
When the *Store Owner* opens the *Inventory Dashboard*  
Then all **Product** entries at **Store** *STORE-CAM* are listed with **StockAvailability** data  
And each row shows: **Product** *name*, **Category** *categoryName*, *quantityOnHand*, *reservedQuantity*, *availableToSellQuantity*, *reorderPoint*, and *lastRestockedDate*  
And the dashboard supports search, sort (by *name*, *availableToSellQuantity*, *categoryName*), and filter  

---  

### Scenario Outline: Low stock and reorder indicators shown by stock level  

Given **Product** *{sku}* *{name}* at **Store** *STORE-CAM* has **StockAvailability** *availableToSellQuantity* *{available_to_sell_quantity}* with *lowStockThreshold* *{low_stock_threshold}* and *reorderPoint* *{reorder_point}*  
When the *Store Owner* views the *Inventory Dashboard*  
Then **Product** *{sku}* row shows *{expected_indicator}*  
And the row displays *{expected_badge}*  
And *{expected_additional_detail}*  

**StockAvailability indicators (Then):**  
| scenario | sku | name | available_to_sell_quantity | low_stock_threshold | reorder_point | expected_indicator | expected_badge | expected_additional_detail |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | SKU-FOOD-501 | Premium Dog Kibble 10kg | 15 | 12 | 10 | green status — above thresholds | no badge | standard stock row with lastRestockedDate 2026-04-28 |  
| 2 | SKU-TOY-220 | Squeaky Bone Chew | 4 | 8 | 5 | amber status — below lowStockThreshold | "Low Stock" badge | "Low stock only" filter available to isolate these rows |  
| 3 | SKU-TREAT-400 | Dental Chew Sticks | 2 | 5 | 5 | red status — below reorderPoint | "Reorder Needed" badge with reorderQuantity 25 | expectedRestockDate 2026-05-15 shown in row |  

---  

### Scenario: Stock edit from dashboard persists and updates customer-facing data  

Given the *Store Owner* views **Product** *SKU-TOY-220* on the *Inventory Dashboard* with *quantityOnHand* *6*  
When the *Store Owner* updates *quantityOnHand* to *40* via **StockAvailability** *updateQuantityOnHand*  
Then *availableToSellQuantity* recalculates to *38* (40 − *reservedQuantity* *2*)  
And the customer-facing **Product** page reflects the updated **StockAvailability** in real time  
And the *Inventory Dashboard* row for *SKU-TOY-220* updates to show *quantityOnHand* *40* and *availableToSellQuantity* *38*  

---  

### Scenario: CSV export covers store owner's store only  

Given a *Store Owner* for **Store** *PawPlace Camden* *STORE-CAM*  
When the *Store Owner* exports inventory data as CSV  
Then the export includes columns: **Product** *name*, **Category** *categoryName*, *quantityOnHand*, *availableToSellQuantity*, *reorderPoint*, *lastRestockedDate*, and last updated timestamp  
And the export covers **Store** *STORE-CAM* only  
And the CSV filename includes the store code and export date (e.g. *STORE-CAM-inventory-2026-05-08.csv*)  

---  

### Scenario: Dashboard replaces bare-bones admin stock form  

Given the *Inventory Dashboard* is deployed as part of Increment 9  
When the *Store Owner* accesses the inventory management area  
Then the *Inventory Dashboard* replaces the bare-bones *Admin Stock Form* from Increment 1  
And all existing **StockAvailability** data is intact — no data migration loss  

---  

## Story: `Display Low Stock Badge`  

**Product:** with **StockAvailability**  
| sku | name | available_to_sell_quantity | low_stock_threshold | backorder_enabled |  
| --- | --- | --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | 15 | 12 | false |  
| SKU-TOY-220 | Squeaky Bone Chew | 3 | 8 | false |  
| SKU-TREAT-400 | Dental Chew Sticks | 0 | 5 | false |  
| SKU-AQUA-101 | Tropical Fish Flakes | 0 | 5 | true |  

### Scenario Outline: Low stock badge displayed based on available-to-sell quantity  

Given **Product** *{sku}* *{name}* has **StockAvailability** *availableToSellQuantity* *{available_to_sell_quantity}* and *lowStockThreshold* *{low_stock_threshold}*  
When a customer views the *Product Listing* or *Product Details Page* for **Product** *{sku}*  
Then the product shows *{expected_badge_display}*  
And *"Add to Cart"* is *{expected_cart_button_state}*  
And the stock indicator reads *{expected_stock_label}*  

**Badge display (Then):**  
| scenario | sku | name | available_to_sell_quantity | low_stock_threshold | expected_badge_display | expected_cart_button_state | expected_stock_label |  
| --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | SKU-FOOD-501 | Premium Dog Kibble 10kg | 15 | 12 | no badge — standard display | enabled | "In Stock" |  
| 2 | SKU-TOY-220 | Squeaky Bone Chew | 3 | 8 | "Low Stock" badge with "Only 3 left" | enabled | "Low Stock — Only 3 left" |  
| 3 | SKU-TREAT-400 | Dental Chew Sticks | 0 | 5 | "Out of Stock" indicator replaces badge | disabled | "Out of Stock" |  

---  

### Scenario: Badge appears on stock level change  

Given **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* has **StockAvailability** *availableToSellQuantity* *15* (above *lowStockThreshold* *12*)  
When staff updates **StockAvailability** *quantityOnHand* causing *availableToSellQuantity* to drop to *10*  
Then the *"Low Stock"* badge with *"Only 10 left"* appears on subsequent page loads for **Product** *SKU-FOOD-501*  
And the stock indicator changes from *"In Stock"* to *"Low Stock — Only 10 left"*  

---  

## Story: `Allow Backorder Purchase`  

**Product:** with **StockAvailability**  
| sku | name | available_to_sell_quantity | backorder_enabled | expected_restock_date |  
| --- | --- | --- | --- | --- |  
| SKU-AQUA-101 | Tropical Fish Flakes | 0 | true | 2026-05-20 |  
| SKU-TREAT-400 | Dental Chew Sticks | 0 | false | — |  

### Scenario Outline: Out-of-stock product page behavior based on backorder setting  

Given **Product** *{sku}* *{name}* has **StockAvailability** *availableToSellQuantity* *{available_to_sell_quantity}* and *backorderEnabled* *{backorder_enabled}*  
And **StockAvailability** *expectedRestockDate* is *{expected_restock_date}*  
When a customer views the *Product Details Page* for **Product** *{sku}*  
Then the page shows *{expected_stock_indicator}*  
And *"Add to Cart"* is *{expected_cart_button_state}*  
And *{expected_restock_display}*  

**Backorder display (Then):**  
| scenario | sku | name | available_to_sell_quantity | backorder_enabled | expected_restock_date | expected_stock_indicator | expected_cart_button_state | expected_restock_display |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | SKU-AQUA-101 | Tropical Fish Flakes | 0 | true | 2026-05-20 | "Backorder" indicator | enabled | expectedRestockDate 2026-05-20 displayed to customer |  
| 2 | SKU-TREAT-400 | Dental Chew Sticks | 0 | false | — | "Out of Stock" indicator | disabled | stock indicator only — no restock date available |  

---  

### Scenario: Backorder item shown in cart with label and expected date  

Given **CustomerAccount** *tom.nguyen@pawplace.example* adds **Product** *SKU-AQUA-101* *Tropical Fish Flakes* to the **ShoppingCart**  
And **Product** *SKU-AQUA-101* has *backorderEnabled* *true* with *expectedRestockDate* *2026-05-20*  
When **CustomerAccount** *tom.nguyen@pawplace.example* views the **ShoppingCart**  
Then the **CartItem** for **Product** *SKU-AQUA-101* shows a *"Backorder"* label and *expectedRestockDate* *2026-05-20*  
And a message reads *"Delivery will be delayed until restock (estimated 2026-05-20)"*  

---  

### Scenario: Checkout with backorder item accepted and payment processed  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has a **ShoppingCart** containing **CartItem** **Product** *SKU-AQUA-101* with *backorderEnabled* *true*  
When **CustomerAccount** *tom.nguyen@pawplace.example* proceeds to checkout via **ShoppingCart** *transitionToCheckout*  
Then the **Order** summary shows the *backorder status* and *expectedRestockDate* *2026-05-20* for **OrderLineItem** *SKU-AQUA-101*  
And the **Order** is accepted  
And **Payment** is processed normally via the selected **PaymentVendor**  


---

## increment-9-sprint-1-search-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 9 Sprint 1 — Product search and filter
stories:
  - Search Products by Keyword
  - Filter Products
---

# Specification by Example — Increment 9 Sprint 1: Product search and filter

**Sources / context:** `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/specification/power-ups-search-domain.json`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Search Products by Keyword, Filter Products)

---

## Story: Search Products by Keyword

**Story type:** user

**Sources / context:** power-ups-search-crc.md (Product Search, Search Results), acceptance-criteria.md (Search Products by Keyword AC 1–5)

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

**Sources / context:** power-ups-search-crc.md (Filter Facet, Active Filter, Price Range Filter Facet), acceptance-criteria.md (Filter Products AC 1–6)

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


---

## increment-9-sprint-2-stores-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 9 Sprint 2 — Store preference and tailoring
stories:
  - Filter Stores by Availability and Specialization
  - Set My Store Preference
  - Tailor Experience to Preferred Store
---

# Specification by Example — Increment 9 Sprint 2: Store preference and tailoring

**Sources / context:** `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/specification/power-ups-stores-domain.json`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Filter Stores, Set My Store Preference, Tailor Experience to Preferred Store)

---

## Story: Filter Stores by Availability and Specialization

**Story type:** user

**Sources / context:** power-ups-stores-crc.md (Store Specialization Filter, Product Availability Filter), acceptance-criteria.md (Filter Stores AC 1–5)

---

## Background

Given **Store Locator** lists **Store** *STR-001* (*Downtown PawPlace*) with **Store Specialization** *reptile section*
  And **Store Locator** lists **Store** *STR-002* (*Westside PawPlace*) with **Store Specialization** *premium dog food*
  And **Stock Availability** for **Product** *PET-REP-055* (*Reptile Heat Lamp*) at **Store** *STR-001* is *in stock*
  And **Stock Availability** for **Product** *PET-REP-055* at **Store** *STR-002* is *out of stock*

---

### Scenario 1: Store locator exposes specialization and product availability filter dimensions

When the customer opens **Store Locator**
Then **Store Specialization Filter** and **Product Availability Filter** dimensions are available

### Scenario 2: Specialization filter shows only matching stores

When the customer applies **Store Specialization Filter** *reptile section* on **Store Locator**
Then **Store Locator** shows only **Store** *STR-001* (*Downtown PawPlace*)
  And **Store** *STR-002* (*Westside PawPlace*) is excluded

### Scenario 3: Product availability filter shows only in-stock stores for selected product

When the customer applies **Product Availability Filter** for **Product** *PET-REP-055* (*Reptile Heat Lamp*) on **Store Locator**
Then **Store Locator** shows only **Store** *STR-001* where **Stock Availability** indicates *in stock*
  And **Store** *STR-002* is excluded

### Scenario 4: Combined filters apply conjunctive narrowing

Given **Store Specialization Filter** *reptile section* is active on **Store Locator**
When the customer also applies **Product Availability Filter** for **Product** *PET-REP-055*
Then **Store Locator** shows only **Store** *STR-001* — matching both **Store Specialization** and **Stock Availability**

### Scenario 5: Zero-match filter combination offers clear filters action

Given **Store Specialization Filter** *premium dog food* is active
  And **Product Availability Filter** for **Product** *PET-REP-055* is active
  And no **Store** matches both filters
When **Store Locator** evaluates the combined filters
Then **Store Locator** shows *no stores match your filters* with a *clear filters* action

---

## Story: Set My Store Preference

**Story type:** user

**Sources / context:** power-ups-stores-crc.md (My Store, Customer Account, Account Settings), acceptance-criteria.md (Set My Store Preference AC 1–4)

---

## Background

Given **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Store** *STR-001* (*Downtown PawPlace*) and **Store** *STR-002* (*Westside PawPlace*) exist

---

### Scenario 1: Logged-in customer sets my store from store detail with cross-session persistence

When **Customer Account** *Tom Nguyen* selects *Set as My Store* for **Store** *STR-001* on the store detail page
Then **My Store** for **Customer Account** *tom.nguyen@pawplace.example* is saved as **Store** *STR-001*
  And **My Store** persists across sessions and devices on **Customer Account** *tom.nguyen@pawplace.example*

### Scenario 2: Changing my store replaces previous preference immediately

Given **Customer Account** *tom.nguyen@pawplace.example* has **My Store** *STR-001*
When **Customer Account** *Tom Nguyen* sets **My Store** to **Store** *STR-002* from **Account Settings**
Then **My Store** for **Customer Account** *tom.nguyen@pawplace.example* is *STR-002* — replacing *STR-001* immediately
  And **Tailored Experience** reflects **Store** *STR-002* without delay

### Scenario 3: No my store preserves default increment behavior

Given **Customer Account** *tom.nguyen@pawplace.example* has no **My Store** set
When **Customer Account** *Tom Nguyen* views a product page or **Store Locator**
Then no store-specific **Tailored Experience** is applied
  And default behavior from prior increments is preserved

### Scenario 4: Guest cannot set my store without leaving current page

Given no **Customer Account** session exists (*guest*)
  And the guest is on **Store** *STR-001* detail page at route */stores/STR-001*
When the guest selects *Set as My Store*
Then **Account Settings** prompts to *log in or register*
  And the browser remains on */stores/STR-001* — no navigation away

---

## Story: Tailor Experience to Preferred Store

**Story type:** system

**Sources / context:** power-ups-stores-crc.md (Tailored Experience, Stock Availability, Click-and-Collect), acceptance-criteria.md (Tailor Experience AC 1–4)

---

## Background

Given **Customer Account** *tom.nguyen@pawplace.example* has **My Store** *STR-001* (*Downtown PawPlace*)
  And **Stock Availability** for **Product** *PET-KIT-001* at **Store** *STR-001* is *12 available*
  And **Stock Availability** for **Product** *PET-KIT-001* at **Store** *STR-002* is *3 available*

---

### Scenario 1: Product page stock defaults to preferred store

When **Customer Account** *Tom Nguyen* views the product page for **Product** *PET-KIT-001*
Then **Stock Availability** defaults to **Store** *STR-001* showing *12 available*
  And **Customer Account** *Tom Nguyen* sees local availability without manual **Store** selection

### Scenario 2: Store locator highlights preferred store

When **Customer Account** *Tom Nguyen* opens **Store Locator**
Then **Store** *STR-001* is visually highlighted as **My Store**

### Scenario 3: Click-and-collect checkout pre-selects preferred store with override list

When **Customer Account** *Tom Nguyen* enters **Click-and-Collect** checkout store selection
Then **Store** *STR-001* is pre-selected as **My Store**
  And the full **Store** list including **Store** *STR-002* remains available for override

### Scenario 4: Preference change updates tailoring immediately

Given **Customer Account** *tom.nguyen@pawplace.example* changes **My Store** from *STR-001* to *STR-002*
When **Customer Account** *Tom Nguyen* next views a product page
Then **Stock Availability** defaults to **Store** *STR-002* — not *STR-001*

### Scenario 5: No my store leaves prior increment defaults unchanged

Given **Customer Account** *sam.lee@pawplace.example* has no **My Store** set
When **Customer Account** *Sam Lee* views a product page and opens **Store Locator**
Then **Tailored Experience** applies no store-specific defaults
  And product **Stock Availability** and **Store Locator** behave as in prior increments


---

## increment-9-sprint-3-inventory-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 9 Sprint 3 — Pet profiles and inventory power-ups
stories:
  - Create Customer Pet
  - Update Customer Pet
  - View Inventory Dashboard
  - Display Low Stock Badge
  - Allow Backorder Purchase
---

# Specification by Example — Increment 9 Sprint 3: Pet profiles and inventory power-ups

**Sources / context:** `docs/increments/9-power-ups/specification/crc.md`, `docs/increments/9-power-ups/specification/power-ups-pet-inventory-domain.json`, `docs/increments/9-power-ups/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 3 pet and inventory stories)

---

## Story: Create Customer Pet

**Story type:** user

**Sources / context:** power-ups-pet-inventory-crc.md (Customer Pet Profile, Customer Pet Profiles), acceptance-criteria.md (Create Customer Pet AC 1–5)

---

### Scenario 1: Logged-in customer sees pet list or empty state on My Pets

Given **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
When **Customer Account** *Tom Nguyen* opens **Customer Pet Profiles** from **Account Settings** *My Pets*
Then **Customer Pet Profiles** displays existing **Customer Pet Profile** entries
  Or an empty state *add your first pet* when none exist

### Scenario 2: New pet profile saves required and optional fields to customer account

When **Customer Account** *Tom Nguyen* creates **Customer Pet Profile** *Mochi* with species *cat*, breed *Domestic Shorthair*, age *2 years*, and photo *mochi.jpg*
Then **Customer Pet Profile** *Mochi* is saved to **Customer Account** *tom.nguyen@pawplace.example*
  And species *cat* and breed *Domestic Shorthair* feed downstream personalized recommendation algorithms

### Scenario 3: Multiple pets each have separate profile entries under My Pets

Given **Customer Account** *tom.nguyen@pawplace.example* has **Customer Pet Profile** *Mochi* (species *cat*)
When **Customer Account** *Tom Nguyen* creates **Customer Pet Profile** *Rex* (species *dog*, breed *Labrador*)
Then **Customer Pet Profiles** lists both **Customer Pet Profile** *Mochi* and **Customer Pet Profile** *Rex* under *My Pets*

### Scenario 4: Guest prompted to log in without leaving current page

Given no **Customer Account** session exists (*guest*)
  And the guest is on **Account Settings** route */account/pets/new*
When the guest attempts to create a **Customer Pet Profile**
Then **Account Settings** prompts to *log in or register*
  And the browser remains on */account/pets/new*

---

## Story: Update Customer Pet

**Story type:** user

**Sources / context:** power-ups-pet-inventory-crc.md (Customer Pet Profile update/delete), acceptance-criteria.md (Update Customer Pet — CRC refs)

---

### Scenario 1: All profile fields editable with immediate persist

Given **Customer Account** *tom.nguyen@pawplace.example* has **Customer Pet Profile** *Mochi* with species *cat*, breed *Domestic Shorthair*, age *2 years*
When **Customer Account** *Tom Nguyen* opens **Customer Pet Profile** *Mochi* for editing and changes breed to *Siamese* and age to *3 years*
Then **Customer Pet Profile** *Mochi* persists breed *Siamese* and age *3 years* immediately on **Customer Account** *tom.nguyen@pawplace.example*

### Scenario 2: Delete removes profile after confirmation prompt

Given **Customer Account** *tom.nguyen@pawplace.example* has **Customer Pet Profile** *Rex*
When **Customer Account** *Tom Nguyen* deletes **Customer Pet Profile** *Rex* and confirms *are you sure*
Then **Customer Pet Profile** *Rex* is removed from **Customer Pet Profiles** under *My Pets*

---

## Story: View Inventory Dashboard

**Story type:** store employee

**Sources / context:** power-ups-pet-inventory-crc.md (Inventory Dashboard, Stock Level, Inventory Export), acceptance-criteria.md (View Inventory Dashboard AC 1–6)

---

## Background

Given **Store Staff** *jamie.wells@pawplace.example* is authenticated for **Store** *STR-001*
  And **Inventory Dashboard** lists **Product** *Premium Kitten Food* (**sku** *PET-KIT-001*, **Category** *food*) with **Stock Level** *12*
  And **Inventory Dashboard** lists **Product** *Reptile Heat Lamp* (**sku** *PET-REP-055*, **Category** *habitat*) with **Stock Level** *3*

---

### Scenario 1: Dashboard lists store products with search sort and filter

When **Store Staff** *Jamie Wells* opens **Inventory Dashboard** for **Store** *STR-001*
Then all **Product** entries at **Store** *STR-001* display current **Stock Level** values
  And **Inventory Dashboard** supports search, sort by name/**Stock Level**/**Category**, and filter

### Scenario 2: Inline stock edit persists immediately to customer-facing availability

When **Store Staff** *Jamie Wells* edits **Stock Level** for **Product** *PET-KIT-001* from *12* to *18* on **Inventory Dashboard**
Then **Stock Level** *18* persists immediately
  And customer-facing **Stock Availability** for **Product** *Premium Kitten Food* at **Store** *STR-001* updates in real time

### Scenario 3: Increment 9 deployment preserves existing stock data

Given stock data existed on the Increment 1 bare-bones form before deployment
When **Store Staff** *Jamie Wells* opens **Inventory Dashboard** for the first time after Increment 9 deployment
Then **Inventory Dashboard** replaces the prior form
  And all existing **Stock Level** data is intact — no migration loss

### Scenario 4: Inventory export produces store-scoped CSV

When **Store Staff** *Jamie Wells* runs **Inventory Export** on **Inventory Dashboard**
Then **Inventory Export** downloads a CSV with **Product** name, **Category**, current **Stock Level**, and last updated timestamp per row
  And **Inventory Export** covers **Store** *STR-001* only — not multi-store

### Scenario 5: Invalid stock level rejected with previous value preserved

When **Store Staff** *Jamie Wells* enters **Stock Level** *-5* for **Product** *PET-KIT-001*
Then **Inventory Dashboard** rejects the update with a clear error
  And **Stock Level** remains *12* — unchanged

---

## Story: Display Low Stock Badge

**Story type:** system

**Sources / context:** power-ups-pet-inventory-crc.md (Low Stock Alert, Low Stock Threshold), acceptance-criteria.md (Display Low Stock Badge AC 1–5)

---

### Scenario 1: Stock below threshold shows low stock alert badge

Given **Product** *PET-REP-055* has **Low Stock Threshold** *5* and **Stock Level** *3* at **Store** *STR-001*
When **Store Staff** *Jamie Wells* views **Inventory Dashboard**
Then **Low Stock Alert** badge *Low stock* appears on **Product** *Reptile Heat Lamp* row

### Scenario 2: Stock at or above threshold hides badge

Given **Product** *PET-KIT-001* has **Low Stock Threshold** *5* and **Stock Level** *12*
When **Store Staff** *Jamie Wells* views **Inventory Dashboard**
Then no **Low Stock Alert** badge appears on **Product** *Premium Kitten Food* row

### Scenario 3: Raising stock above threshold removes badge on next view

Given **Product** *PET-REP-055* had **Stock Level** *3* below **Low Stock Threshold** *5*
When **Store Staff** *Jamie Wells* raises **Stock Level** to *8*
Then **Low Stock Alert** badge disappears on the next **Inventory Dashboard** view

### Scenario 4: Low stock only filter lists replenishment candidates

Given **Product** *PET-REP-055* has **Stock Level** *3* below threshold and **Product** *PET-KIT-001* has **Stock Level** *12* above threshold
When **Store Staff** *Jamie Wells* activates *low stock only* filter on **Inventory Dashboard**
Then only **Product** *Reptile Heat Lamp* is shown

### Scenario 5: Zero stock supersedes low stock alert with out-of-stock indicator

Given **Product** *PET-REP-055* **Stock Level** reaches *0*
When **Store Staff** *Jamie Wells* views **Inventory Dashboard**
Then **Product** *Reptile Heat Lamp* row shows *out of stock* indicator
  And **Low Stock Alert** badge is superseded — not shown alongside out-of-stock

---

## Story: Allow Backorder Purchase

**Story type:** system

**Sources / context:** power-ups-pet-inventory-crc.md (Backorder Purchase, Stock Availability), acceptance-criteria.md (Allow Backorder Purchase AC 1–5)

---

### Scenario 1: Backorder-enabled out-of-stock product allows add to cart

Given **Product** *Exotic Fish Filter* (**sku** *PET-FLT-099*) has **Stock Availability** *out of stock*
  And **Backorder Purchase** is *enabled* for **Product** *PET-FLT-099*
When the customer views the product page for **Product** *Exotic Fish Filter*
Then the page shows *Backorder* indicator instead of *Out of Stock*
  And *Add to Cart* is available

### Scenario 2: Backordered line item labeled in cart and checkout

When the customer adds **Product** *Exotic Fish Filter* to cart on **Backorder Purchase**
Then the cart line shows a backorder label
  And checkout order summary shows backorder status for **Product** *Exotic Fish Filter*
  And payment processes normally

### Scenario 3: Non-backorder out-of-stock retains prior increment gate

Given **Product** *PET-REP-055* has **Stock Availability** *out of stock*
  And **Backorder Purchase** is *not enabled* for **Product** *PET-REP-055*
When the customer views the product page
Then the page shows *Out of Stock*
  And *Add to Cart* is disabled — no backorder option

### Scenario 4: Restocking restores normal in-stock purchase flow

Given **Product** *Exotic Fish Filter* was on **Backorder Purchase** with **Stock Level** *0*
When **Stock Level** rises to *5* above zero
Then **Stock Availability** shows *In Stock*
  And standard purchase flow resumes — **Backorder Purchase** indicator removed
