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

**Sources / context:** `docs/domain/power-ups-pet-inventory-crc.md`, `docs/domain/power-ups-pet-inventory-domain.json`, `docs/domain/power-ups-ubiquitous-language.md`, `docs/story/acceptance-criteria/increment-9-acceptance-criteria.md` (Sprint 3 pet and inventory stories)

---

## Story: Create Customer Pet

**Story type:** user

**Sources / context:** power-ups-pet-inventory-crc.md (Customer Pet Profile, Customer Pet Profiles), increment-9-acceptance-criteria.md (Create Customer Pet AC 1–5)

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

**Sources / context:** power-ups-pet-inventory-crc.md (Customer Pet Profile update/delete), increment-9-acceptance-criteria.md (Update Customer Pet — CRC refs)

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

**Sources / context:** power-ups-pet-inventory-crc.md (Inventory Dashboard, Stock Level, Inventory Export), increment-9-acceptance-criteria.md (View Inventory Dashboard AC 1–6)

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

**Sources / context:** power-ups-pet-inventory-crc.md (Low Stock Alert, Low Stock Threshold), increment-9-acceptance-criteria.md (Display Low Stock Badge AC 1–5)

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

**Sources / context:** power-ups-pet-inventory-crc.md (Backorder Purchase, Stock Availability), increment-9-acceptance-criteria.md (Allow Backorder Purchase AC 1–5)

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
