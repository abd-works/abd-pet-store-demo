export type ReturnReasonCategory =
  | 'changed_mind'
  | 'changed mind'
  | 'wrong_size'
  | 'defective'
  | 'not_as_described'
  | 'not as described'
  | 'damaged_in_transit'
  | 'damaged in transit'
  | 'customer request'
  | 'other';

export type ItemCondition = 'unopened' | 'opened' | 'damaged';

export interface ReturnItemSelection {
  sku: string;
  quantity: number;
}

export function enrichSchemaItems(items: Array<{ sku: string; quantity: number }>): Array<{ sku: string; name: string; quantity: number; unitPrice: number }> {
  return items.map((i) => ({ sku: i.sku, name: i.sku, quantity: i.quantity, unitPrice: 0 }));
}

/** << ValueObject >> — customer's return request: selected items, quantities, and reason. */
export class ReturnRequest {
  readonly selectedItems: ReturnItemSelection[];
  readonly reason: ReturnReasonCategory;

  constructor(params: {
    selectedOrderLineItems: Array<{ sku: string; quantity: number }>;
    quantitiesToReturn: number[];
    returnReason: string;
  }) {
    if (params.selectedOrderLineItems.length === 0) {
      throw new Error('return request must include at least one item');
    }
    this.selectedItems = params.selectedOrderLineItems.map((item, idx) => ({
      sku: item.sku,
      quantity: params.quantitiesToReturn[idx] ?? item.quantity,
    }));
    this.reason = params.returnReason as ReturnReasonCategory;
  }

  get items(): ReturnItemSelection[] {
    return this.selectedItems;
  }

  get totalQuantity(): number {
    return this.selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
