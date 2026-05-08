/**
 * View Product Details -- server tests
 *
 * Story: View Product Details (customer)
 * Scenarios: product page details, weight/dimensions, image gallery, category breadcrumb
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { ViewProductDetailsServerHelper } from './helpers/view-product-details.server';
import { ViewProductDetailsBase } from './helpers/view-product-details.base';

describe('ViewProductDetails (server)', () => {
  let helper: ViewProductDetailsServerHelper;

  beforeEach(async () => {
    helper = new ViewProductDetailsServerHelper();
    await helper.seed(
      ViewProductDetailsBase.PRODUCTS,
      ViewProductDetailsBase.CATEGORIES,
      ViewProductDetailsBase.IMAGES,
    );
  });

  afterEach(async () => { await helper.cleanup(); });

  // ========================================================================
  // Scenario 1: Product page shows name, price, brand, and description
  // ========================================================================

  it.each(ViewProductDetailsBase.PRODUCTS.map(p => [p.product_name, p.sku, p]))(
    'product page shows details for %s',
    /**
     * SCENARIO: Product page shows name, price, brand, and description
     * GIVEN: ProductCatalog contains Product with sku
     * WHEN: customer selects Product
     * THEN: page displays name, price, brand, description
     */
    async (_name: string, sku: string, product: (typeof ViewProductDetailsBase.PRODUCTS)[number]) => {
      // Given
      const expected = helper.given_product(sku);
      // When
      await helper.when_customer_selects_product(sku);
      // Then
      helper.then_response_contains_product_details(expected);
    },
  );

  // ========================================================================
  // Scenario 2: Weight and dimensions shown when present
  // ========================================================================

  it.each(ViewProductDetailsBase.PRODUCTS.map(p => [p.product_name, p.sku, p.expected_dimensions_shown]))(
    'dimensions shown=%s for %s',
    /**
     * SCENARIO: Weight and dimensions shown when present
     * GIVEN: Product has weight, length, width, height (or not)
     * WHEN: customer views the product page
     * THEN: dimensions are shown or hidden accordingly
     */
    async (_name: string, sku: string) => {
      // Given
      const expected = helper.given_product(sku);
      // When
      await helper.when_customer_selects_product(sku);
      // Then
      helper.then_dimensions_shown(expected);
    },
  );

  // ========================================================================
  // Scenario 3: Product images displayed in order
  // ========================================================================

  it('product images displayed in order for Premium Dog Harness',
    /**
     * SCENARIO: Product images displayed in order
     * GIVEN: Product Premium Dog Harness has 3 ProductImages
     * WHEN: customer views the product page
     * THEN: images appear at correct positions with alt text
     */
    async () => {
      // Given
      const images = helper.given_images('PET-HAR-001');
      // When
      await helper.when_customer_selects_product('PET-HAR-001');
      // Then
      helper.then_images_in_order(images);
    },
  );

  // ========================================================================
  // Scenario 4: Product appears under its category with breadcrumb
  // ========================================================================

  it.each(ViewProductDetailsBase.CATEGORIES.map(c => [c.product_sku, c.category_name, c.expected_breadcrumb]))(
    'breadcrumb shows %s for sku %s',
    /**
     * SCENARIO: Product appears under its category with breadcrumb
     * GIVEN: Product belongs to Category with parentCategory
     * WHEN: customer views the product page
     * THEN: breadcrumb shows parent > child
     */
    async (product_sku: string) => {
      // Given
      const expected = helper.given_category(product_sku);
      // When
      await helper.when_customer_selects_product(product_sku);
      // Then
      helper.then_breadcrumb_matches(expected);
    },
  );
});
