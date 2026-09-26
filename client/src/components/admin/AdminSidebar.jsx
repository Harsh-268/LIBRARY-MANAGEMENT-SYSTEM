import React, { useContext } from 'react';
import { NavLink, useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios.js';

// Small inline icons so we don't pull in an icon library just for this
const IconHome = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
const IconBook = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
  </svg>
);
const IconHistory = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 3-6.7M3 12V6m0 6h6M12 8v4l3 2" />
  </svg>
);
const IconStack = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 9 4.5-9 4.5-9-4.5L12 3Zm-9 9 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.5 8v-1.5a3.5 3.5 0 0 0-2.3-3.29M14.5 5.1a3 3 0 0 1 0 5.8" />
  </svg>
);
const IconExternal = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6v6M10 14 20 4" />
  </svg>
);

const NAV_ITEMS = [
  { to: '/admin/overview', label: 'Overview', icon: IconHome },
  { to: '/admin/issues', label: 'Active Issues', icon: IconBook },
  { to: '/admin/transactions', label: 'Transactions', icon: IconHistory },
  { to: '/admin/books', label: 'Book Stock', icon: IconStack },
  { to: '/admin/users', label: 'Manage Users', icon: IconUsers },
  { to: '/', label: 'Go to Site', icon: IconExternal },
];

const AdminSidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const initials = (user?.fullName || 'Admin')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col h-screen sticky top-0">
      {/* Admin identity */}
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <span className="inline-block mt-3 text-[11px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">  
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m6 14 5-5-5-5m5 5H9" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;