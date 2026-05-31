import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ProductDetailView } from '../../product-catalog/client/ProductDetailView';
import { StockAvailabilityDisplay } from '../../product-catalog/client/StockAvailabilityDisplay';
import { AddToCartButton } from '../../product-catalog/client/AddToCartButton';
import { useProductInStock } from '../../product-catalog/client/useProductInStock';
import { CustomerPage } from './components/CustomerPage';
import { WishlistButton } from './components/WishlistButton';
import { RequireVerifiedAccount } from './components/RequireVerifiedAccount';
import { CartProvider, useCart } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { CustomerSessionProvider, useCustomerSession } from './context/CustomerSessionContext';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { ProductCatalogPage } from './pages/ProductCatalogPage';
import { HomePage } from './pages/HomePage';
import { AdminStockPage } from './pages/AdminStockPage';
import { StockAdminDeepLinkPage } from './pages/StockAdminDeepLinkPage';
import { ShoppingCartPage } from './pages/ShoppingCartPage';
import { PickupStoreSelectionPage } from './pages/PickupStoreSelectionPage';
import { ShippingAddressPage } from './pages/ShippingAddressPage';
import { DeliveryOptionPage } from './pages/DeliveryOptionPage';
import { GuestBillingPage } from './pages/GuestBillingPage';
import { PaymentPage } from './pages/PaymentPage';
import { StripeWavePaymentPage } from './pages/payment/StripeWavePaymentPage';
import { PayNovaWalletFlow } from './pages/payment/PayNovaWalletFlow';
import { PayNovaHardDecline } from './pages/payment/PayNovaHardDecline';
import { VaultPayBnplFlow } from './pages/payment/VaultPayBnplFlow';
import { VaultPayHardDecline } from './pages/payment/VaultPayHardDecline';
import { PaymentRetryIndicator } from './pages/payment/PaymentRetryIndicator';
import { PaymentRetryExhausted } from './pages/payment/PaymentRetryExhausted';
import { PaymentRetryNotificationPage } from './pages/PaymentRetryNotificationPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderLookupPage } from './pages/OrderLookupPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { ClickAndCollectQueuePage } from './pages/ClickAndCollectQueuePage';
import { OrderQueuePage } from './pages/OrderQueuePage';
import { ClickAndCollectOrderDetailPage } from './pages/ClickAndCollectOrderDetailPage';
import { ShipToHomeOrderDetailPage } from './pages/ShipToHomeOrderDetailPage';
import { Increment1Page } from './components/Increment1Page';
import { RegisterPage } from './pages/auth/RegisterPage';
import { RegistrationConfirmationPage } from './pages/auth/RegistrationConfirmationPage';
import { LoginPage } from './pages/auth/LoginPage';
import { VerifyEmailSuccessPage, VerifyEmailExpiredPage, VerifyEmailHandlerPage } from './pages/auth/VerifyEmailPage';
import { ResetPasswordRequestPage } from './pages/auth/ResetPasswordRequestPage';
import { ResetPasswordSetPage } from './pages/auth/ResetPasswordSetPage';
import { AccountDashboardPage } from './pages/account/AccountDashboardPage';
import { AddressBookPage } from './pages/account/AddressBookPage';
import { EditSavedAddressPage } from './pages/account/EditSavedAddressPage';
import { SavedPaymentMethodsPage } from './pages/account/SavedPaymentMethodsPage';
import { OrderHistoryPage } from './pages/account/OrderHistoryPage';
import { OrderHistoryDetailPage } from './pages/account/OrderHistoryDetailPage';
import { WishlistPage } from './pages/account/WishlistPage';
import { CommunicationPreferencesPage } from './pages/account/CommunicationPreferencesPage';
import { NotificationPreferencesPage } from './pages/account/NotificationPreferencesPage';
import { MyStorePreferencePage } from './pages/account/MyStorePreferencePage';
import { MyPetsPage } from './pages/account/MyPetsPage';
import { EditPetProfilePage } from './pages/account/EditPetProfilePage';
import { PetGalleryPage } from './pages/PetGalleryPage';
import { PetProfilePage } from './pages/PetProfilePage';
import { AppointmentSlotPickerPage } from './pages/AppointmentSlotPickerPage';
import { AppointmentConfirmPage } from './pages/AppointmentConfirmPage';
import { AppointmentConfirmedPage } from './pages/AppointmentConfirmedPage';
import { CustomerAppointmentsPage } from './pages/CustomerAppointmentsPage';
import { NotificationPreviewPage } from './pages/NotificationPreviewPage';
import { StaffAppointmentBoardPage } from './pages/staff/StaffAppointmentBoardPage';
import { RecordOutcomePage } from './pages/staff/RecordOutcomePage';
import { SetFollowUpPage } from './pages/staff/SetFollowUpPage';
import { StaffPetProfileEditorPage } from './pages/staff/StaffPetProfileEditorPage';
import { InitiateReturnPage } from './pages/account/InitiateReturnPage';
import { ReturnConfirmationPage } from './pages/account/ReturnConfirmationPage';
import { ReturnTrackingPage } from './pages/account/ReturnTrackingPage';
import { StaffReturnLookupPage } from './pages/staff/StaffReturnLookupPage';
import { StaffProcessReturnPage } from './pages/staff/StaffProcessReturnPage';
import { ReturnNotificationPreviewPage } from './pages/staff/ReturnNotificationPreviewPage';
import { MarketingNotificationPreviewPage } from './pages/staff/MarketingNotificationPreviewPage';
import { BlogIndexPage } from './pages/content/BlogIndexPage';
import { BlogPostPage } from './pages/content/BlogPostPage';
import { GuideIndexPage } from './pages/content/GuideIndexPage';
import { GuideDetailPage } from './pages/content/GuideDetailPage';
import { InventoryDashboardPage } from './pages/staff/InventoryDashboardPage';
import { StaffContentEditorPage } from './pages/staff/StaffContentEditorPage';
import { UnsubscribeConfirmationPage } from './pages/marketing/UnsubscribeConfirmationPage';
import { ProductSearchResultsPage } from './pages/catalog/ProductSearchResultsPage';
import { useMyStorePreference } from '../../customer-account/client/useMyStorePreference';

