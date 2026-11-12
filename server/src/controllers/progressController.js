import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';
import { awardLessonAchievements } from '../utils/achievements.js';

export async function getMyProgress(request, response, next) {
  try {
    const progress = await Progress.find({ user: request.user._id }).populate('course', 'title thumbnail instructor').populate('lastAccessedLesson', 'title order');
    return response.json({ success: true, progress });
  } catch (error) { return next(error); }
}

export async function completeLesson(request, response, next) {
  try {
    const { courseId, lessonId } = request.params;
    const [lesson, enrollment] = await Promise.all([
      Lesson.findOne({ _id: lessonId, course: courseId }),
      Enrollment.findOne({ user: request.user._id, course: courseId }),
    ]);
    if (!lesson || !enrollment) return response.status(403).json({ success: false, message: 'You cannot update this lesson' });
    const lessonsCount = await Lesson.countDocuments({ course: courseId });
    const progress = await Progress.findOneAndUpdate(
      { user: request.user._id, course: courseId },
      { $addToSet: { completedLessons: lesson._id }, $set: { lastAccessedLesson: lesson._id } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    const completedCount = progress.completedLessons.length;
    progress.completionPercentage = lessonsCount ? Math.round((completedCount / lessonsCount) * 100) : 0;
    if (progress.completionPercentage === 100) progress.completedAt = progress.completedAt || new Date();
    await progress.save();
    await Enrollment.updateOne({ _id: enrollment._id }, { lastAccessedLesson: lesson._id });
    await awardLessonAchievements(request.user._id, progress.completionPercentage);
    return response.json({ success: true, progress });
  } catch (error) { return next(error); }
}

export async function updateLastAccessed(request, response, next) {
  try {
    const { courseId, lessonId } = request.params;
    const [lesson, enrollment] = await Promise.all([
      Lesson.findOne({ _id: lessonId, course: courseId }),
      Enrollment.findOne({ user: request.user._id, course: courseId }),
    ]);
    if (!lesson) return response.status(404).json({ success: false, message: 'Lesson not found' });
    if (!enrollment) return response.status(403).json({ success: false, message: 'You are not enrolled in this course' });
    await Promise.all([
      Enrollment.updateOne({ user: request.user._id, course: courseId }, { lastAccessedLesson: lessonId }),
      Progress.findOneAndUpdate({ user: request.user._id, course: courseId }, { lastAccessedLesson: lessonId }, { upsert: true }),
    ]);
    return response.json({ success: true, lessonId });
  } catch (error) { return next(error); }
}
