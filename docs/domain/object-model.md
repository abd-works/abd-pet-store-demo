---  
state: domain-model  
increment_scope: Increment 7 — Returns and refunds
engineering_refresh: Run 8 slot 191
---  

# Module: [PawPlace]  

Scope: An online pet store that sells pet supplies through a full e-commerce experience and showcases available animals for in-store adoption visits — spanning product catalog, pet browsing, appointment booking, multi-store operations, customer accounts, orders, multi-vendor payments, returns, and notifications.  

**Increment scope (Engineering Run 8):** Increment 7 — Returns and refunds. **Refreshed object model** for *Order* (*Return* fully elaborated from deferred stub to full lifecycle — *Return Request*, *Return Eligibility*, *Return Window*, *Return Reason*, *Returned Items*, *Return Status*, *Return Label*, *Return QR Code*, *In-Store Return*, *Manager Override*, *Restocking* introduced; *Order* entry-point operation activated), *Payment* (*Refund* refreshed with full routing lifecycle — *Refund Status*, *Refund Retry* introduced; *Payment* and *Payment Vendor* refund responsibilities activated), *Notification* (*Return Received Notification*, *Refund Completed Notification*, *Refund Under Review Notification* introduced; triggering event updated for Increment 7 paths), and Boundary *StoreDashboard* (*in-store return lookup* added). Increment 1–6 surfaces retained. Deferred: *customer pet* CRUD, *communication preferences* UI, express/same-day delivery.  

---  

# Core Domain  

## **Product Catalog**  

The browsable, searchable collection of pet supplies. Single source of truth for product identity, pricing, stock truth, and review ownership.  

### **Product Catalog** << Entity >>  

+ ProductCatalog()  
------  
+ << composition >> products: List<Product>  
----  
+ findProduct(sku: String): Product  
	Invariant: returns the product matching the given SKU from the catalog collection  
+ browseProducts(): List<Product>  
	Invariant: returns only active products with at least one category assignment  
+ filterByCategory(category: Category): List<Product>  
	Invariant: returns products belonging to the given category or any of its children  
+ filterByBrand(brand: String): List<Product>  
+ search(keyword: String): List<Product>  
	Invariant: searches across product name, description, brand, and category names  
+ computeAggregateRating(product: Product): void  
	Invariant: recomputed when a review is created, edited, or deleted  
	Interaction:  
		reviews: List<CustomerReview> = product.customerReviews  
		totalStars: Integer = sum of review.starRating for each review in reviews  
		count: Integer = reviews.size()  
		averageRating: Decimal = totalStars / count  
		product.aggregateStarRating = averageRating  
		product.reviewCount = count  

### **Product** << Entity >>  

+ Product(name: String, sku: String, price: Money, brand: String)  
------  
+ name: String  
+ sku: String  
	Invariant: must be unique across the entire catalog  
+ price: Money  
	Invariant: must be positive; historical orders retain the price at time of purchase, not the current price  
+ brand: String  
+ << composition >> images: List<ProductImage>  
+ description: String  
+ weight: Decimal  
+ length: Decimal  
+ width: Decimal  
+ height: Decimal  
+ << aggregation >> categories: List<Category>  
	Invariant: must always belong to at least one category  
+ << aggregation >> stockAvailability: List<StockAvailability>  
	Invariant: must always expose current stock availability per stocking store  
+ << composition >> customerReviews: List<CustomerReview>  
+ aggregateStarRating: Decimal  
	Invariant: recomputed when a review is created, edited, or deleted  
+ reviewCount: Integer  
----  
+ addReview(review: CustomerReview): void  
	Invariant: only one review per customer account per product  
	Interaction:  
		this.customerReviews.add(review)  
		catalog: ProductCatalog = this.owningCatalog  
		catalog.computeAggregateRating(product: this)  
+ snapshotPrice(): Money  
	Invariant: returns the current price for capture at order time  

### **ProductImage** << ValueObject >>  

+ ProductImage(imageFile: String, altText: String, displayOrder: Integer)  
------  
+ imageFile: String  
+ altText: String  
+ displayOrder: Integer  
+ uploadedDate: Date  

### **Category** << Entity >>  

+ Category(categoryName: String)  
------  
+ categoryName: String  
+ parentCategory: Category  
	Invariant: top-level categories have no parent; nesting depth is finite  
+ displayOrder: Integer  
+ activeStatus: Boolean  
----  
+ acceptProduct(product: Product): void  
	Invariant: product is added to this category's product set  
+ children(): List<Category>  
	Invariant: returns all categories whose parentCategory is this  

### **CustomerReview** << Entity >>  

+ CustomerReview(authoringAccount: CustomerAccount, product: Product, starRating: Integer)  
------  
+ authoringAccount: CustomerAccount  
	Invariant: must be authored by exactly one customer account; guest checkout sessions cannot leave reviews  
+ reviewDate: Date  
+ starRating: Integer  
	Invariant: must be between 1 and 5 inclusive  
+ reviewTitle: String  
+ writtenText: String  
+ photoAttachment: String  
+ attachedProduct: Product  
	Invariant: must be attached to exactly one product  

### **StockAvailability** << Entity >>  

+ StockAvailability(product: Product, stockingStore: Store, stockLevel: Integer)  
------  
+ product: Product  
	Invariant: one stock availability record per product per stocking location (store)  
+ stockingStore: Store  
+ stockLevel: Integer  
	Invariant: numeric quantity held at the stocking store; edited by store employee via admin dashboard  
+ quantityOnHand: Integer  
+ reservedQuantity: Integer  
+ availableToSellQuantity: Integer  
	Invariant: available-to-sell must never go negative; if it reaches zero, purchasability is false  
+ reorderPoint: Integer  
+ reorderQuantity: Integer  
+ lowStockThreshold: Integer  
+ lastRestockedDate: Date  
+ expectedRestockDate: Date  
+ backorderEnabled: Boolean  
----  
+ perStoreWalkInAvailabilityDisplay(): String  
	Invariant: must reflect current stock level immediately after store employee update; walk-in customers see status labels only — not raw counts (Increment 1)  
	Interaction:  
		if this.availableToSellQuantity > 0: return "In Stock"  
		if this.backorderEnabled: return "Backorder Available"  
		return "Out of Stock"  
+ refreshFromStoreEmployeeEdit(newStockLevel: Integer): void  
	Invariant: stock level and quantity on hand update together; available-to-sell recalculates; per-store walk-in display reflects immediately  
	Interaction:  
		this.stockLevel = newStockLevel  
		this.quantityOnHand = newStockLevel  
		this.availableToSellQuantity = this.quantityOnHand - this.reservedQuantity  
		if this.availableToSellQuantity <= this.lowStockThreshold: triggerRestockAlert()  
+ gateOrderFlow(requestedQuantity: Integer): Boolean  
	Invariant: prevents checkout of items with zero available-to-sell unless backorder is enabled (deferred past Increment 1 — walk-in slice shows availability only)  
	Interaction:  
		available: Integer = this.availableToSellQuantity  
		if available >= requestedQuantity: return true  
		if this.backorderEnabled: return true  
		return false  
+ reserveStock(quantity: Integer): void  
	Invariant: reserved quantity increases; available-to-sell decreases by the same amount  
	Interaction:  
		this.reservedQuantity = this.reservedQuantity + quantity  
		this.availableToSellQuantity = this.quantityOnHand - this.reservedQuantity  
+ releaseReservedStock(quantity: Integer): void  
	Invariant: reverses a prior reservation — reserved decreases, available-to-sell increases  
+ updateQuantityOnHand(newQuantity: Integer): void  
	Invariant: delegates to refreshFromStoreEmployeeEdit — quantity on hand equals stock level  
	Interaction:  
		this.refreshFromStoreEmployeeEdit(newStockLevel: newQuantity)  
+ staffStockDisplay(): String  
	Invariant: admin and staff surfaces may show numeric counts; walk-in customers never see this label (Increment 1)  
	Interaction:  
		if this.availableToSellQuantity > 0: return "In Stock — {availableToSellQuantity} available"  
		if this.backorderEnabled: return "Backorder Available"  
		return "Out of Stock"  
- triggerRestockAlert(): void  
	Invariant: fires a restock alert notification for subscribed customers  

**Implementation packaging (Increment 1, slot 50).** Domain operations above remain the behavioral contract. In `@pawplace/product-catalog-shared`, `StockAvailability` holds state and getters; behavior lives in module-level functions that take the entity as the first argument and are re-exported from the package entry: `walkInAvailabilityLabel` ↔ `perStoreWalkInAvailabilityDisplay`, `staffStockLabel` ↔ `staffStockDisplay`, `refreshStockFromEmployeeEdit` ↔ `refreshFromStoreEmployeeEdit`, plus `updateQuantityOnHand`, `gateOrderFlow`, `reserveStock`, and `releaseReservedStock` in `stockAvailabilityReservation.ts`. Application services split by concern: `CatalogProductBrowse` (reads), `CatalogStockLevels` (stock mutations), `CatalogFixtureLoader` (seed/fixtures); HTTP adapters `CatalogProductApi`, `CatalogFixtureApi`, and `RetailStoreApi` with `RetailStoreCatalog`.

### references  

**Ref — Product catalog and browsing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: lines 3–5  
Extract: whole  

```source  
So the basic idea is we're building an online pet store — think of it as the go-to place for pet owners and people looking to become pet owners. The core of the site is a shopping experience for pet supplies: food, toys, beds, leashes, grooming products, aquarium gear, the whole lot. People should be able to browse by category, by pet type, by brand, whatever makes sense. We want good filtering and search so someone who owns a three-year-old golden retriever can quickly find the right size harness without scrolling through hamster wheels.  

The product catalog needs to be rich. Every product gets images (multiple angles ideally), a proper description, weight and dimensions where relevant, and customer reviews. We want a rating system — five stars, written reviews, maybe even photo reviews where someone shows their dog actually using the thing. Products should show stock availability in real time; nobody wants to go through checkout and find out the item's backordered.  
```  

### decisions made  

- ProductCatalog is an Entity — it is the single root that owns all products. browseProducts, filterByCategory, filterByBrand, search are all operations on the catalog, not on Product.  
- Product is an Entity — identity by SKU. Price is typed as Money (value object). Images are composition — they have no identity outside the product.  
- Categories use aggregation — a product belongs to categories, but categories have independent lifecycle (shared across products).  
- CustomerReview is an Entity — each review has its own identity and lifecycle. Photo attachment is optional (not a subtype — no distinct behavior).  
- StockAvailability is an Entity — one record per product per stocking store. stockingStore collaborator surfaced as typed property; stockLevel is the staff-editable quantity that drives quantityOnHand.  
- Product.stockAvailability is List<StockAvailability> — one entry per stocking store per walkthrough and CRC invariant.  
- perStoreWalkInAvailabilityDisplay returns walk-in status labels without raw counts (Increment 1); refreshFromStoreEmployeeEdit is the admin-dashboard entry point from the walkthrough.  
- gateOrderFlow retained for full-model checkout but deferred in Increment 1 — walk-in slice shows availability only.  
- aggregateStarRating and reviewCount are derived properties on Product, recomputed by ProductCatalog.computeAggregateRating — not their own class.  
- ProductImage is a ValueObject — defined entirely by its content (file, alt text, order). Two images with the same attributes are interchangeable.  
- triggerRestockAlert is a private helper on StockAvailability — external callers use refreshFromStoreEmployeeEdit or updateQuantityOnHand.  
- staffStockDisplay is admin-only; customer catalog and product detail use perStoreWalkInAvailabilityDisplay (status labels without counts).  
- **Increment 1 refresh (slot 37):** ProductCatalog.findProduct added; StockAvailability per-store surface aligned to CRC slot 25 and increment-1-walkthrough.  
- **Increment 1 refresh (slot 50):** Object model synced to clean-code packaging — module-level domain functions, split application/HTTP adapters; domain semantics unchanged.  

---  

## **Pet**  

Everything pet — store animals showcased online for adoption visits, and customer-owned pet profiles that drive personalised recommendations and reorder reminders. Store pets carry sourcing provenance, health records, temperament assessments, breed data, photos, lineage, and a full auditable lifecycle. The *species* grouping is the primary browsing dimension in the pet gallery; *breed* provides fine-grained filtering within a species. Customer pet profiles capture species, breed, age, and dietary needs. Increment 6 activates the full pet gallery, species filter, pet status tracking, and pet-adopted notification trigger.  

### **Pet** << Entity >>  

+ Pet(species: Species, breed: Breed, hostingStore: Store, petSource: PetSource)  
------  
+ species: Species  
	Invariant: must always be associated with exactly one species  
+ breed: Breed  
+ dateOfBirth: Date  
+ hostingStore: Store  
	Invariant: must always be associated with exactly one store  
+ petSource: PetSource  
	Invariant: every pet must trace to exactly one source  
+ petStatus: String  
	Invariant: must always have a status; progresses from available to adopted; cannot revert from adopted  
+ lineage: PetLineage  
+ << composition >> photos: List<PetPhoto>  
+ << composition >> temperamentAssessments: List<TemperamentAssessment>  
+ << composition >> healthRecords: List<HealthRecord>  
+ << composition >> lifecycleEvents: List<PetLifecycleEvent>  
----  
+ currentLifecycleState(): String  
	Invariant: derived from the most recent lifecycle event  
	Interaction:  
		latestEvent: PetLifecycleEvent = this.lifecycleEvents.last()  
		return latestEvent.lifecycleState  
+ transitionLifecycle(newState: String, transitionedBy: Store, context: String): PetLifecycleEvent  
	Invariant: transitions follow allowed state paths — no skipping quarantine after intake if health check is pending  
	Interaction:  
		currentState: String = this.currentLifecycleState()  
		event: PetLifecycleEvent = new PetLifecycleEvent(lifecycleState: newState, transitionedOn: now(), transitionedBy: transitionedBy, transitionContext: context)  
		this.lifecycleEvents.add(event)  
		return event  
+ markAdopted(pendingAppointments: List<Appointment>): void  
	Invariant: transitions petStatus to adopted; triggers pet-adopted notification when pending appointments exist for this pet  
	Interaction:  
		this.petStatus = "adopted"  
		this.transitionLifecycle(newState: "adopted", transitionedBy: this.hostingStore, context: "pet adopted")  
		affectedAppointments: List<Appointment> = filter pendingAppointments where appointment.visitedPet == this  
		for each appointment in affectedAppointments:  
			notification: PetAdoptedBeforeVisitNotification = new PetAdoptedBeforeVisitNotification(adoptedPet: this, affectedAppointment: appointment, recipientCustomerEmail: appointment.bookingCustomerAccount)  
			notification.deliver()  
+ addHealthRecord(record: HealthRecord): void  
+ addTemperamentAssessment(assessment: TemperamentAssessment): void  
+ addPhoto(photo: PetPhoto): void  
+ shareableHealthRecords(): List<HealthRecord>  
	Invariant: returns only entries marked as shareable  
	Interaction:  
		shareable: List<HealthRecord> = filter this.healthRecords where record.shareableStatus == true  
		return shareable  
+ bookingCallToAction(): Appointment  
	Invariant: shown only when petStatus is available; hidden or disabled when adopted  
	Invariant: must never expose a purchase path  

### **Species** << ValueObject >>  

+ Species(speciesName: String)  
------  
+ speciesName: String  
	Invariant: one of a fixed set — dog, cat, bird, fish, small mammal, reptile  
----  
+ groupPetsInGallery(allPets: List<Pet>): List<Pet>  
	Invariant: every pet must be associated with exactly one species  
	Interaction:  
		matchingPets: List<Pet> = filter allPets where pet.species == this  
		return matchingPets  

### **PetGallery** << Service >>  

Initialisation: stateless service — composes browsable collection from Pet entities  
------  
+ browsablePetCollection: List<Pet>  
----  
+ filterBySpecies(species: Species): List<Pet>  
	Invariant: when a species filter is active, only pets of that species are shown  
	Interaction:  
		filteredPets: List<Pet> = species.groupPetsInGallery(allPets: this.browsablePetCollection)  
		return filteredPets  
+ showEmptyState(species: Species): Boolean  
	Invariant: empty state shown when no pets of the selected species exist; filter remains active  
	Interaction:  
		matchingPets: List<Pet> = this.filterBySpecies(species: species)  
		isEmpty: Boolean = matchingPets.size() == 0  
		return isEmpty  
+ presentPetCard(pet: Pet): PetCard  
	Interaction:  
		card: PetCard = new PetCard(petPhoto: pet.photos.first(), petName: pet.name, petBreed: pet.breed, petSpecies: pet.species, hostingStore: pet.hostingStore)  
		return card  

### **PetCard** << ValueObject >>  

+ PetCard(petPhoto: PetPhoto, petName: String, petBreed: Breed, petSpecies: Species, hostingStore: Store)  
------  
+ petPhoto: PetPhoto  
+ petName: String  
+ petBreed: Breed  
+ petSpecies: Species  
+ hostingStore: Store  
+ linkToPetProfilePage: Pet  
	Invariant: each card navigates to the pet profile page for that pet  

### **Breed** << ValueObject >>  

+ Breed(breedName: String, species: Species)  
------  
+ breedName: String  
+ species: Species  
+ size: String  
+ coatType: String  
+ typicalTemperamentRange: String  
+ exerciseNeeds: String  

### **PetPhoto** << ValueObject >>  

