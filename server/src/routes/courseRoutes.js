import { Router } from 'express';
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from '../controllers/courseController.js';
import { protect, requireRole } from '../middleware/auth.js';
import { publicStats } from '../controllers/adminController.js';

const router = Router();
router.get('/stats', publicStats);
router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', protect, requireRole('admin'), createCourse);
router.put('/:id', protect, requireRole('admin'), updateCourse);
router.delete('/:id', protect, requireRole('admin'), deleteCourse);
export default router;
