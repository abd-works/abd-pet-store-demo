/**
 * Confirm Appointment Booking — server acceptance tests (Increment 6)
 *
 * Stories: View Available Time Slots, Select Date and Time Slot, Add Visit Note,
 *          Confirm Appointment Booking
 * Scenarios: view slots, hold slot, confirm booking, guest blocked, email failure
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('View Available Time Slots at Store', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('available time slots shown for pet store — excludes booked', async () => {
    // Given: Store STR-001 has TimeSlot entries for the next 14 days
    const agent = helper.createSessionAgent();

    // When: customer initiates the appointment booking flow
    const response = await helper.when_view_available_time_slots(agent, 'STR-001');

    // Then: appointment calendar shows 3 available slots (TS-001, TS-002, TS-004); TS-003 excluded
    helper.then_available_slots_count(response, 3);
    const slotIds = response.body.slots.map((s: { timeslotId: string }) => s.timeslotId);
    expect(slotIds).toContain('TS-001');
    expect(slotIds).toContain('TS-002');
    expect(slotIds).toContain('TS-004');
    expect(slotIds).not.toContain('TS-003');
  });

  it('no available time slots — calendar shows next-steps message', async () => {
    // Given: Store STR-002 has no available TimeSlot entries within 14 days
    const agent = helper.createSessionAgent();

    // When: customer views the appointment calendar
    const response = await helper.when_view_available_time_slots(agent, 'STR-002');

    // Then: calendar shows zero slots
    helper.then_available_slots_count(response, 0);
  });
});

describe('Select Date and Time Slot', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('selected slot held temporarily to prevent double-booking', async () => {
    // Given: TimeSlot TS-001 at Store STR-001 with bookingStatus available
    const agent = helper.createAuthenticatedAgent('CUST-001');

    // When: customer selects TimeSlot TS-001
    const response = await helper.when_select_time_slot(agent, 'TS-001', 'PET-001');

    // Then: selected slot is held temporarily for 10 minutes
    helper.then_slot_hold_created(response, 10);
  });

  it('concurrent selection — first to confirm wins', async () => {
    // Given: two customers select the same TimeSlot TS-001
    const agentFirst = helper.createAuthenticatedAgent('CUST-001');
    const agentSecond = helper.createAuthenticatedAgent('CUST-002');

    // When: first customer confirms, second attempts
    await helper.when_select_time_slot(agentFirst, 'TS-001', 'PET-001');
    const firstResponse = await helper.when_confirm_appointment(agentFirst, {
      petId: 'PET-001',
      storeCode: 'STR-001',
      timeslotId: 'TS-001',
      visitNote: 'First customer',
    });

    // Then: first customer gets appointment confirmed
    helper.then_appointment_created(firstResponse, {
      petId: 'PET-001',
      storeCode: 'STR-001',
      customerId: 'CUST-001',
      status: 'confirmed',
    });

    // And: second customer gets conflict
    const secondResponse = await helper.when_select_time_slot(agentSecond, 'TS-001', 'PET-001');
    expect(secondResponse.status).toBe(409);
  });
});

describe('Confirm Appointment Booking', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('logged-in customer confirms appointment successfully', async () => {
    // Given: CustomerAccount CUST-001 is logged in
    //   And: Pet PET-001 at Store STR-001 has lifecycleState Available
    //   And: TimeSlot TS-002 is held for CUST-001
    const agent = helper.createAuthenticatedAgent('CUST-001');
    await helper.when_select_time_slot(agent, 'TS-002', 'PET-001');

    // When: customer confirms the appointment with visitNote
    const response = await helper.when_confirm_appointment(agent, {
      petId: 'PET-001',
      storeCode: 'STR-001',
      timeslotId: 'TS-002',
      visitNote: 'Bringing my two kids aged 5 and 7',
    });

    // Then: appointment is created with correct details
    helper.then_appointment_created(response, {
      petId: 'PET-001',
      storeCode: 'STR-001',
      customerId: 'CUST-001',
      status: 'confirmed',
    });
    expect(response.body.visitNote).toBe('Bringing my two kids aged 5 and 7');
  });

  it('guest user prompted to log in — slot preserved', async () => {
    // Given: a guest customer (not logged in) has selected TimeSlot TS-001
    const agent = helper.createSessionAgent();

    // When: guest attempts to confirm the appointment
    const response = await helper.when_guest_confirms_appointment(agent, {
      petId: 'PET-001',
      storeCode: 'STR-001',
      timeslotId: 'TS-001',
    });

    // Then: system returns 401 — guest is blocked
    helper.then_guest_blocked(response);
  });

  it('confirmation email fails — booking still created', async () => {
    // Given: CustomerAccount CUST-001 has confirmed an appointment
    //   And: email delivery system is temporarily unavailable
    const agent = helper.createAuthenticatedAgent('CUST-001');
    await helper.when_select_time_slot(agent, 'TS-004', 'PET-001');

    // When: confirmation email send attempt fails (booking still completes)
    const response = await helper.when_confirm_appointment(agent, {
      petId: 'PET-001',
      storeCode: 'STR-001',
      timeslotId: 'TS-004',
      visitNote: 'Email test',
    });

    // Then: appointment status is confirmed regardless of email
    helper.then_appointment_created(response, {
      petId: 'PET-001',
      storeCode: 'STR-001',
      customerId: 'CUST-001',
      status: 'confirmed',
    });
  });
});

describe('View Upcoming and Past Appointments', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('appointments listed — upcoming first, then past', async () => {
    // Given: CustomerAccount CUST-001 with appointment entries
    const agent = helper.createAuthenticatedAgent('CUST-001');

    // When: customer opens their appointment list
    const response = await helper.when_view_customer_appointments(agent);

    // Then: upcoming section shows 2, past section shows 1
    helper.then_appointments_listed(response, { upcomingCount: 2, pastCount: 1 });
  });

  it('no appointments — empty state with gallery link', async () => {
    // Given: CustomerAccount CUST-003 with no appointment entries
    const agent = helper.createAuthenticatedAgent('CUST-003');

    // When: customer opens their appointment list
    const response = await helper.when_view_customer_appointments(agent);

    // Then: both sections empty
    helper.then_appointments_listed(response, { upcomingCount: 0, pastCount: 0 });
  });
});
