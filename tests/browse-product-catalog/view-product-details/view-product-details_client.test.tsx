/**
 * View Product Details -- client tests
 *
 * Story: View Product Details (customer)
 * Scenarios: product page details, weight/dimensions, image gallery, category breadcrumb
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { ViewProductDetailsClientHelper } from './helpers/view-product-details.client';
import { ViewProductDetailsBase, ProductData, CategoryData, ImageData } from './helpers/view-product-details.base';

describe('ViewProductDetails (client)', () => {
  let helper: ViewProductDetailsClientHelper;

  beforeEach(async () => {
    helper = new ViewProductDetailsClientHelper();
  });

  afterEach(async () => { await helper.cleanup(); });

  // ========================================================================
  // Scenario 1: Product page shows name, price, brand, and description
  // ========================================================================

  it.each(ViewProductDetailsBase.PRODUCTS.map(p => [p.product_name, p.sku]))(
    'product page renders details for %s',
    /**
     * SCENARIO: Product page shows name, price, brand, and description
     * GIVEN: API returns Product data
     * WHEN: customer views ProductDetailView
     * THEN: page displays name, price, brand, description
     */
    async (product_name: string, sku: string) => {
      // Given
      const expected = helper.given_product(sku);
      const cat = helper.given_category(sku);
      const imgs = helper.given_images(sku);
      await helper.seed([expected], [cat], imgs);
      // When
      await helper.when_customer_views_product(sku);
      // Then
      await helper.then_page_displays_details(expected);
    },
  );

  // ========================================================================
  // Scenario 2: Weight and dimensions shown when present
  // ========================================================================

  it.each(ViewProductDetailsBase.PRODUCTS.map(p => [p.product_name, p.sku, p.expected_dimensions_shown]))(
    'dimensions shown=%s for %s',
    /**
     * SCENARIO: Weight and dimensions shown when present
     * GIVEN: Product has or lacks weight/dimensions
     * WHEN: customer views ProductDetailView
     * THEN: dimensions section visible or hidden
     */
    async (_name: string, sku: string) => {
      // Given
      const expected = helper.given_product(sku);
      const cat = helper.given_category(sku);
      const imgs = helper.given_images(sku);
      await helper.seed([expected], [cat], imgs);
      // When
      await helper.when_customer_views_product(sku);
      // Then
      await helper.then_dimensions_shown(expected);
    },
  );

  // ========================================================================
  // Scenario 3: Product images displayed in order
  // ========================================================================

  it('product images displayed for Premium Dog Harness',
    /**
     * SCENARIO: Product images displayed in order
     * GIVEN: Product has 3 ProductImages
     * WHEN: customer views ProductDetailView
     * THEN: all images rendered with correct alt text
     */
    async () => {
      // Given
      const product = helper.given_product('PET-HAR-001');
      const cat = helper.given_category('PET-HAR-001');
      const images = helper.given_images('PET-HAR-001');
      await helper.seed([product], [cat], images);
      // When
      await helper.when_customer_views_product('PET-HAR-001');
      // Then
      await helper.then_images_displayed(images);
    },
  );

  // ========================================================================
  // Scenario 4: Product appears under its category with breadcrumb
  // ========================================================================

  it.each(ViewProductDetailsBase.CATEGORIES.map(c => [c.product_sku, c.expected_breadcrumb]))(
    'breadcrumb shows %s for sku %s',
    /**
     * SCENARIO: Product appears under its category with breadcrumb
     * GIVEN: Product belongs to Category with parentCategory
     * WHEN: customer views ProductDetailView
     * THEN: breadcrumb text displayed
     */
    async (product_sku: string) => {
      // Given
      const product = helper.given_product(product_sku);
      const cat = helper.given_category(product_sku);
      const imgs = helper.given_images(product_sku);
      await helper.seed([product], [cat], imgs);
      // When
      await helper.when_customer_views_product(product_sku);
      // Then
      await helper.then_breadcrumb_displayed(cat);
    },
  );
});
