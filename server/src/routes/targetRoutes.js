import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import targetController from '../controllers/targetController.js';

const router = express.Router();

router.post('/', protect, targetController.createTarget);
router.get('/', protect, targetController.getTargets);

export default router;
