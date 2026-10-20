import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { supabase } from '../lib/supabase.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, adminOrderQuerySchema, updateOrderStatusSchema, orderIdParamSchema, } from '../schemas/orders.js';

const orderRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 requests per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
});

const router = Router();
// POST /api/orders - Public: Place a new order
router.post('/', orderRateLimiter, validate({ body: createOrderSchema }), async (req, res, next) => {
    try {
        const { customer, items } = req.body;
        const { data, error } = await supabase.rpc('place_order', {
            p_customer_name: customer.name,
            p_phone: customer.phone,
            p_email: customer.email ?? null,
            p_address: customer.address,
            p_city: customer.city,
            p_state: customer.state,
            p_pincode: customer.pincode,
            p_notes: customer.notes ?? null,
            p_items: items,
        });
        if (error) {
            console.error('Error in place_order RPC:', error);
            const lowerMsg = (error.message || '').toLowerCase();
            if (lowerMsg.includes('insufficient stock') ||
                lowerMsg.includes('unavailable') ||
                lowerMsg.includes('out of stock') ||
                lowerMsg.includes('not enough stock') ||
                error.code === 'P0001') {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Failed to place order' });
            return;
        }
        // Expected return shape: { order_id, order_number, total }
        const resultObj = Array.isArray(data) ? data[0] : data;
        const orderId = resultObj?.order_id ?? resultObj?.id;
        const orderNumber = resultObj?.order_number;
        const total = resultObj?.total;
        res.status(201).json({
            order_id: orderId,
            order_number: orderNumber,
            total,
        });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/orders - Admin: list orders (newest first)
router.get('/', requireAdmin, validate({ query: adminOrderQuerySchema }), async (req, res, next) => {
    try {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        let query = supabase
            .from('orders')
            .select('*', { count: 'exact' });
        if (status) {
            query = query.eq('status', status);
        }
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data: orders, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) {
            console.error('Error fetching orders:', error.message);
            res.status(500).json({ error: 'Failed to fetch orders' });
            return;
        }
        res.setHeader('X-Total-Count', count ?? 0);
        res.json(orders ?? []);
    }
    catch (err) {
        next(err);
    }
});
// GET /api/orders/:id - Admin: get order with items
router.get('/:id', requireAdmin, validate({ params: orderIdParamSchema }), async (req, res, next) => {
    try {
        const id = req.params.id;
        const { data: order, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            console.error('Error fetching order by id:', error.message);
            res.status(500).json({ error: 'Failed to fetch order' });
            return;
        }
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(order);
    }
    catch (err) {
        next(err);
    }
});
// PATCH /api/orders/:id/status - Admin: update order status
router.patch('/:id/status', requireAdmin, validate({ params: orderIdParamSchema, body: updateOrderStatusSchema }), async (req, res, next) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const { error } = await supabase.rpc('set_order_status', {
            p_order_id: id,
            p_status: status,
        });
        if (error) {
            console.error('Error calling set_order_status RPC:', error);
            const lowerMsg = (error.message || '').toLowerCase();
            if (lowerMsg.includes('cancelled') ||
                lowerMsg.includes('cannot be changed') ||
                error.code === 'P0001') {
                if (lowerMsg.includes('not found')) {
                    res.status(404).json({ error: error.message });
                    return;
                }
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Failed to update order status' });
            return;
        }
        // Fetch and return the updated order with items
        const { data: updatedOrder, error: fetchError } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', id)
            .single();
        if (fetchError || !updatedOrder) {
            console.error('Error fetching updated order:', fetchError?.message);
            res.status(500).json({ error: 'Failed to fetch updated order' });
            return;
        }
        res.json(updatedOrder);
    }
    catch (err) {
        next(err);
    }
});
export default router;
