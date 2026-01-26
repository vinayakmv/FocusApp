import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import partnershipController from '../controllers/partnershipController.js';

const router = express.Router();

router.get('/', protect, partnershipController.getRewards);
router.get('/redeemed', protect, partnershipController.getMyRedeemed);
router.post('/redeem', protect, partnershipController.redeemReward);

export default router;
