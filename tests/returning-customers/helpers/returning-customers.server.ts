/**
 * Returning customers — server helper (Increment 4)
 */
import assert from 'node:assert/strict';
import request, { type SuperAgentTest } from 'supertest';
import { app, testDeps } from '@pawplace/app-server';
import { ClickAndCollectServerHelper } from '../../click-and-collect/helpers/click-and-collect.server';
import { ClickAndCollectBase } from '../../click-and-collect/helpers/click-and-collect.base';
import {
  ReturningCustomersBase,
  type CustomerAccountTestData,
  type SavedAddressTestData,
} from './returning-customers.base';

export class ReturningCustomersServerHelper extends ClickAndCollectServerHelper {
  private registeredEmails: string[] = [];
  private delistedSkus: string[] = [];

  async seed(): Promise<void> {
    await super.seed();
    this.delistedSkus = [];
    await request(app).post('/api/test/cart/reset-all');
  }

  async cleanup(): Promise<void> {
    await request(app).post('/api/test/cart/reset-all');

    const ids: string[] = [];
    for (const email of this.registeredEmails) {
      const account = await testDeps.customerAccountModule.accounts.findByEmail(email);
      if (account) ids.push(account.id);
    }
    if (ids.length > 0) {
      await request(app).delete('/api/test/customer-accounts').send({ ids });
    }
    this.registeredEmails = [];
    this.delistedSkus = [];
    await super.cleanup();
  }

  async given_cart_with_item(agent: SuperAgentTest, sku: string, quantity = 1) {
    for (let i = 0; i < quantity; i += 1) {
      const res = await agent.post('/api/cart/items').send({ sku, quantity: 1 });
      assert.strictEqual(res.status, 201, `add to cart failed for ${sku}: ${JSON.stringify(res.body)}`);
    }
    const cartRes = await agent.get('/api/cart');
    assert.strictEqual(cartRes.status, 200);
    return cartRes;
  }

  async given_cart_with_item(agent: SuperAgentTest, sku: string, quantity = 1) {
    for (let i = 0; i < quantity; i += 1) {
      const res = await agent.post('/api/cart/items').send({ sku, quantity: 1 });
      assert.strictEqual(res.status, 201, `add to cart failed for ${sku}: ${JSON.stringify(res.body)}`);
    }
    return agent.get('/api/cart');
  }

  trackEmail(email: string): void {
    const normalized = email.toLowerCase();
    if (!this.registeredEmails.includes(normalized)) {
      this.registeredEmails.push(normalized);
    }
  }

  async when_register(customer: CustomerAccountTestData | ReturnType<typeof ReturningCustomersBase.toRegisterBody>) {
    const response = await request(app)
      .post('/api/auth/register')
      .send(
        'passwordConfirmation' in customer
          ? customer
          : ReturningCustomersBase.toRegisterBody(customer),
      );
    if (response.status === 201) this.trackEmail(customer.email);
    return response;
  }

  async when_login(agent: SuperAgentTest, email: string, password: string) {
    return agent.post('/api/auth/login').send({ email, password });
  }

  async when_logout(agent: SuperAgentTest) {
    return agent.post('/api/auth/logout');
  }

  async when_logout_everywhere(agent: SuperAgentTest) {
    return agent.post('/api/auth/logout-everywhere');
  }

  async when_verify_email(token: string) {
    return request(app).get(`/api/auth/verify?token=${encodeURIComponent(token)}`);
  }

  async when_request_password_reset(email: string) {
    return request(app).post('/api/auth/password-reset/request').send({ email });
  }

  async when_confirm_password_reset(token: string, password: string) {
    return request(app).post('/api/auth/password-reset/confirm').send({
      token,
      password,
      passwordConfirmation: password,
    });
  }

  async when_validate_reset_token(token: string) {
    return request(app).get(`/api/auth/password-reset/validate?token=${encodeURIComponent(token)}`);
  }

  async when_get_account(agent: SuperAgentTest) {
    return agent.get('/api/account');
  }

  async when_expire_current_session(agent: SuperAgentTest, _email?: string) {
    await this.when_logout(agent);
    return this.when_get_account(agent);
  }

  async fetch_verification_token(email: string): Promise<string | null> {
    const res = await request(app)
      .get('/api/test/customer-accounts/verification-token')
      .query({ email });
    return res.body.token ?? null;
  }

