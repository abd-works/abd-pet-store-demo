import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1),
  author: z.string().min(1),
  slug: z.string().min(1).optional(),
});

export const createGuideSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1),
  speciesTags: z.array(z.string()).default([]),
  slug: z.string().min(1).optional(),
});

export const updateContentSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  speciesTags: z.array(z.string()).optional(),
  preservePublishDate: z.boolean().optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type CreateGuideInput = z.infer<typeof createGuideSchema>;
export type UpdateContentInput = z.infer<typeof updateContentSchema>;
