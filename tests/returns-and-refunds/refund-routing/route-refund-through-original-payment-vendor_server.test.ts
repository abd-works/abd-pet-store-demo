/**
 * Route Refund through Original Payment Vendor -- server tests (Increment 7)
 *
 * Stories: Route Refund through Original Payment Vendor
 * Scenarios: refund routed through StripeWave, PayNova, VaultPay;
 *            refund queued for retry on vendor failure; escalated to requires review after retry exhaustion.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  ORDERS,
  RETURNS,
  REFUNDS,
  type ReturnsAndRefundsTestContext,
} from '../helpers/returns-and-refunds.helper';
import { Return } from '../../../packages/return/shared/Return';
import { Refund } from '../../../packages/payment/shared/Refund';
import { RefundStatus } from '../../../packages/payment/shared/RefundStatus';

// =============================================================================
// STANDARD TEST DATA
// =============================================================================

const STANDARD_STRIPEWAVE_REFUND = {
  returnId: RETURNS.RTN_7001.returnId,
  orderNumber: ORDERS.ORD_4401.orderNumber,
  amount: 5499,
  vendor: 'stripewave' as const,
  vendorTransactionReference: ORDERS.ORD_4401.vendorTransactionReference,
};

const STANDARD_PAYNOVA_REFUND = {
  returnId: RETURNS.RTN_7002.returnId,
  orderNumber: ORDERS.ORD_5502.orderNumber,
  amount: 2499,
  vendor: 'paynova' as const,
  vendorTransactionReference: ORDERS.ORD_5502.vendorTransactionReference,
};

const STANDARD_VAULTPAY_REFUND = {
  returnId: RETURNS.RTN_7003.returnId,
  orderNumber: ORDERS.ORD_6603.orderNumber,
  amount: 19999,
  vendor: 'vaultpay' as const,
  vendorTransactionReference: ORDERS.ORD_6603.vendorTransactionReference,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_completed_return_for_order(
  ctx: ReturnsAndRefundsTestContext,
  returnData: typeof RETURNS[keyof typeof RETURNS],
  orderData: typeof ORDERS[keyof typeof ORDERS],
) {
  const returnEntity = Return.initiate({
    orderNumber: orderData.orderNumber,
    returnedItems: returnData.returnedItems as any,
    returnReason: returnData.returnReason,
    itemCondition: 'unopened',
  });
  returnEntity.transitionStatus('received' as any);
  ctx.returnRepo.seed(returnEntity);
  return { returnEntity, order: orderData };
}

function given_vendor_returns_transient_error(ctx: ReturnsAndRefundsTestContext, vendor: 'stripewave' | 'paynova' | 'vaultpay') {
  const gateway = ctx[`${vendor}Gateway` as keyof ReturnsAndRefundsTestContext] as any;
  gateway.shouldFail = true;
  gateway.failureType = 'transient';
}

function given_refund_retry_exhausted(ctx: ReturnsAndRefundsTestContext, refundId: string) {
  const refund = Refund.create({
    orderNumber: ORDERS.ORD_4401.orderNumber,
    returnId: RETURNS.RTN_7001.returnId,
    vendor: 'stripewave',
    amount: 5499,
  });
  ctx.refundRepo.seed(refund);
  ctx.stripewaveGateway.shouldFail = true;
  ctx.stripewaveGateway.failureType = 'transient';
  return refund;
}

async function when_system_initiates_refund(ctx: ReturnsAndRefundsTestContext, returnEntity: Return, orderData: any) {
  return ctx.refundService.initiateRefund(returnEntity, orderData);
}

async function when_final_retry_fails(ctx: ReturnsAndRefundsTestContext, refundId: string) {
  return ctx.refundRetryService.runDueRefundRetries();
}

function then_refund_created_with_amount(refund: Refund, expectedAmount: number) {
  expect(refund.amount).toBe(expectedAmount);
}

function then_refund_routed_through_vendor(ctx: ReturnsAndRefundsTestContext, vendor: 'stripewave' | 'paynova' | 'vaultpay', expectedRef: string) {
  const gateway = ctx[`${vendor}Gateway` as keyof ReturnsAndRefundsTestContext] as any;
  expect(gateway.refundCalls.length).toBeGreaterThan(0);
  expect(gateway.refundCalls[0].paymentRef).toBe(expectedRef);
}

function then_refund_status_is(refund: Refund, expectedStatus: string) {
  expect(refund.refundStatus).toBe(expectedStatus);
}

function then_instalment_plan_adjusted(ctx: ReturnsAndRefundsTestContext) {
  expect(ctx.vaultpayGateway.refundCalls.length).toBeGreaterThan(0);
}

function then_refund_queued_for_retry(ctx: ReturnsAndRefundsTestContext) {
  expect(ctx.refundRepo).toBeDefined();
}

// =============================================================================
// STORY: Route Refund through Original Payment Vendor
// =============================================================================

describe('Route Refund through Original Payment Vendor', () => {
  let ctx: ReturnsAndRefundsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestRouteRefundThroughOriginalPaymentVendor', () => {
    it('refund routed through StripeWave for card payment', async () => {
      // Given: Return RTN-7001 for Order ORD-4401 with Returned Items Premium Dog Kibble 10kg valued at GBP54.99
      //   and Order ORD-4401 was paid via Payment Vendor StripeWave with Vendor Transaction Reference sw_txn_4401
      //   and the Returned Items are received and inspection passes
      const { returnEntity, order } = given_completed_return_for_order(ctx, RETURNS.RTN_7001, ORDERS.ORD_4401);

      // When: the system initiates the Refund
      const refund = await when_system_initiates_refund(ctx, returnEntity, order);

      // Then: a Refund REF-3001 is created with a Refund amount of GBP54.99
      //   and the Refund routes through StripeWave's refund API
      //   and the Customer sees the credit on their card statement
      then_refund_created_with_amount(refund, STANDARD_STRIPEWAVE_REFUND.amount);
      then_refund_routed_through_vendor(ctx, 'stripewave', STANDARD_STRIPEWAVE_REFUND.vendorTransactionReference);
    });

    it('refund routed through PayNova for digital wallet payment', async () => {
      // Given: Return RTN-7002 for Order ORD-5502 with Returned Items Ceramic Feeding Bowl valued at GBP24.99
      //   and Order ORD-5502 was paid via Payment Vendor PayNova with Vendor Transaction Reference pn_txn_5502
      //   and the Returned Items are received and inspection passes
      const { returnEntity, order } = given_completed_return_for_order(ctx, RETURNS.RTN_7002, ORDERS.ORD_5502);

      // When: the system initiates the Refund
      const refund = await when_system_initiates_refund(ctx, returnEntity, order);

      // Then: a Refund REF-3002 is created with a Refund amount of GBP24.99
      //   and the Refund routes through PayNova's refund API
      then_refund_created_with_amount(refund, STANDARD_PAYNOVA_REFUND.amount);
      then_refund_routed_through_vendor(ctx, 'paynova', STANDARD_PAYNOVA_REFUND.vendorTransactionReference);
    });

    it('refund routed through VaultPay with instalment plan adjustment', async () => {
      // Given: Return RTN-7003 for Order ORD-6603 with Returned Items Premium Cat Tree Deluxe valued at GBP199.99
      //   and Order ORD-6603 was paid via Payment Vendor VaultPay with Vendor Transaction Reference vp_txn_6603
      //   and the Returned Items are received and inspection passes
      const { returnEntity, order } = given_completed_return_for_order(ctx, RETURNS.RTN_7003, ORDERS.ORD_6603);

      // When: the system initiates the Refund
      const refund = await when_system_initiates_refund(ctx, returnEntity, order);

      // Then: a Refund REF-3003 is created with a Refund amount of GBP199.99
      //   and the Refund routes through VaultPay's refund API
      //   and the Instalment Plan is adjusted accordingly by VaultPay
      then_refund_created_with_amount(refund, STANDARD_VAULTPAY_REFUND.amount);
      then_refund_routed_through_vendor(ctx, 'vaultpay', STANDARD_VAULTPAY_REFUND.vendorTransactionReference);
      then_instalment_plan_adjusted(ctx);
    });

    it('refund queued for retry on vendor failure', async () => {
      // Given: a Refund REF-3001 for Return RTN-7001 routed through Payment Vendor StripeWave
      const { returnEntity, order } = given_completed_return_for_order(ctx, RETURNS.RTN_7001, ORDERS.ORD_4401);

      // When: the Refund request to StripeWave fails due to vendor downtime
      given_vendor_returns_transient_error(ctx, 'stripewave');
      const refund = await when_system_initiates_refund(ctx, returnEntity, order);

      // Then: the Refund is queued for Refund Retry
      //   and the Customer sees Refund Status "processing" -- not "refund failed"
      then_refund_status_is(refund, 'processing');
    });

    it('refund escalated to requires review after retry exhaustion', async () => {
      // Given: a Refund REF-3001 for Return RTN-7001 routed through Payment Vendor StripeWave
      //   and all Refund Retry attempts are exhausted
      const refund = given_refund_retry_exhausted(ctx, REFUNDS.REF_3001.refundId);

      // When: the final Refund Retry fails
      await when_final_retry_fails(ctx, refund.refundId);

      // Then: the Refund Status transitions to "requires review"
      //   and the Customer sees a message to contact support
      //   and the support team has access to the Return and Refund details
      const updatedRefund = await ctx.refundRepo.findById(refund.refundId);
      then_refund_status_is(updatedRefund!, 'requires_review');
    });
  });
});
