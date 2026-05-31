import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { FilterFacetsPanel } from '../../../../product-catalog/client/FilterFacetsPanel';
import { ActiveFilterChips } from '../../../../product-catalog/client/ActiveFilterChips';
import { SearchResultsList } from '../../../../product-catalog/client/SearchResultsList';
import { searchProducts, type ProductSearchResultDto } from '../../../../product-catalog/client/search.api';

function parseFilters(params: URLSearchParams) {
  return {
    category: params.get('category') ?? undefined,
    petType: params.get('petType') ?? undefined,
    brand: params.get('brand') ?? undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    inStock: params.get('inStock') === 'true' ? true : undefined,
  };
}

export function ProductSearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('q') ?? '';
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const [result, setResult] = useState<ProductSearchResultDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void searchProducts({ q: keyword, ...filters })
      .then(setResult)
      .catch(() => setResult({ keyword, products: [], suggestions: [], facets: {} }))
      .finally(() => setLoading(false));
  }, [keyword, filters.category, filters.petType, filters.brand, filters.minPrice, filters.maxPrice, filters.inStock]);

  const updateFilters = (next: typeof filters) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined || value === false || value === '') params.delete(key);
      else params.set(key, String(value));
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    ['category', 'petType', 'brand', 'minPrice', 'maxPrice', 'inStock'].forEach((k) => params.delete(k));
    setSearchParams(params);
  };

  const hasActiveFilters = Boolean(
    filters.category || filters.petType || filters.brand || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.inStock,
  );

  return (
    <CustomerPage title="product search results" wide>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        <FilterFacetsPanel
          facets={result?.facets ?? {}}
          active={filters}
          onChange={updateFilters}
        />
        <section>
          <ActiveFilterChips
            active={filters}
            onRemove={(key) => updateFilters({ ...filters, [key]: undefined })}
            onClearAll={clearFilters}
          />
          {loading && <p>Loading…</p>}
          {!loading && result && (
            <SearchResultsList
              keyword={result.keyword}
              products={result.products}
              suggestions={result.suggestions}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          )}
          {!loading && result && result.products.length > 0 && (
            <button type="button" style={{ marginTop: 8 }} onClick={() => navigate(`/catalog/search?q=${encodeURIComponent(keyword)}`)}>
              refresh search
            </button>
          )}
        </section>
      </div>
    </CustomerPage>
  );
}
