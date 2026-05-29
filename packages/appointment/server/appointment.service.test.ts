import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../shared/Appointment';
import { AppointmentStatus } from '../shared/AppointmentStatus';
import { SlotHold } from '../shared/SlotHold';
import { TimeSlot } from '../shared/TimeSlot';
import { toPetId } from '../../pet/shared/PetId';
import { toAppointmentId } from '../shared/AppointmentId';
import {
  SlotNoLongerAvailableError,
  SlotHoldExpiredError,
  AppointmentAlreadyCheckedInError,
  AppointmentCancelledError,
  AlreadyCheckedInError,
} from '../shared/AppointmentErrors';
import type { IAppointmentRepository, ISlotHoldRepository } from './appointment.repository';

const PET_ID = toPetId('PET-001');
const STORE_CODE = 'STR-001';
const CUST_ID = 'CUST-1';
const STAFF_ID = 'STAFF-1';
const now = new Date();
const later = new Date(now.getTime() + 30 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

function makeTimeSlot(id = 'SLOT-A'): TimeSlot {
  return new TimeSlot({ timeSlotId: id, storeCode: STORE_CODE, startAt: tomorrow, endAt: new Date(tomorrow.getTime() + 30 * 60 * 1000) });
}

function makeHold(expired = false): SlotHold {
  const expiresAt = expired
    ? new Date(Date.now() - 1000)
    : new Date(Date.now() + 10 * 60 * 1000);
  return new SlotHold({ holdId: 'HOLD-1', customerId: CUST_ID, petId: PET_ID, timeSlotId: 'SLOT-A', expiresAt });
}

function makeConfirmedAppointment(id = 'APPT-1'): Appointment {
  return Appointment.create({
    petId: PET_ID,
    storeCode: STORE_CODE,
    customerId: CUST_ID,
    timeSlot: makeTimeSlot(),
  });
}

class ConfirmAppointmentBookingBehaviours {
  protected appointmentRepository: IAppointmentRepository;
  protected holdRepository: ISlotHoldRepository;
  protected notificationService: { sendConfirmationEmail: ReturnType<typeof vi.fn>; notifyPendingAppointmentsOfAdoption: ReturnType<typeof vi.fn> };
  protected service: AppointmentService;

  constructor() {
    this.appointmentRepository = {
      findById: vi.fn(),
      findByAccount: vi.fn(),
      findConfirmedByStore: vi.fn(),
      findConfirmedByPet: vi.fn(),
      findDueForReminder: vi.fn(),
      findDueForFollowUp: vi.fn(),
      isSlotBooked: vi.fn().mockResolvedValue(false),
      save: vi.fn().mockResolvedValue(undefined),
      setNotificationStatus: vi.fn().mockResolvedValue(undefined),
      setReminderSent: vi.fn().mockResolvedValue(undefined),
    };
    this.holdRepository = {
      findActiveHold: vi.fn().mockResolvedValue(null),
      findById: vi.fn(),
      insert: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    this.notificationService = {
      sendConfirmationEmail: vi.fn().mockResolvedValue(undefined),
      notifyPendingAppointmentsOfAdoption: vi.fn().mockResolvedValue(undefined),
    };
    this.service = new AppointmentService(
      this.appointmentRepository,
      this.holdRepository,
      this.notificationService,
    );
  }

  async givenAvailableSlotHeld(petId: string, slotId: string, customerId: string): Promise<void> {
    vi.mocked(this.holdRepository.findById).mockResolvedValue(makeHold());
  }

  async whenCustomerConfirmsBooking(holdId: string, customerId: string): Promise<Appointment> {
    return this.service.confirmBooking(holdId, customerId, undefined, {
      timeSlotId: 'SLOT-A',
      storeCode: STORE_CODE,
      startAt: tomorrow,
      endAt: new Date(tomorrow.getTime() + 30 * 60 * 1000),
    });
  }

  async thenAppointmentStatusIs(appt: Appointment, expected: string): Promise<void> {
    expect(appt.status).toBe(expected);
  }

  async thenConfirmationEmailQueued(appt: Appointment): Promise<void> {
    expect(this.notificationService.sendConfirmationEmail).toHaveBeenCalledWith(appt);
  }

  async givenExpiredHold(holdId: string): Promise<void> {
    vi.mocked(this.holdRepository.findById).mockResolvedValue(makeHold(true));
  }

  async thenConfirmingThrows(holdId: string, customerId: string, ErrorClass: typeof Error): Promise<void> {
    await expect(this.service.confirmBooking(holdId, customerId)).rejects.toBeInstanceOf(ErrorClass);
  }

  async givenSlotAlreadyBooked(slotId: string): Promise<void> {
    vi.mocked(this.holdRepository.findById).mockResolvedValue(makeHold());
    vi.mocked(this.appointmentRepository.isSlotBooked).mockResolvedValue(true);
  }
}

class CheckInCustomerBehaviours {
  protected appointmentRepository: IAppointmentRepository;
  protected service: AppointmentService;

  constructor() {
    this.appointmentRepository = {
      findById: vi.fn(),
      findByAccount: vi.fn(),
      findConfirmedByStore: vi.fn(),
      findConfirmedByPet: vi.fn(),
      findDueForReminder: vi.fn(),
      findDueForFollowUp: vi.fn(),
      isSlotBooked: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      setNotificationStatus: vi.fn(),
      setReminderSent: vi.fn(),
    };
    const holdRepository: ISlotHoldRepository = {
      findActiveHold: vi.fn(),
      findById: vi.fn(),
      insert: vi.fn(),
      delete: vi.fn(),
    };
    this.service = new AppointmentService(
      this.appointmentRepository,
      holdRepository,
      { sendConfirmationEmail: vi.fn(), notifyPendingAppointmentsOfAdoption: vi.fn() },
    );
  }

  givenConfirmedAppointment(id: string): Appointment {
    const appt = makeConfirmedAppointment(id);
    vi.mocked(this.appointmentRepository.findById).mockResolvedValue(appt);
    return appt;
  }

  givenCheckedInAppointment(id: string): Appointment {
    const appt = makeConfirmedAppointment(id);
    appt.checkIn(STAFF_ID, now);
    vi.mocked(this.appointmentRepository.findById).mockResolvedValue(appt);
    return appt;
  }

  givenCancelledAppointment(id: string): Appointment {
    const appt = makeConfirmedAppointment(id);
    appt.cancel();
    vi.mocked(this.appointmentRepository.findById).mockResolvedValue(appt);
    return appt;
  }

  async whenStaffChecksIn(id: string, staffId: string): Promise<Appointment> {
    return this.service.checkIn(id, staffId);
  }

  async thenAppointmentStatusIs(result: Appointment, expected: string): Promise<void> {
    expect(result.status).toBe(expected);
  }

  async thenCheckInReturnsOriginalTime(result: Appointment, originalTime: Date): Promise<void> {
    // Controller returns 409 with original time; entity guards the re-check
    expect(result.checkInRecord?.checkedInAt).toEqual(originalTime);
  }

  async thenCheckInThrows(id: string, ErrorClass: typeof Error): Promise<void> {
    await expect(this.service.checkIn(id, STAFF_ID)).rejects.toBeInstanceOf(ErrorClass);
  }
}

describe('AppointmentService — Confirm Appointment Booking', () => {
  const helper = new ConfirmAppointmentBookingBehaviours();

  it('confirmation creates appointment and sends confirmation email', async () => {
    await helper.givenAvailableSlotHeld('PET-001', 'SLOT-A', 'CUST-1');
    const appt = await helper.whenCustomerConfirmsBooking('HOLD-1', 'CUST-1');
    await helper.thenAppointmentStatusIs(appt, AppointmentStatus.Confirmed);
    await helper.thenConfirmationEmailQueued(appt);
  });

  it('expired hold throws SlotHoldExpiredError', async () => {
    await helper.givenExpiredHold('HOLD-2');
    await helper.thenConfirmingThrows('HOLD-2', 'CUST-1', SlotHoldExpiredError);
  });

  it('concurrent confirm second sees slot unavailable', async () => {
    await helper.givenSlotAlreadyBooked('SLOT-B');
    await helper.thenConfirmingThrows('HOLD-3', 'CUST-2', SlotNoLongerAvailableError);
  });
});

describe('AppointmentService — Check In Customer', () => {
  const helper = new CheckInCustomerBehaviours();

  it('check-in transitions status to checked_in', async () => {
    helper.givenConfirmedAppointment('APPT-1');
    const result = await helper.whenStaffChecksIn('APPT-1', STAFF_ID);
    await helper.thenAppointmentStatusIs(result, AppointmentStatus.CheckedIn);
  });

  it('check-in on already checked-in appointment throws AppointmentAlreadyCheckedInError', async () => {
    helper.givenCheckedInAppointment('APPT-2');
    await helper.thenCheckInThrows('APPT-2', AppointmentAlreadyCheckedInError);
  });

  it('check-in on cancelled appointment throws AppointmentCancelledError', async () => {
    helper.givenCancelledAppointment('APPT-3');
    await helper.thenCheckInThrows('APPT-3', AppointmentCancelledError);
  });
});
