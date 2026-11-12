import { Router } from 'express';
import { enroll, getCourseLearningData, getEnrollment, listMyCourses } from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';
import { requireCourseAccess } from '../utils/courseAccess.js';

const router = Router();
router.use(protect);
router.post('/', enroll);
router.get('/my-courses', listMyCourses);
router.get('/course/:courseId', getEnrollment);
router.get('/course/:courseId/learning', requireCourseAccess, getCourseLearningData);
export default router;
