---
state: specification-by-example
sprint_scope: Increment 9 Sprint 2 — Store preference and tailoring
stories:
  - Filter Stores by Availability and Specialization
  - Set My Store Preference
  - Tailor Experience to Preferred Store
---

# Specification by Example — Increment 9 Sprint 2: Store preference and tailoring

**Sources / context:** `docs/domain/power-ups-stores-crc.md`, `docs/domain/power-ups-stores-domain.json`, `docs/domain/power-ups-ubiquitous-language.md`, `docs/story/acceptance-criteria/increment-9-acceptance-criteria.md` (Filter Stores, Set My Store Preference, Tailor Experience to Preferred Store)

---

## Story: Filter Stores by Availability and Specialization

**Story type:** user

**Sources / context:** power-ups-stores-crc.md (Store Specialization Filter, Product Availability Filter), increment-9-acceptance-criteria.md (Filter Stores AC 1–5)

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

**Sources / context:** power-ups-stores-crc.md (My Store, Customer Account, Account Settings), increment-9-acceptance-criteria.md (Set My Store Preference AC 1–4)

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

**Sources / context:** power-ups-stores-crc.md (Tailored Experience, Stock Availability, Click-and-Collect), increment-9-acceptance-criteria.md (Tailor Experience AC 1–4)

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
