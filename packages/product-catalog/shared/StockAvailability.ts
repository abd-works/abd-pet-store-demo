import { assertNonNegativeStockLevel, assertStockAvailabilityInputs } from './stockAvailabilityValidation';

export class StockAvailability {
  readonly productSku: string;
  readonly storeCode: string;
  _stockLevel: number;
  _quantityOnHand: number;
  _reservedQuantity: number;
  _availableToSellQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  lowStockThreshold: number;
  lastRestockedDate: Date | null;
  expectedRestockDate: Date | null;
  backorderEnabled: boolean;
  _restockAlertTriggered = false;

  constructor(productSku: string, storeCode: string, stockLevel: number, reservedQuantity = 0) {
    assertStockAvailabilityInputs(productSku, storeCode, stockLevel);
    this.productSku = productSku;
    this.storeCode = storeCode;
    this._stockLevel = stockLevel;
    this._quantityOnHand = stockLevel;
    this._reservedQuantity = reservedQuantity;
    this._availableToSellQuantity = stockLevel - reservedQuantity;
    this.reorderPoint = 0;
    this.reorderQuantity = 0;
    this.lowStockThreshold = 5;
    this.lastRestockedDate = null;
    this.expectedRestockDate = null;
    this.backorderEnabled = false;
  }

  get stockLevel(): number { return this._stockLevel; }
  get quantityOnHand(): number { return this._quantityOnHand; }
  get reservedQuantity(): number { return this._reservedQuantity; }
  get availableToSellQuantity(): number { return this._availableToSellQuantity; }
  get restockAlertTriggered(): boolean { return this._restockAlertTriggered; }
}

export { NegativeQuantityError, InsufficientStockError } from './stockAvailabilityErrors';
export { walkInAvailabilityLabel, staffStockLabel } from './stockAvailabilityLabels';
export {
  gateOrderFlow,
  reserveStock,
  releaseReservedStock,
  refreshStockFromEmployeeEdit,
  updateQuantityOnHand,
} from './stockAvailabilityReservation';
