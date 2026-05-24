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
