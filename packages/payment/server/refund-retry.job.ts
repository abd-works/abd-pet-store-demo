import type { Refund } from '../shared/Refund';
import type { RefundRetryService } from './refund-retry.service';
import type { IRefundRepository } from './refund.repository';
import type { IRefundRetryRepository, RefundRetryEntry } from './refund-retry.repository';
import type { IPaymentGateway } from './payment-gateway';
import type { PaymentVendor } from '../shared/payment-vendor.schema';

interface RetryResult {
  success: boolean;
  transient?: boolean;
}

/** Scheduled background worker — processes pending refund retries. */
export class RefundRetryJob {
  constructor(
    private readonly _retryService: RefundRetryService,
    private readonly _retryRepository: IRefundRetryRepository,
    private readonly _refundRepository: IRefundRepository,
    private readonly _gateways: Record<PaymentVendor, IPaymentGateway>,
  ) {}

  async run(): Promise<void> {
    const pending = await this._retryRepository.findDueRetries();
    for (const entry of pending) {
      await this._processEntry(entry);
    }
  }

  private async _processEntry(entry: RefundRetryEntry): Promise<void> {
    const refund = await this._refundRepository.findById(entry.refundId);
    if (!refund) return;

    const gateway = this._gateways[refund.vendor];
    if (!gateway) return;

    const result = await this._attemptRefund(gateway, entry, refund);
    if (result.success) {
      await this._completeRetry(refund, entry);
      return;
    }
    if (result.transient) {
      await this._handleTransientFailure(refund, entry);
      return;
    }
    await this._escalateToReview(refund, entry);
  }

  private async _attemptRefund(gateway: IPaymentGateway, entry: RefundRetryEntry, refund: Refund): Promise<RetryResult> {
    try {
      const result = await gateway.refund(entry.paymentRef, refund.amount);
      return { success: !!(result as RetryResult)?.success, transient: false };
    } catch (error: unknown) {
      const isTransient = this._retryService.classifyRefundError(error) === 'transient';
      return { success: false, transient: isTransient };
    }
  }

  private async _completeRetry(refund: Refund, entry: RefundRetryEntry): Promise<void> {
    refund.transitionStatus('completed');
    await this._refundRepository.save(refund);
    this._retryService.clear(refund.refundId);
    await this._retryRepository.remove(entry.refundId);
  }

  private async _handleTransientFailure(refund: Refund, entry: RefundRetryEntry): Promise<void> {
    const retryState = this._retryService.scheduleRefundRetry(refund.refundId, refund.vendor);
    await this._retryRepository.recordAttempt(entry.refundId);
    if (retryState.exhausted) {
      await this._escalateToReview(refund, entry);
    }
  }

  private async _escalateToReview(refund: Refund, entry: RefundRetryEntry): Promise<void> {
    refund.transitionStatus('requires_review');
    await this._refundRepository.save(refund);
    await this._retryRepository.remove(entry.refundId);
  }
}
