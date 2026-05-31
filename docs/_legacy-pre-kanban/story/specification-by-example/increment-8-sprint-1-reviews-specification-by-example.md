---
state: specification-by-example
sprint_scope: Increment 8 Sprint 1 — Customer reviews
stories:
  - Submit Written Review with Star Rating
  - Submit Photo Review
  - Read Customer Reviews
---

# Specification by Example — Increment 8 Sprint 1: Customer reviews

**Sources / context:** `docs/domain/marketing-engine-reviews-crc.md`, `docs/domain/marketing-engine-reviews-domain.json`, `docs/domain/marketing-engine-ubiquitous-language.md`, `docs/story/acceptance-criteria/increment-8-acceptance-criteria.md` (Sprint 1 review stories only)

---

## Story: Submit Written Review with Star Rating

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Customer Review, Star Rating, Aggregate Star Rating), marketing-engine-ubiquitous-language.md (Customer Review KA), increment-8-acceptance-criteria.md (Submit Written Review with Star Rating AC 1–5)

---

## Background

Given a **Customer Account** *tom.nguyen@pawplace.example* (*Tom Nguyen*) is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has purchased **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* via **Order** *ORD-8801*

---

### Scenario 1: Verified purchaser sees review form on product details page

Given the **Product Details Page** for **Product** *SKU-FOOD-501* is displayed
When **Customer Account** *tom.nguyen@pawplace.example* opens the review submission area on the **Product Details Page**
Then the form collects a **Star Rating** *(1–5)* and optional written text for a **Customer Review**
  And **Customer Account** *tom.nguyen@pawplace.example* is *verified as purchaser* of **Product** *SKU-FOOD-501*

### Scenario 2: Valid customer review published and aggregate star rating recomputed

When **Customer Account** *tom.nguyen@pawplace.example* submits a **Customer Review** on **Product** *SKU-FOOD-501* with **Star Rating** *5* and written text *"My dog loves this kibble"*
Then the **Customer Review** is associated with **Product** *SKU-FOOD-501* and **Customer Account** *tom.nguyen@pawplace.example*
  And the **Customer Review** appears on the **Product Details Page** sorted *newest first*
  And **Product** *SKU-FOOD-501* **Aggregate Star Rating** is recomputed to include **Star Rating** *5*

### Scenario 3: Star-rating-only customer review accepted

When **Customer Account** *tom.nguyen@pawplace.example* submits a **Customer Review** on **Product** *SKU-FOOD-501* with **Star Rating** *3* and no written text
Then the **Customer Review** is *accepted*
  And the **Product Details Page** shows **Star Rating** *3* with no written text body

### Scenario 4: Non-purchaser sees purchase prompt while reviews remain viewable

Given a **Customer Account** *tom.nguyen@pawplace.example* is logged in
  And **Customer Account** *tom.nguyen@pawplace.example* has *not purchased* **Product** *SKU-TOY-220* *Squeaky Bone Chew*
When **Customer Account** *tom.nguyen@pawplace.example* opens the review area on the **Product Details Page** for **Product** *SKU-TOY-220*
Then the **Product Details Page** shows *"Purchase this product to leave a review"* where the review form would appear
  And existing **Customer Reviews** on **Product** *SKU-TOY-220* remain *viewable*

### Scenario 5: Guest prompted to sign in without leaving product details page

Given no **Customer Account** session exists (*guest*)
When the guest attempts to leave a **Customer Review** on **Product** *SKU-FOOD-501* from the **Product Details Page**
Then the **Product Details Page** prompts to *log in or register*
  And the **Product Details Page** remains in view — no navigation away

---

## Story: Submit Photo Review

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Review Photo, Customer Review), marketing-engine-ubiquitous-language.md (review photo), increment-8-acceptance-criteria.md (Submit Photo Review AC 1–4)

---

### Scenario 1: Review photos displayed inline with lightbox expansion

Given **Customer Account** *tom.nguyen@pawplace.example* is submitting a **Customer Review** on **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* attaches **Review Photo** *dog-kibble-bowl.jpg* to the **Customer Review**
  And submits the **Customer Review** with **Star Rating** *5* and written text *"Great quality"*
