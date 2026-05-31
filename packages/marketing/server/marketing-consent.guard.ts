import type { CommunicationPreferencesRepository } from '../../customer-account/server/communication-preferences.repository';
import type { MarketingCategory } from '../../customer-account/shared/MarketingCategory';
import type { IMarketingConsentGuard } from '../shared/MarketingConsentGuard';

/** Reads communication preferences at delivery time — consent gate for marketing sends. */
export class MarketingConsentGuard implements IMarketingConsentGuard {
  constructor(private readonly prefsRepo: CommunicationPreferencesRepository) {}

  async canSend(accountId: string, category: MarketingCategory): Promise<boolean> {
    const prefs = await this.prefsRepo.findByAccount(accountId);
    return prefs.isOptedIn(category);
  }
}
