import { z } from 'zod';

export const heroSlideIdParamSchema = z.object({
  id: z.string().uuid('Invalid slide ID'),
});

export const createHeroSlideSchema = z.object({
  alt_text: z.string().trim().max(255, 'Alt text cannot exceed 255 characters').nullable().optional(),
  link_url: z.string().trim().max(500, 'Link URL cannot exceed 500 characters').nullable().optional(),
  sort_order: z.coerce.number().int().optional(),
  is_active: z.coerce.boolean().optional().default(true),
  image_url: z.string().trim().optional(),
});

export const updateHeroSlideSchema = z.object({
  alt_text: z.string().trim().max(255, 'Alt text cannot exceed 255 characters').nullable().optional(),
  link_url: z.string().trim().max(500, 'Link URL cannot exceed 500 characters').nullable().optional(),
  sort_order: z.coerce.number().int().optional(),
  is_active: z.coerce.boolean().optional(),
  image_url: z.string().trim().optional(),
});

export const reorderHeroSlidesSchema = z.object({
  slideIds: z.array(z.string().uuid('Invalid slide ID in list')).min(1, 'At least one slide ID is required'),
});
