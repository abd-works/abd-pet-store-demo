import React from 'react';
import { Link } from 'react-router-dom';
import type { SearchResultProductDto } from './search.api';

interface SearchResultsListProps {
  keyword: string;
  products: SearchResultProductDto[];
  suggestions: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function SearchResultsList({
  keyword,
  products,
  suggestions,
  hasActiveFilters,
  onClearFilters,
}: SearchResultsListProps) {
  if (products.length === 0 && keyword && !hasActiveFilters) {
    return (
      <div role="status" data-testid="no-results-keyword">
        <p>no results found</p>
        {suggestions.length > 0 && (
          <p>
            popular categories:
            {' '}
            {suggestions.join(', ')}
          </p>
        )}
      </div>
    );
  }

  if (products.length === 0 && hasActiveFilters) {
    return (
      <div role="status" data-testid="no-results-filters">
        <p>no products match your filters</p>
        <button type="button" onClick={onClearFilters}>clear all filters</button>
      </div>
    );
  }

  return (
    <ul aria-label="search results list" data-testid="search-results-list" style={{ listStyle: 'none', padding: 0 }}>
      {products.map((product) => (
        <li key={product.sku} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
          <Link to={`/products/${product.sku}`}>{product.name}</Link>
          <div style={{ fontSize: 14, color: '#666' }}>
            {product.price}
            {' · '}
            {product.categoryName ?? 'uncategorized'}
          </div>
        </li>
      ))}
    </ul>
  );
}
