---
state: crc
sprint_scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
stories:
  - Send Promotional Email
  - Send Personalized Recommendation
  - Send Restock Alert
  - Send In-Store Event Notification
---

# Module: [Marketing Engine]

Scope: Sprint 3 — consent-gated delivery of admin *Promotional Email*, system-generated *Personalized Recommendation*, inventory-triggered *Restock Alert*, and store-matched *In-Store Event Notification*. Preference management, list enrollment, and content publishing are out of scope for this artifact — those collaborators are boundary dependencies from Sprint 2 and Sprint 4.

**Core terms**:
- marketing communication
- promotional email
- personalized recommendation
- restock alert
- in-store event notification
- in-store event

**Key Abstractions (term grouping)**:
- **Marketing Communication**: marketing communication, promotional email, personalized recommendation, restock alert, in-store event notification, in-store event

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the consent-gated sending layer for promotional, personalized, and alert-based messages. This sprint owns how each message type is created or triggered, how recipients are targeted, and how *Communication Preferences* are enforced at delivery time — not at batch creation time.

### **Marketing Communication**
delivery target customer account      | Customer Account
marketing category gate               | Marketing Category, Communication Preferences
check communication preferences at delivery | Communication Preferences
                                      |   invariant: must never be sent without explicit opt-in for the relevant marketing category
                                      |   invariant: preference check must occur at delivery time, not batch creation time
route to verified customer email      | Customer Account
                                      |   invariant: guest checkout sessions cannot receive marketing communications
queue for retry on delivery failure   |
                                      |   invariant: delivery failure must queue for retry — message is not silently discarded
lifecycle: (stateless)
invariants:
  - must never be sent without explicit opt-in for the relevant marketing category
  - preference check must occur at delivery time

### **Promotional Email**
creating admin                        | (admin user)
promotional content                   | (sales, new products, seasonal offers)
target marketing category             | Marketing Category
send to marketing email list          | Marketing Email List, Communication Preferences, Customer Account
respect realtime opt-out at delivery  | Communication Preferences
include unsubscribe link              | Unsubscribe
                                      |   invariant: unsubscribe link must immediately opt customer out of promotions category on click
queue for retry on delivery failure   | Marketing Communication
                                      |   invariant: must not be delivered to customers who opted out between batch creation and delivery
lifecycle: (stateless)
invariants:
  - delivered only to marketing email list members with active promotions category opt-in

### **Personalized Recommendation**
target customer account               | Customer Account
personalization sources               | Purchase History, Browsing History, Pet Profile
target marketing category             | Marketing Category
recommended product set               | Product
generate from purchase history        | Purchase History, Product
generate from browsing patterns       | Browsing History, Product
generate from pet profile data        | Pet Profile, Product
exclude out-of-stock products         | Product, Stock Availability
send when recommendations opted in    | Communication Preferences, Customer Account
skip when no personalization data     | Customer Account, Purchase History, Browsing History, Pet Profile
                                      |   invariant: must be genuinely personalized — if no data exists to personalize against, do not send
                                      |   invariant: must never recommend an out-of-stock product
                                      |   invariant: generic suggestions are handled by promotional email, not this channel
lifecycle: (stateless)
invariants:
  - must not send when customer lacks purchase history and browsing data
  - must exclude out-of-stock products from recommendation set

### **Restock Alert**
triggering product                    | Product
stock transition signal             | Stock Availability
target wishlisted customers           | Wishlist, Customer Account
target marketing category             | Marketing Category
send when restock alerts opted in     | Communication Preferences, Customer Account
skip when product not wishlisted      | Wishlist
skip when restock category opted out  | Communication Preferences
best-effort availability signal       | Product, Product Details Page
                                      |   invariant: must not be sent to customers who have not opted in to restock alerts, even if the product is on their wishlist
                                      |   invariant: is a best-effort signal — product may go back out of stock before the customer acts
                                      |   invariant: must not send when no customer has the product on their wishlist
lifecycle: (stateless)
invariants:
  - sent only when stock availability transitions from out-of-stock to in-stock
  - requires product on customer wishlist and restock alerts category opt-in

