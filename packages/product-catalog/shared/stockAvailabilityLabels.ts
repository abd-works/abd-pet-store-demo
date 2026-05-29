import type { StockAvailability } from './StockAvailability';

export function walkInAvailabilityLabel(stock: StockAvailability): string {
  if (stock.availableToSellQuantity > 0) return 'In Stock';
  if (stock.backorderEnabled) return 'Backorder Available';
  return 'Out of Stock';
}

export function staffStockLabel(stock: StockAvailability): string {
  if (stock.availableToSellQuantity > 0) {
    return `In Stock -- ${stock.availableToSellQuantity} available`;
  }
  if (stock.backorderEnabled) return 'Backorder Available';
  return 'Out of Stock';
}
