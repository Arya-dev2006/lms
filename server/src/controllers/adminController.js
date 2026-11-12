import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

export async function publicStats(_request, response, next) {
  try {
    const [courses, users, enrollments, lessons] = await Promise.all([
      Course.countDocuments({ isPublished: true }),
      User.countDocuments({ role: 'user', isActive: true }),
      Enrollment.countDocuments(),
      Lesson.countDocuments(),
    ]);
    return response.json({ success: true, stats: { courses, learners: users, enrollments, lessons } });
  } catch (error) { return next(error); }
}

export async function dashboardAnalytics(_request, response, next) {
  try {
    const [users, courses, published, lessons, enrollments, completed] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Course.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Lesson.countDocuments(),
      Enrollment.countDocuments(),
      Progress.countDocuments({ completionPercentage: 100 }),
    ]);
    const byCourse = await Enrollment.aggregate([
      { $group: { _id: '$course', enrollments: { $sum: 1 } } },
      { $sort: { enrollments: -1 } },
      { $limit: 8 },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { _id: 0, title: '$course.title', enrollments: 1 } },
    ]);
    return response.json({ success: true, stats: { users, courses, published, lessons, enrollments, completed }, enrollmentsByCourse: byCourse });
  } catch (error) { return next(error); }
}

export async function listUsers(request, response, next) {
  try {
    const page = Math.max(Number.parseInt(request.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(Number.parseInt(request.query.limit || '10', 10), 1), 50);
    const search = request.query.search?.trim();
    const filter = { role: 'user' };
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    const userIds = users.map((user) => user._id);
    const [enrollments, progress] = await Promise.all([
      Enrollment.aggregate([{ $match: { user: { $in: userIds } } }, { $group: { _id: '$user', count: { $sum: 1 } } }]),
      Progress.aggregate([{ $match: { user: { $in: userIds } } }, { $group: { _id: '$user', completed: { $sum: { $cond: [{ $eq: ['$completionPercentage', 100] }, 1, 0] } }, average: { $avg: '$completionPercentage' } } }]),
    ]);
    const enrollmentMap = new Map(enrollments.map((item) => [item._id.toString(), item.count]));
    const progressMap = new Map(progress.map((item) => [item._id.toString(), item]));
    const result = users.map((user) => ({ ...user, enrolledCourses: enrollmentMap.get(user._id.toString()) || 0, ...(progressMap.get(user._id.toString()) || { completed: 0, average: 0 }) }));
    return response.json({ success: true, users: result, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

export async function userProgress(request, response, next) {
  try {
    const user = await User.findById(request.params.userId).select('-password');
    if (!user) return response.status(404).json({ success: false, message: 'User not found' });
    const progress = await Progress.find({ user: user._id }).populate('course', 'title').populate('lastAccessedLesson', 'title');
    return response.json({ success: true, user, progress });
  } catch (error) { return next(error); }
}
