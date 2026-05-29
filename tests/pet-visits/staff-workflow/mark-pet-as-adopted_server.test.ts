/**
 * Mark Pet as Adopted — server acceptance tests (Increment 6)
 *
 * Stories: Mark Pet as Adopted
 * Scenarios: adoption triggers notifications, idempotent adoption
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Mark Pet as Adopted', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('pet marked adopted — booking disabled, notifications sent', async () => {
    // Given: Pet PET-001 with lifecycleState Available
    //   And: existing Appointment APT-001 for Pet PET-001
    const agent = helper.createSessionAgent();

    // When: Store Employee marks Pet PET-001 as Adopted
    const response = await helper.when_mark_pet_as_adopted(agent, 'PET-001');

    // Then: Pet PET-001 lifecycleState transitions to Adopted
    helper.then_pet_adopted(response);

    // And: 1 Pet Adopted Before Visit Notification sent for appointment APT-001
    helper.then_notifications_sent(response, 1);
  });

  it('already-adopted pet — idempotent with status message', async () => {
    // Given: Pet PET-005 with lifecycleState Adopted
    const agent = helper.createSessionAgent();

    // When: Store Employee attempts to mark Pet PET-005 as Adopted
    const response = await agent.post('/api/staff/pets/PET-005/adopt');

    // Then: system shows "already adopted" message
    expect(response.status).toBe(409);
    expect(response.body.message).toContain('already adopted');
  });
});
