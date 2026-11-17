import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect, requireRole('admin'));
router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
