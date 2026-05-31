import type { BlogPostFields } from '../shared/BlogPost';
import { BlogPost } from '../shared/BlogPost';
import type { PetCareGuideFields } from '../shared/PetCareGuide';
import { PetCareGuide } from '../shared/PetCareGuide';

export type StoredContent = BlogPost | PetCareGuide;
export type ContentType = 'blog' | 'guide';

export interface ContentRepository {
  save(content: StoredContent): Promise<void>;
  findById(id: string): Promise<StoredContent | undefined>;
  findBySlug(slug: string): Promise<StoredContent | undefined>;
  findPublished(type: ContentType): Promise<StoredContent[]>;
  findAll(type: ContentType): Promise<StoredContent[]>;
  reset(): void;
}

export class InMemoryContentRepository implements ContentRepository {
  private readonly byId = new Map<string, StoredContent>();
  private readonly bySlug = new Map<string, StoredContent>();

  async save(content: StoredContent): Promise<void> {
    this.byId.set(content.id, content);
    this.bySlug.set(content.slug, content);
  }

  async findById(id: string): Promise<StoredContent | undefined> {
    return this.byId.get(id);
  }

  async findBySlug(slug: string): Promise<StoredContent | undefined> {
    return this.bySlug.get(slug);
  }

  async findPublished(type: ContentType): Promise<StoredContent[]> {
    return [...this.byId.values()].filter((content) => {
      if (!content.isPublished()) return false;
      if (type === 'blog') return content instanceof BlogPost;
      return content instanceof PetCareGuide;
    });
  }

  async findAll(type: ContentType): Promise<StoredContent[]> {
    return [...this.byId.values()].filter((content) => {
      if (type === 'blog') return content instanceof BlogPost;
      return content instanceof PetCareGuide;
    });
  }

  reset(): void {
    this.byId.clear();
    this.bySlug.clear();
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isBlogPost(content: StoredContent): content is BlogPost {
  return content instanceof BlogPost;
}

export function isPetCareGuide(content: StoredContent): content is PetCareGuide {
  return content instanceof PetCareGuide;
}

export type { BlogPostFields, PetCareGuideFields };
