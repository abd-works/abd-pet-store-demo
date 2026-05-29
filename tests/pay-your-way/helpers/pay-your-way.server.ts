/**
 * Pay your way — server helper (Increment 5)
 */
import assert from 'node:assert/strict';
import request, { type SuperAgentTest } from 'supertest';
import { app } from '@pawplace/app-server';
import { ReturningCustomersServerHelper } from '../../returning-customers/helpers/returning-customers.server';
import { PayYourWayBase } from './pay-your-way.base';

export class PayYourWayServerHelper extends ReturningCustomersServerHelper {
  async given_pending_click_and_collect_order(agent: SuperAgentTest) {
    await this.given_cart_with_item(agent, 'PET-HAR-001', 1);
    const orderRes = await this.when_place_guest_order(
      agent,
      PayYourWayBase.VALID_GUEST,
      PayYourWayBase.VALID_BILLING,
      'STR-001',
    );
    assert.strictEqual(orderRes.status, 201);
    return orderRes.body.orderNumber as string;
  }

  async when_start_paynova_wallet(agent: SuperAgentTest, orderNumber: string) {
    return agent.post(`/api/orders/${orderNumber}/pay`).send({ vendor: 'paynova' });
  }

  async when_complete_paynova_wallet(
    agent: SuperAgentTest,
    orderNumber: string,
    authorized: boolean,
  ) {
    return agent.post(`/api/orders/${orderNumber}/pay`).send({
      vendor: 'paynova',
      cardNumber: authorized ? 'authorized' : 'declined',
    });
  }

  async when_paynova_webhook(
    orderNumber: string,
    status: 'captured' | 'failed',
    vendorTransactionReference = PayYourWayBase.PAYNOVA_VENDOR_REF,
  ) {
    return request(app)
      .post('/api/webhooks/paynova')
      .set('paynova-signature', 'test-signature')
      .send({ orderNumber, status, vendorTransactionReference });
  }

  async when_start_vaultpay_bnpl(agent: SuperAgentTest, orderNumber: string) {
    return agent.post(`/api/orders/${orderNumber}/pay`).send({ vendor: 'vaultpay' });
  }

  async when_accept_vaultpay_instalment(agent: SuperAgentTest, orderNumber: string, accepted = true) {
    return agent.post(`/api/orders/${orderNumber}/pay`).send({
      vendor: 'vaultpay',
      acceptInstalmentPlan: accepted,
    });
  }

  async when_vaultpay_webhook(
    orderNumber: string,
    status: 'captured' | 'failed',
    vendorTransactionReference = PayYourWayBase.VAULTPAY_VENDOR_REF,
  ) {
    return request(app)
      .post('/api/webhooks/vaultpay')
      .set('vaultpay-signature', 'test-signature')
      .send({ orderNumber, status, vendorTransactionReference, instalmentReference: 'VP-4x50' });
  }

  async when_pay_transient_error(agent: SuperAgentTest, orderNumber: string) {
    return this.when_pay_order(agent, orderNumber, '4242424242420501');
  }

  async when_get_payment_retry_status(agent: SuperAgentTest, orderNumber: string) {
    return agent.get(`/api/payment-retries/${orderNumber}/status`);
  }

  async when_get_order(agent: SuperAgentTest, orderNumber: string) {
    return agent.get(`/api/orders/${orderNumber}`);
  }

  then_order_processing_vendor(response: request.Response, vendor: string): void {
    assert.strictEqual(response.body.processingVendor, vendor);
  }

  then_order_vendor_transaction_reference(response: request.Response, reference: string): void {
    assert.strictEqual(response.body.vendorTransactionReference, reference);
  }

  then_confirmation_email_sent(response: request.Response): void {
    assert.ok(
      response.body.emailStatus === 'sent' || response.body.emailStatus === 'queued',
      `expected confirmation email status, got ${response.body.emailStatus}`,
    );
  }
}
