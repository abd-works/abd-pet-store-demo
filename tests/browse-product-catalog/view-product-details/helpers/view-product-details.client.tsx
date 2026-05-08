/**
 * View Product Details -- client helper
 *
 * Mocks API responses with vi.mock, renders with Testing Library, asserts with screen queries.
 */
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  // -- WHEN ---------------------------------------------------------------

  async when_customer_views_product(sku: string): Promise<void> {
    render(<ProductDetailView sku={sku} />);
  }

  // -- THEN ---------------------------------------------------------------

  async then_page_displays_details(expected: ProductData): Promise<void> {
    expect(await screen.findByText(expected.product_name)).toBeDefined();
    expect(screen.getByText(expected.price)).toBeDefined();
    expect(screen.getByText(expected.brand)).toBeDefined();
    expect(screen.getByText(expected.description)).toBeDefined();
  }

  async then_dimensions_shown(expected: ProductData): Promise<void> {
    if (expected.expected_dimensions_shown) {
      expect(await screen.findByText(expected.weight!)).toBeDefined();
    } else {
      expect(screen.queryByTestId('product-dimensions')).toBeNull();
    }
  }

  async then_images_displayed(expectedImages: readonly ImageData[]): Promise<void> {
    for (const img of expectedImages) {
      const el = await screen.findByAltText(img.alt_text);
      expect(el).toBeDefined();
    }
  }

  async then_breadcrumb_displayed(expected: CategoryData): Promise<void> {
    expect(await screen.findByText(expected.expected_breadcrumb)).toBeDefined();
  }
}
