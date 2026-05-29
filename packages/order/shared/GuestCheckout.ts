import { BillingAddress, type BillingAddressFields } from './BillingAddress';

/** << ValueObject >> — guest purchase path without customer account (Increment 2). */
export class GuestCheckout {
  readonly guestEmail: string;
  readonly guestName: string;
  readonly billingAddress: BillingAddress;

  constructor(guestEmail: string, guestName: string, billingAddress: BillingAddress) {
    if (!guestEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      throw new Error('guest email must be valid');
    }
    if (!guestName.trim()) throw new Error('guest name is required');
    this.guestEmail = guestEmail;
    this.guestName = guestName;
    this.billingAddress = billingAddress;
  }

  static fromInput(input: {
    guestEmail: string;
    guestName: string;
    billingAddress: BillingAddressFields;
  }): GuestCheckout {
    return new GuestCheckout(
      input.guestEmail,
      input.guestName,
      BillingAddress.snapshot(input.billingAddress),
    );
  }
}
