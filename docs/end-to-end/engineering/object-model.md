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
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
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
Source: docs/end-to-end/exploration/stories/acceptance-criteria.md  
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
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Initiate Return from Order History"  
Extract: partial  

```source  
1. WHEN the customer selects "Return" on an eligible order in Order History  
THEN the system shows which items in the order are Return Eligible  
AND the customer selects the items and quantities to return, plus a return reason  
```  

**Ref — Generate Return Label or QR Code (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
Locator: story "Generate Return Label or QR Code"  
Extract: partial  

```source  
1. WHEN the Return Request is submitted  
THEN the system generates a Return Label (PDF) and a Return QR Code  
AND both are shown on the return confirmation page and emailed to the customer  
```  

**Ref — Process In-Store Return (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
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
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
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
Source: docs/end-to-end/discovery/stories/story-graph.json  
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
Source: docs/end-to-end/discovery/stories/story-graph.json  
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
Source: docs/end-to-end/discovery/stories/story-graph.json  
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
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
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
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
Locator: Increment 6  
Extract: partial  

```source  
Stories: Send Appointment Reminder (transactional), Send Pet Adopted Before Visit Notification (transactional),  
Send Visit Follow-Up Notification (transactional)  
```  

**Ref — Send Return and Refund Status Update (story-graph)**  
Source: docs/end-to-end/discovery/stories/story-graph.json  
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
Source: docs/end-to-end/discovery/stories/thin-slicing.md  
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


---

## increment-1 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## increment-1-walkthrough

<!-- migrated from: increments/1-walk-in-driver/engineering/object-model.md -->

---
state: walkthrough
increment_scope: Increment 1 — Walk-in driver
specification_refresh: Run 2 slot 29
prior_model: crc.md
---

# Module: PawPlace

Scope: Walk Increment 1 scenarios through `docs/end-to-end/specification/crc.md` (object model refresh deferred to Engineering). Traces six stories: *View Store Map*, *View Store List*, *Calculate Distance to Store*, *View Product Details*, *Display Real-Time Stock Availability*, *Update Product Stock Levels*.

---

# Core Domain

## **Store**

### **View Store Map — all stores visible without login**

**Purpose:** Validate *store locator* *map view* shows every active *store* at *geo-coordinates* without account.
**Concepts traced:** Store Locator, Store

#### Walk 1 — Covers: happy path (three stores)

```
locator: StoreLocator = StoreLocator.loadActiveStores()
stores: Store[] = locator.listView // collaborator load — all Store entries
map: MapView = locator.mapView
for each store in stores:
    point: MapPoint = map.positionStoreAt(store.latitude, store.longitude)
    point.makeSelectable(store)
return map
```

#### Walk 2 — Covers: visitor not logged in (no Customer Account collaborator)

```
visitor: AnonymousVisitor = session.currentVisitor()
assert visitor is not CustomerAccount
locator: StoreLocator = StoreLocator.openMapView()
// invariant: Increment 1 — no account required
return locator.mapView
```

### **Calculate Distance to Store — nearest-first when location provided**

**Purpose:** Validate *calculate distance from customer* and *sort nearest-first* on *store locator*.
**Concepts traced:** Store Locator, Store

#### Walk 1 — Covers: shared location provided

```
locator: StoreLocator = StoreLocator.loadActiveStores()
locator.sharedLocationInput = SharedLocation(lat: 51.5074, lon: -0.1278)
distances: Distance[] = []
for each store in locator.stores:
    d: Distance = locator.calculateDistanceFromCustomer(store)
    distances.add(d)
ordered: Store[] = locator.sortNearestFirst(distances)
return ordered
```

#### Walk 2 — Covers: no location — default order, no distance

```
locator: StoreLocator = StoreLocator.loadActiveStores()
// no sharedLocationInput, no postcodeInput
list: ListView = locator.listView
assert list.showsDistance == false
return list.storesInDefaultOrder()
```

### references

**Ref — Store locator**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: View Store Map / Calculate Distance stories
Extract: partial

### decisions made

- Walks use CRC responsibility names; typed signatures land in Engineering object-model slot.
- *Map view* and *list view* modeled as locator properties — walks call through Store Locator, not separate classes.

---

## **Product Catalog**

### **Display Real-Time Stock Availability — per store on product page**

**Purpose:** Validate *stock availability* reflects *stock level* per *stocking store* on *product page*.
**Concepts traced:** Product Catalog, Product, Stock Availability, Store

#### Walk 1 — Covers: in stock at one store

```
catalog: ProductCatalog = ProductCatalog.findProduct(sku: "PET-HAR-001")
product: Product = catalog.product
page: ProductPage = ProductPage.render(product)
for each availability in product.stockAvailability:
    store: Store = availability.stockingStore
    level: StockLevel = availability.stockLevel
    display: WalkInStatus = availability.perStoreWalkInAvailabilityDisplay()
    page.showAvailability(store, display)
return page
```

#### Walk 2 — Covers: out of stock everywhere — no purchase path

```
product: Product = ProductCatalog.findProduct(sku: "PET-FLT-099")
availabilities: StockAvailability[] = product.stockAvailability
assert all(a.availableToSellQuantity == 0 for a in availabilities)
page: ProductPage = ProductPage.render(product)
page.showUnavailable()
// invariant: no backorder, pre-order, or purchase option (Increment 1)
return page
```

### **Update Product Stock Levels — admin dashboard refresh**

**Purpose:** Validate *store employee* edit propagates via *refresh from store employee edit*.
**Concepts traced:** Stock Availability, Admin Dashboard (boundary), Store, Product

#### Walk 1 — Covers: accepted update at one store

```
dashboard: AdminDashboard = AdminDashboard.openStockLevelEditForm(
    store: Store.byCode("STR-001"),
    product: Product.bySku("PET-HAR-001")
)
current: StockAvailability = dashboard.loadStockAvailability()
dashboard.displayStockLevel(current.stockLevel)
dashboard.submitStockLevel(newLevel: 40)
current.refreshFromStoreEmployeeEdit(dashboard)
// available-to-sell recalculates: 40 - reserved 3 = 37
assert current.availableToSellQuantity == 37
return current
```

#### Walk 2 — Covers: cross-store isolation

```
camden: StockAvailability = StockAvailability.at(store: "STR-001", product: "PET-HAR-001")
bristol: StockAvailability = StockAvailability.at(store: "STR-002", product: "PET-HAR-001")
camden.refreshFromStoreEmployeeEdit(newLevel: 40)
assert bristol.stockLevel == 12  // unchanged
return bristol
```

### references

**Ref — Stock update**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Update Product Stock Levels
Extract: partial

### decisions made

- *Product page* has no CRC block — walk treats it as presentation composing Product + Stock Availability (matches UL).
- *Admin dashboard* is boundary — walk enters through `openStockLevelEditForm` and delegates persist to Stock Availability.
- **Slot 50:** Walk notation keeps instance-style calls; implementation uses module functions (`walkInAvailabilityLabel`, `refreshStockFromEmployeeEdit`, `updateQuantityOnHand`) exported from `@pawplace/product-catalog-shared` — see `object-model.md` Stock Availability implementation packaging.


---

## increment-2 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## increment-2-walkthrough

<!-- migrated from: increments/2-click-and-collect/engineering/object-model.md -->

---
state: walkthrough
increment_scope: Increment 2 — Click-and-collect
specification_refresh: Run 3 slot 55
prior_model: crc.md
---

# Module: PawPlace

Scope: Walk Increment 2 scenarios through `docs/end-to-end/specification/crc.md` (object model refresh deferred to Engineering). Traces eleven stories: *Add Product to Cart*, *Update Cart Quantity*, *Remove Product from Cart*, *Select Click-and-Collect Store*, *Check Out as Guest*, *Enter Billing Address*, *Select Payment Method*, *Process Card Payment via StripeWave*, *Confirm Order and Send Confirmation Email*, *Prepare Click-and-Collect Orders for Pickup*, *Fulfill Click-and-Collect Order*.

---

# Core Domain

## **Order**

Cart lifecycle from add through checkout transition. *Shopping Cart* is session-scoped and owned by *Guest Checkout* in Increment 2.

### **Add Product to Cart — merge duplicate and gate out-of-stock**

**Purpose:** Validate *merge duplicate product entries*, *validate quantities against stock*, and *gate order flow* on *stock availability*.
**Concepts traced:** Shopping Cart, Cart Item, Product, Stock Availability

#### Walk 1 — Covers: happy path — first add and quantity merge (PET-HAR-001)

```
catalog: ProductCatalog = ProductCatalog.findProduct(sku: "PET-HAR-001")
product: Product = catalog.product
availability: StockAvailability = product.stockAvailability.at(stockingStore: any)
assert availability.availableToSellQuantity == 22
cart: ShoppingCart = ShoppingCart.forGuestSession()
cartItem: CartItem = CartItem.add(
    product: product,
    quantity: 1,
    unitPriceAtTimeOfAdding: product.price  // £34.99
)
cart.mergeDuplicateProductEntries(cartItem)
cart.validateQuantitiesAgainstStock(availability, cartItem)
assert cartItem.linePrice == 34.99
assert cart.cartSubtotal == 34.99
return cart
```

#### Walk 2 — Covers: out-of-stock — gate order flow blocks add (PET-FLT-099)

```
product: Product = ProductCatalog.findProduct(sku: "PET-FLT-099")
availability: StockAvailability = product.stockAvailability.first()
assert availability.availableToSellQuantity == 0
assert availability.backorderEnabled == false
// Stock Availability.gate order flow — purchasability false
assert availability.gateOrderFlow() == blocked
// Product Page (presentation) disables add action — no Cart Item created
return availability
```

#### Walk 3 — Covers: multiple products as separate line items

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
harness: CartItem = cart.addProduct(sku: "PET-HAR-001", quantity: 1)
treats: CartItem = cart.addProduct(sku: "PET-TRT-042", quantity: 1)
assert cart.cartItems.count == 2
assert cart.cartSubtotal == 39.98
return cart
```

### **Update Cart Quantity — recalculate and reject over-stock**

**Purpose:** Validate *cart item* quantity changes, *line price* recalculation, and *validate quantities against stock*.
**Concepts traced:** Shopping Cart, Cart Item, Stock Availability

#### Walk 1 — Covers: quantity increase recalculates subtotal

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
item: CartItem = cart.cartItems.bySku("PET-HAR-001")  // qty 2, line £69.98
item.quantity = 3
item.linePrice = item.unitPriceAtTimeOfAdding * item.quantity  // £104.97
cart.validateQuantitiesAgainstStock(
    availability: StockAvailability.forProduct("PET-HAR-001"),
    cartItem: item
)
assert cart.cartSubtotal == 104.97
return cart
```

#### Walk 2 — Covers: quantity exceeds available-to-sell — rejected

```
item: CartItem = cart.cartItems.bySku("PET-HAR-001")  // qty 2
availability: StockAvailability = StockAvailability.forProduct("PET-HAR-001")
assert availability.availableToSellQuantity == 22
// Shopping Cart.validate quantities against stock — invariant: qty must not exceed available-to-sell
result: ValidationResult = cart.validateQuantitiesAgainstStock(availability, item, proposedQty: 25)
assert result.rejected == true
assert item.quantity == 2  // unchanged
return result
```

#### Walk 3 — Covers: quantity zero removes item (invariant: zero equivalent to removal)

```
item: CartItem = cart.cartItems.bySku("PET-TRT-042")
item.quantity = 0
cart.removeCartItem(item)
assert cart.cartSubtotal == 0.00
return cart
```

### **Remove Product from Cart — line removal and empty cart**

**Purpose:** Validate *cart item* removal and *cart subtotal* recalculation.
**Concepts traced:** Shopping Cart, Cart Item

#### Walk 1 — Covers: remove one of two items

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
// PET-HAR-001 qty 1 £34.99 + PET-TRT-042 qty 2 £9.98 → subtotal £44.97
cart.removeCartItem(cart.cartItems.bySku("PET-HAR-001"))
assert cart.cartSubtotal == 9.98
assert cart.cartItems.count == 1
return cart
```

#### Walk 2 — Covers: last item removed — checkout inaccessible

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
cart.removeCartItem(cart.cartItems.only())
assert cart.cartItems.isEmpty()
// invariant: transition to checkout requires at least one cart item
assert cart.transitionToCheckout() == blocked
return cart
```

### **Session-scoped cart — no cross-session persistence**

**Purpose:** Validate *shopping cart* session scope for *guest checkout* owning party.
**Concepts traced:** Shopping Cart, Guest Checkout

#### Walk 1 — Covers: browser session end clears cart

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
cart.addProduct(sku: "PET-HAR-001", quantity: 1)
session.end()
newCart: ShoppingCart = ShoppingCart.forGuestSession()
assert newCart.cartItems.isEmpty()
// invariant: Increment 2 — session-scoped guest cart only; customer account persistence deferred
return newCart
```

### references

**Ref — Shopping cart and checkout**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Add Product to Cart / Update Cart Quantity / Remove Product from Cart stories
Extract: partial

```source
Given the **Shopping Cart** contains a **Cart Item** with **product in cart** *{sku}*, **quantity** *{initial_qty}*
When the customer changes **quantity** on **Cart Item** *{sku}* to *{new_qty}*
Then **Cart Item** *{sku}* has **quantity** *{new_qty}* and **line price** *{expected_line_price}*
```

### decisions made

- *Product Page* and visible item count indicator have no CRC block — walks treat them as presentation surfaces composing Product, Stock Availability, and Shopping Cart.
- Cart Item line price recalculation is derived from quantity × unit price at time of adding — no separate CRC operation; walk applies invariant from Cart Item properties.
- Session scope enforced at Shopping Cart owning party (Guest Checkout) — no explicit `endSession()` on CRC; walk documents expected behavior under Increment 2 invariant.

---

## **Store**

Click-and-collect as sole *delivery option*; pickup store selection and fulfillment handoff at the stocking *store*.

### **Select Click-and-Collect Store — sole delivery option, no shipping address**

**Purpose:** Validate *click-and-collect* as sole *delivery option* and pickup store recording on *order*.
**Concepts traced:** Store Locator, Store, Click-and-Collect, Delivery Option, Order

#### Walk 1 — Covers: click-and-collect only at checkout

```
locator: StoreLocator = StoreLocator.loadActiveStores()
stores: Store[] = locator.listView  // STR-001 Camden, STR-002 Bristol
deliveryOption: DeliveryOption = DeliveryOption.clickAndCollectOnly()
assert deliveryOption.deliveryMethodName == "click-and-collect"
// invariant: Increment 2 — shipping methods deferred
clickCollect: ClickAndCollect = ClickAndCollect.create(
    selectedPickupStore: Store.byCode("STR-001")
)
assert clickCollect.selectedPickupStore.storeName == "PawPlace Camden"
assert Order.requiresShippingAddress == false
return clickCollect
```

#### Walk 2 — Covers: pickup store recorded on order path

```
store: Store = Store.byCode("STR-001")
clickCollect: ClickAndCollect = ClickAndCollect.create(selectedPickupStore: store)
clickCollect.selectedPickupStore = store
// Order will snapshot pickup store name, address, operating hours at confirm time
assert clickCollect.pickupStatus == pending
return clickCollect
```

#### Walk 3 — Covers: no location — stores listed without distance sort

```
locator: StoreLocator = StoreLocator.loadActiveStores()
// no sharedLocationInput, no postcodeInput
stores: Store[] = locator.listView.storesInDefaultOrder()
assert stores.count == 2
assert locator.sortNearestFirst() == not_applicable
return stores
```

### **Prepare Click-and-Collect Orders — queue sort and mark prepared**

**Purpose:** Validate *pickup fulfillment* preparation and *click-and-collect* queue ordering on *admin dashboard*.
**Concepts traced:** Pickup Fulfillment, Order, Admin Dashboard, Guest Checkout, Stock Availability

#### Walk 1 — Covers: queue sorted oldest first

```
dashboard: AdminDashboard = AdminDashboard.openClickAndCollectQueue(store: "STR-001")
order1: Order = Order.byNumber("ORD-2001")  // date 2025-05-06, status confirmed
order2: Order = Order.byNumber("ORD-2002")  // date 2025-05-07, status confirmed
queue: Order[] = dashboard.clickAndCollectFulfillmentQueue
assert queue[0].orderNumber == "ORD-2001"
assert queue[1].orderNumber == "ORD-2002"
// Pickup Fulfillment.display guest contact on queue
assert queue[0].guestEmailSnapshot == "sarah.jones@example.com"
return queue
```

#### Walk 2 — Covers: mark prepared → ready for pickup

```
fulfillment: PickupFulfillment = PickupFulfillment.forOrder("ORD-2001")
assert fulfillment.preparationStatus == pending
fulfillment.markOrderReadyForPickup()
// Pickup Fulfillment → Order: transitions confirmed → ready for pickup
assert fulfillment.preparationStatus == ready_for_pickup
assert Order.byNumber("ORD-2001").orderStatus == ready_for_pickup
return fulfillment
```

#### Walk 3 — Covers: stock warning at pickup store — order remains confirmed

```
order: Order = Order.byNumber("ORD-2002")
line: OrderLineItem = order.orderLineItems.bySku("PET-FLT-099")
availability: StockAvailability = StockAvailability.at(store: "STR-001", product: "PET-FLT-099")
assert availability.availableToSellQuantity == 0
// presentation warning on queue — employee resolves manually
assert order.orderStatus == confirmed
assert order.guestEmailSnapshot == "tom.brown@example.com"
return order
```

### **Fulfill Click-and-Collect Order — customer handoff and collected status**

**Purpose:** Validate *confirm customer handoff* and order lifecycle terminus *collected*.
**Concepts traced:** Pickup Fulfillment, Order, Click-and-Collect

#### Walk 1 — Covers: happy path — handoff at pickup store

```
fulfillment: PickupFulfillment = PickupFulfillment.forOrder("ORD-2001")
assert fulfillment.pickupStatus == ready_for_pickup
fulfillment.confirmCustomerHandoff()
// invariant: transitions ready for pickup → collected
assert fulfillment.pickupStatus == collected
assert Order.byNumber("ORD-2001").orderStatus == collected
return fulfillment
```

#### Walk 2 — Covers: uncollected after collection window — no auto-cancel

```
order: Order = Order.byNumber("ORD-2001")
assert order.orderStatus == ready_for_pickup
// collection window elapsed — staff outreach via guest email
assert order.guestEmailSnapshot == "sarah.jones@example.com"
assert order.orderStatus == ready_for_pickup  // not auto-cancelled
return order
```

### references

**Ref — Click-and-collect fulfillment**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

### decisions made

- *Click-and-Collect Queue* is a presentation surface on Admin Dashboard — walk enters through `clickAndCollectFulfillmentQueue` responsibility.
- Collection window enforcement is not modeled on Click-and-Collect CRC block — walk documents staff-outreach placeholder; open question from AC (notification window unspecified).
- Distance sort delegates to Store Locator responsibilities unchanged from Increment 1.

---

## **Customer Account**

Guest-only checkout path in Increment 2 — no *customer account* persistence; *billing address* snapshotted to *order* only.

### **Check Out as Guest — default path without account**

**Purpose:** Validate *complete purchase without account* and *guest email* invariant before payment.
**Concepts traced:** Guest Checkout, Shopping Cart, Order, Customer Account

#### Walk 1 — Covers: guest checkout as default — no login offered

```
cart: ShoppingCart = ShoppingCart.forGuestSession()
assert cart.owningParty is GuestCheckout
assert cart.cartItems.isNotEmpty()
guest: GuestCheckout = GuestCheckout.start(cart)
// invariant: default checkout path — no login or registration before purchase
assert CustomerAccount.loginOffered == false
return guest
```

#### Walk 2 — Covers: valid guest details advance checkout

```
guest: GuestCheckout = GuestCheckout.current()
guest.guestEmail = "sarah.jones@example.com"
guest.guestFirstName = "Sarah"
guest.guestLastName = "Jones"
assert guest.guestEmail.isValid()
guest.collectBillingAddress()  // delegates to Billing Address
return guest
```

#### Walk 3 — Covers: invalid guest email blocked

```
guest: GuestCheckout = GuestCheckout.current()
guest.guestEmail = "not-an-email"
assert guest.guestEmail.isValid() == false
// invariant: guest email must be valid before checkout advances to payment
assert guest.advanceToPayment() == blocked
return guest
```

#### Walk 4 — Covers: account creation prompt after order — dismissible, non-blocking

```
order: Order = Order.confirmed("ORD-2001")
// Guest Checkout.promote account creation — deferred to Increment 4
prompt: AccountCreationPrompt = GuestCheckout.promoteAccountCreation(order)
assert prompt.dismissible == true
assert order.orderStatus == confirmed  // regardless of prompt choice
return prompt
```

### **Enter Billing Address — required fields, copy to order only**

**Purpose:** Validate *billing address* collection, validation, and *copy to confirmed order* without persistence.
**Concepts traced:** Guest Checkout, Billing Address, Order

#### Walk 1 — Covers: complete billing address advances to payment

```
billing: BillingAddress = BillingAddress.collect(
    billingName: "Sarah Jones",
    addressLineOne: "10 Elm Avenue",
    addressLineTwo: "Flat 3",
    city: "London",
    countyOrRegion: "Greater London",
    postcode: "SW1A 2AA",
    country: "United Kingdom"
)
assert billing.requiredFieldsComplete()
guest: GuestCheckout = GuestCheckout.current()
guest.collectBillingAddress(billing)
// checkout advances to Payment step
return billing
```

#### Walk 2 — Covers: missing required fields — blocked

```
billing: BillingAddress = BillingAddress.empty()
billing.addressLineOne = ""
billing.postcode = ""
assert billing.requiredFieldsComplete() == false
assert GuestCheckout.current().advanceToPayment() == blocked
return billing
```

#### Walk 3 — Covers: billing snapshotted on order, not persisted after guest checkout

```
billing: BillingAddress = BillingAddress.complete()  // 10 Elm Avenue, Flat 3, London SW1A 2AA
order: Order = Order.placeFromGuestCheckout(guestCheckout, billing)
billing.copyToConfirmedOrder(order)
assert order.billingAddressLineOne == "10 Elm Avenue"
assert order.billingPostcode == "SW1A 2AA"
GuestCheckout.complete()
// invariant: billing address not persisted after guest checkout completes
assert BillingAddress.persistedForGuest() == false
return order
```

### references

**Ref — Guest checkout**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 13
Extract: partial

```source
Guest checkout has to work too, though; not everyone wants to create an account just to buy a bag of cat litter. But we should make account creation appealing — order history, saved addresses, saved payment methods, reorder functionality.
```

### decisions made

- *Order Confirmation Page* has no CRC block — presentation surface after Guest Checkout.completePurchaseWithoutAccount.
- Billing Address validation of individual fields is presentation concern — CRC owns `required fields complete` invariant and `copy to confirmed order`.
- Guest phone captured on Guest Checkout but not walked in billing scenarios — available for staff queue display via Pickup Fulfillment collaborator.

---

## **Payment**

*StripeWave* sole active *payment vendor* in Increment 2; authorize-capture-settle with webhook reconciliation.

### **Select Payment Method — StripeWave only**

**Purpose:** Validate *StripeWave* as sole active vendor; *saved payment method* and alternate vendors deferred.
**Concepts traced:** Payment, StripeWave, Payment Vendor, Order

#### Walk 1 — Covers: StripeWave card entry only at checkout

```
vendors: PaymentVendor[] = PaymentVendor.active()
assert vendors.count == 1
assert vendors[0] is StripeWave
order: Order = Order.pendingReview(orderTotal: 44.97)
payment: Payment = Payment.create(
    associatedOrder: order,
    paymentAmount: order.orderTotal,
    processingVendor: StripeWave
)
assert SavedPaymentMethod.availableToGuest() == false
return payment
```

### **Process Card Payment — success, decline, webhook, unavailable**

**Purpose:** Validate *initiate authorize-capture-settle*, *await payment confirmation*, *reconcile via webhook callback*, and order gating.
**Concepts traced:** Payment, StripeWave, Payment Confirmation, Webhook Callback, Order, Stock Availability

#### Walk 1 — Covers: successful payment confirms order and reserves stock

```
order: Order = Order.pendingPayment(orderNumber: "ORD-2001", orderTotal: 44.97)
payment: Payment = Payment.create(associatedOrder: order, paymentAmount: 44.97, processingVendor: StripeWave)
payment.initiateAuthorizeCaptureSettle(StripeWave)
confirmation: PaymentConfirmation = StripeWave.returnPaymentConfirmation(payment)
payment.awaitPaymentConfirmation(confirmation)
confirmation.confirmAssociatedOrder(order, StockAvailability)
// Payment Confirmation → Order + Stock Availability: order confirmed, inventory reserved at pickup store
assert payment.paymentStatus == settled
assert order.orderStatus == confirmed
for each line in order.orderLineItems:
    availability: StockAvailability = StockAvailability.at(pickupStore: order.pickupStore, product: line.skuSnapshot)
    availability.reserveQuantityOnOrderConfirm(order)
return order
```

#### Walk 2 — Covers: card declined — no order confirmed, no email

```
order: Order = Order.pendingPayment(orderTotal: 89.99)
payment: Payment = Payment.create(associatedOrder: order, paymentAmount: 89.99, processingVendor: StripeWave)
result: PaymentResult = StripeWave.processCard(payment)
assert result.declined == true
payment.paymentStatus = failed
// invariant: must not confirm order until payment confirmation succeeds
assert order.orderStatus != confirmed
assert ConfirmationEmail.sentFor(order) == false
payment.retryFailedCardPayments(StripeWave)  // surface decline, no duplicate charge
return payment
```

#### Walk 3 — Covers: webhook reconciles after timeout

```
payment: Payment = Payment.byReference("PAY-20250507-003")
assert payment.paymentStatus == pending
callback: WebhookCallback = StripeWave.sendWebhookCallback(payment)
callback.reconcilePendingPayment(payment)
callback.updateOrderOnSuccess(order: payment.associatedOrder, confirmation: callback.paymentConfirmation)
assert payment.paymentStatus == settled
assert payment.associatedOrder.orderStatus == confirmed
return payment
```

#### Walk 4 — Covers: webhook failure — order remains unpaid

```
payment: Payment = Payment.byReference("PAY-20250507-003")
callback: WebhookCallback = StripeWave.sendWebhookCallback(payment, success: false)
callback.reconcilePendingPayment(payment)
assert payment.paymentStatus == failed
assert payment.associatedOrder.orderStatus != confirmed
return payment
```

#### Walk 5 — Covers: StripeWave unavailable — no charge attempted

```
payment: Payment = Payment.create(associatedOrder: order, paymentAmount: 34.99, processingVendor: StripeWave)
result: PaymentResult = StripeWave.processCard(payment)
assert result.connectionUnavailable == true
assert payment.paymentStatus == pending  // no charge attempted
assert order.orderStatus != confirmed
return payment
```

### references

**Ref — Payment vendors**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases
```

### decisions made

- Card number/expiry/CVV validation is presentation-layer before Payment creation — CRC owns vendor processing and confirmation gating.
- *Processing indicator* during payment in flight is presentation — walk notes Payment.awaitPaymentConfirmation as the domain wait point.
- PayNova and VaultPay classes exist in CRC but are inactive in Increment 2 — walks assert they are not exposed.

---

## **Notification**

Transactional *confirmation email* on order confirm; delivery failure must not block confirmation.

### **Confirm Order and Send Confirmation Email**

**Purpose:** Validate *trigger confirmation notification*, *confirmation email* content, and retry queue on delivery failure.
**Concepts traced:** Order, Confirmation Email, Payment Confirmation, Guest Checkout, Notification

#### Walk 1 — Covers: confirmation page and email on payment success

```
order: Order = Order.byNumber("ORD-2001")  // status confirmed
guest: GuestCheckout = order.placingParty
email: ConfirmationEmail = ConfirmationEmail.create(
    originatingOrder: order,
    recipientGuestEmail: guest.guestEmail  // sarah.jones@example.com
)
email.pickupStoreAddress = order.pickupStoreAddressSnapshot
email.pickupStoreOperatingHours = order.pickupStoreOperatingHoursSnapshot
email.maskedPaymentMethodDisplay = Payment.byOrder(order).maskedDisplay()
PaymentConfirmation.triggerConfirmationEmail(email)
email.deliverOnPaymentConfirmation()
assert email.notificationSubject == "Your PawPlace Order ORD-2001 is confirmed"
// Order Confirmation Page (presentation) displays order number, line items, total, pickup store
return email
```

#### Walk 2 — Covers: email queued on delivery failure — order stays confirmed

```
email: ConfirmationEmail = ConfirmationEmail.forOrder("ORD-2001")
deliveryResult: DeliveryResult = email.deliverOnPaymentConfirmation()
assert deliveryResult.failed == true
email.queueForRetryOnFailure(Notification)
assert email.deliveryStatus == queued
// invariant: email delivery failure must not block order confirmation
assert Order.byNumber("ORD-2001").orderStatus == confirmed
return email
```

### references

**Ref — Order confirmation**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 19
Extract: whole

```source
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.
```

### decisions made

- Order.triggerConfirmationNotification collaborates with Notification and Confirmation Email — walk uses PaymentConfirmation as the trigger path per Increment 2 CRC refresh.
- Masked payment method display on Confirmation Email collaborates with Payment — no separate CRC operation on Payment for masking; walk references Payment state.
- Pickup-ready customer notification (when staff marks prepared) remains open — AC defers notification window; not walked in Increment 2.

---

# Boundary Domain

## **Admin Dashboard**

Store employee operations surface — *click-and-collect fulfillment queue* and handoff confirmation.

### **Click-and-Collect Queue — employee fulfillment cycle**

**Purpose:** Validate boundary entry for queue display, preparation, and empty-queue completion state.
**Concepts traced:** Admin Dashboard, Pickup Fulfillment, Order, Guest Checkout

#### Walk 1 — Covers: employee opens queue at pickup store

```
dashboard: AdminDashboard = AdminDashboard.openClickAndCollectQueue(store: "STR-001")
queue: Order[] = dashboard.clickAndCollectFulfillmentQueue
// invariant: pending orders sorted oldest first; shows order number, line items, guest email
for each order in queue:
    PickupFulfillment.displayGuestContactOnQueue(order.placingParty)
return dashboard
```

#### Walk 2 — Covers: all orders fulfilled — empty queue state

```
dashboard: AdminDashboard = AdminDashboard.openClickAndCollectQueue(store: "STR-001")
lastOrder: Order = queue.lastPending()
PickupFulfillment.forOrder(lastOrder).confirmCustomerHandoff()
assert dashboard.clickAndCollectFulfillmentQueue.isEmpty()
return dashboard
```

### references

**Ref — Admin dashboard click-and-collect**
Source: docs/end-to-end/specification/crc.md
Locator: Boundary Domain / Admin Dashboard
Extract: partial

```source
click-and-collect fulfillment queue | Click-and-Collect, Order, Pickup Fulfillment
                                    |   invariant: Increment 2 — lists confirmed click-and-collect orders pending pickup fulfillment, sorted oldest first; shows order number, line items, guest email
```

### decisions made

- Admin Dashboard does not own domain data — all mutations delegate to Pickup Fulfillment and Order in core domain.
- Stock level edit form (Increment 1) shares Admin Dashboard boundary but is out of scope for this Increment 2 walkthrough file.


---

## increment-3 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## increment-3-walkthrough

<!-- migrated from: increments/3-ship-to-home/engineering/object-model.md -->

---
state: walkthrough
increment_scope: Increment 3 — Ship to home
specification_refresh: Run 4 slot 77
prior_model: crc.md
---

# Module: PawPlace

Scope: Walk Increment 3 scenarios through `docs/end-to-end/specification/crc.md` (object model refresh deferred to Engineering). Traces five stories: *Enter Shipping Address*, *Select Delivery Option*, *View and Process Incoming Orders*, *Send Shipping Notification with Tracking Number*, *Track Order Status*. *Guest checkout* only — no *customer account*, login, or *saved address*.

---

# Core Domain

## **Customer Account**

Guest-only checkout path in Increment 3 — *shipping address* collected when *standard delivery* selected; *billing address* pre-fills shipping; neither address persisted beyond order snapshots.

### **Enter Shipping Address — form, pre-fill, validation, and advance**

**Purpose:** Validate *collect shipping address* on ship-to-home path, *pre-fill from billing address*, field overrides, required-field gating, and advance to *delivery option* selection.
**Concepts traced:** Guest Checkout, Billing Address, Shipping Address, Delivery Option

#### Walk 1 — Covers: shipping address form on ship-to-home checkout path

```
guest: GuestCheckout = GuestCheckout.current()
billing: BillingAddress = BillingAddress.complete(
    billingName: "Sarah Jones",
    addressLineOne: "10 Elm Avenue",
    city: "London",
    postcode: "SW1A 2AA"
)
guest.collectBillingAddress(billing)
// invariant: shipping address required when standard delivery path — not yet selected
shipping: ShippingAddress = guest.collectShippingAddress()
assert shipping.requiredFields == [recipientName, addressLineOne, city, postcode, country]
assert shipping.addressLineTwo.isOptional()
return shipping
```

#### Walk 2 — Covers: click-and-collect skips shipping address step

```
guest: GuestCheckout = GuestCheckout.current()
billing: BillingAddress = BillingAddress.complete(
    addressLineOne: "10 Elm Avenue",
    city: "London",
    postcode: "SW1A 2AA"
)
guest.collectBillingAddress(billing)
deliveryOption: DeliveryOption = DeliveryOption.clickAndCollect()
assert deliveryOption.deliveryMethodName == "Click-and-Collect"
// Guest Checkout.collect shipping address — invariant: skipped when click-and-collect selected
assert guest.collectShippingAddress() == skipped
// checkout proceeds to Pickup Store selection (Click-and-Collect collaborator)
return deliveryOption
```

#### Walk 3 — Covers: same as billing pre-fills shipping address

```
billing: BillingAddress = BillingAddress.complete(
    billingName: "Sarah Jones",
    addressLineOne: "10 Elm Avenue",
    addressLineTwo: "Flat 3",
    city: "London",
    countyOrRegion: "Greater London",
    postcode: "SW1A 2AA",
    country: "United Kingdom"
)
shipping: ShippingAddress = ShippingAddress.preFillFromBillingAddress(billing)
// Billing Address.pre-fill shipping address
assert shipping.recipientName == "Sarah Jones"
assert shipping.addressLineOne == "10 Elm Avenue"
assert shipping.addressLineTwo == "Flat 3"
assert shipping.city == "London"
assert shipping.countyOrRegion == "Greater London"
assert shipping.postcode == "SW1A 2AA"
assert shipping.country == "United Kingdom"
return shipping
```

#### Walk 4 — Covers: override single field on pre-filled shipping address

```
shipping: ShippingAddress = ShippingAddress.preFilledFromBilling()  // city London
shipping.city = "Edinburgh"
// invariant: individual field overrides replace only the changed field
assert shipping.city == "Edinburgh"
assert shipping.addressLineOne == "10 Elm Avenue"
assert shipping.postcode == "SW1A 2AA"
return shipping
```

#### Walk 5 — Covers: missing required fields blocked on shipping step

```
shipping: ShippingAddress = ShippingAddress.empty()
shipping.recipientName = ""
shipping.addressLineOne = ""
shipping.postcode = ""
assert shipping.requiredFieldsComplete() == false
// invariant: required fields must be complete before checkout advances from shipping step
assert GuestCheckout.current().advanceFromShippingStep() == blocked
return shipping
```

#### Walk 6 — Covers: complete shipping address advances to delivery option selection

```
shipping: ShippingAddress = ShippingAddress.collect(
    recipientName: "Sarah Jones",
    addressLineOne: "28 Oak Lane",
    city: "Edinburgh",
    countyOrRegion: "Midlothian",
    postcode: "EH1 3DG",
    country: "United Kingdom"
)
assert shipping.requiredFieldsComplete()
guest: GuestCheckout = GuestCheckout.current()
guest.collectShippingAddress(shipping)
// checkout advances to Delivery Option selection step
assert guest.currentStep == deliveryOptionSelection
return shipping
```

### references

**Ref — Enter Shipping Address**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Enter Shipping Address / Scenario 6
Extract: partial

```source
Given the customer enters **Shipping Address** with **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **county or region** *Midlothian*, **postcode** *EH1 3DG*, **country** *United Kingdom*
When the customer submits the **Shipping Address**
Then checkout advances to the **Delivery Option** selection step
```

### decisions made

- Field-level validation messages (*Recipient name is required*, etc.) are presentation concerns — CRC owns `required fields complete` invariant on *Shipping Address*.
- *Order summary* display of shipping address is presentation — walk documents advance to *Delivery Option* via *Guest Checkout*.
- No *Customer Account* or *Saved Address* walks — Increment 3 guest-only invariant; account persistence deferred to Increment 4.

---

## **Order**

*Delivery option* selection for *standard delivery* and *click-and-collect*; shipping cost on *order*; guest *order status* lookup and lifecycle for ship-to-home.

### **Select Delivery Option — standard delivery and click-and-collect switching**

**Purpose:** Validate both *delivery option* variants offered, *shipping cost* recording, shipping vs pickup requirements, and mutual switching at checkout.
**Concepts traced:** Delivery Option, Standard Delivery, Click-and-Collect, Shipping Address, Order, Guest Checkout

#### Walk 1 — Covers: standard delivery and click-and-collect options shown

```
options: DeliveryOption[] = DeliveryOption.availableAtCheckout()
standard: StandardDelivery = options.byName("Standard Delivery")
clickCollect: ClickAndCollect = options.byName("Click-and-Collect")
assert standard.estimatedDeliveryWindow == "3–5 business days"
assert standard.shippingCost == 4.99
assert clickCollect.shippingCost == 0.00
// invariant: express and same-day deferred
assert DeliveryOption.expressAvailable() == false
assert DeliveryOption.sameDayAvailable() == false
return options
```

#### Walk 2 — Covers: standard delivery confirms shipping address and advances to payment

```
shipping: ShippingAddress = ShippingAddress.current()  // 28 Oak Lane, Edinburgh EH1 3DG
standard: StandardDelivery = StandardDelivery.select()
standard.confirmShippingAddressDestination(shipping, order: Order.pending())
// Standard Delivery.confirm shipping address destination → Order snapshot
order: Order = Order.pendingReview()
order.shippingCost = standard.shippingCost  // £4.99
assert order.shippingAddressLineOne == "28 Oak Lane"
assert order.shippingCity == "Edinburgh"
assert order.shippingPostcode == "EH1 3DG"
// checkout advances to Payment
return order
```

#### Walk 3 — Covers: switch from standard delivery to click-and-collect drops shipping requirement

```
guest: GuestCheckout = GuestCheckout.current()
// had Standard Delivery + Shipping Address 28 Oak Lane, Edinburgh
deliveryOption: DeliveryOption = DeliveryOption.switchTo("Click-and-Collect")
assert deliveryOption is ClickAndCollect
// invariant: shipping address requirement dropped; billing address remains required
assert guest.collectShippingAddress() == not_required
assert GuestCheckout.current().billingAddress.requiredFieldsComplete()
// Pickup Store selector displayed
return deliveryOption
```

#### Walk 4 — Covers: switch from click-and-collect to standard delivery prompts shipping address

```
guest: GuestCheckout = GuestCheckout.current()
clickCollect: ClickAndCollect = ClickAndCollect.withPickupStore(Store.byCode("STR-001"))
DeliveryOption.switchTo("Standard Delivery")
// invariant: shipping address form presented; pickup store selector dismissed
shipping: ShippingAddress = guest.collectShippingAddress()
assert shipping != null
assert clickCollect.selectedPickupStore == null
assert guest.billingAddress.unchanged()
return shipping
```

### **Track Order Status — status page content and guest lookup**

**Purpose:** Validate *expose guest order lookup*, ship-to-home lifecycle states on *order*, and status-appropriate tracking display without push notifications.
**Concepts traced:** Order, Tracking Number, Guest Checkout, Shipping Notification, Confirmation Email

#### Walk 1 — Covers: shipped order status page shows tracking and delivery estimate

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == shipped
tracking: TrackingNumber = order.trackingNumber
assert tracking.carrierReference == "RM-1Z999AA10123456784"
assert tracking.carrierName == "Royal Mail"
assert order.estimatedDeliveryDate == 2025-05-12
assert tracking.shipmentDate == 2025-05-07
// Order Status Page (presentation) — tracking link via Tracking Number.link to carrier tracking page
for each line in order.orderLineItems:
    assert line.productNameSnapshot in ["Premium Dog Harness", "Large Dog Bed"]
return order
```

#### Walk 2 — Covers: confirmed click-and-collect order — tracking placeholder

```
order: Order = Order.byNumber("ORD-3002")
assert order.orderStatus == confirmed
assert order.deliveryOption.deliveryMethodName == "Click-and-Collect"
assert order.trackingNumber == null
// presentation: "Tracking will be available once your order ships" / "Order being prepared"
return order
```

#### Walk 3 — Covers: delivered order status on next page visit

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == delivered
tracking: TrackingNumber = order.trackingNumber
assert tracking.carrierReference == "RM-1Z999AA10123456784"
// invariant: no push notification on status change — guest sees update on next Order Status Page visit
assert Notification.pushSentFor(order) == false
return order
```

#### Walk 4 — Covers: guest order lookup — matching order number and guest email

```
order: Order = Order.byNumber("ORD-3001")
assert order.guestEmailSnapshot == "sarah.jones@example.com"
result: LookupResult = order.exposeGuestOrderLookup(
    orderNumber: "ORD-3001",
    enteredEmail: "sarah.jones@example.com"
)
assert result.success == true
// invariant: no order details leak to unrelated emails
denied: LookupResult = order.exposeGuestOrderLookup(
    orderNumber: "ORD-3001",
    enteredEmail: "wrong@example.com"
)
assert denied.success == false
return result
```

#### Walk 5 — Covers: status change reflected on next visit without push notification

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == shipped
order.orderStatus = delivered
// guest's next visit to Order Status Page shows Delivered — no push notification
assert Notification.pushSentFor(order) == false
return order
```

### references

**Ref — Select Delivery Option**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Select Delivery Option / Scenario 2
Extract: partial

```source
Given the customer selects **Standard Delivery** as the **Delivery Option**
And **Shipping Address** is **recipient name** *Sarah Jones*, **address line one** *28 Oak Lane*, **city** *Edinburgh*, **postcode** *EH1 3DG*
When the customer confirms the **Delivery Option**
Then **Shipping Address** is confirmed as the delivery destination for the **Order**
And **shipping cost** *£4.99* is recorded on the **Order**
```

**Ref — Track Order Status lookup**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Track Order Status / Scenario Outline 2
Extract: partial

```source
Given **Order** {order_number} was placed with **Guest Email** {actual_guest_email}
When a guest enters **order number** {order_number} and email {entered_email} on the order lookup page
Then the system shows {expected_result}
```

### decisions made

- *Delivery Option* switching at checkout is orchestrated through *Guest Checkout* — CRC defines invariants on *Shipping Address* requirement and *Click-and-Collect* vs *Standard Delivery* collaborators; no explicit `switchTo()` on CRC — walk documents expected collaboration path.
- *Order Status Page* has no CRC block — presentation surface composing *Order*, *Tracking Number*, and *Order Line Item* per Increment 2 precedent.
- Carrier tracking link delegates to *Tracking Number.link to carrier tracking page* — URL construction is presentation.

---

## **Store**

Ship-to-home fulfillment at the stocking *store*; unified *order queue* with click-and-collect; manual *tracking number* entry at dispatch.

### **View and Process Incoming Orders — queue, detail, fulfillment with and without tracking**

**Purpose:** Validate *ship-to-home fulfillment* packing/dispatch, *prompt for tracking number*, and unified staff queue across delivery types.
**Concepts traced:** Ship-to-Home Fulfillment, Order, Order Line Item, Shipping Address, Tracking Number, Admin Dashboard, Click-and-Collect, Guest Checkout

#### Walk 1 — Covers: order queue shows all delivery types on admin dashboard

```
dashboard: AdminDashboard = AdminDashboard.openOrderQueue()
order1: Order = Order.byNumber("ORD-3001")  // Standard Delivery
order2: Order = Order.byNumber("ORD-3002")  // Click-and-Collect
queue: Order[] = dashboard.orderQueue
assert queue.contains(order1)
assert queue.contains(order2)
assert order1.deliveryOption.deliveryMethodName == "Standard Delivery"
assert order2.deliveryOption.deliveryMethodName == "Click-and-Collect"
// Ship-to-Home Fulfillment.display guest contact on queue
ShipToHomeFulfillment.displayGuestContactOnQueue(order1.placingParty)
return queue
```

#### Walk 2 — Covers: ship-to-home order detail shows shipping address and items to pack

```
order: Order = Order.byNumber("ORD-3001")
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
assert fulfillment.shippingAddressToPackAgainst.addressLineOne == "28 Oak Lane"
assert fulfillment.shippingAddressToPackAgainst.city == "Edinburgh"
assert fulfillment.shippingAddressToPackAgainst.postcode == "EH1 3DG"
items: OrderLineItem[] = fulfillment.orderLineItemsToPack
assert items.bySku("PET-HAR-001").quantity == 1  // Premium Dog Harness
assert items.bySku("PET-BED-015").quantity == 1  // Large Dog Bed
assert order.orderStatus == confirmed
return fulfillment
```

#### Walk 3 — Covers: fulfillment with tracking number triggers shipping notification

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == confirmed
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
fulfillment.markOrderFulfilled()
// invariant: transitions confirmed → fulfilled
assert order.orderStatus == fulfilled
tracking: TrackingNumber = fulfillment.promptForTrackingNumber()
tracking.carrierReference = "RM-1Z999AA10123456784"
tracking.carrierName = "Royal Mail"
tracking.shipmentDate = 2025-05-07
fulfillment.triggerShippingNotification(tracking)
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return tracking
```

#### Walk 4 — Covers: fulfillment without tracking — warning, still fulfilled, add later

```
order: Order = Order.byNumber("ORD-3001")
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
fulfillment.markOrderFulfilled()
assert order.orderStatus == fulfilled
// invariant: tracking number recommended but not blocking
tracking: TrackingNumber = fulfillment.promptForTrackingNumber()
assert tracking == skipped
// presentation warning: "Customer will not receive a shipping notification"
assert ShippingNotification.sentFor(order) == false
// order detail retains Add Tracking Number for later entry
return fulfillment
```

### references

**Ref — Ship-to-home fulfillment**
Source: docs/end-to-end/specification/crc.md
Locator: Core Domain / Store / Ship-to-Home Fulfillment
Extract: partial

```source
mark order fulfilled                | Order
                                    |   invariant: transitions order from confirmed to fulfilled
prompt for tracking number          | Tracking Number
                                    |   invariant: tracking number recommended but not blocking in Increment 3
trigger shipping notification       | Shipping Notification, Notification
```

**Ref — View and Process Incoming Orders**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story View and Process Incoming Orders / Scenario 3
Extract: partial

```source
When **Store Employee** marks **Order** *ORD-3001* as fulfilled through **Ship-to-Home Fulfillment**
Then the system prompts for a **Tracking Number**
When **Store Employee** enters **Tracking Number** with **carrier reference** *RM-1Z999AA10123456784* and **carrier name** *Royal Mail*
Then **Order** *ORD-3001* transitions **order status** to *fulfilled*
```

### decisions made

- *Mark as Fulfilled* action on order detail is presentation entry to *Ship-to-Home Fulfillment.mark order fulfilled*.
- Queue delivery type labels (*Ship — ORD-3001*, *Collect — ORD-3002*) are presentation — CRC *order queue* shows delivery type via *Order.delivery option*.
- Click-and-collect orders on unified queue delegate to *Pickup Fulfillment* for fulfillment detail — not walked in depth here; Increment 2 walkthrough covers pickup handoff.

---

## **Notification**

Transactional *shipping notification* when *tracking number* recorded; retry queue must not block *order status* transition to *shipped*.

### **Send Shipping Notification with Tracking Number**

**Purpose:** Validate *deliver when tracking number recorded*, content requirements, no auto-send without tracking, and late tracking entry path.
**Concepts traced:** Shipping Notification, Tracking Number, Ship-to-Home Fulfillment, Order, Guest Checkout, Notification

#### Walk 1 — Covers: shipping notification sent with tracking and delivery details

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == fulfilled
guest: GuestCheckout = order.placingParty
tracking: TrackingNumber = TrackingNumber.create(
    carrierReference: "RM-1Z999AA10123456784",
    carrierName: "Royal Mail",
    shipmentDate: 2025-05-07,
    originatingOrder: order
)
assert order.estimatedDeliveryDate == 2025-05-12
notification: ShippingNotification = ShippingNotification.create(
    originatingOrder: order,
    recipientGuestEmail: guest.guestEmail  // sarah.jones@example.com
)
notification.trackingNumber = tracking
notification.carrierName = tracking.carrierName
notification.estimatedDeliveryWindow = "3–5 business days"
ShipToHomeFulfillment.confirmDispatch(tracking)
tracking.triggerShippingNotification(notification)
notification.deliverWhenTrackingNumberRecorded()
assert notification.notificationSubject == "Your PawPlace order ORD-3001 has shipped"
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return notification
```

#### Walk 2 — Covers: email unavailable queues notification — order still shipped

```
order: Order = Order.byNumber("ORD-3001")
tracking: TrackingNumber = TrackingNumber.forOrder(order)
notification: ShippingNotification = ShippingNotification.forDispatch(order, tracking)
result: DeliveryResult = notification.deliverWhenTrackingNumberRecorded()
assert result.failed == true
notification.queueForRetryOnFailure(Notification)
assert notification.deliveryStatus == queued
// invariant: email delivery failure must not block order status transition to shipped
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return notification
```

#### Walk 3 — Covers: no tracking at fulfillment — no automatic shipping notification

```
order: Order = Order.byNumber("ORD-3001")
assert order.orderStatus == fulfilled
assert order.trackingNumber == null
// invariant: Shipping Notification does not fire without tracking number
assert ShippingNotification.deliverWhenTrackingNumberRecorded() == not_triggered
assert order.orderStatus == fulfilled  // remains fulfilled until tracking added
return order
```

#### Walk 4 — Covers: late tracking number entry triggers shipping notification

```
order: Order = Order.byNumber("ORD-3003")
assert order.orderStatus == fulfilled
assert order.trackingNumber == null
tracking: TrackingNumber = TrackingNumber.addToOrder(
    order: order,
    carrierReference: "RM-2Z888BB20234567895",
    carrierName: "Royal Mail"
)
// invariant: staff may add tracking later via order detail
tracking.triggerShippingNotification(ShippingNotification.forOrder(order))
notification: ShippingNotification = ShippingNotification.forOrder(order)
notification.deliverWhenTrackingNumberRecorded()
assert notification.recipientGuestEmail == "alex.white@example.com"
tracking.transitionOrderStatusToShipped(order)
assert order.orderStatus == shipped
return notification
```

### references

**Ref — Shipping notifications**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 19
Extract: whole

```source
Order confirmation page, confirmation email, shipping notifications with tracking numbers. The usual stuff but done well.
```

**Ref — Send Shipping Notification**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Send Shipping Notification / Scenario 1
Extract: partial

```source
When **Ship-to-Home Fulfillment** dispatch is confirmed
Then the system sends a **Shipping Notification** to *sarah.jones@example.com*
And the **Shipping Notification** includes **order number** *ORD-3001*, **Order Line Item** items shipped, **carrier name** *Royal Mail*, **Tracking Number** *RM-1Z999AA10123456784*, and **estimated delivery window** *3–5 business days*
```

### decisions made

- *Ship-to-Home Fulfillment.confirmDispatch* is walk shorthand for dispatch confirmation after *mark order fulfilled* + tracking entry — no separate CRC operation; collaborates via *trigger shipping notification* and *transition order status to shipped*.
- *Confirmation Email* extended with *shipping address snapshot* and *order status page link* for standard delivery — not re-walked here; Increment 2 walkthrough covers confirmation path.
- Marketing notifications and *Communication Preferences* remain deferred — no walks in Increment 3.

---

# Boundary Domain

## **Admin Dashboard**

Store employee operations surface — unified *order queue* routing to ship-to-home or click-and-collect fulfillment detail.

### **Order Queue — unified staff view across delivery types**

**Purpose:** Validate boundary entry for unified queue display and routing to fulfillment workflows.
**Concepts traced:** Admin Dashboard, Order, Ship-to-Home Fulfillment, Pickup Fulfillment, Guest Checkout

#### Walk 1 — Covers: employee opens unified order queue

```
dashboard: AdminDashboard = AdminDashboard.openOrderQueue()
queue: Order[] = dashboard.orderQueue
// invariant: confirmed orders across standard delivery and click-and-collect;
// shows order number, line items, delivery type label, guest email
for each order in queue:
    assert order.orderStatus == confirmed
    if order.deliveryOption is StandardDelivery:
        ShipToHomeFulfillment.surfaceOnOrderQueue(order)
    else:
        PickupFulfillment.surfaceOnOrderQueue(order)
    ShipToHomeFulfillment.displayGuestContactOnQueue(order.placingParty)
return dashboard
```

#### Walk 2 — Covers: route to ship-to-home fulfillment detail from queue

```
dashboard: AdminDashboard = AdminDashboard.openOrderQueue()
order: Order = dashboard.orderQueue.byNumber("ORD-3001")
assert order.deliveryOption.deliveryMethodName == "Standard Delivery"
fulfillment: ShipToHomeFulfillment = ShipToHomeFulfillment.forOrder(order)
assert fulfillment.shippingAddressToPackAgainst.postcode == "EH1 3DG"
return fulfillment
```

### references

**Ref — Admin dashboard order queue**
Source: docs/end-to-end/specification/crc.md
Locator: Boundary Domain / Admin Dashboard
Extract: partial

```source
order queue                         | Order, Ship-to-Home Fulfillment, Pickup Fulfillment
                                    |   invariant: Increment 3 — unified staff view of confirmed orders across standard delivery and click-and-collect; shows order number, line items, delivery type label, guest email; routes to ship-to-home or click-and-collect fulfillment detail
```

### decisions made

- Admin Dashboard does not own domain data — all mutations delegate to *Ship-to-Home Fulfillment*, *Pickup Fulfillment*, and *Order* in core domain.
- Manual tracking entry and label creation only — no automated carrier integration in Increment 3.
- Stock level edit form (Increment 1) and click-and-collect fulfillment queue (Increment 2) share Admin Dashboard boundary but are out of scope for this Increment 3 walkthrough file.


---

## increment-4 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## increment-4-walkthrough

<!-- migrated from: increments/4-returning-customers/engineering/object-model.md -->

---
state: walkthrough
increment_scope: Increment 4 — Returning customers
specification_refresh: Run 5 slot 107 rework
prior_model: crc.md
---

# Module: PawPlace

Walk Increment 4 scenarios through `docs/end-to-end/specification/crc.md` (object model refresh deferred to Engineering). *Guest checkout* coexists; *StripeWave* sole active *payment vendor*; mandatory *email verification* gates account-only features; deferred scope omitted.

## Scope

**Epic:** Returning customers - accounts, history, reorder

**Stories:**

- Register Account
- Send Email Verification
- Verify Email Address
- Log In
- Log Out
- Reset Password
- Maintain Session Across Devices
- Save Delivery Address
- Save Payment Method
- View Order History
- Manage Wishlist
- Reorder Previous Purchase
- Manage Saved Addresses
- Manage Saved Payment Methods
- Select Saved Address at Checkout
- Select Saved Payment Method at Checkout

**Source graph:** `docs/end-to-end/discovery/stories/story-graph.json` (epic priority 4)

---

# Core Domain

## **Customer Account**

Registration, authentication, email verification, session lifecycle, address book, wishlist, and guest-checkout coexistence for returning customers.

### **Register Account — form, valid registration, duplicate email, password validation**

**Purpose:** Validate *register via email and password*, duplicate-email rejection without status leak, and password-requirement gating before account creation.
**Concepts traced:** Customer Account, Email Verification, Account Verification Status

#### Walk 1 — Covers: registration form collects email and password with requirements visible

```
// presentation surfaces password requirements before submission — no domain mutation
form: RegistrationForm = RegistrationForm.open()
assert form.collects(emailAddress, password, passwordConfirmation)
assert form.showsRequirements(minLength: 8, uppercase: true, digit: true, special: true)
return form
```

#### Walk 2 — Covers: valid registration creates unverified account and triggers email verification

```
assert CustomerAccount.byEmail("jane.doe@example.com") == null
account: CustomerAccount = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "jane.doe@example.com",
    password: "Str0ngP@ss!",
    firstName: "Jane",
    lastName: "Doe"
)
// Customer Account.register via email and password → Email Verification
verification: EmailVerification = account.emailVerification
assert account.accountVerificationStatus.verificationLabel == "unverified"
// invariant: must remain unverified until email verification succeeds
EmailVerification.sendVerificationEmail(verification, target: account)
return account
```

#### Walk 3 — Covers: duplicate email rejected without revealing verification status

```
existing: CustomerAccount = CustomerAccount.byEmail("existing@example.com")
assert existing.accountVerificationStatus.verificationLabel == "verified"
result: RegistrationResult = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "existing@example.com",
    password: "Str0ngP@ss!"
)
assert result.succeeded == false
assert result.errorMessage == "This email is already in use"
// invariant: error must not reveal verified vs unverified
assert result.revealsVerificationStatus == false
return result
```

#### Walk 4 — Covers: password failing requirements blocks account creation

```
result: RegistrationResult = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "new.user@example.com",
    password: "short"
)
assert result.succeeded == false
assert result.unmetRequirements.contains("minimum 8 characters")
assert CustomerAccount.byEmail("new.user@example.com") == null
return result
```

### **Send Email Verification — delivery, expired link, queued retry**

**Purpose:** Validate *send verification email*, expired-link resend path, and *queue for retry on delivery failure* without blocking registration confirmation.
**Concepts traced:** Email Verification, Verification Link, Notification, Customer Account

#### Walk 1 — Covers: verification email sent with unique time-limited link on account creation

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
link: VerificationLink = verification.verificationLink
assert link.uniqueLinkToken == "vlink-abc123"
assert link.expiryTime == "2025-05-25T12:00:00Z"
assert link.oneTimeUseFlag == false  // not yet consumed
notification: Notification = EmailVerification.sendVerificationEmail(verification, target: account)
// Email Verification.send verification email → Notification
assert notification.notificationChannel == "email"
assert notification.recipient == account
assert notification.body.contains(link)
return notification
```

