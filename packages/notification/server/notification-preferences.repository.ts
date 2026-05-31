import { NotificationPreferences } from '../shared/NotificationPreferences';
import type { NotificationPreferencesSnapshot } from '../shared/NotificationPreferences';

export interface NotificationPreferencesRepository {
  findByAccount(accountId: string): Promise<NotificationPreferences>;
  save(prefs: NotificationPreferences): Promise<void>;
}

export class InMemoryNotificationPreferencesRepository implements NotificationPreferencesRepository {
  private readonly store = new Map<string, NotificationPreferencesSnapshot>();

  async findByAccount(accountId: string): Promise<NotificationPreferences> {
    const snapshot = this.store.get(accountId);
    if (!snapshot) {
      return NotificationPreferences.createDefault(accountId);
    }
    return NotificationPreferences.fromSnapshot(snapshot);
  }

  async save(prefs: NotificationPreferences): Promise<void> {
    this.store.set(prefs.accountId, prefs.toSnapshot());
  }

  reset(): void {
    this.store.clear();
  }
}
