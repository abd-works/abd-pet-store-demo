/**
 * Click-and-collect — client helper (Increment 2)
 */
import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AddToCartButton } from '../../../packages/product-catalog/client/AddToCartButton';
import type { CartDto } from '@pawplace/cart-shared';
import * as cartApi from '@pawplace/cart-client/cart.api';
import * as productApi from '@pawplace/product-catalog-client/product-catalog.api';
import * as storeApi from '@pawplace/store-client/store.api';
import * as orderApi from '@pawplace/order-client/order.api';
import { CartProvider, useCart } from '../../../packages/app-client/src/context/CartContext';
import { ShoppingCartPage } from '../../../packages/app-client/src/pages/ShoppingCartPage';
import { PickupStoreSelectionPage } from '../../../packages/app-client/src/pages/PickupStoreSelectionPage';
import { GuestBillingPage } from '../../../packages/app-client/src/pages/GuestBillingPage';
import { PaymentPage } from '../../../packages/app-client/src/pages/PaymentPage';
import { StripeWavePaymentPage } from '../../../packages/app-client/src/pages/payment/StripeWavePaymentPage';
import { OrderConfirmationPage } from '../../../packages/app-client/src/pages/OrderConfirmationPage';
import { ClickAndCollectQueuePage } from '../../../packages/app-client/src/pages/ClickAndCollectQueuePage';
import { ClickAndCollectOrderDetailPage } from '../../../packages/app-client/src/pages/ClickAndCollectOrderDetailPage';
import { CustomerNav } from '../../../packages/app-client/src/components/CustomerNav';
import {
  ClickAndCollectBase,
  type BillingAddressTestData,
} from './click-and-collect.base';

const paymentMocks = vi.hoisted(() => ({
  payOrder: vi.fn(),
  fetchPaymentRetryStatus: vi.fn(),
  startVendorPayment: vi.fn(),
}));

vi.mock('@pawplace/cart-client/cart.api');
vi.mock('@pawplace/product-catalog-client/product-catalog.api');
vi.mock('@pawplace/store-client/store.api');
vi.mock('@pawplace/order-client/order.api');
vi.mock('@pawplace/payment-client/payment.api', () => ({
  payOrder: paymentMocks.payOrder,
  fetchPaymentRetryStatus: paymentMocks.fetchPaymentRetryStatus,
  startVendorPayment: paymentMocks.startVendorPayment,
}));

export { paymentMocks };

const emptyCart: CartDto = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  subtotalFormatted: '£0.00',
};

function line(sku: string, name: string, price: string, quantity: number) {
  const unit = Number(price.replace(/[^\d.]/g, ''));
  return {
    sku,
    name,
    price,
    quantity,
    lineTotal: unit * quantity,
  };
}

function ProductPageHarness({ sku, inStock }: { sku: string; inStock: boolean }) {
  const { addItem } = useCart();
  return (
    <div data-testid="product-page">
      <CustomerNav />
      <AddToCartButton
        sku={sku}
        disabled={!inStock}
        unavailabilityMessage={inStock ? undefined : 'Out of stock — check back soon'}
        onAdd={addItem}
      />
    </div>
  );
}

export class ClickAndCollectClientHelper extends ClickAndCollectBase {
  private cartState: CartDto = { ...emptyCart };

