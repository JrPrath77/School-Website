import cors from 'cors';

const configureCors = () => {
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5500', 'http://localhost:5173'];

  return cors({
    origin: (origin, callback) => {
      // Block null origin (file:// documents, sandboxed iframes — a CSRF vector)
      if (!origin) return callback(new Error('Requests without an origin are not allowed.'));
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  // PATCH needed for status updates
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
};

export default configureCors;
