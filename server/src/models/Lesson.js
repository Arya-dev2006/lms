import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', trim: true, maxlength: 5000 },
    videoUrl: { type: String, default: '' },
    duration: { type: Number, min: 0, default: 0 },
    order: { type: Number, min: 1, required: true },
    module: { type: String, default: 'General', trim: true, maxlength: 100 },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true },
);

lessonSchema.index({ course: 1, order: 1 }, { unique: true });

export default mongoose.model('Lesson', lessonSchema);
