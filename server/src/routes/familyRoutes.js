import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    inviteChild,
    acceptInvite,
    getChildren,
    assignTarget
} from '../controllers/familyController.js';

const router = express.Router();

router.post('/invite', protect, inviteChild);
router.post('/accept', protect, acceptInvite);
router.get('/children', protect, getChildren);
router.post('/assign-target', protect, assignTarget);

export default router;
