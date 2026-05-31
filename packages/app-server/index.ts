import type { Db } from 'mongodb';
import { createStoreModule } from '@pawplace/store-server';
import { createProductCatalogModule } from '@pawplace/product-catalog-server';
import { createReviewModule, resetReviewModuleForTests } from '../product-catalog/server/review.module';
import { createMarketingModule, resetMarketingModuleForTests } from '../marketing/server/marketing.module';
import { createContentModule, resetContentModuleForTests } from '../content/server/content.module';
import { attachJsonBodyParser, createExpressApp } from './express-app';
import { attachSessionMiddleware } from './session';
import { createCartModule } from '../cart/server/index';
import { createOrderModule } from '../order/server/index';
import { createPaymentModule } from '../payment/server/index';
import { createCustomerAccountModule } from '../customer-account/server/index';
import { CommunicationPreferencesService } from '../customer-account/server/communication-preferences.service';
import { getSharedCommunicationPreferencesRepository } from '../marketing/server/preferences.module';
import { createPetVisitsRouter, createPetVisitsTestRouter } from '../pet-visits/server/index';
import { createReturnModule } from '../return/server/return.module';

export function createApp(db?: Db) {
  const app = createExpressApp();
  attachJsonBodyParser(app);
  attachSessionMiddleware(app);

  app.use(createPetVisitsTestRouter());
  app.use(createPetVisitsRouter());

  const storeModule = createStoreModule(db);
  const catalogModule = createProductCatalogModule(db);
  const cartModule = createCartModule(catalogModule.browse, catalogModule.stockLevels);
  const orderModule = createOrderModule(
    cartModule.cartService,
    storeModule.catalog,
    catalogModule.stockLevels,
  );
  const communicationPrefsService = new CommunicationPreferencesService(
    getSharedCommunicationPreferencesRepository(),
  );
  const customerAccountModule = createCustomerAccountModule({
    cartService: cartModule.cartService,
    orderService: orderModule.orderService,
    orderRepository: orderModule.orderRepository,
    catalogBrowse: catalogModule.browse,
    stockLevels: catalogModule.stockLevels,
    communicationPrefsService,
  });
  const paymentModule = createPaymentModule(orderModule.orderService, {
    savedPaymentService: customerAccountModule.savedPaymentService,
    sessionService: customerAccountModule.sessionService,
  });

  app.use('/api', storeModule.storeRouter);
  app.use('/api', storeModule.storeTestRouter);
  app.use(catalogModule.productCatalogRouter);
  app.use(catalogModule.productSearchRouter);
  app.use(catalogModule.inventoryDashboardRouter);
  app.use(cartModule.cartRouter);
  app.use(orderModule.orderRouter);
  app.use(paymentModule.paymentRouter);
  app.use('/api', customerAccountModule.authRouter);
  app.use('/api', customerAccountModule.accountRouter);
  app.use('/api', customerAccountModule.wishlistRouter);
  app.use('/api', customerAccountModule.myStoreRouter);
  app.use('/api', customerAccountModule.petProfileRouter);
  app.use('/api', customerAccountModule.testRouter);

  const marketingModule = createMarketingModule({
    sessionService: customerAccountModule.sessionService,
    wishlistService: customerAccountModule.wishlistService,
    accounts: customerAccountModule.accounts,
    catalogBrowse: catalogModule.browse,
    stockLevels: catalogModule.stockLevels,
  });
  app.use('/api', marketingModule.communicationPrefsRouter);
  app.use('/api', marketingModule.notificationPrefsRouter);
  app.use('/api', marketingModule.marketingDispatchRouter);
  app.use('/api', marketingModule.unsubscribeRouter);

  const contentModule = createContentModule();
  app.use('/api', contentModule.contentRouter);

  const reviewModule = createReviewModule({
    orderRepository: orderModule.orderRepository,
    accounts: customerAccountModule.accounts,
    sessionService: customerAccountModule.sessionService,
    catalogBrowse: catalogModule.browse,
  });
  app.use(reviewModule.reviewRouter);

  const returnRouter = createReturnModule();
  app.use(returnRouter);

  app.post('/api/test/cart/reset-all', (_req, res) => {
    cartModule.sessionRepository.resetAll();
    cartModule.accountRepository.resetAll();
    resetReviewModuleForTests();
    resetMarketingModuleForTests();
    resetContentModuleForTests();
    res.json({ ok: true });
  });

  app.post('/api/test/cart/account-items', async (req, res) => {
    const { email, sku, quantity = 1 } = req.body as { email?: string; sku?: string; quantity?: number };
    if (!email || !sku) {
      res.status(400).json({ error: 'email and sku required' });
      return;
    }
    const account = await customerAccountModule.accounts.findByEmail(email);
    if (!account) {
      res.status(404).json({ error: 'account not found' });
      return;
    }
    try {
      const cart = await cartModule.cartService.addItemToAccountCart(account.id, sku, quantity);
      res.status(201).json(cart);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'failed' });
    }
  });

  return {
    app,
    storeRepo: storeModule.repository,
    productRepo: catalogModule.repository,
    cartService: cartModule.cartService,
    orderService: orderModule.orderService,
    customerAccountModule,
    marketingModule,
    marketingConsentGuard: marketingModule.marketingConsentGuard,
    marketingDispatchService: marketingModule.marketingDispatchService,
  };
}

/** In-memory Express app for Vitest server-tier tests (no MongoDB required). */
const bundle = createApp();
export const app = bundle.app;
export const testDeps = bundle;
