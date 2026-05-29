import type { SavedAddressDto, SavedAddressInput } from '@pawplace/customer-account-shared';
import { AddressBookRepository, createSavedAddress } from './address-book.repository';
import { DefaultAddressDeletionRequiresReplacementError } from './customer-account.errors';

export class AddressBookService {
  constructor(private readonly repository: AddressBookRepository) {}

  list(accountId: string): SavedAddressDto[] {
    return this.repository.load(accountId).addresses;
  }

  add(accountId: string, input: SavedAddressInput): SavedAddressDto {
    const book = this.repository.load(accountId);
    const isDefault = book.addresses.length === 0;
    const address = createSavedAddress(input, isDefault);
    book.addresses.push(address);
    this.repository.save(accountId, book);
    return address;
  }

  update(accountId: string, addressId: string, input: SavedAddressInput): SavedAddressDto {
    const book = this.repository.load(accountId);
    const index = book.addresses.findIndex((a) => a.id === addressId);
    if (index < 0) throw new Error('Address not found');
    const existing = book.addresses[index];
    const updated: SavedAddressDto = {
      ...existing,
      ...input,
      addressLine2: input.addressLine2 ?? '',
      countyOrRegion: input.countyOrRegion ?? '',
    };
    book.addresses[index] = updated;
    this.repository.save(accountId, book);
    return updated;
  }

  delete(accountId: string, addressId: string, newDefaultId?: string): void {
    const book = this.repository.load(accountId);
    const target = book.addresses.find((a) => a.id === addressId);
    if (!target) return;

    if (target.isDefault && book.addresses.length > 1 && !newDefaultId) {
      throw new DefaultAddressDeletionRequiresReplacementError();
    }

    book.addresses = book.addresses.filter((a) => a.id !== addressId);
    if (newDefaultId) {
      for (const addr of book.addresses) {
        addr.isDefault = addr.id === newDefaultId;
      }
    } else if (book.addresses.length === 1) {
      book.addresses[0].isDefault = true;
    }
    this.repository.save(accountId, book);
  }

  setDefault(accountId: string, addressId: string): void {
    const book = this.repository.load(accountId);
    for (const addr of book.addresses) {
      addr.isDefault = addr.id === addressId;
    }
    this.repository.save(accountId, book);
  }

  getDefault(accountId: string): SavedAddressDto | null {
    return this.repository.load(accountId).addresses.find((a) => a.isDefault) ?? null;
  }
}
