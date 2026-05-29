/**
 * Process Digital Wallet Payment via PayNova — client tests (Increment 5)
 */
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PayYourWayClientHelper, paymentMocks } from '../helpers/pay-your-way.client';
import { PayYourWayBase } from '../helpers/pay-your-way.base';

describe('Process Digital Wallet Payment via PayNova', () => {
  const helper = new PayYourWayClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Process Digital Wallet Payment via PayNova — AC 1: wallet auth launch and cancel preserves alternatives', async () => {
    await helper.when_customer_views_payment_selector(PayYourWayBase.ORD_PAYNOVA);
    helper.then_multi_vendor_selector_visible();
    await helper.when_customer_selects_vendor(/PayNova — digital wallet/i);
    await userEvent.click(screen.getByRole('button', { name: /continue with selected payment method/i }));
    await waitFor(() => helper.then_paynova_wallet_auth_visible());
    await userEvent.click(screen.getByRole('link', { name: /cancel PayNova wallet flow/i }));
    await waitFor(() => helper.then_multi_vendor_selector_visible());
  });

  it('Process Digital Wallet Payment via PayNova — AC 2: confirmation page and email on success', async () => {
    paymentMocks.payOrder.mockResolvedValueOnce({
      orderNumber: PayYourWayBase.ORD_PAYNOVA,
      status: 'confirmed',
      guestEmail: PayYourWayBase.VALID_GUEST.guest_email,
      emailStatus: 'sent',
      maskedPaymentMethod: 'PayNova wallet',
      subtotalFormatted: '£34.99',
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
    });
    await helper.when_customer_views_paynova_flow(PayYourWayBase.ORD_PAYNOVA);
    await helper.when_customer_authorises_paynova_wallet();
    await waitFor(() => {
      expect(screen.getByTestId('order-confirmation')).toBeInTheDocument();
      expect(screen.getByText(/confirmation email sent to guest email/i)).toBeInTheDocument();
      expect(screen.getByText(/PayNova vendor transaction reference/i)).toBeInTheDocument();
    });
  });

  it('Process Digital Wallet Payment via PayNova — AC 3: hard decline alternatives no confirmation', async () => {
    await helper.when_customer_views_paynova_flow(PayYourWayBase.ORD_PAYNOVA);
    paymentMocks.payOrder.mockRejectedValueOnce(Object.assign(new Error('insufficient wallet balance'), { status: 402 }));
    await helper.when_customer_authorises_paynova_wallet();
    await waitFor(() => {
      helper.then_hard_decline_alternatives_visible();
      expect(screen.getByText(/insufficient wallet balance/i)).toBeInTheDocument();
      expect(screen.queryByText(/order confirmed/i)).not.toBeInTheDocument();
    });
  });

  it('Process Digital Wallet Payment via PayNova — AC 4: webhook reconciliation customer outcome', async () => {
    paymentMocks.payOrder.mockRejectedValueOnce(
      Object.assign(new Error('PayNova timeout'), { status: 504, body: { awaitingWebhook: true } }),
    );
    await helper.when_customer_views_paynova_flow(PayYourWayBase.ORD_PAYNOVA);
    await helper.when_customer_authorises_paynova_wallet();
    await waitFor(() => {
      expect(screen.getByText(/awaiting PayNova payment confirmation/i)).toBeInTheDocument();
    });
  });

  it('Process Digital Wallet Payment via PayNova — AC 5: save PayNova wallet token opt-in', async () => {
    await helper.renderIncrement5PaymentFlow(
      `/order-confirmation/${PayYourWayBase.ORD_PAYNOVA}?savePayNova=1`,
    );
    await waitFor(() => helper.then_save_paynova_prompt_visible());
    expect(screen.getByText(/only PayNova vendor token stored/i)).toBeInTheDocument();
  });
});
