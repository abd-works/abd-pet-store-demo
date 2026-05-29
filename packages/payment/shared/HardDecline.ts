import type { PaymentVendor } from './payment-vendor.schema';

/** << ValueObject >> — non-retryable vendor decline (insufficient funds, blocked wallet, BNPL ineligible). */
export class HardDecline {
  readonly declineReason: string;
  readonly originatingVendor: PaymentVendor;
  readonly retryable: boolean = false;

  constructor(declineReason: string, originatingVendor: PaymentVendor) {
    this.declineReason = declineReason;
    this.originatingVendor = originatingVendor;
  }

  mustNotTriggerAutomaticRetry(): boolean {
    return !this.retryable;
  }
}
