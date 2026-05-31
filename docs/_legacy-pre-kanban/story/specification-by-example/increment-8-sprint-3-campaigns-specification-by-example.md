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

**Sources / context:** `docs/domain/marketing-engine-campaigns-crc.md`, `docs/domain/marketing-engine-campaigns-domain.json`, `docs/domain/marketing-engine-ubiquitous-language.md`, `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Sprint 3 campaign stories only)

---

## Story: Send Promotional Email

**Story type:** system

**Sources / context:** marketing-engine-campaigns-crc.md (Promotional Email, Marketing Email List, Communication Preferences, Unsubscribe), increment-8-acceptance-criteria.md (Send Promotional Email AC 1–4)

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

**Sources / context:** marketing-engine-campaigns-crc.md (Personalized Recommendation, Purchase History, Browsing History, Pet Profile, Stock Availability), increment-8-acceptance-criteria.md (Send Personalized Recommendation AC 1–4)

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

**Sources / context:** marketing-engine-campaigns-crc.md (Restock Alert, Wishlist, Stock Availability, Product Details Page), increment-8-acceptance-criteria.md (Send Restock Alert AC 1–4)

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

**Sources / context:** marketing-engine-campaigns-crc.md (In-Store Event, In-Store Event Notification, Store, Store Details Page), increment-8-acceptance-criteria.md (Send In-Store Event Notification AC 1–4)

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
