import React from "react";

const Loading = ({ height = "100vh", message }) => {
  return (
    <div
      style={{ height }}
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-label="Loading"
    >
      <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
};

export default Loading;