import { WishlistItem } from './WishlistItem';

/** << Entity >> — verified-account product collection (Increment 4). */
export class Wishlist {
  readonly owningCustomerAccountId: string;
  readonly wishlistItems: WishlistItem[];

  constructor(owningCustomerAccountId: string, wishlistItems: WishlistItem[] = []) {
    this.owningCustomerAccountId = owningCustomerAccountId;
    this.wishlistItems = wishlistItems;
  }

  contains(sku: string): boolean {
    return this.wishlistItems.some((item) => item.productSku === sku);
  }

  addProduct(sku: string): WishlistItem {
    if (this.contains(sku)) {
      return this.wishlistItems.find((item) => item.productSku === sku)!;
    }
    const item = new WishlistItem(sku);
    this.wishlistItems.push(item);
    return item;
  }

  removeProduct(sku: string): void {
    const index = this.wishlistItems.findIndex((item) => item.productSku === sku);
    if (index >= 0) {
      this.wishlistItems.splice(index, 1);
    }
  }

  itemFor(sku: string): WishlistItem | undefined {
    return this.wishlistItems.find((item) => item.productSku === sku);
  }
}
