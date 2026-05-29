/**
 * Process Buy-Now-Pay-Later via VaultPay — server tests (Increment 5)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PayYourWayServerHelper } from '../helpers/pay-your-way.server';
import { PayYourWayBase } from '../helpers/pay-your-way.base';
import { ReturningCustomersBase } from '../../returning-customers/helpers/returning-customers.base';

describe('Process Buy-Now-Pay-Later via VaultPay', () => {
  const helper = new PayYourWayServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 1: BNPL redirect eligibility and instalment plan', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const startRes = await helper.when_start_vaultpay_bnpl(agent, orderNumber);
    expect(startRes.status).toBe(202);
    expect(startRes.body.redirectUrl).toMatch(/vaultpay/i);
    expect(startRes.body.vendor).toBe('vaultpay');
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 2: instalment acceptance confirms order', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const payRes = await helper.when_accept_vaultpay_instalment(agent, orderNumber, true);
    expect(payRes.status).toBe(200);
    helper.then_order_status(payRes, 'confirmed');
    helper.then_order_processing_vendor(payRes, 'vaultpay');
    helper.then_order_vendor_transaction_reference(payRes, `VP-${orderNumber}`);
    helper.then_confirmation_email_sent(payRes);
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 3: hard decline BNPL unavailable alternatives', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    const payRes = await helper.when_accept_vaultpay_instalment(agent, orderNumber, false);
    expect(payRes.status).toBe(402);
    expect(payRes.body.hardDecline).toBe(true);
    expect(payRes.body.error).toMatch(/instalment|decline|unavailable/i);
    const orderRes = await helper.when_get_order(agent, orderNumber);
    helper.then_order_status(orderRes, 'pending_payment');
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 4: webhook reconciliation customer outcome', async () => {
    const agent = helper.createSessionAgent();
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    await helper.when_start_vaultpay_bnpl(agent, orderNumber);
    const webhookRes = await helper.when_vaultpay_webhook(orderNumber, 'captured');
    expect(webhookRes.status).toBe(200);
    const orderRes = await helper.when_get_order(agent, orderNumber);
    helper.then_order_status(orderRes, 'confirmed');
    helper.then_order_processing_vendor(orderRes, 'vaultpay');
    helper.then_order_vendor_transaction_reference(orderRes, PayYourWayBase.VAULTPAY_VENDOR_REF);
    helper.then_confirmation_email_sent(orderRes);
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 5: save VaultPay identity with per-transaction eligibility', async () => {
    const agent = helper.createSessionAgent();
    await helper.given_verified_account(ReturningCustomersBase.JANE);
    await helper.when_login(agent, ReturningCustomersBase.JANE.email, ReturningCustomersBase.JANE.password);
    const orderNumber = await helper.given_pending_click_and_collect_order(agent);
    await helper.when_accept_vaultpay_instalment(agent, orderNumber, true);
    const saveRes = await helper.seed_payment_method(ReturningCustomersBase.JANE.email, {
      vendorToken: 'tok_vp_identity_001',
      cardType: 'VaultPay',
      lastFour: '0000',
    });
    expect(saveRes.status).toBe(201);
    expect(saveRes.body.processingVendorCode).toBe('vaultpay');
    const secondOrder = await helper.given_pending_click_and_collect_order(agent);
    const eligibilityRes = await helper.when_start_vaultpay_bnpl(agent, secondOrder);
    expect(eligibilityRes.status).toBe(202);
    expect(eligibilityRes.body.eligibilityCheckRequired).toBe(true);
  });
});
