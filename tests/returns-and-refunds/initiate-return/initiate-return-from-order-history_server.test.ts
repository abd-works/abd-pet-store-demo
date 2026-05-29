/**
 * Initiate Return from Order History -- server tests (Increment 7)
 *
 * Stories: Initiate Return from Order History
 * Scenarios: eligible items displayed, return request submitted and record created,
 *            return action hidden outside window, previously returned items shown with remaining returnable.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  ORDERS,
  RETURNS,
  CUSTOMERS,
  WITHIN_RETURN_WINDOW_DATE,
  type ReturnsAndRefundsTestContext,
} from '../helpers/returns-and-refunds.helper';
import { Return } from '../../../packages/return/shared/Return';
import { ReturnRequest } from '../../../packages/return/shared/ReturnRequest';
import { ReturnEligibility } from '../../../packages/return/shared/ReturnEligibility';
import { ReturnWindow } from '../../../packages/return/shared/ReturnWindow';
import { ReturnStatus } from '../../../packages/return/shared/ReturnStatus';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function given_delivered_order_within_return_window(ctx: ReturnsAndRefundsTestContext, orderNumber: string, currentDate: Date) {
  const order = ORDERS[orderNumber.replace('-', '_').toUpperCase() as keyof typeof ORDERS];
  const returnWindow = new ReturnWindow({ configuredPeriod: 30 });
  const eligibility = new ReturnEligibility(order as any, returnWindow);
  return { order, eligibility, currentDate };
}

function given_delivered_order_outside_return_window(ctx: ReturnsAndRefundsTestContext, orderNumber: string, currentDate: Date) {
  const order = ORDERS[orderNumber.replace('-', '_').toUpperCase() as keyof typeof ORDERS];
  const returnWindow = new ReturnWindow({ configuredPeriod: 30 });
  const eligibility = new ReturnEligibility(order as any, returnWindow);
  return { order, eligibility, currentDate };
}

function given_existing_return_on_order(ctx: ReturnsAndRefundsTestContext, orderNumber: string, returnedSku: string, returnStatus: string) {
  const existingReturn = Return.initiate({
    orderNumber,
    returnedItems: [{ sku: returnedSku, quantity: 1 }],
    returnReason: 'changed mind',
    itemCondition: 'unopened',
  });
  existingReturn.transitionStatus(returnStatus as any);
  ctx.returnRepo.seed(existingReturn);
  return existingReturn;
}

function when_customer_selects_return(ctx: ReturnsAndRefundsTestContext, orderNumber: string) {
  return ctx.returnService.checkEligibility(orderNumber);
}

async function when_customer_submits_return_request(
  ctx: ReturnsAndRefundsTestContext,
  orderNumber: string,
  items: Array<{ sku: string; quantity: number }>,
  returnReason: string,
) {
  const request = new ReturnRequest({
    selectedOrderLineItems: items,
    quantitiesToReturn: items.map((i) => i.quantity),
    returnReason,
  });
  return ctx.returnService.initiateReturn(orderNumber, request);
}

function then_eligible_items_displayed(eligibilityResult: any, expectedSkus: string[]) {
  expect(eligibilityResult.eligible).toBe(true);
  const eligibleSkus = eligibilityResult.eligibleItems.map((item: any) => item.sku);
  for (const sku of expectedSkus) {
    expect(eligibleSkus).toContain(sku);
  }
}

function then_return_action_hidden(eligibilityResult: any, expectedReason: string) {
  expect(eligibilityResult.eligible).toBe(false);
  expect(eligibilityResult.reason).toBe(expectedReason);
}

function then_return_created(returnEntity: Return, expectedOrderNumber: string, expectedStatus: string) {
  expect(returnEntity.orderNumber).toBe(expectedOrderNumber);
  expect(returnEntity.returnStatus).toBe(expectedStatus);
}

// =============================================================================
// STORY: Initiate Return from Order History
// =============================================================================

describe('Initiate Return from Order History', () => {
  let ctx: ReturnsAndRefundsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestInitiateReturnFromOrderHistory', () => {
    it('eligible items displayed when customer selects return on a delivered order', async () => {
      // Given: Customer sarah.mitchell with Order ORD-4401 delivered on 2026-04-14
      //   and current date is 2026-05-07 within the Return Window
      const { order } = given_delivered_order_within_return_window(ctx, 'ORD-4401', WITHIN_RETURN_WINDOW_DATE);

      // When: Customer selects "Return" on Order ORD-4401 in Order History
      const eligibilityResult = await when_customer_selects_return(ctx, 'ORD-4401');

      // Then: system shows which Order Line Items are Return Eligible
      then_eligible_items_displayed(eligibilityResult, ['premium-dog-kibble-10kg', 'squeaky-bone-chew']);
    });

    it('return request submitted and return record created', async () => {
      // Given: Customer viewing Return Eligible items for Order ORD-4401
      //   and Order Line Item Premium Dog Kibble 10kg is Return Eligible
      given_delivered_order_within_return_window(ctx, 'ORD-4401', WITHIN_RETURN_WINDOW_DATE);

      // When: Customer submits a Return Request selecting Premium Dog Kibble 10kg x 1
      //   with Return Reason "changed mind"
      const returnEntity = await when_customer_submits_return_request(
        ctx,
        'ORD-4401',
        [{ sku: 'premium-dog-kibble-10kg', quantity: 1 }],
        'changed mind',
      );

      // Then: Return RTN-7001 is created and linked to Order ORD-4401
      //   and Return Status is "initiated"
      //   and Return confirmation page shows next steps for Return Label generation
      //   and Return Status appears in Customer Account under Order detail
      then_return_created(returnEntity, 'ORD-4401', 'initiated');
      expect(returnEntity.returnId).toBeTruthy();
      expect(returnEntity.returnedItems).toBeDefined();
    });

    it('return action hidden when order is outside the return window', async () => {
      // Given: Customer sarah.mitchell with Order ORD-4402 delivered on 2026-02-05
      //   and current date is 2026-05-07 which is outside the Return Window
      given_delivered_order_outside_return_window(ctx, 'ORD-4402', WITHIN_RETURN_WINDOW_DATE);

      // When: Customer views Order ORD-4402 in Order History
      const eligibilityResult = await when_customer_selects_return(ctx, 'ORD-4402');

      // Then: "Return" action is hidden on Order ORD-4402
      //   and a reason is displayed: "return window expired"
      //   and the Order detail is still viewable
      then_return_action_hidden(eligibilityResult, 'return window expired');
    });

    it('previously returned items shown as in-progress with remaining items still returnable', async () => {
      // Given: a Return already exists for Order Line Item Premium Dog Kibble 10kg on Order ORD-4401
      //   with Return Status "initiated"
      //   and Order ORD-4401 also contains Squeaky Bone Chew x 2 with no prior Return
      given_existing_return_on_order(ctx, 'ORD-4401', 'premium-dog-kibble-10kg', 'initiated');

      // When: Customer selects "Return" on Order ORD-4401
      const eligibilityResult = await when_customer_selects_return(ctx, 'ORD-4401');

      // Then: Premium Dog Kibble 10kg shows "return in progress" and cannot be selected
      //   and Squeaky Bone Chew shows Return Eligible and can be selected for a separate Return
      expect(eligibilityResult.eligible).toBe(true);
      const inProgressItems = eligibilityResult.inProgressItems ?? [];
      const inProgressSkus = inProgressItems.map((item: any) => item.sku);
      expect(inProgressSkus).toContain('premium-dog-kibble-10kg');

      const eligibleSkus = eligibilityResult.eligibleItems.map((item: any) => item.sku);
      expect(eligibleSkus).toContain('squeaky-bone-chew');
      expect(eligibleSkus).not.toContain('premium-dog-kibble-10kg');
    });
  });
});
