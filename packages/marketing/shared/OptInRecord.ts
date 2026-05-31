import type { MarketingCategory } from '../../customer-account/shared/MarketingCategory';
import type { OptInRecord } from './MarketingConsentGuard';

export class OptInRecordEntity implements OptInRecord {
  constructor(
    readonly category: MarketingCategory,
    readonly optedInAt: string,
    readonly optedOutAt?: string,
  ) {}
}
