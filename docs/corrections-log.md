# Corrections log

Engagement: PawPlace (`abd-pet-store-demo`)
Source: delivery-war-room reviewer slot 02 (`abd-domain-terms` review of slot 01)

---

## Entry: Domain term must be italicized in every prose/bullet occurrence

- **Status:** confirmed
- **Context:** Reviewer slot 146 — rule `domain-terms-italicized-in-prose-and-bullets`; rework executor slot 146-rework. Recurred in reviewer slot 148 — `emphasize-domain-terms` warnings in 7 AC lines; rework executor slot 148-rework.
- **Affects:** stage: exploration · role: business-expert · skill: abd-ubiquitous-language · run: Run 7 · slice: Increment 6; stage: exploration · role: product-owner · skill: abd-acceptance-criteria · run: Run 7 · slice: Increment 6
- **DO / DO NOT:** DO italicize every named domain term in every prose paragraph and behavior bullet. DO NOT leave any domain term as plain text in AC conditions or THEN clauses — apply `*Term*` markup to every occurrence of a named concept.
- **Example (wrong):** `THEN the system sends an appointment reminder` — `appointment reminder` is plain text.
- **Example (correct):** `THEN the system sends an *Appointment Reminder*`
- **Likely source:** instruction not read — executor italicized primary story subjects but missed secondary domain terms in THEN clauses and boundary conditions

---

## Entry: Architecture reference must not contain duplicate mechanism sections

- **Status:** confirmed
- **Context:** Reviewer slot 152 — duplicate Increment 6 mechanisms in `docs/end-to-end/specification/architecture-reference.md`; rework executor slot 152-rework
- **Affects:** stage: exploration · role: engineer · skill: abd-architecture-template · run: Run 7 · slice: Increment 6
- **DO / DO NOT:** DO produce each mechanism section exactly once in the final document. DO NOT leave draft versions of sections in the file alongside the final version. When iterating on a mechanism, delete the prior draft before writing the replacement.
- **Example (wrong):** Pet Catalog, Adoption Appointment Lifecycle, Staff Appointment Workflow, and Transactional Appointment Notification each appear twice — a draft set at lines 3791–4382 and a final set at lines 4384–4999 — causing TOC anchor collisions.
- **Example (correct):** Each mechanism appears exactly once; TOC anchors resolve unambiguously to the single authoritative section.
- **Likely source:** edge case — executor appended final sections without removing the earlier draft sections

---

## Entry: KA intro and concept block must reflect current-increment state, not deferred language

- **Status:** confirmed
- **Context:** Reviewer slot 146 — prose staleness in Customer Account KA; rework executor slot 146-rework
- **Affects:** stage: exploration · role: business-expert · skill: abd-ubiquitous-language · run: Run 7 · slice: Increment 6
- **DO / DO NOT:** DO update KA intro paragraphs and concept block aggregation bullets to reflect the current increment's live features. DO NOT leave "in later increments" or deferred-language phrases once that increment is live and being built.
- **Example (wrong):** Customer Account KA intro says "and (in later increments) *appointment* history" after Increment 6 (which activates appointment history) is the active increment being specified.
- **Example (correct):** Customer Account KA intro says "and *appointment* history (live from Increment 6)" and the aggregation bullet lists `*appointment* history` alongside order history, wishlist, address book, saved payment method, and preferred store.
- **Likely source:** edge case — executor correctly recorded Increment 6 activation in Decisions Made but did not propagate the state change to the intro paragraph and concept block

---

## Entry: Ref traceability format for gap and CRC-derived terms

- **Status:** confirmed
- **Context:** Reviewer slot 02 — `docs/end-to-end/discovery/domain/domain-terms.md` produced by executor slot 01 (`abd-domain-terms`); fixed in rework executor slot 03
- **Affects:** stage: discovery · role: business-expert · skill: abd-domain-terms · run: Run 1
- **DO / DO NOT:** DO use the full `**Ref — title**` / `Source:` / `Locator:` / `Extract:` structure with a fenced `source` block for **every** term reference — including gap terms sourced from story-graph and CRC-derived terms without prior quotes. DO NOT substitute a prose-only `References` section or inline prose citation when the refs-per-term rule requires the structured Ref block.
- **Example (wrong):** Eight terms (`pet source`, `pet lineage`, `visit outcome`, `check-in`, `no-show`, `follow-up action`, `cart item`, `order line item`) document References as prose only — no `**Ref —**` heading, no Source/Locator/Extract fields, no fenced `source` block.
- **Example (correct):** `visit outcome` term in `docs/end-to-end/discovery/domain/domain-terms.md` — full Ref block with story-graph story JSON in fenced `source` block; CRC-derived terms quote `docs/end-to-end/specification/crc.md` verbatim.
- **Likely source:** instruction not read — executor treated gap/CRC-derived terms as exempt from full Ref format