+ PetPhoto(imageFile: String, caption: String, uploadedBy: Store)  
------  
+ imageFile: String  
+ caption: String  
+ uploadedBy: Store  
+ uploadDate: Date  

### **TemperamentAssessment** << ValueObject >>  

+ TemperamentAssessment(behavioralObservation: String, assessedBy: Store, assessmentDate: Date)  
------  
+ behavioralObservation: String  
+ assessedBy: Store  
+ assessmentDate: Date  

### **HealthRecord** << ValueObject >>  

+ HealthRecord(recordType: String, conditionOrEventDescription: String, recordedBy: Store)  
------  
+ recordType: String  
+ conditionOrEventDescription: String  
+ recordedDate: Date  
+ recordedBy: Store  
+ shareableStatus: Boolean  
	Invariant: health history shared online must only include entries marked as shareable  

### **PetLifecycleEvent** << ValueObject >>  

+ PetLifecycleEvent(lifecycleState: String, transitionedOn: DateTime, transitionedBy: Store, transitionContext: String)  
------  
+ lifecycleState: String  
+ transitionedOn: DateTime  
+ transitionedBy: Store  
+ transitionContext: String  
	Invariant: each event is immutable once recorded  
	Invariant: transitions follow allowed state paths — no skipping quarantine after intake if health check is pending  

### **PetSource** << ValueObject >>  

+ PetSource(supplierType: String, supplierName: String)  
------  
+ supplierType: String  
+ supplierName: String  
+ supplierLocation: String  
+ supplierPhone: String  
+ supplierEmail: String  
+ intakeDate: Date  
+ provenanceDocumentation: String  
	Invariant: every pet must trace to exactly one source  

### **PetLineage** << ValueObject >>  

+ PetLineage()  
------  
+ sire: Pet  
+ dam: Pet  
+ pedigreeDocumentation: String  
+ generationDepth: Integer  

### **PetProfile** << Entity >>  

+ PetProfile(owningCustomerAccount: CustomerAccount, petName: String, petSpecies: String)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account  
+ petName: String  
+ petSpecies: String  
+ petBreed: String  
+ dateOfBirthOrApproximateAge: String  
+ knownAllergies: String  
+ preferredFoodType: String  
+ specialDietaryRequirements: String  
+ enablePersonalisedRecommendations: Boolean  
+ enableSmartReorderTiming: Boolean  
----  
+ recommendProducts(catalog: ProductCatalog): List<Product>  
	Invariant: excludes products containing flagged allergens or incompatible ingredients when knownAllergies or specialDietaryRequirements are set  
	Interaction:  
		allProducts: List<Product> = catalog.browseProducts()  
		filtered: List<Product> = exclude products incompatible with this.knownAllergies and this.specialDietaryRequirements  
		return filtered  
+ calculateNextReorderDate(orderHistory: List<Order>): Date  
	Invariant: based on average purchase interval for this pet's food type  
	Interaction:  
		relevantOrders: List<Order> = filter orderHistory for this.preferredFoodType  
		averageInterval: Integer = computeAverageIntervalDays(orders: relevantOrders)  
		lastOrderDate: Date = relevantOrders.last().orderDate  
		nextReorderDate: Date = lastOrderDate + averageInterval  
		return nextReorderDate  
- computeAverageIntervalDays(orders: List<Order>): Integer  
	Invariant: calculates the mean number of days between consecutive orders of the same food type  

### references  

**Ref — Pets and in-store visits**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 7  
Extract: whole  

```source  
Now here's the important bit about the pets themselves: **you cannot buy a pet online**. That's not how this works. What we're offering is the ability to browse available animals — dogs, cats, birds, fish, small mammals, reptiles — and then **register an appointment** to come visit them in store. The idea is that buying a living creature should involve meeting it, seeing how it behaves, making sure it's the right fit. So the online experience for pets is more like a gallery: photos, breed info, age, temperament notes, any health history we're comfortable sharing. And then there's a big clear call-to-action to book a visit.  
```  

**Ref — Admin pet management**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentence about store staff managing pet profiles.  

```source  
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.  
```  

