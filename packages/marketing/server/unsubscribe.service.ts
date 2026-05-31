import type { MarketingCategory } from '../../customer-account/shared/MarketingCategory';
import { MARKETING_CATEGORY_LABELS } from '../../customer-account/shared/MarketingCategory';
import type { CommunicationPreferencesService } from '../../customer-account/server/communication-preferences.service';
import { UnsubscribeToken } from '../shared/UnsubscribeToken';

export interface UnsubscribeResult {
  category: MarketingCategory;
  categoryLabel: string;
}

export class UnsubscribeService {
  constructor(private readonly preferences: CommunicationPreferencesService) {}

  async execute(token: string): Promise<UnsubscribeResult> {
    const { accountId, category } = UnsubscribeToken.verify(token);
    await this.preferences.setCategoryOptIn(accountId, category, false);
    return {
      category,
      categoryLabel: MARKETING_CATEGORY_LABELS[category],
    };
  }
}