  async fetch_reset_token(email: string): Promise<string | null> {
    const res = await request(app)
      .get('/api/test/customer-accounts/reset-token')
      .query({ email });
    return res.body.token ?? null;
  }

  async mark_verified(email: string) {
    return request(app).post('/api/test/customer-accounts/mark-verified').send({ email });
  }

  async expire_verification_token(token: string) {
    return request(app).post('/api/test/customer-accounts/expire-verification-token').send({ token });
  }

  async expire_reset_token(email: string): Promise<void> {
    const token = await this.fetch_reset_token(email);
    if (token) testDeps.customerAccountModule.resetTokens.expireToken(token);
  }

  async consume_reset_token(email: string): Promise<void> {
    const token = await this.fetch_reset_token(email);
    if (token) testDeps.customerAccountModule.resetTokens.consume(token);
  }

  async seed_payment_method(
    email: string,
    params: {
      lastFour?: string;
      cardType?: string;
      expiryMonth?: number;
      expiryYear?: number;
      vendorToken?: string;
    } = {},
  ) {
    return request(app).post('/api/test/customer-accounts/payment-methods').send({
      email,
      lastFour: params.lastFour ?? '4242',
      cardType: params.cardType ?? 'Visa',
      expiryMonth: params.expiryMonth ?? 12,
      expiryYear: params.expiryYear ?? 2027,
      vendorToken: params.vendorToken ?? 'tok_sw_4242',
    });
  }

  async given_registered_account(customer: CustomerAccountTestData = ReturningCustomersBase.JANE) {
    const existing = await testDeps.customerAccountModule.accounts.findByEmail(customer.email);
    if (existing) {
      this.trackEmail(customer.email);
      return {
        status: 201,
        body: { message: 'check your email to verify', expectEmailShortly: false },
      } as request.Response;
    }
    const res = await this.when_register(customer);
    assert.strictEqual(res.status, 201);
    return res;
  }

  async given_verified_account(customer: CustomerAccountTestData = ReturningCustomersBase.JANE) {
    await this.given_registered_account(customer);
    await this.mark_verified(customer.email);
  }

  async given_registered_unverified(customer: CustomerAccountTestData = ReturningCustomersBase.JANE) {
    return this.given_registered_account(customer);
  }

  async given_verified_customer(
    agentOrCustomer: SuperAgentTest | CustomerAccountTestData = ReturningCustomersBase.JANE,
    customer: CustomerAccountTestData = ReturningCustomersBase.JANE,
  ) {
    if (typeof (agentOrCustomer as SuperAgentTest).post === 'function') {
      return this.given_logged_in_verified(agentOrCustomer as SuperAgentTest, customer);
    }
    await this.given_verified_account(agentOrCustomer as CustomerAccountTestData);
    return null;
  }

  async get_verification_token(email: string): Promise<string | null> {
    return this.fetch_verification_token(email);
  }

  async get_reset_token(email: string): Promise<string | null> {
    return this.fetch_reset_token(email);
  }

  async when_reset_password(token: string, password: string) {
    return this.when_confirm_password_reset(token, password);
  }

  async when_seed_payment_method(
    email: string,
    params: {
      lastFour?: string;
      cardType?: string;
      expiryMonth?: number;
      expiryYear?: number;
      vendorToken?: string;
    } = {},
  ) {
    return this.seed_payment_method(email, params);
  }

  async when_add_wishlist_item(agent: SuperAgentTest, sku: string) {
    return this.when_add_wishlist(agent, sku);
  }

  async when_remove_wishlist_item(agent: SuperAgentTest, sku: string) {
    return this.when_remove_wishlist(agent, sku);
  }

  async given_logged_in_verified(
    agent: SuperAgentTest,
    customer: CustomerAccountTestData = ReturningCustomersBase.JANE,
  ) {
    await this.given_verified_account(customer);
    const loginRes = await this.when_login(agent, customer.email, customer.password);
    assert.strictEqual(loginRes.status, 200);
    return loginRes;
  }

  async given_account_cart_item(accountEmail: string, sku: string, quantity: number) {
    await this.given_verified_account({ ...ReturningCustomersBase.JANE, email: accountEmail });
    await request(app)
      .post('/api/test/cart/account-items')
      .send({ email: accountEmail, sku, quantity });
  }

