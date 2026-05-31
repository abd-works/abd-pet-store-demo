---
state: specification-by-example
sprint_scope: Increment 8 Sprint 4 — Content publishing and unsubscribe
stories:
  - Publish Blog Post
  - Publish Pet Care Guide
  - Unsubscribe from Marketing Emails
---

# Specification by Example — Increment 8 Sprint 4: Content publishing and unsubscribe

**Sources / context:** `docs/domain/marketing-engine-content-crc.md`, `docs/domain/marketing-engine-content-domain.json`, `docs/domain/marketing-engine-ubiquitous-language.md`, `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Publish Blog Post, Publish Pet Care Guide, Unsubscribe from Marketing Emails)

---

## Story: Publish Blog Post

**Story type:** store employee

**Sources / context:** marketing-engine-content-crc.md (Content, Blog Post, Blog Index, Content Author, Admin Content Area), increment-8-acceptance-criteria.md (Publish Blog Post AC 1–4)

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

**Sources / context:** marketing-engine-content-crc.md (Pet Care Guide, Guide Index, Pet Browsing Area, Product Browsing Area), increment-8-acceptance-criteria.md (Publish Pet Care Guide AC 1–4)

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

**Sources / context:** marketing-engine-content-crc.md (Unsubscribe, Unsubscribe Token, Marketing Communication, Communication Preferences, Marketing Category, Transactional Notification), increment-8-acceptance-criteria.md (Unsubscribe from Marketing Emails AC 1–4)

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
