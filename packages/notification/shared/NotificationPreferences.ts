import {
  TRANSACTIONAL_CATEGORIES,
  type TransactionalCategory,
} from './TransactionalCategory';

export type NotificationToggle = 'on' | 'off';

export interface CategoryToggleState {
  category: TransactionalCategory;
  enabled: boolean;
}

export interface NotificationPreferencesSnapshot {
  accountId: string;
  categories: CategoryToggleState[];
}

/** Transactional notification preferences — separate from marketing communication preferences. */
export class NotificationPreferences {
  private readonly categories: Map<TransactionalCategory, CategoryToggleState>;

  private constructor(
    readonly accountId: string,
    categories: Map<TransactionalCategory, CategoryToggleState>,
  ) {
    this.categories = categories;
  }

  static createDefault(accountId: string): NotificationPreferences {
    const categories = new Map<TransactionalCategory, CategoryToggleState>();
    for (const category of TRANSACTIONAL_CATEGORIES) {
      categories.set(category, { category, enabled: true });
    }
    return new NotificationPreferences(accountId, categories);
  }

  static fromSnapshot(snapshot: NotificationPreferencesSnapshot): NotificationPreferences {
    const categories = new Map<TransactionalCategory, CategoryToggleState>();
    for (const category of TRANSACTIONAL_CATEGORIES) {
      const existing = snapshot.categories.find((c) => c.category === category);
      categories.set(category, existing ?? { category, enabled: true });
    }
    return new NotificationPreferences(snapshot.accountId, categories);
  }

  isEnabled(category: TransactionalCategory): boolean {
    return this.categories.get(category)?.enabled ?? true;
  }

  setCategory(category: TransactionalCategory, enabled: boolean): void {
    this.categories.set(category, { category, enabled });
  }

  toSnapshot(): NotificationPreferencesSnapshot {
    return {
      accountId: this.accountId,
      categories: TRANSACTIONAL_CATEGORIES.map((c) => this.categories.get(c)!),
    };
  }
}
