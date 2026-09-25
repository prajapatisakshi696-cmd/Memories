import express from "express";
import {
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage);

router.get("/:sender/:receiver", getMessages);

export default router;