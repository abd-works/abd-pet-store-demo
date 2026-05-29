/**
 * Process Buy-Now-Pay-Later via VaultPay — client tests (Increment 5)
 */
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PayYourWayClientHelper, paymentMocks } from '../helpers/pay-your-way.client';
import { PayYourWayBase } from '../helpers/pay-your-way.base';

describe('Process Buy-Now-Pay-Later via VaultPay', () => {
  const helper = new PayYourWayClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 1: BNPL redirect eligibility and instalment plan', async () => {
    await helper.when_customer_views_payment_selector(PayYourWayBase.ORD_VAULTPAY);
    await helper.when_customer_selects_vendor(/VaultPay — buy-now-pay-later/i);
    await userEvent.click(screen.getByRole('button', { name: /continue with selected payment method/i }));
    await waitFor(() => screen.getByText(/VaultPay — buy-now-pay-later/i));
    await helper.when_customer_completes_vaultpay_eligibility();
    helper.then_vaultpay_instalment_plan_visible();
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 2: instalment acceptance confirms order', async () => {
    paymentMocks.payOrder.mockResolvedValueOnce({
      orderNumber: PayYourWayBase.ORD_VAULTPAY,
      status: 'confirmed',
      guestEmail: PayYourWayBase.VALID_GUEST.guest_email,
      emailStatus: 'sent',
      maskedPaymentMethod: 'VaultPay buy-now-pay-later',
      subtotalFormatted: '£34.99',
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
    });
    await helper.when_customer_views_vaultpay_flow(PayYourWayBase.ORD_VAULTPAY);
    await helper.when_customer_completes_vaultpay_eligibility();
    await helper.when_customer_accepts_vaultpay_instalment();
    await waitFor(() => {
      expect(screen.getByTestId('order-confirmation')).toBeInTheDocument();
      expect(screen.getByText(/VaultPay instalment reference/i)).toBeInTheDocument();
    });
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 3: hard decline BNPL unavailable alternatives', async () => {
    await helper.renderIncrement5PaymentFlow('/checkout/payment/vaultpay/declined');
    await waitFor(() => {
      expect(screen.getByText(/buy-now-pay-later not available/i)).toBeInTheDocument();
      helper.then_hard_decline_alternatives_visible();
    });
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 4: webhook reconciliation customer outcome', async () => {
    paymentMocks.payOrder.mockRejectedValueOnce(
      Object.assign(new Error('VaultPay timeout'), { status: 504, body: { awaitingWebhook: true } }),
    );
    await helper.when_customer_views_vaultpay_flow(PayYourWayBase.ORD_VAULTPAY);
    await helper.when_customer_completes_vaultpay_eligibility();
    await helper.when_customer_accepts_vaultpay_instalment();
    await waitFor(() => {
      expect(screen.getByText(/awaiting VaultPay payment confirmation/i)).toBeInTheDocument();
    });
  });

  it('Process Buy-Now-Pay-Later via VaultPay — AC 5: save VaultPay identity with per-transaction eligibility', async () => {
    await helper.renderIncrement5PaymentFlow(
      `/order-confirmation/${PayYourWayBase.ORD_VAULTPAY}?saveVaultPay=1`,
    );
    await waitFor(() => helper.then_save_vaultpay_prompt_visible());
    expect(screen.getByText(/eligibility check per transaction/i)).toBeInTheDocument();
  });
});
