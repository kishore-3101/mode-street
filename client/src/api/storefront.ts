import { apiClient } from './client.js';
import type {
  Category,
  Product,
  StorefrontProductsParams,
  StorefrontProductsResponse,
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
 * Fetch public active products along with the total count from the X-Total-Count header.
 */
export async function getStorefrontProductsWithCount(
  params?: StorefrontProductsParams
): Promise<StorefrontProductsResponse> {
  const response = await apiClient.get<Product[]>('/products', { params });
  const rawTotal = response.headers['x-total-count'];
  const total = rawTotal !== undefined ? parseInt(String(rawTotal), 10) : response.data.length;
  return {
    products: response.data,
    total: isNaN(total) ? response.data.length : total,
  };
}

/**
 * Fetch a single active product by slug with images and variants.
 */
export async function getStorefrontProductBySlug(slug: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${slug}`);
  return response.data;
}
