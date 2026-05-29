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
