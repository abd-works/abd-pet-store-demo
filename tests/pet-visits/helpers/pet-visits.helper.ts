/**
 * Pet Visits — shared test helper (Increment 6)
 *
 * Provides factory methods and assertion helpers for pet-visit acceptance tests.
 * Domain types used directly; repositories stubbed via in-memory implementations.
 */
import { Pet, type PetSnapshot } from '../../../packages/pet/shared/Pet';
import { toPetId, type PetId } from '../../../packages/pet/shared/PetId';
import { PetStatusValues, type PetStatus } from '../../../packages/pet/shared/PetStatus';
import { type Species, SpeciesValues } from '../../../packages/pet/shared/Species';
import { toTemperamentNotes, type TemperamentNotes } from '../../../packages/pet/shared/TemperamentNotes';
import { Appointment, type AppointmentSnapshot } from '../../../packages/appointment/shared/Appointment';
import { toAppointmentId, type AppointmentId } from '../../../packages/appointment/shared/AppointmentId';
import { AppointmentStatus, type AppointmentStatusValue } from '../../../packages/appointment/shared/AppointmentStatus';
import { TimeSlot, type TimeSlotData } from '../../../packages/appointment/shared/TimeSlot';
import { SlotHold } from '../../../packages/appointment/shared/SlotHold';
import { toVisitNote, type VisitNote } from '../../../packages/appointment/shared/VisitNote';
import { toStaffVisitNotes, type StaffVisitNotes } from '../../../packages/appointment/shared/StaffVisitNotes';
import { type VisitOutcome, VisitOutcomeValues } from '../../../packages/appointment/shared/VisitOutcome';
import { type FollowUpAction, FollowUpActionValues } from '../../../packages/appointment/shared/FollowUpAction';
import { FollowUpDate } from '../../../packages/appointment/shared/FollowUpDate';
import { CheckInRecord } from '../../../packages/appointment/shared/CheckInRecord';
import { NoShowRecord } from '../../../packages/appointment/shared/NoShowRecord';
import { PetService, type CustomerLocation, type StoreLocatorService, type AppointmentNotificationService as PetNotifSvc } from '../../../packages/pet/server/pet.service';
import { AppointmentService, type AppointmentNotificationService, type PetServiceRef, type TimeSlotAvailabilityDto } from '../../../packages/appointment/server/appointment.service';
import type { IPetRepository } from '../../../packages/pet/server/pet.repository';
import type { IAppointmentRepository, ISlotHoldRepository } from '../../../packages/appointment/server/appointment.repository';

// =============================================================================
// STANDARD TEST DATA
// =============================================================================

export const STORES = {
  STR_001: { code: 'STR-001', name: 'PawPlace Bristol', city: 'Bristol', postcode: 'BS1 4QT', address: '15 Queen Street', lat: 51.4545, lng: -2.5879 },
  STR_002: { code: 'STR-002', name: 'PawPlace London', city: 'London', postcode: 'E1 6AN', address: '10 Commercial Rd', lat: 51.5150, lng: -0.0700 },
} as const;

export const PETS: Record<string, PetSnapshot> = {
  PET_001: { id: 'PET-001', name: 'Buddy', species: SpeciesValues.Dog, breed: 'Golden Retriever', age: 2, temperamentNotes: 'Friendly with children, high energy, loves fetch', photoUrls: ['pet001_front.jpg', 'pet001_playing.jpg'], status: PetStatusValues.Available, storeCode: STORES.STR_001.code },
  PET_002: { id: 'PET-002', name: 'Whiskers', species: SpeciesValues.Cat, breed: 'Maine Coon', age: 3, temperamentNotes: null, photoUrls: ['pet002_front.jpg'], status: PetStatusValues.Available, storeCode: STORES.STR_001.code },
  PET_003: { id: 'PET-003', name: 'Slinky', species: SpeciesValues.Reptile, breed: 'Ball Python', age: 1, temperamentNotes: null, photoUrls: ['pet003_front.jpg'], status: PetStatusValues.Available, storeCode: STORES.STR_002.code },
  PET_004: { id: 'PET-004', name: 'Flopsy', species: SpeciesValues.SmallMammal, breed: 'Holland Lop', age: 1, temperamentNotes: null, photoUrls: ['pet004_front.jpg'], status: PetStatusValues.Available, storeCode: STORES.STR_002.code },
  PET_005: { id: 'PET-005', name: 'Rex', species: SpeciesValues.Dog, breed: 'Golden Retriever', age: 4, temperamentNotes: null, photoUrls: ['pet005_front.jpg'], status: PetStatusValues.Adopted, storeCode: STORES.STR_002.code },
};