  async seed(): Promise<void> {
    this.cartState = { ...emptyCart };
    vi.mocked(cartApi.fetchCart).mockImplementation(async () => ({
      ...this.cartState,
      items: [...this.cartState.items],
    }));
    vi.mocked(cartApi.addCartItem).mockImplementation(async (sku, quantity = 1) => {
      const product = ClickAndCollectBase.PRODUCTS.find((p) => p.sku === sku)!;
      const existing = this.cartState.items.find((item) => item.sku === sku);
      if (existing) {
        existing.quantity += quantity;
        existing.lineTotal = existing.quantity * Number(product.price.replace(/[^\d.]/g, ''));
      } else {
        this.cartState.items.push(line(sku, product.product_name, product.price, quantity));
      }
      this.cartState.itemCount = this.cartState.items.reduce((sum, item) => sum + item.quantity, 0);
      this.cartState.subtotal = this.cartState.items.reduce((sum, item) => sum + item.lineTotal, 0);
      this.cartState.subtotalFormatted = `£${this.cartState.subtotal.toFixed(2)}`;
      return { ...this.cartState, items: [...this.cartState.items] };
    });
    vi.mocked(cartApi.updateCartItemQuantity).mockImplementation(async (sku, quantity) => {
      if (quantity === 0) {
        this.cartState.items = this.cartState.items.filter((item) => item.sku !== sku);
      } else {
        const item = this.cartState.items.find((row) => row.sku === sku)!;
        const unit = item.lineTotal / item.quantity;
        item.quantity = quantity;
        item.lineTotal = unit * quantity;
      }
      this.cartState.itemCount = this.cartState.items.reduce((sum, item) => sum + item.quantity, 0);
      this.cartState.subtotal = this.cartState.items.reduce((sum, item) => sum + item.lineTotal, 0);
      this.cartState.subtotalFormatted = `£${this.cartState.subtotal.toFixed(2)}`;
      return { ...this.cartState, items: [...this.cartState.items] };
    });
    vi.mocked(cartApi.removeCartItem).mockImplementation(async (sku) => {
      this.cartState.items = this.cartState.items.filter((item) => item.sku !== sku);
      this.cartState.itemCount = this.cartState.items.reduce((sum, item) => sum + item.quantity, 0);
      this.cartState.subtotal = this.cartState.items.reduce((sum, item) => sum + item.lineTotal, 0);
      this.cartState.subtotalFormatted = `£${this.cartState.subtotal.toFixed(2)}`;
      return { ...this.cartState, items: [...this.cartState.items] };
    });

    vi.mocked(productApi.fetchStockAvailability).mockImplementation(async (sku) => {
      if (sku === 'PET-FLT-099') {
        return [{ store_code: 'STR-001', store_name: 'PawPlace Camden', stock_label: 'Out of Stock' }];
      }
      const stock = ClickAndCollectBase.STOCK.find((row) => row.product_sku === sku && row.store_code === 'STR-001');
      const qty = stock?.available_to_sell_quantity ?? 0;
      return [{
        store_code: 'STR-001',
        store_name: 'PawPlace Camden',
        stock_label: qty > 0 ? `In Stock (${qty})` : 'Out of Stock',
      }];
    });

    vi.mocked(storeApi.fetchStores).mockResolvedValue(
      ClickAndCollectBase.STORES.map((store) => ({
        storeName: store.store_name,
        storeCode: store.store_code,
        addressLineOne: store.address_line_one,
        city: store.city,
        postcode: store.postcode,
        phoneNumber: '020-0000-0000',
        emailAddress: 'store@pawplace.co.uk',
      })),
    );
    vi.mocked(orderApi.fetchClickAndCollectQueue).mockResolvedValue([]);
  }

  async cleanup(): Promise<void> {
    // Do not use vi.resetAllMocks() — it clears mock implementations globally and
    // races with ship-to-home queue tests (fetchClickAndCollectQueue undefined).
    sessionStorage.clear();
    vi.clearAllMocks();
    paymentMocks.payOrder.mockReset();
    this.cartState = { ...emptyCart };
    vi.mocked(orderApi.fetchClickAndCollectQueue).mockImplementation(async () => []);
    vi.mocked(orderApi.fetchOrderQueue).mockImplementation(async () => []);
  }

  given_cart_state(cart: CartDto): void {
    this.cartState = cart;
  }

