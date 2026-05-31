# Crc


---

## marketing-engine-campaigns-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

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
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
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
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
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
Source: docs/end-to-end/specification/crc.md
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


---

## marketing-engine-content-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

---

state: crc

sprint_scope: Increment 8 Sprint 4 — Content publishing and unsubscribe

stories:

  - Publish Marketing Content

  - Unsubscribe from Marketing

---



# Module: [Marketing Engine]



Scope: Sprint 4 — *Content* authoring lifecycle (draft → published) for *Blog Post* and *Pet Care Guide*, public index and detail surfaces, species-tag cross-linking, and full *Unsubscribe* execution via signed email token and preferences toggle with idempotent confirmation. Campaign sending and preference enrollment are out of scope for this artifact — those collaborators are boundary dependencies from Sprint 2 and Sprint 3.



**Core terms**:

- content

- blog post

- pet care guide

- blog index

- guide index

- unsubscribe



**Key Abstractions (term grouping)**:

- **Content**: content, blog post, pet care guide, blog index, guide index

- **Marketing Communication**: unsubscribe, unsubscribe token



---



# Core Domain



## **Content**



*Content* is published material for on-site customer education, SEO, and marketing email fodder. This sprint owns the draft-to-published lifecycle, public read surfaces, and guide cross-linking behavior. Admin role permissions and campaign dispatch remain boundary concerns.



### **Content**

authored material for site and email | Blog Post, Pet Care Guide

lifecycle status                      | (draft or published)

publish date                          | (date when published)

title                                 | (article title)

summary                               | (index listing summary)

body                                  | (full article text)

transition draft to published         | Blog Post, Pet Care Guide

hide draft from customers               | Blog Index, Guide Index

                                      |   invariant: draft content must never be visible to customers

expose published via own URL          | Blog Post, Pet Care Guide

                                      |   invariant: published content must always be accessible via its own URL

lifecycle: (draft → published)

invariants:

  - draft content must never be visible to customers

  - published content must always be accessible via its own URL



### **Blog Post**

author attribution                    | Content Author

publish date on index                 | Blog Index, Content

save as draft                         | Content, Admin Content Area

publish to live                       | Content, Blog Index

reflect edits on live page            | Content

preserve publish date on edit         | Content

                                      |   invariant: edits to a published post must not change the publish date unless explicitly requested

display on blog index                 | Blog Index

                                      |   invariant: must display title, summary, date, and author on the blog index

display full article on detail URL    | Content

lifecycle: (draft → published)

invariants:

  - must display title, summary, date, and author on the blog index



### **Pet Care Guide**

pet type or species tags              | (dogs, cats, senior pets, specific breeds)

publish date on index                 | Guide Index, Content

save as draft                         | Content, Admin Content Area

publish to live                       | Content, Guide Index, Pet Browsing Area, Product Browsing Area

require tag before publish            | Guide Index

                                      |   invariant: must carry at least one pet type or species tag

cross-link from tagged browsing areas | Pet Browsing Area, Product Browsing Area

                                      |   invariant: must appear in relevant browsing areas matching its tags

display on guide index                | Guide Index

                                      |   invariant: must display title, summary, pet type or species tag, and date on the guide index

display full guide on detail URL      | Content

lifecycle: (draft → published)

invariants:

  - must carry at least one pet type or species tag



### **Blog Index**

published blog posts                  | Blog Post

list with title summary date author   | Blog Post

                                      |   invariant: only published blog posts appear — drafts are excluded

lifecycle: (stateless)

invariants:

  - lists published blog posts only



### **Guide Index**

published pet care guides             | Pet Care Guide

list with title summary tag date      | Pet Care Guide

                                      |   invariant: only published guides appear — drafts are excluded

lifecycle: (stateless)

invariants:

  - lists published pet care guides only



### references



**Ref — Content and blog**

Source: external-context/requirements-chat-with-product-owner.md

