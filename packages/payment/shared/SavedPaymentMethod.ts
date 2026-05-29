import type { PaymentVendor } from './payment-vendor.schema';

/** << Entity >> — vendor-token payment method on customer account (Increment 5: multi-vendor). */
export class SavedPaymentMethod {
  readonly id: string;
  readonly owningCustomerAccountId: string;
  readonly customerAssignedLabel: string;
  readonly vendorTokenReference: string;
  readonly processingVendorCode: PaymentVendor;
  readonly lastFourDigits: string;
  readonly cardBrand: string;
  readonly walletProvider: string;
  readonly expiryMonth: number;
  readonly expiryYear: number;
  readonly dateAdded: Date;
  defaultPaymentMethodFlag: boolean;
  markedExpired: boolean;

  constructor(params: {
    id: string;
    owningCustomerAccountId: string;
    vendorTokenReference: string;
    lastFourDigits: string;
    cardBrand: string;
    expiryMonth: number;
    expiryYear: number;
    customerAssignedLabel?: string;
    processingVendorCode?: PaymentVendor;
    walletProvider?: string;
    dateAdded?: Date;
    defaultPaymentMethodFlag?: boolean;
  }) {
    this.id = params.id;
    this.owningCustomerAccountId = params.owningCustomerAccountId;
    this.vendorTokenReference = params.vendorTokenReference;
    this.lastFourDigits = params.lastFourDigits;
    this.cardBrand = params.cardBrand;
    this.expiryMonth = params.expiryMonth;
    this.expiryYear = params.expiryYear;
    this.customerAssignedLabel = params.customerAssignedLabel ?? `${params.cardBrand} •••• ${params.lastFourDigits}`;
    this.processingVendorCode = params.processingVendorCode ?? 'stripewave';
    this.walletProvider = params.walletProvider ?? '';
    this.dateAdded = params.dateAdded ?? new Date();
    this.defaultPaymentMethodFlag = params.defaultPaymentMethodFlag ?? false;
    this.markedExpired = false;
  }

  isExpired(now: Date = new Date()): boolean {
    const expiry = new Date(paramsYearMonthToDate(this.expiryYear, this.expiryMonth));
    return expiry < now || this.markedExpired;
  }

  markExpired(): void {
    this.markedExpired = true;
  }

  isSelectableAtCheckout(): boolean {
    return !this.isExpired();
  }

  softDelete(): void {
    this.markedExpired = true;
  }
}

function paramsYearMonthToDate(year: number, month: number): Date {
  return new Date(year, month, 0);
}
