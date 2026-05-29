import type { ShippingAddressFields } from './ShippingAddress';

export type ShippingAddressValidationMessage =
  | 'Recipient name is required'
  | 'Address line 1 is required'
  | 'City is required'
  | 'Postcode is required'
  | 'Country is required';

export function validateShippingAddressFields(
  fields: ShippingAddressFields,
): ShippingAddressValidationMessage[] {
  const errors: ShippingAddressValidationMessage[] = [];
  if (!fields.recipientName?.trim()) errors.push('Recipient name is required');
  if (!fields.addressLine1?.trim()) errors.push('Address line 1 is required');
  if (!fields.city?.trim()) errors.push('City is required');
  if (!fields.postcode?.trim()) errors.push('Postcode is required');
  if (!fields.country?.trim()) errors.push('Country is required');
  return errors;
}

export function isShippingAddressComplete(fields: ShippingAddressFields): boolean {
  return validateShippingAddressFields(fields).length === 0;
}
