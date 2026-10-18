import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (!decoded.id || !decoded.email) {
            res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
            return;
        }
        req.admin = {
            id: decoded.id,
            email: decoded.email,
        };
        next();
    }
    catch (_err) {
        res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
}
