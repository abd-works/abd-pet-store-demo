/**
 * View Incoming Appointments — server acceptance tests (Increment 6)
 *
 * Stories: View Incoming Appointments
 * Scenarios: staff sees upcoming sorted by date, adopted pet warning badge
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('View Incoming Appointments', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('staff sees upcoming appointments sorted by date', async () => {
    // Given: Store Employee at Store STR-001
    //   And: Appointment entries APT-001, APT-002 are booked for Store STR-001
    const agent = helper.createSessionAgent();

    // When: Store Employee opens the incoming appointments view
    const response = await helper.when_view_incoming_appointments(agent, 'STR-001');

    // Then: list shows appointments sorted soonest first
    helper.then_incoming_appointments_sorted(response, 2);
    const appointments = response.body.appointments;
    expect(appointments[0].id).toBeDefined();
    expect(appointments[0].petName).toBeDefined();
    expect(appointments[0].startAt).toBeDefined();
  });

  it('adopted pet appointment shows warning badge in staff view', async () => {
    // Given: Appointment APT-003 for Pet PET-005 with lifecycleState Adopted
    //   And: notification status is "notified"
    const agent = helper.createSessionAgent();

    // When: Store Employee views the incoming appointments for STR-002
    const response = await helper.when_view_incoming_appointments(agent, 'STR-002');

    // Then: entry shows pet-adopted badge and notification status
    const adopted = response.body.appointments.find(
      (a: { petId: string }) => a.petId === 'PET-005',
    );
    expect(adopted).toBeDefined();
    expect(adopted.notificationStatus).toBe('notified');
  });
});
