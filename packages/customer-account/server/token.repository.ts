export interface TokenRecord {
  token: string;
  accountId: string;
  expiresAt: number;
  consumed: boolean;
}

export class InMemoryTokenRepository {
  private readonly tokens = new Map<string, TokenRecord>();

  save(record: TokenRecord): void {
    this.tokens.set(record.token, record);
  }

  find(token: string): TokenRecord | null {
    return this.tokens.get(token) ?? null;
  }

  consume(token: string): void {
    const record = this.tokens.get(token);
    if (record) record.consumed = true;
  }

  findLatestForAccount(accountId: string): TokenRecord | null {
    let latest: TokenRecord | null = null;
    for (const record of this.tokens.values()) {
      if (record.accountId !== accountId || record.consumed) continue;
      if (!latest || record.expiresAt > latest.expiresAt) latest = record;
    }
    return latest;
  }

  expireToken(token: string): void {
    const record = this.tokens.get(token);
    if (record) record.expiresAt = Date.now() - 1000;
  }
}

export class VerificationTokenRepository extends InMemoryTokenRepository {}
export class PasswordResetTokenRepository extends InMemoryTokenRepository {}
