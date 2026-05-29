import type { StoreData } from './store.schema';
import { storeFromValidatedData } from './storeFactory';

export class Store {
  readonly storeName: string;
  readonly storeCode: string;
  readonly addressLineOne: string;
  readonly addressLineTwo: string;
  readonly city: string;
  readonly countyOrRegion: string;
  readonly postcode: string;
  readonly country: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly phoneNumber: string;
  readonly emailAddress: string;
  readonly activeStatus: boolean;

  constructor(storeName: string, storeCode: string, data: Partial<StoreData> = {}) {
    if (!storeName) throw new Error('storeName is required');
    if (!storeCode) throw new Error('storeCode is required');

    this.storeName = storeName;
    this.storeCode = storeCode;
    this.addressLineOne = data.addressLineOne ?? '';
    this.addressLineTwo = data.addressLineTwo ?? '';
    this.city = data.city ?? '';
    this.countyOrRegion = data.countyOrRegion ?? '';
    this.postcode = data.postcode ?? '';
    this.country = data.country ?? '';
    this.latitude = data.latitude ?? 0;
    this.longitude = data.longitude ?? 0;
    this.phoneNumber = data.phoneNumber ?? '';
    this.emailAddress = data.emailAddress ?? '';
    this.activeStatus = data.activeStatus ?? true;
  }

  static fromData(data: StoreData): Store {
    return storeFromValidatedData(data);
  }

  toData(): StoreData {
    return {
      storeName: this.storeName,
      storeCode: this.storeCode,
      addressLineOne: this.addressLineOne,
      addressLineTwo: this.addressLineTwo,
      city: this.city,
      countyOrRegion: this.countyOrRegion,
      postcode: this.postcode,
      country: this.country,
      latitude: this.latitude,
      longitude: this.longitude,
      phoneNumber: this.phoneNumber,
      emailAddress: this.emailAddress,
      activeStatus: this.activeStatus,
    };
  }
}
