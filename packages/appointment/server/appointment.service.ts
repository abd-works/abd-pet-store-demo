import { Appointment } from '../shared/Appointment';
import { AppointmentStatus } from '../shared/AppointmentStatus';
import { SlotHold, type SlotHoldDto } from '../shared/SlotHold';
import { TimeSlot } from '../shared/TimeSlot';
import { toVisitNote } from '../shared/VisitNote';
import { toStaffVisitNotes } from '../shared/StaffVisitNotes';
import { FollowUpDate } from '../shared/FollowUpDate';
import {
  SlotNoLongerAvailableError,
  SlotHoldExpiredError,
  AppointmentNotFoundError,
} from '../shared/AppointmentErrors';
import type { AppointmentId, } from '../shared/AppointmentId';
import { toAppointmentId } from '../shared/AppointmentId';
import type { VisitOutcome } from '../shared/VisitOutcome';
import type { FollowUpAction } from '../shared/FollowUpAction';
import type { IAppointmentRepository, ISlotHoldRepository } from './appointment.repository';
import type { PetId } from '../../pet/shared/PetId';

const DEFAULT_HOLD_MINUTES = parseInt(process.env['APPOINTMENT_HOLD_MINUTES'] ?? '10', 10);

export interface AppointmentNotificationService {
  sendConfirmationEmail(appointment: Appointment): Promise<void>;
  notifyPendingAppointmentsOfAdoption(petId: PetId): Promise<void>;
}

export interface PetServiceRef {
  markAdopted(petId: PetId): Promise<void>;
}

export interface TimeSlotAvailabilityDto {
  timeSlotId: string;
  storeCode: string;
  startAt: Date;
  endAt: Date;
  available: boolean;
}

export class AppointmentService {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly holdRepository: ISlotHoldRepository,
    private readonly notificationService: AppointmentNotificationService,
    private readonly holdMinutes: number = DEFAULT_HOLD_MINUTES,
  ) {}

  async createHold(
    petId: PetId,
    timeSlotId: string,
    customerId: string,
  ): Promise<SlotHoldDto> {
    const existing = await this.holdRepository.findActiveHold(timeSlotId);
    if (existing) throw new SlotNoLongerAvailableError(timeSlotId);

    const isBooked = await this.appointmentRepository.isSlotBooked(timeSlotId);
    if (isBooked) throw new SlotNoLongerAvailableError(timeSlotId);

    const hold = SlotHold.create({ petId, timeSlotId, customerId, holdMinutes: this.holdMinutes });
    await this.holdRepository.insert(hold);
    return hold.toDto();
  }

  async releaseHold(holdId: string): Promise<void> {
    await this.holdRepository.delete(holdId);
  }

  async confirmBooking(
    holdId: string,
    customerId: string,
    visitNoteText?: string,
    timeSlotData?: { timeSlotId: string; storeCode: string; startAt: Date; endAt: Date },
  ): Promise<Appointment> {
    const hold = await this.holdRepository.findById(holdId);
    if (!hold) throw new SlotHoldExpiredError(holdId);
    if (hold.isExpired()) throw new SlotHoldExpiredError(holdId);

    const alreadyBooked = await this.appointmentRepository.isSlotBooked(hold.timeSlotId);
    if (alreadyBooked) throw new SlotNoLongerAvailableError(hold.timeSlotId);

    const slotData = timeSlotData ?? {
      timeSlotId: hold.timeSlotId,
      storeCode: 'UNKNOWN',
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 60 * 1000),
    };

    const timeSlot = new TimeSlot(slotData);
    const visitNote = visitNoteText ? toVisitNote(visitNoteText) : undefined;
    const appointment = Appointment.create({
      petId: hold.petId,
      storeCode: slotData.storeCode,
      customerId,
      timeSlot,
      visitNote,
    });

    await this.appointmentRepository.save(appointment);
    await this.holdRepository.delete(holdId);
    await this.notificationService.sendConfirmationEmail(appointment);
    return appointment;
  }

  async cancelAppointment(appointmentId: AppointmentId, customerId: string): Promise<void> {
    const appointment = await this.requireAppointment(appointmentId);
    if (appointment.customerId !== customerId) {
      throw new AppointmentNotFoundError(appointmentId);
    }
    appointment.cancel();
    await this.appointmentRepository.save(appointment);
  }

  async listForAccount(customerId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByAccount(customerId);
  }

  async getById(appointmentId: AppointmentId): Promise<Appointment> {
    return this.requireAppointment(appointmentId);
  }

  async listIncoming(storeCode: string): Promise<Appointment[]> {
    return this.appointmentRepository.findConfirmedByStore(storeCode);
  }

  async checkIn(appointmentIdStr: string, staffId: string): Promise<Appointment> {
    const appointmentId = toAppointmentId(appointmentIdStr);
    const appointment = await this.requireAppointment(appointmentId);
    appointment.checkIn(staffId, new Date());
    await this.appointmentRepository.save(appointment);
    return appointment;
  }

  async recordOutcome(
    appointmentIdStr: string,
    outcome: VisitOutcome,
    staffVisitNotesText?: string,
    petService?: PetServiceRef,
  ): Promise<Appointment> {
    const appointmentId = toAppointmentId(appointmentIdStr);
    const appointment = await this.requireAppointment(appointmentId);
    const notes = staffVisitNotesText ? toStaffVisitNotes(staffVisitNotesText) : undefined;
    appointment.recordOutcome(outcome, notes);
    await this.appointmentRepository.save(appointment);

    if (outcome === 'adopted' && petService) {
      await petService.markAdopted(appointment.petId);
    }

    return appointment;
  }

  async recordNoShow(appointmentIdStr: string, staffId: string): Promise<Appointment> {
    const appointmentId = toAppointmentId(appointmentIdStr);
    const appointment = await this.requireAppointment(appointmentId);
    appointment.recordNoShow(staffId, new Date());
    await this.appointmentRepository.save(appointment);
    return appointment;
  }

  async setFollowUp(
    appointmentIdStr: string,
    action: FollowUpAction,
    followUpDateValue?: Date,
  ): Promise<Appointment> {
    const appointmentId = toAppointmentId(appointmentIdStr);
    const appointment = await this.requireAppointment(appointmentId);
    const followUpDate = followUpDateValue ? new FollowUpDate(followUpDateValue) : new FollowUpDate(new Date());
    appointment.setFollowUp(action, followUpDate);
    await this.appointmentRepository.save(appointment);
    return appointment;
  }

  private async requireAppointment(appointmentId: AppointmentId): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) throw new AppointmentNotFoundError(appointmentId);
    return appointment;
  }
}
