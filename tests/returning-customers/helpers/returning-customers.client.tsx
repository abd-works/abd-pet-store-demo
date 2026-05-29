/**
 * Returning customers — client helper (Increment 4)
 */
import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type {
  AccountDashboardDto,
  SavedAddressDto,
  SavedPaymentMethodDto,
  WishlistItemDto,
} from '@pawplace/customer-account-shared';
import type { OrderDto } from '@pawplace/order-shared';
import { ShipToHomeClientHelper } from '../../ship-to-home/helpers/ship-to-home.client';
import { ReturningCustomersBase, type SavedAddressTestData } from './returning-customers.base';
import { RegisterPage } from '../../../packages/app-client/src/pages/auth/RegisterPage';
import { RegistrationConfirmationPage } from '../../../packages/app-client/src/pages/auth/RegistrationConfirmationPage';
import { LoginPage } from '../../../packages/app-client/src/pages/auth/LoginPage';
import {
  VerifyEmailSuccessPage,
  VerifyEmailExpiredPage,
  VerifyEmailHandlerPage,
} from '../../../packages/app-client/src/pages/auth/VerifyEmailPage';
import { ResetPasswordRequestPage } from '../../../packages/app-client/src/pages/auth/ResetPasswordRequestPage';
import { ResetPasswordSetPage } from '../../../packages/app-client/src/pages/auth/ResetPasswordSetPage';
import { AccountDashboardPage } from '../../../packages/app-client/src/pages/account/AccountDashboardPage';
import { AddressBookPage } from '../../../packages/app-client/src/pages/account/AddressBookPage';
import { EditSavedAddressPage } from '../../../packages/app-client/src/pages/account/EditSavedAddressPage';
import { SavedPaymentMethodsPage } from '../../../packages/app-client/src/pages/account/SavedPaymentMethodsPage';
import { OrderHistoryPage } from '../../../packages/app-client/src/pages/account/OrderHistoryPage';
import { OrderHistoryDetailPage } from '../../../packages/app-client/src/pages/account/OrderHistoryDetailPage';
import { WishlistPage } from '../../../packages/app-client/src/pages/account/WishlistPage';
import { WishlistButton } from '../../../packages/app-client/src/components/WishlistButton';
import { ShippingAddressPage } from '../../../packages/app-client/src/pages/ShippingAddressPage';
import { PaymentPage } from '../../../packages/app-client/src/pages/PaymentPage';
import { CustomerSessionProvider } from '../../../packages/app-client/src/context/CustomerSessionContext';
import { CartProvider } from '../../../packages/app-client/src/context/CartContext';
import { CheckoutProvider } from '../../../packages/app-client/src/context/CheckoutContext';
import type { OrderHistorySummary } from '@pawplace/customer-account-client/account.api';
import { authApiMocks, accountApiMocks, wishlistApiMocks } from '../setup.client-mocks';

const verifiedJane: AccountDashboardDto = {
  email: ReturningCustomersBase.JANE.email,
  firstName: ReturningCustomersBase.JANE.firstName,
  lastName: ReturningCustomersBase.JANE.lastName,
  accountVerificationStatus: 'verified',
};

function parseInitialEntry(initialPath: string, initialState?: unknown) {
  const queryIndex = initialPath.indexOf('?');
  if (queryIndex === -1) {
    return { pathname: initialPath, state: initialState };
  }
  return {
    pathname: initialPath.slice(0, queryIndex),
    search: initialPath.slice(queryIndex),
    state: initialState,
  };
}

function AppShell({
  children,
  initialPath = '/',
  initialState,
}: {
  children: React.ReactNode;
  initialPath?: string;
  initialState?: unknown;
}) {
  return (
    <MemoryRouter initialEntries={[parseInitialEntry(initialPath, initialState)]}>
      <CustomerSessionProvider>
        <CartProvider>
          <CheckoutProvider>
            <Routes>{children}</Routes>
          </CheckoutProvider>
        </CartProvider>
      </CustomerSessionProvider>
    </MemoryRouter>
  );
}

