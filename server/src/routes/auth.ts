import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { supabase } from '../lib/supabase.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';
import { loginSchema } from '../schemas/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', loginLimiter, validate({ body: loginSchema }), async (req: any, res: any, next: any) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const { data: admin, error } = await supabase
            .from('admins')
            .select('id, email, password_hash')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (error) {
            console.error('Error fetching admin during login:', error.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (!admin) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const match = await bcrypt.compare(password, admin.password_hash);
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
            },
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me
router.get('/me', requireAdmin, async (req: any, res: any, next: any) => {
    try {
        const adminId = req.admin?.id;
        if (!adminId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { data: admin, error } = await supabase
            .from('admins')
            .select('id, email, created_at')
            .eq('id', adminId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching admin profile:', error.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (!admin) {
            res.status(404).json({ error: 'Admin not found' });
            return;
        }

        res.json({
            admin: {
                id: admin.id,
                email: admin.email,
                created_at: admin.created_at,
            },
        });
    } catch (err) {
        next(err);
    }
});

export const authRouter = router;
export default router;
