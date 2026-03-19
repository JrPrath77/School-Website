const errorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  // Log full details server-side only (never expose stack to client)
  console.error(`❌ [${new Date().toISOString()}] ${err.stack || err.message}`);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
  }

  // Multer file type error
  if (err.message && err.message.includes('Only JPG, PNG, WEBP allowed')) {
    return res.status(400).json({ message: err.message });
  }

  // CORS error
  if (err.message && err.message.includes('CORS not allowed')) {
    return res.status(403).json({ message: 'Origin not allowed.' });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry. This record already exists.' });
  }

  // Default server error — never leak internal details in production
  res.status(err.status || 500).json({
    message: isDev
      ? (err.message || 'Internal server error.')
      : 'Something went wrong. Please try again.',
  });
};

export default errorHandler;
