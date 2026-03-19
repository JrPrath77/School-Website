import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null, // null = standalone image (not part of event)
  },
  category: {
    type: String,
    required: true,
    enum: ['academics', 'sports', 'arts', 'events'],
    default: 'events',
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is required'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
gallerySchema.index({ category: 1, createdAt: -1 });
gallerySchema.index({ eventId: 1 });

export default mongoose.model('Gallery', gallerySchema);
