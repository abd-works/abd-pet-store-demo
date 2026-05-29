# Slot 145 — Finished

```yaml
team-role: business-expert
slot_type: executor
slot: "145"
run: "Run 7 — Increment 6: Pet visits"
stage: exploration
skill: abd-ubiquitous-language
finished_at: 2026-05-25T22:30:00-04:00
scanner_validation: deferred to reviewer slot
```

## Artifacts produced

- `docs/domain/ubiquitous-language.md` — refreshed for Increment 6
  - Front matter updated: `increment_scope: Increment 6 — Pet visits`, `exploration_refresh: Run 7 slot 145`
  - **Pet KA**: Added `species` concept (primary gallery filter by dog/cat/bird/fish/small mammal/reptile); refreshed `breed` as fine-grained variant nested within species; updated Pet KA intro and `pet` concept block to reflect account-gated appointment call-to-action
  - **Appointment KA**: Refreshed intro and `appointment` concept for full Increment 6 lifecycle; added `availability slot` stub (alias for `time slot`); updated `time slot` with slot-release on cancellation; added `follow-up action` → `visit follow-up notification` trigger; added `appointment cancellation`, `appointment rebooking`, and `staff appointments view` concept blocks; updated Decisions made for full lifecycle rationale
  - **Notification KA**: Refreshed intro; updated `notification` concept to include three new appointment paths; added `appointment reminder`, `pet adopted notification`, and `visit follow-up notification` concept blocks with full invariants
  - **Customer Account KA**: Added Increment 6 note on account-gate activation in Decisions made
  - All Terms lists updated with new terms
  - Increment scope summary paragraph updated

- `docs/domain/domain.json` — updated with new Increment 6 concepts:
  - Added: `species`, `availability slot`, `appointment cancellation`, `appointment rebooking`, `staff appointments view`, `appointment reminder`, `pet adopted notification`, `visit follow-up notification`
  - Updated: `breed` (removed "species" attribute since species is now its own concept); `_comment` updated to Increment 6
  - Aliases section: `"availability slot": "time slot"`

- `docs/domain/ubiquitous-language.drawio` — rebuilt via `scripts/build_ubiquitous_language_diagram.py`
  - Added Pet and Appointment pages to ACTIVE_KAS (Pet, Appointment, Product Catalog, Store, Customer Account, Order, Payment, Notification)
  - All 8 pages: PASS (audit clean)

- `scripts/build_ubiquitous_language_diagram.py` — updated ACTIVE_KAS comment and set

## Stage skill unit

Exploration — Ubiquitous Language refresh for Increment 6 complete from executor side.

## Coverage

All 19 stories in Increment 6 thin-slicing.md are covered by the refreshed vocabulary:
- Browse Pets by Species → `species` (new), `breed`
- View Pet Profile → `pet profile`, `pet`, `pet photo`, `temperament assessment`, `health record`
- View Pet Store Location and Distance → `pet`, `store` (existing)
- View Available Time Slots at Store → `time slot`, `availability slot` (alias stub)
- Select Date and Time Slot → `appointment`, `time slot`
- Add Visit Note → attribute on `appointment`
- Confirm Appointment Booking (account-gated) → `appointment` (account-gate invariant)
- View Upcoming and Past Appointments → `customer account` appointment history
- Cancel or Rebook Appointment After Pet Adoption → `appointment cancellation`, `appointment rebooking`, `pet adopted notification`
- Update Pet Profile → `pet profile`, `pet lifecycle event`
- Mark Pet as Adopted → `pet lifecycle event`
- View Incoming Appointments → `staff appointments view`
- Check In Customer → `check-in`
- Record Visit Outcome → `visit outcome`
- Record No-Show → `no-show`
- Set Follow-Up Action → `follow-up action`, `visit follow-up notification`
- Send Appointment Reminder → `appointment reminder`
- Send Pet Adopted Before Visit Notification → `pet adopted notification`
- Send Visit Follow-Up Notification → `visit follow-up notification`
```
