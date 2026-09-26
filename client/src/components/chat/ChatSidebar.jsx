import { useState, useMemo, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { API_BASE, getImageUrl } from "../../helper";
import ConversationItem from "./ConversationItem";
import UserAvatar from "../UserAvatar";

const ChatSidebar = ({
  conversations,
  activeConversationId,
  currentUserId,
  onSelect,
  onStartNewChat,
  loading,
}) => {
  const { isUserOnline } = useSocket();
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState([]);
  const [followingLoading, setFollowingLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/users/${currentUserId}/following`)
      .then((res) => res.json())
      .then(setFollowing)
      .catch((err) => console.error(err))
      .finally(() => setFollowingLoading(false));
  }, [currentUserId]);

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => {
      const name = (c.user.full_name || "").toLowerCase();
      const username = (c.user.username || "").toLowerCase();
      return name.includes(q) || username.includes(q);
    });
  }, [conversations, search]);

  // People you follow that you don't already have a conversation with
  const conversationUserIds = new Set(conversations.map((c) => c.user._id));
  const newChatCandidates = following.filter((u) => !conversationUserIds.has(u._id));

  const filteredCandidates = useMemo(() => {
    if (!search.trim()) return newChatCandidates;
    const q = search.toLowerCase();
    return newChatCandidates.filter((u) => {
      const name = (u.full_name || "").toLowerCase();
      const username = (u.username || "").toLowerCase();
      return name.includes(q) || username.includes(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChatCandidates, search]);

  const hasConversations = conversations.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <h2 className="text-2xl font-bold mb-3">Messages</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Start a new chat — people you follow without an existing conversation */}
        {!followingLoading && filteredCandidates.length > 0 && (
          <div className="mb-2">
            <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {hasConversations ? "Start a chat" : "Message someone you follow"}
            </p>

            {hasConversations ? (
              // Compact horizontal row when conversations already exist
              <div className="flex gap-4 overflow-x-auto px-4 pb-3">
                {filteredCandidates.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => onStartNewChat(user)}
                    className="flex flex-col items-center gap-1 shrink-0 w-16"
                  >
                    <div className="relative">
                      <UserAvatar user={user} size={56} />
                      {isUserOnline(user._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <span className="text-xs text-gray-600 truncate w-full text-center">
                      {user.username}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              // Full vertical list when there are no conversations at all yet
              filteredCandidates.map((user) => (
                <button
                  key={user._id}
                  onClick={() => onStartNewChat(user)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left"
                >
                  <div className="relative shrink-0">
                    <UserAvatar user={user} size={56} />
                    {isUserOnline(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[15px] truncate">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Existing conversations */}
        {hasConversations && (
          <>
            {filteredConversations.length > 0 && (
              <p className="px-4 pb-1 pt-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Messages
              </p>
            )}
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              search && (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">No matches found</div>
              )
            ) : (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv._id}
                  conversation={conv}
                  isActive={conv._id === activeConversationId}
                  isOnline={isUserOnline(conv.user._id)}
                  currentUserId={currentUserId}
                  onClick={() => onSelect(conv)}
                />
              ))
            )}
          </>
        )}

        {!hasConversations && !followingLoading && filteredCandidates.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            You're not following anyone yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;