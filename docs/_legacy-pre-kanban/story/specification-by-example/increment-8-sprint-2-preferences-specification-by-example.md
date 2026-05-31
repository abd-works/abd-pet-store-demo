---
state: specification-by-example
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
stories:
  - Set Notification Preferences
  - Set Communication Preferences
  - Opt In to Marketing Email List
---

# Specification by Example — Increment 8 Sprint 2: Notification and communication preferences

**Sources / context:** `docs/domain/marketing-engine-preferences-crc.md`, `docs/domain/marketing-engine-preferences-domain.json`, `docs/domain/marketing-engine-ubiquitous-language.md`, `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Sprint 2 preference stories only)

---

## Story: Set Notification Preferences

**Story type:** user

**Sources / context:** marketing-engine-preferences-crc.md (Notification Preferences, Transactional Notification, Account Settings), increment-8-acceptance-criteria.md (Set Notification Preferences AC 1–4)

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

**Sources / context:** marketing-engine-preferences-crc.md (Communication Preferences, Marketing Category, Marketing Communication, Unsubscribe), increment-8-acceptance-criteria.md (Set Communication Preferences AC 1–5)

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

**Sources / context:** marketing-engine-preferences-crc.md (Marketing Email List, Opt In, Communication Preferences), increment-8-acceptance-criteria.md (Opt In to Marketing Email List AC 1–4)

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