#### Walk 2 — Covers: expired verification link shows message and resend action

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
link: VerificationLink = verification.verificationLink
assert link.expiryTime == "2025-05-23T12:00:00Z"  // expired > 24 hours ago
assert link.expiryTime < now()  // invariant: expires after configured window
// Verification Link.offer resend when expired → Email Verification
resendOffer: ResendOffer = VerificationLink.offerResendWhenExpired(link)
assert resendOffer.message == "This verification link has expired"
assert resendOffer.offersResend == true
EmailVerification.resendVerification(verification, link)
return resendOffer
```

#### Walk 3 — Covers: email delivery unavailable queues verification for retry

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
notification: Notification = EmailVerification.sendVerificationEmail(verification, target: account)
// delivery system unavailable — Email Verification.queue for retry on delivery failure → Notification
assert notification.deliveryStatus == "queued"
// invariant: email delivery failure must not block registration confirmation
assert account.accountVerificationStatus.verificationLabel == "unverified"
return notification
```

### **Verify Email Address — valid link, idempotent reuse, expired resend**

**Purpose:** Validate *transition account verification status*, idempotent already-used links, and expired-link resend on verify flow.
**Concepts traced:** Email Verification, Verification Link, Account Verification Status, Customer Account

#### Walk 1 — Covers: valid verification link transitions account to verified

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "unverified"
link: VerificationLink = account.emailVerification.verificationLink
assert link.expiryTime > now()
assert link.oneTimeUseFlag == false  // not yet consumed
EmailVerification.transitionAccountVerificationStatus(
    account.emailVerification,
    status: AccountVerificationStatus.verified()
)
// Email Verification.transition account verification status → Account Verification Status
assert account.accountVerificationStatus.verificationLabel == "verified"
return account
```

#### Walk 2 — Covers: already-used verification link is idempotent

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "verified"
link: VerificationLink = account.emailVerification.verificationLink
assert link.oneTimeUseFlag == "used"
// Verification Link invariant: already-used link shows already verified message
// Email Verification.transition account verification status — idempotent, no regression
assert account.accountVerificationStatus.verificationLabel == "verified"
return account
```

