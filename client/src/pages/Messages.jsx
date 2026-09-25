import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { useSocket } from "../context/SocketContext";
import { fetchConversations } from "../api/chatApi";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

const Messages = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);

  const loadConversations = useCallback(() => {
    fetchConversations()
      .then(setConversations)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!currentUser?._id) return;
    loadConversations();
  }, [currentUser, loadConversations]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => loadConversations();

    socket.on("receive_message", refresh);
    socket.on("conversation_updated", refresh);
    socket.on("messages_seen", refresh);

    return () => {
      socket.off("receive_message", refresh);
      socket.off("conversation_updated", refresh);
      socket.off("messages_seen", refresh);
    };
  }, [socket, loadConversations]);

  useEffect(() => {
    if (!activeConversation?._id) return;
    const updated = conversations.find((c) => c._id === activeConversation._id);
    if (updated) setActiveConversation(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  const handleSelect = (conv) => {
    setActiveConversation(conv);
  };

  const handleBack = () => {
    setActiveConversation(null);
  };

  const handleStartNewChat = (user) => {
    const existing = conversations.find((c) => c.user._id === user._id);
    if (existing) {
      setActiveConversation(existing);
      return;
    }

    setActiveConversation({
      _id: null,
      user,
      lastMessage: "",
      lastMessageTime: null,
      unreadCount: 0,
    });
  };

  const handleConversationCreated = (newConversationId) => {
    setActiveConversation((prev) => (prev ? { ...prev, _id: newConversationId } : prev));
    loadConversations();
  };

  return (
<div className="h-full w-full bg-white md:rounded-2xl md:shadow md:m-4 md:h-[calc(100%-2rem)] overflow-hidden overflow-x-hidden">      <div className="flex h-full">
        <div
          className={`w-full md:w-[360px] border-r border-gray-100 shrink-0 ${
            activeConversation ? "hidden md:block" : "block"
          }`}
        >
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversation?._id}
            currentUserId={currentUser._id}
            onSelect={handleSelect}
            onStartNewChat={handleStartNewChat}
            loading={loading}
          />
        </div>

        <div className={`flex-1 ${!activeConversation ? "hidden md:flex" : "flex"}`}>
          {activeConversation ? (
            <ChatWindow
              currentUser={currentUser}
              conversation={activeConversation}
              onBack={handleBack}
              onConversationUpdate={loadConversations}
              onConversationCreated={handleConversationCreated}
            />
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;