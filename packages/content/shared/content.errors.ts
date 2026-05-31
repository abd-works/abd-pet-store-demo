export class TagRequiredError extends Error {
  constructor() {
    super('At least one species tag is required before publishing a pet care guide');
    this.name = 'TagRequiredError';
  }
}

export class ContentNotFoundError extends Error {
  constructor(id: string) {
    super(`Content not found: ${id}`);
    this.name = 'ContentNotFoundError';
  }
}

export class ContentSlugNotFoundError extends Error {
  constructor(slug: string) {
    super(`Content not found for slug: ${slug}`);
    this.name = 'ContentSlugNotFoundError';
  }
}
