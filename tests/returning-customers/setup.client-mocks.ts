import { vi } from 'vitest';

const authApiMocks = vi.hoisted(() => ({
  registerAccount: vi.fn(),
  loginAccount: vi.fn(),
  fetchCurrentAccount: vi.fn(),
  logoutAccount: vi.fn(),
  logoutEverywhere: vi.fn(),
  verifyEmailToken: vi.fn(),
  resendVerification: vi.fn(),
  requestPasswordReset: vi.fn(),
  confirmPasswordReset: vi.fn(),
  validateResetToken: vi.fn(),
}));

const accountApiMocks = vi.hoisted(() => ({
  fetchOrderHistory: vi.fn(),
  fetchOrderDetail: vi.fn(),
  reorderOrder: vi.fn(),
  fetchSavedAddresses: vi.fn(),
  saveAddress: vi.fn(),
  updateSavedAddress: vi.fn(),
  deleteSavedAddress: vi.fn(),
  setDefaultAddress: vi.fn(),
  fetchSavedPaymentMethods: vi.fn(),
  deleteSavedPaymentMethod: vi.fn(),
  setDefaultPaymentMethod: vi.fn(),
}));

const wishlistApiMocks = vi.hoisted(() => ({
  fetchWishlist: vi.fn(),
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
  isInWishlist: vi.fn(),
}));

vi.mock('@pawplace/customer-account-client/auth.api', () => authApiMocks);
vi.mock('@pawplace/customer-account-client/account.api', () => accountApiMocks);
vi.mock('@pawplace/customer-account-client/wishlist.api', () => wishlistApiMocks);

export { authApiMocks, accountApiMocks, wishlistApiMocks };
