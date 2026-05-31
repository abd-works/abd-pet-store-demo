import { CommunicationPreferences } from '../shared/CommunicationPreferences';
import type { CommunicationPreferencesSnapshot } from '../shared/CommunicationPreferences';

export interface CommunicationPreferencesRepository {
  findByAccount(accountId: string): Promise<CommunicationPreferences>;
  save(prefs: CommunicationPreferences): Promise<void>;
}

export class InMemoryCommunicationPreferencesRepository implements CommunicationPreferencesRepository {
  private readonly store = new Map<string, CommunicationPreferencesSnapshot>();

  async findByAccount(accountId: string): Promise<CommunicationPreferences> {
    const snapshot = this.store.get(accountId);
    if (!snapshot) {
      return CommunicationPreferences.createDefault(accountId);
    }
    return CommunicationPreferences.fromSnapshot(snapshot);
  }

  async save(prefs: CommunicationPreferences): Promise<void> {
    this.store.set(prefs.accountId, prefs.toSnapshot());
  }

  reset(): void {
    this.store.clear();
  }
}
