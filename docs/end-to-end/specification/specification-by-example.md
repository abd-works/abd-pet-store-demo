# Specification By Example


---

## increment-1 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 1

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification by Example — Increment 1: Walk-in driver — find the store, see what's in stock  

**Refresh:** Run 2 slot 27 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/specification/crc.md`, and `acceptance-criteria.md` (canonical *store locator*, *map view*, *stock level*, *admin dashboard*).

---  

## Story: `View Store Map`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Store:  

| scenario | store_name | store_code | address_line_one | city | postcode | latitude | longitude | phone_number | email_address | active_status |  
|---|---|---|---|---|---|---|---|---|---|---|  
| 1 | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP | 51.5392 | -0.1426 | 020-7946-0001 | camden@pawplace.co.uk | true |  
| 2 | PawPlace Bristol | STR-002 | 15 Harbour Road | Bristol | BS1 4DJ | 51.4545 | -2.5879 | 0117-496-0002 | bristol@pawplace.co.uk | true |  
| 3 | PawPlace Manchester | STR-003 | 8 Deansgate | Manchester | M3 2FF | 53.4808 | -2.2426 | 0161-496-0003 | manchester@pawplace.co.uk | true |  

---  

### Scenario Outline 1: `All stores visible on map without login`  

Given the **Store Locator** has **Store** *{store_name}* with **storeCode** *{store_code}* at coordinates *{latitude}*, *{longitude}*  
And the visitor is not logged in  
When the visitor opens the **Store Locator** *map view*  
Then a selectable point appears at latitude *{latitude}* and longitude *{longitude}* for **Store** *{store_name}*  

### Scenario Outline 2: `Store details shown on selection`  

Given the **Store Locator** *map view* is displaying **Store** *{store_name}*  
When the visitor selects the map point for **Store** *{store_name}*  
Then the system displays **addressLineOne** *{address_line_one}*, **city** *{city}*, **postcode** *{postcode}*  
And the system displays **phoneNumber** *{phone_number}* and **emailAddress** *{email_address}*  

### Scenario 3: `All stores shown simultaneously without search`  

Given the **Store Locator** contains *3* active **Store** entries  
When the visitor opens the **Store Locator** *map view*  
Then all *3* **Store** locations are visible simultaneously  
And no search or filter is required to see them  

---  

## Story: `View Store List`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Store:  

| scenario | store_name | store_code | address_line_one | city | postcode | phone_number | email_address |  
|---|---|---|---|---|---|---|---|  
| all | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP | 020-7946-0001 | camden@pawplace.co.uk |  
| all | PawPlace Bristol | STR-002 | 15 Harbour Road | Bristol | BS1 4DJ | 0117-496-0002 | bristol@pawplace.co.uk |  
| all | PawPlace Manchester | STR-003 | 8 Deansgate | Manchester | M3 2FF | 0161-496-0003 | manchester@pawplace.co.uk |  

---  

### Scenario Outline 1: `All stores listed without login`  

Given the **Store Locator** has **Store** *{store_name}* with **storeCode** *{store_code}*  
And the visitor is not logged in  
When the visitor opens the **Store Locator** *list view*  
Then the list shows **Store** *{store_name}* with **addressLineOne** *{address_line_one}*, **city** *{city}*  

### Scenario Outline 2: `Store details shown on list selection`  

Given the **Store Locator** *list view* is displaying **Store** *{store_name}*  
When the visitor selects **Store** *{store_name}* from the *list view*  
Then the system displays **addressLineOne** *{address_line_one}*, **city** *{city}*, **postcode** *{postcode}*  
And the system displays **phoneNumber** *{phone_number}* and **emailAddress** *{email_address}*  

### Scenario 3: `All stores appear without search or filtering`  

Given the **Store Locator** contains *3* active **Store** entries  
When the visitor opens the **Store Locator** *list view*  
Then all *3* **Store** entries are visible without requiring search or filtering  

---  

## Story: `Calculate Distance to Store`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Store:  

| scenario | store_name | store_code | latitude | longitude | expected_distance_km | expected_sort_position |  
|---|---|---|---|---|---|---|  
| all | PawPlace Camden | STR-001 | 51.5392 | -0.1426 | 3.7 | 1 |  
| all | PawPlace Bristol | STR-002 | 51.4545 | -2.5879 | 171.2 | 2 |  
| all | PawPlace Manchester | STR-003 | 53.4808 | -2.2426 | 263.4 | 3 |  

### CustomerLocation:  

| scenario | location_method | customer_latitude | customer_longitude | customer_postcode |  
|---|---|---|---|---|  
| shared_location | Shared Location | 51.5074 | -0.1278 | — |  
| entered_postcode | Postcode Entry | — | — | EC1A 1BB |  
| no_location | None | — | — | — |  

---  

### Scenario Outline 1: `Stores sorted nearest-first when location provided`  

Given the **Store Locator** contains **Store** *{store_name}* at coordinates *{latitude}*, *{longitude}*  
And the customer provides location via *{location_method}*  
When the **Store Locator** calculates distance using **calculate distance from customer** for each **Store**  
Then **Store** *{store_name}* shows distance *{expected_distance_km}* km  
And **Store** *{store_name}* appears at sort position *{expected_sort_position}* in the **sort nearest-first** ordering  

### Scenario 2: `No distance shown when location not provided`  

Given the **Store Locator** contains *3* active **Store** entries  
And the customer has not provided any location  
When the visitor opens the **Store Locator**  
Then all **Store** entries are displayed without distance information  
And stores appear in their default order  

### Scenario 3: `Distance recalculates on location change`  

Given the customer previously provided *Shared Location* with latitude *51.5074*, longitude *-0.1278*  
And **Store** *PawPlace Camden* is shown at distance *3.7 km*  
When the customer enters a new **postcode** *M1 1AA*  
Then the **Store Locator** recalculates distance using **calculate distance from customer** for each **Store**  
And the *Nearest-First* ordering updates to reflect the new location  

---  

## Story: `View Product Details`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Product:  

| scenario | product_name | sku | price | brand | description | weight | length | width | height |  
|---|---|---|---|---|---|---|---|---|---|  
| with_dimensions | Premium Dog Harness | PET-HAR-001 | £34.99 | WalkRight | Adjustable padded harness for medium breeds | 0.35 | 30.0 | 20.0 | 5.0 |  
| no_dimensions | Salmon Cat Treats | PET-TRT-042 | £4.99 | PurrDelight | Grain-free salmon bites, 100g pouch | — | — | — | — |  

### Category:  

| scenario | category_name | parent_category |  
|---|---|---|  
| with_dimensions | Harnesses & Leads | Dog Supplies |  
| no_dimensions | Cat Treats | Cat Supplies |  
| multi_category | Dog Supplies | — |  
| multi_category | Premium Range | — |  

### ProductImage:  

| scenario | product_sku | image_file | alt_text | display_order |  
|---|---|---|---|---|  
| multiple_images | PET-HAR-001 | harness-front.jpg | Front view of Premium Dog Harness | 1 |  
| multiple_images | PET-HAR-001 | harness-side.jpg | Side view showing adjustment buckle | 2 |  
| multiple_images | PET-HAR-001 | harness-worn.jpg | Harness worn by golden retriever | 3 |  

---  

### Scenario Outline 1: `Product page shows full details`  

Given the **Product Catalog** contains **Product** *{product_name}* with **sku** *{sku}*  
And **Product** *{product_name}* has **price** *{price}* and **brand** *{brand}*  
And **Product** *{product_name}* has **description** *{description}*  
When the customer selects **Product** *{product_name}* from the **Product Catalog**  
Then the system displays the product page with name *{product_name}*, **description** *{description}*, and **price** *{price}*  

### Scenario 2: `Weight and dimensions shown where relevant`  

Given the **Product Catalog** contains **Product** *Premium Dog Harness* with **sku** *PET-HAR-001*  
And **Product** *Premium Dog Harness* has **weight** *0.35 kg*, **length** *30.0 cm*, **width** *20.0 cm*, **height** *5.0 cm*  
When the customer views the product page for **Product** *Premium Dog Harness*  
Then the system displays **weight** *0.35 kg* and dimensions *30.0 × 20.0 × 5.0 cm*  

### Scenario 3: `Multiple images with navigation`  

Given **Product** *Premium Dog Harness* has *3* **ProductImage** entries  
And **ProductImage** *harness-front.jpg* has **displayOrder** *1*  
And **ProductImage** *harness-side.jpg* has **displayOrder** *2*  
And **ProductImage** *harness-worn.jpg* has **displayOrder** *3*  
When the customer views the product page for **Product** *Premium Dog Harness*  
Then all *3* images are displayed in **displayOrder** sequence  
And navigation controls allow browsing between images  

### Scenario 4: `Products organized by category, no keyword search`  

Given the **Product Catalog** contains **Product** *Premium Dog Harness* in **Category** *Harnesses & Leads*  
And **Category** *Harnesses & Leads* has **parentCategory** *Dog Supplies*  
When the customer browses the **Product Catalog**  
Then products are organized by **Category** for browsing  
But no keyword search is available  

### Scenario 5: `No purchase or review actions available`  

Given the customer is viewing the product page for **Product** *Premium Dog Harness*  
When the customer looks for purchase or review actions  
Then no cart, checkout, or review actions are available on the product page  

---  

## Story: `Display Real-Time Stock Availability`  

**Story type:** system  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Product:  

| scenario | product_name | sku |  
|---|---|---|  
| in_stock | Premium Dog Harness | PET-HAR-001 |  
| out_of_stock | Exotic Fish Filter | PET-FLT-099 |  

### StockAvailability:  

| scenario | product_sku | store_code | quantity_on_hand | reserved_quantity | available_to_sell_quantity | backorder_enabled |  
|---|---|---|---|---|---|---|  
| in_stock_camden | PET-HAR-001 | STR-001 | 25 | 3 | 22 | false |  
| in_stock_bristol | PET-HAR-001 | STR-002 | 8 | 0 | 8 | false |  
| out_of_stock_all | PET-FLT-099 | STR-001 | 0 | 0 | 0 | false |  
| out_of_stock_all | PET-FLT-099 | STR-002 | 0 | 0 | 0 | false |  
| out_of_stock_all | PET-FLT-099 | STR-003 | 0 | 0 | 0 | false |  

---  

### Scenario Outline 1: `Real-time stock shown per store`  

Given the **Product Catalog** contains **Product** *{product_name}* with **sku** *{product_sku}*  
And **Stock Availability** for **Product** *{product_sku}* at **Store** *{store_code}* has **availableToSellQuantity** *{available_to_sell_quantity}*  
When the customer views the product page for **Product** *{product_name}*  
Then the system displays current **Stock Availability** showing **Store** *{store_code}* has *{available_to_sell_quantity}* available  

### Scenario 2: `Out of stock shown clearly with no purchase option`  

Given the **Product Catalog** contains **Product** *Exotic Fish Filter* with **sku** *PET-FLT-099*  
And **Stock Availability** for **Product** *PET-FLT-099* has **availableToSellQuantity** *0* at all stores  
When the customer views the product page for **Product** *Exotic Fish Filter*  
Then the system clearly indicates the product is currently unavailable  
But no backorder, pre-order, or purchase option is offered  

### Scenario 3: `Stock updates reflected on next view`  

Given **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-001* has **availableToSellQuantity** *22*  
When a *store employee* updates **stock level** to *30* via the **admin dashboard** for **Stock Availability** of **Product** *PET-HAR-001* at **Store** *STR-001*  
Then **available-to-sell quantity** recalculates to *27* (stock level *30* minus reserved quantity *3*)  
And subsequent customer views of the **product page** reflect **available-to-sell quantity** *27*  

---  

## Story: `Update Product Stock Levels`  

**Story type:** store employee  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### StockAvailability:  

| scenario | product_sku | product_name | store_code | store_name | quantity_on_hand | reserved_quantity | available_to_sell_quantity | submitted_quantity | expected_result | expected_quantity_on_hand | expected_available_to_sell |  
|---|---|---|---|---|---|---|---|---|---|---|---|  
| valid_update | PET-HAR-001 | Premium Dog Harness | STR-001 | PawPlace Camden | 25 | 3 | 22 | 40 | accepted | 40 | 37 |  
| invalid_negative | PET-TRT-042 | Salmon Cat Treats | STR-002 | PawPlace Bristol | 50 | 2 | 48 | -5 | rejected | 50 | 48 |  
| cross_store | PET-HAR-001 | Premium Dog Harness | STR-002 | PawPlace Bristol | 12 | 1 | 11 | — | unchanged | 12 | 11 |  

---  

### Scenario 1: `Current stock level displayed in admin dashboard`  

Given a *store employee* at **Store** *PawPlace Camden* (*STR-001*)  
And **Stock Availability** for **Product** *Premium Dog Harness* (*PET-HAR-001*) at **Store** *STR-001* has **stock level** *25*  
When the *store employee* opens the **admin dashboard** stock form for **Product** *Premium Dog Harness* at **Store** *PawPlace Camden*  
Then the system displays current **stock level** *25*  
And an editable **stock level** field is displayed  

### Scenario Outline 2: `Stock level update result`  

Given a *store employee* at **Store** *{store_name}* (*{store_code}*)  
And **Stock Availability** for **Product** *{product_name}* (*{product_sku}*) at **Store** *{store_code}* has **stock level** *{quantity_on_hand}* and **reserved quantity** *{reserved_quantity}*  
When the *store employee* submits new **stock level** *{submitted_quantity}* on the **admin dashboard**  
Then the update result is *{expected_result}*  
And **stock level** is *{expected_quantity_on_hand}*  
And **available-to-sell quantity** is *{expected_available_to_sell}*  

### Scenario 3: `Update at one store does not affect other stores`  

Given **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-001* has **quantityOnHand** *25*  
And **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-002* has **quantityOnHand** *12*  
When the *Store Employee* at **Store** *STR-001* submits new **quantityOnHand** *40*  
Then **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-001* updates to **quantityOnHand** *40* and **availableToSellQuantity** *37*  
But **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-002* remains **quantityOnHand** *12* and **availableToSellQuantity** *11*  


---

## Increment 1

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification by Example — Increment 1: Walk-in driver — find the store, see what's in stock  

**Refresh:** Run 2 slot 27 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/specification/crc.md`, and `acceptance-criteria.md` (canonical *store locator*, *map view*, *stock level*, *admin dashboard*).

---  

## Story: `View Store Map`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Store:  

| scenario | store_name | store_code | address_line_one | city | postcode | latitude | longitude | phone_number | email_address | active_status |  
|---|---|---|---|---|---|---|---|---|---|---|  
| 1 | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP | 51.5392 | -0.1426 | 020-7946-0001 | camden@pawplace.co.uk | true |  
| 2 | PawPlace Bristol | STR-002 | 15 Harbour Road | Bristol | BS1 4DJ | 51.4545 | -2.5879 | 0117-496-0002 | bristol@pawplace.co.uk | true |  
| 3 | PawPlace Manchester | STR-003 | 8 Deansgate | Manchester | M3 2FF | 53.4808 | -2.2426 | 0161-496-0003 | manchester@pawplace.co.uk | true |  

---  

### Scenario Outline 1: `All stores visible on map without login`  

Given the **Store Locator** has **Store** *{store_name}* with **storeCode** *{store_code}* at coordinates *{latitude}*, *{longitude}*  
And the visitor is not logged in  
When the visitor opens the **Store Locator** *map view*  
Then a selectable point appears at latitude *{latitude}* and longitude *{longitude}* for **Store** *{store_name}*  

### Scenario Outline 2: `Store details shown on selection`  

Given the **Store Locator** *map view* is displaying **Store** *{store_name}*  
When the visitor selects the map point for **Store** *{store_name}*  
Then the system displays **addressLineOne** *{address_line_one}*, **city** *{city}*, **postcode** *{postcode}*  
And the system displays **phoneNumber** *{phone_number}* and **emailAddress** *{email_address}*  

### Scenario 3: `All stores shown simultaneously without search`  

Given the **Store Locator** contains *3* active **Store** entries  
When the visitor opens the **Store Locator** *map view*  
Then all *3* **Store** locations are visible simultaneously  
And no search or filter is required to see them  

---  

## Story: `View Store List`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Store:  

| scenario | store_name | store_code | address_line_one | city | postcode | phone_number | email_address |  
|---|---|---|---|---|---|---|---|  
| all | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP | 020-7946-0001 | camden@pawplace.co.uk |  
| all | PawPlace Bristol | STR-002 | 15 Harbour Road | Bristol | BS1 4DJ | 0117-496-0002 | bristol@pawplace.co.uk |  
| all | PawPlace Manchester | STR-003 | 8 Deansgate | Manchester | M3 2FF | 0161-496-0003 | manchester@pawplace.co.uk |  

---  

### Scenario Outline 1: `All stores listed without login`  

Given the **Store Locator** has **Store** *{store_name}* with **storeCode** *{store_code}*  
And the visitor is not logged in  
When the visitor opens the **Store Locator** *list view*  
Then the list shows **Store** *{store_name}* with **addressLineOne** *{address_line_one}*, **city** *{city}*  

### Scenario Outline 2: `Store details shown on list selection`  

Given the **Store Locator** *list view* is displaying **Store** *{store_name}*  
When the visitor selects **Store** *{store_name}* from the *list view*  
Then the system displays **addressLineOne** *{address_line_one}*, **city** *{city}*, **postcode** *{postcode}*  
And the system displays **phoneNumber** *{phone_number}* and **emailAddress** *{email_address}*  

### Scenario 3: `All stores appear without search or filtering`  

Given the **Store Locator** contains *3* active **Store** entries  
When the visitor opens the **Store Locator** *list view*  
Then all *3* **Store** entries are visible without requiring search or filtering  

---  

## Story: `Calculate Distance to Store`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Store:  

| scenario | store_name | store_code | latitude | longitude | expected_distance_km | expected_sort_position |  
|---|---|---|---|---|---|---|  
| all | PawPlace Camden | STR-001 | 51.5392 | -0.1426 | 3.7 | 1 |  
| all | PawPlace Bristol | STR-002 | 51.4545 | -2.5879 | 171.2 | 2 |  
| all | PawPlace Manchester | STR-003 | 53.4808 | -2.2426 | 263.4 | 3 |  

### CustomerLocation:  

| scenario | location_method | customer_latitude | customer_longitude | customer_postcode |  
|---|---|---|---|---|  
| shared_location | Shared Location | 51.5074 | -0.1278 | — |  
| entered_postcode | Postcode Entry | — | — | EC1A 1BB |  
| no_location | None | — | — | — |  

---  

### Scenario Outline 1: `Stores sorted nearest-first when location provided`  

Given the **Store Locator** contains **Store** *{store_name}* at coordinates *{latitude}*, *{longitude}*  
And the customer provides location via *{location_method}*  
When the **Store Locator** calculates distance using **calculate distance from customer** for each **Store**  
Then **Store** *{store_name}* shows distance *{expected_distance_km}* km  
And **Store** *{store_name}* appears at sort position *{expected_sort_position}* in the **sort nearest-first** ordering  

### Scenario 2: `No distance shown when location not provided`  

Given the **Store Locator** contains *3* active **Store** entries  
And the customer has not provided any location  
When the visitor opens the **Store Locator**  
Then all **Store** entries are displayed without distance information  
And stores appear in their default order  

### Scenario 3: `Distance recalculates on location change`  

Given the customer previously provided *Shared Location* with latitude *51.5074*, longitude *-0.1278*  
And **Store** *PawPlace Camden* is shown at distance *3.7 km*  
When the customer enters a new **postcode** *M1 1AA*  
Then the **Store Locator** recalculates distance using **calculate distance from customer** for each **Store**  
And the *Nearest-First* ordering updates to reflect the new location  

---  

## Story: `View Product Details`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Product:  

| scenario | product_name | sku | price | brand | description | weight | length | width | height |  
|---|---|---|---|---|---|---|---|---|---|  
| with_dimensions | Premium Dog Harness | PET-HAR-001 | £34.99 | WalkRight | Adjustable padded harness for medium breeds | 0.35 | 30.0 | 20.0 | 5.0 |  
| no_dimensions | Salmon Cat Treats | PET-TRT-042 | £4.99 | PurrDelight | Grain-free salmon bites, 100g pouch | — | — | — | — |  

### Category:  

| scenario | category_name | parent_category |  
|---|---|---|  
| with_dimensions | Harnesses & Leads | Dog Supplies |  
| no_dimensions | Cat Treats | Cat Supplies |  
| multi_category | Dog Supplies | — |  
| multi_category | Premium Range | — |  

### ProductImage:  

| scenario | product_sku | image_file | alt_text | display_order |  
|---|---|---|---|---|  
| multiple_images | PET-HAR-001 | harness-front.jpg | Front view of Premium Dog Harness | 1 |  
| multiple_images | PET-HAR-001 | harness-side.jpg | Side view showing adjustment buckle | 2 |  
| multiple_images | PET-HAR-001 | harness-worn.jpg | Harness worn by golden retriever | 3 |  

---  

### Scenario Outline 1: `Product page shows full details`  

Given the **Product Catalog** contains **Product** *{product_name}* with **sku** *{sku}*  
And **Product** *{product_name}* has **price** *{price}* and **brand** *{brand}*  
And **Product** *{product_name}* has **description** *{description}*  
When the customer selects **Product** *{product_name}* from the **Product Catalog**  
Then the system displays the product page with name *{product_name}*, **description** *{description}*, and **price** *{price}*  

### Scenario 2: `Weight and dimensions shown where relevant`  

Given the **Product Catalog** contains **Product** *Premium Dog Harness* with **sku** *PET-HAR-001*  
And **Product** *Premium Dog Harness* has **weight** *0.35 kg*, **length** *30.0 cm*, **width** *20.0 cm*, **height** *5.0 cm*  
When the customer views the product page for **Product** *Premium Dog Harness*  
Then the system displays **weight** *0.35 kg* and dimensions *30.0 × 20.0 × 5.0 cm*  

### Scenario 3: `Multiple images with navigation`  

Given **Product** *Premium Dog Harness* has *3* **ProductImage** entries  
And **ProductImage** *harness-front.jpg* has **displayOrder** *1*  
And **ProductImage** *harness-side.jpg* has **displayOrder** *2*  
And **ProductImage** *harness-worn.jpg* has **displayOrder** *3*  
When the customer views the product page for **Product** *Premium Dog Harness*  
Then all *3* images are displayed in **displayOrder** sequence  
And navigation controls allow browsing between images  

### Scenario 4: `Products organized by category, no keyword search`  

Given the **Product Catalog** contains **Product** *Premium Dog Harness* in **Category** *Harnesses & Leads*  
And **Category** *Harnesses & Leads* has **parentCategory** *Dog Supplies*  
When the customer browses the **Product Catalog**  
Then products are organized by **Category** for browsing  
But no keyword search is available  

### Scenario 5: `No purchase or review actions available`  

Given the customer is viewing the product page for **Product** *Premium Dog Harness*  
When the customer looks for purchase or review actions  
Then no cart, checkout, or review actions are available on the product page  

---  

## Story: `Display Real-Time Stock Availability`  

**Story type:** system  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### Product:  

| scenario | product_name | sku |  
|---|---|---|  
| in_stock | Premium Dog Harness | PET-HAR-001 |  
| out_of_stock | Exotic Fish Filter | PET-FLT-099 |  

### StockAvailability:  

| scenario | product_sku | store_code | quantity_on_hand | reserved_quantity | available_to_sell_quantity | backorder_enabled |  
|---|---|---|---|---|---|---|  
| in_stock_camden | PET-HAR-001 | STR-001 | 25 | 3 | 22 | false |  
| in_stock_bristol | PET-HAR-001 | STR-002 | 8 | 0 | 8 | false |  
| out_of_stock_all | PET-FLT-099 | STR-001 | 0 | 0 | 0 | false |  
| out_of_stock_all | PET-FLT-099 | STR-002 | 0 | 0 | 0 | false |  
| out_of_stock_all | PET-FLT-099 | STR-003 | 0 | 0 | 0 | false |  

---  

### Scenario Outline 1: `Real-time stock shown per store`  

Given the **Product Catalog** contains **Product** *{product_name}* with **sku** *{product_sku}*  
And **Stock Availability** for **Product** *{product_sku}* at **Store** *{store_code}* has **availableToSellQuantity** *{available_to_sell_quantity}*  
When the customer views the product page for **Product** *{product_name}*  
Then the system displays current **Stock Availability** showing **Store** *{store_code}* has *{available_to_sell_quantity}* available  

### Scenario 2: `Out of stock shown clearly with no purchase option`  

Given the **Product Catalog** contains **Product** *Exotic Fish Filter* with **sku** *PET-FLT-099*  
And **Stock Availability** for **Product** *PET-FLT-099* has **availableToSellQuantity** *0* at all stores  
When the customer views the product page for **Product** *Exotic Fish Filter*  
Then the system clearly indicates the product is currently unavailable  
But no backorder, pre-order, or purchase option is offered  

### Scenario 3: `Stock updates reflected on next view`  

Given **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-001* has **availableToSellQuantity** *22*  
When a *store employee* updates **stock level** to *30* via the **admin dashboard** for **Stock Availability** of **Product** *PET-HAR-001* at **Store** *STR-001*  
Then **available-to-sell quantity** recalculates to *27* (stock level *30* minus reserved quantity *3*)  
And subsequent customer views of the **product page** reflect **available-to-sell quantity** *27*  

---  

## Story: `Update Product Stock Levels`  

**Story type:** store employee  

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md  

---  

### StockAvailability:  

| scenario | product_sku | product_name | store_code | store_name | quantity_on_hand | reserved_quantity | available_to_sell_quantity | submitted_quantity | expected_result | expected_quantity_on_hand | expected_available_to_sell |  
|---|---|---|---|---|---|---|---|---|---|---|---|  
| valid_update | PET-HAR-001 | Premium Dog Harness | STR-001 | PawPlace Camden | 25 | 3 | 22 | 40 | accepted | 40 | 37 |  
| invalid_negative | PET-TRT-042 | Salmon Cat Treats | STR-002 | PawPlace Bristol | 50 | 2 | 48 | -5 | rejected | 50 | 48 |  
| cross_store | PET-HAR-001 | Premium Dog Harness | STR-002 | PawPlace Bristol | 12 | 1 | 11 | — | unchanged | 12 | 11 |  

---  

### Scenario 1: `Current stock level displayed in admin dashboard`  

Given a *store employee* at **Store** *PawPlace Camden* (*STR-001*)  
And **Stock Availability** for **Product** *Premium Dog Harness* (*PET-HAR-001*) at **Store** *STR-001* has **stock level** *25*  
When the *store employee* opens the **admin dashboard** stock form for **Product** *Premium Dog Harness* at **Store** *PawPlace Camden*  
Then the system displays current **stock level** *25*  
And an editable **stock level** field is displayed  

### Scenario Outline 2: `Stock level update result`  

Given a *store employee* at **Store** *{store_name}* (*{store_code}*)  
And **Stock Availability** for **Product** *{product_name}* (*{product_sku}*) at **Store** *{store_code}* has **stock level** *{quantity_on_hand}* and **reserved quantity** *{reserved_quantity}*  
When the *store employee* submits new **stock level** *{submitted_quantity}* on the **admin dashboard**  
Then the update result is *{expected_result}*  
And **stock level** is *{expected_quantity_on_hand}*  
And **available-to-sell quantity** is *{expected_available_to_sell}*  

### Scenario 3: `Update at one store does not affect other stores`  

Given **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-001* has **quantityOnHand** *25*  
And **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-002* has **quantityOnHand** *12*  
When the *Store Employee* at **Store** *STR-001* submits new **quantityOnHand** *40*  
Then **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-001* updates to **quantityOnHand** *40* and **availableToSellQuantity** *37*  
But **Stock Availability** for **Product** *PET-HAR-001* at **Store** *STR-002* remains **quantityOnHand** *12* and **availableToSellQuantity** *11*  


---

## increment-2 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 2

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
increment_scope: Increment 2 — Click-and-collect
specification_refresh: Run 3 slot 53
---

# Specification by Example — Increment 2: Click-and-collect

