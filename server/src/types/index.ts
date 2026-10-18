export interface Admin {
    id: string;
    email: string;
    created_at: string;
}
export interface AdminPayload {
    id: string;
    email: string;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    image_path: string | null;
    created_at: string;
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
}
export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    path: string;
    position: number;
    created_at: string;
}
export interface ProductVariant {
    id: string;
    product_id: string;
    size: string;
    stock: number;
    created_at: string;
    updated_at: string;
}
export interface ProductWithRelations extends Product {
    category?: Category | null;
    images?: ProductImage[];
    variants?: ProductVariant[];
}
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
declare global {
    namespace Express {
        interface Request {
            admin?: AdminPayload;
        }
    }
}
