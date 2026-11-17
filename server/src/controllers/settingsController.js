import PlatformSetting from '../models/PlatformSetting.js';

const defaultSettings = {
  platformName: 'LearnSphere',
  platformDescription: 'Thoughtful learning for curious people.',
};

export async function getSettings(_request, response, next) {
  try {
    const settings = await PlatformSetting.find({ key: { $in: Object.keys(defaultSettings) } }).lean();
    const values = { ...defaultSettings };
    settings.forEach((setting) => { values[setting.key] = setting.value; });
    return response.json({ success: true, settings: values });
  } catch (error) {
    return next(error);
  }
}

export async function updateSettings(request, response, next) {
  try {
    const updates = request.body || {};
    const allowedKeys = Object.keys(defaultSettings);
    const entries = allowedKeys
      .filter((key) => typeof updates[key] === 'string' && updates[key].trim())
      .map((key) => [key, updates[key].trim()]);
    await Promise.all(entries.map(([key, value]) => PlatformSetting.findOneAndUpdate(
      { key },
      { key, value, updatedBy: request.user._id },
      { upsert: true, new: true, runValidators: true },
    )));
    return getSettings(request, response, next);
  } catch (error) {
    return next(error);
  }
}