**Refresh:** Run 3 slot 53 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/specification/crc.md`, `docs/end-to-end/specification/domain.json`, and `docs/end-to-end/exploration/stories/acceptance-criteria.md`. Guest checkout only; session-scoped *shopping cart*; *StripeWave* sole *payment vendor*; *click-and-collect* sole *delivery option*.

---

## Story: `Add Product to Cart`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Product:

| scenario | product_name | sku | price | brand | expected_availability |
|---|---|---|---|---|---|
| 1 | Premium Dog Harness | PET-HAR-001 | £34.99 | WalkRight | In stock |
| 2 | Salmon Cat Treats | PET-TRT-042 | £4.99 | PurrDelight | In stock |
| 3 | Exotic Fish Filter | PET-FLT-099 | £89.99 | AquaPure | Out of stock |

### Stock Availability:

| scenario | product_sku | available_to_sell_quantity | backorder_enabled | expected_add_to_cart_state |
|---|---|---|---|---|
| 1 | PET-HAR-001 | 22 | false | enabled |
| 2 | PET-TRT-042 | 48 | false | enabled |
| 3 | PET-FLT-099 | 0 | false | disabled |

---

### Scenario Outline 1: `Product added to cart updates quantity and badge`

Given the **Product Catalog** contains **Product** *{product_name}* with **sku** *{sku}* and **price** *{price}*
And **Stock Availability** for **Product** *{sku}* has **available to sell quantity** *{stock}*
And the **Shopping Cart** contains *{initial_items}* **Cart Item**(s) for **Product** *{sku}*
When the customer selects *Add to Cart* on the **Product Page** for **Product** *{product_name}*
Then the **Shopping Cart** contains a **Cart Item** with **product in cart** *{sku}*, **quantity** *{expected_quantity}*, **unit price at time of adding** *{price}*
And the **Cart Item** has **line price** *{expected_line_price}*
And the visible item count indicator shows *{expected_badge_count}*

#### Examples:

| scenario | product_name | sku | price | stock | initial_items | expected_quantity | expected_line_price | expected_badge_count |
|---|---|---|---|---|---|---|---|---|
| 1 | Premium Dog Harness | PET-HAR-001 | £34.99 | 22 | 0 | 1 | £34.99 | 1 |
| 2 | Premium Dog Harness | PET-HAR-001 | £34.99 | 22 | 1 | 2 | £69.98 | 2 |

### Scenario 2: `Out-of-stock product cannot be added`

Given the **Product Catalog** contains **Product** *Exotic Fish Filter* with **sku** *PET-FLT-099*
And **Stock Availability** for **Product** *PET-FLT-099* has **available to sell quantity** *0* and backorder is *disabled*
When the customer views the **Product Page** for **Product** *Exotic Fish Filter*
Then the *Add to Cart* action is *disabled*
And the **Product Page** displays availability label *Out of stock — check back soon*
And **Product** *PET-FLT-099* is not added to the **Shopping Cart**

### Scenario 3: `Multiple products appear as separate line items`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-HAR-001*, **quantity** *1*, **line price** *£34.99*
When the customer adds **Product** *Salmon Cat Treats* (*PET-TRT-042*) at **price** *£4.99* to the **Shopping Cart**
Then the **Shopping Cart** contains *2* **Cart Item** entries
And the **Cart Item** for *PET-HAR-001* has **quantity** *1* and **line price** *£34.99*
And the **Cart Item** for *PET-TRT-042* has **quantity** *1* and **line price** *£4.99*
And the **Shopping Cart** has **cart subtotal** *£39.98*
And the visible item count indicator shows *2*

### Scenario 4: `Session-scoped cart does not survive browser session end`

Given a guest customer has **Shopping Cart** with **Cart Item** *PET-HAR-001* **quantity** *1* in the current browser session
When the browser session ends before checkout completes
Then the **Shopping Cart** contents are not available in a new session
And a new session starts with an empty **Shopping Cart**

---

## Story: `Update Cart Quantity`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Cart Item:

| scenario | product_sku | product_name | unit_price_at_time_of_adding | quantity | expected_line_price |
|---|---|---|---|---|---|
| 1 | PET-HAR-001 | Premium Dog Harness | £34.99 | 2 | £69.98 |
| 2 | PET-TRT-042 | Salmon Cat Treats | £4.99 | 1 | £4.99 |

---

### Scenario Outline 1: `Quantity change recalculates line price and subtotal`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *{sku}*, **quantity** *{initial_qty}*, **unit price at time of adding** *{unit_price}*
And the **Shopping Cart** has **cart subtotal** *{initial_subtotal}*
When the customer changes **quantity** on **Cart Item** *{sku}* to *{new_qty}*
Then **Cart Item** *{sku}* has **quantity** *{new_qty}* and **line price** *{expected_line_price}*
And the **Shopping Cart** has **cart subtotal** *{expected_subtotal}*
And the visible item count indicator shows *{expected_badge_count}*

#### Examples:

| scenario | sku | unit_price | initial_qty | initial_subtotal | new_qty | expected_line_price | expected_subtotal | expected_badge_count |
|---|---|---|---|---|---|---|---|---|
| 1 | PET-HAR-001 | £34.99 | 2 | £69.98 | 3 | £104.97 | £104.97 | 3 |
| 2 | PET-HAR-001 | £34.99 | 2 | £69.98 | 1 | £34.99 | £34.99 | 1 |

### Scenario 2: `Quantity set to zero removes item from cart`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-TRT-042*, **quantity** *1*, **unit price at time of adding** *£4.99*
And the **Shopping Cart** has **cart subtotal** *£4.99*
When the customer sets **quantity** on **Cart Item** *PET-TRT-042* to *0*
Then **Cart Item** *PET-TRT-042* is removed from the **Shopping Cart**
And the **Shopping Cart** has **cart subtotal** *£0.00*
And the visible item count indicator shows *0*

### Scenario 3: `Invalid quantity shows validation feedback`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-HAR-001* and **quantity** *2*
When the customer enters **quantity** *-1* on **Cart Item** *PET-HAR-001*
Then the **Shopping Cart** displays validation message *Quantity must be zero or more* on that line
And **Cart Item** *PET-HAR-001* retains **quantity** *2*
And the **Shopping Cart** **cart subtotal** remains *£69.98*

### Scenario 4: `Quantity exceeding stock availability is rejected`

Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *PET-HAR-001* and **quantity** *2*
And **Stock Availability** for **Product** *PET-HAR-001* has **available to sell quantity** *22*
When the customer enters **quantity** *25* on **Cart Item** *PET-HAR-001*
Then the **Shopping Cart** displays validation message *Only 22 available* on that **Cart Item**
And **Cart Item** *PET-HAR-001* retains **quantity** *2*
And the **Shopping Cart** **cart subtotal** remains *£69.98*

---

## Story: `Remove Product from Cart`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `Item removed and totals update`

Given the **Shopping Cart** contains **Cart Item** with **product in cart** *PET-HAR-001*, **quantity** *1*, **line price** *£34.99*
And the **Shopping Cart** contains **Cart Item** with **product in cart** *PET-TRT-042*, **quantity** *2*, **line price** *£9.98*
And the **Shopping Cart** has **cart subtotal** *£44.97*
When the customer selects remove on **Cart Item** *PET-HAR-001*
Then **Cart Item** *PET-HAR-001* is removed from the **Shopping Cart**
And the **Shopping Cart** has **cart subtotal** *£9.98*
And the visible item count indicator shows *2*

### Scenario 2: `Last item removed shows continue-shopping guidance`

Given the **Shopping Cart** contains only **Cart Item** with **product in cart** *PET-TRT-042* and **quantity** *1*
When the customer selects remove on **Cart Item** *PET-TRT-042*
Then the **Shopping Cart** displays heading *Your cart is empty*
And a *Continue shopping* affordance returns the customer to the **Product Catalog**
And checkout is not accessible from the empty **Shopping Cart**

---

## Story: `Select Click-and-Collect Store`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Store:

| scenario | store_name | store_code | address_line_one | city | postcode | expected_display_line |
|---|---|---|---|---|---|---|
| 1 | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP | 42 High Street, London NW1 8QP |
| 2 | PawPlace Bristol | STR-002 | 15 Harbour Road | Bristol | BS1 4DJ | 15 Harbour Road, Bristol BS1 4DJ |

---

### Scenario 1: `Click-and-collect is the only delivery option at checkout`

Given the **Store Locator** contains **Store** *PawPlace Camden* (*STR-001*) and **Store** *PawPlace Bristol* (*STR-002*)
And the customer has reached the delivery step in checkout
When the customer views the store selection for **Click-and-Collect**
Then *click-and-collect* is the only **Delivery Option** presented
And the list shows *2* **Store** locations with **address**, **operating hours**, and **distance** when customer location is known
And **Store** *STR-001* shows *42 High Street*, *London*, *NW1 8QP*, and **operating hours**
And **Store** *STR-002* shows *15 Harbour Road*, *Bristol*, *BS1 4DJ*, and **operating hours**

### Scenario 2: `Pickup store recorded without shipping address`

Given the customer selects **Store** *PawPlace Camden* (*STR-001*) as **Pickup Store**
When the customer confirms **Click-and-Collect** at **Pickup Store** *STR-001*
Then **Pickup Store** *PawPlace Camden* is recorded as the collection location for the **Order**
And the checkout displays confirmation label *Collecting from PawPlace Camden*
And no shipping address is required

### Scenario 3: `Stores listed with location entry prompt when distance unknown`

Given the customer has not provided **Postcode** or **Shared Location**
And the **Store Locator** contains *2* active **Store** entries
When the customer views the store selection for **Click-and-Collect**
Then *2* **Store** locations are listed
And each **Store** shows name, **address**, and **operating hours**
And the selector displays prompt *Enter a postcode or share location for distance-sorted results*

### Scenario 4: `Checkout summary shows chosen pickup store`

Given the customer has selected **Pickup Store** *PawPlace Camden* (*STR-001*) at *42 High Street, London NW1 8QP*
When the customer confirms **Click-and-Collect** and advances in checkout
Then the checkout summary shows **Pickup Store** name *PawPlace Camden*
And the checkout summary shows **address** *42 High Street, London NW1 8QP*

---

## Story: `Check Out as Guest`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Guest Checkout:

| scenario | guest_email | guest_first_name | guest_last_name | expected_validation |
|---|---|---|---|---|
| 1 | sarah.jones@example.com | Sarah | Jones | valid |
| 2 | not-an-email | Tom | Brown | invalid |

---

### Scenario 1: `Guest checkout offered as default without account path`

Given the customer has items in the **Shopping Cart**
And the customer is not logged in
When the customer proceeds to checkout
Then the system offers **Guest Checkout** as the default path
And the system collects **Guest Email**, guest first name, and guest last name
And login and **Customer Account** registration are not offered before purchase

### Scenario 2: `Order placed with guest details and confirmation email`

Given the customer provides **Guest Checkout** with **Guest Email** *sarah.jones@example.com*, guest first name *Sarah*, guest last name *Jones*
When the customer completes **Guest Checkout**
Then an **Order** is placed
And a **Confirmation Email** is sent to *sarah.jones@example.com*
And guest details are retained only for this transaction
And no **Customer Account** is created

### Scenario 3: `Invalid guest email shows inline error`

Given the customer enters **Guest Email** *not-an-email*
When the customer attempts to proceed from the email step
Then the email field shows validation message *Please enter a valid email address*
And checkout remains on the current step until a valid **Guest Email** is provided

### Scenario 4: `Account creation prompted after guest checkout`

Given the customer has completed **Guest Checkout** with **Guest Email** *sarah.jones@example.com*
When the **Order Confirmation Page** is displayed
Then the system prompts **Customer Account** creation with message *Create an account for order history, saved addresses, and reorder*
And the prompt is dismissible
And the **Order** is already placed regardless of the customer's choice

---

## Story: `Enter Billing Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Billing Address:

| scenario | address_line_one | address_line_two | city | county_or_region | postcode | country | expected_validation |
|---|---|---|---|---|---|---|---|
| 1 | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom | valid |
| 2 | — | — | London | — | — | United Kingdom | invalid — missing address line 1 and postcode |

---

### Scenario 1: `Billing address form collects full details`

Given the customer has reached the billing step in checkout
When the **Billing Address** form is presented
Then the form collects: name, **address line 1**, **address line 2** (optional), **city**, county/state, **postcode**, and **country**
And required fields are marked: **address line 1**, **city**, **postcode**, **country**

### Scenario 2: `Complete billing address advances to payment`

Given the customer enters **Billing Address** with **address line 1** *10 Elm Avenue*, **address line 2** *Flat 3*, **city** *London*, county *Greater London*, **postcode** *SW1A 2AA*, **country** *United Kingdom*
When the customer submits the **Billing Address**
Then checkout advances to the **Payment** step
And the order summary shows **Billing Address** *10 Elm Avenue, Flat 3, London, Greater London, SW1A 2AA*

### Scenario 3: `Missing required fields show validation messages`

Given the customer leaves **address line 1** blank and **postcode** blank
When the customer submits the **Billing Address** form
Then the form shows validation message *Address line 1 is required* on **address line 1**
And the form shows validation message *Postcode is required* on **postcode**
And checkout remains on the billing step

### Scenario 4: `Billing address copied to order only for guest checkout`

Given the customer completes **Guest Checkout** with **Billing Address** *10 Elm Avenue, Flat 3, London, Greater London, SW1A 2AA*
When the **Order** is confirmed
Then the **Billing Address** is copied onto the confirmed **Order**
And the **Billing Address** is not persisted after **Guest Checkout** completes

---

## Story: `Select Payment Method`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `StripeWave card entry is the only payment vendor`

Given the customer has reached the **Payment** step in checkout
And **StripeWave** is the only active **Payment Vendor** supporting credit and debit card
When the payment method selection is displayed
Then *StripeWave (Credit/Debit Card)* is the available **Payment Vendor**
And the form collects: card number, expiry month/year, and CVV
And *PayNova*, *VaultPay*, and **Saved Payment Method** do not appear

### Scenario Outline 2: `Card details validated before payment attempt`

Given the customer enters card number *{card_number}*, expiry *{expiry}*, CVV *{cvv}*
When the card details are validated
Then the validation result is *{expected_result}*
And checkout *{expected_action}*

#### Examples:

| scenario | card_number | expiry | cvv | expected_result | expected_action |
|---|---|---|---|---|---|
| 1 | 4242 4242 4242 4242 | 12/27 | 123 | valid | advances to order review |
| 2 | 4242 4242 4242 4242 | 01/22 | 123 | invalid — card expired | shows error: Card expiry date is in the past |
| 3 | 4242 4242 4242 4242 | 12/27 | — | invalid — missing CVV | shows error: CVV is required |

---

## Story: `Process Card Payment via StripeWave`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Payment:

| scenario | payment_reference | payment_amount | currency | expected_final_status | processing_vendor |
|---|---|---|---|---|---|
| 1 | PAY-20250507-001 | £44.97 | GBP | settled | StripeWave |
| 2 | PAY-20250507-002 | £89.99 | GBP | failed | StripeWave |
| 3 | PAY-20250507-003 | £34.99 | GBP | settled (via webhook) | StripeWave |

### Order:

| scenario | order_number | order_total | expected_order_status |
|---|---|---|---|
| 1 | ORD-2001 | £44.97 | confirmed |
| 2 | — | £89.99 | not created |
| 3 | ORD-2002 | £34.99 | confirmed |

---

### Scenario 1: `Successful payment confirms order`

Given the customer has confirmed an **Order** with **order total** *£44.97*
And **StripeWave** is the **Payment Vendor**
When the customer confirms the **Order**
Then the system initiates card processing with **StripeWave** for **order total** *£44.97*
And the customer sees a processing indicator while the **Payment** is in flight
When **StripeWave** returns successful **Payment Confirmation**
Then **Payment** *PAY-20250507-001* has **payment status** *settled*
And **Order** *ORD-2001* transitions **order status** to *confirmed*

### Scenario 2: `Card declined shows decline reason and retry`

Given the customer has confirmed an **Order** with **order total** *£89.99*
And **StripeWave** is the **Payment Vendor**
When the system processes card payment with **StripeWave**
And **StripeWave** declines the card
Then the customer sees error message *Your card was declined — please check your details or try another card*
And checkout displays a *Try another card* retry option
And **Payment** *PAY-20250507-002* has **payment status** *failed*
And no **Order** is confirmed
And no **Confirmation Email** is sent

### Scenario 3: `Webhook callback reconciles after timeout`

Given the customer's **Payment** *PAY-20250507-003* timed out during processing
And **Payment** **payment status** is *pending*
When a **Webhook Callback** from **StripeWave** arrives with successful **Payment Confirmation**
Then the system reconciles the **Webhook Callback** against the pending **Payment**
And **Payment** *PAY-20250507-003* updates **payment status** to *settled*
And **Order** *ORD-2002* transitions **order status** to *confirmed*
And the **Confirmation Email** is sent to the customer

### Scenario 4: `Webhook failure notifies customer to retry`

Given the customer's **Payment** *PAY-20250507-003* timed out during processing
And **Payment** **payment status** is *pending*
When a **Webhook Callback** from **StripeWave** arrives with failed **Payment Confirmation**
Then **Payment** updates **payment status** to *failed*
And the customer receives notification *Your payment could not be processed — please try again*
And the **Order** remains unpaid

### Scenario 5: `Payment service unavailable shows retry option`

Given the customer has confirmed an **Order** with **order total** *£34.99*
When the system attempts card processing with **StripeWave**
And the connection to **StripeWave** is temporarily unavailable
Then the customer sees message *Payment service temporarily unavailable — please try again shortly*
And a *Retry* option is displayed after a brief wait
And no charge is attempted
And no **Order** is confirmed

---

## Story: `Confirm Order and Send Confirmation Email`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_total | pickup_store_name | pickup_store_address | expected_confirmation_display |
|---|---|---|---|---|---|
| 1 | ORD-2001 | £44.97 | PawPlace Camden | 42 High Street, London NW1 8QP | Order confirmed — collect from PawPlace Camden |

### Confirmation Email:

| scenario | notification_subject | recipient_guest_email | expected_delivery_status |
|---|---|---|---|
| 1 | Your PawPlace Order ORD-2001 is confirmed | sarah.jones@example.com | sent |
| 2 | Your PawPlace Order ORD-2001 is confirmed | sarah.jones@example.com | queued |

---

### Scenario 1: `Confirmation page and email sent on payment success`

Given **Payment Confirmation** succeeded for **Order** *ORD-2001*
And **Order** *ORD-2001* has **Pickup Store** *PawPlace Camden* at *42 High Street, London NW1 8QP*
And **Guest Checkout** has **Guest Email** *sarah.jones@example.com*
When the **Order** is confirmed
Then the **Order Confirmation Page** displays **order number** *ORD-2001*, **Order Line Item** list, **order total** *£44.97*, and **Pickup Store** details
And the system sends a **Confirmation Email** to *sarah.jones@example.com*
And the **Confirmation Email** includes: **order number** *ORD-2001*, **Order Line Item** list, total paid *£44.97*, masked **Payment** method, and **Pickup Store** **address** *42 High Street, London NW1 8QP* with **operating hours**

### Scenario 2: `Email queued, confirmation page still displayed`

Given **Payment Confirmation** succeeded for **Order** *ORD-2001*
When the **Order** is confirmed
And the email delivery system is temporarily unavailable
Then the **Order Confirmation Page** displays to the customer with **order number** *ORD-2001*
And the **Confirmation Email** is queued for retry with **delivery status** *queued*
And **Order** *ORD-2001* remains *confirmed*

---

## Story: `Prepare Click-and-Collect Orders for Pickup`

**Story type:** store employee

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date | order_status | guest_email | pickup_store_code | expected_queue_position |
|---|---|---|---|---|---|---|
| 1 | ORD-2001 | 2025-05-06 | confirmed | sarah.jones@example.com | STR-001 | 1 |
| 2 | ORD-2002 | 2025-05-07 | confirmed | tom.brown@example.com | STR-001 | 2 |

### Order Line Item:

| scenario | order_number | product_name_snapshot | sku_snapshot | quantity | unit_price_snapshot | expected_line_total |
|---|---|---|---|---|---|---|
| 1 | ORD-2001 | Premium Dog Harness | PET-HAR-001 | 1 | £34.99 | £34.99 |
| 2 | ORD-2001 | Salmon Cat Treats | PET-TRT-042 | 2 | £4.99 | £9.98 |
| 3 | ORD-2002 | Exotic Fish Filter | PET-FLT-099 | 1 | £89.99 | £89.99 |

### Stock Availability:

| scenario | product_sku | store_code | available_to_sell_quantity | expected_stock_indicator |
|---|---|---|---|---|
| 1 | PET-HAR-001 | STR-001 | 22 | in stock |
| 2 | PET-FLT-099 | STR-001 | 0 | out of stock — warn employee |

---

### Scenario 1: `Click-and-collect queue shows confirmed orders sorted oldest first`

Given **Store Employee** is at **Store** *PawPlace Camden* (*STR-001*)
And the **Click-and-Collect Queue** contains **Order** *ORD-2001* (date *2025-05-06*) and **Order** *ORD-2002* (date *2025-05-07*)
When **Store Employee** opens the **Click-and-Collect Queue** on the **Admin Dashboard**
Then **Order** entries are sorted oldest first: *ORD-2001* at position *1*, *ORD-2002* at position *2*
And each **Order** shows **order number**, **Order Line Item** details (product name, quantity), and **Guest Email** or customer name

### Scenario 2: `Order marked prepared transitions to ready for pickup`

Given **Store Employee** views **Order** *ORD-2001* in the **Click-and-Collect Queue**
And **Order** *ORD-2001* has **order status** *confirmed*
When **Store Employee** marks **Order** *ORD-2001* as prepared through **Pickup Fulfillment**
Then **Pickup Fulfillment** updates **pickup status** to *ready for pickup*
And **Order** *ORD-2001* transitions **order status** to *ready for pickup*

### Scenario 3: `Stock warning shown with guest email for staff outreach`

Given **Order** *ORD-2002* contains **Order Line Item** *Exotic Fish Filter* (*PET-FLT-099*) with **quantity** *1*
And **Stock Availability** for **Product** *PET-FLT-099* at **Store** *STR-001* has **available to sell quantity** *0*
When **Store Employee** views **Order** *ORD-2002* in the **Click-and-Collect Queue**
Then a stock warning *Out of stock at this store* appears on the **Order Line Item** for *Exotic Fish Filter*
And **Guest Email** *tom.brown@example.com* is displayed for manual contact
And **Order** *ORD-2002* remains *confirmed* for employee resolution

---

## Story: `Fulfill Click-and-Collect Order`

**Story type:** store employee

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `Customer collects order, status transitions to collected`

Given **Order** *ORD-2001* has **order status** *ready for pickup*
And **Pickup Fulfillment** for **Order** *ORD-2001* has **pickup status** *ready for pickup*
And the customer arrives at **Pickup Store** *PawPlace Camden*
When **Store Employee** confirms the handoff through **Pickup Fulfillment**
Then **Order** *ORD-2001* transitions **order status** to *collected*
And **Pickup Fulfillment** updates **pickup status** to *collected*

### Scenario 2: `Uncollected order shows guest email for staff outreach`

Given **Order** *ORD-2001* has **order status** *ready for pickup*
And the collection window has passed without customer arrival
When **Store Employee** views **Order** *ORD-2001* on the **Admin Dashboard**
Then **Order** *ORD-2001* displays **order status** *ready for pickup*
And **Guest Email** *sarah.jones@example.com* is shown for outreach
And the dashboard displays prompt *Contact customer — collection window elapsed*
And **Order** *ORD-2001* is not auto-cancelled

### Scenario 3: `All orders fulfilled shows completion state`

Given **Order** *ORD-2001* is the last pending **Order** in the **Click-and-Collect Queue**
When **Store Employee** marks **Order** *ORD-2001* as *collected*
Then the **Click-and-Collect Queue** shows heading *All orders fulfilled*
And the queue displays *No pending orders — check back later*


---

## increment-3 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 3

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
increment_scope: Increment 3 — Ship to home
specification_refresh: Run 4 slot 77
---

# Specification by Example — Increment 3: Ship to home

**Refresh:** Run 4 slot 77 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/specification/crc.md`, `docs/end-to-end/specification/domain.json`, and `docs/end-to-end/exploration/stories/acceptance-criteria.md`. *Guest checkout* only; no *customer account*, login, or *saved address*; *StripeWave* sole *payment vendor*; *standard delivery* and *click-and-collect* only — express and same-day deferred.

---

## Story: `Enter Shipping Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Billing Address:

| scenario | billing_name | address_line_one | address_line_two | city | county_or_region | postcode | country |
|---|---|---|---|---|---|---|---|
| 1 | Sarah Jones | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom |

### Shipping Address:

| scenario | recipient_name | address_line_one | address_line_two | city | county_or_region | postcode | country | expected_validation |
|---|---|---|---|---|---|---|---|---|
| 1 | Sarah Jones | 28 Oak Lane | — | Edinburgh | Midlothian | EH1 3DG | United Kingdom | valid |
| 2 | Sarah Jones | 10 Elm Avenue | Flat 3 | London | Greater London | SW1A 2AA | United Kingdom | valid |
| 3 | — | — | — | Bristol | — | — | United Kingdom | invalid — missing recipient name, address line 1, and postcode |

---

### Scenario 1: `Shipping address form presented on ship-to-home checkout path`

Given the customer is on a ship-to-home checkout path in **Guest Checkout**
And the customer has completed **Billing Address** with **billing name** *Sarah Jones*, **address line one** *10 Elm Avenue*, **city** *London*, **postcode** *SW1A 2AA*
When the checkout presents the **Shipping Address** step
Then the form collects: **recipient name**, **address line one**, **address line two** (optional), **city**, **county or region**, **postcode**, and **country**
And required fields are marked: **recipient name**, **address line one**, **city**, **postcode**, **country**

### Scenario 2: `Click-and-collect checkout skips shipping address step`

Given the customer has selected **Click-and-Collect** as the **Delivery Option** during checkout
And the customer has completed **Billing Address** with **address line one** *10 Elm Avenue*, **city** *London*, **postcode** *SW1A 2AA*
When the customer advances from the billing step
Then the checkout does not present the **Shipping Address** step
And the customer proceeds to **Pickup Store** selection instead

### Scenario 3: `Same as billing pre-fills shipping address`

Given **Billing Address** has **billing name** *Sarah Jones*, **address line one** *10 Elm Avenue*, **address line two** *Flat 3*, **city** *London*, **county or region** *Greater London*, **postcode** *SW1A 2AA*, **country** *United Kingdom*
When the customer selects *same as billing* on the **Shipping Address** step
Then **Shipping Address** pre-fills **recipient name** with *Sarah Jones*
And **address line one** with *10 Elm Avenue*
And **address line two** with *Flat 3*
And **city** with *London*
And **county or region** with *Greater London*
And **postcode** with *SW1A 2AA*
And **country** with *United Kingdom*

### Scenario 4: `Override single field on pre-filled shipping address`

Given **Shipping Address** is pre-filled from **Billing Address** with **city** *London*
When the customer overrides **city** to *Edinburgh*
Then **Shipping Address** shows **city** *Edinburgh*
And **address line one** remains *10 Elm Avenue*
And **postcode** remains *SW1A 2AA*

### Scenario 5: `Missing required fields show validation messages`

Given the customer leaves **recipient name** blank, **address line one** blank, and **postcode** blank on the **Shipping Address** form
When the customer submits the **Shipping Address**
Then the form shows validation message *Recipient name is required* on **recipient name**
And the form shows validation message *Address line 1 is required* on **address line one**
And the form shows validation message *Postcode is required* on **postcode**
And checkout remains on the **Shipping Address** step

### Scenario 6: `Complete shipping address advances to delivery option selection`

Given the customer enters **Shipping Address** with **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **county or region** *Midlothian*, **postcode** *EH1 3DG*, **country** *United Kingdom*
When the customer submits the **Shipping Address**
Then checkout advances to the **Delivery Option** selection step
And the order summary shows **Shipping Address** *28 Oak Lane, Edinburgh, Midlothian, EH1 3DG*

---

## Story: `Select Delivery Option`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Delivery Option:

| scenario | delivery_method_name | estimated_delivery_window | shipping_cost | expected_display_label |
|---|---|---|---|---|
| 1 | Standard Delivery | 3–5 business days | £4.99 | Standard Delivery (3–5 business days) — £4.99 |
| 2 | Click-and-Collect | — | £0.00 | Click-and-Collect — Free |

### Store:

| scenario | store_name | store_code | address_line_one | city | postcode |
|---|---|---|---|---|---|
| 1 | PawPlace Camden | STR-001 | 42 High Street | London | NW1 8QP |

---

### Scenario 1: `Standard delivery and click-and-collect options shown`

Given the customer has completed the **Shipping Address** step
When the customer reaches the **Delivery Option** selection step
Then **Standard Delivery** is shown with **estimated delivery window** *3–5 business days* and **shipping cost** *£4.99*
And **Click-and-Collect** is shown with **shipping cost** *£0.00*
And express and same-day **Delivery Option** variants are not listed

### Scenario 2: `Standard delivery confirms shipping address and advances to payment`

Given the customer selects **Standard Delivery** as the **Delivery Option**
And **Shipping Address** is **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **postcode** *EH1 3DG*
When the customer confirms the **Delivery Option**
Then **Shipping Address** is confirmed as the delivery destination for the **Order**
And **shipping cost** *£4.99* is recorded on the **Order**
And checkout advances to **Payment**

### Scenario 3: `Switch from standard delivery to click-and-collect drops shipping requirement`

Given the customer has selected **Standard Delivery** and entered **Shipping Address** *28 Oak Lane, Edinburgh EH1 3DG*
When the customer switches to **Click-and-Collect**
Then the **Pickup Store** selector is displayed for **Pickup Store** selection
And the **Shipping Address** requirement is dropped
And **Billing Address** remains required

### Scenario 4: `Switch from click-and-collect to standard delivery prompts shipping address`

Given the customer has selected **Click-and-Collect** and chosen **Pickup Store** *PawPlace Camden* (*STR-001*)
When the customer switches to **Standard Delivery**
Then the **Shipping Address** form is presented
And the **Pickup Store** selector is dismissed
And **Billing Address** remains unchanged

---

## Story: `View and Process Incoming Orders`

**Story type:** store employee

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date | order_status | delivery_method_name | guest_email_snapshot | shipping_address_line_one | shipping_city | shipping_postcode | expected_queue_label |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ORD-3001 | 2025-05-07 | confirmed | Standard Delivery | sarah.jones@example.com | 28 Oak Lane | Edinburgh | EH1 3DG | Ship — ORD-3001 |
| 2 | ORD-3002 | 2025-05-07 | confirmed | Click-and-Collect | tom.brown@example.com | — | — | — | Collect — ORD-3002 |

### Order Line Item:

| scenario | order_number | product_name_snapshot | sku_snapshot | quantity |
|---|---|---|---|---|
| 1 | ORD-3001 | Premium Dog Harness | PET-HAR-001 | 1 |
| 2 | ORD-3001 | Large Dog Bed | PET-BED-015 | 1 |
| 3 | ORD-3002 | Salmon Cat Treats | PET-TRT-042 | 3 |

---

### Scenario 1: `Order queue shows all delivery types on admin dashboard`

Given **Store Employee** opens the **Order Queue** on the **Admin Dashboard**
And the **Order Queue** contains **Order** *ORD-3001* with **Delivery Option** *Standard Delivery* and **Order** *ORD-3002* with **Delivery Option** *Click-and-Collect*
When **Store Employee** views the **Order Queue**
Then each **Order** shows **order number**, **Order Line Item** details, delivery type label, and **Guest Email** or customer name
And **Order** *ORD-3001* shows delivery label *Standard Delivery*
And **Order** *ORD-3002* shows delivery label *Click-and-Collect*

### Scenario 2: `Ship-to-home order detail shows shipping address and items to pack`

