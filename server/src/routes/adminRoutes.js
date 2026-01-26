import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // In real app, add admin middleware
import { addPartnerReward, getAdminPartners } from '../controllers/adminController.js';

const router = express.Router();

router.post('/partners/add', protect, addPartnerReward);
router.get('/partners', protect, getAdminPartners);

export default router;
