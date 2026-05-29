/**
 * Record No-Show — server acceptance tests (Increment 6)
 *
 * Stories: Record No-Show
 * Scenarios: no-show recorded, blocked for checked-in appointment
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Record No-Show', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('no-show recorded after time slot passes', async () => {
    // Given: Appointment APT-001 with appointmentStatus confirmed
    //   And: TimeSlot TS-001 has passed without check-in
    const agent = helper.createSessionAgent();

    // When: Store Employee marks Appointment APT-001 as No-Show
    const response = await helper.when_record_no_show(agent, 'APT-001', 'STR-001', '2025-06-10T10:45:00');

    // Then: appointmentStatus transitions to no_show
    //   And: noShowRecordedBy is recorded as Store STR-001
    helper.then_no_show_recorded(response, { recordedBy: 'STR-001', status: 'no_show' });
    expect(response.body.noShowRecord.recordedAt).toBe('2025-06-10T10:45:00');
  });

  it('no-show blocked for checked-in appointment — message shown', async () => {
    // Given: Appointment APT-001 with appointmentStatus checked_in
    const agent = helper.createSessionAgent();
    await helper.when_check_in_customer(agent, 'APT-001', 'STR-001', '2025-06-10T09:55:00');

    // When: Store Employee attempts to mark as No-Show
    const response = await agent
      .post('/api/staff/appointments/APT-001/no-show')
      .send({ storeCode: 'STR-001', recordedAt: '2025-06-10T10:45:00' });

    // Then: system blocks with reason
    expect(response.status).toBe(422);
    expect(response.body.message).toContain('checked in');
  });
});
