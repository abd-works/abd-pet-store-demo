import {
  MARKETING_CATEGORIES,
  type MarketingCategory,
} from './MarketingCategory';

export type OptInStatus = 'opted-in' | 'opted-out';

export interface CategoryOptInState {
  category: MarketingCategory;
  status: OptInStatus;
  optedInAt?: string;
  optedOutAt?: string;
}

export interface CommunicationPreferencesSnapshot {
  accountId: string;
  categories: CategoryOptInState[];
  onMarketingEmailList: boolean;
}

/** Per-category marketing opt-in; new categories default to opted-out. */
export class CommunicationPreferences {
  private readonly categories: Map<MarketingCategory, CategoryOptInState>;

  private constructor(
    readonly accountId: string,
    categories: Map<MarketingCategory, CategoryOptInState>,
  ) {
    this.categories = categories;
  }

  static createDefault(accountId: string): CommunicationPreferences {
    const categories = new Map<MarketingCategory, CategoryOptInState>();
    for (const category of MARKETING_CATEGORIES) {
      categories.set(category, { category, status: 'opted-out' });
    }
    return new CommunicationPreferences(accountId, categories);
  }

  static fromSnapshot(snapshot: CommunicationPreferencesSnapshot): CommunicationPreferences {
    const categories = new Map<MarketingCategory, CategoryOptInState>();
    for (const category of MARKETING_CATEGORIES) {
      const existing = snapshot.categories.find((c) => c.category === category);
      categories.set(category, existing ?? { category, status: 'opted-out' });
    }
    return new CommunicationPreferences(snapshot.accountId, categories);
  }

  isOptedIn(category: MarketingCategory): boolean {
    return this.categories.get(category)?.status === 'opted-in';
  }

  toggle(category: MarketingCategory, optedIn: boolean, timestamp: string): void {
    const status: OptInStatus = optedIn ? 'opted-in' : 'opted-out';
    const current = this.categories.get(category) ?? { category, status: 'opted-out' };
    this.categories.set(category, {
      category,
      status,
      optedInAt: optedIn ? timestamp : current.optedInAt,
      optedOutAt: optedIn ? undefined : timestamp,
    });
  }

  hasAnyOptIn(): boolean {
    return MARKETING_CATEGORIES.some((c) => this.isOptedIn(c));
  }

  toSnapshot(): CommunicationPreferencesSnapshot {
    return {
      accountId: this.accountId,
      categories: MARKETING_CATEGORIES.map((c) => this.categories.get(c)!),
      onMarketingEmailList: this.hasAnyOptIn(),
    };
  }
}