Locator: line 33

Extract: whole



```source

Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.

```



**Ref — Content stories**

Source: docs/end-to-end/exploration/stories/acceptance-criteria.md

Locator: Publish Blog Post, Publish Pet Care Guide

Extract: acceptance criteria



```source

WHEN Content Author creates and publishes a Blog Post

THEN the post appears on the Blog Index with title, summary, date, and author

AND the full post is accessible via its own URL



WHEN Content Author saves a Blog Post as draft

THEN the post is not visible to customers

AND the draft remains editable and publishable from the admin content area



WHEN Content Author creates and publishes a Pet Care Guide

THEN the guide appears on the Guide Index with title, summary, pet type/species tag, and date

AND the full guide is accessible via its own URL



WHEN Content Author attempts to publish a guide without any pet type or species tag

THEN the system requires at least one tag before publishing

BUT the draft is not lost — it can be saved and tagged later

```



### decisions made



- *Content* is the KA class listed first — shared draft/publish lifecycle and content-wide invariants live here; *Blog Post* and *Pet Care Guide* carry type-specific metadata and linking behavior (aligned with UL independence test — separate concepts, not subtypes).

- *Blog post* and *pet care guide* are separate classes — distinct index metadata, tag requirements, and cross-linking rules outweigh shared lifecycle (UL decision carried forward).

- *Blog index* and *guide index* introduced as collection classes — listing published items with exclusion of drafts is collection-level behavior beyond a single post or guide (collection-class rule).

- Publish-date preservation on edit modeled on *Blog Post* only — pet care guide AC does not specify date preservation; shared *Content* lifecycle handles draft visibility (every-behavior-has-backing-responsibility).

- *Content author* and *admin content area* are boundary — role permissions and staff UI owned by Store Operations; this sprint models publish lifecycle and public surfaces only (scope-fit test).



---



## **Marketing Communication**



*Marketing Communication* in this sprint covers the full *Unsubscribe* execution path deferred from Sprint 2 and Sprint 3 — signed email-link token, immediate category opt-out, idempotent confirmation, and transactional-notification isolation.



### **Marketing Communication**

carry unsubscribe link in message     | Unsubscribe, Unsubscribe Token

                                      |   invariant: every marketing communication must include a category-scoped unsubscribe link

lifecycle: (stateless)

invariants:

  - unsubscribe link must target the sending marketing category



### **Unsubscribe**

target marketing category             | Marketing Category

execute via email link                | Unsubscribe Token, Communication Preferences, Marketing Email List, Marketing Communication

execute via preferences toggle        | Communication Preferences, Marketing Email List

take effect immediately               | Communication Preferences, Marketing Email List

                                      |   invariant: must take effect immediately — no further marketing communications of that category after execution

                                      |   invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed

show confirmation after email link    | Unsubscribe Confirmation Page

                                      |   invariant: email-link path produces a you have been unsubscribed confirmation page

repeat email link idempotently        | Unsubscribe Token, Communication Preferences

                                      |   invariant: repeat clicks show the same confirmation without error — action is idempotent

lifecycle: (stateless)

invariants:

  - must not suppress transactional notifications



### **Unsubscribe Token**

signed payload account and category   | Customer Account, Marketing Category

verify on email link request          | Unsubscribe

encode account id and category        | Customer Account, Marketing Category

                                      |   invariant: token must be signed to prevent tampering with account or category

lifecycle: (stateless)

invariants:

  - token encodes exactly one marketing category per unsubscribe action



### references



**Ref — Easy unsubscribe**

Source: external-context/requirements-chat-with-product-owner.md

Locator: line 25

Extract: whole



```source

Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe.

```



**Ref — Unsubscribe story**

Source: docs/end-to-end/exploration/stories/acceptance-criteria.md

Locator: Unsubscribe from Marketing Emails

Extract: acceptance criteria



