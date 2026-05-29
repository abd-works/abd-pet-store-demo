/**
 * View Product Details -- client tests
 *
 * Story: View Product Details (customer)
 */
import { describe, it, beforeEach, afterEach } from 'vitest';
import { ViewProductDetailsClientHelper } from './helpers/view-product-details.client';
import { ViewProductDetailsBase, ProductData } from './helpers/view-product-details.base';

// ============================================================================
// STORY: View Product Details
// ============================================================================

class TestViewProductDetails {
  constructor(private helper: ViewProductDetailsClientHelper) {}

  /**
   * SCENARIO: Product page shows full details
   * GIVEN: API returns Product data
   * WHEN: customer views ProductDetailView
   * THEN: page displays name, price, brand, description
   */
  async product_page_shows_full_details(sku: string): Promise<void> {
    const expected = this.helper.given_product(sku);
    const cat = this.helper.given_category(sku);
    const imgs = this.helper.given_images(sku);
    await this.helper.seed([expected], [cat], imgs);
    await this.helper.when_customer_views_product(sku);
    await this.helper.then_page_displays_details(expected);
  }

  /**
   * SCENARIO: Weight and dimensions shown where relevant
   * GIVEN: Product has or lacks weight/dimensions
   * WHEN: customer views ProductDetailView
   * THEN: dimensions section visible or hidden
   */
  async weight_and_dimensions_shown_where_relevant(sku: string): Promise<void> {
    const expected = this.helper.given_product(sku);
    const cat = this.helper.given_category(sku);
    const imgs = this.helper.given_images(sku);
    await this.helper.seed([expected], [cat], imgs);
    await this.helper.when_customer_views_product(sku);
    await this.helper.then_dimensions_shown(expected);
  }

  /**
   * SCENARIO: Multiple images with navigation
   * GIVEN: Product has 3 ProductImages
   * WHEN: customer views ProductDetailView
   * THEN: all images rendered with gallery navigation
   */
  async multiple_images_with_navigation(): Promise<void> {
    const product = this.helper.given_product('PET-HAR-001');
    const cat = this.helper.given_category('PET-HAR-001');
    const images = this.helper.given_images('PET-HAR-001');
    await this.helper.seed([product], [cat], images);
    await this.helper.when_customer_views_product('PET-HAR-001');
    await this.helper.then_images_displayed(images);
  }

  /**
   * SCENARIO: Product organized by category
   * GIVEN: Product belongs to Category with parentCategory
   * WHEN: customer views ProductDetailView
   * THEN: category breadcrumb and name displayed
   */
  async product_shows_category(product_sku: string): Promise<void> {
    const product = this.helper.given_product(product_sku);
    const cat = this.helper.given_category(product_sku);
    const imgs = this.helper.given_images(product_sku);
    await this.helper.seed([product], [cat], imgs);
    await this.helper.when_customer_views_product(product_sku);
    await this.helper.then_breadcrumb_displayed(cat);
  }

  /**
   * SCENARIO: No purchase or review actions available
   * GIVEN: customer is viewing the product page
   * WHEN: customer looks for purchase or review actions
   * THEN: no cart, checkout, or review actions are available
   */
  async no_purchase_or_review_actions(): Promise<void> {
    const product = this.helper.given_product('PET-HAR-001');
    const cat = this.helper.given_category('PET-HAR-001');
    const imgs = this.helper.given_images('PET-HAR-001');
    await this.helper.seed([product], [cat], imgs);
    await this.helper.when_customer_views_product('PET-HAR-001');
    await this.helper.then_no_purchase_or_review_actions();
  }
}

// ============================================================================
// TEST WIRING
// ============================================================================

describe('View Product Details', () => {
  let helper: ViewProductDetailsClientHelper;
  let tests: TestViewProductDetails;

  beforeEach(async () => {
    helper = new ViewProductDetailsClientHelper();
    tests = new TestViewProductDetails(helper);
  });

  afterEach(async () => { await helper.cleanup(); });

  describe('TestViewProductDetails', () => {
    it.each(ViewProductDetailsBase.PRODUCTS.map(p => [p.product_name, p.sku]))(
      'product page shows full details for %s',
      async (_name: string, sku: string) => { await tests.product_page_shows_full_details(sku); },
    );

    it.each(ViewProductDetailsBase.PRODUCTS.map(p => [p.product_name, p.sku]))(
      'weight and dimensions shown where relevant for %s',
      async (_name: string, sku: string) => { await tests.weight_and_dimensions_shown_where_relevant(sku); },
    );

    it('multiple images with navigation for Premium Dog Harness', async () => {
      await tests.multiple_images_with_navigation();
    });

    it.each(ViewProductDetailsBase.CATEGORIES.map(c => [c.product_sku, c.expected_breadcrumb]))(
      'product shows category for sku %s',
      async (product_sku: string) => { await tests.product_shows_category(product_sku); },
    );

    it('no purchase or review actions available on product page', async () => {
      await tests.no_purchase_or_review_actions();
    });
  });
});

export { TestViewProductDetails };
