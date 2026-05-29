/**
 * Retry Failed Payment — client tests (Increment 5)
 */
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PayYourWayClientHelper, paymentMocks } from '../helpers/pay-your-way.client';
import { PayYourWayBase } from '../helpers/pay-your-way.base';

describe('Retry Failed Payment', () => {
  const helper = new PayYourWayClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Retry Failed Payment — AC 1: transient auto-retry with indicator', async () => {
    await helper.when_customer_views_retry_indicator(PayYourWayBase.ORD_STRIPE_RETRY);
    helper.then_retrying_payment_indicator();
    await waitFor(() => {
      expect(paymentMocks.fetchPaymentRetryStatus).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('Retry Failed Payment — AC 2: retry success confirms order', async () => {
    paymentMocks.fetchPaymentRetryStatus.mockResolvedValueOnce({
      orderNumber: PayYourWayBase.ORD_STRIPE_RETRY,
      retrying: false,
      attemptCount: 2,
      maxAttempts: 3,
      exhausted: false,
      hardDecline: false,
      vendor: 'stripewave',
    });
    paymentMocks.payOrder.mockResolvedValueOnce({
      orderNumber: PayYourWayBase.ORD_STRIPE_RETRY,
      status: 'confirmed',
      emailStatus: 'sent',
      guestEmail: PayYourWayBase.VALID_GUEST.guest_email,
      subtotalFormatted: '£34.99',
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
    });
    await helper.when_customer_views_retry_indicator(PayYourWayBase.ORD_STRIPE_RETRY);
    await waitFor(() => {
      expect(screen.getByTestId('order-confirmation')).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('Retry Failed Payment — AC 3: retry exhaustion restores selector', async () => {
    paymentMocks.fetchPaymentRetryStatus.mockResolvedValueOnce({
      orderNumber: PayYourWayBase.ORD_STRIPE_RETRY,
      retrying: false,
      attemptCount: 3,
      maxAttempts: 3,
      exhausted: true,
      hardDecline: false,
      vendor: 'stripewave',
    });
    await helper.when_customer_views_retry_indicator(PayYourWayBase.ORD_STRIPE_RETRY);
    await waitFor(() => {
      expect(screen.getByText(/payment could not be processed — retry window exhausted/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/payment method selector/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('Retry Failed Payment — AC 4: hard decline no auto-retry immediate alternatives', async () => {
    await helper.renderIncrement5PaymentFlow('/checkout/payment/paynova/declined');
    await waitFor(() => {
      helper.then_hard_decline_alternatives_visible();
      expect(screen.queryByTestId('payment-retry-indicator')).not.toBeInTheDocument();
    });
  });

  it('Retry Failed Payment — AC 5: background retry notification outcomes', async () => {
    await helper.when_customer_views_retry_notification(PayYourWayBase.ORD_PAYNOVA, 'success');
    expect(screen.getByText(/payment retry succeeded — order confirmed/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /view order confirmation/i }));
    await helper.when_customer_views_retry_notification(PayYourWayBase.ORD_VAULTPAY, 'failure');
    expect(screen.getByText(/payment could not be processed — retry window exhausted/i)).toBeInTheDocument();
  });
});
