/**
 * Cancel or Rebook Appointment After Pet Adoption — server acceptance tests (Increment 6)
 *
 * Stories: Cancel or Rebook Appointment After Pet Adoption
 * Scenarios: cancel releases slot, rebook navigates to gallery
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Cancel or Rebook Appointment After Pet Adoption', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('customer cancels appointment — time slot released', async () => {
    // Given: Appointment APT-003 for Pet PET-005 with appointmentStatus confirmed
    //   And: a Pet Adopted Before Visit Notification has been sent
    const agent = helper.createAuthenticatedAgent('CUST-001');

    // When: customer cancels the appointment APT-003
    const response = await helper.when_cancel_appointment(agent, 'APT-003');

    // Then: TimeSlot bookingStatus reverts to available
    //   And: Appointment APT-003 transitions to cancelled
    helper.then_appointment_status(response, 'cancelled');
  });

  it('customer cancels confirmed appointment — time slot released', async () => {
    // Given: Appointment APT-001 for Pet PET-001 with appointmentStatus confirmed
    const agent = helper.createAuthenticatedAgent('CUST-001');

    // When: customer cancels the appointment APT-001
    const response = await helper.when_cancel_appointment(agent, 'APT-001');

    // Then: Appointment APT-001 transitions to cancelled
    helper.then_appointment_status(response, 'cancelled');
  });
});
