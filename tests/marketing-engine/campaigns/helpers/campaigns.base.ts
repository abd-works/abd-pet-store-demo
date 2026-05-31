/**
 * Marketing campaigns — shared test data (Increment 8 Sprint 3)
 * Backgrounds from docs/increments/8-marketing-engine/specification/specification-by-example.md
 */
import type { CustomerAccountTestData } from '../../../returning-customers/helpers/returning-customers.base';
import { ReturningCustomersBase } from '../../../returning-customers/helpers/returning-customers.base';
import { TOM } from '../../preferences/helpers/preferences.base';

export const CAMPAIGN_SUBJECT = 'Spring Sale — 20% off all toys';

export const SKU_FOOD_501 = 'SKU-FOOD-501';
export const SKU_TREAT_400 = 'SKU-TREAT-400';
export const RESTOCK_SKU = 'PET-HAR-001';
export const RESTOCK_PRODUCT_NAME = 'Pet Harness';

export const STORE_CAM = 'STORE-CAM';
export const STORE_CAM_NAME = 'PawPlace Camden';

export const EVENT_TITLE = 'Adoption Day — Saturday 17 May';

export const TOM_ACCOUNT: CustomerAccountTestData = TOM;

export const MARIA: CustomerAccountTestData = {
  ...ReturningCustomersBase.SARAH,
  email: 'maria.chen@pawplace.example',
  firstName: 'Maria',
  lastName: 'Chen',
};

export const OPTED_OUT: CustomerAccountTestData = {
  ...ReturningCustomersBase.NEW_USER,
  email: 'opted.out@pawplace.example',
  firstName: 'Jamie',
  lastName: 'Out',
};

export const NEW_USER_NO_HISTORY: CustomerAccountTestData = {
  ...ReturningCustomersBase.NEW_USER,
  email: 'new.user@pawplace.example',
};
