// client/src/helper.js

// Backend base URL (Render se environment variable ke through set hoga)
export const API_BASE = import.meta.env.VITE_API_URL;
export const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL;

export const getImageUrl = (path) => {
  // Agar path already full URL hai to use hi return karo
  if (path.startsWith("http")) {
    return path;
  }

  // Otherwise backend domain prepend karo
  const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL;
  return `${UPLOADS_BASE}${path}`;
};