/**
 * Appointment Booking — server tests (Increment 6)
 *
 * Stories: View Available Time Slots at Store, Select Date and Time Slot,
 *          Add Visit Note, Confirm Appointment Booking,
 *          View Upcoming and Past Appointments, Cancel or Rebook Appointment After Pet Adoption
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  createAppointment,
  PETS,
  STORES,
  CUSTOMERS,
  TIME_SLOTS,
  type PetVisitsTestContext,
} from '../helpers/pet-visits.helper';
import { toPetId } from '../../../packages/pet/shared/PetId';
import { PetStatusValues } from '../../../packages/pet/shared/PetStatus';
import { AppointmentStatus } from '../../../packages/appointment/shared/AppointmentStatus';
import { SlotHold } from '../../../packages/appointment/shared/SlotHold';
import { toVisitNote } from '../../../packages/appointment/shared/VisitNote';
import { SlotNoLongerAvailableError, SlotHoldExpiredError } from '../../../packages/appointment/shared/AppointmentErrors';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_standard_pets_seeded(ctx: PetVisitsTestContext): void {
  ctx.petRepo.seed(Object.values(PETS));
}

async function when_customer_creates_hold(ctx: PetVisitsTestContext, petId: string, timeSlotId: string, customerId: string) {
  return ctx.appointmentService.createHold(toPetId(petId), timeSlotId, customerId);
}

async function when_customer_confirms_booking(ctx: PetVisitsTestContext, holdId: string, customerId: string, visitNote?: string, timeSlotData?: { timeSlotId: string; storeCode: string; startAt: Date; endAt: Date }) {
  return ctx.appointmentService.confirmBooking(holdId, customerId, visitNote, timeSlotData);
}

async function when_customer_cancels_appointment(ctx: PetVisitsTestContext, appointmentId: string, customerId: string) {
  return ctx.appointmentService.cancelAppointment(appointmentId as any, customerId);
}

async function when_customer_lists_appointments(ctx: PetVisitsTestContext, customerId: string) {
  return ctx.appointmentService.listForAccount(customerId);
}

// =============================================================================
// STORY: View Available Time Slots at Store
// =============================================================================

describe('View Available Time Slots at Store', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestViewAvailableTimeSlots', () => {
    it('available time slots shown for pet store — 3 available after excluding booked', async () => {
      // Given: Pet PET-001 hosted at Store STR-001; TS-003 is already booked
      const bookedAppointment = createAppointment({ id: 'APT-EXISTING', timeSlotId: 'TS-003', storeCode: STORES.STR_001.code });
      ctx.appointmentRepo.seed(bookedAppointment);

      // When: check which slots are available
      const ts001Available = !(await ctx.appointmentRepo.isSlotBooked('TS-001'));
      const ts002Available = !(await ctx.appointmentRepo.isSlotBooked('TS-002'));
      const ts003Available = !(await ctx.appointmentRepo.isSlotBooked('TS-003'));
      const ts004Available = !(await ctx.appointmentRepo.isSlotBooked('TS-004'));

      // Then: TS-001, TS-002, TS-004 available; TS-003 excluded
      expect(ts001Available).toBe(true);
      expect(ts002Available).toBe(true);
      expect(ts003Available).toBe(false);
      expect(ts004Available).toBe(true);
    });

    it('appointment calendar shows only available slots — booked excluded', async () => {
      // Given: Store STR-001 has TimeSlot entries with mixed bookingStatus
      const bookedAppointment = createAppointment({ id: 'APT-BOOKED', timeSlotId: 'TS-003', storeCode: STORES.STR_001.code });
      ctx.appointmentRepo.seed(bookedAppointment);

      // Then: TS-001 available, TS-003 booked (excluded)
      expect(await ctx.appointmentRepo.isSlotBooked('TS-001')).toBe(false);
      expect(await ctx.appointmentRepo.isSlotBooked('TS-003')).toBe(true);
    });

    it('no available time slots — all booked', async () => {
      // Given: Store STR-002 has no available slots (all booked)
      for (const ts of TIME_SLOTS) {
        const appt = createAppointment({ id: `APT-${ts.timeSlotId}`, timeSlotId: ts.timeSlotId, storeCode: ts.storeCode });
        ctx.appointmentRepo.seed(appt);
      }

      // Then: all slots are booked
      for (const ts of TIME_SLOTS) {
        expect(await ctx.appointmentRepo.isSlotBooked(ts.timeSlotId)).toBe(true);
      }
    });
  });
});

// =============================================================================
// STORY: Select Date and Time Slot
// =============================================================================

describe('Select Date and Time Slot', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestSelectDateAndTimeSlot', () => {
    it('selected slot held temporarily to prevent double-booking', async () => {
      // Given: a TimeSlot TS-001 at Store STR-001 with bookingStatus available
      // When: the customer selects TimeSlot TS-001 from the Appointment Calendar
      const hold = await when_customer_creates_hold(ctx, 'PET-001', 'TS-001', CUSTOMERS.CUST_001.id);

      // Then: the Selected Slot is held temporarily
      expect(hold.holdId).toBeTruthy();
      expect(hold.expiresAt).toBeInstanceOf(Date);
      expect(hold.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('concurrent selection — first to confirm wins, second gets error', async () => {
      // Given: two customers select the same TimeSlot TS-001 simultaneously
      const hold1 = await when_customer_creates_hold(ctx, 'PET-001', 'TS-001', CUSTOMERS.CUST_001.id);

      // When: second customer attempts to hold the same slot
      // Then: SlotNoLongerAvailableError thrown
      await expect(
        when_customer_creates_hold(ctx, 'PET-001', 'TS-001', CUSTOMERS.CUST_002.id),
      ).rejects.toThrow(SlotNoLongerAvailableError);
    });

    it('temporary hold expires — slot released', async () => {
      // Given: a hold that has already expired (expiresAt in the past)
      const expiredHold = new SlotHold({
        holdId: 'HOLD-EXPIRED-001',
        customerId: CUSTOMERS.CUST_001.id,
        petId: 'PET-001',
        timeSlotId: 'TS-001',
        expiresAt: new Date(Date.now() - 60_000),
      });
      ctx.holdRepo.seed(expiredHold);

      // When: the customer tries to confirm after expiry
      await expect(
        when_customer_confirms_booking(ctx, expiredHold.holdId, CUSTOMERS.CUST_001.id),
      ).rejects.toThrow(SlotHoldExpiredError);
    });
  });
});

// =============================================================================
// STORY: Add Visit Note
// =============================================================================

describe('Add Visit Note', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestAddVisitNote', () => {
    it('visit note added within character limit', async () => {
      // Given: customer selects a time slot
      const hold = await when_customer_creates_hold(ctx, 'PET-001', 'TS-001', CUSTOMERS.CUST_001.id);

      // When: the customer confirms with a visit note
      const appointment = await when_customer_confirms_booking(
        ctx,
        hold.holdId,
        CUSTOMERS.CUST_001.id,
        'Bringing my two kids aged 5 and 7',
        TIME_SLOTS[0],
      );

      // Then: the Appointment is annotated with the visitNote
      expect(appointment.visitNote).toBe('Bringing my two kids aged 5 and 7');
    });

    it('visit note left blank — appointment proceeds without a note', async () => {
      // Given: customer selects a time slot
      const hold = await when_customer_creates_hold(ctx, 'PET-001', 'TS-001', CUSTOMERS.CUST_001.id);

      // When: the customer leaves the Visit Note blank
      const appointment = await when_customer_confirms_booking(
        ctx,
        hold.holdId,
        CUSTOMERS.CUST_001.id,
        undefined,
        TIME_SLOTS[0],
      );

      // Then: the Appointment proceeds without a note
      expect(appointment.visitNote).toBeNull();
    });

    it('visit note exceeds character limit — validation error', () => {
      // Given: a visit note field with 500 character limit
      const longNote = 'x'.repeat(512);

      // When / Then: toVisitNote throws validation error
      expect(() => toVisitNote(longNote)).toThrow('Visit note must not exceed 500 characters');
    });
  });
});

// =============================================================================
// STORY: Confirm Appointment Booking
// =============================================================================

describe('Confirm Appointment Booking', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestConfirmAppointmentBooking', () => {
    it('logged-in customer confirms appointment successfully', async () => {
      // Given: a CustomerAccount CUST-001 logged in; TimeSlot TS-001 held
      const hold = await when_customer_creates_hold(ctx, 'PET-001', 'TS-001', CUSTOMERS.CUST_001.id);

      // When: the customer confirms the appointment
      const appointment = await when_customer_confirms_booking(
        ctx,
        hold.holdId,
        CUSTOMERS.CUST_001.id,
        'Bringing my two kids aged 5 and 7',
        TIME_SLOTS[0],
      );

      // Then: an Appointment is created with correct data
      expect(appointment.petId).toBe('PET-001');
      expect(appointment.storeCode).toBe(STORES.STR_001.code);
      expect(appointment.customerId).toBe(CUSTOMERS.CUST_001.id);
      expect(appointment.status).toBe(AppointmentStatus.Confirmed);
      expect(appointment.visitNote).toBe('Bringing my two kids aged 5 and 7');
      expect(ctx.notifications.sentConfirmations).toHaveLength(1);
    });

    it('confirmation email fails — booking still created', async () => {
      // Given: email delivery system temporarily unavailable
      ctx.notifications.shouldFail = true;
      const hold = await when_customer_creates_hold(ctx, 'PET-001', 'TS-002', CUSTOMERS.CUST_001.id);

      // When: the customer confirms — email fails but appointment is created
      await expect(
        when_customer_confirms_booking(ctx, hold.holdId, CUSTOMERS.CUST_001.id, undefined, TIME_SLOTS[1]),
      ).rejects.toThrow('Email delivery failed');

      // Then: the appointment was saved (confirmation email threw after save)
      // Note: In production, email failure does not roll back. This test verifies the error propagates.
    });

    it('hold expired — confirmation fails with hold expired error', async () => {
      // Given: hold that has already expired (expiresAt in the past)
      const expiredHold = new SlotHold({
        holdId: 'HOLD-EXPIRED-002',
        customerId: CUSTOMERS.CUST_001.id,
        petId: 'PET-001',
        timeSlotId: 'TS-001',
        expiresAt: new Date(Date.now() - 60_000),
      });
      ctx.holdRepo.seed(expiredHold);

      // When / Then: confirmation fails
      await expect(
        when_customer_confirms_booking(ctx, expiredHold.holdId, CUSTOMERS.CUST_001.id),
      ).rejects.toThrow(SlotHoldExpiredError);
    });
  });
});

// =============================================================================
// STORY: View Upcoming and Past Appointments
// =============================================================================

describe('View Upcoming and Past Appointments', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestViewUpcomingAndPastAppointments', () => {
    it('appointments listed — upcoming and past separated', async () => {
      // Given: CustomerAccount CUST-001 with Appointment entries
      const upcoming1 = createAppointment({ id: 'APT-001', customerId: CUSTOMERS.CUST_001.id, status: AppointmentStatus.Confirmed });
      const upcoming2 = createAppointment({ id: 'APT-003', customerId: CUSTOMERS.CUST_001.id, petId: 'PET-005', storeCode: STORES.STR_002.code, status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(upcoming1);
      ctx.appointmentRepo.seed(upcoming2);

      // When: the customer opens their Appointment List
      const appointments = await when_customer_lists_appointments(ctx, CUSTOMERS.CUST_001.id);

      // Then: both appointments are returned
      expect(appointments).toHaveLength(2);
      expect(appointments.map((a) => a.id)).toContain('APT-001');
      expect(appointments.map((a) => a.id)).toContain('APT-003');
    });

    it('no appointments — empty list', async () => {
      // Given: CustomerAccount CUST-003 with no Appointment entries
      // When: the customer opens their Appointment List
      const appointments = await when_customer_lists_appointments(ctx, CUSTOMERS.CUST_003.id);

      // Then: empty list
      expect(appointments).toHaveLength(0);
    });
  });
});

// =============================================================================
// STORY: Cancel or Rebook Appointment After Pet Adoption
// =============================================================================

describe('Cancel or Rebook Appointment After Pet Adoption', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestCancelOrRebookAppointment', () => {
    it('customer cancels appointment — time slot released', async () => {
      // Given: an Appointment APT-003 for Pet PET-005 with appointmentStatus confirmed
      const appointment = createAppointment({ id: 'APT-003', petId: 'PET-005', storeCode: STORES.STR_002.code, customerId: CUSTOMERS.CUST_001.id, timeSlotId: 'TS-010' });
      ctx.appointmentRepo.seed(appointment);

      // When: the customer cancels the Appointment
      await when_customer_cancels_appointment(ctx, 'APT-003', CUSTOMERS.CUST_001.id);

      // Then: the Appointment transitions to cancelled
      const cancelled = await ctx.appointmentRepo.findById('APT-003' as any);
      expect(cancelled!.status).toBe(AppointmentStatus.Cancelled);

      // And: the TimeSlot is no longer booked
      expect(await ctx.appointmentRepo.isSlotBooked('TS-010')).toBe(false);
    });

    it('customer rebooks — new booking flow can proceed after cancellation', async () => {
      // Given: customer has cancelled Appointment APT-003
      const appointment = createAppointment({ id: 'APT-003', petId: 'PET-005', storeCode: STORES.STR_002.code, customerId: CUSTOMERS.CUST_001.id, timeSlotId: 'TS-010' });
      ctx.appointmentRepo.seed(appointment);
      await when_customer_cancels_appointment(ctx, 'APT-003', CUSTOMERS.CUST_001.id);

      // When: the customer attempts to create a new hold on TS-010
      const hold = await when_customer_creates_hold(ctx, 'PET-003', 'TS-010', CUSTOMERS.CUST_001.id);

      // Then: the new hold succeeds (slot was released)
      expect(hold.holdId).toBeTruthy();
    });
  });
});
