import Course from '../models/Course.js';
import Resource from '../models/Resource.js';

export async function listResources(request, response, next) {
  try {
    const resources = await Resource.find({ course: request.params.courseId }).sort({ createdAt: -1 });
    return response.json({ success: true, resources });
  } catch (error) { return next(error); }
}

export async function createResource(request, response, next) {
  try {
    const { title, description, fileUrl, fileType, course, lesson } = request.body;
    if (!fileUrl) return response.status(400).json({ success: false, message: 'A resource URL is required' });
    if (!await Course.exists({ _id: course })) return response.status(404).json({ success: false, message: 'Course not found' });
    const resource = await Resource.create({ title, description, fileUrl, fileType, course, lesson: lesson || null, uploadedBy: request.user._id });
    return response.status(201).json({ success: true, resource });
  } catch (error) { return next(error); }
}

export async function deleteResource(request, response, next) {
  try {
    const resource = await Resource.findByIdAndDelete(request.params.id);
    if (!resource) return response.status(404).json({ success: false, message: 'Resource not found' });
    return response.json({ success: true, message: 'Resource deleted' });
  } catch (error) { return next(error); }
}
