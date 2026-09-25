import express from "express";
import {
  getConversations,
  getMessagesByConversation,
  sendChatMessage,
  markAsSeen,
} from "../controllers/chatController.js";
import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router();

router.get("/conversations", verifyToken, getConversations);
router.get("/messages/:conversationId", verifyToken, getMessagesByConversation);
router.post("/send", verifyToken, sendChatMessage);
router.put("/seen", verifyToken, markAsSeen);

export default router;