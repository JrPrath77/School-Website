// Load environment variables FIRST (must be before any module that reads process.env)
import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import timeout from 'connect-timeout';
import connectDB from './config/db.js';
import configureCors from './config/cors.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import galleryRoutes from './routes/gallery.js';
import eventRoutes from './routes/events.js';
import videoRoutes from './routes/videos.js';
import noticeRoutes from './routes/notices.js';
import knowledgeRoutes from './routes/knowledge.js';
import chatRoutes from './routes/chat.js';
import staffRoutes from './routes/staff.js';
import enquiryRoutes from './routes/enquiries.js';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// ─── Middleware Stack ─────────────────────────────────────────
// 1. Request timeout (10 seconds)
app.use(timeout('10s'));

// 2. Security headers
app.use(helmet());

// 3. Request logging
app.use(morgan('combined'));

// 4. Response compression
app.use(compression());

// 5. CORS whitelist
app.use(configureCors());

// 6. Body parser — 1mb limit is sufficient; 10mb enables payload DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 7. Global rate limiter
app.use('/api/', globalLimiter);

// Timeout check helper
function haltOnTimedout(req, _res, next) {
  if (!req.timedout) next();
}
app.use(haltOnTimedout);

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   🚀 DAGA Backend API running on port ${PORT}  ║
  ║   📡 http://localhost:${PORT}                  ║
  ║   🏥 Health: /api/v1/health                  ║
  ╚══════════════════════════════════════════════╝
  `);
});

export default app;
