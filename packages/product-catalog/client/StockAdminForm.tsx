import React, { useEffect, useState } from 'react';
import { getStockAvailability, updateStockQuantity, type StockDetailDTO } from './product-catalog.api';

interface StockAdminFormProps {
  productSku: string;
  storeCode: string;
}

export function StockAdminForm({ productSku, storeCode }: StockAdminFormProps) {
  const [stock, setStock] = useState<StockDetailDTO | null>(null);
  const [inputQty, setInputQty] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getStockAvailability(productSku, storeCode).then((data) => {
      setStock(data);
      setInputQty(data.quantityOnHand);
    });
  }, [productSku, storeCode]);

  function handleSubmit() {
    setSuccessMessage('');
    setErrorMessage('');
    updateStockQuantity(productSku, storeCode, inputQty)
      .then(() => getStockAvailability(productSku, storeCode))
      .then((updated) => {
        setStock(updated);
        setInputQty(updated.quantityOnHand);
        setSuccessMessage('Stock updated');
      })
      .catch((err: Error) => setErrorMessage(err.message));
  }

  if (!stock) return null;

  return (
    <div>
      <label>
        Quantity on hand
        <input
          type="number"
          aria-label="Quantity on hand"
          value={inputQty}
          onChange={(e) => setInputQty(Number(e.target.value))}
        />
      </label>
      <div data-testid="quantity-on-hand">{stock.quantityOnHand}</div>
      <div data-testid="available-to-sell">{stock.availableToSellQuantity}</div>
      <button type="button" onClick={handleSubmit}>
        Update Stock
      </button>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}
