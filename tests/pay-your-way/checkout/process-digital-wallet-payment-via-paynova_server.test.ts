/**
 * Process Digital Wallet Payment via PayNova — server tests (Increment 5)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PayYourWayServerHelper } from '../helpers/pay-your-way.server';
import { PayYourWayBase } from '../helpers/pay-your-way.base';
import { ReturningCustomersBase } from '../../returning-customers/helpers/returning-customers.base';

describe('Process Digital Wallet Payment via PayNova', () => {
  const helper = new PayYourWayServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Process Digital Wallet Payment via PayNova — AC 1: wallet auth launch and cancel preserves alternatives', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const startRes = await helper.when_start_paynova_wallet(agent, orderNumber);
    expect(startRes.status).toBe(202);
    expect(startRes.body.redirectUrl).toMatch(/paynova/i);
    expect(startRes.body.vendor).toBe('paynova');
    const orderRes = await helper.when_get_order(agent, orderNumber);
    helper.then_order_status(orderRes, 'pending_payment');
  });

  it('Process Digital Wallet Payment via PayNova — AC 2: confirmation page and email on success', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const payRes = await helper.when_complete_paynova_wallet(agent, orderNumber, true);
    expect(payRes.status).toBe(200);
    helper.then_order_status(payRes, 'confirmed');
    helper.then_order_processing_vendor(payRes, 'paynova');
    helper.then_order_vendor_transaction_reference(payRes, `PN-${orderNumber}`);
    helper.then_confirmation_email_sent(payRes);
  });

  it('Process Digital Wallet Payment via PayNova — AC 3: hard decline alternatives no confirmation', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const payRes = await helper.when_complete_paynova_wallet(agent, orderNumber, false);
    expect(payRes.status).toBe(402);
    expect(payRes.body.hardDecline).toBe(true);
    expect(payRes.body.error).toMatch(/wallet|decline|cancel/i);
    const orderRes = await helper.when_get_order(agent, orderNumber);
    helper.then_order_status(orderRes, 'pending_payment');
  });

  it('Process Digital Wallet Payment via PayNova — AC 4: webhook reconciliation customer outcome', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    await helper.when_start_paynova_wallet(agent, orderNumber);
    const webhookRes = await helper.when_paynova_webhook(orderNumber, 'captured');
    expect(webhookRes.status).toBe(200);
    const orderRes = await helper.when_get_order(agent, orderNumber);
    helper.then_order_status(orderRes, 'confirmed');
    helper.then_order_processing_vendor(orderRes, 'paynova');
    helper.then_order_vendor_transaction_reference(orderRes, PayYourWayBase.PAYNOVA_VENDOR_REF);
    helper.then_confirmation_email_sent(orderRes);
  });

  it('Process Digital Wallet Payment via PayNova — AC 5: save PayNova wallet token opt-in', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    await helper.when_login(agent, ReturningCustomersBase.JANE.email, ReturningCustomersBase.JANE.password);
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const payRes = await helper.when_complete_paynova_wallet(agent, orderNumber, true);
    expect(payRes.status).toBe(200);
    expect(payRes.body.savePayNovaWalletOffered).toBe(true);
    const saveRes = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, {
      vendorToken: 'tok_pn_wallet_001',
      cardType: 'PayNova Wallet',
      lastFour: '0000',
    });
    expect(saveRes.status).toBe(201);
    expect(saveRes.body.processingVendorCode).toBe('paynova');
    expect(saveRes.body.rawCardNumber).toBeUndefined();
  });
});
