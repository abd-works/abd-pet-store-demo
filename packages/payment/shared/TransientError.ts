import type { PaymentVendor } from './payment-vendor.schema';

/** << ValueObject >> — retryable vendor timeout, HTTP 5xx, or network interruption. */
export class TransientError {
  readonly failureType: string;
  readonly originatingVendor: PaymentVendor;
  readonly retryable: boolean = true;

  constructor(failureType: string, originatingVendor: PaymentVendor) {
    this.failureType = failureType;
    this.originatingVendor = originatingVendor;
  }

  triggersAutomaticPaymentRetry(): boolean {
    return this.retryable;
  }
}
