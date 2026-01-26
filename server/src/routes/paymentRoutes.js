import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', protect, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);

export default router;
