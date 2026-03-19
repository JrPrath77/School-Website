import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import KnowledgeBase from '../models/KnowledgeBase.js';

const router = Router();

// GET /api/v1/knowledge — admin only
router.get('/', auth, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    if (req.query.language) filter.language = req.query.language;

    const entries = await KnowledgeBase.find(filter).sort({ topic: 1, updatedAt: -1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/knowledge — admin
router.post('/', auth, [
  body('topic').isIn(['admissions', 'fees', 'schedule', 'facilities', 'transport', 'contact', 'general', 'exams', 'sports', 'food'])
    .withMessage('Invalid topic'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('keywords').isArray({ min: 1 }).withMessage('At least one keyword required'),
  body('language').optional().isIn(['en', 'mr']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entry = await KnowledgeBase.create({
      topic: req.body.topic,
      title: req.body.title,
      content: req.body.content,
      keywords: req.body.keywords.map(k => k.toLowerCase().trim()),
      language: req.body.language || 'en',
      updatedBy: req.admin.id,
    });

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/knowledge/:id — admin
router.put('/:id', auth, [
  body('topic').optional().isIn(['admissions', 'fees', 'schedule', 'facilities', 'transport', 'contact', 'general', 'exams', 'sports', 'food']),
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  body('keywords').optional().isArray({ min: 1 }),
  body('language').optional().isIn(['en', 'mr']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entry = await KnowledgeBase.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Knowledge entry not found.' });
    }

    if (req.body.topic) entry.topic = req.body.topic;
    if (req.body.title) entry.title = req.body.title;
    if (req.body.content) entry.content = req.body.content;
    if (req.body.keywords) entry.keywords = req.body.keywords.map(k => k.toLowerCase().trim());
    if (req.body.language) entry.language = req.body.language;
    entry.updatedBy = req.admin.id;

    await entry.save();
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/knowledge/:id — admin
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const entry = await KnowledgeBase.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Knowledge entry not found.' });
    }
    res.json({ message: 'Knowledge entry deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
