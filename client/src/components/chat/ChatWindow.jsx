import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { getImageUrl } from "../../helper";
import { fetchMessages, markSeenApi } from "../../api/chatApi";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import OnlineStatus from "./OnlineStatus";
import UserAvatar from "../UserAvatar";

const ChatWindow = ({ currentUser, conversation, onBack, onConversationUpdate, onConversationCreated }) => {
  const { socket, isUserOnline } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [convId, setConvId] = useState(conversation._id || null);
  const bottomRef = useRef(null);

  const otherUser = conversation.user;

  // Reset local state when switching to a different conversation/user
  useEffect(() => {
    setConvId(conversation._id || null);
    setMessages([]);
  }, [conversation._id, otherUser._id]);

  // Load message history (only if a real conversation exists)
  useEffect(() => {
    if (!convId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchMessages(convId)
      .then((data) => setMessages(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [convId]);

  // Mark as seen when opening an existing conversation
  useEffect(() => {
    if (!convId) return;
    markSeenApi(convId).catch((err) => console.error(err));
    if (socket) {
      socket.emit("mark_seen", { conversationId: convId });
    }
  }, [convId, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      // Match either an existing conversation, or the very first message
      // that creates a brand-new conversation with this same user
      const belongsHere =
        (convId && message.conversation === convId) ||
        (!convId && message.sender._id === otherUser._id) ||
        (!convId && message.receiver._id === otherUser._id);

      if (!belongsHere) return;

      setMessages((prev) => [...prev, message]);

      if (!convId) {
        setConvId(message.conversation);
        onConversationCreated?.(message.conversation);
      }

      if (message.sender._id === otherUser._id) {
        markSeenApi(message.conversation).catch(() => {});
        socket.emit("mark_seen", { conversationId: message.conversation });
      }
    };

    const handleTyping = ({ conversationId: cid, userId }) => {
      if (userId === otherUser._id && (cid === convId || !convId)) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId: cid, userId }) => {
      if (userId === otherUser._id && (cid === convId || !convId)) {
        setIsTyping(false);
      }
    };

    const handleSeen = ({ conversationId: cid }) => {
      if (cid === convId) {
        setMessages((prev) =>
          prev.map((m) => ({ ...m, seen: true, delivered: true }))
        );
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("messages_seen", handleSeen);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("messages_seen", handleSeen);
    };
  }, [socket, convId, otherUser._id, onConversationCreated]);

  const handleSend = useCallback(
    (text) => {
      if (!socket) return;

      socket.emit(
        "send_message",
        { receiverId: otherUser._id, text },
        (response) => {
          if (!response?.success) {
            console.error(response?.error || "Failed to send message");
            return;
          }
          if (!convId && response.conversationId) {
            setConvId(response.conversationId);
            onConversationCreated?.(response.conversationId);
          }
        }
      );

      onConversationUpdate?.();
    },
    [socket, otherUser._id, convId, onConversationUpdate, onConversationCreated]
  );

  const handleTypingStart = () => {
    socket?.emit("typing", { receiverId: otherUser._id, conversationId: convId });
  };

  const handleTypingStop = () => {
    socket?.emit("stop_typing", { receiverId: otherUser._id, conversationId: convId });
  };

  const messagesWithMeta = messages.map((msg, idx) => {
    const isLast = idx === messages.length - 1;
    const nextMsg = messages[idx + 1];
    const sameSenderNext = nextMsg && nextMsg.sender._id === msg.sender._id;
    return { ...msg, showMeta: isLast || !sameSenderNext };
  });

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0 bg-white">
        <button
          onClick={onBack}
          className="md:hidden p-1 -ml-1 text-gray-600"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="relative shrink-0">
<UserAvatar user={otherUser} size={40} className="ring-2 ring-indigo-100" />
          <OnlineStatus isOnline={isUserOnline(otherUser._id)} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-[15px] truncate">
            {otherUser.full_name || otherUser.username}
          </h2>
          <p className="text-xs">
            {isUserOnline(otherUser._id) ? (
              <span className="text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online
              </span>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Say hi to {otherUser.full_name || otherUser.username} 👋
          </div>
        ) : (
          <>
            {messagesWithMeta.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={msg.sender._id === currentUser._id}
                showMeta={msg.showMeta}
              />
            ))}
          </>
        )}

        {isTyping && (
          <div className="mt-1">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        onTyping={handleTypingStart}
        onStopTyping={handleTypingStop}
      />
    </div>
  );
};

export default ChatWindow;