import { InsufficientStockError, type StockAvailability } from './StockAvailability';
import { assertNonNegativeStockLevel } from './stockAvailabilityValidation';

function applyStockLevel(stock: StockAvailability, newStockLevel: number): void {
  stock._stockLevel = newStockLevel;
  stock._quantityOnHand = newStockLevel;
  stock._availableToSellQuantity = stock._quantityOnHand - stock._reservedQuantity;
}

function notifyIfLowStock(stock: StockAvailability): void {
  stock._restockAlertTriggered =
    stock._restockAlertTriggered || stock._availableToSellQuantity <= stock.lowStockThreshold;
}

export function gateOrderFlow(stock: StockAvailability, requestedQuantity: number): boolean {
  if (requestedQuantity <= stock.availableToSellQuantity) return true;
  return stock.backorderEnabled;
}

export function reserveStock(stock: StockAvailability, quantity: number): void {
  if (quantity > stock.availableToSellQuantity) {
    throw new InsufficientStockError(quantity, stock.availableToSellQuantity);
  }
  stock._reservedQuantity += quantity;
  stock._availableToSellQuantity = stock._quantityOnHand - stock._reservedQuantity;
}

export function releaseReservedStock(stock: StockAvailability, quantity: number): void {
  if (quantity > stock.reservedQuantity) {
    throw new Error(`Cannot release ${quantity}: only ${stock.reservedQuantity} reserved`);
  }
  stock._reservedQuantity -= quantity;
  stock._availableToSellQuantity = stock._quantityOnHand - stock._reservedQuantity;
}

export function refreshStockFromEmployeeEdit(stock: StockAvailability, newStockLevel: number): void {
  assertNonNegativeStockLevel(newStockLevel);
  applyStockLevel(stock, newStockLevel);
  notifyIfLowStock(stock);
}

export function updateQuantityOnHand(stock: StockAvailability, newQuantity: number): void {
  refreshStockFromEmployeeEdit(stock, newQuantity);
}
