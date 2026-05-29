/**
 * Select Delivery Option — server tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { STANDARD_DELIVERY_COST_PENCE } from '@pawplace/order-shared';
import { ShipToHomeServerHelper } from '../helpers/ship-to-home.server';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('Select Delivery Option', () => {
  const helper = new ShipToHomeServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Select Delivery Option — AC 2: standard confirms address and cost', async () => {
    const agent = helper.createSessionAgent();
    const { orderRes } = await helper.given_confirmed_ship_to_home_order(agent);
    helper.then_shipping_address_snapshot(orderRes, ShipToHomeBase.VALID_SHIPPING_EDINBURGH);
    helper.then_shipping_cost_pence(orderRes, STANDARD_DELIVERY_COST_PENCE);
    helper.then_delivery_type_label(orderRes, 'Standard Delivery');
  });

  it('Select Delivery Option — AC 3: switch adjusts steps billing always required', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const standardRes = await helper.when_place_standard_delivery_order(
      agent,
      ShipToHomeBase.VALID_GUEST,
      ShipToHomeBase.VALID_BILLING,
      ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
    );
    expect(standardRes.body.billingAddress.addressLine1).toBe(ShipToHomeBase.VALID_BILLING.addressLine1);

    const agent2 = helper.createSessionAgent();
    await helper.given_cart_with_item(agent2, 'PET-TRT-042', 1);
    const collectRes = await helper.when_place_guest_order(
      agent2,
      ShipToHomeBase.VALID_GUEST,
      ShipToHomeBase.VALID_BILLING,
      'STR-001',
    );
    expect(collectRes.body.billingAddress.addressLine1).toBe(ShipToHomeBase.VALID_BILLING.addressLine1);
    helper.then_no_shipping_address(collectRes);
  });
});