**Ref — Customer pet profiles**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: partial  
Part: Sentences about customer pet profiles and reorder reminders.  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.  
```  

**Ref — Increment 6 pet gallery and species filter**  
Source: docs/story/thin-slicing.md  
Locator: Increment 6  
Extract: partial  

```source  
Outcome: The adoption side goes live. Customers browse the pet gallery, see which store a pet is at and how far away it is, and book an appointment to visit.  
Stories: Browse Pets by Species, View Pet Profile, View Pet Store Location and Distance  
```  

### decisions made  

- Pet is an Entity — identity tracks an individual animal across its lifecycle. Composition for photos, temperament assessments, health records, lifecycle events — they cannot exist without the pet.  
- **Increment 6 refresh (slot 165):** Pet gains `species: Species` as a direct property — the gallery is organised by species facet and Pet carries the browsing identity independently of Breed. Pet gains `petStatus: String` (available/adopted) as an explicit property gating the booking CTA and driving the gallery badge. `markAdopted` is the operation that transitions status and triggers pet-adopted notifications for all pending appointments.  
- Species is a ValueObject — a fixed set of animal classifications (dog, cat, bird, fish, small mammal, reptile). Two species with the same name are the same species. groupPetsInGallery filters the browsable collection by species.  
- PetGallery is a Service — stateless, composes the browsable pet collection with species filtering, empty-state detection, and pet card presentation. No identity of its own.  
- PetCard is a ValueObject — immutable gallery summary (photo, name, breed, species, store, profile link). Composed by PetGallery on demand.  
- Breed is a ValueObject — two breeds with the same name and species are the same breed. No mutable lifecycle. Now takes Species as constructor argument instead of a raw string.  
- PetPhoto, TemperamentAssessment, HealthRecord are ValueObjects — immutable records once created.  
- PetLifecycleEvent is a ValueObject — immutable once recorded. The lifecycle state machine is enforced by Pet.transitionLifecycle which validates allowed paths.  
- PetSource is a ValueObject — provenance data captured at intake. Immutable record.  
- PetLineage is a ValueObject — pedigree data. sire and dam reference Pet entities but lineage itself is a value.  
- PetProfile is an Entity — it has identity (owned by a specific customer account for a specific pet). enablePersonalisedRecommendations and enableSmartReorderTiming are Boolean flags that drive collaborations with Notification and Product/Order.  
- recommendProducts and calculateNextReorderDate are the operations that fulfil the CRC collaborator references to Product, Order, and Notification on PetProfile.  
- bookingCallToAction on Pet returns an Appointment reference — shown only when petStatus is available; never a purchase path.  
- age is derived from dateOfBirth, not stored.  

---  

## **Appointment**  

A scheduled visit binding a customer account, a pet, and a store. The bridge between online pet browsing and in-store interaction. Increment 6 activates the full booking lifecycle: slot hold via AppointmentRequest, confirmation, check-in, visit outcome recording, no-show, cancellation, rebooking, and all three transactional notification types. The StaffAppointmentWorkflow provides the store-side coordination surface.  

### **Appointment** << Entity >>  

+ Appointment(bookingCustomerAccount: CustomerAccount, visitedPet: Pet, hostingStore: Store, scheduledDateAndTimeSlot: TimeSlot)  
------  
+ bookingCustomerAccount: CustomerAccount  
	Invariant: must be booked by exactly one customer account; guest checkout cannot book  
+ visitedPet: Pet  
	Invariant: must reference exactly one pet  
+ hostingStore: Store  
	Invariant: must reference exactly one store  
+ scheduledDateAndTimeSlot: TimeSlot  
	Invariant: must always have a confirmed and booked time slot  
+ visitNote: String  
+ bookingDate: Date  
+ appointmentStatus: String  
	Invariant: booked → confirmed → checked-in → completed; booked or confirmed → cancelled; confirmed → no-show  
	Invariant: cancelled and no-show appointments cannot advance further  
+ cancellationReason: String  
+ checkedInTime: DateTime  
+ checkedInBy: Store  
+ visitOutcome: VisitOutcome  
+ staffVisitNotes: String  
+ followUpAction: FollowUpAction  
+ followUpDate: Date  
+ noShowRecordedBy: Store  
+ noShowRecordedAt: DateTime  
+ notificationStatus: String  
----  
+ confirm(): void  
	Invariant: transitions status from booked to confirmed  
	Interaction:  
		this.appointmentStatus = "confirmed"  
		confirmationEmail: AppointmentConfirmationEmail = new AppointmentConfirmationEmail(bookingAppointment: this, recipientCustomerEmail: this.bookingCustomerAccount)  
		confirmationEmail.deliverOnAppointmentConfirmation()  
+ cancel(cancellation: AppointmentCancellation): void  
	Invariant: cancellation releases the booked time slot and records in appointment history  
	Interaction:  
		this.appointmentStatus = "cancelled"  
		this.cancellationReason = cancellation.cancellationReason  
		this.scheduledDateAndTimeSlot.releaseOnAppointmentCancellation()  
+ checkIn(checkedInBy: Store): void  
	Invariant: transitions status from confirmed to checked-in; records who and when  
	Invariant: blocked if appointment is already checked-in or cancelled  
	Interaction:  
		this.appointmentStatus = "checked-in"  
		this.checkedInTime = now()  
		this.checkedInBy = checkedInBy  
+ recordVisitOutcome(outcome: VisitOutcome, staffNotes: String): void  
	Invariant: can only be recorded after appointment is in checked-in status  
	Interaction:  
		this.appointmentStatus = "completed"  
		this.visitOutcome = outcome  
		this.staffVisitNotes = staffNotes  
		outcome.triggerFollowUpPrompt(appointment: this)  
		outcome.triggerPetAdoptionTransition(appointment: this)  
+ recordNoShow(recordedBy: Store): void  
	Invariant: transitions status from confirmed to no-show; records who and when  
	Invariant: cannot mark no-show on an already checked-in appointment  
	Interaction:  
		this.appointmentStatus = "no-show"  
		this.noShowRecordedBy = recordedBy  
		this.noShowRecordedAt = now()  
+ setFollowUpAction(action: FollowUpAction): void  
	Invariant: follow-up date required when action type is not none  
	Interaction:  
		this.followUpAction = action  
		this.followUpDate = action.followUpDate  
		action.triggerFollowUpNotification(appointment: this)  
+ triggerReminder(): void  
	Invariant: sends reminder notification the day before the scheduled date  
	Invariant: reminder suppressed when appointment is cancelled, no-show, or pet is adopted before trigger time  
	Interaction:  
		isSuppressed: Boolean = this.appointmentStatus == "cancelled" or this.appointmentStatus == "no-show" or this.visitedPet.petStatus == "adopted"  
		if isSuppressed: return  
		reminder: AppointmentReminder = new AppointmentReminder(reminderAppointment: this, recipientCustomerEmail: this.bookingCustomerAccount)  
		reminder.deliver()  
+ rebook(rebooking: AppointmentRebooking): Appointment  
	Invariant: rebooking must reference a new pet and a new time slot; cancelled slot must not be reused  
	Interaction:  
		newAppointment: Appointment = rebooking.followSameBookingFlow()  
		return newAppointment  

### **TimeSlot** << Entity >>  

+ TimeSlot(startTime: DateTime, endTime: DateTime, store: Store)  
------  
+ startTime: DateTime  
+ endTime: DateTime  
+ duration: Duration  
+ availableDateAndTimeWindow: Store  
	Invariant: scoped to a specific store's operating hours  
+ slotBookingStatus: String  
	Invariant: available → held when customer selects slot; held → booked on appointment confirmation; held → available on hold expiry or cancellation; booked → available on appointment cancellation  
----  
+ holdForAppointmentRequest(request: AppointmentRequest): void  
	Invariant: slot transitions to held when customer selects it; held slot is not visible to other customers in the available set  
	Interaction:  
		this.slotBookingStatus = "held"  
+ releaseOnHoldExpiry(): void  
	Invariant: slot returns to available if the appointment request is not confirmed within the hold duration  
	Interaction:  
		this.slotBookingStatus = "available"  
+ consumeOnBookingConfirmation(appointment: Appointment): void  
	Invariant: once booked, no longer available to other customers  
	Interaction:  
		this.slotBookingStatus = "booked"  
+ releaseOnAppointmentCancellation(): void  
	Invariant: slot returns to available when the cancellation is recorded before the visit date  
	Interaction:  
		this.slotBookingStatus = "available"  
+ isAvailable(): Boolean  
	Invariant: returns true only if slotBookingStatus is available and the time is in the future  

### **AppointmentRequest** << Entity >>  

+ AppointmentRequest(requestingCustomerAccount: CustomerAccount, requestedPet: Pet, selectedTimeSlot: TimeSlot)  
------  
+ requestingCustomerAccount: CustomerAccount  
	Invariant: must be submitted by a verified customer account; guest sessions cannot initiate a booking request  
+ requestedPet: Pet  
	Invariant: must reference exactly one pet with status available  
+ selectedTimeSlot: TimeSlot  
	Invariant: slot transitions to held status on selection; held slot not shown to other customers  
+ slotHoldDuration: Integer  
	Invariant: hold expires if booking is not confirmed within hold duration  
+ optionalVisitNote: String  
----  
+ confirmToCreateAppointment(): Appointment  
	Invariant: confirmation transitions time slot from held to booked and creates a confirmed appointment  
	Interaction:  
		this.selectedTimeSlot.consumeOnBookingConfirmation(appointment: null)  
		appointment: Appointment = new Appointment(bookingCustomerAccount: this.requestingCustomerAccount, visitedPet: this.requestedPet, hostingStore: this.selectedTimeSlot.availableDateAndTimeWindow, scheduledDateAndTimeSlot: this.selectedTimeSlot)  
		appointment.visitNote = this.optionalVisitNote  
		appointment.confirm()  
		return appointment  
+ releaseSlotOnHoldExpiry(): void  
	Invariant: expired hold returns slot to available; customer must re-select  
	Interaction:  
		this.selectedTimeSlot.releaseOnHoldExpiry()  
+ blockOnUnauthenticatedRequest(): void  
	Invariant: booking step blocked for guest sessions; slot hold maintained briefly while customer logs in or registers  

### **AppointmentCancellation** << ValueObject >>  

+ AppointmentCancellation(cancelledAppointment: Appointment, cancellationReason: String)  
------  
+ cancelledAppointment: Appointment  
	Invariant: must reference the appointment being withdrawn  
+ cancellationDate: Date  
+ cancellationReason: String  
----  
+ releaseBookedTimeSlot(): void  
	Invariant: releases the time slot back to available so another customer may book it  
	Interaction:  
		this.cancelledAppointment.scheduledDateAndTimeSlot.releaseOnAppointmentCancellation()  
+ recordInAppointmentHistory(): void  
	Invariant: cancellation recorded in the customer account's appointment history  
+ triggerRebookingOffer(): void  
	Invariant: offer surfaced when customer cancels after receiving pet-adopted notification  

### **AppointmentRebooking** << ValueObject >>  

+ AppointmentRebooking(cancelledAppointmentReference: AppointmentCancellation, newPetSelected: Pet, newTimeSlotSelected: TimeSlot, newStore: Store)  
------  
+ cancelledAppointmentReference: AppointmentCancellation  
	Invariant: must link to the prior appointment cancellation for history and context  
+ newPetSelected: Pet  
	Invariant: must reference a newly selected pet  
+ newTimeSlotSelected: TimeSlot  
	Invariant: must not reuse the time slot released by the prior appointment cancellation  
+ newStore: Store  
----  
+ followSameBookingFlow(): Appointment  
	Invariant: follows the same booking confirmation flow as a new appointment  
	Interaction:  
		request: AppointmentRequest = new AppointmentRequest(requestingCustomerAccount: this.cancelledAppointmentReference.cancelledAppointment.bookingCustomerAccount, requestedPet: this.newPetSelected, selectedTimeSlot: this.newTimeSlotSelected)  
		appointment: Appointment = request.confirmToCreateAppointment()  
		return appointment  

### **VisitOutcome** << ValueObject >>  

+ VisitOutcome(outcomeCategory: String)  
------  
+ outcomeCategory: String  
	Invariant: one of four categories must be selected — adopted, interested-returning, not-a-fit, browsing-only  
	Invariant: outcome cannot be recorded before appointment is checked-in  
+ optionalStaffVisitNotes: String  
----  
+ triggerFollowUpPrompt(appointment: Appointment): void  
	Invariant: interested-returning outcome prompts staff to set a follow-up action  
+ triggerPetAdoptionTransition(appointment: Appointment): void  
	Invariant: adopted outcome triggers the same pet status transition and notifications as the Mark Pet as Adopted path  
	Interaction:  
		if this.outcomeCategory == "adopted":  
			appointment.visitedPet.markAdopted(pendingAppointments: List<Appointment>())  

### **FollowUpAction** << ValueObject >>  

+ FollowUpAction(actionType: String, followUpDate: Date)  
------  
+ actionType: String  
	Invariant: one of — none, schedule-return-visit, hold-pet, send-adoption-paperwork  
+ followUpDate: Date  
	Invariant: follow-up date required when action type is not none  
+ holdingAppointment: Appointment  
----  
+ triggerFollowUpNotification(appointment: Appointment): void  
	Invariant: notification fires on follow-up date when action type is not none; suppressed if pet adopted before follow-up date  
	Interaction:  
		if this.actionType == "none": return  
		isPetAdopted: Boolean = appointment.visitedPet.petStatus == "adopted"  
		if isPetAdopted: return  
		followUpNotification: VisitFollowUpNotification = new VisitFollowUpNotification(sourceAppointment: appointment, triggeringFollowUpAction: this, recipientCustomerEmail: appointment.bookingCustomerAccount)  
		followUpNotification.deliver()  

### **StaffAppointmentWorkflow** << Service >>  

Initialisation: stateless service — coordinates staff-side appointment operations for a store  
------  
----  
+ incomingAppointmentsView(store: Store): List<Appointment>  
	Invariant: lists confirmed and checked-in appointments for the staff member's store, sorted soonest first  
+ showPetAdoptedWarningBadge(appointment: Appointment): Boolean  
	Invariant: appointments with adopted pets show a warning badge  
	Interaction:  
		isPetAdopted: Boolean = appointment.visitedPet.petStatus == "adopted"  
		return isPetAdopted  
+ showNotificationStatus(appointment: Appointment): String  
	Invariant: notified or not-yet-notified status visible per appointment entry  
	Interaction:  
		return appointment.notificationStatus  
+ checkInCustomer(appointment: Appointment, checkedInBy: Store): void  
	Invariant: records checked-in time and staff member; blocked if appointment is already checked-in or cancelled  
	Interaction:  
		appointment.checkIn(checkedInBy: checkedInBy)  
+ recordNoShow(appointment: Appointment, recordedBy: Store): void  
	Invariant: blocked if appointment is already checked-in; records staff member and timestamp; triggers follow-up notification to customer  
	Interaction:  
		appointment.recordNoShow(recordedBy: recordedBy)  
+ setFollowUpAction(appointment: Appointment, action: FollowUpAction): void  
	Invariant: follow-up action and date recorded after outcome or no-show; triggers visit follow-up notification on follow-up date  
	Interaction:  
		appointment.setFollowUpAction(action: action)  

### references  

**Ref — Appointment booking system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: whole  

```source  
The appointment system needs to be tied to a specific store location. We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits. The booking flow should let them pick a date, pick a time slot, maybe add a note like "I have two kids under five, want to make sure the dog is good with children." They get a confirmation email, a reminder the day before, and the store staff should see it on their end too.  
```  

**Ref — Increment 6 stories and acceptance criteria**  
Source: docs/story/acceptance-criteria/increment-6-acceptance-criteria.md  
Locator: stories — Select Date and Time Slot, Confirm Appointment Booking, Check In Customer, Record Visit Outcome, Record No-Show, Set Follow-Up Action  
Extract: partial  

```source  
Select Date and Time Slot AC 1: slot is highlighted and held temporarily (e.g. 10 minutes) to prevent double-booking during the booking flow.  
Confirm Appointment Booking AC 2: guest blocked; slot hold maintained while customer logs in or registers.  
Record Visit Outcome AC 2: adopted outcome transitions pet to Adopted status and triggers same notifications as Mark Pet as Adopted.  
Record No-Show AC 3: no-show triggers a follow-up notification to the customer offering to rebook.  
Set Follow-Up Action AC 4: follow-up date arrival triggers a Visit Follow-Up Notification to the customer.  
```  

### decisions made  

- Appointment is an Entity — each appointment has unique identity and a lifecycle (booked → confirmed → checked-in → completed / cancelled / no-show).  
- TimeSlot is an Entity — each slot is individually identifiable by its start time, end time, and store. It has a mutable slotBookingStatus with four values (available, held, booked, blocked).  
- **Increment 6 refresh (slot 165):** AppointmentRequest introduced as an Entity — owns the in-progress booking state (selected slot, hold duration, optional visit note, guest-block rule) so the hold-and-confirm flow has an explicit owner. AppointmentCancellation introduced as a ValueObject — carries cancellation date, reason, time slot release, history recording, and rebooking trigger. AppointmentRebooking introduced as a ValueObject — links to the cancelled appointment, requires a new pet and time slot (must not reuse the released slot), follows the standard booking flow. VisitOutcome promoted from String property to a ValueObject class with outcomeCategory (adopted, interested-returning, not-a-fit, browsing-only), follow-up prompt trigger, and pet adoption transition trigger. FollowUpAction promoted from String property to a ValueObject class with actionType and followUpDate, owning the follow-up notification trigger with suppression when pet is adopted. StaffAppointmentWorkflow introduced as a Service — the staff-side coordination surface (incoming view, check-in, no-show, follow-up, notification status, pet-adopted warning badge).  
- visitOutcome now uses a ValueObject with constrained category — all outcomes follow the same appointment lifecycle.  
- followUpAction now uses a ValueObject with typed actionType (none, schedule-return-visit, hold-pet, send-adoption-paperwork) — owns notification trigger.  
- checkedInBy, noShowRecordedBy reference Store (representing the staff location) — not a separate StoreEmployee entity at this model level.  
- Notification creation is called from appointment lifecycle operations (confirm, setFollowUpAction, triggerReminder) — typed notification classes are the collaborators.  
- notificationStatus tracks whether the customer has been sent a pet-adopted notification — visible to staff via StaffAppointmentWorkflow.  

---  

## **Store**  

A physical retail location anchoring the offline dimension — where pets live, appointments happen, click-and-collect is fulfilled, and in-store returns are processed.  

### **Store** << Entity >>  

+ Store(storeName: String, storeCode: String)  
------  
+ storeName: String  
+ storeCode: String  
+ addressLineOne: String  
+ addressLineTwo: String  
+ city: String  
+ countyOrRegion: String  
+ postcode: String  
+ country: String  
	Invariant: must always have a valid street address  
+ latitude: Decimal  
+ longitude: Decimal  
	Invariant: must always have valid coordinates  
+ openingTimePerDay: Dictionary<String, DateTime>  
+ closingTimePerDay: Dictionary<String, DateTime>  
+ holidayOverrides: List<HolidayOverride>  
	Invariant: must always have operating hours  
+ phoneNumber: String  
+ emailAddress: String  
+ activeStatus: Boolean  
+ productSpecialisation: List<Category>  
+ << aggregation >> hostedPets: List<Pet>  
+ << composition >> timeSlotsForBooking: List<TimeSlot>  
----  
+ fulfillClickAndCollectOrder(order: Order, clickAndCollect: ClickAndCollect): void  
	Invariant: marks the click-and-collect as ready and triggers customer notification  
	Interaction:  
		clickAndCollect.pickupStatus = "ready"  
		notification: Notification = Notification.createTransactional(triggeredBy: clickAndCollect, recipient: order.placingParty, type: "click-and-collect-ready")  
+ isOpenAt(dateTime: DateTime): Boolean  
	Invariant: checks operating hours and holiday overrides for the given date and time  
+ availableTimeSlots(date: Date): List<TimeSlot>  
	Invariant: returns only time slots with bookingStatus available on the given date  

### **HolidayOverride** << ValueObject >>  

+ HolidayOverride(date: Date, closed: Boolean)  
------  
+ date: Date  
+ closed: Boolean  
+ overrideOpeningTime: DateTime  
+ overrideClosingTime: DateTime  

### **SharedLocation** << ValueObject >>  

+ SharedLocation(latitude: Decimal, longitude: Decimal)  
------  
+ latitude: Decimal  
+ longitude: Decimal  

### **StoreLocator** << Service >>  

+ StoreLocator(stores: List<Store>)  
------  
+ << aggregation >> stores: List<Store>  
+ sharedLocationInput: SharedLocation  
+ postcodeInput: String  
----  
+ loadActiveStores(): StoreLocator  
	Invariant: returns a locator with only active stores; Increment 1 — no account required  
	Interaction:  
		activeStores: List<Store> = filter stores where activeStatus is true  
		return new StoreLocator(stores: activeStores)  
+ openMapView(): List<Store>  
	Invariant: all active stores visible without login (Increment 1)  
+ mapView(): List<Store>  
+ listView(): List<Store>  
+ showAllStoresWithoutSearch(): List<Store>  
	Invariant: Increment 1 — no specialization filter or account-gated features  
+ storesInDefaultOrder(): List<Store>  
	Invariant: when no location input present, list view shows default order without distance  
+ filterByAvailability(product: Product): List<Store>  
	Invariant: deferred past Increment 1 — specialization and availability filters retained for full model  
+ filterBySpecialisation(category: Category): List<Store>  
	Invariant: deferred past Increment 1  
+ filterByDistance(maxDistanceKm: Decimal): List<Store>  
	Invariant: deferred past Increment 1 unless sharedLocationInput or postcodeInput is present  
+ calculateDistanceFromCustomer(store: Store): Decimal  
	Invariant: distance calculated using geo-coordinates and sharedLocationInput or postcode-derived coordinates  
	Interaction:  
		customerLatitude: Decimal = this.sharedLocationInput.latitude  
		customerLongitude: Decimal = this.sharedLocationInput.longitude  
		return haversineDistance(fromLat: customerLatitude, fromLon: customerLongitude, toLat: store.latitude, toLon: store.longitude)  
+ sortNearestFirst(): List<Store>  
	Invariant: when location input present, smallest distance ranks first  
	Interaction:  
		distances: List<Decimal> = for each store in this.stores: calculateDistanceFromCustomer(store: store)  
		sorted: List<Store> = sort stores by distances ascending  
		return sorted  

### **ClickAndCollect** << Entity >>  

+ ClickAndCollect(originatingOrder: Order, selectedPickupStore: Store)  
------  
+ originatingOrder: Order  
	Invariant: must reference a specific order  
+ selectedPickupStore: Store  
	Invariant: must reference a specific store for pickup  
+ pickupStatus: String  
+ estimatedReadyTime: DateTime  
+ collectionWindow: DateTime  
----  
+ notifyCustomerWhenReady(): void  
	Invariant: sends a click-and-collect ready notification including order number, store address, operating hours, and collection window  
	Interaction:  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.originatingOrder.placingParty, type: "click-and-collect-ready")  
+ triggerStoreSideFulfillment(): void  
	Invariant: places the order into the store's fulfillment queue  

### **ShipToHomeFulfillment** << Service >>  

+ ShipToHomeFulfillment()  
------  
+ originatingOrder: Order  
	Invariant: packing and dispatch must reflect the shipping address recorded on the order  
+ shippingAddressToPackAgainst: ShippingAddress  
+ orderLineItemsToPack: List<OrderLineItem>  
+ fulfillmentStatus: String  
----  
+ markOrderFulfilled(order: Order): void  
	Invariant: transitions order from confirmed to fulfilled  
+ promptForTrackingNumber(order: Order): TrackingNumber  
	Invariant: tracking number recommended but not blocking in Increment 3  
+ confirmDispatchWithTracking(order: Order, trackingNumber: TrackingNumber): void  
	Invariant: transitions order from fulfilled to shipped when dispatch confirmed; triggers shipping notification  
+ surfaceOnOrderQueue(): List<Order>  
	Invariant: pending ship-to-home orders sorted oldest first alongside click-and-collect orders  

### references  

**Ref — Store locator**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 11  
Extract: whole  

```source  
Speaking of stores, the store locator needs to be a first-class feature. Map view, list view, filtering by what's available at each location. Some stores might specialise — one might have a great reptile section, another might be the place for premium dog food. People should be able to set a "my store" preference so the experience tailors itself a bit.  
```  

**Ref — Store geo and operations**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 9  
Extract: partial  
Part: Sentences describing store geo-tagging, address, and operational details.  

```source  
We're going to have multiple physical stores, and each store is geo-tagged with its actual address, map coordinates, operating hours, and contact details. When someone's browsing pets, they should see which store that animal is at, how far away it is from them (assuming they share location or enter a postcode), and available time slots for visits.  
```  

**Ref — Click-and-collect**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentences about click-and-collect.  

```source  
Speaking of which — click-and-collect should probably be an option. Order online, pick up at your local store. Saves on shipping and gets people in the door.  
```  

### decisions made  

- Store is an Entity — each store has unique identity (storeCode) and a mutable lifecycle (active/inactive).  
- HolidayOverride extracted as a ValueObject — the CRC had "holiday overrides" as a property on Store; it needs its own typed shape (date, closed flag, override times).  
- Operating hours modeled as Dictionary<String, DateTime> for opening/closing per day-of-week — not a named collection class since the structure is simple key-value.  
- StoreLocator is a Service — constructed with the active Store collection; sharedLocationInput and postcodeInput are mutable session inputs per CRC and walkthrough.  
- SharedLocation extracted as ValueObject — device-based geolocation from walkthrough (`SharedLocation(lat, lon)`).  
- loadActiveStores and openMapView align to increment-1-walkthrough factory entry points.  
- showAllStoresWithoutSearch and storesInDefaultOrder cover Increment 1 list/map behavior without filters or distance.  
- filterByAvailability, filterBySpecialisation, filterByDistance retained but marked deferred for Increment 1 thin slice.  
- ClickAndCollect is an Entity — each click-and-collect has its own lifecycle (pending → ready → collected / expired).  
- **Increment 3 refresh (slot 87):** ShipToHomeFulfillment service added — parallels click-and-collect pickup workflow; unified order queue on admin dashboard.  
- hostedPets uses aggregation — pets have independent identity; the store hosts but does not own their lifecycle.  
- timeSlotsForBooking uses composition — time slots are created for and owned by the store.  
- **Increment 1 refresh (slot 37):** StoreLocator typed surface aligned to CRC slot 25 and increment-1-walkthrough; customer location modeled as locator properties, not only operation parameters.  

---  

## **Customer Account**  

The persistent identity tying a person's entire PawPlace relationship together — history, preferences, saved details, and authored content.  

### **CustomerAccount** << Entity >>  

+ CustomerAccount(firstName: String, lastName: String, emailAddress: String, passwordHash: String)  
+ CustomerAccount.registerViaEmailAndPassword(emailAddress: String, password: String, name: CustomerName): CustomerAccount  
------  
+ firstName: String  
+ lastName: String  
+ emailAddress: String  
	Invariant: must be unique across all accounts  
+ phoneNumber: String  
+ username: String  
+ passwordHash: String  
+ registrationDate: Date  
+ accountVerificationStatus: AccountVerificationStatus  
	Invariant: must remain unverified until email verification succeeds  
+ accountStatus: String  
+ << aggregation >> orderHistory: OrderHistory  
+ << aggregation >> appointmentHistory: List<Appointment>  
+ << composition >> addressBook: AddressBook  
+ << aggregation >> savedPaymentMethods: List<SavedPaymentMethod>  
+ << aggregation >> petProfiles: List<PetProfile>  
+ preferredStore: Store  
+ << aggregation >> authoredCustomerReviews: List<CustomerReview>  
+ communicationPreferences: CommunicationPreferences  
+ wishlist: Wishlist  
+ emailVerification: EmailVerification  
----  
+ logIn(credentials: Credentials, guestCart: ShoppingCart): CustomerSession  
	Invariant: invalid credentials return generic error — must not specify which field is wrong  
	Invariant: unverified accounts must not receive account-only session access  
	Interaction:  
		valid: Boolean = validateCredentials(credentials: credentials)  
		if valid == false: throw InvalidCredentialsError  
		if AccountVerificationStatus.gateCustomerSessionAccess(status: this.accountVerificationStatus) == false: throw UnverifiedAccountError  
		session: CustomerSession = CustomerSession.createOnSuccessfulLogin(account: this)  
		CustomerSession.mergeGuestShoppingCartOnLogin(account: this, guestCart: guestCart)  
		return session  
+ logOut(session: CustomerSession): void  
	Invariant: invalidates the given session only — concurrent sessions on other devices remain active  
	Interaction:  
		session.invalidateOnLogout()  
+ resetPassword(newPasswordHash: String, verificationLink: VerificationLink): void  
	Invariant: password reset invalidates all customer sessions on all devices  
	Invariant: expired or already-used reset link rejects password update  
	Interaction:  
		if verificationLink.isExpired() or verificationLink.isUsed(): throw InvalidResetLinkError  
		this.passwordHash = newPasswordHash  
		verificationLink.consume()  
		CustomerSession.invalidateAllSessions(account: this)  
+ resetPasswordRequest(emailAddress: String): ResetRequestResult  
	Invariant: shows same confirmation regardless of whether account exists — no account enumeration  
+ retroactivelyAssociateGuestOrders(): void  
	Invariant: prior guest orders placed with the same email appear in order history after registration  
	Interaction:  
		guestOrders: List<Order> = Order.findByGuestEmail(email: this.emailAddress)  
		for each guestOrder in guestOrders: OrderHistory.includeRetroactiveGuestOrder(order: guestOrder)  
+ driveReorderReminders(): List<Notification>  
	Invariant: customer pet CRUD deferred past Increment 4 — reorder reminders from pet profiles deferred  

### **CustomerSession** << Entity >>  

+ CustomerSession.createOnSuccessfulLogin(account: CustomerAccount): CustomerSession  
+ CustomerSession.start(accountId: String, sessionId: String, deviceContext: String): CustomerSession  
------  
+ authenticatedCustomerAccount: CustomerAccount  
	Invariant: unverified accounts must not receive account-only feature access  
+ sessionToken: String  
+ deviceContext: String  
+ lastActivityTimestamp: DateTime  
+ inactivityTimeout: Duration  
----  
+ persistAcrossVisitsOnSameDevice(): void  
	Invariant: session remains active until logout, inactivity timeout, or password reset  
+ allowConcurrentSessions(): void  
	Invariant: multiple concurrent sessions per customer account across different devices  
+ invalidateOnLogout(): void  
+ invalidateAllSessions(account: CustomerAccount): void  
	Invariant: log out everywhere invalidates every active session  
+ mergeGuestShoppingCartOnLogin(account: CustomerAccount, guestCart: ShoppingCart): ShoppingCart  
	Invariant: duplicate product entries sum quantities when guest cart merges into account cart  
	Interaction:  
		accountCart: ShoppingCart = account.shoppingCart  
		for each guestItem in guestCart.cartItems:  
			existingItem: CartItem = accountCart.findBySku(sku: guestItem.productInCart.sku)  
			if existingItem exists: existingItem.quantity = existingItem.quantity + guestItem.quantity  
			else: accountCart.cartItems.add(guestItem)  
		return accountCart  
+ isActive(): Boolean  
	Invariant: expired session token invalidates authenticated request — shopping cart on account unchanged  

### **EmailVerification** << Entity >>  

+ EmailVerification.forAccount(account: CustomerAccount): EmailVerification  
------  
+ targetCustomerAccount: CustomerAccount  
+ verificationLink: VerificationLink  
----  
+ sendVerificationEmail(): Notification  
	Invariant: email delivery failure must not block registration confirmation  
	Interaction:  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.targetCustomerAccount, type: "verification-email")  
		notification.deliverTransactionalMessage()  
		return notification  
+ resendVerification(): Notification  
	Interaction:  
		newLink: VerificationLink = VerificationLink.create(ttlHours: configuredTtl)  
		this.verificationLink = newLink  
		return this.sendVerificationEmail()  
+ transitionAccountVerificationStatus(): void  
	Invariant: account verification status becomes verified only when customer clicks a valid non-expired verification link  
	Interaction:  
		if verificationLink.isExpired(): throw ExpiredVerificationLinkError  
		if verificationLink.isUsed() and targetCustomerAccount.accountVerificationStatus.isVerified: return  
		verificationLink.consume()  
		targetCustomerAccount.accountVerificationStatus = AccountVerificationStatus.verified()  
+ blockAccountOnlyFeatures(feature: String): FeatureGate  
	Invariant: login and account-only features blocked until customer confirms ownership via valid verification link  
	Interaction:  
		if targetCustomerAccount.accountVerificationStatus.isVerified: return FeatureGate.allowed()  
		return FeatureGate.blocked(prompt: "log in or register", dismissible: true)  

### **VerificationLink** << ValueObject >>  

+ VerificationLink.create(token: String, ttlHours: Integer): VerificationLink  
------  
+ uniqueLinkToken: String  
+ expiryTime: DateTime  
+ oneTimeUseFlag: Boolean  
	Invariant: expires after configured window (for example 24 hours); already-used link shows already verified message  
----  
+ offerResendWhenExpired(): ResendOffer  
	Invariant: expired link offers resend action  
+ consume(): void  
	Invariant: one-time use — marks link as consumed  

### **AccountVerificationStatus** << ValueObject >>  

+ AccountVerificationStatus.unverified(): AccountVerificationStatus  
+ AccountVerificationStatus.verified(): AccountVerificationStatus  
------  
+ verificationLabel: String  
	Invariant: remains unverified until email verification succeeds via valid verification link  
----  
+ gateCustomerSessionAccess(): Boolean  
	Invariant: blocks customer session creation with account-only access when unverified  

### **AddressBook** << Entity >>  

+ AddressBook(owningCustomerAccount: CustomerAccount)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account  
+ << composition >> savedAddresses: List<SavedAddress>  
+ defaultAddressId: String  
----  
+ acceptNewEntryFromCheckout(shipping: ShippingAddress, saveOptIn: Boolean): SavedAddress  
	Invariant: first saved address becomes default address automatically  
	Interaction:  
		if saveOptIn == false: return null  
		saved: SavedAddress = SavedAddress.fromShippingAddress(shipping: shipping)  
		this.savedAddresses.add(saved)  
		if this.savedAddresses.count == 1: this.assignDefault(address: saved)  
		return saved  
+ acceptNewEntryFromAccountSettings(fields: AddressFields): SavedAddress  
+ assignDefault(address: SavedAddress): void  
	Invariant: deleting default address requires selecting a new default when other saved addresses remain  
+ defaultAddress(): SavedAddress  
	Invariant: default address pre-selected on shipping step at checkout unless customer chooses another  

### **GuestCheckout** << ValueObject >>  

+ GuestCheckout(guestEmail: String, guestFirstName: String, guestLastName: String)  
------  
+ guestEmail: String  
	Invariant: must be valid before checkout advances to payment  
+ guestFirstName: String  
+ guestLastName: String  
+ guestPhone: String  
----  
+ collectBillingAddress(): BillingAddress  
	Invariant: billing address required on every order regardless of delivery option; not persisted after transaction — copied to confirmed order only  
+ collectShippingAddress(deliveryOption: DeliveryOption): ShippingAddress  
	Invariant: required when standard delivery selected; skipped when click-and-collect is the delivery option  
+ completePurchaseWithoutAccount(order: Order): void  
	Invariant: guest checkout remains available alongside logged-in checkout — registration and login are optional paths  
	Invariant: guest details must not persist beyond the transaction; order retains guest email and address snapshots for communications  
+ promoteAccountCreation(): CustomerAccount  
	Invariant: prompt is dismissible; does not block completed order; surfaces value of order history, saved address, and reorder  

### **Wishlist** << Entity >>  

+ Wishlist(owningCustomerAccount: CustomerAccount)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; guest sessions do not have wishlists  
+ << composition >> wishlistItems: List<WishlistItem>  
----  
+ addProduct(product: Product): WishlistItem  
	Invariant: guest customers see login prompt instead of add-to-wishlist  
+ removeProduct(product: Product): void  
+ linkToCatalogForPriceAndStock(product: Product): StockAvailability  
	Invariant: returns live price and stock from the catalog — not a snapshot  
+ requireVerifiedCustomerAccount(): void  
	Invariant: wishlist, saved address, saved payment method, order history, and reorder unlock only after email verification succeeds  

### **WishlistItem** << Entity >>  

+ WishlistItem(parentWishlist: Wishlist, referencedProduct: Product)  
------  
+ parentWishlist: Wishlist  
+ referencedProduct: Product  
	Invariant: must reference exactly one product on one wishlist  
----  
+ currentCatalogPriceAtDisplay(): Money  
+ currentStockAvailabilityAtDisplay(): StockAvailability  
+ addToShoppingCart(cart: ShoppingCart): void  
	Invariant: adding to cart does not remove item from wishlist until explicitly removed  

### **SavedAddress** << ValueObject >>  

+ SavedAddress.fromShippingAddress(shipping: ShippingAddress, label: String): SavedAddress  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; guest checkout collects addresses per-transaction only  
+ addressLabel: String  
+ addressLineOne: String  
+ addressLineTwo: String  
+ city: String  
+ countyOrRegion: String  
+ postcode: String  
+ country: String  
+ defaultShippingFlag: Boolean  
+ defaultBillingFlag: Boolean  
----  
+ selectAtCheckout(): SavedAddress  
	Invariant: historical orders retain a snapshot of the address used; soft-deletion does not break past order references  
+ manageFromAccountSettings(action: AddressAction): void  
	Invariant: deleting the default address requires selecting a new default when other saved addresses remain  

### **CommunicationPreferences** << ValueObject >>  

+ CommunicationPreferences(owningCustomerAccount: CustomerAccount)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; guest sessions cannot opt into marketing  
+ promotionalOptIn: Boolean  
+ restockAlertsOptIn: Boolean  
+ petCareTipsOptIn: Boolean  
+ eventNotificationsOptIn: Boolean  
+ lastUpdatedDate: Date  
----  
+ updatePreference(category: String, optIn: Boolean): void  
	Invariant: marketing notifications must never be sent without explicit opt-in for that category; UI deferred past Increment 4  

### references  

**Ref — User accounts**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 23  
Extract: whole  

```source  
User accounts should track everything: order history, appointment history (past and upcoming), wishlist or saved items, their pets (name, breed, age, dietary needs — useful for recommendations), their preferred store, their communication preferences. If someone has a pet profile set up, we can do smart things like remind them when it's probably time to reorder food based on how often they've bought it before.  
```  

**Ref — Authentication**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 15  
Extract: whole  

```source  
For authentication, we're doing standard username and password authentication — registration, login, logout, password reset, email verification, session management, the works. Nothing exotic, just solid and reliable. If someone's logged in on their phone they shouldn't get randomly kicked out every ten minutes.  
```  

**Ref — Shopping and guest checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about guest checkout and account creation appeal.  

```source  
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.  
```  

**Ref — Notification preferences (account side)**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: partial  
Part: Sentences about preference management.  

```source  
There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

