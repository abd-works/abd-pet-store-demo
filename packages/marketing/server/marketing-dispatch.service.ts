import type { WishlistService } from '../../customer-account/server/wishlist.service';
import type { CustomerAccountRepository } from '../../customer-account/server/customer-account.repository';
import type { CatalogProductBrowse } from '../../product-catalog/server/catalog-product-browse';
import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';
import type { MarketingConsentGuard } from './marketing-consent.guard';
import type { NotificationService } from '../../notification/server/notification.service';
import {
  InStoreEventNotification,
  PersonalizedRecommendation,
  PromotionalEmail,
  RestockAlert,
} from '../shared/marketing-messages';
import type { InStoreEventInput, PromotionalBatchInput } from '../shared/marketing.schema';
import { UnsubscribeToken } from '../shared/UnsubscribeToken';
import { RecommendationEngine } from './recommendation.engine';
import { toMarketingPayload } from './marketing-email.mapper';

export interface MarketingDispatchResult {
  sent: number;
  skipped: number;
  queued: number;
}

export class MarketingDispatchService {
  private readonly recommendationEngine: RecommendationEngine;

  constructor(
    private readonly consent: MarketingConsentGuard,
    private readonly notifications: NotificationService,
    private readonly wishlist: WishlistService,
    private readonly accounts: CustomerAccountRepository,
    private readonly catalog: CatalogProductBrowse,
    private readonly stockLevels: CatalogStockLevels,
  ) {
    this.recommendationEngine = new RecommendationEngine(
      accounts,
      (skus) => skus.filter((sku) => this.stockLevels.getMaxAvailableToSell(sku) > 0),
    );
  }

  async sendPromotionalBatch(input: PromotionalBatchInput): Promise<MarketingDispatchResult> {
    let sent = 0;
    let skipped = 0;
    let queued = 0;

    for (const accountId of input.recipientAccountIds) {
      if (!(await this.consent.canSend(accountId, 'promotions'))) {
        skipped += 1;
        continue;
      }

      const account = await this.accounts.findById(accountId);
      if (!account?.email) {
        skipped += 1;
        continue;
      }

      const email = PromotionalEmail.create({
        accountId,
        recipientEmail: account.email,
        subject: input.subject,
        bodyHtml: input.bodyHtml,
        unsubscribeUrl: UnsubscribeToken.buildUrl(accountId, 'promotions'),
      });

      const result = await this.notifications.sendMarketingEmail(toMarketingPayload(email.message));
      if (result === 'sent') sent += 1;
      if (result === 'skipped') skipped += 1;
      if (result === 'queued') queued += 1;
    }

    return { sent, skipped, queued };
  }

  async sendPersonalizedRecommendation(accountId: string): Promise<MarketingDispatchResult> {
    if (!(await this.consent.canSend(accountId, 'recommendations'))) {
      return { sent: 0, skipped: 1, queued: 0 };
    }

    const account = await this.accounts.findById(accountId);
    if (!account?.email) {
      return { sent: 0, skipped: 1, queued: 0 };
    }

    const wishlistSkus = this.wishlist.list(accountId).items.map((i) => i.sku);
    const productSkus = await this.recommendationEngine.buildFor(accountId, wishlistSkus);
    const productNames = productSkus
      .map((sku) => this.catalog.getProductBySku(sku)?.name)
      .filter((name): name is string => Boolean(name));

    const email = PersonalizedRecommendation.create({
      accountId,
      recipientEmail: account.email,
      productNames,
      unsubscribeUrl: UnsubscribeToken.buildUrl(accountId, 'recommendations'),
    });

    if (!email) {
      return { sent: 0, skipped: 1, queued: 0 };
    }

    const result = await this.notifications.sendMarketingEmail(toMarketingPayload(email.message));
    return {
      sent: result === 'sent' ? 1 : 0,
      skipped: result === 'skipped' ? 1 : 0,
      queued: result === 'queued' ? 1 : 0,
    };
  }

  async sendRestockAlert(sku: string, productName: string): Promise<MarketingDispatchResult> {
    const accountIds = this.findAccountsWithSkuOnWishlist(sku);
    let sent = 0;
    let skipped = 0;
    let queued = 0;

    for (const accountId of accountIds) {
      if (!(await this.consent.canSend(accountId, 'restock_alerts'))) {
        skipped += 1;
        continue;
      }

      const account = await this.accounts.findById(accountId);
      if (!account?.email) {
        skipped += 1;
        continue;
      }

      const alert = RestockAlert.create({
        accountId,
        recipientEmail: account.email,
        sku,
        productName,
        productUrl: `/products/${sku}`,
        unsubscribeUrl: UnsubscribeToken.buildUrl(accountId, 'restock_alerts'),
      });

      const result = await this.notifications.sendMarketingEmail(toMarketingPayload(alert.message));
      if (result === 'sent') sent += 1;
      if (result === 'skipped') skipped += 1;
      if (result === 'queued') queued += 1;
    }

    return { sent, skipped, queued };
  }

  async sendInStoreEventNotification(
    event: InStoreEventInput,
    preferredStoreByAccount: Map<string, string>,
  ): Promise<MarketingDispatchResult> {
    let sent = 0;
    let skipped = 0;
    let queued = 0;

    for (const [accountId, preferredStore] of preferredStoreByAccount.entries()) {
      if (preferredStore !== event.storeCode) {
        skipped += 1;
        continue;
      }

      if (!(await this.consent.canSend(accountId, 'events'))) {
        skipped += 1;
        continue;
      }

      const account = await this.accounts.findById(accountId);
      if (!account?.email) {
        skipped += 1;
        continue;
      }

      const notification = InStoreEventNotification.create({
        accountId,
        recipientEmail: account.email,
        eventTitle: event.eventTitle,
        storeName: event.storeName,
        unsubscribeUrl: UnsubscribeToken.buildUrl(accountId, 'events'),
      });

      const result = await this.notifications.sendMarketingEmail(toMarketingPayload(notification.message));
      if (result === 'sent') sent += 1;
      if (result === 'skipped') skipped += 1;
      if (result === 'queued') queued += 1;
    }

    return { sent, skipped, queued };
  }

  findAccountsWithSkuOnWishlist(sku: string): string[] {
    return this.wishlist.findAccountsWithSkuOnWishlist(sku);
  }
}
