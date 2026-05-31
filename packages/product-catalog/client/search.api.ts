import { performFetch } from '../../shared/http-io';
import { assertResponseOk } from '../../shared/http-client';

export interface SearchResultProductDto {
  sku: string;
  name: string;
  price: string;
  brand: string;
  categoryName: string | null;
  petType: string | null;
  inStock: boolean;
  relevanceScore: number;
}

export interface ProductSearchResultDto {
  keyword: string;
  products: SearchResultProductDto[];
  suggestions: string[];
  facets: Record<string, { value: string; count: number }[]>;
}

export interface ProductSearchQuery {
  q?: string;
  category?: string;
  petType?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export async function searchProducts(query: ProductSearchQuery): Promise<ProductSearchResultDto> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (query.petType) params.set('petType', query.petType);
  if (query.brand) params.set('brand', query.brand);
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.inStock) params.set('inStock', 'true');
  const response = await performFetch(`/api/products/search?${params.toString()}`);
  assertResponseOk(response, 'product search');
  return response.json() as Promise<ProductSearchResultDto>;
}
