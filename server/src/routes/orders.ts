import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
    createOrderSchema,
    orderIdParamSchema,
    updateOrderStatusSchema,
    adminOrderQuerySchema,
} from '../schemas/orders.js';

const router = Router();

// POST /api/orders - Public: place order
router.post('/', validate({ body: createOrderSchema }), async (req, res, next) => {
    try {
        const { customer, items } = req.body;

        const payload = {
            customer,
            items: items.map((item: any) => ({
                product_id: item.product_id,
                size: item.size,
                quantity: item.quantity,
            })),
        };

        const { data, error } = await supabase.rpc('place_order', {
            payload,
        });

        if (error) {
            console.error('Error placing order:', error.message);
            if (error.message.includes('Insufficient stock')) {
                res.status(409).json({ error: error.message });
                return;
            }
            if (error.message.includes('Product not found') || error.message.includes('is not active')) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Failed to place order' });
            return;
        }

        res.status(201).json(data);
    } catch (err) {
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
    } catch (err) {
        next(err);
    }
});

// GET /api/orders/:id - Admin: get single order with items
router.get('/:id', requireAdmin, validate({ params: orderIdParamSchema }), async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, items:order_items(*)')
            .eq('id', id)
            .maybeSingle();

        if (orderError) {
            console.error('Error fetching order by id:', orderError.message);
            res.status(500).json({ error: 'Failed to fetch order' });
            return;
        }

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/orders/:id/status - Admin: update order status
router.patch('/:id/status', requireAdmin, validate({ params: orderIdParamSchema, body: updateOrderStatusSchema }), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase.rpc('set_order_status', {
            target_order_id: id,
            new_status: status,
        });

        if (error) {
            console.error('Error setting order status:', error.message);
            if (error.message.includes('Cancelled orders cannot be changed')) {
                res.status(409).json({ error: 'Cancelled orders cannot be changed' });
                return;
            }
            if (error.message.includes('Order not found')) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.status(500).json({ error: error.message || 'Failed to update order status' });
            return;
        }

        res.json(data);
    } catch (err) {
        next(err);
    }
});

export const ordersRouter = router;
export default router;