### decisions made  

- CustomerAccount is an Entity — persistent identity; accountVerificationStatus gates account-only features until EmailVerification succeeds.  
- CustomerSession extracted as Entity — was intentionally excluded in Increment 3; CRC slot 101 requires typed session lifecycle, concurrent sessions, cart merge, and invalidate-all on password reset.  
- EmailVerification, VerificationLink, AccountVerificationStatus are separate typed blocks — mandatory verification gates wishlist, order history, reorder, saved entities.  
- AddressBook is Entity collection class — owns default designation and checkout save opt-in; SavedAddress remains ValueObject owned by AddressBook.  
- WishlistItem extracted as Entity state-carrier — one product per entry with catalog read-through at display time.  
- GuestCheckout refreshed for Increment 4 — guest first/last name split; billing/shipping collection unchanged from Increment 3; promoteAccountCreation surfaces order history value.  
- CommunicationPreferences UI deferred — typed block retained; marketing send rules unchanged.  
- Session management infrastructure (token store, middleware) recorded as application-layer — domain owns CustomerSession invariants only.  
- orderHistory uses aggregation via OrderHistory entity — not raw List<Order> on CustomerAccount.  
- savedPaymentMethods uses aggregation — lifecycle owned by Payment KA SavedPaymentMethod.  
- **Increment 4 refresh (slot 113):** Full returning-customer typed surface from CRC slot 101 and increment-4-walkthrough; `@pawplace/customer-account-shared` packages domain types and Zod schemas per architecture-reference handoff.  

---  

## **Order**  

The complete purchase lifecycle from cart through delivery and potential return. Owns financial summary, line items, shipping details, and tracking.  

### **BillingAddress** << ValueObject >>  

+ BillingAddress(name: String, addressLineOne: String, city: String, postcode: String, country: String)  
------  
+ name: String  
+ addressLineOne: String  
+ addressLineTwo: String  
+ city: String  
+ countyOrRegion: String  
+ postcode: String  
+ country: String  
	Invariant: required fields must be complete before checkout advances to payment (Increment 3)  
----  
+ selectFromSavedAddress(saved: SavedAddress): BillingAddress  
	Invariant: logged-in customers may select saved address instead of manual entry  
+ snapshot(fields: BillingAddress): BillingAddress  
	Invariant: inline snapshot on order — not a SavedAddress reference; guest billing is not persisted beyond the order  
+ preFillShippingAddress(): ShippingAddress  
	Invariant: when customer selects same as billing, shipping address fields copy from billing address  

### **ShippingAddress** << ValueObject >>  

+ ShippingAddress(recipientName: String, addressLineOne: String, city: String, postcode: String, country: String)  
------  
+ recipientName: String  
+ addressLineOne: String  
+ addressLineTwo: String  
+ city: String  
+ countyOrRegion: String  
+ postcode: String  
+ country: String  
	Invariant: required fields must be complete before checkout advances from the shipping step  
	Invariant: must not be required for click-and-collect orders  
	Invariant: not persisted after guest checkout completes — only order retains address snapshot for ship-to-home fulfillment  
----  
+ preFillFromSavedAddress(saved: SavedAddress, book: AddressBook): ShippingAddress  
	Invariant: default address pre-selected for logged-in customers unless customer chooses another saved address  
+ snapshot(fields: ShippingAddress): ShippingAddress  
	Invariant: validates required fields; returns immutable copy for order attachment  
+ preFillFromBilling(billingAddress: BillingAddress): ShippingAddress  
	Invariant: individual field overrides replace only the changed field; remaining pre-filled fields unchanged  
	Interaction:  
		shippingAddress: ShippingAddress = new ShippingAddress(recipientName: billingAddress.name, addressLineOne: billingAddress.addressLineOne, addressLineTwo: billingAddress.addressLineTwo, city: billingAddress.city, countyOrRegion: billingAddress.countyOrRegion, postcode: billingAddress.postcode, country: billingAddress.country)  
		return shippingAddress  

+ saveToAddressBookOnOptIn(book: AddressBook, saveOptIn: Boolean): SavedAddress  
	Invariant: logged-in customer may save address to address book when completing checkout with new address  

### **OrderHistory** << Entity >>  

+ OrderHistory(owningCustomerAccount: CustomerAccount)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: accessible only to logged-in verified customer account holders  
+ << aggregation >> associatedOrders: List<Order>  
	Invariant: lists all orders associated with the account, most recent first  
----  
+ displayOrderSummaryPerRow(order: Order): OrderSummary  
+ openFullOrderDetail(order: Order): OrderDetail  
	Interaction:  
		detail: OrderDetail = OrderDetail.fromOrder(order: order)  
		detail.lineItems = order.orderLineItems  
		detail.deliveryOption = order.deliveryOption  
		detail.payment = order.completedPayment  
		detail.trackingNumber = order.trackingNumber  
		return detail  
+ provideEntryPointForReorder(sourceOrder: Order): Reorder  
+ includeRetroactiveGuestOrder(order: Order): void  
	Invariant: prior guest orders placed with the same email as the registered account appear in order history  

### **Reorder** << Entity >>  

+ Reorder(sourceOrder: Order, owningCustomerAccount: CustomerAccount)  
------  
+ sourceOrder: Order  
	Invariant: must source order line items from an order in the customer's order history  
+ targetShoppingCart: ShoppingCart  
----  
+ addProductsWithOriginalQuantities(lineItems: List<OrderLineItem>, targetCart: ShoppingCart): ReorderResult  
	Interaction:  
		result: ReorderResult = ReorderResult.empty()  
		for each lineItem in lineItems:  
			product: Product = Product.findBySku(sku: lineItem.skuSnapshot)  
			if product is delisted: result.skip(sku: lineItem.skuSnapshot, reason: "product delisted"); continue  
			stock: StockAvailability = StockAvailability.forProduct(product: product)  
			if stock.availableToSellQuantity == 0: result.warnOnOutOfStock(lineItem: lineItem, stock: stock)  
			targetCart.addItem(product: product, quantity: lineItem.quantity)  
			result.add(lineItem: lineItem)  
		return result  
+ mergeDuplicateCartItems(targetCart: ShoppingCart): void  
	Invariant: duplicate product quantities sum when merging into existing cart items  
+ skipDelistedProducts(): List<SkippedProduct>  
+ warnOnOutOfStockProducts(lineItem: OrderLineItem, cart: ShoppingCart): CartItem  
+ navigateToShoppingCartForReview(cart: ShoppingCart): void  

### **Order** << Entity >>  

+ Order(orderNumber: String, placingParty: CustomerAccount, orderDate: Date)  
+ Order.fromGuestCart(orderNumber: String, cart: ShoppingCart, guestCheckout: GuestCheckout, pickupStore: Store): Order  
+ Order.fromGuestCartWithShipping(orderNumber: String, cart: ShoppingCart, guestEmail: String, guestName: String, billingAddress: BillingAddress, shippingAddress: ShippingAddress, deliveryOption: DeliveryOption): Order  
+ Order.fromAuthenticatedCheckout(orderNumber: String, cart: ShoppingCart, account: CustomerAccount, billingAddress: BillingAddress, shippingAddress: ShippingAddress, deliveryOption: DeliveryOption, savedAddressId: String): Order  
------  
+ orderNumber: String  
	Invariant: must be unique across all orders  
+ orderDate: Date  
+ placingParty: CustomerAccount  
+ guestCheckoutParty: GuestCheckout  
	Invariant: associates with customer account when purchaser is logged in; retains guest email snapshot for guest orders  
+ customerAccountId: String  
	Invariant: set when order placed by verified customer account — enables order history and reorder  
+ guestEmail: String  
	Invariant: snapshotted from guest checkout for staff queue, confirmation email, and guest order lookup  
+ guestName: String  
+ billingAddress: BillingAddress  
	Invariant: snapshotted at order time — required on every order regardless of delivery option  
+ shippingAddress: ShippingAddress  
	Invariant: snapshotted when delivery option is standard delivery; not required for click-and-collect  
+ pickupStore: Store  
	Invariant: pickup store details snapshotted when delivery option is click-and-collect  
+ deliveryOption: DeliveryOption  
	Invariant: must have either shipping address (standard delivery) or pickup store (click-and-collect) matching the chosen delivery option  
+ << composition >> orderLineItems: List<OrderLineItem>  
	Invariant: must have at least one line item  
+ subtotal: Money  
+ taxAmount: Money  
+ shippingCost: Money  
	Invariant: recorded when standard delivery selected; zero when click-and-collect  
+ orderTotal: Money  
	Invariant: order total must equal subtotal + tax + shipping cost  
+ currency: String  
+ completedPayment: Payment  
	Invariant: must have a completed payment before confirmed  
+ orderStatus: String  
	Invariant: click-and-collect lifecycle — pending_payment → confirmed → ready_for_pickup → collected  
	Invariant: ship-to-home lifecycle — pending_payment → confirmed → fulfilled → shipped → delivered  