Given **Store Employee** selects **Order** *ORD-3001* with **Delivery Option** *Standard Delivery* from the **Order Queue**
When the order detail is displayed
Then **Shipping Address** shows *28 Oak Lane, Edinburgh EH1 3DG*
And **Order Line Item** entries to pack are listed: *Premium Dog Harness* (qty *1*), *Large Dog Bed* (qty *1*)
And a *Mark as Fulfilled* action is displayed for **Ship-to-Home Fulfillment**

### Scenario 3: `Fulfillment with tracking number triggers shipping notification`

Given **Store Employee** views **Order** *ORD-3001* with **order status** *confirmed*
When **Store Employee** marks **Order** *ORD-3001* as fulfilled through **Ship-to-Home Fulfillment**
Then the system prompts for a **Tracking Number**
When **Store Employee** enters **Tracking Number** with **carrier reference** *RM-1Z999AA10123456784* and **carrier name** *Royal Mail*
Then **Order** *ORD-3001* transitions **order status** to *fulfilled*
And the **Shipping Notification** is triggered (see *Send Shipping Notification with Tracking Number*)

### Scenario 4: `Fulfillment without tracking number shows warning and allows completion`

Given **Store Employee** views **Order** *ORD-3001* with **order status** *confirmed*
When **Store Employee** marks **Order** *ORD-3001* as fulfilled through **Ship-to-Home Fulfillment** without entering a **Tracking Number**
Then the system displays warning *Customer will not receive a shipping notification*
And **Order** *ORD-3001* can still be marked *fulfilled*
And the order detail shows an *Add Tracking Number* field for later entry

---

## Story: `Send Shipping Notification with Tracking Number`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_status | guest_email_snapshot | estimated_delivery_date |
|---|---|---|---|---|
| 1 | ORD-3001 | fulfilled | sarah.jones@example.com | 2025-05-12 |
| 2 | ORD-3003 | fulfilled | alex.white@example.com | 2025-05-14 |

### Tracking Number:

| scenario | order_number | carrier_reference | carrier_name | shipment_date |
|---|---|---|---|---|
| 1 | ORD-3001 | RM-1Z999AA10123456784 | Royal Mail | 2025-05-07 |
| 2 | ORD-3003 | RM-2Z888BB20234567895 | Royal Mail | 2025-05-09 |

### Shipping Notification:

| scenario | order_number | notification_subject | recipient_guest_email | expected_delivery_status |
|---|---|---|---|---|
| 1 | ORD-3001 | Your PawPlace order ORD-3001 has shipped | sarah.jones@example.com | sent |
| 2 | ORD-3001 | Your PawPlace order ORD-3001 has shipped | sarah.jones@example.com | queued |

---

### Scenario 1: `Shipping notification sent with tracking and delivery details`

Given **Order** *ORD-3001* has **order status** *fulfilled*
And **Guest Checkout** on **Order** *ORD-3001* has **Guest Email** *sarah.jones@example.com*
And **Store Employee** enters **Tracking Number** with **carrier reference** *RM-1Z999AA10123456784* and **carrier name** *Royal Mail*
And **Order** *ORD-3001* has **estimated delivery date** *2025-05-12*
When **Ship-to-Home Fulfillment** dispatch is confirmed
Then the system sends a **Shipping Notification** to *sarah.jones@example.com*
And the **Shipping Notification** includes **order number** *ORD-3001*, **Order Line Item** items shipped, **carrier name** *Royal Mail*, **Tracking Number** *RM-1Z999AA10123456784*, and **estimated delivery window** *3–5 business days*
And **Order** *ORD-3001* transitions **order status** from *fulfilled* to *shipped*

### Scenario 2: `Email unavailable queues notification without blocking status transition`

Given **Order** *ORD-3001* has **order status** *fulfilled*
And **Store Employee** enters **Tracking Number** *RM-1Z999AA10123456784*
When **Ship-to-Home Fulfillment** dispatch is confirmed
And the email delivery system is temporarily unavailable
Then the **Shipping Notification** is queued with **delivery status** *queued* for retry
And **Order** *ORD-3001* still transitions **order status** to *shipped*

### Scenario 3: `No tracking at fulfillment means no automatic shipping notification`

Given **Order** *ORD-3001* was marked *fulfilled* through **Ship-to-Home Fulfillment** without a **Tracking Number**
When fulfillment completes
Then no **Shipping Notification** is sent automatically
And **Order** *ORD-3001* has **order status** *fulfilled*
And the order detail displays an *Add Tracking Number* field

### Scenario 4: `Late tracking number entry triggers shipping notification`

Given **Order** *ORD-3003* has **order status** *fulfilled* and no **Tracking Number**
When **Store Employee** adds **Tracking Number** with **carrier reference** *RM-2Z888BB20234567895* and **carrier name** *Royal Mail*
Then the system sends a **Shipping Notification** to **Guest Email** *alex.white@example.com*
And **Order** *ORD-3003* transitions **order status** to *shipped*

---

## Story: `Track Order Status`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_status | tracking_number | estimated_delivery_date | guest_email_snapshot | shipment_date |
|---|---|---|---|---|---|---|
| 1 | ORD-3001 | shipped | RM-1Z999AA10123456784 | 2025-05-12 | sarah.jones@example.com | 2025-05-07 |
| 2 | ORD-3002 | confirmed | — | — | tom.brown@example.com | — |
| 3 | ORD-3001 | delivered | RM-1Z999AA10123456784 | 2025-05-12 | sarah.jones@example.com | 2025-05-07 |

---

### Scenario Outline 1: `Order status page displays status-appropriate content`

Given **Order** {order_number} has **order status** {order_status}
And **Order** {order_number} has **Tracking Number** {tracking_number} and **estimated delivery date** {estimated_delivery_date}
And the guest customer received a **Confirmation Email** or **Shipping Notification** with an **Order Status Page** link
When the guest customer opens the **Order Status Page** for **Order** {order_number}
Then the page shows **order status** {expected_status_label}
And the page lists **Order Line Item** contents for the **Order**
And the tracking section shows {expected_tracking_display}
And the delivery section shows {expected_delivery_display}

#### Examples:

| scenario | order_number | order_status | tracking_number | estimated_delivery_date | expected_status_label | expected_tracking_display | expected_delivery_display |
|---|---|---|---|---|---|---|---|
| 1 | ORD-3001 | shipped | RM-1Z999AA10123456784 | 2025-05-12 | Shipped | RM-1Z999AA10123456784 (Royal Mail carrier link) | Shipment date: 2025-05-07 — Estimated delivery: 2025-05-12 |
| 2 | ORD-3002 | confirmed | — | — | Confirmed | Tracking will be available once your order ships | Order being prepared |
| 3 | ORD-3001 | delivered | RM-1Z999AA10123456784 | 2025-05-12 | Delivered | RM-1Z999AA10123456784 (Royal Mail carrier link) | Delivered on 2025-05-12 |

### Scenario Outline 2: `Guest order lookup requires matching order number and guest email`

Given **Order** {order_number} was placed with **Guest Email** {actual_guest_email}
When a guest enters **order number** {order_number} and email {entered_email} on the order lookup page
Then the system shows {expected_result}
And the page displays {expected_content}

#### Examples:

| scenario | order_number | actual_guest_email | entered_email | expected_result | expected_content |
|---|---|---|---|---|---|
| 1 | ORD-3001 | sarah.jones@example.com | sarah.jones@example.com | success | **Order Status Page** for **Order** *ORD-3001* |
| 2 | ORD-3001 | sarah.jones@example.com | wrong@example.com | access denied | *We couldn't find an order matching those details* |

### Scenario 3: `Status change reflected on next page visit without push notification`

Given the guest customer previously viewed the **Order Status Page** for **Order** *ORD-3001* with **order status** *shipped*
When **Order** *ORD-3001* transitions **order status** to *delivered*
Then the guest customer's next visit to the **Order Status Page** shows **order status** *Delivered*
And no push notification is sent for the status change


---

## increment-4 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 4

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
increment_scope: Increment 4 — Returning customers
specification_refresh: Run 5 slot 103
---

# Specification by Example — Increment 4: Returning customers — accounts, history, reorder

**Refresh:** Run 5 slot 103 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/specification/crc.md`, `docs/end-to-end/specification/domain.json`, and `docs/end-to-end/exploration/stories/acceptance-criteria.md`. *Guest checkout* coexists with authenticated checkout; *StripeWave* sole active *payment vendor*; mandatory *email verification* gates account-only features; PayNova, VaultPay, *customer pet* CRUD, *communication preferences* UI, express/same-day delivery, and *return* deferred.

---

## Story: `Register Account`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `Registration form collects email and password with requirements visible`

When the customer opens the registration screen
Then the form collects **email address** and **password** (with confirmation)
And password requirements are shown clearly before submission: *minimum 8 characters*, *at least one uppercase letter*, *at least one digit*, *at least one special character*

### Scenario 2: `Valid registration creates unverified customer account and triggers email verification`

Given no **Customer Account** exists for **email address** *jane.doe@example.com*
When the customer submits **email address** *jane.doe@example.com* and password *Str0ngP@ss!* with matching confirmation
Then a **Customer Account** is created for *Jane Doe* with **account verification status** *unverified*
And the system triggers **Email Verification** to *jane.doe@example.com*
And the customer sees confirmation screen *check your email to verify*

### Scenario 3: `Duplicate email rejected without revealing verification status`

Given a **Customer Account** exists with **email address** *existing@example.com* and **account verification status** *verified*
When the customer submits **email address** *existing@example.com* on the registration form
Then the form shows error *This email is already in use*
And a *Log In instead* link is displayed
And the error does not reveal whether the existing **account verification status** is *verified* or *unverified*

### Scenario Outline 1: `Password failing requirements blocks account creation`

Given the registration form is open
When the customer submits **email address** *new.user@example.com* with password {attempted_password}
Then the form shows which requirements are unmet: {unmet_requirement}
And no **Customer Account** is created

#### Examples:

| scenario | attempted_password | unmet_requirement |
|---|---|---|
| 1 | short | minimum 8 characters |
| 2 | nouppercase1! | at least one uppercase letter |
| 3 | NoDigits! | at least one digit |

---

## Story: `Send Email Verification`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Customer Account:

| scenario | email_address | account_verification_status |
|---|---|---|
| 1 | jane.doe@example.com | unverified |

### Verification Link:

| scenario | email_address | unique_link_token | expiry_time | one_time_use_flag |
|---|---|---|---|---|
| 1 | jane.doe@example.com | vlink-abc123 | 2025-05-25T12:00:00Z | true |

---

### Scenario 1: `Verification email sent with unique time-limited link on account creation`

Given a **Customer Account** was just created with **email address** *jane.doe@example.com* and **account verification status** *unverified*
When the system processes **Email Verification**
Then a **Notification** is sent to *jane.doe@example.com* with **notification channel** *email*
And the **Notification** body contains a **Verification Link** that is unique and time-limited

### Scenario 2: `Expired verification link shows message and resend action`

Given a **Customer Account** with **email address** *jane.doe@example.com*
And a **Verification Link** with **expiry time** *2025-05-23T12:00:00Z* was issued more than 24 hours ago
When the customer clicks the expired **Verification Link**
Then the system shows message *This verification link has expired*
And a *resend verification* action is offered

### Scenario 3: `Email delivery unavailable queues verification for retry`

Given a **Customer Account** with **email address** *jane.doe@example.com* triggers **Email Verification**
And the email delivery system is temporarily unavailable
When the system attempts to send the verification email
Then the **Notification** is queued with **delivery status** *queued* for retry
And the registration confirmation screen tells the customer *expect the email shortly*

---

## Story: `Verify Email Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `Valid verification link transitions account to verified`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *unverified*
And a valid, non-expired **Verification Link** for that **Customer Account**
When the customer clicks the **Verification Link**
Then the **Customer Account** **account verification status** becomes *verified*
And the customer is redirected to confirmation page *you're verified* with prompt *log in to your account*

### Scenario 2: `Already-used verification link is idempotent`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *verified*
And the **Verification Link** has **one-time use flag** *used*
When the customer clicks the used **Verification Link**
Then the system shows message *already verified* with a *login* link
And the **Customer Account** **account verification status** remains *verified*

### Scenario 3: `Expired verification link offers resend`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *unverified*
And the **Verification Link** has expired
When the customer clicks the expired **Verification Link**
Then the system shows message *link expired*
And a *resend verification* action is displayed

---

## Story: `Log In`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Customer Account:

| scenario | email_address | account_verification_status |
|---|---|---|
| 1 | jane.doe@example.com | verified |
| 2 | tom.reed@example.com | unverified |

### Product:

| scenario | sku | product_name |
|---|---|---|
| 1 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg |
| 2 | SKU-CAT-TOY-05 | Feather Wand Cat Toy |

---

### Scenario 1: `Valid credentials create customer session and redirect`

Given a **Customer Account** with **email address** *jane.doe@example.com* and **account verification status** *verified*
When the customer submits valid credentials on the login screen
Then a **Customer Session** is created for that **Customer Account**
And the customer is redirected to the account dashboard

### Scenario 2: `Invalid credentials show generic error`

Given a **Customer Account** with **email address** *jane.doe@example.com*
When the customer submits **email address** *jane.doe@example.com* and an incorrect password
Then the login screen shows error *invalid email or password*
And the error does not specify which field is wrong

### Scenario 3: `Unverified account blocked from customer session with account-only access`

Given a **Customer Account** with **email address** *tom.reed@example.com* and **account verification status** *unverified*
When the customer submits valid credentials for that **Customer Account**
Then the system shows message *please verify your email first*
And a *resend verification* option is offered
And no **Customer Session** with account-only feature access is created

### Scenario 4: `Guest shopping cart merges into account cart on login`

Given a **Customer Account** with **email address** *jane.doe@example.com* has a **Shopping Cart** containing **Product** *SKU-CAT-TOY-05* with quantity *1*
And a guest **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *2*
When the customer logs into the **Customer Account**
Then the guest **Shopping Cart** merges into the account **Shopping Cart**
And **Product** *SKU-DOG-FOOD-01* has quantity *2* in the merged **Shopping Cart**
And **Product** *SKU-CAT-TOY-05* has quantity *1* in the merged **Shopping Cart**

### Scenario 5: `Merge sums quantities when both carts contain same product`

Given a **Customer Account** **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *1*
And a guest **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *2*
When the customer logs into the **Customer Account**
Then **Product** *SKU-DOG-FOOD-01* has quantity *3* in the merged **Shopping Cart**

---

## Story: `Log Out`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `Logout invalidates current customer session only`

Given a **Customer Account** with **email address** *jane.doe@example.com* has an active **Customer Session** on device *mobile phone*
And an active **Customer Session** on device *laptop*
When the customer selects *Log Out* on device *mobile phone*
Then the **Customer Session** on device *mobile phone* is invalidated
And the customer is redirected to the home page in a guest state
And the **Customer Session** on device *laptop* remains active

### Scenario 2: `Log out everywhere invalidates all customer sessions`

Given a **Customer Account** with active **Customer Session** on devices *mobile phone* and *laptop*
When the customer selects *Log out everywhere*
Then all **Customer Session** for that **Customer Account** are invalidated
And the customer must re-authenticate on every device

---

## Story: `Reset Password`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario Outline 1: `Reset request shows same confirmation regardless of account existence`

When the customer requests password reset for **email address** {email_address}
Then the customer sees confirmation message *check your email*
And a password reset link is sent only when a **Customer Account** exists for {email_address} ({reset_link_sent})

#### Examples:

| scenario | email_address | reset_link_sent |
|---|---|---|
| 1 | jane.doe@example.com | true |
| 2 | unknown@example.com | false |

### Scenario 2: `Valid reset link opens set-new-password form`

Given a **Customer Account** with **email address** *jane.doe@example.com*
And a valid, non-expired password reset **Verification Link**
When the customer clicks the reset link
Then the customer is taken to a *set new password* form
And the new password must meet the same requirements as registration

### Scenario 3: `Password update invalidates all customer sessions`

Given a **Customer Account** with **email address** *jane.doe@example.com* has active **Customer Session** on devices *mobile phone* and *laptop*
When the customer submits new password *NewStr0ngP@ss!* through the reset form
Then the **Customer Account** password is updated
And all **Customer Session** on all devices are invalidated
And the customer must log in again on each device

### Scenario Outline 2: `Expired or used reset link rejected`

Given a password reset **Verification Link** for **Customer Account** *jane.doe@example.com* with status {link_status}
When the customer clicks the reset link
Then the system shows message {expected_message}
And a {expected_action} action is offered
And the **Customer Account** password remains unchanged

#### Examples:

| scenario | link_status | expected_message | expected_action |
|---|---|---|---|
| 1 | expired | link expired | Request new reset |
| 2 | used | link already used | Request new reset |

---

## Story: `Maintain Session Across Devices`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `Login on new device creates additional customer session`

Given a **Customer Account** with **email address** *jane.doe@example.com* has an active **Customer Session** on device *laptop*
When the customer logs in on device *tablet*
Then a new **Customer Session** is created for device *tablet*
And the **Customer Session** on device *laptop* remains active

### Scenario Outline 1: `Session expiry redirects to login but preserves shopping cart`

Given a **Customer Account** with **email address** *jane.doe@example.com* has a **Shopping Cart** containing *3* **Cart Item** entries
And the **Customer Session** **session token** has expired due to {expiry_reason}
When the session is evaluated
Then the customer is redirected to the login screen
And the **Shopping Cart** tied to the **Customer Account** retains all *3* **Cart Item** entries

#### Examples:

| scenario | expiry_reason |
|---|---|
| 1 | inactivity timeout |
| 2 | max session duration |

### Scenario 2: `Password reset invalidates all customer sessions`

Given a **Customer Account** has active **Customer Session** on devices *laptop* and *tablet*
When the customer changes password through **Reset Password**
Then all **Customer Session** on all devices are invalidated
And the customer must re-authenticate on each device

---

## Story: `Save Delivery Address`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Saved Address:

| scenario | address_label | address_line_one | city | postcode | country | default_shipping_flag |
|---|---|---|---|---|---|---|
| 1 | Home | 42 Oak Lane | Bristol | BS1 4QT | United Kingdom | true |
| 2 | Work | 10 High Street | London | E1 6AN | United Kingdom | false |

---

### Scenario 1: `Checkout offers save address option for logged-in customer`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* is completing checkout
And the customer enters **Shipping Address** with **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*, **country** *United Kingdom*
When the customer accepts *save this address for future orders*
Then a **Saved Address** is stored in the **Address Book** for that **Customer Account**
And the **Saved Address** has **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*

### Scenario 2: `First saved address becomes default address automatically`

Given a **Customer Account** with **email address** *jane.doe@example.com* has no **Saved Address** entries in the **Address Book**
When the customer saves **Shipping Address** with **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*
Then the **Saved Address** is created with **default shipping flag** *true*
And that **Saved Address** is the **Default Address** for future checkouts

### Scenario 3: `Additional saved address does not replace existing entries`

Given a **Customer Account** **Address Book** already contains **Saved Address** *Home* at *42 Oak Lane, Bristol BS1 4QT* with **default shipping flag** *true*
When the customer saves a new **Saved Address** with **address line one** *10 High Street*, **city** *London*, **postcode** *E1 6AN*
Then the **Address Book** contains both **Saved Address** entries
And the new **Saved Address** has **default shipping flag** *false*
And account settings **Address Book** shows the new entry with a *set as default* option

---

## Story: `Manage Saved Addresses`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Saved Address:

| scenario | address_label | address_line_one | city | postcode | country | default_shipping_flag |
|---|---|---|---|---|---|---|
| 1 | Home | 42 Oak Lane | Bristol | BS1 4QT | United Kingdom | true |
| 2 | Work | 10 High Street | London | E1 6AN | United Kingdom | false |

---

### Scenario 1: `Address book lists all saved addresses with default indicated`

Given a **Customer Account** with **email address** *jane.doe@example.com* has **Address Book** containing two **Saved Address** entries
When the customer opens the **Address Book** from account settings
Then all **Saved Address** entries are listed with full details
And the **Saved Address** *Home* at *42 Oak Lane* is visually indicated as the **Default Address**

### Scenario 2: `Edited saved address persists for future checkouts`

Given a **Saved Address** with **address line one** *42 Oak Lane*, **city** *Bristol*, **postcode** *BS1 4QT*
When the customer edits **city** to *Bath* and saves the **Saved Address**
Then the **Saved Address** shows **city** *Bath*
And future checkouts using that **Saved Address** reflect **city** *Bath*

### Scenario 3: `Deleting default saved address prompts new default selection`

Given a **Customer Account** **Address Book** has **Saved Address** *Home* as **Default Address**
And **Saved Address** *Work* at *10 High Street, London E1 6AN* also exists
When the customer deletes **Saved Address** *Home*
Then **Saved Address** *Home* is removed from the **Address Book**
And the customer is prompted to select a new **Default Address**
And **Saved Address** *Work* is offered as the new **Default Address**

### Scenario 4: `Setting new default address demotes previous default`

Given **Saved Address** *Home* has **default shipping flag** *true*
And **Saved Address** *Work* has **default shipping flag** *false*
When the customer sets **Saved Address** *Work* as **Default Address**
Then **Saved Address** *Work* has **default shipping flag** *true*
And **Saved Address** *Home* has **default shipping flag** *false*
And future checkouts pre-select **Saved Address** *Work*

---

## Story: `Save Payment Method`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Saved Payment Method:

| scenario | vendor_token_reference | last_four_digits | card_brand | expiry_month | expiry_year | default_payment_method_flag |
|---|---|---|---|---|---|---|
| 1 | tok_sw_4242 | 4242 | Visa | 12 | 2027 | true |

---

### Scenario 1: `Checkout offers save payment method via StripeWave token`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* completes **Payment** through **StripeWave**
When the customer accepts *save this payment method for future orders*
Then a **Saved Payment Method** is created with **vendor-token reference** *tok_sw_4242*
And raw card numbers are not stored on the **Customer Account**

### Scenario 2: `Saved payment method stores display metadata only`

Given the customer saves a payment method during checkout via **StripeWave**
When the **Saved Payment Method** is persisted
Then the **Customer Account** stores **last four digits** *4242*, **card brand** *Visa*, **expiry month** *12*, and **expiry year** *2027* for display
And future **Payment** uses the **vendor-token reference** without re-entering full card details

### Scenario 3: `Second saved payment method retains first as default`

Given a **Customer Account** already has **Saved Payment Method** ending *4242* as **Default Payment Method**
When the customer saves a second **Saved Payment Method** ending *5555* via **StripeWave**
Then both **Saved Payment Method** entries appear in account settings
And the first **Saved Payment Method** ending *4242* remains the **Default Payment Method**

---

## Story: `Manage Saved Payment Methods`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Saved Payment Method:

| scenario | vendor_token_reference | last_four_digits | card_brand | expiry_month | expiry_year | default_payment_method_flag |
|---|---|---|---|---|---|---|
| 1 | tok_sw_4242 | 4242 | Visa | 12 | 2027 | true |
| 2 | tok_sw_5555 | 5555 | Mastercard | 06 | 2028 | false |

---

### Scenario 1: `Saved payment methods listed with default indicated`

Given a **Customer Account** with two **Saved Payment Method** entries
When the customer opens saved payment methods from account settings
Then all **Saved Payment Method** entries show **last four digits**, **card brand**, and expiry
And **Saved Payment Method** ending *4242* is visually indicated as the **Default Payment Method**

### Scenario 2: `Removing default payment method prompts new default`

Given **Saved Payment Method** ending *4242* is the **Default Payment Method**
And **Saved Payment Method** ending *5555* also exists
When the customer removes **Saved Payment Method** ending *4242*
Then the **vendor-token reference** for that method is deleted
And the method no longer appears at checkout
And the customer is prompted to select a new **Default Payment Method**
And **Saved Payment Method** ending *5555* is offered as the new default

### Scenario 3: `Setting new default payment method demotes previous default`

Given **Saved Payment Method** ending *4242* has **default payment method flag** *true*
When the customer sets **Saved Payment Method** ending *5555* as **Default Payment Method**
Then **Saved Payment Method** ending *5555* has **default payment method flag** *true*
And **Saved Payment Method** ending *4242* has **default payment method flag** *false*
And future checkouts pre-select **Saved Payment Method** ending *5555*

---

## Story: `Select Saved Address at Checkout`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

Background:
  Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
  And the **Shopping Cart** for that **Customer Account** has items ready for checkout

### Saved Address:

| scenario | address_label | address_line_one | city | postcode | default_shipping_flag |
|---|---|---|---|---|---|
| 1 | Home | 42 Oak Lane | Bristol | BS1 4QT | true |
| 2 | Work | 10 High Street | London | E1 6AN | false |

---

### Scenario 1: `Saved addresses shown with default pre-selected at shipping step`

When the customer reaches the shipping step during checkout
Then all **Saved Address** entries from the **Address Book** are shown for selection
And **Saved Address** *Home* with **default shipping flag** *true* is pre-selected

### Scenario 2: `Selecting saved address auto-fills shipping fields and advances checkout`

When the customer selects **Saved Address** *Work* with **address line one** *10 High Street*, **city** *London*, **postcode** *E1 6AN*
Then the **Shipping Address** fields are auto-filled with *10 High Street, London, E1 6AN*
And checkout advances to the next step without manual entry

### Scenario 3: `Use different address reveals manual entry and save option`

When the customer chooses *use a different address*
Then manual **Shipping Address** entry fields are displayed
And a *save this address* checkbox is available to add the new address to the **Address Book** when checked

### Scenario 4: `Guest checkout shows manual address entry only`

Given a guest customer with a **Shopping Cart** is not logged in
When the guest reaches the shipping step during **Guest Checkout**
Then no **Address Book** selection is shown — only manual **Shipping Address** entry
And a prompt *log in or create an account to save addresses* is displayed
And **Guest Checkout** proceeds without requiring a **Customer Account**

---

## Story: `Select Saved Payment Method at Checkout`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

Background:
  Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
  And the **Shopping Cart** for that **Customer Account** has items ready for checkout

### Saved Payment Method:

| scenario | vendor_token_reference | last_four_digits | card_brand | expiry_month | expiry_year | default_payment_method_flag |
|---|---|---|---|---|---|---|
| 1 | tok_sw_4242 | 4242 | Visa | 12 | 2027 | true |
| 2 | tok_sw_5555 | 5555 | Mastercard | 06 | 2028 | false |

---

### Scenario 1: `Saved payment methods shown with default pre-selected`

When the customer reaches the payment step during checkout
Then all **Saved Payment Method** entries are shown for selection
And **Saved Payment Method** ending *4242* is pre-selected as the **Default Payment Method**

### Scenario 2: `Selecting saved payment method charges via vendor token`

When the customer selects **Saved Payment Method** with **vendor-token reference** *tok_sw_4242*
Then **Payment** proceeds through **StripeWave** using the stored token — no card re-entry required
And the customer sees confirmation **last four digits** *4242* and **card brand** *Visa*

### Scenario 3: `Use different payment method reveals manual entry and save option`

When the customer chooses *use a different payment method*
Then manual card entry for **StripeWave** is displayed
And a *save this payment method* checkbox stores a new **Saved Payment Method** when checked

### Scenario 4: `Expired vendor token marked and not silently charged`

Given **Saved Payment Method** with **vendor-token reference** *tok_sw_expired* has **expiry month** *01* and **expiry year** *2024*
When the customer reaches the payment step
Then that **Saved Payment Method** is marked *expired*
And remaining valid **Saved Payment Method** entries and manual card entry are displayed as alternatives
And the expired token is not used for a **Payment** charge attempt

---

## Story: `View Order History`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date | order_status | order_total | guest_email_snapshot |
|---|---|---|---|---|---|
| 1 | ORD-1001 | 2025-01-15 | delivered | £45.99 | — |
| 2 | ORD-1002 | 2025-03-20 | shipped | £82.50 | — |
| 3 | ORD-0999 | 2025-02-10 | delivered | £34.99 | sarah.jones@example.com |

### Order Line Item:

| scenario | order_number | sku_snapshot | product_name_snapshot | quantity | unit_price_snapshot |
|---|---|---|---|---|---|
| 1 | ORD-1001 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg | 1 | £29.99 |
| 2 | ORD-1001 | SKU-LEASH-03 | Leather Retractable Lead | 1 | £16.00 |
| 3 | ORD-1002 | SKU-CAT-TOY-05 | Feather Wand Cat Toy | 3 | £7.50 |

---

### Scenario 1: `Order history lists orders most recent first`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* has **Order** *ORD-1001* and **Order** *ORD-1002*
When the customer opens **Order History**
Then **Order** *ORD-1002* appears before **Order** *ORD-1001*
And each row shows **order number**, **order date**, condensed **Order Line Item** items, **order total**, and **order status**

### Scenario 2: `Order detail shows full snapshot including tracking`

Given **Order** *ORD-1002* has **order status** *shipped*
When the customer selects **Order** *ORD-1002* from **Order History**
Then full order detail opens with all **Order Line Item** entries, **Shipping Address** snapshot, **Billing Address** snapshot, **Delivery Option**, masked **Saved Payment Method**, and **Tracking Number** *RM-1Z999AA10123456784*

### Scenario 3: `Empty order history shows start shopping prompt`

Given a logged-in **Customer Account** with **email address** *new.customer@example.com* has no **Order** entries
When the customer opens **Order History**
Then an empty state shows prompt *start shopping*

### Scenario 4: `Guest order retroactively associated when email matches new account`

Given a **Guest Checkout** **Order** *ORD-0999* was placed with **Guest Email** *sarah.jones@example.com*
When a **Customer Account** is created with **email address** *sarah.jones@example.com*
Then **Order** *ORD-0999* is retroactively associated with that **Customer Account**
And **Order** *ORD-0999* appears in **Order History**

---

## Story: `Manage Wishlist`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Product:

| scenario | sku | product_name |
|---|---|---|
| 1 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg |
| 2 | SKU-CAT-TOY-05 | Feather Wand Cat Toy |

### Stock Availability:

| scenario | sku | available_to_sell_quantity |
|---|---|---|
| 1 | SKU-DOG-FOOD-01 | 15 |
| 2 | SKU-CAT-TOY-05 | 0 |

---

