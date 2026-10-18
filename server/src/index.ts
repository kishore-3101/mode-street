import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRouter from './routes/auth.js';
import categoriesRouter from './routes/categories.js';
import productsRouter, { adminProductsRouter } from './routes/products.js';
import uploadsRouter from './routes/uploads.js';
import ordersRouter from './routes/orders.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
const app = express();
// Security and utility middleware
app.use(helmet());
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/products', productsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/orders', ordersRouter);
// 404 handler
app.use(notFoundHandler);
// Central error handler
app.use(errorHandler);
// App bootstrap
if (process.env.NODE_ENV !== 'test') {
    app.listen(env.PORT, () => {
        console.log(`Server listening on port ${env.PORT}`);
    });
}
export default app;
