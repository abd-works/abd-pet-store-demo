/** << Entity >> — one product entry on a wishlist (Increment 4). */
export class WishlistItem {
  readonly productSku: string;
  readonly addedAt: Date;

  constructor(productSku: string, addedAt: Date = new Date()) {
    if (!productSku.trim()) throw new Error('product SKU is required');
    this.productSku = productSku;
    this.addedAt = addedAt;
  }
}
