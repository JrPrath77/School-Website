import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';
import Gallery from '../models/Gallery.js';

const router = Router();

// GET /api/v1/gallery — public, paginated
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // Build filter
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.eventId) filter.eventId = req.query.eventId;

    const [images, total] = await Promise.all([
      Gallery.find(filter).sort(sort).skip(skip).limit(limit).populate('eventId', 'title'),
      Gallery.countDocuments(filter),
    ]);

    res.set('Cache-Control', 'public, max-age=300'); // 5-minute cache
    res.json({
      images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/gallery/event/:eventId — all images for an event
router.get('/event/:eventId', async (req, res, next) => {
  try {
    const images = await Gallery.find({ eventId: req.params.eventId })
      .sort({ createdAt: -1 });

    res.set('Cache-Control', 'public, max-age=300');
    res.json(images);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/gallery — admin, upload image to Cloudinary
router.post('/', auth, upload.single('image'), [
  body('title').trim().escape().notEmpty().withMessage('Title is required'),
  body('category').isIn(['academics', 'sports', 'arts', 'events']).withMessage('Invalid category'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'daga-gallery',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const image = await Gallery.create({
      title: req.body.title,
      eventId: req.body.eventId || null,
      category: req.body.category,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      uploadedBy: req.admin.id,
    });

    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/gallery/:id — admin, delete from DB + Cloudinary
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // Delete from Cloudinary
    if (image.cloudinaryId) {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