```source

WHEN the customer clicks the Unsubscribe link in any Marketing Communication

THEN the customer is immediately opted out of that Marketing Category

AND a "you've been unsubscribed" confirmation page is shown



WHEN the customer unsubscribes via the Communication Preferences page

THEN the change takes effect immediately

AND no further Marketing Communications of that Marketing Category are sent



WHEN the customer unsubscribes from all Marketing Categories

THEN Transactional Notifications (order confirmations, shipping updates, appointment reminders) are unaffected



WHEN the customer clicks an Unsubscribe link for a Marketing Category they have already unsubscribed from

THEN the confirmation page still shows "you've been unsubscribed" — the action is idempotent

BUT no error or confusing message is displayed

```



### decisions made



- *Unsubscribe token* introduced as state-carrier — signed email-link payload (account + category) is distinct from the opt-out act itself; verification and tamper protection belong on the token, not on *Unsubscribe* (introduce-state-carrier-class rule).

- Full *Unsubscribe* responsibilities consolidated here — Sprint 2 preferences CRC deferred email-link confirmation; Sprint 3 campaigns CRC carried promotional-link boundary only; Sprint 4 owns complete *Unsubscribe from Marketing* story (scope-fit test).

- Idempotent repeat execution modeled explicitly — AC requires graceful repeat clicks without error (every-behavior-has-backing-responsibility).

- *Marketing communication* retains send-time unsubscribe-link inclusion — links generated at dispatch collaborate with *Unsubscribe Token*; preference mutation remains on *Communication Preferences* boundary (explicit-chain-of-responsibility).



---



# Boundary Domain



### **Communication Preferences**

marketing category opt-in statuses    | Marketing Category

toggle category opt-in                  | Marketing Category, Marketing Email List, Unsubscribe

persist immediately on toggle           | Customer Account

                                      |   invariant: changes persist immediately — unsubscribe via preferences page uses same path as Sprint 2

lifecycle: (stateless)

invariants:

  - enforced at delivery time for marketing sends



### **Marketing Category**

category name                         | (promotions, recommendations, restock alerts, events)

unit of consent for unsubscribe       | Unsubscribe

lifecycle: (stateless)

invariants: (none)



### **Marketing Email List**

member customer accounts              | Customer Account, Communication Preferences

remove on category opt-out            | Communication Preferences, Unsubscribe

lifecycle: (stateless)

invariants:

  - membership requires at least one active marketing category opt-in



### **Customer Account**

verified email delivery target        | Marketing Communication

store communication preferences       | Communication Preferences

lifecycle: (stateless)

invariants: (none)



### **Transactional Notification**

delivery target                       | Customer Account

unaffected by marketing unsubscribe   | Unsubscribe, Notification Preferences

                                      |   invariant: order confirmations, shipping updates, and appointment reminders continue regardless of marketing opt-out

lifecycle: (stateless)

invariants:

  - marketing unsubscribe must not suppress transactional notifications



### **Notification Preferences**

transactional category settings       | Transactional Notification

                                      |   invariant: separate from communication preferences — marketing unsubscribe does not alter these settings

lifecycle: (stateless)

invariants: (none)



### **Content Author**

create edit publish content           | Content, Blog Post, Pet Care Guide, Admin Content Area

                                      |   invariant: only authenticated staff with content author role may publish

lifecycle: (stateless)

invariants: (none)



### **Admin Content Area**

present draft and publish actions     | Content Author, Blog Post, Pet Care Guide

retain editable draft                 | Content

                                      |   invariant: failed publish validation must not discard draft content

lifecycle: (stateless)

invariants: (none)



### **Unsubscribe Confirmation Page**

render unsubscribed message           | Unsubscribe

link to communication preferences     | Communication Preferences, Customer Account

lifecycle: (stateless)

invariants: (none)



### **Pet Browsing Area**

surface guides matching species tags  | Pet Care Guide, Guide Index

lifecycle: (stateless)

invariants: (none)