Then **Review Photo** *dog-kibble-bowl.jpg* is stored on the **Customer Review**
  And the **Product Details Page** displays the **Review Photo** as an inline thumbnail alongside the review text
When a customer selects the thumbnail on the **Product Details Page**
Then the **Product Details Page** opens **Review Photo** at *full size in a lightbox*

### Scenario 2: Unsupported image format rejected without losing review draft

Given **Customer Account** *tom.nguyen@pawplace.example* has entered **Star Rating** *4* and written text *"Great product"* on a **Customer Review** draft for **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* uploads file *photo.bmp* as a **Review Photo**
Then the upload shows a validation error *"Supported formats: JPEG, PNG, WebP"*
  And **Star Rating** *4* and written text *"Great product"* remain in the form

### Scenario 3: Oversized image rejected without losing review draft

Given **Customer Account** *tom.nguyen@pawplace.example* has entered **Star Rating** *4* and written text *"Great product"* on a **Customer Review** draft for **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* uploads file *large-photo.jpg* exceeding the *5 MB* size limit as a **Review Photo**
Then the upload shows a validation error *"Image must be under 5 MB"*
  And **Star Rating** *4* and written text *"Great product"* remain in the form

### Scenario 4: Customer review accepted without review photos

Given **Customer Account** *tom.nguyen@pawplace.example* is submitting a **Customer Review** on **Product** *SKU-FOOD-501*
When **Customer Account** *tom.nguyen@pawplace.example* submits the **Customer Review** with **Star Rating** *5* and written text *"Excellent quality"* and no **Review Photo**
Then the **Customer Review** is *accepted* as a standard written review — **Review Photo** is *optional*
  And the **Product Details Page** shows the **Star Rating** and written text with no image placeholder

---

## Story: Read Customer Reviews

**Story type:** user

**Sources / context:** marketing-engine-reviews-crc.md (Product Reviews, Aggregate Star Rating, Product Details Page), marketing-engine-ubiquitous-language.md (aggregate star rating, product reviews), increment-8-acceptance-criteria.md (Read Customer Reviews AC 1–4)

---

### Scenario 1: Product with reviews shows aggregate star rating and review listing

Given **Product** *SKU-FOOD-501* *Premium Dog Kibble 10kg* has **Product Reviews** with *27* **Customer Reviews** and **Aggregate Star Rating** *4.3*
When a customer views the **Product Details Page** for **Product** *SKU-FOOD-501*
Then **Aggregate Star Rating** *4.3* is displayed prominently near the product name
  And **Product Reviews** lists individual **Customer Reviews** below the product details
  And sort controls offer *newest*, *oldest*, *highest rating*, and *lowest rating*

### Scenario 2: Product with no reviews suppresses zero aggregate star rating

Given **Product** *SKU-TOY-220* *Squeaky Bone Chew* has **Product Reviews** with *zero* **Customer Reviews**
When a customer views the **Product Details Page** for **Product** *SKU-TOY-220*
Then **Aggregate Star Rating** is *not displayed*
  And the **Product Details Page** shows *"Be the first to review"*

### Scenario 3: Many customer reviews paginated with default newest-first sort

Given **Product** *SKU-FOOD-501* has more than one page of **Customer Reviews** in **Product Reviews**
When a customer views **Product Reviews** on the **Product Details Page** for **Product** *SKU-FOOD-501*
Then **Product Reviews** are *paginated or lazy-loaded*
  And the default listing order is *newest first*
When the customer selects sort *highest rating* on **Product Reviews**
Then **Product Reviews** reorders **Customer Reviews** by **Star Rating** *descending*

### Scenario 4: Review photo thumbnails shown inline on read path

Given a **Customer Review** on **Product** *SKU-FOOD-501* includes **Review Photo** *dog-kibble-bowl.jpg*
When a customer views **Product Reviews** on the **Product Details Page**
Then **Review Photo** thumbnails appear inline with the review text
When the customer selects a thumbnail
Then the **Product Details Page** opens **Review Photo** at *full size in a lightbox*
