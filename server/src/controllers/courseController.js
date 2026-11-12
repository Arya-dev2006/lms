import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function listCourses(request, response, next) {
  try {
    const filter = request.user?.role === 'admin' ? {} : { isPublished: true };
    const query = request.query.search?.trim();
    if (query) filter.$text = { $search: query };
    if (request.query.category) filter.category = request.query.category;
    if (request.query.difficulty) filter.difficulty = request.query.difficulty;
    const page = Math.max(Number.parseInt(request.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(Number.parseInt(request.query.limit || '12', 10), 1), 50);
    const [courses, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('createdBy', 'name'),
      Course.countDocuments(filter),
    ]);
    return response.json({ success: true, courses, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

export async function getCourse(request, response, next) {
  try {
    const course = await Course.findById(request.params.id).populate('createdBy', 'name');
    if (!course || (!course.isPublished && request.user?.role !== 'admin')) {
      return response.status(404).json({ success: false, message: 'Course not found' });
    }
    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
    return response.json({ success: true, course, lessons });
  } catch (error) { return next(error); }
}

export async function createCourse(request, response, next) {
  try {
    const { title, description, category, difficulty, instructor, objectives, thumbnail, isPublished } = request.body;
    const course = await Course.create({
      title, slug: slugify(title), description, category, difficulty, instructor, thumbnail,
      objectives: Array.isArray(objectives) ? objectives : [],
      isPublished: Boolean(isPublished),
      createdBy: request.user._id,
    });
    return response.status(201).json({ success: true, course });
  } catch (error) { return next(error); }
}

export async function updateCourse(request, response, next) {
  try {
    const updates = { ...request.body };
    if (updates.title) updates.slug = slugify(updates.title);
    if (updates.objectives && !Array.isArray(updates.objectives)) {
      return response.status(400).json({ success: false, message: 'Objectives must be an array' });
    }
    const course = await Course.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true });
    if (!course) return response.status(404).json({ success: false, message: 'Course not found' });
    return response.json({ success: true, course });
  } catch (error) { return next(error); }
}

export async function deleteCourse(request, response, next) {
  try {
    const course = await Course.findByIdAndDelete(request.params.id);
    if (!course) return response.status(404).json({ success: false, message: 'Course not found' });
    await Lesson.deleteMany({ course: course._id });
    return response.json({ success: true, message: 'Course deleted' });
  } catch (error) { return next(error); }
}
