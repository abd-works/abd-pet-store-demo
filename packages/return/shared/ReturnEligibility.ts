import { ReturnWindow } from './ReturnWindow';

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  eligibleItems: EligibleItem[];
}

export interface EligibleItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  returnInProgress: boolean;
}

interface OrderForEligibility {
  orderNumber: string;
  status: string;
  deliveredAt?: Date;
  items: Array<{ sku: string; name: string; quantity: number; unitPrice: number }>;
}

interface ExistingReturn {
  returnedItems: Array<{ sku: string; quantity: number }>;
  returnStatus: string;
}

/** << Domain Rule >> — evaluates return eligibility per item within the return window. */
export class ReturnEligibility {
  private readonly _returnWindow: ReturnWindow;

  constructor(returnWindow: ReturnWindow = new ReturnWindow()) {
    this._returnWindow = returnWindow;
  }

  isEligible(
    order: OrderForEligibility,
    requestedSkus: string[],
    existingReturns: ExistingReturn[] = [],
    currentDate: Date = new Date(),
  ): EligibilityResult {
    if (order.status !== 'delivered') {
      return { eligible: false, reason: 'order has not been delivered', eligibleItems: [] };
    }

    if (!order.deliveredAt) {
      return { eligible: false, reason: 'delivery date not recorded', eligibleItems: [] };
    }

    if (!this._returnWindow.isWithinWindow(order.deliveredAt, currentDate)) {
      return { eligible: false, reason: 'return window expired', eligibleItems: [] };
    }

    const inProgressSkus = this.collectInProgressSkus(existingReturns);

    const eligibleItems: EligibleItem[] = order.items.map((item) => {
      const returnedQty = inProgressSkus.get(item.sku) ?? 0;
      const returnInProgress = returnedQty >= item.quantity;
      return {
        sku: item.sku,
        name: item.name,
        quantity: item.quantity - returnedQty,
        unitPrice: item.unitPrice,
        returnInProgress,
      };
    });

    const selectableItems = eligibleItems.filter((i) => !i.returnInProgress && i.quantity > 0);

    if (requestedSkus.length > 0) {
      const invalid = requestedSkus.filter(
        (sku) => !selectableItems.some((i) => i.sku === sku),
      );
      if (invalid.length > 0) {
        return {
          eligible: false,
          reason: `items not eligible for return: ${invalid.join(', ')}`,
          eligibleItems,
        };
      }
    }

    return {
      eligible: selectableItems.length > 0,
      reason: selectableItems.length === 0 ? 'no eligible items remaining' : undefined,
      eligibleItems,
    };
  }

  private collectInProgressSkus(existingReturns: ExistingReturn[]): Map<string, number> {
    const skuMap = new Map<string, number>();
    for (const ret of existingReturns) {
      if (ret.returnStatus === 'completed') continue;
      for (const item of ret.returnedItems) {
        skuMap.set(item.sku, (skuMap.get(item.sku) ?? 0) + item.quantity);
      }
    }
    return skuMap;
  }
}
