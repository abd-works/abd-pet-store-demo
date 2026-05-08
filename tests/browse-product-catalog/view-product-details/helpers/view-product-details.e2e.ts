/**
 * View Product Details -- E2E helper
 *
 * Seeds via API test endpoint, acts via Playwright page, asserts with Playwright expect.
 */
import { Page, expect } from '@playwright/test';
import { ViewProductDetailsBase, ProductData, CategoryData, ImageData } from './view-product-details.base';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export class ViewProductDetailsE2EHelper extends ViewProductDetailsBase {
  private createdSkus: string[] = [];

  constructor(private page: Page) { super(); }

  async seed(products: readonly ProductData[], categories: readonly CategoryData[], images: readonly ImageData[]): Promise<void> {
    for (const p of products) {
      const cat = categories.find(c => c.product_sku === p.sku);
      const imgs = images.filter(i => i.product_sku === p.sku);
      await this.page.request.post(`${BASE_URL}/api/test/products`, {
        data: { ...p, category: cat, images: imgs },
      });
      this.createdSkus.push(p.sku);
    }
  }

  async cleanup(): Promise<void> {
    if (this.createdSkus.length === 0) return;
    await this.page.request.delete(`${BASE_URL}/api/test/products`, {
      data: { skus: this.createdSkus },
    });
    this.createdSkus = [];
  }

  // -- WHEN ---------------------------------------------------------------

  async when_customer_selects_product(sku: string): Promise<void> {
    await this.page.goto(`${BASE_URL}/products/${sku}`);
  }

  // -- THEN ---------------------------------------------------------------

  async then_page_displays_details(expected: ProductData): Promise<void> {
    await expect(this.page.getByText(expected.product_name)).toBeVisible();
    await expect(this.page.getByText(expected.price)).toBeVisible();
    await expect(this.page.getByText(expected.brand)).toBeVisible();
    await expect(this.page.getByText(expected.description)).toBeVisible();
  }

  async then_dimensions_shown(expected: ProductData): Promise<void> {
    if (expected.expected_dimensions_shown) {
      await expect(this.page.getByText(expected.weight!)).toBeVisible();
    } else {
      await expect(this.page.getByTestId('product-dimensions')).not.toBeVisible();
    }
  }

  async then_images_in_order(expectedImages: readonly ImageData[]): Promise<void> {
    for (const img of expectedImages) {
      await expect(this.page.getByAltText(img.alt_text)).toBeVisible();
    }
    const imgs = this.page.locator('[data-testid="product-image"]');
    await expect(imgs).toHaveCount(expectedImages.length);
  }

  async then_navigation_controls_visible(): Promise<void> {
    await expect(this.page.getByTestId('image-gallery-nav')).toBeVisible();
  }

  async then_breadcrumb_displayed(expected: CategoryData): Promise<void> {
    await expect(this.page.getByTestId('category-breadcrumb')).toContainText(expected.expected_breadcrumb);
  }
}
