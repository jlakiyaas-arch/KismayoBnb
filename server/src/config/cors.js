/**
 * CORS origins: set CLIENT_URL in production.
 * Multiple origins: comma-separated (e.g. Vercel production + preview).
 * Example: https://kisbnb.vercel.app,https://kisbnb-*.vercel.app
 * For preview branches, add each preview URL to Render env or use a single production URL.
 */
export const getCorsOptions = () => {
  const raw = process.env.CLIENT_URL || 'http://localhost:5173';
  const origins = raw.split(',').map((o) => o.trim()).filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = origins.some((allowedOrigin) => {
        if (allowedOrigin === origin) return true;
        if (allowedOrigin.includes('*')) {
          const pattern = allowedOrigin.replace(/\./g, '\\.').replace(/\*/g, '.*');
          return new RegExp(`^${pattern}$`).test(origin);
        }
        return false;
      });

      if (allowed) callback(null, true);
      else callback(null, false);
    },
    credentials: true,
  };
};
