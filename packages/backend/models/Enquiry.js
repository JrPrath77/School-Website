import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name too long'],
  },
  phone: {
    type: String,    // stored as string to preserve leading zeros / country codes
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number too long'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  previousSchool: {
    type: String,
    trim: true,
    default: '',
  },
  standard: {
    type: String,
    trim: true,
    default: '',
  },
  message: {
    type: String,
    trim: true,
    default: '',
    maxlength: [1000, 'Message too long'],
  },
  status: {
    type: String,
    enum: ['new', 'seen', 'contacted'],
    default: 'new',
  },
}, {
  timestamps: true,   // adds createdAt & updatedAt automatically
});

export default mongoose.model('Enquiry', enquirySchema);