#### Walk 3 — Covers: expired verification link offers resend on verify screen

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
verification: EmailVerification = account.emailVerification
link: VerificationLink = verification.verificationLink
assert link.expiryTime < now()
// Verification Link.offer resend when expired → Email Verification
resendOffer: ResendOffer = VerificationLink.offerResendWhenExpired(link)
assert resendOffer.message == "link expired"
assert resendOffer.offersResend == true
EmailVerification.resendVerification(verification, link)
return resendOffer
```

### **Log In — credentials, unverified block, guest cart merge**

**Purpose:** Validate *log in* session creation, generic invalid-credentials error, unverified-account gate, and *merge guest shopping cart on login*.
**Concepts traced:** Customer Account, Customer Session, Email Verification, Account Verification Status, Shopping Cart, Guest Checkout

#### Walk 1 — Covers: valid credentials create customer session and redirect

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "verified"
session: CustomerSession = CustomerAccount.logIn(
    account,
    credentials: validPassword
)
// Customer Account.log in → Customer Session
// Customer Session.create on successful login → Customer Account, Email Verification
assert session.authenticatedCustomerAccount == account
assert session.sessionToken.isPresent()
return session
```

#### Walk 2 — Covers: invalid credentials show generic error

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
result: LoginResult = CustomerAccount.logIn(
    account,
    credentials: incorrectPassword
)
assert result.succeeded == false
assert result.errorMessage == "invalid email or password"
// invariant: must not specify which field is wrong
assert result.specifiesField == false
return result
```

#### Walk 3 — Covers: unverified account blocked from customer session with account-only access

```
account: CustomerAccount = CustomerAccount.byEmail("tom.reed@example.com")
assert account.accountVerificationStatus.verificationLabel == "unverified"
result: LoginResult = CustomerAccount.logIn(account, credentials: validPassword)
// Email Verification.block account-only features → Customer Account, Customer Session
// Account Verification Status.gate customer session access
assert result.succeeded == false
assert result.message == "please verify your email first"
assert result.offersResendVerification == true
assert result.customerSessionCreated == false
return result
```

#### Walk 4 — Covers: guest shopping cart merges into account cart on login

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
accountCart: ShoppingCart = account.shoppingCart
accountCart.add(product: Product.bySku("SKU-CAT-TOY-05"), quantity: 1)
guestCart: ShoppingCart = GuestCheckout.current().shoppingCart
guestCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 2)
session: CustomerSession = CustomerAccount.logIn(account, guestCart: guestCart)
// Customer Session.merge guest shopping cart on login → Shopping Cart, Guest Checkout
merged: ShoppingCart = session.authenticatedCustomerAccount.shoppingCart
assert merged.quantityFor("SKU-DOG-FOOD-01") == 2
assert merged.quantityFor("SKU-CAT-TOY-05") == 1
return merged
```

#### Walk 5 — Covers: merge sums quantities when both carts contain same product

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
account.shoppingCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 1)
guestCart: ShoppingCart = GuestCheckout.current().shoppingCart
guestCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 2)
CustomerSession.mergeGuestShoppingCartOnLogin(account, guestCart)
// invariant: duplicate product entries sum quantities
assert account.shoppingCart.quantityFor("SKU-DOG-FOOD-01") == 3
return account.shoppingCart
```

### **Log Out — single device and log out everywhere**

**Purpose:** Validate *log out* invalidates current session only vs *invalidate all sessions* across devices.
**Concepts traced:** Customer Account, Customer Session

#### Walk 1 — Covers: logout invalidates current customer session only

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
mobile: CustomerSession = CustomerSession.active(account, device: "mobile phone")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
CustomerAccount.logOut(account, session: mobile)
// Customer Account.log out → Customer Session.invalidate on logout
assert mobile.isValid == false
assert laptop.isValid == true
// Customer Session.allow concurrent sessions — other device unaffected
return laptop
```

#### Walk 2 — Covers: log out everywhere invalidates all customer sessions

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
mobile: CustomerSession = CustomerSession.active(account, device: "mobile phone")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
CustomerSession.invalidateAllSessions(account)
// Customer Session.invalidate all sessions → Customer Account
assert mobile.isValid == false
assert laptop.isValid == false
return account
```

### **Reset Password — ambiguous confirmation, valid link, session invalidation, expired/used links**

**Purpose:** Validate *reset password* without account-enumeration leak, password update, session invalidation, and expired/used reset links.
**Concepts traced:** Customer Account, Customer Session, Verification Link, Email Verification, Notification

#### Walk 1 — Covers: reset request shows same confirmation regardless of account existence

```
// known account — reset link sent
resultKnown: ResetRequestResult = CustomerAccount.resetPassword(
    emailAddress: "jane.doe@example.com"
)
assert resultKnown.confirmationMessage == "check your email"
assert resultKnown.resetLinkSent == true
// unknown email — same confirmation, no link sent
resultUnknown: ResetRequestResult = CustomerAccount.resetPassword(
    emailAddress: "unknown@example.com"
)
assert resultUnknown.confirmationMessage == "check your email"
assert resultUnknown.resetLinkSent == false
return resultKnown
```

#### Walk 2 — Covers: valid reset link opens set-new-password form

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
link: VerificationLink = account.passwordResetVerificationLink
assert link.expiryTime > now()
assert link.oneTimeUseFlag == false  // not yet consumed
// Customer Account.reset password — valid link enables set-new-password entry (presentation gate; no password change until submit)
return link
```

#### Walk 3 — Covers: password update invalidates all customer sessions

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
mobile: CustomerSession = CustomerSession.active(account, device: "mobile phone")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
CustomerAccount.resetPassword(account, newPassword: "NewStr0ngP@ss!")
// invariant: password reset invalidates all customer sessions on all devices
assert mobile.isValid == false
assert laptop.isValid == false
return account
```

#### Walk 4 — Covers: expired reset link rejected

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
link: VerificationLink = account.passwordResetVerificationLink
assert link.expiryTime < now()
// Verification Link.offer resend when expired → Email Verification
result: ResetPasswordResult = CustomerAccount.resetPassword(account, verificationLink: link)
assert result.passwordUpdated == false
assert result.message == "link expired"
assert result.offeredAction == "Request new reset"
// invariant: customer account password remains unchanged
return result
```

#### Walk 5 — Covers: used reset link rejected

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
link: VerificationLink = account.passwordResetVerificationLink
assert link.oneTimeUseFlag == true  // spec Scenario Outline 2: link_status *used*
// Customer Account.reset password — invariant: password unchanged when link already consumed
result: ResetPasswordResult = CustomerAccount.resetPassword(account, verificationLink: link)
assert result.passwordUpdated == false
assert result.message == "link already used"
assert result.offeredAction == "Request new reset"
// invariant: customer account password remains unchanged
return result
```

### **Maintain Session Across Devices — concurrent sessions, expiry preserves cart, password reset cascade**

**Purpose:** Validate *allow concurrent sessions*, session expiry redirect with cart retention, and password-reset session invalidation across devices.
**Concepts traced:** Customer Session, Customer Account, Shopping Cart, Customer Account

#### Walk 1 — Covers: login on new device creates additional customer session

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
tablet: CustomerSession = CustomerAccount.logIn(account, device: "tablet")
// Customer Session.allow concurrent sessions
assert laptop.isValid == true
assert tablet.isValid == true
return tablet
```

#### Walk 2 — Covers: session expiry redirects to login but preserves shopping cart

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
cart: ShoppingCart = account.shoppingCart
assert cart.cartItems.count == 3
session: CustomerSession = CustomerSession.active(account)
session.sessionToken = expiredToken  // inactivity timeout or max duration
// Customer Session.session token + inactivity timeout — expired token invalidates authenticated request
assert session.sessionToken.isValid == false
// GAP: presentation middleware redirects to login on protected request — no Customer Session.evaluate() CRC operation
// invariant: shopping cart tied to customer account retains all entries
assert account.shoppingCart.cartItems.count == 3
return cart
```

#### Walk 3 — Covers: password reset invalidates all customer sessions

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
laptop: CustomerSession = CustomerSession.active(account, device: "laptop")
tablet: CustomerSession = CustomerSession.active(account, device: "tablet")
CustomerAccount.resetPassword(account, newPassword: "NewStr0ngP@ss!")
assert laptop.isValid == false
assert tablet.isValid == false
return account
```

### **Save Delivery Address — checkout save, first-default, additional entry**

**Purpose:** Validate *accept new entry from checkout* on *address book*, first-address default rule, and non-destructive additional saves.
**Concepts traced:** Address Book, Saved Address, Shipping Address, Customer Account

#### Walk 1 — Covers: checkout offers save address option for logged-in customer

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
shipping: ShippingAddress = ShippingAddress.collect(
    addressLineOne: "42 Oak Lane",
    city: "Bristol",
    postcode: "BS1 4QT",
    country: "United Kingdom"
)
saved: SavedAddress = AddressBook.acceptNewEntryFromCheckout(
    account.addressBook,
    shipping: shipping,
    saveOptIn: true
)
// Address Book.accept new entry from checkout → Saved Address, Shipping Address
assert saved.addressLineOne == "42 Oak Lane"
assert saved.city == "Bristol"
assert saved.postcode == "BS1 4QT"
return saved
```

#### Walk 2 — Covers: first saved address becomes default address automatically

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.addressBook.savedAddresses.isEmpty()
saved: SavedAddress = AddressBook.acceptNewEntryFromCheckout(
    account.addressBook,
    shipping: ShippingAddress.at("42 Oak Lane", "Bristol", "BS1 4QT")
)
// Address Book.default address designation → Saved Address
// invariant: first saved address becomes default automatically
assert saved.defaultShippingFlag == true
return saved
```

#### Walk 3 — Covers: additional saved address does not replace existing entries

```
book: AddressBook = account.addressBook  // Home at 42 Oak Lane, default true
newEntry: SavedAddress = AddressBook.acceptNewEntryFromAccountSettings(
    book,
    addressLineOne: "10 High Street",
    city: "London",
    postcode: "E1 6AN"
)
assert book.savedAddresses.count == 2
assert newEntry.defaultShippingFlag == false
// invariant: existing Home entry unchanged
assert book.savedAddress("Home").defaultShippingFlag == true
return book
```

### **Manage Saved Addresses — list, edit, delete default, set new default**

**Purpose:** Validate *manage from account settings* CRUD, default demotion on reassignment, and delete-default prompt.
**Concepts traced:** Address Book, Saved Address, Customer Account

#### Walk 1 — Covers: address book lists all saved addresses with default indicated

```
book: AddressBook = CustomerAccount.byEmail("jane.doe@example.com").addressBook
entries: SavedAddress[] = book.savedAddresses
assert entries.count == 2
defaultAddr: SavedAddress = book.defaultAddress
assert defaultAddr.addressLabel == "Home"
assert defaultAddr.addressLineOne == "42 Oak Lane"
return book
```

#### Walk 2 — Covers: edited saved address persists for future checkouts

```
saved: SavedAddress = SavedAddress.byLabel("Home")
saved.city = "Bath"
SavedAddress.manageFromAccountSettings(saved)
// invariant: historical orders retain snapshot — edit affects future checkouts only
assert saved.city == "Bath"
return saved
```

#### Walk 3 — Covers: deleting default saved address prompts new default selection

```
book: AddressBook = account.addressBook
home: SavedAddress = book.savedAddress("Home")  // default
work: SavedAddress = book.savedAddress("Work")
SavedAddress.manageFromAccountSettings(home, action: delete)
// Address Book invariant: deleting default requires selecting new default when others remain
assert book.promptsNewDefaultSelection == true
assert book.offeredDefault == work
return book
```

#### Walk 4 — Covers: setting new default address demotes previous default

```
home: SavedAddress = book.savedAddress("Home")  // defaultShippingFlag true
work: SavedAddress = book.savedAddress("Work")  // defaultShippingFlag false
AddressBook.defaultAddressDesignation(book, newDefault: work)
assert work.defaultShippingFlag == true
assert home.defaultShippingFlag == false
// Saved Address.selectable at checkout — future checkouts pre-select Work
return work
```

### **Select Saved Address at Checkout — pre-select, auto-fill, different address, guest manual only**

**Purpose:** Validate *pre-fill from saved address*, checkout selection, manual override with save opt-in, and guest-checkout coexistence without address book.
**Concepts traced:** Shipping Address, Saved Address, Address Book, Guest Checkout, Customer Account

#### Walk 1 — Covers: saved addresses shown with default pre-selected at shipping step

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
book: AddressBook = account.addressBook
options: SavedAddress[] = book.savedAddresses
assert options.contains(label: "Home", defaultShippingFlag: true)
// Shipping Address.pre-fill from saved address → Saved Address, Address Book
preSelected: SavedAddress = book.defaultAddress
assert preSelected.addressLabel == "Home"
return preSelected
```

#### Walk 2 — Covers: selecting saved address auto-fills shipping fields and advances checkout

```
work: SavedAddress = book.savedAddress("Work")
shipping: ShippingAddress = ShippingAddress.preFillFromSavedAddress(work, book)
// Billing Address.select from saved address — shipping step uses Saved Address collaborator
assert shipping.addressLineOne == "10 High Street"
assert shipping.city == "London"
assert shipping.postcode == "E1 6AN"
// Shipping Address.copy to confirmed order — required fields complete advances checkout
assert shipping.requiredFieldsComplete == true
return shipping
```

#### Walk 3 — Covers: use different address reveals manual entry and save option

```
shipping: ShippingAddress = ShippingAddress.manualEntry()
// Shipping Address.save to address book on opt-in — available when logged in
assert shipping.saveToAddressBookOptInAvailable == true
return shipping
```

#### Walk 4 — Covers: guest checkout shows manual address entry only

```
guest: GuestCheckout = GuestCheckout.current()
assert guest.isLoggedIn == false
// invariant: guest checkout remains available alongside logged-in checkout
shipping: ShippingAddress = guest.collectShippingAddress()
assert guest.addressBookSelectionShown == false
assert guest.showsLoginPrompt == true  // dismissible
// invariant: guest details must not persist beyond transaction
return shipping
```

### **Manage Wishlist — add, display stock, add-to-cart retention, remove, guest prompt**

**Purpose:** Validate *require verified customer account*, catalog-linked display, *add to shopping cart* without removal, and guest login prompt.
**Concepts traced:** Wishlist, Wishlist Item, Customer Account, Email Verification, Product, Stock Availability, Shopping Cart

#### Walk 1 — Covers: add to wishlist from product details page

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
assert account.accountVerificationStatus.verificationLabel == "verified"
wishlist: Wishlist = account.wishlist
product: Product = Product.bySku("SKU-DOG-FOOD-01")
item: WishlistItem = WishlistItem(
    parentWishlist: wishlist,
    referencedProduct: product
)
// Wishlist.wishlist items — Wishlist Item references product on parent wishlist
wishlist.wishlistItems.append(item)
// Wishlist.require verified customer account → Email Verification, Customer Session
assert wishlist.contains("SKU-DOG-FOOD-01")
return item
```

#### Walk 2 — Covers: wishlist shows product details and stock availability

```
wishlist: Wishlist = account.wishlist
for each item in wishlist.wishlistItems:
    product: Product = item.referencedProduct
    stock: StockAvailability = item.currentStockAvailabilityAtDisplay()
    // Wishlist.link to catalog for price and stock → Product, Stock Availability
    assert item.currentCatalogPriceAtDisplay == product.price
    assert stock.availableToSellQuantity >= 0
return wishlist
```

#### Walk 3 — Covers: add to cart from wishlist leaves item on wishlist

```
item: WishlistItem = wishlist.itemFor("SKU-DOG-FOOD-01")
item.addToShoppingCart(account.shoppingCart)
// invariant: adding to cart does not remove item from wishlist
assert wishlist.contains("SKU-DOG-FOOD-01")
assert account.shoppingCart.contains("SKU-DOG-FOOD-01")
return account.shoppingCart
```

#### Walk 4 — Covers: remove wishlist item resets product page control

```
item: WishlistItem = wishlist.wishlistItems.find("SKU-DOG-FOOD-01")
wishlist.wishlistItems.remove(item)
// Wishlist.wishlist items collection — no explicit CRC remove operation; see decisions made
assert wishlist.contains("SKU-DOG-FOOD-01") == false
return wishlist
```

