import React from 'react';
import { CategoryOption } from './ProductCatalogGridRows';

interface CategoryFilterOptionsProps {
  categories: string[];
  category: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilterOptions({
  categories,
  category,
  onCategoryChange,
}: CategoryFilterOptionsProps) {
  return (
    <>
      <CategoryOption label="all categories" active={category === ''} onSelect={() => onCategoryChange('')} />
      {categories.map((name) => (
        <CategoryOption
          key={name}
          label={name}
          active={category === name}
          onSelect={() => onCategoryChange(name)}
        />
      ))}
    </>
  );
}
