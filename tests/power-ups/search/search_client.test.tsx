/**
 * Product search & filter — client tests (Increment 9 Sprint 1, engineering interface-design)
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GlobalSearchBar } from '../../../packages/app-client/src/components/GlobalSearchBar';
import { ProductSearchResultsPage } from '../../../packages/app-client/src/pages/catalog/ProductSearchResultsPage';

vi.mock('../../../packages/product-catalog/client/search.api', () => ({
  searchProducts: vi.fn(),
}));

import { searchProducts } from '../../../packages/product-catalog/client/search.api';

const mockSearch = searchProducts as ReturnType<typeof vi.fn>;

describe('Search Products by Keyword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearch.mockResolvedValue({
      keyword: 'kitten',
      products: [{ sku: 'KF-1', name: 'Kitten Food', price: '12.99', brand: 'Paws', categoryName: 'Cat Food', petType: 'cat', inStock: true, relevanceScore: 80 }],
      suggestions: [],
      facets: { category: [{ value: 'Cat Food', count: 1 }] },
    });
  });

  it('AC 4: global search navigates to search results', () => {
    render(
      <MemoryRouter initialEntries={['/product-catalog']}>
        <Routes>
          <Route path="*" element={<GlobalSearchBar />} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: 'kitten' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(window.location.pathname).toBe('/catalog/search');
  });

  it('AC 1: keyword results ranked in search results list', async () => {
    render(
      <MemoryRouter initialEntries={['/catalog/search?q=kitten']}>
        <ProductSearchResultsPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('search-results-list')).toHaveTextContent('Kitten Food');
    });
  });

  it('AC 2: no match shows guidance message', async () => {
    mockSearch.mockResolvedValueOnce({ keyword: 'zzzzz', products: [], suggestions: ['Dog Food'], facets: {} });
    render(
      <MemoryRouter initialEntries={['/catalog/search?q=zzzzz']}>
        <ProductSearchResultsPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('no-results-keyword')).toHaveTextContent('no results found');
    });
    expect(screen.getByText(/popular categories/)).toBeInTheDocument();
  });
});

describe('Filter Products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearch.mockResolvedValue({
      keyword: '',
      products: [],
      suggestions: [],
      facets: { category: [{ value: 'Dog Food', count: 2 }] },
    });
  });

  it('AC 1: facet panel shows category dimension with counts', async () => {
    render(
      <MemoryRouter initialEntries={['/catalog/search']}>
        <ProductSearchResultsPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('filter-facets-panel')).toHaveTextContent('Dog Food');
    });
    expect(screen.getByLabelText('facet match count')).toHaveTextContent('(2)');
  });

  it('AC 5: zero filter results show clear-all CTA', async () => {
    mockSearch
      .mockResolvedValueOnce({ keyword: '', products: [{ sku: '1', name: 'A', price: '1', brand: 'b', categoryName: 'Dog Food', petType: 'dog', inStock: true, relevanceScore: 1 }], suggestions: [], facets: { category: [{ value: 'Dog Food', count: 1 }] } })
      .mockResolvedValueOnce({ keyword: '', products: [], suggestions: [], facets: { category: [{ value: 'Dog Food', count: 1 }] } });
    render(
      <MemoryRouter initialEntries={['/catalog/search?category=Dog+Food']}>
        <ProductSearchResultsPage />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('no-results-filters')).toHaveTextContent('no products match your filters');
    });
    expect(screen.getByRole('button', { name: 'clear all filters' })).toBeInTheDocument();
  });
});
