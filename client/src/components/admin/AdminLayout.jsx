import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // close the drawer after navigating
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen lg:flex bg-gray-50 dark:bg-gray-950">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-1.5 -ml-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-gray-900 dark:text-gray-100">Admin</span>
      </div>

      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;