/**
 * View Product Details -- client helper
 *
 * Mocks API responses with vi.mock, renders with Testing Library, asserts with screen queries.
 */
import React from 'react';
import { vi, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductDetailView } from '@pawplace/product-catalog-client';
import * as productApi from '@pawplace/product-catalog-client/product-catalog.api';
import { ViewProductDetailsBase, ProductData, CategoryData, ImageData } from './view-product-details.base';

vi.mock('@pawplace/product-catalog-client/product-catalog.api');

export class ViewProductDetailsClientHelper extends ViewProductDetailsBase {

  async seed(products: readonly ProductData[], categories: readonly CategoryData[], images: readonly ImageData[]): Promise<void> {
    const product = products[0];
    const cat = categories.find(c => c.product_sku === product.sku);
    const imgs = images.filter(i => i.product_sku === product.sku);
    vi.mocked(productApi.fetchProductBySku).mockResolvedValue({
      name: product.product_name, sku: product.sku, price: product.price,
      brand: product.brand, description: product.description,
      weight: product.weight, dimensions: product.expected_dimensions_shown
        ? { length: product.length, width: product.width, height: product.height } : null,
      images: imgs.map(i => ({ imageFile: i.image_file, altText: i.alt_text, displayOrder: i.display_order })),
      breadcrumb: cat?.expected_breadcrumb ?? '', category: cat ? { name: cat.category_name } : null,
    });
  }

  async cleanup(): Promise<void> {
    vi.restoreAllMocks();
  }

  async when_customer_views_product(sku: string): Promise<void> {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ProductDetailView, { sku }),
      ),
    );
  }

  async then_page_displays_details(expected: ProductData): Promise<void> {
    const scope = await screen.findByTestId('product-detail');
    expect(within(scope).getByRole('heading', { name: expected.product_name })).toBeInTheDocument();
    expect(scope.textContent ?? '').toContain(expected.price);
    expect(within(scope).getByText(expected.description)).toBeInTheDocument();
  }

  async then_dimensions_shown(expected: ProductData): Promise<void> {
    if (expected.expected_dimensions_shown) {
      const scope = await screen.findByTestId('product-detail');
      expect(within(scope).getByText(`weight ${expected.weight}`)).toBeInTheDocument();
      expect(within(scope).getByText(`length ${expected.length}`)).toBeInTheDocument();
      expect(within(scope).getByText(`width ${expected.width}`)).toBeInTheDocument();
      expect(within(scope).getByText(`height ${expected.height}`)).toBeInTheDocument();
    } else {
      const dims = screen.queryByTestId('product-dimensions');
      expect(dims?.textContent?.includes('weight')).toBeFalsy();
    }
  }

  async then_images_displayed(expectedImages: readonly ImageData[]): Promise<void> {
    for (const img of expectedImages) {
      const matches = await screen.findAllByAltText(img.alt_text);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.getByTestId('image-gallery-nav')).toBeInTheDocument();
  }

  async then_breadcrumb_displayed(expected: CategoryData): Promise<void> {
    const product = ViewProductDetailsBase.PRODUCTS.find((p) => p.sku === expected.product_sku)!;
    const scope = await screen.findByTestId('product-detail');
    expect(within(scope).getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    expect(within(scope).getByRole('link', { name: /^product catalog$/i })).toBeInTheDocument();
    expect(within(scope).getByRole('navigation', { name: 'breadcrumb' })).toHaveTextContent(
      product.product_name,
    );
    expect(within(scope).getByTestId('product-category')).toHaveTextContent(expected.category_name);
  }

  async then_no_purchase_or_review_actions(): Promise<void> {
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /review/i })).not.toBeInTheDocument();
  }
}
