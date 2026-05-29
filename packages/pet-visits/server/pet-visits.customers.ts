export interface CustomerRecord {
  customerAccountId: string;
  emailAddress: string;
  accountStatus: string;
  customerName: string;
}

export class InMemoryCustomerRegistry {
  private customers = new Map<string, CustomerRecord>();

  add(customer: CustomerRecord): void {
    this.customers.set(customer.customerAccountId, customer);
  }

  get(customerAccountId: string): CustomerRecord | undefined {
    return this.customers.get(customerAccountId);
  }

  getEmail(customerId: string): string {
    return this.customers.get(customerId)?.emailAddress ?? 'unknown@example.com';
  }

  getName(customerId: string): string {
    return this.customers.get(customerId)?.customerName ?? 'Unknown';
  }

  deleteMany(ids: string[]): void {
    for (const id of ids) this.customers.delete(id);
  }

  clear(): void {
    this.customers.clear();
  }
}
