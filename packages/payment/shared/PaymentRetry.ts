import type { PaymentVendor } from './payment-vendor.schema';
import { HardDecline } from './HardDecline';
import { RetryWindow } from './RetryWindow';
import { TransientError } from './TransientError';

export type PaymentRetryStatusLabel = 'idle' | 'retrying' | 'exhausted' | 'succeeded';

/** << Entity >> — automatic re-attempt policy for transient vendor failures. */
export class PaymentRetry {
  readonly orderNumber: string;
  readonly processingVendor: PaymentVendor;
  attemptCount: number;
  retryStatus: PaymentRetryStatusLabel;
  backgroundContinuationFlag: boolean;
  readonly startedAtMs: number;
  declineReason?: string;

  constructor(orderNumber: string, processingVendor: PaymentVendor, startedAtMs: number = Date.now()) {
    this.orderNumber = orderNumber;
    this.processingVendor = processingVendor;
    this.attemptCount = 0;
    this.retryStatus = 'idle';
    this.backgroundContinuationFlag = false;
    this.startedAtMs = startedAtMs;
  }

  static forPayment(payment: { associatedOrderNumber: string; processingVendorCode: PaymentVendor }): PaymentRetry {
    return new PaymentRetry(payment.associatedOrderNumber, payment.processingVendorCode);
  }

  recordTransientFailure(transientError: TransientError, retryWindow: RetryWindow): PaymentRetry {
    if (!transientError.triggersAutomaticPaymentRetry()) {
      throw new Error('transient error classification required for automatic retry');
    }
    this.attemptCount += 1;
    this.declineReason = transientError.failureType;
    const exhausted = retryWindow.isExhausted(this.attemptCount, this.startedAtMs);
    this.retryStatus = exhausted ? 'exhausted' : 'retrying';
    this.backgroundContinuationFlag = this.retryStatus === 'retrying';
    return this;
  }

  recordHardDecline(hardDecline: HardDecline): PaymentRetry {
    if (!hardDecline.mustNotTriggerAutomaticRetry()) {
      throw new Error('hard decline must not schedule automatic retry');
    }
    this.retryStatus = 'idle';
    this.backgroundContinuationFlag = false;
    this.declineReason = hardDecline.declineReason;
    return this;
  }

  markSucceeded(): void {
    this.retryStatus = 'succeeded';
    this.backgroundContinuationFlag = false;
  }

  reAttemptThroughSameVendor(): PaymentVendor {
    return this.processingVendor;
  }

  runWithinRetryWindow(retryWindow: RetryWindow): boolean {
    return !retryWindow.isExhausted(this.attemptCount, this.startedAtMs);
  }
}
