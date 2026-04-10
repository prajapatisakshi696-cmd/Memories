import React from "react";
import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className="px-6 text-gray-600 space-y-1 font-medium">

      {menuItemsData.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
            }`
          }
        >
          {Icon && <Icon className="w-5 h-5" />}
          {label}
        </NavLink>
      ))}

    </div>
  );
};

export default MenuItems;