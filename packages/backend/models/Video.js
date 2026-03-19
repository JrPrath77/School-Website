import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  youtubeUrl: {
    type: String,
    required: [true, 'YouTube URL is required'],
  },
  youtubeId: {
    type: String,
    required: [true, 'YouTube video ID is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['events', 'academics', 'sports', 'arts'],
    default: 'events',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Video', videoSchema);
