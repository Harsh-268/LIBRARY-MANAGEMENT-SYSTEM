import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios';
import ThemeToggle from '../common/ThemeToggle.jsx';

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape to close + lock page scroll while the drawer is open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // One source of truth for links, so no duplicated admin/student blocks
  const links = [
    { to: '/get-books', label: 'Browse' },
    ...(user?.role === 'ADMIN'
      ? [{ to: '/admin/overview', label: 'Admin' }]
      : user
      ? [{ to: '/my-books', label: 'My Books' }]
      : []),
    ...(user ? [{ to: '/profile', label: 'Profile' }] : []),
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/get-books?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
      setMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive
        ? 'text-gray-900 dark:text-white font-medium'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`;

  const iconBtn =
    'p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';

  const searchForm = (extra = '', autoFocus = false) => (
    <form onSubmit={handleSearch} className={`relative ${extra}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search books"
        className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none"
      />
    </form>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            Book<span className="text-blue-600 dark:text-blue-400">Store</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 ml-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop search */}
          {searchForm('hidden md:block ml-auto w-64')}

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <button
              className={`${iconBtn} md:hidden`}
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

          

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <button onClick={handleLogout} className={iconBtn} aria-label="Log out" title="Log out">
                  <LogOut size={18} />
                </button>
              ) : (
                <>
                  <Link to="/login" className={linkClass({ isActive: false })}>
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className={`${iconBtn} md:hidden`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Mobile search row */}
        {searchOpen && <div className="md:hidden px-4 pb-3">{searchForm('', true)}</div>}
      </header>

      {/* Backdrop (sibling of <header> so backdrop-blur doesn't clip fixed children) */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`md:hidden fixed inset-0 z-[55] bg-black/40 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-in drawer from the right */}
      <aside
        inert={!menuOpen}
        aria-label="Menu"
        className={`md:hidden fixed inset-y-0 right-0 z-[60] w-72 max-w-[80%] flex flex-col bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 shadow-xl transition-transform duration-300 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Menu</span>
          <button className={iconBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={(s) => `${linkClass(s)} block px-3 py-3.5 rounded-md`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut size={16} /> Log out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/register"
                className="text-center py-2 rounded-md text-sm font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="text-center py-2 rounded-md text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Header;