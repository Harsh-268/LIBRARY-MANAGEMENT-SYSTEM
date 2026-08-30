import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/get-books?q=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600 transition-colors duration-200";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">

          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Book<span className="text-blue-600">Store</span>
            </Link>
          </div>

          {/* --- SEARCH BAR --- */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <nav className="flex items-center space-x-6">
            <NavLink to="/get-books" className={navLinkClass}>
              Browse Library
            </NavLink>

            {user ? (
              <>
                <NavLink to="/my-books" className={navLinkClass}>My Books</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile & Settings</NavLink>
                <div className="border-l border-gray-300 h-6 mx-2 hidden sm:block"></div>
                <span className="text-sm text-gray-500 hidden sm:block font-medium">
                  Hi, {user?.fullName || 'Reader'}!
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile search bar, shown below the main row on small screens */}
        <form onSubmit={handleSearch} className="sm:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-full"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;