/**
 * Product search & filter — client tests (Increment 9 Sprint 1, engineering interface-design)
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchResultsList } from '../../../packages/product-catalog/client/SearchResultsList';
import { ActiveFilterChips } from '../../../packages/product-catalog/client/ActiveFilterChips';
import { GlobalSearchBar } from '../../../packages/app-client/src/components/GlobalSearchBar';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/', search: '' }),
  };
});

describe('Search Products by Keyword', () => {
  it('AC 2: no match shows no results found with suggestions', () => {
    render(
      <SearchResultsList
        keyword="zzzzz"
        products={[]}
        suggestions={['Dog Food', 'Cat Treats']}
        hasActiveFilters={false}
        onClearFilters={vi.fn()}
      />,
    );
    expect(screen.getByTestId('no-results-keyword')).toHaveTextContent('no results found');
    expect(screen.getByText(/Dog Food/)).toBeInTheDocument();
  });
});

describe('Filter Products', () => {
  it('AC 5: zero filter results shows clear all filters', () => {
    const onClear = vi.fn();
    render(
      <SearchResultsList
        keyword="food"
        products={[]}
        suggestions={[]}
        hasActiveFilters
        onClearFilters={onClear}
      />,
    );
    expect(screen.getByTestId('no-results-filters')).toHaveTextContent('no products match your filters');
    fireEvent.click(screen.getByRole('button', { name: 'clear all filters' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('AC 4: remove chip via ActiveFilterChips', () => {
    const onRemove = vi.fn();
    render(
      <ActiveFilterChips
        active={{ category: 'Dog Food' }}
        onRemove={onRemove}
        onClearAll={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove filter Dog Food' }));
    expect(onRemove).toHaveBeenCalledWith('category');
  });
});

describe('Search Products by Keyword — global bar', () => {
  it('AC 4: submit navigates to catalog search', () => {
    render(
      <MemoryRouter>
        <GlobalSearchBar />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: 'kitten' } });
    fireEvent.submit(screen.getByRole('search'));
    expect(mockNavigate).toHaveBeenCalledWith('/catalog/search?q=kitten');
  });
});
