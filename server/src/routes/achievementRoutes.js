import { Router } from 'express';
import { listMyAchievements } from '../controllers/achievementController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/my-achievements', protect, listMyAchievements);
export default router;
