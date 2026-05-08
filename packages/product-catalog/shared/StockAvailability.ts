export class NegativeQuantityError extends Error {
  constructor(quantity: number) {
    super(`Quantity must not be negative: ${quantity}`);
    this.name = 'NegativeQuantityError';
  }
}

export class InsufficientStockError extends Error {
  constructor(requested: number, available: number) {
    super(`Insufficient stock: requested ${requested}, available ${available}`);
    this.name = 'InsufficientStockError';
  }
}

export class StockAvailability {
  readonly productSku: string;
  readonly storeCode: string;
  private _quantityOnHand: number;
  private _reservedQuantity: number;
  private _availableToSellQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  lowStockThreshold: number;
  lastRestockedDate: Date | null;
  expectedRestockDate: Date | null;
  backorderEnabled: boolean;
  private _restockAlertTriggered = false;

  constructor(productSku: string, storeCode: string, quantityOnHand: number, reservedQuantity = 0) {
    if (!productSku) throw new Error('productSku is required');
    if (!storeCode) throw new Error('storeCode is required');
    if (quantityOnHand < 0) throw new NegativeQuantityError(quantityOnHand);

    this.productSku = productSku;
    this.storeCode = storeCode;
    this._quantityOnHand = quantityOnHand;
    this._reservedQuantity = reservedQuantity;
    this._availableToSellQuantity = quantityOnHand - reservedQuantity;
    this.reorderPoint = 0;
    this.reorderQuantity = 0;
    this.lowStockThreshold = 5;
    this.lastRestockedDate = null;
    this.expectedRestockDate = null;
    this.backorderEnabled = false;
  }

  get quantityOnHand(): number { return this._quantityOnHand; }
  get reservedQuantity(): number { return this._reservedQuantity; }
  get availableToSellQuantity(): number { return this._availableToSellQuantity; }
  get restockAlertTriggered(): boolean { return this._restockAlertTriggered; }

  gateOrderFlow(requestedQuantity: number): boolean {
    if (requestedQuantity <= this._availableToSellQuantity) return true;
    return this.backorderEnabled;
  }

  reserveStock(quantity: number): void {
    if (quantity > this._availableToSellQuantity) {
      throw new InsufficientStockError(quantity, this._availableToSellQuantity);
    }
    this._reservedQuantity += quantity;
    this._availableToSellQuantity = this._quantityOnHand - this._reservedQuantity;
  }

  releaseReservedStock(quantity: number): void {
    if (quantity > this._reservedQuantity) {
      throw new Error(`Cannot release ${quantity}: only ${this._reservedQuantity} reserved`);
    }
    this._reservedQuantity -= quantity;
    this._availableToSellQuantity = this._quantityOnHand - this._reservedQuantity;
  }

  updateQuantityOnHand(newQuantity: number): void {
    if (newQuantity < 0) throw new NegativeQuantityError(newQuantity);

    this._quantityOnHand = newQuantity;
    this._availableToSellQuantity = this._quantityOnHand - this._reservedQuantity;

    if (this._availableToSellQuantity <= this.lowStockThreshold) {
      this.triggerRestockAlert();
    }
  }

  stockLabel(): string {
    if (this._availableToSellQuantity > 0) {
      return `In Stock -- ${this._availableToSellQuantity} available`;
    }
    if (this.backorderEnabled) return 'Backorder Available';
    return 'Out of Stock';
  }

  private triggerRestockAlert(): void {
    this._restockAlertTriggered = true;
  }
}
