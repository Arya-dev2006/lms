import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 140 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    thumbnail: { type: String, default: '' },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    instructor: { type: String, required: true, trim: true, maxlength: 120 },
    objectives: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

courseSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Course', courseSchema);
