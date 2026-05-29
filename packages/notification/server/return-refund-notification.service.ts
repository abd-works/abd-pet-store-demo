import { ReturnReceivedNotification } from '../shared/ReturnReceivedNotification';
import { RefundCompletedNotification } from '../shared/RefundCompletedNotification';
import { RefundUnderReviewNotification } from '../shared/RefundUnderReviewNotification';

export interface EmailSender {
  send(params: { to: string; subject: string; html: string }): Promise<void>;
}

export interface NotificationQueue {
  enqueue(job: { referenceId: string; type: string; attempts: number }): Promise<void>;
  markSent(referenceId: string, type: string): Promise<void>;
}

interface OrderForNotification {
  orderNumber: string;
  guestEmail?: string;
  customerAccountEmail?: string;
}

interface ReturnForNotification {
  returnId: string;
  returnedItems: Array<{ name: string; quantity: number }>;
}

interface RefundForNotification {
  refundId: string;
  amount: number;
  formattedAmount: string;
  vendor: string;
}

function resolveRecipient(order: OrderForNotification): string {
  return order.customerAccountEmail ?? order.guestEmail ?? '';
}

function maskedPaymentMethodLabel(vendor: string, maskedPaymentMethod?: string): string {
  if (maskedPaymentMethod) return maskedPaymentMethod;
  switch (vendor) {
    case 'stripewave': return 'StripeWave card';
    case 'paynova': return 'PayNova digital wallet';
    case 'vaultpay': return 'VaultPay buy-now-pay-later';
    default: return vendor;
  }
}

export class NotificationDeliveryError extends Error {
  constructor(readonly referenceId: string, readonly notificationType: string, cause?: unknown) {
    super(`notification delivery failed: ${notificationType} for ${referenceId}`);
    this.name = 'NotificationDeliveryError';
    if (cause instanceof Error) this.cause = cause;
  }
}

/** Application service — return/refund notification lifecycle. */
export class ReturnRefundNotificationService {
  constructor(
    private readonly _emailSender: EmailSender,
    private readonly _queue: NotificationQueue,
  ) {}

  async sendReturnReceivedNotification(
    order: OrderForNotification,
    returnEntity: ReturnForNotification,
  ): Promise<void> {
    const notification = new ReturnReceivedNotification({
      recipientEmail: resolveRecipient(order),
      orderNumber: order.orderNumber,
      returnedItems: returnEntity.returnedItems,
    });
    await this._sendOrQueue(notification, returnEntity.returnId, 'return_received');
  }

  async sendRefundCompletedNotification(
    order: OrderForNotification & { maskedPaymentMethod?: string },
    refund: RefundForNotification,
  ): Promise<void> {
    const notification = new RefundCompletedNotification({
      recipientEmail: resolveRecipient(order),
      refundedAmount: refund.amount,
      paymentMethod: maskedPaymentMethodLabel(refund.vendor, order.maskedPaymentMethod),
    });
    await this._sendOrQueue(notification, refund.refundId, 'refund_completed');
  }

  async sendRefundUnderReviewNotification(
    order: OrderForNotification,
    refund: RefundForNotification & { returnId?: string },
  ): Promise<void> {
    const notification = new RefundUnderReviewNotification({
      recipientEmail: resolveRecipient(order),
      orderNumber: order.orderNumber,
      returnReference: refund.returnId ?? refund.refundId,
    });
    await this._sendOrQueue(notification, refund.refundId, 'refund_under_review');
  }

  private async _sendOrQueue(
    notification: { to: string; subject: string; renderHtml(): string },
    referenceId: string,
    notificationType: string,
  ): Promise<void> {
    try {
      await this._emailSender.send({
        to: notification.to,
        subject: notification.subject,
        html: notification.renderHtml(),
      });
      await this._queue.markSent(referenceId, notificationType);
    } catch (error: unknown) {
      await this._queue.enqueue({ referenceId, type: notificationType, attempts: 0 });
      throw new NotificationDeliveryError(referenceId, notificationType, error);
    }
  }
}
