import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { useSocket } from "../context/SocketContext";
import { fetchConversations } from "../api/chatApi";

export const useUnreadCount = () => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(() => {
    if (!currentUser?._id) return;
    fetchConversations()
      .then((data) => {
        const total = data.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setUnreadCount(total);
      })
      .catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();

    socket.on("receive_message", refresh);
    socket.on("messages_seen", refresh);
    socket.on("conversation_updated", refresh);

    return () => {
      socket.off("receive_message", refresh);
      socket.off("messages_seen", refresh);
      socket.off("conversation_updated", refresh);
    };
  }, [socket, load]);

  return unreadCount;
};