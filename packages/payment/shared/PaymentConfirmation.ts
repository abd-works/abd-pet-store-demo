import { VendorTransactionReference } from './VendorTransactionReference';
import type { Payment } from './Payment';

/** << ValueObject >> — vendor confirmation payload that confirms the associated order. */
export class PaymentConfirmation {
  readonly originatingPayment: Payment;
  readonly vendorConfirmationReference: VendorTransactionReference;
  readonly confirmationTimestamp: Date;

  constructor(originatingPayment: Payment, vendorConfirmationReference: VendorTransactionReference) {
    this.originatingPayment = originatingPayment;
    this.vendorConfirmationReference = vendorConfirmationReference;
    this.confirmationTimestamp = new Date();
  }

  static fromVendorReference(
    payment: Payment,
    vendorAssignedIdentifier: string,
  ): PaymentConfirmation {
    return new PaymentConfirmation(
      payment,
      new VendorTransactionReference(vendorAssignedIdentifier, payment.processingVendorCode),
    );
  }
}
