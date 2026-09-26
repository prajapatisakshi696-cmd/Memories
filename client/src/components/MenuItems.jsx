import React from "react";
import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";
import { useUnreadCount } from "../hooks/useUnreadCount";

const MenuItems = ({ setSidebarOpen }) => {
  const unreadCount = useUnreadCount();

  return (
    <div className="px-4 text-gray-600 space-y-1 font-medium">
{menuItemsData.map(({ to, label, Icon }) => {    
      const isMessages = label.toLowerCase() === "messages";

        return (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-semibold"
                  : "hover:bg-gray-50 text-gray-600"
              }`
            }
          >
{Icon && <Icon className="w-5 h-5 shrink-0" />}            
<span className="flex-1">{label}</span>

            {isMessages && unreadCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-semibold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

export default MenuItems;