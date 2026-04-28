export const API_BASE = import.meta.env.VITE_API_URL;
export const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL;

export const getImageUrl = (path) => {
  if (!path) return null;
  // remove leading slash and "uploads/"
  const cleanPath = path.replace(/^\/?uploads\//, "");
  return `${UPLOADS_BASE}/${cleanPath}`;
};
