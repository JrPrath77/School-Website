import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    enum: ['admissions', 'fees', 'schedule', 'facilities', 'transport', 'contact', 'general', 'exams', 'sports', 'food'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  language: {
    type: String,
    enum: ['en', 'mr'],
    default: 'en',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

// Text index for search
knowledgeBaseSchema.index({ keywords: 1 });
knowledgeBaseSchema.index({ topic: 1 });

export default mongoose.model('KnowledgeBase', knowledgeBaseSchema);
