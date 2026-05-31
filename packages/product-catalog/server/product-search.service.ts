import type { StoredProduct } from './product-catalog.repository';

export interface ProductSearchFilters {
  category?: string;
  petType?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export interface SearchResultProduct {
  sku: string;
  name: string;
  price: string;
  brand: string;
  categoryName: string | null;
  petType: string | null;
  inStock: boolean;
  relevanceScore: number;
}

export interface ProductSearchResult {
  keyword: string;
  products: SearchResultProduct[];
  suggestions: string[];
  facets: Record<string, { value: string; count: number }[]>;
}

function inferPetType(product: StoredProduct): string | null {
  const category = product.category?.category_name?.toLowerCase() ?? '';
  if (category.includes('dog')) return 'dog';
  if (category.includes('cat') || category.includes('kitten')) return 'cat';
  if (category.includes('reptile')) return 'reptile';
  return null;
}

function scoreProduct(product: StoredProduct, keyword: string): number {
  const lower = keyword.toLowerCase();
  const fields = [
    product.product_name,
    product.description,
    product.brand,
    product.category?.category_name ?? '',
  ].map((value) => value.toLowerCase());

  if (product.product_name.toLowerCase() === lower) return 100;
  if (product.product_name.toLowerCase().includes(lower)) return 80;
  if (fields.some((field) => field.includes(lower))) return 60;
  if (fields.some((field) => field.split(/\s+/).some((word) => word.startsWith(lower)))) return 40;
  return 0;
}

export class ProductSearchService {
  constructor(
    private readonly products: { findAllProducts(): StoredProduct[] },
    private readonly stockReader: { getMaxAvailableToSell(sku: string): number },
  ) {}

  search(keyword: string, filters: ProductSearchFilters = {}): ProductSearchResult {
    const trimmed = keyword.trim();
    const allProducts = this.products.findAllProducts();

    let matches = allProducts
      .map((product) => ({
        product,
        score: trimmed ? scoreProduct(product, trimmed) : 1,
        petType: inferPetType(product),
        inStock: this.stockReader.getMaxAvailableToSell(product.sku) > 0,
      }))
      .filter((entry) => (trimmed ? entry.score > 0 : true));

    matches = this.applyFilters(matches, filters);
    matches.sort((left, right) => right.score - left.score || left.product.product_name.localeCompare(right.product.product_name));

    const products = matches.map(({ product, score, petType, inStock }) => ({
      sku: product.sku,
      name: product.product_name,
      price: product.price,
      brand: product.brand,
      categoryName: product.category?.category_name ?? null,
      petType,
      inStock,
      relevanceScore: score,
    }));

    return {
      keyword: trimmed,
      products,
      suggestions: products.length === 0 ? this.buildSuggestions(allProducts) : [],
      facets: this.buildFacets(allProducts, filters),
    };
  }

  private applyFilters(
    matches: Array<{ product: StoredProduct; score: number; petType: string | null; inStock: boolean }>,
    filters: ProductSearchFilters,
  ) {
    return matches.filter(({ product, petType, inStock }) => {
      if (filters.category && product.category?.category_name !== filters.category) return false;
      if (filters.petType && petType !== filters.petType) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (filters.inStockOnly && !inStock) return false;
      const price = Number.parseFloat(product.price);
      if (filters.minPrice !== undefined && price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      return true;
    });
  }

  private buildSuggestions(products: StoredProduct[]): string[] {
    const categories = [...new Set(products.map((p) => p.category?.category_name).filter(Boolean))] as string[];
    return categories.slice(0, 3);
  }

  private buildFacets(
    products: StoredProduct[],
    filters: ProductSearchFilters,
  ): Record<string, { value: string; count: number }[]> {
    const filtered = products
      .map((product) => ({
        product,
        petType: inferPetType(product),
        inStock: this.stockReader.getMaxAvailableToSell(product.sku) > 0,
      }))
      .filter(({ product, petType, inStock }) => {
        if (filters.category && product.category?.category_name !== filters.category) return false;
        if (filters.petType && petType !== filters.petType) return false;
        if (filters.brand && product.brand !== filters.brand) return false;
        if (filters.inStockOnly && !inStock) return false;
        const price = Number.parseFloat(product.price);
        if (filters.minPrice !== undefined && price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
        return true;
      });

    const countMap = (values: string[]) => {
      const map = new Map<string, number>();
      for (const value of values) map.set(value, (map.get(value) ?? 0) + 1);
      return [...map.entries()].map(([value, count]) => ({ value, count }));
    };

    return {
      category: countMap(
        filtered.map(({ product }) => product.category?.category_name).filter(Boolean) as string[],
      ),
      brand: countMap(filtered.map(({ product }) => product.brand).filter(Boolean)),
      petType: countMap(filtered.map(({ petType }) => petType).filter(Boolean) as string[]),
    };
  }
}
