export interface InventoryDashboardRowDto {
  productSku: string;
  storeCode: string;
  storeName: string;
  quantityOnHand: number;
  availableToSellQuantity: number;
  backorderEnabled: boolean;
  lowStock: boolean;
}

export interface InventoryDashboardDto {
  rows: InventoryDashboardRowDto[];
  lowStockThreshold: number;
}

export function stockStatusLabel(row: InventoryDashboardRowDto, threshold: number): string {
  if (row.availableToSellQuantity <= 0) return 'Out of stock';
  if (row.availableToSellQuantity <= threshold) return 'Low stock';
  return 'In stock';
}

export function filterDashboardRows(
  rows: InventoryDashboardRowDto[],
  options: { search?: string; lowStockOnly?: boolean; threshold: number },
): InventoryDashboardRowDto[] {
  return rows.filter((row) => {
    if (options.lowStockOnly && row.availableToSellQuantity > options.threshold) return false;
    if (options.lowStockOnly && row.availableToSellQuantity <= 0) return false;
    if (options.search && !row.productSku.toLowerCase().includes(options.search.toLowerCase())) return false;
    return true;
  });
}
