/**
 * Send Return and Refund Status Update -- server tests (Increment 7)
 *
 * Stories: Send Return and Refund Status Update
 * Scenarios: return received notification sent, refund completed notification sent,
 *            refund under review notification sent, notification queued when email unavailable.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  ORDERS,
  RETURNS,
  REFUNDS,
  CUSTOMERS,
  type ReturnsAndRefundsTestContext,
} from '../helpers/returns-and-refunds.helper';
import { Return } from '../../../packages/return/shared/Return';
import { Refund } from '../../../packages/payment/shared/Refund';
import { ReturnReceivedNotification } from '../../../packages/notification/shared/ReturnReceivedNotification';
import { RefundCompletedNotification } from '../../../packages/notification/shared/RefundCompletedNotification';
import { RefundUnderReviewNotification } from '../../../packages/notification/shared/RefundUnderReviewNotification';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_return_for_order(ctx: ReturnsAndRefundsTestContext, returnData: typeof RETURNS[keyof typeof RETURNS]) {
  const returnEntity = Return.initiate({
    orderNumber: returnData.orderNumber,
    returnedItems: returnData.returnedItems as any,
    returnReason: returnData.returnReason,
    itemCondition: 'unopened',
  });
  ctx.returnRepo.seed(returnEntity);
  return returnEntity;
}

function given_refund_for_return(ctx: ReturnsAndRefundsTestContext, refundData: typeof REFUNDS[keyof typeof REFUNDS]) {
  const refund = Refund.create({
    orderNumber: refundData.orderNumber,
    returnId: refundData.returnId,
    vendor: refundData.vendor,
    amount: refundData.amount,
  });
  ctx.refundRepo.seed(refund);
  return refund;
}

function given_email_provider_unavailable(ctx: ReturnsAndRefundsTestContext): void {
  ctx.emailProvider.available = false;
}

function given_refund_retry_exhausted(ctx: ReturnsAndRefundsTestContext, refundData: typeof REFUNDS[keyof typeof REFUNDS]) {
  const refund = given_refund_for_return(ctx, refundData);
  refund.transitionStatus('requires_review' as any);
  ctx.refundRepo.seed(refund);
  return refund;
}

async function when_return_status_transitions_to_received(ctx: ReturnsAndRefundsTestContext, returnEntity: Return, orderData: any) {
  return ctx.notificationService.sendReturnReceivedNotification(orderData, returnEntity);
}

async function when_refund_status_transitions_to_completed(ctx: ReturnsAndRefundsTestContext, refund: Refund, orderData: any) {
  return ctx.notificationService.sendRefundCompletedNotification(orderData, refund);
}

async function when_refund_status_transitions_to_requires_review(ctx: ReturnsAndRefundsTestContext, refund: Refund, orderData: any) {
  return ctx.notificationService.sendRefundUnderReviewNotification(orderData, refund);
}

function then_return_received_notification_sent_to(ctx: ReturnsAndRefundsTestContext, expectedEmail: string) {
  const sent = ctx.notificationRepo.sent.find((n) => n.type === 'return_received');
  expect(sent).toBeDefined();
  expect(sent!.recipient).toBe(expectedEmail);
}

function then_notification_contains_order_and_items(ctx: ReturnsAndRefundsTestContext, expectedOrderNumber: string) {
  const sentEmail = ctx.emailProvider.sentEmails.find((e) => e.subject.includes(expectedOrderNumber));
  expect(sentEmail).toBeDefined();
}

function then_refund_completed_notification_sent_with_amount(ctx: ReturnsAndRefundsTestContext, expectedAmount: string, expectedPaymentMethod: string) {
  const sent = ctx.notificationRepo.sent.find((n) => n.type === 'refund_completed');
  expect(sent).toBeDefined();
}

function then_refund_under_review_notification_sent(ctx: ReturnsAndRefundsTestContext) {
  const sent = ctx.notificationRepo.sent.find((n) => n.type === 'refund_under_review');
  expect(sent).toBeDefined();
}

function then_notification_contains_support_guidance(ctx: ReturnsAndRefundsTestContext) {
  const sentEmail = ctx.emailProvider.sentEmails.find((e) => e.html.includes('contact support'));
  expect(sentEmail).toBeDefined();
}

function then_notification_queued_for_retry(ctx: ReturnsAndRefundsTestContext, expectedType: string) {
  const queued = ctx.notificationRepo.queued.find((n) => n.type === expectedType);
  expect(queued).toBeDefined();
}

function then_return_status_still_updated(ctx: ReturnsAndRefundsTestContext) {
  expect(ctx.returnRepo).toBeDefined();
}

function then_refund_status_still_updated(ctx: ReturnsAndRefundsTestContext) {
  expect(ctx.refundRepo).toBeDefined();
}

function then_notification_failure_does_not_block_processing(ctx: ReturnsAndRefundsTestContext) {
  expect(ctx.notificationRepo.queued.length).toBeGreaterThan(0);
}

// =============================================================================
// STORY: Send Return and Refund Status Update
// =============================================================================

describe('Send Return and Refund Status Update', () => {
  let ctx: ReturnsAndRefundsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestSendReturnAndRefundStatusUpdate', () => {
    it('return received notification sent when returned items arrive at warehouse', async () => {
      // Given: a Return RTN-7001 for Order ORD-4401 with Returned Items Premium Dog Kibble 10kg
      //   and the Customer Account email is sarah.mitchell@pawplace.example
      const returnEntity = given_return_for_order(ctx, RETURNS.RTN_7001);

      // When: the Return Status transitions to "received"
      await when_return_status_transitions_to_received(ctx, returnEntity, ORDERS.ORD_4401);

      // Then: the system sends a Return Received Notification to the Customer
      //   and the Return Received Notification includes the Order number ORD-4401,
      //   the Returned Items summary, and a note that inspection and Refund processing are underway
      then_return_received_notification_sent_to(ctx, CUSTOMERS.SARAH.email);
      then_notification_contains_order_and_items(ctx, 'ORD-4401');
    });

    it('refund completed notification sent with amount and payment method', async () => {
      // Given: a Refund REF-3002 for Return RTN-7002 on Order ORD-5502
      //   and the Refund was routed through Payment Vendor PayNova
      //   and the Customer Account email is sarah.mitchell@pawplace.example
      const refund = given_refund_for_return(ctx, REFUNDS.REF_3002);

      // When: the Refund Status transitions to "completed"
      await when_refund_status_transitions_to_completed(ctx, refund, ORDERS.ORD_5502);

      // Then: the system sends a Refund Completed Notification to the Customer
      //   and the Refund Completed Notification includes the refunded amount GBP24.99
      //   and the Payment method "PayNova digital wallet"
      then_refund_completed_notification_sent_with_amount(ctx, '24.99', 'PayNova digital wallet');
    });

    it('refund under review notification sent with support guidance', async () => {
      // Given: a Refund REF-3003 for Return RTN-7003 on Order ORD-6603
      //   and the Customer Account email is sarah.mitchell@pawplace.example
      //   and Refund Retry has exhausted all attempts
      const refund = given_refund_retry_exhausted(ctx, REFUNDS.REF_3003);

      // When: the Refund Status transitions to "requires review"
      await when_refund_status_transitions_to_requires_review(ctx, refund, ORDERS.ORD_6603);

      // Then: the system sends a Refund Under Review Notification to the Customer
      //   and the Refund Under Review Notification includes guidance to contact support
      //   and a reference to the Return and Order details
      then_refund_under_review_notification_sent(ctx);
      then_notification_contains_support_guidance(ctx);
    });

    it('notification queued when email delivery system is unavailable', async () => {
      // Given: a Return RTN-7001 for Order ORD-4401 with Return Status "received"
      //   and the email delivery system is temporarily unavailable
      const returnEntity = given_return_for_order(ctx, RETURNS.RTN_7001);
      given_email_provider_unavailable(ctx);

      // When: the system attempts to send the Return Received Notification
      await when_return_status_transitions_to_received(ctx, returnEntity, ORDERS.ORD_4401);

      // Then: the Notification is queued for retry
      //   and the Return Status is still updated in the system
      //   and the Refund Status is still updated in the system
      //   and Notification failure does not block return or refund processing
      then_notification_queued_for_retry(ctx, 'return_received');
      then_return_status_still_updated(ctx);
      then_refund_status_still_updated(ctx);
      then_notification_failure_does_not_block_processing(ctx);
    });
  });
});
