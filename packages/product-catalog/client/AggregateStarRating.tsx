import React from 'react';

export interface AggregateStarRatingSnapshot {
  average: number;
  reviewCount: number;
}

export interface AggregateStarRatingProps {
  aggregate: AggregateStarRatingSnapshot | null;
}

export function AggregateStarRatingDisplay({ aggregate }: AggregateStarRatingProps) {
  if (!aggregate || aggregate.reviewCount === 0) {
    return null;
  }

  const label = `Aggregate star rating ${aggregate.average.toFixed(1)} out of 5, ${aggregate.reviewCount} reviews`;

  return (
    <p data-testid="aggregate-star-rating" aria-label={label}>
      {aggregate.average.toFixed(1)} ({aggregate.reviewCount} reviews)
    </p>
  );
}