---

## Entry: Boundary term owner field format (optional if scanners remain broken)

- **Status:** confirmed
- **Context:** Reviewer slot 02 — boundary terms in `docs/end-to-end/discovery/domain/domain-terms.md`; aligned in rework executor slot 03
- **Affects:** stage: discovery · role: business-expert · skill: abd-domain-terms
- **DO / DO NOT:** DO place `Owned by: <Module>` as a dedicated field line immediately after the term heading when aligning to bundled scanner rules. DO NOT rely solely on `*(owned by: …)*` in the heading if mechanical scanners are fixed and re-run.
- **Example (wrong):** `# Boundary Domain` section with owners only in heading suffix `*(owned by: Content Management)*`.
- **Example (correct):** `### content` followed by `Owned by: Content Management` field line before behavioral bullets (see `docs/end-to-end/discovery/domain/domain-terms.md` boundary section).
- **Likely source:** edge case — engagement layout differs from default scanner path expectations

---

## Entry: Store Employee Update Pet Profile AC must use Pet KA fields

- **Status:** confirmed
- **Context:** Reviewer slot 08 — `abd-story-mapping` review of slot 07 artifacts; ripple check failed; fixed slot 09, validated slot 10
- **Affects:** stage: discovery · role: product-owner · skill: abd-story-mapping · story: Update Pet Profile (Store Employee) · run: Run 1
- **DO / DO NOT:** DO replace acceptance criteria on Store Employee `Update Pet Profile` (under `Browse Available Pets` → `Manage Pet Listings`) with store-animal *pet profile* fields and Store Employee actor — mirror `docs/end-to-end/exploration/stories/acceptance-criteria.md` § Update Pet Profile. DO NOT leave customer-account *Customer Pet Profile* CRUD AC on a Store Employee story after customer pet rename pass.
- **Example (wrong):** AC references *Customer Pet Profile*, customer editing/deleting, and personalisation updates on Store Employee `Update Pet Profile` in `story-graph.json`.
- **Example (correct):** AC describes Store Employee editing name, species, breed, age, Temperament Notes, Pet Photo Gallery, store assignment; customer-facing Pet Profile Page reflects changes (increment-6 AC items 1–4).
- **Likely source:** edge case — story rename pass updated customer-account stories but did not refresh store-employee story AC copied from prior template

---

## Entry: Brownfield small-and-testable scanner waivers for discovery map

- **Status:** confirmed
- **Context:** Reviewer slot 08 — abd-story-mapping scanners flagged 11 CRUD/view stories and `Process Payment` sub-epic; waiver applied slot 10
- **Affects:** stage: discovery · role: product-owner · skill: abd-story-mapping · run: Run 1
- **DO / DO NOT:** DO treat pre-existing brownfield CRUD/view stories (`View Store Map`, `Create Customer Pet`, etc.) as accepted waivers at discovery gate unless map restructure is in scope. DO NOT block discovery on small-and-testable false positives without delivery-lead waiver documented in reviewer slot.
- **Example (wrong):** Discovery gate FAIL solely on brownfield view/CRUD stories that were present before slot 07 rename pass.
- **Example (correct):** Reviewer records waiver with story list; gate PASS after substantive blocker (store-employee AC) is fixed.
- **Likely source:** automation gap — scanner heuristics misfire on standard e-commerce CRUD patterns

---

## Entry: MERN scanner layout — root test config + Zod at boundaries

