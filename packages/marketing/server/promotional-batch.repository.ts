export interface PromotionalBatch {
  batchId: string;
  subject: string;
  bodyHtml: string;
  recipientAccountIds: string[];
  createdAt: string;
}

export interface PromotionalBatchRepository {
  save(batch: PromotionalBatch): Promise<void>;
  findById(batchId: string): Promise<PromotionalBatch | null>;
}

export class InMemoryPromotionalBatchRepository implements PromotionalBatchRepository {
  private readonly store = new Map<string, PromotionalBatch>();

  async save(batch: PromotionalBatch): Promise<void> {
    this.store.set(batch.batchId, batch);
  }

  async findById(batchId: string): Promise<PromotionalBatch | null> {
    return this.store.get(batchId) ?? null;
  }

  reset(): void {
    this.store.clear();
  }
}
