export class Category {
  readonly categoryName: string;
  parentCategory: string;
  displayOrder: number;
  activeStatus: boolean;
  private _children: Category[] = [];

  constructor(categoryName: string) {
    if (!categoryName) throw new Error('categoryName is required');

    this.categoryName = categoryName;
    this.parentCategory = '';
    this.displayOrder = 0;
    this.activeStatus = true;
  }

  acceptProduct(_product: unknown): void {
    // Registers a product under this category (aggregation tracking)
  }

  children(): Category[] {
    return [...this._children];
  }

  addChild(child: Category): void {
    this._children.push(child);
  }

  breadcrumb(): string {
    if (!this.parentCategory) return this.categoryName;
    return `${this.parentCategory} > ${this.categoryName}`;
  }
}