  renderWithCart(ui: React.ReactElement, route = '/', path = '/*') {
    return render(
      React.createElement(
        MemoryRouter,
        { initialEntries: [route] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path, element: React.createElement(CartProvider, null, ui) }),
        ),
      ),
    );
  }

  renderPaymentFlow(initialRoute = '/checkout/payment') {
    return render(
      React.createElement(
        MemoryRouter,
        { initialEntries: [initialRoute] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: '/checkout/payment',
            element: React.createElement(CartProvider, null, React.createElement(PaymentPage)),
          }),
          React.createElement(Route, {
            path: '/checkout/payment/stripewave',
            element: React.createElement(CartProvider, null, React.createElement(StripeWavePaymentPage)),
          }),
          React.createElement(Route, {
            path: '/order-confirmation/:orderNumber',
            element: React.createElement(CartProvider, null, React.createElement(OrderConfirmationPage)),
          }),
        ),
      ),
    );
  }

  async when_customer_views_product_page(sku: string, inStock: boolean) {
    this.renderWithCart(React.createElement(ProductPageHarness, { sku, inStock }), `/products/${sku}`);
    await waitFor(() => screen.getByTestId('product-page'));
  }

  async when_customer_clicks_add_to_cart() {
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
  }

  async when_customer_views_shopping_cart() {
    this.renderWithCart(React.createElement(ShoppingCartPage), '/cart');
    await waitFor(() => screen.getByText(/cart total/i));
  }

  async when_customer_changes_quantity(sku: string, value: string) {
    const row = screen.getByTestId(`cart-item-${sku}`);
    const input = within(row).getByRole('spinbutton');
    fireEvent.change(input, { target: { value } });
    fireEvent.blur(input);
    await waitFor(() => true);
  }

  async when_customer_removes_item(sku: string) {
    const row = screen.getByTestId(`cart-item-${sku}`);
    await userEvent.click(within(row).getByRole('button', { name: /remove/i }));
  }

  async when_customer_views_pickup_store_selection() {
    this.given_cart_state({
      items: [line('PET-HAR-001', 'Premium Dog Harness', '£34.99', 1)],
      itemCount: 1,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    this.renderWithCart(React.createElement(PickupStoreSelectionPage), '/checkout/pickup-store');
    await waitFor(() => screen.getByTestId('pickup-store-list'));
  }

  async when_customer_selects_pickup_store(storeName: string) {
    const listItem = screen.getByText(storeName).closest('li')!;
    await userEvent.click(within(listItem).getByRole('button', { name: /select pickup store/i }));
  }

  async when_customer_views_guest_billing() {
    this.given_cart_state({
      items: [line('PET-HAR-001', 'Premium Dog Harness', '£34.99', 1)],
      itemCount: 1,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    sessionStorage.setItem(
      'pawplace-checkout-draft',
      JSON.stringify({
        pickupStoreCode: 'STR-001',
        pickupStoreName: 'PawPlace Camden',
        pickupStoreAddress: '42 High Street, London NW1 8QP',
      }),
    );
    this.renderWithCart(React.createElement(GuestBillingPage), '/checkout/billing');
    await waitFor(() => screen.getByLabelText(/guest email/i));
  }

  async when_customer_fills_billing(billing: BillingAddressTestData, guestEmail: string, guestName: string) {
    fireEvent.change(screen.getByLabelText(/guest email/i), { target: { value: guestEmail } });
    fireEvent.change(document.getElementById('guest-name')!, { target: { value: guestName } });
    for (const field of ['addressLine1', 'city', 'countyOrRegion', 'postcode', 'country'] as const) {
      fireEvent.change(screen.getByLabelText(new RegExp(field, 'i')), { target: { value: billing[field] } });
    }
  }

  async when_customer_submits_billing() {
    await userEvent.click(screen.getByRole('button', { name: /continue to payment/i }));
  }

  async when_customer_views_payment_page(orderNumber: string) {
    sessionStorage.setItem(
      'pawplace-checkout-draft',
      JSON.stringify({
        pickupStoreCode: 'STR-001',
        pickupStoreName: 'PawPlace Camden',
        orderNumber,
        billingAddress: ClickAndCollectBase.VALID_BILLING,
      }),
    );
    this.given_cart_state({
      items: [line('PET-HAR-001', 'Premium Dog Harness', '£34.99', 1)],
      itemCount: 1,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    this.renderPaymentFlow('/checkout/payment/stripewave');
    await waitFor(() => screen.getByTestId('stripewave-fields'), { timeout: 5000 });
  }

  async when_customer_enters_card(cardNumber: string, expiry: string, cvv: string) {
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: cardNumber } });
    fireEvent.change(screen.getByLabelText(/expiry/i), { target: { value: expiry } });
    if (cvv) {
      fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: cvv } });
    }
  }

  async when_customer_confirms_payment() {
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /confirm order/i })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm order/i }));
  }

  async when_customer_views_order_confirmation(orderNumber: string, emailStatus: 'queued' | 'sent' = 'queued') {
    vi.mocked(orderApi.fetchOrder).mockResolvedValue({
      orderNumber,
      status: 'confirmed',
      guestEmail: ClickAndCollectBase.VALID_GUEST.guest_email,
      guestName: ClickAndCollectBase.VALID_GUEST.guest_name,
      billingAddress: ClickAndCollectBase.VALID_BILLING,
      pickupStore: {
        storeCode: 'STR-001',
        storeName: 'PawPlace Camden',
        addressLineOne: '42 High Street',
        city: 'London',
        postcode: 'NW1 8QP',
      },
      items: [line('PET-HAR-001', 'Premium Dog Harness', '£34.99', 1)],
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
      emailStatus,
      maskedPaymentMethod: 'StripeWave •••• 4242',
    });
    this.renderWithCart(
      React.createElement(OrderConfirmationPage),
      `/order-confirmation/${orderNumber}`,
      '/order-confirmation/:orderNumber',
    );
    await waitFor(() => screen.getByTestId('order-confirmation'));
  }

  async when_staff_views_empty_queue() {
    vi.mocked(orderApi.fetchClickAndCollectQueue).mockResolvedValue([]);
    vi.mocked(storeApi.fetchStores).mockResolvedValue([
      {
        storeName: 'PawPlace Camden',
        storeCode: 'STR-001',
        addressLineOne: '42 High Street',
        city: 'London',
        postcode: 'NW1 8QP',
        phoneNumber: '020-0000-0000',
        emailAddress: 'store@pawplace.co.uk',
      },
    ]);
    this.renderWithCart(React.createElement(ClickAndCollectQueuePage), '/admin/click-and-collect');
    await waitFor(() => screen.getByTestId('queue-empty-state'));
  }

  async when_staff_views_order_detail(orderNumber: string, status: string) {
    vi.mocked(orderApi.fetchOrder).mockResolvedValue({
      orderNumber,
      status,
      guestEmail: ClickAndCollectBase.VALID_GUEST.guest_email,
      guestName: ClickAndCollectBase.VALID_GUEST.guest_name,
      billingAddress: ClickAndCollectBase.VALID_BILLING,
      pickupStore: {
        storeCode: 'STR-001',
        storeName: 'PawPlace Camden',
        addressLineOne: '42 High Street',
        city: 'London',
        postcode: 'NW1 8QP',
      },
      items: [line('PET-HAR-001', 'Premium Dog Harness', '£34.99', 1)],
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    this.renderWithCart(
      React.createElement(ClickAndCollectOrderDetailPage),
      `/admin/click-and-collect/${orderNumber}`,
      '/admin/click-and-collect/:orderNumber',
    );
    await waitFor(() => screen.getByText(/order number/i));
  }

  then_cart_badge_shows(count: number): void {
    expect(
      screen.getByRole('link', { name: new RegExp(`shopping cart \\(${count}`, 'i') }),
    ).toBeInTheDocument();
  }

  then_add_to_cart_disabled(): void {
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  }

  then_out_of_stock_message(): void {
    expect(screen.getByText(/out of stock — check back soon/i)).toBeInTheDocument();
  }

  then_cart_subtotal_displayed(amount: string): void {
    const aside = screen.getByLabelText(/cart summary/i);
    expect(within(aside).getByText(new RegExp(amount.replace('.', '\\.'), 'i'))).toBeInTheDocument();
  }

  then_empty_cart_message(): void {
    expect(screen.getByTestId('empty-cart-message')).toHaveTextContent(/empty/i);
  }

  then_checkout_unavailable(): void {
    expect(screen.queryByTestId('proceed-to-checkout')).not.toBeInTheDocument();
  }

  then_continue_shopping_link(): void {
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
  }

  then_pickup_store_list_count(count: number): void {
    expect(within(screen.getByTestId('pickup-store-list')).getAllByRole('listitem')).toHaveLength(count);
  }

  then_click_and_collect_only(): void {
    expect(screen.getByText(/click-and-collect only/i)).toBeInTheDocument();
  }

  then_guest_checkout_default(): void {
    expect(screen.getByText(/guest checkout — no login/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
  }

  then_stripewave_sole_vendor(): void {
    const paymentSection = document.querySelector('section[aria-label="payment"]') as HTMLElement;
    expect(within(paymentSection).getByText(/StripeWave/i)).toBeInTheDocument();
  }

  then_labeled_paragraph(label: RegExp, expected: string | RegExp, container?: HTMLElement): void {
    const root = container ?? document.body;
    const paragraph = within(root).getByText(label).closest('p');
    expect(paragraph).not.toBeNull();
    if (typeof expected === 'string') {
      expect(paragraph).toHaveTextContent(expected);
    } else {
      expect(paragraph?.textContent ?? '').toMatch(expected);
    }
  }

  then_validation_error(message: RegExp): void {
    const matches = screen.getAllByText(message);
    expect(matches.length).toBeGreaterThan(0);
  }

  then_account_prompt_visible(): void {
    expect(screen.getByText(/create a customer account/i)).toBeInTheDocument();
  }

  then_queue_empty_state(): void {
    expect(screen.getByTestId('queue-empty-state')).toBeInTheDocument();
  }
}
