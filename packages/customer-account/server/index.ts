import type { CartService } from '../../cart/server/cart.service';
import type { OrderService } from '../../order/server/order.service';
import type { OrderRepository } from '../../order/server/order.repository';
import type { CatalogProductBrowse } from '../../product-catalog/server/catalog-product-browse';
import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';
import { PasswordHasher } from './password-hasher';
import { InMemoryCustomerAccountRepository } from './customer-account.repository';
import { VerificationTokenRepository, PasswordResetTokenRepository } from './token.repository';
import { CustomerSessionRepository } from './customer-session.repository';
import { AddressBookRepository } from './address-book.repository';
import { SavedPaymentRepository, SavedPaymentTokenStore } from './saved-payment.repository';
import { WishlistRepository } from './wishlist.repository';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { ProfileService } from './profile.service';
import { AddressBookService } from './address-book.service';
import { SavedPaymentService } from './saved-payment.service';
import { WishlistService } from './wishlist.service';
import { AuthController, AccountController, WishlistController } from './customer-account.controller';
import { createAuthRouter, createAccountRouter, createWishlistRouter } from './customer-account.routes';
import { CustomerAccountFixtureApi } from './customer-account.fixture-api';
import { createCustomerAccountTestRouter } from './customer-account.test-routes';

export interface CustomerAccountModuleDeps {
  cartService: CartService;
  orderService: OrderService;
  orderRepository: OrderRepository;
  catalogBrowse: CatalogProductBrowse;
  stockLevels: CatalogStockLevels;
}

export function createCustomerAccountModule(deps: CustomerAccountModuleDeps) {
  const accounts = new InMemoryCustomerAccountRepository();
  const hasher = new PasswordHasher();
  const verificationTokens = new VerificationTokenRepository();
  const resetTokens = new PasswordResetTokenRepository();
  const customerSessions = new CustomerSessionRepository();
  const addressBookRepo = new AddressBookRepository();
  const savedPaymentRepo = new SavedPaymentRepository();
  const savedPaymentTokens = new SavedPaymentTokenStore();
  const wishlistRepo = new WishlistRepository();

  const sessionService = new SessionService(customerSessions, accounts, deps.cartService);
  const authService = new AuthService(
    accounts,
    hasher,
    verificationTokens,
    resetTokens,
    sessionService,
  );
  const profileService = new ProfileService(
    accounts,
    deps.orderRepository,
    deps.orderService,
    deps.cartService,
    deps.catalogBrowse,
    deps.stockLevels,
  );
  const addressBookService = new AddressBookService(addressBookRepo);
  const savedPaymentService = new SavedPaymentService(savedPaymentRepo, savedPaymentTokens);
  const wishlistService = new WishlistService(wishlistRepo, deps.catalogBrowse, deps.stockLevels);

  const authController = new AuthController(authService, sessionService, accounts);
  const accountController = new AccountController(
    sessionService,
    profileService,
    addressBookService,
    savedPaymentService,
  );
  const wishlistController = new WishlistController(sessionService, wishlistService);

  const fixtureApi = new CustomerAccountFixtureApi(
    accounts,
    verificationTokens,
    resetTokens,
    savedPaymentService,
  );

  return {
    authRouter: createAuthRouter(authController),
    accountRouter: createAccountRouter(accountController),
    wishlistRouter: createWishlistRouter(wishlistController),
    testRouter: createCustomerAccountTestRouter(fixtureApi),
    authService,
    sessionService,
    addressBookService,
    savedPaymentService,
    wishlistService,
    profileService,
    accounts,
    verificationTokens,
    resetTokens,
    customerSessions,
  };
}

export {
  AuthService,
  SessionService,
  AddressBookService,
  SavedPaymentService,
  WishlistService,
  ProfileService,
};
