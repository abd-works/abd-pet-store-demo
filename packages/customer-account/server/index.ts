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
import type { CommunicationPreferencesService } from './communication-preferences.service';
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
import { InMemoryMyStoreRepository } from './my-store.repository';
import { MyStoreService } from './my-store.service';
import { MyStoreController } from './my-store.controller';
import { createMyStoreRouter } from './my-store.routes';
import { InMemoryPetProfileRepository } from './pet-profile.repository';
import { PetProfileService } from './pet-profile.service';
import { PetProfileController } from './pet-profile.controller';
import { createPetProfileRouter } from './pet-profile.routes';

export interface CustomerAccountModuleDeps {
  cartService: CartService;
  orderService: OrderService;
  orderRepository: OrderRepository;
  catalogBrowse: CatalogProductBrowse;
  stockLevels: CatalogStockLevels;
  communicationPrefsService?: CommunicationPreferencesService;
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
  const myStoreRepo = new InMemoryMyStoreRepository();
  const petProfileRepo = new InMemoryPetProfileRepository();

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
  const myStoreService = new MyStoreService(myStoreRepo);
  const petProfileService = new PetProfileService(petProfileRepo);

  const authController = new AuthController(
    authService,
    sessionService,
    accounts,
    deps.communicationPrefsService,
  );
  const accountController = new AccountController(
    sessionService,
    profileService,
    addressBookService,
    savedPaymentService,
  );
  const wishlistController = new WishlistController(sessionService, wishlistService);
  const myStoreController = new MyStoreController(myStoreService, sessionService);
  const petProfileController = new PetProfileController(petProfileService, sessionService);

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
    myStoreRouter: createMyStoreRouter(myStoreController),
    petProfileRouter: createPetProfileRouter(petProfileController),
    testRouter: createCustomerAccountTestRouter(fixtureApi),
    authService,
    sessionService,
    addressBookService,
    savedPaymentService,
    wishlistService,
    myStoreService,
    petProfileService,
    wishlistRepository: wishlistRepo,
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
