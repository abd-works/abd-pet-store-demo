import React, { useEffect, useState } from 'react';
import { getStockAvailability, updateStockQuantity } from './product-catalog.api';

interface StockAdminFormProps {
  productSku: string;
  storeCode: string;
}

export function StockAdminForm({ productSku, storeCode }: StockAdminFormProps) {
  const [quantityOnHand, setQuantityOnHand] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getStockAvailability(productSku, storeCode).then((data) => {
      setQuantityOnHand(data.quantityOnHand);
    });
  }, [productSku, storeCode]);

  function handleSubmit() {
    setSuccessMessage('');
    setErrorMessage('');
    updateStockQuantity(productSku, storeCode, quantityOnHand)
      .then(() => setSuccessMessage('Stock updated'))
      .catch((err: Error) => setErrorMessage(err.message));
  }

  return (
    <div>
      <label>
        Quantity on hand
        <input
          type="number"
          aria-label="Quantity on hand"
          value={quantityOnHand}
          onChange={(e) => setQuantityOnHand(Number(e.target.value))}
        />
      </label>
      <button type="button" onClick={handleSubmit}>
        Update Stock
      </button>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}
