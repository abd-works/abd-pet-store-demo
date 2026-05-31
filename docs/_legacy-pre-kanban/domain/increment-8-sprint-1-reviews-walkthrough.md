---
state: walkthrough
sprint_scope: Increment 8 Sprint 1 — Customer reviews
---

# Module: [Marketing Engine]

Scope: Increment 8 Sprint 1 — Customer reviews (verified purchaser reviews, star ratings, optional photos, aggregate social proof, read-side pagination and sorting)

**Epic (story-graph):** Marketing engine - reviews, alerts, and content

**Stories (story-graph):**
- Submit Written Review with Star Rating
- Submit Photo Review
- Read Customer Reviews

**Prior phase:** `docs/domain/marketing-engine-reviews-crc.md` · **Spec:** `docs/story/specification-by-example/increment-8-sprint-1-reviews-specification-by-example.md`

---

# Core Domain

## **Customer Review**

Submission and read-path scenarios for verified purchaser reviews, star ratings, optional photos, and aggregate recomputation. Each walk traces CRC operations on *Customer Review*, *Star Rating*, *Review Photo*, *Aggregate Star Rating*, and *Product Reviews*.

### **Verified purchaser submits written review with star rating — happy path**

**Purpose:** Validate purchaser verification, review submission with mandatory star rating and optional text, listing on product details page, and aggregate recomputation.
**Concepts traced:** Customer Review, Star Rating, Customer Account, Product, Product Reviews, Aggregate Star Rating

#### Walk 1 — Covers: Submit Written Review with Star Rating — verified purchaser sees form and submits review

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501", name: "Premium Dog Kibble 10kg")
review: CustomerReview = new CustomerReview()
    // Customer Review.verify purchaser before submission — CRC: verified purchaser of product
    account.verifyProductPurchaseHistory(product: product)
        return purchased: true  // Order ORD-8801
    review.verifyPurchaserBeforeSubmission(
        customerAccount: account,
        product: product
    )
        return eligible: true
rating: StarRating = new StarRating(numericScore: 5)
    // Customer Review.submit with star rating and text
    review.submitWithStarRatingAndText(
        customerAccount: account,
        product: product,
        starRating: rating,
        writtenText: "My dog loves this kibble"
    )
        reviews: ProductReviews = product.attachedCustomerReviews
        reviews.accumulatedReviews.add(review)
        reviews.defaultSortByNewestFirst()
            // Product Reviews — CRC invariant: default listing order is newest first
        aggregate: AggregateStarRating = product.aggregateStarRating
        aggregate.recomputeOnReviewCreate(customerReview: review)
            // Aggregate Star Rating.recompute on review create
            aggregate.derivedAverage = 4.8  // illustrative after recompute
        review.contributeStarRatingToAggregate(
            product: product,
            aggregateStarRating: aggregate
        )
        return review
return review  // published on Product Details Page, newest first
```

#### Walk 2 — Covers: Submit Written Review with Star Rating — star-rating-only submission accepted

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = new CustomerReview()
    review.verifyPurchaserBeforeSubmission(customerAccount: account, product: product)
        return eligible: true
rating: StarRating = new StarRating(numericScore: 3)
    review.submitWithStarRatingAndText(
        customerAccount: account,
        product: product,
        starRating: rating,
        writtenText: null
    )
        // Star Rating — CRC invariant: integer 1–5; written text optional on Customer Review
        return review  // accepted with Star Rating 3, no written text body
return
```

### **Non-purchaser cannot submit review — failure path**

**Purpose:** Validate that purchase verification blocks submission while existing reviews remain viewable on the read path.
**Concepts traced:** Customer Review, Customer Account, Product, Product Details Page, Product Reviews

#### Walk 1 — Covers: Submit Written Review with Star Rating — non-purchaser sees purchase prompt

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-TOY-220", name: "Squeaky Bone Chew")
review: CustomerReview = new CustomerReview()
    review.verifyPurchaserBeforeSubmission(customerAccount: account, product: product)
        account.verifyProductPurchaseHistory(product: product)
            return purchased: false
        return eligible: false
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.hideFormForNonPurchasers(customerAccount: account, product: product)
        // Product Details Page — presentation: "Purchase this product to leave a review"
    page.listCustomerReviews(productReviews: product.attachedCustomerReviews)
        // existing Customer Reviews on SKU-TOY-220 remain viewable
