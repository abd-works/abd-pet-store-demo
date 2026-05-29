/**
 * Pay your way — client helper (Increment 5)
 */
import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ClickAndCollectClientHelper, paymentMocks } from '../../click-and-collect/helpers/click-and-collect.client';
import * as orderApi from '@pawplace/order-client/order.api';
import { PayYourWayBase } from './pay-your-way.base';
import { PaymentPage } from '../../../packages/app-client/src/pages/PaymentPage';
import { StripeWavePaymentPage } from '../../../packages/app-client/src/pages/payment/StripeWavePaymentPage';
import { PayNovaWalletFlow } from '../../../packages/app-client/src/pages/payment/PayNovaWalletFlow';
import { PayNovaHardDecline } from '../../../packages/app-client/src/pages/payment/PayNovaHardDecline';
import { VaultPayBnplFlow } from '../../../packages/app-client/src/pages/payment/VaultPayBnplFlow';
import { VaultPayHardDecline } from '../../../packages/app-client/src/pages/payment/VaultPayHardDecline';
import { PaymentRetryIndicator } from '../../../packages/app-client/src/pages/payment/PaymentRetryIndicator';
import { PaymentRetryExhausted } from '../../../packages/app-client/src/pages/payment/PaymentRetryExhausted';
import { PaymentRetryNotificationPage } from '../../../packages/app-client/src/pages/PaymentRetryNotificationPage';
import { OrderConfirmationPage } from '../../../packages/app-client/src/pages/OrderConfirmationPage';
import { SavePayNovaPrompt } from '../../../packages/app-client/src/components/SavePayNovaPrompt';
import { SaveVaultPayPrompt } from '../../../packages/app-client/src/components/SaveVaultPayPrompt';
import { CartProvider } from '../../../packages/app-client/src/context/CartContext';

function cartLine() {
  return {
    items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
    itemCount: 1,
    subtotal: 34.99,
    subtotalFormatted: '£34.99',
  };
}

export class PayYourWayClientHelper extends ClickAndCollectClientHelper {
  async seed(): Promise<void> {
    await super.seed();
    vi.mocked(orderApi.fetchOrder).mockImplementation(async (orderNumber) => ({
      orderNumber,
      status: 'confirmed',
      guestEmail: PayYourWayBase.VALID_GUEST.guest_email,
      guestName: PayYourWayBase.VALID_GUEST.guest_name,
      emailStatus: 'sent',
      maskedPaymentMethod: 'PayNova wallet',
      subtotalFormatted: '£34.99',
      items: cartLine().items,
      billingAddress: PayYourWayBase.VALID_BILLING,
      pickupStore: {
        storeCode: 'STR-001',
        storeName: 'PawPlace Camden',
        addressLineOne: '42 High Street',
        city: 'London',
        postcode: 'NW1 8QP',
      },
    }));
    paymentMocks.fetchPaymentRetryStatus.mockResolvedValue({
      orderNumber: PayYourWayBase.ORD_PAYNOVA,
      retrying: true,
      attemptCount: 1,
      maxAttempts: 3,
      exhausted: false,
      hardDecline: false,
      vendor: 'stripewave',
    });
    paymentMocks.startVendorPayment.mockResolvedValue({
      redirectUrl: '/checkout/payment/paynova',
    });
  }

