const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_BYTES = 5 * 1024 * 1024;

export interface ReviewPhotoSnapshot {
  storageKey: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
}

/** << ValueObject >> — image attachment metadata on a customer review. */
export class ReviewPhoto {
  readonly storageKey: string;
  readonly originalFilename: string;
  readonly contentType: string;
  readonly sizeBytes: number;

  private constructor(snapshot: ReviewPhotoSnapshot) {
    this.storageKey = snapshot.storageKey;
    this.originalFilename = snapshot.originalFilename;
    this.contentType = snapshot.contentType;
    this.sizeBytes = snapshot.sizeBytes;
  }

  static create(input: {
    storageKey: string;
    originalFilename: string;
    contentType: string;
    sizeBytes: number;
  }): ReviewPhoto {
    if (!SUPPORTED_FORMATS.includes(input.contentType as (typeof SUPPORTED_FORMATS)[number])) {
      throw new UnsupportedReviewPhotoFormatError();
    }
    if (input.sizeBytes > MAX_BYTES) {
      throw new ReviewPhotoTooLargeError();
    }
    return new ReviewPhoto(input);
  }
}

export class UnsupportedReviewPhotoFormatError extends Error {
  constructor() {
    super('Supported formats: JPEG, PNG, WebP');
    this.name = 'UnsupportedReviewPhotoFormatError';
  }
}

export class ReviewPhotoTooLargeError extends Error {
  constructor() {
    super('Image must be under 5 MB');
    this.name = 'ReviewPhotoTooLargeError';
  }
}
