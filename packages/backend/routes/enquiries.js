import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import { formLimiter } from '../middleware/rateLimiter.js';
import Enquiry from '../models/Enquiry.js';

const router = Router();

// ── Public: POST /api/v1/enquiries ─────────────────────────────
// Rate-limited (reuse existing limiter) to prevent spam
router.post('/', formLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('message').optional().trim().isLength({ max: 1000 }).withMessage('Message too long'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const enquiry = await Enquiry.create({
      name:           req.body.name,
      phone:          req.body.phone,
      email:          req.body.email || '',
      previousSchool: req.body.previousSchool || '',
      standard:       req.body.standard || '',
      message:        req.body.message || '',
    });

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', id: enquiry._id });
  } catch (error) {
    next(error);
  }
});

// ── Admin: GET /api/v1/enquiries ───────────────────────────────
router.get('/', auth, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    next(error);
  }
});

// ── Admin: PATCH /api/v1/enquiries/:id/status ──────────────────
router.patch('/:id/status', auth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'seen', 'contacted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(enquiry);
  } catch (error) {
    next(error);
  }
});

// ── Admin: DELETE /api/v1/enquiries/:id ───────────────────────
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
