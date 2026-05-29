import type { StoreResponse } from './store.api';

/** Prototype fallback when API is unavailable — mirrors app-server/dev-seed.ts */
export const MOCK_STORES: StoreResponse[] = [
  {
    storeName: 'PawPlace Camden',
    storeCode: 'STR-001',
    addressLineOne: '42 High Street',
    addressLineTwo: '',
    city: 'London',
    countyOrRegion: '',
    postcode: 'NW1 8QP',
    country: 'UK',
    latitude: 51.5392,
    longitude: -0.1426,
    phoneNumber: '020-7946-0001',
    emailAddress: 'camden@pawplace.co.uk',
    activeStatus: true,
  },
  {
    storeName: 'PawPlace Bristol',
    storeCode: 'STR-002',
    addressLineOne: '15 Harbour Road',
    addressLineTwo: '',
    city: 'Bristol',
    countyOrRegion: '',
    postcode: 'BS1 4DJ',
    country: 'UK',
    latitude: 51.4545,
    longitude: -2.5879,
    phoneNumber: '0117-496-0002',
    emailAddress: 'bristol@pawplace.co.uk',
    activeStatus: true,
  },
  {
    storeName: 'PawPlace Manchester',
    storeCode: 'STR-003',
    addressLineOne: '8 Deansgate',
    addressLineTwo: '',
    city: 'Manchester',
    countyOrRegion: '',
    postcode: 'M3 2FF',
    country: 'UK',
    latitude: 53.4808,
    longitude: -2.2426,
    phoneNumber: '0161-496-0003',
    emailAddress: 'manchester@pawplace.co.uk',
    activeStatus: true,
  },
];

export const MOCK_OPERATING_HOURS = 'Mon–Sat 9:00–18:00, Sun 10:00–16:00';

export const POSTCODE_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'M1 1AA': { latitude: 53.4794, longitude: -2.2453 },
  'M3 2FF': { latitude: 53.4808, longitude: -2.2426 },
  'NW1 8QP': { latitude: 51.5392, longitude: -0.1426 },
  'BS1 4DJ': { latitude: 51.4545, longitude: -2.5879 },
};

export function geocodePostcode(postcode: string): { latitude: number; longitude: number } | null {
  return POSTCODE_COORDS[postcode.toUpperCase().trim()] ?? null;
}
