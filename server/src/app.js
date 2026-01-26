import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import targetRoutes from './routes/targetRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import partnershipRoutes from './routes/partnershipRoutes.js';
import familyRoutes from './routes/familyRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ... (existing application code)

app.use('/api/admin', adminRoutes); // Module 9

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start Cron Jobs
startCron();

export default app;
