import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['academics', 'sports', 'arts', 'events'],
    default: 'events',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  coverImageUrl: {
    type: String,
    default: '',
  },
  coverCloudinaryId: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

// Prevent duplicate events with same title and date
eventSchema.index({ title: 1, date: 1 }, { unique: true });

export default mongoose.model('Event', eventSchema);
