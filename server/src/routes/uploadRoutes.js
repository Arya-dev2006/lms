import { Router } from 'express';
import upload from '../middleware/upload.js';
import { protect, requireRole } from '../middleware/auth.js';
import { uploadAsset } from '../controllers/uploadController.js';

const router = Router();
router.post('/', protect, requireRole('admin'), upload.single('file'), uploadAsset);
export default router;