return  // no submitWithStarRatingAndText invoked
```

### **Review photo attached on submit with read-side thumbnail — cooperation path**

**Purpose:** Validate photo attachment on submit, graceful validation isolation, and cooperation between *Review Photo*, *Customer Review*, and *Product Details Page* on the read path.
**Concepts traced:** Customer Review, Review Photo, Product Reviews, Product Details Page

#### Walk 1 — Covers: Submit Photo Review — photo stored and displayed inline with lightbox

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = new CustomerReview()
    review.verifyPurchaserBeforeSubmission(customerAccount: account, product: product)
        return eligible: true
photo: ReviewPhoto = new ReviewPhoto(fileName: "dog-kibble-bowl.jpg")
    photo.validateSupportedFormatAndSize(file: "dog-kibble-bowl.jpg")
        return valid: true
rating: StarRating = new StarRating(numericScore: 5)
    review.attachReviewPhotosOnSubmit(reviewPhoto: photo)
    review.submitWithStarRatingAndText(
        customerAccount: account,
        product: product,
        starRating: rating,
        writtenText: "Great quality"
    )
        product.attachedCustomerReviews.accumulatedReviews.add(review)
        return review
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.displayReviewPhotoThumbnails(reviewPhoto: photo)
        photo.displayAsInlineThumbnail()
    page.openPhotoLightboxAtFullSize(reviewPhoto: photo)
        photo.expandToFullSizeInLightbox()
return
```

#### Walk 2 — Covers: Submit Photo Review — unsupported format rejected without losing draft

```
account: CustomerAccount = CustomerAccount("tom.nguyen@pawplace.example")
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = new CustomerReview()  // draft in form
rating: StarRating = new StarRating(numericScore: 4)  // entered, not yet submitted
draftText: String = "Great product"
photo: ReviewPhoto = new ReviewPhoto()
    photo.validateSupportedFormatAndSize(file: "photo.bmp")
        // Review Photo — CRC invariant: supported image format
        return valid: false  // "Supported formats: JPEG, PNG, WebP"
    // Review Photo — CRC invariant: upload failure must not discard parent review written text or star rating
return  // Star Rating 4 and written text "Great product" remain in form; no attachReviewPhotosOnSubmit
```

#### Walk 3 — Covers: Submit Photo Review — oversized image rejected without losing draft

```
photo: ReviewPhoto = new ReviewPhoto()
    photo.validateSupportedFormatAndSize(file: "large-photo.jpg", sizeBytes: 6_500_000)
        return valid: false  // "Image must be under 5 MB"
return  // draft Star Rating and written text preserved; submit not called
```

### **Product with reviews shows aggregate and paginated listing — happy path**

**Purpose:** Validate aggregate display, default newest-first sort, pagination, and alternate sort by highest rating on the read path.
**Concepts traced:** Product, Product Reviews, Aggregate Star Rating, Customer Review, Star Rating, Product Details Page

#### Walk 1 — Covers: Read Customer Reviews — aggregate and listing with sort controls

```
product: Product = Product(sku: "SKU-FOOD-501", name: "Premium Dog Kibble 10kg")
reviews: ProductReviews = product.attachedCustomerReviews
    // 27 Customer Reviews accumulated
aggregate: AggregateStarRating = product.aggregateStarRating
    aggregate.derivedAverage = 4.3
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.displayAggregateStarRating(aggregateStarRating: aggregate, product: product)
        // Aggregate Star Rating.displayed on product details page
    page.listCustomerReviews(productReviews: reviews)
    reviews.defaultSortByNewestFirst()
        return orderedReviews: CustomerReview[]
return
```

#### Walk 2 — Covers: Read Customer Reviews — many reviews paginated; highest-rating sort

```
reviews: ProductReviews = product.attachedCustomerReviews
    reviews.paginateOrLazyLoadListing(productDetailsPage: page)
        // Product Reviews.paginate or lazy-load listing
    reviews.sortByHighestRating()
        // Product Reviews.sort by highest rating — collaborates with Star Rating on each Customer Review
        return orderedByStarRatingDescending: CustomerReview[]
return
```

### **Product with no reviews suppresses zero aggregate — edge path**

**Purpose:** Validate *Aggregate Star Rating* suppress-display invariant and first-review prompt on *Product Details Page*.
**Concepts traced:** Product, Product Reviews, Aggregate Star Rating, Product Details Page

#### Walk 1 — Covers: Read Customer Reviews — zero reviews, no aggregate shown

```
product: Product = Product(sku: "SKU-TOY-220", name: "Squeaky Bone Chew")
reviews: ProductReviews = product.attachedCustomerReviews
    // zero Customer Reviews
aggregate: AggregateStarRating = product.aggregateStarRating
    aggregate.suppressDisplayWhenNoReviews(productReviews: reviews)
        // Aggregate Star Rating — CRC invariant: must not display as zero when no reviews exist
        return displayAggregate: false
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.showBeTheFirstToReviewPrompt(product: product, productReviews: reviews)
return  // "Be the first to review"; no numeric zero shown
```

