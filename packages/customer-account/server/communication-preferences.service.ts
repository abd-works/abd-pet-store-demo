import type { CommunicationPreferencesDto } from '../shared/communication-preferences.schema';
import { CommunicationPreferences } from '../shared/CommunicationPreferences';
import type { MarketingCategory } from '../shared/MarketingCategory';
import type { CommunicationPreferencesRepository } from './communication-preferences.repository';

export class CommunicationPreferencesService {
  constructor(private readonly repository: CommunicationPreferencesRepository) {}

  async getForAccount(accountId: string): Promise<CommunicationPreferencesDto> {
    const prefs = await this.repository.findByAccount(accountId);
    return prefs.toSnapshot();
  }

  async setCategoryOptIn(
    accountId: string,
    category: MarketingCategory,
    optedIn: boolean,
  ): Promise<CommunicationPreferencesDto> {
    const prefs = await this.repository.findByAccount(accountId);
    prefs.toggle(category, optedIn, new Date().toISOString());
    await this.repository.save(prefs);
    return prefs.toSnapshot();
  }
}
