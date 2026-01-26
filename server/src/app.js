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
import adminRoutes from './routes/adminRoutes.js';
import startCron from './cron/targetEvaluationCron.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes); // Module 9

// Start Cron Jobs
startCron();

export default app;
