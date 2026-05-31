/** << ValueObject >> — mandatory 1–5 integer star rating on a customer review. */
export class StarRating {
  readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static of(value: number): StarRating {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new InvalidStarRatingError(value);
    }
    return new StarRating(value);
  }
}

export class InvalidStarRatingError extends Error {
  constructor(value: number) {
    super(`Star rating must be an integer between 1 and 5, got ${value}`);
    this.name = 'InvalidStarRatingError';
  }
}
