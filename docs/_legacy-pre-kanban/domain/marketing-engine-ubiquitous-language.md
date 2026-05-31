---
state: ubiquitous-language
---

# Module: [Marketing Engine]

_Concept sketch for the customer engagement layer — reviews that build social proof, marketing communications gated by explicit consent, and published content that feeds email campaigns and on-site discovery._

Scope: How customers contribute reviews, how the system sends marketing communications with proper opt-in enforcement, how customers manage their communication preferences, and how content authors publish blog posts and pet care guides. Increment 8 of PawPlace.

**Terms**:
- **Customer Review**
  - **customer review** — a star-rated, optionally-written evaluation of a product authored by a verified customer account
  - **star rating** — the one-to-five numeric score a customer assigns when reviewing a product
  - **review photo** — an optional image attached to a customer review showing the product in use
  - **aggregate star rating** — the computed average of all star ratings on a product, displayed as social proof
- **Marketing Communication**
  - **marketing communication** — any message sent to a customer that is gated by explicit opt-in to a marketing category
  - **marketing email list** — the set of customers who have opted in to receive promotional emails
  - **communication preferences** — the per-customer record of which marketing categories they have opted in to or out of
  - **promotional email** — a marketing communication sent to the marketing email list advertising sales, new products, or seasonal offers
  - **personalized recommendation** — a marketing communication tailored to a customer's purchase history, browsing patterns, or pet data
  - **restock alert** — a marketing communication triggered when a wishlisted product transitions from out-of-stock to in-stock
  - **in-store event notification** — a marketing communication informing opted-in customers about events at their preferred store
  - **unsubscribe** — the act of opting out of a marketing category, effective immediately on execution
  - **marketing category** — a named grouping of marketing communications (promotions, recommendations, restock alerts, events) that a customer can independently opt in to or out of
- **Content**
  - **content** — authored material published to the site for customer education and marketing fodder (boundary — Content Management module)
  - **blog post** — a published article appearing on the blog index with title, summary, date, and author
  - **pet care guide** — a published educational article tagged by pet type or species, cross-linked with product and pet browsing areas

---

_A *customer review* is authored by a *customer account* that has purchased the *product*, attaches a *star rating* and optional *review photo*, and contributes to the *product's* *aggregate star rating*. *Marketing communications* — *promotional emails*, *personalized recommendations*, *restock alerts*, and *in-store event notifications* — are sent only to customers on the *marketing email list* whose *communication preferences* include an active opt-in for the relevant *marketing category*. Customers manage their *communication preferences* and can *unsubscribe* at any time; unsubscribe takes effect immediately and no further messages of that category are delivered. *Content* — *blog posts* and *pet care guides* — is authored and published by a *content author*, providing material for on-site discovery and marketing email campaigns._

---

# Core Domain

## Customer Review

*Customer Review* is the social-proof mechanism that attaches verified customer opinions to products. It enforces that only customers who have purchased a product may review it, aggregates individual scores into a visible *aggregate star rating*, and optionally carries photographic evidence of the product in use. *Customer Review* depends on *customer account* for authorship verification and on *product* for attachment.

### customer review

- is authored by exactly one *customer account* that has purchased the *product* being reviewed, producing a verified evaluation attached to that *product*
- carries exactly one *star rating* and optionally a written text body describing the customer's experience
- may include one or more *review photos* showing the product in use
- contributes its *star rating* to the *product's* *aggregate star rating* — the aggregate is recomputed whenever a *customer review* is created, edited, or deleted
- appears on the *product details page* sorted by newest first, with sort controls for oldest, highest rating, and lowest rating
- **Invariant:** must be authored by exactly one verified *customer account* that has purchased the *product* — guest checkout sessions cannot leave reviews
- **Invariant:** must carry exactly one *star rating* (1–5); written text is optional but star rating is mandatory

### star rating

- is a numeric value between 1 and 5 inclusive assigned by the authoring *customer account* at review submission time
- is the minimum required input for a *customer review* — a review with a *star rating* but no written text is valid
- feeds the *aggregate star rating* computation on the parent *product*
- **Invariant:** must be an integer between 1 and 5 inclusive; no half-stars or zero stars

### review photo

- is an optional image attachment on a *customer review* showing the *product* in real-world use
- is displayed as a thumbnail inline with the review text, expandable to full-size via lightbox
- must pass upload validation — supported image format and within size limits — before attaching to the *customer review*
- **Invariant:** must be a supported image format and within configured size limits; upload failure must not discard the parent review's text or *star rating*

### aggregate star rating

- is a derived value computed from all *star ratings* across all *customer reviews* on a *product*
- is displayed prominently on the *product details page* as a summary of social proof
- is not shown when a *product* has zero *customer reviews* — absence is communicated via a "be the first to review" prompt
- is recomputed whenever a *customer review* is created, edited, or deleted
- **Invariant:** must not be displayed as zero when no reviews exist — show nothing or a prompt instead