+ trackingNumber: TrackingNumber  
+ shippedAt: DateTime  
+ estimatedDeliveryDate: Date  
+ maskedPaymentMethod: String  
----  
+ confirmPayment(maskedPaymentMethod: String): void  
	Invariant: transitions from pending_payment to confirmed only after payment confirmation; confirmation email must be attempted — delivery failure must not block order confirmation  
	Interaction:  
		this.orderStatus = "confirmed"  
		this.maskedPaymentMethod = maskedPaymentMethod  
		notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.guestEmail, type: "confirmation-email")  
+ markReadyForPickup(): void  
	Invariant: click-and-collect only — transitions from confirmed to ready_for_pickup when store employee marks prepared  
+ markCollected(): void  
	Invariant: click-and-collect only — transitions from ready_for_pickup to collected when store employee confirms handoff  
+ markFulfilled(): void  
	Invariant: ship-to-home only — transitions from confirmed to fulfilled when packing complete  
+ ship(trackingNumber: TrackingNumber): void  
	Invariant: ship-to-home only — transitions from fulfilled (or confirmed when tracking entered at dispatch) to shipped; shipping notification fires when tracking number recorded  
	Interaction:  
		this.trackingNumber = trackingNumber  
		this.shippedAt = now()  
		this.orderStatus = "shipped"  
		shippedDate: Date = this.shippedAt  
		estimatedDate: Date = shippedDate + 5 business days  
		this.estimatedDeliveryDate = estimatedDate  
		notification: Notification = Notification.createTransactional(triggeredBy: trackingNumber, recipient: this.guestEmail, type: "shipping-notification")  
+ calculateTotals(): void  
	Invariant: subtotal is the sum of all line totals; orderTotal equals subtotal + taxAmount + shippingCost  
+ exposeGuestOrderLookup(guestEmail: String): Order  
	Invariant: guest lookup requires matching order number and guest email — no order details leak to unrelated emails  
+ provideEntryPointForReturns(returnEligibility: ReturnEligibility): Return  
	Invariant: "Return" action appears on eligible order in order history when return eligibility is satisfied  
+ provideEntryPointForReorder(history: OrderHistory): Reorder  
	Invariant: reorder sources order line items from order history for logged-in verified customer accounts  

### **OrderLineItem** << ValueObject >>  

+ OrderLineItem(orderedProduct: Product, quantity: Integer)  
------  
+ orderedProduct: Product  
+ productNameSnapshot: String  
+ skuSnapshot: String  
+ unitPriceSnapshot: Money  
	Invariant: must capture the price at the moment the order is confirmed, not the current catalog price  
+ quantity: Integer  
	Invariant: must be at least one  
+ lineDiscount: Money  
+ lineTotal: Money  
----  
+ snapshotFromProduct(product: Product, quantity: Integer): OrderLineItem  
	Invariant: captures current product name, SKU, and price at order confirmation time  
+ snapshotFromCartItem(cartItem: CartItem): OrderLineItem  
	Invariant: Increment 2 — cart-to-order transition snapshots price at purchase time from cart item  
	Interaction:  
		snapshot: OrderLineItem = new OrderLineItem(orderedProduct: cartItem.productInCart, quantity: cartItem.quantity)  
		snapshot.productNameSnapshot = cartItem.productInCart.name  
		snapshot.skuSnapshot = cartItem.productInCart.sku  
		snapshot.unitPriceSnapshot = cartItem.unitPriceAtTimeOfAdding  
		snapshot.lineTotal = cartItem.linePrice  
		return snapshot  

### **ShoppingCart** << Entity >>  

+ ShoppingCart(sessionId: String)  
+ ShoppingCart(owningCustomerAccount: CustomerAccount)  
+ ShoppingCart(owningGuestCheckout: GuestCheckout)  
------  
+ sessionId: String  
	Invariant: guest cart keyed by browser session until login merges into account cart  
+ owningCustomerAccount: CustomerAccount  
	Invariant: persists across devices and customer sessions for logged-in customer accounts  
+ owningGuestCheckout: GuestCheckout  
	Invariant: session-scoped for guests until login merges guest cart into account cart  
+ << composition >> cartItems: List<CartItem>  
+ createdDate: Date  
+ lastModifiedDate: Date  
+ cartSubtotal: Money  
----  
+ addItem(product: Product, quantity: Integer): void  
	Invariant: if product already in cart, increments quantity; stock gate rejects out-of-stock adds (Increment 2)  
	Interaction:  
		existingItem: CartItem = find in this.cartItems where cartItem.productInCart.sku == product.sku  
		if existingItem exists: existingItem.quantity = existingItem.quantity + quantity  
		else: this.cartItems.add(new CartItem(productInCart: product, quantity: quantity, unitPriceAtTimeOfAdding: product.price))  
		this.lastModifiedDate = now()  
		this.recalculateSubtotal()  
+ removeItem(product: Product): void  
+ updateItemQuantity(product: Product, newQuantity: Integer): void  
	Invariant: must be at least one; setting to zero removes the item  
+ transitionToCheckout(): Order  
	Invariant: converts cart items into order line items with price snapshots; empties the cart after payment confirm (Increment 2)  
	Interaction:  
		order: Order = Order.fromGuestCart(orderNumber: generateOrderNumber(), cart: this, guestCheckout: guestCheckout, pickupStore: pickupStore)  
		for each cartItem in this.cartItems:  
			lineItem: OrderLineItem = OrderLineItem.snapshotFromCartItem(cartItem: cartItem)  
			order.orderLineItems.add(lineItem)  
		return order  
- recalculateSubtotal(): void  
	Invariant: cartSubtotal is the sum of all cartItem.linePrice values  
+ transitionToCheckout(party: CustomerAccount): Order  
	Invariant: guest checkout or authenticated checkout with saved entity selection  
+ persistAcrossDevices(): void  
	Invariant: account-scoped cart survives session expiry — guest carts remain session-scoped only  

**Implementation packaging (Increment 4, slot 113).** `@pawplace/customer-account-shared`: `CustomerAccount`, `CustomerSession`, `EmailVerification`, `VerificationLink`, `AccountVerificationStatus`, `AddressBook`, `SavedAddress`, `Wishlist`, `WishlistItem`; Zod schemas in `customer-account.schema.ts`. `@pawplace/order-shared`: `OrderHistory`, `Reorder`, `ReorderResult`; `order-history.schema.ts` with `orderHistorySummarySchema`, `reorderResultSchema`, `authenticatedCheckoutSchema`. `@pawplace/payment-shared`: `SavedPaymentMethod`; `saved-payment-method.schema.ts`. Increment 3 ship-to-home packaging unchanged.

**Implementation packaging (Increment 3, slot 87).** `@pawplace/cart-shared`: session-scoped `ShoppingCart` unchanged from Increment 2. `@pawplace/order-shared`: `ShippingAddress`, `DeliveryOption` / `StandardDelivery`, `TrackingNumber`, extended `Order` with `fromGuestCartWithShipping`, `markFulfilled`, `ship`, dual lifecycle guards via `WrongDeliveryOptionError`; Zod schemas include `shippingAddressSchema`, `deliveryOptionSchema`, `guestOrderLookupSchema`, `fulfillOrderSchema`, `addTrackingSchema`. `@pawplace/payment-shared`: StripeWave-only unchanged. Notification delivery stub in `order.notification-service.ts` (`sendConfirmationEmail`, `sendShippingNotification`).

### **CartItem** << ValueObject >>  

+ CartItem(productInCart: Product, quantity: Integer, unitPriceAtTimeOfAdding: Money)  
------  
+ productInCart: Product  
+ quantity: Integer  
	Invariant: must be at least one  
+ unitPriceAtTimeOfAdding: Money  
	Invariant: captured at add-to-cart time — not refreshed on catalog price change  
+ linePrice: Money  
	Invariant: unitPriceAtTimeOfAdding × quantity  

### **DeliveryOption** << ValueObject >>  

+ DeliveryOption(deliveryMethodName: String, estimatedDeliveryWindow: String, shippingCost: Money)  
------  
+ deliveryMethodName: String  
	Invariant: Increment 3 — standard delivery and click-and-collect offered; express and same-day deferred  
+ estimatedDeliveryWindow: String  
+ shippingCost: Money  
	Invariant: recorded on order when standard delivery selected; zero when click-and-collect  
+ clickAndCollectAlternative: ClickAndCollect  
+ deliveryInstructions: String  
	Invariant: deferred — not required for click-and-collect or standard delivery in Increment 3  
----  
+ standardDelivery(): StandardDelivery  
	Invariant: sole ship-to-home option in Increment 3  
+ clickAndCollect(): ClickAndCollect  
+ deliveryTypeLabel(): String  
	Invariant: returns human-readable label for staff queue and order status surfaces  

### **StandardDelivery : DeliveryOption** << ValueObject >>  

+ shippingCostPence: Integer  
	Invariant: default £4.99 (499 pence) unless overridden  
+ estimatedDeliveryWindow: String  
	Invariant: default "3–5 business days"  
----  
+ confirmShippingAddressDestination(shippingAddress: ShippingAddress, order: Order): void  
	Invariant: must always reference complete shipping address on the order  
+ triggerShipToHomeFulfillment(): void  
	Invariant: sole ship-to-home option in Increment 3 — express and same-day deferred  

### **TrackingNumber** << ValueObject >>  

+ TrackingNumber(carrierReference: String, carrierName: String)  
------  
+ carrierReference: String  
	Invariant: must belong to exactly one ship-to-home order; duplicate entry replaces prior value  
+ carrierName: String  
+ shipmentDate: DateTime  
	Invariant: set when order transitions to shipped  
+ originatingOrder: Order  
----  
+ create(number: String, carrierName: String): TrackingNumber  
	Invariant: carrier reference must be non-empty  
+ carrierTrackingUrl(): String  
	Invariant: recommended at ship-to-home fulfillment but not blocking — staff may add later via order detail  

### **Return** << Entity >>  

+ Return(originatingOrder: Order, initiatingParty: CustomerAccount, returnDate: Date)  
+ Return(originatingOrder: Order, guestEmail: String, returnDate: Date)  
------  
+ originatingOrder: Order  
	Invariant: must reference exactly one originating order  
+ returnDate: Date  
+ initiatingParty: CustomerAccount  
	Invariant: associates with customer account when initiated online; supports guest order return via order number and guest email  
+ guestEmail: String  
+ returnRequest: ReturnRequest  
	Invariant: creates the return record and links it to the originating order  
+ << composition >> returnedItems: ReturnedItems  
+ returnStatus: ReturnStatus  
+ returnLabel: ReturnLabel  
+ returnQrCode: ReturnQRCode  
	Invariant: both generated on successful return request submission; both encode the same return reference  
----  
+ routeRefundThroughOriginalVendor(): Refund  
	Invariant: refund must always route through the payment vendor that handled the original transaction  
	Interaction:  
		originalPayment: Payment = this.originatingOrder.completedPayment  
		refundAmount: Money = this.returnedItems.calculateReturnedValue()  
		refund: Refund = new Refund(refundReference: generateRefundReference(), originatingReturn: this, refundAmount: refundAmount, routeThroughVendor: originalPayment.processingVendor)  
		refund.refundStatus.transitionToProcessing(vendor: originalPayment.processingVendor)  
		return refund  
+ supportPartialReturns(orderLineItem: OrderLineItem): Boolean  
	Invariant: items already in "return in progress" cannot be returned again; remaining eligible items are still returnable  
+ reflectInCustomerAccount(account: CustomerAccount): void  
	Invariant: return visible under order detail regardless of whether initiated online or in-store  

### **ReturnRequest** << ValueObject >>  

+ ReturnRequest(selectedOrderLineItems: List<OrderLineItem>, quantitiesToReturn: List<Integer>, returnReason: ReturnReason)  
------  
+ selectedOrderLineItems: List<OrderLineItem>  
+ quantitiesToReturn: List<Integer>  
+ returnReason: ReturnReason  
----  
+ createReturnRecord(order: Order, returnEligibility: ReturnEligibility): Return  
	Invariant: must be made against an order that passes return eligibility; items already in "return in progress" are excluded  
	Interaction:  
		eligible: Boolean = returnEligibility.evaluatePerItem(orderLineItems: this.selectedOrderLineItems)  
		if eligible == false: throw IneligibleReturnError  
		returnRecord: Return = new Return(originatingOrder: order, initiatingParty: order.placingParty, returnDate: today())  
		returnedItems: ReturnedItems = ReturnedItems.fromRequest(orderLineItems: this.selectedOrderLineItems, quantities: this.quantitiesToReturn)  
		returnRecord.returnedItems = returnedItems  
		returnRecord.returnRequest = this  
		returnRecord.returnLabel = ReturnLabel.generate(order: order, returnReference: generateReturnReference())  
		returnRecord.returnQrCode = ReturnQRCode.generate(returnReference: returnRecord.returnLabel.returnReference)  
		returnRecord.returnStatus = ReturnStatus.initiated()  
		return returnRecord  
+ surfaceReturnStatusImmediately(returnStatus: ReturnStatus): void  

### **ReturnEligibility** << ValueObject >>  

+ ReturnEligibility(order: Order, returnWindow: ReturnWindow)  
------  
+ eligibleItems: List<OrderLineItem>  
+ ineligibilityReason: String  
----  
+ evaluatePerItem(orderLineItems: List<OrderLineItem>): Boolean  
	Invariant: evaluated per item — some items in an order may be eligible while others are not  
	Interaction:  
		for each lineItem in orderLineItems:  
			windowOpen: Boolean = this.returnWindow.isWithinWindow(order: this.order, lineItem: lineItem)  
			if windowOpen == false: this.ineligibilityReason = "return window expired"; return false  
		return true  
+ hideOrDisableReturnAction(order: Order): Boolean  
	Invariant: "Return" action must not appear on an order whose return window has expired; ineligible items must show a clear reason  

### **ReturnWindow** << ValueObject >>  

+ ReturnWindow(configuredPeriod: Integer, category: Category)  
------  
+ configuredPeriod: Integer  
+ deliveryDateAnchor: Date  
+ collectionDateAnchor: Date  
	Invariant: period starts from delivery date for standard delivery or collection date for click-and-collect  
+ categorySpecificVariation: Category  
	Invariant: varies by product category or promotional conditions — configuration, not domain logic  
----  
+ isWithinWindow(order: Order, lineItem: OrderLineItem): Boolean  
	Invariant: compares current date against anchor date plus configured period  
	Interaction:  
		anchorDate: Date = order.deliveryOption.deliveryMethodName == "click-and-collect" ? this.collectionDateAnchor : this.deliveryDateAnchor  
		expiryDate: Date = anchorDate + this.configuredPeriod  
		return today() <= expiryDate  

### **ReturnReason** << ValueObject >>  

+ ReturnReason(reasonCategory: String, reasonText: String)  
------  
+ reasonCategory: String  
	Invariant: constrained to: wrong size, damaged in transit, not as described, changed mind, other  
+ reasonText: String  
+ inspectionPolicyHint: String  
	Invariant: some reasons (e.g. damaged in transit) may qualify for auto-approval without physical inspection  

### **ReturnedItems** << Entity >>  

+ ReturnedItems.fromRequest(orderLineItems: List<OrderLineItem>, quantities: List<Integer>): ReturnedItems  
------  
+ << aggregation >> orderLineItemReferences: List<OrderLineItem>  
+ returnedQuantities: Dictionary<OrderLineItem, Integer>  
	Invariant: returned quantities cannot exceed original ordered quantities minus any previously returned quantities for the same order line item  
+ perItemReturnStatus: Dictionary<OrderLineItem, ReturnStatus>  
	Invariant: tracks per-item return status separately when items are inspected individually  
----  
+ calculateReturnedValue(): Money  
	Invariant: sums unit price snapshot × returned quantity for each returned line item  
	Interaction:  
		total: Money = Money.zero()  
		for each lineItem in this.orderLineItemReferences:  
			quantity: Integer = this.returnedQuantities.get(lineItem)  
			lineValue: Money = lineItem.unitPriceSnapshot * quantity  
			total = total + lineValue  
		return total  
+ triggerRestockingOnInspectionPass(product: Product, store: Store, stockAvailability: StockAvailability): Restocking  
	Invariant: only items that pass inspection are restocked; failed items are not returned to stock  
	Interaction:  
		restocking: Restocking = new Restocking(returnedProduct: product, returnedQuantity: this.returnedQuantities.get(lineItem), destinationStore: store, inspectionResult: "pass")  
		restocking.replenishStockAvailability(stockAvailability: stockAvailability)  
		return restocking  

### **ReturnStatus** << ValueObject >>  

+ ReturnStatus.initiated(): ReturnStatus  
------  
+ lifecycleState: String  
	Invariant: lifecycle — initiated → label generated → shipped back → received → inspected → refund processing → completed  
----  
+ updateOnLabelGeneration(returnLabel: ReturnLabel): void  
	Invariant: transitions to "label generated" when return label is created  
+ updateOnCarrierScan(): void  
	Invariant: transitions to "shipped back" when carrier scans the parcel  
+ updateOnWarehouseReceipt(notification: Notification): void  
	Invariant: triggers return received notification when transitioning to "received"  
	Interaction:  
		this.lifecycleState = "received"  
		returnReceivedNotification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.recipient, type: "return-received")  
		returnReceivedNotification.deliverTransactionalMessage()  
+ updateOnInspectionCompletion(): void  
	Invariant: transitions to "inspected" when warehouse completes item inspection  
