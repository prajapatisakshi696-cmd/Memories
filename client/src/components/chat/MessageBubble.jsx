import { format } from "date-fns";
import { CheckCheck } from "lucide-react";

const MessageBubble = ({ message, isOwn, showMeta }) => {
  const time = message.createdAt
    ? format(new Date(message.createdAt), "h:mm a")
    : "";

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} mb-1`}>
      <div
        className={`max-w-[78%] md:max-w-[60%] px-4 py-2.5 rounded-3xl break-words text-[15px] leading-snug ${
          isOwn
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>

      {showMeta && (
        <div
          className={`flex items-center gap-1 mt-1 px-1 text-[11px] text-gray-400 ${
            isOwn ? "flex-row-reverse" : ""
          }`}
        >
          <span>{time}</span>
          {isOwn && (
            <CheckCheck
              size={12}
              className={message.seen ? "text-indigo-400" : "text-gray-300"}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;