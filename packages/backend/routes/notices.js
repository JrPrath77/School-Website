import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Notice from '../models/Notice.js';

const router = Router();

// GET /api/v1/notices — public (only active)
router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    // Public requests only see active notices
    if (!req.headers.authorization) {
      filter.isActive = true;
    }

    if (req.query.priority) filter.priority = req.query.priority;

    const notices = await Notice.find(filter).sort({ date: -1 });
    res.set('Cache-Control', 'public, max-age=300');
    res.json(notices);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/notices — admin
router.post('/', auth, [
  body('title').trim().escape().notEmpty().withMessage('Title is required'),
  body('description').trim().escape().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('priority').optional().isIn(['normal', 'important', 'urgent']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const notice = await Notice.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      priority: req.body.priority || 'normal',
      isActive: true,
      isPopup: req.body.isPopup === true || req.body.isPopup === 'true',
      createdBy: req.admin.id,
    });

    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/notices/:id — admin
router.put('/:id', auth, [
  body('title').optional().trim().escape().notEmpty(),
  body('description').optional().trim().escape().notEmpty(),
  body('date').optional().isISO8601(),
  body('priority').optional().isIn(['normal', 'important', 'urgent']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    if (req.body.title) notice.title = req.body.title;
    if (req.body.description) notice.description = req.body.description;
    if (req.body.date) notice.date = req.body.date;
    if (req.body.priority) notice.priority = req.body.priority;
    if (req.body.isActive !== undefined) notice.isActive = req.body.isActive;
    if (req.body.isPopup !== undefined) notice.isPopup = req.body.isPopup === true || req.body.isPopup === 'true';

    await notice.save();
    res.json(notice);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/notices/:id — admin
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }
    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