### **In-Store Event**
event location store                  | Store
event type                            | (adoption day, grooming workshop, training session)
creating admin                        | (admin user)
scheduled event date                  |
discoverable on store detail page     | Store Details Page
                                      |   invariant: event remains visible on store detail page for walk-in discovery even when no notification is sent
lifecycle: (stateless)
invariants:
  - must be associated with exactly one store location

### **In-Store Event Notification**
source in-store event                 | In-Store Event
event location store                  | Store
target marketing category             | Marketing Category
match customer preferred store        | Store, Customer Account
send when events category opted in    | Communication Preferences, Customer Account
skip when no preferred store set      | Customer Account, Store
                                      |   invariant: must not be sent when no preferred store is set — system does not guess proximity
                                      |   invariant: must not send when event location differs from customer preferred store
                                      |   invariant: must not send without explicit opt-in for events marketing category
lifecycle: (stateless)
invariants:
  - sent only to customers whose preferred store matches event location

### references

**Ref — Email marketing and campaigns**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe. Personalised recommendations, restock alerts, in-store event notifications.
```

**Ref — Campaign and alert stories**
Source: docs/story/acceptance-criteria/increment-8-acceptance-criteria.md
Locator: Send Promotional Email, Send Personalized Recommendation, Send Restock Alert, Send In-Store Event Notification
Extract: acceptance criteria

```source
WHEN admin creates and sends a Promotional Email
THEN the email is delivered only to customers on the Marketing Email List who have opted in to the promotions Marketing Category

WHEN a customer on the list has opted out between batch creation and delivery
THEN the email is not delivered to that customer
AND the opt-out is respected because the system checks Communication Preferences at delivery time, not at batch creation time

WHEN the system generates a Personalized Recommendation for a customer
THEN the recommendation is based on purchase history, browsing patterns, or Pet Profile data
AND it is sent only if the customer has opted in to the recommendations Marketing Category

WHEN a Product's Stock Availability transitions from out-of-stock to in-stock
THEN the system sends a Restock Alert to each customer who has the Product on their Wishlist and has opted in to the restock alerts Marketing Category

