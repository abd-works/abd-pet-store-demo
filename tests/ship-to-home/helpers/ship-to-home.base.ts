/**
 * Ship to home — base helper (Increment 3)
 *
 * Standard test data from increment-3-specification-by-example.md
 */
import {
  ClickAndCollectBase,
  type BillingAddressTestData,
  type GuestCheckoutTestData,
} from '../../click-and-collect/helpers/click-and-collect.base';

export type { BillingAddressTestData, GuestCheckoutTestData };

export interface ShippingAddressTestData {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countyOrRegion?: string;
  postcode: string;
  country: string;
}

export abstract class ShipToHomeBase extends ClickAndCollectBase {
  static readonly VALID_SHIPPING_EDINBURGH: ShippingAddressTestData = {
    recipientName: 'Sarah Jones',
    addressLine1: '28 Oak Lane',
    city: 'Edinburgh',
    countyOrRegion: 'Midlothian',
    postcode: 'EH1 3DG',
    country: 'United Kingdom',
  };

  static readonly VALID_SHIPPING_FROM_BILLING: ShippingAddressTestData = {
    recipientName: 'Sarah Jones',
    addressLine1: '10 Elm Avenue',
    addressLine2: 'Flat 3',
    city: 'London',
    countyOrRegion: 'Greater London',
    postcode: 'SW1A 2AA',
    country: 'United Kingdom',
  };

  static readonly TRACKING_ROYAL_MAIL = {
    carrierName: 'Royal Mail',
    trackingNumber: 'RM-1Z999AA10123456784',
  };

  static readonly TRACKING_LATE = {
    carrierName: 'Royal Mail',
    trackingNumber: 'RM-2Z888BB20234567895',
  };

  static readonly WRONG_GUEST_EMAIL = 'wrong@example.com';

  abstract seed(): Promise<void>;
  abstract cleanup(): Promise<void>;
}
