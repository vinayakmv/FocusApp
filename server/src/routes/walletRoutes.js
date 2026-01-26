import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import walletController from '../controllers/walletController.js';

const router = express.Router();

router.get('/balance', protect, walletController.getBalance);
router.post('/add', protect, walletController.addMoney);

export default router;
