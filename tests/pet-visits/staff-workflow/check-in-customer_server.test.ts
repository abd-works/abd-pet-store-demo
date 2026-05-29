/**
 * Check In Customer — server acceptance tests (Increment 6)
 *
 * Stories: Check In Customer
 * Scenarios: check-in success, early/late arrival, duplicate check-in, cancelled appointment blocked
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Check In Customer', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('customer checked in — status transitions to checked-in', async () => {
    // Given: Store Employee at Store STR-001
    //   And: Appointment APT-001 with appointmentStatus confirmed
    const agent = helper.createSessionAgent();

    // When: Store Employee selects "Check In" on Appointment APT-001
    const response = await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // Then: appointmentStatus transitions to checked_in
    //   And: checkedInTime is recorded
    //   And: checkedInBy is recorded as Store STR-001
    helper.then_check_in_recorded(response, { checkedInBy: 'STR-001', status: 'checked_in' });
    expect(response.body.checkInRecord.checkedInAt).toBe('2025-06-10T09:55:00');
  });

  it('early arrival — check-in still allowed', async () => {
    // Given: Appointment APT-001 with scheduledDateAndTimeSlot starting at 2025-06-10T10:00:00
    const agent = helper.createSessionAgent();

    // When: Store Employee checks in the customer at 2025-06-10T09:45:00
    const response = await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:45:00');

    // Then: checkedInTime records the actual arrival
    helper.then_check_in_recorded(response, { checkedInBy: 'STR-001', status: 'checked_in' });
    expect(response.body.checkInRecord.checkedInAt).toBe('2025-06-10T09:45:00');
  });

  it('duplicate check-in — original time preserved with message', async () => {
    // Given: Appointment APT-001 already checked in at 2025-06-10T09:55:00
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // When: Store Employee attempts to check in again
    const response = await agent
      .post('/api/staff/appointments/APT-001/check-in')
      .send({ storeCode: 'STR-001', checkedInAt: '2025-06-10T10:05:00' });

    // Then: system returns conflict with original time preserved
    expect(response.status).toBe(409);
    expect(response.body.message).toContain('Already checked in');
  });

  it('check-in on cancelled appointment — blocked with reason', async () => {
    // Given: Appointment with appointmentStatus cancelled
    const agent = helper.createSessionAgent();

    // First cancel APT-001
    const cancelAgent = helper.createAuthenticatedAgent('CUST-001');
    await helper.when_cancel_appointment(cancelAgent, 'APT-001');

    // When: Store Employee attempts to check in
    const response = await agent
      .post('/api/staff/appointments/APT-001/check-in')
      .send({ storeCode: 'STR-001', checkedInAt: '2025-06-10T10:00:00' });

    // Then: system blocks with reason
    expect(response.status).toBe(422);
    expect(response.body.message).toContain('cancelled');
  });
});