export class ReturningCustomersClientHelper extends ShipToHomeClientHelper {
  private addresses: SavedAddressDto[] = [];
  private paymentMethods: SavedPaymentMethodDto[] = [];
  private wishlistItems: WishlistItemDto[] = [];
  private orderHistory: OrderHistorySummary[] = [];

  async seed(): Promise<void> {
    await super.seed();
    this.addresses = [];
    this.paymentMethods = [];
    this.wishlistItems = [];
    this.orderHistory = [];

    vi.mocked(authApiMocks.registerAccount).mockResolvedValue({ message: 'check your email to verify' });
    vi.mocked(authApiMocks.loginAccount).mockResolvedValue(verifiedJane);
    vi.mocked(authApiMocks.fetchCurrentAccount).mockResolvedValue(null);
    vi.mocked(authApiMocks.verifyEmailToken).mockResolvedValue({ outcome: 'success' });
    vi.mocked(authApiMocks.resendVerification).mockResolvedValue(undefined);
    vi.mocked(authApiMocks.requestPasswordReset).mockResolvedValue(undefined);
    vi.mocked(authApiMocks.confirmPasswordReset).mockResolvedValue(undefined);
    vi.mocked(authApiMocks.validateResetToken).mockImplementation(async (token: string) => token !== 'expired-token');
    vi.mocked(authApiMocks.logoutAccount).mockResolvedValue(undefined);
    vi.mocked(authApiMocks.logoutEverywhere).mockResolvedValue(undefined);

    vi.mocked(accountApiMocks.fetchSavedAddresses).mockImplementation(async () => [...this.addresses]);
    vi.mocked(accountApiMocks.saveAddress).mockImplementation(async (input) => {
      const created: SavedAddressDto = {
        id: `addr-${this.addresses.length + 1}`,
        ...input,
        addressLine2: input.addressLine2 ?? '',
        countyOrRegion: input.countyOrRegion ?? '',
        isDefault: this.addresses.length === 0,
      };
      this.addresses.push(created);
      return created;
    });
    vi.mocked(accountApiMocks.updateSavedAddress).mockImplementation(async (id, input) => {
      const index = this.addresses.findIndex((a) => a.id === id);
      const updated = { ...this.addresses[index], ...input, id };
      this.addresses[index] = updated;
      return updated;
    });
    vi.mocked(accountApiMocks.deleteSavedAddress).mockImplementation(async (id, newDefaultId) => {
      this.addresses = this.addresses.filter((a) => a.id !== id);
      if (newDefaultId) {
        this.addresses = this.addresses.map((a) => ({ ...a, isDefault: a.id === newDefaultId }));
      }
    });
    vi.mocked(accountApiMocks.setDefaultAddress).mockImplementation(async (id) => {
      this.addresses = this.addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    });
    vi.mocked(accountApiMocks.fetchSavedPaymentMethods).mockImplementation(async () => [...this.paymentMethods]);
    vi.mocked(accountApiMocks.fetchOrderHistory).mockImplementation(async () => [...this.orderHistory]);
    vi.mocked(accountApiMocks.fetchOrderDetail).mockResolvedValue({
      orderNumber: 'ORD-1002',
      status: 'shipped',
      statusLabel: 'Shipped',
      guestEmail: verifiedJane.email,
      guestName: 'Jane Doe',
      billingAddress: {
        name: 'Jane Doe',
        addressLine1: '10 Elm Avenue',
        addressLine2: '',
        city: 'London',
        countyOrRegion: '',
        postcode: 'SW1A 1AA',
        country: 'United Kingdom',
      },
      shippingAddress: {
        recipientName: 'Jane Doe',
        addressLine1: '42 Oak Lane',
        addressLine2: '',
        city: 'Bristol',
        countyOrRegion: '',
        postcode: 'BS1 4QT',
        country: 'United Kingdom',
      },
      deliveryOption: { type: 'standard_delivery', label: 'Standard Delivery' },
      items: [{ sku: 'SKU-CAT-TOY-05', name: 'Feather Wand Cat Toy', price: '£7.50', quantity: 3, lineTotal: 22.5 }],
      subtotal: 82.5,
      subtotalFormatted: '£82.50',
      maskedPaymentMethod: 'StripeWave •••• 4242',
      trackingNumber: { number: 'RM-1Z999AA10123456784' },
    } as OrderDto);
    vi.mocked(accountApiMocks.reorderOrder).mockResolvedValue({
      addedSkus: ['SKU-DOG-FOOD-01'],
      skippedSkus: [],
      stockWarnings: [],
    });

    vi.mocked(wishlistApiMocks.fetchWishlist).mockImplementation(async () => ({ items: [...this.wishlistItems] }));
    vi.mocked(wishlistApiMocks.addToWishlist).mockImplementation(async (sku) => {
      if (!this.wishlistItems.some((i) => i.sku === sku)) {
        this.wishlistItems.push({
          sku,
          productName: sku === ReturningCustomersBase.SKU_DOG_FOOD ? 'Premium Dog Kibble 5kg' : 'Feather Wand Cat Toy',
          price: '£29.99',
          stockAvailability: sku === ReturningCustomersBase.SKU_CAT_TOY ? 'Out of stock' : 'In stock',
        });
      }
    });
    vi.mocked(wishlistApiMocks.removeFromWishlist).mockImplementation(async (sku) => {
      this.wishlistItems = this.wishlistItems.filter((i) => i.sku !== sku);
    });
    vi.mocked(wishlistApiMocks.isInWishlist).mockImplementation(async (sku) =>
      this.wishlistItems.some((i) => i.sku === sku),
    );
  }

