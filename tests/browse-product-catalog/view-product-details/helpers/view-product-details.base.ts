/**
 * View Product Details -- base helper
 *
 * Story: View Product Details (customer)
 * Scenarios: product page details, weight/dimensions, image gallery, category breadcrumb
 */
// ============================================================================
// STANDARD TEST DATA
// ============================================================================

export interface ProductData {
  product_name: string;
  sku: string;
  price: string;
  brand: string;
  description: string;
  weight: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  expected_dimensions_shown: boolean;
}

export interface CategoryData {
  product_sku: string;
  category_name: string;
  parent_category: string;
  expected_breadcrumb: string;
}

export interface ImageData {
  product_sku: string;
  image_file: string;
  alt_text: string;
  display_order: number;
}

export abstract class ViewProductDetailsBase {

  static readonly PRODUCTS: readonly ProductData[] = [
    {
      product_name: 'Premium Dog Harness',
      sku: 'PET-HAR-001',
      price: '34.99',
      brand: 'WalkRight',
      description: 'Adjustable padded harness for medium breeds',
      weight: '0.35 kg',
      length: '30.0 cm',
      width: '20.0 cm',
      height: '5.0 cm',
      expected_dimensions_shown: true,
    },
    {
      product_name: 'Salmon Cat Treats',
      sku: 'PET-TRT-042',
      price: '4.99',
      brand: 'PurrDelight',
      description: 'Grain-free salmon bites, 100g pouch',
      weight: null,
      length: null,
      width: null,
      height: null,
      expected_dimensions_shown: false,
    },
  ] as const;

  static readonly CATEGORIES: readonly CategoryData[] = [
    {
      product_sku: 'PET-HAR-001',
      category_name: 'Harnesses & Leads',
      parent_category: 'Dog Supplies',
      expected_breadcrumb: 'Dog Supplies > Harnesses & Leads',
    },
    {
      product_sku: 'PET-TRT-042',
      category_name: 'Cat Treats',
      parent_category: 'Cat Supplies',
      expected_breadcrumb: 'Cat Supplies > Cat Treats',
    },
  ] as const;

  static readonly IMAGES: readonly ImageData[] = [
    { product_sku: 'PET-HAR-001', image_file: 'harness-front.jpg', alt_text: 'Front view of Premium Dog Harness', display_order: 1 },
    { product_sku: 'PET-HAR-001', image_file: 'harness-side.jpg', alt_text: 'Side view showing adjustment buckle', display_order: 2 },
    { product_sku: 'PET-HAR-001', image_file: 'harness-worn.jpg', alt_text: 'Harness worn by golden retriever', display_order: 3 },
  ] as const;

  // -- seed / cleanup (tier-specific) ------------------------------------

  abstract seed(products: readonly ProductData[], categories: readonly CategoryData[], images: readonly ImageData[]): Promise<void>;
  abstract cleanup(): Promise<void>;

  // -- GIVEN helpers (shared across tiers) --------------------------------

  given_product(sku: string): ProductData {
    return ViewProductDetailsBase.PRODUCTS.find(p => p.sku === sku)!;
  }

  given_category(product_sku: string): CategoryData {
    return ViewProductDetailsBase.CATEGORIES.find(c => c.product_sku === product_sku)!;
  }

  given_images(product_sku: string): readonly ImageData[] {
    return ViewProductDetailsBase.IMAGES.filter(i => i.product_sku === product_sku);
  }
}
