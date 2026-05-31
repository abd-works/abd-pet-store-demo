---
state: domain-model
sprint_scope: Increment 8 Sprint 1 — Customer reviews
---

# Module: [Marketing Engine]

Scope: Sprint 1 — verified customer reviews with star ratings, optional written text and photos, aggregate social proof on the product details page, and read-side pagination and sorting.

---

# Core Domain

## **Customer Review**

*Customer Review* is the social-proof mechanism that attaches verified customer opinions to products. The typed model separates authorship and lifecycle (*CustomerReview*), mandatory score (*StarRating*), optional attachments (*ReviewPhoto*), derived rollup (*AggregateStarRating*), and collection read behavior (*ProductReviews*).

### **CustomerReview** << Entity >>

Initialisation: factory method `CustomerReview.create(input)` — private constructor; identity assigned at creation.
------
+ reviewId: String
	Invariant: must be unique across all customer reviews
+ authorId: String
	Invariant: must be authored by exactly one verified customer account that has purchased the product — guest checkout sessions cannot leave reviews
+ productSku: String
	Invariant: must attach to exactly one product
+ starRating: StarRating
	Invariant: must carry exactly one star rating; written text is optional
+ body: String | null
+ << composition >> photos: List<ReviewPhoto>
+ createdAt: DateTime
----
+ attachPhoto(photo: ReviewPhoto): CustomerReview
	Invariant: upload failure on a subsequent photo must not discard the parent review's written text or star rating
	Interaction:
		updatedPhotos: List<ReviewPhoto> = this.photos + photo
		return CustomerReview with photos = updatedPhotos

### **StarRating** << ValueObject >>

Initialisation: factory method `StarRating.of(value)` — validates bounds at creation.
------
+ value: Integer
	Invariant: must be an integer between 1 and 5 inclusive; no half-stars or zero stars

### **ReviewPhoto** << ValueObject >>

Initialisation: factory method `ReviewPhoto.create(input)` — validates format and size at creation.
------
+ storageKey: String
+ originalFilename: String
+ contentType: String
	Invariant: must be a supported image format (JPEG, PNG, WebP)
+ sizeBytes: Integer
	Invariant: must be within configured size limits (5 MB)

### **AggregateStarRating** << ValueObject >>

Initialisation: factory method `AggregateStarRating.fromReviews(reviews)` — derived; no independent identity.
------
+ average: Decimal
+ reviewCount: Integer
----
+ isEmpty(): Boolean
	Invariant: when reviewCount is zero, aggregate must not be displayed as zero on the product details page — show nothing or a prompt instead
	Interaction:
		return reviewCount == 0

### **ProductReviews** << Entity >>

Initialisation: constructed per product SKU when listing reviews for a product details page.
------
+ productSku: String
+ << aggregation >> reviews: List<CustomerReview>
----
+ listSorted(sort: ReviewSort, page: Integer, pageSize: Integer): ReviewPage
	Invariant: default listing order is newest first
	Interaction:
		sortedReviews: List<CustomerReview> = applySort(reviews: this.reviews, sort: sort)
		return paginate(reviews: sortedReviews, page: page, pageSize: pageSize)

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

- *CustomerReview* uses factory initialisation — purchase verification happens in *ReviewService* before `create`; the entity enforces star rating and attachment invariants only (receiver-not-responsible-for-receiving).
- *StarRating* and *ReviewPhoto* are ValueObjects — immutable, validated at construction; no independent lifecycle.
- *AggregateStarRating* is a ValueObject — derived from review snapshots; `isEmpty()` drives suppress-zero display invariant on the product details page.
- *ProductReviews* is an Entity scoped to one product SKU — pagination and sort are collection-level behavior beyond a single review (collection-class rule from CRC).
- Photo attachment returns a new *CustomerReview* instance — immutable entity pattern matches `@pawplace/product-catalog-shared` implementation.
- Purchase verification, aggregate recompute orchestration, and repository persistence live in *ReviewService* (application layer) — not modeled as domain operations on *CustomerReview* (explicit-chain-of-responsibility).

---

# Boundary Domain

### **Product** << Entity >>

Initialisation: owned by Product Catalog module — boundary collaborator.
------
+ sku: String
+ aggregateStarRating: AggregateStarRating | null
----
+ recomputeAggregateOnReviewChange(reviews: List<CustomerReview>): void
	Interaction:
		aggregate: AggregateStarRating = AggregateStarRating.fromReviews(reviews)
		this.aggregateStarRating = aggregate.isEmpty() ? null : aggregate

### **CustomerAccount** << Entity >>

Initialisation: owned by Customer Account module — boundary collaborator.
------
+ accountId: String
----
+ hasPurchasedProduct(sku: String): Boolean
	Invariant: only verified purchasers may create a customer review; guest checkout sessions cannot leave reviews

### **ProductDetailsPage** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ displayAggregateStarRating(aggregate: AggregateStarRating | null): void
	Invariant: when aggregate is empty, show "Be the first to review" prompt instead of zero stars
+ listCustomerReviews(page: ReviewPage): void
+ presentReviewSubmissionForm(canSubmit: Boolean): void
+ promptGuestToSignIn(): void
	Invariant: guest prompt must not navigate away from the product details page

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

- *Product*, *CustomerAccount*, and *ProductDetailsPage* remain boundary — owned by Product Catalog and Customer Account modules; sprint 1 depends on them for attachment, authorship verification, and read-side presentation.
- *ProductDetailsPage* modeled as Service — presentation orchestration without persisted domain state (receiver-not-responsible-for-receiving).

---
