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
Source: docs/story/acceptance-criteria/increment-8-acceptance-criteria.md
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
Source: docs/domain/marketing-engine-ubiquitous-language.md
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
