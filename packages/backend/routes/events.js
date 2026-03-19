import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';

const router = Router();

// GET /api/v1/events — public
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.category) filter.category = req.query.category;

    let query = Event.find(filter).sort({ date: -1 });
    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit, 10));
    }
    const events = await query;

    // Add image count for each event
    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const imageCount = await Gallery.countDocuments({ eventId: event._id });
        return { ...event.toObject(), imageCount };
      })
    );

    res.set('Cache-Control', 'public, max-age=300');
    res.json(eventsWithCount);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/events/:id — public
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const imageCount = await Gallery.countDocuments({ eventId: event._id });
    res.set('Cache-Control', 'public, max-age=300');
    res.json({ ...event.toObject(), imageCount });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/events — admin
router.post('/', auth, upload.single('coverImage'), [
  body('title').trim().escape().notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('category').isIn(['academics', 'sports', 'arts', 'events']).withMessage('Invalid category'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let coverImageUrl = '';
    let coverCloudinaryId = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'daga-events', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      coverImageUrl = result.secure_url;
      coverCloudinaryId = result.public_id;
    }

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description || '',
      date: req.body.date,
      category: req.body.category,
      featured: req.body.featured === 'true',
      coverImageUrl,
      coverCloudinaryId,
      createdBy: req.admin.id,
    });

    res.status(201).json(event);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An event with this identical title and date already exists.' });
    }
    next(error);
  }
});

// PUT /api/v1/events/:id — admin
router.put('/:id', auth, upload.single('coverImage'), [
  body('title').optional().trim().escape().notEmpty(),
  body('date').optional().isISO8601(),
  body('category').optional().isIn(['academics', 'sports', 'arts', 'events']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // If new cover image, delete old from Cloudinary
    if (req.file) {
      if (event.coverCloudinaryId) {
        await cloudinary.uploader.destroy(event.coverCloudinaryId);
      }
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'daga-events', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      event.coverImageUrl = result.secure_url;
      event.coverCloudinaryId = result.public_id;
    }

    if (req.body.title) event.title = req.body.title;
    if (req.body.description !== undefined) event.description = req.body.description;
    if (req.body.date) event.date = req.body.date;
    if (req.body.category) event.category = req.body.category;
    if (req.body.featured !== undefined) event.featured = req.body.featured === 'true';

    await event.save();
    res.json(event);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An event with this identical title and date already exists.' });
    }
    next(error);
  }
});

// DELETE /api/v1/events/:id — admin, cascade delete images
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Delete cover from Cloudinary
    if (event.coverCloudinaryId) {
      await cloudinary.uploader.destroy(event.coverCloudinaryId);
    }

    // Cascade: delete all images belonging to this event
    const images = await Gallery.find({ eventId: event._id });
    for (const img of images) {
      if (img.cloudinaryId) {
        await cloudinary.uploader.destroy(img.cloudinaryId);
      }
    }
    await Gallery.deleteMany({ eventId: event._id });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: `Event and ${images.length} images deleted.` });
  } catch (error) {
    next(error);
  }
});

export default router;