### Scenario 1: `Add to wishlist from product details page`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* and verified **account verification status**
And **Product** *SKU-DOG-FOOD-01* is not on the **Wishlist**
When the customer selects *Add to Wishlist* on the **Product** details page
Then **Product** *SKU-DOG-FOOD-01* is added to the **Wishlist** as a **Wishlist Item**
And the control changes to *Remove from Wishlist*

### Scenario 2: `Wishlist shows product details and stock availability`

Given the **Wishlist** contains **Wishlist Item** for **Product** *SKU-DOG-FOOD-01* and **Product** *SKU-CAT-TOY-05*
And **Stock Availability** for *SKU-DOG-FOOD-01* has **available to sell quantity** *15*
And **Stock Availability** for *SKU-CAT-TOY-05* has **available to sell quantity** *0*
When the customer opens the **Wishlist**
Then **Wishlist Item** for *SKU-DOG-FOOD-01* shows product name, image, price, and *In Stock*
And **Wishlist Item** for *SKU-CAT-TOY-05* shows *Out of Stock*

### Scenario 3: `Add to cart from wishlist leaves item on wishlist`

Given the **Wishlist** contains **Wishlist Item** for **Product** *SKU-DOG-FOOD-01*
When the customer selects *Add to Cart* from the **Wishlist Item**
Then **Product** *SKU-DOG-FOOD-01* is added to the **Shopping Cart**
And **Product** *SKU-DOG-FOOD-01* remains on the **Wishlist**

### Scenario 4: `Remove wishlist item resets product page control`

Given the **Wishlist** contains **Wishlist Item** for **Product** *SKU-DOG-FOOD-01*
When the customer removes the **Wishlist Item**
Then **Product** *SKU-DOG-FOOD-01* is removed from the **Wishlist**
And the *Add to Wishlist* control on the **Product** details page returns to its default state

### Scenario 5: `Guest add to wishlist shows dismissible login prompt`

Given a guest customer is viewing **Product** *SKU-DOG-FOOD-01*
When the guest selects *Add to Wishlist*
Then a prompt *log in or register* explains that **Wishlist** requires a verified **Customer Account**
And the customer remains on the **Product** details page
And the prompt is dismissible so browsing continues

---

## Story: `Reorder Previous Purchase`

**Story type:** user

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_date |
|---|---|---|
| 1 | ORD-1001 | 2025-01-15 |

### Order Line Item:

| scenario | order_number | sku_snapshot | product_name_snapshot | quantity |
|---|---|---|---|---|
| 1 | ORD-1001 | SKU-DOG-FOOD-01 | Premium Dog Kibble 5kg | 2 |
| 2 | ORD-1001 | SKU-LEASH-03 | Leather Retractable Lead | 1 |

### Stock Availability:

| scenario | sku_snapshot | available_to_sell_quantity | product_active |
|---|---|---|---|
| 1 | SKU-DOG-FOOD-01 | 10 | true |
| 2 | SKU-LEASH-03 | 0 | true |
| 3 | SKU-DISCONTINUED | 0 | false |

---

### Scenario 1: `Reorder adds all order line items to shopping cart`

Given a logged-in **Customer Account** has **Order** *ORD-1001* in **Order History**
And all **Order Line Item** **Product** entries are active and in stock
When the customer selects *Reorder* on **Order** *ORD-1001*
Then **Reorder** adds **Product** *SKU-DOG-FOOD-01* with quantity *2* and **Product** *SKU-LEASH-03* with quantity *1* to the **Shopping Cart**
And the customer is taken to the **Shopping Cart** to review before checkout

### Scenario 2: `Reorder skips delisted product with partial success`

Given **Order** *ORD-1001* contains **Order Line Item** for **Product** *SKU-DISCONTINUED*
And **Product** *SKU-DISCONTINUED* is no longer active in the **Product Catalog**
When the customer selects *Reorder* on **Order** *ORD-1001*
Then available **Product** entries are added to the **Shopping Cart**
And a clear message lists *SKU-DISCONTINUED* as unavailable because *product delisted*
And partial **Reorder** succeeds — available items are not blocked

### Scenario 3: `Reorder adds out-of-stock product with warning and options`

Given **Order** *ORD-1001* contains **Order Line Item** for **Product** *SKU-LEASH-03*
And **Stock Availability** for *SKU-LEASH-03* has **available to sell quantity** *0*
When the customer selects *Reorder* on **Order** *ORD-1001*
Then **Product** *SKU-LEASH-03* is added to the **Shopping Cart** with a **Stock Availability** warning
And *proceed anyway* and *remove* options are shown on that **Cart Item**

### Scenario 4: `Reorder merges quantities into existing shopping cart`

Given a **Customer Account** **Shopping Cart** contains **Product** *SKU-DOG-FOOD-01* with quantity *1*
And **Order** *ORD-1001* contains **Order Line Item** for **Product** *SKU-DOG-FOOD-01* with quantity *2*
When the customer selects *Reorder* on **Order** *ORD-1001*
Then **Product** *SKU-DOG-FOOD-01* in the **Shopping Cart** has quantity *3*


---

## increment-5 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 5

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
increment_scope: Increment 5 — Pay your way
specification_refresh: Run 6 slot 129
---

# Specification by Example — Increment 5: Pay your way — multi-vendor payment with retries

**Refresh:** Run 6 slot 129 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 119), `docs/end-to-end/specification/crc.md` (slot 127), `docs/end-to-end/specification/domain.json`, and `docs/end-to-end/exploration/stories/acceptance-criteria.md`. *StripeWave*, *PayNova*, and *VaultPay* are all active at the *payment method selector*; *payment retry* applies to *transient error* across all three vendors; *hard decline* never auto-retries. *Guest checkout* and Increments 1–4 paths remain valid. Full *return* customer flow deferred to Increment 7.

---

## Story: `Process Digital Wallet Payment via PayNova`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Order:

| scenario | order_number | order_total | order_status | currency |
|---|---|---|---|---|
| 1 | ORD-2001 | 85.00 | pending | GBP |
| 2 | ORD-2002 | 45.00 | pending | GBP |

### Customer Account:

| scenario | email_address | account_verification_status |
|---|---|---|
| 1 | jane.doe@example.com | verified |

---

### Scenario 1: `PayNova selection launches digital wallet authentication`

Given an **Order** with **order number** *ORD-2001* and **order status** *pending*
And the customer reaches the **Payment Method Selector**
When the customer selects **PayNova** at the **Payment Method Selector**
Then checkout redirects to or embeds the **PayNova** **digital wallet** authentication flow
And the customer authorises **Payment** using **mobile wallet credentials**

### Scenario 2: `Customer cancels PayNova wallet and other vendors remain selectable`

Given an **Order** with **order number** *ORD-2001* and **order status** *pending*
And the customer selected **PayNova** at the **Payment Method Selector**
When the customer cancels the **PayNova** wallet authentication flow
Then **StripeWave** and **VaultPay** remain selectable at the **Payment Method Selector**
And the **Order** **order status** remains *pending*

### Scenario 3: `PayNova payment confirmation confirms order and sends confirmation email`

Given an **Order** with **order number** *ORD-2001*, **order total** *£85.00*, and **order status** *pending*
When **PayNova** returns **Payment Confirmation** with **vendor confirmation reference** *pn_txn_7890*
Then a **Payment** is recorded with **processing vendor** *PayNova*, **vendor transaction reference** *pn_txn_7890*, **payment amount** *£85.00*, and **payment status** *captured*
And the **Order** **order status** transitions to *confirmed*
And the system sends a **Confirmation Email** to the customer
And the **Order Confirmation Page** is displayed

### Scenario Outline 1: `PayNova hard decline surfaces reason and alternative vendors`

Given an **Order** with **order number** {order_number} and **order status** *pending*
When **PayNova** returns a **Hard Decline** with **decline reason** {decline_reason}
Then the customer sees a clear error message: {decline_reason}
And the **Payment Method Selector** displays alternatives: *retry PayNova*, *StripeWave*, and *VaultPay*
And the **Order** **order status** remains *pending*
And no **Confirmation Email** is sent

#### Examples:

| scenario | order_number | decline_reason |
|---|---|---|
| 1 | ORD-2001 | insufficient wallet balance |
| 2 | ORD-2001 | wallet locked |

---

### Payment:

| scenario | payment_reference | order_number | processing_vendor | payment_status |
|---|---|---|---|---|
| 1 | pay_pn_pending_001 | ORD-2001 | PayNova | pending |

---

### Scenario 4: `PayNova webhook reconciles successful payment after timeout`

Given a **Payment** with **payment reference** *pay_pn_pending_001* for **Order** *ORD-2001* through **PayNova**
And the initial **PayNova** response timed out before **Payment Confirmation**
When a **Webhook Callback** from **PayNova** arrives with **vendor transaction reference** *pn_txn_7890* and reconciliation status *captured*
Then the system reconciles the **Webhook Callback** against the pending **Payment**
And **Payment** **payment status** transitions to *captured*
And the **Order** **order status** transitions to *confirmed*
And the **Confirmation Email** fires

### Scenario 5: `PayNova webhook failure leaves order unpaid`

Given a **Payment** with **payment reference** *pay_pn_pending_001* for **Order** *ORD-2001* through **PayNova**
And the initial **PayNova** response timed out
When a **Webhook Callback** from **PayNova** arrives with reconciliation status *failed*
Then **Payment** **payment status** transitions to *failed*
And the **Order** **order status** remains *pending*
And the customer is notified to retry at the **Payment Method Selector**

---

### Scenario 6: `Logged-in customer offered PayNova wallet save after successful payment`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
And **Payment** through **PayNova** with **vendor transaction reference** *pn_txn_7890* completed successfully
When checkout completes
Then the system offers to save **PayNova** as a **Saved Payment Method** on the **Customer Account**
And if accepted, a **Saved Payment Method** is created with **vendor-token reference** *tok_pn_wallet_001* and **wallet provider** *PayNova Wallet*
And wallet secrets are not stored on the **Customer Account**

---

## Story: `Process Buy-Now-Pay-Later via VaultPay`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Scenario 1: `VaultPay selection performs eligibility check and presents instalment plan`

Given an **Order** with **order number** *ORD-2003*, **order total** *£200.00*, and **order status** *pending*
When the customer selects **VaultPay** at the **Payment Method Selector**
Then checkout redirects to or embeds the **VaultPay** **buy-now-pay-later** flow
And **VaultPay** performs the **Eligibility Check**
And **VaultPay** presents an **Instalment Plan** of *4* payments of *£50.00*

### Scenario 2: `VaultPay instalment acceptance confirms order`

Given an **Order** with **order number** *ORD-2003*, **order total** *£200.00*, and **order status** *pending*
And **VaultPay** presented an **Instalment Plan** of *4* payments of *£50.00*
When the customer accepts the **Instalment Plan**
And **VaultPay** returns **Payment Confirmation** with **vendor confirmation reference** *vp_ref_5001*
Then a **Payment** is recorded with **processing vendor** *VaultPay*, **vendor transaction reference** *vp_ref_5001*, **payment amount** *£200.00*, and **payment status** *captured*
And the **Instalment Plan** reference is stored on the **Payment**
And the **Order** **order status** transitions to *confirmed*
And the system sends a **Confirmation Email**
And the **Order Confirmation Page** is displayed

### Scenario Outline 1: `VaultPay hard decline offers StripeWave and PayNova alternatives`

Given an **Order** with **order number** *ORD-2003* and **order status** *pending*
When **VaultPay** returns a **Hard Decline** with **decline reason** {decline_reason}
Then the customer sees a clear message that **buy-now-pay-later** is not available: {decline_reason}
And the **Payment Method Selector** displays **StripeWave** and **PayNova** as alternatives
And the **Order** **order status** remains *pending*

#### Examples:

| scenario | decline_reason |
|---|---|
| 1 | eligibility failed |
| 2 | credit check failed |

---

### Payment:

| scenario | payment_reference | order_number | processing_vendor | payment_status |
|---|---|---|---|---|
| 1 | pay_vp_pending_001 | ORD-2003 | VaultPay | pending |

---

### Scenario 3: `VaultPay webhook reconciles successful BNPL payment after timeout`

Given a **Payment** with **payment reference** *pay_vp_pending_001* for **Order** *ORD-2003* through **VaultPay**
And the initial **VaultPay** response timed out
When a **Webhook Callback** from **VaultPay** arrives with **vendor transaction reference** *vp_ref_5001* and reconciliation status *captured*
Then the system reconciles the **Webhook Callback** against the pending **Payment**
And **Payment** **payment status** transitions to *captured*
And the **Order** **order status** transitions to *confirmed*
And the **Confirmation Email** fires

### Scenario 4: `VaultPay webhook failure leaves order unpaid`

Given a **Payment** with **payment reference** *pay_vp_pending_001* for **Order** *ORD-2003* through **VaultPay**
And the initial **VaultPay** response timed out
When a **Webhook Callback** from **VaultPay** arrives with reconciliation status *failed*
Then **Payment** **payment status** transitions to *failed*
And the **Order** **order status** remains *pending*
And the customer is notified to retry

---

### Scenario 5: `VaultPay saved identity pre-fills but eligibility check runs each transaction`

Given a logged-in **Customer Account** with **email address** *jane.doe@example.com*
And **Payment** through **VaultPay** with **vendor transaction reference** *vp_ref_5001* completed successfully
When the customer accepts saving **VaultPay** as a **Saved Payment Method**
Then a **Saved Payment Method** is created with **vendor-token reference** *tok_vp_identity_001* and **processing vendor** *VaultPay*
And future **VaultPay** checkout pre-fills the customer's **VaultPay** identity
And the **Eligibility Check** is still performed on the next **VaultPay** transaction

---

## Story: `Retry Failed Payment`

**Story type:** system

**Sources / context:** ubiquitous-language.md, crc.md, acceptance-criteria.md

---

### Retry Window:

| scenario | maximum_attempt_count | time_limit |
|---|---|---|
| 1 | 3 | 5 minutes |

---

### Scenario 1: `Transient error triggers automatic payment retry with indicator`

Given a **Payment** with **payment reference** *pay_pn_retry_001* for **Order** *ORD-2001* through **PayNova**
And **Payment** **payment status** is *failed* due to a **Transient Error** with **failure type** *network timeout*
When the system evaluates the failure
Then the system automatically initiates **Payment Retry** through the same **PayNova** **processing vendor**
And the customer sees a *retrying payment* indicator at the **Payment Method Selector**
And no manual action is required during automatic retries

### Scenario 2: `Successful payment retry confirms order`

Given a **Payment** with **payment reference** *pay_pn_retry_001* for **Order** *ORD-2001* through **PayNova*
And **Payment Retry** was initiated due to **Transient Error** *vendor 5xx*
When the **Payment Retry** succeeds
Then **Payment** **payment status** transitions to *captured*
And the **Order** **order status** transitions to *confirmed*
And the customer sees the **Order Confirmation Page**
And the **Confirmation Email** fires

### Scenario Outline 1: `Retry exhaustion returns customer to payment method selector`

Given a **Payment** with **payment reference** {payment_reference} for **Order** {order_number} through {processing_vendor}
And **Payment** **payment status** is *failed* due to **Transient Error** {failure_type}
And **Payment Retry** **attempt count** has reached **Retry Window** **maximum attempt count** *3*
When the final **Payment Retry** also fails
Then the customer is notified that **Payment** could not be processed
And the **Payment Method Selector** displays **StripeWave**, **PayNova**, **VaultPay**, and manual card entry
And only one charge attempt occurs per **Payment Retry** cycle

#### Examples:

| scenario | payment_reference | order_number | processing_vendor | failure_type |
|---|---|---|---|---|
| 1 | pay_pn_retry_002 | ORD-2001 | PayNova | network timeout |
| 2 | pay_vp_retry_001 | ORD-2003 | VaultPay | vendor 5xx |
| 3 | pay_sw_retry_001 | ORD-2004 | StripeWave | network timeout |

---

### Scenario Outline 2: `Hard decline never triggers automatic payment retry`

Given a **Payment** with **payment reference** {payment_reference} for **Order** {order_number} through {processing_vendor}
And **Payment** **payment status** is *failed* due to **Hard Decline** with **decline reason** {decline_reason}
When the system evaluates whether to retry
Then the system does not initiate **Payment Retry**
And the customer is immediately shown **Hard Decline** **decline reason** {decline_reason}
And the **Payment Method Selector** displays alternative **Payment Vendor** options

#### Examples:

| scenario | payment_reference | order_number | processing_vendor | decline_reason |
|---|---|---|---|---|
| 1 | pay_sw_decline_001 | ORD-2004 | StripeWave | insufficient funds |
| 2 | pay_sw_decline_002 | ORD-2004 | StripeWave | card blocked |
| 3 | pay_sw_decline_003 | ORD-2004 | StripeWave | fraud flag |
| 4 | pay_vp_decline_001 | ORD-2003 | VaultPay | BNPL eligibility failure |

---

### Scenario 3: `Background payment retry confirms order after customer navigates away`

Given a **Payment** with **payment reference** *pay_pn_retry_003* for **Order** *ORD-2001* is in **Payment Retry** due to **Transient Error**
And the customer navigates away from checkout
When the **Payment Retry** completes successfully
Then **Payment Retry** **background continuation flag** is *true*
And the **Order** **order status** transitions to *confirmed*
And the **Confirmation Email** fires
And the customer is notified via **Notification** with **notification channel** *email*

### Scenario 4: `Background payment retry exhaustion leaves order unpaid`

Given a **Payment** with **payment reference** *pay_vp_retry_002* for **Order** *ORD-2003* is in **Payment Retry** due to **Transient Error**
And the customer navigates away from checkout
When all **Payment Retry** attempts exhaust within the **Retry Window**
Then the **Order** **order status** remains *pending*
And the customer is notified via **Notification** that **Payment** could not be processed


---

## increment-6 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 6

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification by Example — Increment 6: Pet visits — gallery and in-store appointments  

**Template:** Scenario Outline (parameterized with Examples tables)  

---  

## Story: `Browse Pets by Species`  

### Store (Given — above scenarios):  
| storeCode | storeName         | city    | postcode |  
|-----------|-------------------|---------|----------|  
| STR-001   | PawPlace Bristol  | Bristol | BS1 4QT  |  
| STR-002   | PawPlace London   | London  | E1 6AN   |  

### Breed (Given — above scenarios):  
| breedName        | species      |  
|------------------|--------------|  
| Golden Retriever | Dog          |  
| Maine Coon       | Cat          |  
| Ball Python      | Reptile      |  
| Holland Lop      | Small Mammal |  

### Pet (Given — above scenarios):  
| pet_id  | breed            | species      | hostingStore | lifecycleState |  
|---------|------------------|--------------|--------------|----------------|  
| PET-001 | Golden Retriever | Dog          | STR-001      | Available      |  
| PET-002 | Maine Coon       | Cat          | STR-001      | Available      |  
| PET-003 | Ball Python      | Reptile      | STR-002      | Available      |  
| PET-004 | Holland Lop      | Small Mammal | STR-002      | Available      |  
| PET-005 | Golden Retriever | Dog          | STR-002      | Adopted        |  

---  

### Scenario Outline: Pet gallery shows pets filterable by species  

Given the **Pet Gallery** contains **Pet** entries across multiple **Breed** species  
When the customer opens the *Pet Gallery*  
Then pets are grouped or filterable by **species**  
  And the *Pet Card* for **Pet** *{pet_id}* shows *{expected_photo_label}*, **Breed** *{breedName}*, **species** *{species}*, and **Store** *{storeName}*  
  And the card heading reads *{expected_card_heading}*  

### Pet Card display (Then — below scenario):  
| scenario | pet_id  | breedName        | species | storeName        | expected_photo_label       | expected_card_heading                     |  
|----------|---------|------------------|---------|------------------|----------------------------|-------------------------------------------|  
| 1        | PET-001 | Golden Retriever | Dog     | PawPlace Bristol | pet001_front.jpg           | Golden Retriever · Dog · PawPlace Bristol |  
| 2        | PET-002 | Maine Coon       | Cat     | PawPlace Bristol | pet002_front.jpg           | Maine Coon · Cat · PawPlace Bristol       |  
| 3        | PET-003 | Ball Python      | Reptile | PawPlace London  | pet003_front.jpg           | Ball Python · Reptile · PawPlace London   |  

---  

### Scenario Outline: Species filter applied — only matching pets shown  

Given the **Pet Gallery** contains pets of multiple species  
When the customer selects the **species** filter *{selected_species}*  
Then only **Pet** entries with **species** *{selected_species}* are shown  
  And the results heading reads *{expected_results_heading}*  
  And the *{selected_species}* filter chip is displayed in *{expected_filter_style}* state  

### Species filter (Then — below scenario):  
| scenario | selected_species | pets_shown | expected_results_heading | expected_filter_style |  
|----------|------------------|------------|--------------------------|-----------------------|  
| 1        | Dog              | PET-001    | 1 Dog available          | selected-highlighted  |  
| 2        | Cat              | PET-002    | 1 Cat available          | selected-highlighted  |  
| 3        | Reptile          | PET-003    | 1 Reptile available      | selected-highlighted  |  

---  

### Scenario Outline: No available pets for selected species — empty state with options  

Given the **Pet Gallery** has no **Pet** entries with **species** *{selected_species}* and **lifecycleState** *{lifecycleState}*  
When the customer selects the **species** filter *{selected_species}*  
Then the gallery shows *{expected_message}*  
  And the *{selected_species}* filter chip is displayed in *{expected_filter_style}* state  
  And the other species options *{expected_other_species}* remain selectable  

### Empty species (Then — below scenario):  
| scenario | selected_species | lifecycleState | expected_message                                  | expected_filter_style | expected_other_species          |  
|----------|------------------|----------------|---------------------------------------------------|-----------------------|---------------------------------|  
| 1        | Bird             | Available      | No pets available in this category right now      | selected-highlighted  | Dog, Cat, Reptile, Small Mammal |  

---  

## Story: `View Pet Profile`  

### Pet (Given — above scenarios):  
| pet_id  | petName | breedName        | species | dateOfBirth | hostingStore | lifecycleState |  
|---------|---------|------------------|---------|-------------|--------------|----------------|  
| PET-001 | Buddy   | Golden Retriever | Dog     | 2023-03-15  | STR-001      | Available      |  
| PET-005 | Rex     | Golden Retriever | Dog     | 2022-06-10  | STR-002      | Adopted        |  

### TemperamentAssessment (Given — above scenarios):  
| pet_id  | behavioralObservation                                  | assessmentDate |  
|---------|--------------------------------------------------------|----------------|  
| PET-001 | Friendly with children, high energy, loves fetch       | 2025-01-10     |  

### PetPhoto (Given — above scenarios):  
| pet_id  | imageFile          | caption                 |  
|---------|--------------------|-------------------------|  
| PET-001 | pet001_front.jpg   | Front view              |  
| PET-001 | pet001_playing.jpg | Playing in the garden   |  

---  

### Scenario Outline: Pet profile displays full details for available pet  

Given a **Pet** *{pet_id}* named *{petName}* with **lifecycleState** *{lifecycleState}*  
  And **Breed** *{breedName}* / **species** *{species}*  
  And **dateOfBirth** *{dateOfBirth}*  
  And **TemperamentAssessment** *{behavioralObservation}*  
  And hosted at **Store** *{storeCode}* (*{storeName}*)  
When the customer opens the *Pet Profile Page* for **Pet** *{pet_id}*  
Then the page shows *{expected_photo_count}* photos in the *Pet Photo Gallery*  
  And the profile heading reads *{expected_heading}*  
  And the age line reads *{expected_age_label}*  
  And the *Temperament Notes* section reads *{behavioralObservation}*  
  And the store line reads *{storeName}*  
  And the primary action button reads *{expected_action_label}*  

### Pet Profile display (Then — below scenario):  
| scenario | pet_id  | petName | breedName        | species | dateOfBirth | behavioralObservation                            | storeCode | storeName        | lifecycleState | expected_photo_count | expected_heading                  | expected_age_label | expected_action_label |  
|----------|---------|---------|------------------|---------|-------------|--------------------------------------------------|-----------|------------------|----------------|----------------------|-----------------------------------|--------------------|-----------------------|  
| 1        | PET-001 | Buddy   | Golden Retriever | Dog     | 2023-03-15  | Friendly with children, high energy, loves fetch | STR-001   | PawPlace Bristol | Available      | 2                    | Buddy · Golden Retriever · Dog   | 2 years old        | Book a Visit          |  

---  

### Scenario Outline: Adopted pet profile shows adopted badge and viewable details  

Given a **Pet** *{pet_id}* named *{petName}* with **lifecycleState** *{lifecycleState}*  
  And **Breed** *{breedName}* / **species** *{species}*  
When the customer opens the *Pet Profile Page* for **Pet** *{pet_id}*  
Then the profile heading reads *{expected_heading}*  
  And a badge reads *{expected_badge_label}*  
  And the action area reads *{expected_action_message}*  
  And the profile photo, breed, species, and store details remain visible  

### Adopted pet (Then — below scenario):  
| scenario | pet_id  | petName | breedName        | species | lifecycleState | expected_heading                 | expected_badge_label | expected_action_message                  |  
|----------|---------|---------|------------------|---------|----------------|----------------------------------|----------------------|------------------------------------------|  
| 1        | PET-005 | Rex     | Golden Retriever | Dog     | Adopted        | Rex · Golden Retriever · Dog     | Adopted              | This pet has found a home                |  

---  

### Scenario Outline: Pet profile without temperament shows remaining sections  

Given a **Pet** *{pet_id}* named *{petName}* with **lifecycleState** *{lifecycleState}* and no **TemperamentAssessment** entries  
  And **Breed** *{breedName}* / **species** *{species}*  
  And hosted at **Store** *{storeCode}* (*{storeName}*)  
When the customer opens the *Pet Profile Page* for **Pet** *{pet_id}*  
Then the profile heading reads *{expected_heading}*  
  And the displayed sections are *{expected_sections}*  
  And the primary action button reads *{expected_action_label}*  

### Pet without temperament (Then — below scenario):  
| scenario | pet_id  | petName | breedName   | species | lifecycleState | storeCode | storeName       | expected_heading                | expected_sections                                  | expected_action_label |  
|----------|---------|---------|-------------|---------|----------------|-----------|-----------------|---------------------------------|----------------------------------------------------|-----------------------|  
| 1        | PET-003 | Slinky  | Ball Python | Reptile | Available      | STR-002   | PawPlace London | Slinky · Ball Python · Reptile | Photo Gallery, Breed, Species, Age, Store Location | Book a Visit          |  

---  

## Story: `View Pet Store Location and Distance`  

### Store (Given — above scenarios):  
| storeCode | storeName        | addressLineOne   | city    | postcode | latitude  | longitude |  
|-----------|------------------|------------------|---------|----------|-----------|-----------|  
| STR-001   | PawPlace Bristol | 15 Queen Street  | Bristol | BS1 4QT  | 51.4545   | -2.5879   |  

---  

### Scenario Outline: Pet profile shows store details  

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}*  
  And **Store** *{storeCode}* has **storeName** *{storeName}*, **addressLineOne** *{addressLineOne}*, **city** *{city}*, **postcode** *{postcode}*  
When the customer views the *Pet Profile Page* for **Pet** *{pet_id}*  
Then the store section heading reads *{expected_store_heading}*  
  And the address line reads *{expected_address_line}*  

### Store display (Then — below scenario):  
| scenario | pet_id  | storeCode | storeName        | addressLineOne  | city    | postcode | expected_store_heading | expected_address_line              |  
|----------|---------|-----------|------------------|-----------------|---------|----------|------------------------|------------------------------------|  
| 1        | PET-001 | STR-001   | PawPlace Bristol | 15 Queen Street | Bristol | BS1 4QT  | PawPlace Bristol       | 15 Queen Street, Bristol, BS1 4QT |  

---  

### Scenario Outline: Distance calculated when customer shares location  

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}* with **latitude** *{store_lat}* and **longitude** *{store_lng}*  
  And the customer has shared their location: latitude *{customer_lat}*, longitude *{customer_lng}*  
When the customer views the *Pet Profile Page*  
Then the distance label reads *{expected_distance_label}*  

### Distance calculation (Then — below scenario):  
| scenario | pet_id  | storeCode | store_lat | store_lng | customer_lat | customer_lng | expected_distance_label |  
|----------|---------|-----------|-----------|-----------|--------------|--------------|-------------------------|  
| 1        | PET-001 | STR-001   | 51.4545   | -2.5879   | 51.4500      | -2.5800      | 0.7 km away             |  

---  

### Scenario Outline: Location not shared — store section shows share prompt  

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}* (*{storeName}*)  
  And the customer has not shared their location  
When the customer views the *Pet Profile Page*  
Then the store section heading reads *{storeName}*  
  And the distance area reads *{expected_prompt_text}*  

### No location shared (Then — below scenario):  
| scenario | pet_id  | storeCode | storeName        | expected_prompt_text                                       |  
|----------|---------|-----------|------------------|------------------------------------------------------------|  
| 1        | PET-001 | STR-001   | PawPlace Bristol | Share your location or enter a postcode to see distance    |  

---  

## Story: `View Available Time Slots at Store`  

### TimeSlot (Given — above scenarios):  
| timeslot_id | storeCode | startTime            | endTime              | bookingStatus |  
|-------------|-----------|----------------------|----------------------|---------------|  
| TS-001      | STR-001   | 2025-06-10T10:00:00  | 2025-06-10T10:30:00  | available     |  
| TS-002      | STR-001   | 2025-06-10T11:00:00  | 2025-06-10T11:30:00  | available     |  
| TS-003      | STR-001   | 2025-06-10T14:00:00  | 2025-06-10T14:30:00  | booked        |  
| TS-004      | STR-001   | 2025-06-11T10:00:00  | 2025-06-11T10:30:00  | available     |  

---  

### Scenario Outline: Available time slots shown for pet's store  

Given a **Pet** *{pet_id}* hosted at **Store** *{storeCode}*  
  And **Store** *{storeCode}* has **TimeSlot** entries for the next *{calendar_days}* days  
When the customer initiates the appointment booking flow from the pet profile  
Then the *Appointment Calendar* shows *{expected_slot_count}* available slots: *{expected_slots_shown}*  
  And the calendar heading reads *{expected_calendar_heading}*  

