import type { AccountVerificationStatusValue } from '@pawplace/customer-account-shared';

export interface CustomerAccountRecord {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  accountVerificationStatus: AccountVerificationStatusValue;
}

export interface CustomerAccountRepository {
  findByEmail(email: string): Promise<CustomerAccountRecord | null>;
  findById(id: string): Promise<CustomerAccountRecord | null>;
  save(account: CustomerAccountRecord): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}

export class InMemoryCustomerAccountRepository implements CustomerAccountRepository {
  private readonly byId = new Map<string, CustomerAccountRecord>();
  private readonly byEmail = new Map<string, string>();

  async findByEmail(email: string): Promise<CustomerAccountRecord | null> {
    const id = this.byEmail.get(email.toLowerCase());
    return id ? this.byId.get(id) ?? null : null;
  }

  async findById(id: string): Promise<CustomerAccountRecord | null> {
    return this.byId.get(id) ?? null;
  }

  async save(account: CustomerAccountRecord): Promise<void> {
    this.byId.set(account.id, account);
    this.byEmail.set(account.email.toLowerCase(), account.id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.byEmail.has(email.toLowerCase());
  }

  async deleteByIds(ids: string[]): Promise<void> {
    for (const id of ids) {
      const account = this.byId.get(id);
      if (account) {
        this.byEmail.delete(account.email.toLowerCase());
        this.byId.delete(id);
      }
    }
  }

  async markVerified(email: string): Promise<void> {
    const account = await this.findByEmail(email);
    if (account) {
      account.accountVerificationStatus = 'verified';
      await this.save(account);
    }
  }
}