+ updateOnRefundProcessing(refund: Refund): void  
	Invariant: transitions to "refund processing" when refund is initiated with payment vendor  
+ surfaceOnOrderDetail(order: Order): String  
	Invariant: return status visible on order detail in order history  

### **ReturnLabel** << ValueObject >>  

+ ReturnLabel.generate(order: Order, returnReference: String): ReturnLabel  
------  
+ returnAddress: String  
+ orderNumber: String  
+ returnReference: String  
+ carrierBarcode: String  
	Invariant: printable PDF generated when return request is submitted successfully  
	Invariant: must encode the same return reference as the return QR code  

### **ReturnQRCode** << ValueObject >>  

+ ReturnQRCode.generate(returnReference: String): ReturnQRCode  
------  
+ returnReference: String  
	Invariant: mobile-displayable code generated alongside return label for carrier drop-off  
	Invariant: encodes the same return reference as the return label so either can be used at a drop-off point  

### **InStoreReturn** << Entity >>  

+ InStoreReturn(originatingOrder: Order, storeEmployeeInitiator: Store)  
------  
+ originatingOrder: Order  
+ storeEmployeeInitiator: Store  
	Invariant: must be recorded against the original order; must route refund through the original payment vendor  
----  
+ orderLookupByOrderNumber(orderNumber: String): Order  
	Invariant: staff search by order number  
+ orderLookupByCustomerEmail(email: String): Order  
	Invariant: staff search by customer email for both account and guest orders  
+ followSameRefundRoutingInvariant(refund: Refund, payment: Payment): void  
	Invariant: routes refund through the same payment vendor as the original transaction  
	Interaction:  
		originalVendor: PaymentVendor = payment.processingVendor  
		refund.routeThroughVendor = originalVendor  
+ reflectInCustomerAccount(account: CustomerAccount, order: Order): void  
	Invariant: reflects in customer account under order detail just as online returns do  
+ supportGuestOrderReturns(orderNumber: String, guestEmail: String): Order  
	Invariant: guest order returns use order number and guest email — refund routing is order-level, not account-level  

### **ManagerOverride** << Entity >>  

+ ManagerOverride(approvingManager: String, overrideReason: String)  
------  
+ approvingManager: String  
+ overrideReason: String  
+ approvalTimestamp: DateTime  
	Invariant: approving manager and override reason recorded for audit trail  
----  
+ allowInStoreReturnToProceed(inStoreReturn: InStoreReturn, returnEligibility: ReturnEligibility): void  
	Invariant: escalation when standard return eligibility rules would block the return (e.g. outside return window, wrong item condition)  
	Invariant: requires explicit manager approval — not available on online self-service path  
	Interaction:  
		this.approvalTimestamp = now()  
		inStoreReturn.originatingOrder.provideEntryPointForReturns(returnEligibility: returnEligibility)  
+ recordForAudit(): void  
	Invariant: approving manager and override reason recorded for audit trail  

### **Restocking** << Entity >>  

+ Restocking(returnedProduct: Product, returnedQuantity: Integer, destinationStore: Store, inspectionResult: String)  
------  
+ returnedProduct: Product  
+ returnedQuantity: Integer  
+ destinationStore: Store  
+ inspectionResult: String  
	Invariant: constrained to: pass, fail  
----  
+ replenishStockAvailability(stockAvailability: StockAvailability): void  
	Invariant: only items that pass inspection are restocked; failed items are not returned to stock  
	Interaction:  
		if this.inspectionResult == "pass":  
			stockAvailability.replenish(product: this.returnedProduct, quantity: this.returnedQuantity, store: this.destinationStore)    

### references  

**Ref — Shopping cart persistence**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 13  
Extract: partial  
Part: Sentences about shopping cart persistence.  

```source  
For the shopping side, we need all the standard e-commerce functionality. A shopping cart that persists — if someone adds three things on their phone at lunch and comes back on their laptop in the evening, the cart should still be there (assuming they're logged in).  
```  

**Ref — Order confirmation and shipping**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 19  
Extract: whole  

```source  
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.  
```  

**Ref — Checkout delivery options**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentence listing delivery options.  

```source  
Checkout flow: shipping address, billing address, delivery options (standard, express, maybe same-day for local), and then payment.  
```  

**Ref — Returns and exchanges**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: whole  

```source  
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.  
```  

**Ref — Initiate Return from Order History (story-graph)**  
Source: docs/story/story-graph.json  
Locator: story "Initiate Return from Order History"  
Extract: partial  

```source  
1. WHEN the customer selects "Return" on an eligible order in Order History  
THEN the system shows which items in the order are Return Eligible  
AND the customer selects the items and quantities to return, plus a return reason  
```  

**Ref — Generate Return Label or QR Code (story-graph)**  
Source: docs/story/story-graph.json  
Locator: story "Generate Return Label or QR Code"  
Extract: partial  

```source  
1. WHEN the Return Request is submitted  
THEN the system generates a Return Label (PDF) and a Return QR Code  
AND both are shown on the return confirmation page and emailed to the customer  
```  

**Ref — Process In-Store Return (story-graph)**  
Source: docs/story/story-graph.json  
Locator: story "Process In-Store Return"  
Extract: partial  

```source  
1. WHEN a customer brings an item to the store for return  
THEN the staff dashboard provides an order lookup by order number or customer email  
AND a "Start Return" action is displayed on the matched order  
4. WHEN the item is not eligible for return (outside window, wrong condition)  
THEN the staff dashboard shows the ineligibility reason  
AND a "Manager Override" action is displayed, requiring manager approval before the return proceeds  
```  

**Ref — Increment 7 returns and refunds scope**  
Source: docs/story/thin-slicing.md  
Locator: Increment 7  
Extract: partial  

```source  
Outcome: Customers can initiate a return from their order history, get a printable label or QR code, and watch the refund land back on their original payment method. In-store returns are reflected in the customer's account too.  
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since.  
```  

### decisions made  

- Order is an Entity — identity by orderNumber. Guest and customer account placing parties both supported in Increment 4.  
- **Increment 7 refresh (slot 191):** *Return* fully elaborated from deferred stub to full lifecycle Entity. *ReturnRequest* as ValueObject (immutable submission record). *ReturnEligibility* as ValueObject (per-item evaluation). *ReturnWindow* as ValueObject (configuration-based, category-aware). *ReturnReason* as ValueObject (constrained category set). *ReturnedItems* as Entity (collection-like class managing returned subset with per-item status and restocking trigger). *ReturnStatus* as ValueObject (lifecycle state machine). *ReturnLabel* and *ReturnQRCode* as ValueObjects (separate classes — distinct format and usage context, same return reference). *InStoreReturn* as Entity (distinct staff-initiated flow with order lookup and guest support). *ManagerOverride* as Entity (escalation with audit trail). *Restocking* as Entity (post-inspection stock replenishment).  
- **Increment 4 refresh (slot 113):** OrderHistory and Reorder typed blocks; Order accepts CustomerAccount or GuestCheckout placing party; ShoppingCart account-persistent with guest cart merge; BillingAddress/ShippingAddress saved-address selection; authenticated checkout factory; `@pawplace/order-shared` order-history schemas.  
- **Increment 3 refresh (slot 87):** `ShippingAddress` and `TrackingNumber` typed blocks added; dual delivery paths preserved.  
- **Increment 2 refresh (slot 63):** `Order.fromGuestCart` factory; click-and-collect status machine retained for backward compatibility.  
- **BillingAddress** and **ShippingAddress** are ValueObjects — inline snapshots at checkout, not SavedAddress. `BillingAddress.preFillShippingAddress` and `ShippingAddress.preFillFromBilling` implement same-as-billing pre-fill.  
- **GuestCheckout** refreshed for Increment 3 — collects shipping address when standard delivery selected; billing address on every order.  
- OrderLineItem is a ValueObject — immutable snapshot of product data at order time. `snapshotFromCartItem` is the cart-to-order entry point.  
- ShoppingCart is an Entity — Increment 2 guest path keyed by `sessionId`; session-scoped only.  
- CartItem is a ValueObject — `unitPriceAtTimeOfAdding` captured at add-to-cart; `linePrice` derived.  
- DeliveryOption is a ValueObject — Increment 3 offers standard delivery and click-and-collect.  
- StandardDelivery is a subtype — sole ship-to-home option; express and same-day deferred.  
- TrackingNumber is a ValueObject — carrier reference and name; `carrierTrackingUrl` for order status page.  
- placingParty supports CustomerAccount or GuestCheckout — customerAccountId links orders for history and reorder.  
- **ReturnedItems** modeled as Entity (not a raw List) — owns the per-item status tracking, quantity constraints, value calculation, and restocking trigger behavior. The collection has lifecycle.  
- **InStoreReturn** modeled as separate Entity — distinct staff-initiated flow with order lookup, manager override, and guest-order support; not a property of Return.  
- **ManagerOverride** modeled as Entity — carries escalation behavior, explicit approval recording, and conditional availability (in-store only).  
- **ReturnLabel** and **ReturnQRCode** modeled as separate ValueObjects — each has a distinct format (PDF vs mobile code) and usage context (at home vs carrier drop-off), though both encode the same return reference.  

---  

## **Payment**  

Financial transaction handling across three integrated vendors. Owns vendor abstraction, payment method selector presentation, webhook processing, transient-error retry policy, hard-decline handling, refund routing with full customer-facing lifecycle, and saved payment method lifecycle across StripeWave, PayNova, and VaultPay.  

### **Payment** << Entity >>  

+ Payment(paymentReference: String, associatedOrder: Order, paymentAmount: Money, processingVendor: PaymentVendor)  
+ Payment.processThroughSelectedVendor(paymentReference: String, order: Order, paymentAmount: Money, vendor: PaymentVendor, selector: PaymentMethodSelector): Payment  
------  
+ paymentReference: String  
+ associatedOrderNumber: String  
	Invariant: must be associated with exactly one order  
+ paymentAmount: Money  
	Invariant: must equal the order total at time of payment  
+ currency: String  
+ paymentDate: Date  
+ paymentMethodUsed: SavedPaymentMethod  
+ paymentStatus: String  
	Invariant: lifecycle — pending → authorized → captured → settled / failed  
+ processingVendor: PaymentVendor  
	Invariant: Increment 5 — records StripeWave, PayNova, or VaultPay selected at payment method selector  
+ vendorTransactionReference: VendorTransactionReference  
+ maskedPaymentMethod: String  
----  
+ authorize(): void  
	Invariant: transitions to authorized; delegates to processingVendor  
+ capture(): void  
	Invariant: transitions from authorized to captured  
+ settle(): void  
	Invariant: transitions from captured to settled  
+ authorizeCaptureSettle(maskedPaymentMethod: String): void  
	Invariant: single-step path for StripeWave card and saved-token charges  
+ processThroughSelectedVendor(order: Order, vendor: PaymentVendor, selector: PaymentMethodSelector): Payment  
	Invariant: must not confirm order until payment confirmation succeeds  
	Interaction:  
		selectedVendor: PaymentVendor = selector.routeChargeToSelectedVendor(vendor: vendor)  
		payment: Payment = new Payment(paymentReference: generateReference(), associatedOrder: order, paymentAmount: order.orderTotal, processingVendor: selectedVendor)  
		return payment  
+ reconcileViaWebhookCallback(confirmed: Boolean, maskedPaymentMethod: String): void  
	Invariant: idempotent webhook reconciliation when customer-facing request times out — for any active vendor  
+ initiatePaymentRetryOnTransientError(transientError: TransientError, paymentRetry: PaymentRetry): PaymentRetry  
	Invariant: automatic retry only for transient error within retry window — never for hard decline  
	Interaction:  
		if transientError.originatingVendor != this.processingVendor: throw VendorMismatchError  
		return paymentRetry.recordTransientFailure(transientError: transientError, retryWindow: RetryWindow.default())  
+ surfaceHardDeclineImmediately(hardDecline: HardDecline, selector: PaymentMethodSelector): void  
	Invariant: surfaces decline reason and alternative vendor options without automatic retry  
	Interaction:  
		this.markFailed()  
		paymentRetry: PaymentRetry = PaymentRetry.forPayment(payment: this)  
		paymentRetry.recordHardDecline(hardDecline: hardDecline)  
		alternatives: List<PaymentVendor> = selector.displayAlternativesOnDecline()  
+ continuePaymentRetryInBackground(paymentRetry: PaymentRetry, order: Order): void  
	Invariant: success confirms order and fires confirmation email even when customer navigates away  
+ routeRefundThroughOriginalVendor(refund: Refund, refundStatus: RefundStatus): void  
	Invariant: refund triggered by return completion; routes through the vendor that captured the original charge  
	Invariant: refund amount must match the returned items value  
	Interaction:  
		vendor: PaymentVendor = this.processingVendor  
		vendor.processRefund(refund: refund)  
		refundStatus.transitionToProcessing(vendor: vendor)  
+ initiateRefundRetryOnVendorFailure(refund: Refund, refundRetry: RefundRetry): RefundRetry  
	Invariant: automatic retry when vendor is temporarily unavailable; customer sees "refund processing" — not "refund failed"  
	Interaction:  
		refundRetry.reAttemptThroughSameVendor(refund: refund, vendor: this.processingVendor)  
		return refundRetry  

### **PaymentMethodSelector** << Service >>  

+ PaymentMethodSelector.forOrder(order: Order): PaymentMethodSelector  
------  
+ associatedOrderNumber: String  
+ selectedVendor: PaymentVendor  
+ availableVendors: List<PaymentVendor>  
	Invariant: must always offer at least StripeWave  
----  
+ presentStripeWaveCardEntry(): Boolean  
+ presentPayNovaDigitalWallet(): Boolean  
+ presentVaultPayBuyNowPayLater(): Boolean  
+ presentSavedPaymentMethods(methods: List<SavedPaymentMethod>): List<SavedPaymentMethod>  
+ preSelectDefaultPaymentMethod(defaultMethod: DefaultPaymentMethod): SavedPaymentMethod  
+ routeChargeToSelectedVendor(vendor: PaymentVendor): PaymentVendor  
	Invariant: must not confirm order until selected vendor returns payment confirmation  
+ displayAlternativesOnDecline(): List<PaymentVendor>  
	Invariant: on decline or retry exhaustion displays all vendor options without confirming order  

### **PaymentConfirmation** << ValueObject >>  

+ PaymentConfirmation.fromVendorReference(payment: Payment, vendorAssignedIdentifier: String): PaymentConfirmation  
------  
+ originatingPayment: Payment  
+ vendorConfirmationReference: VendorTransactionReference  
+ confirmationTimestamp: DateTime  
	Invariant: must arrive from the same payment vendor that initiated the charge  
----  
+ confirmAssociatedOrder(order: Order): void  
	Invariant: triggers order transition to confirmed and inventory reservation  
	Interaction:  
		order.confirmPayment(maskedPaymentMethod: payment.maskedPaymentMethod)  
		payment.recordVendorTransactionReference(reference: vendorConfirmationReference)  
+ triggerConfirmationEmail(order: Order): ConfirmationEmail  
	Invariant: confirmation email must not block order confirmation when delivery fails  

### **VendorTransactionReference** << ValueObject >>  

+ VendorTransactionReference(vendorAssignedIdentifier: String, originatingPaymentVendor: PaymentVendor)  
------  
+ vendorAssignedIdentifier: String  
+ originatingPaymentVendor: PaymentVendor  
	Invariant: enables webhook callback reconciliation and future refund routing to the correct vendor API  

### **WebhookCallback** << ValueObject >>  

+ WebhookCallback(originatingPaymentVendor: PaymentVendor, vendorPayload: String)  
------  
+ originatingPaymentVendor: PaymentVendor  
	Invariant: Increment 5 — applies uniformly across all three active vendors  
+ vendorPayload: String  
+ reconciliationStatus: String  
----  
+ reconcilePendingPayment(payment: Payment): void  
	Invariant: must reconcile against the pending payment for exactly one order  
	Interaction:  
		confirmed: Boolean = parseVendorPayload(vendorPayload: this.vendorPayload)  
		payment.reconcileViaWebhookCallback(confirmed: confirmed, maskedPaymentMethod: maskedFromPayload)  
+ updateOrderOnSuccess(payment: Payment, order: Order): PaymentConfirmation  
	Invariant: success produces payment confirmation and confirms associated order  

### **PaymentVendor** << Entity >>  

+ PaymentVendor(vendorName: String, vendorCode: String)  
------  
+ vendorName: String  
+ vendorCode: String  
+ supportedPaymentTypes: List<String>  
+ activeStatus: Boolean  
	Invariant: Increment 5 exposes StripeWave, PayNova, and VaultPay through payment method selector  
----  
+ authorize(payment: Payment): void  
+ capture(payment: Payment): void  
+ settle(payment: Payment): void  
+ processRefund(refund: Refund): void  
	Invariant: Increment 7 — StripeWave card refunds, PayNova wallet credits, VaultPay instalment plan adjustments all routable  
+ tokenizeForSavedPaymentMethod(account: CustomerAccount): SavedPaymentMethod  
	Invariant: raw card numbers and wallet secrets never persist on customer account  

### **StripeWave : PaymentVendor** << Entity >>  

+ creditAndDebitCardProcessing: Boolean  
----  
+ receiveCardDetailsOrSavedToken(savedPaymentMethod: SavedPaymentMethod): void  
+ returnPaymentConfirmation(): PaymentConfirmation  
+ sendWebhookCallback(): WebhookCallback  
+ participateInPaymentRetry(paymentRetry: PaymentRetry, transientError: TransientError): void  
	Invariant: primary card processor since Increment 2; card entry UX unchanged from Increments 2–4  

