import { Router } from 'express';
import { createResource, deleteResource, listResources } from '../controllers/resourceController.js';
import { protect, requireRole } from '../middleware/auth.js';
import { requireCourseAccess } from '../utils/courseAccess.js';

const router = Router();
router.get('/course/:courseId', protect, requireCourseAccess, listResources);
router.post('/', protect, requireRole('admin'), createResource);
router.delete('/:id', protect, requireRole('admin'), deleteResource);
export default router;
