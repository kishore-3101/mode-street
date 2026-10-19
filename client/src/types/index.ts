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

export interface StorefrontProductsParams {
  limit?: number;
  page?: number;
  category?: string;
  search?: string;
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
}
