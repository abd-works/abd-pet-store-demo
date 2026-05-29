import { getStockAvailability, updateStockQuantity } from './product-catalog.api';
import type { StockAdminFormState } from './useStockAdminFormState';

function applySavedStock(form: StockAdminFormState, updated: Awaited<ReturnType<typeof getStockAvailability>>) {
  form.setStock(updated);
  form.setInputQty(updated.quantityOnHand);
  form.setSuccessMessage('stock level saved');
}

async function persistStockQuantity(form: StockAdminFormState) {
  await updateStockQuantity(form.productSku, form.storeCode, form.inputQty);
  const updated = await getStockAvailability(form.productSku, form.storeCode);
  applySavedStock(form, updated);
}

export function createStockAdminSubmitHandler(form: StockAdminFormState) {
  return (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.productSku || !form.storeCode) return;
    form.setSuccessMessage('');
    form.setErrorMessage('');

    if (form.inputQty < 0 || Number.isNaN(form.inputQty)) {
      form.setErrorMessage('stock level must be zero or greater');
      return;
    }

    persistStockQuantity(form).catch((error: Error) => form.setErrorMessage(error.message));
  };
}

export function createStockAdminCancelHandler(form: StockAdminFormState) {
  return () => {
    if (form.stock) form.setInputQty(form.stock.quantityOnHand);
    form.setErrorMessage('');
    form.setSuccessMessage('');
  };
}
