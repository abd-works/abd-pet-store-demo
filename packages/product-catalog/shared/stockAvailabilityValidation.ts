import { NegativeQuantityError } from './stockAvailabilityErrors';

export function assertStockAvailabilityInputs(
  productSku: string,
  storeCode: string,
  stockLevel: number,
): void {
  if (!productSku) throw new Error('productSku is required');
  if (!storeCode) throw new Error('storeCode is required');
  if (stockLevel < 0) throw new NegativeQuantityError(stockLevel);
}

export function assertNonNegativeStockLevel(stockLevel: number): void {
  if (stockLevel < 0) throw new NegativeQuantityError(stockLevel);
}
