import type { IEmailProvider } from './email.provider';
import type { INotificationRepository } from './notification.repository';
import { ReturnReceivedNotification } from '../shared/ReturnReceivedNotification';
import { RefundCompletedNotification } from '../shared/RefundCompletedNotification';
import { RefundUnderReviewNotification } from '../shared/RefundUnderReviewNotification';

interface OrderForNotification {
  orderNumber: string;
  customerEmail?: string;
  guestEmail?: string;
}

interface ReturnForNotification {
  returnId: string;
  returnedItems: Array<{ sku: string; name: string; quantity: number }>;
}

interface RefundForNotification {
  refundId: string;
  returnId?: string;
  amount: number;
  vendor: string;
}

function resolveRecipient(order: OrderForNotification): string {
  return order.customerEmail ?? order.guestEmail ?? '';
}

function paymentMethodLabel(vendor: string): string {
  switch (vendor) {
    case 'stripewave': return 'StripeWave card';
    case 'paynova': return 'PayNova digital wallet';
    case 'vaultpay': return 'VaultPay buy-now-pay-later';
    default: return vendor;
  }
}

/** Application service — dispatches return/refund lifecycle notifications. */
export class NotificationService {
  constructor(
    private readonly _emailProvider: IEmailProvider,
    private readonly _notificationRepo: INotificationRepository,
  ) {}

  async sendReturnReceivedNotification(order: OrderForNotification, returnEntity: ReturnForNotification): Promise<void> {
    const recipient = resolveRecipient(order);
    const notification = new ReturnReceivedNotification({
      recipientEmail: recipient,
      orderNumber: order.orderNumber,
      returnedItems: returnEntity.returnedItems,
    });

    try {
      await this._emailProvider.send({
        to: notification.to,
        subject: notification.subject,
        html: notification.renderHtml(),
      });
      await this._notificationRepo.markSent(returnEntity.returnId, 'return_received', recipient);
    } catch {
      await this._notificationRepo.enqueue({
        referenceId: returnEntity.returnId,
        type: 'return_received',
        attempts: 0,
      });
    }
  }

  async sendRefundCompletedNotification(order: OrderForNotification, refund: RefundForNotification): Promise<void> {
    const recipient = resolveRecipient(order);
    const notification = new RefundCompletedNotification({
      recipientEmail: recipient,
      refundedAmount: refund.amount,
      paymentMethod: paymentMethodLabel(refund.vendor),
    });

    try {
      await this._emailProvider.send({
        to: notification.to,
        subject: notification.subject,
        html: notification.renderHtml(),
      });
      await this._notificationRepo.markSent(refund.refundId, 'refund_completed', recipient);
    } catch {
      await this._notificationRepo.enqueue({
        referenceId: refund.refundId,
        type: 'refund_completed',
        attempts: 0,
      });
    }
  }

  async sendRefundUnderReviewNotification(order: OrderForNotification, refund: RefundForNotification): Promise<void> {
    const recipient = resolveRecipient(order);
    const notification = new RefundUnderReviewNotification({
      recipientEmail: recipient,
      orderNumber: order.orderNumber,
      returnReference: refund.returnId ?? refund.refundId,
    });

    try {
      await this._emailProvider.send({
        to: notification.to,
        subject: notification.subject,
        html: notification.renderHtml(),
      });
      await this._notificationRepo.markSent(refund.refundId, 'refund_under_review', recipient);
    } catch {
      await this._notificationRepo.enqueue({
        referenceId: refund.refundId,
        type: 'refund_under_review',
        attempts: 0,
      });
    }
  }
}
