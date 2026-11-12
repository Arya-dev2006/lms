import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

export async function listLessons(request, response, next) {
  try {
    const lessons = await Lesson.find({ course: request.params.courseId }).sort({ order: 1 });
    return response.json({ success: true, lessons });
  } catch (error) { return next(error); }
}

export async function createLesson(request, response, next) {
  try {
    const { course, title, description, videoUrl, duration, order, module, isPreview } = request.body;
    if (!await Course.exists({ _id: course })) return response.status(404).json({ success: false, message: 'Course not found' });
    const lesson = await Lesson.create({ course, title, description, videoUrl, duration, order, module, isPreview });
    return response.status(201).json({ success: true, lesson });
  } catch (error) { return next(error); }
}

export async function updateLesson(request, response, next) {
  try {
    const lesson = await Lesson.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!lesson) return response.status(404).json({ success: false, message: 'Lesson not found' });
    return response.json({ success: true, lesson });
  } catch (error) { return next(error); }
}

export async function deleteLesson(request, response, next) {
  try {
    const lesson = await Lesson.findByIdAndDelete(request.params.id);
    if (!lesson) return response.status(404).json({ success: false, message: 'Lesson not found' });
    return response.json({ success: true, message: 'Lesson deleted' });
  } catch (error) { return next(error); }
}