export const CUSTOMERS = {
  CUST_001: { id: 'CUST-001', email: 'jane@example.com', name: 'Jane Smith' },
  CUST_002: { id: 'CUST-002', email: 'bob@example.com', name: 'Bob Brown' },
  CUST_003: { id: 'CUST-003', email: 'alice@example.com', name: 'Alice Green' },
} as const;

export const TIME_SLOTS: TimeSlotData[] = [
  { timeSlotId: 'TS-001', storeCode: STORES.STR_001.code, startAt: new Date('2025-06-10T10:00:00'), endAt: new Date('2025-06-10T10:30:00') },
  { timeSlotId: 'TS-002', storeCode: STORES.STR_001.code, startAt: new Date('2025-06-10T11:00:00'), endAt: new Date('2025-06-10T11:30:00') },
  { timeSlotId: 'TS-003', storeCode: STORES.STR_001.code, startAt: new Date('2025-06-10T14:00:00'), endAt: new Date('2025-06-10T14:30:00') },
  { timeSlotId: 'TS-004', storeCode: STORES.STR_001.code, startAt: new Date('2025-06-11T10:00:00'), endAt: new Date('2025-06-11T10:30:00') },
];

// =============================================================================
// IN-MEMORY REPOSITORIES
// =============================================================================

export class InMemoryPetRepository implements IPetRepository {
  private pets: Map<string, Pet> = new Map();

  async findAll(species?: Species): Promise<Pet[]> {
    const all = [...this.pets.values()];
    if (species) return all.filter((p) => p.species === species);
    return all;
  }

  async findById(petId: PetId): Promise<Pet | null> {
    return this.pets.get(petId) ?? null;
  }

  async save(pet: Pet): Promise<void> {
    this.pets.set(pet.id, pet);
  }

  seed(snapshots: PetSnapshot[]): void {
    for (const snap of snapshots) {
      this.pets.set(snap.id, Pet.fromSnapshot(snap));
    }
  }

  clear(): void { this.pets.clear(); }
}

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Map<string, Appointment> = new Map();

  async findById(appointmentId: AppointmentId): Promise<Appointment | null> {
    return this.appointments.get(appointmentId) ?? null;
  }

  async findByAccount(customerId: string): Promise<Appointment[]> {
    return [...this.appointments.values()].filter((a) => a.customerId === customerId);
  }

  async findConfirmedByStore(storeCode: string): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.storeCode === storeCode && a.status === AppointmentStatus.Confirmed,
    );
  }

  async findConfirmedByPet(petId: PetId): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.petId === petId && a.status === AppointmentStatus.Confirmed,
    );
  }

  async findDueForReminder(from: Date, to: Date): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.timeSlot.startAt >= from && a.timeSlot.startAt <= to && a.status === AppointmentStatus.Confirmed,
    );
  }

  async findDueForFollowUp(today: Date): Promise<Appointment[]> {
    return [...this.appointments.values()].filter(
      (a) => a.followUpDate && a.followUpDate.isToday(),
    );
  }

  async isSlotBooked(timeSlotId: string): Promise<boolean> {
    return [...this.appointments.values()].some(
      (a) => a.timeSlot.timeSlotId === timeSlotId && a.status !== AppointmentStatus.Cancelled,
    );
  }

  async save(appointment: Appointment): Promise<void> {
    this.appointments.set(appointment.id, appointment);
  }

  async setNotificationStatus(appointmentIds: AppointmentId[], status: 'pending' | 'notified'): Promise<void> {
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

  clear(): void { this.appointments.clear(); }
}

export class InMemorySlotHoldRepository implements ISlotHoldRepository {
  private holds: Map<string, SlotHold> = new Map();

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

  seed(hold: SlotHold): void { this.holds.set(hold.holdId, hold); }
  clear(): void { this.holds.clear(); }
}

// =============================================================================
// STUB SERVICES
// =============================================================================

export class StubStoreLocatorService implements StoreLocatorService {
  private distances: Map<string, number> = new Map();

  setDistance(storeCode: string, km: number): void {
    this.distances.set(storeCode, km);
  }

