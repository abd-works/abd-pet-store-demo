export class ProductImage {
  readonly imageFile: string;
  readonly altText: string;
  readonly displayOrder: number;
  readonly uploadedDate: Date;

  constructor(imageFile: string, altText: string, displayOrder: number) {
    if (!imageFile) throw new Error('imageFile is required');
    if (!altText) throw new Error('altText is required');
    if (displayOrder < 0) throw new Error('displayOrder must be non-negative');

    this.imageFile = imageFile;
    this.altText = altText;
    this.displayOrder = displayOrder;
    this.uploadedDate = new Date();
  }
}
