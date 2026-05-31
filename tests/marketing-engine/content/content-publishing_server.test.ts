/**
 * Content publishing — server tests (Increment 8 Sprint 4)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { app } from '@pawplace/app-server';

describe('Publish Blog Post', () => {
  beforeEach(async () => {
    await request(app).post('/api/test/cart/reset-all');
  });
  afterEach(async () => {
    await request(app).post('/api/test/cart/reset-all');
  });

  it('published blog post appears on blog index; draft is hidden', async () => {
    const draft = await request(app)
      .post('/api/staff/content/blog')
      .send({
        title: 'Spring Pet Safety Tips',
        summary: 'Keep pets safe during spring outings',
        body: 'Check fences, watch for toxic plants…',
        author: 'Jamie Wells',
        slug: 'spring-pet-safety-tips',
      });
    expect(draft.status).toBe(201);

    const indexBefore = await request(app).get('/api/content/blog');
    expect(indexBefore.body).toHaveLength(0);

    const published = await request(app)
      .post(`/api/staff/content/${draft.body.id}/publish`);
    expect(published.status).toBe(200);
    expect(published.body.status).toBe('published');

    const indexAfter = await request(app).get('/api/content/blog');
    expect(indexAfter.body).toHaveLength(1);
    expect(indexAfter.body[0].title).toBe('Spring Pet Safety Tips');

    const detail = await request(app).get('/api/content/blog/spring-pet-safety-tips');
    expect(detail.status).toBe(200);
    expect(detail.body.author).toBe('Jamie Wells');
  });
});

describe('Publish Pet Care Guide', () => {
  beforeEach(async () => {
    await request(app).post('/api/test/cart/reset-all');
  });
  afterEach(async () => {
    await request(app).post('/api/test/cart/reset-all');
  });

  it('publish requires at least one species tag', async () => {
    const draft = await request(app)
      .post('/api/staff/content/guides')
      .send({
        title: 'Introduce a New Cat',
        summary: 'Gradual room-by-room introduction',
        body: 'Start with one room…',
        speciesTags: [],
        slug: 'introduce-new-cat',
      });
    expect(draft.status).toBe(201);

    const fail = await request(app).post(`/api/staff/content/${draft.body.id}/publish`);
    expect(fail.status).toBe(422);

    await request(app)
      .patch(`/api/staff/content/${draft.body.id}`)
      .send({ speciesTags: ['cats'] });

    const ok = await request(app).post(`/api/staff/content/${draft.body.id}/publish`);
    expect(ok.status).toBe(200);

    const guides = await request(app).get('/api/content/guides?speciesTag=cats');
    expect(guides.body).toHaveLength(1);
  });
});
