import type { MarketingCategory } from '../../customer-account/shared/MarketingCategory';

/** Delivery-time consent check for marketing communications. */
export interface IMarketingConsentGuard {
  canSend(accountId: string, category: MarketingCategory): Promise<boolean>;
}

export interface OptInRecord {
  category: MarketingCategory;
  optedInAt: string;
  optedOutAt?: string;
}
