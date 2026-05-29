import { ProductImage } from './ProductImage';
import { Category } from './Category';
import { StockAvailability } from './StockAvailability';

export class Product {
  readonly name: string;
  readonly sku: string;
  price: number;
  brand: string;
  description: string;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  images: ProductImage[];
  categories: Category[];
  stockAvailability: StockAvailability[];
  customerReviews: { rating: number; comment: string }[];
  aggregateStarRating: number;
  reviewCount: number;

  constructor(name: string, sku: string, price: number, brand: string) {
    if (!name) throw new Error('name is required');
    if (!sku) throw new Error('sku is required');
    if (price <= 0) throw new Error('price must be positive');
    if (!brand) throw new Error('brand is required');

    this.name = name;
    this.sku = sku;
    this.price = price;
    this.brand = brand;
    this.description = '';
    this.weight = null;
    this.length = null;
    this.width = null;
    this.height = null;
    this.images = [];
    this.categories = [];
    this.stockAvailability = [];
    this.customerReviews = [];
    this.aggregateStarRating = 0;
    this.reviewCount = 0;
  }

  addReview(review: { rating: number; comment: string }): void {
    this.customerReviews.push(review);
    this.reviewCount = this.customerReviews.length;
    this.aggregateStarRating = this.customerReviews.reduce(
      (sum, r) => sum + r.rating, 0,
    ) / this.reviewCount;
  }

  snapshotPrice(): number {
    return this.price;
  }
}
