import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import ChatMessage from "../models/ChatMessage.js";
import { createMessage, markConversationSeen } from "../services/chatService.js";
import { getIO, isUserOnline } from "../socket/chatSocket.js";

// GET /api/chat/conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "username profile_picture")
      .sort({ lastMessageTime: -1 });

    const formatted = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );

      return {
        _id: conv._id,
        user: otherUser,
        isOnline: otherUser ? isUserOnline(otherUser._id.toString()) : false,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        lastMessageSender: conv.lastMessageSender,
        unreadCount: conv.unreadCount.get(userId.toString()) || 0,
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/messages/:conversationId
export const getMessagesByConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation id" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await ChatMessage.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "username profile_picture")
      .populate("receiver", "username profile_picture");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/send  (REST fallback — primary real-time path is the socket event)
export const sendChatMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, text } = req.body;

    const isReceiverOnline = isUserOnline(receiverId);
    const { message, conversation } = await createMessage({
      senderId,
      receiverId,
      text,
      isReceiverOnline,
    });

    // Notify receiver in real time even if they sent this via REST
    const io = getIO();
    if (io) {
      io.to(`user:${receiverId}`).emit("receive_message", message);
      io.to(`user:${receiverId}`).emit("conversation_updated");
    }

    res.status(201).json({ message, conversationId: conversation._id });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// PUT /api/chat/seen
export const markAsSeen = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.body;

    const { otherParticipant } = await markConversationSeen({
      conversationId,
      userId,
    });

    const io = getIO();
    if (io && otherParticipant) {
      io.to(`user:${otherParticipant}`).emit("messages_seen", {
        conversationId,
        seenBy: userId,
      });
    }

    res.json({ message: "Marked as seen" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};