import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import tokenController from '../controllers/tokenController.js';

const router = express.Router();

router.post('/buy', protect, tokenController.buyTokens);
router.get('/balance', protect, tokenController.getTokenBalance);

export default router;