#### Walk 5 — Covers: guest add to wishlist shows dismissible login prompt

```
guest: GuestCheckout = GuestCheckout.current()
product: Product = Product.bySku("SKU-DOG-FOOD-01")
// Wishlist.require verified customer account → Email Verification, Customer Session
gate: FeatureGate = EmailVerification.blockAccountOnlyFeatures(
    targetAccount: null,
    session: null,
    feature: "wishlist"
)
assert gate.prompt == "log in or register"
assert gate.dismissible == true
assert gate.productAdded == false
return gate
```

### references

**Ref — Register Account**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Register Account / Scenario 2
Extract: partial

```source
Given no **Customer Account** exists for **email address** *jane.doe@example.com*
When the customer submits **email address** *jane.doe@example.com* and password *Str0ngP@ss!* with matching confirmation
Then a **Customer Account** is created for *Jane Doe* with **account verification status** *unverified*
And the system triggers **Email Verification** to *jane.doe@example.com*
```

**Ref — Guest checkout coexistence**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Select Saved Address at Checkout / Scenario 4
Extract: partial

```source
Given a guest customer with a **Shopping Cart** is not logged in
When the guest reaches the shipping step during **Guest Checkout**
Then no **Address Book** selection is shown — only manual **Shipping Address** entry
And **Guest Checkout** proceeds without requiring a **Customer Account**
```

### decisions made

- Registration password-requirement validation is modeled on *Customer Account.register via email and password* — presentation shows rules; domain rejects before persist.
- Duplicate-email error messaging is a registration concern — CRC invariant on unique *email address* drives rejection without *account verification status* leak.
- *Registration form* and confirmation screens are presentation surfaces — walks enter through CRC operations only; `RegistrationForm.open()` is presentation setup with no domain mutation.
- Field-level login/registration UI copy (*check your email*, *invalid email or password*, *already verified*, *link expired*) documented as walk outcomes from CRC invariants; CRC does not define message-delivery operations on *Verification Link* click — resend and transition paths use *Email Verification* responsibilities.
- Password-reset link click before password submit is a presentation gate — *Customer Account.reset password* owns password update and session invalidation; expired/used link rejection uses *Verification Link* one-time-use and expiry invariants plus *Customer Account.reset password* with no password change. `passwordResetVerificationLink` is walk shorthand for reset *Verification Link* issued by *Customer Account.reset password* email request.
- Session expiry redirect to login is presentation middleware — no CRC session-evaluation operation; *Customer Session* `session token` and `inactivity timeout` properties determine validity; cart retention is on *Customer Account* / *Shopping Cart* (GAP recorded in Maintain Session Walk 2).
- Guest wishlist prompt is outcome of *Email Verification.block account-only features* collaborating with *Wishlist.require verified customer account*.
- Wishlist item add/remove is collection management on *Wishlist.wishlist items* via *Wishlist Item* state-carrier — no explicit CRC add/remove operation names; walks compose *Wishlist Item* with *referenced product* and assert post-state.

---

## **Order**

Order history, reorder from prior purchases, and account-persistent shopping cart behavior.

### **View Order History — list, detail, empty state, retroactive guest association**

**Purpose:** Validate *order history* chronology, full detail with snapshots, empty state, and *retroactively associate guest orders*.
**Concepts traced:** Order History, Order, Customer Account, Guest Checkout, Order Line Item, Tracking Number, Payment, Saved Payment Method

#### Walk 1 — Covers: order history lists orders most recent first

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
history: OrderHistory = account.orderHistory
// Order History.associated orders — most recent first
orders: Order[] = history.associatedOrders
assert orders[0].orderNumber == "ORD-1002"
assert orders[1].orderNumber == "ORD-1001"
// Order History.display order summary per row → Order
return history
```

#### Walk 2 — Covers: order detail shows full snapshot including tracking

```
order: Order = Order.byNumber("ORD-1002")
detail: OrderDetail = OrderHistory.openFullOrderDetail(history, order)
// Order History.open full order detail → Order, Order Line Item, Delivery Option, Payment, Tracking Number
assert detail.orderLineItems.count >= 1
assert detail.trackingNumber.carrierReference == "RM-1Z999AA10123456784"
assert detail.maskedPaymentMethod.lastFourDigits == "4242"
return detail
```

#### Walk 3 — Covers: empty order history shows start shopping prompt

```
account: CustomerAccount = CustomerAccount.byEmail("new.customer@example.com")
history: OrderHistory = account.orderHistory
assert history.associatedOrders.isEmpty()
assert history.emptyStatePrompt == "start shopping"
return history
```

#### Walk 4 — Covers: guest order retroactively associated when email matches new account

```
guestOrder: Order = Order.byNumber("ORD-0999")  // guest checkout, sarah.jones@example.com
account: CustomerAccount = CustomerAccount.registerViaEmailAndPassword(
    emailAddress: "sarah.jones@example.com",
    password: "Str0ngP@ss!"
)
// Customer Account.retroactively associate guest orders → Order, Guest Checkout
CustomerAccount.retroactivelyAssociateGuestOrders(account)
assert account.orderHistory.contains("ORD-0999")
return account.orderHistory
```

### **Reorder Previous Purchase — full reorder, delisted skip, out-of-stock warning, cart merge**

**Purpose:** Validate *reorder* from *order history*, delisted skip with partial success, out-of-stock warning, and quantity merge into existing cart.
**Concepts traced:** Reorder, Order History, Order, Order Line Item, Product, Stock Availability, Shopping Cart, Cart Item

#### Walk 1 — Covers: reorder adds all order line items to shopping cart

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
history: OrderHistory = account.orderHistory
source: Order = Order.byNumber("ORD-1001")
reorder: Reorder = OrderHistory.provideEntryPointForReorder(history, source)
cart: ShoppingCart = account.shoppingCart
Reorder.addProductsWithOriginalQuantities(reorder, source.orderLineItems, targetCart: cart)
// Reorder.add products with original quantities → Order Line Item, Product
assert cart.quantityFor("SKU-DOG-FOOD-01") == 2
assert cart.quantityFor("SKU-LEASH-03") == 1
// Reorder.navigate to shopping cart for review → Shopping Cart
return cart
```

#### Walk 2 — Covers: reorder skips delisted product with partial success

```
source: Order = Order.byNumber("ORD-1001")  // includes SKU-DISCONTINUED
reorder: Reorder = OrderHistory.provideEntryPointForReorder(account.orderHistory, source)
cart: ShoppingCart = account.shoppingCart
Reorder.addProductsWithOriginalQuantities(reorder, source.orderLineItems, targetCart: cart)
// Reorder.skip delisted products → Product
assert reorder.skipped.contains(sku: "SKU-DISCONTINUED", reason: "product delisted")
assert reorder.partialSuccess == true
assert cart.containsAvailableItems == true
return cart
```

#### Walk 3 — Covers: reorder adds out-of-stock product with warning and options

```
line: OrderLineItem = source.lineItemFor("SKU-LEASH-03")
stock: StockAvailability = StockAvailability.forProduct("SKU-LEASH-03")
assert stock.availableToSellQuantity == 0
cartItem: CartItem = Reorder.warnOnOutOfStockProducts(line, cart: account.shoppingCart)
// Reorder.warn on out of stock products → Stock Availability, Cart Item
assert cartItem.stockWarning.isPresent()
assert cartItem.options == ["proceed anyway", "remove"]
return cartItem
```

#### Walk 4 — Covers: reorder merges quantities into existing shopping cart

```
account.shoppingCart.add(product: Product.bySku("SKU-DOG-FOOD-01"), quantity: 1)
source: Order = Order.byNumber("ORD-1001")
reorder: Reorder = OrderHistory.provideEntryPointForReorder(account.orderHistory, source)
Reorder.addProductsWithOriginalQuantities(reorder, source.orderLineItems, targetCart: account.shoppingCart)
// Reorder.merge duplicate cart items → Cart Item — sums quantities
assert account.shoppingCart.quantityFor("SKU-DOG-FOOD-01") == 3
return account.shoppingCart
```

### references

**Ref — View Order History**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story View Order History / Scenario 4
Extract: partial

```source
Given a **Guest Checkout** **Order** *ORD-0999* was placed with **Guest Email** *sarah.jones@example.com*
When a **Customer Account** is created with **email address** *sarah.jones@example.com*
Then **Order** *ORD-0999* is retroactively associated with that **Customer Account**
And **Order** *ORD-0999* appears in **Order History**
```

**Ref — Reorder partial success**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Reorder Previous Purchase / Scenario 2
Extract: partial

```source
When the customer selects *Reorder* on **Order** *ORD-1001*
Then available **Product** entries are added to the **Shopping Cart**
And a clear message lists *SKU-DISCONTINUED* as unavailable because *product delisted*
And partial **Reorder** succeeds — available items are not blocked
```

### decisions made

- *Order history* page and *start shopping* empty state are presentation — CRC *Order History* owns associated-order list and retroactive inclusion invariant.
- Masked payment display on order detail delegates to *Saved Payment Method* display metadata — walk references *Payment* collaborator on detail open.
- Reorder *proceed anyway* / *remove* choices are cart-item presentation — domain adds item with *Stock Availability* warning via *Reorder.warn on out of stock products*.
- Reorder partial-success skip list (`reorder.skipped`) is walk outcome shorthand for *Reorder.skip delisted products* invariant messaging.

---

## **Payment**

Saved payment method lifecycle and StripeWave-only checkout selection for returning customers.

### **Save Payment Method — checkout save via token, display metadata, second method retains default**

**Purpose:** Validate *save during checkout on opt-in*, vendor-token storage without raw card numbers, and default retention when adding second method.
**Concepts traced:** Saved Payment Method, Payment Vendor, StripeWave, Customer Account, Payment

#### Walk 1 — Covers: checkout offers save payment method via StripeWave token

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
token: VendorToken = StripeWave.tokenize(cardDetailsEnteredAtCheckout)
saved: SavedPaymentMethod = SavedPaymentMethod.saveDuringCheckoutOnOptIn(
    account,
    vendor: StripeWave,
    tokenReference: "tok_sw_4242"
)
// Payment Vendor.tokenize for saved payment method → Saved Payment Method, Customer Account
// invariant: raw card numbers never persist on customer account
assert saved.vendorTokenReference == "tok_sw_4242"
assert account.rawCardNumbersStored == false
return saved
```

#### Walk 2 — Covers: saved payment method stores display metadata only

```
saved: SavedPaymentMethod = account.savedPaymentMethods.last()
assert saved.lastFourDigits == "4242"
assert saved.cardBrand == "Visa"
assert saved.expiryMonth == 12
assert saved.expiryYear == 2027
// future Payment uses vendor-token reference — Saved Payment Method.selectable at checkout
return saved
```

#### Walk 3 — Covers: second saved payment method retains first as default

```
first: SavedPaymentMethod = account.savedPaymentMethod(ending: "4242")  // default
second: SavedPaymentMethod = SavedPaymentMethod.saveDuringCheckoutOnOptIn(
    account, vendor: StripeWave, tokenReference: "tok_sw_5555", lastFour: "5555"
)
assert account.savedPaymentMethods.count == 2
// invariant: first saved method remains default unless customer changes in settings
assert first.defaultPaymentMethodFlag == true
assert second.defaultPaymentMethodFlag == false
return account.savedPaymentMethods
```

### **Manage Saved Payment Methods — list, remove default, set new default**

**Purpose:** Validate saved-method listing, default removal prompt, and default demotion on reassignment.
**Concepts traced:** Saved Payment Method, Customer Account, Payment Vendor

#### Walk 1 — Covers: saved payment methods listed with default indicated

```
methods: SavedPaymentMethod[] = account.savedPaymentMethods
assert methods.count == 2
defaultMethod: SavedPaymentMethod = methods.find(defaultPaymentMethodFlag: true)
assert defaultMethod.lastFourDigits == "4242"
return methods
```

#### Walk 2 — Covers: removing default payment method prompts new default

```
default4242: SavedPaymentMethod = account.savedPaymentMethod(ending: "4242")
alt5555: SavedPaymentMethod = account.savedPaymentMethod(ending: "5555")
SavedPaymentMethod.addAndSoftDelete(default4242, action: remove)
// Saved Payment Method.add and soft-delete — vendor-token reference deleted
assert account.savedPaymentMethods.contains(ending: "4242") == false
assert account.promptsNewDefaultPaymentMethod == true
assert account.offeredDefault == alt5555
return account
```

#### Walk 3 — Covers: setting new default payment method demotes previous default

```
method4242: SavedPaymentMethod = account.savedPaymentMethod(ending: "4242")  // default true
method5555: SavedPaymentMethod = account.savedPaymentMethod(ending: "5555")  // default false
method5555.defaultPaymentMethodFlag = true
method4242.defaultPaymentMethodFlag = false
// Saved Payment Method.default payment method flag — customer changes default in account settings
// future checkouts pre-select method5555 via Saved Payment Method.selectable at checkout
return method5555
```

### **Select Saved Payment Method at Checkout — pre-select, token charge, manual entry, expired token**

**Purpose:** Validate *selectable at checkout*, *StripeWave* token charge, manual override with save opt-in, and expired-token marking without silent charge.
**Concepts traced:** Saved Payment Method, Payment, StripeWave, Customer Account, Order

#### Walk 1 — Covers: saved payment methods shown with default pre-selected

```
methods: SavedPaymentMethod[] = account.savedPaymentMethods
preSelected: SavedPaymentMethod = methods.find(defaultPaymentMethodFlag: true)  // ending 4242
// Saved Payment Method.selectable at checkout → Order, Payment
assert preSelected.defaultPaymentMethodFlag == true
return preSelected
```

#### Walk 2 — Covers: selecting saved payment method charges via vendor token

```
method: SavedPaymentMethod = account.savedPaymentMethod(token: "tok_sw_4242")
payment: Payment = Payment.initiateAuthorizeCaptureSettle(
    order: Order.pending(),
    vendor: StripeWave,
    savedPaymentMethod: method
)
// Payment.initiate authorize-capture-settle → StripeWave, Saved Payment Method
// StripeWave.receive card details or saved token
assert payment.processingVendor is StripeWave
assert payment.paymentMethodUsed == method
return payment
```

#### Walk 3 — Covers: use different payment method reveals manual entry and save option

```
// manual StripeWave entry at checkout with save opt-in
token: VendorToken = StripeWave.tokenize(newCardDetails)
SavedPaymentMethod.saveDuringCheckoutOnOptIn(account, vendor: StripeWave, token)
return token
```

#### Walk 4 — Covers: expired vendor token marked and not silently charged

```
expired: SavedPaymentMethod = account.savedPaymentMethod(token: "tok_sw_expired")
assert expired.expiryYear == 2024
assert expired.isExpired() == true
// Saved Payment Method.invariant: vendor token must remain valid or be marked expired
// Saved Payment Method.selectable at checkout → Order, Payment — expired method shown but not chargeable
assert expired.markedExpired == true
// Payment.initiate authorize-capture-settle → StripeWave, Saved Payment Method — must not charge expired token
chargeResult: PaymentResult = Payment.initiateAuthorizeCaptureSettle(
    order: Order.pending(),
    vendor: StripeWave,
    savedPaymentMethod: expired
)
assert chargeResult.chargeAttempted == false
return expired
```

### references

**Ref — Save Payment Method**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Save Payment Method / Scenario 1
Extract: partial

```source
Given a logged-in **Customer Account** with **email address** *jane.doe@example.com* completes **Payment** through **StripeWave**
When the customer accepts *save this payment method for future orders*
Then a **Saved Payment Method** is created with **vendor-token reference** *tok_sw_4242*
And raw card numbers are not stored on the **Customer Account**
```

**Ref — Expired token at checkout**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Select Saved Payment Method at Checkout / Scenario 4
Extract: partial

```source
Then that **Saved Payment Method** is marked *expired*
And remaining valid **Saved Payment Method** entries and manual card entry are displayed as alternatives
And the expired token is not used for a **Payment** charge attempt
```

### decisions made

- *StripeWave* is sole active *payment vendor* in Increment 4 — walks never invoke PayNova or VaultPay collaborators.
- Expired-token checkout uses *Saved Payment Method.selectable at checkout* and *Payment.initiate authorize-capture-settle* — **GAP:** checkout UI marks expired methods visually; domain invariant prevents charge on expired vendor token while valid methods and manual entry remain available.
- *Payment* retry with alternate saved method deferred to payment-failure stories (Increment 2/3) — not re-walked here unless selected at checkout.
- Default payment method reassignment uses *Saved Payment Method.default payment method flag* property — no separate CRC operation name beyond account-settings management via *Saved Payment Method.add and soft-delete* collaborator path.

---

## **Notification**

Transactional verification email delivery tied to account registration (cross-cuts Customer Account stories).

### **Send Email Verification — notification channel and retry queue**

**Purpose:** Confirm *Notification* ownership of verification email dispatch and retry queue separate from Customer Account registration persist.
**Concepts traced:** Notification, Email Verification, Confirmation Email (verification path), Customer Account

#### Walk 1 — Covers: verification notification deliver transactional message

```
verification: EmailVerification = CustomerAccount.byEmail("jane.doe@example.com").emailVerification
notification: Notification = Notification.deliverTransactionalMessage(
    trigger: verification,
    recipient: verification.targetCustomerAccount,
    channel: "email"
)
// Notification.deliver transactional message → Email Verification
assert notification.deliveryStatus in ["sent", "queued"]
return notification
```

#### Walk 2 — Covers: queued verification survives delivery failure

```
notification.deliveryStatus = "queued"
Notification.queueFailedDeliveryForRetry(notification)
// invariant: must not block account registration confirmation
assert verification.targetCustomerAccount.registrationConfirmed == true
return notification
```

### references

**Ref — Email delivery retry**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Send Email Verification / Scenario 3
Extract: partial

```source
Then the **Notification** is queued with **delivery status** *queued* for retry
And the registration confirmation screen tells the customer *expect the email shortly*
```

### decisions made

- Verification email is transactional — *Notification.check communication preferences* not applied (marketing deferred Increment 4).
- *Confirmation Email* CRC block targets order confirmation — verification uses generic *Notification* with *Email Verification* trigger per Increment 4 CRC refresh.

---

# Boundary Domain

No Increment 4 boundary walks — account settings and checkout presentation surfaces delegate to core-domain collaborators documented above. *Admin dashboard*, *communication preferences* UI, and *customer pet* CRUD remain deferred.

### decisions made

- Account settings UI (*Address Book*, saved payment methods list) is presentation composing *Address Book* and *Saved Payment Method* — no separate boundary CRC block.
- Deferred scope explicitly omitted from walks: PayNova, VaultPay, *return*, express/same-day delivery, *customer pet* CRUD, *communication preferences* management UI.


---

## increment-5 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## increment-5-walkthrough

<!-- migrated from: increments/5-pay-your-way/engineering/object-model.md -->

---
state: walkthrough
increment_scope: Increment 5 — Pay your way
specification_refresh: Run 6 slot 131
prior_model: crc.md
---

# Module: PawPlace

Walk Increment 5 scenarios through `docs/end-to-end/specification/crc.md` (object model refresh deferred to Engineering). *StripeWave*, *PayNova*, and *VaultPay* are all active at the *payment method selector*; *payment retry* applies to *transient error* across all three vendors; *hard decline* never auto-retries. *Guest checkout* and Increments 1–4 paths remain valid. Full *return* customer flow deferred to Increment 7.

## Scope

**Increment:** Pay your way — multi-vendor payment with retries

**Stories:**

- Process Digital Wallet Payment via PayNova
- Process Buy-Now-Pay-Later via VaultPay
- Retry Failed Payment

**Source graph:** `docs/end-to-end/discovery/stories/story-graph.json` (Increment 5 thin slice)

---

# Core Domain

## **Payment**

Multi-vendor checkout, webhook reconciliation, transient-error retry policy, hard-decline handling, and saved payment method opt-in across *StripeWave*, *PayNova*, and *VaultPay*.

### **Process Digital Wallet Payment via PayNova — selection, cancel, confirm, decline, webhook, save**

**Purpose:** Validate *PayNova* *digital wallet* authentication, cancel path preserving vendor alternatives, successful capture, *hard decline* surfacing, *webhook callback* reconciliation after timeout, and logged-in *saved payment method* opt-in.
**Concepts traced:** Payment Method Selector, PayNova, Digital Wallet, Payment, Payment Confirmation, Vendor Transaction Reference, Hard Decline, Webhook Callback, Order, Confirmation Email, Saved Payment Method, Customer Account

#### Walk 1 — Covers: PayNova selection launches digital wallet authentication

```
order: Order = Order.byNumber("ORD-2001")
assert order.orderStatus == "pending"
assert order.orderTotal == 85.00
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
// Payment Method Selector.present PayNova digital wallet → PayNova, Digital Wallet
selector.presentPayNovaDigitalWallet()
// PayNova.redirect or embed wallet auth → Digital Wallet
authFlow: DigitalWallet = PayNova.redirectOrEmbedWalletAuth(order)
assert authFlow.channel == "mobile wallet credentials"
// Payment Method Selector.route charge to selected vendor → Payment, PayNova
payment: Payment = Payment.processThroughSelectedVendor(
    order: order,
    vendor: PayNova,
    selector: selector
)
assert payment.processingVendor is PayNova
assert payment.paymentStatus == "pending"
return payment
```

#### Walk 2 — Covers: customer cancels PayNova wallet and other vendors remain selectable

```
order: Order = Order.byNumber("ORD-2001")
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
selector.presentPayNovaDigitalWallet()
authFlow: DigitalWallet = PayNova.redirectOrEmbedWalletAuth(order)
// customer cancels before authorisation — no Payment Confirmation
authFlow.cancel()
assert selector.presentStripeWaveCardEntry() == available
assert selector.presentVaultPayBuyNowPayLater() == available
assert order.orderStatus == "pending"
// invariant: must not confirm order until selected vendor returns payment confirmation
assert PaymentConfirmation.forOrder(order) == null
return selector
```

#### Walk 3 — Covers: PayNova payment confirmation confirms order and sends confirmation email

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.byReference("pay_pn_pending_001")
assert payment.processingVendor is PayNova
confirmation: PaymentConfirmation = PayNova.returnPaymentConfirmation(
    vendorConfirmationReference: "pn_txn_7890"
)
// Payment Confirmation.confirm associated order → Order, Stock Availability
PaymentConfirmation.confirmAssociatedOrder(confirmation, order)
assert payment.paymentStatus == "captured"
assert payment.vendorTransactionReference.vendorAssignedIdentifier == "pn_txn_7890"
assert order.orderStatus == "confirmed"
// Payment Confirmation.trigger confirmation email → Notification, Confirmation Email
email: ConfirmationEmail = PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
assert email.recipient == order.placingParty
return order
```

#### Walk 4 — Covers: PayNova hard decline surfaces reason and alternative vendors

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.processThroughSelectedVendor(order, vendor: PayNova)
decline: HardDecline = PayNova.returnHardDecline(declineReason: "insufficient wallet balance")
// Payment.surface hard decline immediately → Hard Decline, Payment Method Selector
Payment.surfaceHardDeclineImmediately(payment, decline)
// Hard Decline.surface immediately at selector → Payment Method Selector, PayNova
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
// Payment Method Selector.display alternatives on decline
alternatives: VendorOption[] = PaymentMethodSelector.displayAlternativesOnDecline(
    decline, vendors: [PayNova, StripeWave, VaultPay]
)
assert alternatives.contains(retry: PayNova)
assert alternatives.contains(StripeWave)
assert alternatives.contains(VaultPay)
assert order.orderStatus == "pending"
// invariant: must not trigger automatic payment retry for hard decline
assert PaymentRetry.forPayment(payment) == null
return selector
```

#### Walk 5 — Covers: PayNova webhook reconciles successful payment after timeout

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.byReference("pay_pn_pending_001")
assert payment.paymentStatus == "pending"
// initial PayNova response timed out — Transient Error classified but webhook arrives
callback: WebhookCallback = PayNova.sendWebhookCallback(
    vendorTransactionReference: "pn_txn_7890",
    reconciliationStatus: "captured"
)
// Payment.reconcile via webhook callback → Webhook Callback
Payment.reconcileViaWebhookCallback(payment, callback)
// Webhook Callback.reconcile pending payment → Payment
WebhookCallback.reconcilePendingPayment(callback, payment)
// Webhook Callback.update order on success → Order, Payment Confirmation
WebhookCallback.updateOrderOnSuccess(callback, order)
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
PaymentConfirmation.triggerConfirmationEmail(
    PaymentConfirmation.fromWebhook(callback), order
)
return payment
```

#### Walk 6 — Covers: PayNova webhook failure leaves order unpaid

```
order: Order = Order.byNumber("ORD-2001")
payment: Payment = Payment.byReference("pay_pn_pending_001")
callback: WebhookCallback = PayNova.sendWebhookCallback(reconciliationStatus: "failed")
Payment.reconcileViaWebhookCallback(payment, callback)
assert payment.paymentStatus == "failed"
assert order.orderStatus == "pending"
// customer notified to retry at payment method selector
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
assert selector.presentStripeWaveCardEntry() == available
assert selector.presentPayNovaDigitalWallet() == available
return payment
```