### product *(boundary)*

- is the entity a *customer review* attaches to and whose *aggregate star rating* is derived from accumulated reviews
- owns the *product details page* where reviews are displayed

### customer account *(boundary)*

- is the authoring identity that gates review submission — only verified purchasers of the *product* may create a *customer review*

### product details page *(boundary)*

- is the presentation surface where *customer reviews* and the *aggregate star rating* are displayed for a *product*

Owned by: Product Catalog

#### Decisions made

- *Customer Review* is its own KA for this increment scope because it has independent behavior (authorship verification, photo upload, aggregation) and its own invariants — it is not merely a property of *product* (independence test).
- *Star rating* earns its own heading because it has an invariant (integer 1–5) and independent behavior (feeds aggregation, is the minimum viable review input).
- *Review photo* earns its own heading because it has its own validation behavior and invariant (format/size limits, graceful failure isolation).
- *Aggregate star rating* earns its own heading because it has independent computation behavior (recompute trigger), a display invariant (never show zero), and a no-reviews edge case.
- *Product* is boundary — owned by the Product Catalog module; this scope depends on it for review attachment.
- *Customer account* is boundary — owned by the Customer Account module; this scope depends on it for authorship verification.
- *Product details page* is boundary — owned by the Product Catalog module; this scope depends on it as the presentation surface where reviews and aggregate ratings are displayed.
- Photo review is not a subtype of *customer review* — the source shows no distinct moderation, display, or lifecycle behavior for photo reviews vs text-only reviews; the photo is an optional attribute (scope-fit test).

#### References

**Ref — Customer reviews and ratings**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 23
Extract: whole

**Ref — Review stories**
Source: docs/end-to-end/discovery/story-graph.json
Locator: Submit Written Review with Star Rating, Submit Photo Review, Read Customer Reviews
Extract: acceptance criteria

---

## Marketing Communication

*Marketing Communication* is the consent-gated messaging layer that delivers promotional, personalized, and alert-based communications to customers who have explicitly opted in. It owns the *marketing email list*, enforces *communication preferences* at send time, and supports immediate *unsubscribe*. *Marketing Communication* depends on *customer account* for preference storage and delivery target, on *product* for restock triggers, on *wishlist* for restock targeting, and on *store* for event-location matching.

### marketing communication

- is any message sent to a customer that is classified under a *marketing category* and gated by explicit opt-in in the customer's *communication preferences*
- checks *communication preferences* at send time — not at batch creation time — ensuring real-time respect of opt-out decisions
- is never sent to customers who have not opted in to the relevant *marketing category* — zero exceptions
- routes to the *customer account's* verified email address — guest checkout sessions cannot receive marketing communications
- **Invariant:** must never be sent without explicit opt-in for the relevant *marketing category*; preference check must occur at delivery time, not batch time

### marketing email list

- is the set of *customer accounts* that have opted in to at least one *marketing category* in their *communication preferences*
- is populated when a customer opts in via *communication preferences* or during account registration/checkout (opt-in checkbox must be unchecked by default)
- is depopulated immediately when a customer executes *unsubscribe* for the relevant *marketing category*
- **Invariant:** opt-in must always be affirmative — the checkbox is unchecked by default; no customer is added without an explicit action

### communication preferences

- is the per-customer record of which *marketing categories* have active opt-in status
- is stored on the *customer account* but enforced by the *marketing communication* system at delivery time
- lists all available *marketing categories* with current opt-in/opt-out status when the customer opens the preferences page
- persists changes immediately on toggle — no "save" delay
- defaults to opt-out for any newly added *marketing category* — customers must explicitly opt in
- **Invariant:** new *marketing categories* must default to opt-out; no broadcast without explicit opt-in for that category

### promotional email

- is a *marketing communication* created by an admin and sent to all customers on the *marketing email list* who have opted in to the promotions *marketing category*
- respects real-time opt-out — a customer who opts out after the batch is queued but before delivery is not sent the email
- includes an *unsubscribe* link that immediately opts the customer out of the promotions category on click

### personalized recommendation

- is a *marketing communication* tailored to a specific customer's purchase history, browsing patterns, or *pet profile* data
- is sent only to customers who have opted in to the recommendations *marketing category*
- is not sent when the customer has no purchase history or browsing data — generic suggestions are handled by *promotional email*, not *personalized recommendation*
- excludes *products* that are currently out of stock from the recommendation set
- **Invariant:** must be genuinely personalized — if no data exists to personalize against, do not send; must never recommend an out-of-stock *product*

### restock alert

