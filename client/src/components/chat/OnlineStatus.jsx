const OnlineStatus = ({ isOnline, size = "sm" }) => {
  const sizeClasses = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  if (!isOnline) return null;

  return (
    <span
      className={`absolute bottom-0 right-0 ${sizeClasses} bg-green-500 border-2 border-white rounded-full`}
      title="Active now"
    />
  );
};

export default OnlineStatus;