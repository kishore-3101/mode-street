import rateLimit from 'express-rate-limit';
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // max 10 requests per window
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({ error: 'Too many login attempts, please try again later.' });
    },
});
