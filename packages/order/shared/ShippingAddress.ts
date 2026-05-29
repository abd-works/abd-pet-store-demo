import { isShippingAddressComplete } from './shipping-address-validation';

/** << ValueObject >> — shipping address snapshotted on ship-to-home orders (Increment 3). */
export interface ShippingAddressFields {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countyOrRegion?: string;
  postcode: string;
  country: string;
}

export class IncompleteShippingAddressError extends Error {
  constructor() {
    super('Shipping address incomplete');
    this.name = 'IncompleteShippingAddressError';
  }
}

export class ShippingAddress {
  static snapshot(fields: ShippingAddressFields): ShippingAddressFields {
    if (!isShippingAddressComplete(fields)) {
      throw new IncompleteShippingAddressError();
    }
    return { ...fields };
  }

  static preFillFromBilling(billing: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    countyOrRegion: string;
    postcode: string;
    country: string;
  }): ShippingAddressFields {
    return {
      recipientName: billing.name,
      addressLine1: billing.addressLine1,
      addressLine2: billing.addressLine2,
      city: billing.city,
      countyOrRegion: billing.countyOrRegion,
      postcode: billing.postcode,
      country: billing.country,
    };
  }
}
