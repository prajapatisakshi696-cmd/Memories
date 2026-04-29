import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "dmz77cewd",
  api_key: "511781594322583",
  api_secret: "n1fLIiPjVdeBkVsJyUWYZM1paWk"
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "memories_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export default cloudinary;