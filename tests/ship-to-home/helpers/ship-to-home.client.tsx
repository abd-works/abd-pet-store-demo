/**
 * Ship to home — client helper (Increment 3)
 */
import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { OrderDto, OrderStatusDto } from '@pawplace/order-shared';
import { ClickAndCollectClientHelper, paymentMocks } from '../../click-and-collect/helpers/click-and-collect.client';
import * as orderApi from '@pawplace/order-client/order.api';
import { CartProvider } from '../../../packages/app-client/src/context/CartContext';
import { ShippingAddressPage } from '../../../packages/app-client/src/pages/ShippingAddressPage';
import { DeliveryOptionPage } from '../../../packages/app-client/src/pages/DeliveryOptionPage';
import { GuestBillingPage } from '../../../packages/app-client/src/pages/GuestBillingPage';
import { PaymentPage } from '../../../packages/app-client/src/pages/PaymentPage';
import { PickupStoreSelectionPage } from '../../../packages/app-client/src/pages/PickupStoreSelectionPage';
import { OrderQueuePage } from '../../../packages/app-client/src/pages/OrderQueuePage';
import { ShipToHomeOrderDetailPage } from '../../../packages/app-client/src/pages/ShipToHomeOrderDetailPage';
import { OrderLookupPage } from '../../../packages/app-client/src/pages/OrderLookupPage';
import { OrderStatusPage } from '../../../packages/app-client/src/pages/OrderStatusPage';
import {
  ShipToHomeBase,
  type BillingAddressTestData,
  type ShippingAddressTestData,
} from './ship-to-home.base';

function cartLine() {
  return {
    items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
    itemCount: 1,
    subtotal: 34.99,
    subtotalFormatted: '£34.99',
  };
}

export class ShipToHomeClientHelper extends ClickAndCollectClientHelper {
  private navigateSpy: ReturnType<typeof vi.fn> | null = null;

  async seed(): Promise<void> {
    await super.seed();
    vi.mocked(orderApi.placeGuestOrder).mockImplementation(async (input) => ({
      orderNumber: 'ORD-3001',
      status: 'pending_payment',
      guestEmail: input.guestEmail,
      guestName: input.guestName,
      billingAddress: input.billingAddress,
      shippingAddress: input.shippingAddress,
      deliveryOption: input.deliveryOption ?? { type: 'click_and_collect' },
      items: cartLine().items,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
      shippingCostPence: input.deliveryOption?.type === 'standard_delivery' ? 499 : undefined,
      shippingCostFormatted: input.deliveryOption?.type === 'standard_delivery' ? '£4.99' : undefined,
      deliveryTypeLabel: input.deliveryOption?.type === 'standard_delivery' ? 'Standard Delivery' : 'Click-and-Collect',
    }));
    vi.mocked(orderApi.fetchOrder).mockImplementation(async (orderNumber) => ({
      orderNumber,
      status: 'confirmed',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      guestName: ShipToHomeBase.VALID_GUEST.guest_name,
      billingAddress: ShipToHomeBase.VALID_BILLING,
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
      items: cartLine().items,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
      deliveryTypeLabel: 'Standard Delivery',
    }));
    vi.mocked(orderApi.fetchOrderQueue).mockResolvedValue([]);
    vi.mocked(orderApi.fetchOrderStatus).mockImplementation(async (orderNumber) => ({
      orderNumber,
      status: 'confirmed',
      statusLabel: 'Confirmed',
      deliveryOptionLabel: 'Standard Delivery',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      lineItems: cartLine().items,
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      trackingPendingMessage: 'Tracking will be available once your order ships',
    }));
    vi.mocked(orderApi.lookupOrderStatus).mockImplementation(async (orderNumber, guestEmail) => ({
      orderNumber,
      status: 'confirmed',
      statusLabel: 'Confirmed',
      deliveryOptionLabel: 'Standard Delivery',
      guestEmail,
      lineItems: cartLine().items,
      trackingPendingMessage: 'Tracking will be available once your order ships',
    }));
    vi.mocked(orderApi.markOrderFulfilled).mockImplementation(async (orderNumber, tracking) => ({
      order: {
        orderNumber,
        status: tracking?.trackingNumber ? 'shipped' : 'fulfilled',
        guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
        guestName: ShipToHomeBase.VALID_GUEST.guest_name,
        billingAddress: ShipToHomeBase.VALID_BILLING,
        shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
        deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
        items: cartLine().items,
        subtotal: 34.99,
        subtotalFormatted: '£34.99',
        trackingNumber: tracking?.trackingNumber
          ? { value: tracking.trackingNumber, carrierName: tracking.carrierName ?? 'Royal Mail' }
          : undefined,
      },
      warning: tracking?.trackingNumber ? undefined : 'Customer will not receive a shipping notification',
    }));
    vi.mocked(orderApi.addOrderTrackingNumber).mockImplementation(async (orderNumber, tracking) => ({
      orderNumber,
      status: 'shipped',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      guestName: ShipToHomeBase.VALID_GUEST.guest_name,
      billingAddress: ShipToHomeBase.VALID_BILLING,
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
      items: cartLine().items,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
      trackingNumber: { value: tracking.trackingNumber, carrierName: tracking.carrierName },
    }));
    this.restoreSharedOrderApiMocks();
  }

