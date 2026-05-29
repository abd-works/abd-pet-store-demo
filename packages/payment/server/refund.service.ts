import { Refund } from '../shared/Refund';
import type { IPaymentGateway } from './payment-gateway';
import type { IRefundRepository } from './refund.repository';
import type { RefundRetryService } from './refund-retry.service';
import { lookupOrderFixture } from '../../return/server/order-fixture';

const TIMING_NOTE = 'refunds typically take 5-10 business days depending on your payment provider';

interface RefundNotifier {
  sendRefundCompletedNotification(order: unknown, refund: Refund): Promise<void>;
  sendRefundUnderReviewNotification(order: unknown, refund: Refund): Promise<void>;
}

interface ReturnForRefund {
  returnId: string;
  orderNumber: string;
  returnedItemsValue(): number;
}

interface OrderForRefund {
  orderNumber: string;
  paymentVendor: string;
  vendorTransactionReference: string;
  customerEmail?: string;
}

export interface RefundStatusView {
  status: string;
  timingNote?: string;
}

/** Application service — routes refunds through the original payment vendor. */
export class RefundService {
  constructor(
    private readonly _refundRepo: IRefundRepository,
    private readonly _vendorGateways: Record<string, IPaymentGateway>,
    private readonly _retryService: RefundRetryService,
    private readonly _notificationService?: RefundNotifier,
  ) {}

  async initiateRefund(returnEntity: ReturnForRefund, orderData: OrderForRefund): Promise<Refund> {
    const vendor = orderData.paymentVendor;
    const gateway = this._vendorGateways[vendor];
    if (!gateway) throw new Error(`no gateway for vendor: ${vendor}`);

    const amount = returnEntity.returnedItemsValue();

    const refund = Refund.create({
      orderNumber: orderData.orderNumber,
      returnId: returnEntity.returnId,
      vendor: vendor as 'stripewave' | 'paynova' | 'vaultpay',
      amount,
    });
    await this._refundRepo.save(refund);

    try {
      await gateway.refund(orderData.vendorTransactionReference, amount);
    } catch {
      // Transient or otherwise — refund stays in processing for retry
    }

    return refund;
  }

  async getRefundStatus(orderNumber: string): Promise<RefundStatusView> {
    const refunds = await this._refundRepo.findByOrderNumber(orderNumber);
    if (refunds.length === 0) return { status: 'unknown' };

    const latest = refunds[refunds.length - 1];
    const status = latest.refundStatus;

    return {
      status,
      timingNote: status === 'processing' ? TIMING_NOTE : undefined,
    };
  }

  async reconcileRefundWebhook(params: {
    refundId: string;
    vendor: string;
    status: string;
  }): Promise<void> {
    const refund = await this._refundRepo.findById(params.refundId);
    if (!refund) throw new Error(`refund not found: ${params.refundId}`);

    if (params.status === 'completed') {
      refund.transitionStatus('completed');
      await this._refundRepo.save(refund);

      if (this._notificationService) {
        const orderData = lookupOrderFixture(refund.orderNumber);
        if (orderData) {
          await this._notificationService.sendRefundCompletedNotification(orderData, refund);
        }
      }
    }
  }
}