- **Status:** confirmed
- **Context:** Slot 42 reviewer — 15 MERN violations (root configs, devDependencies, Zod wiring); fixed 2026-05-24
- **Affects:** stage: engineering · skill: mern-technical-architecture · run: Run 2
- **DO / DO NOT:** DO keep root `vitest.config.ts`, `playwright.config.ts`, `scripts/test*.sh|ps1` with literal `vitest run` / `playwright test`, root `devDependencies`, and Zod `.parse()` / `.safeParse()` at server/client boundaries. DO install `tree-sitter` + `tree-sitter-typescript` for MERN AST scanners. DO NOT rely on `conf/`-only tooling without root shims — MERN scanners check workspace root.
- **Example (wrong):** Tests and deps only under `conf/`; repositories skip `stockAvailabilitySchema.parse()`.
- **Example (correct):** `scanner-report/mern-technical-architecture.md` — 12/12 PASS; `npm test` from `conf/` — 68/68 green.
- **Likely source:** automation gap — brownfield conf/ monorepo layout vs MERN skill root expectations

---

## Entry: Architecture reference — preserve Increment 2 mechanism sections when extending

- **Status:** confirmed
- **Context:** Reviewer slot 74 — `abd-architecture-template` review of slot 73 Increment 3 extension; rework required
- **Affects:** stage: exploration · role: engineer · skill: abd-architecture-template · run: Run 4
- **DO / DO NOT:** DO keep every Increment 2 `## Mechanism:` section with full five-part shape when adding Increment 3 mechanisms — **Unified Order Queue** routes staff to fulfillment but does not replace **Click-and-Collect Fulfillment** (`markPrepared` / `markCollected`, lifecycle, code/tests). DO NOT remove an existing mechanism section while Overview, TOC, or traceability tables still name it.
- **Example (wrong):** Slot 73 deleted `## Mechanism: Click-and-Collect Fulfillment` and folded prepared/collected behavior into Unified Order Queue only; Inc 2 traceability table still lists Click-and-Collect Fulfillment.
- **Example (correct):** Slot 73 rework restored `## Mechanism: Click-and-Collect Fulfillment` with five-part shape aligned to `packages/order/` (`markReadyForPickup` / `markCollected`, PATCH `/prepared` / `/collected`, Vitest refs); Unified Order Queue explicitly routes to that mechanism; API table attributes prepared/collected to Click-and-Collect Fulfillment.
- **Likely source:** instruction not read — executor treated unified queue as consolidation of distinct fulfillment mechanism

---

## Entry: Walkthrough pseudocode must trace to CRC operations or record GAP

- **Status:** confirmed
- **Context:** Reviewer slot 106 — `abd-scenario-walkthrough` review of slot 105 `docs/increments/4-returning-customers/engineering/object-model.md`; fixed rework executor slot 107
- **Affects:** stage: specification · role: business-expert · skill: abd-scenario-walkthrough · run: Run 5 · slice: Increment 4
- **DO / DO NOT:** DO map every domain-logic pseudocode call to a CRC class + responsibility from `docs/end-to-end/specification/crc.md`, or record an explicit GAP under the KA `### decisions made` section. DO NOT invent operations (`VerificationLink.handleClick()`, `session.evaluate()`, `PaymentStep.renderSavedMethods()`, `Wishlist.attemptAddAsGuest()`, etc.) without CRC owner or GAP entry.
- **Example (wrong):** Walk uses `link.handleClick()` and `PaymentStep.renderSavedMethods()` with no matching CRC responsibility and no GAP in decisions made.
- **Example (correct):** Walk calls `EmailVerification.transitionAccountVerificationStatus(...)` per CRC, or `### decisions made` records GAP: presentation-only redirect is outcome of `AccountVerificationStatus.gateCustomerSessionAccess`.
- **Likely source:** instruction not read — executor used presentation-layer helpers without gap recording

---

## Entry: Walkthrough Scope block with exact story-graph epic name

- **Status:** confirmed
- **Context:** Reviewer slot 106 — rule `scenario-walkthrough-scope-covers`; fixed rework executor slot 107
- **Affects:** stage: specification · role: business-expert · skill: abd-scenario-walkthrough · run: Run 5 · slice: Increment 4
- **DO / DO NOT:** DO add a formal **Scope** section listing epic `Returning customers - accounts, history, reorder` (exact name from `docs/end-to-end/discovery/stories/story-graph.json`) and all 16 story names. DO NOT rely on prose-only module intro without the formal Scope block.
- **Example (wrong):** Module intro mentions Increment 4 stories in prose only; no Scope section with epic name from graph.
- **Example (correct):** `## Scope` → Epic: `Returning customers - accounts, history, reorder` → bullet list of all 16 story names matching graph.
- **Likely source:** prompt gap — executor followed KA shape but omitted scope-covers rule section

