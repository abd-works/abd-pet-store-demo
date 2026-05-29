import { formatCurrency } from '@pawplace/cart-shared';

export const STANDARD_DELIVERY_COST_PENCE = 499;
export const STANDARD_DELIVERY_WINDOW = '3–5 business days';
export const STANDARD_SHIP_TRANSIT_DAYS = 5;

export type DeliveryOptionType = 'standard_delivery' | 'click_and_collect';

export interface StandardDeliveryOption {
  type: 'standard_delivery';
  shippingCostPence: number;
  estimatedDeliveryWindow: string;
}

export interface ClickAndCollectDeliveryOption {
  type: 'click_and_collect';
}

export type DeliveryOptionSnapshot = StandardDeliveryOption | ClickAndCollectDeliveryOption;

export class DeliveryOption {
  static standardDelivery(overrides?: Partial<StandardDeliveryOption>): StandardDeliveryOption {
    return {
      type: 'standard_delivery',
      shippingCostPence: overrides?.shippingCostPence ?? STANDARD_DELIVERY_COST_PENCE,
      estimatedDeliveryWindow: overrides?.estimatedDeliveryWindow ?? STANDARD_DELIVERY_WINDOW,
    };
  }

  static clickAndCollect(): ClickAndCollectDeliveryOption {
    return { type: 'click_and_collect' };
  }

  static deliveryTypeLabel(option: DeliveryOptionSnapshot): string {
    return option.type === 'standard_delivery' ? 'Standard Delivery' : 'Click-and-Collect';
  }

  static formatShippingCost(pence: number): string {
    return formatCurrency(pence / 100);
  }
}

export function formatShippingCostPence(pence: number): string {
  return DeliveryOption.formatShippingCost(pence);
}

/** << ValueObject >> — sole ship-to-home delivery option in Increment 3 (subtype of DeliveryOption). */
export class StandardDelivery {
  static select(overrides?: Partial<StandardDeliveryOption>): StandardDeliveryOption {
    return DeliveryOption.standardDelivery(overrides);
  }
}