WHEN admin creates an in-store event (adoption day, grooming workshop, training session)
THEN the system sends In-Store Event Notifications to customers whose preferred Store matches the event location and who have opted in to the events Marketing Category
```

### decisions made

- *Marketing communication* is the KA class listed first — send-time consent gate, verified-email routing, and retry-on-failure apply to all four message types in this sprint (every-behavior-has-backing-responsibility).
- *Promotional email*, *personalized recommendation*, *restock alert*, and *in-store event notification* are separate classes, not subtypes — each has distinct triggering logic, targeting criteria, and invariants per UL independence test.
- *In-store event* introduced as its own class — admin creation, store association, and walk-in discoverability are distinct from the notification send path (state-carrier for event metadata).
- *Purchase history* and *browsing history* introduced as boundary collaborators for personalization — owned by Customer Account and browsing modules; this sprint only consumes them for recommendation generation (scope-fit test).
- *Restock alert* targets via *wishlist* intersection with category opt-in — wishlist membership alone is insufficient (UL invariant).
- *In-store event notification* requires exact preferred-store match — no proximity guessing; event still discoverable on *store details page* when notification is suppressed (UL invariant).
- Preference enrollment (*communication preferences*, *marketing email list*, *marketing category*) is boundary from Sprint 2 — referenced as collaborators, not re-modeled (scope-fit test).

---

# Boundary Domain

### **Communication Preferences**
marketing category opt-in statuses    | Marketing Category
check at delivery time                | Marketing Communication, Promotional Email, Personalized Recommendation, Restock Alert, In-Store Event Notification
                                      |   invariant: changes persist immediately — send path must read current state at delivery
lifecycle: (stateless)
invariants:
  - enforced at delivery time, not batch creation time

### **Marketing Category**
category name                         | (promotions, recommendations, restock alerts, events)
unit of consent for send              | Marketing Communication
lifecycle: (stateless)
invariants: (none)

### **Marketing Email List**
member customer accounts              | Customer Account, Communication Preferences
eligibility for promotional email     | Promotional Email
lifecycle: (stateless)
invariants:
  - membership requires at least one active marketing category opt-in

### **Unsubscribe**
execute via promotional email link    | Promotional Email, Communication Preferences, Marketing Email List
opt out promotions category           | Marketing Category
show confirmation page                | (you have been unsubscribed)
                                      |   invariant: must take effect immediately
                                      |   invariant: must not suppress transactional notifications
lifecycle: (stateless)
invariants:
  - email-link path produces confirmation page

### **Customer Account**
verified email delivery target        | Marketing Communication
preferred store                       | Store, In-Store Event Notification
purchase history source               | Purchase History
lifecycle: (stateless)
invariants:
  - guest sessions cannot receive marketing communications

### **Wishlist**
wishlisted products per customer      | Product, Customer Account
restock alert targeting source        | Restock Alert
lifecycle: (stateless)
invariants: (none)

### **Product**
recommended in personalized set       | Personalized Recommendation
restock alert subject                 | Restock Alert, Stock Availability
lifecycle: (stateless)
invariants: (none)

### **Stock Availability**
inventory state on product            | Product
out-of-stock to in-stock transition   | Restock Alert
exclude out-of-stock from recommendations | Personalized Recommendation
lifecycle: (stateless)
invariants:
  - transition to in-stock triggers restock alert evaluation

### **Store**
event host location                   | In-Store Event, In-Store Event Notification
customer preferred store match        | Customer Account, In-Store Event Notification
lifecycle: (stateless)
invariants: (none)

### **Pet Profile**
species breed age data                | (pet attributes)
feed personalized recommendation      | Personalized Recommendation
lifecycle: (stateless)
invariants: (none)

### **Purchase History**
past orders for customer              | Customer Account, Order
personalization input                 | Personalized Recommendation
lifecycle: (stateless)
invariants: (none)

### **Browsing History**
viewed products for customer          | Customer Account, Product
personalization input                 | Personalized Recommendation
lifecycle: (stateless)
invariants: (none)

### **Product Details Page**
display current stock status          | Product, Stock Availability
                                      |   invariant: shows updated out-of-stock status when product goes back out of stock after restock alert
lifecycle: (stateless)
invariants: (none)

### **Store Details Page**
list discoverable in-store events     | In-Store Event, Store
lifecycle: (stateless)
invariants:
  - events visible for walk-in discovery regardless of notification eligibility

### references

**Ref — Marketing communication boundaries**
Source: docs/domain/marketing-engine-ubiquitous-language.md
Locator: Marketing Communication KA, boundary concepts
Extract: partial

```source
Marketing Communication depends on customer account for preference storage and delivery target, on product for restock triggers, on wishlist for restock targeting, and on store for event-location matching.

Wishlist (boundary) — provides the product list used to target restock alerts — only wishlisted products trigger the alert.

Store (boundary) — provides the preferred-store match used to target in-store event notifications.

Pet profile (boundary) — provides pet-related data (species, breed, age) that feeds personalized recommendation algorithms.

Stock availability (boundary) — is the inventory state of a product whose transition from out-of-stock to in-stock triggers a restock alert.
```

**Ref — Sprint 2 preference CRC**
Source: docs/domain/marketing-engine-preferences-crc.md
Locator: Marketing Communication, Communication Preferences, Marketing Email List
Extract: partial

```source
Communication preferences — per-customer opt-in record, immediate persist, category listing.

Marketing email list — membership derivation, affirmative opt-in invariant, timestamp recording.

Marketing communication — send-time gate responsibilities — must never be sent without opt-in; preference check at delivery time.
```

### decisions made

- *Communication preferences*, *marketing category*, and *marketing email list* are boundary from Sprint 2 — this sprint consumes them at send time without duplicating preference-management responsibilities (scope-fit test; aligned with preferences CRC).
- *Purchase history* and *browsing history* split as boundary inputs — personalization algorithm ownership stays outside Marketing Engine; recommendation class orchestrates reads (dependency-magnet split).
- *Unsubscribe* boundary carries email-link execution for *promotional email* — full preferences-page unsubscribe deferred to Sprint 4; send-time opt-out via link is in scope for *Send Promotional Email* AC.
- *Product details page* and *store details page* are presentation boundary — restock best-effort display and event walk-in discovery without owning inventory or event persistence (mirrors Sprint 1 *Product Details Page* pattern).

---
