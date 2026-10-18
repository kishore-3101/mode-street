import { z } from 'zod';
export const createCategorySchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
    image_url: z.string().url('Invalid image URL').nullable().optional(),
    image_path: z.string().nullable().optional(),
});
export const updateCategorySchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').optional(),
    image_url: z.string().url('Invalid image URL').nullable().optional(),
    image_path: z.string().nullable().optional(),
});
export const categorySlugParamSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
});
export const categoryIdParamSchema = z.object({
    id: z.string().uuid('Invalid category ID'),
});
