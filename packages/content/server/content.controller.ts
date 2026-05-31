import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import { TagRequiredError, ContentNotFoundError } from '../shared/content.errors';
import {
  createBlogPostSchema,
  createGuideSchema,
  updateContentSchema,
} from '../shared/content.schema';
import { isBlogPost, isPetCareGuide } from './content.repository';
import type { ContentService } from './content.service';

function toBlogSummary(post: ReturnType<ContentService['listPublishedBlogPosts']> extends Promise<(infer T)[]> ? T : never) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    publishDate: post.publishDate,
    author: post.author,
  };
}

function toGuideSummary(guide: Awaited<ReturnType<ContentService['listPublishedGuides']>>[number]) {
  return {
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
    summary: guide.summary,
    publishDate: guide.publishDate,
    speciesTags: guide.speciesTags,
  };
}

export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  listBlogPosts = async (_req: Request, res: Response): Promise<void> => {
    const posts = await this.contentService.listPublishedBlogPosts();
    res.status(HttpStatus.OK).json(posts.map(toBlogSummary));
  };

  getBlogPostBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const content = await this.contentService.getPublishedBySlug(req.params.slug);
      if (!isBlogPost(content)) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Blog post not found' });
        return;
      }
      res.status(HttpStatus.OK).json(content.toSnapshot());
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  listGuides = async (req: Request, res: Response): Promise<void> => {
    const speciesTag = typeof req.query.speciesTag === 'string' ? req.query.speciesTag : undefined;
    const guides = await this.contentService.listPublishedGuides(speciesTag);
    res.status(HttpStatus.OK).json(guides.map(toGuideSummary));
  };

  getGuideBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const content = await this.contentService.getPublishedBySlug(req.params.slug);
      if (!isPetCareGuide(content)) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Guide not found' });
        return;
      }
      res.status(HttpStatus.OK).json(content.toSnapshot());
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  staffCreateBlog = async (req: Request, res: Response): Promise<void> => {
    const input = createBlogPostSchema.parse(req.body);
    const post = await this.contentService.createBlogDraft(input);
    res.status(HttpStatus.CREATED).json(post.toSnapshot());
  };

  staffCreateGuide = async (req: Request, res: Response): Promise<void> => {
    const input = createGuideSchema.parse(req.body);
    const guide = await this.contentService.createGuideDraft(input);
    res.status(HttpStatus.CREATED).json(guide.toSnapshot());
  };

  staffPublish = async (req: Request, res: Response): Promise<void> => {
    try {
      const content = await this.contentService.publish(req.params.id);
      res.status(HttpStatus.OK).json(content.toSnapshot());
    } catch (error) {
      if (error instanceof TagRequiredError) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: error.message });
        return;
      }
      if (error instanceof ContentNotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  staffUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = updateContentSchema.parse(req.body);
      const content = await this.contentService.updatePublished(req.params.id, input);
      res.status(HttpStatus.OK).json(content.toSnapshot());
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  staffListBlog = async (_req: Request, res: Response): Promise<void> => {
    const posts = await this.contentService.listAllBlogPosts();
    res.status(HttpStatus.OK).json(posts.map((post) => post.toSnapshot()));
  };

  staffListGuides = async (_req: Request, res: Response): Promise<void> => {
    const guides = await this.contentService.listAllGuides();
    res.status(HttpStatus.OK).json(guides.map((guide) => guide.toSnapshot()));
  };
}
