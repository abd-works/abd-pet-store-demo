/**
 * Returning customers — base helper (Increment 4)
 *
 * Test data from increment-4-specification-by-example.md
 */
import type { RegisterInput } from '@pawplace/customer-account-shared';

export interface CustomerAccountTestData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SavedAddressTestData {
  label: string;
  addressLine1: string;
  city: string;
  postcode: string;
  country: string;
  countyOrRegion?: string;
}

export abstract class ReturningCustomersBase {
  static readonly STRONG_PASSWORD = 'Str0ngP@ss!' as const;
  static readonly VALID_PASSWORD = ReturningCustomersBase.STRONG_PASSWORD;

  static readonly JANE: CustomerAccountTestData = {
    email: 'jane.doe@example.com',
    password: ReturningCustomersBase.STRONG_PASSWORD,
    firstName: 'Jane',
    lastName: 'Doe',
  };

  static readonly TOM_UNVERIFIED: CustomerAccountTestData = {
    email: 'tom.reed@example.com',
    password: ReturningCustomersBase.STRONG_PASSWORD,
    firstName: 'Tom',
    lastName: 'Reed',
  };

  static readonly SARAH: CustomerAccountTestData = {
    email: 'sarah.jones@example.com',
    password: ReturningCustomersBase.STRONG_PASSWORD,
    firstName: 'Sarah',
    lastName: 'Jones',
  };

  static readonly NEW_USER: CustomerAccountTestData = {
    email: 'new.user@example.com',
    password: ReturningCustomersBase.STRONG_PASSWORD,
    firstName: 'New',
    lastName: 'User',
  };

  static readonly EXISTING_EMAIL = 'existing@example.com';
  static readonly UNKNOWN_EMAIL = 'unknown@example.com';

  static readonly HOME_ADDRESS: SavedAddressTestData = {
    label: 'Home',
    addressLine1: '42 Oak Lane',
    city: 'Bristol',
    postcode: 'BS1 4QT',
    country: 'United Kingdom',
  };

  static readonly WORK_ADDRESS: SavedAddressTestData = {
    label: 'Work',
    addressLine1: '10 High Street',
    city: 'London',
    postcode: 'E1 6AN',
    country: 'United Kingdom',
  };

  static readonly SKU_DOG_FOOD = 'PET-HAR-001';
  static readonly SKU_CAT_TOY = 'PET-TRT-042';
  static readonly SKU_LEASH = 'PET-HAR-001';
  static readonly DOG_FOOD_SKU = ReturningCustomersBase.SKU_DOG_FOOD;
  static readonly CAT_TOY_SKU = ReturningCustomersBase.SKU_CAT_TOY;
  static readonly LEASH_SKU = ReturningCustomersBase.SKU_LEASH;

  static toRegisterBody(customer: CustomerAccountTestData): RegisterInput {
    return {
      email: customer.email,
      password: customer.password,
      passwordConfirmation: customer.password,
      firstName: customer.firstName,
      lastName: customer.lastName,
    };
  }

  static weakPasswordCases(): Array<{ password: string; unmet: string }> {
    return [
      { password: 'short', unmet: 'minimum 8 characters' },
      { password: 'nouppercase1!', unmet: 'at least one uppercase letter' },
      { password: 'NoDigits!', unmet: 'at least one digit' },
    ];
  }
}
