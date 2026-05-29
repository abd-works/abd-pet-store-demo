/**
 * Pet visits — base helper (Increment 6)
 *
 * Standard test data from increment-6-specification-by-example.md
 */

export interface StoreTestData {
  storeCode: string;
  storeName: string;
  addressLineOne: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export interface BreedTestData {
  breedName: string;
  species: string;
}

export interface PetTestData {
  petId: string;
  petName: string;
  breed: string;
  species: string;
  age: number;
  dateOfBirth: string;
  hostingStore: string;
  lifecycleState: string;
  temperamentNotes: string | null;
  photoUrls: string[];
}

export interface TimeSlotTestData {
  timeslotId: string;
  storeCode: string;
  startTime: string;
  endTime: string;
  bookingStatus: string;
}

export interface CustomerAccountTestData {
  customerAccountId: string;
  emailAddress: string;
  accountStatus: string;
  customerName: string;
}

export interface AppointmentTestData {
  appointmentId: string;
  customerAccountId: string;
  petId: string;
  petName: string;
  storeCode: string;
  storeName: string;
  timeslotId: string;
  appointmentStatus: string;
  visitNote: string | null;
  visitOutcome: string | null;
  staffVisitNotes: string | null;
  followUpAction: string | null;
  followUpDate: string | null;
  notificationStatus: string | null;
}

export abstract class PetVisitsBase {
  static readonly STORES: readonly StoreTestData[] = [
    {
      storeCode: 'STR-001',
      storeName: 'PawPlace Bristol',
      addressLineOne: '15 Queen Street',
      city: 'Bristol',
      postcode: 'BS1 4QT',
      latitude: 51.4545,
      longitude: -2.5879,
    },
    {
      storeCode: 'STR-002',
      storeName: 'PawPlace London',
      addressLineOne: '10 Shoreditch High Street',
      city: 'London',
      postcode: 'E1 6AN',
      latitude: 51.5231,
      longitude: -0.0768,
    },
  ] as const;

  static readonly BREEDS: readonly BreedTestData[] = [
    { breedName: 'Golden Retriever', species: 'dog' },
    { breedName: 'Maine Coon', species: 'cat' },
    { breedName: 'Ball Python', species: 'reptile' },
    { breedName: 'Holland Lop', species: 'small_mammal' },
  ] as const;

  static readonly PETS: readonly PetTestData[] = [
    {
      petId: 'PET-001',
      petName: 'Buddy',
      breed: 'Golden Retriever',
      species: 'dog',
      age: 2,
      dateOfBirth: '2023-03-15',
      hostingStore: 'STR-001',
      lifecycleState: 'available',
      temperamentNotes: 'Friendly with children, high energy, loves fetch',
      photoUrls: ['pet001_front.jpg', 'pet001_playing.jpg'],
    },
    {
      petId: 'PET-002',
      petName: 'Whiskers',
      breed: 'Maine Coon',
      species: 'cat',
      age: 3,
      dateOfBirth: '2022-09-20',
      hostingStore: 'STR-001',
      lifecycleState: 'available',
      temperamentNotes: null,
      photoUrls: ['pet002_front.jpg'],
    },
    {
      petId: 'PET-003',
      petName: 'Slinky',
      breed: 'Ball Python',
      species: 'reptile',
      age: 1,
      dateOfBirth: '2024-05-01',
      hostingStore: 'STR-002',
      lifecycleState: 'available',
      temperamentNotes: null,
      photoUrls: ['pet003_front.jpg'],
    },
    {
      petId: 'PET-004',
      petName: 'Biscuit',
      breed: 'Holland Lop',
      species: 'small_mammal',
      age: 1,
      dateOfBirth: '2024-08-12',
      hostingStore: 'STR-002',
      lifecycleState: 'available',
      temperamentNotes: null,
      photoUrls: ['pet004_front.jpg'],
    },
    {
      petId: 'PET-005',
      petName: 'Rex',
      breed: 'Golden Retriever',
      species: 'dog',
      age: 3,
      dateOfBirth: '2022-06-10',
      hostingStore: 'STR-002',
      lifecycleState: 'adopted',
      temperamentNotes: null,
      photoUrls: ['pet005_front.jpg'],
    },
  ] as const;

  static readonly TIME_SLOTS: readonly TimeSlotTestData[] = [
    { timeslotId: 'TS-001', storeCode: 'STR-001', startTime: '2025-06-10T10:00:00', endTime: '2025-06-10T10:30:00', bookingStatus: 'available' },
    { timeslotId: 'TS-002', storeCode: 'STR-001', startTime: '2025-06-10T11:00:00', endTime: '2025-06-10T11:30:00', bookingStatus: 'available' },
    { timeslotId: 'TS-003', storeCode: 'STR-001', startTime: '2025-06-10T14:00:00', endTime: '2025-06-10T14:30:00', bookingStatus: 'booked' },
    { timeslotId: 'TS-004', storeCode: 'STR-001', startTime: '2025-06-11T10:00:00', endTime: '2025-06-11T10:30:00', bookingStatus: 'available' },
  ] as const;

  static readonly CUSTOMERS: readonly CustomerAccountTestData[] = [
    { customerAccountId: 'CUST-001', emailAddress: 'jane@example.com', accountStatus: 'Verified', customerName: 'Jane Smith' },
    { customerAccountId: 'CUST-002', emailAddress: 'bob@example.com', accountStatus: 'Verified', customerName: 'Bob Jones' },
    { customerAccountId: 'CUST-003', emailAddress: 'new@example.com', accountStatus: 'Verified', customerName: 'New User' },
  ] as const;

  static readonly APPOINTMENTS: readonly AppointmentTestData[] = [
    {
      appointmentId: 'APT-001',
      customerAccountId: 'CUST-001',
      petId: 'PET-001',
      petName: 'Buddy',
      storeCode: 'STR-001',
      storeName: 'PawPlace Bristol',
      timeslotId: 'TS-001',
      appointmentStatus: 'confirmed',
      visitNote: 'Bringing kids',
      visitOutcome: null,
      staffVisitNotes: null,
      followUpAction: null,
      followUpDate: null,
      notificationStatus: null,
    },
    {
      appointmentId: 'APT-002',
      customerAccountId: 'CUST-001',
      petId: 'PET-002',
      petName: 'Whiskers',
      storeCode: 'STR-001',
      storeName: 'PawPlace Bristol',
      timeslotId: 'TS-004',
      appointmentStatus: 'completed',
      visitNote: null,
      visitOutcome: 'browsing_only',
      staffVisitNotes: null,
      followUpAction: null,
      followUpDate: null,
      notificationStatus: null,
    },
    {
      appointmentId: 'APT-003',
      customerAccountId: 'CUST-001',
      petId: 'PET-005',
      petName: 'Rex',
      storeCode: 'STR-002',
      storeName: 'PawPlace London',
      timeslotId: 'TS-010',
      appointmentStatus: 'confirmed',
      visitNote: 'Want to meet the dog',
      visitOutcome: null,
      staffVisitNotes: null,
      followUpAction: null,
      followUpDate: null,
      notificationStatus: 'notified',
    },
  ] as const;

  abstract seed(): Promise<void>;
  abstract cleanup(): Promise<void>;
}