### **Product Browsing Area**

surface guides matching species tags  | Pet Care Guide, Guide Index

lifecycle: (stateless)

invariants: (none)



### references



**Ref — Content author boundary**

Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md

Locator: content author, Content KA decisions

Extract: partial



```source

Content author (boundary) — is the admin role that creates, edits, and publishes content — owned by the admin/operations module.



Blog index and guide index are property-level listings with no independent behavior beyond listing published items.

```



**Ref — Sprint 2 preference CRC**

Source: docs/end-to-end/specification/crc.md

Locator: Communication Preferences, Unsubscribe partial scope

Extract: partial



```source

Unsubscribe included with delta responsibilities only for sprint stories — full email-link confirmation flow deferred to Sprint 4; preferences-toggle path and transactional-notification isolation are in scope for Set Communication Preferences.



Communication preferences — per-customer opt-in record, immediate persist, category listing.

```



**Ref — Sprint 3 campaigns CRC**

Source: docs/end-to-end/specification/crc.md

Locator: Unsubscribe boundary

Extract: partial



```source

Unsubscribe boundary carries email-link execution for promotional email — full preferences-page unsubscribe deferred to Sprint 4; send-time opt-out via link is in scope for Send Promotional Email AC.

```



### decisions made



- *Communication preferences*, *marketing category*, and *marketing email list* are boundary from Sprint 2 — this sprint invokes them for unsubscribe execution without duplicating preference-management responsibilities (scope-fit test).

- *Transactional notification* and *notification preferences* are boundary from Notification module — unsubscribe isolation invariant enforced by collaboration, not by mutating transactional settings (aligned with preferences CRC).

- *Content author* and *admin content area* are boundary — Store Operations owns staff auth and editor UI; content lifecycle classes own publish rules (scope-fit test; mirrors UL).

- *Pet browsing area* and *product browsing area* are presentation boundary — tag-based cross-linking surfaces guides without owning guide persistence (mirrors Sprint 3 *Product Details Page* pattern).

- *Unsubscribe confirmation page* is presentation boundary — renders post-token confirmation without owning opt-out mutation (receiver-not-responsible-for-receiving).



---




---

## marketing-engine-preferences-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

---
state: crc
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
stories:
  - Set Notification Preferences
  - Set Communication Preferences
  - Opt In to Marketing Email List
---

# Module: [Marketing Engine]

Scope: Sprint 2 — transactional *Notification Preferences* management (boundary), marketing *Communication Preferences* and *Marketing Category* opt-in, affirmative *Marketing Email List* enrollment with timestamp, and account-settings presentation. Review submission, campaign sending, and content publishing are out of scope for this artifact.

**Core terms**:
- communication preferences
- marketing category
- marketing email list
- opt-in
- marketing communication

**Key Abstractions (term grouping)**:
- **Marketing Communication**: communication preferences, marketing category, marketing email list, opt-in, marketing communication, unsubscribe

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the consent-gated messaging layer. This sprint owns how customers record per-category marketing opt-in, how membership on the *Marketing Email List* is derived and timestamped, and how send-time checks respect preferences. Transactional *Notification Preferences* remain a boundary concern of the Notification module.

### **Marketing Communication**
marketing category                    | Marketing Category
delivery target customer account      | Customer Account
check communication preferences at send | Communication Preferences
                                      |   invariant: must never be sent without explicit opt-in for the relevant marketing category
                                      |   invariant: preference check must occur at delivery time, not batch creation time
route to verified customer email      | Customer Account
                                      |   invariant: guest checkout sessions cannot receive marketing communications
lifecycle: (stateless)
invariants:
  - must never be sent without explicit opt-in for the relevant marketing category
  - preference check must occur at delivery time