### references

**Ref — Customer reviews CRC**
Source: docs/domain/marketing-engine-reviews-crc.md
Locator: Customer Review, Star Rating, Review Photo, Aggregate Star Rating, Product Reviews
Extract: operations and invariants

```source
verify purchaser before submission | Customer Account, Product
submit with star rating and text    | Customer Account, Product, Star Rating, Product Reviews, Aggregate Star Rating
attach review photos on submit      | Review Photo, Product Reviews
recompute on review create          | Customer Review, Product
suppress display when no reviews    | Product Details Page, Product Reviews
default sort by newest first        | Customer Review
```

**Ref — Specification by Example Sprint 1**
Source: docs/story/specification-by-example/increment-8-sprint-1-reviews-specification-by-example.md
Locator: all three stories
Extract: whole

```source
When Customer Account tom.nguyen@pawplace.example submits a Customer Review on Product SKU-FOOD-501 with Star Rating 5 and written text "My dog loves this kibble"
Then the Customer Review is associated with Product SKU-FOOD-501 and Customer Account tom.nguyen@pawplace.example
And Product SKU-FOOD-501 Aggregate Star Rating is recomputed to include Star Rating 5
```

### decisions made

- Walk pseudocode uses CRC operation names verbatim from `marketing-engine-reviews-crc.md` / `marketing-engine-reviews-domain.json`; no new core classes introduced.
- *edit existing review* and *remove review* are modeled on CRC but not exercised in Sprint 1 spec scenarios — deferred to a later sprint unless AC expands (no gap filed; out of sprint scope per ticket notes).
- Purchase verification is initiated on *Customer Review* with *Customer Account* as collaborator; form visibility copy remains on *Product Details Page* (boundary), matching CRC decisions.

---

# Boundary Domain

Guest and presentation flows that cross into Product Catalog and Customer Account modules while keeping review rules in Marketing Engine.

### **Guest prompted to sign in without leaving product details page**

**Purpose:** Validate boundary presentation on *Product Details Page* for guests attempting review submission.
**Concepts traced:** Product Details Page, Customer Account, Customer Review, Product

#### Walk 1 — Covers: Submit Written Review with Star Rating — guest login prompt in place

```
product: Product = Product(sku: "SKU-FOOD-501")
page: ProductDetailsPage = product.hostProductDetailsPage()
    // no Customer Account session (guest)
page.promptGuestToLogInOrRegister()
    // Product Details Page — CRC invariant: guest prompt must not navigate away from product details page
    page.presentReviewSubmissionForm(customerReview: null, customerAccount: null)
        return formShown: false
return  // Product Details Page remains in view; no Customer Review.submitWithStarRatingAndText
```

### **Product hosts reviews and aggregate on details page — cooperation path**

**Purpose:** Validate boundary *Product* cooperation when reviews change and details page hosts the read surface.
**Concepts traced:** Product, Customer Review, Aggregate Star Rating, Product Details Page, Product Reviews

#### Walk 1 — Covers: Read Customer Reviews — Product boundary hosts page and aggregate recompute hook

```
product: Product = Product(sku: "SKU-FOOD-501")
review: CustomerReview = /* newly submitted */
product.recomputeAggregateOnReviewChange(customerReview: review)
    aggregate: AggregateStarRating = product.aggregateStarRating
        aggregate.recomputeOnReviewCreate(customerReview: review)
page: ProductDetailsPage = product.hostProductDetailsPage()
    page.displayAggregateStarRating(aggregateStarRating: aggregate, product: product)
    page.listCustomerReviews(productReviews: product.attachedCustomerReviews)
return
```

### references

**Ref — CRC boundary concepts**
Source: docs/domain/marketing-engine-reviews-crc.md
Locator: Boundary Domain — Product, Customer Account, Product Details Page
Extract: partial

```source
Product (boundary) — attached customer reviews, aggregate star rating, host product details page
Customer Account (boundary) — verify product purchase history, author customer reviews
Product Details Page (boundary) — display aggregate, list reviews, hide form for non-purchasers, prompt guest to log in or register
```

### decisions made

- Boundary walks intentionally stop at presentation and attachment hooks; purchase-history persistence stays in Customer Account module (owned_by per domain.json).
- No gap against CRC: guest and non-purchaser flows split verification (*Customer Account* / *Customer Review*) from copy (*Product Details Page*) as decided in CRC *decisions made*.

---