#### Walk 7 — Covers: logged-in customer offered PayNova wallet save after successful payment

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
payment: Payment = Payment.byVendorReference("pn_txn_7890")
assert payment.processingVendor is PayNova
assert payment.paymentStatus == "captured"
// PayNova.save PayNova wallet token → Saved Payment Method, Customer Account
saved: SavedPaymentMethod = PayNova.savePayNovaWalletToken(
    account: account,
    vendorTokenReference: "tok_pn_wallet_001",
    walletProvider: "PayNova Wallet"
)
// Saved Payment Method.save during checkout on opt-in → Customer Account, PayNova
SavedPaymentMethod.saveDuringCheckoutOnOptIn(account, vendor: PayNova, saved)
assert saved.vendorTokenReference == "tok_pn_wallet_001"
assert saved.processingVendor is PayNova
// invariant: stores only vendor token — never wallet secrets
assert saved.storesWalletSecrets == false
return saved
```

### **Process Buy-Now-Pay-Later via VaultPay — eligibility, instalment, decline, webhook, saved identity**

**Purpose:** Validate *VaultPay* *buy-now-pay-later* flow with *eligibility check* and *instalment plan*, capture, *hard decline*, webhook reconciliation, and per-transaction eligibility on saved identity.
**Concepts traced:** Payment Method Selector, VaultPay, Buy-now-pay-later, Eligibility Check, Instalment Plan, Payment, Payment Confirmation, Hard Decline, Webhook Callback, Order, Saved Payment Method, Customer Account

#### Walk 1 — Covers: VaultPay selection performs eligibility check and presents instalment plan

```
order: Order = Order.byNumber("ORD-2003")
assert order.orderTotal == 200.00
assert order.orderStatus == "pending"
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
// Payment Method Selector.present VaultPay buy-now-pay-later → VaultPay, Buy-now-pay-later
selector.presentVaultPayBuyNowPayLater()
bnplFlow: BuyNowPayLater = VaultPay.redirectOrEmbedBnplFlow(order)
// VaultPay.perform eligibility check → Eligibility Check
check: EligibilityCheck = VaultPay.performEligibilityCheck(order)
assert check.transactionEligibility == "approved"
// VaultPay.present instalment plan → Instalment Plan
plan: InstalmentPlan = VaultPay.presentInstalmentPlan(
    installmentCount: 4,
    installmentAmount: 50.00
)
assert plan.installmentSchedule == "4 × £50.00"
return plan
```

#### Walk 2 — Covers: VaultPay instalment acceptance confirms order

```
order: Order = Order.byNumber("ORD-2003")
plan: InstalmentPlan = InstalmentPlan.accepted(count: 4, amount: 50.00)
confirmation: PaymentConfirmation = VaultPay.returnPaymentConfirmation(
    vendorConfirmationReference: "vp_ref_5001",
    instalmentPlan: plan
)
payment: Payment = Payment.byOrder(order)
payment.instalmentPlanReference = plan
// Payment Confirmation.confirm associated order
PaymentConfirmation.confirmAssociatedOrder(confirmation, order)
assert payment.processingVendor is VaultPay
assert payment.vendorTransactionReference.vendorAssignedIdentifier == "vp_ref_5001"
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
return order
```

#### Walk 3 — Covers: VaultPay hard decline offers StripeWave and PayNova alternatives

```
order: Order = Order.byNumber("ORD-2003")
decline: HardDecline = VaultPay.returnHardDecline(declineReason: "eligibility failed")
// invariant: declines are VaultPay decision — PawPlace surfaces unavailability
Payment.surfaceHardDeclineImmediately(Payment.forOrder(order), decline)
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
alternatives: VendorOption[] = PaymentMethodSelector.displayAlternativesOnDecline(
    decline, vendors: [StripeWave, PayNova]
)
assert alternatives.contains(StripeWave)
assert alternatives.contains(PayNova)
assert order.orderStatus == "pending"
assert PaymentRetry.forOrder(order) == null
return selector
```

#### Walk 4 — Covers: VaultPay webhook reconciles successful BNPL payment after timeout

```
order: Order = Order.byNumber("ORD-2003")
payment: Payment = Payment.byReference("pay_vp_pending_001")
callback: WebhookCallback = VaultPay.sendWebhookCallback(
    vendorTransactionReference: "vp_ref_5001",
    reconciliationStatus: "captured"
)
Payment.reconcileViaWebhookCallback(payment, callback)
WebhookCallback.reconcilePendingPayment(callback, payment)
WebhookCallback.updateOrderOnSuccess(callback, order)
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
return payment
```

#### Walk 5 — Covers: VaultPay webhook failure leaves order unpaid

```
order: Order = Order.byNumber("ORD-2003")
payment: Payment = Payment.byReference("pay_vp_pending_001")
callback: WebhookCallback = VaultPay.sendWebhookCallback(reconciliationStatus: "failed")
Payment.reconcileViaWebhookCallback(payment, callback)
assert payment.paymentStatus == "failed"
assert order.orderStatus == "pending"
return payment
```

#### Walk 6 — Covers: VaultPay saved identity pre-fills but eligibility check runs each transaction

```
account: CustomerAccount = CustomerAccount.byEmail("jane.doe@example.com")
// VaultPay.save VaultPay identity token → Saved Payment Method, Customer Account
saved: SavedPaymentMethod = VaultPay.saveVaultPayIdentityToken(
    account: account,
    vendorTokenReference: "tok_vp_identity_001"
)
SavedPaymentMethod.saveDuringCheckoutOnOptIn(account, vendor: VaultPay, saved)
// future checkout pre-fills VaultPay identity
order: Order = Order.byNumber("ORD-2003")
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
selector.preSelectSavedPaymentMethod(saved)
// invariant: pre-fills identity but still requires eligibility check each transaction
check: EligibilityCheck = VaultPay.performEligibilityCheck(order)
assert check.transactionEligibility == "approved"
return check
```

### **Retry Failed Payment — transient retry, success, exhaustion, hard-decline block, background**

**Purpose:** Validate automatic *payment retry* on *transient error* within *retry window*, successful retry confirmation, exhaustion fallback, *hard decline* never retried, and background continuation when customer navigates away.
**Concepts traced:** Payment, Payment Retry, Transient Error, Retry Window, Hard Decline, Payment Method Selector, PayNova, VaultPay, StripeWave, Order, Payment Confirmation, Confirmation Email, Notification

#### Walk 1 — Covers: transient error triggers automatic payment retry with indicator

```
payment: Payment = Payment.byReference("pay_pn_retry_001")
order: Order = Order.byNumber("ORD-2001")
error: TransientError = TransientError.classify(
    failureType: "network timeout",
    vendor: PayNova
)
assert error.retryableFailureClassification == true
// Transient Error.trigger automatic payment retry → Payment Retry, Payment Vendor, Retry Window
retry: PaymentRetry = TransientError.triggerAutomaticPaymentRetry(error, payment)
// Payment.initiate payment retry on transient error → Payment Retry, Transient Error, Payment Vendor
Payment.initiatePaymentRetryOnTransientError(payment, error)
// Payment Retry.re-attempt through same vendor → Payment, PayNova, Transient Error
PaymentRetry.reAttemptThroughSameVendor(retry, vendor: PayNova)
// Transient Error.display retrying payment indicator → Payment Method Selector
selector: PaymentMethodSelector = TransientError.displayRetryingPaymentIndicator()
assert selector.showsRetryingIndicator == true
assert retry.attemptCount == 1
return retry
```

#### Walk 2 — Covers: successful payment retry confirms order

```
payment: Payment = Payment.byReference("pay_pn_retry_001")
order: Order = Order.byNumber("ORD-2001")
retry: PaymentRetry = PaymentRetry.inProgress(payment, vendor: PayNova)
// Payment Retry.confirm order on success → Order, Payment Confirmation, Confirmation Email
confirmation: PaymentConfirmation = PaymentRetry.confirmOrderOnSuccess(retry, payment)
PaymentConfirmation.confirmAssociatedOrder(confirmation, order)
assert payment.paymentStatus == "captured"
assert order.orderStatus == "confirmed"
PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
return order
```

#### Walk 3 — Covers: retry exhaustion returns customer to payment method selector

```
window: RetryWindow = RetryWindow.configured(maximumAttemptCount: 3, timeLimit: "5 minutes")
payment: Payment = Payment.byReference("pay_vp_retry_001")
order: Order = Order.byNumber("ORD-2003")
retry: PaymentRetry = PaymentRetry.exhausted(payment, attemptCount: 3, window: window)
// Payment Retry.run within retry window → Retry Window
assert PaymentRetry.runWithinRetryWindow(retry, window) == exhausted
// Payment Retry.notify on exhaustion → Payment Method Selector, Notification
PaymentRetry.notifyOnExhaustion(retry)
selector: PaymentMethodSelector = PaymentMethodSelector.forOrder(order)
alternatives: VendorOption[] = PaymentMethodSelector.displayAlternativesOnDecline(
    retryExhaustion: true,
    vendors: [StripeWave, PayNova, VaultPay]
)
assert alternatives.includesManualCardEntry == true
assert order.orderStatus == "pending"
// invariant: only one charge attempt occurs per payment retry cycle
assert retry.singleChargePerCycle == true
return selector
```

#### Walk 4 — Covers: hard decline never triggers automatic payment retry (StripeWave insufficient funds)

```
payment: Payment = Payment.byReference("pay_sw_decline_001")
order: Order = Order.byNumber("ORD-2004")
decline: HardDecline = HardDecline.classify(
    declineReason: "insufficient funds",
    vendor: StripeWave
)
assert decline.nonRetryableFailureClassification == true
// invariant: must not trigger automatic payment retry
assert TransientError.triggerAutomaticPaymentRetry(decline, payment) == blocked
assert Payment.initiatePaymentRetryOnTransientError(payment, decline) == null
Payment.surfaceHardDeclineImmediately(payment, decline)
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
assert selector.displaysAlternativeVendors == true
return selector
```

#### Walk 5 — Covers: hard decline never triggers automatic payment retry (VaultPay BNPL eligibility failure)

```
payment: Payment = Payment.byReference("pay_vp_decline_001")
decline: HardDecline = HardDecline.classify(
    declineReason: "BNPL eligibility failure",
    vendor: VaultPay
)
assert PaymentRetry.forPayment(payment) == null
Payment.surfaceHardDeclineImmediately(payment, decline)
selector: PaymentMethodSelector = HardDecline.surfaceImmediatelyAtSelector(decline)
assert selector.displaysAlternativeVendors == true
return selector
```

#### Walk 6 — Covers: background payment retry confirms order after customer navigates away

```
payment: Payment = Payment.byReference("pay_pn_retry_003")
order: Order = Order.byNumber("ORD-2001")
retry: PaymentRetry = PaymentRetry.inProgress(payment, vendor: PayNova)
retry.backgroundContinuationFlag = true
// Payment.continue payment retry in background → Payment Retry, Order, Confirmation Email
Payment.continuePaymentRetryInBackground(retry, payment, order)
// customer navigated away — retry completes asynchronously
confirmation: PaymentConfirmation = PaymentRetry.confirmOrderOnSuccess(retry, payment)
assert retry.backgroundContinuationFlag == true
assert order.orderStatus == "confirmed"
email: ConfirmationEmail = PaymentConfirmation.triggerConfirmationEmail(confirmation, order)
notification: Notification = Notification.deliverTransactionalMessage(email, order)
assert notification.notificationChannel == "email"
return order
```

#### Walk 7 — Covers: background payment retry exhaustion leaves order unpaid

```
payment: Payment = Payment.byReference("pay_vp_retry_002")
order: Order = Order.byNumber("ORD-2003")
window: RetryWindow = RetryWindow.configured(maximumAttemptCount: 3, timeLimit: "5 minutes")
retry: PaymentRetry = PaymentRetry.exhausted(payment, attemptCount: 3, window: window)
retry.backgroundContinuationFlag = true
Payment.continuePaymentRetryInBackground(retry, payment, order)
PaymentRetry.notifyOnExhaustion(retry)
assert order.orderStatus == "pending"
notification: Notification = Notification.deliverTransactionalMessage(
    event: "payment could not be processed",
    recipient: order.placingParty
)
return notification
```

### references

**Ref — Payment vendors and checkout**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 17
Extract: partial

```source
We're integrating with three payment vendors out of the box: **StripeWave**, **PayNova**, and **VaultPay**. All three work seamlessly — the customer picks their preferred method at checkout and the experience is smooth regardless of which processor handles it. StripeWave handles the credit and debit card processing and is our primary gateway. PayNova is the digital wallet option — it's popular with younger buyers and supports one-tap mobile payments. VaultPay is our buy-now-pay-later provider for bigger purchases (someone dropping two hundred quid on a premium cat tree might appreciate splitting it into instalments). The system should handle all the webhook callbacks, payment confirmations, refund processing, and failed payment retries across all three without the customer ever needing to think about what's happening behind the scenes.
```

**Ref — Process Digital Wallet Payment via PayNova (spec-by-example)**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Process Digital Wallet Payment via PayNova
Extract: partial

```source
WHEN the customer selects PayNova (Digital Wallet) at the payment step
THEN the system redirects to or embeds the PayNova wallet authentication flow
AND the customer authorises the payment using their mobile wallet credentials
```

**Ref — Process Buy-Now-Pay-Later via VaultPay (spec-by-example)**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Process Buy-Now-Pay-Later via VaultPay
Extract: partial

```source
WHEN the customer selects VaultPay (Buy-Now-Pay-Later) at the payment step
THEN the system redirects to or embeds VaultPay's BNPL flow
AND VaultPay performs the Eligibility Check and presents the Instalment Plan to the customer
```

**Ref — Retry Failed Payment (spec-by-example)**
Source: docs/end-to-end/specification/specification-by-example.md
Locator: Story Retry Failed Payment
Extract: partial

```source
WHEN a Payment fails due to a Transient Error (timeout, vendor 5xx, network issue)
THEN the system automatically retries the payment through the same Payment Vendor
AND the customer sees a "retrying payment" indicator — no manual action required
```

### decisions made

- Increment 4 *StripeWave*-only walks in `increment-4-walkthrough.md` remain valid for Increments 1–4 scope; Increment 5 walks supersede sole-vendor constraint for payment-method-selector scenarios only.
- *Order confirmation page* and *retrying payment* UI indicator remain presentation surfaces — walks assert outcomes via domain collaborators (`PaymentMethodSelector`, `Notification`) without inventing page-level CRC classes.
- *Refund* routing foundation modeled in CRC but not walked here — full *return* customer flow deferred to Increment 7.
- GAP: none — all walk steps trace to CRC class responsibilities in `docs/end-to-end/specification/crc.md` slot 127 refresh.

---

# Boundary Domain

Increment 5 adds no new admin or cross-module flows beyond existing order/payment integration. *Guest checkout* and authenticated checkout both route through *payment method selector* unchanged from Increment 4 except for multi-vendor activation.

### references

**Ref — Increment 5 thin slice**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 5
Extract: partial

```source
Outcome: Customers can pay with PayNova (mobile wallet) and VaultPay (buy-now-pay-later) in addition to StripeWave. Failed payments retry automatically across all three.
```

### decisions made

- No separate boundary scenarios required — payment vendor integration is customer-facing checkout only in this increment.


---

## increment-6 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## increment-6-walkthrough

<!-- migrated from: increments/6-pet-visits/engineering/object-model.md -->

---
state: walkthrough
increment: 6
---

# Increment 6 — Walkthrough: Pet visits — gallery and in-store appointments

## Scope

**Epic:** `Pet visits - gallery and in-store appointments`

**Stories:**
- Browse Pets by Species
- View Pet Profile
- View Pet Store Location and Distance
- View Available Time Slots at Store
- Select Date and Time Slot
- Add Visit Note
- Confirm Appointment Booking
- View Upcoming and Past Appointments
- Cancel or Rebook Appointment After Pet Adoption
- Update Pet Profile
- Mark Pet as Adopted
- View Incoming Appointments
- Send Appointment Reminder
- Send Pet Adopted Before Visit Notification
- Check In Customer
- Record Visit Outcome
- Record No-Show
- Set Follow-Up Action
- Send Visit Follow-Up Notification

---

# Core Domain

## **Pet**

Pet gallery browsing and pet lifecycle scenarios walk `Pet Gallery`, `Species`, `Pet`, `Pet Card`, and `Pet Lifecycle Event`. The central CRC invariant governing all browsing: pets are never purchasable; the `appointment booking call-to-action` on a `Pet` is shown only when `pet status` is `available` and hidden when `adopted`. All pets appear in the gallery regardless of status — adopted pets render with an adopted badge.

### **Gallery browsing with species filter — happy path**

**Purpose:** Validate that `Pet Gallery` filters to a single species and presents `Pet Card` entries correctly, including the card heading and store attribution.
**Concepts traced:** Pet Gallery, Species, Pet, Pet Card

#### Walk 1 — Covers: gallery rendered with Dog species filter active (PET-001)

```
gallery: PetGallery = new PetGallery()
gallery.filterBySpecies(species: Species("Dog"))
    // Pet Gallery.filter by species — CRC invariant: when a species filter is active, only pets of that species are shown
    cards: List<PetCard> = gallery.presentPetCardPerPet(species: Species("Dog"))
        // Pet Gallery.present pet card per pet — CRC: one Pet Card per Pet returned by filter
        card1: PetCard = new PetCard(pet: Pet("PET-001"))
            card1.petPhoto      = PetPhoto("pet001_front.jpg")
            card1.petBreed      = Breed("Golden Retriever")
            card1.petSpecies    = Species("Dog")
            card1.hostingStore  = Store("STR-001", storeName: "PawPlace Bristol")
            // Pet Card.link to pet profile page — CRC invariant: each card navigates to the Pet Profile Page for that pet
        return card1
    return cards  // [card1]; expected_card_heading: "Golden Retriever · Dog · PawPlace Bristol"
// filter chip: Dog — expected_filter_style: selected-highlighted
```

#### Walk 2 — Covers: empty state — no available pets for Bird species (edge)

```
gallery: PetGallery = new PetGallery()
gallery.filterBySpecies(species: Species("Bird"))
    // Pet Gallery.show empty state when no pets — CRC invariant: empty state shown when no pets of selected species exist
    pets: List<Pet> = gallery.filterBySpecies(species: Species("Bird"))
    // pets: []
    // gallery renders: "No pets available in this category right now"
    // Pet Gallery.show empty state when no pets — CRC invariant: filter remains active; other species remain selectable
    // expected_other_species: Dog, Cat, Reptile, Small Mammal
    return []
```

### **Adopted pet profile — badge shown, booking CTA suppressed (edge path)**

**Purpose:** Validate that PET-005 (Rex, Adopted) remains viewable on profile but the booking call-to-action is hidden and an adopted badge is rendered.
**Concepts traced:** Pet, Pet Gallery

#### Walk 1 — Covers: adopted pet profile viewed by customer

```
pet: Pet = Pet("PET-005")
    pet.petStatus = "Adopted"
    pet.petBreed  = Breed("Golden Retriever")
    pet.species   = Species("Dog")
    pet.hostingStore = Store("STR-002", storeName: "PawPlace London")
// Pet.appear in pet gallery — CRC invariant: all pets appear regardless of status; adopted pets render with adopted badge
badge: String = "Adopted"
// Pet.appointment booking call-to-action — CRC invariant: shown only when pet status is available; hidden or disabled when adopted
actionArea: String = "This pet has found a home"
// profile photo, breed, species, store details remain visible — CRC invariant: adopted pets are not deleted from gallery
```

### **Mark Pet as Adopted — lifecycle event recorded, notifications triggered (cooperation)**

**Purpose:** Walk the full adoption recording path: `PetLifecycleEvent` appended, `Pet.petStatus` transitions to `Adopted`, `Pet Adopted Before Visit Notification` triggered for each pending appointment.
**Concepts traced:** Pet, Pet Lifecycle Event, Pet Adopted Before Visit Notification, Notification

#### Walk 1 — Covers: store employee marks PET-001 (Buddy) as adopted — APT-001 affected

```
pet: Pet = Pet("PET-001")
    pet.petStatus = "Available"   // before transition

// Store Employee action: mark PET-001 as Adopted
lifecycleEvent: PetLifecycleEvent = new PetLifecycleEvent()
    lifecycleEvent.lifecycleState  = "Adopted"
    lifecycleEvent.transitionedOn  = 2025-06-10
    lifecycleEvent.transitionedBy  = Store("STR-001")
    lifecycleEvent.transitionContext = "Store Employee adoption recording"
    // Pet Lifecycle Event — CRC invariant: each event is immutable once recorded
    // Pet.pet status — CRC invariant: progresses from available to adopted; cannot revert from adopted
pet.lifecycleEvents.append(lifecycleEvent)
pet.petStatus = "Adopted"

// Pet.trigger pet-adopted notification — CRC invariant: triggered when status transitions to adopted and pending appointments exist for this pet
notification: PetAdoptedBeforeVisitNotification = new PetAdoptedBeforeVisitNotification()
    notification.adoptedPet             = pet
    notification.affectedAppointment    = Appointment("APT-001")
    notification.recipient              = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    notification.includeCancelAndBrowseOptions = true
    // Pet Adopted Before Visit Notification.record notification status — CRC invariant: notified status visible per appointment on staff incoming view
    notification.recordNotificationStatus(appointment: Appointment("APT-001"))
        Appointment("APT-001").notificationStatus = "notified"
    Notification.deliverTransactionalMessage(notification)
    // notification body: "Buddy has been adopted. You can cancel your visit or browse other available pets"
    Notification.queueFailedDeliveryForRetry(notification)
    // CRC invariant: email delivery failure must not block pet lifecycle event recording
```

#### Walk 2 — Covers: idempotent adoption attempt — PET-005 already adopted (edge)

```
pet: Pet = Pet("PET-005")
    pet.petStatus = "Adopted"   // already adopted
// Store Employee attempts to mark PET-005 as Adopted again
// Pet.pet status — CRC invariant: cannot revert from adopted; status is already Adopted
// system shows: "Pet is already adopted"
// no PetLifecycleEvent recorded
// expected_notification_count: 0 — no notifications sent
```

### references

**Ref — Pet gallery and lifecycle**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Pet** — Pet, Species, Pet Gallery, Pet Card, Pet Lifecycle Event
Extract: partial

```source
pet status | (available or adopted)
    invariant: must always have a status; progresses from available to adopted; cannot revert from adopted
appear in pet gallery | Pet Gallery
    invariant: all pets appear in the gallery regardless of status; adopted pets render with an adopted badge
appointment booking call-to-action | Appointment
    invariant: shown only when pet status is available; hidden or disabled when adopted
trigger pet-adopted notification | Notification, Appointment
    invariant: triggered when status transitions to adopted and pending appointments exist for this pet
```

**Ref — Pet Gallery filter invariant**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Pet** — Pet Gallery
Extract: partial

```source
filter by species | Species, Pet
    invariant: when a species filter is active, only pets of that species are shown
show empty state when no pets | Species
    invariant: empty state shown when no pets of the selected species exist; filter remains active
```

### decisions made

- `Pet Gallery.filterBySpecies` returns pets of all `lifecycleState` values — adopted pets are included per the gallery invariant. The calling layer applies the adopted badge based on `pet.petStatus`.
- Empty-state path renders the "no pets available" message but does not deactivate the species filter — gallery CRC invariant: filter remains active.
- `PetLifecycleEvent` is appended to `Pet.lifecycleEvents` as an immutable record; `Pet.petStatus` is then updated directly on `Pet` — the event records *who transitioned, when, and why*; the status field reflects the current state.
- On adoption with zero pending appointments: `PetAdoptedBeforeVisitNotification.suppressWhenNoPendingAppointments` applies; no notification sent and no `recordNotificationStatus` call is made.

---

## **Appointment**

Booking lifecycle, slot-hold mechanics, guest rejection, cancellation, and the full staff visit-board workflow walk `Appointment`, `Time Slot`, `Appointment Request`, `Appointment Cancellation`, `Appointment Rebooking`, `Visit Outcome`, `Follow-Up Action`, and `Staff Appointment Workflow`.

### **Full appointment booking — happy path (request → hold → confirm → booked)**

**Purpose:** Walk the complete booking flow: `TimeSlot` held on selection, `AppointmentRequest` confirmed, `Appointment` created, `TimeSlot` consumed, confirmation email queued.
**Concepts traced:** Time Slot, Appointment Request, Appointment, Appointment Confirmation Email, Notification

#### Walk 1 — Covers: logged-in CUST-001 books PET-001 at STR-001, TS-001

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "available"   // before

// Customer opens booking flow from Pet Profile Page
request: AppointmentRequest = new AppointmentRequest()
    request.requestingCustomerAccount = CustomerAccount("CUST-001")
    request.requestedPet              = Pet("PET-001")   // lifecycleState: Available
    request.selectedTimeSlot          = slot
    request.optionalVisitNote         = "Bringing my two kids aged 5 and 7"
    request.slotHoldDuration          = 10  // minutes; configurable

// Time Slot.hold for appointment request — CRC invariant: slot transitions to held on selection; held slot not shown to other customers
slot.holdForAppointmentRequest(request: request)
    slot.bookingStatus = "held"

// Customer confirms
appointment: Appointment = request.confirmToCreateAppointment()
    // Appointment Request.confirm to create appointment — CRC invariant: transitions slot from held to booked and creates a confirmed appointment
    slot.consumeOnBookingConfirmation(appointment: appointment)
        // Time Slot.consume on booking confirmation — CRC invariant: once booked, no longer available to other customers
        slot.bookingStatus = "booked"
    appointment.bookingCustomerAccount   = CustomerAccount("CUST-001")
    appointment.visitedPet               = Pet("PET-001")
    appointment.hostingStore             = Store("STR-001")
    appointment.scheduledDateAndTimeSlot = slot
    appointment.visitNote                = "Bringing my two kids aged 5 and 7"
    appointment.appointmentStatus        = "confirmed"
    appointment.bookingDate              = 2025-06-09
    return appointment
// confirmation heading: "Appointment confirmed — Tue 10 Jun, 10:00 at PawPlace Bristol"

// Appointment.trigger confirmation notification
appointment.triggerConfirmationNotification()
    email: AppointmentConfirmationEmail = new AppointmentConfirmationEmail()
        email.bookingAppointment = appointment
        email.recipient          = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    // Appointment Confirmation Email.deliver on appointment confirmation — CRC invariant: must not block appointment creation when delivery fails
    email.deliverOnAppointmentConfirmation(appointment: appointment)
    // Notification.queue failed delivery for retry — CRC invariant: failure must not block appointment creation
    Notification.queueFailedDeliveryForRetry(email)
```

