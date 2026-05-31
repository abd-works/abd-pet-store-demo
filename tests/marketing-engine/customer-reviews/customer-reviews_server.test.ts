/**
 * Customer reviews — server and domain tests (Increment 8 Sprint 1)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { app } from '@pawplace/app-server';
import { StarRating, InvalidStarRatingError, AggregateStarRating, ReviewPhoto, UnsupportedReviewPhotoFormatError } from '@pawplace/product-catalog-shared';
import { ReturningCustomersServerHelper } from '../../returning-customers/helpers/returning-customers.server';
import { ReturningCustomersBase } from '../../returning-customers/helpers/returning-customers.base';

const sku = 'PET-HAR-001';

describe('Customer Review domain', () => {
  it('StarRating rejects out-of-range values', () => {
    expect(() => StarRating.of(0)).toThrow(InvalidStarRatingError);
  });

  it('AggregateStarRating is empty with no reviews', () => {
    expect(AggregateStarRating.fromReviews([]).isEmpty()).toBe(true);
  });

  it('ReviewPhoto rejects unsupported formats', () => {
    expect(() => ReviewPhoto.create({
      storageKey: 'k',
      originalFilename: 'photo.bmp',
      contentType: 'image/bmp',
      sizeBytes: 100,
    })).toThrow(UnsupportedReviewPhotoFormatError);
  });
});

describe('Submit Written Review with Star Rating', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('AC 2: verified purchaser submits star-rating-only review and aggregate recomputes', async () => {
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    await helper.given_confirmed_ship_to_home_for_email(guestAgent, ReturningCustomersBase.JANE.email, sku);
    await helper.given_logged_in_verified(accountAgent);

    const submit = await accountAgent
      .post(`/api/products/${sku}/reviews`)
      .send({ starRating: 4 });
    expect(submit.status).toBe(201);
    expect(submit.body.review.starRating).toBe(4);

    const list = await request(app).get(`/api/products/${sku}/reviews`);
    expect(list.status).toBe(200);
    expect(list.body.reviews).toHaveLength(1);
    expect(list.body.aggregateStarRating.average).toBe(4);
  });

  it('AC 4: non-purchaser receives 403', async () => {
    const accountAgent = helper.createSessionAgent();
    await helper.given_logged_in_verified(accountAgent);

    const submit = await accountAgent
      .post(`/api/products/${sku}/reviews`)
      .send({ starRating: 5, body: 'Great' });
    expect(submit.status).toBe(403);
  });

  it('AC 5: guest receives 401', async () => {
    const guestAgent = helper.createSessionAgent();
    const submit = await guestAgent
      .post(`/api/products/${sku}/reviews`)
      .send({ starRating: 5 });
    expect(submit.status).toBe(401);
  });
});

describe('Submit Photo Review', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('AC 2: unsupported format rejected', async () => {
    const guestAgent = helper.createSessionAgent();
    const accountAgent = helper.createSessionAgent();
    await helper.given_confirmed_ship_to_home_for_email(guestAgent, ReturningCustomersBase.JANE.email, sku);
    await helper.given_logged_in_verified(accountAgent);

    const submit = await accountAgent
      .post(`/api/products/${sku}/reviews`)
      .send({ starRating: 4, body: 'Great product' });
    expect(submit.status).toBe(201);

    const photo = await accountAgent
      .post(`/api/products/${sku}/reviews/${submit.body.review.reviewId}/photos`)
      .send({
        originalFilename: 'photo.bmp',
        contentType: 'image/bmp',
        sizeBytes: 1024,
        dataBase64: 'abc',
      });
    expect(photo.status).toBe(400);
    expect(photo.body.error).toContain('Supported formats');
  });
});

describe('Read Customer Reviews', () => {
  const helper = new ReturningCustomersServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('returns empty aggregate when no reviews exist', async () => {
    const list = await request(app).get(`/api/products/${sku}/reviews`);
    expect(list.status).toBe(200);
    expect(list.body.reviews).toHaveLength(0);
    expect(list.body.aggregateStarRating).toBeNull();
  });
});
