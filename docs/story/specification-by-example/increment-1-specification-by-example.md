# Specification by Example — Increment 1: Walk-in driver — find the store, see what's in stock  

**Refresh:** Run 2 slot 27 — aligned to `docs/domain/ubiquitous-language.md`, `docs/domain/crc.md`, and `increment-1-acceptance-criteria.md` (canonical *store locator*, *map view*, *stock level*, *admin dashboard*).

---  

## Story: `View Store Map`  

**Story type:** user  

**Sources / context:** ubiquitous-language.md, crc.md, increment-1-acceptance-criteria.md  

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

**Sources / context:** ubiquitous-language.md, crc.md, increment-1-acceptance-criteria.md  

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

**Sources / context:** ubiquitous-language.md, crc.md, increment-1-acceptance-criteria.md  

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

**Sources / context:** ubiquitous-language.md, crc.md, increment-1-acceptance-criteria.md  

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

**Sources / context:** ubiquitous-language.md, crc.md, increment-1-acceptance-criteria.md  

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

**Sources / context:** ubiquitous-language.md, crc.md, increment-1-acceptance-criteria.md  

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
