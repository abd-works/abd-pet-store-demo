export interface RefundRetryEntry {
  refundId: string;
  paymentRef: string;
  attemptCount: number;
  nextRetryAt: Date;
}

export interface IRefundRetryRepository {
  enqueue(entry: RefundRetryEntry): Promise<void>;
  findDueRetries(): Promise<RefundRetryEntry[]>;
  recordAttempt(refundId: string): Promise<void>;
  remove(refundId: string): Promise<void>;
}

/** In-memory refund retry queue for reference implementation. */
export class InMemoryRefundRetryRepository implements IRefundRetryRepository {
  private readonly store = new Map<string, RefundRetryEntry>();

  async enqueue(entry: RefundRetryEntry): Promise<void> {
    this.store.set(entry.refundId, entry);
  }

  async findDueRetries(): Promise<RefundRetryEntry[]> {
    const now = new Date();
    return [...this.store.values()].filter((e) => e.nextRetryAt <= now);
  }

  async recordAttempt(refundId: string): Promise<void> {
    const entry = this.store.get(refundId);
    if (!entry) return;
    entry.attemptCount += 1;
    entry.nextRetryAt = new Date(Date.now() + 60_000 * entry.attemptCount);
  }

  async remove(refundId: string): Promise<void> {
    this.store.delete(refundId);
  }

  clear(): void {
    this.store.clear();
  }
}
