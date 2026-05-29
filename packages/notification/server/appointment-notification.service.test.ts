import { describe, it, expect, vi } from 'vitest';
import { AppointmentNotificationService } from './appointment-notification.service';
import { Appointment } from '../../appointment/shared/Appointment';
import { AppointmentStatus } from '../../appointment/shared/AppointmentStatus';
import { toPetId } from '../../pet/shared/PetId';
import { toAppointmentId } from '../../appointment/shared/AppointmentId';
import { TimeSlot } from '../../appointment/shared/TimeSlot';
import type { IAppointmentRepository } from '../../appointment/server/appointment.repository';

const PET_ID = toPetId('PET-001');
const STORE_CODE = 'STR-001';
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

function makeAppointment(id: string, customerId: string): Appointment {
  return Appointment.create({
    petId: PET_ID,
    storeCode: STORE_CODE,
    customerId,
    timeSlot: new TimeSlot({
      timeSlotId: 'SLOT-A',
      storeCode: STORE_CODE,
      startAt: tomorrow,
      endAt: new Date(tomorrow.getTime() + 30 * 60 * 1000),
    }),
  });
}

function makeRepository(appointments: Appointment[]): IAppointmentRepository {
  return {
    findById: vi.fn(),
    findByAccount: vi.fn(),
    findConfirmedByStore: vi.fn(),
    findConfirmedByPet: vi.fn().mockResolvedValue(appointments),
    findDueForReminder: vi.fn(),
    findDueForFollowUp: vi.fn(),
    isSlotBooked: vi.fn(),
    save: vi.fn(),
    setNotificationStatus: vi.fn().mockResolvedValue(undefined),
    setReminderSent: vi.fn().mockResolvedValue(undefined),
  };
}

class PetAdoptedBeforeVisitNotificationBehaviours {
  private emailProvider: { enqueue: ReturnType<typeof vi.fn> };
  private appointmentRepository: IAppointmentRepository;
  private service!: AppointmentNotificationService;
  private storedAppointments: Appointment[] = [];

  constructor() {
    this.emailProvider = { enqueue: vi.fn().mockResolvedValue(undefined) };
    this.appointmentRepository = makeRepository([]);
  }

  async givenPendingAppointments(petId: string, appointmentIds: string[]): Promise<void> {
    this.storedAppointments = appointmentIds.map((id, i) => makeAppointment(id, `CUST-${i + 1}`));
    this.appointmentRepository = makeRepository(this.storedAppointments);
    this.service = new AppointmentNotificationService(
      this.emailProvider,
      this.appointmentRepository,
      {
        getEmail: vi.fn().mockResolvedValue('customer@example.com'),
        getPetName: vi.fn().mockResolvedValue('Buddy'),
        getStoreName: vi.fn().mockReturnValue('Pawplace City'),
      },
    );
  }

  async givenPetWithNoConfirmedAppointments(petId: string): Promise<void> {
    this.appointmentRepository = makeRepository([]);
    this.service = new AppointmentNotificationService(
      this.emailProvider,
      this.appointmentRepository,
      {
        getEmail: vi.fn().mockResolvedValue('customer@example.com'),
        getPetName: vi.fn().mockResolvedValue('Buddy'),
        getStoreName: vi.fn().mockReturnValue('Pawplace City'),
      },
    );
  }

  async whenPetIsMarkedAdopted(petId: string): Promise<void> {
    await this.service.notifyPendingAppointmentsOfAdoption(toPetId(petId));
  }

  async thenNotificationsEnqueuedFor(appointmentIds: string[]): Promise<void> {
    expect(this.emailProvider.enqueue).toHaveBeenCalledTimes(appointmentIds.length);
  }

  async thenNotificationStatusIsNotified(appointmentIds: string[]): Promise<void> {
    expect(this.appointmentRepository.setNotificationStatus).toHaveBeenCalled();
  }

  async thenNoNotificationEnqueued(): Promise<void> {
    expect(this.emailProvider.enqueue).not.toHaveBeenCalled();
  }
}

describe('AppointmentNotificationService — Pet Adopted Before Visit', () => {
  const helper = new PetAdoptedBeforeVisitNotificationBehaviours();

  it('all pending appointments notified on adoption', async () => {
    await helper.givenPendingAppointments('PET-001', ['APPT-1', 'APPT-2']);
    await helper.whenPetIsMarkedAdopted('PET-001');
    await helper.thenNotificationsEnqueuedFor(['APPT-1', 'APPT-2']);
    await helper.thenNotificationStatusIsNotified(['APPT-1', 'APPT-2']);
  });

  it('no notification when no pending appointments', async () => {
    await helper.givenPetWithNoConfirmedAppointments('PET-002');
    await helper.whenPetIsMarkedAdopted('PET-002');
    await helper.thenNoNotificationEnqueued();
  });
});
