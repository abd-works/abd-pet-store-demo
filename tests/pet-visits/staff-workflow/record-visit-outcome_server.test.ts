/**
 * Record Visit Outcome — server acceptance tests (Increment 6)
 *
 * Stories: Record Visit Outcome
 * Scenarios: outcome recorded, adopted triggers pet transition, interested-returning prompts follow-up, no notes accepted
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Record Visit Outcome', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('visit outcome recorded on checked-in appointment — Browsing Only', async () => {
    // Given: Appointment APT-001 with appointmentStatus checked-in
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // When: Store Employee selects "Record Outcome" and chooses Browsing Only
    const response = await helper.when_record_visit_outcome(
      agent, 'APT-001', 'browsing_only', 'Customer enjoyed meeting the dog',
    );

    // Then: Appointment transitions to outcome_recorded with visitOutcome and staffVisitNotes
    helper.then_visit_outcome_recorded(response, { visitOutcome: 'browsing_only', status: 'outcome_recorded' });
    expect(response.body.staffVisitNotes).toBe('Customer enjoyed meeting the dog');
  });

  it('visit outcome recorded — Not a Fit', async () => {
    // Given: Appointment APT-001 with appointmentStatus checked-in
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // When: Store Employee selects "Record Outcome" with Not a Fit
    const response = await helper.when_record_visit_outcome(
      agent, 'APT-001', 'not_a_fit', 'Dog too energetic for small flat',
    );

    // Then: Appointment transitions to outcome_recorded
    helper.then_visit_outcome_recorded(response, { visitOutcome: 'not_a_fit', status: 'outcome_recorded' });
    expect(response.body.staffVisitNotes).toBe('Dog too energetic for small flat');
  });

  it('adopted outcome triggers pet status transition', async () => {
    // Given: Appointment APT-001 checked-in, Pet PET-001 with lifecycleState Available
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // When: Store Employee selects "Adopted" as the visitOutcome
    const response = await helper.when_record_visit_outcome(agent, 'APT-001', 'adopted');

    // Then: Appointment completed with visitOutcome Adopted
    helper.then_visit_outcome_recorded(response, { visitOutcome: 'adopted', status: 'outcome_recorded' });

    // And: Pet PET-001 lifecycleState transitions to Adopted
    const petResponse = await helper.when_view_pet_profile(agent, 'PET-001');
    helper.then_pet_adopted(petResponse);
  });

  it('interested-returning outcome prompts follow-up', async () => {
    // Given: Appointment APT-001 with appointmentStatus checked-in
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // When: Store Employee selects Interested — Returning as the visitOutcome
    const response = await helper.when_record_visit_outcome(agent, 'APT-001', 'interested_returning');

    // Then: system records outcome and prompts for follow-up
    helper.then_visit_outcome_recorded(response, { visitOutcome: 'interested_returning', status: 'outcome_recorded' });
    expect(response.body.followUpPrompt).toBeTruthy();
  });

  it('outcome recorded without staff notes — accepted', async () => {
    // Given: Appointment APT-001 with appointmentStatus checked-in
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // When: Store Employee records visitOutcome without staffVisitNotes
    const response = await helper.when_record_visit_outcome(agent, 'APT-001', 'browsing_only');

    // Then: Appointment transitions to outcome_recorded
    helper.then_visit_outcome_recorded(response, { visitOutcome: 'browsing_only', status: 'outcome_recorded' });
    expect(response.body.staffVisitNotes).toBeNull();
  });
});
