/**
 * Enter Shipping Address — server tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ShippingAddress } from '@pawplace/order-shared';
import { ShipToHomeServerHelper } from '../helpers/ship-to-home.server';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('Enter Shipping Address', () => {
  const helper = new ShipToHomeServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Enter Shipping Address — AC 1: form on standard path skipped on click-and-collect', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const standardRes = await helper.when_place_standard_delivery_order(
      agent,
      ShipToHomeBase.VALID_GUEST,
      ShipToHomeBase.VALID_BILLING,
      ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
    );
    expect(standardRes.status).toBe(201);
    helper.then_shipping_address_snapshot(standardRes, ShipToHomeBase.VALID_SHIPPING_EDINBURGH);

    const agent2 = helper.createSessionAgent();
    await helper.given_cart_with_item(agent2, 'PET-TRT-042', 1);
    const collectRes = await helper.when_place_guest_order(
      agent2,
      ShipToHomeBase.VALID_GUEST,
      ShipToHomeBase.VALID_BILLING,
      'STR-001',
    );
    expect(collectRes.status).toBe(201);
    helper.then_no_shipping_address(collectRes);
  });

  it('Enter Shipping Address — AC 2: same as billing pre-fill', () => {
    const prefilled = ShippingAddress.preFillFromBilling(ShipToHomeBase.VALID_BILLING);
    expect(prefilled).toEqual(ShipToHomeBase.VALID_SHIPPING_FROM_BILLING);
  });

  it('Enter Shipping Address — AC 4: missing fields blocked', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const response = await agent.post('/api/orders').send({
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      guestName: ShipToHomeBase.VALID_GUEST.guest_name,
      billingAddress: ShipToHomeBase.VALID_BILLING,
      shippingAddress: {
        recipientName: ' ',
        addressLine1: ' ',
        city: ' ',
        postcode: ' ',
        country: 'United Kingdom',
      },
      deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
    });
    expect(response.status).toBe(400);
  });

  it('Enter Shipping Address — AC 5: advances with summary preview', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const response = await helper.when_place_standard_delivery_order(
      agent,
      ShipToHomeBase.VALID_GUEST,
      ShipToHomeBase.VALID_BILLING,
      ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
    );
    expect(response.status).toBe(201);
    helper.then_shipping_address_snapshot(response, ShipToHomeBase.VALID_SHIPPING_EDINBURGH);
    expect(response.body.deliveryOption.type).toBe('standard_delivery');
  });
});
