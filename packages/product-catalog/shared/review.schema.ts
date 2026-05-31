import { z } from 'zod';

export const createReviewSchema = z.object({
  starRating: z.number().int().min(1).max(5),
  body: z.string().trim().max(5000).optional().nullable(),
});

export const reviewPhotoSchema = z.object({
  originalFilename: z.string().min(1),
  contentType: z.string().min(1),
  sizeBytes: z.number().int().positive().max(5 * 1024 * 1024),
  dataBase64: z.string().min(1),
});

export const reviewListQuerySchema = z.object({
  sort: z.enum(['newest', 'oldest', 'highest', 'lowest']).default('newest'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(10),
});

export type CreateReviewBody = z.infer<typeof createReviewSchema>;
export type ReviewPhotoBody = z.infer<typeof reviewPhotoSchema>;
export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;
