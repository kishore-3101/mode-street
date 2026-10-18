import { apiClient } from './client.js';
import type { UploadResult } from '../types/index.js';

export async function uploadImagesApi(files: File[]): Promise<UploadResult[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }

  const response = await apiClient.post<UploadResult[]>('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteUploadApi(path: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>('/uploads', {
    data: { path },
  });
  return response.data;
}