### Available slots display (Then — below scenario):  
| scenario | pet_id  | storeCode | calendar_days | expected_slots_shown   | expected_slot_count | expected_calendar_heading          |  
|----------|---------|-----------|---------------|------------------------|---------------------|------------------------------------|  
| 1        | PET-001 | STR-001   | 14            | TS-001, TS-002, TS-004 | 3                   | Available appointments at PawPlace Bristol |  

---  

### Scenario Outline: Appointment calendar shows only available slots  

Given **Store** *{storeCode}* has **TimeSlot** entries with mixed **bookingStatus** values  
When the customer views the *Appointment Calendar* for **Store** *{storeCode}*  
Then slot *{available_slot}* with **bookingStatus** *{available_status}* is displayed with label *{expected_slot_label}*  
  And slot *{booked_slot}* with **bookingStatus** *{booked_status}* is excluded from the list  

### Slot visibility (Then — below scenario):  
| scenario | storeCode | available_slot | available_status | expected_slot_label         | booked_slot | booked_status |  
|----------|-----------|----------------|------------------|-----------------------------|-------------|---------------|  
| 1        | STR-001   | TS-001         | available        | Tue 10 Jun, 10:00 – 10:30  | TS-003      | booked        |  
| 2        | STR-001   | TS-002         | available        | Tue 10 Jun, 11:00 – 11:30  | TS-003      | booked        |  
| 3        | STR-001   | TS-004         | available        | Wed 11 Jun, 10:00 – 10:30  | TS-003      | booked        |  

---  

### Scenario Outline: No available time slots — calendar shows next-steps message  

Given **Store** *{storeCode}* has no **TimeSlot** entries with **bookingStatus** *{required_status}* within *{calendar_days}* days  
When the customer views the *Appointment Calendar*  
Then the calendar shows *{expected_message}*  
  And a *{expected_action_label}* action is displayed  

### Empty calendar (Then — below scenario):  
| scenario | storeCode | required_status | calendar_days | expected_message                          | expected_action_label |  
|----------|-----------|-----------------|---------------|-------------------------------------------|-----------------------|  
| 1        | STR-002   | available       | 14            | No slots available — try a later date     | Browse later dates    |  

---  

## Story: `Select Date and Time Slot`  

### Scenario Outline: Selected slot held temporarily to prevent double-booking  

Given a **TimeSlot** *{timeslot_id}* at **Store** *{storeCode}* with **bookingStatus** *{bookingStatus_before}*  
When the customer selects **TimeSlot** *{timeslot_id}* from the *Appointment Calendar*  
Then the *Selected Slot* is highlighted and held temporarily for *{hold_minutes}* minutes  
  And **TimeSlot** *{timeslot_id}* **bookingStatus** transitions to *{bookingStatus_after}*  
  And the confirmation step reads *{expected_confirmation_prompt}*  

### Slot hold (Then — below scenario):  
| scenario | timeslot_id | storeCode | bookingStatus_before | hold_minutes | bookingStatus_after | expected_confirmation_prompt                  |  
|----------|-------------|-----------|----------------------|--------------|---------------------|----------------------------------------------|  
| 1        | TS-001      | STR-001   | available            | 10           | held                | Slot held for 10 minutes — confirm to book   |  

---  

### Scenario Outline: Temporary hold expires — slot released  

Given a **TimeSlot** *{timeslot_id}* with **bookingStatus** *{bookingStatus_before}* for customer *{customer_account_id}*  
  And the hold has exceeded *{hold_minutes}* minutes without confirmation  
When the hold timer expires  
Then **TimeSlot** *{timeslot_id}* **bookingStatus** reverts to *{bookingStatus_after}*  
  And the customer sees *{expected_expiry_message}*  

### Hold expiry (Then — below scenario):  
| scenario | timeslot_id | customer_account_id | hold_minutes | bookingStatus_before | bookingStatus_after | expected_expiry_message                                  |  
|----------|-------------|---------------------|--------------|----------------------|---------------------|----------------------------------------------------------|  
| 1        | TS-001      | CUST-001            | 10           | held                 | available           | Your hold has expired — please select a new time slot    |  

---  

### Scenario Outline: Concurrent selection — first to confirm wins  

Given two customers select the same **TimeSlot** *{timeslot_id}* simultaneously  
  And **CustomerAccount** *{first_customer}* confirms first  
  And **CustomerAccount** *{second_customer}* attempts to confirm second  
When *{second_customer}* submits confirmation  
Then *{first_customer}* receives outcome *{expected_first_outcome}*  
  And *{second_customer}* receives message *{expected_second_message}*  
  And *{first_customer}*'s **Appointment** is unaffected  

### Concurrent booking (Then — below scenario):  
| scenario | timeslot_id | first_customer | second_customer | expected_first_outcome | expected_second_message                                  |  
|----------|-------------|----------------|-----------------|------------------------|----------------------------------------------------------|  
| 1        | TS-001      | CUST-001       | CUST-002        | Appointment confirmed  | This slot is no longer available — please pick another   |  

---  

## Story: `Add Visit Note`  

### Scenario Outline: Visit note added within character limit  

Given the customer is in the appointment confirmation step for **Pet** *{pet_id}*  
  And the *Visit Note* field accepts up to *{char_limit}* characters  
When the customer enters a *Visit Note*: *{visit_note}*  
Then the **Appointment** is annotated with **visitNote** *{visit_note}*  
  And the confirmation preview shows *{expected_note_preview}*  

### Visit Note (Then — below scenario):  
| scenario | pet_id  | char_limit | visit_note                                          | expected_note_preview                               |  
|----------|---------|------------|-----------------------------------------------------|-----------------------------------------------------|  
| 1        | PET-001 | 500        | Bringing my two kids aged 5 and 7                   | Bringing my two kids aged 5 and 7                   |  
| 2        | PET-001 | 500        | Interested in adoption paperwork — previous dog owner | Interested in adoption paperwork — previous dog owner |  

---  

### Scenario Outline: Visit note left blank — appointment proceeds with note section hidden  

Given the customer is in the appointment confirmation step for **Pet** *{pet_id}*  
When the customer leaves the *Visit Note* blank  
Then the **Appointment** proceeds without a note  
  And the confirmation preview note section reads *{expected_note_display}*  
  And the staff view note section reads *{expected_staff_display}*  

### Blank note (Then — below scenario):  
| scenario | pet_id  | expected_note_display   | expected_staff_display |  
|----------|---------|-------------------------|------------------------|  
| 1        | PET-001 | No visit note added     | (section hidden)       |  

---  

### Scenario Outline: Visit note exceeds character limit — validation shown  

Given the customer is in the appointment confirmation step for **Pet** *{pet_id}*  
  And the *Visit Note* field has a character limit of *{char_limit}*  
When the customer submits a *Visit Note* of *{entered_chars}* characters  
Then the form shows *{expected_validation_message}*  
  And the submit button remains *{expected_button_state}*  

### Note validation (Then — below scenario):  
| scenario | pet_id  | char_limit | entered_chars | expected_validation_message                    | expected_button_state |  
|----------|---------|------------|---------------|------------------------------------------------|-----------------------|  
| 1        | PET-001 | 500        | 512           | Visit note exceeds 500-character limit (512/500) | disabled              |  

---  

## Story: `Confirm Appointment Booking`  

### CustomerAccount (Given — above scenarios):  
| customer_account_id | emailAddress     | accountStatus |  
|---------------------|------------------|---------------|  
| CUST-001            | jane@example.com | Verified      |  

---  

### Scenario Outline: Logged-in customer confirms appointment successfully  

Given a **CustomerAccount** *{customer_account_id}* is logged in with **emailAddress** *{emailAddress}*  
  And **Pet** *{pet_id}* at **Store** *{storeCode}* has **lifecycleState** *{lifecycleState}*  
  And **TimeSlot** *{timeslot_id}* is held for *{customer_account_id}*  
When the customer confirms the appointment with **visitNote** *{visitNote}*  
Then an **Appointment** is created with **bookingCustomerAccount** *{customer_account_id}*, **visitedPet** *{pet_id}*, **hostingStore** *{storeCode}*, **scheduledDateAndTimeSlot** *{timeslot_id}*  
  And the *Appointment Confirmation Page* reads *{expected_confirmation_heading}*  
  And an *Appointment Confirmation Email* is sent to *{emailAddress}*  
  And **TimeSlot** *{timeslot_id}* **bookingStatus** transitions to *{expected_slot_status}*  

### Appointment (Then — below scenario):  
| scenario | customer_account_id | pet_id  | storeCode | timeslot_id | visitNote                         | emailAddress     | lifecycleState | expected_confirmation_heading                        | expected_slot_status |  
|----------|---------------------|---------|-----------|-------------|-----------------------------------|------------------|----------------|------------------------------------------------------|----------------------|  
| 1        | CUST-001            | PET-001 | STR-001   | TS-001      | Bringing my two kids aged 5 and 7 | jane@example.com | Available      | Appointment confirmed — Tue 10 Jun, 10:00 at PawPlace Bristol | booked               |  

---  

### Scenario Outline: Guest user prompted to log in — slot preserved  

Given a guest customer (not logged in) has selected **TimeSlot** *{timeslot_id}* for **Pet** *{pet_id}*  
When the guest attempts to confirm the appointment  
Then the page shows *{expected_prompt_heading}*  
  And the prompt body reads *{expected_prompt_body}*  
  And the **TimeSlot** *{timeslot_id}* **bookingStatus** remains *{expected_slot_status}*  

### Guest prompt (Then — below scenario):  
| scenario | timeslot_id | pet_id  | expected_prompt_heading | expected_prompt_body                                      | expected_slot_status |  
|----------|-------------|---------|------------------------|-----------------------------------------------------------|----------------------|  
| 1        | TS-001      | PET-001 | Log in to book         | Appointments require a PawPlace account — log in or register to continue | held                 |  

---  

### Scenario Outline: Confirmation email fails — booking still created  

Given a **CustomerAccount** *{customer_account_id}* has confirmed an **Appointment** for **Pet** *{pet_id}*  
  And the email delivery system is temporarily unavailable  
When the confirmation email send attempt fails  
Then the **Appointment** status is *{expected_appointment_status}*  
  And the email delivery status is *{expected_email_status}*  
  And the *Appointment Confirmation Page* still reads *{expected_page_heading}*  

### Email failure (Then — below scenario):  
| scenario | customer_account_id | pet_id  | expected_appointment_status | expected_email_status | expected_page_heading  |  
|----------|---------------------|---------|-----------------------------|-----------------------|------------------------|  
| 1        | CUST-001            | PET-001 | confirmed                   | queued for retry      | Appointment confirmed  |  

---  

## Story: `View Upcoming and Past Appointments`  

### Appointment (Given — above scenarios):  
| appointment_id | customer_account_id | pet_id  | petName | storeCode | storeName        | timeslot_id | appointmentStatus | visitNote                |  
|----------------|---------------------|---------|---------|-----------|------------------|-------------|-------------------|--------------------------|  
| APT-001        | CUST-001            | PET-001 | Buddy   | STR-001   | PawPlace Bristol | TS-001      | confirmed         | Bringing kids            |  
| APT-002        | CUST-001            | PET-002 | Whiskers| STR-001   | PawPlace Bristol | TS-004      | completed         |                          |  
| APT-003        | CUST-001            | PET-005 | Rex     | STR-002   | PawPlace London  | TS-010      | confirmed         | Want to meet the dog     |  

---  

### Scenario Outline: Appointments listed — upcoming first, then past  

Given a **CustomerAccount** *{customer_account_id}* with **Appointment** entries  
When the customer opens their *Appointment List* from the account area  
Then the *Upcoming* section shows *{expected_upcoming}* sorted soonest first  
  And the *Past* section shows *{expected_past}*  
  And each entry displays pet name, pet photo, **Store** name, date/time, and **visitNote** (if present)  

### Appointment list (Then — below scenario):  
| scenario | customer_account_id | expected_upcoming      | expected_past | expected_upcoming_count | expected_past_count |  
|----------|---------------------|------------------------|---------------|-------------------------|---------------------|  
| 1        | CUST-001            | APT-001, APT-003       | APT-002       | 2                       | 1                   |  

---  

### Scenario Outline: No appointments — empty state with gallery link  

Given a **CustomerAccount** *{customer_account_id}* with no **Appointment** entries  
When the customer opens their *Appointment List*  
Then the list heading reads *{expected_heading}*  
  And the empty-state message reads *{expected_message}*  
  And a link to *{expected_link_target}* is displayed with label *{expected_link_label}*  

### Empty appointments (Then — below scenario):  
| scenario | customer_account_id | expected_heading  | expected_message                       | expected_link_target | expected_link_label        |  
|----------|---------------------|-------------------|----------------------------------------|----------------------|----------------------------|  
| 1        | CUST-003            | Your Appointments | You haven't booked any visits yet      | Pet Gallery          | Browse pets to get started |  

---  

### Scenario Outline: Upcoming appointment for adopted pet shows badge and actions  

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* (*{petName}*) with upcoming date  
  And **Pet** *{pet_id}* has **lifecycleState** *{lifecycleState}*  
When the customer views their *Appointment List*  
Then **Appointment** *{appointment_id}* shows badge *{expected_badge_label}*  
  And the entry offers action *{expected_action_1}* and action *{expected_action_2}*  

### Adopted pet appointment (Then — below scenario):  
| scenario | appointment_id | pet_id  | petName | lifecycleState | expected_badge_label | expected_action_1 | expected_action_2    |  
|----------|----------------|---------|---------|----------------|----------------------|-------------------|----------------------|  
| 1        | APT-003        | PET-005 | Rex     | Adopted        | Pet adopted          | Cancel appointment| Browse other pets    |  

---  

## Story: `Cancel or Rebook Appointment After Pet Adoption`  

### Scenario Outline: Customer cancels appointment — time slot released  

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* with **appointmentStatus** *{appointmentStatus_before}*  
  And a *Pet Adopted Before Visit Notification* has been sent  
When the customer cancels the **Appointment** *{appointment_id}*  
Then the **TimeSlot** *{timeslot_id}* **bookingStatus** reverts to *{expected_slot_status}*  
  And the **Appointment** *{appointment_id}* transitions to **appointmentStatus** *{expected_appointment_status}*  
  And the confirmation reads *{expected_cancellation_message}*  

### Cancellation (Then — below scenario):  
| scenario | appointment_id | pet_id  | timeslot_id | appointmentStatus_before | expected_slot_status | expected_appointment_status | expected_cancellation_message                 |  
|----------|----------------|---------|-------------|--------------------------|----------------------|-----------------------------|-----------------------------------------------|  
| 1        | APT-003        | PET-005 | TS-010      | confirmed                | available            | cancelled                   | Appointment cancelled — time slot released    |  

---  

### Scenario Outline: Customer rebooks — new booking flow initiated  

Given the customer has cancelled **Appointment** *{appointment_id}* for adopted **Pet** *{pet_id}*  
When the customer chooses to rebook  
Then the system navigates to *{expected_destination}* with available pets displayed  
  And the original cancelled **Appointment** *{appointment_id}* appears in *{expected_history_section}*  

### Rebook (Then — below scenario):  
| scenario | appointment_id | pet_id  | expected_destination | expected_history_section |  
|----------|----------------|---------|----------------------|-------------------------|  
| 1        | APT-003        | PET-005 | Pet Gallery          | Past Appointments       |  

---  

### Scenario Outline: Customer does not act before appointment date  

Given an **Appointment** *{appointment_id}* for adopted **Pet** *{pet_id}* with a future date  
  And the customer has neither cancelled nor rebooked  
When the appointment date passes  
Then the **Appointment** staff view shows warning *{expected_staff_warning}*  
  And the **Appointment** is treated as *{expected_outcome}*  

### No action taken (Then — below scenario):  
| scenario | appointment_id | pet_id  | expected_staff_warning                         | expected_outcome |  
|----------|----------------|---------|------------------------------------------------|------------------|  
| 1        | APT-003        | PET-005 | Pet adopted — customer did not cancel or rebook| no-show          |  

---  

## Story: `Update Pet Profile`  

### Scenario Outline: Store employee updates pet profile fields  

Given a **Store Employee** at **Store** *{storeCode}*  
  And a **Pet** *{pet_id}* hosted at **Store** *{storeCode}*  
When the *Store Employee* saves changes to: **Breed** *{new_breedName}*, **TemperamentAssessment** *{new_observation}*  
Then the customer-facing *Pet Profile Page* for **Pet** *{pet_id}* shows breed *{new_breedName}*  
  And the *Temperament Notes* section reads *{new_observation}*  
  And the profile update timestamp reads *{expected_update_label}*  

### Pet Profile update (Then — below scenario):  
| scenario | pet_id  | storeCode | new_breedName    | new_observation                  | expected_update_label     |  
|----------|---------|-----------|------------------|----------------------------------|---------------------------|  
| 1        | PET-001 | STR-001   | Golden Retriever | Very gentle, great family dog    | Updated today             |  

---  

### Scenario Outline: New photos added to pet photo gallery  

Given a **Store Employee** at **Store** *{storeCode}*  
  And a **Pet** *{pet_id}* with *{existing_photo_count}* existing **PetPhoto** entries  
When the *Store Employee* uploads new photos *{new_photo_files}*  
Then the gallery total is *{expected_total_photos}* photos  
  And the new photo *{new_photo_files}* appears in the gallery  
  And existing photos are preserved  

### Photo upload (Then — below scenario):  
| scenario | pet_id  | storeCode | existing_photo_count | new_photo_files      | expected_total_photos |  
|----------|---------|-----------|----------------------|----------------------|-----------------------|  
| 1        | PET-001 | STR-001   | 2                    | pet001_outdoor.jpg   | 3                     |  

---  

### Scenario Outline: Pet transferred between stores — appointments notified  

Given a **Pet** *{pet_id}* currently at **Store** *{old_storeCode}* (*{old_storeName}*)  
  And existing **Appointment** entries for **Pet** *{pet_id}* at **Store** *{old_storeCode}*  
When the *Store Employee* changes the **hostingStore** to **Store** *{new_storeCode}* (*{new_storeName}*)  
Then the *Pet Profile Page* shows **Store** *{new_storeName}*  
  And affected customers receive a notification reading *{expected_notification_body}*  

### Pet transfer (Then — below scenario):  
| scenario | pet_id  | old_storeCode | old_storeName    | new_storeCode | new_storeName   | expected_notification_body                                        |  
|----------|---------|---------------|------------------|---------------|-----------------|-------------------------------------------------------------------|  
| 1        | PET-001 | STR-001       | PawPlace Bristol | STR-002       | PawPlace London | Your visit pet has moved to PawPlace London — please check details|  

---  

## Story: `Mark Pet as Adopted`  

### Scenario Outline: Pet marked adopted — booking disabled, notifications sent  

Given a **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState_before}*  
  And existing **Appointment** entries *{affected_appointments}* for **Pet** *{pet_id}*  
When the *Store Employee* marks **Pet** *{pet_id}* as *{target_state}*  
Then **Pet** *{pet_id}* **lifecycleState** transitions to *{expected_lifecycleState}* via **PetLifecycleEvent**  
  And the *Pet Profile Page* action area reads *{expected_action_message}*  
  And *{expected_notification_count}* *Pet Adopted Before Visit Notification*(s) are sent for appointments *{affected_appointments}*  

### Adoption (Then — below scenario):  
| scenario | pet_id  | lifecycleState_before | target_state | expected_lifecycleState | affected_appointments | expected_notification_count | expected_action_message     |  
|----------|---------|----------------------|--------------|-------------------------|-----------------------|-----------------------------|-----------------------------|  
| 1        | PET-001 | Available            | Adopted      | Adopted                 | APT-001               | 1                           | This pet has found a home   |  

---  

### Scenario Outline: Already-adopted pet — idempotent with status message  

Given a **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*  
When the *Store Employee* attempts to mark **Pet** *{pet_id}* as *{target_state}*  
Then the system shows *{expected_status_message}*  
  And the **lifecycleState** remains *{expected_lifecycleState}*  
  And *{expected_notification_count}* notifications are sent  

### Idempotent adoption (Then — below scenario):  
| scenario | pet_id  | lifecycleState | target_state | expected_status_message    | expected_lifecycleState | expected_notification_count |  
|----------|---------|----------------|--------------|----------------------------|-------------------------|-----------------------------|  
| 1        | PET-005 | Adopted        | Adopted      | Pet is already adopted     | Adopted                 | 0                           |  

---  

## Story: `View Incoming Appointments`  

### Scenario Outline: Staff sees upcoming appointments sorted by date  

Given a **Store Employee** at **Store** *{storeCode}*  
  And **Appointment** entries *{appointment_ids}* are booked for **Store** *{storeCode}*  
When the *Store Employee* opens the *Incoming Appointments* view  
Then the list shows *{expected_appointment_count}* appointments sorted *{expected_sort_order}*  
  And each entry shows: customer name, pet name, date/time, and **visitNote** (if any)  

### Incoming appointments (Then — below scenario):  
| scenario | storeCode | appointment_ids  | expected_appointment_count | expected_sort_order |  
|----------|-----------|------------------|----------------------------|---------------------|  
| 1        | STR-001   | APT-001, APT-002 | 2                          | soonest first       |  

---  

### Scenario Outline: Adopted pet appointment shows warning badge in staff view  

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*  
  And the notification status is *{notification_status}*  
When the *Store Employee* views the *Incoming Appointments*  
Then the entry shows badge *{expected_badge_label}*  
  And the notification column reads *{expected_notification_display}*  

### Adopted warning (Then — below scenario):  
| scenario | appointment_id | pet_id  | lifecycleState | notification_status | expected_badge_label | expected_notification_display |  
|----------|----------------|---------|----------------|---------------------|----------------------|-------------------------------|  
| 1        | APT-003        | PET-005 | Adopted        | notified            | Pet adopted          | Customer notified             |  

---  

## Story: `Send Appointment Reminder`  

### Scenario Outline: Reminder sent 24 hours before appointment  

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* at **Store** *{storeCode}*  
  And **scheduledDateAndTimeSlot** is *{appointment_datetime}*  
  And **appointmentStatus** is *{appointmentStatus}*  
When the current time is *{trigger_hours}* hours before *{appointment_datetime}*  
Then the system sends an *Appointment Reminder* **Notification** to **CustomerAccount** *{customer_account_id}*  
  And the reminder body includes *{expected_reminder_body}*  

### Reminder (Then — below scenario):  
| scenario | appointment_id | pet_id  | storeCode | appointment_datetime | appointmentStatus | trigger_hours | customer_account_id | expected_reminder_body                                                     |  
|----------|----------------|---------|-----------|----------------------|-------------------|---------------|---------------------|----------------------------------------------------------------------------|  
| 1        | APT-001        | PET-001 | STR-001   | 2025-06-10T10:00:00  | confirmed         | 24            | CUST-001            | Reminder: visit Buddy at PawPlace Bristol, Tue 10 Jun 10:00. Note: Bringing kids |  

---  

### Scenario Outline: Cancelled appointment — reminder skipped, status retained  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}*  
When the *{trigger_hours}*-hour reminder trigger time arrives  
Then the appointment remains in status *{expected_status}*  
  And the reminder outcome is *{expected_reminder_outcome}*  

### Cancelled suppression (Then — below scenario):  
| scenario | appointment_id | appointmentStatus | trigger_hours | expected_status | expected_reminder_outcome |  
|----------|----------------|-------------------|---------------|-----------------|---------------------------|  
| 1        | APT-004        | cancelled         | 24            | cancelled       | skipped — appointment cancelled |  

---  

### Scenario Outline: Adopted pet — adoption notification takes precedence over reminder  

Given an **Appointment** *{appointment_id}* for **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*  
  And the *Pet Adopted Before Visit Notification* has *{adoption_notification_status}*  
When the *{trigger_hours}*-hour reminder trigger time arrives  
Then the reminder outcome is *{expected_reminder_outcome}*  
  And the notification sent is *{expected_notification_type}*  

### Adoption precedence (Then — below scenario):  
| scenario | appointment_id | pet_id  | lifecycleState | adoption_notification_status | trigger_hours | expected_reminder_outcome         | expected_notification_type          |  
|----------|----------------|---------|----------------|------------------------------|---------------|-----------------------------------|-------------------------------------|  
| 1        | APT-003        | PET-005 | Adopted        | not yet sent                 | 24            | skipped — adoption takes precedence | Pet Adopted Before Visit Notification |  

---  

## Story: `Send Pet Adopted Before Visit Notification`  

### Scenario Outline: Notification sent to affected customers on adoption  

Given a **Pet** *{pet_id}* is marked as *{lifecycleState}*  
  And **Appointment** *{appointment_id}* for **Pet** *{pet_id}* has **appointmentStatus** *{appointmentStatus}*  
  And **Appointment** *{appointment_id}* belongs to **CustomerAccount** *{customer_account_id}*  
When the system processes the adoption event  
Then a *Pet Adopted Before Visit Notification* is sent to *{customer_account_id}*  
  And the notification body includes *{expected_notification_body}*  
  And the notification is recorded against **Appointment** *{appointment_id}*  

### Adoption notification (Then — below scenario):  
| scenario | pet_id  | lifecycleState | appointment_id | appointmentStatus | customer_account_id | expected_notification_body                                                      |  
|----------|---------|----------------|----------------|-------------------|---------------------|---------------------------------------------------------------------------------|  
| 1        | PET-001 | Adopted        | APT-001        | confirmed         | CUST-001            | Buddy has been adopted. You can cancel your visit or browse other available pets |  

---  

### Scenario Outline: No pending appointments — adoption processed without notification  

Given a **Pet** *{pet_id}* is marked as *{lifecycleState}*  
  And **Pet** *{pet_id}* has *{pending_appointment_count}* **Appointment** entries with **appointmentStatus** *{appointmentStatus}*  
When the system processes the adoption event  
Then the adoption event completes with *{expected_notification_count}* notifications sent  
  And the **Pet** *{pet_id}* **lifecycleState** is *{expected_lifecycleState}*  

### No pending appointments (Then — below scenario):  
| scenario | pet_id  | lifecycleState | pending_appointment_count | appointmentStatus | expected_notification_count | expected_lifecycleState |  
|----------|---------|----------------|---------------------------|-------------------|-----------------------------|-------------------------|  
| 1        | PET-003 | Adopted        | 0                         | confirmed         | 0                           | Adopted                 |  

---  

## Story: `Check In Customer`  

### Scenario Outline: Customer checked in — status transitions to checked-in  

Given a **Store Employee** at **Store** *{storeCode}*  
  And an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*  
When the *Store Employee* selects "Check In" on **Appointment** *{appointment_id}*  
Then **Appointment** *{appointment_id}* **appointmentStatus** transitions to *{appointmentStatus_after}*  
  And **checkedInTime** is recorded as *{checkedInTime}*  
  And **checkedInBy** is recorded as **Store** *{storeCode}*  
  And the staff view shows *{expected_checkin_label}*  

### Check-in (Then — below scenario):  
| scenario | appointment_id | storeCode | appointmentStatus_before | appointmentStatus_after | checkedInTime        | expected_checkin_label              |  
|----------|----------------|-----------|--------------------------|-------------------------|----------------------|-------------------------------------|  
| 1        | APT-001        | STR-001   | confirmed                | checked-in              | 2025-06-10T09:55:00  | Checked in at 09:55 by STR-001     |  

---  

### Scenario Outline: Early or late arrival — check-in still allowed  

Given an **Appointment** *{appointment_id}* with **scheduledDateAndTimeSlot** starting at *{slot_start}*  
When the *Store Employee* checks in the customer at *{actual_arrival}*  
Then **checkedInTime** records *{actual_arrival}*  
  And the staff view shows *{expected_timing_label}*  

### Timing flexibility (Then — below scenario):  
| scenario | appointment_id | slot_start           | actual_arrival       | expected_timing_label               |  
|----------|----------------|----------------------|----------------------|--------------------------------------|  
| 1        | APT-001        | 2025-06-10T10:00:00  | 2025-06-10T09:45:00  | Checked in 15 min early at 09:45    |  
| 2        | APT-001        | 2025-06-10T10:00:00  | 2025-06-10T10:20:00  | Checked in 20 min late at 10:20     |  

---  

### Scenario Outline: Duplicate check-in — original time preserved with message  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}* and **checkedInTime** *{original_checkin}*  
When the *Store Employee* attempts to check in again  
Then the system shows *{expected_message}*  
  And the **checkedInTime** remains *{original_checkin}*  

### Duplicate check-in (Then — below scenario):  
| scenario | appointment_id | appointmentStatus | original_checkin     | expected_message                             |  
|----------|----------------|-------------------|----------------------|----------------------------------------------|  
| 1        | APT-001        | checked-in        | 2025-06-10T09:55:00  | Already checked in at 09:55 — no change made |  

---  

### Scenario Outline: Check-in on cancelled appointment — blocked with reason  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}*  
When the *Store Employee* attempts to check in  
Then the system shows *{expected_block_message}*  
  And the **appointmentStatus** remains *{appointmentStatus}*  

### Cancelled check-in (Then — below scenario):  
| scenario | appointment_id | appointmentStatus | expected_block_message                   |  
|----------|----------------|-------------------|------------------------------------------|  
| 1        | APT-004        | cancelled         | Cannot check in — this appointment was cancelled |  

---  

## Story: `Record Visit Outcome`  

### Scenario Outline: Visit outcome recorded on checked-in appointment  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*  
When the *Store Employee* selects "Record Outcome" and chooses *{visitOutcome}*  
  And enters **staffVisitNotes** *{staffVisitNotes}*  
Then the **Appointment** *{appointment_id}* **appointmentStatus** transitions to *{appointmentStatus_after}*  
  And **visitOutcome** is recorded as *{visitOutcome}*  
  And **staffVisitNotes** is recorded as *{staffVisitNotes}*  
  And the outcome summary reads *{expected_outcome_summary}*  

