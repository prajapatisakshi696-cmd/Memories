import { formatDistanceToNowStrict } from "date-fns";
import { getImageUrl } from "../../helper";
import OnlineStatus from "./OnlineStatus";

const ConversationItem = ({ conversation, isActive, isOnline, currentUserId, onClick }) => {
  const { user, lastMessage, lastMessageTime, lastMessageSender, unreadCount } = conversation;

  const isOwnLastMessage = lastMessageSender === currentUserId;
  const timeLabel = lastMessageTime
    ? formatDistanceToNowStrict(new Date(lastMessageTime), { addSuffix: false })
    : "";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        isActive ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={user.profile_picture ? getImageUrl(user.profile_picture) : "/avatar.png"}
          alt={user.username}
          className="w-14 h-14 rounded-full object-cover"
        />
        <OnlineStatus isOnline={isOnline} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`truncate text-[15px] ${unreadCount > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-800"}`}>
            {user.full_name || user.username}
          </h3>
          {timeLabel && (
            <span className="text-xs text-gray-400 shrink-0">{timeLabel}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`truncate text-sm ${
              unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-400"
            }`}
          >
            {isOwnLastMessage && lastMessage ? "You: " : ""}
            {lastMessage || "Say hi 👋"}
          </p>

          {unreadCount > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[11px] font-semibold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;