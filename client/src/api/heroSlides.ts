import { apiClient } from './client.js';
import type { HeroSlide } from '../types/index.js';

/**
 * Fetch all hero slides (active and inactive) for admin management.
 */
export async function getAdminHeroSlides(): Promise<HeroSlide[]> {
  const response = await apiClient.get<HeroSlide[]>('/admin/hero-slides');
  return response.data;
}

/**
 * Create a new hero slide via multipart/form-data upload.
 */
export async function createHeroSlide(formData: FormData): Promise<HeroSlide> {
  const response = await apiClient.post<HeroSlide>('/admin/hero-slides', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Update an existing hero slide (metadata or image replacement).
 */
export async function updateHeroSlide(
  id: string,
  data: FormData | Partial<HeroSlide>
): Promise<HeroSlide> {
  const isFormData = data instanceof FormData;
  const response = await apiClient.patch<HeroSlide>(`/admin/hero-slides/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
}

/**
 * Delete a hero slide by ID.
 */
export async function deleteHeroSlide(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/admin/hero-slides/${id}`);
  return response.data;
}

/**
 * Reorder slides by passing an ordered list of slide IDs.
 */
export async function reorderHeroSlides(slideIds: string[]): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>('/admin/hero-slides/reorder', {
    slideIds,
  });
  return response.data;
}
