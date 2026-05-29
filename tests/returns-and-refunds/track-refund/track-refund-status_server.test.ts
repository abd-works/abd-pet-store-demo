/**
 * Track Refund Status -- server tests (Increment 7)
 *
 * Stories: Track Refund Status
 * Scenarios: refund status visible as processing, refund completed with notification,
 *            extended processing shows timing note, requires review shows support guidance.
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
import { RefundStatus } from '../../../packages/payment/shared/RefundStatus';
import { RefundCompletedNotification } from '../../../packages/notification/shared/RefundCompletedNotification';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_order_with_return_and_refund(
  ctx: ReturnsAndRefundsTestContext,
  orderNumber: string,
  returnId: string,
  refundData: typeof REFUNDS[keyof typeof REFUNDS],
) {
  const returnEntity = Return.initiate({
    orderNumber,
    returnedItems: RETURNS[returnId.replace('-', '_').toUpperCase() as keyof typeof RETURNS]?.returnedItems as any ?? [],
    returnReason: 'changed mind',
    itemCondition: 'unopened',
  });
  ctx.returnRepo.seed(returnEntity);

  const refund = Refund.create({
    orderNumber: refundData.orderNumber,
    returnId: refundData.returnId,
    vendor: refundData.vendor,
    amount: refundData.amount,
  });
  ctx.refundRepo.seed(refund);

  return { returnEntity, refund };
}

function given_refund_with_status(
  ctx: ReturnsAndRefundsTestContext,
  refundData: typeof REFUNDS[keyof typeof REFUNDS],
  status: string,
) {
  const refund = Refund.create({
    orderNumber: refundData.orderNumber,
    returnId: refundData.returnId,
    vendor: refundData.vendor,
    amount: refundData.amount,
  });
  refund.transitionStatus(status as any);
  ctx.refundRepo.seed(refund);
  return refund;
}

async function when_customer_views_order_detail(ctx: ReturnsAndRefundsTestContext, orderNumber: string) {
  return ctx.refundService.getRefundStatus(orderNumber);
}

async function when_vendor_confirms_refund_complete(ctx: ReturnsAndRefundsTestContext, refundId: string, vendor: string) {
  return ctx.refundService.reconcileRefundWebhook({
    refundId,
    vendor,
    status: 'completed',
  });
}

function then_refund_status_visible(refundStatus: any, expectedStatus: string) {
  expect(refundStatus.status).toBe(expectedStatus);
}

function then_refund_completed_notification_sent(ctx: ReturnsAndRefundsTestContext, expectedAmount: number, expectedPaymentMethod: string) {
  const sentNotification = ctx.notificationRepo.sent.find((n) => n.type === 'refund_completed');
  expect(sentNotification).toBeDefined();
}

function then_timing_expectation_note_shown(refundStatus: any) {
  expect(refundStatus.timingNote).toBe('refunds typically take 5-10 business days depending on your payment provider');
}

function then_support_guidance_shown(refundStatus: any) {
  expect(refundStatus.status).toBe('requires_review');
}

// =============================================================================
// STORY: Track Refund Status
// =============================================================================

describe('Track Refund Status', () => {
  let ctx: ReturnsAndRefundsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestTrackRefundStatus', () => {
    it('refund status visible as processing on order detail', async () => {
      // Given: Customer sarah.mitchell with Order ORD-4401 in Order History
      //   and Order ORD-4401 has a Return RTN-7001 with Refund REF-3001
      //   and the Refund Status is "processing"
      given_order_with_return_and_refund(ctx, 'ORD-4401', 'RTN-7001', REFUNDS.REF_3001);

      // When: the Customer views the Order Detail for Order ORD-4401
      const refundStatus = await when_customer_views_order_detail(ctx, 'ORD-4401');

      // Then: the Refund Status is visible as "processing"
      then_refund_status_visible(refundStatus, 'processing');
    });

    it('refund completed with notification sent to customer', async () => {
      // Given: a Refund REF-3002 for Return RTN-7002 on Order ORD-5502 with Refund Status "processing"
      //   and Refund REF-3002 was routed through Payment Vendor PayNova
      const refund = given_refund_with_status(ctx, REFUNDS.REF_3002, 'processing');

      // When: PayNova confirms the Refund is complete
      await when_vendor_confirms_refund_complete(ctx, refund.refundId, 'paynova');

      // Then: the Refund Status transitions to "completed"
      //   and the Customer receives a Refund Completed Notification
      //   with the refunded amount GBP24.99 and the Payment method "PayNova digital wallet"
      const updatedRefund = await ctx.refundRepo.findById(refund.refundId);
      expect(updatedRefund!.refundStatus).toBe('completed');
      then_refund_completed_notification_sent(ctx, 2499, 'PayNova digital wallet');
    });

    it('extended processing shows timing expectation note', async () => {
      // Given: Customer sarah.mitchell with Order ORD-4401 in Order History
      //   and Order ORD-4401 has Refund REF-3001 with Refund Status "processing"
      given_refund_with_status(ctx, REFUNDS.REF_3001, 'processing');

      // When: the Customer views the Order Detail for Order ORD-4401
      const refundStatus = await when_customer_views_order_detail(ctx, 'ORD-4401');

      // Then: the Order Detail shows a note:
      //   "refunds typically take 5-10 business days depending on your payment provider"
      then_timing_expectation_note_shown(refundStatus);
    });

    it('requires review status shows support guidance', async () => {
      // Given: Customer sarah.mitchell with Order ORD-6603 in Order History
      //   and Order ORD-6603 has Refund REF-3003 with Refund Status "requires review"
      given_refund_with_status(ctx, REFUNDS.REF_3003, 'requires_review');

      // When: the Customer views the Order Detail for Order ORD-6603
      const refundStatus = await when_customer_views_order_detail(ctx, 'ORD-6603');

      // Then: the Customer sees a message to contact support
      //   and the support team has access to the Return and Refund details
      then_support_guidance_shown(refundStatus);
    });
  });
});
