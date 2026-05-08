import { Product } from './Product';

export class ProductCatalog {
  products: Product[];

  constructor() {
    this.products = [];
  }

  browseProducts(): Product[] {
    return [...this.products];
  }

  filterByCategory(categoryName: string): Product[] {
    return this.products.filter(
      p => p.categories.some(c => c.categoryName === categoryName),
    );
  }

  filterByBrand(brand: string): Product[] {
    return this.products.filter(p => p.brand === brand);
  }

  search(keyword: string): Product[] {
    const lower = keyword.toLowerCase();
    return this.products.filter(
      p => p.name.toLowerCase().includes(lower)
        || p.description.toLowerCase().includes(lower)
        || p.brand.toLowerCase().includes(lower),
    );
  }

  computeAggregateRating(product: Product): void {
    if (product.customerReviews.length === 0) {
      product.aggregateStarRating = 0;
      return;
    }
    product.aggregateStarRating = product.customerReviews.reduce(
      (sum, r) => sum + r.rating, 0,
    ) / product.customerReviews.length;
  }
}
