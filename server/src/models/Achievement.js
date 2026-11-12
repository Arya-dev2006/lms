import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: { type: String, enum: ['first-enrollment', 'first-lesson', 'course-completed', 'learning-enthusiast'], required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

achievementSchema.index({ user: 1, type: 1 }, { unique: true });

export default mongoose.model('Achievement', achievementSchema);
