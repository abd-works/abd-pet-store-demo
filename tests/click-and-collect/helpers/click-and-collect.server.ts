/**
 * Click-and-collect — server helper (Increment 2)
 */
import assert from 'node:assert/strict';
import request, { type SuperAgentTest } from 'supertest';
import { app } from '@pawplace/app-server';
import {
  ClickAndCollectBase,
  type BillingAddressTestData,
  type GuestCheckoutTestData,
} from './click-and-collect.base';

export class ClickAndCollectServerHelper extends ClickAndCollectBase {
  private seededProductSkus: string[] = [];
  private seededStockIds: string[] = [];
  private seededStoreCodes: string[] = [];

  createSessionAgent(): SuperAgentTest {
    return request.agent(app);
  }

  async seed(): Promise<void> {
    for (const product of ClickAndCollectBase.PRODUCTS) {
      await request(app)
        .post('/api/test/products')
        .send(ClickAndCollectBase.toProductSeedBody(product));
      this.seededProductSkus.push(product.sku);
    }

    const stockRes = await request(app)
      .post('/api/test/stock-availability')
      .send({
        products: ClickAndCollectBase.PRODUCTS.map((p) => ({
          product_name: p.product_name,
          sku: p.sku,
          price: p.price,
          brand: p.brand,
        })),
        stores: ClickAndCollectBase.STORES.map((s) => ({
          store_name: s.store_name,
          store_code: s.store_code,
        })),
        stock_availability: ClickAndCollectBase.STOCK,
      });
    this.seededStockIds = stockRes.body.ids ?? [];

    for (const store of ClickAndCollectBase.STORES) {
      await request(app)
        .post('/api/test/stores')
        .send(ClickAndCollectBase.toStoreSeedBody(store));
      this.seededStoreCodes.push(store.store_code);
    }
  }

  async cleanup(): Promise<void> {
    if (this.seededStockIds.length > 0) {
      await request(app)
        .delete('/api/test/stock-availability')
        .send({ ids: this.seededStockIds });
      this.seededStockIds = [];
    }
    if (this.seededProductSkus.length > 0) {
      await request(app)
        .delete('/api/test/products')
        .send({ skus: this.seededProductSkus });
      this.seededProductSkus = [];
    }
    if (this.seededStoreCodes.length > 0) {
      await request(app)
        .delete('/api/test/stores')
        .send({ codes: this.seededStoreCodes });
      this.seededStoreCodes = [];
    }
  }

  async given_cart_with_item(agent: SuperAgentTest, sku: string, quantity = 1) {
    for (let i = 0; i < quantity; i += 1) {
      await agent.post('/api/cart/items').send({ sku, quantity: 1 }).expect(201);
    }
    return agent.get('/api/cart').expect(200);
  }

  async when_add_to_cart(agent: SuperAgentTest, sku: string, quantity = 1) {
    return agent.post('/api/cart/items').send({ sku, quantity });
  }

  async when_update_quantity(agent: SuperAgentTest, sku: string, quantity: number) {
    return agent.patch(`/api/cart/items/${sku}`).send({ quantity });
  }

  async when_remove_item(agent: SuperAgentTest, sku: string) {
    return agent.delete(`/api/cart/items/${sku}`);
  }

  async when_place_guest_order(
    agent: SuperAgentTest,
    guest: GuestCheckoutTestData,
    billing: BillingAddressTestData,
    pickupStoreCode: string,
  ) {
    return agent.post('/api/orders').send({
      guestEmail: guest.guest_email,
      guestName: guest.guest_name,
      billingAddress: billing,
      pickupStoreCode,
    });
  }

  async when_pay_order(agent: SuperAgentTest, orderNumber: string, cardNumber: string) {
    return agent.post(`/api/orders/${orderNumber}/pay`).send({
      cardNumber,
      expiry: '12/27',
      cvv: '123',
    });
  }

  async when_webhook_confirmed(orderNumber: string) {
    return request(app)
      .post('/api/webhooks/stripewave')
      .set('stripewave-signature', 'test-signature')
      .send({ orderNumber, status: 'confirmed' });
  }

  then_cart_item_count(response: request.Response, expected: number): void {
    assert.strictEqual(response.body.itemCount, expected);
  }

  then_cart_subtotal(response: request.Response, expected: number): void {
    assert.ok(Math.abs(response.body.subtotal - expected) < 0.01, `expected subtotal ${expected}, got ${response.body.subtotal}`);
  }

  then_cart_has_line(response: request.Response, sku: string, quantity: number): void {
    const item = response.body.items.find((row: { sku: string }) => row.sku === sku);
    assert.ok(item, `expected cart line for ${sku}`);
    assert.strictEqual(item.quantity, quantity);
  }

  then_cart_line_count(response: request.Response, expected: number): void {
    assert.strictEqual(response.body.items.length, expected);
  }

  then_order_status(response: request.Response, status: string): void {
    assert.strictEqual(response.body.status, status);
  }

  then_order_guest_email(response: request.Response, email: string): void {
    assert.strictEqual(response.body.guestEmail, email);
  }
}
