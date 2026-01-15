import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Book, LogOut, LayoutDashboard, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600">
          <Book size={28} strokeWidth={2.5} />
          <span className="text-xl font-bold text-gray-800 tracking-tight">LibMaster</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link to="/admin" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors">
                  <LayoutDashboard size={18} /> Admin Panel
                </Link>
              ) : (
                <Link to="/" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors">
                  <User size={18} /> My Library
                </Link>
              )}
              {user.role === "ADMIN" && (
        <div className="flex gap-4">
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                  <Link to="/admin/books" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Inventory</Link>
                  <Link to="/admin/return" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Returns</Link>
                </div>
              )}

              <div className="h-6 w-1px bg-gray-200"></div>

              {/* User Info & Logout */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 hidden md:block">
                  {user.fullName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-medium"
                >
                  <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 shadow-md shadow-blue-100 transition-all">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;