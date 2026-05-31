export interface MyStorePreference {
  accountId: string;
  storeCode: string;
  updatedAt: string;
}

export interface MyStoreRepository {
  findByAccount(accountId: string): Promise<MyStorePreference | null>;
  save(preference: MyStorePreference): Promise<void>;
  deleteByAccount(accountId: string): Promise<void>;
  reset(): void;
}

export class InMemoryMyStoreRepository implements MyStoreRepository {
  private readonly byAccount = new Map<string, MyStorePreference>();

  async findByAccount(accountId: string): Promise<MyStorePreference | null> {
    return this.byAccount.get(accountId) ?? null;
  }

  async save(preference: MyStorePreference): Promise<void> {
    this.byAccount.set(preference.accountId, preference);
  }

  async deleteByAccount(accountId: string): Promise<void> {
    this.byAccount.delete(accountId);
  }

  reset(): void {
    this.byAccount.clear();
  }
}
