/**
 * Set Follow-Up Action — server acceptance tests (Increment 6)
 *
 * Stories: Set Follow-Up Action
 * Scenarios: follow-up recorded, hold-pet remains available
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Set Follow-Up Action', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('follow-up action recorded — schedule-return-visit', async () => {
    // Given: Appointment APT-001 with a recorded visitOutcome
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');
    await helper.when_record_visit_outcome(agent, 'APT-001', 'interested_returning');

    // When: Store Employee sets followUpAction schedule-return-visit and followUpDate 2025-06-17
    const response = await helper.when_set_follow_up_action(agent, 'APT-001', 'schedule_return_visit', '2025-06-17');

    // Then: Appointment records followUpAction and followUpDate
    helper.then_follow_up_set(response, { followUpAction: 'schedule_return_visit', followUpDate: '2025-06-17' });
  });

  it('follow-up action recorded — hold-pet', async () => {
    // Given: Appointment APT-001 with a recorded visitOutcome
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');
    await helper.when_record_visit_outcome(agent, 'APT-001', 'interested_returning');

    // When: Store Employee sets followUpAction hold-pet and followUpDate 2025-06-14
    const response = await helper.when_set_follow_up_action(agent, 'APT-001', 'hold_pet', '2025-06-14');

    // Then: Appointment records followUpAction and followUpDate
    helper.then_follow_up_set(response, { followUpAction: 'hold_pet', followUpDate: '2025-06-14' });
  });

  it('follow-up action recorded — send-adoption-paperwork', async () => {
    // Given: Appointment APT-001 with a recorded visitOutcome
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');
    await helper.when_record_visit_outcome(agent, 'APT-001', 'interested_returning');

    // When: Store Employee sets followUpAction send-adoption-paperwork
    const response = await helper.when_set_follow_up_action(agent, 'APT-001', 'send_adoption_paperwork', '2025-06-12');

    // Then: Appointment records followUpAction and followUpDate
    helper.then_follow_up_set(response, { followUpAction: 'send_adoption_paperwork', followUpDate: '2025-06-12' });
  });

  it('hold-pet action — pet remains available with hold note', async () => {
    // Given: Appointment APT-001 with followUpAction hold-pet
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');
    await helper.when_record_visit_outcome(agent, 'APT-001', 'interested_returning');
    await helper.when_set_follow_up_action(agent, 'APT-001', 'hold_pet', '2025-06-14');

    // When: viewing the pet profile
    const petResponse = await helper.when_view_pet_profile(agent, 'PET-001');

    // Then: Pet PET-001 lifecycleState remains available
    expect(petResponse.body.status).toBe('available');
  });
});
