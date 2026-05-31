import type { CatalogProductBrowse } from '../../product-catalog/server/catalog-product-browse';
import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';
import type { CustomerAccountRepository } from '../../customer-account/server/customer-account.repository';
import type { WishlistService } from '../../customer-account/server/wishlist.service';
import type { SessionService } from '../../customer-account/server/session.service';
import type { NotificationService } from '../../notification/server/notification.service';
import { InMemoryNotificationRepository } from '../../notification/server/notification.repository';
import { NotificationService as NotificationServiceImpl } from '../../notification/server/notification.service';
import { ConsoleEmailProvider } from '../../notification/server/email.provider';
import { MarketingDispatchController } from './marketing-dispatch.controller';
import { createMarketingDispatchRouter } from './marketing-dispatch.routes';
import { MarketingDispatchService } from './marketing-dispatch.service';
import { createPreferencesModule, resetPreferencesModuleForTests } from './preferences.module';
import { UnsubscribeController } from './unsubscribe.controller';
import { createUnsubscribeRouter } from './unsubscribe.routes';
import { UnsubscribeService } from './unsubscribe.service';

let sharedNotificationRepo: InMemoryNotificationRepository | null = null;
let sharedEmailProvider: ConsoleEmailProvider | null = null;
let sharedNotificationService: NotificationService | null = null;

function getSharedNotificationService(): NotificationService {
  if (!sharedNotificationService) {
    if (!sharedNotificationRepo) sharedNotificationRepo = new InMemoryNotificationRepository();
    if (!sharedEmailProvider) sharedEmailProvider = new ConsoleEmailProvider();
    sharedNotificationService = new NotificationServiceImpl(sharedEmailProvider, sharedNotificationRepo);
  }
  return sharedNotificationService;
}

export interface MarketingModuleDeps {
  sessionService: SessionService;
  wishlistService: WishlistService;
  accounts: CustomerAccountRepository;
  catalogBrowse: CatalogProductBrowse;
  stockLevels: CatalogStockLevels;
}

export function createMarketingModule(deps: MarketingModuleDeps) {
  const preferences = createPreferencesModule({ sessionService: deps.sessionService });
  const notifications = getSharedNotificationService();

  const dispatchService = new MarketingDispatchService(
    preferences.marketingConsentGuard,
    notifications,
    deps.wishlistService,
    deps.accounts,
    deps.catalogBrowse,
    deps.stockLevels,
  );

  const dispatchController = new MarketingDispatchController(dispatchService);
  const unsubscribeService = new UnsubscribeService(preferences.communicationPrefsService);
  const unsubscribeController = new UnsubscribeController(unsubscribeService);

  return {
    ...preferences,
    marketingDispatchService: dispatchService,
    marketingDispatchRouter: createMarketingDispatchRouter(dispatchController),
    unsubscribeRouter: createUnsubscribeRouter(unsubscribeController),
    unsubscribeService,
    notificationService: notifications,
  };
}

export function resetMarketingModuleForTests(): void {
  sharedNotificationRepo?.reset();
  sharedEmailProvider?.reset();
  sharedNotificationService = null;
  resetPreferencesModuleForTests();
}
