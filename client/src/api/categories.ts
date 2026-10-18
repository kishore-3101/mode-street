import { apiClient } from './client.js';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/index.js';

export async function getCategoriesApi(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}

export async function getCategoryBySlugApi(slug: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${slug}`);
  return response.data;
}

export async function createCategoryApi(data: CreateCategoryInput): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', data);
  return response.data;
}

export async function updateCategoryApi(id: string, data: UpdateCategoryInput): Promise<Category> {
  const response = await apiClient.put<Category>(`/categories/${id}`, data);
  return response.data;
}

export async function deleteCategoryApi(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/categories/${id}`);
  return response.data;
}
