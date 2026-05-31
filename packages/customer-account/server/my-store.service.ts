import type { MyStoreRepository } from './my-store.repository';

export class MyStoreService {
  constructor(private readonly repository: MyStoreRepository) {}

  async getForAccount(accountId: string): Promise<string | null> {
    const pref = await this.repository.findByAccount(accountId);
    return pref?.storeCode ?? null;
  }

  async setPreferredStore(accountId: string, storeCode: string): Promise<string> {
    await this.repository.save({
      accountId,
      storeCode,
      updatedAt: new Date().toISOString(),
    });
    return storeCode;
  }

  async clearPreferredStore(accountId: string): Promise<void> {
    await this.repository.deleteByAccount(accountId);
  }
}