### **Communication Preferences**
owning customer account               | Customer Account
marketing category opt-in statuses    | Marketing Category
list categories with opt-in status    | Marketing Category
toggle category opt-in                | Marketing Category, Marketing Email List, Unsubscribe
persist immediately on toggle         | Customer Account
                                      |   invariant: changes persist immediately on toggle — no separate save action
                                      |   invariant: new marketing categories default to opt-out for every customer
                                      |   invariant: opting out of a category stops further marketing communications of that category after the toggle
offer promotional opt-in at registration | Marketing Email List, Marketing Category
offer promotional opt-in at checkout  | Marketing Email List, Marketing Category
                                      |   invariant: registration and checkout opt-in checkbox is unchecked by default
lifecycle: (stateless)
invariants:
  - new marketing categories default to opt-out
  - changes persist immediately on toggle

### **Marketing Category**
category name                         | (promotions, recommendations, restock alerts, events)
opt-in status per customer            | Communication Preferences
extensible category catalog           |
default new category to opt-out       | Communication Preferences
                                      |   invariant: new categories must default to opt-out — no broadcast without explicit opt-in for that category
lifecycle: (stateless)
invariants:
  - new categories default to opt-out

### **Marketing Email List**
member customer accounts              | Customer Account, Communication Preferences
add on affirmative category opt-in    | Communication Preferences, Customer Account
record opt-in timestamp               | Communication Preferences
remove on category opt-out            | Communication Preferences, Unsubscribe
derive membership from any opt-in     | Communication Preferences
                                      |   invariant: opt-in must always be affirmative — no customer is added without an explicit action
                                      |   invariant: membership requires at least one active marketing category opt-in
lifecycle: (stateless)
invariants:
  - opt-in must always be affirmative
  - checkbox at registration and checkout is unchecked by default

### **Opt In**
affirmative enrollment action         | Communication Preferences, Marketing Email List
recorded timestamp                    | Marketing Email List
target marketing category             | Marketing Category
lifecycle: (stateless)
invariants:
  - must be an explicit customer action — never implied or pre-checked

### **Unsubscribe**
target marketing category             | Marketing Category
execute via email link                | Marketing Communication, Communication Preferences, Marketing Email List
execute via preferences toggle        | Communication Preferences, Marketing Email List
take effect immediately               | Communication Preferences, Marketing Email List
                                      |   invariant: must take effect immediately — no further marketing communications of that category after execution
                                      |   invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed
show confirmation after email link    | (you have been unsubscribed)
lifecycle: (stateless)
invariants:
  - must not suppress transactional notifications

### references

**Ref — Email marketing and preferences**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Email marketing with explicit opt-in — people should be able to manage their notification and communication preferences. Easy unsubscribe.
```

**Ref — Preference stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Set Notification Preferences, Set Communication Preferences, Opt In to Marketing Email List
Extract: acceptance criteria

```source
WHEN the customer opens Communication Preferences from account settings
THEN all available Marketing Categories are listed (promotions, recommendations, restock alerts, events)
AND each shows the current opt-in/opt-out status

WHEN the customer toggles a Marketing Category
THEN the change persists immediately on toggle — no separate "save" action is required
AND no Marketing Communications of an opted-out category are sent after the toggle

WHEN the customer opts in to promotional emails via Communication Preferences
THEN the customer is added to the Marketing Email List
AND the opt-in is recorded with a timestamp

