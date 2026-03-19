import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Notice description is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Notice date is required'],
  },
  priority: {
    type: String,
    enum: ['normal', 'important', 'urgent'],
    default: 'normal',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPopup: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

// Active notices sorted by date
noticeSchema.index({ isActive: 1, date: -1 });

export default mongoose.model('Notice', noticeSchema);
