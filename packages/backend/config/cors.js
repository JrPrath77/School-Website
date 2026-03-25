import cors from 'cors';

const configureCors = () => {
  // Always-allowed origins (production domain must be hardcoded as safety net)
  const hardcodedOrigins = [
    'http://localhost:5500',
    'http://localhost:5173',
    'https://www.dnyansiddhigurukul.in',
    'https://dnyansiddhigurukul.in',
  ];

  // Merge env var origins WITH hardcoded origins (env var supplements, never replaces)
  const envOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : [];

  const allowedOrigins = [...new Set([...hardcodedOrigins, ...envOrigins])];

  return cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("CORS not allowed")); // matches errorHandler check
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });
};

export default configureCors;
