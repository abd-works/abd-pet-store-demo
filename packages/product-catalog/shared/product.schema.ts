import { z } from 'zod';

export const productImageSchema = z.object({
  imageFile: z.string().min(1),
  altText: z.string().min(1),
  displayOrder: z.number().int().min(0),
});

export type ProductImageData = z.infer<typeof productImageSchema>;

export const categorySchema = z.object({
  categoryName: z.string().min(1),
  parentCategory: z.string().default(''),
  displayOrder: z.number().int().default(0),
  activeStatus: z.boolean().default(true),
});

export type CategoryData = z.infer<typeof categorySchema>;

export const stockAvailabilitySchema = z.object({
  productSku: z.string().min(1),
  storeCode: z.string().min(1),
  stockLevel: z.number().int().min(0),
  quantityOnHand: z.number().int().min(0),
  reservedQuantity: z.number().int().min(0).default(0),
  availableToSellQuantity: z.number().int().default(0),
  reorderPoint: z.number().int().default(0),
  reorderQuantity: z.number().int().default(0),
  lowStockThreshold: z.number().int().default(5),
  backorderEnabled: z.boolean().default(false),
});

export type StockAvailabilityData = z.infer<typeof stockAvailabilitySchema>;

export const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  brand: z.string().min(1),
  description: z.string().default(''),
  weight: z.number().nullable().default(null),
  length: z.number().nullable().default(null),
  width: z.number().nullable().default(null),
  height: z.number().nullable().default(null),
  images: z.array(productImageSchema).default([]),
  categories: z.array(categorySchema).default([]),
});

export type ProductData = z.infer<typeof productSchema>;
