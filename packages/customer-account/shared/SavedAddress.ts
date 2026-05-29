export interface SavedAddressFields {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countyOrRegion?: string;
  postcode: string;
  country: string;
  label?: string;
}

/** << ValueObject >> — persisted delivery/billing address on customer account (Increment 4). */
export class SavedAddress {
  readonly id: string;
  readonly owningCustomerAccountId: string;
  readonly recipientName: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly countyOrRegion?: string;
  readonly postcode: string;
  readonly country: string;
  readonly addressLabel: string;
  defaultShippingFlag: boolean;
  defaultBillingFlag: boolean;
  softDeleted: boolean;

  constructor(
    id: string,
    owningCustomerAccountId: string,
    fields: SavedAddressFields,
    defaultShippingFlag = false,
    defaultBillingFlag = false,
  ) {
    this.id = id;
    this.owningCustomerAccountId = owningCustomerAccountId;
    this.recipientName = fields.recipientName;
    this.addressLine1 = fields.addressLine1;
    this.addressLine2 = fields.addressLine2;
    this.city = fields.city;
    this.countyOrRegion = fields.countyOrRegion;
    this.postcode = fields.postcode;
    this.country = fields.country;
    this.addressLabel = fields.label ?? 'Home';
    this.defaultShippingFlag = defaultShippingFlag;
    this.defaultBillingFlag = defaultBillingFlag;
    this.softDeleted = false;
  }

  static create(
    id: string,
    owningCustomerAccountId: string,
    fields: SavedAddressFields,
  ): SavedAddress {
    return new SavedAddress(id, owningCustomerAccountId, fields);
  }

  markDefaultShipping(): void {
    this.defaultShippingFlag = true;
  }

  clearDefaultShipping(): void {
    this.defaultShippingFlag = false;
  }

  softDelete(): void {
    this.softDeleted = true;
  }
}
