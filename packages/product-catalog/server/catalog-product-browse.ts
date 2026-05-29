import type { StoredProduct } from './product-catalog.repository';

export interface ProductStorageReader {
  findProductBySku(sku: string): StoredProduct | undefined;
  findAllProducts(): StoredProduct[];
}

export interface ProductSummaryResponse {
  sku: string;
  name: string;
  price: string;
  brand: string;
  category_name: string | null;
  thumbnail: string | null;
}

export interface ProductDetailResponse {
  name: string;
  sku: string;
  price: string;
  brand: string;
  description: string;
  weight: string | null;
  dimensions: { length: string | null; width: string | null; height: string | null } | null;
  images: { imageFile: string; altText: string; displayOrder: number }[];
  breadcrumb: string;
  category: { name: string } | null;
}

export function toProductSummary(product: StoredProduct): ProductSummaryResponse {
  const firstImage = product.images
    .slice()
    .sort((left, right) => left.display_order - right.display_order)[0];
  return {
    sku: product.sku,
    name: product.product_name,
    price: product.price,
    brand: product.brand,
    category_name: product.category?.category_name ?? null,
    thumbnail: firstImage?.image_file ?? null,
  };
}

function mapProductImages(product: StoredProduct) {
  return product.images
    .sort((left, right) => left.display_order - right.display_order)
    .map((image) => ({
      imageFile: image.image_file,
      altText: image.alt_text,
      displayOrder: image.display_order,
    }));
}

function productDimensions(product: StoredProduct) {
  const hasDimensions = product.length !== null || product.width !== null || product.height !== null;
  return hasDimensions ? { length: product.length, width: product.width, height: product.height } : null;
}

export function toProductDetail(product: StoredProduct): ProductDetailResponse {
  return {
    name: product.product_name,
    sku: product.sku,
    price: product.price,
    brand: product.brand,
    description: product.description,
    weight: product.weight,
    dimensions: productDimensions(product),
    images: mapProductImages(product),
    breadcrumb: product.category
      ? `${product.category.parent_category} > ${product.category.category_name}`
      : '',
    category: product.category ? { name: product.category.category_name } : null,
  };
}

export class CatalogProductBrowse {
  constructor(private readonly products: ProductStorageReader) {}

  browseProducts(categoryName?: string): ProductSummaryResponse[] {
    const allProducts = this.products.findAllProducts();
    const filtered = categoryName
      ? allProducts.filter((product) => product.category?.category_name === categoryName)
      : allProducts;
    return filtered
      .map((product) => toProductSummary(product))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  getProductBySku(sku: string): ProductDetailResponse | null {
    const product = this.products.findProductBySku(sku);
    return product ? toProductDetail(product) : null;
  }
}
