import type { NotificationPreferencesDto } from '../shared/notification-preferences.schema';
import { NotificationPreferences } from '../shared/NotificationPreferences';
import type { TransactionalCategory } from '../shared/TransactionalCategory';
import type { NotificationPreferencesRepository } from './notification-preferences.repository';

const CRITICAL_NOTE =
  'order confirmation and refund completion cannot be disabled';

export class NotificationPreferencesService {
  constructor(private readonly repository: NotificationPreferencesRepository) {}

  async getForAccount(accountId: string): Promise<NotificationPreferencesDto> {
    const prefs = await this.repository.findByAccount(accountId);
    return {
      ...prefs.toSnapshot(),
      criticalNote: CRITICAL_NOTE,
    };
  }

  async isEnabled(accountId: string, category: TransactionalCategory): Promise<boolean> {
    const prefs = await this.repository.findByAccount(accountId);
    return prefs.isEnabled(category);
  }

  async setCategory(
    accountId: string,
    category: TransactionalCategory,
    enabled: boolean,
  ): Promise<NotificationPreferencesDto> {
    const prefs = await this.repository.findByAccount(accountId);
    prefs.setCategory(category, enabled);
    await this.repository.save(prefs);
    return {
      ...prefs.toSnapshot(),
      criticalNote: CRITICAL_NOTE,
    };
  }
}
