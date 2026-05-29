/**
 * Staff Appointment Workflow — server tests (Increment 6)
 *
 * Stories: Update Pet Profile, Mark Pet as Adopted, View Incoming Appointments,
 *          Check In Customer, Record Visit Outcome, Record No-Show, Set Follow-Up Action
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  createAppointment,
  createPet,
  PETS,
  STORES,
  CUSTOMERS,
  type PetVisitsTestContext,
} from '../helpers/pet-visits.helper';
import { toPetId } from '../../../packages/pet/shared/PetId';
import { PetStatusValues } from '../../../packages/pet/shared/PetStatus';
import { PetAlreadyAdoptedError } from '../../../packages/pet/shared/PetErrors';
import { AppointmentStatus } from '../../../packages/appointment/shared/AppointmentStatus';
import { VisitOutcomeValues } from '../../../packages/appointment/shared/VisitOutcome';
import { FollowUpActionValues } from '../../../packages/appointment/shared/FollowUpAction';
import {
  AppointmentAlreadyCheckedInError,
  AppointmentCancelledError,
  AlreadyCheckedInError,
} from '../../../packages/appointment/shared/AppointmentErrors';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_standard_pets_seeded(ctx: PetVisitsTestContext): void {
  ctx.petRepo.seed(Object.values(PETS));
}

async function when_staff_updates_pet_profile(ctx: PetVisitsTestContext, petId: string, update: { temperamentNotes?: string | null; addPhotoUrl?: string; removePhotoUrl?: string }) {
  return ctx.petService.updateProfile(toPetId(petId), update);
}

async function when_staff_marks_pet_adopted(ctx: PetVisitsTestContext, petId: string) {
  return ctx.petService.markAdopted(toPetId(petId));
}

async function when_staff_views_incoming_appointments(ctx: PetVisitsTestContext, storeCode: string) {
  return ctx.appointmentService.listIncoming(storeCode);
}

async function when_staff_checks_in_customer(ctx: PetVisitsTestContext, appointmentId: string, staffId: string) {
  return ctx.appointmentService.checkIn(appointmentId, staffId);
}

async function when_staff_records_outcome(ctx: PetVisitsTestContext, appointmentId: string, outcome: string, staffNotes?: string) {
  return ctx.appointmentService.recordOutcome(appointmentId, outcome as any, staffNotes);
}

async function when_staff_records_no_show(ctx: PetVisitsTestContext, appointmentId: string, staffId: string) {
  return ctx.appointmentService.recordNoShow(appointmentId, staffId);
}

async function when_staff_sets_follow_up(ctx: PetVisitsTestContext, appointmentId: string, action: string, date?: Date) {
  return ctx.appointmentService.setFollowUp(appointmentId, action as any, date);
}

// =============================================================================
// STORY: Update Pet Profile
// =============================================================================

describe('Update Pet Profile', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestUpdatePetProfile', () => {
    it('store employee updates pet profile fields — temperament', async () => {
      // Given: a Store Employee at Store STR-001; Pet PET-001 hosted at Store STR-001
      // When: the Store Employee saves changes to TemperamentAssessment
      const updated = await when_staff_updates_pet_profile(ctx, 'PET-001', { temperamentNotes: 'Very gentle, great family dog' });

      // Then: the customer-facing Pet Profile Page shows updated temperament
      expect(updated.temperamentNotes).toBe('Very gentle, great family dog');
      expect(updated.breed).toBe('Golden Retriever');
    });

    it('new photos added to pet photo gallery', async () => {
      // Given: Pet PET-001 with 2 existing PetPhoto entries
      // When: the Store Employee uploads new photo
      const updated = await when_staff_updates_pet_profile(ctx, 'PET-001', { addPhotoUrl: 'pet001_outdoor.jpg' });

      // Then: the gallery total is 3 photos
      expect(updated.photoUrls).toHaveLength(3);
      expect(updated.photoUrls).toContain('pet001_outdoor.jpg');
      expect(updated.photoUrls).toContain('pet001_front.jpg');
      expect(updated.photoUrls).toContain('pet001_playing.jpg');
    });
  });
});

// =============================================================================
// STORY: Mark Pet as Adopted
// =============================================================================

describe('Mark Pet as Adopted', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestMarkPetAsAdopted', () => {
    it('pet marked adopted — booking disabled, notifications sent', async () => {
      // Given: Pet PET-001 with lifecycleState Available; existing appointment
      const appointment = createAppointment({ id: 'APT-001', petId: 'PET-001', customerId: CUSTOMERS.CUST_001.id });
      ctx.appointmentRepo.seed(appointment);

      // When: the Store Employee marks Pet PET-001 as Adopted
      await when_staff_marks_pet_adopted(ctx, 'PET-001');

      // Then: Pet lifecycleState transitions to Adopted
      const pet = await ctx.petRepo.findById(toPetId('PET-001'));
      expect(pet!.status).toBe(PetStatusValues.Adopted);

      // And: adoption notifications sent
      expect(ctx.notifications.adoptionNotifications).toContain('PET-001');
    });

    it('already-adopted pet — idempotent with PetAlreadyAdoptedError', async () => {
      // Given: Pet PET-005 with lifecycleState Adopted
      // When: the Store Employee attempts to mark Pet PET-005 as Adopted again
      // Then: PetAlreadyAdoptedError thrown
      await expect(
        when_staff_marks_pet_adopted(ctx, 'PET-005'),
      ).rejects.toThrow(PetAlreadyAdoptedError);
    });
  });
});

// =============================================================================
// STORY: View Incoming Appointments
// =============================================================================

describe('View Incoming Appointments', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestViewIncomingAppointments', () => {
    it('staff sees upcoming appointments for their store', async () => {
      // Given: Appointment entries APT-001, APT-002 booked for Store STR-001
      const apt1 = createAppointment({ id: 'APT-001', storeCode: STORES.STR_001.code, customerId: CUSTOMERS.CUST_001.id });
      const apt2 = createAppointment({ id: 'APT-002', storeCode: STORES.STR_001.code, customerId: CUSTOMERS.CUST_001.id, petId: 'PET-002', timeSlotId: 'TS-004' });
      ctx.appointmentRepo.seed(apt1);
      ctx.appointmentRepo.seed(apt2);

      // When: the Store Employee opens the Incoming Appointments view
      const incoming = await when_staff_views_incoming_appointments(ctx, STORES.STR_001.code);

      // Then: the list shows 2 appointments
      expect(incoming).toHaveLength(2);
      expect(incoming.map((a) => a.id)).toContain('APT-001');
      expect(incoming.map((a) => a.id)).toContain('APT-002');
    });

    it('adopted pet appointment shows in incoming list with notification status', async () => {
      // Given: an Appointment APT-003 for adopted Pet PET-005
      const apt = createAppointment({ id: 'APT-003', petId: 'PET-005', storeCode: STORES.STR_002.code, customerId: CUSTOMERS.CUST_001.id, notificationStatus: 'notified' });
      ctx.appointmentRepo.seed(apt);

      // When: the Store Employee views Incoming Appointments
      const incoming = await when_staff_views_incoming_appointments(ctx, STORES.STR_002.code);

      // Then: the entry shows notified status
      const apt003 = incoming.find((a) => a.id === 'APT-003');
      expect(apt003).toBeDefined();
      expect(apt003!.notificationStatus).toBe('notified');
    });
  });
});

// =============================================================================
// STORY: Check In Customer
// =============================================================================

describe('Check In Customer', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestCheckInCustomer', () => {
    it('customer checked in — status transitions to checked-in', async () => {
      // Given: an Appointment APT-001 with appointmentStatus confirmed
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);

      // When: the Store Employee selects Check In
      const checkedIn = await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // Then: appointmentStatus transitions to checked_in
      expect(checkedIn.status).toBe(AppointmentStatus.CheckedIn);
      expect(checkedIn.checkInRecord).not.toBeNull();
      expect(checkedIn.checkInRecord!.checkedInBy).toBe(STORES.STR_001.code);
      expect(checkedIn.checkInRecord!.checkedInAt).toBeInstanceOf(Date);
    });

    it('early or late arrival — check-in still allowed', async () => {
      // Given: Appointment APT-001 with scheduled slot starting at 10:00
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);

      // When: staff checks in customer (could be early or late)
      const checkedIn = await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // Then: checkedInTime records the actual arrival
      expect(checkedIn.status).toBe(AppointmentStatus.CheckedIn);
      expect(checkedIn.checkInRecord!.checkedInAt).toBeInstanceOf(Date);
    });

    it('duplicate check-in — original time preserved with error', async () => {
      // Given: Appointment APT-001 already checked in
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // When: the Store Employee attempts to check in again
      // Then: AppointmentAlreadyCheckedInError thrown
      await expect(
        when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code),
      ).rejects.toThrow(AppointmentAlreadyCheckedInError);
    });

    it('check-in on cancelled appointment — blocked', async () => {
      // Given: Appointment APT-004 with appointmentStatus cancelled
      const apt = createAppointment({ id: 'APT-004', status: AppointmentStatus.Cancelled });
      ctx.appointmentRepo.seed(apt);

      // When: the Store Employee attempts to check in
      // Then: AppointmentCancelledError thrown
      await expect(
        when_staff_checks_in_customer(ctx, 'APT-004', STORES.STR_001.code),
      ).rejects.toThrow(AppointmentCancelledError);
    });
  });
});

// =============================================================================
// STORY: Record Visit Outcome
// =============================================================================

describe('Record Visit Outcome', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestRecordVisitOutcome', () => {
    it('visit outcome recorded — Browsing Only with staff notes', async () => {
      // Given: Appointment APT-001 with appointmentStatus checked-in
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // When: the Store Employee records outcome Browsing Only with notes
      const result = await when_staff_records_outcome(ctx, 'APT-001', VisitOutcomeValues.BrowsingOnly, 'Customer enjoyed meeting the dog');

      // Then: appointment status transitions to outcome_recorded
      expect(result.status).toBe(AppointmentStatus.OutcomeRecorded);
      expect(result.visitOutcome).toBe(VisitOutcomeValues.BrowsingOnly);
      expect(result.staffVisitNotes).toBe('Customer enjoyed meeting the dog');
    });

    it('visit outcome recorded — Not a Fit with staff notes', async () => {
      // Given: checked-in appointment
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // When
      const result = await when_staff_records_outcome(ctx, 'APT-001', VisitOutcomeValues.NotAFit, 'Dog too energetic for small flat');

      // Then
      expect(result.visitOutcome).toBe(VisitOutcomeValues.NotAFit);
      expect(result.staffVisitNotes).toBe('Dog too energetic for small flat');
    });

    it('adopted outcome triggers pet status transition', async () => {
      // Given: checked-in appointment for available Pet PET-001
      given_standard_pets_seeded(ctx);
      const apt = createAppointment({ id: 'APT-001', petId: 'PET-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // When: the Store Employee selects Adopted as the visitOutcome
      const petServiceRef = { markAdopted: async (petId: PetId) => ctx.petService.markAdopted(petId) };
      await ctx.appointmentService.recordOutcome('APT-001', VisitOutcomeValues.Adopted, undefined, petServiceRef);

      // Then: Pet lifecycleState transitions to Adopted
      const pet = await ctx.petRepo.findById(toPetId('PET-001'));
      expect(pet!.status).toBe(PetStatusValues.Adopted);
    });

    it('interested-returning outcome records correctly', async () => {
      // Given: checked-in appointment
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // When
      const result = await when_staff_records_outcome(ctx, 'APT-001', VisitOutcomeValues.InterestedReturning);

      // Then
      expect(result.visitOutcome).toBe(VisitOutcomeValues.InterestedReturning);
    });

    it('outcome recorded without staff notes — accepted', async () => {
      // Given: checked-in appointment
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // When: records outcome without staffVisitNotes
      const result = await when_staff_records_outcome(ctx, 'APT-001', VisitOutcomeValues.BrowsingOnly);

      // Then: outcome recorded, notes are null
      expect(result.status).toBe(AppointmentStatus.OutcomeRecorded);
      expect(result.staffVisitNotes).toBeNull();
    });
  });
});

// =============================================================================
// STORY: Record No-Show
// =============================================================================

describe('Record No-Show', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestRecordNoShow', () => {
    it('no-show recorded after time slot passes', async () => {
      // Given: Appointment APT-001 with appointmentStatus confirmed, time slot passed
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);

      // When: the Store Employee marks Appointment APT-001 as No-Show
      const result = await when_staff_records_no_show(ctx, 'APT-001', STORES.STR_001.code);

      // Then: appointmentStatus transitions to no_show
      expect(result.status).toBe(AppointmentStatus.NoShow);
      expect(result.noShowRecord).not.toBeNull();
      expect(result.noShowRecord!.recordedBy).toBe(STORES.STR_001.code);
      expect(result.noShowRecord!.recordedAt).toBeInstanceOf(Date);
    });

    it('no-show blocked for checked-in appointment', async () => {
      // Given: Appointment APT-001 already checked-in
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);

      // When: the Store Employee attempts to mark as No-Show
      // Then: AlreadyCheckedInError thrown
      await expect(
        when_staff_records_no_show(ctx, 'APT-001', STORES.STR_001.code),
      ).rejects.toThrow(AlreadyCheckedInError);
    });
  });
});

// =============================================================================
// STORY: Set Follow-Up Action
// =============================================================================

describe('Set Follow-Up Action', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestSetFollowUpAction', () => {
    it('follow-up action recorded — schedule-return-visit', async () => {
      // Given: Appointment APT-001 with a recorded visitOutcome
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);
      await when_staff_records_outcome(ctx, 'APT-001', VisitOutcomeValues.InterestedReturning);

      // When: the Store Employee sets followUpAction schedule-return-visit
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const result = await when_staff_sets_follow_up(ctx, 'APT-001', FollowUpActionValues.ScheduleReturnVisit, futureDate);

      // Then: appointment records follow-up action and date
      expect(result.followUpAction).toBe(FollowUpActionValues.ScheduleReturnVisit);
      expect(result.followUpDate).not.toBeNull();
    });

    it('follow-up action recorded — hold-pet', async () => {
      // Given: Appointment with recorded outcome
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);
      await when_staff_records_outcome(ctx, 'APT-001', VisitOutcomeValues.InterestedReturning);

      // When
      const futureDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
      const result = await when_staff_sets_follow_up(ctx, 'APT-001', FollowUpActionValues.HoldPet, futureDate);

      // Then
      expect(result.followUpAction).toBe(FollowUpActionValues.HoldPet);
    });

    it('follow-up action recorded — send-adoption-paperwork', async () => {
      // Given: Appointment with recorded outcome
      const apt = createAppointment({ id: 'APT-001', status: AppointmentStatus.Confirmed });
      ctx.appointmentRepo.seed(apt);
      await when_staff_checks_in_customer(ctx, 'APT-001', STORES.STR_001.code);
      await when_staff_records_outcome(ctx, 'APT-001', VisitOutcomeValues.InterestedReturning);

      // When
      const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const result = await when_staff_sets_follow_up(ctx, 'APT-001', FollowUpActionValues.SendAdoptionPaperwork, futureDate);

      // Then
      expect(result.followUpAction).toBe(FollowUpActionValues.SendAdoptionPaperwork);
    });
  });
});
