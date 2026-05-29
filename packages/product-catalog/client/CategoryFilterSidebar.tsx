import React from 'react';
import { CategoryFilterOptions } from './CategoryFilterOptions';
import { categoryAsideStyle, categoryHeadingStyle, categoryListStyle } from './productCatalogUiStyles';

export type CategoryFilterSidebarProps = {
  categories: string[];
  category: string;
  onCategoryChange: (category: string) => void;
};

export function CategoryFilterSidebar(props: CategoryFilterSidebarProps) {
  return (
    <aside style={categoryAsideStyle}>
      <h2 style={categoryHeadingStyle}>category filter</h2>
      <ul role="listbox" aria-label="category filter" style={categoryListStyle}>
        <CategoryFilterOptions {...props} />
      </ul>
    </aside>
  );
}
