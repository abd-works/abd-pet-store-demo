/**
 * View Product Details -- E2E tests
 *
 * Story: View Product Details (customer)
 * Scenarios: product page details, weight/dimensions, image gallery, category breadcrumb
 */
import { test, expect } from '@playwright/test';
import { ViewProductDetailsE2EHelper } from './helpers/view-product-details.e2e';
import { ViewProductDetailsBase } from './helpers/view-product-details.base';

test.describe('ViewProductDetails (e2e)', () => {
  let helper: ViewProductDetailsE2EHelper;

  test.beforeEach(async ({ page }) => {
    helper = new ViewProductDetailsE2EHelper(page);
    await helper.seed(
      ViewProductDetailsBase.PRODUCTS,
      ViewProductDetailsBase.CATEGORIES,
      ViewProductDetailsBase.IMAGES,
    );
  });

  test.afterEach(async () => { await helper.cleanup(); });

  // ========================================================================
  // Scenario 1: Product page shows name, price, brand, and description
  // ========================================================================

  for (const product of ViewProductDetailsBase.PRODUCTS) {
    test(`product page shows details for ${product.product_name}`,
      /**
       * SCENARIO: Product page shows name, price, brand, and description
       * GIVEN: ProductCatalog contains Product
       * WHEN: customer navigates to product page
       * THEN: page displays name, price, brand, description
       */
      async () => {
        // Given
        const expected = helper.given_product(product.sku);
        // When
        await helper.when_customer_selects_product(product.sku);
        // Then
        await helper.then_page_displays_details(expected);
      },
    );
  }

  // ========================================================================
  // Scenario 2: Weight and dimensions shown when present
  // ========================================================================

  for (const product of ViewProductDetailsBase.PRODUCTS) {
    test(`dimensions shown=${product.expected_dimensions_shown} for ${product.product_name}`,
      /**
       * SCENARIO: Weight and dimensions shown when present
       * GIVEN: Product has or lacks weight/dimensions
       * WHEN: customer navigates to product page
       * THEN: dimensions section visible or hidden
       */
      async () => {
        // Given
        const expected = helper.given_product(product.sku);
        // When
        await helper.when_customer_selects_product(product.sku);
        // Then
        await helper.then_dimensions_shown(expected);
      },
    );
  }

  // ========================================================================
  // Scenario 3: Product images displayed in order
  // ========================================================================

  test('product images displayed in order for Premium Dog Harness',
    /**
     * SCENARIO: Product images displayed in order
     * GIVEN: Product has 3 ProductImages with displayOrder
     * WHEN: customer navigates to product page
     * THEN: images at correct positions, navigation controls visible
     */
    async () => {
      // Given
      const images = helper.given_images('PET-HAR-001');
      // When
      await helper.when_customer_selects_product('PET-HAR-001');
      // Then
      await helper.then_images_in_order(images);
      await helper.then_navigation_controls_visible();
    },
  );

  // ========================================================================
  // Scenario 4: Product appears under its category with breadcrumb
  // ========================================================================

  for (const cat of ViewProductDetailsBase.CATEGORIES) {
    test(`breadcrumb shows ${cat.expected_breadcrumb} for sku ${cat.product_sku}`,
      /**
       * SCENARIO: Product appears under its category with breadcrumb
       * GIVEN: Product belongs to Category with parentCategory
       * WHEN: customer navigates to product page
       * THEN: breadcrumb displays parent > child
       */
      async () => {
        // Given
        const expected = helper.given_category(cat.product_sku);
        // When
        await helper.when_customer_selects_product(cat.product_sku);
        // Then
        await helper.then_breadcrumb_displayed(expected);
      },
    );
  }
});
