/** << ValueObject >> — billing address snapshotted on an order at checkout (not SavedAddress). */
import type { ShippingAddressFields } from './ShippingAddress';
import { ShippingAddress } from './ShippingAddress';

export interface BillingAddressFields {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countyOrRegion: string;
  postcode: string;
  country: string;
}

export class BillingAddress {
  readonly name: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly countyOrRegion: string;
  readonly postcode: string;
  readonly country: string;

  constructor(fields: BillingAddressFields) {
    if (!fields.name.trim()) throw new Error('billing address name is required');
    if (!fields.addressLine1.trim()) throw new Error('billing address line 1 is required');
    if (!fields.city.trim()) throw new Error('billing city is required');
    if (!fields.postcode.trim()) throw new Error('billing postcode is required');
    if (!fields.country.trim()) throw new Error('billing country is required');
    this.name = fields.name;
    this.addressLine1 = fields.addressLine1;
    this.addressLine2 = fields.addressLine2;
    this.city = fields.city;
    this.countyOrRegion = fields.countyOrRegion;
    this.postcode = fields.postcode;
    this.country = fields.country;
  }

  static snapshot(fields: BillingAddressFields): BillingAddress {
    return new BillingAddress(fields);
  }

  /** Pre-fill shipping address when customer selects same as billing (Increment 3). */
  static preFillShippingAddress(billing: BillingAddressFields): ShippingAddressFields {
    return ShippingAddress.preFillFromBilling(billing);
  }

  toJSON(): BillingAddressFields {
    return {
      name: this.name,
      addressLine1: this.addressLine1,
      addressLine2: this.addressLine2,
      city: this.city,
      countyOrRegion: this.countyOrRegion,
      postcode: this.postcode,
      country: this.country,
    };
  }
}
