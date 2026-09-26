import express from "express";
import multer from "multer";
import { storage } from "../configs/cloudinary.js";
import { verifyToken } from "../middleware/auth.js";
import {
  getStories,
  createStory,
  deleteStory,
} from "../controllers/storyController.js";

const router = express.Router();
const upload = multer({ storage });

router.get("/", verifyToken, getStories);
router.post("/", verifyToken, upload.single("media"), createStory);
router.delete("/:id", verifyToken, deleteStory);

export default router;