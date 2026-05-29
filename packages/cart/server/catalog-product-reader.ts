export interface CatalogProductReader {
  getProductBySku(sku: string): Promise<{ sku: string; name: string; price: string } | null>;
  getMaxAvailableToSell(productSku: string): Promise<number>;
}
