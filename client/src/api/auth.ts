import { apiClient } from './client.js';
import type { Admin, LoginResponse } from '../types/index.js';

export async function loginApi(credentials: { email: string; password: string }): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}

export async function getMeApi(): Promise<{ admin: Admin }> {
  const response = await apiClient.get<{ admin: Admin }>('/auth/me');
  return response.data;
}
