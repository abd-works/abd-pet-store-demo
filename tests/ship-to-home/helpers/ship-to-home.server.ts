/**
 * Ship to home — server helper (Increment 3)
 */
import assert from 'node:assert/strict';
import request, { type SuperAgentTest } from 'supertest';
import { app } from '@pawplace/app-server';
import { DeliveryOption } from '@pawplace/order-shared';
import { ClickAndCollectServerHelper } from '../../click-and-collect/helpers/click-and-collect.server';
import {
  ShipToHomeBase,
  type BillingAddressTestData,
  type GuestCheckoutTestData,
  type ShippingAddressTestData,
} from './ship-to-home.base';

export class ShipToHomeServerHelper extends ClickAndCollectServerHelper {
  async when_place_standard_delivery_order(
    agent: SuperAgentTest,
    guest: GuestCheckoutTestData,
    billing: BillingAddressTestData,
    shipping: ShippingAddressTestData,
  ) {
    return agent.post('/api/orders').send({
      guestEmail: guest.guest_email,
      guestName: guest.guest_name,
      billingAddress: billing,
      shippingAddress: shipping,
      deliveryOption: DeliveryOption.standardDelivery(),
    });
  }

  async given_confirmed_ship_to_home_order(
    agent: SuperAgentTest,
    guest: GuestCheckoutTestData = ShipToHomeBase.VALID_GUEST,
    billing: BillingAddressTestData = ShipToHomeBase.VALID_BILLING,
    shipping: ShippingAddressTestData = ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
    sku = 'PET-HAR-001',
  ) {
    await this.given_cart_with_item(agent, sku, 1);
    const orderRes = await this.when_place_standard_delivery_order(agent, guest, billing, shipping);
    const orderNumber = orderRes.body.orderNumber as string;
    await this.when_pay_order(agent, orderNumber, '4242424242424242');
    return { orderNumber, orderRes };
  }

  async given_confirmed_click_and_collect_order(
    agent: SuperAgentTest,
    guest: GuestCheckoutTestData = ShipToHomeBase.VALID_GUEST,
    billing: BillingAddressTestData = ShipToHomeBase.VALID_BILLING,
    sku = 'PET-TRT-042',
    quantity = 3,
  ) {
    await this.given_cart_with_item(agent, sku, quantity);
    const orderRes = await this.when_place_guest_order(agent, guest, billing, 'STR-001');
    const orderNumber = orderRes.body.orderNumber as string;
    await this.when_pay_order(agent, orderNumber, '4242424242424242');
    return { orderNumber, orderRes };
  }

  async when_mark_fulfilled(
    orderNumber: string,
    tracking?: { carrierName?: string; trackingNumber?: string },
  ) {
    return request(app)
      .patch(`/api/orders/${orderNumber}/fulfilled`)
      .send(tracking ?? {});
  }

  async when_add_tracking(
    orderNumber: string,
    tracking: { carrierName: string; trackingNumber: string },
  ) {
    return request(app).patch(`/api/orders/${orderNumber}/tracking`).send(tracking);
  }

  async when_lookup_order(orderNumber: string, guestEmail: string) {
    return request(app)
      .post('/api/orders/status/lookup')
      .send({ orderNumber, guestEmail });
  }

  async when_get_order(orderNumber: string) {
    return request(app).get(`/api/orders/${encodeURIComponent(orderNumber)}`);
  }

  async when_get_order_status(orderNumber: string) {
    return request(app).get(`/api/orders/status/${encodeURIComponent(orderNumber)}`);
  }

  async when_list_queue(storeCode = 'STR-001') {
    return request(app).get(`/api/orders/queue?storeCode=${storeCode}`);
  }

  then_shipping_address_snapshot(
    response: request.Response,
    shipping: ShippingAddressTestData,
  ): void {
    assert.strictEqual(response.body.shippingAddress.addressLine1, shipping.addressLine1);
    assert.strictEqual(response.body.shippingAddress.city, shipping.city);
    assert.strictEqual(response.body.shippingAddress.postcode, shipping.postcode);
  }

  then_no_shipping_address(response: request.Response): void {
    assert.strictEqual(response.body.shippingAddress, undefined);
  }

  then_shipping_cost_pence(response: request.Response, expectedPence: number): void {
    assert.strictEqual(response.body.shippingCostPence, expectedPence);
  }

  then_delivery_type_label(response: request.Response, label: string): void {
    assert.strictEqual(response.body.deliveryTypeLabel, label);
  }

  then_tracking_number(response: request.Response | { trackingNumber?: { value: string } }, trackingNumber: string): void {
    const body = 'body' in response ? response.body : response;
    const tracking = body.order?.trackingNumber ?? body.trackingNumber;
    assert.strictEqual(tracking.value, trackingNumber);
  }

  then_order_dto_status(order: { status: string }, status: string): void {
    assert.strictEqual(order.status, status);
  }

  then_fulfillment_warning(response: request.Response, message: string): void {
    assert.strictEqual(response.body.warning, message);
  }

  then_status_label(response: request.Response, label: string): void {
    assert.strictEqual(response.body.statusLabel, label);
  }

  then_tracking_pending_message(response: request.Response, message: string): void {
    assert.strictEqual(response.body.trackingPendingMessage, message);
  }
}
