import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: null },
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
