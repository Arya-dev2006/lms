import Achievement from '../models/Achievement.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';

export async function awardAchievement(userId, type, title, description) {
  await Achievement.updateOne(
    { user: userId, type },
    { $setOnInsert: { title, description, earnedAt: new Date() } },
    { upsert: true },
  );
}

export async function awardEnrollmentAchievements(userId) {
  const count = await Enrollment.countDocuments({ user: userId });
  if (count === 1) await awardAchievement(userId, 'first-enrollment', 'First enrollment', 'You enrolled in your first course.');
}

export async function awardLessonAchievements(userId, completionPercentage) {
  const completedLessons = await Progress.aggregate([
    { $match: { user: userId } },
    { $project: { count: { $size: '$completedLessons' } } },
    { $group: { _id: null, total: { $sum: '$count' } } },
  ]);
  if ((completedLessons[0]?.total || 0) === 1) {
    await awardAchievement(userId, 'first-lesson', 'First lesson', 'You completed your first lesson.');
  }
  if (completionPercentage === 100) {
    await awardAchievement(userId, 'course-completed', 'Course completed', 'You completed every lesson in a course.');
  }
  const completedCourses = await Progress.countDocuments({ user: userId, completionPercentage: 100 });
  if (completedCourses >= 3) {
    await awardAchievement(userId, 'learning-enthusiast', 'Learning enthusiast', 'You completed three courses.');
  }
}
