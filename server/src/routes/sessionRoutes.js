import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.post('/start', protect, sessionController.startSession);
router.post('/end', protect, sessionController.endSession);

export default router;
