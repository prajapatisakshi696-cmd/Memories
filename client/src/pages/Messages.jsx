import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Eye } from "lucide-react";

const Messages = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Talk to your friends and family</p>
        </div>
        {/* connected users */}
        <div className="flex flex-col gap-3">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="w-full max-w-fit flex items-center gap-4 p-3 bg-white shadow rounded-md"
            >
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="rounded-full w-10 h-10"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">
                  {user.full_name}
                </p>
                <p className="text-slate-600 text-xs">@{user.username}</p>
                <p className="text-slate-500 text-xs truncate">{user.bio}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
