import { Pet, type PetSnapshot } from '../../pet/shared/Pet';
import type { IPetRepository } from '../../pet/server/pet.repository';
import type { PetId } from '../../pet/shared/PetId';
import type { Species } from '../../pet/shared/Species';
import { Appointment } from '../../appointment/shared/Appointment';
import { AppointmentStatus } from '../../appointment/shared/AppointmentStatus';
import type { IAppointmentRepository, ISlotHoldRepository } from '../../appointment/server/appointment.repository';
import type { AppointmentId } from '../../appointment/shared/AppointmentId';
import { SlotHold } from '../../appointment/shared/SlotHold';
import { PetStatusValues } from '../../pet/shared/PetStatus';

export class InMemoryPetRepo implements IPetRepository {
  private pets = new Map<string, Pet>();

  async findAll(species?: Species): Promise<Pet[]> {
    const all = [...this.pets.values()].filter(
      (p) => p.status === PetStatusValues.Available,
    );
    if (species) return all.filter((p) => p.species === species);
    return all;
  }

  async findById(petId: PetId): Promise<Pet | null> {
    return this.pets.get(petId) ?? null;
  }

  async save(pet: Pet): Promise<void> {
    this.pets.set(pet.id, pet);
  }

  seed(snapshot: PetSnapshot): void {
    this.pets.set(snapshot.id, Pet.fromSnapshot(snapshot));
  }

  deleteMany(ids: string[]): void {
    for (const id of ids) this.pets.delete(id);
  }

  clear(): void {
    this.pets.clear();
  }
}

export class InMemoryAppointmentRepo implements IAppointmentRepository {
  private appointments = new Map<string, Appointment>();

  async findById(appointmentId: AppointmentId): Promise<Appointment | null> {
    return this.appointments.get(appointmentId) ?? null;
  }

  async findByAccount(customerId: string): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.customerId === customerId,
    );
  }

  async findConfirmedByStore(storeCode: string): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.storeCode === storeCode && a.status === AppointmentStatus.Confirmed,
    );
  }

  async findAllByStore(storeCode: string): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.storeCode === storeCode && a.status !== AppointmentStatus.Cancelled,
    );
  }

  async findConfirmedByPet(petId: PetId): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.petId === petId && a.status === AppointmentStatus.Confirmed,
    );
  }

  async findDueForReminder(from: Date, to: Date): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) =>
        a.timeSlot.startAt >= from &&
        a.timeSlot.startAt <= to &&
        a.status === AppointmentStatus.Confirmed,
    );
  }

  async findDueForFollowUp(_today: Date): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.followUpDate !== null,
    );
  }

  async isSlotBooked(timeSlotId: string): Promise<boolean> {
    return [...this.appointments.values()].some(
      (a) =>
        a.timeSlot.timeSlotId === timeSlotId &&
        a.status !== AppointmentStatus.Cancelled,
    );
  }

  async save(appointment: Appointment): Promise<void> {
    this.appointments.set(appointment.id, appointment);
  }

  async setNotificationStatus(
    appointmentIds: AppointmentId[],
    status: 'pending' | 'notified',
  ): Promise<void> {
    for (const id of appointmentIds) {
      const appt = this.appointments.get(id);
      if (appt) appt.notificationStatus = status;
    }
  }

  async setReminderSent(appointmentId: AppointmentId): Promise<void> {
    const appt = this.appointments.get(appointmentId);
    if (appt) appt.reminderSent = true;
  }

  seed(appointment: Appointment): void {
    this.appointments.set(appointment.id, appointment);
  }

  deleteMany(ids: string[]): void {
    for (const id of ids) this.appointments.delete(id);
  }

  clear(): void {
    this.appointments.clear();
  }
}

export class InMemorySlotHoldRepo implements ISlotHoldRepository {
  private holds = new Map<string, SlotHold>();

  async findActiveHold(timeSlotId: string): Promise<SlotHold | null> {
    for (const hold of this.holds.values()) {
      if (hold.timeSlotId === timeSlotId && !hold.isExpired()) return hold;
    }
    return null;
  }

  async findById(holdId: string): Promise<SlotHold | null> {
    return this.holds.get(holdId) ?? null;
  }

  async insert(hold: SlotHold): Promise<void> {
    this.holds.set(hold.holdId, hold);
  }

  async delete(holdId: string): Promise<void> {
    this.holds.delete(holdId);
  }

  clear(): void {
    this.holds.clear();
  }
}
