import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Staff from '../models/Staff.js';
import auth from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── PUBLIC: Get all active staff | Admin: Get all staff ───
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    // Public only sees active staff; admins (with token) see all
    if (!req.headers.authorization) {
      filter.isActive = true;
    }
    const staff = await Staff.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ data: staff });
  } catch (error) {
    next(error);
  }
});

// ─── ADMIN: Create staff ───
router.post('/', auth, upload.single('photo'), async (req, res, next) => {
  try {
    const { name, designation, department, description, qualification, order } = req.body;

    let photo = '';
    let cloudinaryId = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'daga-staff', transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      photo = result.secure_url;
      cloudinaryId = result.public_id;
    }

    let finalOrder = order !== undefined && order !== '' && order !== 'null' ? parseInt(order) : null;
    if (finalOrder === null || isNaN(finalOrder)) {
      const lastStaff = await Staff.findOne({}, 'order').sort({ order: -1 });
      finalOrder = lastStaff && lastStaff.order != null ? lastStaff.order + 1 : 1;
    }

    const staff = await Staff.create({
      name,
      designation,
      department: department || '',
      description: description || '',
      qualification: qualification || '',
      order: finalOrder,
      photo,
      cloudinaryId,
    });

    res.status(201).json({ data: staff });
  } catch (error) {
    next(error);
  }
});

// ─── ADMIN: Update staff ───
router.put('/:id', auth, upload.single('photo'), async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const { name, designation, department, description, qualification, order, isActive } = req.body;

    // Update photo if new file uploaded
    if (req.file) {
      // Delete old photo from Cloudinary
      if (staff.cloudinaryId) {
        await cloudinary.uploader.destroy(staff.cloudinaryId).catch(() => {});
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'daga-staff', transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      staff.photo = result.secure_url;
      staff.cloudinaryId = result.public_id;
    }

    if (name !== undefined) staff.name = name;
    if (designation !== undefined) staff.designation = designation;
    if (department !== undefined) staff.department = department;
    if (description !== undefined) staff.description = description;
    if (qualification !== undefined) staff.qualification = qualification;
    if (order !== undefined && order !== '' && order !== 'null') staff.order = parseInt(order);
    if (isActive !== undefined) staff.isActive = isActive === 'true' || isActive === true;

    await staff.save();
    res.json({ data: staff });
  } catch (error) {
    next(error);
  }
});

// ─── ADMIN: Delete staff ───
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // Delete photo from Cloudinary
    if (staff.cloudinaryId) {
      await cloudinary.uploader.destroy(staff.cloudinaryId).catch(() => {});
    }

    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
