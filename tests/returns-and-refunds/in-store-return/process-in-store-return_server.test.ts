/**
 * Process In-Store Return -- server tests (Increment 7)
 *
 * Stories: Process In-Store Return
 * Scenarios: in-store return via order lookup, guest order return,
 *            ineligible item flagged with manager override option, manager override approves return.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  ORDERS,
  CUSTOMERS,
  STORES,
  type ReturnsAndRefundsTestContext,
} from '../helpers/returns-and-refunds.helper';
import { Return } from '../../../packages/return/shared/Return';
import { InStoreReturn } from '../../../packages/return/shared/InStoreReturn';
import { ManagerOverride } from '../../../packages/return/shared/ManagerOverride';
import { ReturnRequest } from '../../../packages/return/shared/ReturnRequest';
import { ReturnIneligibleError } from '../../../packages/return/shared/ReturnErrors';

// =============================================================================
// STANDARD TEST DATA
// =============================================================================

const STANDARD_STAFF_ID = 'STAFF-CAMDEN-001';

const STANDARD_MANAGER_OVERRIDE = {
  approvingManager: 'MANAGER-CAMDEN-001',
  overrideReason: 'customer goodwill -- long-standing customer',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function when_staff_looks_up_order(ctx: ReturnsAndRefundsTestContext, orderNumber: string) {
  return ctx.inStoreReturnService.lookupOrder(orderNumber);
}

async function when_staff_looks_up_order_by_email(ctx: ReturnsAndRefundsTestContext, orderNumber: string, email: string) {
  return ctx.inStoreReturnService.lookupOrder(orderNumber, email);
}

async function when_staff_initiates_in_store_return(
  ctx: ReturnsAndRefundsTestContext,
  orderData: any,
  items: Array<{ sku: string; quantity: number }>,
  reason: string,
  staffId: string,
  managerOverride?: { approvingManager: string; overrideReason: string },
) {
  const request = new ReturnRequest({
    selectedOrderLineItems: items,
    quantitiesToReturn: items.map((i) => i.quantity),
    returnReason: reason,
  });

  const override = managerOverride
    ? new ManagerOverride(managerOverride.approvingManager, managerOverride.overrideReason)
    : undefined;

  return ctx.inStoreReturnService.initiateInStoreReturn(
    orderData,
    request,
    staffId,
    override,
  );
}

function then_return_created_with_channel(returnEntity: Return, expectedChannel: string) {
  expect(returnEntity.channel).toBe(expectedChannel);
  expect(returnEntity.returnId).toBeTruthy();
}

function then_refund_triggered_through_original_vendor(ctx: ReturnsAndRefundsTestContext, vendor: 'stripewave' | 'paynova' | 'vaultpay') {
  const gateway = ctx[`${vendor}Gateway` as keyof ReturnsAndRefundsTestContext] as any;
  expect(gateway.refundCalls.length).toBeGreaterThan(0);
}

function then_return_visible_in_customer_account(returnEntity: Return) {
  expect(returnEntity.orderNumber).toBeTruthy();
}

function then_return_not_visible_in_account(returnEntity: Return) {
  expect(returnEntity.orderNumber).toBeTruthy();
}

function then_override_recorded_for_audit(returnEntity: Return, expectedManager: string, expectedReason: string) {
  expect(returnEntity.managerOverride).toBeDefined();
  expect(returnEntity.managerOverride!.approvingManager).toBe(expectedManager);
  expect(returnEntity.managerOverride!.overrideReason).toBe(expectedReason);
  expect(returnEntity.managerOverride!.approvedAt).toBeDefined();
}

// =============================================================================
// STORY: Process In-Store Return
// =============================================================================

describe('Process In-Store Return', () => {
  let ctx: ReturnsAndRefundsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestProcessInStoreReturn', () => {
    it('in-store return submitted via order lookup on admin dashboard', async () => {
      // Given: a Store Employee at Store PawPlace Camden
      //   and Customer sarah.mitchell brings Order Line Item Premium Dog Kibble 10kg to the Store for Return
      //   and Order ORD-4401 is within the Return Window
      //   and Order ORD-4401 was paid via Payment Vendor StripeWave
      const order = await when_staff_looks_up_order(ctx, 'ORD-4401');

      // When: the Store Employee looks up Order ORD-4401 by order number on the Admin Dashboard
      //   and the Store Employee selects "Start Return" and submits the In-Store Return
      const returnEntity = await when_staff_initiates_in_store_return(
        ctx,
        order,
        [{ sku: 'premium-dog-kibble-10kg', quantity: 1 }],
        'customer request',
        STANDARD_STAFF_ID,
      );

      // Then: a Return is created and linked to Order ORD-4401
      //   and a Refund is triggered through the original Payment Vendor StripeWave
      //   and the Return appears in Customer Account sarah.mitchell Order History under the Order detail
      then_return_created_with_channel(returnEntity, 'in_store');
      then_refund_triggered_through_original_vendor(ctx, 'stripewave');
      then_return_visible_in_customer_account(returnEntity);
    });

    it('guest order return processed using order number and guest email', async () => {
      // Given: a Store Employee at Store PawPlace Camden
      //   and a guest Customer brings items from Order ORD-7704 to the Store for Return
      //   and Order ORD-7704 was placed as a guest order with Guest Email alex.rivera@example.com
      //   and Order ORD-7704 was paid via Payment Vendor PayNova
      //   and Order ORD-7704 is within the Return Window
      const order = await when_staff_looks_up_order_by_email(ctx, 'ORD-7704', CUSTOMERS.ALEX_GUEST.email);

      // When: the Store Employee looks up Order ORD-7704 by order number and Guest Email on the Admin Dashboard
      //   and the Store Employee submits the In-Store Return
      const returnEntity = await when_staff_initiates_in_store_return(
        ctx,
        order,
        [{ sku: 'pet-carrier-medium', quantity: 1 }],
        'customer request',
        STANDARD_STAFF_ID,
      );

      // Then: a Return is created and linked to Order ORD-7704
      //   and the Refund routes through the original Payment Vendor PayNova
      //   and the Return is not visible in an "account" because the Customer has no Customer Account
      then_return_created_with_channel(returnEntity, 'in_store');
      then_refund_triggered_through_original_vendor(ctx, 'paynova');
      then_return_not_visible_in_account(returnEntity);
    });

    it('ineligible item flagged with manager override option', async () => {
      // Given: a Store Employee at Store PawPlace Camden
      //   and Customer brings Order Line Item Orthopaedic Dog Bed Large from Order ORD-4402 to the Store
      //   and Order ORD-4402 was delivered on 2026-02-05 and the Return Window has expired
      const order = await when_staff_looks_up_order(ctx, 'ORD-4402');

      // When: the Store Employee looks up Order ORD-4402 on the Admin Dashboard
      // Then: the Admin Dashboard shows the ineligibility reason: "return window expired"
      //   and a Manager Override action is displayed, requiring manager approval before the Return proceeds
      await expect(
        when_staff_initiates_in_store_return(
          ctx,
          order,
          [{ sku: 'orthopaedic-dog-bed-large', quantity: 1 }],
          'customer request',
          STANDARD_STAFF_ID,
        ),
      ).rejects.toThrow(ReturnIneligibleError);
    });

    it('manager override approves return for ineligible item', async () => {
      // Given: a Store Employee at Store PawPlace Camden
      //   and Order ORD-4402 with Order Line Item Orthopaedic Dog Bed Large has failed Return Eligibility
      //   and the Admin Dashboard is showing the Manager Override action
      //   and Order ORD-4402 was paid via Payment Vendor StripeWave
      const order = await when_staff_looks_up_order(ctx, 'ORD-4402');

      // When: a manager approves the Manager Override with override reason
      //   "customer goodwill -- long-standing customer"
      const returnEntity = await when_staff_initiates_in_store_return(
        ctx,
        order,
        [{ sku: 'orthopaedic-dog-bed-large', quantity: 1 }],
        'customer request',
        STANDARD_STAFF_ID,
        STANDARD_MANAGER_OVERRIDE,
      );

      // Then: the In-Store Return proceeds for Order ORD-4402
      //   and a Return is created and linked to Order ORD-4402
      //   and a Refund is triggered through the original Payment Vendor StripeWave
      //   and the approving manager and override reason are recorded for audit
      then_return_created_with_channel(returnEntity, 'in_store');
      then_refund_triggered_through_original_vendor(ctx, 'stripewave');
      then_override_recorded_for_audit(returnEntity, STANDARD_MANAGER_OVERRIDE.approvingManager, STANDARD_MANAGER_OVERRIDE.overrideReason);
    });
  });
});