WHEN the customer opts in during account registration or checkout
THEN the opt-in checkbox is unchecked by default — opt-in must be affirmative
AND if checked, the customer is added to the Marketing Email List
```

### decisions made

- *Communication preferences* is the KA class listed first — per-customer opt-in record, immediate persist, and category listing are owned here, not on *Customer Account* (independence test from UL).
- *Marketing category* earns its own class — unit of consent, extensibility, and default opt-out invariant are distinct from the preference aggregate (independence test from UL).
- *Marketing email list* earns its own class — membership derivation, affirmative opt-in invariant, and timestamp recording are collection-level behavior beyond a single toggle (collection-class rule).
- *Opt in* introduced as a stateless collaboration concept — registration, checkout, and preferences-page paths share affirmative-action and timestamp semantics without a separate lifecycle subtype (scope-fit test).
- *Unsubscribe* included with delta responsibilities only for sprint stories — full email-link confirmation flow deferred to Sprint 4; preferences-toggle path and transactional-notification isolation are in scope for *Set Communication Preferences* and *Opt In* AC.
- *Marketing communication* carries send-time gate responsibilities — supports "no send without opt-in" AC even though campaign stories are a later sprint (every-behavior-has-backing-responsibility).
- *Notification preferences* is boundary — transactional category toggles and critical-notification rules are owned by the Notification module; this sprint models the account-settings collaboration surface only (scope-fit test; aligned with UL).

---

# Boundary Domain

### **Notification Preferences**
owning customer account               | Customer Account
order updates setting                 | (on or off)
shipping setting                      | (on or off)
appointments setting                  | (on or off)
returns setting                       | (on or off)
list categories with current setting  | Transactional Notification
toggle category setting               | Transactional Notification, Customer Account
persist immediately on toggle         | Customer Account
enforce at delivery time              | Transactional Notification
protect critical categories           | Transactional Notification
                                      |   invariant: order confirmation and refund completion cannot be disabled — critical transactional notifications remain sent
                                      |   invariant: disabling all optional categories still allows critical notifications with an explanatory note
lifecycle: (stateless)
invariants:
  - critical transactional notifications cannot be suppressed

### **Transactional Notification**
notification category                 | (order updates, shipping, appointments, returns)
delivery target                       | Customer Account
respect category preference at send   | Notification Preferences
                                      |   invariant: optional follow-up notifications may respect preference; mandatory confirmations always send
lifecycle: (stateless)
invariants: (none)

### **Customer Account**
store communication preferences       | Communication Preferences
store notification preferences        | Notification Preferences
verified email delivery target        | Marketing Communication
require login for preference pages    | Account Settings
                                      |   invariant: guest checkout sessions cannot manage communication or notification preferences on account
lifecycle: (stateless)
invariants:
  - guest sessions cannot manage account preferences

### **Account Settings**
present notification preferences      | Notification Preferences, Customer Account
present communication preferences     | Communication Preferences, Customer Account
prompt guest to log in or register    | Customer Account
                                      |   invariant: guest prompt must not navigate away from the current page
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Notification preferences boundary**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: notification preferences boundary, communication preferences
Extract: partial

```source
notification preferences (boundary) — governs transactional notification settings (order updates, shipping, appointments, returns) — separate from communication preferences which govern marketing opt-in.

communication preferences — is the per-customer record of which marketing categories have active opt-in status; stored on the customer account but enforced by the marketing communication system at delivery time.

customer account (boundary) — stores the customer's communication preferences and provides the verified email delivery target for marketing communications.
```

**Ref — Set Notification Preferences story**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Set Notification Preferences
Extract: acceptance criteria

```source
WHEN the customer opens Notification Preferences from account settings
THEN the available notification categories are listed (order updates, shipping, appointments, returns)
AND each category shows the current setting (on/off)

WHEN the customer toggles a notification category
THEN the preference is saved immediately
AND future Transactional Notifications of that type respect the updated preference

