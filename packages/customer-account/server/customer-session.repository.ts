export interface CustomerSessionRecord {
  sessionId: string;
  accountId: string;
  createdAt: number;
  lastActiveAt: number;
}

export class CustomerSessionRepository {
  private readonly sessions = new Map<string, CustomerSessionRecord>();

  save(record: CustomerSessionRecord): void {
    this.sessions.set(record.sessionId, record);
  }

  find(sessionId: string): CustomerSessionRecord | null {
    return this.sessions.get(sessionId) ?? null;
  }

  delete(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  deleteAllForAccount(accountId: string): void {
    for (const [id, record] of this.sessions) {
      if (record.accountId === accountId) this.sessions.delete(id);
    }
  }

  touch(sessionId: string): void {
    const record = this.sessions.get(sessionId);
    if (record) record.lastActiveAt = Date.now();
  }

  listForAccount(accountId: string): CustomerSessionRecord[] {
    return [...this.sessions.values()].filter((record) => record.accountId === accountId);
  }

  clearForTests(): void {
    this.sessions.clear();
  }
}
