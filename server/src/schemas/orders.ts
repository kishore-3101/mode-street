import { z } from 'zod';
export const createOrderSchema = z.object({
    customer: z.object({
        name: z.string().trim().min(1, 'Name is required'),
        phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
        email: z.string().email('Invalid email address').nullable().optional(),
        address: z.string().trim().min(1, 'Address is required'),
        city: z.string().trim().min(1, 'City is required'),
        state: z.string().trim().min(1, 'State is required'),
        pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
        notes: z.string().nullable().optional(),
    }),
    items: z.array(z.object({
        variant_id: z.string().uuid('Invalid variant ID'),
        quantity: z.number().int('Quantity must be an integer').min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10'),
    })).min(1, 'Order must contain at least one item').max(20, 'Order cannot contain more than 20 items'),
});
export const adminOrderQuerySchema = z.object({
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const updateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], {
        message: 'Status must be one of: pending, confirmed, shipped, delivered, cancelled',
    }),
});
export const orderIdParamSchema = z.object({
    id: z.string().uuid('Invalid order ID'),
});
