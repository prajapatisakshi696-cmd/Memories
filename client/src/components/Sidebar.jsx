import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "../components/MenuItems";
import { CirclePlus, LogOut, X } from "lucide-react";
import Avatar from "react-avatar";
import { getImageUrl } from "../helper";
import { useAuth } from "../AuthContext";

const Sidebar = ({ sidebarOpen: isOpen, setSidebarOpen, onLogout }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div
      className={`w-64 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0
      fixed sm:static top-0 bottom-0 left-0 z-20 h-screen
      ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      transition-transform duration-300 ease-in-out`}
    >
      {/* TOP SECTION */}
      <div className="w-full">
        <div className="flex items-center justify-between m-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigate("/feed")}
          >
            <img src="/favicon.svg" className="w-8 h-8" alt="Memories" />
            <span className="text-lg font-semibold">Memories</span>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="sm:hidden p-1 text-gray-400 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <hr className="border-gray-300 mb-6" />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 
          py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
          hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* BOTTOM SECTION (USER INFO + LOGOUT) */}
      <div className="w-full border-t border-gray-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
            {currentUser?.profile_picture ? (
              <img
                src={getImageUrl(currentUser.profile_picture)}
                alt={currentUser?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar
                name={currentUser?.full_name || currentUser?.username || "currentUser"}
                size="40"
                round={true}
              />
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-medium truncate">
              {currentUser?.full_name || currentUser?.username || "User"}
            </h1>
            <p className="text-xs text-gray-500 truncate">
              @{currentUser?.username || "username"}
            </p>
          </div>
        </div>

        <LogOut
          onClick={onLogout}
          className="w-5 h-5 text-gray-400 hover:text-gray-700 transition cursor-pointer shrink-0"
        />
      </div>
    </div>
  );
};

export default Sidebar;