  async cleanup(): Promise<void> {
    vi.clearAllMocks();
    sessionStorage.clear();
    await super.cleanup();
  }

  given_verified_session(): void {
    vi.mocked(authApiMocks.fetchCurrentAccount).mockResolvedValue(verifiedJane);
  }

  given_guest_session(): void {
    vi.mocked(authApiMocks.fetchCurrentAccount).mockResolvedValue(null);
  }

  given_saved_addresses(rows: SavedAddressDto[]): void {
    this.addresses = rows;
  }

  given_saved_payment_methods(rows: SavedPaymentMethodDto[]): void {
    this.paymentMethods = rows;
  }

  given_order_history(rows: OrderHistorySummary[]): void {
    this.orderHistory = rows;
  }

  given_wishlist_items(items: WishlistItemDto[]): void {
    this.wishlistItems = items;
  }

  async when_customer_views_register_page(): Promise<void> {
    this.given_guest_session();
    render(
      <AppShell initialPath="/register">
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/confirmation" element={<RegistrationConfirmationPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByLabelText(/registration form/i));
  }

  async when_customer_submits_registration(data = ReturningCustomersBase.JANE): Promise<void> {
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: data.email } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: data.password } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: data.password } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: data.firstName } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: data.lastName } });
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
  }

  async when_customer_views_login_page(): Promise<void> {
    this.given_guest_session();
    render(
      <AppShell initialPath="/login">
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountDashboardPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByLabelText(/login form/i));
  }

  async when_customer_submits_login(email: string, password: string): Promise<void> {
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: password } });
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
  }

  async when_customer_views_verify_email_success(): Promise<void> {
    render(
      <AppShell initialPath="/verify-email/success">
        <Route path="/verify-email/success" element={<VerifyEmailSuccessPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByText(/you're verified/i));
  }

  async when_customer_views_verify_email_expired(): Promise<void> {
    vi.mocked(authApiMocks.verifyEmailToken).mockResolvedValue({ error: 'This verification link has expired' });
    render(
      <AppShell initialPath="/verify-email/expired?token=expired">
        <Route path="/verify-email/expired" element={<VerifyEmailExpiredPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByText(/verification link has expired/i));
  }

  async when_customer_views_reset_request(): Promise<void> {
    this.given_guest_session();
    render(
      <AppShell initialPath="/reset-password">
        <Route path="/reset-password" element={<ResetPasswordRequestPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByLabelText(/email address/i));
  }

  async when_customer_views_reset_set_form(token = 'reset-token'): Promise<void> {
    this.given_guest_session();
    render(
      <MemoryRouter initialEntries={[{ pathname: '/reset-password/set', search: `?token=${encodeURIComponent(token)}` }]}>
        <CustomerSessionProvider>
          <CartProvider>
            <CheckoutProvider>
              <Routes>
                <Route path="/reset-password/set" element={<ResetPasswordSetPage />} />
              </Routes>
            </CheckoutProvider>
          </CartProvider>
        </CustomerSessionProvider>
      </MemoryRouter>,
    );
    if (token === 'expired-token') {
      await waitFor(() => screen.getByText(/link expired/i));
      return;
    }
    await waitFor(() => screen.getByLabelText(/new password/i));
  }

  async when_customer_views_account_dashboard(): Promise<void> {
    this.given_verified_session();
    render(
      <AppShell initialPath="/account">
        <Route path="/account" element={<AccountDashboardPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByLabelText(/account overview/i));
  }

  async when_customer_views_address_book(): Promise<void> {
    this.given_verified_session();
    render(
      <AppShell initialPath="/account/addresses">
        <Route path="/account/addresses" element={<AddressBookPage />} />
        <Route path="/account/addresses/:id/edit" element={<EditSavedAddressPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByLabelText(/saved address list/i));
  }

  async when_customer_views_payment_methods(): Promise<void> {
    this.given_verified_session();
    render(
      <AppShell initialPath="/account/payment-methods">
        <Route path="/account/payment-methods" element={<SavedPaymentMethodsPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByLabelText(/saved payment method list/i));
  }

  async when_customer_views_order_history(): Promise<void> {
    this.given_verified_session();
    render(
      <AppShell initialPath="/account/orders">
        <Route path="/account/orders" element={<OrderHistoryPage />} />
        <Route path="/account/orders/:orderNumber" element={<OrderHistoryDetailPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByRole('heading', { name: /order history/i }));
  }

  async when_customer_views_order_detail(orderNumber: string): Promise<void> {
    this.given_verified_session();
    render(
      <AppShell initialPath={`/account/orders/${orderNumber}`}>
        <Route path="/account/orders/:orderNumber" element={<OrderHistoryDetailPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByLabelText(/order line item list/i));
  }

  async when_customer_views_wishlist(): Promise<void> {
    this.given_verified_session();
    render(
      <AppShell initialPath="/wishlist">
        <Route path="/wishlist" element={<WishlistPage />} />
      </AppShell>,
    );
    await waitFor(() => screen.getByRole('heading', { name: /wishlist page/i }));
  }

  async when_customer_views_logged_in_shipping(): Promise<void> {
    this.given_verified_session();
    this.given_saved_addresses([
      {
        id: 'addr-home',
        recipientName: 'Jane Doe',
        label: 'Home',
        addressLine1: ReturningCustomersBase.HOME_ADDRESS.addressLine1,
        addressLine2: '',
        city: ReturningCustomersBase.HOME_ADDRESS.city,
        countyOrRegion: '',
        postcode: ReturningCustomersBase.HOME_ADDRESS.postcode,
        country: ReturningCustomersBase.HOME_ADDRESS.country,
        isDefault: true,
      },
      {
        id: 'addr-work',
        recipientName: 'Jane Doe',
        label: 'Work',
        addressLine1: ReturningCustomersBase.WORK_ADDRESS.addressLine1,
        addressLine2: '',
        city: ReturningCustomersBase.WORK_ADDRESS.city,
        countyOrRegion: '',
        postcode: ReturningCustomersBase.WORK_ADDRESS.postcode,
        country: ReturningCustomersBase.WORK_ADDRESS.country,
        isDefault: false,
      },
    ]);
    sessionStorage.setItem('pawplace-checkout-draft', JSON.stringify({ deliveryOption: 'standard_delivery' }));
    this.given_cart_state({
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
      itemCount: 1,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    render(
      <MemoryRouter initialEntries={['/checkout/shipping']}>
        <CustomerSessionProvider>
          <CartProvider>
            <CheckoutProvider>
              <Routes>
                <Route path="/checkout/shipping" element={<ShippingAddressPage />} />
              </Routes>
            </CheckoutProvider>
          </CartProvider>
        </CustomerSessionProvider>
      </MemoryRouter>,
    );
    await waitFor(() => screen.getByLabelText(/saved address selection/i));
  }

  async when_customer_views_guest_shipping(): Promise<void> {
    this.given_guest_session();
    sessionStorage.setItem('pawplace-checkout-draft', JSON.stringify({ deliveryOption: 'standard_delivery' }));
    await this.when_customer_views_shipping_address();
    await waitFor(() => screen.getByLabelText(/shipping address/i));
  }

  async when_customer_views_logged_in_payment(): Promise<void> {
    this.given_verified_session();
    this.given_saved_payment_methods([
      {
        id: 'pm-4242',
        lastFour: '4242',
        cardType: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027,
        isDefault: true,
        isExpired: false,
      },
      {
        id: 'pm-expired',
        lastFour: '9999',
        cardType: 'Visa',
        expiryMonth: 1,
        expiryYear: 2024,
        isDefault: false,
        isExpired: true,
      },
    ]);
    sessionStorage.setItem(
      'pawplace-checkout-draft',
      JSON.stringify({ deliveryOption: 'standard_delivery', orderNumber: 'ORD-4001' }),
    );
    this.given_cart_state({
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
      itemCount: 1,
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    render(
      <MemoryRouter initialEntries={['/checkout/payment']}>
        <CustomerSessionProvider>
          <CartProvider>
            <CheckoutProvider>
              <Routes>
                <Route path="/checkout/payment" element={<PaymentPage />} />
              </Routes>
            </CheckoutProvider>
          </CartProvider>
        </CustomerSessionProvider>
      </MemoryRouter>,
    );
    await waitFor(() => screen.getByLabelText(/saved payment method selection/i));
  }

  async when_customer_views_product_wishlist_button(sku: string): Promise<void> {
    render(
      <AppShell initialPath={`/products/${sku}`}>
        <Route
          path="/products/:sku"
          element={
            <div data-testid="product-page">
              <WishlistButton sku={sku} />
            </div>
          }
        />
      </AppShell>,
    );
    await waitFor(() => screen.getByRole('button', { name: /wishlist/i }));
  }

  then_password_requirements_visible(): void {
    expect(screen.getByText(/minimum 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one digit/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one special character/i)).toBeInTheDocument();
  }

  then_duplicate_email_error(): void {
    expect(screen.getByRole('alert')).toHaveTextContent(/this email is already in use/i);
    expect(screen.getByRole('link', { name: /log in instead/i })).toBeInTheDocument();
  }

  then_login_error(message: RegExp | string): void {
    expect(screen.getByRole('alert')).toHaveTextContent(message);
  }

  then_resend_verification_visible(): void {
    expect(screen.getByRole('button', { name: /resend verification/i })).toBeInTheDocument();
  }

  then_default_address_indicator(): void {
    expect(screen.getByText(/default address indicator/i)).toBeInTheDocument();
  }

  then_address_listed(line: SavedAddressTestData): void {
    expect(screen.getByText(new RegExp(line.addressLine1, 'i'))).toBeInTheDocument();
  }

  then_empty_order_history_prompt(): void {
    expect(screen.getByLabelText(/order history empty state/i)).toHaveTextContent(/start shopping/i);
  }

  then_saved_address_preselected(label: string): void {
    expect(screen.getByRole('radio', { name: new RegExp(label, 'i') })).toBeChecked();
  }

  then_guest_shipping_prompt(): void {
    expect(screen.getByText(/log in or register for saved address benefit/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/saved address selection/i)).not.toBeInTheDocument();
  }

  then_saved_payment_preselected(lastFour: string): void {
    expect(screen.getByRole('radio', { name: new RegExp(lastFour, 'i') })).toBeChecked();
  }

  then_expired_payment_marked(lastFour: string): void {
    expect(screen.getByText(new RegExp(`${lastFour}.*expired`, 'i'))).toBeInTheDocument();
  }

  then_wishlist_stock_label(productName: string, label: RegExp): void {
    const row = screen.getByText(productName).closest('li')!;
    expect(within(row).getByText(label)).toBeInTheDocument();
  }

  then_guest_wishlist_prompt(): void {
    expect(screen.getByRole('dialog', { name: /wishlist — guest prompt/i })).toBeInTheDocument();
  }
}
