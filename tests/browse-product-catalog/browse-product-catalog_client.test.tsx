/**
 * Browse Product Catalog — client acceptance tests (Increment 1)
 *
 * Story: View Product Details — Scenario 4 (browse prerequisite): category-organized catalog,
 * no keyword search; lo-fi selectable product rows (*select product*).
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCatalogGrid } from '@pawplace/product-catalog-client';
import type { ProductSummaryDTO } from '@pawplace/product-catalog-client/product-catalog.api';
import * as productCatalogApi from '@pawplace/product-catalog-client/product-catalog.api';

vi.mock('@pawplace/product-catalog-client/product-catalog.api');

const CATALOG_ROWS: ProductSummaryDTO[] = [
  {
    sku: 'PET-HAR-001',
    name: 'Premium Dog Harness',
    price: '34.99',
    brand: 'WalkRight',
    category_name: 'Harnesses & Leads',
    thumbnail: null,
  },
  {
    sku: 'PET-TRT-042',
    name: 'Salmon Cat Treats',
    price: '4.99',
    brand: 'PurrDelight',
    category_name: 'Cat Treats',
    thumbnail: null,
  },
];

describe('Browse Product Catalog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists categories and product rows with select-product links; no search field', async () => {
    vi.mocked(productCatalogApi.fetchProducts).mockResolvedValue(CATALOG_ROWS);
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ProductCatalogGrid, null),
      ),
    );

    await screen.findByTestId('product-catalog');
    expect(screen.getByRole('listbox', { name: /category filter/i })).toBeInTheDocument();

    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();

    const selectLinks = screen.getAllByTestId('select-product');
    expect(selectLinks.length).toBe(CATALOG_ROWS.length);
    expect(screen.getAllByRole('link', { name: 'select product' })).toHaveLength(CATALOG_ROWS.length);
    expect(screen.getByText('Premium Dog Harness')).toBeInTheDocument();
    expect(screen.getByText('Salmon Cat Treats')).toBeInTheDocument();
  });

  it('filters displayed products when visitor picks a category', async () => {
    vi.mocked(productCatalogApi.fetchProducts).mockImplementation(async (category?: string) =>
      Promise.resolve(category
        ? CATALOG_ROWS.filter((p) => p.category_name === category)
        : CATALOG_ROWS));

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ProductCatalogGrid, null),
      ),
    );

    await screen.findByText('Premium Dog Harness');
    fireEvent.click(screen.getByRole('option', { name: 'Cat Treats' }));

    await screen.findByText('Salmon Cat Treats');
    expect(screen.queryByText('Premium Dog Harness')).not.toBeInTheDocument();
  });
});
