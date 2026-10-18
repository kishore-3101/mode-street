import { apiClient } from './client.js';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  StockUpdateInput,
  ProductVariant,
} from '../types/index.js';

export async function getAdminProductsApi(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const response = await apiClient.get<Product[]>('/admin/products', { params });
  return response.data;
}

export async function getPublicProductsApi(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const response = await apiClient.get<Product[]>('/products', { params });
  return response.data;
}

export async function getProductBySlugApi(slug: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${slug}`);
  return response.data;
}

export async function createProductApi(data: CreateProductInput): Promise<Product> {
  const response = await apiClient.post<Product>('/products', data);
  return response.data;
}

export async function updateProductApi(id: string, data: UpdateProductInput): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
}

export async function deleteProductApi(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/products/${id}`);
  return response.data;
}

export async function updateProductStockApi(
  id: string,
  data: StockUpdateInput
): Promise<ProductVariant[]> {
  const response = await apiClient.patch<ProductVariant[]>(`/products/${id}/stock`, data);
  return response.data;
}