### Visit outcome (Then — below scenario):  
| scenario | appointment_id | appointmentStatus_before | visitOutcome  | staffVisitNotes                     | appointmentStatus_after | expected_outcome_summary                                |  
|----------|----------------|--------------------------|---------------|-------------------------------------|-------------------------|---------------------------------------------------------|  
| 1        | APT-001        | checked-in               | Browsing Only | Customer enjoyed meeting the dog    | completed               | Browsing Only — Customer enjoyed meeting the dog        |  
| 2        | APT-001        | checked-in               | Not a Fit     | Dog too energetic for small flat    | completed               | Not a Fit — Dog too energetic for small flat             |  

---  

### Scenario Outline: Adopted outcome triggers pet status transition  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*  
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState_before}*  
When the *Store Employee* selects *{visitOutcome}* as the **visitOutcome**  
Then the **Appointment** is completed with **visitOutcome** *{visitOutcome}*  
  And **Pet** *{pet_id}* **lifecycleState** transitions to *{expected_lifecycleState}* via **PetLifecycleEvent**  
  And adoption notifications are triggered for *{expected_notification_count}* affected appointment(s)  

### Adoption via outcome (Then — below scenario):  
| scenario | appointment_id | pet_id  | appointmentStatus_before | lifecycleState_before | visitOutcome | expected_lifecycleState | expected_notification_count |  
|----------|----------------|---------|--------------------------|----------------------|--------------|-------------------------|-----------------------------|  
| 1        | APT-001        | PET-001 | checked-in               | Available            | Adopted      | Adopted                 | 1                           |  

---  

### Scenario Outline: Interested-Returning outcome prompts follow-up  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*  
When the *Store Employee* selects *{visitOutcome}* as the **visitOutcome**  
Then the system prompts with *{expected_follow_up_prompt}*  

### Follow-up prompt (Then — below scenario):  
| scenario | appointment_id | appointmentStatus_before | visitOutcome           | expected_follow_up_prompt                           |  
|----------|----------------|--------------------------|------------------------|-----------------------------------------------------|  
| 1        | APT-001        | checked-in               | Interested — Returning | Set a follow-up action for this customer's next visit |  

---  

### Scenario Outline: Outcome recorded without staff notes — accepted  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*  
When the *Store Employee* records **visitOutcome** *{visitOutcome}* without **staffVisitNotes**  
Then the **Appointment** transitions to *{appointmentStatus_after}*  
  And the outcome summary reads *{expected_outcome_summary}*  
  And the notes section reads *{expected_notes_display}*  

### Notes optional (Then — below scenario):  
| scenario | appointment_id | appointmentStatus_before | visitOutcome  | appointmentStatus_after | expected_outcome_summary | expected_notes_display |  
|----------|----------------|--------------------------|---------------|-------------------------|--------------------------|------------------------|  
| 1        | APT-001        | checked-in               | Browsing Only | completed               | Browsing Only            | (no staff notes)       |  

---  

## Story: `Record No-Show`  

### Scenario Outline: No-show recorded after time slot passes  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus_before}*  
  And the **TimeSlot** *{timeslot_id}* has passed without check-in  
When the *Store Employee* marks **Appointment** *{appointment_id}* as *{outcome}*  
Then **appointmentStatus** transitions to *{appointmentStatus_after}*  
  And **noShowRecordedBy** is recorded as **Store** *{storeCode}*  
  And **noShowRecordedAt** is recorded as *{recorded_at}*  
  And a rebook **Notification** is sent to the customer with body *{expected_notification_body}*  

### No-show (Then — below scenario):  
| scenario | appointment_id | timeslot_id | appointmentStatus_before | outcome | storeCode | recorded_at          | appointmentStatus_after | expected_notification_body                                       |  
|----------|----------------|-------------|--------------------------|---------|-----------|----------------------|-------------------------|------------------------------------------------------------------|  
| 1        | APT-001        | TS-001      | confirmed                | No-Show | STR-001   | 2025-06-10T10:45:00  | no-show                 | You missed your visit — would you like to rebook?                |  

---  

### Scenario Outline: No-show blocked for checked-in appointment — message shown  

Given an **Appointment** *{appointment_id}* with **appointmentStatus** *{appointmentStatus}*  
When the *Store Employee* attempts to mark as *{attempted_outcome}*  
Then the system shows *{expected_block_message}*  
  And the **appointmentStatus** remains *{appointmentStatus}*  

### Checked-in vs no-show (Then — below scenario):  
| scenario | appointment_id | appointmentStatus | attempted_outcome | expected_block_message                        |  
|----------|----------------|-------------------|-------------------|-----------------------------------------------|  
| 1        | APT-001        | checked-in        | No-Show           | Cannot mark as no-show — customer was already checked in |  

---  

## Story: `Set Follow-Up Action`  

### Scenario Outline: Follow-up action recorded on appointment  

Given an **Appointment** *{appointment_id}* with a recorded **visitOutcome**  
When the *Store Employee* sets **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*  
Then the **Appointment** *{appointment_id}* records **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*  
  And the follow-up detail reads *{expected_follow_up_label}*  

### Follow-up (Then — below scenario):  
| scenario | appointment_id | followUpAction          | followUpDate | expected_follow_up_label                       |  
|----------|----------------|-------------------------|--------------|------------------------------------------------|  
| 1        | APT-001        | schedule-return-visit   | 2025-06-17   | Return visit scheduled for Tue 17 Jun          |  
| 2        | APT-001        | hold-pet                | 2025-06-14   | Pet held until Sat 14 Jun                      |  
| 3        | APT-001        | send-adoption-paperwork | 2025-06-12   | Adoption paperwork to be sent by Thu 12 Jun    |  

---  

### Scenario Outline: Hold-pet action — pet remains available with hold note  

Given **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*  
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*  
When the *Store Employee* confirms the follow-up  
Then the **Pet** *{pet_id}* **lifecycleState** remains *{expected_lifecycleState}*  
  And the appointment detail shows *{expected_hold_note}*  
  And the hold expires on *{followUpDate}*  

### Hold-pet (Then — below scenario):  
| scenario | appointment_id | pet_id  | followUpAction | followUpDate | lifecycleState | expected_lifecycleState | expected_hold_note                       |  
|----------|----------------|---------|----------------|--------------|----------------|-------------------------|------------------------------------------|  
| 1        | APT-001        | PET-001 | hold-pet       | 2025-06-14   | Available      | Available               | Pet held for customer until Sat 14 Jun   |  

---  

### Scenario Outline: Follow-up date triggers customer notification  

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*  
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}*  
When the current date reaches *{followUpDate}*  
Then a *Visit Follow-Up Notification* is sent to **CustomerAccount** *{customer_account_id}*  
  And the notification body includes *{expected_notification_body}*  

### Follow-up trigger (Then — below scenario):  
| scenario | appointment_id | followUpAction        | followUpDate | pet_id  | lifecycleState | customer_account_id | expected_notification_body                                      |  
|----------|----------------|-----------------------|--------------|---------|----------------|---------------------|-----------------------------------------------------------------|  
| 1        | APT-001        | schedule-return-visit | 2025-06-17   | PET-001 | Available      | CUST-001            | Time for your return visit to see Buddy at PawPlace Bristol     |  

---  

## Story: `Send Visit Follow-Up Notification`  

### Scenario Outline: Follow-up notification sent on follow-up date  

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*  
  And **Pet** *{pet_id}* with **lifecycleState** *{lifecycleState}* at **Store** *{storeCode}* (*{storeName}*)  
When the current date is *{followUpDate}*  
Then the system sends a *Visit Follow-Up Notification* to **CustomerAccount** *{customer_account_id}*  
  And the notification references *{expected_notification_body}*  

### Follow-up notification (Then — below scenario):  
| scenario | appointment_id | followUpAction | followUpDate | pet_id  | lifecycleState | storeCode | storeName        | customer_account_id | expected_notification_body                                           |  
|----------|----------------|----------------|--------------|---------|----------------|-----------|------------------|---------------------|----------------------------------------------------------------------|  
| 1        | APT-001        | hold-pet       | 2025-06-14   | PET-001 | Available      | STR-001   | PawPlace Bristol | CUST-001            | Your hold on Buddy at PawPlace Bristol expires today — visit soon    |  

---  

### Scenario Outline: Follow-up action set to none — no notification triggered  

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}*  
When any follow-up trigger date arrives  
Then the follow-up outcome is *{expected_outcome}*  
  And the appointment detail reads *{expected_detail_label}*  

### No follow-up (Then — below scenario):  
| scenario | appointment_id | followUpAction | expected_outcome         | expected_detail_label |  
|----------|----------------|----------------|--------------------------|-----------------------|  
| 1        | APT-001        | none           | no notification sent     | No follow-up set      |  

---  

### Scenario Outline: Follow-up suppressed when pet adopted before follow-up date  

Given an **Appointment** *{appointment_id}* with **followUpAction** *{followUpAction}* and **followUpDate** *{followUpDate}*  
  And **Pet** *{pet_id}* has **lifecycleState** *{lifecycleState}* (adopted before *{followUpDate}*)  
When the current date reaches *{followUpDate}*  
Then the follow-up outcome is *{expected_follow_up_outcome}*  
  And the notification sent is *{expected_notification_type}*  

### Adoption suppresses follow-up (Then — below scenario):  
| scenario | appointment_id | followUpAction        | followUpDate | pet_id  | lifecycleState | expected_follow_up_outcome              | expected_notification_type                |  
|----------|----------------|-----------------------|--------------|---------|----------------|-----------------------------------------|-------------------------------------------|  
| 1        | APT-001        | schedule-return-visit | 2025-06-17   | PET-001 | Adopted        | skipped — pet adopted before follow-up  | Pet Adopted Before Visit Notification     |  


---

## increment-7 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 7

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
increment_scope: Increment 7 — Returns and refunds
specification_refresh: Run 8 slot 181
---

# Specification by Example — Increment 7: Returns and refunds — close the loop

