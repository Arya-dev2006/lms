import { Router } from 'express';
import { createLesson, deleteLesson, listLessons, updateLesson } from '../controllers/lessonController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.get('/course/:courseId', listLessons);
router.post('/', protect, requireRole('admin'), createLesson);
router.put('/:id', protect, requireRole('admin'), updateLesson);
router.delete('/:id', protect, requireRole('admin'), deleteLesson);
export default router;
