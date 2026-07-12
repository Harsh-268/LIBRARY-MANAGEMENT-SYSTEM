import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios'; // Make sure this path points to your axios instance

const Header = () => {
  // Pull our authentication state directly from Context
  const {user,setUser} = useContext(AuthContext);
  const navigate = useNavigate();
   

  const handleLogout = async () => {
    try {
      // 1. Tell the backend to destroy the HttpOnly cookie
      await api.post('/users/logout');
      
      // 2. Clear our React state
      setUser(null)
      
      // 3. Kick the user back to the login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // A helper function to cleanly style our NavLinks based on if they are currently active
  const navLinkClass = ({ isActive }) =>
    isActive 
      ? "text-blue-600 font-semibold" 
      : "text-gray-600 hover:text-blue-600 transition-colors duration-200";
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO --- */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Book<span className="text-blue-600">Store</span>
            </Link>
          </div>

          {/* --- NAVIGATION LINKS --- */}
          <nav className="flex items-center space-x-6">
            
            {/* Public Link (Everyone sees this) */}
            <NavLink to="/get-books" className={navLinkClass}>
              Browse Library
            </NavLink>

            {/* If Logged In: Show User Features */}
            {user ? (
              <>
                <NavLink to="/my-books" className={navLinkClass}>
                  My Books
                </NavLink>
                
                <NavLink to="/profile" className={navLinkClass}>
                  Profile & Settings
                </NavLink>
                
                {/* Visual Divider */}
                <div className="border-l border-gray-300 h-6 mx-2 hidden sm:block"></div>

                {/* User Greeting (Safely grabs the first name) */}
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
              /* If NOT Logged In: Show Auth Buttons */
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;