  async distanceFromCustomer(storeCode: string, _location: CustomerLocation): Promise<number> {
    return this.distances.get(storeCode) ?? 0;
  }
}

export class StubNotificationService implements AppointmentNotificationService, PetNotifSvc {
  readonly sentConfirmations: Appointment[] = [];
  readonly adoptionNotifications: PetId[] = [];
  shouldFail = false;

  async sendConfirmationEmail(appointment: Appointment): Promise<void> {
    if (this.shouldFail) throw new Error('Email delivery failed');
    this.sentConfirmations.push(appointment);
  }

  async notifyPendingAppointmentsOfAdoption(petId: PetId): Promise<void> {
    this.adoptionNotifications.push(petId);
  }

  clear(): void {
    this.sentConfirmations.length = 0;
    this.adoptionNotifications.length = 0;
    this.shouldFail = false;
  }
}

// =============================================================================
// FACTORY HELPERS
// =============================================================================

export function createPet(overrides: Partial<PetSnapshot> = {}): Pet {
  const snapshot: PetSnapshot = { ...PETS.PET_001, ...overrides };
  return Pet.fromSnapshot(snapshot);
}

export function createTimeSlot(data: Partial<TimeSlotData> & { timeSlotId: string; storeCode: string }): TimeSlot {
  return new TimeSlot({
    startAt: new Date('2025-06-10T10:00:00'),
    endAt: new Date('2025-06-10T10:30:00'),
    ...data,
  });
}

export function createAppointment(overrides: Partial<{
  id: string;
  petId: string;
  storeCode: string;
  customerId: string;
  timeSlotId: string;
  timeSlotStart: Date;
  timeSlotEnd: Date;
  visitNote: string | null;
  status: AppointmentStatusValue;
  followUpAction: FollowUpAction | null;
  followUpDate: Date | null;
  notificationStatus: 'pending' | 'notified' | null;
}> = {}): Appointment {
  const id = overrides.id ?? 'APT-001';
  const storeCode = overrides.storeCode ?? STORES.STR_001.code;
  const start = overrides.timeSlotStart ?? new Date('2025-06-10T10:00:00');
  const end = overrides.timeSlotEnd ?? new Date('2025-06-10T10:30:00');
  const timeSlotId = overrides.timeSlotId ?? 'TS-001';

  return new Appointment({
    id: toAppointmentId(id),
    petId: toPetId(overrides.petId ?? 'PET-001'),
    storeCode,
    customerId: overrides.customerId ?? CUSTOMERS.CUST_001.id,
    timeSlot: new TimeSlot({ timeSlotId, storeCode, startAt: start, endAt: end }),
    visitNote: overrides.visitNote ? toVisitNote(overrides.visitNote) : null,
    status: overrides.status ?? AppointmentStatus.Confirmed,
    followUpAction: overrides.followUpAction ?? null,
    followUpDate: overrides.followUpDate ? new FollowUpDate(overrides.followUpDate) : null,
    notificationStatus: overrides.notificationStatus ?? null,
  });
}

export function resolveStoreName(storeCode: string): string {
  if (storeCode === STORES.STR_001.code) return STORES.STR_001.name;
  if (storeCode === STORES.STR_002.code) return STORES.STR_002.name;
  return `Unknown Store (${storeCode})`;
}

// =============================================================================
// SERVICE FACTORY
// =============================================================================

export interface PetVisitsTestContext {
  petRepo: InMemoryPetRepository;
  appointmentRepo: InMemoryAppointmentRepository;
  holdRepo: InMemorySlotHoldRepository;
  storeLocator: StubStoreLocatorService;
  notifications: StubNotificationService;
  petService: PetService;
  appointmentService: AppointmentService;
}

export function createTestContext(): PetVisitsTestContext {
  const petRepo = new InMemoryPetRepository();
  const appointmentRepo = new InMemoryAppointmentRepository();
  const holdRepo = new InMemorySlotHoldRepository();
  const storeLocator = new StubStoreLocatorService();
  const notifications = new StubNotificationService();

  const petService = new PetService(petRepo, storeLocator, notifications, resolveStoreName);
  const appointmentService = new AppointmentService(appointmentRepo, holdRepo, notifications, 10);

  return { petRepo, appointmentRepo, holdRepo, storeLocator, notifications, petService, appointmentService };
}
