import { Router } from 'express';
import { listCourses } from '../controllers/courseController.js';
import { protect, requireRole } from '../middleware/auth.js';
import { dashboardAnalytics, listUsers, userProgress } from '../controllers/adminController.js';

const router = Router();

router.get('/ping', protect, requireRole('admin'), (_request, response) => {
  response.json({ success: true, message: 'Admin authorization is working' });
});
router.get('/courses', protect, requireRole('admin'), listCourses);
router.get('/analytics', protect, requireRole('admin'), dashboardAnalytics);
router.get('/users', protect, requireRole('admin'), listUsers);
router.get('/users/:userId', protect, requireRole('admin'), userProgress);

export default router;
