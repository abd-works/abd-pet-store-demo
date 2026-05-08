/**
 * View Product Details -- server helper
 *
 * Seeds via MongoDB, acts via supertest, asserts with node:assert.
 */
import request from 'supertest';
import assert from 'node:assert/strict';
import { app } from '@pawplace/app-server';
import { ViewProductDetailsBase, ProductData, CategoryData, ImageData } from './view-product-details.base';

export class ViewProductDetailsServerHelper extends ViewProductDetailsBase {
  private createdSkus: string[] = [];
  private response: request.Response | null = null;

  async seed(products: readonly ProductData[], categories: readonly CategoryData[], images: readonly ImageData[]): Promise<void> {
    for (const p of products) {
      const cat = categories.find(c => c.product_sku === p.sku);
      const imgs = images.filter(i => i.product_sku === p.sku);
      await request(app).post('/api/test/products').send({ ...p, category: cat, images: imgs });
      this.createdSkus.push(p.sku);
    }
  }

  async cleanup(): Promise<void> {
    if (this.createdSkus.length === 0) return;
    await request(app).delete('/api/test/products').send({ skus: this.createdSkus });
    this.createdSkus = [];
  }

  // -- WHEN ---------------------------------------------------------------

  async when_customer_selects_product(sku: string): Promise<void> {
    this.response = await request(app).get(`/api/products/${sku}`);
  }

  // -- THEN ---------------------------------------------------------------

  then_response_contains_product_details(expected: ProductData): void {
    assert.equal(this.response!.status, 200);
    const body = this.response!.body;
    assert.equal(body.name, expected.product_name);
    assert.equal(body.price, expected.price);
    assert.equal(body.brand, expected.brand);
    assert.equal(body.description, expected.description);
  }

  then_dimensions_shown(expected: ProductData): void {
    const body = this.response!.body;
    if (expected.expected_dimensions_shown) {
      assert.equal(body.weight, expected.weight);
      assert.equal(body.dimensions.length, expected.length);
      assert.equal(body.dimensions.width, expected.width);
      assert.equal(body.dimensions.height, expected.height);
    } else {
      assert.equal(body.weight, null);
      assert.equal(body.dimensions, null);
    }
  }

  then_images_in_order(expectedImages: readonly ImageData[]): void {
    const body = this.response!.body;
    assert.equal(body.images.length, expectedImages.length);
    for (const img of expectedImages) {
      const actual = body.images[img.display_order - 1];
      assert.equal(actual.imageFile, img.image_file);
      assert.equal(actual.altText, img.alt_text);
      assert.equal(actual.displayOrder, img.display_order);
    }
  }

  then_breadcrumb_matches(expected: CategoryData): void {
    const body = this.response!.body;
    assert.equal(body.breadcrumb, expected.expected_breadcrumb);
    assert.equal(body.category.name, expected.category_name);
  }
}
