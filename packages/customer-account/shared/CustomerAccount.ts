import { AccountVerificationStatus } from './AccountVerificationStatus';
import { AddressBook } from './AddressBook';
import { EmailVerification } from './EmailVerification';
import { Wishlist } from './Wishlist';

export interface CustomerAccountId {
  value: string;
}

export interface CustomerName {
  firstName: string;
  lastName: string;
}

/** << Entity >> — persistent customer identity (Increment 4). */
export class CustomerAccount {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly emailAddress: string;
  phoneNumber: string;
  username: string;
  passwordHash: string;
  readonly registrationDate: Date;
  accountVerificationStatus: import('./AccountVerificationStatus').AccountVerificationStatusValue;
  accountStatus: string;
  readonly addressBook: AddressBook;
  readonly wishlist: Wishlist;
  emailVerification: EmailVerification | null;

  constructor(params: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    passwordHash: string;
    accountVerificationStatus: import('./AccountVerificationStatus').AccountVerificationStatusValue;
    registrationDate?: Date;
    phoneNumber?: string;
    username?: string;
    accountStatus?: string;
    addressBook?: AddressBook;
    wishlist?: Wishlist;
    emailVerification?: EmailVerification | null;
  }) {
    this.id = params.id;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.emailAddress = params.emailAddress;
    this.passwordHash = params.passwordHash;
    this.accountVerificationStatus = params.accountVerificationStatus;
    this.registrationDate = params.registrationDate ?? new Date();
    this.phoneNumber = params.phoneNumber ?? '';
    this.username = params.username ?? params.emailAddress;
    this.accountStatus = params.accountStatus ?? 'active';
    this.addressBook = params.addressBook ?? new AddressBook(params.id);
    this.wishlist = params.wishlist ?? new Wishlist(params.id);
    this.emailVerification = params.emailVerification ?? null;
  }

  /** CRC: register via email and password — account remains unverified until email verification succeeds. */
  static registerViaEmailAndPassword(
    id: string,
    emailAddress: string,
    passwordHash: string,
    name: CustomerName,
    verificationToken: string,
    verificationTtlHours: number,
  ): CustomerAccount {
    const account = new CustomerAccount({
      id,
      firstName: name.firstName,
      lastName: name.lastName,
      emailAddress,
      passwordHash,
      accountVerificationStatus: AccountVerificationStatus.unverified(),
    });
    account.emailVerification = EmailVerification.forAccount(
      id,
      verificationToken,
      verificationTtlHours,
    );
    return account;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /** CRC: reset password — invalidates all customer sessions on all devices (application tier enforces). */
  resetPassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
  }

  verifyEmail(): void {
    if (!this.emailVerification) {
      throw new Error('no email verification pending');
    }
    this.emailVerification.transitionAccountVerificationStatus(this);
  }
}
