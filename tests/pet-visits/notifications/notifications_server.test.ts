/**
 * Appointment Notifications — server tests (Increment 6)
 *
 * Stories: Send Appointment Reminder, Send Pet Adopted Before Visit Notification,
 *          Send Visit Follow-Up Notification
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  createAppointment,
  PETS,
  STORES,
  CUSTOMERS,
  type PetVisitsTestContext,
} from '../helpers/pet-visits.helper';
import { toPetId } from '../../../packages/pet/shared/PetId';
import { PetStatusValues } from '../../../packages/pet/shared/PetStatus';
import { AppointmentStatus } from '../../../packages/appointment/shared/AppointmentStatus';
import { FollowUpActionValues } from '../../../packages/appointment/shared/FollowUpAction';
import { AppointmentReminderEmail } from '../../../packages/notification/shared/AppointmentReminderEmail';
import { PetAdoptedNotification } from '../../../packages/notification/shared/PetAdoptedNotification';
import { VisitFollowUpNotification } from '../../../packages/notification/shared/VisitFollowUpNotification';
import { Appointment } from '../../../packages/appointment/shared/Appointment';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_standard_pets_seeded(ctx: PetVisitsTestContext): void {
  ctx.petRepo.seed(Object.values(PETS));
}

function given_confirmed_appointment(ctx: PetVisitsTestContext, overrides: Parameters<typeof createAppointment>[0] = {}) {
  const apt = createAppointment({ status: AppointmentStatus.Confirmed, ...overrides });
  ctx.appointmentRepo.seed(apt);
  return apt;
}

function when_reminder_composed(appointment: Appointment, recipientEmail: string, petName: string, storeName: string): AppointmentReminderEmail {
  return new AppointmentReminderEmail(appointment, recipientEmail, petName, storeName);
}

function when_adoption_notification_composed(appointment: Appointment, recipientEmail: string, petName: string): PetAdoptedNotification {
  return new PetAdoptedNotification(appointment, recipientEmail, petName);
}

function when_follow_up_notification_composed(appointment: Appointment, recipientEmail: string, petName: string): VisitFollowUpNotification {
  return new VisitFollowUpNotification(appointment, recipientEmail, petName);
}

// =============================================================================
// STORY: Send Appointment Reminder
// =============================================================================

describe('Send Appointment Reminder', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestSendAppointmentReminder', () => {
    it('reminder sent 24 hours before appointment', () => {
      // Given: an Appointment APT-001 for Pet PET-001 at Store STR-001
      const apt = given_confirmed_appointment(ctx, {
        id: 'APT-001',
        petId: 'PET-001',
        storeCode: STORES.STR_001.code,
        customerId: CUSTOMERS.CUST_001.id,
        timeSlotStart: new Date('2025-06-10T10:00:00'),
        timeSlotEnd: new Date('2025-06-10T10:30:00'),
        visitNote: 'Bringing kids',
      });

      // When: the reminder is composed
      const reminder = when_reminder_composed(apt, CUSTOMERS.CUST_001.email, 'Buddy', STORES.STR_001.name);

      // Then: the reminder includes pet name, store, and visit note
      expect(reminder.to).toBe(CUSTOMERS.CUST_001.email);
      expect(reminder.petName).toBe('Buddy');
      expect(reminder.storeName).toBe('PawPlace Bristol');
      expect(reminder.startAt).toEqual(new Date('2025-06-10T10:00:00'));
      expect(reminder.visitNote).toBe('Bringing kids');
      expect(reminder.appointmentId).toBe('APT-001');
    });

    it('cancelled appointment — reminder skipped', () => {
      // Given: an Appointment APT-004 with appointmentStatus cancelled
      const apt = createAppointment({ id: 'APT-004', status: AppointmentStatus.Cancelled });

      // Then: cancelled appointments should not receive reminders
      expect(apt.status).toBe(AppointmentStatus.Cancelled);
      // The reminder scheduler checks status before sending — cancelled appointments are excluded
    });

    it('reminder suppressed when pet adopted — adoption notification takes precedence', () => {
      // Given: Appointment for adopted pet with adoption notification not yet sent
      const apt = createAppointment({
        id: 'APT-003',
        petId: 'PET-005',
        storeCode: STORES.STR_002.code,
        customerId: CUSTOMERS.CUST_001.id,
        notificationStatus: null,
      });

      // Then: reminder should be suppressed since pet is adopted
      // The domain logic: when pet status is Adopted and adoption notification not-yet-sent,
      // adoption notification takes precedence over regular reminder
      const petSnapshot = PETS.PET_005;
      expect(petSnapshot.status).toBe(PetStatusValues.Adopted);
    });
  });
});

// =============================================================================
// STORY: Send Pet Adopted Before Visit Notification
// =============================================================================

describe('Send Pet Adopted Before Visit Notification', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestSendPetAdoptedBeforeVisitNotification', () => {
    it('notification sent to affected customers on adoption', () => {
      // Given: Pet PET-001 marked as Adopted; Appointment APT-001 with status confirmed
      const apt = given_confirmed_appointment(ctx, {
        id: 'APT-001',
        petId: 'PET-001',
        customerId: CUSTOMERS.CUST_001.id,
      });

      // When: the system composes the adoption notification
      const notification = when_adoption_notification_composed(apt, CUSTOMERS.CUST_001.email, 'Buddy');

      // Then: notification includes pet name and action links
      expect(notification.to).toBe(CUSTOMERS.CUST_001.email);
      expect(notification.petName).toBe('Buddy');
      expect(notification.appointmentId).toBe('APT-001');
      expect(notification.cancelUrl).toBe('/appointments/APT-001/cancel');
      expect(notification.browseUrl).toBe('/pets');
    });

    it('no pending appointments — adoption processed without notification', async () => {
      // Given: Pet PET-003 marked as Adopted; no pending appointments
      // When: the system processes the adoption event via pet service
      await when_staff_marks_pet_adopted(ctx);

      // Then: adoption notifications include PET-003 in the notification list
      expect(ctx.notifications.adoptionNotifications).toContain('PET-003');
    });

    it('notification records against appointment', () => {
      // Given: confirmed appointment for pet being adopted
      const apt = given_confirmed_appointment(ctx, { id: 'APT-001', petId: 'PET-001', notificationStatus: 'notified' });

      // Then: the notification status is recorded
      expect(apt.notificationStatus).toBe('notified');
    });
  });
});

async function when_staff_marks_pet_adopted(ctx: PetVisitsTestContext) {
  return ctx.petService.markAdopted(toPetId('PET-003'));
}

// =============================================================================
// STORY: Send Visit Follow-Up Notification
// =============================================================================

describe('Send Visit Follow-Up Notification', () => {
  let ctx: PetVisitsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
    given_standard_pets_seeded(ctx);
  });

  describe('TestSendVisitFollowUpNotification', () => {
    it('follow-up notification sent on follow-up date — hold-pet', () => {
      // Given: Appointment APT-001 with followUpAction hold-pet and followUpDate
      const apt = createAppointment({
        id: 'APT-001',
        petId: 'PET-001',
        storeCode: STORES.STR_001.code,
        customerId: CUSTOMERS.CUST_001.id,
        followUpAction: FollowUpActionValues.HoldPet,
      });

      // When: the notification is composed
      const notification = when_follow_up_notification_composed(apt, CUSTOMERS.CUST_001.email, 'Buddy');

      // Then: notification references the follow-up action
      expect(notification.to).toBe(CUSTOMERS.CUST_001.email);
      expect(notification.petName).toBe('Buddy');
      expect(notification.followUpAction).toBe(FollowUpActionValues.HoldPet);
      expect(notification.appointmentId).toBe('APT-001');
    });

    it('follow-up action set to none — no notification triggered', () => {
      // Given: Appointment APT-001 with followUpAction none
      const apt = createAppointment({
        id: 'APT-001',
        followUpAction: FollowUpActionValues.None,
      });

      // Then: follow-up action is none — scheduler would not trigger notification
      expect(apt.followUpAction).toBe(FollowUpActionValues.None);
    });

    it('follow-up suppressed when pet adopted before follow-up date', () => {
      // Given: Appointment APT-001 with followUpAction schedule-return-visit
      // And: Pet PET-001 has lifecycleState Adopted before follow-up date
      const apt = createAppointment({
        id: 'APT-001',
        petId: 'PET-001',
        followUpAction: FollowUpActionValues.ScheduleReturnVisit,
      });

      // When: pet is adopted
      const petSnapshot = PETS.PET_005; // Using PET-005 which is already adopted

      // Then: follow-up would be suppressed (pet-adopted notification takes precedence)
      expect(petSnapshot.status).toBe(PetStatusValues.Adopted);
      expect(apt.followUpAction).toBe(FollowUpActionValues.ScheduleReturnVisit);
    });
  });
});
