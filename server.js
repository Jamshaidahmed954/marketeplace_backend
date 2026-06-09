import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import config from './src/config/env.js';
import logger from './src/utils/logger.js';
import errorMiddleware from './src/middleware/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';

import userRoutes     from './src/modules/users/user.routes.js';
import authRoutes     from './src/modules/auth/auth.routes.js';
import categoryRoutes from './src/modules/categories/category.routes.js';
import productRoutes  from './src/modules/products/product.routes.js';
import orderRoutes    from './src/modules/orders/order.routes.js';
import reviewRoutes   from './src/modules/reviews/review.routes.js';
import earningRoutes  from './src/modules/earnings/earning.routes.js';
import adminRoutes    from './src/modules/admin/admin.routes.js';

dotenv.config();

const app = express();

// ─── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// HTTP request logger – logs every incoming request
app.use((req, _res, next) => {
    logger.http(`${req.method} ${req.originalUrl}`, { ip: req.ip });
    next();
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/earnings',   earningRoutes);
app.use('/api/admin',      adminRoutes);

// ─── Swagger Documentation ─────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler (MUST be last) ───────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(config.port, () => {
    logger.info(`🚀 Server running on port ${config.port}`, { env: config.nodeEnv });
});