#### Walk 2 — Covers: hold expiry — slot released back to available (edge)

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "held"
request: AppointmentRequest = AppointmentRequest(customer: CustomerAccount("CUST-001"), slot: slot)
    request.slotHoldDuration = 10  // minutes; hold elapsed without confirmation

// Appointment Request.release slot on hold expiry — CRC invariant: expired hold returns slot to available; customer must re-select
request.releaseSlotOnHoldExpiry(slot: slot)
    // Time Slot.release on hold expiry — CRC invariant: slot returns to available if appointment request not confirmed within hold duration
    slot.releaseOnHoldExpiry(request: request)
        slot.bookingStatus = "available"
// customer sees: "Your hold has expired — please select a new time slot"
```

#### Walk 3 — Covers: concurrent selection — first to confirm wins (shared resource)

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "available"

// CUST-001 selects TS-001
request1: AppointmentRequest = new AppointmentRequest(customer: CustomerAccount("CUST-001"), slot: slot)
slot.holdForAppointmentRequest(request: request1)
    slot.bookingStatus = "held"   // held for CUST-001; TS-001 no longer shown to other customers

// CUST-002 also selects TS-001 in the same window (sees it as available before hold propagated)
request2: AppointmentRequest = new AppointmentRequest(customer: CustomerAccount("CUST-002"), slot: slot)

// CUST-001 confirms first
appointment1: Appointment = request1.confirmToCreateAppointment()
    slot.consumeOnBookingConfirmation(appointment: appointment1)
        slot.bookingStatus = "booked"

// CUST-002 attempts to confirm — slot no longer held for CUST-002
// Appointment Request.confirm to create appointment — CRC invariant: slot must be in held status for this customer to confirm
// CUST-002 blocked: "This slot is no longer available — please pick another"
// CUST-001's appointment is unaffected; expected_first_outcome: "Appointment confirmed"
```

### **Guest booking rejection — authentication gate (failure path)**

**Purpose:** Validate that a guest session cannot complete an appointment booking; the held `TimeSlot` is preserved while the guest is prompted to authenticate.
**Concepts traced:** Appointment Request, Customer Account, Time Slot

#### Walk 1 — Covers: guest attempts to confirm — blocked; TS-001 slot held during auth

```
slot: TimeSlot = TimeSlot("TS-001")
    slot.bookingStatus = "held"   // slot held by the guest session's selection

// Guest session attempts to confirm appointment
request: AppointmentRequest = new AppointmentRequest(customer: null, slot: slot)

// Appointment Request.block on unauthenticated request — CRC invariant: booking step blocked for guest sessions
request.blockOnUnauthenticatedRequest()
    // CustomerAccount required; customer is not logged in
    // page heading: "Log in to book"
    // prompt body: "Appointments require a PawPlace account — log in or register to continue"
    // CRC invariant: slot hold maintained briefly while customer logs in or registers
    slot.bookingStatus = "held"   // unchanged; expected_slot_status: held
```

### **Appointment cancellation after pet adoption — slot released (cancel path)**

**Purpose:** Walk cancellation of APT-003 (adopted PET-005 Rex): `AppointmentCancellation` created, `TimeSlot` TS-010 released, cancellation history recorded, rebooking offer surfaced.
**Concepts traced:** Appointment, Appointment Cancellation, Time Slot, Customer Account, Appointment Rebooking

#### Walk 1 — Covers: customer cancels APT-003 — TS-010 released, rebooking offered

```
appointment: Appointment = Appointment("APT-003")
    appointment.appointmentStatus        = "confirmed"
    appointment.scheduledDateAndTimeSlot = TimeSlot("TS-010")
    appointment.visitedPet               = Pet("PET-005")   // lifecycleState: Adopted
    appointment.bookingCustomerAccount   = CustomerAccount("CUST-001")

// Appointment.cancel appointment — CRC invariant: cancellation releases the booked time slot and records in appointment history
cancellation: AppointmentCancellation = appointment.cancelAppointment()
    cancellation.cancelledAppointment  = appointment
    cancellation.cancellationDate      = 2025-06-09
    cancellation.cancellationReason    = "Pet adopted before visit"

    // Appointment Cancellation.release booked time slot — CRC invariant: releases slot back to available
    cancellation.releaseBookedTimeSlot(slot: TimeSlot("TS-010"), appointment: appointment)
        TimeSlot("TS-010").bookingStatus = "available"
        // Time Slot.release on appointment cancellation — CRC: slot returns to available when cancellation recorded before visit date

    // Appointment Cancellation.record in appointment history — CRC invariant: cancellation recorded in customer account appointment history
    cancellation.recordInAppointmentHistory(account: CustomerAccount("CUST-001"))
    appointment.appointmentStatus = "cancelled"
    // confirmation: "Appointment cancelled — time slot released"

    // Appointment Cancellation.trigger rebooking offer — CRC invariant: surfaced when customer cancels after receiving pet-adopted notification
    cancellation.triggerRebookingOffer()
        rebooking: AppointmentRebooking = new AppointmentRebooking()
            rebooking.cancelledAppointmentReference = cancellation
            // customer navigates to Pet Gallery to select a new pet
            // Appointment Rebooking.follow same booking flow — CRC invariant: follows the same booking confirmation flow as a new appointment
```

### **Staff visit board workflow — check-in, record outcome, set follow-up (staff cooperation)**

**Purpose:** Walk the complete staff-side visit lifecycle for APT-001: check-in recorded, `VisitOutcome` applied, `FollowUpAction` set, follow-up notification scheduled.
**Concepts traced:** Staff Appointment Workflow, Appointment, Visit Outcome, Follow-Up Action, Visit Follow-Up Notification, Notification

#### Walk 1 — Covers: check in CUST-001 for APT-001, record Browsing Only, set schedule-return-visit follow-up

```
workflow: StaffAppointmentWorkflow = StaffAppointmentWorkflow(store: Store("STR-001"))
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus = "confirmed"

// Staff Appointment Workflow.check in customer — CRC invariant: records checked-in time and staff member; blocked if already checked-in or cancelled
workflow.checkInCustomer(appointment: appointment, store: Store("STR-001"))
    appointment.checkedInTime     = 2025-06-10T09:55:00
    appointment.checkedInBy       = Store("STR-001")
    appointment.appointmentStatus = "checked-in"
    // staff view: "Checked in at 09:55 by STR-001"

// Record visit outcome
outcome: VisitOutcome = new VisitOutcome()
    outcome.outcomeCategory         = "Browsing Only"
    outcome.optionalStaffVisitNotes = "Customer enjoyed meeting the dog"

// Visit Outcome.record on checked-in appointment — CRC invariant: can only be recorded after appointment is in checked-in status
outcome.recordOnCheckedInAppointment(appointment: appointment)
    appointment.visitOutcome         = outcome
    appointment.staffVisitNotes      = "Customer enjoyed meeting the dog"
    appointment.appointmentStatus    = "completed"
    // outcome summary: "Browsing Only — Customer enjoyed meeting the dog"

// Set follow-up action
followUp: FollowUpAction = new FollowUpAction()
    followUp.actionType   = "schedule-return-visit"
    followUp.followUpDate = 2025-06-17

// Staff Appointment Workflow.set follow-up action — CRC invariant: follow-up action and date recorded after outcome
workflow.setFollowUpAction(appointment: appointment, followUpAction: followUp)
    appointment.followUpAction = followUp
    appointment.followUpDate   = 2025-06-17
    // follow-up detail: "Return visit scheduled for Tue 17 Jun"

// Follow-Up Action.trigger follow-up notification — CRC invariant: fires on follow-up date when action type is not none; suppressed if pet adopted before follow-up
followUp.triggerFollowUpNotification()
    // scheduled for 2025-06-17 — see Notification KA Walk for full delivery path
```

#### Walk 2 — Covers: Adopted outcome triggers pet status transition (cooperation)

```
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus = "checked-in"
pet: Pet = Pet("PET-001")
    pet.petStatus = "Available"

outcome: VisitOutcome = new VisitOutcome()
    outcome.outcomeCategory = "Adopted"

// Visit Outcome.trigger pet adoption transition — CRC invariant: adopted outcome triggers the same pet status transition and notifications as the Mark Pet as Adopted path
outcome.triggerPetAdoptionTransition(pet: pet, appointment: appointment, notification: Notification)
    lifecycleEvent: PetLifecycleEvent = new PetLifecycleEvent()
        lifecycleEvent.lifecycleState = "Adopted"
        lifecycleEvent.transitionedBy = Store("STR-001")
        // Pet Lifecycle Event — CRC invariant: immutable once recorded
    pet.lifecycleEvents.append(lifecycleEvent)
    pet.petStatus = "Adopted"
    // adoption notifications sent for any other pending appointments referencing PET-001
    // this appointment (APT-001) is now completing → status transitions to completed
    appointment.visitOutcome      = outcome
    appointment.appointmentStatus = "completed"
    // expected_notification_count for other affected appointments: 1 (if APT-002 is also for PET-001)

// Visit Outcome.trigger follow-up prompt — CRC invariant: Interested-Returning outcome prompts staff to set follow-up action
// (not applicable for Adopted outcome — no follow-up prompt shown)
```

### **Record no-show — happy path and blocked edge**

**Purpose:** Walk no-show recording for a missed confirmed appointment; validate that the no-show path is blocked when the appointment is already checked-in.
**Concepts traced:** Staff Appointment Workflow, Appointment

#### Walk 1 — Covers: no-show recorded for confirmed APT-001 after TS-001 passes

```
workflow: StaffAppointmentWorkflow = StaffAppointmentWorkflow(store: Store("STR-001"))
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus        = "confirmed"
    appointment.scheduledDateAndTimeSlot = TimeSlot("TS-001")   // start: 10:00:00; passed without check-in

// Staff Appointment Workflow.record no-show — CRC invariant: blocked if appointment is already checked-in; records staff member and timestamp; triggers follow-up notification to customer
workflow.recordNoShow(appointment: appointment, store: Store("STR-001"))
    appointment.noShowRecordedBy    = Store("STR-001")
    appointment.noShowRecordedAt    = 2025-06-10T10:45:00
    appointment.appointmentStatus   = "no-show"
    Notification.deliverTransactionalMessage(noShowNotification)
    // notification body: "You missed your visit — would you like to rebook?"
```

#### Walk 2 — Covers: no-show blocked — appointment already checked-in (edge)

```
appointment: Appointment = Appointment("APT-001")
    appointment.appointmentStatus = "checked-in"
    appointment.checkedInTime     = 2025-06-10T09:55:00

// Staff Appointment Workflow.record no-show — CRC invariant: blocked if appointment is already checked-in
// system shows: "Cannot mark as no-show — customer was already checked in"
// appointmentStatus remains: "checked-in"
```

### references

**Ref — Appointment booking and staff workflow**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Appointment** — Appointment, Time Slot, Appointment Request, Appointment Cancellation, Visit Outcome, Follow-Up Action, Staff Appointment Workflow
Extract: partial

```source
hold for appointment request | Appointment Request
    invariant: slot transitions to held when customer selects it; held slot is not shown to other customers
block on unauthenticated request | Customer Account
    invariant: booking step blocked for guest sessions; slot hold maintained briefly while customer logs in or registers
cancel appointment | Appointment Cancellation
    invariant: cancellation releases the booked time slot and records in appointment history
check in customer | Appointment, Store
    invariant: records checked-in time and staff member; blocked if appointment is already checked-in or cancelled
record no-show | Appointment, Store
    invariant: blocked if appointment is already checked-in; records staff member and timestamp; triggers follow-up notification to customer
set follow-up action | Appointment, Follow-Up Action
    invariant: follow-up action and date recorded after outcome or no-show; triggers visit follow-up notification on follow-up date
```

### decisions made

- `TimeSlot.holdForAppointmentRequest` (at slot selection) and `AppointmentRequest.confirmToCreateAppointment` (at booking confirm) are two distinct operations — the hold is a temporary reservation, consumed only on confirmation.
- Concurrent booking: the second caller finds the slot no longer `held` for them when it transitions to `booked` on the first confirm. CRC invariant enforces this atomically.
- `AppointmentCancellation.triggerRebookingOffer` navigates to `Pet Gallery`. `AppointmentRebooking.follow same booking flow` then governs the new booking; it must reference a new pet and new time slot per CRC invariant.
- No-show recording triggers a rebook notification via `Notification.deliverTransactionalMessage`. The rebook notification is not a named subtype in CRC; it is dispatched as a `Notification` by `Staff Appointment Workflow.record no-show`. GAP: if this notification grows to have distinct body rules (e.g., suppression on adoption), a named `NoShowRebookNotification` subtype may be warranted in a future CRC refresh.
- `StaffAppointmentWorkflow.showPetAdoptedWarningBadge` and `showNotificationStatus` are staff view read operations; they query `Appointment.visitedPet.petStatus` and the `notificationStatus` recorded by `PetAdoptedBeforeVisitNotification.recordNotificationStatus`. No additional domain operation is required.

---

## **Notification**

Four appointment-specific transactional notification subtypes introduced in Increment 6: `Appointment Confirmation Email`, `Appointment Reminder`, `Pet Adopted Before Visit Notification`, and `Visit Follow-Up Notification`. All four follow the same retry-on-failure pattern established in prior increments: `Notification.queueFailedDeliveryForRetry` must not block the domain action that triggered them.

### **Appointment reminder — sent 24h before; suppressed on cancellation and adoption (edge paths)**

**Purpose:** Validate the reminder 24-hour trigger, cancellation suppression, and the adoption-precedence suppression path.
**Concepts traced:** Appointment Reminder, Appointment, Pet, Notification

#### Walk 1 — Covers: reminder sent 24h before APT-001 (happy path)

```
appointment: Appointment = Appointment("APT-001")
    appointment.scheduledDateAndTimeSlot = TimeSlot("TS-001")   // 2025-06-10T10:00:00
    appointment.appointmentStatus        = "confirmed"
    appointment.visitedPet               = Pet("PET-001", petName: "Buddy")
    appointment.hostingStore             = Store("STR-001", storeName: "PawPlace Bristol")

// Trigger fires at 2025-06-09T10:00:00 (24h before appointment)
reminder: AppointmentReminder = new AppointmentReminder()
    reminder.reminderAppointment = appointment
    reminder.recipient           = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    // Appointment Reminder — CRC invariant: sent 24 hours before the appointment time; includes pet name, store, date/time, and visit note

Notification.deliverTransactionalMessage(reminder)
    // reminder body: "Reminder: visit Buddy at PawPlace Bristol, Tue 10 Jun 10:00. Note: Bringing kids"
Notification.queueFailedDeliveryForRetry(reminder)
    // CRC invariant: failure must not block appointment status
```

#### Walk 2 — Covers: cancelled appointment — reminder suppressed (edge)

```
appointment: Appointment = Appointment("APT-004")
    appointment.appointmentStatus = "cancelled"

// Appointment Reminder.suppress when appointment cancelled — CRC invariant: no reminder sent for cancelled or no-show appointments
reminder: AppointmentReminder = AppointmentReminder(reminderAppointment: appointment)
reminder.suppressWhenAppointmentCancelled(appointment: appointment)
    // reminder outcome: skipped — appointment cancelled
    // Notification.deliverTransactionalMessage not called
```

#### Walk 3 — Covers: adopted pet — adoption notification takes precedence over reminder (edge)

```
appointment: Appointment = Appointment("APT-003")
    appointment.visitedPet.petStatus = "Adopted"
    appointment.appointmentStatus    = "confirmed"

// Appointment Reminder.suppress when pet adopted — CRC invariant: pet-adopted-before-visit notification takes precedence; reminder suppressed
reminder: AppointmentReminder = AppointmentReminder(reminderAppointment: appointment)
reminder.suppressWhenPetAdopted(pet: Pet("PET-005"), appointment: appointment)
    // reminder outcome: skipped — adoption takes precedence
    // expected_notification_type: Pet Adopted Before Visit Notification (sent instead)
```

### **Pet Adopted Before Visit Notification — triggered on adoption; suppressed when no pending appointments (cooperation)**

**Purpose:** Walk the notification sent when a pet with pending appointments is marked adopted; validate the suppression path when no pending appointments exist.
**Concepts traced:** Pet Adopted Before Visit Notification, Pet, Appointment, Notification

#### Walk 1 — Covers: notification sent to CUST-001 on PET-001 adoption (APT-001 pending)

```
notification: PetAdoptedBeforeVisitNotification = new PetAdoptedBeforeVisitNotification()
    notification.adoptedPet             = Pet("PET-001")
    notification.affectedAppointment    = Appointment("APT-001")
    notification.recipient              = CustomerAccount("CUST-001", emailAddress: "jane@example.com")
    notification.includeCancelAndBrowseOptions = true
    // Pet Adopted Before Visit Notification — CRC invariant: one notification per affected customer with a pending appointment for the adopted pet

// Pet Adopted Before Visit Notification.record notification status — CRC invariant: notified or not-yet-notified status visible per appointment on staff incoming appointments view
notification.recordNotificationStatus(appointment: Appointment("APT-001"))
    Appointment("APT-001").notificationStatus = "notified"

Notification.deliverTransactionalMessage(notification)
    // notification body: "Buddy has been adopted. You can cancel your visit or browse other available pets"
Notification.queueFailedDeliveryForRetry(notification)
    // CRC invariant: failure must not block pet lifecycle event recording
```

#### Walk 2 — Covers: no pending appointments — adoption completes, no notification sent (edge)

```
// PET-003 is marked adopted; it has 0 confirmed pending appointments
// Pet Adopted Before Visit Notification.suppress when no pending appointments — CRC invariant: no notification sent if no pending appointments
notification: PetAdoptedBeforeVisitNotification = PetAdoptedBeforeVisitNotification(pet: Pet("PET-003"))
notification.suppressWhenNoPendingAppointments(appointments: [])
    // expected_notification_count: 0
    // adoption event completes; Notification.deliverTransactionalMessage not called
    // Pet("PET-003").petStatus = "Adopted" — lifecycle event recorded; no notification side-effect
```

### **Visit Follow-Up Notification — triggered on date; suppressed when none or pet adopted (edge paths)**

**Purpose:** Walk the follow-up notification fired on `followUpDate`; suppression when `followUpAction` is `none`; suppression when pet adopted before `followUpDate`.
**Concepts traced:** Visit Follow-Up Notification, Follow-Up Action, Appointment, Pet, Notification

#### Walk 1 — Covers: follow-up notification sent on date (hold-pet action, 2025-06-14)

```
appointment: Appointment = Appointment("APT-001")
    appointment.followUpAction = FollowUpAction(actionType: "hold-pet", followUpDate: 2025-06-14)
    appointment.visitedPet     = Pet("PET-001", petName: "Buddy", lifecycleState: "Available")
    appointment.hostingStore   = Store("STR-001", storeName: "PawPlace Bristol")

// Current date: 2025-06-14
// Follow-Up Action.trigger follow-up notification — CRC invariant: fires on follow-up date when action type is not none
followUpNotification: VisitFollowUpNotification = new VisitFollowUpNotification()
    followUpNotification.sourceAppointment        = appointment
    followUpNotification.triggeringFollowUpAction  = FollowUpAction("hold-pet")
    followUpNotification.recipient                 = CustomerAccount("CUST-001")

// Visit Follow-Up Notification — CRC invariant: sent when follow-up date arrives and follow-up action type is not none
Notification.deliverTransactionalMessage(followUpNotification)
    // notification body: "Your hold on Buddy at PawPlace Bristol expires today — visit soon"
Notification.queueFailedDeliveryForRetry(followUpNotification)
```

#### Walk 2 — Covers: follow-up action is none — notification suppressed (edge)

```
appointment: Appointment = Appointment("APT-001")
    appointment.followUpAction = FollowUpAction(actionType: "none")

// Visit Follow-Up Notification.suppress when follow-up action none — CRC invariant: notification fires only when action type is not none
followUpNotification: VisitFollowUpNotification = VisitFollowUpNotification(appointment: appointment)
followUpNotification.suppressWhenFollowUpActionNone(followUpAction: FollowUpAction("none"))
    // follow-up outcome: no notification sent
    // appointment detail reads: "No follow-up set"
```

#### Walk 3 — Covers: pet adopted before follow-up date — adoption notification takes precedence (edge)

```
appointment: Appointment = Appointment("APT-001")
    appointment.followUpAction = FollowUpAction(actionType: "schedule-return-visit", followUpDate: 2025-06-17)
    appointment.visitedPet     = Pet("PET-001", lifecycleState: "Adopted")   // adopted before 2025-06-17

// Visit Follow-Up Notification.suppress when pet adopted before follow-up — CRC invariant: pet-adopted-before-visit notification takes precedence
followUpNotification: VisitFollowUpNotification = VisitFollowUpNotification(appointment: appointment)
followUpNotification.suppressWhenPetAdoptedBeforeFollowUp(pet: Pet("PET-001"))
    // follow-up outcome: skipped — pet adopted before follow-up
    // expected_notification_type: Pet Adopted Before Visit Notification
```

### references

**Ref — Notification — Increment 6 transactional paths**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Notification** — Appointment Confirmation Email, Appointment Reminder, Pet Adopted Before Visit Notification, Visit Follow-Up Notification
Extract: partial

```source
invariant: Increment 6 — appointment confirmation email fires on booking; appointment reminder fires the day before each upcoming appointment; pet-adopted-before-visit notification fires when a booked pet transitions to adopted; visit follow-up notification fires when follow-up date arrives and action is not none
queue failed delivery for retry | Confirmation Email, Shipping Notification, Email Verification, Appointment Confirmation Email, Appointment Reminder, Pet Adopted Before Visit Notification, Visit Follow-Up Notification
    invariant: email delivery failure must not block appointment creation, appointment status, pet lifecycle event recording, or visit outcome recording
```

**Ref — Appointment Reminder suppression rules**
Source: docs/end-to-end/specification/crc.md
Locator: ## **Notification** — Appointment Reminder
Extract: partial

```source
suppress when appointment cancelled | Appointment
    invariant: no reminder sent for cancelled or no-show appointments
suppress when pet adopted | Pet, Appointment
    invariant: pet-adopted-before-visit notification takes precedence; reminder suppressed
```

### decisions made

- All four notification subtypes share the `Notification.queueFailedDeliveryForRetry` delivery path — none blocks the domain action that triggers them. This mirrors the pattern from Increment 2 (order confirmation email) and Increment 4 (email verification).
- Reminder suppression order: (1) check `appointmentStatus` — if `cancelled` or `no-show`, suppress without sending anything; (2) check `pet.petStatus` — if `Adopted` and adoption notification not yet sent, suppress reminder and fire `PetAdoptedBeforeVisitNotification` instead.
- `PetAdoptedBeforeVisitNotification.recordNotificationStatus` writes to the `Appointment` record; `StaffAppointmentWorkflow.showNotificationStatus` reads this field to display "Customer notified" or "Not yet notified" on the staff incoming appointments view.
- GAP: `Visit Follow-Up Notification` suppression when pet adopted (`suppressWhenPetAdoptedBeforeFollowUp`) implies the system must detect that the pet became adopted between when the follow-up was set and when `followUpDate` arrives. This detection logic lives in the notification scheduler checking `pet.petStatus` at trigger time — not a separate CRC responsibility, but worth noting for implementation.
- `AppointmentConfirmationEmail` delivery path: fires unconditionally on booking confirmation; queued for retry on failure per the standard Notification pattern. The appointment is created regardless.


---

## increment-7 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## increment-7-walkthrough

<!-- migrated from: increments/7-returns-refunds/engineering/object-model.md -->

---
state: walkthrough
increment: 7
---

# Increment 7 — Walkthrough: Returns and refunds

## Scope

**Epic:** `Returns and refunds`

**Stories:**
- Initiate Return from Order History
- Generate Return Label or QR Code
- Route Refund through Original Payment Vendor
- Track Refund Status
- Process In-Store Return
- Send Return and Refund Status Update

---

# Core Domain

## **Order**

Return initiation scenarios walk `Order`, `Order History`, `Return`, `Return Request`, `Return Eligibility`, `Return Window`, `Return Reason`, `Returned Items`, `Return Status`, `Return Label`, and `Return QR Code`. The central CRC invariant governing all return initiation: the "Return" action appears on eligible orders in order history when return eligibility is satisfied; items already in "return in progress" cannot be selected again.

### **Initiate return on delivered order within return window — happy path**

**Purpose:** Validate that `Return Eligibility` evaluates per item against `Return Window`, surfaces eligible items, and that `Return Request` creates a `Return` linked to the originating `Order`.
**Concepts traced:** Order, Order History, Return Eligibility, Return Window, Order Line Item, Return Request, Return, Return Reason, Returned Items, Return Status

#### Walk 1 — Covers: customer selects return on delivered order ORD-4401, eligible items shown

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.associatedOrders.find(orderNumber: "ORD-4401")
    // Order.order status = "delivered"; Order.order date = 2026-04-14
eligibility: ReturnEligibility = order.provideEntryPointForReturns()
    // Return Eligibility.return window check — CRC invariant: period starts from delivery date
    window: ReturnWindow = new ReturnWindow(deliveryDateAnchor: 2026-04-14)
    window.evaluateCurrentDate(currentDate: 2026-05-07)
        // 23 days since delivery — within configured period
        return eligible: true
    // Return Eligibility.evaluate per item — CRC invariant: evaluated per item
    item1: OrderLineItem = OrderLineItem("Premium Dog Kibble 10kg", unitPrice: £54.99, quantity: 1)
    item2: OrderLineItem = OrderLineItem("Squeaky Bone Chew", unitPrice: £12.99, quantity: 2)
    eligibility.eligibleItems = [item1, item2]
    return eligibility