**Refresh:** Run 8 slot 181 — aligned to `docs/end-to-end/exploration/domain/ubiquitous-language.md` (slot 171), `docs/end-to-end/specification/crc.md` (slot 179), `docs/end-to-end/specification/domain.json`, and `docs/end-to-end/exploration/stories/acceptance-criteria.md` (slot 173). Full *return* lifecycle active: *return request*, *return eligibility*, *return window*, *return label*, *return QR code*, *return status*, *in-store return* with *manager override*. *Refund* lifecycle active: *refund status* (processing → completed or requires review), *refund retry*, vendor-specific routing through *StripeWave*, *PayNova*, and *VaultPay*. Three *return*/*refund* *notification* types introduced: *return received notification*, *refund completed notification*, *refund under review notification*.

---

## Story: Initiate Return from Order History

**Story type:** customer

**Sources / context:** ubiquitous-language.md (Order KA — *return*, *return request*, *return eligibility*, *return window*, *return reason*, *returned items*, *return status*), crc.md (Return, Return Request, Return Eligibility, Return Window, Return Reason, Returned Items, Return Status), acceptance-criteria.md (Initiate Return from Order History AC 1–4)

---

### Scenario 1: Eligible items displayed when customer selects return on a delivered order

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And **Order** *ORD-4401* was delivered on *2026-04-14* with **Order Status** *delivered*
  And **Order** *ORD-4401* contains **Order Line Item** *Premium Dog Kibble 10kg* at *£54.99* × *1*
  And **Order** *ORD-4401* contains **Order Line Item** *Squeaky Bone Chew* at *£12.99* × *2*
  And the current date is *2026-05-07* which is within the **Return Window**
When the **Customer** selects "Return" on **Order** *ORD-4401* in **Order History**
Then the system shows which **Order Line Items** are *Return Eligible*
  And the **Customer** can select items and quantities to return
  And a **Return Reason** picker is displayed

### Scenario 2: Return request submitted and return record created

Given a **Customer Account** *sarah.mitchell@pawplace.example* viewing *Return Eligible* items for **Order** *ORD-4401*
  And **Order Line Item** *Premium Dog Kibble 10kg* is *Return Eligible*
When the **Customer** submits a **Return Request** selecting **Order Line Item** *Premium Dog Kibble 10kg* × *1* with **Return Reason** *changed mind*
Then a **Return** *RTN-7001* is created and linked to **Order** *ORD-4401*
  And the **Return Status** is *initiated*
  And the **Return** confirmation page shows next steps for *Return Label* generation
  And the **Return Status** appears in the **Customer Account** under the **Order** detail

### Scenario 3: Return action hidden when order is outside the return window

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4402* in **Order History**
  And **Order** *ORD-4402* was delivered on *2026-02-05*
  And the current date is *2026-05-07* which is outside the **Return Window**
When the **Customer** views **Order** *ORD-4402* in **Order History**
Then the "Return" action is hidden on **Order** *ORD-4402*
  And a reason is displayed: *"return window expired"*
  And the **Order** detail is still viewable

### Scenario 4: Previously returned items shown as in-progress with remaining items still returnable

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And a **Return** already exists for **Order Line Item** *Premium Dog Kibble 10kg* on **Order** *ORD-4401* with **Return Status** *initiated*
  And **Order** *ORD-4401* also contains **Order Line Item** *Squeaky Bone Chew* × *2* with no prior **Return**
  And the current date is *2026-05-07* which is within the **Return Window**
When the **Customer** selects "Return" on **Order** *ORD-4401*
Then **Order Line Item** *Premium Dog Kibble 10kg* shows *"return in progress"* and cannot be selected
  And **Order Line Item** *Squeaky Bone Chew* shows *Return Eligible* and can be selected for a separate **Return**

---

## Story: Generate Return Label or QR Code

**Story type:** system

**Sources / context:** ubiquitous-language.md (Order KA — *return label*, *return QR code*, *return request*), crc.md (Return Label, Return QR Code, Return), acceptance-criteria.md (Generate Return Label or QR Code AC 1–4)

---

### Scenario 1: Return label and QR code generated on return request submission

Given a **Return Request** for **Return** *RTN-7001* has been submitted for **Order** *ORD-4401*
When the system processes the **Return Request**
Then the system generates a **Return Label** as a printable PDF
  And the system generates a **Return QR Code**
  And both are shown on the **Return** confirmation page
  And both are emailed to **Customer Account** *sarah.mitchell@pawplace.example*

### Scenario 2: Return label includes all required return information

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with a **Return Label** generated
When the **Customer** downloads the **Return Label**
Then the **Return Label** includes the return address *PawPlace Returns Centre*
  And the **Return Label** includes the **Order** number *ORD-4401*
  And the **Return Label** includes the return reference *RTN-7001*
  And the **Return Label** includes a carrier barcode

### Scenario 3: QR code displayable on mobile with same return reference as label

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with a **Return QR Code** generated
When the **Customer** selects the **Return QR Code** option
Then the **Return QR Code** is displayable on a mobile device at a carrier drop-off point
  And the **Return QR Code** encodes the same return reference *RTN-7001* as the **Return Label**

### Scenario 4: Return preserved when label generation service is unavailable

Given a **Return Request** for **Return** *RTN-7002* has been submitted for **Order** *ORD-5502*
  And the *Return Label* generation service is temporarily unavailable
When the system attempts to generate the **Return Label** and **Return QR Code**
Then the **Return** *RTN-7002* is still recorded with **Return Status** *initiated*
  And the **Customer** is told to check back or contact support for the label
  And the **Return** is not cancelled due to label generation failure

---

## Story: Route Refund through Original Payment Vendor

**Story type:** system

**Sources / context:** ubiquitous-language.md (Payment KA — *refund*, *refund status*, *refund retry*, *payment vendor*, *StripeWave*, *PayNova*, *VaultPay*, *instalment plan*), crc.md (Refund, Refund Status, Refund Retry, Payment Vendor, StripeWave, PayNova, VaultPay), acceptance-criteria.md (Route Refund through Original Payment Vendor AC 1–5)

---

### Scenario 1: Refund routed through StripeWave for card payment

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with **Returned Items** *Premium Dog Kibble 10kg* valued at *£54.99*
  And **Order** *ORD-4401* was paid via **Payment Vendor** *StripeWave* with **Vendor Transaction Reference** *sw_txn_4401*
  And the **Returned Items** are received and inspection passes
When the system initiates the **Refund**
Then a **Refund** *REF-3001* is created with a **Refund** amount of *£54.99*
  And the **Refund** routes through **StripeWave**'s refund API
  And the **Customer** sees the credit on their card statement

### Scenario 2: Refund routed through PayNova for digital wallet payment

Given a **Return** *RTN-7002* for **Order** *ORD-5502* with **Returned Items** *Ceramic Feeding Bowl* valued at *£24.99*
  And **Order** *ORD-5502* was paid via **Payment Vendor** *PayNova* with **Vendor Transaction Reference** *pn_txn_5502*
  And the **Returned Items** are received and inspection passes
When the system initiates the **Refund**
Then a **Refund** *REF-3002* is created with a **Refund** amount of *£24.99*
  And the **Refund** routes through **PayNova**'s refund API

### Scenario 3: Refund routed through VaultPay with instalment plan adjustment

Given a **Return** *RTN-7003* for **Order** *ORD-6603* with **Returned Items** *Premium Cat Tree Deluxe* valued at *£199.99*
  And **Order** *ORD-6603* was paid via **Payment Vendor** *VaultPay* with **Vendor Transaction Reference** *vp_txn_6603*
  And the **Returned Items** are received and inspection passes
When the system initiates the **Refund**
Then a **Refund** *REF-3003* is created with a **Refund** amount of *£199.99*
  And the **Refund** routes through **VaultPay**'s refund API
  And the **Instalment Plan** is adjusted accordingly by **VaultPay**

### Scenario 4: Refund queued for retry on vendor failure

Given a **Refund** *REF-3001* for **Return** *RTN-7001* routed through **Payment Vendor** *StripeWave*
When the **Refund** request to **StripeWave** fails due to *vendor downtime*
Then the **Refund** is queued for **Refund Retry**
  And the **Customer** sees **Refund Status** *processing* — not *"refund failed"*

### Scenario 5: Refund escalated to requires review after retry exhaustion

Given a **Refund** *REF-3001* for **Return** *RTN-7001* routed through **Payment Vendor** *StripeWave*
  And all **Refund Retry** attempts are exhausted
When the final **Refund Retry** fails
Then the **Refund Status** transitions to *requires review*
  And the **Customer** sees a message to contact support
  And the support team has access to the **Return** and **Refund** details

---

## Story: Track Refund Status

**Story type:** customer

**Sources / context:** ubiquitous-language.md (Payment KA — *refund status*, *refund*; Order KA — *order detail*, *order history*; Notification KA — *refund completed notification*), crc.md (Refund Status, Refund, Refund Completed Notification), acceptance-criteria.md (Track Refund Status AC 1–4)

---

### Scenario 1: Refund status visible as processing on order detail

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And **Order** *ORD-4401* has a **Return** *RTN-7001* with **Refund** *REF-3001*
  And the **Refund Status** is *processing*
When the **Customer** views the **Order Detail** for **Order** *ORD-4401*
Then the **Refund Status** is visible as *processing*

### Scenario 2: Refund completed with notification sent to customer

Given a **Refund** *REF-3002* for **Return** *RTN-7002* on **Order** *ORD-5502* with **Refund Status** *processing*
  And **Refund** *REF-3002* was routed through **Payment Vendor** *PayNova*
When **PayNova** confirms the **Refund** is complete
Then the **Refund Status** transitions to *completed*
  And the **Customer** receives a **Refund Completed Notification** with the refunded amount *£24.99* and the **Payment** method *PayNova digital wallet*

### Scenario 3: Extended processing shows timing expectation note

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-4401* in **Order History**
  And **Order** *ORD-4401* has **Refund** *REF-3001* with **Refund Status** *processing*
When the **Customer** views the **Order Detail** for **Order** *ORD-4401*
Then the **Order Detail** shows a note: *"refunds typically take 5–10 business days depending on your payment provider"*

### Scenario 4: Requires review status shows support guidance

Given a **Customer Account** *sarah.mitchell@pawplace.example* with **Order** *ORD-6603* in **Order History**
  And **Order** *ORD-6603* has **Refund** *REF-3003* with **Refund Status** *requires review*
When the **Customer** views the **Order Detail** for **Order** *ORD-6603*
Then the **Customer** sees a message to contact support
  And the support team has access to the **Return** and **Refund** details

---

## Story: Process In-Store Return

**Story type:** store employee

**Sources / context:** ubiquitous-language.md (Order KA — *in-store return*, *manager override*, *return eligibility*; boundary *admin dashboard*), crc.md (In-Store Return, Manager Override, Return Eligibility), acceptance-criteria.md (Process In-Store Return AC 1–4)

---

### Scenario 1: In-store return submitted via order lookup on admin dashboard

Given a **Store Employee** at **Store** *PawPlace Camden*
  And a **Customer Account** *sarah.mitchell@pawplace.example* brings **Order Line Item** *Premium Dog Kibble 10kg* to the **Store** for **Return**
  And **Order** *ORD-4401* is within the **Return Window**
  And **Order** *ORD-4401* was paid via **Payment Vendor** *StripeWave*
When the **Store Employee** looks up **Order** *ORD-4401* by order number on the **Admin Dashboard**
  And the **Store Employee** selects "Start Return" and submits the **In-Store Return**
Then a **Return** is created and linked to **Order** *ORD-4401*
  And a **Refund** is triggered through the original **Payment Vendor** *StripeWave*
  And the **Return** appears in the **Customer Account** *sarah.mitchell@pawplace.example* **Order History** under the **Order** detail

### Scenario 2: Guest order return processed using order number and guest email

Given a **Store Employee** at **Store** *PawPlace Camden*
  And a guest **Customer** brings items from **Order** *ORD-7704* to the **Store** for **Return**
  And **Order** *ORD-7704* was placed as a guest order with **Guest Email** *alex.rivera@example.com*
  And **Order** *ORD-7704* was paid via **Payment Vendor** *PayNova*
  And **Order** *ORD-7704* is within the **Return Window**
When the **Store Employee** looks up **Order** *ORD-7704* by order number and **Guest Email** *alex.rivera@example.com* on the **Admin Dashboard**
  And the **Store Employee** submits the **In-Store Return**
Then a **Return** is created and linked to **Order** *ORD-7704*
  And the **Refund** routes through the original **Payment Vendor** *PayNova*
  And the **Return** is not visible in an "account" because the **Customer** has no **Customer Account**

### Scenario 3: Ineligible item flagged with manager override option

Given a **Store Employee** at **Store** *PawPlace Camden*
  And a **Customer** brings **Order Line Item** *Orthopaedic Dog Bed Large* from **Order** *ORD-4402* to the **Store**
  And **Order** *ORD-4402* was delivered on *2026-02-05* and the **Return Window** has expired
When the **Store Employee** looks up **Order** *ORD-4402* on the **Admin Dashboard**
Then the **Admin Dashboard** shows the ineligibility reason: *"return window expired"*
  And a **Manager Override** action is displayed, requiring manager approval before the **Return** proceeds

### Scenario 4: Manager override approves return for ineligible item

Given a **Store Employee** at **Store** *PawPlace Camden*
  And **Order** *ORD-4402* with **Order Line Item** *Orthopaedic Dog Bed Large* has failed **Return Eligibility**
  And the **Admin Dashboard** is showing the **Manager Override** action
  And **Order** *ORD-4402* was paid via **Payment Vendor** *StripeWave*
When a manager approves the **Manager Override** with override reason *"customer goodwill — long-standing customer"*
Then the **In-Store Return** proceeds for **Order** *ORD-4402*
  And a **Return** is created and linked to **Order** *ORD-4402*
  And a **Refund** is triggered through the original **Payment Vendor** *StripeWave*
  And the approving manager and override reason are recorded for audit

---

## Story: Send Return and Refund Status Update

**Story type:** system

**Sources / context:** ubiquitous-language.md (Notification KA — *return received notification*, *refund completed notification*, *refund under review notification*, *notification*), crc.md (Return Received Notification, Refund Completed Notification, Refund Under Review Notification, Notification), acceptance-criteria.md (Send Return and Refund Status Update AC 1–4)

---

### Scenario 1: Return received notification sent when returned items arrive at warehouse

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with **Returned Items** *Premium Dog Kibble 10kg*
  And the **Customer Account** email is *sarah.mitchell@pawplace.example*
When the **Return Status** transitions to *received*
Then the system sends a **Return Received Notification** to the **Customer**
  And the **Return Received Notification** includes the **Order** number *ORD-4401*, the **Returned Items** summary, and a note that inspection and **Refund** processing are underway

### Scenario 2: Refund completed notification sent with amount and payment method

Given a **Refund** *REF-3002* for **Return** *RTN-7002* on **Order** *ORD-5502*
  And the **Refund** was routed through **Payment Vendor** *PayNova*
  And the **Customer Account** email is *sarah.mitchell@pawplace.example*
When the **Refund Status** transitions to *completed*
Then the system sends a **Refund Completed Notification** to the **Customer**
  And the **Refund Completed Notification** includes the refunded amount *£24.99* and the **Payment** method *PayNova digital wallet*

### Scenario 3: Refund under review notification sent with support guidance

Given a **Refund** *REF-3003* for **Return** *RTN-7003* on **Order** *ORD-6603*
  And the **Customer Account** email is *sarah.mitchell@pawplace.example*
  And **Refund Retry** has exhausted all attempts
When the **Refund Status** transitions to *requires review*
Then the system sends a **Refund Under Review Notification** to the **Customer**
  And the **Refund Under Review Notification** includes guidance to contact support and a reference to the **Return** and **Order** details

### Scenario 4: Notification queued when email delivery system is unavailable

Given a **Return** *RTN-7001* for **Order** *ORD-4401* with **Return Status** *received*
  And the email delivery system is temporarily unavailable
When the system attempts to send the **Return Received Notification**
Then the **Notification** is queued for retry
  And the **Return Status** is still updated in the system
  And the **Refund Status** is still updated in the system
  And **Notification** failure does not block *return* or *refund* processing


---

## increment-8 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification By Example


---

## Increment 8

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

# Specification by example (Scenario Outline) — Increment 8: Marketing engine — reviews, alerts, and content  

---  

## Story: `Submit Written Review with Star Rating`  

**CustomerAccount:**  
| customer_email | first_name | last_name |  
| --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | Nguyen |  
| guest@example.com | — | — |  

**Product:**  
| sku | name | brand |  
| --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | NutriPaws |  
| SKU-TOY-220 | Squeaky Bone Chew | PlayPet |  

**Order:** with **CustomerAccount** and **OrderLineItem**  
| order_number | customer_email | sku_snapshot |  
| --- | --- | --- |  
| ORD-8801 | tom.nguyen@pawplace.example | SKU-FOOD-501 |  

### Scenario Outline: Review submitted with valid star rating  

Given a **CustomerAccount** *{customer_email}* is logged in  
And **CustomerAccount** *{customer_email}* has purchased **Product** *{sku}* *{name}* (via **Order** *{order_number}*)  
When **CustomerAccount** *{customer_email}* submits a **CustomerReview** on **Product** *{sku}* with *starRating* *{star_rating}* and *writtenText* *{written_text}*  
Then the **CustomerReview** is associated with **Product** *{sku}* and **CustomerAccount** *{customer_email}* as *authoringAccount*  
And the **CustomerReview** is visible on the *Product Details Page* for **Product** *{sku}* showing *{expected_display_content}*  
And the review status is *{expected_review_status}*  

**CustomerReview (Then):**  
| scenario | customer_email | sku | name | order_number | star_rating | written_text | expected_display_content | expected_review_status |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | SKU-FOOD-501 | Premium Dog Kibble 10kg | ORD-8801 | 5 | My dog loves this kibble | 5 stars with "My dog loves this kibble" by Tom N. | accepted — text and rating stored |  
| 2 | tom.nguyen@pawplace.example | SKU-FOOD-501 | Premium Dog Kibble 10kg | ORD-8801 | 3 | | 3 stars with no written text shown, by Tom N. | accepted — rating only (written text optional) |  

---  

### Scenario: Review blocked for non-purchaser shows purchase prompt  

Given a **CustomerAccount** *tom.nguyen@pawplace.example* is logged in  
And **CustomerAccount** *tom.nguyen@pawplace.example* has not purchased **Product** *SKU-TOY-220* *Squeaky Bone Chew*  
When **CustomerAccount** *tom.nguyen@pawplace.example* opens the review area on **Product** *SKU-TOY-220*  
Then the *Product Details Page* displays a *"Purchase this product to leave a review"* message where the review form would appear  
And the review submission controls are replaced by the purchase prompt  

---  

### Scenario: Guest prompted to log in before reviewing  

Given a guest visitor (no **CustomerAccount** session)  
When the guest attempts to leave a **CustomerReview** on **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg*  
Then a prompt to log in or register is shown on the *Product Details Page*  
And the *Product Details Page* remains in view — no navigation away  

---  

## Story: `Submit Photo Review`  

**CustomerReview:** with **Product** and **CustomerAccount**  
| review_id | customer_email | sku | star_rating |  
| --- | --- | --- | --- |  
| REV-101 | tom.nguyen@pawplace.example | SKU-FOOD-501 | 5 |  

### Scenario: Photo attached to review and displayed on product page  

Given **CustomerAccount** *tom.nguyen@pawplace.example* is submitting a **CustomerReview** *REV-101* on **Product** *SKU-FOOD-501*  
When **CustomerAccount** *tom.nguyen@pawplace.example* attaches a *photoAttachment* image to **CustomerReview** *REV-101*  
Then the *photoAttachment* is stored on the **CustomerReview**  
And the image is displayed alongside the review text on the *Product Details Page*  
And selecting the image opens it in a lightbox or gallery at full size  

---  

### Scenario Outline: Photo upload validation preserves review content  

Given **CustomerAccount** *{customer_email}* is submitting a **CustomerReview** with *starRating* *{star_rating}* and *writtenText* *{written_text}*  
When **CustomerAccount** *{customer_email}* uploads a file with *{upload_condition}*  
Then *{expected_upload_result}*  
And the *starRating* *{star_rating}* and *writtenText* *{written_text}* are preserved in the form  

**Photo upload validation (Then):**  
| scenario | customer_email | star_rating | written_text | upload_condition | expected_upload_result |  
| --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | 4 | Great product | unsupported image format (.bmp) | validation error: "Supported formats: JPEG, PNG, WebP" |  
| 2 | tom.nguyen@pawplace.example | 4 | Great product | file exceeds 5 MB size limit | validation error: "Image must be under 5 MB" |  

---  

### Scenario: Review accepted without photos  

Given **CustomerAccount** *tom.nguyen@pawplace.example* is submitting a **CustomerReview** on **Product** *SKU-FOOD-501*  
When **CustomerAccount** *tom.nguyen@pawplace.example* submits the review with *starRating* *5* and *writtenText* *"Excellent quality"* and no *photoAttachment*  
Then the **CustomerReview** is accepted as a standard written review (*photoAttachment* is optional)  
And the review displays on the *Product Details Page* with the 5-star rating and text, with no image placeholder  

---  

## Story: `Read Customer Reviews`  

**Product:**  
| sku | name | aggregate_star_rating | review_count |  
| --- | --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | 4.3 | 27 |  
| SKU-TOY-220 | Squeaky Bone Chew | — | 0 |  

### Scenario Outline: Product page review display based on review count  

Given **Product** *{sku}* *{name}* has *reviewCount* *{review_count}* and *aggregateStarRating* *{aggregate_star_rating}*  
When a customer views the *Product Details Page* for **Product** *{sku}*  
Then *{expected_rating_display}*  
And *{expected_review_section}*  
And *{expected_call_to_action}*  

**Review display (Then):**  
| scenario | sku | name | review_count | aggregate_star_rating | expected_rating_display | expected_review_section | expected_call_to_action |  
| --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | SKU-FOOD-501 | Premium Dog Kibble 10kg | 27 | 4.3 | aggregateStarRating 4.3 displayed prominently near product name | 27 CustomerReview entries listed with sort controls: newest, oldest, highest rating, lowest rating | sort controls visible |  
| 2 | SKU-TOY-220 | Squeaky Bone Chew | 0 | — | reviews section shows a placeholder — no numeric aggregate rendered | no review entries listed | "Be the first to review" prompt appears |  

---  

### Scenario: Photo review thumbnails displayed inline  

Given **Product** *SKU-FOOD-501* has a **CustomerReview** with a *photoAttachment*  
When a customer views the **CustomerReview** list on the *Product Details Page*  
Then thumbnails are shown inline with the review text  
And selecting a thumbnail opens the image at full size in a lightbox  

---  

## Story: `Set Notification Preferences`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario Outline: Notification preference toggled and saved  

Given **CustomerAccount** *{customer_email}* opens *Notification Preferences* from account settings  
And the notification category *{notification_category}* currently shows *{current_setting}*  
When **CustomerAccount** *{customer_email}* toggles *{notification_category}* to *{new_setting}*  
Then the preference page confirms *{expected_confirmation_display}*  
And future **Notification** messages for *{notification_category}* follow *{expected_delivery_behavior}*  

**CommunicationPreferences (When/Then):**  
| scenario | customer_email | notification_category | current_setting | new_setting | expected_confirmation_display | expected_delivery_behavior |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | order updates | on | off | toggle shows "off"; saved indicator appears | optional order-update notifications suppressed |  
| 2 | tom.nguyen@pawplace.example | shipping | on | off | toggle shows "off"; saved indicator appears | optional shipping follow-up notifications suppressed |  
| 3 | tom.nguyen@pawplace.example | appointments | off | on | toggle shows "on"; saved indicator appears | appointment reminders delivered to customer |  

---  

### Scenario: Critical transactional notifications remain active regardless of preferences  

Given **CustomerAccount** *tom.nguyen@pawplace.example* disables all notification categories in *Notification Preferences*  
When an **Order** is confirmed for **CustomerAccount** *tom.nguyen@pawplace.example*  
Then the *order confirmation* **Notification** is still sent — it is a mandatory transactional notification  
And the preference page displays a note: *"Some notifications cannot be disabled"*  

---  

## Story: `Set Communication Preferences`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario Outline: Marketing category opt-in and opt-out saved  

Given **CustomerAccount** *{customer_email}* opens **CommunicationPreferences** from account settings  
And the marketing category *{marketing_category}* currently shows *{current_opt_status}*  
When **CustomerAccount** *{customer_email}* sets *{marketing_category}* to *{new_opt_status}*  
Then the **CommunicationPreferences** page displays *{marketing_category}* as *{expected_preference_label}*  
And the preference is saved immediately with *{expected_delivery_outcome}*  

**CommunicationPreferences (When/Then):**  
| scenario | customer_email | marketing_category | current_opt_status | new_opt_status | expected_preference_label | expected_delivery_outcome |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | promotionalOptIn | opted out | opted in | "Opted in" | promotional emails delivered to customer on next campaign |  
| 2 | tom.nguyen@pawplace.example | restockAlertsOptIn | opted in | opted out | "Opted out" | account removed from restock alert distribution; preference saved as opted out |  
| 3 | tom.nguyen@pawplace.example | eventNotificationsOptIn | opted out | opted in | "Opted in" | in-store event notifications delivered to customer for preferred store |  

---  

### Scenario: New marketing category defaults to opt-out  

Given a new marketing category *petCareTipsOptIn* is added to **CommunicationPreferences**  
When **CustomerAccount** *tom.nguyen@pawplace.example* views **CommunicationPreferences**  
Then *petCareTipsOptIn* displays as *"Opted out"* by default  
And the customer must explicitly toggle to opt in before receiving content for that category  

---  

## Story: `Opt In to Marketing Email List`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario: Customer opts in via communication preferences  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **CommunicationPreferences** with *promotionalOptIn* *false*  
When **CustomerAccount** *tom.nguyen@pawplace.example* sets *promotionalOptIn* to *true* via **CommunicationPreferences**  
Then **CustomerAccount** *tom.nguyen@pawplace.example* is added to the *Marketing Email List*  
And the opt-in is recorded with *lastUpdatedDate* *2026-05-07*  
And the preference page shows *promotionalOptIn* as *"Opted in"*  

---  

### Scenario: Opt-in checkbox unchecked by default at registration  

Given a new visitor is registering a **CustomerAccount**  
When the registration form is displayed  
Then the *promotionalOptIn* checkbox is unchecked by default  
And a label explains *"Tick to receive promotional emails and offers"*  
And the visitor must affirmatively check it to join the *Marketing Email List*  

---  

### Scenario: Opted-out account skipped during promotional batch  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **CommunicationPreferences** with *promotionalOptIn* *false*  
When the system prepares a promotional **Notification** batch  
Then the system evaluates **CustomerAccount** *tom.nguyen@pawplace.example*, finds *promotionalOptIn* = *false*, and skips the account  
And the batch log records *skipped: tom.nguyen@pawplace.example — promotionalOptIn=false*  

---  

## Story: `Send Promotional Email`  

**CustomerAccount:** with **CommunicationPreferences**  
| customer_email | first_name | promotional_opt_in |  
| --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true |  
| maria.chen@pawplace.example | Maria | true |  
| opted.out@pawplace.example | Jamie | false |  

### Scenario Outline: Promotional email delivery based on opt-in status  

Given **CustomerAccount** *{customer_email}* has **CommunicationPreferences** *promotionalOptIn* *{promotional_opt_in}*  
When admin creates and sends a promotional **Notification** *{campaign_subject}*  
Then *{expected_delivery_action}* for **CustomerAccount** *{customer_email}*  
And the delivery log records *{expected_log_entry}*  

**Promotional email delivery (Then):**  
| scenario | customer_email | promotional_opt_in | campaign_subject | expected_delivery_action | expected_log_entry |  
| --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | true | Spring Sale — 20% off all toys | Notification delivered to tom.nguyen@pawplace.example | delivered: promotionalOptIn=true |  
| 2 | opted.out@pawplace.example | false | Spring Sale — 20% off all toys | account skipped — promotionalOptIn=false | skipped: opted.out@pawplace.example — promotionalOptIn=false |  

---  

### Scenario: Recently opted-out customer re-checked at send time  

Given **CustomerAccount** *maria.chen@pawplace.example* had *promotionalOptIn* *true* when the email batch was queued  
And **CustomerAccount** *maria.chen@pawplace.example* sets *promotionalOptIn* to *false* before the batch is sent  
When the system sends the queued promotional **Notification** batch  
Then the system re-checks **CommunicationPreferences** at send time and finds *promotionalOptIn* = *false*  
And **CustomerAccount** *maria.chen@pawplace.example* is skipped with batch log entry *"skipped: preference changed to opted-out before send"*  

---  

### Scenario: Unsubscribe link immediately opts out of promotions  

Given **CustomerAccount** *tom.nguyen@pawplace.example* receives a promotional **Notification** email  
When **CustomerAccount** *tom.nguyen@pawplace.example* clicks the unsubscribe link in the email  
Then **CommunicationPreferences** *promotionalOptIn* is set to *false* immediately  
And a *"You've been unsubscribed from promotional emails"* confirmation page is shown  

---  

## Story: `Send Personalized Recommendation`  

**CustomerAccount:** with **CommunicationPreferences** and **Order** history  
| customer_email | first_name | promotional_opt_in | has_purchase_history |  
| --- | --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true | yes |  
| new.user@pawplace.example | Pat | true | no |  

**Product:**  
| sku | name | available_to_sell_quantity |  
| --- | --- | --- |  
| SKU-FOOD-501 | Premium Dog Kibble 10kg | 15 |  
| SKU-TREAT-400 | Dental Chew Sticks | 0 |  

### Scenario Outline: Recommendation type determined by purchase history  

Given **CustomerAccount** *{customer_email}* has **CommunicationPreferences** with *promotionalOptIn* *{promotional_opt_in}*  
And **CustomerAccount** *{customer_email}* has *{purchase_history_status}*  
When the system generates recommendations for **CustomerAccount** *{customer_email}*  
Then *{expected_recommendation_action}*  
And *{expected_recommendation_content}*  

**Personalized Recommendation (Then):**  
| scenario | customer_email | promotional_opt_in | purchase_history_status | expected_recommendation_action | expected_recommendation_content |  
| --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | true | prior Order history including SKU-FOOD-501 | Personalized Recommendation Notification sent to tom.nguyen@pawplace.example | products related to dog food purchase history; only in-stock items included |  
| 2 | new.user@pawplace.example | true | no Order history | account queued for popular-products fallback | top-selling products across categories sent as a "Staff Picks" email |  

---  

### Scenario: Recommendation contains only in-stock products  

Given **Product** *SKU-TREAT-400* *Dental Chew Sticks* has **StockAvailability** *availableToSellQuantity* *0*  
And **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* has **StockAvailability** *availableToSellQuantity* *15*  
And **CustomerAccount** *tom.nguyen@pawplace.example* has purchase history including both **Product** *SKU-TREAT-400* and **Product** *SKU-FOOD-501*  
When the system generates a *Personalized Recommendation* for **CustomerAccount** *tom.nguyen@pawplace.example*  
Then the recommendation includes **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* (*availableToSellQuantity* *15*)  
And the recommendation lists only products with *availableToSellQuantity* > *0*  

---  

## Story: `Send Restock Alert`  

**CustomerAccount:** with **CommunicationPreferences** and **Wishlist**  
| customer_email | first_name | restock_alerts_opt_in |  
| --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true |  
| opted.out@pawplace.example | Jamie | false |  

**Product:** with **StockAvailability**  
| sku | name | available_to_sell_quantity |  
| --- | --- | --- |  
| SKU-TREAT-400 | Dental Chew Sticks | 0 |  

**Wishlist:** with **CustomerAccount** and **Product**  
| customer_email | sku |  
| --- | --- |  
| tom.nguyen@pawplace.example | SKU-TREAT-400 |  
| opted.out@pawplace.example | SKU-TREAT-400 |  

### Scenario Outline: Restock alert behavior based on opt-in status  

Given **Product** *{sku}* *{name}* has **StockAvailability** *availableToSellQuantity* *0*  
And **CustomerAccount** *{customer_email}* has **Product** *{sku}* on their **Wishlist**  
And **CustomerAccount** *{customer_email}* has **CommunicationPreferences** *restockAlertsOptIn* *{restock_alerts_opt_in}*  
When **Product** *{sku}* **StockAvailability** transitions from *Out of Stock* to *In Stock*  
Then *{expected_notification_action}*  
And *{expected_wishlist_update}*  

**Restock alert (Then):**  
| scenario | customer_email | sku | name | restock_alerts_opt_in | expected_notification_action | expected_wishlist_update |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | SKU-TREAT-400 | Dental Chew Sticks | true | RestockAlert Notification sent to tom.nguyen@pawplace.example | Wishlist shows "Back in Stock" label on SKU-TREAT-400 |  
| 2 | opted.out@pawplace.example | SKU-TREAT-400 | Dental Chew Sticks | false | system logs restock event; account skipped with reason restockAlertsOptIn=false | Wishlist shows "Back in Stock" label on next visit |  

---  

### Scenario: Stock reverts before customer acts on alert  

Given a **RestockAlert** **Notification** was sent to **CustomerAccount** *tom.nguyen@pawplace.example* for **Product** *SKU-TREAT-400*  
And **Product** *SKU-TREAT-400* goes back to **StockAvailability** *availableToSellQuantity* *0* before the customer acts  
When **CustomerAccount** *tom.nguyen@pawplace.example* visits the *Product Details Page* for **Product** *SKU-TREAT-400*  
Then the page shows the updated *Out of Stock* status (the alert is best-effort, not a guarantee of availability)  

---  

## Story: `Send In-Store Event Notification`  

**CustomerAccount:** with **CommunicationPreferences** and preferred **Store**  
| customer_email | first_name | event_notifications_opt_in | preferred_store_code |  
| --- | --- | --- | --- |  
| tom.nguyen@pawplace.example | Tom | true | STORE-CAM |  
| maria.chen@pawplace.example | Maria | true | — |  
| opted.out@pawplace.example | Jamie | false | STORE-CAM |  

**Store:**  
| store_code | store_name |  
| --- | --- |  
| STORE-CAM | PawPlace Camden |  

### Scenario Outline: Event notification delivery based on preferred store and opt-in  

Given **Store** *{store_name}* *{store_code}* hosts an in-store event *{event_name}*  
And **CustomerAccount** *{customer_email}* has *preferredStore* *{preferred_store_code}* and **CommunicationPreferences** *eventNotificationsOptIn* *{event_notifications_opt_in}*  
When admin creates the in-store event  
Then *{expected_notification_action}*  
And *{expected_event_discovery}*  

**Event notification delivery (Then):**  
| scenario | customer_email | store_code | store_name | event_name | preferred_store_code | event_notifications_opt_in | expected_notification_action | expected_event_discovery |  
| --- | --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | tom.nguyen@pawplace.example | STORE-CAM | PawPlace Camden | Adoption Day — Saturday 17 May | STORE-CAM | true | Notification sent to tom.nguyen@pawplace.example about event at PawPlace Camden | event also listed on Store detail page |  
| 2 | maria.chen@pawplace.example | STORE-CAM | PawPlace Camden | Adoption Day — Saturday 17 May | — | true | system skips — no preferred store matches event store | event discoverable on PawPlace Camden detail page for walk-in visitors |  
| 3 | opted.out@pawplace.example | STORE-CAM | PawPlace Camden | Adoption Day — Saturday 17 May | STORE-CAM | false | system skips — eventNotificationsOptIn=false | event discoverable on PawPlace Camden detail page for walk-in visitors |  

---  

## Story: `Unsubscribe from Marketing Emails`  

**CustomerAccount:**  
| customer_email | first_name |  
| --- | --- |  
| tom.nguyen@pawplace.example | Tom |  

### Scenario: Unsubscribed via email link  

Given **CustomerAccount** *tom.nguyen@pawplace.example* receives a promotional **Notification** email  
When **CustomerAccount** *tom.nguyen@pawplace.example* clicks the unsubscribe link for *promotionalOptIn*  
Then **CommunicationPreferences** *promotionalOptIn* is set to *false* immediately  
And a *"You've been unsubscribed"* confirmation page is shown  

---  

### Scenario: Unsubscribed via communication preferences page  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has **CommunicationPreferences** *promotionalOptIn* *true*  
When **CustomerAccount** *tom.nguyen@pawplace.example* sets *promotionalOptIn* to *false* via the **CommunicationPreferences** page  
Then the change takes effect immediately and the preference page displays *promotionalOptIn* as *"Opted out"*  
And the account is removed from the promotional distribution list  

---  

### Scenario: Full marketing unsubscribe leaves transactional intact  

Given **CustomerAccount** *tom.nguyen@pawplace.example* opts out of all marketing categories in **CommunicationPreferences**: *promotionalOptIn*, *restockAlertsOptIn*, *petCareTipsOptIn*, *eventNotificationsOptIn*  
When **CustomerAccount** *tom.nguyen@pawplace.example* places an **Order**  
Then the *order confirmation* **Notification** is still sent (transactional, non-suppressible)  
And the *shipping update* **Notification** is still sent (transactional, non-suppressible)  

---  

## Story: `Send Order Confirmation`  

**Order:** with **CustomerAccount** and **DeliveryOption**  
| order_number | customer_email | order_date | order_total | delivery_method_name |  
| --- | --- | --- | --- | --- |  
| ORD-9901 | tom.nguyen@pawplace.example | 2026-05-07 | 67.98 | Standard Delivery |  

**Payment:** with **Order**  
| payment_reference | order_number | payment_status |  
| --- | --- | --- |  
| PAY-5501 | ORD-9901 | captured |  

### Scenario: Order confirmation notification sent with order details  

Given **Order** *ORD-9901* for **CustomerAccount** *tom.nguyen@pawplace.example* with *orderTotal* *£67.98*  
And **Payment** *PAY-5501* for **Order** *ORD-9901* has *paymentStatus* *captured*  
When **Order** *ORD-9901* is confirmed  
Then a **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with *type* *order-confirmation*  
And the **Notification** *notificationBody* includes *orderNumber* *ORD-9901*, *orderLineItems*, *orderTotal* *£67.98*, *deliveryMethodName* *Standard Delivery*, and *estimatedDeliveryDate*  

---  

### Scenario: Order confirmation sent regardless of disabled notification preference  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has disabled order-related notifications in *Notification Preferences*  
When **Order** *ORD-9901* is confirmed  
Then the *order-confirmation* **Notification** is still sent — it is a mandatory transactional notification  
And the **Notification** *notificationBody* includes the full order summary  

---  

### Scenario: Notification queued on email system failure  

Given **Order** *ORD-9901* is confirmed  
And the email delivery system is unavailable  
When the system attempts to send the *order-confirmation* **Notification**  
Then the **Notification** is queued for retry with *deliveryStatus* *queued*  
And the system retries delivery according to the retry schedule  

---  

## Story: `Send Shipping Update with Tracking`  

**Order:** with tracking  
| order_number | customer_email | tracking_number | estimated_delivery_date |  
| --- | --- | --- | --- |  
| ORD-9901 | tom.nguyen@pawplace.example | TRK-UK-88431 | 2026-05-12 |  

### Scenario: Shipping notification sent with tracking number  

Given **Order** *ORD-9901* for **CustomerAccount** *tom.nguyen@pawplace.example*  
When **Order** *ORD-9901* *orderStatus* changes to *shipped* with *trackingNumber* *TRK-UK-88431* and *estimatedDeliveryDate* *2026-05-12*  
Then a **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with *type* *shipping-update*  
And the **Notification** includes *orderNumber* *ORD-9901*, *trackingNumber* *TRK-UK-88431*, carrier link, and *estimatedDeliveryDate* *2026-05-12*  

---  

### Scenario: Follow-up shipping milestone recorded on tracking page  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has disabled optional shipping follow-ups in *Notification Preferences*  
When **Order** *ORD-9901* status updates to *Out for Delivery*  
Then the **Order** *ORD-9901* tracking page records the *Out for Delivery* milestone  
And the updated status is accessible to **CustomerAccount** *tom.nguyen@pawplace.example* via the order tracking link  

---  

### Scenario: Initial shipping notification is non-suppressible  

Given **CustomerAccount** *tom.nguyen@pawplace.example* has disabled shipping notifications in *Notification Preferences*  
When **Order** *ORD-9901* *orderStatus* changes to *shipped*  
Then the initial *shipping-update* **Notification** is still sent (mandatory transactional)  
And the **Notification** includes *trackingNumber* and *estimatedDeliveryDate*  

---  

## Story: `Send Click-and-Collect Ready Notification`  

**ClickAndCollect:** with **Order** and **Store**  
| order_number | customer_email | store_code | store_name | collection_window |  
| --- | --- | --- | --- | --- |  
| ORD-9902 | tom.nguyen@pawplace.example | STORE-CAM | PawPlace Camden | 2026-05-14 |  

### Scenario: Ready notification sent with store details and collection window  

Given **Order** *ORD-9902* for **CustomerAccount** *tom.nguyen@pawplace.example* has a **ClickAndCollect** at **Store** *PawPlace Camden* *STORE-CAM*  
When the store employee marks **ClickAndCollect** *pickupStatus* as *ready*  
Then a **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with *type* *click-and-collect-ready*  
And the **Notification** includes *orderNumber* *ORD-9902*, **Store** *storeName* *PawPlace Camden*, store address, operating hours, and *collectionWindow* *2026-05-14*  

---  

### Scenario: Guest click-and-collect notification sent to guest email  

Given **Order** *ORD-9903* placed by **GuestCheckout** *guest.buyer@example.com* has a **ClickAndCollect** at **Store** *PawPlace Camden*  
When the store employee marks **ClickAndCollect** *pickupStatus* as *ready*  
Then the **Notification** is sent to *guestEmail* *guest.buyer@example.com*  
And the **Notification** includes *orderNumber* *ORD-9903*, **Store** *storeName* *PawPlace Camden*, and *collectionWindow*  

---  

### Scenario: Collection window reminder sent before deadline  

Given **ClickAndCollect** for **Order** *ORD-9902* has *collectionWindow* *2026-05-14*  
And the current date is *2026-05-13* and the order has not been collected  
When the *collectionWindow* deadline approaches  
Then a reminder **Notification** is sent to **CustomerAccount** *tom.nguyen@pawplace.example* with the collection deadline and a warning that uncollected orders will be returned to stock  

---  

### Scenario: Notification queued on email failure without blocking fulfillment  

Given **ClickAndCollect** for **Order** *ORD-9902* is marked as *ready*  
And the email delivery system is temporarily unavailable  
When the system attempts to send the *click-and-collect-ready* **Notification**  
Then the **Notification** is queued for retry with *deliveryStatus* *queued*  
And the **ClickAndCollect** *pickupStatus* still transitions to *ready* (email failure does not block fulfillment)  

---  

## Story: `Publish Blog Post`  

**Content:**  
| content_title | content_author | publication_date | content_body |  
| --- | --- | --- | --- |  
| How to Introduce a New Cat to Your Household | Dr. Sarah Vet | 2026-05-07 | Full article text... |  
| Best Food for Senior Dogs | PawPlace Editorial | — | Draft article text... |  

### Scenario Outline: Blog post visibility based on publication status  

Given a *Content Author* creates a **Content** with *contentTitle* *{content_title}*, *contentAuthor* *{content_author}*, and *contentBody*  
When the *Content Author* sets the **Content** to *{publication_status}*  
Then *{expected_blog_index_display}*  
And *{expected_customer_url_access}*  
And *{expected_admin_area_state}*  

**Content visibility (Then):**  
| scenario | content_title | content_author | publication_date | publication_status | expected_blog_index_display | expected_customer_url_access | expected_admin_area_state |  
| --- | --- | --- | --- | --- | --- | --- | --- |  
| 1 | How to Introduce a New Cat to Your Household | Dr. Sarah Vet | 2026-05-07 | published | listed on Blog Index with title, summary, date 2026-05-07, and author | full content accessible via its own URL | marked as "Published" in admin |  
| 2 | Best Food for Senior Dogs | PawPlace Editorial | — | draft | not listed on Blog Index | content URL returns 404 for customers | listed as "Draft" in admin — editable and publishable |  

---  

### Scenario: Edited blog post updated immediately  

Given a published **Content** *"How to Introduce a New Cat to Your Household"* with *publicationDate* *2026-05-07*  
When the *Content Author* edits the **Content** *contentBody*  
Then the changes are reflected immediately on the live page  
And the *publicationDate* remains *2026-05-07* unless the author explicitly updates it  

---  

## Story: `Publish Pet Care Guide`  

**Content:**  
| content_title | content_author | species_tag |  
| --- | --- | --- |  
| Nutrition Guide for Golden Retrievers | PawPlace Editorial | dog |  
| Reptile Habitat Setup | PawPlace Editorial | reptile |  

### Scenario Outline: Pet care guide visibility based on publication status  

Given a *Content Author* creates a **Content** guide with *contentTitle* *{content_title}*, tagged with *species* *{species_tag}*  
When the *Content Author* sets the guide to *{publication_status}*  
Then *{expected_guide_index_display}*  
And *{expected_customer_access}*  
And *{expected_admin_area_state}*  

**Guide visibility (Then):**  
| scenario | content_title | species_tag | publication_status | expected_guide_index_display | expected_customer_access | expected_admin_area_state |  
| --- | --- | --- | --- | --- | --- | --- |  
| 1 | Nutrition Guide for Golden Retrievers | dog | published | listed on Guide Index with title, summary, species tag "dog", and publicationDate | full guide accessible via its own URL | marked as "Published" in admin |  
| 2 | Reptile Habitat Setup | reptile | draft | not listed on Guide Index | guide URL returns 404 for customers | listed as "Draft" in admin — editable and publishable |  

---  

### Scenario: Published guide linked from pet browsing areas  

Given a published **Content** guide *"Nutrition Guide for Golden Retrievers"* tagged with *species* *dog*  
When a customer browses the *Pet Gallery* or **Product** pages for *dog* products  
Then the guide is linked from relevant pet-related browsing areas  
And the link shows the guide title and species tag  


---

## increment-8-sprint-1-reviews-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 1 — Customer reviews
stories:
  - Submit Written Review with Star Rating
  - Submit Photo Review
  - Read Customer Reviews
---

# Specification by Example — Increment 8 Sprint 1: Customer reviews

**Sources / context:** `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-reviews-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 1 review stories only)

---

## Story: Submit Written Review with Star Rating

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Customer Review, Star Rating, Aggregate Star Rating), marketing-engine-ubiquitous-language.md (Customer Review KA), acceptance-criteria.md (Submit Written Review with Star Rating AC 1–5)

---

## Background

Given a **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has purchased **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* via **Order** *ORD-8801*

---

### Scenario 1: Verified purchaser sees review form on product details page

Given the **Product Details Page** for **Product** *SKU-FOOD-501* is displayed
When **Customer Account** *tom.nguyen@pawplace.example* opens the review submission area on the **Product Details Page**
Then the form collects a **Star Rating** *(1–5)* and optional written text for a **Customer Review**
  And **Customer Account** *tom.nguyen@pawplace.example* is *verified as purchaser* of **Product** *SKU-FOOD-501*

### Scenario 2: Valid customer review published and aggregate star rating recomputed

When **Customer Account** *tom.nguyen@pawplace.example* submits a **Customer Review** on **Product** *SKU-FOOD-501* with **Star Rating** *5* and written text *"My dog loves this kibble"*
Then the **Customer Review** is associated with **Product** *SKU-FOOD-501* and **Customer Account** *tom.nguyen@pawplace.example*
  And the **Customer Review** appears on the **Product Details Page** sorted *newest first*
  And **Product** *SKU-FOOD-501* **Aggregate Star Rating** is recomputed to include **Star Rating** *5*

### Scenario 3: Star-rating-only customer review accepted

When **Customer Account** *tom.nguyen@pawplace.example* submits a **Customer Review** on **Product** *SKU-FOOD-501* with **Star Rating** *3* and no written text
Then the **Customer Review** is *accepted*
  And the **Product Details Page** shows **Star Rating** *3* with no written text body

### Scenario 4: Non-purchaser sees purchase prompt while reviews remain viewable

Given a **Customer Account** *tom.nguyen@pawplace.example* is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has *not purchased* **Product** *SKU-TOY-220* *Squeaky Bone Chew*
When **Customer Account** *tom.nguyen@pawplace.example* opens the review area on the **Product Details Page** for **Product** *SKU-TOY-220*
Then the **Product Details Page** shows *"Purchase this product to leave a review"* where the review form would appear
  And existing **Customer Reviews** on **Product** *SKU-TOY-220* remain *viewable*

### Scenario 5: Guest prompted to sign in without leaving product details page

Given no **Customer Account** session exists (*guest*)
When the guest attempts to leave a **Customer Review** on **Product** *SKU-FOOD-501* from the **Product Details Page**
Then the **Product Details Page** prompts to *log in or register*
  And the **Product Details Page** remains in view — no navigation away

---

## Story: Submit Photo Review

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Review Photo, Customer Review), marketing-engine-ubiquitous-language.md (review photo), acceptance-criteria.md (Submit Photo Review AC 1–4)

---

### Scenario 1: Review photos displayed inline with lightbox expansion

Given **Customer Account** *tom.nguyen@pawplace.example* is submitting a **Customer Review** on **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* attaches **Review Photo** *dog-kibble-bowl.jpg* to the **Customer Review**
  And submits the **Customer Review** with **Star Rating** *5* and written text *"Great quality"*
Then **Review Photo** *dog-kibble-bowl.jpg* is stored on the **Customer Review**
  And the **Product Details Page** displays the **Review Photo** as an inline thumbnail alongside the review text
When a customer selects the thumbnail on the **Product Details Page**
Then the **Product Details Page** opens **Review Photo** at *full size in a lightbox*

### Scenario 2: Unsupported image format rejected without losing review draft

Given **Customer Account** *tom.nguyen@pawplace.example* has entered **Star Rating** *4* and written text *"Great product"* on a **Customer Review** draft for **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* uploads file *photo.bmp* as a **Review Photo**
Then the upload shows a validation error *"Supported formats: JPEG, PNG, WebP"*
  And **Star Rating** *4* and written text *"Great product"* remain in the form

### Scenario 3: Oversized image rejected without losing review draft

Given **Customer Account** *tom.nguyen@pawplace.example* has entered **Star Rating** *4* and written text *"Great product"* on a **Customer Review** draft for **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* uploads file *large-photo.jpg* exceeding the *5 MB* size limit as a **Review Photo**
Then the upload shows a validation error *"Image must be under 5 MB"*
  And **Star Rating** *4* and written text *"Great product"* remain in the form

### Scenario 4: Customer review accepted without review photos

Given **Customer Account** *tom.nguyen@pawplace.example* is submitting a **Customer Review** on **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* submits the **Customer Review** with **Star Rating** *5* and written text *"Excellent quality"* and no **Review Photo**
Then the **Customer Review** is *accepted* as a standard written review — **Review Photo** is *optional*
  And the **Product Details Page** shows the **Star Rating** and written text with no image placeholder

---

## Story: Read Customer Reviews

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Product Reviews, Aggregate Star Rating, Product Details Page), marketing-engine-ubiquitous-language.md (aggregate star rating, product reviews), acceptance-criteria.md (Read Customer Reviews AC 1–4)

---

### Scenario 1: Product with reviews shows aggregate star rating and review listing

Given **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* has **Product Reviews** with *27* **Customer Reviews** and **Aggregate Star Rating** *4.3*
When a customer views the **Product Details Page** for **Product** *SKU-FOOD-501*
Then **Aggregate Star Rating** *4.3* is displayed prominently near the product name
  And **Product Reviews** lists individual **Customer Reviews** below the product details
  And sort controls offer *newest*, *oldest*, *highest rating*, and *lowest rating*

### Scenario 2: Product with no reviews suppresses zero aggregate star rating

Given **Product** *SKU-TOY-220* *Squeaky Bone Chew* has **Product Reviews** with *zero* **Customer Reviews**
When a customer views the **Product Details Page** for **Product** *SKU-TOY-220*
Then **Aggregate Star Rating** is *not displayed*
  And the **Product Details Page** shows *"Be the first to review"*

### Scenario 3: Many customer reviews paginated with default newest-first sort

Given **Product** *SKU-FOOD-501* has more than one page of **Customer Reviews** in **Product Reviews**
When a customer views **Product Reviews** on the **Product Details Page** for **Product** *SKU-FOOD-501*
Then **Product Reviews** are *paginated or lazy-loaded*
  And the default listing order is *newest first*
When the customer selects sort *highest rating* on **Product Reviews**
Then **Product Reviews** reorders **Customer Reviews** by **Star Rating** *descending*

### Scenario 4: Review photo thumbnails shown inline on read path

Given a **Customer Review** on **Product** *SKU-FOOD-501* includes **Review Photo** *dog-kibble-bowl.jpg*
When a customer views **Product Reviews** on the **Product Details Page**
Then **Review Photo** thumbnails appear inline with the review text
When the customer selects a thumbnail
Then the **Product Details Page** opens **Review Photo** at *full size in a lightbox*


---

## increment-8-sprint-2-preferences-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
stories:
  - Set Notification Preferences
  - Set Communication Preferences
  - Opt In to Marketing Email List
---

# Specification by Example — Increment 8 Sprint 2: Notification and communication preferences

**Sources / context:** `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-preferences-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 2 preference stories only)

---

## Story: Set Notification Preferences

**Story type:** user

**Sources / context:** marketing-engine-preferences-crc.md (Notification Preferences, Transactional Notification, Account Settings), acceptance-criteria.md (Set Notification Preferences AC 1–4)

---

## Background

Given a **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has **Notification Preferences** with order updates *on*, shipping *on*, appointments *on*, returns *off*

---

### Scenario 1: Account settings lists transactional notification categories with current on/off settings

When **Customer Account** *tom.nguyen@pawplace.example* opens **Notification Preferences** from **Account Settings**
Then **Account Settings** lists **Transactional Notification** categories *order updates*, *shipping*, *appointments*, and *returns*
  And each category shows the current setting from **Notification Preferences** (*on* or *off*)

### Scenario 2: Category toggle persists immediately and gates future transactional sends

When **Customer Account** *tom.nguyen@pawplace.example* toggles **Notification Preferences** *shipping* from *on* to *off*
Then **Notification Preferences** for **Customer Account** *tom.nguyen@pawplace.example* saves *shipping* as *off* immediately — no separate save action
  And a subsequent **Transactional Notification** of category *shipping* is *not delivered* to **Customer Account** *tom.nguyen@pawplace.example*
  And a subsequent **Transactional Notification** of category *order updates* still respects the *on* setting

### Scenario 3: Disabling all optional categories still sends critical confirmations

Given **Customer Account** *tom.nguyen@pawplace.example* has **Notification Preferences** with order updates *off*, shipping *off*, appointments *off*, and returns *off*
When **Customer Account** *tom.nguyen@pawplace.example* completes payment on **Order** *ORD-8802* with total *$42.50*
Then a **Transactional Notification** *order confirmation* is sent to **Customer Account** *tom.nguyen@pawplace.example* — *non-optional*
  And **Account Settings** on **Notification Preferences** shows a note that *order confirmation* and *refund completion* cannot be disabled

### Scenario 4: Guest prompted to sign in while guest checkout notifications continue

Given no **Customer Account** session exists (*guest*)
  And guest checkout used email *guest.buyer@example.com* on **Order** *ORD-8803*
When the guest attempts to open **Notification Preferences** from **Account Settings**
Then **Account Settings** prompts to *log in or create an account*
  And **Transactional Notification** for **Order** *ORD-8803* is still delivered to *guest.buyer@example.com*

---

## Story: Set Communication Preferences

**Story type:** user

**Sources / context:** marketing-engine-preferences-crc.md (Communication Preferences, Marketing Category, Marketing Communication, Unsubscribe), acceptance-criteria.md (Set Communication Preferences AC 1–5)

---

## Background

Given a **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *promotions* *opted-out*, *recommendations* *opted-out*, *restock alerts* *opted-in*, and *events* *opted-out*

---

### Scenario 1: Communication preferences lists marketing categories with opt-in status

When **Customer Account** *tom.nguyen@pawplace.example* opens **Communication Preferences** from **Account Settings**
Then **Account Settings** lists **Marketing Category** *promotions*, *recommendations*, *restock alerts*, and *events*
  And each **Marketing Category** shows the current opt-in/opt-out status from **Communication Preferences**

### Scenario 2: Marketing category opt-out persists immediately and blocks category sends

When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *restock alerts* from *opted-in* to *opted-out* on **Communication Preferences**
Then **Communication Preferences** persists *restock alerts* as *opted-out* immediately — no separate save action
  And **Marketing Communication** for **Marketing Category** *restock alerts* is *not sent* to **Customer Account** *tom.nguyen@pawplace.example* after the toggle

### Scenario 3: New marketing category defaults to opt-out for existing customers

Given the catalog adds **Marketing Category** *loyalty rewards* after go-live
When **Customer Account** *tom.nguyen@pawplace.example* opens **Communication Preferences**
Then **Marketing Category** *loyalty rewards* appears with status *opted-out*
  And no **Marketing Communication** for **Marketing Category** *loyalty rewards* is sent until **Customer Account** *tom.nguyen@pawplace.example* explicitly opts in

### Scenario 4: Opting out of all marketing categories leaves transactional notifications intact

Given **Customer Account** *tom.nguyen@pawplace.example* opts out of **Marketing Category** *promotions*, *recommendations*, *restock alerts*, and *events* on **Communication Preferences**
When **Marketing Communication** eligibility is evaluated for **Customer Account** *tom.nguyen@pawplace.example*
Then no **Marketing Communication** is sent for any **Marketing Category**
  And **Transactional Notification** *order confirmation* for **Order** *ORD-8801* is still delivered per **Notification Preferences**

### Scenario 5: Guest prompted without leaving the current page

Given no **Customer Account** session exists (*guest*)
  And the guest is viewing **Account Settings** on route */account/communication*
