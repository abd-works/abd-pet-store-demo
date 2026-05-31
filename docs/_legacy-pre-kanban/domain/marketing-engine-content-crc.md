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
Source: docs/story/acceptance-criteria/increment-8-acceptance-criteria.md
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
Source: docs/story/acceptance-criteria/increment-8-acceptance-criteria.md
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
Source: docs/domain/marketing-engine-ubiquitous-language.md
Locator: content author, Content KA decisions
Extract: partial

```source
Content author (boundary) — is the admin role that creates, edits, and publishes content — owned by the admin/operations module.

Blog index and guide index are property-level listings with no independent behavior beyond listing published items.
```

**Ref — Sprint 2 preference CRC**
Source: docs/domain/marketing-engine-preferences-crc.md
Locator: Communication Preferences, Unsubscribe partial scope
Extract: partial

```source
Unsubscribe included with delta responsibilities only for sprint stories — full email-link confirmation flow deferred to Sprint 4; preferences-toggle path and transactional-notification isolation are in scope for Set Communication Preferences.

Communication preferences — per-customer opt-in record, immediate persist, category listing.
```

**Ref — Sprint 3 campaigns CRC**
Source: docs/domain/marketing-engine-campaigns-crc.md
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