- is a *marketing communication* triggered when a *product's* *stock availability* transitions from out-of-stock to in-stock
- is sent only to customers who have the *product* on their *wishlist* and have opted in to the restock alerts *marketing category*
- is a best-effort signal — the *product* may go back out of stock before the customer acts
- **Invariant:** must not be sent to customers who have not opted in to restock alerts, even if the *product* is on their *wishlist*

### in-store event notification

- is a *marketing communication* informing opted-in customers about events (adoption days, grooming workshops, training sessions) at a specific *store*
- is sent only to customers whose preferred *store* matches the event location and who have opted in to the events *marketing category*
- is not sent when the customer has not set a preferred *store* — the system does not guess proximity
- **Invariant:** must not be sent when no preferred *store* is set; event is still discoverable on the *store's* detail page for walk-in discovery

### unsubscribe

- is the act of opting out of a *marketing category*, executed either by clicking the unsubscribe link in a *marketing communication* or by toggling off in *communication preferences*
- takes effect immediately — no further *marketing communications* of that category are sent after execution
- produces a confirmation page when executed via email link ("you've been unsubscribed")
- does not affect transactional notifications (order confirmations, shipping updates, appointment reminders)
- **Invariant:** must take effect immediately; must not suppress transactional notifications regardless of how many marketing categories are unsubscribed

### marketing category

- is a named grouping that organizes *marketing communications* into independently-controllable opt-in channels: promotions, recommendations, restock alerts, events
- is the unit of consent — customers opt in or out per *marketing category*, not per individual message
- is extensible — new categories can be added in future increments, always defaulting to opt-out

### notification preferences *(boundary)*

- governs transactional notification settings (order updates, shipping, appointments, returns) — separate from *communication preferences* which govern marketing opt-in

### customer account *(boundary)*

- stores the customer's *communication preferences* and provides the verified email delivery target for *marketing communications*

### wishlist *(boundary)*

- provides the product list used to target *restock alerts* — only wishlisted products trigger the alert

### store *(boundary)*

- provides the preferred-store match used to target *in-store event notifications*

### pet profile *(boundary)*

- provides pet-related data (species, breed, age) that feeds *personalized recommendation* algorithms

### stock availability *(boundary)*

- is the inventory state of a *product* whose transition from out-of-stock to in-stock triggers a *restock alert*

Owned by: Product Catalog

#### Decisions made

- *Marketing Communication* is its own KA for this increment because the consent-gated sending mechanism, preference enforcement, and unsubscribe lifecycle are its own domain — distinct from transactional Notification (independence test).
- *Communication preferences* earns its own heading because it has invariants (default opt-out, immediate persist) and cross-concept enforcement behavior.
- *Unsubscribe* earns its own heading because it has distinct lifecycle behavior (immediate effect, two execution paths, confirmation page) and an invariant (no transactional suppression).
- *Marketing category* earns its own heading because it is the unit of consent and has extensibility behavior (new categories default opt-out).
- *Promotional email*, *personalized recommendation*, *restock alert*, and *in-store event notification* are modeled as concepts rather than subtypes because each has distinct triggering logic, targeting criteria, and invariants — they share the consent gate but diverge on everything else (independence test).
- *Notification preferences* is boundary — it governs transactional notifications and belongs to the existing Notification module; *communication preferences* (marketing opt-in) is this scope's concern (scope-fit test).
- *Wishlist*, *store*, *pet profile*, *stock availability*, and *customer account* are boundary — they are owned by other modules and this scope depends on them for targeting and delivery.

#### References

**Ref — Email marketing and preferences**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

**Ref — Marketing notification stories**
Source: docs/end-to-end/discovery/story-graph.json
Locator: Opt In to Marketing Email List, Send Promotional Email, Send Personalized Recommendation, Send Restock Alert, Send In-Store Event Notification, Unsubscribe from Marketing Emails, Set Communication Preferences
Extract: acceptance criteria

---

## Content

*Content* is the published material that feeds both on-site customer education and marketing email campaigns. *Content authors* create, draft, and publish *blog posts* and *pet care guides* that surface on index pages and cross-link with product and pet browsing areas. Content provides the substance that *marketing communications* can reference and link to.

### content

- is authored material published to the site for customer education, SEO, and marketing email fodder
- exists in two published forms: *blog post* and *pet care guide*
- transitions through a lifecycle: draft (invisible to customers, editable) → published (visible, URL-accessible)
- is authored by a *content author* through the admin content area
- **Invariant:** draft content must never be visible to customers; published content must always be accessible via its own URL

### blog post

- is a published article appearing on the *blog index* with title, summary, date, and author
- is accessible via its own URL once published
- can be saved as draft (not visible to customers) and later published
- reflects edits immediately on the live page without changing the publish date unless the *content author* explicitly updates it
- **Invariant:** must display title, summary, date, and author on the *blog index*; edits to a published post must not change the publish date unless explicitly requested

### pet care guide