function ProductPageContent({ sku }: { sku: string }) {
  const { addItem } = useCart();
  const { inStock, loading } = useProductInStock(sku);
  const { isLoggedIn, isVerified } = useCustomerSession();
  const { storeCode: preferredStoreCode } = useMyStorePreference(isLoggedIn, isVerified);

  return (
    <CustomerPage title="product page">
      <div data-testid="product-page">
        <ProductDetailView
          sku={sku}
          reviewSession={{ isLoggedIn, isVerified }}
        />
        <section aria-label="stock availability by store" style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>stock availability by store</h2>
          <StockAvailabilityDisplay productSku={sku} preferredStoreCode={preferredStoreCode} />
        </section>
        {!loading && (
          <>
            <AddToCartButton
              sku={sku}
              disabled={!inStock}
              unavailabilityMessage={inStock ? undefined : 'Out of Stock'}
              onAdd={addItem}
            />
            <WishlistButton sku={sku} />
          </>
        )}
      </div>
    </CustomerPage>
  );
}

function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  if (!sku) return null;
  return <ProductPageContent sku={sku} />;
}

function VerifiedRoute({ children }: { children: React.ReactNode }) {
  return <RequireVerifiedAccount>{children}</RequireVerifiedAccount>;
}

export function App() {
  return (
    <BrowserRouter>
      <CustomerSessionProvider>
        <CartProvider>
          <CheckoutProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product-catalog" element={<ProductCatalogPage />} />
              <Route path="/catalog/search" element={<ProductSearchResultsPage />} />
              <Route path="/products/:sku" element={<ProductPage />} />
              <Route path="/store-locator" element={<StoreLocatorPage />} />
              <Route path="/cart" element={<ShoppingCartPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register/confirmation" element={<RegistrationConfirmationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-email" element={<VerifyEmailHandlerPage />} />
              <Route path="/verify-email/success" element={<VerifyEmailSuccessPage />} />
              <Route path="/verify-email/expired" element={<VerifyEmailExpiredPage />} />
              <Route path="/reset-password" element={<ResetPasswordRequestPage />} />
              <Route path="/reset-password/set" element={<ResetPasswordSetPage />} />
              <Route path="/account" element={<VerifiedRoute><AccountDashboardPage /></VerifiedRoute>} />
              <Route path="/account/addresses" element={<VerifiedRoute><AddressBookPage /></VerifiedRoute>} />
              <Route path="/account/addresses/:id/edit" element={<VerifiedRoute><EditSavedAddressPage /></VerifiedRoute>} />
              <Route path="/account/payment-methods" element={<VerifiedRoute><SavedPaymentMethodsPage /></VerifiedRoute>} />
              <Route path="/account/orders" element={<VerifiedRoute><OrderHistoryPage /></VerifiedRoute>} />
              <Route path="/account/orders/:orderNumber" element={<VerifiedRoute><OrderHistoryDetailPage /></VerifiedRoute>} />
              <Route path="/wishlist" element={<VerifiedRoute><WishlistPage /></VerifiedRoute>} />
              <Route path="/checkout/delivery-option" element={<DeliveryOptionPage />} />
              <Route path="/checkout/shipping" element={<ShippingAddressPage />} />
              <Route path="/checkout/pickup-store" element={<PickupStoreSelectionPage />} />
              <Route path="/checkout/billing" element={<GuestBillingPage />} />
              <Route path="/checkout/payment" element={<PaymentPage />} />
              <Route path="/checkout/payment/stripewave" element={<StripeWavePaymentPage />} />
              <Route path="/checkout/payment/paynova" element={<PayNovaWalletFlow />} />
              <Route path="/checkout/payment/paynova/declined" element={<PayNovaHardDecline />} />
              <Route path="/checkout/payment/vaultpay" element={<VaultPayBnplFlow />} />
              <Route path="/checkout/payment/vaultpay/declined" element={<VaultPayHardDecline />} />
              <Route path="/checkout/payment/retrying" element={<PaymentRetryIndicator />} />
              <Route path="/checkout/payment/retry-exhausted" element={<PaymentRetryExhausted />} />
              <Route path="/account/notifications/:id" element={<PaymentRetryNotificationPage />} />
              <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
              <Route path="/orders/lookup" element={<OrderLookupPage />} />
              <Route path="/orders/status/:orderNumber" element={<OrderStatusPage />} />
              <Route path="/admin/orders" element={<OrderQueuePage />} />
              <Route path="/admin/orders/:orderNumber/ship-to-home" element={<ShipToHomeOrderDetailPage />} />
              <Route path="/admin/click-and-collect" element={<ClickAndCollectQueuePage />} />
              <Route path="/admin/click-and-collect/:orderNumber" element={<ClickAndCollectOrderDetailPage />} />
              <Route path="/staff/inventory" element={<InventoryDashboardPage />} />
              <Route path="/admin/stock" element={<InventoryDashboardPage />} />
              <Route path="/admin/stock/:productSku/:storeCode" element={<StockAdminDeepLinkPage />} />
              {/* Increment 6 — Pet visits */}
              <Route path="/pets" element={<PetGalleryPage />} />
              <Route path="/pets/:petId" element={<PetProfilePage />} />
              <Route path="/pets/:petId/book/slots" element={<VerifiedRoute><AppointmentSlotPickerPage /></VerifiedRoute>} />
              <Route path="/pets/:petId/book/confirm" element={<VerifiedRoute><AppointmentConfirmPage /></VerifiedRoute>} />
              <Route path="/pets/:petId/book/confirmed" element={<VerifiedRoute><AppointmentConfirmedPage /></VerifiedRoute>} />
              <Route path="/account/appointments" element={<VerifiedRoute><CustomerAppointmentsPage /></VerifiedRoute>} />
              <Route path="/account/communication" element={<CommunicationPreferencesPage />} />
              <Route path="/account/notification-preferences" element={<NotificationPreferencesPage />} />
              <Route path="/account/my-store" element={<VerifiedRoute><MyStorePreferencePage /></VerifiedRoute>} />
              <Route path="/account/pets" element={<VerifiedRoute><MyPetsPage /></VerifiedRoute>} />
              <Route path="/account/pets/:petId/edit" element={<VerifiedRoute><EditPetProfilePage /></VerifiedRoute>} />
              <Route path="/account/pets/new" element={<VerifiedRoute><EditPetProfilePage /></VerifiedRoute>} />
              <Route path="/staff/appointments" element={<StaffAppointmentBoardPage />} />
              <Route path="/staff/appointments/:appointmentId/outcome" element={<RecordOutcomePage />} />
              <Route path="/staff/appointments/:appointmentId/follow-up" element={<SetFollowUpPage />} />
              <Route path="/staff/pets/:petId/edit" element={<StaffPetProfileEditorPage />} />
              <Route path="/staff/notifications/preview" element={<NotificationPreviewPage />} />
              {/* Increment 7 — Returns and refunds */}
              <Route path="/account/orders/:orderNumber/return" element={<VerifiedRoute><InitiateReturnPage /></VerifiedRoute>} />
              <Route path="/account/returns/:returnId/confirmation" element={<VerifiedRoute><ReturnConfirmationPage /></VerifiedRoute>} />
              <Route path="/account/orders/:orderNumber/return-tracking" element={<VerifiedRoute><ReturnTrackingPage /></VerifiedRoute>} />
              <Route path="/staff/returns" element={<StaffReturnLookupPage />} />
              <Route path="/staff/returns/:orderNumber/process" element={<StaffProcessReturnPage />} />
              <Route path="/staff/notifications/returns" element={<ReturnNotificationPreviewPage />} />
              <Route path="/staff/notifications/marketing" element={<MarketingNotificationPreviewPage />} />
              {/* Increment 8 Sprint 4 — Content publishing & unsubscribe */}
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/guides" element={<GuideIndexPage />} />
              <Route path="/guides/:slug" element={<GuideDetailPage />} />
              <Route path="/staff/content" element={<StaffContentEditorPage />} />
              <Route path="/marketing/unsubscribe/:token" element={<UnsubscribeConfirmationPage />} />
            </Routes>
          </CheckoutProvider>
        </CartProvider>
      </CustomerSessionProvider>
    </BrowserRouter>
  );
}

export { Increment1Page };
