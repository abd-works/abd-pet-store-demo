import type { PaymentVendor } from './payment-vendor.schema';

/** << ValueObject >> — vendor-assigned identifier for webhook reconciliation and refund routing. */
export class VendorTransactionReference {
  readonly vendorAssignedIdentifier: string;
  readonly originatingPaymentVendor: PaymentVendor;

  constructor(vendorAssignedIdentifier: string, originatingPaymentVendor: PaymentVendor) {
    if (!vendorAssignedIdentifier.trim()) {
      throw new Error('vendor assigned identifier must be non-empty');
    }
    this.vendorAssignedIdentifier = vendorAssignedIdentifier;
    this.originatingPaymentVendor = originatingPaymentVendor;
  }
}
