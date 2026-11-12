import Enrollment from '../models/Enrollment.js';

export async function requireCourseAccess(request, response, next) {
  try {
    const courseId = request.params.courseId || request.body.course;
    if (request.user.role === 'admin') return next();
    const enrollment = await Enrollment.findOne({ user: request.user._id, course: courseId });
    if (!enrollment) {
      return response.status(403).json({ success: false, message: 'Enroll in this course to access its lessons and resources' });
    }
    request.enrollment = enrollment;
    return next();
  } catch (error) {
    return next(error);
  }
}