  async given_guest_cart_with_item(agent: SuperAgentTest, sku: string, quantity: number) {
    return this.given_cart_with_item(agent, sku, quantity);
  }

  async when_add_address(agent: SuperAgentTest, address: SavedAddressTestData, recipientName = 'Jane Doe') {
    return agent.post('/api/account/addresses').send({
      label: address.label,
      recipientName,
      addressLine1: address.addressLine1,
      addressLine2: '',
      city: address.city,
      postcode: address.postcode,
      country: address.country,
    });
  }

  async when_list_addresses(agent: SuperAgentTest) {
    return agent.get('/api/account/addresses');
  }

  async when_update_address(agent: SuperAgentTest, id: string, patch: Partial<SavedAddressTestData>) {
    const list = await this.when_list_addresses(agent);
    const existing = list.body.addresses.find((a: { id: string }) => a.id === id);
    return agent.patch(`/api/account/addresses/${id}`).send({
      label: patch.label ?? existing?.label ?? 'Home',
      recipientName: 'Jane Doe',
      addressLine1: patch.addressLine1 ?? existing?.addressLine1,
      addressLine2: existing?.addressLine2 ?? '',
      city: patch.city ?? existing?.city,
      postcode: patch.postcode ?? existing?.postcode,
      country: patch.country ?? existing?.country,
    });
  }

  async when_delete_address(agent: SuperAgentTest, id: string, newDefaultId?: string) {
    return agent.delete(`/api/account/addresses/${id}`).send(newDefaultId ? { newDefaultId } : {});
  }

  async when_set_default_address(agent: SuperAgentTest, id: string) {
    return agent.patch(`/api/account/addresses/${id}/default`);
  }

  async when_list_payment_methods(agent: SuperAgentTest) {
    return agent.get('/api/account/payment-methods');
  }

  async when_delete_payment_method(agent: SuperAgentTest, id: string, newDefaultId?: string) {
    return agent.delete(`/api/account/payment-methods/${id}`).send(newDefaultId ? { newDefaultId } : {});
  }

  async when_set_default_payment_method(agent: SuperAgentTest, id: string) {
    return agent.patch(`/api/account/payment-methods/${id}/default`);
  }

  async when_list_orders(agent: SuperAgentTest) {
    return agent.get('/api/account/orders');
  }

  async when_get_order(agent: SuperAgentTest, orderNumber: string) {
    return agent.get(`/api/account/orders/${orderNumber}`);
  }

  async when_reorder(agent: SuperAgentTest, orderNumber: string) {
    return agent.post(`/api/account/orders/${orderNumber}/reorder`);
  }

  async when_add_wishlist(agent: SuperAgentTest, sku: string) {
    return agent.post('/api/wishlist').send({ sku });
  }

  async when_remove_wishlist(agent: SuperAgentTest, sku: string) {
    return agent.delete(`/api/wishlist/${sku}`);
  }

  async when_list_wishlist(agent: SuperAgentTest) {
    return agent.get('/api/wishlist');
  }

  async when_get_cart(agent: SuperAgentTest) {
    return agent.get('/api/cart');
  }

  async when_delist_product(sku: string) {
    this.delistedSkus.push(sku);
    return request(app).delete('/api/test/products').send({ skus: [sku] });
  }

  async when_set_store_stock(sku: string, storeCode: string, quantityOnHand: number) {
    return request(app)
      .put(`/api/stock/${sku}/${storeCode}`)
      .send({ quantity_on_hand: quantityOnHand });
  }

  async given_placed_guest_order(
    agent: SuperAgentTest,
    guestEmail: string,
    guestName: string,
    sku: string,
    quantity = 1,
  ) {
    await this.given_cart_with_item(agent, sku, quantity);
    return this.when_place_guest_order(
      agent,
      { guest_email: guestEmail, guest_name: guestName },
      ClickAndCollectBase.VALID_BILLING,
      'STR-001',
    );
  }

