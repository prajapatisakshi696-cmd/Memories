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
      className={`w-64 xl:w-72 bg-white border-r border-slate-100 flex flex-col shrink-0
      fixed sm:static top-0 bottom-0 left-0 z-20 h-screen shadow-xl sm:shadow-none
      ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      transition-transform duration-300 ease-in-out`}
    >
      {/* TOP SECTION */}
      <div className="w-full shrink-0">
        <div className="flex items-center justify-between px-5 py-5">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavigate("/feed")}
          >
            <img
              src="/favicon.svg"
              className="w-8 h-8 group-hover:scale-105 transition-transform"
              alt="Memories"
            />
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Memories
            </span>
          </div>
 
          <button
            onClick={() => setSidebarOpen(false)}
            className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
 
        {/* Active state + unread Messages badge live in MenuItems */}
        <MenuItems setSidebarOpen={setSidebarOpen} />
 
        <Link
          to="/create-post"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 py-3 mt-5 mx-4 rounded-xl
          bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-medium
          shadow-md shadow-indigo-200/70 hover:shadow-lg hover:shadow-indigo-300/70
          hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>
 
      {/* MIDDLE: soft lavender clouds + script text (fills the empty space) */}
      <div
        aria-hidden="true"
        className="relative flex-1 min-h-0 overflow-hidden pointer-events-none select-none
        bg-gradient-to-b from-white via-indigo-50/40 to-indigo-100/60"
      >
        <p
          className="absolute left-7 bottom-16 text-[28px] leading-[1.15] text-indigo-300"
          style={{ fontFamily: "'Dancing Script','Brush Script MT',cursive" }}
        >
          Good ♡
          <br />
          &nbsp;&nbsp;Vibes
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;Only
        </p>
 
        <svg
          viewBox="0 0 288 140"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 inset-x-0 w-full text-indigo-200"
        >
          <path
            d="M0 140V80c20-25 50-30 72-12c18-22 55-28 80-6c22-14 52-8 66 12c26-10 50 4 70 20V140H0Z"
            fill="currentColor"
            opacity=".45"
          />
          <path
            d="M0 140V105c24-14 46-8 60 6c20-18 52-16 68 2c24-12 54-6 70 10c26-6 60 4 90 22V140H0Z"
            fill="currentColor"
            opacity=".6"
          />
        </svg>
      </div>
 
      {/* BOTTOM SECTION (USER INFO + LOGOUT) */}
      <div className="w-full border-t border-slate-100 p-4 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-100 shadow-sm">
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
            <h1 className="text-sm font-semibold truncate text-slate-800">
              {currentUser?.full_name || currentUser?.username || "User"}
            </h1>
            <p className="text-xs text-slate-500 truncate">
              @{currentUser?.username || "username"}
            </p>
          </div>
        </div>
 
        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
 
export default Sidebar;