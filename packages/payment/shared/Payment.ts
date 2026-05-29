import type { PaymentVendor } from './payment-vendor.schema';
import type { HardDecline } from './HardDecline';
import type { PaymentMethodSelector } from './PaymentMethodSelector';
import type { PaymentRetry } from './PaymentRetry';
import { RetryWindow } from './RetryWindow';
import type { TransientError } from './TransientError';
import type { VendorTransactionReference } from './VendorTransactionReference';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'settled'
  | 'failed';

/** << Entity >> — financial transaction for an order (Increment 5: multi-vendor). */
export class Payment {
  readonly paymentReference: string;
  readonly associatedOrderNumber: string;
  readonly paymentAmount: number;
  readonly currency: string;
  paymentStatus: PaymentStatus;
  paymentDate: Date | null = null;
  maskedPaymentMethod: string | null = null;
  readonly processingVendorCode: PaymentVendor;
  vendorTransactionReference: VendorTransactionReference | null = null;

  constructor(
    paymentReference: string,
    associatedOrderNumber: string,
    paymentAmount: number,
    processingVendorCode: PaymentVendor = 'stripewave',
    currency = 'GBP',
  ) {
    if (paymentAmount <= 0) throw new Error('payment amount must be positive');
    this.paymentReference = paymentReference;
    this.associatedOrderNumber = associatedOrderNumber;
    this.paymentAmount = paymentAmount;
    this.currency = currency;
    this.processingVendorCode = processingVendorCode;
    this.paymentStatus = 'pending';
  }

  static processThroughSelectedVendor(params: {
    paymentReference: string;
    orderNumber: string;
    paymentAmount: number;
    vendor: PaymentVendor;
    selector: PaymentMethodSelector;
  }): Payment {
    selector.routeChargeToSelectedVendor(params.vendor);
    return new Payment(
      params.paymentReference,
      params.orderNumber,
      params.paymentAmount,
      params.vendor,
    );
  }

  authorize(maskedPaymentMethod: string): void {
    if (this.paymentStatus !== 'pending' && this.paymentStatus !== 'failed') {
      throw new Error('payment cannot be authorized from current status');
    }
    this.paymentStatus = 'authorized';
    this.maskedPaymentMethod = maskedPaymentMethod;
    this.paymentDate = new Date();
  }

  capture(): void {
    if (this.paymentStatus !== 'authorized') {
      throw new Error('payment must be authorized before capture');
    }
    this.paymentStatus = 'captured';
  }

  settle(): void {
    if (this.paymentStatus !== 'captured') {
      throw new Error('payment must be captured before settle');
    }
    this.paymentStatus = 'settled';
  }

  /** Authorize, capture, and settle in one step — matches StripeWave adapter in Increment 2. */
  authorizeCaptureSettle(maskedPaymentMethod: string): void {
    this.authorize(maskedPaymentMethod);
    this.capture();
    this.settle();
  }

  markFailed(): void {
    this.paymentStatus = 'failed';
  }

  reconcileViaWebhookCallback(confirmed: boolean, maskedPaymentMethod?: string): void {
    if (confirmed && this.paymentStatus === 'pending') {
      this.authorizeCaptureSettle(maskedPaymentMethod ?? 'StripeWave •••• webhook');
    }
  }

  /** @deprecated use reconcileViaWebhookCallback */
  handleWebhookCallback(confirmed: boolean, maskedPaymentMethod?: string): void {
    this.reconcileViaWebhookCallback(confirmed, maskedPaymentMethod);
  }

  recordVendorTransactionReference(reference: VendorTransactionReference): void {
    this.vendorTransactionReference = reference;
  }

  initiatePaymentRetryOnTransientError(
    transientError: TransientError,
    paymentRetry: PaymentRetry,
  ): PaymentRetry {
    if (transientError.originatingVendor !== this.processingVendorCode) {
      throw new Error('transient error vendor must match payment processing vendor');
    }
    return paymentRetry.recordTransientFailure(transientError, RetryWindow.default());
  }

  surfaceHardDeclineImmediately(hardDecline: HardDecline): void {
    if (hardDecline.originatingVendor !== this.processingVendorCode) {
      throw new Error('hard decline vendor must match payment processing vendor');
    }
    this.markFailed();
  }

  get isConfirmed(): boolean {
    return this.paymentStatus === 'settled' || this.paymentStatus === 'captured';
  }
}

export function generatePaymentReference(orderNumber: string): string {
  return `PAY-${orderNumber}`;
}
