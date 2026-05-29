import type { Appointment } from '../shared/Appointment';
import type { AppointmentId } from '../shared/AppointmentId';
import type { PetId } from '../../pet/shared/PetId';
import type { AppointmentStatusValue } from '../shared/AppointmentStatus';

export interface IAppointmentRepository {
  findById(appointmentId: AppointmentId): Promise<Appointment | null>;
  findByAccount(customerId: string): Promise<Appointment[]>;
  findConfirmedByStore(storeCode: string): Promise<Appointment[]>;
  findConfirmedByPet(petId: PetId): Promise<Appointment[]>;
  findDueForReminder(from: Date, to: Date): Promise<Appointment[]>;
  findDueForFollowUp(today: Date): Promise<Appointment[]>;
  isSlotBooked(timeSlotId: string): Promise<boolean>;
  save(appointment: Appointment): Promise<void>;
  setNotificationStatus(appointmentIds: AppointmentId[], status: 'pending' | 'notified'): Promise<void>;
  setReminderSent(appointmentId: AppointmentId): Promise<void>;
}

export interface ISlotHoldRepository {
  findActiveHold(timeSlotId: string): Promise<import('../shared/SlotHold').SlotHold | null>;
  findById(holdId: string): Promise<import('../shared/SlotHold').SlotHold | null>;
  insert(hold: import('../shared/SlotHold').SlotHold): Promise<void>;
  delete(holdId: string): Promise<void>;
}
