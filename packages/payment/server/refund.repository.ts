import type { Refund } from '../shared/Refund';

export interface IRefundRepository {
  save(refund: Refund): Promise<void>;
  findById(refundId: string): Promise<Refund | null>;
  findByOrderNumber(orderNumber: string): Promise<Refund[]>;
}

/** In-memory refund repository for reference implementation. */
export class InMemoryRefundRepository implements IRefundRepository {
  private readonly store = new Map<string, Refund>();

  async save(refund: Refund): Promise<void> {
    this.store.set(refund.refundId, refund);
  }

  async findById(refundId: string): Promise<Refund | null> {
    return this.store.get(refundId) ?? null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Refund[]> {
    return [...this.store.values()].filter((r) => r.orderNumber === orderNumber);
  }

  clear(): void {
    this.store.clear();
  }
}
