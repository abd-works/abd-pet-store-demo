export interface ReorderLineInput {
  sku: string;
  quantity: number;
  productName?: string;
}

export interface ReorderSkippedItem {
  sku: string;
  reason: string;
}

export interface ReorderStockWarning {
  sku: string;
  availableQuantity: number;
  requestedQuantity: number;
}

/** << Service >> — rebuild shopping cart from prior order line items (Increment 4). */
export class ReorderResult {
  readonly added: ReorderLineInput[];
  readonly skipped: ReorderSkippedItem[];
  readonly stockWarnings: ReorderStockWarning[];

  constructor(
    added: ReorderLineInput[] = [],
    skipped: ReorderSkippedItem[] = [],
    stockWarnings: ReorderStockWarning[] = [],
  ) {
    this.added = added;
    this.skipped = skipped;
    this.stockWarnings = stockWarnings;
  }

  static empty(): ReorderResult {
    return new ReorderResult();
  }

  get partialSuccess(): boolean {
    return this.skipped.length > 0 && this.added.length > 0;
  }

  skip(sku: string, reason: string): void {
    this.skipped.push({ sku, reason });
  }

  add(line: ReorderLineInput): void {
    this.added.push(line);
  }

  warnOnOutOfStock(sku: string, availableQuantity: number, requestedQuantity: number): void {
    this.stockWarnings.push({ sku, availableQuantity, requestedQuantity });
  }
}

/** << Entity >> — entry point for reorder from order history (Increment 4). */
export class Reorder {
  readonly sourceOrderNumber: string;
  readonly owningCustomerAccountId: string;

  constructor(sourceOrderNumber: string, owningCustomerAccountId: string) {
    this.sourceOrderNumber = sourceOrderNumber;
    this.owningCustomerAccountId = owningCustomerAccountId;
  }
}
