import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import ChatMessage from "../models/ChatMessage.js";
import { canUsersChat } from "../utils/canChat.js";

export const createMessage = async ({ senderId, receiverId, text, isReceiverOnline }) => {
  if (!receiverId || !text || !text.trim()) {
    throw { status: 400, message: "receiverId and text are required" };
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw { status: 400, message: "Invalid receiverId" };
  }

  if (senderId.toString() === receiverId.toString()) {
    throw { status: 400, message: "Cannot message yourself" };
  }

  const allowed = await canUsersChat(senderId, receiverId);
  if (!allowed) {
    throw {
      status: 403,
      message: "You can only message users you follow or who follow you",
    };
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      lastMessage: text.trim(),
      lastMessageTime: new Date(),
      lastMessageSender: senderId,
      unreadCount: { [receiverId]: 1, [senderId]: 0 },
    });
  } else {
    conversation.lastMessage = text.trim();
    conversation.lastMessageTime = new Date();
    conversation.lastMessageSender = senderId;

    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    conversation.unreadCount.set(senderId.toString(), 0);

    await conversation.save();
  }

  const message = await ChatMessage.create({
    conversation: conversation._id,
    sender: senderId,
    receiver: receiverId,
    text: text.trim(),
    delivered: !!isReceiverOnline,
    seen: false,
  });

  const populatedMessage = await message.populate(
    "sender receiver",
    "username profile_picture"
  );

  return { message: populatedMessage, conversation };
};

export const markConversationSeen = async ({ conversationId, userId }) => {
  if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
    throw { status: 400, message: "Invalid conversationId" };
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw { status: 404, message: "Conversation not found" };
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === userId.toString()
  );
  if (!isParticipant) {
    throw { status: 403, message: "Access denied" };
  }

  await ChatMessage.updateMany(
    { conversation: conversationId, receiver: userId, seen: false },
    { $set: { seen: true, seenAt: new Date(), delivered: true } }
  );

  conversation.unreadCount.set(userId.toString(), 0);
  await conversation.save();

  // return the other participant so caller can notify them
  const otherParticipant = conversation.participants.find(
    (p) => p.toString() !== userId.toString()
  );

  return { conversation, otherParticipant };
};