### **PayNova : PaymentVendor** << Entity >>  

+ digitalWalletProvider: String  
----  
+ redirectOrEmbedWalletAuth(order: Order): DigitalWallet  
+ returnPaymentConfirmation(vendorConfirmationReference: String): PaymentConfirmation  
	Invariant: returns confirmation or decline reason such as insufficient balance or wallet locked  
+ savePayNovaWalletToken(account: CustomerAccount, vendorToken: String): SavedPaymentMethod  
	Invariant: stores vendor token only — never wallet secrets  
+ participateInPaymentRetry(paymentRetry: PaymentRetry, transientError: TransientError): void  
	Invariant: retries through same PayNova session on transient error  

### **VaultPay : PaymentVendor** << Entity >>  

+ buyNowPayLaterChannel: String  
----  
+ redirectOrEmbedBnplFlow(order: Order): BuyNowPayLater  
+ performEligibilityCheck(order: Order): EligibilityCheck  
+ presentInstalmentPlan(eligibility: EligibilityCheck): InstalmentPlan  
+ returnPaymentConfirmation(vendorConfirmationReference: String, instalmentPlan: InstalmentPlan): PaymentConfirmation  
	Invariant: declines are VaultPay decision — PawPlace surfaces unavailability and offers StripeWave and PayNova alternatives  
+ saveVaultPayIdentityToken(account: CustomerAccount, vendorToken: String): SavedPaymentMethod  
	Invariant: pre-fills VaultPay identity but still requires eligibility check each transaction  
+ participateInPaymentRetry(paymentRetry: PaymentRetry, transientError: TransientError): void  
	Invariant: retries through same VaultPay session on transient error  

### **DigitalWallet** << ValueObject >>  

+ DigitalWallet(channel: String)  
------  
+ mobileWalletCredentialsChannel: String  
	Invariant: authorises payment through PayNova wallet credentials rather than typed card details  
----  
+ cancel(): void  
	Invariant: cancel before authorisation leaves order pending and other vendors selectable  

### **BuyNowPayLater** << ValueObject >>  

+ BuyNowPayLater(channel: String)  
------  
+ installmentPaymentChannel: String  
	Invariant: requires eligibility check and customer acceptance of instalment plan before payment confirmation  

### **EligibilityCheck** << ValueObject >>  

+ EligibilityCheck(creditAssessmentResult: String, transactionEligible: Boolean)  
------  
+ creditAssessmentResult: String  
+ transactionEligible: Boolean  
	Invariant: performed by VaultPay during BNPL checkout; approval is per transaction — not permanent  
----  
+ isHardDecline(): Boolean  
	Invariant: ineligible result must not trigger automatic payment retry  

### **InstalmentPlan** << ValueObject >>  

+ InstalmentPlan(installmentCount: Integer, installmentAmount: Money, installmentSchedule: List<Date>, instalmentReference: String)  
------  
+ installmentCount: Integer  
+ installmentAmount: Money  
+ installmentSchedule: List<Date>  
+ instalmentReference: String  
	Invariant: VaultPay-approved schedule presented before BNPL capture; PawPlace records reference on payment  

### **TransientError** << ValueObject >>  

+ TransientError(failureType: String, originatingVendor: PaymentVendor)  
------  
+ failureType: String  
+ retryable: Boolean  
	Invariant: vendor timeout, HTTP 5xx, or network interruption  
----  
+ triggersAutomaticPaymentRetry(): Boolean  
	Invariant: no manual customer action required during automatic retries within retry window  

### **HardDecline** << ValueObject >>  

+ HardDecline(declineReason: String, originatingVendor: PaymentVendor)  
------  
+ declineReason: String  
+ retryable: Boolean  
	Invariant: insufficient funds, card or wallet blocked, fraud flag, or BNPL eligibility failure  
	Invariant: must not trigger automatic payment retry  
----  
+ mustNotTriggerAutomaticRetry(): Boolean  
+ surfaceImmediatelyAtSelector(selector: PaymentMethodSelector): List<PaymentVendor>  
	Invariant: PawPlace surfaces decline reason and alternative payment vendor options immediately  

### **PaymentRetry** << Entity >>  

+ PaymentRetry.forPayment(payment: Payment): PaymentRetry  
------  
+ orderNumber: String  
+ processingVendor: PaymentVendor  
+ attemptCount: Integer  
+ retryStatus: String  
+ backgroundContinuationFlag: Boolean  
+ startedAt: DateTime  
----  
+ recordTransientFailure(transientError: TransientError, retryWindow: RetryWindow): PaymentRetry  
	Invariant: must always use same payment vendor as original attempt  
	Interaction:  
		attemptCount: Integer = this.attemptCount + 1  
		exhausted: Boolean = retryWindow.isExhausted(attemptCount: attemptCount, startedAt: this.startedAt)  
		this.retryStatus = exhausted ? "exhausted" : "retrying"  
		this.backgroundContinuationFlag = this.retryStatus == "retrying"  
		return this  
+ recordHardDecline(hardDecline: HardDecline): PaymentRetry  
	Invariant: must never retry a hard decline  
+ reAttemptThroughSameVendor(): PaymentVendor  
+ runWithinRetryWindow(retryWindow: RetryWindow): Boolean  
+ confirmOrderOnSuccess(order: Order, confirmation: PaymentConfirmation): void  
	Invariant: background success confirms order and fires confirmation email when customer navigates away  
+ notifyOnExhaustion(selector: PaymentMethodSelector): List<PaymentVendor>  
	Invariant: on exhaustion returns payment method selector with all vendor options  

### **RetryWindow** << ValueObject >>  

+ RetryWindow(maximumAttemptCount: Integer, timeLimit: Duration)  
------  
+ maximumAttemptCount: Integer  
+ timeLimit: Duration  
	Invariant: exhaustion ends automatic retries and surfaces manual alternatives at payment method selector  
----  
+ isExhausted(attemptCount: Integer, startedAt: DateTime): Boolean  

### **Refund** << Entity >>  

+ Refund(refundReference: String, originatingReturn: Return, refundAmount: Money, routeThroughVendor: PaymentVendor)  
------  
+ refundReference: String  
+ originatingReturn: Return  
	Invariant: triggered by return completion — inspection pass or auto-approval  
+ refundAmount: Money  
	Invariant: must match the returned items value  
+ refundDate: Date  
+ routeThroughVendor: PaymentVendor  
	Invariant: must always route through the payment vendor that handled the original transaction  
+ vendorRefundApiRoute: String  
	Invariant: StripeWave card refunds, PayNova wallet credits, VaultPay instalment plan adjustments  
+ << composition >> refundStatus: RefundStatus  
----  
+ routeThroughOriginalVendor(vendorTransactionReference: VendorTransactionReference): void  
	Invariant: must always route through the payment vendor that handled the original transaction  
	Interaction:  
		vendor: PaymentVendor = this.routeThroughVendor  
		vendor.processRefund(refund: this)  
+ handleVendorFailure(refundRetry: RefundRetry): void  
	Invariant: vendor failure queued for automatic re-attempt; customer sees "refund processing" — never "refund failed"  
	Interaction:  
		refundRetry.reAttemptThroughSameVendor(refund: this, vendor: this.routeThroughVendor)  
+ escalateOnRetryExhaustion(refundStatus: RefundStatus, notification: Notification): void  
	Invariant: transitions refund status to "requires review" and triggers refund under review notification  
	Interaction:  
		refundStatus.transitionToRequiresReview(refundRetry: RefundRetry.forRefund(refund: this))  
		refundUnderReviewNotification: Notification = Notification.createTransactional(triggeredBy: refundStatus, recipient: this.originatingReturn.initiatingParty, type: "refund-under-review")  
		refundUnderReviewNotification.deliverTransactionalMessage()  
+ invisibleVendorMechanics(): String  
	Invariant: customer sees only refund status and the payment method the credit lands on — not vendor mechanics  

### **RefundStatus** << ValueObject >>  

+ RefundStatus.processing(): RefundStatus  
------  
+ lifecycleState: String  
	Invariant: lifecycle — processing → completed or requires review  
+ timingExpectationNote: String  
	Invariant: shows "refunds typically take X business days depending on your payment provider" while in processing state  
	Invariant: must not show "refund failed" to the customer — processing or requires review are the only non-success states visible  
----  
+ transitionToProcessing(vendor: PaymentVendor): void  
	Invariant: transitions when return inspection passes and refund request is sent to payment vendor  
+ transitionToCompleted(vendor: PaymentVendor, notification: Notification): void  
	Invariant: transitions when payment vendor confirms credit has been issued; triggers refund completed notification  
	Interaction:  
		this.lifecycleState = "completed"  
		refundCompletedNotification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.recipient, type: "refund-completed")  
		refundCompletedNotification.deliverTransactionalMessage()  
+ transitionToRequiresReview(refundRetry: RefundRetry): void  
	Invariant: transitions when refund retry exhausts without vendor confirmation; triggers refund under review notification  
+ surfaceOnOrderDetail(order: Order): String  
	Invariant: refund status visible on order detail in order history  

### **RefundRetry** << Entity >>  

+ RefundRetry.forRefund(refund: Refund): RefundRetry  
------  
+ attemptCount: Integer  
+ retryStatus: String  
+ configuredWindow: Duration  
----  
+ reAttemptThroughSameVendor(refund: Refund, vendor: PaymentVendor): void  
	Invariant: must always use the same payment vendor as the original refund attempt  
	Invariant: automatic retry when vendor is temporarily unavailable (timeout, API error)  
	Interaction:  
		this.attemptCount = this.attemptCount + 1  
		vendor.processRefund(refund: refund)  
		this.retryStatus = "retrying"  
+ transitionRefundStatusOnExhaustion(refundStatus: RefundStatus): void  
	Invariant: on exhaustion transitions refund status to "requires review"  
	Invariant: must not surface vendor failure to customer as "refund failed"  
	Interaction:  
		this.retryStatus = "exhausted"  
		refundStatus.transitionToRequiresReview(refundRetry: this)  
+ isExhausted(): Boolean  
	Invariant: true when attempt count exceeds configured window limit  

### **SavedPaymentMethod** << Entity >>  

+ SavedPaymentMethod(owningCustomerAccount: CustomerAccount, vendorTokenReference: String, processingVendor: PaymentVendor)  
------  
+ owningCustomerAccount: CustomerAccount  
	Invariant: must be owned by exactly one customer account; not exposed to guest checkout  
+ customerAssignedLabel: String  
+ vendorTokenReference: String  
+ processingVendor: PaymentVendor  
+ lastFourDigits: String  
+ cardBrand: String  
+ walletProvider: String  
+ expiryMonth: Integer  
+ expiryYear: Integer  
	Invariant: Increment 5 — supports StripeWave card tokens, PayNova wallet tokens, and VaultPay identity tokens  
	Invariant: vendor token must remain valid or be marked expired for method to be usable  
+ dateAdded: Date  
+ defaultPaymentMethodFlag: Boolean  
----  
+ saveDuringCheckoutOnOptIn(account: CustomerAccount, vendor: PaymentVendor, tokenReference: String): SavedPaymentMethod  
+ selectAtCheckout(): SavedPaymentMethod  
	Invariant: expired vendor token marked and not silently charged  
+ markExpired(): void  
+ addAndSoftDelete(action: PaymentMethodAction): void  
	Invariant: deletion must not break refund routing on past orders  

### **DefaultPaymentMethod** << ValueObject >>  

+ DefaultPaymentMethod(preSelectedMethod: SavedPaymentMethod)  
------  
+ preSelectedSavedPaymentMethod: SavedPaymentMethod  
	Invariant: pre-selected at payment method selector for logged-in customers  
----  
+ assignedOnFirstSave(method: SavedPaymentMethod, account: CustomerAccount): DefaultPaymentMethod  
	Invariant: first saved method becomes default unless customer changes default in account settings  

**Implementation packaging (Increment 5, slot 139).** `@pawplace/payment-shared`: `Payment`, `PaymentMethodSelector`, `PaymentConfirmation`, `VendorTransactionReference`, `PaymentRetry`, `RetryWindow`, `TransientError`, `HardDecline`, `EligibilityCheck`, `InstalmentPlan`, `SavedPaymentMethod`; Zod schemas in `payment-vendor.schema.ts`, `payment-retry.schema.ts`, `saved-payment-method.schema.ts`. Server tier: `PaymentService` vendor router, `PaymentRetryService`, `IPaymentVendorAdapter` implementations for StripeWave, PayNova, VaultPay. Increment 4 `@pawplace/customer-account-shared` saved-payment `vendor` discriminator consumed by multi-vendor charge path (slot 137 rework).

### references  

**Ref — Payment vendors and checkout**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 17  
Extract: partial  
Part: Sentences describing the three payment vendors and their integration.  

```source  
We're integrating with three payment vendors out of the box: **StripeWave**, **PayNova**, and **VaultPay**. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases (someone dropping two hundred quid on a premium cat tree might appreciate splitting it into instalments). The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.  
```  

**Ref — Retry Failed Payment (story-graph)**  
Source: docs/story/story-graph.json  
Locator: story "Retry Failed Payment"  
Extract: partial  

```source  
WHEN a Payment fails due to a Transient Error (timeout, vendor 5xx, network issue)  
THEN the system automatically retries the payment through the same Payment Vendor  
AND the customer sees a "retrying payment" indicator — no manual action required  
```  

**Ref — Returns and refund routing**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 25  
Extract: partial  
Part: Sentences about refund routing through original payment vendor.  

```source  
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.  
```  

**Ref — Route Refund through Original Payment Vendor (story-graph)**  
Source: docs/story/story-graph.json  
Locator: story "Route Refund through Original Payment Vendor"  
Extract: partial  

```source  
1. WHEN the returned item is received and inspected (or the return is auto-approved)  
THEN the system initiates a Refund through the Original Payment Vendor for that order  
AND the refund amount matches the returned items' value  
5. WHEN the refund request to the vendor fails (vendor downtime, API error)  
THEN the refund is queued for retry  
AND the customer sees "refund processing" status — not "refund failed"  
BUT if retries exhaust, the return status escalates to "refund requires manual review"  
```  

**Ref — Track Refund Status (story-graph)**  
Source: docs/story/story-graph.json  
Locator: story "Track Refund Status"  
Extract: partial  

```source  
1. WHEN the customer views the Order Detail for a returned order  
THEN the Refund Status is visible: processing, completed, or requires review  
2. WHEN the Refund is completed by the vendor  
THEN the Refund Status transitions to Completed  
AND the customer receives a "refund completed" notification (email)  
```  

**Ref — Increment 7 refund routing design rule**  
Source: docs/story/thin-slicing.md  
Locator: Increment 7  
Extract: partial  

```source  
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since.  
```  

### decisions made  

- **Increment 7 refresh (slot 191):** *Refund* fully activated from Increment 5 foundation to full customer-facing lifecycle. *RefundStatus* introduced as its own ValueObject — carries distinct lifecycle rules (processing → completed or requires review), customer-facing visibility behavior, timing expectation notes, and notification triggers. *RefundRetry* introduced as its own Entity — operates on a different lifecycle event (post-return inspection, not checkout) and carries its own exhaustion semantics (escalation to "requires review" vs. returning the *payment method selector*). *Payment* responsibility `routeRefundThroughOriginalVendor` activated — supersedes "foundation for Increment 7" language. *PaymentVendor* responsibility `processRefund` activated — all three vendor refund APIs routable.  
- **Increment 5 refresh (slot 139):** StripeWave, PayNova, and VaultPay all active — Increment 4 sole-vendor deferral superseded for this scope.  
- **PaymentMethodSelector** introduced as Service — owns multi-vendor presentation, default pre-selection, and decline or retry-exhaustion fallback UX distinct from any single vendor integration.  
- **PaymentRetry** and **RetryWindow** typed blocks — transient error schedules automatic retry through same vendor; hard decline never schedules retry.  
- **VendorTransactionReference** extracted — PayNova and VaultPay confirmations carry vendor-assigned identifiers for webhook reconciliation.  
- **EligibilityCheck** and **InstalmentPlan** — VaultPay BNPL per-transaction eligibility; saved VaultPay identity still re-checks each checkout.  
- **SavedPaymentMethod.processingVendor** typed as PaymentVendor — aligns with customer-account `vendor` discriminator and slot 137 rework charge path.  
- **RefundStatus** modeled as ValueObject (immutable state transition) rather than a simple string on Refund — carries lifecycle rules, notification triggers, and customer-facing visibility constraints.  
- **RefundRetry** modeled as Entity — while the resilience pattern parallels *PaymentRetry*, it carries its own exhaustion semantics (escalation to "requires review") and operates at a different lifecycle point.  
- **Increment 2 refresh (slot 63):** `authorizeCaptureSettle` and webhook reconciliation preserved on Payment; StripeWave card UX unchanged.  
- **Increment 4 refresh (slot 113):** SavedPaymentMethod entity and schemas extended for multi-vendor tokens.  

---  

## **Notification**  

The communication layer delivering transactional and marketing messages. Transactional notifications are event-driven and mandatory; marketing notifications are opt-in only. Increment 7 activates three return/refund notification types: ReturnReceivedNotification (return received at warehouse), RefundCompletedNotification (vendor confirms credit), RefundUnderReviewNotification (retry exhaustion escalation). All support both customer account email and guest email paths, and follow the same retry-on-failure pattern as prior transactional notifications.  

