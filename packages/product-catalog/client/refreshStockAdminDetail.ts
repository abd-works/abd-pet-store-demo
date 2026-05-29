import { getStockAvailability, type StockDetailDTO } from './product-catalog.api';

export interface StockAdminDetailSetters {
  setStock: (stock: StockDetailDTO | null) => void;
  setInputQty: (quantity: number) => void;
  setErrorMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
}

function applyStockLoadSuccess(detail: StockDetailDTO, setters: StockAdminDetailSetters): void {
  setters.setStock(detail);
  setters.setInputQty(detail.quantityOnHand);
}

function recordStockLoadFailure(error: unknown, setters: StockAdminDetailSetters): void {
  setters.setStock(null);
  setters.setErrorMessage(error instanceof Error ? error.message : 'Failed to load stock');
}

export async function refreshStockAdminDetail(
  productSku: string,
  storeCode: string,
  setters: StockAdminDetailSetters,
): Promise<void> {
  setters.setLoading(true);
  setters.setErrorMessage('');
  await getStockAvailability(productSku, storeCode)
    .then((detail) => applyStockLoadSuccess(detail, setters))
    .catch((error) => recordStockLoadFailure(error, setters));
  setters.setLoading(false);
}