---

## Entry: Architecture reference must produce all file-structure files including repository implementations

- **Status:** confirmed
- **Context:** Reviewer slot 162 — missing infrastructure tier; rework executor slot 161-rework
- **Affects:** stage: specification · role: engineer · skill: abd-architecture-reference · run: Run 7 · story: Adoption Appointment Lifecycle
- **DO / DO NOT:** DO produce every file listed in the mechanism's File Structure section, including repository implementations. DO NOT produce domain entities and services while omitting the repository infrastructure tier files named in the same File Structure.
- **Example (wrong):** `packages/appointment/server/appointment.mongo-repository.ts` and `packages/appointment/server/slot-hold.mongo-repository.ts` listed in File Structure but not written; `packages/pet/server/pet.mongo-repository.ts` was correctly produced for the same pattern.
- **Example (correct):** Both appointment repository files written with correct Mongoose schema, `findAll`/`findByDateRange` query methods, and typed domain error handling — consistent with pet.mongo-repository.ts pattern.
- **Likely source:** edge case — executor produced entity/service/route layers but missed the repository tier for the appointment package

---

## Entry: Pet Catalog mechanism must query all lifecycle states, not available-only

- **Status:** confirmed
- **Context:** Reviewer slot 152-re-review — rule `grounding`; rework executor slot 151-rework-2
- **Affects:** stage: exploration · role: engineer · skill: abd-architecture-template · run: Run 7 · story: Browse Pets by Species
- **DO / DO NOT:** DO use `findAll(species)` (or `findBySpecies`) in the Pet Catalog walkthrough and code — returning pets of all lifecycle states so adopted pets render with a badge and suppressed CTA. DO NOT use `findAvailable(species)` which filters to available-only, violating AC View Pet Profile AC 3 (adopted profile remains viewable).
- **Example (wrong):** Walkthrough step 4 says "returns only pets with `lifecycleState: available`"; code sample calls `this.petRepository.findAvailable(species)`.
- **Example (correct):** Walkthrough step 4 says "returns pets of all lifecycle states (`available`, `adopted`) with `species: dog`; the client renders adopted pets with an 'Adopted' badge and suppresses the 'Book a Visit' CTA for adopted entries"; code calls `this.petRepository.findAll(species)`.
- **Likely source:** edge case — executor used available-only query without checking AC for adopted-pet visibility

---

## Entry: Architecture reference mechanism sections must not be duplicated

- **Status:** confirmed
- **Context:** Reviewer slot 152 — rule `five-part-structure` / section organization; rework executor slot 151-rework
- **Affects:** stage: exploration · role: engineer · skill: abd-architecture-template · run: Run 7 · story: all Increment 6 mechanisms
- **DO / DO NOT:** DO write each mechanism section exactly once. DO NOT leave an initial draft alongside an improved version — remove the earlier pass before writing `slot-NN-finished.md`.
- **Example (wrong):** All four Increment 6 mechanisms appear at two locations (lines 3791–4382 first pass; lines 4384–5000 improved pass); TOC lists each mechanism once, breaking navigation.
- **Example (correct):** Each mechanism appears once; the second (improved) set at lines 4384–5000 is kept; lines 3791–4382 are removed.
- **Likely source:** prompt gap — executor overwrote/appended a second pass without deleting the first draft

---

## Entry: Reset Password walkthrough must cover used-link outline row

- **Status:** confirmed
- **Context:** Reviewer slot 106 — spec-by-example Reset Password Scenario Outline 2 *used* link path missing from walkthrough; fixed rework executor slot 107
- **Affects:** stage: specification · role: business-expert · skill: abd-scenario-walkthrough · run: Run 5 · story: Reset Password
- **DO / DO NOT:** DO walk the *used* reset-link rejection path (`expected_message: link already used`) from increment-4 spec-by-example Scenario Outline 2, in addition to expired-link coverage. DO NOT cover only expired links when the spec outline includes a used-link row.
- **Example (wrong):** Reset Password Walk 4 covers expired token only; Scenario Outline 2 used-link row absent.
- **Example (correct):** Walk 5 — `CustomerAccount.resetPassword(account, verificationLink: usedLink)` returns link-already-used; no password change applied.
- **Likely source:** edge case — executor covered primary happy/failure paths but missed one outline row

