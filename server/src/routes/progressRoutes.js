import { Router } from 'express';
import { completeLesson, getMyProgress, updateLastAccessed } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/my-progress', getMyProgress);
router.post('/:courseId/complete-lesson/:lessonId', completeLesson);
router.put('/:courseId/last-accessed/:lessonId', updateLastAccessed);
export default router;
