import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Video from '../models/Video.js';

const router = Router();

// Extract YouTube video ID from various URL formats
function extractYoutubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // just the ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// GET /api/v1/videos — public
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.set('Cache-Control', 'public, max-age=300');
    res.json(videos);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/videos/featured — public, get featured video
router.get('/featured', async (_req, res, next) => {
  try {
    const video = await Video.findOne({ featured: true }).sort({ createdAt: -1 });
    res.set('Cache-Control', 'public, max-age=300');
    res.json(video);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/videos — admin
router.post('/', auth, [
  body('title').trim().escape().notEmpty().withMessage('Title is required'),
  body('youtubeUrl').trim().notEmpty().withMessage('YouTube URL is required'),
  body('category').isIn(['events', 'academics', 'sports', 'arts']).withMessage('Invalid category'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const youtubeId = extractYoutubeId(req.body.youtubeUrl);
    if (!youtubeId) {
      return res.status(400).json({ message: 'Invalid YouTube URL.' });
    }

    // If marking as featured, unset existing featured
    if (req.body.featured === true || req.body.featured === 'true') {
      await Video.updateMany({ featured: true }, { featured: false });
    }

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description || '',
      youtubeUrl: req.body.youtubeUrl,
      youtubeId,
      category: req.body.category,
      featured: req.body.featured === true || req.body.featured === 'true',
      addedBy: req.admin.id,
    });

    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/videos/:id — admin
router.put('/:id', auth, [
  body('title').optional().trim().escape().notEmpty(),
  body('youtubeUrl').optional().trim().notEmpty(),
  body('category').optional().isIn(['events', 'academics', 'sports', 'arts']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found.' });
    }

    if (req.body.youtubeUrl) {
      const youtubeId = extractYoutubeId(req.body.youtubeUrl);
      if (!youtubeId) {
        return res.status(400).json({ message: 'Invalid YouTube URL.' });
      }
      video.youtubeUrl = req.body.youtubeUrl;
      video.youtubeId = youtubeId;
    }

    if (req.body.title) video.title = req.body.title;
    if (req.body.description !== undefined) video.description = req.body.description;
    if (req.body.category) video.category = req.body.category;

    if (req.body.featured === true || req.body.featured === 'true') {
      await Video.updateMany({ featured: true }, { featured: false });
      video.featured = true;
    } else if (req.body.featured === false || req.body.featured === 'false') {
      video.featured = false;
    }

    await video.save();
    res.json(video);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/videos/:id — admin
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found.' });
    }
    res.json({ message: 'Video deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
