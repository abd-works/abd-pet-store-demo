import { Router } from 'express';
import type { AuthController, AccountController, WishlistController } from './customer-account.controller';

export function createAuthRouter(auth: AuthController): Router {
  const router = Router();
  router.post('/auth/register', auth.register);
  router.post('/auth/login', auth.login);
  router.get('/auth/verify', auth.verifyEmail);
  router.post('/auth/resend-verification', auth.resendVerification);
  router.post('/auth/password-reset/request', auth.requestPasswordReset);
  router.post('/auth/password-reset/confirm', auth.resetPassword);
  router.get('/auth/password-reset/validate', auth.validateResetToken);
  router.post('/auth/logout', auth.logout);
  router.post('/auth/logout-everywhere', auth.logoutEverywhere);
  return router;
}

export function createAccountRouter(account: AccountController): Router {
  const router = Router();
  router.get('/account', account.getAccount);
  router.get('/account/orders', account.listOrders);
  router.get('/account/orders/:orderNumber', account.getOrder);
  router.post('/account/orders/:orderNumber/reorder', account.reorder);
  router.get('/account/addresses', account.listAddresses);
  router.post('/account/addresses', account.addAddress);
  router.patch('/account/addresses/:id', account.updateAddress);
  router.delete('/account/addresses/:id', account.deleteAddress);
  router.patch('/account/addresses/:id/default', account.setDefaultAddress);
  router.get('/account/payment-methods', account.listPaymentMethods);
  router.post('/account/payment-methods', account.savePaymentMethod);
  router.delete('/account/payment-methods/:id', account.deletePaymentMethod);
  router.patch('/account/payment-methods/:id/default', account.setDefaultPaymentMethod);
  return router;
}

export function createWishlistRouter(wishlist: WishlistController): Router {
  const router = Router();
  router.get('/wishlist', wishlist.list);
  router.post('/wishlist', wishlist.add);
  router.delete('/wishlist/:sku', wishlist.remove);
  router.get('/wishlist/:sku/contains', wishlist.contains);
  return router;
}