  async cleanup(): Promise<void> {
    // Do not call super.cleanup() — its vi.resetAllMocks() clears mock implementations
    // globally and races with parallel click-and-collect client tests.
    sessionStorage.clear();
    vi.clearAllMocks();
    paymentMocks.payOrder.mockReset();
    this.restoreSharedOrderApiMocks();
  }

  /** Defaults shared with Increment 2 queue tests — always leave a resolved Promise stub. */
  private restoreSharedOrderApiMocks(): void {
    vi.mocked(orderApi.fetchClickAndCollectQueue).mockImplementation(async () => []);
    vi.mocked(orderApi.fetchOrderQueue).mockImplementation(async () => []);
  }

  renderCheckoutPage(ui: React.ReactElement, route: string, paths: string[] = [route, '/checkout/delivery-option', '/checkout/pickup-store', '/checkout/billing', '/checkout/shipping']) {
    const routeElements: Record<string, React.ReactElement> = {
      '/checkout/shipping': React.createElement(ShippingAddressPage),
      '/checkout/delivery-option': React.createElement(DeliveryOptionPage),
      '/checkout/pickup-store': React.createElement(PickupStoreSelectionPage),
      '/checkout/billing': React.createElement(GuestBillingPage),
      '/checkout/payment': React.createElement(PaymentPage),
    };
    const allPaths = [...new Set([...paths, '/checkout/payment'])];
    return render(
      React.createElement(
        MemoryRouter,
        { initialEntries: [route] },
        React.createElement(
          Routes,
          null,
          allPaths.map((path) =>
            React.createElement(Route, {
              key: path,
              path,
              element: React.createElement(CartProvider, null, routeElements[path] ?? ui),
            }),
          ),
        ),
      ),
    );
  }

  async when_customer_views_shipping_address(
    billing: BillingAddressTestData = ShipToHomeBase.VALID_BILLING,
    checkoutPath: 'standard_delivery' | 'click_and_collect' = 'standard_delivery',
  ) {
    sessionStorage.setItem(
      'pawplace-checkout-draft',
      JSON.stringify({
        checkoutPath,
        deliveryOption: checkoutPath,
        guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
        guestName: ShipToHomeBase.VALID_GUEST.guest_name,
        billingAddress: billing,
      }),
    );
    this.given_cart_state(cartLine());
    this.renderCheckoutPage(React.createElement(ShippingAddressPage), '/checkout/shipping');
    await waitFor(() => screen.getByLabelText(/same as billing/i));
  }

  async when_customer_checks_same_as_billing() {
    await userEvent.click(screen.getByLabelText(/same as billing/i));
  }

  async when_customer_overrides_shipping_city(city: string) {
    fireEvent.change(screen.getByLabelText(/^city$/i), { target: { value: city } });
  }

