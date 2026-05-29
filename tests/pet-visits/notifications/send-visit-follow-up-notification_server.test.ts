/**
 * Send Visit Follow-Up Notification — server acceptance tests (Increment 6)
 *
 * Stories: Send Visit Follow-Up Notification
 * Scenarios: follow-up sent on date, action "none" skipped, adopted suppresses follow-up
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Send Visit Follow-Up Notification', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('follow-up notification sent on follow-up date', async () => {
    // Given: Appointment APT-001 with followUpAction hold-pet and followUpDate 2025-06-14
    //   And: Pet PET-001 with lifecycleState Available
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');
    await helper.when_record_visit_outcome(agent, 'APT-001', 'interested_returning');
    await helper.when_set_follow_up_action(agent, 'APT-001', 'hold_pet', '2025-06-14');

    // When: current date is the follow-up date
    const response = await helper.when_trigger_follow_up_notification(agent, 'APT-001');

    // Then: system sends a Visit Follow-Up Notification
    helper.then_follow_up_notification_sent(response);
  });

  it('follow-up action set to none — no notification triggered', async () => {
    // Given: Appointment APT-001 with followUpAction none
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');
    await helper.when_record_visit_outcome(agent, 'APT-001', 'browsing_only');
    await helper.when_set_follow_up_action(agent, 'APT-001', 'none', '2025-06-14');

    // When: any follow-up trigger date arrives
    const response = await helper.when_trigger_follow_up_notification(agent, 'APT-001');

    // Then: no notification sent
    helper.then_follow_up_notification_skipped(response, 'follow-up action is none');
  });

  it('follow-up suppressed when pet adopted before follow-up date', async () => {
    // Given: Appointment APT-001 with followUpAction schedule-return-visit
    //   And: Pet PET-001 has lifecycleState Adopted (adopted before follow-up date)
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');
    await helper.when_record_visit_outcome(agent, 'APT-001', 'interested_returning');
    await helper.when_set_follow_up_action(agent, 'APT-001', 'schedule_return_visit', '2025-06-17');

    // Mark pet as adopted before follow-up date
    await helper.when_mark_pet_as_adopted(agent, 'PET-001');

    // When: current date reaches follow-up date
    const response = await helper.when_trigger_follow_up_notification(agent, 'APT-001');

    // Then: follow-up is skipped — pet adopted before follow-up
    helper.then_follow_up_notification_skipped(response, 'pet adopted before follow-up');
  });
});
