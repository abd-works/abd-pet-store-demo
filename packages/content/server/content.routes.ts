import { Router } from 'express';
import type { ContentController } from './content.controller';

export function createContentRouter(controller: ContentController): Router {
  const router = Router();
  router.get('/content/blog', controller.listBlogPosts);
  router.get('/content/blog/:slug', controller.getBlogPostBySlug);
  router.get('/content/guides', controller.listGuides);
  router.get('/content/guides/:slug', controller.getGuideBySlug);
  router.post('/staff/content/blog', controller.staffCreateBlog);
  router.post('/staff/content/guides', controller.staffCreateGuide);
  router.post('/staff/content/:id/publish', controller.staffPublish);
  router.patch('/staff/content/:id', controller.staffUpdate);
  router.get('/staff/content/blog', controller.staffListBlog);
  router.get('/staff/content/guides', controller.staffListGuides);
  return router;
}
