# Corrections log

Project: abd-augmented-delivery-course (PawPlace)
Source: abd-story-mapping skill

---

## Entry: Domain attribute details in story names

- **Status:** confirmed
- **Context:** abd-story-mapping — building story map from requirements
- **DO / DO NOT:** DO keep story names as clean verb-noun titles. Domain attribute details (what a product or profile contains) belong in the domain model under the term's definition — not parenthesised into story names. Parenthetical hints are only for parameterised stories that consolidate variants with different mechanics (per Consolidation Notes).
- **Example (wrong):**
  `(S) Customer --> View Product Details (images, description, dimensions, weight)`
  `(S) Customer --> View Pet Profile (breed, age, temperament, health history)`
  `(S) Admin --> Update Pet Profile (photos, details)`
  `(S) Customer --> Create Pet Profile (name, breed, age, dietary needs)`
- **Example (correct):**
  `(S) Customer --> View Product Details`
  `(S) Customer --> View Pet Profile`
  `(S) Admin --> Update Pet Profile`
  `(S) Customer --> Create Pet Profile`
- **Likely source:** unclear expectation

---

## Entry: Customer review missed authorship by customer account

- **Status:** confirmed
- **Context:** docs/domain-sketch.md — Product Catalog KA, ``customer review`` concept.
- **DO / DO NOT:** DO model ``customer review`` as **authored by exactly one customer account** and attached to exactly one product. DO NOT leave the review floating against the product alone — that implies anonymous or guest reviews are allowed, which contradicts how PawPlace works (the customer account is the trust anchor for social proof, and ``Customer Account`` already aggregates the customer's full history).
- **Example (wrong):** ``customer review`` lists only ``attached to exactly one product`` as its invariant; ``Customer Account`` aggregates ``orders, appointments, wishlist, addresses, payment methods, pet profiles, and preferred store`` — but not authored reviews.
- **Example (correct):** Reviewed concept now states: authored by exactly one customer account, attached to exactly one product, guest checkout sessions cannot leave reviews. ``Customer Account`` now aggregates ``…and authored customer reviews``. Product Catalog ``### decisions made`` records the two-sided ownership/authorship split.
- **Likely source:** the requirements extract talks about ``customer reviews`` and ``photo reviews`` against products without naming the author explicitly. The model needs to fill that gap by reading the surrounding context (account, guest checkout, trust) — which it failed to do on the first pass.

---

## Entry: AC used capability language instead of observable state

- **Status:** confirmed and fixed
- **Context:** All 9 increment AC files (docs/acceptance-criteria/increment-{1..9}-acceptance-criteria.md). ~25 AC lines used "the customer can..." or "staff can..." phrasing, describing what an actor is able to do rather than what the system shows or provides.
- **DO / DO NOT:** DO describe system state in AND/THEN/BUT clauses: "a retry option is displayed", "an editable field is shown", "the notification status is visible". If the actor acts on the displayed element, that is a separate WHEN/THEN AC. DO NOT write "the customer can override", "staff can contact", "the customer can sort" — these describe capability, not observable behavior.
- **Example (wrong):** `AND the customer can override individual fields if needed`
- **Example (correct):** `WHEN the customer overrides an individual field on the pre-filled Shipping Address / THEN the overridden value replaces the billing value for that field only` (separate AC with its own trigger-response pair).
- **Likely source:** Natural English tendency to describe what a user "can do" rather than what the system presents. The abd-acceptance-criteria skill's Step section says "observable behavior" but did not explicitly prohibit capability language.
- **Skill improvement:** Added a new bullet to `abd-acceptance-criteria/SKILL.md` § Step: "Never describe capability" with examples and the correct pattern.

---

## Entry: Pet KA massively undermodeled in CRC — parenthetical values collapsed, lifecycle flat, sourcing absent

- **Status:** confirmed and fixed
- **Context:** `docs/crc.md`, Pet KA. The Pet section had a single `### **Pet**` class with 6 responsibility rows. `browsable profile` collapsed photos, breed info, temperament notes, and health history into a parenthetical value `(photos, breed info, age, temperament notes, health history)`. `lifecycle status` was a flat enum `(available, adopted)` with a single `transition lifecycle status` operation. Pet sourcing, lineage, and provenance were entirely absent.
- **DO / DO NOT:** DO decompose parenthetical values that carry their own data, dates, actors, or lifecycle into first-class CRC classes. Every value in brackets that "has data" is a class, not a property. DO use the state-carrier pattern when a lifecycle transition needs per-event state (who, when, why). DO NOT collapse rich domain areas into single parenthetical enums. DO NOT assume a lifecycle is just two states when the domain has intake, quarantine, availability, reservation, adoption, transfer, and return.
- **Example (wrong):** `browsable profile | (photos, breed info, age, temperament notes, health history)` — one property row hides 5+ classes with their own data.
- **Example (correct):** Separate `### **Breed**`, `### **Pet Photo**`, `### **Temperament Assessment**`, `### **Health Record**` classes, each with their own responsibility tables.
- **Example (wrong):** `lifecycle status | (available, adopted)` with `transition lifecycle status | (managed by store staff)` — two rows for an entire lifecycle.
- **Example (correct):** `### **Pet Lifecycle Event**` state-carrier with `lifecycle state`, `transitioned on`, `transitioned by`, `transition context`, and state-path invariants.
- **Likely source:** The domain sketch itself was light on Pet (only 4 behavior bullets), and the CRC faithfully mirrored it without questioning depth. The CRC build step says "Every behavior bullet on a concept is a candidate responsibility" — but when a behavior bullet packs multiple concepts into one sentence, each concept needs its own class, not a parenthetical echo.
- **Skill improvement:** None yet — this is a judgment call during CRC build, not a mechanical rule. Consider adding a CRC rule: "Parenthetical values that carry their own data, dates, or actors must be promoted to first-class classes."

---

## Entry: Entire CRC missing real data — naive property names with no actual fields

- **Status:** confirmed and fixed
- **Context:** `docs/crc.md`, every KA. Classes carried abstract responsibility names like "images", "description", "labeled address", "lifecycle status" with no actual domain data. Stock Availability had no inventory quantities. Product had no name, SKU, or price. Order had no order number, no financial totals, no tracking number. Customer Account had no name or registration date. Addresses were "labeled address | (label, address fields)" with no actual address structure. "Ordered products and quantities" hid a many-to-many that needed its own class (Order Line Item).
- **DO / DO NOT:** DO add real domain data properties to every CRC class — the actual fields the system needs to function. Every property should name real data: quantities, dates, amounts, identifiers, statuses, references. DO introduce state-carrier classes for many-to-many relationships that carry their own data (Order Line Item for order × product, Cart Item for cart × product). DO research how the real-world domain works (e.g. inventory management: quantity on hand, reserved quantity, reorder point, low stock threshold, backorder status). DO NOT leave properties as vague labels ("images", "description", "address fields") when the domain demands specific fields. DO NOT assume a model is complete because every sketch behavior maps to a named responsibility — a responsibility without data is a shell.
- **Example (wrong):** `stock availability | Product` + `gate order flow | Order` — no quantity, no reorder point, no threshold. Impossible to actually manage inventory.
- **Example (correct):** `quantity on hand`, `reserved quantity`, `available-to-sell quantity`, `reorder point`, `reorder quantity`, `low stock threshold`, `last restocked date`, `expected restock date`, `backorder status` — with invariant: available-to-sell must never go negative.
- **Example (wrong):** `ordered products and quantities | Product` — hides a many-to-many with its own data.
- **Example (correct):** `### **Order Line Item**` with `ordered product | Product`, `unit price snapshot`, `quantity`, `line discount`, `line total` — with invariant: price snapshot captures the price at order confirmation time.
- **Likely source:** The CRC build focused on tracing sketch behaviors to responsibility names and ensuring collaborator coverage, but never asked "what data does this class actually need to hold to make this responsibility work?" The skill rules check structural integrity (flat shape, no slash terms, subtypes use deltas) but have no rule requiring real data behind each property name.
- **Skill improvement:** Consider adding a CRC rule: "Every property responsibility must name real domain data — identifiers, quantities, dates, amounts, statuses, or references. Vague labels and parenthetical blobs are not properties."

---

## Entry: Parenthetical values on the right side of CRC cards — never allowed

- **Status:** confirmed and fixed
- **Context:** `docs/crc.md`, every KA, 183 instances. The right column (collaborator column) of CRC tables used parenthetical values `(...)` for three purposes: (1) simple type descriptions like `(date and time the order was placed)`, (2) enum values like `(booked, confirmed, cancelled, completed, no-show)`, and (3) composite blobs hiding multiple real properties or concepts like `(size, coat type, typical temperament range, exercise needs)`, `(name, location, phone, email)`, `(line 1, line 2, city, county, postcode, country)`, `(last four digits, card brand or wallet provider)`.
- **DO / DO NOT:** DO leave the right column empty for simple data properties — the property name is the data. When a property references another domain concept, the right column names that concept as a collaborator. DO NOT put parenthetical values on the right side of a CRC table — ever. When you find yourself writing brackets, you have either: (a) a concept that should be its own class, (b) multiple properties collapsed into one row, or (c) a description that adds nothing because the property name already says it.
- **Example (wrong):** `breed characteristics | (size, coat type, typical temperament range, exercise needs)` — four properties hiding behind one name.
- **Example (correct):** `size |` / `coat type |` / `typical temperament range |` / `exercise needs |` — four separate rows on Breed.
- **Example (wrong):** `images | (multiple-angle photographs with alt text)` — a concept hiding as a description.
- **Example (correct):** `images | Product Image` — with `### **Product Image**` as its own class carrying `image file`, `alt text`, `display order`, `uploaded date`.
- **Example (wrong):** `shipping address snapshot | (line 1, line 2, city, county, postcode, country — copied at order time)` — six fields hidden in parens.
- **Example (correct):** `shipping address line one |` / `shipping address line two |` / `shipping city |` / `shipping county or region |` / `shipping postcode |` / `shipping country |` — six separate rows on Order.
- **Example (wrong):** `authenticate | (login, logout, password reset, email verification)` — five operations collapsed into one.
- **Example (correct):** `log in |` / `log out |` / `reset password |` / `verify email |` — separate operations on Customer Account.
- **Example (wrong):** `masked display details | (last four digits, card brand or wallet provider)` — three properties hiding.
- **Example (correct):** `last four digits |` / `card brand |` / `wallet provider |` — separate properties on Saved Payment Method.
- **Decompositions applied in this fix:**
  - Product: images → Product Image class; dimensions → length, width, height
  - Breed: breed characteristics → size, coat type, temperament range, exercise needs
  - Pet Source: supplier name and contact → name, location, phone, email
  - Store: street address → line 1–country; geo-coordinates → latitude, longitude; operating hours → opening/closing per day + holiday overrides; Store Locator filter → 3 separate filter responsibilities; customer location → shared location + entered postcode
  - Customer Account: authenticate → log in, log out, reset password, verify email
  - Guest Checkout: collect transaction-only details → collect guest shipping address, collect guest billing address
  - Pet Profile: dietary needs → known allergies, preferred food type, special dietary requirements
  - Communication Preferences / Notification Preferences: opted-in categories → 4 separate opt-in flags
  - Order: shipping/billing address snapshots → 6 properties each
  - Saved Payment Method: masked display details → last four digits, card brand, wallet provider; expiry → month and year
  - All simple descriptions (dates, amounts, names, statuses) → parens removed, property name stands alone
- **Likely source:** The CRC skill template and examples used parenthetical value descriptions in the right column for primitive types and enums. This became a crutch — instead of thinking about whether a parenthetical hid a real concept or multiple properties, the modeler defaulted to brackets. The rule should be absolute: the right column is for collaborator class names only. If there is no collaborator, the column is empty.
- **Skill improvement:** Add a CRC rule: "The right column of a CRC table is for collaborator class names only. Never use parenthetical values. If you find yourself writing brackets, you have a concept, multiple properties, or a description that the property name already conveys."

---

## Entry: Specification-by-example tables missing expected output values

- **Status:** confirmed and fixed
- **Context:** `docs/acceptance-criteria/increment-{1..9}-specification-by-example.md`, all scenario outline tables. Tables contained only input columns (e.g. `store_name`, `latitude`, `longitude`) but no expected output columns (e.g. `expected_distance_km`, `expected_sort_position`, `expected_status`). Without output columns, the Then/And assertions had nothing concrete to verify against — the scenarios were untestable.
- **DO:** Every `Then` or `And` assertion that checks a value MUST have that value as a column in the example table with a concrete expected value. Inputs go in Given columns; outputs go in Then columns. If a scenario calculates a distance, the table must include `expected_distance_km`. If it transitions a status, the table must include `expected_status`. If it computes a total, the table must include `expected_total`.
- **DO NOT:** Write scenario outline tables with only input data. Never write a Then step that asserts an outcome without a matching output column in the table. "Applies sortNearestFirst" with no expected sort position is hand-waving, not a specification.
- **Example (wrong):**
  ```
  | scenario | store_name | latitude | longitude |
  | 1 | PawPlace Camden | 51.5392 | -0.1426 |

  Then the **StoreLocator** applies **sortNearestFirst** ordering
  And each **Store** displays its calculated distance
  ```
  No expected distance, no sort position — nothing to assert against.
- **Example (correct):**
  ```
  | scenario | store_name | latitude | longitude | expected_distance_km | expected_sort_position |
  | 1 | PawPlace Camden | 51.5392 | -0.1426 | 3.5 | 1 |

  Then **Store** *{store_name}* shows distance *{expected_distance_km}* km
  And **Store** *{store_name}* appears at sort position *{expected_sort_position}*
  ```
  Every asserted value has a column with a concrete expected value.
- **Likely source:** The specification-by-example skill's template and examples emphasize domain concept grounding and relationship structure in tables, but do not explicitly call out that output/expected columns are mandatory for testability. The agents generated tables that looked correct structurally (normalized, domain-named columns) but missed the fundamental point: spec-by-example tables exist to make scenarios *executable*, which requires both inputs AND expected outputs.
- **Corollary — show don't tell:** Beyond numeric outputs, *structural* assertions must also be concrete. "Products are organized by Category for browsing" is telling — it describes behavior in prose. Showing means the table includes `expected_category`, `expected_parent_category`, and `expected_display_position` columns so the reader sees which product appears under which category at which position. If the scenario asserts a structure (tree, sort order, grouping), the table must render that structure as data.
- **Example (wrong — telling):**
  ```
  Then products are organized by **Category** for browsing
  ```
  What does "organized" look like? What category? What order? Untestable.
- **Example (correct — showing):**
  ```
  | product_name | expected_category | expected_parent_category | expected_position |
  | Premium Dog Harness | Harnesses & Leads | Dog Supplies | 1 |
  | Squeaky Bone | Toys | Dog Supplies | 2 |
  | Salmon Kibble | Food | Cat Supplies | 1 |

  Then **Product** *{product_name}* appears under **Category** *{expected_category}*
  And **Category** *{expected_category}* is nested under *{expected_parent_category}*
  ```
- **Corollary — test the positive, not the negative:** Do not write scenarios that assert the absence of UI elements ("no cart action available", "no checkout button"). These test nothing useful — you cannot automate the absence of an infinite set of things that might not exist. Instead, write the positive case: what IS displayed. If Increment 1 has no purchase flow, the scenario for the product page should show what the customer actually sees — product name, description, price, images, stock level, categories. That is the testable, valuable specification.
- **Example (wrong — negative):**
  ```
  When the customer looks for purchase or review actions
  Then no cart, checkout, or review actions are available
  ```
  This tests nothing. What are they looking for? What does "not available" mean in a test?
- **Example (correct — positive):**
  ```
  Then the product page displays **Product** *{product_name}* with **price** *{price}*
  And **ProductImage** *{image_count}* images are shown
  And **StockAvailability** shows *{available_to_sell_quantity}* available
  And **Category** *{category_name}* is shown as the product's category
  ```
- **Corollary — no hardcoded values in outline steps:** In Scenario Outline mode, ALL variable values — inputs AND outputs — must come from table columns via `{column_name}` tokens. Never hardcode a value inline (e.g. `*0*`, `*currently unavailable*`) when the scenario is parameterized. If a value appears in a step, it must be a `{token}` referencing a table column. Hardcoded values belong in plain Scenarios only.
- **Example (wrong — hardcoded in outline):**
  ```
  Given **StockAvailability** has **availableToSellQuantity** *0* at all stores
  Then the system clearly indicates the product is currently unavailable
  ```
  `0` and "currently unavailable" are hardcoded — they should be table columns.
- **Example (correct — all from table):**
  ```
  | sku | available_to_sell_quantity | expected_display_status |
  | PET-FLT-099 | 0 | Out of Stock |
  | PET-HRN-001 | 12 | In Stock |
  | PET-TOY-042 | 2 | Low Stock |

  Given **StockAvailability** for **Product** *{sku}* has **availableToSellQuantity** *{available_to_sell_quantity}*
  Then the product page shows stock status *{expected_display_status}*
  ```
  Now each row is a distinct scenario with different inputs AND expected outputs.
- **Skill improvement:** Add a rule to `abd-specification-by-example`: "Every Then/And assertion that checks a value must have a matching column in the example table with a concrete expected value. Tables without output columns are untestable and must be rejected. Structural assertions (grouping, sorting, hierarchy) must also be rendered as data columns — 'show don't tell.' Test the positive case (what IS displayed/returned), not the negative (what is absent). In Scenario Outline mode, never hardcode values inline — every variable value must come from a table column via a `{column_name}` token."

---

## Entry: E2E tests reported as passing when app-client did not exist

- **Status:** confirmed
- **Context:** mern-technical-architecture skill — pet store demo scaffolding
- **DO / DO NOT:** DO explicitly state which test tiers are passing and which require additional infrastructure. DO NOT report "all tests pass" after `npx vitest run` when E2E tests have not been run.
- **Example (wrong):**
  After running `npx vitest run` (62 server + client tests), the agent reported "all tests passing" without noting that `*_e2e.spec.ts` files are excluded from Vitest and that E2E tests require `packages/app-client/` to serve page routes. Running `npx playwright test` then failed with `Cannot GET /products/PET-FLT-099`.
- **Example (correct):**
  "62 server + client unit/component tests pass (`npm test`). E2E tests are scaffolded but not yet runnable — `packages/app-client/` must exist and serve page routes (`/products/:sku`, `/store-locator`, `/admin/stock/:sku/:store`) before Playwright tests can pass."
- **Likely source:** unclear expectation