  async given_confirmed_ship_to_home_for_email(
    agent: SuperAgentTest,
    guestEmail: string,
    sku = 'PET-HAR-001',
  ) {
    await this.given_cart_with_item(agent, sku, 1);
    const orderRes = await agent.post('/api/orders').send({
      guestEmail,
      guestName: 'Jane Doe',
      billingAddress: ClickAndCollectBase.VALID_BILLING,
      shippingAddress: {
        recipientName: 'Jane Doe',
        addressLine1: '42 Oak Lane',
        city: 'Bristol',
        postcode: 'BS1 4QT',
        country: 'United Kingdom',
      },
      deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
    });
    const orderNumber = orderRes.body.orderNumber as string;
    await this.when_pay_order(agent, orderNumber, '4242424242424242');
    return { orderNumber, orderRes };
  }

  async session_count(email: string): Promise<number> {
    const account = await testDeps.customerAccountModule.accounts.findByEmail(email);
    if (!account) return 0;
    return testDeps.customerAccountModule.customerSessions.listForAccount(account.id).length;
  }

  then_registration_confirmation(response: request.Response): void {
    assert.strictEqual(response.body.message, 'check your email to verify');
  }

  then_duplicate_email_error(response: request.Response): void {
    assert.strictEqual(response.status, 409);
    assert.strictEqual(response.body.error, 'This email is already in use');
    assert.ok(response.body.loginUrl);
  }

  then_password_requirements_error(response: request.Response, unmet: string): void {
    assert.strictEqual(response.status, 400);
    assert.ok(String(response.body.error).includes(unmet));
  }

  then_unmet_password_requirements(response: request.Response, unmet: string): void {
    this.then_password_requirements_error(response, unmet);
  }

  then_error(response: request.Response, message: string): void {
    assert.strictEqual(response.body.error, message);
  }

  then_message(response: request.Response, message: string): void {
    assert.strictEqual(response.body.message, message);
  }

  then_login_link_present(response: request.Response): void {
    assert.strictEqual(response.body.loginUrl, '/login');
  }

  then_verified_outcome(response: request.Response, outcome: string): void {
    assert.strictEqual(response.body.outcome, outcome);
  }

  then_account_verified(response: request.Response): void {
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.accountVerificationStatus, 'verified');
  }

  then_login_success(response: request.Response, email: string): void {
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.email, email);
  }

  then_login_invalid_credentials(response: request.Response): void {
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.error, 'invalid email or password');
  }

  then_unverified_login_blocked(response: request.Response): void {
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.error, 'please verify your email first');
    assert.strictEqual(response.body.resendAvailable, true);
  }

  then_cart_has_line(response: request.Response, sku: string, quantity: number): void {
    const item = response.body.items.find((row: { sku: string }) => row.sku === sku);
    assert.ok(item, `expected cart line for ${sku}`);
    assert.strictEqual(item.quantity, quantity);
  }

  then_reset_confirmation(response: request.Response): void {
    assert.strictEqual(response.body.message, 'check your email');
  }

  then_address_default(response: request.Response, isDefault: boolean): void {
    assert.strictEqual(response.body.isDefault, isDefault);
  }

  then_address_count(response: request.Response, count: number): void {
    assert.strictEqual(response.body.addresses.length, count);
  }

  then_default_address(response: request.Response, label: string): void {
    const row = response.body.addresses.find(
      (address: { label?: string; isDefault?: boolean }) => address.label === label,
    );
    assert.ok(row, `expected address ${label}`);
    assert.strictEqual(row.isDefault, true);
  }

  then_orders_count(response: request.Response, count: number): void {
    assert.strictEqual(response.body.orders.length, count);
  }

  then_wishlist_contains(response: request.Response, sku: string): void {
    assert.ok(response.body.items.some((item: { sku: string }) => item.sku === sku));
  }

  then_reorder_result(
    response: request.Response,
    expected: { addedSkus?: string[]; skippedSkus?: string[]; stockWarnings?: number },
  ): void {
    if (expected.addedSkus) {
      for (const sku of expected.addedSkus) {
        assert.ok(response.body.addedSkus.includes(sku));
      }
    }
    if (expected.skippedSkus) {
      for (const sku of expected.skippedSkus) {
        assert.ok(response.body.skippedSkus.includes(sku));
      }
    }
    if (expected.stockWarnings !== undefined) {
      assert.strictEqual(response.body.stockWarnings.length, expected.stockWarnings);
    }
  }

  async then_cart_quantity(agent: SuperAgentTest, sku: string, quantity: number): Promise<void> {
    const response = await this.when_get_cart(agent);
    this.then_cart_has_line(response, sku, quantity);
  }
}
