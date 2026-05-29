import { SavedAddress, type SavedAddressFields } from './SavedAddress';

/** << Entity >> — collection of saved addresses for one customer account (Increment 4). */
export class AddressBook {
  readonly owningCustomerAccountId: string;
  readonly savedAddresses: SavedAddress[];
  defaultAddressId: string | null;

  constructor(owningCustomerAccountId: string, savedAddresses: SavedAddress[] = []) {
    this.owningCustomerAccountId = owningCustomerAccountId;
    this.savedAddresses = savedAddresses;
    this.defaultAddressId = savedAddresses.find((a) => a.defaultShippingFlag)?.id ?? null;
  }

  get addressCount(): number {
    return this.savedAddresses.filter((a) => !a.softDeleted).length;
  }

  get defaultAddress(): SavedAddress | undefined {
    if (!this.defaultAddressId) return undefined;
    return this.savedAddresses.find((a) => a.id === this.defaultAddressId && !a.softDeleted);
  }

  isDefault(addressId: string): boolean {
    return this.defaultAddressId === addressId;
  }

  /** CRC: first saved address becomes default automatically. */
  add(address: SavedAddress): void {
    this.savedAddresses.push(address);
    if (this.addressCount === 1) {
      this.assignDefault(address.id);
    }
  }

  assignDefault(addressId: string): void {
    for (const saved of this.savedAddresses) {
      if (saved.id === addressId) {
        saved.markDefaultShipping();
      } else {
        saved.clearDefaultShipping();
      }
    }
    this.defaultAddressId = addressId;
  }

  /** CRC: accept new entry from checkout or account settings. */
  acceptNewEntry(fields: SavedAddressFields, addressId: string): SavedAddress {
    const saved = SavedAddress.create(addressId, this.owningCustomerAccountId, fields);
    this.add(saved);
    return saved;
  }

  remove(addressId: string, newDefaultId?: string): void {
    const target = this.savedAddresses.find((a) => a.id === addressId);
    if (!target) return;
    if (this.isDefault(addressId) && this.addressCount > 1 && !newDefaultId) {
      throw new Error('deleting default address requires selecting a new default');
    }
    target.softDelete();
    if (this.isDefault(addressId) && newDefaultId) {
      this.assignDefault(newDefaultId);
    } else if (this.isDefault(addressId)) {
      this.defaultAddressId = null;
    }
  }
}
