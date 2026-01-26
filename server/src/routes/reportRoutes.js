import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserReports } from '../controllers/reportController.js';

const router = express.Router();

router.get('/user', protect, getUserReports);

export default router;