When the guest attempts to open **Communication Preferences**
Then **Account Settings** prompts to *log in or register*
  And the browser remains on */account/communication* — no navigation away

---

## Story: Opt In to Marketing Email List

**Story type:** user

**Sources / context:** marketing-engine-preferences-crc.md (Marketing Email List, Opt In, Communication Preferences), acceptance-criteria.md (Opt In to Marketing Email List AC 1–4)

---

### Scenario 1: Opting in via communication preferences adds customer to marketing email list with timestamp

Given **Customer Account** *tom.nguyen@pawplace.example* is *not* on the **Marketing Email List**
  And **Communication Preferences** has **Marketing Category** *promotions* *opted-out*
When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *promotions* to *opted-in* on **Communication Preferences**
Then **Customer Account** *tom.nguyen@pawplace.example* is added to the **Marketing Email List**
  And **Marketing Email List** records an **Opt In** timestamp *2026-05-30T14:22:00Z* for **Marketing Category** *promotions*

### Scenario 2: Registration promotional checkbox is unchecked by default

Given a new **Customer Account** registration form is displayed
When the registrant views the promotional email checkbox
Then the checkbox is *unchecked* by default
When the registrant completes registration *without* checking the promotional email checkbox
Then **Customer Account** *new.customer@pawplace.example* is *not* on the **Marketing Email List**

### Scenario 3: Affirmative checkout opt-in adds customer to marketing email list

Given **Customer Account** *tom.nguyen@pawplace.example* is completing checkout
  And the promotional email checkbox is *unchecked* by default
When **Customer Account** *tom.nguyen@pawplace.example* checks the promotional email checkbox and completes checkout
Then **Customer Account** *tom.nguyen@pawplace.example* is added to the **Marketing Email List**
  And **Marketing Email List** records an **Opt In** timestamp for the checkout path

### Scenario 4: No marketing communications without explicit category opt-in

Given **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with every **Marketing Category** *opted-out*
  And **Customer Account** *sam.lee@pawplace.example* is *not* on the **Marketing Email List**
When **Marketing Communication** send eligibility is evaluated for **Customer Account** *sam.lee@pawplace.example*
Then **Marketing Communication** is *not sent* — zero exceptions

### Scenario 5: Existing list member can unsubscribe via promotions toggle

Given **Customer Account** *tom.nguyen@pawplace.example* is on the **Marketing Email List** with **Marketing Category** *promotions* *opted-in*
When **Customer Account** *tom.nguyen@pawplace.example* opens **Communication Preferences**
Then **Marketing Category** *promotions* shows as *opted-in*
When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *promotions* to *opted-out*
Then **Unsubscribe** for **Marketing Category** *promotions* takes effect immediately
  And **Customer Account** *tom.nguyen@pawplace.example* is removed from the **Marketing Email List** when no **Marketing Category** remains *opted-in*


---

## increment-8-sprint-3-campaigns-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
stories:
  - Send Promotional Email
  - Send Personalized Recommendation
  - Send Restock Alert
  - Send In-Store Event Notification
---

# Specification by Example — Increment 8 Sprint 3: Marketing campaigns and alerts

**Sources / context:** `docs/end-to-end/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-campaigns-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Sprint 3 campaign stories only)

---

## Story: Send Promotional Email

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (Promotional Email, Marketing Email List, Communication Preferences, Unsubscribe), acceptance-criteria.md (Send Promotional Email AC 1–4)

---

## Background

Given admin *marketing.admin@pawplace.example* is authenticated
  And **Marketing Email List** includes **Customer Account** *tom.nguyen@pawplace.example* with **Marketing Category** *promotions* *opted-in*
  And **Marketing Email List** includes **Customer Account** *sam.lee@pawplace.example* with **Marketing Category** *promotions* *opted-in*

---

### Scenario 1: Promotional email delivered only to opted-in marketing email list members

When admin creates and sends **Promotional Email** *Summer Sale 20% Off* targeting **Marketing Category** *promotions*
Then **Promotional Email** *Summer Sale 20% Off* is delivered to **Customer Account** *tom.nguyen@pawplace.example*
  And **Promotional Email** *Summer Sale 20% Off* is delivered to **Customer Account** *sam.lee@pawplace.example*
  And **Promotional Email** *Summer Sale 20% Off* includes an **Unsubscribe** link

### Scenario 2: Realtime opt-out between batch creation and delivery blocks send

Given **Promotional Email** *Summer Sale 20% Off* batch was created at *2026-05-30T10:00:00Z*
  And **Customer Account** *sam.lee@pawplace.example* had **Marketing Category** *promotions* *opted-in* at batch creation
When **Customer Account** *sam.lee@pawplace.example* toggles **Marketing Category** *promotions* to *opted-out* on **Communication Preferences** at *2026-05-30T10:30:00Z*
  And the system delivers **Promotional Email** *Summer Sale 20% Off* at *2026-05-30T11:00:00Z*
Then **Promotional Email** *Summer Sale 20% Off* is *not delivered* to **Customer Account** *sam.lee@pawplace.example*
  And **Communication Preferences** were checked at *delivery time* — not at batch creation time

### Scenario 3: Unsubscribe link opts out promotions category and shows confirmation

Given **Customer Account** *tom.nguyen@pawplace.example* received **Promotional Email** *Summer Sale 20% Off* with **Marketing Category** *promotions* *opted-in*
When **Customer Account** *tom.nguyen@pawplace.example* clicks the **Unsubscribe** link in **Promotional Email** *Summer Sale 20% Off*
Then **Unsubscribe** opts **Customer Account** *tom.nguyen@pawplace.example* out of **Marketing Category** *promotions* immediately
  And a confirmation page shows *you've been unsubscribed*

### Scenario 4: Delivery failure queues promotional email for retry

Given **Customer Account** *tom.nguyen@pawplace.example* is eligible for **Promotional Email** *Summer Sale 20% Off*
  And the email delivery provider is *temporarily unavailable*
When the system attempts to send **Promotional Email** *Summer Sale 20% Off* to **Customer Account** *tom.nguyen@pawplace.example*
Then **Promotional Email** *Summer Sale 20% Off* is *queued for retry*
  And the message is *not silently discarded*

### Scenario 5: Guest checkout sessions cannot receive promotional email

Given no **Customer Account** exists for guest checkout email *guest.buyer@example.com*
When admin sends **Promotional Email** *Summer Sale 20% Off*
Then **Promotional Email** *Summer Sale 20% Off* is *not delivered* to *guest.buyer@example.com*

---

## Story: Send Personalized Recommendation

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (Personalized Recommendation, Purchase History, Browsing History, Pet Profile, Stock Availability), acceptance-criteria.md (Send Personalized Recommendation AC 1–4)

---

## Examples

### Customer Account:

| scenario   | customer_email              | recommendations_opt_in |
|------------|-----------------------------|------------------------|
| Scenario 1 | tom.nguyen@pawplace.example | opted-in               |
| Scenario 4 | jane.wong@pawplace.example  | opted-out              |

### Personalized Recommendation:

| scenario   | personalization_source | recommended_product_sku | recommended_product_name      |
|------------|------------------------|-------------------------|-------------------------------|
| Scenario 1 | purchase history       | SKU-FOOD-502            | Grain-Free Puppy Kibble 5kg   |
| Scenario 2 | browsing history       | SKU-TOY-220             | Squeaky Bone Chew             |
| Scenario 3 | pet profile            | SKU-GROOM-110           | Hypoallergenic Dog Shampoo    |

---

## Background

Given **Customer Account** {customer_email} has **Communication Preferences** with **Marketing Category** *recommendations* {recommendations_opt_in}

---

## Scenarios

### Scenario Outline 1: Personalized recommendation sent from eligible personalization source

### Steps

Given **Customer Account** {customer_email} has {personalization_source} data for **Product** recommendations
  And **Product** {recommended_product_sku} *{recommended_product_name}* has **Stock Availability** *in-stock*
When the system generates **Personalized Recommendation** for **Customer Account** {customer_email}
Then **Personalized Recommendation** includes **Product** {recommended_product_sku} *{recommended_product_name}*
  And **Personalized Recommendation** is delivered to **Customer Account** {customer_email}

---

### Scenario 2: No personalized recommendation when customer lacks personalization data

Given **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with **Marketing Category** *recommendations* *opted-in*
  And **Customer Account** *sam.lee@pawplace.example* has no **Purchase History**, **Browsing History**, or **Pet Profile** data
When the system evaluates **Personalized Recommendation** eligibility for **Customer Account** *sam.lee@pawplace.example*
Then no **Personalized Recommendation** is sent
  And generic suggestions remain the responsibility of **Promotional Email** — not this channel

### Scenario 3: Out-of-stock product excluded from recommendation set

Given **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *recommendations* *opted-in*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Purchase History** including **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg*
  And **Product** *SKU-FOOD-501* has **Stock Availability** *out-of-stock*
  And **Product** *SKU-FOOD-502* *Grain-Free Puppy Kibble 5kg* in the same category has **Stock Availability** *in-stock*
When the system generates **Personalized Recommendation** for **Customer Account** *tom.nguyen@pawplace.example*
Then **Personalized Recommendation** excludes **Product** *SKU-FOOD-501*
  And **Personalized Recommendation** may include **Product** *SKU-FOOD-502* *Grain-Free Puppy Kibble 5kg*

### Scenario Outline 2: Recommendations category opt-out blocks send regardless of data

### Steps

Given **Customer Account** {customer_email} has **Purchase History** and **Browsing History** data
When the system evaluates **Personalized Recommendation** eligibility for **Customer Account** {customer_email}
Then no **Personalized Recommendation** is sent

---

## Story: Send Restock Alert

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (Restock Alert, Wishlist, Stock Availability, Product Details Page), acceptance-criteria.md (Send Restock Alert AC 1–4)

---

## Background

Given **Product** *SKU-TOY-220* *Squeaky Bone Chew* has **Stock Availability** *out-of-stock*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Product** *SKU-TOY-220* on **Wishlist**
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *restock alerts* *opted-in*

---

### Scenario 1: Restock alert sent when stock transitions to in-stock for wishlisted opted-in customer

When **Stock Availability** for **Product** *SKU-TOY-220* transitions from *out-of-stock* to *in-stock*
Then **Restock Alert** is sent to **Customer Account** *tom.nguyen@pawplace.example*
  And **Restock Alert** references **Product** *SKU-TOY-220* *Squeaky Bone Chew*

### Scenario 2: Restock alert suppressed when restock category opted out

Given **Customer Account** *sam.lee@pawplace.example* has **Product** *SKU-TOY-220* on **Wishlist**
  And **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with **Marketing Category** *restock alerts* *opted-out*
When **Stock Availability** for **Product** *SKU-TOY-220* transitions from *out-of-stock* to *in-stock*
Then no **Restock Alert** is sent to **Customer Account** *sam.lee@pawplace.example*

### Scenario 3: Product details page reflects best-effort availability after restock alert

Given **Restock Alert** was sent to **Customer Account** *tom.nguyen@pawplace.example* for **Product** *SKU-TOY-220*
When **Stock Availability** for **Product** *SKU-TOY-220* transitions back to *out-of-stock* before **Customer Account** *tom.nguyen@pawplace.example* purchases
  And **Customer Account** *tom.nguyen@pawplace.example* opens the **Product Details Page** for **Product** *SKU-TOY-220*
Then the **Product Details Page** shows **Stock Availability** *out-of-stock*
  And the prior **Restock Alert** remains a *best-effort signal* — not a guarantee of availability

### Scenario 4: No restock alert when product is not wishlisted

Given no **Customer Account** has **Product** *SKU-GROOM-110* on **Wishlist**
When **Stock Availability** for **Product** *SKU-GROOM-110* transitions from *out-of-stock* to *in-stock*
Then no **Restock Alert** is sent

---

## Story: Send In-Store Event Notification

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (In-Store Event, In-Store Event Notification, Store, Store Details Page), acceptance-criteria.md (Send In-Store Event Notification AC 1–4)

---

## Background

Given admin *marketing.admin@pawplace.example* is authenticated
  And **Store** *STR-001* *PawPlace Downtown* hosts **In-Store Event** *EVT-2026-0615* *Adoption Day* on *2026-06-15*

---

### Scenario 1: Event notification sent when preferred store matches event location

Given **Customer Account** *tom.nguyen@pawplace.example* has preferred **Store** *STR-001* *PawPlace Downtown*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-in*
When admin publishes **In-Store Event** *EVT-2026-0615* at **Store** *STR-001*
Then **In-Store Event Notification** for **In-Store Event** *EVT-2026-0615* is sent to **Customer Account** *tom.nguyen@pawplace.example*

### Scenario 2: No notification when preferred store not set but event remains discoverable

Given **Customer Account** *sam.lee@pawplace.example* has no preferred **Store** set
  And **Customer Account** *sam.lee@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-in*
When admin publishes **In-Store Event** *EVT-2026-0615* at **Store** *STR-001*
Then no **In-Store Event Notification** is sent to **Customer Account** *sam.lee@pawplace.example*
  And **In-Store Event** *EVT-2026-0615* appears on **Store Details Page** for **Store** *STR-001* for walk-in discovery

### Scenario 3: Events category opt-out suppresses notification

Given **Customer Account** *jane.wong@pawplace.example* has preferred **Store** *STR-001* *PawPlace Downtown*
  And **Customer Account** *jane.wong@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-out*
When admin publishes **In-Store Event** *EVT-2026-0615* at **Store** *STR-001*
Then no **In-Store Event Notification** is sent to **Customer Account** *jane.wong@pawplace.example*

### Scenario 4: No notification when event location differs from preferred store

Given **Customer Account** *tom.nguyen@pawplace.example* has preferred **Store** *STR-001* *PawPlace Downtown*
  And **Customer Account** *tom.nguyen@pawplace.example* has **Communication Preferences** with **Marketing Category** *events* *opted-in*
When admin publishes **In-Store Event** *EVT-2026-0622* *Grooming Workshop* at **Store** *STR-002* *PawPlace Westside*
Then no **In-Store Event Notification** for **In-Store Event** *EVT-2026-0622* is sent to **Customer Account** *tom.nguyen@pawplace.example*
  And **In-Store Event** *EVT-2026-0622* appears on **Store Details Page** for **Store** *STR-002*


---

## increment-8-sprint-4-content-specification-by-example

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

---
state: specification-by-example
sprint_scope: Increment 8 Sprint 4 — Content publishing and unsubscribe
stories:
  - Publish Blog Post
  - Publish Pet Care Guide
  - Unsubscribe from Marketing Emails
---

# Specification by Example — Increment 8 Sprint 4: Content publishing and unsubscribe

**Sources / context:** `docs/increments/8-marketing-engine/specification/crc.md`, `docs/increments/8-marketing-engine/specification/marketing-engine-content-domain.json`, `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md`, `docs/end-to-end/exploration/stories/acceptance-criteria.md` (Publish Blog Post, Publish Pet Care Guide, Unsubscribe from Marketing Emails)

---

## Story: Publish Blog Post

**Story type:** store employee

**Sources / context:** marketing-engine-content-crc.md (Content, Blog Post, Blog Index, Content Author, Admin Content Area), acceptance-criteria.md (Publish Blog Post AC 1–4)

---

## Background

Given **Content Author** *jamie.wells@pawplace.example* (*Jamie Wells*) is authenticated in **Admin Content Area**
  And **Blog Index** lists no draft **Blog Post** entries visible to customers

---

### Scenario 1: Published blog post appears on blog index with metadata and own URL

When **Content Author** *Jamie Wells* creates and publishes **Blog Post** *Spring Pet Safety Tips* with **Content** summary *Keep pets safe during spring outings* and body *Check fences, watch for toxic plants…*
Then **Blog Post** *Spring Pet Safety Tips* appears on **Blog Index** with title *Spring Pet Safety Tips*, summary *Keep pets safe during spring outings*, publish date *2026-05-28*, and author *Jamie Wells*
  And the full **Blog Post** is accessible at URL */blog/spring-pet-safety-tips*

### Scenario 2: Draft blog post hidden from customers but editable in admin

When **Content Author** *Jamie Wells* saves **Blog Post** *Holiday Hours Update* as **Content** lifecycle status *draft* in **Admin Content Area**
Then **Blog Post** *Holiday Hours Update* is *not visible* on **Blog Index** to customers
  And **Blog Post** *Holiday Hours Update* remains editable and publishable from **Admin Content Area**

### Scenario 3: Published blog post edits reflect live without changing publish date

Given **Blog Post** *Spring Pet Safety Tips* is published with publish date *2026-05-28*
When **Content Author** *Jamie Wells* edits **Content** body to *Check fences, watch for toxic plants, and refresh water bowls daily*
Then the live **Blog Post** detail page at */blog/spring-pet-safety-tips* shows the updated body immediately
  And **Blog Post** *Spring Pet Safety Tips* publish date remains *2026-05-28* — unchanged unless **Content Author** explicitly updates it

### Scenario 4: Direct URL displays full published article

Given **Blog Post** *Spring Pet Safety Tips* is published with author *Jamie Wells*, publish date *2026-05-28*, and body *Check fences, watch for toxic plants…*
When a customer navigates directly to */blog/spring-pet-safety-tips*
Then the full **Blog Post** displays title *Spring Pet Safety Tips*, author *Jamie Wells*, date *2026-05-28*, and body content

---

## Story: Publish Pet Care Guide

**Story type:** store employee

**Sources / context:** marketing-engine-content-crc.md (Pet Care Guide, Guide Index, Pet Browsing Area, Product Browsing Area), acceptance-criteria.md (Publish Pet Care Guide AC 1–4)

---

## Background

Given **Content Author** *jamie.wells@pawplace.example* (*Jamie Wells*) is authenticated in **Admin Content Area**

---

### Scenario 1: Published guide appears on guide index with tag and own URL

When **Content Author** *Jamie Wells* creates and publishes **Pet Care Guide** *How to Introduce a New Cat to Your Household* with **Content** summary *Gradual room-by-room introduction* and pet type tag *cats*
Then **Pet Care Guide** *How to Introduce a New Cat to Your Household* appears on **Guide Index** with title, summary *Gradual room-by-room introduction*, pet type tag *cats*, and publish date *2026-05-29*
  And the full **Pet Care Guide** is accessible at URL */guides/introduce-new-cat*

### Scenario 2: Species tag cross-links guide from pet and product browsing areas

Given **Pet Care Guide** *How to Introduce a New Cat to Your Household* is published with pet type tag *cats*
When a customer browses **Pet Browsing Area** filtered to species *cats*
Then **Pet Care Guide** *How to Introduce a New Cat to Your Household* is linked from **Pet Browsing Area**
  And **Pet Care Guide** *How to Introduce a New Cat to Your Household* is linked from **Product Browsing Area** for cat products

### Scenario 3: Draft guide hidden from customers but editable in admin

When **Content Author** *Jamie Wells* saves **Pet Care Guide** *Best Food for Senior Dogs* as **Content** lifecycle status *draft*
Then **Pet Care Guide** *Best Food for Senior Dogs* is *not visible* on **Guide Index** to customers
  And **Pet Care Guide** *Best Food for Senior Dogs* remains editable and publishable from **Admin Content Area**

### Scenario 4: Publish blocked without species tag but draft preserved

Given **Pet Care Guide** *Best Food for Senior Dogs* has **Content** title and body but no pet type or species tag
When **Content Author** *Jamie Wells* attempts to publish **Pet Care Guide** *Best Food for Senior Dogs*
Then the system requires at least one pet type or species tag before publishing
  And **Pet Care Guide** *Best Food for Senior Dogs* remains saved as **Content** lifecycle status *draft* in **Admin Content Area** — not discarded

---

## Story: Unsubscribe from Marketing Emails

**Story type:** user

**Sources / context:** marketing-engine-content-crc.md (Unsubscribe, Unsubscribe Token, Marketing Communication, Communication Preferences, Marketing Category, Transactional Notification), acceptance-criteria.md (Unsubscribe from Marketing Emails AC 1–4)

---

## Background

Given **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) has **Communication Preferences** with **Marketing Category** *promotions* *opted-in* and *restock alerts* *opted-in*
  And **Customer Account** *tom.nguyen@pawplace.example* is on **Marketing Email List** for both categories

---

### Scenario 1: Email unsubscribe link opts out category immediately with confirmation page

Given **Customer Account** *tom.nguyen@pawplace.example* received **Marketing Communication** *Summer Sale 20% Off* for **Marketing Category** *promotions*
  And the message includes an **Unsubscribe** link backed by **Unsubscribe Token** encoding account *tom.nguyen@pawplace.example* and category *promotions*
When **Customer Account** *tom.nguyen@pawplace.example* clicks the **Unsubscribe** link in **Marketing Communication** *Summer Sale 20% Off*
Then **Unsubscribe** opts **Customer Account** *tom.nguyen@pawplace.example* out of **Marketing Category** *promotions* immediately
  And **Unsubscribe Confirmation Page** shows *you've been unsubscribed*

### Scenario 2: Preferences-page unsubscribe blocks future category sends immediately

When **Customer Account** *tom.nguyen@pawplace.example* toggles **Marketing Category** *restock alerts* to *opted-out* on **Communication Preferences**
Then **Communication Preferences** persists *restock alerts* as *opted-out* immediately
  And no further **Marketing Communication** for **Marketing Category** *restock alerts* is sent to **Customer Account** *tom.nguyen@pawplace.example*

### Scenario 3: Unsubscribing all marketing categories leaves transactional notifications intact

Given **Customer Account** *tom.nguyen@pawplace.example* opts out of **Marketing Category** *promotions*, *recommendations*, *restock alerts*, and *events* via **Communication Preferences** or **Unsubscribe** links
When **Transactional Notification** *order confirmation* for **Order** *ORD-8801* is evaluated for **Customer Account** *tom.nguyen@pawplace.example*
Then **Transactional Notification** *order confirmation* is *delivered* per **Notification Preferences**
  And **Notification Preferences** transactional settings are *unchanged* by marketing **Unsubscribe**

### Scenario 4: Repeat unsubscribe link is idempotent with same confirmation

Given **Customer Account** *tom.nguyen@pawplace.example* already opted out of **Marketing Category** *promotions*
  And **Unsubscribe Token** for category *promotions* is still valid in a prior **Marketing Communication**
When **Customer Account** *tom.nguyen@pawplace.example* clicks the **Unsubscribe** link again
Then **Unsubscribe Confirmation Page** still shows *you've been unsubscribed*
  And no error or confusing message is displayed


---

## increment-9 (rollup)

<!-- migrated from: end-to-end/specification/specification-by-example.md -->

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