---

## Entry: Lo-fi affordance regions must exist for every AC feedback clause cited in the trace

- **Status:** confirmed
- **Context:** Reviewer slot 150 — F1 — rule `ucd-affordances-and-feedback`; rework executor slot 149-rework
- **Affects:** stage: exploration · role: ux-designer · skill: abd-ux-mockup · run: Run 7 · story: Select Date and Time Slot
- **DO / DO NOT:** DO add a labelled screen region for every feedback state cited in the affordance trace. DO NOT cite an AC feedback clause in the affordance trace without placing a corresponding named region in both `lo-fi.md` and `state.json`.
- **Example (wrong):** Affordance trace row `"slot released notice (hold expired) | Select Date and Time Slot | AC 2"` exists but no `slot released notice` region appears in the lo-fi spec or state.json.
- **Example (correct):** `slot released notice` added as a `form` region under "book appointment — select time slot" in both `lo-fi.md` and `state.json` with field text: "Your selected slot is no longer held — please select a new time".
- **Likely source:** edge case — executor placed trace row but forgot the corresponding region
- **Example (wrong — duplicate, slot 149-rework):** Rework executor added region to `state.json` and claimed it was added to `lo-fi.md`, but the row was absent from the lo-fi.md screen table — `slot hold notice` and `continue` rows were directly adjacent with no `slot released notice` row between them.

---

## Entry: state.json actions array must match lo-fi.md interaction decisions verbatim

- **Status:** confirmed
- **Context:** Reviewer slot 150 — F3 and F4 — rule `markdown-spec-stays-in-sync`; rework executor slot 149-rework
- **Affects:** stage: exploration · role: ux-designer · skill: abd-ux-mockup · run: Run 7
- **DO / DO NOT:** DO keep `state.json` actions arrays and region field labels in exact sync with `lo-fi.md` interaction decisions and region tables. DO NOT omit an action from `state.json` that is documented in `lo-fi.md`, and DO NOT let field labels drift between the two files.
- **Example (wrong — F3):** `lo-fi.md` documents "Browse other pets" action for `upcoming appointments` list (pet-adopted state); `state.json` actions array has only `[{ "label": "Cancel" }]`.
- **Example (wrong — F4):** `state.json` field label `"distance from your location"`; `lo-fi.md` spec table says `"distance from customer location"`.
- **Example (correct):** `state.json` `upcoming appointments` actions: `[{ "label": "Cancel" }, { "label": "Browse other pets" }]`; store location field label: `"distance from customer location"` in both files; drawio regenerated.
- **Likely source:** prompt gap — executor did not cross-check state.json fields against lo-fi.md after drafting

---

## Entry: Every italicized term must resolve to a heading, stub, or parenthetical primitive

- **Status:** confirmed
- **Context:** Reviewer business-expert-reviewer — rule `italic-terms-resolve-to-named-concepts`; review of `docs/increments/8-marketing-engine/exploration/domain/ubiquitous-language.md` for ticket `inc-8-marketing-engine`
- **Affects:** stage: exploration · role: business-expert · skill: abd-ubiquitous-language · run: Inc 8 · slice: Increment 8: Marketing engine
- **DO / DO NOT:** DO ensure every `*italicized*` term in behavior bullets, invariants, and KA intros resolves to a `### heading`, `### boundary *(boundary)*` stub, or parenthetical primitive in the same file. DO NOT italicize a term that has no matching heading anywhere in the document.
- **Example (wrong):** `*product details page*` is italicized in 3 bullets (customer review line 50, aggregate star rating line 72, product boundary line 79) but no `### product details page` heading or boundary stub exists anywhere in the file. `*stock availability*` is italicized in restock alert line 153 but has no matching heading.
- **Example (correct):** Add `### product details page *(boundary)*` under `## Customer Review` with a scoped bullet (e.g. "is the page where *customer reviews* and *aggregate star rating* are displayed for a *product*") and note `Owned by: Product Catalog` on the boundary domain entry; OR de-italicize if it is not a domain concept. Add `### stock availability *(boundary)*` or mention stock-availability as plain text with a parenthetical description.
- **Likely source:** edge case — executor italicized UI and state terms that are referenced by domain concepts but did not promote them to stubs for diagram traceability

