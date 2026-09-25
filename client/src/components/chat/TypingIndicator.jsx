const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3 w-fit bg-gray-100 rounded-3xl rounded-bl-md">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
};

export default TypingIndicator;