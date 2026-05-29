import type { SavedAddressDto, SavedAddressInput } from '@pawplace/customer-account-shared';
import { randomUUID } from 'node:crypto';

interface AddressBookState {
  addresses: SavedAddressDto[];
}

export class AddressBookRepository {
  private readonly books = new Map<string, AddressBookState>();

  load(accountId: string): AddressBookState {
    return this.books.get(accountId) ?? { addresses: [] };
  }

  save(accountId: string, state: AddressBookState): void {
    this.books.set(accountId, state);
  }
}

export function createSavedAddress(input: SavedAddressInput, isDefault: boolean): SavedAddressDto {
  return {
    id: randomUUID(),
    ...input,
    addressLine2: input.addressLine2 ?? '',
    countyOrRegion: input.countyOrRegion ?? '',
    isDefault,
  };
}
