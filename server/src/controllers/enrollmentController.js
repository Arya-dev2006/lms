import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';
import { awardEnrollmentAchievements } from '../utils/achievements.js';

export async function enroll(request, response, next) {
  try {
    const course = await Course.findOne({ _id: request.body.course, isPublished: true });
    if (!course) return response.status(404).json({ success: false, message: 'Published course not found' });
    const existing = await Enrollment.findOne({ user: request.user._id, course: course._id });
    if (existing) return response.status(409).json({ success: false, message: 'You are already enrolled in this course' });
    const enrollment = await Enrollment.create({ user: request.user._id, course: course._id });
    await Progress.create({ user: request.user._id, course: course._id });
    await awardEnrollmentAchievements(request.user._id);
    return response.status(201).json({ success: true, enrollment });
  } catch (error) { return next(error); }
}

export async function listMyCourses(request, response, next) {
  try {
    const enrollments = await Enrollment.find({ user: request.user._id })
      .populate('course')
      .populate('lastAccessedLesson', 'title order');
    const courseIds = enrollments.map((item) => item.course._id);
    const progress = await Progress.find({ user: request.user._id, course: { $in: courseIds } });
    const progressByCourse = new Map(progress.map((item) => [item.course.toString(), item]));
    const courses = enrollments.map((enrollment) => ({
      ...enrollment.course.toObject(),
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt,
      lastAccessedLesson: enrollment.lastAccessedLesson,
      progress: progressByCourse.get(enrollment.course._id.toString()) || null,
    }));
    return response.json({ success: true, courses });
  } catch (error) { return next(error); }
}

export async function getEnrollment(request, response, next) {
  try {
    const enrollment = await Enrollment.findOne({ user: request.user._id, course: request.params.courseId });
    const progress = await Progress.findOne({ user: request.user._id, course: request.params.courseId });
    return response.json({ success: true, enrolled: Boolean(enrollment), enrollment, progress });
  } catch (error) { return next(error); }
}

export async function getCourseLearningData(request, response, next) {
  try {
    const course = await Course.findById(request.params.courseId);
    if (!course) return response.status(404).json({ success: false, message: 'Course not found' });
    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
    const progress = await Progress.findOne({ user: request.user._id, course: course._id })
      .populate('lastAccessedLesson');
    return response.json({ success: true, course, lessons, progress });
  } catch (error) { return next(error); }
}