### **Notification** << Entity >>  

+ Notification.createTransactional(triggeredBy: Object, recipient: CustomerAccount, type: String): Notification  
+ Notification.createTransactional(triggeredBy: Object, recipient: String, type: String): Notification  
+ Notification.createMarketing(recipient: CustomerAccount, communicationPreferences: CommunicationPreferences): Notification  
------  
+ notificationSubject: String  
+ notificationBody: String  
+ notificationChannel: String  
+ sentDate: DateTime  
+ deliveryStatus: String  
+ triggeringEvent: Object  
+ recipient: CustomerAccount  
	Invariant: every notification must have a deliverable target (verified account email or guest checkout email)  
	Invariant: confirmation email fires unconditionally on order confirmation; shipping notification fires when tracking number recorded on ship-to-home order  
	Invariant: appointment confirmation email fires on booking; appointment reminder fires the day before each upcoming appointment; pet-adopted-before-visit notification fires when a booked pet transitions to adopted; visit follow-up notification fires when follow-up date arrives and action is not none  
	Invariant: return received notification fires when return status transitions to "received"; refund completed notification fires when refund status transitions to "completed"; refund under review notification fires when refund status transitions to "requires review"  
+ recipientGuestEmail: String  
	Invariant: return and refund notifications support both customer account email and guest email paths  
----  
+ deliverTransactionalMessage(): void  
	Invariant: transactional notifications must always fire for lifecycle events; email delivery failure must not block order confirmation, order status transition, appointment creation, appointment status, pet lifecycle event recording, visit outcome recording, return processing, or refund status transition  
	Interaction:  
		this.deliveryStatus = "queued"  
		send(channel: this.notificationChannel, to: this.recipient.emailAddress, subject: this.notificationSubject, body: this.notificationBody)  
		this.deliveryStatus = "sent"  
		this.sentDate = now()  
+ deliverMarketingMessage(communicationPreferences: CommunicationPreferences): void  
	Invariant: marketing notifications must never fire without explicit opt-in; marketing deferred in Increment 3  
	Interaction:  
		sendOrSuppress: Boolean = checkCommunicationPreferences(preferences: communicationPreferences, notificationType: this.notificationChannel)  
		if sendOrSuppress == false: this.deliveryStatus = "suppressed"; return  
		send(channel: this.notificationChannel, to: this.recipient.emailAddress, subject: this.notificationSubject, body: this.notificationBody)  
		this.deliveryStatus = "sent"  
		this.sentDate = now()  
- checkCommunicationPreferences(preferences: CommunicationPreferences, notificationType: String): Boolean  
	Invariant: checked before every marketing send, producing a send-or-suppress decision  
- send(channel: String, to: String, subject: String, body: String): void  
	Invariant: dispatches the message through the appropriate channel  

### **ConfirmationEmail** << ValueObject >>  

Initialisation: composed when order payment confirms  
------  
+ originatingOrder: Order  
+ recipientGuestEmail: String  
+ recipientCustomerAccountEmail: CustomerAccount  
+ maskedPaymentMethodDisplay: String  
	Invariant: vendor-appropriate mask — last four digits and card brand for StripeWave, wallet provider for PayNova, BNPL label for VaultPay  
+ pickupStoreAddress: String  
+ pickupStoreOperatingHours: String  
+ shippingAddressSnapshot: ShippingAddress  
	Invariant: shown for standard delivery orders; pickup store address shown for click-and-collect orders  
+ orderStatusPageLink: String  
----  
+ deliverOnPaymentConfirmation(): void  
	Invariant: must not block order confirmation when delivery fails  

### **ShippingNotification** << ValueObject >>  

Initialisation: composed when tracking number recorded on ship-to-home order  
------  
+ originatingOrder: Order  
+ itemsShipped: List<OrderLineItem>  
+ carrierName: String  
+ trackingNumber: TrackingNumber  
+ estimatedDeliveryWindow: String  
+ recipientGuestEmail: String  
+ recipientCustomerAccountEmail: CustomerAccount  
+ orderStatusPageLink: String  
----  
+ deliverWhenTrackingNumberRecorded(): void  
	Invariant: does not fire without a tracking number; must not block order status transition to shipped when delivery fails  

### **AppointmentConfirmationEmail** << ValueObject >>  

Initialisation: composed when appointment booking confirms  
------  
+ bookingAppointment: Appointment  
	Invariant: must include pet name, store address, date and time, and optional visit note  
+ recipientCustomerEmail: CustomerAccount  
----  
+ deliverOnAppointmentConfirmation(): void  
	Invariant: must not block appointment creation when email delivery fails  

### **AppointmentReminder** << ValueObject >>  

Initialisation: composed 24 hours before the appointment time  
------  
+ reminderAppointment: Appointment  
	Invariant: sent 24 hours before the appointment time; includes pet name, store address, date and time, and visit note  
+ recipientCustomerEmail: CustomerAccount  
----  
+ deliver(): void  
	Invariant: no reminder sent for cancelled or no-show appointments  
+ suppressWhenAppointmentCancelled(appointment: Appointment): Boolean  
	Invariant: no reminder sent for cancelled or no-show appointments  
+ suppressWhenPetAdopted(appointment: Appointment): Boolean  
	Invariant: pet-adopted-before-visit notification takes precedence; reminder suppressed  

### **PetAdoptedBeforeVisitNotification** << ValueObject >>  

Initialisation: composed when a pet transitions to adopted with pending appointments  
------  
+ adoptedPet: Pet  
+ affectedAppointment: Appointment  
	Invariant: one notification per affected customer with a pending appointment for the adopted pet  
+ recipientCustomerEmail: CustomerAccount  
----  
+ deliver(): void  
	Invariant: notification includes options to cancel the appointment or browse other available pets  
+ recordNotificationStatus(appointment: Appointment): void  
	Invariant: notified or not-yet-notified status visible per appointment on the staff incoming appointments view  
	Interaction:  
		appointment.notificationStatus = "notified"  
+ suppressWhenNoPendingAppointments(pet: Pet, appointments: List<Appointment>): Boolean  
	Invariant: no notification sent if no pending appointments exist for the adopted pet  

### **VisitFollowUpNotification** << ValueObject >>  

Initialisation: composed when follow-up date arrives and follow-up action type is not none  
------  
+ sourceAppointment: Appointment  
+ triggeringFollowUpAction: FollowUpAction  
	Invariant: sent when follow-up date arrives and follow-up action type is not none  
+ recipientCustomerEmail: CustomerAccount  
----  
+ deliver(): void  
+ suppressWhenPetAdoptedBeforeFollowUp(pet: Pet): Boolean  
	Invariant: pet-adopted-before-visit notification takes precedence if pet adopted before follow-up date  
+ suppressWhenFollowUpActionNone(action: FollowUpAction): Boolean  
	Invariant: no notification sent when follow-up action type is none  

### **ReturnReceivedNotification** << ValueObject >>  

Initialisation: composed when return status transitions to "received"  
------  
+ originatingOrder: Order  
+ returnedItemsSummary: String  
	Invariant: includes order number, returned items summary, and note that inspection and refund processing are underway  
+ recipientCustomerAccountEmail: CustomerAccount  
+ recipientGuestEmail: String  
----  
+ deliverOnReturnStatusReceived(returnStatus: ReturnStatus): void  
	Invariant: fires when return status transitions to "received"; must not block return processing on delivery failure  
+ queueForRetryOnFailure(): void  

### **RefundCompletedNotification** << ValueObject >>  

Initialisation: composed when refund status transitions to "completed"  
------  
+ refundedAmount: Money  
+ paymentMethodReturnedTo: String  
	Invariant: includes refunded amount and the payment method the credit was returned to (masked card, wallet, or BNPL adjustment)  
+ recipientCustomerAccountEmail: CustomerAccount  
+ recipientGuestEmail: String  
----  
+ deliverOnRefundStatusCompleted(refundStatus: RefundStatus): void  
	Invariant: fires when refund status transitions to "completed"; must not fire before vendor confirmation  
+ queueForRetryOnFailure(): void  

### **RefundUnderReviewNotification** << ValueObject >>  

Initialisation: composed when refund status transitions to "requires review"  
------  
+ returnAndOrderReference: String  
+ supportGuidance: String  
	Invariant: includes guidance to contact support and a reference to the return and order details  
+ recipientCustomerAccountEmail: CustomerAccount  
+ recipientGuestEmail: String  
----  
+ deliverOnRefundStatusRequiresReview(refundStatus: RefundStatus, refundRetry: RefundRetry): void  
	Invariant: fires when refund status transitions to "requires review"; must not fire while refund retry is still active  
+ queueForRetryOnFailure(): void  

### **NotificationPreferences** << ValueObject >>  

Initialisation: mirrors CommunicationPreferences stored on CustomerAccount — read-only projection  
------  
+ promotionalOptIn: Boolean  
+ restockAlertsOptIn: Boolean  
+ petCareTipsOptIn: Boolean  
+ eventNotificationsOptIn: Boolean  

### **RestockAlert** << Entity >>  

+ RestockAlert(monitoredProduct: Product, monitoringCustomerAccount: CustomerAccount)  
------  
+ monitoredProduct: Product  
	Invariant: monitors a specific product the customer has previously purchased  
+ monitoringCustomerAccount: CustomerAccount  
+ lastPurchaseDate: Date  
+ averagePurchaseInterval: Integer  
+ nextExpectedReorderDate: Date  
----  
+ fireOnPurchaseFrequencySignal(): void  
	Invariant: fires when the current date approaches or passes the next expected reorder date  
	Interaction:  
		if today() >= this.nextExpectedReorderDate:  
			isOptedIn: Boolean = this.monitoringCustomerAccount.communicationPreferences.restockAlertsOptIn  
			if isOptedIn:  
				notification: Notification = Notification.createTransactional(triggeredBy: this, recipient: this.monitoringCustomerAccount, type: "restock-alert")  
				notification.deliverTransactionalMessage()  
+ recalculateInterval(orderHistory: List<Order>): void  
	Invariant: updates averagePurchaseInterval and nextExpectedReorderDate from latest order data  

### references  

**Ref — Email and notification system**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 21  
Extract: whole  

```source  
We want a proper **email and notification system**. There's the transactional stuff — order confirmations, shipping updates, appointment reminders. But beyond that, we want a marketing email list that people can opt into. New product announcements, sales, "your dog's birthday is coming up" type personalisation if we have that data. There should be clear preference management so people can choose what they get: promotional emails, restock alerts for products they've bought before, pet care tips, event notifications for in-store things like adoption days or training workshops.  
```  

**Ref — Increment 6 transactional notification stories**  
Source: docs/story/thin-slicing.md  
Locator: Increment 6  
Extract: partial  

```source  
Stories: Send Appointment Reminder (transactional), Send Pet Adopted Before Visit Notification (transactional),  
Send Visit Follow-Up Notification (transactional)  
```  

**Ref — Send Return and Refund Status Update (story-graph)**  
Source: docs/story/story-graph.json  
Locator: story "Send Return and Refund Status Update"  
Extract: partial  

```source  
1. WHEN the return is received and processing begins  
THEN the system sends a "return received" notification to the customer  
2. WHEN the refund is completed by the vendor  
THEN the system sends a "refund completed" notification with the refunded amount and the payment method it was returned to  
3. WHEN the refund requires manual review (vendor failure, policy exception)  
THEN the system sends a "refund under review" notification with guidance to contact support if needed  
4. WHEN the email delivery system is temporarily unavailable  
THEN the notification is queued for retry  
AND the return/refund status is still updated in the system (notification failure does not block processing)  
```  

**Ref — Increment 7 return notification stories**  
Source: docs/story/thin-slicing.md  
Locator: Increment 7  
Extract: partial  

```source  
Stories: Send Return and Refund Status Update (transactional)  
```  

### decisions made  

- Notification is an Entity — each notification has identity and a lifecycle (queued → sent → delivered / bounced / failed / suppressed).  
- Notification uses factory methods (createTransactional, createMarketing) rather than a public constructor — creation depends on the notification type and involves different validation paths.  
- **Increment 7 refresh (slot 191):** Three return/refund notification types introduced as ValueObjects: ReturnReceivedNotification (triggered when *return status* transitions to "received"; includes order number and returned items summary), RefundCompletedNotification (triggered when *refund status* transitions to "completed"; includes refunded amount and masked payment method), RefundUnderReviewNotification (triggered when *refund status* transitions to "requires review" after *refund retry* exhaustion; includes support guidance). All three support both *customer account* email and *guest email* recipient paths — returns can be initiated from guest orders via *in-store return*. All three follow the same retry-on-failure pattern: delivery failure queued for retry, must not block return processing or refund status transition. Notification `recipientGuestEmail` property added to support the dual-path.  
- **Increment 6 refresh (slot 165):** Four appointment notification subtypes introduced as ValueObjects: AppointmentConfirmationEmail (triggered on booking confirmation; must not block appointment creation on failure), AppointmentReminder (24-hour pre-appointment trigger; suppressed when cancelled, no-show, or pet adopted), PetAdoptedBeforeVisitNotification (triggered when pet adopted with pending appointments; includes cancel and browse options; notification status visible to staff), VisitFollowUpNotification (triggered on follow-up date when action type is not none; suppressed if pet adopted before follow-up date). All four follow the same retry-on-failure pattern as prior transactional notifications.  
- **Increment 4 refresh (slot 113):** Notification recipient includes customer account email for logged-in orders; EmailVerification added as transactional trigger; verification email retry must not block registration confirmation.  
- **Increment 3 refresh (slot 87):** ConfirmationEmail and ShippingNotification typed blocks added; guest email recipient; shipping address on confirmation for standard delivery.  
- NotificationPreferences is a ValueObject — mirrors CommunicationPreferences. In practice this is a read-only projection of the CommunicationPreferences stored on CustomerAccount. The two CRC classes (Notification Preferences and Communication Preferences) have been consolidated — CommunicationPreferences is the source of truth, NotificationPreferences is the consumption view.  
- RestockAlert is an Entity — it tracks a specific product × customer pairing over time with mutable interval data.  
- checkCommunicationPreferences is a private helper — the external operation is deliverMarketingMessage which encapsulates the send-or-suppress decision.  
- triggeringEvent is typed as Object — it could be Order, Appointment, Pet, Refund, RefundStatus, ReturnStatus, or StockAvailability. This avoids a dependency magnet but means the caller must provide the right type.  
- Delivery status lifecycle: queued → sent → delivered / bounced / failed (transactional) or suppressed (marketing with opt-out).  
- Appointment notification types do not have a guest email path — appointment booking is account-gated in Increment 6; all appointment notification recipients are customer account email holders.  
- Return and refund notification types DO have a guest email path — returns can be initiated from guest orders via in-store return or via online return with guest email.  

---  

# Boundary Domain  

### **Content** << ValueObject >> *(owned by: Content Management — future module)*  

Initialisation: created externally by the content management system; PawPlace receives published content  
------  
+ contentTitle: String  
+ publicationDate: Date  
+ contentBody: String  
+ contentAuthor: String  
----  
+ publishedContentSurface(): void  
	Invariant: only published content is visible to PawPlace; authoring and versioning are external concerns  

### **StoreDashboard** << Service >> *(owned by: Store Operations — future module)*  

Initialisation: stateless service — surfaces data from core domain classes  
------  
+ inventoryLevelsSurface: List<StockAvailability>  
+ incomingAppointmentsSurface: List<Appointment>  
+ petProfileEditSurface: List<Pet>  
+ clickAndCollectFulfillmentQueue: List<ClickAndCollect>  
+ inStoreReturnLookup: List<Order>  
	Invariant: Increment 7 — staff search by order number or customer email, view return eligibility, initiate return, and invoke manager override when needed  
	Invariant: data and rules owned by Order; presentation owned by Store Operations  
----  
+ consumeEventsAndData(orders: List<Order>, appointments: List<Appointment>, pets: List<Pet>, products: List<Product>): void  
	Invariant: Store Employee handles day-to-day operations; Store Owner has business oversight; Admin is platform-level (content publishing)  

### references  

**Ref — Content and blog**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 33  
Extract: whole  

```source  
Finally, content. We should have space for blog posts or guides — "How to introduce a new cat to your household," "Best food for senior dogs," that kind of thing. It builds trust, helps with SEO, and gives us something to put in those marketing emails. Maybe eventually a community element — Q&A, forums — but that's probably phase two.  
```  

**Ref — Admin dashboard**  
Source: external-context/requirements-chat-with-product-owner.md  
Locator: line 29  
Extract: partial  
Part: Sentences describing the admin dashboard capabilities.  

```source  
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.  
```  

### decisions made  

- Content is a ValueObject — PawPlace receives immutable published content from an external CMS. No mutable lifecycle within this boundary.  
- StoreDashboard (renamed from Admin Dashboard) is a Service — stateless, surfaces data from core domain classes. No identity of its own.  
- Three actor roles interact with the dashboard: Store Employee (operations), Store Owner (business oversight), Admin (content publishing). This is an access-control concern, not a domain-model distinction — all three consume the same data surfaces.  
- **Increment 7 refresh (slot 191):** *in-store return lookup* surface added — staff search by order number or customer email, view return eligibility, initiate return, and invoke manager override. Data and rules owned by *Order*; presentation owned by *Store Operations*.  
