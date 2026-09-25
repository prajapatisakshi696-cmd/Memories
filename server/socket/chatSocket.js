import jwt from "jsonwebtoken";
import { createMessage, markConversationSeen } from "../services/chatService.js";

let ioInstance = null;

// userId -> Set of socket ids (supports multiple tabs/devices per user)
const onlineUsers = new Map();

export const getIO = () => ioInstance;

export const isUserOnline = (userId) => {
  if (!userId) return false;
  return onlineUsers.has(userId.toString());
};

const addOnlineUser = (userId, socketId) => {
  const key = userId.toString();
  if (!onlineUsers.has(key)) onlineUsers.set(key, new Set());
  onlineUsers.get(key).add(socketId);
};

const removeOnlineUser = (userId, socketId) => {
  const key = userId.toString();
  if (!onlineUsers.has(key)) return;
  onlineUsers.get(key).delete(socketId);
  if (onlineUsers.get(key).size === 0) {
    onlineUsers.delete(key);
  }
};

export const initChatSocket = (io) => {
  ioInstance = io;

  // ⚠️ ADJUST to match your real JWT verification (secret name, payload shape)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error: no token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = (decoded.id || decoded._id || decoded.userId).toString();
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Join a personal room — lets us emit to this user across all their devices
    socket.join(`user:${userId}`);
    addOnlineUser(userId, socket.id);

    // Let everyone know this user is online
    io.emit("user_online", { userId });

        // --- Send message ---
    socket.on("send_message", async ({ receiverId, text }, callback) => {
      try {
        const isReceiverOnline = isUserOnline(receiverId);
        const { message, conversation } = await createMessage({
          senderId: userId,
          receiverId,
          text,
          isReceiverOnline,
        });

        // Send to receiver (all their devices)
        io.to(`user:${receiverId}`).emit("receive_message", message);
        io.to(`user:${receiverId}`).emit("conversation_updated");

        // Echo back to sender's other devices too
        io.to(`user:${userId}`).emit("receive_message", message);

        if (callback) {
          callback({ success: true, message, conversationId: conversation._id });
        }
      } catch (err) {
        if (callback) {
          callback({ success: false, error: err.message || "Failed to send" });
        }
      }
    });

    // --- Typing indicator ---
    socket.on("typing", ({ receiverId, conversationId }) => {
      io.to(`user:${receiverId}`).emit("typing", {
        conversationId,
        userId,
      });
    });

    socket.on("stop_typing", ({ receiverId, conversationId }) => {
      io.to(`user:${receiverId}`).emit("stop_typing", {
        conversationId,
        userId,
      });
    });

    // --- Mark seen ---
    socket.on("mark_seen", async ({ conversationId }, callback) => {
      try {
        const { otherParticipant } = await markConversationSeen({
          conversationId,
          userId,
        });

        if (otherParticipant) {
          io.to(`user:${otherParticipant}`).emit("messages_seen", {
            conversationId,
            seenBy: userId,
          });
        }

        if (callback) callback({ success: true });
      } catch (err) {
        if (callback) {
          callback({ success: false, error: err.message || "Failed to mark seen" });
        }
      }
    });

    // --- Disconnect ---
    socket.on("disconnect", () => {
      removeOnlineUser(userId, socket.id);
      if (!isUserOnline(userId)) {
        io.emit("user_offline", { userId });
      }
    });
  });
};

export const getOnlineUserIds = () => Array.from(onlineUsers.keys());