- is a published educational article tagged by pet type or species (e.g. dogs, cats, senior pets, specific breeds)
- appears on the *guide index* with title, summary, pet type/species tag, and date
- is cross-linked with relevant pet and product browsing areas based on its species/type tags
- can be saved as draft (not visible to customers) and later published
- **Invariant:** must carry at least one pet type or species tag; must appear in relevant browsing areas matching its tags

### blog index

- is the navigable listing of all published *blog posts*, providing browsable access to content
- is a property of the content publishing surface — it has no independent behavior beyond listing

### guide index

- is the navigable listing of all published *pet care guides*, providing browsable access to educational content
- is a property of the content publishing surface — it has no independent behavior beyond listing

### content author *(boundary)*

- is the admin role that creates, edits, and publishes *content* — owned by the admin/operations module

#### Decisions made

- *Content* is its own KA for this increment because it has independent lifecycle (draft → published), its own authoring flow, and its own invariants — distinct from both Product Catalog and Marketing Communication (independence test).
- *Blog post* and *pet care guide* are separate concepts rather than subtypes because they have distinct metadata (pet type tags vs author attribution), distinct index pages, and distinct cross-linking behavior — they share the draft/publish lifecycle but diverge on categorization and linking.
- *Blog index* and *guide index* are mentioned as property-level listings with no independent behavior — they do not earn invariant-bearing headings, but are included for term resolution since bullets reference them.
- *Content author* is boundary — the role and its permissions are owned by the admin/operations module; this scope depends on it for content creation.
- The domain sketch places "content" as a boundary concept owned by a future Content Management module. For Increment 8, we model the published surface that PawPlace exposes — the authoring workflow is shallow (create/draft/publish) and the cross-linking behavior with pet browsing areas is specific to this scope.

#### References

**Ref — Content and blog**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 33
Extract: whole

**Ref — Content stories**
Source: docs/end-to-end/discovery/story-graph.json
Locator: Publish Blog Post, Publish Pet Care Guide
Extract: acceptance criteria

---

# Boundary Domain

## product

Owned by: Product Catalog

- is the entity that *customer reviews* attach to and whose *aggregate star rating* is derived from accumulated *star ratings*
- provides stock-availability transitions that trigger *restock alerts*

#### Decisions made

- *Product* is owned by Product Catalog — this scope depends on it for review attachment and restock triggering (scope-fit test).

#### References

**Ref — Product catalog**
Source: docs/domain/domain-sketch.md
Locator: Product Catalog KA
Extract: partial

---

## customer account

Owned by: Customer Account

- is the authoring identity that verifies purchase history before permitting *customer review* submission
- stores *communication preferences* and provides the verified email target for *marketing communications*

#### Decisions made

- *Customer account* is owned by Customer Account module — this scope depends on it for authorship verification, preference storage, and delivery routing (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/domain/domain-sketch.md
Locator: Customer Account KA
Extract: partial

---

## wishlist

Owned by: Customer Account

- provides the product list that determines which customers receive *restock alerts* when a *product* transitions to in-stock

#### Decisions made

- *Wishlist* is owned by Customer Account — this scope depends on it only for restock-alert targeting (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/domain/domain-sketch.md
Locator: Customer Account KA, wishlist concept
Extract: partial

---

## store

Owned by: Store

- provides the preferred-store value used to match customers to *in-store event notifications*
- hosts events (adoption days, workshops) whose announcements are delivered as *in-store event notifications*

#### Decisions made

- *Store* is owned by the Store module — this scope depends on it only for event-location matching (scope-fit test).

#### References

**Ref — Store**
Source: docs/domain/domain-sketch.md
Locator: Store KA
Extract: partial

---

## pet profile

Owned by: Customer Account

- provides species, breed, and age data that feeds *personalized recommendation* algorithms

#### Decisions made

- *Pet profile* is owned by Customer Account — this scope depends on it only for recommendation personalization data (scope-fit test).

#### References

**Ref — Customer Account**
Source: docs/domain/domain-sketch.md
Locator: Customer Account KA, pet profile concept
Extract: partial

---

## notification preferences

Owned by: Notification

- governs transactional notification channel settings (order updates, shipping, appointments, returns) — distinct from *communication preferences* which govern marketing opt-in

#### Decisions made

- *Notification preferences* is owned by the Notification module — this scope's *communication preferences* governs marketing opt-in only; transactional notification settings remain with the existing Notification module (scope-fit test).

#### References

**Ref — Notification**
Source: docs/domain/domain-sketch.md
Locator: Notification KA, notification preferences concept
Extract: partial

---

## content author

Owned by: Store Operations

- is the admin role that creates, edits, and publishes *content* through the admin content area

#### Decisions made

- *Content author* is owned by the Store Operations / admin module — this scope depends on the role for content creation but does not own permissions or admin workflow (scope-fit test).

#### References

**Ref — Admin dashboard**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

---
