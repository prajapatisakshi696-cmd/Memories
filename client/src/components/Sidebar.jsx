import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "../components/MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import Avatar from "react-avatar"; 

const Sidebar = ({ sidebarOpen: isOpen, setSidebarOpen, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between
      max-sm:absolute top-0 bottom-0 z-20
      ${isOpen ? "translate-x-0" : "max-sm:-translate-x-full"}
      transition-all duration-300 ease-in-out`}
    >
      {/* TOP SECTION */}
      <div className="w-full">
        <div className="flex items-center gap-2 m-4 cursor-pointer" onClick={() => navigate("/feed")}>
          <img src="/favicon.svg" className="w-8 h-8" alt="Memories" />
          <span className="text-lg font-semibold">Memories</span>
        </div>

        <hr className="border-gray-300 mb-6" />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 
          py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600
          hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* BOTTOM SECTION (USER INFO + LOGOUT) */}
      <div className="w-full border-t border-gray-200 p-4 flex items-center justify-between">
        
        {/* User Info */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user?.profile_picture ? (
              <img
                src={`http://localhost:5000${user.profile_picture}`}
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar
                name={user?.full_name || user?.username || "User"}
                size="40"
                round={true}
              />
            )}
          </div>

          {/* Name */}
          <div>
            <h1 className="text-sm font-medium">
              {user?.full_name || user?.username || "User"}
            </h1>
            <p className="text-xs text-gray-500">
              @{user?.username || "username"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <LogOut
          onClick={onLogout}
          className="w-5 h-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;