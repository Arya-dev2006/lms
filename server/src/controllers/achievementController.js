import Achievement from '../models/Achievement.js';

export async function listMyAchievements(request, response, next) {
  try {
    const achievements = await Achievement.find({ user: request.user._id }).sort({ earnedAt: -1 });
    return response.json({ success: true, achievements });
  } catch (error) { return next(error); }
}
