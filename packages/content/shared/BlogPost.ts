import { Content, type ContentFields } from './Content';

export interface BlogPostFields extends ContentFields {
  author: string;
}

export class BlogPost extends Content {
  author: string;

  constructor(fields: BlogPostFields) {
    super(fields);
    this.author = fields.author;
  }

  toSnapshot(): BlogPostFields {
    return { ...super.toSnapshot(), author: this.author };
  }
}
