import type { Return } from '../shared/Return';

export interface IReturnRepository {
  save(returnEntity: Return): Promise<void>;
  findById(returnId: string): Promise<Return | null>;
  findByOrderNumber(orderNumber: string): Promise<Return[]>;
}

/** In-memory return repository for reference implementation. */
export class InMemoryReturnRepository implements IReturnRepository {
  private readonly store = new Map<string, Return>();

  async save(returnEntity: Return): Promise<void> {
    this.store.set(returnEntity.returnId, returnEntity);
  }

  async findById(returnId: string): Promise<Return | null> {
    return this.store.get(returnId) ?? null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Return[]> {
    return [...this.store.values()].filter((r) => r.orderNumber === orderNumber);
  }

  clear(): void {
    this.store.clear();
  }
}
