/**
 * Search and Filter Products -- Client Helper
 *
 * Story: Display Real-Time Stock Availability
 * Seeds by mocking API. WHEN: render + Testing Library. THEN: screen + expect.
 */
import React from 'react';
import { vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StockAvailabilityDisplay } from '@pawplace/product-catalog-client';
import * as productCatalogApi from '@pawplace/product-catalog-client/product-catalog.api';
import {
  SearchAndFilterProductsHelper,
  type StockAvailabilityScenario,
} from './search-and-filter-products.base';

vi.mock('@pawplace/product-catalog-client/product-catalog.api');

export class SearchAndFilterProductsClientHelper extends SearchAndFilterProductsHelper {

  async seed(): Promise<void> {
    /* client seeds per-test via givenMocked* -- no global seed needed */
  }

  async cleanup(): Promise<void> {
    vi.restoreAllMocks();
  }

  givenMockedStockResponse(product_sku: string, scenarios: readonly StockAvailabilityScenario[]): void {
    const stores = scenarios.filter(s => s.product_sku === product_sku).map(s => ({
      store_code: s.store_code,
      store_name: s.store_name,
      available_to_sell_quantity: s.available_to_sell_quantity,
      stock_label: s.expected_stock_label,
    }));
    vi.mocked(productCatalogApi.fetchStockAvailability).mockResolvedValue(stores);
  }

  givenMockedUpdatedStock(product_sku: string, store_code: string, available_to_sell_quantity: number): void {
    const label = available_to_sell_quantity > 0
      ? `In Stock -- ${available_to_sell_quantity} available`
      : 'Out of Stock';
    vi.mocked(productCatalogApi.fetchStockAvailability).mockResolvedValue([
      { store_code, store_name: '', available_to_sell_quantity, stock_label: label },
    ]);
  }

  whenCustomerViewsProductPage(product_sku: string): void {
    render(React.createElement(StockAvailabilityDisplay, { productSku: product_sku }));
  }

  async thenStoreShowsStockLabel(store_name: string, expected_stock_label: string): Promise<void> {
    const label = await screen.findByTestId(`stock-label-${store_name}`);
    expect(label).toHaveTextContent(expected_stock_label);
  }

  async thenStoreShowsAvailableQuantity(store_code: string, expected_available_to_sell: number): Promise<void> {
    const el = await screen.findByTestId(`stock-${store_code}`);
    expect(el).toHaveTextContent(String(expected_available_to_sell));
  }
}
