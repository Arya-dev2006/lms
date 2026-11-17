import mongoose from 'mongoose';

const platformSettingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true, trim: true },
    value: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default mongoose.model('PlatformSetting', platformSettingSchema);
