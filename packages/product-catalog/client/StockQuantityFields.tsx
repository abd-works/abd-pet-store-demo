import React from 'react';
import { stockAdminInputStyle, stockAdminSummaryStyle } from './stockAdminFormStyles';

interface StockQuantitySummaryProps {
  quantityOnHand: number;
  availableToSellQuantity: number;
}

function StockQuantitySummary({ quantityOnHand, availableToSellQuantity }: StockQuantitySummaryProps) {
  return (
    <div style={stockAdminSummaryStyle}>
      <div data-testid="quantity-on-hand">quantity on hand (saved): {quantityOnHand}</div>
      <div data-testid="available-to-sell">available to sell: {availableToSellQuantity}</div>
    </div>
  );
}

interface StockLevelInputProps {
  inputQty: number;
  errorMessage: string;
  onQtyChange: (qty: number) => void;
}

function StockLevelInput({ inputQty, errorMessage, onQtyChange }: StockLevelInputProps) {
  return (
    <label htmlFor="stock-level-input">
      stock level
      <input
        id="stock-level-input"
        type="number"
        aria-label="stock level"
        aria-describedby={errorMessage ? 'stock-validation' : undefined}
        value={inputQty}
        onChange={(event) => onQtyChange(Number(event.target.value))}
        style={stockAdminInputStyle}
      />
    </label>
  );
}

interface StockQuantityFieldsProps {
  stock: { quantityOnHand: number; availableToSellQuantity: number };
  inputQty: number;
  errorMessage: string;
  onQtyChange: (qty: number) => void;
}

export function StockQuantityFields({ stock, inputQty, errorMessage, onQtyChange }: StockQuantityFieldsProps) {
  return (
    <>
      <StockLevelInput inputQty={inputQty} errorMessage={errorMessage} onQtyChange={onQtyChange} />
      <StockQuantitySummary
        quantityOnHand={stock.quantityOnHand}
        availableToSellQuantity={stock.availableToSellQuantity}
      />
    </>
  );
}
