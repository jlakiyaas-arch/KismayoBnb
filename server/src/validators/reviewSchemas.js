import { z } from 'zod';

export const createReviewSchema = z.object({
  property: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(1000).trim(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5).max(1000).trim().optional(),
});

export const reviewIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID'),
});

export const propertyReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
