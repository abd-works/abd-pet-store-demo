import type { IEmailProvider } from './email.provider';
import type { INotificationRepository } from './notification.repository';
import type { NotificationPreferencesService } from './notification-preferences.service';
import type { TransactionalCategory } from '../shared/TransactionalCategory';
import type { MarketingEmailMessage } from '../shared/MarketingEmailMessage';
import { ReturnReceivedNotification } from '../shared/ReturnReceivedNotification';
import { RefundCompletedNotification } from '../shared/RefundCompletedNotification';
import { RefundUnderReviewNotification } from '../shared/RefundUnderReviewNotification';

interface OrderForNotification {
  orderNumber: string;
  customerEmail?: string;
  guestEmail?: string;
  customerAccountId?: string;
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

interface TransactionalEmailMessage {
  to: string;
  subject: string;
  html: string;
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

export type MarketingSendResult = 'sent' | 'queued' | 'skipped';

/** Application service — dispatches return/refund lifecycle notifications. */
export class NotificationService {
  constructor(
    private readonly _emailProvider: IEmailProvider,
    private readonly _notificationRepo: INotificationRepository,
    private readonly _notificationPrefs?: NotificationPreferencesService,
  ) {}

  /** Optional transactional send with mandatory bypass and preference gating. */
  async sendTransactional(
    accountId: string | null,
    recipientEmail: string,
    message: TransactionalEmailMessage,
    options: { category: TransactionalCategory; mandatory: boolean },
  ): Promise<boolean> {
    if (!options.mandatory && accountId && this._notificationPrefs) {
      const enabled = await this._notificationPrefs.isEnabled(accountId, options.category);
      if (!enabled) return false;
    }

    await this._emailProvider.send({
      to: recipientEmail,
      subject: message.subject,
      html: message.html,
    });
    return true;
  }

  async sendMarketingEmail(message: MarketingEmailMessage): Promise<MarketingSendResult> {
    try {
      await this._emailProvider.send({
        to: message.to,
        subject: message.subject,
        html: message.html,
      });
      await this._notificationRepo.markSent(message.referenceId, message.type, message.to);
      return 'sent';
    } catch {
      await this._notificationRepo.enqueue({
        referenceId: message.referenceId,
        type: message.type,
        attempts: 0,
      });
      return 'queued';
    }
  }

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
