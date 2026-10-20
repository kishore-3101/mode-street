export interface Admin {
  id: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  image_path: string | null;
  created_at: string;
  product_count?: number;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  url: string;
  path: string;
  position: number;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id?: string;
  size: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  price: number;
  category_id: string;
  is_active?: boolean;
  variants: { size: string; stock: number }[];
  images: { url: string; path: string }[];
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  price?: number;
  category_id?: string;
  is_active?: boolean;
  variants?: { size: string; stock: number }[];
  images?: { url: string; path: string }[];
}

export interface CreateCategoryInput {
  name: string;
  image_url?: string | null;
  image_path?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  image_url?: string | null;
  image_path?: string | null;
}

export interface StockUpdateInput {
  variants: { id: string; stock: number }[];
}

export interface UploadResult {
  url: string;
  path: string;
}

export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
  };
}

export interface ApiError {
  error: string;
}

export type ProductSortOption = 'newest' | 'price_asc' | 'price_desc';

export interface StorefrontProductsParams {
  limit?: number;
  page?: number;
  category?: string;
  search?: string;
  sort?: ProductSortOption;
}

export interface StorefrontProductsResponse {
  products: Product[];
  total: number;
}

export interface CartItem {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  size: string;
  price: number;
  image?: string | null;
  qty: number;
  maxQty: number;
}

export interface CreateOrderCustomerInput {
  name: string;
  phone: string;
  email?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string | null;
}

export interface CreateOrderItemInput {
  variant_id: string;
  quantity: number;
}

export interface CreateOrderInput {
  customer: CreateOrderCustomerInput;
  items: CreateOrderItemInput[];
}

export interface CreateOrderResponse {
  order_id: string;
  order_number: string;
  total: number;
}

export interface OrderConfirmationSnapshot {
  order_id: string;
  order_number: string;
  total: number;
  customer: {
    name: string;
    phone: string;
    email?: string | null;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string | null;
  };
  items: {
    variantId: string;
    productId: string;
    slug: string;
    name: string;
    size: string;
    qty: number;
    price: number;
    image?: string | null;
  }[];
  placed_at: string;
}

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export type IndianState = typeof INDIAN_STATES[number];

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  size: string;
  quantity: number;
  unit_price: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface AdminOrdersParams {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminOrdersResponse {
  orders: Order[];
  total: number;
}
