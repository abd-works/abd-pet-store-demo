/**
 * Send Pet Adopted Before Visit Notification — server acceptance tests (Increment 6)
 *
 * Stories: Send Pet Adopted Before Visit Notification
 * Scenarios: notification sent to affected customers, no pending appointments skipped
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Send Pet Adopted Before Visit Notification', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('notification sent to affected customers on adoption', async () => {
    // Given: Pet PET-001 is marked as Adopted
    //   And: Appointment APT-001 for Pet PET-001 has appointmentStatus confirmed
    const agent = helper.createSessionAgent();

    // When: system processes the adoption event
    const response = await helper.when_mark_pet_as_adopted(agent, 'PET-001');

    // Then: Pet Adopted Before Visit Notification is sent
    helper.then_notifications_sent(response, 1);
  });

  it('no pending appointments — adoption processed without notification', async () => {
    // Given: Pet PET-003 has 0 Appointment entries with appointmentStatus confirmed
    const agent = helper.createSessionAgent();

    // When: system processes the adoption event
    const response = await helper.when_mark_pet_as_adopted(agent, 'PET-003');

    // Then: adoption event completes with 0 notifications sent
    helper.then_pet_adopted(response);
    helper.then_notifications_sent(response, 0);
  });
});