  renderIncrement5PaymentFlow(initialRoute = '/checkout/payment') {
    const shell = (Page: React.ComponentType) =>
      React.createElement(CartProvider, null, React.createElement(Page));
    return render(
      React.createElement(
        MemoryRouter,
        { initialEntries: [initialRoute] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: '/checkout/payment', element: shell(PaymentPage) }),
          React.createElement(Route, { path: '/checkout/payment/stripewave', element: shell(StripeWavePaymentPage) }),
          React.createElement(Route, { path: '/checkout/payment/paynova', element: shell(PayNovaWalletFlow) }),
          React.createElement(Route, { path: '/checkout/payment/paynova/declined', element: shell(PayNovaHardDecline) }),
          React.createElement(Route, { path: '/checkout/payment/vaultpay', element: shell(VaultPayBnplFlow) }),
          React.createElement(Route, { path: '/checkout/payment/vaultpay/declined', element: shell(VaultPayHardDecline) }),
          React.createElement(Route, { path: '/checkout/payment/retrying', element: shell(PaymentRetryIndicator) }),
          React.createElement(Route, { path: '/checkout/payment/retry-exhausted', element: shell(PaymentRetryExhausted) }),
          React.createElement(Route, { path: '/account/notifications/:id', element: shell(PaymentRetryNotificationPage) }),
          React.createElement(Route, { path: '/order-confirmation/:orderNumber', element: shell(OrderConfirmationPage) }),
        ),
      ),
    );
  }

  given_checkout_draft(orderNumber: string) {
    sessionStorage.setItem(
      'pawplace-checkout-draft',
      JSON.stringify({
        pickupStoreCode: 'STR-001',
        pickupStoreName: 'PawPlace Camden',
        orderNumber,
        billingAddress: PayYourWayBase.VALID_BILLING,
      }),
    );
    this.given_cart_state(cartLine());
  }

  async when_customer_views_payment_selector(orderNumber: string) {
    this.given_checkout_draft(orderNumber);
    this.renderIncrement5PaymentFlow('/checkout/payment');
    await waitFor(() => screen.getByLabelText(/payment method selector/i));
  }

  async when_customer_selects_vendor(label: RegExp) {
    await userEvent.click(screen.getByRole('radio', { name: label }));
  }

  async when_customer_views_paynova_flow(orderNumber: string) {
    this.given_checkout_draft(orderNumber);
    this.renderIncrement5PaymentFlow('/checkout/payment/paynova');
    await waitFor(() => screen.getByText(/PayNova — digital wallet/i));
  }

  async when_customer_views_vaultpay_flow(orderNumber: string) {
    this.given_checkout_draft(orderNumber);
    this.renderIncrement5PaymentFlow('/checkout/payment/vaultpay');
    await waitFor(() => screen.getByText(/VaultPay — buy-now-pay-later/i));
  }

  async when_customer_views_retry_indicator(orderNumber: string) {
    this.given_checkout_draft(orderNumber);
    this.renderIncrement5PaymentFlow('/checkout/payment/retrying');
    await waitFor(() => screen.getByTestId('payment-retry-indicator'));
  }

  async when_customer_views_retry_notification(orderNumber: string, outcome: 'success' | 'failure') {
    this.renderIncrement5PaymentFlow(`/account/notifications/${orderNumber}?outcome=${outcome}`);
    await waitFor(() => screen.getByText(/background payment retry outcome/i));
  }

  async when_customer_authorises_paynova_wallet() {
    await userEvent.click(screen.getByRole('button', { name: /authorise payment with mobile wallet credentials/i }));
  }

  async when_customer_completes_vaultpay_eligibility() {
    await userEvent.click(screen.getByRole('button', { name: /complete VaultPay eligibility check/i }));
  }

  async when_customer_accepts_vaultpay_instalment() {
    await userEvent.click(screen.getByRole('button', { name: /accept instalment plan/i }));
  }

  then_multi_vendor_selector_visible(): void {
    const fieldset = screen.getByLabelText(/payment method selector/i);
    expect(within(fieldset).getByRole('radio', { name: /StripeWave — card/i })).toBeInTheDocument();
    expect(within(fieldset).getByRole('radio', { name: /PayNova — digital wallet/i })).toBeInTheDocument();
    expect(within(fieldset).getByRole('radio', { name: /VaultPay — buy-now-pay-later/i })).toBeInTheDocument();
  }

  then_paynova_wallet_auth_visible(): void {
    expect(screen.getByText(/redirecting to PayNova wallet authentication/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /authorise payment with mobile wallet credentials/i })).toBeInTheDocument();
  }

  then_vaultpay_instalment_plan_visible(): void {
    expect(screen.getByText(/instalment plan schedule/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accept instalment plan/i })).toBeInTheDocument();
  }

  then_hard_decline_alternatives_visible(): void {
    expect(screen.getByRole('link', { name: /switch to StripeWave/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /switch to VaultPay|switch to PayNova/i })).toBeInTheDocument();
  }

  then_retrying_payment_indicator(): void {
    expect(screen.getByTestId('payment-retry-indicator')).toHaveTextContent(/retrying payment/i);
  }

  then_save_paynova_prompt_visible(): void {
    expect(screen.getByText(/save PayNova as saved payment method for future orders/i)).toBeInTheDocument();
  }

  then_save_vaultpay_prompt_visible(): void {
    expect(screen.getByText(/save VaultPay as saved payment method for future orders/i)).toBeInTheDocument();
  }
}

export { paymentMocks };
