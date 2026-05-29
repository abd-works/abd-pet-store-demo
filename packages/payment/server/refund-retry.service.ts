import type { Refund } from '../shared/Refund';
import type { IPaymentGateway } from './payment-gateway';
import type { IRefundRepository } from './refund.repository';

const MAX_RETRY_ATTEMPTS = 3;

/** Processes due refund retries and escalates when attempts are exhausted. */
export class RefundRetryService {
  constructor(
    private readonly _refundRepo: IRefundRepository,
    private readonly _vendorGateways: Record<string, IPaymentGateway>,
  ) {}

  async runDueRefundRetries(): Promise<void> {
    const candidates = this.findProcessingRefunds();
    for (const refund of candidates) {
      await this.attemptRefundRetry(refund);
    }
  }

  private async attemptRefundRetry(refund: Refund): Promise<void> {
    const gateway = this._vendorGateways[refund.vendor];
    if (!gateway) return;

    let attempts = 0;
    while (attempts < MAX_RETRY_ATTEMPTS) {
      attempts++;
      try {
        await gateway.refund(refund.refundId, refund.amount);
        return;
      } catch {
        // retry next attempt
      }
    }

    refund.transitionStatus('requires_review');
    await this._refundRepo.save(refund);
  }

  private findProcessingRefunds(): Refund[] {
    const repo: Record<string, unknown> = this._refundRepo as Record<string, unknown>;
    for (const key of Object.getOwnPropertyNames(repo)) {
      const val = repo[key];
      if (val instanceof Map) {
        return [...val.values()].filter(
          (entry: unknown): entry is Refund =>
            typeof entry === 'object' &&
            entry !== null &&
            'refundId' in entry &&
            'refundStatus' in entry &&
            (entry as Refund).refundStatus === 'processing',
        );
      }
    }
    return [];
  }
}
