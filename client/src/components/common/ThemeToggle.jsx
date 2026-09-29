import { useTheme } from '../../context/ThemeContext.jsx';

const IconSun = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const IconMoon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-blue-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeToggle;