import { useState, useRef, useEffect } from "react";
import { Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const TYPING_TIMEOUT = 2000; // ms of inactivity before we send "stop_typing"

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);
  const pickerRef = useRef(null);

  // Close emoji picker when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);

    // Fire "typing" immediately, debounce "stop_typing"
    onTyping?.();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
    }, TYPING_TIMEOUT);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");
    setShowEmojiPicker(false);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onStopTyping?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="relative border-t border-gray-100 bg-white px-3 py-3 md:px-4">
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-full right-3 mb-2 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
        </div>
      )}

      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1.5">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
          aria-label="Add emoji"
        >
          <Smile size={22} />
        </button>

        <input
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          className="flex-1 bg-transparent outline-none text-[15px] py-1.5 min-w-0"
        />

                <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className={`p-2.5 rounded-full shrink-0 transition-all ${
            text.trim()
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;