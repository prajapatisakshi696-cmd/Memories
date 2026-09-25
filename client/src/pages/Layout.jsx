import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { useAuth } from '../AuthContext';

const Layout = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  return user ? (
    <div className="w-full h-screen flex overflow-hidden bg-slate-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
        user={currentUser}
      />

      {/* Backdrop overlay — mobile only, closes sidebar on tap outside */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-10 sm:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Mobile top bar */}
        <div className="sm:hidden flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-200 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 text-gray-600"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" className="w-6 h-6" alt="Memories" />
            <span className="font-semibold">Memories</span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;