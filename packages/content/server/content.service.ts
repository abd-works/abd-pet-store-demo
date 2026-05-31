import { randomUUID } from 'node:crypto';
import { BlogPost } from '../shared/BlogPost';
import { PetCareGuide } from '../shared/PetCareGuide';
import { ContentNotFoundError } from '../shared/content.errors';
import type { CreateBlogPostInput, CreateGuideInput, UpdateContentInput } from '../shared/content.schema';
import {
  InMemoryContentRepository,
  isBlogPost,
  isPetCareGuide,
  slugify,
  type ContentRepository,
  type StoredContent,
} from './content.repository';

export class ContentService {
  constructor(private readonly repository: ContentRepository) {}

  async createBlogDraft(input: CreateBlogPostInput): Promise<BlogPost> {
    const slug = input.slug ?? slugify(input.title);
    const post = new BlogPost({
      id: randomUUID(),
      slug,
      title: input.title,
      summary: input.summary,
      body: input.body,
      author: input.author,
      status: 'draft',
      publishDate: null,
    });
    await this.repository.save(post);
    return post;
  }

  async createGuideDraft(input: CreateGuideInput): Promise<PetCareGuide> {
    const slug = input.slug ?? slugify(input.title);
    const guide = new PetCareGuide({
      id: randomUUID(),
      slug,
      title: input.title,
      summary: input.summary,
      body: input.body,
      speciesTags: input.speciesTags,
      status: 'draft',
      publishDate: null,
    });
    await this.repository.save(guide);
    return guide;
  }

  async publish(contentId: string): Promise<StoredContent> {
    const content = await this.requireContent(contentId);
    content.publish(new Date());
    await this.repository.save(content);
    return content;
  }

  async updatePublished(contentId: string, input: UpdateContentInput): Promise<StoredContent> {
    const content = await this.requireContent(contentId);
    content.updatePublished(
      { title: input.title, summary: input.summary, body: input.body },
      input.preservePublishDate ?? true,
    );
    if (isPetCareGuide(content) && input.speciesTags) {
      content.speciesTags = [...input.speciesTags];
    }
    await this.repository.save(content);
    return content;
  }

  async listPublishedBlogPosts(): Promise<BlogPost[]> {
    const items = await this.repository.findPublished('blog');
    return items.filter(isBlogPost);
  }

  async listPublishedGuides(speciesTag?: string): Promise<PetCareGuide[]> {
    const items = await this.repository.findPublished('guide');
    const guides = items.filter(isPetCareGuide);
    if (!speciesTag) return guides;
    return guides.filter((guide) => guide.speciesTags.includes(speciesTag));
  }

  async listAllBlogPosts(): Promise<BlogPost[]> {
    return (await this.repository.findAll('blog')).filter(isBlogPost);
  }

  async listAllGuides(): Promise<PetCareGuide[]> {
    return (await this.repository.findAll('guide')).filter(isPetCareGuide);
  }

  async getPublishedBySlug(slug: string): Promise<StoredContent> {
    const content = await this.repository.findBySlug(slug);
    if (!content?.isPublished()) throw new ContentNotFoundError(slug);
    return content;
  }

  async getDraft(contentId: string): Promise<StoredContent> {
    const content = await this.requireContent(contentId);
    return content;
  }

  private async requireContent(contentId: string): Promise<StoredContent> {
    const content = await this.repository.findById(contentId);
    if (!content) throw new ContentNotFoundError(contentId);
    return content;
  }
}

let sharedContentRepository: InMemoryContentRepository | null = null;

export function getSharedContentRepository(): InMemoryContentRepository {
  if (!sharedContentRepository) {
    sharedContentRepository = new InMemoryContentRepository();
  }
  return sharedContentRepository;
}

export function resetContentModuleForTests(): void {
  getSharedContentRepository().reset();
}

export function createContentService(repository = getSharedContentRepository()): ContentService {
  return new ContentService(repository);
}
