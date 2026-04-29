// Base URLs from environment variables
export const API_BASE = import.meta.env.VITE_API_URL;
export const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL;

/**
 * Clean and return full image URL
 * @param {string} path - Image path stored in DB (e.g. "/uploads/filename.png")
 * @returns {string|null} - Full URL to access image
 */
export const getImageUrl = (path) => {
  if (!path) return null;

  // Remove leading slash and "uploads/"
  const cleanPath = path.replace(/^\/?uploads\//, "");

  return `${UPLOADS_BASE}/${cleanPath}`;
};
