import { apiClient } from './client.js';
import type {
  Order,
  OrderWithItems,
  OrderStatus,
  AdminOrdersParams,
  AdminOrdersResponse,
} from '../types/index.js';

/**
 * Fetch orders for the admin list with optional status, search, and pagination.
 * Retrieves the total count from the X-Total-Count header.
 */
export async function getAdminOrders(
  params?: AdminOrdersParams
): Promise<AdminOrdersResponse> {
  const response = await apiClient.get<Order[]>('/orders', { params });
  const rawTotal = response.headers['x-total-count'];
  const total = rawTotal !== undefined ? parseInt(String(rawTotal), 10) : response.data.length;

  return {
    orders: response.data,
    total: isNaN(total) ? response.data.length : total,
  };
}

/**
 * Fetch a single order with customer details and line items by ID.
 */
export async function getAdminOrderById(id: string): Promise<OrderWithItems> {
  const response = await apiClient.get<OrderWithItems>(`/orders/${id}`);
  return response.data;
}

/**
 * Update the status of an order (e.g. pending -> confirmed -> shipped -> delivered or cancelled).
 */
export async function updateAdminOrderStatus(
  id: string,
  status: OrderStatus
): Promise<OrderWithItems> {
  const response = await apiClient.patch<OrderWithItems>(`/orders/${id}/status`, {
    status,
  });
  return response.data;
}