// Order History surfaces eligible items with Return Reason picker
```

#### Walk 2 — Covers: return request submitted, Return record created

```
returnRequest: ReturnRequest = new ReturnRequest(
    selectedOrderLineItems: [OrderLineItem("Premium Dog Kibble 10kg")],
    quantitiesToReturn: 1,
    returnReason: ReturnReason(reasonCategory: "changed mind")
)
    // Return Request.create return record — CRC invariant: must be made against order that passes return eligibility
    returnRequest.createReturnRecord(order: Order("ORD-4401"))
        rtn: Return = new Return(originatingOrder: Order("ORD-4401"))
        rtn.returnDate = 2026-05-07
        rtn.initiatingParty = CustomerAccount("sarah.mitchell@pawplace.example")
        rtn.returnedItems = ReturnedItems(orderLineItemReference: OrderLineItem("Premium Dog Kibble 10kg"), returnedQuantity: 1)
        rtn.returnStatus = ReturnStatus(lifecycleState: "initiated")
            // Return Status.surface on order detail — CRC invariant: visible under order detail
        // Return Request.surface return status immediately — CRC: appears in Customer Account under Order detail
        return rtn  // RTN-7001
return
```

### **Return action hidden when outside return window — failure path**

**Purpose:** Validate that `Return Eligibility` hides the return action when the `Return Window` has expired, and surfaces the ineligibility reason.
**Concepts traced:** Order, Order History, Return Eligibility, Return Window

#### Walk 1 — Covers: order ORD-4402 delivered 2026-02-05, current date 2026-05-07 — window expired

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.associatedOrders.find(orderNumber: "ORD-4402")
    // Order.order status = "delivered"; delivered 2026-02-05
eligibility: ReturnEligibility = new ReturnEligibility(order: Order("ORD-4402"))
    window: ReturnWindow = new ReturnWindow(deliveryDateAnchor: 2026-02-05)
    window.evaluateCurrentDate(currentDate: 2026-05-07)
        // 91 days since delivery — outside configured period
        return eligible: false
    // Return Eligibility.hide or disable return action — CRC invariant: "Return" action must not appear on order whose return window has expired
    eligibility.ineligibilityReason = "return window expired"
    return eligibility
// "Return" action hidden on ORD-4402; reason displayed: "return window expired"
```

### **Partial return — previously returned items excluded, remaining items returnable**

**Purpose:** Validate that `Return` supports partial returns — items already in "return in progress" cannot be selected again; remaining eligible items are still returnable.
**Concepts traced:** Order, Return, Return Eligibility, Returned Items, Order Line Item, Return Status

#### Walk 1 — Covers: ORD-4401 with existing return on Premium Dog Kibble, Squeaky Bone Chew still returnable

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.associatedOrders.find(orderNumber: "ORD-4401")
existingReturn: Return = order.returns.find(returnedItems: OrderLineItem("Premium Dog Kibble 10kg"))
    existingReturn.returnStatus.lifecycleState = "initiated"
eligibility: ReturnEligibility = order.provideEntryPointForReturns()
    // Return.support partial returns — CRC invariant: items already in "return in progress" cannot be returned again
    item1: OrderLineItem = OrderLineItem("Premium Dog Kibble 10kg")
        item1.returnInProgress = true  // shows "return in progress", cannot be selected
    item2: OrderLineItem = OrderLineItem("Squeaky Bone Chew", quantity: 2)
        item2.returnInProgress = false  // shows "Return Eligible", can be selected
    eligibility.eligibleItems = [item2]
    return eligibility
// item1 disabled: "return in progress"; item2 selectable for separate Return
```

### **Return label and QR code generation — happy path**

**Purpose:** Validate that `Return Label` and `Return QR Code` are generated on return request submission, both encoding the same return reference.
**Concepts traced:** Return, Return Request, Return Label, Return QR Code

#### Walk 1 — Covers: RTN-7001 return label and QR code generated after submission

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
    // Return.return label — CRC invariant: both generated on successful return request submission
    label: ReturnLabel = new ReturnLabel()
        label.returnAddress = "PawPlace Returns Centre"
        label.orderNumber = "ORD-4401"
        label.returnReference = "RTN-7001"
        label.carrierBarcode = generated
        // Return Label — CRC invariant: printable PDF generated when return request is submitted successfully
    qrCode: ReturnQRCode = new ReturnQRCode()
        qrCode.returnReference = "RTN-7001"
        // Return QR Code — CRC invariant: mobile-displayable code generated alongside return label
        // Return QR Code — CRC invariant: encodes the same return reference as the return label
    rtn.returnLabel = label
    rtn.returnQRCode = qrCode
    // Both shown on Return confirmation page
    // Both emailed to CustomerAccount("sarah.mitchell@pawplace.example")
return
```

#### Walk 2 — Covers: label generation service unavailable — return preserved (failure path)

```
rtn: Return = Return("RTN-7002", originatingOrder: Order("ORD-5502"))
    // Attempt label generation
    label: ReturnLabel = attemptGenerate()
        // service unavailable — generation fails
        raise ServiceUnavailable("Return Label generation service temporarily unavailable")
    // Return is still recorded — CRC: return request creates the return record
    rtn.returnStatus = ReturnStatus(lifecycleState: "initiated")
    // Return not cancelled due to label generation failure
    // Customer told to check back or contact support for the label
return
```

### references

**Ref — Returns and exchanges**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: whole

```source
Returns and exchanges need a clear policy and an easy online process. Someone should be able to initiate a return from their order history, print a label or get a QR code, and track the refund status. Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer. For in-store returns it's a different flow but the system should still reflect it in their account.
```

**Ref — Initiate Return from Order History (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Initiate Return from Order History"
Extract: partial

```source
1. WHEN the customer selects "Return" on an eligible order in Order History
THEN the system shows which items in the order are Return Eligible
AND the customer selects the items and quantities to return, plus a return reason
```

**Ref — Generate Return Label or QR Code (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Generate Return Label or QR Code"
Extract: partial

```source
WHEN the Return Request is submitted
THEN the system generates a Return Label (PDF) and a Return QR Code
AND both are shown on the return confirmation page and emailed to the customer
```

### decisions made

- Return Eligibility evaluates per item with Return Window anchored on delivery date — consistent with CRC invariant. Category-specific variation deferred to configuration.
- Return Label and Return QR Code are separate classes, each generated independently but sharing the same return reference. Label is printable PDF; QR is mobile-displayable.
- Partial return is a cooperation pattern: existing Return blocks re-selection, while remaining items are evaluated independently by Return Eligibility.
- Label generation failure does not cancel the Return — the Return record and Return Status persist independently of label availability.

---

## **Payment**

Refund routing scenarios walk `Refund`, `Refund Status`, `Refund Retry`, `Payment`, `Payment Vendor`, `StripeWave`, `PayNova`, `VaultPay`, and `Instalment Plan`. The central CRC invariant: refund must always route through the payment vendor that handled the original transaction; customer sees only refund status — never vendor mechanics.

### **Refund routed through StripeWave for card payment — happy path**

**Purpose:** Validate that `Refund` routes through the original `Payment Vendor` (`StripeWave`) using the `Vendor Transaction Reference`, and creates a `Refund Status` in processing state.
**Concepts traced:** Return, Refund, Payment, Payment Vendor, StripeWave, Vendor Transaction Reference, Refund Status, Returned Items

#### Walk 1 — Covers: RTN-7001 refund of £54.99 routed through StripeWave

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
    returnedItems: ReturnedItems = rtn.returnedItems
        // Returned Items received, inspection passes
        returnedItems.triggerRestockingOnInspectionPass()
    // Return.route refund through original vendor — CRC invariant: refund must always route through the payment vendor that handled the original transaction
    payment: Payment = Order("ORD-4401").completedPayment
        vendorRef: VendorTransactionReference = payment.vendorTransactionReference  // "sw_txn_4401"
        originalVendor: PaymentVendor = payment.processingVendor  // StripeWave
    refund: Refund = new Refund(originatingReturn: Return("RTN-7001"))
        refund.refundReference = "REF-3001"
        refund.refundAmount = £54.99
            // Refund.refund amount — CRC invariant: must match the returned items value
        refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: "sw_txn_4401")
            // Refund.vendor refund API route — CRC invariant: StripeWave card refunds routable
            StripeWave.processRefund(refund: Refund("REF-3001"), vendorRef: "sw_txn_4401")
        refund.refundStatus = RefundStatus(lifecycleState: "processing")
            // Refund Status.transition to processing — CRC invariant: transitions when return inspection passes and refund request is sent to payment vendor
    return refund
```

### **Refund routed through PayNova for digital wallet payment**

**Purpose:** Validate that the vendor-routing abstraction works for `PayNova` wallet credits in addition to StripeWave card refunds.
**Concepts traced:** Return, Refund, Payment, Payment Vendor, PayNova, Refund Status

#### Walk 1 — Covers: RTN-7002 refund of £24.99 routed through PayNova

```
rtn: Return = Return("RTN-7002", originatingOrder: Order("ORD-5502"))
    // Returned Items received and inspection passes
payment: Payment = Order("ORD-5502").completedPayment
    vendorRef: VendorTransactionReference = payment.vendorTransactionReference  // "pn_txn_5502"
    originalVendor: PaymentVendor = payment.processingVendor  // PayNova
refund: Refund = new Refund(originatingReturn: Return("RTN-7002"))
    refund.refundReference = "REF-3002"
    refund.refundAmount = £24.99
    refund.routeThroughOriginalVendor(vendor: PayNova, vendorRef: "pn_txn_5502")
        // Payment Vendor.process refund — CRC invariant: PayNova wallet credits routable
        PayNova.processRefund(refund: Refund("REF-3002"), vendorRef: "pn_txn_5502")
    refund.refundStatus = RefundStatus(lifecycleState: "processing")
return refund
```

### **Refund routed through VaultPay with instalment plan adjustment**

**Purpose:** Validate that `VaultPay` refunds adjust the `Instalment Plan` and route through the vendor's BNPL-specific refund API.
**Concepts traced:** Return, Refund, Payment, Payment Vendor, VaultPay, Instalment Plan, Refund Status

#### Walk 1 — Covers: RTN-7003 refund of £199.99 routed through VaultPay with instalment plan adjustment

```
rtn: Return = Return("RTN-7003", originatingOrder: Order("ORD-6603"))
    // Returned Items received and inspection passes
payment: Payment = Order("ORD-6603").completedPayment
    vendorRef: VendorTransactionReference = payment.vendorTransactionReference  // "vp_txn_6603"
    originalVendor: PaymentVendor = payment.processingVendor  // VaultPay
refund: Refund = new Refund(originatingReturn: Return("RTN-7003"))
    refund.refundReference = "REF-3003"
    refund.refundAmount = £199.99
    refund.routeThroughOriginalVendor(vendor: VaultPay, vendorRef: "vp_txn_6603")
        // Refund.vendor refund API route — CRC invariant: VaultPay instalment plan adjustments routable
        VaultPay.processRefund(refund: Refund("REF-3003"), vendorRef: "vp_txn_6603")
            // Instalment Plan adjusted by VaultPay
            instalmentPlan: InstalmentPlan = VaultPay.adjustInstalmentPlan(refundAmount: £199.99)
    refund.refundStatus = RefundStatus(lifecycleState: "processing")
return refund
```

### **Refund queued for retry on vendor failure — failure path**

**Purpose:** Validate that `Refund Retry` queues the refund when the vendor is unavailable, and that the customer sees "processing" — never "refund failed".
**Concepts traced:** Refund, Refund Retry, Payment Vendor, StripeWave, Refund Status

#### Walk 1 — Covers: REF-3001 StripeWave vendor downtime — retry queued

```
refund: Refund = Refund("REF-3001", originatingReturn: Return("RTN-7001"))
    refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: "sw_txn_4401")
        // StripeWave.processRefund fails — vendor downtime
        raise VendorUnavailable("StripeWave vendor downtime")
    // Refund.handle vendor failure — CRC invariant: vendor failure queued for automatic re-attempt; customer sees "refund processing" — never "refund failed"
    refundRetry: RefundRetry = new RefundRetry(refund: Refund("REF-3001"))
        refundRetry.attemptCount = 1
        refundRetry.retryStatus = "queued"
        // Refund Retry — CRC invariant: automatic retry when vendor is temporarily unavailable
        // Refund Retry — CRC invariant: must always use the same payment vendor as the original refund attempt
    refund.refundStatus = RefundStatus(lifecycleState: "processing")
        // Refund Status — CRC invariant: must not show "refund failed" to the customer
