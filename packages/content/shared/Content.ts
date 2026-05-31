export type ContentStatus = 'draft' | 'published';

export interface ContentFields {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: ContentStatus;
  publishDate: string | null;
}

export abstract class Content {
  readonly id: string;
  readonly slug: string;
  title: string;
  summary: string;
  body: string;
  status: ContentStatus;
  publishDate: string | null;

  protected constructor(fields: ContentFields) {
    this.id = fields.id;
    this.slug = fields.slug;
    this.title = fields.title;
    this.summary = fields.summary;
    this.body = fields.body;
    this.status = fields.status;
    this.publishDate = fields.publishDate;
  }

  publish(at: Date): void {
    this.status = 'published';
    this.publishDate = at.toISOString().slice(0, 10);
  }

  updatePublished(input: { title?: string; summary?: string; body?: string }, preservePublishDate: boolean): void {
    if (input.title !== undefined) this.title = input.title;
    if (input.summary !== undefined) this.summary = input.summary;
    if (input.body !== undefined) this.body = input.body;
    if (!preservePublishDate && this.publishDate) {
      this.publishDate = new Date().toISOString().slice(0, 10);
    }
  }

  isPublished(): boolean {
    return this.status === 'published';
  }

  toSnapshot(): ContentFields {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      summary: this.summary,
      body: this.body,
      status: this.status,
      publishDate: this.publishDate,
    };
  }
}
