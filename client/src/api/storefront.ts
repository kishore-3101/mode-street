import { apiClient } from './client.js';
import type {
  Category,
  Product,
  StorefrontProductsParams,
} from '../types/index.js';

/**
 * Fetch all categories for the storefront navigation and category grid.
 */
export async function getStorefrontCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}

/**
 * Fetch a single category by slug.
 */
export async function getStorefrontCategoryBySlug(slug: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${slug}`);
  return response.data;
}

/**
 * Fetch public active products for the storefront.
 * Returns products ordered by newest (created_at descending) by default.
 */
export async function getStorefrontProducts(
  params?: StorefrontProductsParams
): Promise<Product[]> {
  const response = await apiClient.get<Product[]>('/products', { params });
  return response.data;
}

/**
 * Fetch a single active product by slug with images and variants.
 */
export async function getStorefrontProductBySlug(slug: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${slug}`);
  return response.data;
}