return
```

### **Refund escalated to requires review after retry exhaustion — failure path**

**Purpose:** Validate that `Refund Status` transitions to "requires review" when all `Refund Retry` attempts are exhausted, triggering the `Refund Under Review Notification`.
**Concepts traced:** Refund, Refund Retry, Refund Status, Refund Under Review Notification

#### Walk 1 — Covers: REF-3001 all retry attempts exhausted — escalation

```
refund: Refund = Refund("REF-3001", originatingReturn: Return("RTN-7001"))
refundRetry: RefundRetry = RefundRetry(refund: Refund("REF-3001"))
    refundRetry.attemptCount = maxAttempts
    // Final retry attempt fails
    refundRetry.reAttemptThroughSameVendor(vendor: StripeWave)
        raise VendorUnavailable("StripeWave still unavailable")
    // Refund Retry.transition refund status on exhaustion — CRC invariant: on exhaustion transitions refund status to "requires review"
    refundRetry.transitionRefundStatusOnExhaustion()
        refund.refundStatus = RefundStatus(lifecycleState: "requires review")
            // Refund Status.transition to requires review — CRC invariant: triggers refund under review notification
    // Refund.escalate on retry exhaustion — CRC invariant: transitions refund status to "requires review" and triggers refund under review notification
    refund.escalateOnRetryExhaustion()
        notification: RefundUnderReviewNotification = new RefundUnderReviewNotification(
            returnAndOrderReference: Return("RTN-7001"), Order("ORD-4401"),
            supportGuidance: "contact support",
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
        Notification.deliverTransactionalMessage(notification)
return
```

### references

**Ref — Refund routing through original vendor**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial

```source
Refunds go back through whichever payment vendor handled the original transaction — that should be invisible to the customer.
```

**Ref — Route Refund through Original Payment Vendor (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
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

**Ref — Increment 7 refund routing design rule**
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 7
Extract: partial

```source
Slicing notes: The vendor-routing invariant on refund is the design rule that drives this slice — refund must always route through the vendor that took the original payment, regardless of which vendor mix the customer has used since.
```

### decisions made

- Refund routing generalises across all three vendors (StripeWave, PayNova, VaultPay) — each vendor's `processRefund` receives the original `Vendor Transaction Reference`. VaultPay additionally adjusts `Instalment Plan`.
- Refund Retry parallels Payment Retry in pattern but operates on a different lifecycle event (post-return inspection, not checkout) and escalates to "requires review" rather than returning to payment method selector.
- Customer never sees "refund failed" — Refund Status shows "processing" during retry and "requires review" on exhaustion. This is a hard CRC invariant.
- Refund amount must match returned items value — no partial refund calculations beyond what was returned.

---

## **Notification**

Return and refund notification scenarios walk `Notification`, `Return Received Notification`, `Refund Completed Notification`, and `Refund Under Review Notification`. The central CRC invariant: notification failure must not block return processing or refund status transitions; all three support both customer account email and guest email recipient paths.

### **Return received notification sent on warehouse receipt — happy path**

**Purpose:** Validate that `Return Received Notification` fires when `Return Status` transitions to "received" and includes the correct content.
**Concepts traced:** Return, Return Status, Return Received Notification, Notification, Returned Items, Customer Account

#### Walk 1 — Covers: RTN-7001 return status transitions to received, notification sent

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
returnStatus: ReturnStatus = rtn.returnStatus
    // Return Status.update on warehouse receipt — CRC invariant: triggers return received notification when transitioning to "received"
    returnStatus.updateOnWarehouseReceipt()
        returnStatus.lifecycleState = "received"
        // Return Received Notification — CRC invariant: fires when return status transitions to "received"
        notification: ReturnReceivedNotification = new ReturnReceivedNotification(
            originatingOrder: Order("ORD-4401"),
            returnedItemsSummary: ReturnedItems("Premium Dog Kibble 10kg"),
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
            // Return Received Notification — CRC invariant: includes order number, returned items summary, and note that inspection and refund processing are underway
        Notification.deliverTransactionalMessage(notification)
return
```

### **Refund completed notification sent with amount and payment method**

**Purpose:** Validate that `Refund Completed Notification` fires when `Refund Status` transitions to "completed" with the refunded amount and masked payment method.
**Concepts traced:** Refund, Refund Status, Refund Completed Notification, Notification, Payment Vendor, PayNova

#### Walk 1 — Covers: REF-3002 refund completed by PayNova, notification sent

```
refund: Refund = Refund("REF-3002", originatingReturn: Return("RTN-7002"))
refundStatus: RefundStatus = refund.refundStatus
    // PayNova confirms refund is complete
    // Refund Status.transition to completed — CRC invariant: transitions when payment vendor confirms credit has been issued
    refundStatus.transitionToCompleted(vendorConfirmation: PayNova)
        refundStatus.lifecycleState = "completed"
        // Refund Status.transition to completed — CRC invariant: triggers refund completed notification
        notification: RefundCompletedNotification = new RefundCompletedNotification(
            refundedAmount: £24.99,
            paymentMethodReturnedTo: "PayNova digital wallet",
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
            // Refund Completed Notification — CRC invariant: includes refunded amount and the payment method the credit was returned to
        Notification.deliverTransactionalMessage(notification)
return
```

### **Notification queued when email delivery system unavailable — failure path**

**Purpose:** Validate that notification delivery failure does not block return processing or refund status transitions — the notification is queued for retry.
**Concepts traced:** Return, Return Status, Return Received Notification, Notification

#### Walk 1 — Covers: return received notification fails to send — queued for retry, return status still updated

```
rtn: Return = Return("RTN-7001", originatingOrder: Order("ORD-4401"))
returnStatus: ReturnStatus = rtn.returnStatus
    returnStatus.updateOnWarehouseReceipt()
        returnStatus.lifecycleState = "received"
        notification: ReturnReceivedNotification = new ReturnReceivedNotification(
            originatingOrder: Order("ORD-4401"),
            returnedItemsSummary: ReturnedItems("Premium Dog Kibble 10kg"),
            recipient: CustomerAccount("sarah.mitchell@pawplace.example")
        )
        Notification.deliverTransactionalMessage(notification)
            // Email delivery system temporarily unavailable
            raise DeliveryFailure("email delivery system unavailable")
        // Notification.queue failed delivery for retry — CRC invariant: email delivery failure must not block return processing or refund status transition
        Notification.queueFailedDeliveryForRetry(notification)
    // Return Status is still updated — "received"
    // Refund Status is still updated independently
    // Notification failure does not block return or refund processing
return
```

### references

**Ref — Send Return and Refund Status Update (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
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
Source: docs/end-to-end/discovery/stories/thin-slicing.md
Locator: Increment 7
Extract: partial

```source
Stories: Send Return and Refund Status Update (transactional)
```

### decisions made

- All three notification types follow the same retry-on-failure pattern: delivery failure queued for retry, must not block processing.
- Return Received Notification fires on `Return Status` transition to "received" — not on return request submission. There is a distinction between "return initiated" and "return received at warehouse".
- Refund Completed Notification fires only after vendor confirmation — CRC invariant explicitly states "must not fire before vendor confirmation".
- All three support both customer account email and guest email paths — returns can be initiated from guest orders via in-store return.

---

## **Order** (Track Refund Status)

Refund status visibility scenarios walk `Refund Status`, `Order`, `Order History`, and `Refund Completed Notification`. Customer-facing refund status is always "processing", "completed", or "requires review" — never "refund failed".

### **Refund status visible as processing on order detail — happy path**

**Purpose:** Validate that `Refund Status` surfaces on order detail when the customer views an order with an active refund.
**Concepts traced:** Order, Order History, Refund, Refund Status

#### Walk 1 — Covers: customer views ORD-4401 order detail, refund REF-3001 in processing state

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.openFullOrderDetail(orderNumber: "ORD-4401")
    rtn: Return = order.returns.find(returnReference: "RTN-7001")
    refund: Refund = Refund("REF-3001", originatingReturn: rtn)
    refundStatus: RefundStatus = refund.refundStatus
        // Refund Status.surface on order detail — CRC invariant: visible on order detail
        refundStatus.lifecycleState = "processing"
        // Refund Status.timing expectation note — CRC invariant: shows "refunds typically take 5–10 business days depending on your payment provider"
        refundStatus.timingExpectationNote = "refunds typically take 5–10 business days depending on your payment provider"
    return orderDetail  // shows Refund Status: "processing" with timing note
```

### **Requires review status shows support guidance — edge path**

**Purpose:** Validate that when `Refund Status` is "requires review", the customer sees support guidance and the support team has access to return and refund details.
**Concepts traced:** Order, Order History, Refund, Refund Status

#### Walk 1 — Covers: customer views ORD-6603, refund REF-3003 in requires review state

```
orderHistory: OrderHistory = CustomerAccount("sarah.mitchell@pawplace.example").orderHistory
order: Order = orderHistory.openFullOrderDetail(orderNumber: "ORD-6603")
    rtn: Return = order.returns.find(returnReference: "RTN-7003")
    refund: Refund = Refund("REF-3003", originatingReturn: rtn)
    refundStatus: RefundStatus = refund.refundStatus
        refundStatus.lifecycleState = "requires review"
        // Refund Status — CRC invariant: must not show "refund failed" to the customer
        // Customer sees message to contact support
        // Support team has access to Return and Refund details
    return orderDetail  // shows Refund Status: "requires review" with support guidance
```

### references

**Ref — Track Refund Status (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
Locator: story "Track Refund Status"
Extract: partial

```source
1. WHEN the customer views the Order Detail for a returned order
THEN the Refund Status is visible: processing, completed, or requires review
2. WHEN the Refund is completed by the vendor
THEN the Refund Status transitions to Completed
AND the customer receives a "refund completed" notification (email)
```

### decisions made

- Refund Status surfaces on order detail for any non-zero refund — processing, completed, or requires review. No other states are customer-visible.
- Timing expectation note shown only while in "processing" state — not after completion or escalation.
- "Requires review" is the escalation terminal state; no further automation — support team handles manually.

---

## **Order** (In-Store Return)

In-store return scenarios walk `In-Store Return`, `Manager Override`, `Admin Dashboard`, `Return Eligibility`, `Return`, and `Refund`. The central CRC invariants: in-store return must route refund through the original payment vendor; guest order returns use order number and guest email; manager override requires explicit approval and is recorded for audit.

### **In-store return submitted via order lookup — happy path**

**Purpose:** Validate that `In-Store Return` looks up the order on `Admin Dashboard`, creates a `Return`, and triggers a `Refund` through the original vendor.
**Concepts traced:** In-Store Return, Admin Dashboard, Order, Return, Refund, Payment Vendor, StripeWave, Customer Account

#### Walk 1 — Covers: store employee at PawPlace Camden processes return for ORD-4401

```
adminDashboard: AdminDashboard = AdminDashboard()
    // Admin Dashboard.in-store return lookup — CRC invariant: staff search by order number or customer email
    order: Order = adminDashboard.inStoreReturnLookup(orderNumber: "ORD-4401")
        // Order found; Return Window check — within window
        eligibility: ReturnEligibility = order.provideEntryPointForReturns()
            eligibility.evaluatePerItem(item: OrderLineItem("Premium Dog Kibble 10kg"))
            return eligible: true
inStoreReturn: InStoreReturn = new InStoreReturn(
    orderLookupByOrderNumber: Order("ORD-4401"),
    storeEmployeeInitiator: Store("PawPlace Camden")
)
    // In-Store Return.follow same refund routing invariant — CRC invariant: must route refund through the original payment vendor
    rtn: Return = new Return(originatingOrder: Order("ORD-4401"))
        rtn.initiatingParty = InStoreReturn
        rtn.returnStatus = ReturnStatus(lifecycleState: "initiated")
    refund: Refund = new Refund(originatingReturn: rtn)
        payment: Payment = Order("ORD-4401").completedPayment
        refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: payment.vendorTransactionReference)
    // In-Store Return.reflect in customer account — CRC invariant: reflects in customer account under order detail
    CustomerAccount("sarah.mitchell@pawplace.example").orderHistory.reflectReturn(rtn)
return
```

### **Guest order return processed using order number and guest email**

**Purpose:** Validate that `In-Store Return` supports guest order returns using order number and guest email — no customer account required.
**Concepts traced:** In-Store Return, Admin Dashboard, Order, Guest Checkout, Return, Refund, Payment Vendor, PayNova

#### Walk 1 — Covers: guest order ORD-7704 returned at store using order number and guest email

```
adminDashboard: AdminDashboard = AdminDashboard()
    // Admin Dashboard.in-store return lookup — CRC invariant: staff search by order number or customer email
    order: Order = adminDashboard.inStoreReturnLookup(
        orderNumber: "ORD-7704",
        customerEmail: "alex.rivera@example.com"
    )
        // Order ORD-7704 placed as guest order — guest email snapshot matches
inStoreReturn: InStoreReturn = new InStoreReturn(
    orderLookupByOrderNumber: Order("ORD-7704"),
    orderLookupByCustomerEmail: "alex.rivera@example.com",
    storeEmployeeInitiator: Store("PawPlace Camden")
)
    // In-Store Return.support guest order returns — CRC invariant: guest order returns use order number and guest email — refund routing is order-level, not account-level
    rtn: Return = new Return(originatingOrder: Order("ORD-7704"))
        rtn.initiatingParty = InStoreReturn
    refund: Refund = new Refund(originatingReturn: rtn)
        payment: Payment = Order("ORD-7704").completedPayment
        refund.routeThroughOriginalVendor(vendor: PayNova, vendorRef: payment.vendorTransactionReference)
    // No customer account to reflect in — guest order
    // Return not visible in "account" because customer has no Customer Account
return
```

### **Ineligible item flagged with manager override option — failure path**

**Purpose:** Validate that when `Return Eligibility` fails, the `Admin Dashboard` shows the ineligibility reason and offers a `Manager Override` action.
**Concepts traced:** In-Store Return, Admin Dashboard, Return Eligibility, Manager Override, Order

#### Walk 1 — Covers: ORD-4402 outside return window — manager override option shown

```
adminDashboard: AdminDashboard = AdminDashboard()
    order: Order = adminDashboard.inStoreReturnLookup(orderNumber: "ORD-4402")
    eligibility: ReturnEligibility = new ReturnEligibility(order: Order("ORD-4402"))
        window: ReturnWindow = new ReturnWindow(deliveryDateAnchor: 2026-02-05)
        window.evaluateCurrentDate(currentDate: 2026-05-07)
            return eligible: false
        eligibility.ineligibilityReason = "return window expired"
    // Admin Dashboard shows ineligibility reason: "return window expired"
    // Manager Override — CRC invariant: escalation when standard return eligibility rules would block the return
    // Manager Override action displayed, requiring manager approval
return  // awaiting manager decision
```

#### Walk 2 — Covers: manager approves override — return proceeds (cooperation path)

```
managerOverride: ManagerOverride = new ManagerOverride(
    approvingManager: "store-manager-camden",
    overrideReason: "customer goodwill — long-standing customer",
    approvalTimestamp: 2026-05-07T14:32:00Z
)
    // Manager Override.allow in-store return to proceed — CRC invariant: requires explicit manager approval
    managerOverride.allowInStoreReturnToProceed()
        inStoreReturn: InStoreReturn = new InStoreReturn(
            orderLookupByOrderNumber: Order("ORD-4402"),
            storeEmployeeInitiator: Store("PawPlace Camden")
        )
        rtn: Return = new Return(originatingOrder: Order("ORD-4402"))
            rtn.initiatingParty = InStoreReturn
        refund: Refund = new Refund(originatingReturn: rtn)
            payment: Payment = Order("ORD-4402").completedPayment
            refund.routeThroughOriginalVendor(vendor: StripeWave, vendorRef: payment.vendorTransactionReference)
    // Manager Override.record for audit — CRC invariant: approving manager and override reason recorded for audit trail
    managerOverride.recordForAudit()
        // Recorded: manager "store-manager-camden", reason "customer goodwill — long-standing customer"
return
```

### references

**Ref — Process In-Store Return (story-graph)**
Source: docs/end-to-end/discovery/stories/story-graph.json
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

**Ref — Returns reflected in account**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 25
Extract: partial

```source
For in-store returns it's a different flow but the system should still reflect it in their account.
```

### decisions made

- In-Store Return is a full class, not a property of Return — it carries distinct behavior: staff order lookup, manager override, guest-order support.
- Manager Override is a full class with audit recording — approving manager, override reason, and timestamp recorded. Not available on online self-service path.
- Guest order returns use order number and guest email — refund routing is order-level (based on the Payment recorded on the Order), not account-level.
- Admin Dashboard owns in-store return lookup presentation; data and eligibility rules owned by Order KA.

---

# Boundary Domain

### **Admin Dashboard in-store return lookup — boundary coordination**

**Purpose:** Validate that the boundary `Admin Dashboard` coordinates the in-store return workflow by consuming data from core domain classes (Order, Return Eligibility, Manager Override) without owning any domain rules.
**Concepts traced:** Admin Dashboard (boundary), Order, In-Store Return, Return Eligibility, Manager Override

#### Walk 1 — Covers: staff search and return initiation via Admin Dashboard

```
adminDashboard: AdminDashboard = AdminDashboard()
    // Admin Dashboard.in-store return lookup — CRC invariant: data and rules owned by Order; presentation owned by Store Operations
    searchResult: Order = adminDashboard.inStoreReturnLookup(orderNumber: "ORD-4401")
        // Delegates eligibility check to core domain
        eligibility: ReturnEligibility = Order("ORD-4401").provideEntryPointForReturns()
    // Admin Dashboard surfaces eligibility result — does not compute it
    // "Start Return" or "Manager Override" action displayed based on eligibility
    // Actual return creation delegated to In-Store Return (core domain)
return
```

### references

**Ref — Admin dashboard**
Source: external-context/requirements-chat-with-product-owner.md
Locator: line 29
Extract: partial

```source
On the admin side, store staff need a dashboard to manage inventory, see incoming appointments, update pet profiles (new photos, status changes like "adopted"), and handle order fulfilment for click-and-collect if we offer that.
```

### decisions made

- Admin Dashboard is a boundary surface — it presents in-store return workflow but delegates all domain logic (eligibility, return creation, refund routing, manager override) to core domain classes.
- The "in-store return lookup" responsibility on Admin Dashboard is explicitly marked in CRC as "data and rules owned by Order; presentation owned by Store Operations".


---

## increment-8 (rollup)

<!-- migrated from: end-to-end/engineering/object-model.md -->

# Object Model


---

## marketing-engine-campaigns-object-model

<!-- migrated from: increments/8-marketing-engine/engineering/object-model.md -->

---
state: domain-model
sprint_scope: Increment 8 Sprint 3 — Marketing campaigns and alerts
---

# Module: [Marketing Engine]

Scope: Sprint 3 — consent-gated delivery of admin *Promotional Email*, system-generated *Personalized Recommendation*, inventory-triggered *Restock Alert*, and store-matched *In-Store Event Notification*. Preference management and content publishing are boundary dependencies from Sprint 2 and Sprint 4.

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the shared send-time gate for all four message types in this sprint — consent check at delivery, verified-email routing, and retry-on-failure semantics.

### **MarketingCommunication** << Service >>

Initialisation: stateless service — constructed with *CommunicationPreferences* lookup, *CustomerAccount* lookup, and delivery queue at application bootstrap.
------
+ checkCommunicationPreferencesAtSend(accountId: String, category: MarketingCategory): Boolean
	Invariant: must never send without explicit opt-in for the relevant marketing category
	Invariant: preference check must occur at delivery time, not batch creation time
	Interaction:
		preferences: CommunicationPreferences = loadPreferences(accountId: accountId)
		return preferences.isOptedIn(category: category)
+ routeToVerifiedCustomerEmail(account: CustomerAccount): String
	Invariant: guest checkout sessions cannot receive marketing communications
	Interaction:
		return account.verifiedEmail
+ queueForRetryOnDeliveryFailure(messageRef: String, recipient: String): void
	Invariant: delivery failure must queue for retry — message is not silently discarded

### **PromotionalEmail** << Service >>

Initialisation: stateless service — orchestrates batch send with realtime opt-out re-check at delivery.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: delivered only to marketing email list members with active promotions category opt-in
----
+ sendToMarketingEmailList(content: PromotionalContent, list: MarketingEmailList): SendResult
	Invariant: must not be delivered to customers who opted out between batch creation and delivery
	Interaction:
		for each accountId in list.memberAccountIds:
			if checkCommunicationPreferencesAtSend(accountId: accountId, category: promotions): deliver(content, accountId)
+ includeUnsubscribeLink(content: PromotionalContent): PromotionalContent
	Invariant: unsubscribe link must immediately opt customer out of promotions category on click

### **PersonalizedRecommendation** << Service >>

Initialisation: stateless service — consumes purchase, browsing, and pet profile boundary data.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: must be genuinely personalized — if no data exists to personalize against, do not send
	Invariant: must never recommend an out-of-stock product
	Invariant: generic suggestions are handled by promotional email, not this channel
----
+ generateFromPurchaseHistory(history: PurchaseHistory, catalog: ProductCatalog): List<Product>
+ generateFromBrowsingPatterns(history: BrowsingHistory, catalog: ProductCatalog): List<Product>
+ generateFromPetProfile(profile: PetProfile, catalog: ProductCatalog): List<Product>
+ excludeOutOfStock(products: List<Product>, availability: StockAvailability): List<Product>
+ sendWhenRecommendationsOptedIn(account: CustomerAccount, products: List<Product>): SendResult | null
	Interaction:
		if products.isEmpty(): return null
		if not checkCommunicationPreferencesAtSend(accountId: account.id, category: recommendations): return skipped
		return deliverRecommendation(account: account, products: products)

### **RestockAlert** << Service >>

Initialisation: stateless service — triggered on stock transition events.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: sent only when stock availability transitions from out-of-stock to in-stock
	Invariant: requires product on customer wishlist and restock alerts category opt-in
----
+ evaluateOnStockTransition(product: Product, priorState: StockState, newState: StockState): List<RestockAlertCandidate>
	Interaction:
		if priorState is not out_of_stock or newState is not in_stock: return empty
		return wishlistedCustomers(product: product) map to RestockAlertCandidate
+ sendWhenRestockAlertsOptedIn(candidate: RestockAlertCandidate): SendResult | null
	Invariant: must not be sent to customers who have not opted in to restock alerts, even if the product is on their wishlist
	Invariant: is a best-effort signal — product may go back out of stock before the customer acts

### **InStoreEvent** << Entity >>

Initialisation: factory method `InStoreEvent.create(store, eventType, scheduledDate)` — admin-authored event metadata.
------
+ eventId: String
+ eventType: InStoreEventType
+ scheduledDate: Date
+ << association >> hostStore: Store
	Invariant: must be associated with exactly one store location
----
+ remainDiscoverableOnStoreDetailPage(): void
	Invariant: event remains visible on store detail page for walk-in discovery even when no notification is sent

### **InStoreEventNotification** << Service >>

Initialisation: stateless service — matches event location to customer preferred store.
------
+ targetMarketingCategory: MarketingCategory
	Invariant: must not be sent when no preferred store is set — system does not guess proximity
	Invariant: must not send when event location differs from customer preferred store
	Invariant: must not send without explicit opt-in for events marketing category
----
+ matchCustomerPreferredStore(event: InStoreEvent, account: CustomerAccount): Boolean
	Interaction:
		preferredStore: Store | null = account.preferredStore
		if preferredStore is null: return false
		return preferredStore.id == event.hostStore.id
+ sendWhenEventsOptedIn(event: InStoreEvent, account: CustomerAccount): SendResult | null
	Interaction:
		if not matchCustomerPreferredStore(event: event, account: account): return null
		if not checkCommunicationPreferencesAtSend(accountId: account.id, category: events): return skipped
		return deliverEventNotification(event: event, account: account)

### references

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

- *MarketingCommunication* remains the shared send-time gate from Sprint 2 — this sprint adds message-type-specific services that delegate consent checks (explicit-chain-of-responsibility).
- Four message types modeled as separate Services, not subtypes — distinct triggering logic and invariants per CRC independence test.
- *InStoreEvent* is an Entity — admin-created event metadata with store association and walk-in discoverability lifecycle.
- *PersonalizedRecommendation* skips send when personalization inputs are empty — null return rather than generic fallback (UL invariant).
- *RestockAlert* evaluates on stock transition only — wishlist intersection and category opt-in enforced at send (collection-class targeting).

---

# Boundary Domain

### **CommunicationPreferences** << Entity >>

Initialisation: boundary from Sprint 2 — owned by Customer Account module.
------
+ checkAtDeliveryTime(category: MarketingCategory): Boolean
	Invariant: enforced at delivery time, not batch creation time
	Invariant: changes persist immediately — send path must read current state at delivery

### **MarketingCategory** << ValueObject >>

Initialisation: pre-defined catalog — promotions, recommendations, restockAlerts, events.
------
+ name: MarketingCategoryName
	Invariant: category name is the unit of consent for send

### **MarketingEmailList** << Entity >>

Initialisation: boundary from Sprint 2 — membership derived from communication preferences.
------
+ memberAccountIds: List<String>
	Invariant: membership requires at least one active marketing category opt-in

### **Unsubscribe** << Service >>

Initialisation: boundary — email-link execution for promotional sends in this sprint.
------
+ executeViaEmailLink(accountId: String, category: MarketingCategory): void
	Invariant: must take effect immediately
	Invariant: must not suppress transactional notifications

### **CustomerAccount** << Entity >>

Initialisation: boundary — owned by Customer Account module.
------
+ verifiedEmail: String
+ preferredStore: Store | null
+ purchaseHistory: PurchaseHistory
	Invariant: guest sessions cannot receive marketing communications

### **Wishlist** << Entity >>

Initialisation: boundary — owned by Customer Account module.
------
+ wishlistedProducts: List<Product>
	Invariant: restock alert targeting source — only wishlisted products trigger evaluation

### **Product** << Entity >>

Initialisation: boundary — owned by Product Catalog module.
------
+ sku: String
+ stockAvailability: StockAvailability

### **StockAvailability** << ValueObject >>

Initialisation: boundary — inventory state on product.
------
+ state: StockState
+ onTransition(from: StockState, to: StockState): StockTransition | null
	Invariant: transition to in-stock triggers restock alert evaluation

### **Store** << Entity >>

Initialisation: boundary — owned by Store module.
------
+ storeId: String
+ hostForEvent(event: InStoreEvent): Boolean

### **PetProfile** << Entity >>

Initialisation: boundary — owned by Customer Account / Pet Visits module.
------
+ species: String
+ breed: String
+ age: Number

### **PurchaseHistory** << Entity >>

Initialisation: boundary — past orders for customer.
------
+ orders: List<Order>

### **BrowsingHistory** << Entity >>

Initialisation: boundary — viewed products for customer.
------
+ viewedProducts: List<Product>

### references

**Ref — Marketing communication boundaries**
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
Locator: Marketing Communication KA, boundary concepts
Extract: partial

```source
Marketing Communication depends on customer account for preference storage and delivery target, on product for restock triggers, on wishlist for restock targeting, and on store for event-location matching.
```

### decisions made

- Preference and list classes remain boundary from Sprint 2 — send services consume them at delivery without duplicating preference management (scope-fit test).
- *PurchaseHistory* and *BrowsingHistory* split as boundary inputs — personalization algorithm ownership stays outside Marketing Engine.
- *ProductDetailsPage* and *StoreDetailsPage* omitted from typed model — presentation-only; restock best-effort display and event walk-in discovery deferred to interface-design (mirrors Sprint 1 pattern).

---


---

## marketing-engine-preferences-object-model

<!-- migrated from: end-to-end/engineering/object-model.md -->

---
state: domain-model
sprint_scope: Increment 8 Sprint 2 — Notification and communication preferences
---

# Module: [Marketing Engine]

Scope: Sprint 2 — transactional *Notification Preferences* management (boundary), marketing *Communication Preferences* and *Marketing Category* opt-in, affirmative *Marketing Email List* enrollment with timestamp, and account-settings presentation.

---

# Core Domain

## **Marketing Communication**

*Marketing Communication* is the consent-gated messaging layer. The typed model separates send-time gating (*MarketingCommunication*), per-customer opt-in records (*CommunicationPreferences*), category catalog and status (*MarketingCategory*, *CategoryOptInState*), list membership (*MarketingEmailList*), affirmative enrollment (*OptIn*), and category opt-out (*Unsubscribe*).

### **MarketingCommunication** << Service >>

Initialisation: stateless service — constructed with *CommunicationPreferences* repository and *CustomerAccount* lookup at application bootstrap.
------
+ checkCommunicationPreferencesAtSend(accountId: String, category: MarketingCategory): Boolean
	Invariant: must never send without explicit opt-in for the relevant marketing category
	Invariant: preference check must occur at delivery time, not batch creation time
	Interaction:
		preferences: CommunicationPreferences = loadPreferences(accountId: accountId)
		return preferences.isOptedIn(category: category)
+ routeToVerifiedCustomerEmail(account: CustomerAccount): String
	Invariant: guest checkout sessions cannot receive marketing communications
	Interaction:
		return account.verifiedEmail

### **CommunicationPreferences** << Entity >>

Initialisation: factory method `CommunicationPreferences.createDefault(accountId)` — all marketing categories default to opted-out.
------
+ accountId: String
	Invariant: must belong to exactly one customer account
+ << composition >> categoryStates: Dictionary<MarketingCategory, CategoryOptInState>
	Invariant: new marketing categories default to opt-out for every customer
----
+ listCategoriesWithOptInStatus(): List<CategoryOptInState>
+ toggleCategoryOptIn(category: MarketingCategory, optedIn: Boolean, timestamp: DateTime): CommunicationPreferences
	Invariant: changes persist immediately on toggle — no separate save action
	Invariant: opting out of a category stops further marketing communications of that category after the toggle
	Interaction:
		updatedState: CategoryOptInState = CategoryOptInState.withStatus(category: category, optedIn: optedIn, timestamp: timestamp)
		updatedStates: Dictionary<MarketingCategory, CategoryOptInState> = this.categoryStates with category = updatedState
		return CommunicationPreferences with categoryStates = updatedStates
+ hasAnyOptIn(): Boolean
	Interaction:
		return any categoryStates where status is opted-in
+ offerPromotionalOptInAtRegistration(optedIn: Boolean, timestamp: DateTime): CommunicationPreferences
	Invariant: registration opt-in checkbox is unchecked by default — opt-in must be affirmative
	Interaction:
		return optedIn ? this.toggleCategoryOptIn(category: promotions, optedIn: true, timestamp: timestamp) : this
+ offerPromotionalOptInAtCheckout(optedIn: Boolean, timestamp: DateTime): CommunicationPreferences
	Invariant: checkout opt-in checkbox is unchecked by default — opt-in must be affirmative
	Interaction:
		return optedIn ? this.toggleCategoryOptIn(category: promotions, optedIn: true, timestamp: timestamp) : this

### **MarketingCategory** << ValueObject >>

Initialisation: pre-defined catalog instances — promotions, recommendations, restockAlerts, events.
------
+ name: MarketingCategoryName
	Invariant: category name must be one of the extensible catalog values
----
+ defaultNewCategoryToOptOut(preferences: CommunicationPreferences): CommunicationPreferences
	Invariant: new categories must default to opt-out — no broadcast without explicit opt-in for that category
	Interaction:
		return CommunicationPreferences.createDefault(accountId: preferences.accountId)

### **CategoryOptInState** << ValueObject >>

Initialisation: factory method `CategoryOptInState.withStatus(category, optedIn, timestamp)`.
------
+ category: MarketingCategory
+ status: OptInStatus
+ optedInAt: DateTime | null
+ optedOutAt: DateTime | null
	Invariant: opted-in status requires an affirmative action timestamp

### **MarketingEmailList** << Entity >>

Initialisation: derived collection — no independent identity beyond marketing consent records.
------
+ << aggregation >> memberAccountIds: List<String>
----
+ addOnAffirmativeCategoryOptIn(preferences: CommunicationPreferences, timestamp: DateTime): MarketingEmailList
	Invariant: opt-in must always be affirmative — no customer is added without an explicit action
	Invariant: membership requires at least one active marketing category opt-in
	Interaction:
		accountId: String = preferences.accountId
		return preferences.hasAnyOptIn() ? addMember(accountId: accountId) : removeMember(accountId: accountId)
+ removeOnCategoryOptOut(preferences: CommunicationPreferences): MarketingEmailList
	Interaction:
		return preferences.hasAnyOptIn() ? this : removeMember(accountId: preferences.accountId)
+ deriveMembershipFromAnyOptIn(preferences: CommunicationPreferences): Boolean
	Interaction:
		return preferences.hasAnyOptIn()

### **OptIn** << ValueObject >>

Initialisation: factory method `OptIn.record(category, timestamp)` — created only on affirmative customer action.
------
+ category: MarketingCategory
+ recordedAt: DateTime
	Invariant: must be an explicit customer action — never implied or pre-checked

### **Unsubscribe** << Service >>

Initialisation: stateless service — coordinates *CommunicationPreferences* and *MarketingEmailList*.
------
+ executeViaPreferencesToggle(preferences: CommunicationPreferences, category: MarketingCategory, timestamp: DateTime): CommunicationPreferences
	Invariant: must take effect immediately — no further marketing communications of that category after execution
	Invariant: must not suppress transactional notifications regardless of how many marketing categories are unsubscribed
	Interaction:
		updatedPreferences: CommunicationPreferences = preferences.toggleCategoryOptIn(category: category, optedIn: false, timestamp: timestamp)
		return updatedPreferences
+ executeViaEmailLink(accountId: String, category: MarketingCategory, timestamp: DateTime): CommunicationPreferences
	Invariant: email-link unsubscribe must take effect immediately
	Interaction:
		preferences: CommunicationPreferences = loadPreferences(accountId: accountId)
		return executeViaPreferencesToggle(preferences: preferences, category: category, timestamp: timestamp)

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

- *CommunicationPreferences* uses factory initialisation with all categories opted-out — matches default opt-out invariant and existing `@pawplace/customer-account-shared` implementation.
- *CategoryOptInState* extracted as ValueObject — per-category status, timestamps, and toggle immutability are distinct from aggregate identity (extract-complex-logic-to-named-operation).
- *MarketingEmailList* membership is derived from *CommunicationPreferences.hasAnyOptIn()* — no separate persisted list identity; timestamp recorded on *CategoryOptInState* (collection-class rule from CRC).
- *MarketingCommunication* modeled as Service — send-time gate and verified-email routing are stateless delivery checks, not entity lifecycle (receiver-not-responsible-for-receiving).
- *OptIn* is a ValueObject — affirmative enrollment is a recorded fact, not a tracked entity (independence test from UL).
- *Unsubscribe* email-link confirmation UI deferred to Sprint 4 — service models preferences-toggle and email-link execution paths only (scope-fit test from CRC decisions).
- Registration and checkout promotional opt-in delegate to *CommunicationPreferences.toggleCategoryOptIn* for promotions category — shared affirmative-action semantics (explicit-chain-of-responsibility).

---

# Boundary Domain

### **NotificationPreferences** << Entity >>

Initialisation: factory method `NotificationPreferences.createDefault(accountId)` — optional categories default to on; critical categories non-optional at send.
------
+ accountId: String
+ << composition >> categoryToggles: Dictionary<TransactionalCategory, CategoryToggleState>
----
+ listCategoriesWithCurrentSetting(): List<CategoryToggleState>
+ toggleCategorySetting(category: TransactionalCategory, enabled: Boolean): NotificationPreferences
	Invariant: changes persist immediately on toggle
+ enforceAtDeliveryTime(category: TransactionalCategory): Boolean
+ protectCriticalCategories(notificationKind: TransactionalNotificationKind): Boolean
	Invariant: order confirmation and refund completion cannot be disabled — critical transactional notifications remain sent
	Invariant: disabling all optional categories still allows critical notifications with an explanatory note
	Interaction:
		return notificationKind.isCritical() || this.isEnabled(category: mapKindToCategory(notificationKind))

### **TransactionalNotification** << Entity >>

Initialisation: constructed per outbound notification at send time.
------
+ category: TransactionalCategory
+ deliveryTarget: CustomerAccount
----
+ respectCategoryPreferenceAtSend(preferences: NotificationPreferences): Boolean
	Invariant: optional follow-up notifications may respect preference; mandatory confirmations always send
	Interaction:
		return preferences.protectCriticalCategories(notificationKind: this.kind) || preferences.enforceAtDeliveryTime(category: this.category)

### **CustomerAccount** << Entity >>

Initialisation: owned by Customer Account module — boundary collaborator.
------
+ accountId: String
+ verifiedEmail: String
+ communicationPreferences: CommunicationPreferences
+ notificationPreferences: NotificationPreferences
----
+ requireLoginForPreferencePages(session: CustomerSession | null): Boolean
	Invariant: guest checkout sessions cannot manage communication or notification preferences on account

### **AccountSettings** << Service >>

Initialisation: presentation surface — boundary; no persisted state.
------
+ presentNotificationPreferences(preferences: NotificationPreferences): void
+ presentCommunicationPreferences(preferences: CommunicationPreferences): void
+ promptGuestToLogInOrRegister(): void
	Invariant: guest prompt must not navigate away from the current page

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

- *NotificationPreferences* and *TransactionalNotification* remain boundary — owned by the Notification module; sprint 2 depends on them for transactional toggle behavior and critical-category rules (scope-fit test from CRC).
- Transactional categories modeled as orderUpdates, shipping, appointments, returns — aligned with *Set Notification Preferences* AC; distinct from marketing *MarketingCategory* names (slash-terms-resolved).
- *AccountSettings* modeled as Service — presentation orchestration without persisted domain state (mirrors *ProductDetailsPage* pattern from Sprint 1 reviews object model).
- Critical-notification protection on *NotificationPreferences.protectCriticalCategories* — enforcement at send remains on the Notification module (explicit-chain-of-responsibility).

---


---

## marketing-engine-reviews-object-model

<!-- migrated from: increments/8-marketing-engine/engineering/object-model.md -->

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
Source: docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md
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


---

## increment-8-sprint-1-reviews-walkthrough

<!-- migrated from: end-to-end/engineering/object-model.md -->

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

**Prior phase:** `docs/increments/8-marketing-engine/specification/crc.md` · **Spec:** `docs/end-to-end/specification/specification-by-example.md`

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
Source: docs/increments/8-marketing-engine/specification/crc.md
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
Source: docs/end-to-end/specification/specification-by-example.md
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
Source: docs/increments/8-marketing-engine/specification/crc.md
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