WHEN the customer disables all transactional notifications
THEN critical notifications (e.g. order confirmation, refund completion) are still sent — they are non-optional
```

### decisions made

- *Notification preferences* and *Transactional Notification* are boundary — owned by the Notification module; this sprint depends on them for transactional toggle behavior and critical-category rules (scope-fit test).
- Transactional categories modeled as order updates, shipping, appointments, returns — aligned with *Set Notification Preferences* AC; distinct from marketing *Marketing Category* names (slash-terms-resolved: no conflation of notification preferences with communication preferences).
- *Account settings* introduced as presentation boundary — hosts preference pages and guest-login prompt without owning preference persistence (mirrors *Product Details Page* pattern from Sprint 1 reviews CRC).
- Critical-notification protection modeled on *Notification Preferences* with *Transactional Notification* as collaborator — enforcement at send remains on the Notification module.

---


---

## marketing-engine-reviews-crc

<!-- migrated from: increments/8-marketing-engine/specification/crc.md -->

---
state: crc
sprint_scope: Increment 8 Sprint 1 — Customer reviews
stories:
  - Submit Written Review with Star Rating
  - Submit Photo Review
  - Read Customer Reviews
---

# Module: [Marketing Engine]

Scope: Sprint 1 — verified customer reviews with star ratings, optional written text and photos, aggregate social proof on the product details page, and read-side pagination and sorting. Marketing communications and content publishing are out of scope for this artifact.

**Core terms**:
- customer review
- star rating
- review photo
- aggregate star rating

**Key Abstractions (term grouping)**:
- **Customer Review**: customer review, star rating, review photo, aggregate star rating, product reviews

---

# Core Domain

## **Customer Review**

*Customer Review* is the social-proof mechanism that attaches verified customer opinions to products. Only customers who have purchased the product may author a review; each review carries a mandatory star rating, optional written text, and optional photos. Individual scores roll up into an aggregate displayed on the product details page.

### **Customer Review**
authoring customer account          | Customer Account
                                    |   invariant: must be authored by exactly one verified customer account that has purchased the product — guest checkout sessions cannot leave reviews
attached product                    | Product
                                    |   invariant: must attach to exactly one product
star rating                         | Star Rating
                                    |   invariant: must carry exactly one star rating; written text is optional
written text                        |
review photos                       | Review Photo
review date                         |
verify purchaser before submission  | Customer Account, Product
submit with star rating and text    | Customer Account, Product, Star Rating, Product Reviews, Aggregate Star Rating
attach review photos on submit      | Review Photo, Product Reviews
contribute star rating to aggregate | Product, Aggregate Star Rating
edit existing review                | Customer Account, Star Rating, Review Photo, Product Reviews, Aggregate Star Rating
remove review                       | Product Reviews, Aggregate Star Rating, Product
lifecycle: (stateless)
invariants:
  - must be authored by exactly one verified customer account that has purchased the product
  - must carry exactly one star rating between 1 and 5; written text is optional

### **Star Rating**
numeric score                       | (integer 1 through 5)
                                    |   invariant: must be an integer between 1 and 5 inclusive; no half-stars or zero stars
minimum required review input       | Customer Review
feeds aggregate computation         | Aggregate Star Rating, Product
lifecycle: (stateless)
invariants:
  - must be an integer between 1 and 5 inclusive

### **Review Photo**
image attachment on review          | Customer Review
display as inline thumbnail         | Product Details Page
expand to full size in lightbox     | Product Details Page
validate supported format and size  | Customer Review
                                    |   invariant: must be a supported image format and within configured size limits
                                    |   invariant: upload failure must not discard the parent review's written text or star rating
lifecycle: (stateless)
invariants:
  - upload failure must not discard the parent review's written text or star rating

### **Aggregate Star Rating**
derived average of star ratings     | Star Rating, Customer Review
displayed on product details page   | Product Details Page, Product
recompute on review create          | Customer Review, Product
recompute on review edit            | Customer Review, Product
recompute on review delete          | Customer Review, Product
suppress display when no reviews    | Product Details Page, Product Reviews
                                    |   invariant: must not be displayed as zero when no reviews exist — show nothing or a prompt instead
lifecycle: (stateless)
invariants:
  - must not be displayed as zero when no reviews exist

### **Product Reviews**
accumulated reviews for product     | Customer Review, Product
default sort by newest first        | Customer Review
sort by oldest                      | Customer Review
sort by highest rating              | Customer Review, Star Rating
sort by lowest rating               | Customer Review, Star Rating
paginate or lazy-load listing       | Customer Review, Product Details Page
lifecycle: (stateless)
invariants:
  - default listing order is newest first

### references

**Ref — Customer reviews and ratings**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: whole

```source
We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing. Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.
Other customers should be able to see them and they should factor into some kind of aggregate star rating on the product.
```

**Ref — Review stories**
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md
Locator: Submit Written Review with Star Rating, Submit Photo Review, Read Customer Reviews
Extract: acceptance criteria

```source
WHEN a logged-in customer opens the review form on a Product Details Page
THEN the form collects a Star Rating (1–5) and an optional written review (free text)
AND the customer must have purchased the Product to access the form

