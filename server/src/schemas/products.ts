import { z } from 'zod';
export const productVariantInputSchema = z.object({
    size: z.string().trim().min(1, 'Size is required'),
    stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative'),
});
export const productImageInputSchema = z.object({
    url: z.string().url('Invalid image URL'),
    path: z.string().min(1, 'Image path is required'),
});
export const createProductSchema = z.object({
    name: z.string().trim().min(1, 'Product name is required').max(200, 'Name cannot exceed 200 characters'),
    description: z.string().nullable().optional(),
    price: z.number().positive('Price must be greater than 0'),
    category_id: z.string().uuid('Invalid category ID'),
    is_active: z.boolean().default(true),
    variants: z.array(productVariantInputSchema).min(1, 'At least one variant is required'),
    images: z.array(productImageInputSchema).default([]),
});
export const updateProductSchema = z.object({
    name: z.string().trim().min(1, 'Product name is required').max(200, 'Name cannot exceed 200 characters').optional(),
    description: z.string().nullable().optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    category_id: z.string().uuid('Invalid category ID').optional(),
    is_active: z.boolean().optional(),
    variants: z.array(productVariantInputSchema).optional(),
    images: z.array(productImageInputSchema).optional(),
});
export const updateStockSchema = z.object({
    variants: z.array(z.object({
        id: z.string().uuid('Invalid variant ID'),
        stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative'),
    })).min(1, 'At least one variant stock must be specified'),
});
export const productIdParamSchema = z.object({
    id: z.string().uuid('Invalid product ID'),
});
export const productSlugParamSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
});
export const productQuerySchema = z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest'),
});
export const adminProductQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