  async when_customer_submits_shipping_address() {
    await userEvent.click(screen.getByRole('button', { name: /continue to delivery option/i }));
  }

  async when_customer_views_delivery_option(
    draft: Record<string, unknown> = {
      checkoutPath: 'standard_delivery',
      deliveryOption: 'standard_delivery',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      guestName: ShipToHomeBase.VALID_GUEST.guest_name,
      billingAddress: ShipToHomeBase.VALID_BILLING,
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
    },
  ) {
    sessionStorage.setItem('pawplace-checkout-draft', JSON.stringify(draft));
    this.given_cart_state(cartLine());
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/checkout/delivery-option'] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: '/checkout/delivery-option',
            element: React.createElement(CartProvider, null, React.createElement(DeliveryOptionPage)),
          }),
          React.createElement(Route, {
            path: '/checkout/payment',
            element: React.createElement(CartProvider, null, React.createElement(PaymentPage)),
          }),
        ),
      ),
    );
    await waitFor(() => screen.getByLabelText(/standard delivery/i));
  }

  async when_customer_selects_delivery_option(option: 'standard_delivery' | 'click_and_collect') {
    const label = option === 'standard_delivery' ? /standard delivery/i : /click-and-collect/i;
    await userEvent.click(screen.getByLabelText(label));
  }

  async when_customer_confirms_delivery_option() {
    await userEvent.click(screen.getByRole('button', { name: /continue to payment|continue to billing address|continue to pickup store/i }));
  }

  async when_customer_views_billing_after_click_and_collect() {
    sessionStorage.setItem(
      'pawplace-checkout-draft',
      JSON.stringify({
        checkoutPath: 'click_and_collect',
        deliveryOption: 'click_and_collect',
        pickupStoreCode: 'STR-001',
        pickupStoreName: 'PawPlace Camden',
      }),
    );
    this.given_cart_state(cartLine());
    this.renderCheckoutPage(React.createElement(GuestBillingPage), '/checkout/billing', [
      '/checkout/billing',
      '/checkout/pickup-store',
      '/checkout/shipping',
    ]);
    await waitFor(() => screen.getByLabelText(/guest email/i));
  }

  async when_staff_views_unified_queue(orders: OrderDto[]) {
    vi.mocked(orderApi.fetchOrderQueue).mockResolvedValue(orders);
    this.renderWithCart(React.createElement(OrderQueuePage), '/admin/orders');
    await waitFor(() => screen.getByTestId(orders.length > 0 ? 'order-queue' : 'queue-empty-state'));
    if (orders.length > 0) {
      await waitFor(() => screen.getByText(orders[0].orderNumber));
    }
  }

  async when_staff_views_ship_to_home_detail(order: OrderDto) {
    vi.mocked(orderApi.fetchOrder).mockResolvedValue(order);
    vi.mocked(orderApi.markOrderFulfilled).mockImplementation(async (_orderNumber, tracking) => ({
      order: {
        ...order,
        status: tracking?.trackingNumber ? 'shipped' : 'fulfilled',
        trackingNumber: tracking?.trackingNumber
          ? { value: tracking.trackingNumber, carrierName: tracking.carrierName ?? 'Royal Mail' }
          : undefined,
      },
      warning: tracking?.trackingNumber ? undefined : 'Customer will not receive a shipping notification',
    }));
    this.renderWithCart(
      React.createElement(ShipToHomeOrderDetailPage),
      `/admin/orders/${order.orderNumber}/ship-to-home`,
      '/admin/orders/:orderNumber/ship-to-home',
    );
    await waitFor(() => screen.getByText(order.orderNumber));
    if (order.shippingAddress?.addressLine1) {
      await waitFor(() => screen.getByText(new RegExp(order.shippingAddress!.addressLine1, 'i')));
    }
  }

  async when_staff_marks_fulfilled_without_tracking() {
    await userEvent.click(screen.getByRole('button', { name: /mark as fulfilled/i }));
    await waitFor(() => screen.getByText('Customer will not receive a shipping notification'));
  }

  async when_staff_enters_tracking(carrierName: string, trackingNumber: string) {
    fireEvent.change(screen.getByLabelText(/carrier name/i), { target: { value: carrierName } });
    fireEvent.change(screen.getByLabelText(/tracking number/i), { target: { value: trackingNumber } });
  }

  async when_staff_marks_fulfilled_with_tracking() {
    await userEvent.click(screen.getByRole('button', { name: /mark as fulfilled/i }));
    await waitFor(() => screen.getByText(/shipped/i));
  }

  async when_guest_views_order_lookup() {
    this.renderWithCart(React.createElement(OrderLookupPage), '/orders/lookup');
    await waitFor(() => screen.getByLabelText(/order number/i));
  }

  async when_guest_submits_lookup(orderNumber: string, guestEmail: string) {
    fireEvent.change(screen.getByLabelText(/order number/i), { target: { value: orderNumber } });
    fireEvent.change(screen.getByLabelText(/guest email/i), { target: { value: guestEmail } });
    await userEvent.click(screen.getByRole('button', { name: /look up order/i }));
  }

  given_lookup_rejects(error: Error): void {
    vi.mocked(orderApi.lookupOrderStatus).mockRejectedValueOnce(error);
  }

  async when_guest_views_order_status(status: OrderStatusDto) {
    vi.mocked(orderApi.fetchOrderStatus).mockResolvedValue(status);
    this.renderWithCart(
      React.createElement(OrderStatusPage),
      `/orders/status/${status.orderNumber}`,
      '/orders/status/:orderNumber',
    );
    await waitFor(() => screen.getByText(status.statusLabel));
  }

  then_shipping_form_fields_present(): void {
    expect(screen.getByLabelText(/recipient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address line 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  }

  then_shipping_prefilled(shipping: ShippingAddressTestData): void {
    expect(screen.getByLabelText(/recipient name/i)).toHaveValue(shipping.recipientName);
    expect(screen.getByLabelText(/address line 1/i)).toHaveValue(shipping.addressLine1);
    expect(screen.getByLabelText(/^city$/i)).toHaveValue(shipping.city);
    expect(screen.getByLabelText(/postcode/i)).toHaveValue(shipping.postcode);
  }

  then_shipping_city(city: string): void {
    expect(screen.getByLabelText(/^city$/i)).toHaveValue(city);
  }

  then_shipping_address_line_one(line: string): void {
    expect(screen.getByLabelText(/address line 1/i)).toHaveValue(line);
  }

  then_shipping_validation_errors(messages: RegExp[]): void {
    for (const message of messages) {
      this.then_validation_error(message);
    }
  }

  then_billing_continue_label(label: RegExp): void {
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  }

  then_delivery_options_visible(): void {
    expect(screen.getByLabelText(/standard delivery/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/click-and-collect/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/express/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/same-day/i)).not.toBeInTheDocument();
  }

  then_pickup_store_list_visible(): void {
    expect(screen.getByTestId('pickup-store-list')).toBeInTheDocument();
  }

  then_shipping_address_summary(text: string): void {
    expect(screen.getAllByText(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).length).toBeGreaterThan(0);
  }

  then_queue_shows_delivery_label(label: string): void {
    expect(screen.getByText(new RegExp(`delivery type label: ${label}`, 'i'))).toBeInTheDocument();
  }

  then_fulfillment_warning(message: string): void {
    expect(screen.getByText(message)).toBeInTheDocument();
  }

  then_lookup_error(message: string): void {
    expect(screen.getByText(message)).toBeInTheDocument();
  }

  then_status_label(label: string): void {
    expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
  }

  then_tracking_link(trackingNumber: string): void {
    expect(screen.getByRole('link', { name: new RegExp(trackingNumber, 'i') })).toBeInTheDocument();
  }

  then_tracking_pending_message(message: string): void {
    expect(screen.getByRole('status')).toHaveTextContent(message);
  }
}
