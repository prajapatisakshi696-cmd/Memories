export const API_BASE = import.meta.env.VITE_API_URL;
export const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL;

export const getImageUrl = (path) => {
  if (!path) return null;

  // Cloudinary URL
  if (typeof path === "string" && path.startsWith("http")) {
    return path;
  }

  // Remove duplicate uploads
  const cleanPath = path.replace(/^\/uploads\//, "");

  return `${UPLOADS_BASE}/${cleanPath}`;
};