WHEN the customer submits a valid Customer Review
THEN the review is associated with the Product and the customer's Customer Account
AND the review appears on the Product Details Page sorted by newest first
AND the Product's Aggregate Star Rating is recomputed to include the new Star Rating

WHEN there are many Customer Reviews
THEN the reviews are paginated or lazy-loaded
AND sort controls are provided: newest, oldest, highest rating, lowest rating
```

### decisions made

- *Customer Review* is the KA class listed first — social-proof authorship, submission, and lifecycle events are owned here, not on *Product*.
- *Aggregate star rating* earns its own class — independent computation behavior, recompute triggers, and a no-reviews display invariant (independence test from UL).
- *Review photo* earns its own class — upload validation and graceful failure isolation are distinct from written text submission (independence test from UL).
- *Product Reviews* introduced as a collection class — pagination, default sort, and sort controls are collection-level behavior beyond holding reviews (collection-class rule).
- Photo review is not a subtype of *customer review* — photos are optional attachments with no distinct moderation or lifecycle (scope-fit test; aligned with UL decisions).
- Review submission gating modeled on *Customer Review* with *Customer Account* and *Product* as collaborators — the receiver is not responsible for being verified (receiver-not-responsible rule).
- *Product details page* is boundary — presentation and form visibility live on the Product Catalog surface; core review rules stay in this module.

---

# Boundary Domain

### **Product**
attached customer reviews           | Customer Review, Product Reviews
aggregate star rating               | Aggregate Star Rating
recompute aggregate on review change | Customer Review, Aggregate Star Rating
host product details page           | Product Details Page
lifecycle: (stateless)
invariants: (none)

### **Customer Account**
verify product purchase history     | Product
author customer reviews             | Customer Review
                                    |   invariant: only verified purchasers may create a customer review
lifecycle: (stateless)
invariants:
  - guest checkout sessions cannot leave reviews

### **Product Details Page**
display aggregate star rating       | Aggregate Star Rating, Product
list customer reviews               | Product Reviews
display review photo thumbnails     | Review Photo
open photo lightbox at full size    | Review Photo
show be the first to review prompt  | Product, Product Reviews
present review submission form      | Customer Review, Customer Account
hide form for non-purchasers        | Customer Account, Product
prompt guest to log in or register  | Customer Account
                                    |   invariant: guest prompt must not navigate away from the product details page
lifecycle: (stateless)
invariants: (none)

### references

**Ref — Product catalog boundary**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: product, product details page boundary concepts
Extract: partial

```source
product (boundary) — is the entity a customer review attaches to and whose aggregate star rating is derived from accumulated reviews; owns the product details page where reviews are displayed.

customer account (boundary) — is the authoring identity that gates review submission — only verified purchasers of the product may create a customer review.

product details page (boundary) — is the presentation surface where customer reviews and the aggregate star rating are displayed for a product.
```

### decisions made

- *Product*, *Customer Account*, and *Product Details Page* are boundary — owned by Product Catalog and Customer Account modules; this sprint depends on them for attachment, authorship verification, and read-side presentation (scope-fit test).
- Form visibility and guest-login prompt modeled on *Product Details Page* as presentation responsibilities — purchase verification remains on *Customer Account* with *Product*.

---
